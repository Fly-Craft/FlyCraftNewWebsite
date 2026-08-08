import Link from "next/link";
import HeroFlight from "@/components/HeroFlight";
import FpsMeter from "@/components/FpsMeter";
import { siteConfig } from "@/lib/site-config";

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
            CRAFT was founded in 2020 and has built a strong track record in
            the charter industry — flight after flight, year after year.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            We hold ourselves to the highest safety standards in the business,
            and we pair that discipline with something rarer: a warm,
            family-like service where our team knows you, your preferences,
            and what it takes to make every trip feel effortless.
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
            We operate Challenger 300 and 350 aircraft, all equipped with
            Starlink internet, Live TV, and Bluetooth speakers.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            The Challenger fleet is the perfect charter aircraft for North
            America — perfect range, a flat floor, and the ability to land at
            almost any airport.
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
            that didn&apos;t go according to plan — a habit many of our
            pilots carry over from flying in the Air Force. It&apos;s part
            of an open discussion culture that puts safety first, and gives
            us full faith in our crews to fly every trip as safely as
            possible.
          </p>
          <Link
            href="/company"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Our Safety Standards →
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Key Program
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Meet
            <br />
            <span className="font-medium">Glidepath</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Glidepath is a revolutionary way to access aircraft ownership
            while diversifying a concentrated stock position — by joining
            the CRAFT Exchange Fund.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            It&apos;s a first-of-its-kind solution in the private aviation
            space, and it has already attracted a lot of interest.
          </p>
          <a
            href={siteConfig.glidepathUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Visit Glidepath ↗
          </a>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <img
            src="/glidepath-exchange.jpg"
            alt="Glidepath Exchange Fund — diversify without selling"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>
    </div>
  );
}
