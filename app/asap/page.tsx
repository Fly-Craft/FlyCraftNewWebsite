import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AsapTeam from "@/components/AsapTeam";

export const metadata: Metadata = {
  title: "ASAP | CRAFT",
  description:
    "CRAFT specializes in ASAP operations. Contact our team directly to see if we can help.",
};

export default function AsapPage() {
  return (
    <>
      <PageHero
        eyebrow="ASAP Charter"
        title={
          <>
            Need It <span className="font-medium">ASAP?</span>
          </>
        }
        subtitle="When a trip needs to move now, contact our team directly. Shaked and Paul will work to see if we can help."
        divider={false}
      />

      <section className="px-6 py-20 sm:px-20">
        <AsapTeam />
      </section>
    </>
  );
}
