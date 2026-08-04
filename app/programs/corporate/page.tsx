import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PreferToTalk from "@/components/PreferToTalk";
import CorporateProgramForm from "@/components/CorporateProgramForm";

export const metadata: Metadata = {
  title: "Corporate Program | CRAFT",
  description:
    "Tell us how your team flies and we'll build a corporate program around it — dedicated account management, predictable billing, and concierge service.",
};

export default function CorporateProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate Program"
        title={
          <>
            Build Your <span className="font-medium">Program</span>
          </>
        }
        subtitle="Tell us how your team flies — where you're based, how much you fly, and where you go — and we'll shape a program around it."
        divider={false}
        aside={<PreferToTalk />}
      />

      <section className="px-6 pb-24 sm:px-20">
        <CorporateProgramForm />
      </section>
    </>
  );
}
