import { NextResponse } from "next/server";

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

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CHARTER_FROM_EMAIL ?? "CRAFT Website <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `Contact form — ${name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }
  } else {
    console.log(`--- Contact form (email delivery not configured) ---\n${text}`);
  }

  return NextResponse.json({ ok: true });
}
