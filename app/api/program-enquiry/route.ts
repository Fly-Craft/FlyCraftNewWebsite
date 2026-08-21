import { NextResponse } from "next/server";
import { sendMail, sendConfirmation, leadRecipients } from "@/lib/notify";
import { enquirableProgram } from "@/lib/programs";
import { isPublic } from "@/lib/site-config";
import { renderEnquiryPdf } from "@/lib/pdf/render-enquiry-pdf";


export async function POST(request: Request) {
  const body = await request.json();
  const { program, name, email, phone, message, company, hoursPerYear } =
    body ?? {};

  /* The client already resolved the programme, but the API is a public
     endpoint — re-resolve here so an unrecognised slug can never reach an
     email subject line or the confirmation copy. */
  const found = enquirableProgram(program);
  if (!found) {
    return NextResponse.json({ error: "Unknown program" }, { status: 400 });
  }
  // Name is required; email OR phone is required; message is optional.
  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  /* Per-programme questions, re-checked against the same definition the
     form renders from. Client-side validation is a convenience; this is
     the part that actually holds. */
  const wantsCompany = found.fields?.company === true;
  if (wantsCompany && !String(company ?? "").trim()) {
    return NextResponse.json({ error: "Company is required" }, { status: 400 });
  }

  const hoursField = found.fields?.hoursPerYear;
  let hours: number | null = null;
  if (hoursField && hoursPerYear !== undefined && hoursPerYear !== null && hoursPerYear !== "") {
    const n = Number(hoursPerYear);
    const min = hoursField.min;
    if (!Number.isFinite(n) || n <= 0 || (min !== undefined && n < min)) {
      return NextResponse.json(
        { error: min !== undefined ? `Hours must be at least ${min}` : "Invalid hours" },
        { status: 400 }
      );
    }
    hours = n;
  }

  const text = [
    `New ${found.label} enquiry`,
    ``,
    `Program: ${found.label}`,
    ...(wantsCompany ? [`Company: ${String(company).trim()}`] : []),
    `Name:    ${name}`,
    `Email:   ${email || "—"}`,
    `Phone:   ${phone || "—"}`,
    ...(hoursField ? [`Hours/yr: ${hours ?? "—"}`] : []),
    ``,
    `Message:`,
    message?.trim() ? message.trim() : "—",
  ].join("\n");

  /* The same document treatment the charter request gets. The programme's
     own questions ride along as extra fields, so whoever runs that programme
     sees the answers without hunting through the email body. */
  const reference = `PE-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const pdf = await renderEnquiryPdf(
    {
      kind: `${found.label} Enquiry`,
      name: String(name),
      email: typeof email === "string" ? email : undefined,
      phone: typeof phone === "string" ? phone : undefined,
      message: typeof message === "string" ? message : undefined,
      extras: [
        ...(wantsCompany ? [{ label: "Company", value: String(company).trim() }] : []),
        ...(hoursField ? [{ label: "Hours per year", value: hours ? String(hours) : "Not given" }] : []),
      ],
    },
    reference,
    generatedAt
  );

  /* The lead itself, to the general inbox AND the people who run this
     programme. sendMail dedupes, so an overlap between the two costs
     nobody a second copy. A failure here fails the request. */
  const notify = await sendMail({
    to: [...leadRecipients(), ...(isPublic ? (found.recipients ?? []) : [])],
    subject: `${found.label} enquiry — ${name}`,
    text,
    attachments: [
      { filename: `${found.slug}-enquiry-${reference}.pdf`, content: pdf.toString("base64") },
    ],
    ...(typeof email === "string" && email.trim() ? { replyTo: email.trim() } : {}),
  });
  if (!notify.ok && !notify.skipped) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  // Courtesy acknowledgement — never fails the request.
  await sendConfirmation({
    lead: `${found.label} enquiry`,
    name,
    email,
    phone,
    summary: [
      { label: "Program", value: found.label },
      ...(wantsCompany ? [{ label: "Company", value: String(company) }] : []),
      ...(hours !== null
        ? [{ label: "Hours per year", value: String(hours) }]
        : []),
      { label: "Message", value: String(message ?? "") },
    ],
  });

  return NextResponse.json({ ok: true });
}
