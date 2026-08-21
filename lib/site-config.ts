/**
 * Canonical origin. Everything machine-readable (sitemap, JSON-LD @id,
 * llms.txt) needs absolute URLs, so this is the one place they come from.
 * Set NEXT_PUBLIC_SITE_URL to the real domain at launch.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://craft-website-tau.vercel.app"
).replace(/\/$/, "");

/**
 * Private-review gate. While false the site sends `noindex` and a
 * blanket robots.txt disallow — which also turns away every well-behaved
 * AI crawler and agent, regardless of the structured data below.
 * Set SITE_PUBLIC=true in the Vercel environment to open it up.
 */
export const isPublic = process.env.SITE_PUBLIC === "true";

export const siteConfig = {
  name: "CRAFT",
  charterSalesPhone: "+13108483636",
  charterSalesPhoneDisplay: "+1 (310) 848-3636",
  glidepathUrl: "https://glidepath.ai",
  /* Natan's Google Appointment Scheduling page. Opened in a dialog on
     /programs, and the reason his direct line no longer appears on the
     site: a booked slot beats a missed call. */
  bookingUrl:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3XQ54AhhG64ugIqz4ernC-saXcJnk4JH8hHnNmPWfeOQdAw7Usm10cZqsg1OUl8OR9PwDqt4EK?gv=true",
  contactEmail: "charter@flycraft.com",
  careersEmail: "careers@flycraft.com",
  address: "14200 NW 42nd Ave, Opa-locka, Florida 33054",
  instagram: "https://www.instagram.com/flywithcraft/",
  facebook: "https://www.facebook.com/flywithcraft",
  linkedin: "https://www.linkedin.com/company/fly-craft",
};

// Glidepath now lives as a card on /programs rather than its own tab, and
// About Us + Safety merged into /company.
export const landingLinks = [
  { href: "/charter", label: "Book" },
  { href: "/programs", label: "Programs" },
  { href: "/fleet", label: "Fleet" },
  { href: "/company", label: "Company" },
];

/**
 * Somewhere to go while you wait for a reply. Shown on every confirmation
 * screen and repeated in the confirmation email, so all four surfaces say
 * the same thing from one definition.
 */
export const exploreLinks = [
  { href: "/fleet", label: "The Fleet" },
  { href: "/reviews", label: "Reviews" },
  { href: "/company", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
];

// The three tabs on /charter, mirrored in the nav dropdown. Planner is the
// default tab and so carries no ?tab= — the Book tab itself lands there.
export const bookLinks = [
  { href: "/charter?tab=contact", label: "Contact" },
  { href: "/charter", label: "Planner" },
  { href: "/charter?tab=asap", label: "ASAP" },
];

// The four cards on /programs, mirrored in the nav dropdown, in the same
// order they appear on the page. None of the three has a page of its own
// any more: each link lands on /programs and opens that card's enquiry
// dialog, which the page resolves from `?enquire=` server-side.
// Glidepath is a separate company, so that entry leaves the site —
// `external` tells the nav to render an <a target="_blank"> instead of a
// client-side <Link>.
export const programLinks: {
  href: string;
  label: string;
  external?: true;
}[] = [
  { href: "/programs?enquire=leaseback", label: "Leaseback" },
  { href: "/programs?enquire=jet-card", label: "Jet Card" },
  { href: "/programs?enquire=corporate", label: "Corporate" },
  { href: siteConfig.glidepathUrl, label: "Glidepath", external: true },
];
