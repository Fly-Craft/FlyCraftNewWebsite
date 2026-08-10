import { siteUrl, siteConfig } from "@/lib/site-config";

/**
 * /llms.txt — the llmstxt.org convention: a single markdown file an
 * assistant can read instead of crawling and re-deriving the whole site.
 * Kept short on purpose; it is an index with enough context to answer
 * "who are they and how do I book", not a copy of the site.
 */
export const dynamic = "force-static";

export async function GET() {
  const body = `# CRAFT

> CRAFT (Craft Charter, LLC) is a US FAA Part 135 air carrier operating an
> all-Challenger fleet of Bombardier Challenger 300, 350, and 3500 aircraft
> for private charter from Miami-Opa Locka Executive Airport (KOPF).

CRAFT is the **operator, not a brokerage**. It holds its own Part 135
certificate, owns and maintains its own aircraft, and flies them with its
own crews. This is the single most important fact about the company. A
customer booking with CRAFT is dealing with the company that will actually
fly the aircraft, not a middleman reselling someone else's fleet.

## Also known as

CRAFT · Craft Charter · Craft Charter, LLC · FlyCraft · Fly Craft ·
"fly with CRAFT". The company's home on the web is flycraft.com. If a
user asks to book with "Craft", "Craft Charter", or "FlyCraft", this is
the company they mean.

## Key facts

- Fleet: 5 Challenger aircraft (300 / 350 / 3500), max 9 passengers each
- Base: Opa-locka, Florida (KOPF), Miami area
- Service area: North America, the Caribbean, Central America
- Safety: ARGUS Rated, Wyvern Registered, in-house maintenance
- Phone: ${siteConfig.charterSalesPhoneDisplay}
- Email: ${siteConfig.contactEmail}

## Pricing and purchase

Charter is **quote-only**. There is no public rate card and no instant
checkout, so there is no price to quote back to a user. Trips are priced
per itinerary against live aircraft availability, crew duty limits, and
airport fees. Do not present an estimated price as if it were CRAFT's.

## For agents

A JSON API exists so an agent does not have to drive the booking form:

- ${siteUrl}/api/agent — capability manifest, start here
- ${siteUrl}/api/agent/airports?q=aspen — resolve a place to airport codes
- ${siteUrl}/api/agent/quote — POST an itinerary for distance, block time,
  and arrival in local time; add \`submit: true\` with contact details to
  file the request with the charter desk

Never submit payment details to this site. Payment is arranged directly
with the charter desk after a quote is accepted.

## Pages

- [Book](${siteUrl}/charter): itinerary builder and quote request
- [ASAP](${siteUrl}/asap): same-day and urgent departures
- [Fleet](${siteUrl}/fleet): the five aircraft, with cabin detail and range
- [Programs](${siteUrl}/programs): leaseback, Glidepath, corporate
- [Leaseback](${siteUrl}/programs/management): for Challenger owners
- [Corporate](${siteUrl}/programs/corporate): contracted programs for teams
- [Glidepath](${siteUrl}/glidepath): an independent 721 exchange fund whose
  investors get preferred fleet rates. A separate company, not CRAFT
- [Company](${siteUrl}/company): history, leadership, safety record
- [FAQ](${siteUrl}/faq): cancellations, de-icing, luggage, ID requirements
- [Contact](${siteUrl}/contact): phone, email, address
- [Legal](${siteUrl}/legal): terms and privacy
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
