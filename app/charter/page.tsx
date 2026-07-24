import type { Metadata } from "next";
import CharterBooking from "@/components/charter/CharterBooking";

export const metadata: Metadata = {
  title: "Charter | CRAFT",
  description:
    "Plan your private charter flight on the CRAFT Challenger fleet — route, timing, and a request to our team in minutes.",
};

export default function CharterPage() {
  return (
    <div>
      <section className="flex flex-col px-6 pt-40 pb-10 sm:px-20">
        <h1 className="max-w-3xl text-[clamp(40px,6vw,76px)] leading-[0.95] font-extralight tracking-tight text-navy">
          Plan Your <span className="font-medium">Flight</span>
        </h1>
        <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          Pick your route and timing, tailor the details, and send it to our
          team — we&apos;ll come back with availability and a quote.
        </p>
      </section>

      <section className="px-6 pb-28 sm:px-20">
        <CharterBooking />
      </section>
    </div>
  );
}
