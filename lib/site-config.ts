export const siteConfig = {
  name: "CRAFT",
  charterSalesPhone: "+13108483636",
  charterSalesPhoneDisplay: "+1 (310) 848-3636",
  glidepathUrl: "https://glidepath.ai",
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

// The three cards on /programs, mirrored in the nav dropdown.
export const programLinks = [
  { href: "/programs/management", label: "Leaseback" },
  { href: "/glidepath", label: "Glidepath" },
  { href: "/programs/corporate", label: "Corporate" },
];
