import { NextResponse } from "next/server";
import { siteUrl, siteConfig } from "@/lib/site-config";

/**
 * Capability manifest for autonomous agents.
 *
 * The booking form is a stateful React UI — popovers, custom comboboxes,
 * derived flight times. An agent driving that DOM is slow and brittle.
 * This endpoint is the contract instead: here is what CRAFT sells, here
 * is how to price and request it, and here is what we deliberately do
 * NOT do (take payment).
 */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      name: "CRAFT",
      legalName: "Craft Charter, LLC",
      description:
        "US Part 135 air carrier operating an all-Challenger fleet for private charter. CRAFT operates its own aircraft with its own crews under its own certificate. We're the operator, not a brokerage.",
      url: siteUrl,
      contact: {
        phone: siteConfig.charterSalesPhoneDisplay,
        email: siteConfig.contactEmail,
        base: "Miami-Opa Locka Executive Airport (KOPF), Opa-locka, FL",
      },
      fleet: {
        types: ["Bombardier Challenger 300", "Challenger 350", "Challenger 3500"],
        maxPassengers: 9,
        cabinCrewThreshold:
          "A flight attendant reduces usable seats to 8 and may add cost.",
      },
      commerce: {
        // Be explicit. An agent that can't tell "no price yet" from
        // "free" will do something stupid with it.
        model: "quote-only",
        instantPurchase: false,
        publicRateCard: false,
        explanation:
          "Charter is priced per trip against live aircraft availability, crew duty limits, and airport fees. There is no published rate and no checkout. An agent can obtain a firm quote by submitting a request; a human returns pricing and availability.",
        currency: "USD",
      },
      endpoints: [
        {
          name: "searchAirports",
          method: "GET",
          path: "/api/agent/airports?q={query}&limit={n}",
          description:
            "Resolve a city name, IATA, ICAO, or FAA code to airports CRAFT serves. Use this before quote to get unambiguous codes.",
          example: `${siteUrl}/api/agent/airports?q=aspen`,
        },
        {
          name: "quote",
          method: "POST",
          path: "/api/agent/quote",
          description:
            "Price and validate an itinerary. Computes great-circle distance, block time, and arrival in destination local time. Set submit=true to file the request with the charter desk.",
          contentType: "application/json",
          body: {
            legs: [
              {
                from: "string — city name, IATA, ICAO, or FAA code",
                to: "string — same",
                date: "YYYY-MM-DD (departure local date)",
                time: "HH:MM 24h (departure local time)",
              },
            ],
            passengers: "number 1-9 (optional, default 1)",
            submit: "boolean — false (default) prices only; true files it",
            contact: {
              name: "string — required when submit is true",
              email: "string — required unless phone is given",
              phone: "string — required unless email is given",
            },
            notes: "string (optional)",
          },
          returns:
            "{ ok, quote: { legs[], totalDistanceNm, totalFlightTime, aircraft, passengers }, warnings[], submitted, requestId? }",
        },
      ],
      policies: {
        serviceArea:
          "North America, Caribbean, and Central America. Trips outside this range are quoted case by case.",
        payment:
          "Handled directly with the charter desk after a quote is accepted. Never submit payment details to this site.",
        dataUse:
          "Contact details submitted via /api/agent/quote are used only to respond to the request.",
      },
      humanFallback: {
        phone: siteConfig.charterSalesPhoneDisplay,
        email: siteConfig.contactEmail,
        bookingPage: `${siteUrl}/charter`,
        urgentPage: `${siteUrl}/asap`,
      },
    },
    {
      headers: {
        // Agents fetching cross-origin need this to read the manifest.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
