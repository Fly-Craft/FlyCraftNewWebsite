import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AboutSections from "@/components/company/AboutSections";
import SafetySections from "@/components/company/SafetySections";

export const metadata: Metadata = {
  title: "Company | CRAFT",
  description:
    "CRAFT is a Miami-based private jet operator founded in 2020. All-Challenger fleet, 45,000+ flight hours, ARGUS Platinum rated and Wyvern certified, with a warm, family-like standard of service.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title={
          <>
            The <span className="font-medium">CRAFT</span> Family
          </>
        }
        subtitle="Founded in 2020 and based in Miami, CRAFT pairs an all-Challenger fleet with a warm, family-like standard of service."
        /* The one title that stays on a single line — its emphasis sits in
           the middle of the phrase, so the site-wide two-line pattern would
           break it into "The / CRAFT / Family". */
        titleClassName="display-title-inline"
        divider={false}
      />

      <AboutSections />
      <SafetySections />
    </>
  );
}
