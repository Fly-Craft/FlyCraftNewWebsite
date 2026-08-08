import { NextResponse } from "next/server";
import { sendMail, sendConfirmation } from "@/lib/notify";

// Set CHARTER_TO_EMAIL=charter@flycraft.com in production; the fallback is
// a personal inbox used while the site is being tested.
const TO_EMAIL = process.env.CHARTER_TO_EMAIL ?? "nivtesler8@gmail.com";

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

  // The lead itself. A failure here fails the request, because the visitor
  // needs to know their message didn't land.
  const notify = await sendMail({
    to: TO_EMAIL,
    subject: `Contact form — ${name}`,
    text,
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
