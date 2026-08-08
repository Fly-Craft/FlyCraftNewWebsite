import { NextResponse } from "next/server";
import { sendMail, sendConfirmation } from "@/lib/notify";

// Set CHARTER_TO_EMAIL=charter@flycraft.com in production; the fallback is
// a personal inbox used while the site is being tested.
const TO_EMAIL = process.env.CHARTER_TO_EMAIL ?? "nivtesler8@gmail.com";

export async function POST(request: Request) {
  const body = await request.json();
  const { company, mainAirport, hoursPerYear, longestTrip, name, email, phone } =
    body ?? {};

  if (!company || !name || (!email && !phone)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lines = [
    `New corporate program request`,
    ``,
    `Company:        ${company}`,
    `Main airport:   ${mainAirport || "—"}`,
    `Hours per year: ${hoursPerYear || "—"}`,
    `Longest trip:   ${longestTrip || "—"}`,
    `Frequent trips: ${body.frequentTrips?.trim() ? body.frequentTrips.trim() : "—"}`,
    ``,
    `Name:  ${name}`,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
  ];
  const text = lines.join("\n");

  const notify = await sendMail({
    to: TO_EMAIL,
    subject: `Corporate program request — ${company}`,
    text,
    ...(typeof email === "string" && email.trim() ? { replyTo: email.trim() } : {}),
  });
  if (!notify.ok && !notify.skipped) {
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  // Courtesy acknowledgement — never fails the request.
  await sendConfirmation({
    lead: "corporate program request",
    name,
    email,
    phone,
    summary: [
      { label: "Company", value: String(company) },
      { label: "Main airport", value: String(mainAirport ?? "") },
      { label: "Hours per year", value: String(hoursPerYear ?? "") },
      { label: "Longest trip", value: String(longestTrip ?? "") },
      { label: "Frequent trips", value: String(body.frequentTrips ?? "") },
    ],
  });

  return NextResponse.json({ ok: true });
}
