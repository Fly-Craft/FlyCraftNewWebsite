import { NextResponse } from "next/server";
import { sendMail, sendConfirmation } from "@/lib/notify";

// Set CHARTER_TO_EMAIL=charter@flycraft.com in production; the fallback is
// a personal inbox used while the site is being tested.
const TO_EMAIL = process.env.CHARTER_TO_EMAIL ?? "nivtesler8@gmail.com";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, aircraft, ownership, baseAirport, email, phone } = body ?? {};

  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lines = [
    `New aircraft management inquiry`,
    ``,
    `Name:        ${name}`,
    `Aircraft:    ${aircraft?.trim() ? aircraft.trim() : "—"}`,
    `Status:      ${ownership || "—"}`,
    `Home base:   ${baseAirport || "—"}`,
    `Notes:       ${body.notes?.trim() ? body.notes.trim() : "—"}`,
    ``,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
  ];
  const text = lines.join("\n");

  const notify = await sendMail({
    to: TO_EMAIL,
    subject: `Aircraft management inquiry — ${name}`,
    text,
    ...(typeof email === "string" && email.trim() ? { replyTo: email.trim() } : {}),
  });
  if (!notify.ok && !notify.skipped) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  // Courtesy acknowledgement — never fails the request.
  await sendConfirmation({
    lead: "leaseback inquiry",
    name,
    email,
    phone,
    summary: [
      { label: "Aircraft", value: String(aircraft ?? "") },
      { label: "Status", value: String(ownership ?? "") },
      { label: "Home base", value: String(baseAirport ?? "") },
      { label: "Notes", value: String(body.notes ?? "") },
    ],
  });

  return NextResponse.json({ ok: true });
}
