import type { Metadata } from "next";
import Link from "next/link";
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
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col">
            <h1 className="max-w-3xl text-[clamp(40px,6vw,76px)] leading-[0.95] font-extralight tracking-tight text-navy">
              Plan Your <span className="font-medium">Flight</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
              Pick your route and timing, tailor the details, and send it to
              our team — we&apos;ll come back with availability and a quote.
            </p>
          </div>

          {/* Escape hatch for trips that can't wait on a quote turnaround —
              sits beside the title so it's visible before anyone starts
              filling the form in. */}
          {/* Centred on mobile, where the block spans the full width and
              left-aligning it stranded the button against the edge. */}
          <div className="flex flex-col items-center gap-3 lg:shrink-0 lg:pt-3 lg:pr-10">
            <p className="text-[10px] font-normal tracking-[0.3em] text-ink-3 uppercase">
              Flying Today?
            </p>
            <Link
              href="/asap"
              className="glass-selected rounded-full px-14 py-5 text-[14px] font-medium tracking-[0.3em] text-white uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              ASAP
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 sm:px-20">
        <CharterBooking />
      </section>
    </div>
  );
}
