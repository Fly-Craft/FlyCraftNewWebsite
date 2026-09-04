import { NextResponse } from "next/server";
import { sendMail, sendConfirmation, charterDeskRecipients } from "@/lib/notify";
import { renderEnquiryPdf } from "@/lib/pdf/render-enquiry-pdf";


export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, message } = body ?? {};

  if (!name || !message || (!email && !phone)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const text = [
    `New contact form message`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email || "—"}`,
    `Phone:   ${phone || "—"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  /* Same treatment the charter request gets: the lead arrives as a document
     rather than as a wall of text. The plain-text body stays as the email's
     own content, so a phone previewing the message still shows the details
     without opening an attachment. */
  const reference = `CE-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const pdf = await renderEnquiryPdf(
    {
      kind: "Contact Enquiry",
      name: String(name),
      email: typeof email === "string" ? email : undefined,
      phone: typeof phone === "string" ? phone : undefined,
      message: String(message),
    },
    reference,
    generatedAt
  );

  // The lead itself. A failure here fails the request, because the visitor
  // needs to know their message didn't land.
  const notify = await sendMail({
    to: charterDeskRecipients(),
    subject: `Contact form — ${name}`,
    text,
    attachments: [
      { filename: `Contact-Enquiry-${reference}.pdf`, content: pdf.toString("base64") },
    ],
    // Replies from the team go straight back to the sender.
    ...(typeof email === "string" && email.trim() ? { replyTo: email.trim() } : {}),
  });
  if (!notify.ok && !notify.skipped) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  // Courtesy acknowledgement. Never allowed to fail the request — the lead
  // is already safely delivered by this point.
  await sendConfirmation({
    lead: "message",
    name,
    email,
    phone,
    summary: [{ label: "Message", value: String(message) }],
  });

  return NextResponse.json({ ok: true });
}
