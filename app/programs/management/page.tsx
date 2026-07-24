import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ManagementForm from "@/components/ManagementForm";

export const metadata: Metadata = {
  title: "Aircraft Management | CRAFT",
  description:
    "Place your aircraft on CRAFT's Part 135 certificate — crew, maintenance, and compliance handled, with charter revenue to offset the cost of ownership.",
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
        subtitle="Tell us about your aircraft and how you fly — we'll walk you through placing it on our certificate, and how charter revenue offsets what it costs to own."
        divider={false}
      />

      <section className="px-6 pb-24 sm:px-20">
        <ManagementForm />
      </section>
    </>
  );
}
