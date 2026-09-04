import Link from "next/link";
import HeroFlight from "@/components/HeroFlight";
import FpsMeter from "@/components/FpsMeter";

export default function Home() {
  return (
    <div>
      {/* On-device frame diagnostics — renders only with ?fps=1 */}
      <FpsMeter />
      <HeroFlight />

      <section className="grid grid-cols-1 items-center gap-12 px-6 pt-8 pb-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        {/* text reads first on mobile; image leads on desktop */}
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            src="/about-hangar.jpg"
            alt="CRAFT Challenger 300 N971MC parked under the hangar canopy"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Our Story
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Built in 2020.
            <br />
            <span className="font-medium">Flown like family ever since.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT was founded in 2020 and has grown flight by flight ever
            since, but the way we work hasn&apos;t changed. We&apos;re a
            small, tight-knit team, and the people who plan your trip are the
            same people who answer when your plans change at the last minute.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            That&apos;s what we mean by flying like family. We learn how you
            like to fly and we remember it, so you never have to explain
            yourself twice.
          </p>
          <Link
            href="/company"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Meet the Team →
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            The Fleet
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Meet our
            <br />
            <span className="font-medium">Challenger Fleet</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            We fly an all-Challenger fleet of 300s and 350s, the most common
            super-midsize jets in the sky. Every cabin is fitted with Starlink
            internet, Live TV, and Bluetooth audio.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Super-midsize is the right aircraft for North America. The
            Challenger crosses the continent nonstop, with a flat floor and a
            stand-up cabin for the hours in between, and it can use almost any
            airport, including the small ones nearest your destination.
          </p>
          <Link
            href="/fleet"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Explore the Fleet →
          </Link>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <img
            src="/fleet-2x3-1200.jpg"
            alt="A CRAFT Challenger on a snow-lined ramp with mountains behind"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        {/* text reads first on mobile; image leads on desktop */}
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            src="/safety-cockpit.jpg"
            alt="CRAFT flight crew in the cockpit during a flight"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Safety
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Safety is
            <br />
            <span className="font-medium">Our Priority</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT proudly holds both ARGUS Platinum and Wyvern ratings, and
            has maintained a clean safety record for six years running.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            We run a risk assessment before every trip and debrief anything
            that didn&apos;t go according to plan. Many of our pilots carry
            that habit over from flying in the Air Force. It&apos;s part
            of an open discussion culture that puts safety first, and gives
            us full faith in our crews to fly every trip as safely as
            possible.
          </p>
          <Link
            href="/company#safety"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Our Safety Standards →
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Programs
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Four ways
            <br />
            <span className="font-medium">onto the fleet.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Charter a trip outright and pay for the flights you take. Put your
            own aircraft on our certificate with Leaseback, and we carry crew,
            maintenance, and compliance while the ownership benefits stay
            yours. Buy hours up front with the Fleet Jet Card and fly at a rate
            thousands an hour below a broker&apos;s. Or set your company up on
            the Corporate Program, with a dedicated account manager and billing
            built for how companies actually run.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            All four fly the same Challengers, with the same crews, under the
            same Part 135 rules. What changes is how you pay for it and how far
            ahead you plan.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/programs"
              className="text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              See All Programs →
            </Link>
            <Link
              href="/charter"
              className="text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Book a Flight →
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <img
            src="/programs/mb-1200.jpg"
            alt="The tail and engine of CRAFT Challenger N150MB, seen past the winglet of a second aircraft"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>
    </div>
  );
}
