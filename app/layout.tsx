import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import StructuredData, { siteGraph } from "@/components/StructuredData";
import { siteUrl, isPublic } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // No `template` here: every page already ends its own title with
  // "| CRAFT", so a template would render "Contact | CRAFT | CRAFT".
  title: "CRAFT | Private Jet Charter",
  description:
    "CRAFT is a Part 135 air carrier operating an all-Challenger fleet for private charter from Miami — the operator, not a brokerage.",
  applicationName: "CRAFT",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "CRAFT",
    url: siteUrl,
    title: "CRAFT | Private Jet Charter",
    description:
      "A Part 135 air carrier operating its own all-Challenger fleet from Miami. We're the operator — not a brokerage.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRAFT | Private Jet Charter",
    description:
      "A Part 135 air carrier operating its own all-Challenger fleet from Miami.",
  },
  // Private review period — flip SITE_PUBLIC=true at launch. While this is
  // false the site is invisible to search engines AND to every AI crawler.
  ...(isPublic ? {} : { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <StructuredData graph={siteGraph} />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
