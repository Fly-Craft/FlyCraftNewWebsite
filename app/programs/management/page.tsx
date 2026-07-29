import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ManagementForm from "@/components/ManagementForm";

export const metadata: Metadata = {
  title: "Aircraft Management | CRAFT",
  description:
    "A leaseback program: own the aircraft, capture the bonus depreciation tax benefit, and fly the entire CRAFT fleet — while we cover the costs of operating it.",
};

export default function AircraftManagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Aircraft Management"
        title={
          <>
            Own the Jet. <span className="font-medium">Skip the Ops.</span>
          </>
        }
        subtitle="Tell us about your aircraft and how you fly — we'll walk you through the leaseback: you own the jet and its tax benefits, we cover the operating costs, and the whole CRAFT fleet opens up to you."
        divider={false}
      />

      <section className="px-6 pb-24 sm:px-20">
        <ManagementForm />
      </section>
    </>
  );
}
