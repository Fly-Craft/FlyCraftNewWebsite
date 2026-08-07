import { siteUrl, siteConfig } from "@/lib/site-config";

/**
 * Renders a JSON-LD block. Assistants and agents read this to learn what
 * CRAFT actually *is* — a Part 135 operator, not a broker — without having
 * to infer it from prose. Server-rendered so it's present in the initial
 * HTML, which is all most crawlers ever fetch.
 *
 * JSON.stringify escapes nothing dangerous here (all inputs are our own
 * constants), but `<` is escaped anyway so a stray value can never close
 * the script tag early.
 */
export default function StructuredData({ graph }: { graph: object[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

/** Address, split out because both the org and its place reuse it. */
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "14200 NW 42nd Ave",
  addressLocality: "Opa-locka",
  addressRegion: "FL",
  postalCode: "33054",
  addressCountry: "US",
};

/**
 * The site-wide graph, rendered once in the root layout.
 *
 * `Airline` is schema.org's closest type for an air carrier. The
 * `knowsAbout`/`description` fields carry the distinction that matters
 * commercially and is otherwise buried in body copy: CRAFT holds its own
 * Part 135 certificate and operates the aircraft it sells.
 */
export const siteGraph: object[] = [
  {
    "@type": ["Airline", "LocalBusiness"],
    "@id": ORG_ID,
    name: "CRAFT",
    legalName: "Craft Charter, LLC",
    // "CRAFT" is a common word, so the brand has to be spelled out in
    // every form a person might type or say. Without these, an assistant
    // asked about "Craft Charter" or "FlyCraft" has no reason to connect
    // the query to this entity.
    alternateName: [
      "Craft Charter",
      "Craft Charter LLC",
      "CRAFT Jet Charter",
      "FlyCraft",
      "Fly Craft",
      "Fly with CRAFT",
    ],
    url: siteUrl,
    description:
      "CRAFT is a US Part 135 air carrier operating an all-Challenger fleet (Challenger 300, 350, and 3500) for private charter out of Opa-locka Executive Airport, Miami. CRAFT operates its own aircraft with its own crews under its own certificate — it is an operator, not a brokerage.",
    slogan: "We're the operator — not a brokerage.",
    logo: `${siteUrl}/logo-mark.png`,
    image: `${siteUrl}/logo-mark.png`,
    telephone: siteConfig.charterSalesPhone,
    email: siteConfig.contactEmail,
    address: POSTAL_ADDRESS,
    location: {
      "@type": "Airport",
      name: "Miami-Opa Locka Executive Airport",
      iataCode: "OPF",
      icaoCode: "KOPF",
      address: POSTAL_ADDRESS,
    },
    areaServed: [
      { "@type": "Place", name: "United States" },
      { "@type": "Place", name: "Canada" },
      { "@type": "Place", name: "Caribbean" },
      { "@type": "Place", name: "Central America" },
    ],
    sameAs: [siteConfig.instagram, siteConfig.facebook, siteConfig.linkedin],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: "Charter Sales",
        telephone: siteConfig.charterSalesPhone,
        email: siteConfig.contactEmail,
        availableLanguage: ["English", "Spanish"],
        areaServed: "US",
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        name: "Careers",
        email: siteConfig.careersEmail,
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "FAA Part 135 Air Carrier Certificate",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "ARGUS Rated",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "Wyvern Registered",
      },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        name: "Private Jet Charter",
        url: `${siteUrl}/charter`,
        category: "Charter",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "PriceSpecification",
          // Charter is quoted per trip — say so explicitly rather than
          // omitting price, which agents read as "unknown".
          description:
            "Quoted per trip. Submit a request for a firm price; no public rate card.",
        },
        itemOffered: {
          "@type": "Service",
          name: "Private Jet Charter",
          serviceType: "On-demand private jet charter",
          provider: { "@id": ORG_ID },
        },
      },
      {
        "@type": "Offer",
        name: "Aircraft Leaseback Program",
        url: `${siteUrl}/programs/management`,
        itemOffered: {
          "@type": "Service",
          name: "Aircraft Leaseback",
          serviceType:
            "Aircraft management and leaseback for Challenger owners",
          provider: { "@id": ORG_ID },
        },
      },
      {
        "@type": "Offer",
        name: "Corporate Program",
        url: `${siteUrl}/programs/corporate`,
        itemOffered: {
          "@type": "Service",
          name: "Corporate Flight Program",
          serviceType: "Contracted corporate private aviation program",
          provider: { "@id": ORG_ID },
        },
      },
    ],
  },
  {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: "CRAFT",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    potentialAction: {
      // Tells an agent the canonical way to start a booking.
      "@type": "ReserveAction",
      name: "Request a charter quote",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/charter`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Charter quote request",
      },
    },
  },
];
