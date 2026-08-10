import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PreferToTalk from "@/components/PreferToTalk";
import ManagementForm from "@/components/ManagementForm";

export const metadata: Metadata = {
  title: "Aircraft Leaseback | CRAFT",
  description:
    "A leaseback program. You own the aircraft and capture the bonus depreciation tax benefit, we cover the costs of operating it, and you fly the entire CRAFT fleet.",
};

export default function AircraftManagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Aircraft Leaseback"
        title={
          <>
            Own the Jet. <span className="font-medium">Skip the Ops.</span>
          </>
        }
        subtitle="Tell us about your aircraft and how you fly. We'll walk you through the leaseback. You own the jet and its tax benefits, we cover the operating costs, and the whole CRAFT fleet opens up to you."
        divider={false}
        aside={<PreferToTalk />}
      />

      <section className="px-6 pb-24 sm:px-20">
        <ManagementForm />
      </section>
    </>
  );
}
