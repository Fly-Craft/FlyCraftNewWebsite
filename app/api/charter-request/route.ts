import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { renderCharterRequestPdf } from "@/lib/pdf/render-charter-request-pdf";
import type { LegPayload } from "@/lib/charter-request";
import { sendMail, sendConfirmation, charterDeskRecipients } from "@/lib/notify";


export async function POST(request: Request) {
  const body = await request.json();
  const { tripType, legs, name, email, phone } = body ?? {};

  const legsValid =
    Array.isArray(legs) &&
    legs.length > 0 &&
    legs.every((l: LegPayload) => l?.from && l?.to && l?.date && l?.time);

  if (!legsValid || !name || (!email && !phone)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const legLines = (legs as LegPayload[]).flatMap((l, i) => [
    `Leg ${i + 1}:     ${l.from} → ${l.to}`,
    `  Departs:  ${l.date} at ${l.time} (local)`,
    `  Distance: ${l.distanceNm} NM · ${l.flightTime} @ ${l.speedKts} kts`,
    `  Arrives:  ${l.arrivalLocal} (destination local)`,
    ...(l.passengers !== undefined ? [`  Passengers: ${l.passengers}`] : []),
    ...(l.requests !== undefined ? [`  Requests: ${l.requests}`] : []),
  ]);

  const lines = [
    `New charter request`,
    ``,
    `Trip type:  ${tripType ?? "—"}`,
    ...legLines,
    ``,
    `${typeof body.passengers === "number" ? "Adults" : "Passengers"}:  ${body.passengers ?? "—"}`,
    ...(typeof body.under18 === "number" && body.under18 > 0
      ? [`Under 18:   ${body.under18}`]
      : []),
    ...(typeof body.under2 === "number" && body.under2 > 0
      ? [`Under 2:    ${body.under2}`]
      : []),
    `Options:    ${Array.isArray(body.options) && body.options.length ? body.options.join(", ") : "None"}`,
    ...(typeof body.pets === "number" ? [`Pets:       ${body.pets}`] : []),
    ...(body.slidingHours
      ? [`Sliding:    up to ${body.slidingHours} h after requested departure time`]
      : []),
    ...(Array.isArray(body.catering) && body.catering.length
      ? [`Catering:   ${body.catering.join(", ")}`]
      : []),
    ...(body.allergyDetails?.trim()
      ? [`Allergies:  ${body.allergyDetails.trim()}`]
      : []),
    `Notes:      ${body.notes?.trim() ? body.notes.trim() : "—"}`,
    ``,
    `Client type: ${body.clientType || "Individual"}`,
    ...(body.brokerage?.trim() ? [`Brokerage:   ${body.brokerage.trim()}`] : []),
    `Name:  ${name}`,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
  ];
  const text = lines.join("\n");

  const requestId = `CR-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const pdfBuffer = await renderCharterRequestPdf(
    {
      tripType: tripType ?? "—",
      legs: legs as LegPayload[],
      passengers: body.passengers ?? "—",
      under18: typeof body.under18 === "number" ? body.under18 : 0,
      under2: typeof body.under2 === "number" ? body.under2 : 0,
      options: Array.isArray(body.options) ? body.options : [],
      pets: typeof body.pets === "number" ? body.pets : null,
      slidingHours: body.slidingHours ?? null,
      catering: Array.isArray(body.catering) ? body.catering : [],
      allergyDetails: body.allergyDetails ?? "",
      notes: body.notes ?? "",
      clientType: body.clientType ?? "Individual",
      brokerage: body.brokerage ?? "",
      name,
      email,
      phone,
    },
    requestId,
    generatedAt
  );
  const pdfFilename = `Charter-Request-${requestId}.pdf`;

  const attachments = [
    { filename: pdfFilename, content: pdfBuffer.toString("base64") },
  ];

  // The lead itself. A failure here fails the request.
  const notify = await sendMail({
    to: charterDeskRecipients(),
    subject: `Charter request — ${name}`,
    text,
    attachments,
    ...(typeof email === "string" && email.trim() ? { replyTo: email.trim() } : {}),
  });
  if (!notify.ok && !notify.skipped) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
  if (notify.skipped) {
    // TODO: set POSTMARK_SERVER_TOKEN (and CHARTER_FROM_EMAIL) to enable delivery.
    // Dev convenience: drop the generated PDF on disk so it can be reviewed
    // without email delivery configured. Serverless filesystems (Vercel)
    // are read-only, so skip there rather than failing the request.
    if (!process.env.VERCEL) {
      try {
        const outDir = path.join(process.cwd(), "dev-output", "charter-requests");
        await mkdir(outDir, { recursive: true });
        const outPath = path.join(outDir, pdfFilename);
        await writeFile(outPath, pdfBuffer);
        console.log(`--- PDF written to ${outPath} ---`);
      } catch (err) {
        console.warn("Could not write dev PDF to disk:", err);
      }
    }
  }

  // Courtesy acknowledgement, with their own copy of the request PDF.
  // Never fails the request — the lead is already delivered by this point.
  await sendConfirmation({
    lead: "charter request",
    name,
    email,
    phone,
    attachments,
    summary: [
      { label: "Reference", value: requestId },
      ...(legs as LegPayload[]).map((l, i) => ({
        label: (legs as LegPayload[]).length > 1 ? `Leg ${i + 1}` : "Route",
        value: `${l.from} → ${l.to}\n${l.date} at ${l.time} (local)`,
      })),
      { label: "Passengers", value: String(body.passengers ?? "") },
      {
        label: "Options",
        value: Array.isArray(body.options) ? body.options.join(", ") : "",
      },
      { label: "Notes", value: String(body.notes ?? "") },
    ],
  });

  return NextResponse.json({ ok: true });
}
