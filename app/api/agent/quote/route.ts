import { NextResponse } from "next/server";
import { resolveAirport } from "@/lib/airport-search";
import type { Airport } from "@/lib/airports-data";
import {
  distanceNm,
  groundSpeedKts,
  flightMinutes,
  formatDuration,
  zonedToUtc,
  formatInZone,
  dayShift,
} from "@/lib/flight";
import { blackoutLabel } from "@/lib/blackout-dates";
import { siteConfig, siteUrl } from "@/lib/site-config";

/** Matches the booking form: 9 seats, one must stay free if a crew member rides. */
const MAX_PAX = 9;
/** Challenger 300/350 practical still-air range, planning figure. */
const MAX_LEG_NM = 3000;
const TURN_MINUTES = 30;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

const bad = (error: string, extra: object = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status: 400, headers: cors });

/**
 * Wrap the shared resolver in the error shape this route returns —
 * always naming the candidates so the agent can retry with a code
 * instead of guessing which "Springfield" was meant.
 */
function resolve(input: string) {
  const hit = resolveAirport(input);
  if ("airport" in hit) return { airport: hit.airport };

  if (!hit.candidates.length) {
    return { error: `No airport found for "${input}".` };
  }
  return {
    error: `"${input}" is ambiguous — specify an airport code.`,
    candidates: hit.candidates.map((a) => ({
      code: a.iata || a.icao,
      icao: a.icao,
      name: a.name,
      city: a.city,
      region: a.region,
    })),
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Request body must be JSON.");
  }

  const legsIn = body.legs;
  if (!Array.isArray(legsIn) || legsIn.length === 0) {
    return bad("`legs` must be a non-empty array.", {
      documentation: `${siteUrl}/api/agent`,
    });
  }
  if (legsIn.length > 6) return bad("At most 6 legs per request.");

  // Unspecified means TBD, not 1. Inventing a seat count would quote a
  // trip nobody asked for, and the desk needs to know it's still open.
  const paxGiven = body.passengers !== undefined && body.passengers !== null;
  const passengers = paxGiven ? Number(body.passengers) : null;
  if (
    paxGiven &&
    (!Number.isInteger(passengers) ||
      (passengers as number) < 1 ||
      (passengers as number) > MAX_PAX)
  ) {
    return bad(
      `\`passengers\` must be a whole number from 1 to ${MAX_PAX}, or omitted to leave it TBD.`,
    );
  }

  const warnings: string[] = [];
  const legs = [];
  let prevArrivalUtc: Date | null = null;

  for (let i = 0; i < legsIn.length; i++) {
    const leg = legsIn[i] as Record<string, unknown>;
    const label = `Leg ${i + 1}`;

    const from = resolve(String(leg.from ?? ""));
    if ("error" in from && from.error) {
      return bad(`${label}: ${from.error}`, { candidates: from.candidates });
    }
    const to = resolve(String(leg.to ?? ""));
    if ("error" in to && to.error) {
      return bad(`${label}: ${to.error}`, { candidates: to.candidates });
    }

    const a = from.airport as Airport;
    const b = to.airport as Airport;
    if (a.icao === b.icao) return bad(`${label}: origin and destination match.`);

    const date = String(leg.date ?? "");
    const time = String(leg.time ?? "");
    if (!DATE_RE.test(date)) return bad(`${label}: \`date\` must be YYYY-MM-DD.`);
    if (!TIME_RE.test(time)) return bad(`${label}: \`time\` must be HH:MM (24h).`);

    const departUtc = zonedToUtc(date, time, a.tz);
    if (Number.isNaN(departUtc.getTime())) {
      return bad(`${label}: could not interpret ${date} ${time}.`);
    }
    if (departUtc.getTime() < Date.now()) {
      return bad(`${label}: departure is in the past.`);
    }

    // Legs must be flyable in sequence — catch impossible itineraries here
    // rather than letting the charter desk find them by hand.
    if (prevArrivalUtc && departUtc < prevArrivalUtc) {
      return bad(
        `${label}: departs before the previous leg lands (plus a ${TURN_MINUTES}-minute turn).`,
      );
    }

    const nm = Math.round(distanceNm(a, b));
    const speed = groundSpeedKts(a, b);
    const minutes = flightMinutes(nm, speed);
    const arriveUtc = new Date(departUtc.getTime() + minutes * 60_000);

    if (nm > MAX_LEG_NM) {
      warnings.push(
        `${label} is ${nm} NM — beyond the Challenger's ${MAX_LEG_NM} NM planning range. A fuel stop will be required and is not reflected in the times below.`,
      );
    }
    const blackout = blackoutLabel(date);
    if (blackout) {
      warnings.push(
        `${label} departs on ${blackout} — peak demand, availability is limited and pricing is higher.`,
      );
    }

    const shift = dayShift(departUtc, a.tz, arriveUtc, b.tz);
    legs.push({
      from: {
        code: a.iata || a.icao,
        icao: a.icao,
        name: a.name,
        city: a.city,
        timezone: a.tz,
      },
      to: {
        code: b.iata || b.icao,
        icao: b.icao,
        name: b.name,
        city: b.city,
        timezone: b.tz,
      },
      departure: { date, time, timezone: a.tz, utc: departUtc.toISOString() },
      arrival: {
        localTime: formatInZone(arriveUtc, b.tz, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        timezone: b.tz,
        utc: arriveUtc.toISOString(),
        dayOffset: shift,
      },
      distanceNm: nm,
      plannedSpeedKts: speed,
      flightTimeMinutes: minutes,
      flightTime: formatDuration(minutes),
    });

    prevArrivalUtc = new Date(arriveUtc.getTime() + TURN_MINUTES * 60_000);
  }

  const totalMinutes = legs.reduce((s, l) => s + l.flightTimeMinutes, 0);
  const quote = {
    legs,
    totalDistanceNm: legs.reduce((s, l) => s + l.distanceNm, 0),
    totalFlightTimeMinutes: totalMinutes,
    totalFlightTime: formatDuration(totalMinutes),
    passengers: passengers ?? "TBD",
    passengersSpecified: paxGiven,
    aircraft: "Bombardier Challenger 300 / 350 / 3500",
    operator: "CRAFT — Craft Charter, LLC (FAA Part 135)",
    // Never imply a price exists. An agent must not infer "free" or "TBD
    // means proceed" — it means a human has to quote it.
    price: null,
    pricing: {
      model: "quote-only",
      note: "Flight times are planning estimates and exclude fuel stops, ATC routing, and slot restrictions. Price is quoted by the charter desk against live availability.",
    },
  };

  const submit = body.submit === true;
  if (!submit) {
    return NextResponse.json(
      {
        ok: true,
        submitted: false,
        quote,
        warnings,
        nextStep:
          "Repeat this call with `submit: true` and a `contact` object ({ name, email or phone }) to file the request with the charter desk.",
      },
      { headers: cors },
    );
  }

  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const name = String(contact.name ?? "").trim();
  const email = String(contact.email ?? "").trim();
  const phone = String(contact.phone ?? "").trim();
  if (!name) return bad("`contact.name` is required when submit is true.");
  if (!email && !phone) {
    return bad("One of `contact.email` or `contact.phone` is required.");
  }

  const requestId = `AG-${Date.now().toString(36).toUpperCase()}`;
  const text = [
    `New charter request (submitted by an AI agent)`,
    ``,
    `Request ID: ${requestId}`,
    `Passengers: ${passengers ?? "TBD"}`,
    ``,
    ...legs.flatMap((l, i) => [
      `Leg ${i + 1}: ${l.from.city} (${l.from.code}) -> ${l.to.city} (${l.to.code})`,
      `  Departs: ${l.departure.date} at ${l.departure.time} local`,
      `  Arrives: ${l.arrival.localTime} local${l.arrival.dayOffset ? ` (+${l.arrival.dayOffset}d)` : ""}`,
      `  ${l.distanceNm} NM · ${l.flightTime} @ ${l.plannedSpeedKts} kts`,
    ]),
    ``,
    ...(warnings.length ? [`Warnings:`, ...warnings.map((w) => `  - ${w}`), ``] : []),
    `Name:  ${name}`,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
    `Notes: ${String(body.notes ?? "").trim() || "—"}`,
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
        from:
          process.env.CHARTER_FROM_EMAIL ??
          "CRAFT Website <onboarding@resend.dev>",
        to: [process.env.CHARTER_TO_EMAIL ?? "nivtesler8@gmail.com"],
        subject: `Charter request (agent) — ${name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      // Tell the agent the truth: this did NOT reach a human.
      return NextResponse.json(
        {
          ok: false,
          submitted: false,
          error:
            "The request could not be delivered. Contact the charter desk directly.",
          humanFallback: {
            phone: siteConfig.charterSalesPhoneDisplay,
            email: siteConfig.contactEmail,
          },
        },
        { status: 502, headers: cors },
      );
    }
  } else {
    console.log(`--- Agent charter request (delivery not configured) ---\n${text}`);
    return NextResponse.json(
      {
        ok: false,
        submitted: false,
        error:
          "Request intake is not currently delivering mail. Contact the charter desk directly so this trip is not lost.",
        humanFallback: {
          phone: siteConfig.charterSalesPhoneDisplay,
          email: siteConfig.contactEmail,
        },
        quote,
      },
      { status: 503, headers: cors },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      submitted: true,
      requestId,
      quote,
      warnings,
      nextStep: `A member of the charter desk will respond with availability and a firm price. Reference ${requestId}. For anything departing within 24 hours, call ${siteConfig.charterSalesPhoneDisplay}.`,
    },
    { headers: cors },
  );
}
