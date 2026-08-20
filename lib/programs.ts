/**
 * The four ways onto the fleet, as data.
 *
 * Deliberately plain strings and no JSX, so this can be imported by the
 * /programs page, the enquiry page, AND the API route that handles the
 * form. A "use client" module can't be *called* on the server, and a .tsx
 * module would drag React into the route handler — keeping the data here
 * lets every one of those places validate a slug against the same list.
 */
export type ProgramSlug = "leaseback" | "jet-card" | "corporate" | "glidepath";

export type Program = {
  slug: ProgramSlug;
  eyebrow: string;
  /** Split so the page can emphasise the second half of the heading. */
  titleLead: string;
  titleEmphasis: string;
  /** Flat name — nav, form headings, email subject lines. */
  label: string;
  body: string;
  points: string[];
  /** Only Glidepath has a page behind it; the rest are brochures. */
  href?: string;
  cta?: string;
  /** false hides the Contact Us button and blocks the enquiry route. */
  enquire?: false;
  /** Sits beside the enquiry form. Absent renders an empty slot. */
  image?: { src: string; alt: string };
  /**
   * Who gets the enquiry, on top of the general charter inbox. These are
   * the people who actually run each programme, so a lead lands with them
   * directly rather than waiting to be forwarded.
   */
  recipients?: string[];
  /**
   * Questions this programme asks on top of name / email / phone / message.
   * Declared here rather than branched on the slug inside the form, so the
   * page, the client validation and the API all read the same definition —
   * and a new programme's questions are a data change, not a code change.
   */
  fields?: {
    /** Company name. Present means required. */
    company?: true;
    /** Annual hours. Always optional; `min` floors it when answered. */
    hoursPerYear?: { min?: number };
  };
};

/* Leaseback and the Jet Card lead — the two ways onto the fleet that start
   with the aircraft rather than a portfolio or a company. */
export const PROGRAMS: Program[] = [
  {
    slug: "leaseback",
    eyebrow: "For Owners",
    titleLead: "Aircraft",
    titleEmphasis: "Leaseback",
    label: "Aircraft Leaseback",
    body: "You own the airplane, and it flies on CRAFT's Part 135 certificate. We cover the costs of operating the aircraft, including crew, maintenance, and compliance. You capture the bonus depreciation tax benefit of ownership and get access to our entire fleet of Challenger 300 and 350 aircraft. You can always fly, even when your jet is down for its scheduled maintenance.",
    points: [
      "You own the aircraft and its bonus depreciation tax benefit",
      "We cover the costs of operating the aircraft",
      "Access to the entire CRAFT Challenger fleet",
    ],
    image: {
      src: "/programs/leaseback-1200.jpg",
      alt: "A CRAFT Challenger on the ramp at sunset",
    },
    recipients: [
      "natan@flycraft.com",
      "rnaor@flycraft.com",
      "israel@flycraft.com",
    ],
  },
  {
    slug: "jet-card",
    eyebrow: "For Frequent Flyers",
    titleLead: "Fleet",
    titleEmphasis: "Jet Card",
    label: "Fleet Jet Card",
    body: "Fleet access at a discounted hourly rate. It runs thousands of dollars an hour below what a broker charges, because there is no broker. You book and communicate directly with the operator flying the aircraft. In exchange, callouts run at least five days ahead. This is the card for people who plan their travel rather than chase it.",
    points: [
      "Thousands per hour less than booking through a broker",
      "Book and communicate directly with the operator",
      "Five-day minimum callout, built for planning ahead",
      "Starting at 25 hours per year",
    ],
    // 25 is the programme's entry point, so the field can't take less.
    fields: { hoursPerYear: { min: 25 } },
    image: {
      src: "/programs/jetcard-1200.jpg",
      alt: "Two passengers boarding a CRAFT Challenger",
    },
    recipients: [
      "natan@flycraft.com",
      "shaked@flycraft.com",
      "pcastillo@flycraft.com",
    ],
  },
  {
    slug: "corporate",
    eyebrow: "For Teams",
    titleLead: "Corporate",
    titleEmphasis: "Program",
    label: "Corporate Program",
    body: "Travel built around companies that move executives on their own schedule, with dedicated account management for the way corporations operate. We stay flexible around last-minute changes, and because you fly the same fleet, your team gets to know our crews well. That's one reason satisfaction runs so high among the companies already flying with us.",
    points: [
      "Dedicated account manager",
      "Billing and reporting made easy for corporate structures",
      "A concierge service for busy executive teams",
    ],
    fields: { company: true, hoursPerYear: {} },
    image: {
      src: "/programs/corporate-1200.jpg",
      alt: "A traveller walking to a waiting car on the ramp at night",
    },
    recipients: [
      "natan@flycraft.com",
      "rnaor@flycraft.com",
      "shaked@flycraft.com",
    ],
  },
  {
    slug: "glidepath",
    eyebrow: "For Investors",
    titleLead: "Glidepath",
    titleEmphasis: "Exchange Fund",
    label: "Glidepath Exchange Fund",
    body: "A way into private aviation that starts with your portfolio rather than an aircraft purchase. Investors contribute a concentrated stock position to an exchange fund and diversify it without triggering a taxable event. Membership also opens the door to the CRAFT Challenger fleet at exceptionally low hourly rates, with all the access of ownership and none of the tail.",
    points: [
      "Diversify a concentrated stock position without selling",
      "Fleet access at exceptionally low hourly rates",
      "A separate company from CRAFT",
    ],
    href: "/glidepath",
    cta: "Explore Glidepath →",
    enquire: false,
  },
];

/**
 * Resolve a `?program=` value against the list above. Returns undefined for
 * anything unrecognised — callers redirect rather than trusting the input,
 * so nothing on the enquiry page is ever built from the raw query string.
 */
export function programBySlug(value: unknown): Program | undefined {
  if (typeof value !== "string") return undefined;
  return PROGRAMS.find((p) => p.slug === value);
}

/**
 * As above, but only for programmes that actually take enquiries. A card
 * with no Contact Us button must not be reachable by typing its slug into
 * the URL either, so the page and the API both resolve through this.
 */
export function enquirableProgram(value: unknown): Program | undefined {
  const found = programBySlug(value);
  return found && found.enquire !== false ? found : undefined;
}
