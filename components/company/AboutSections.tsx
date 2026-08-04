import Link from "next/link";
import ExecCarousel from "@/components/ExecCarousel";
import { siteConfig } from "@/lib/site-config";

/** The former /about page body, minus its hero — now the top half of /company. */
export default function AboutSections() {
  return (
    <>
      <section className="py-16">
        <p className="mb-10 px-6 text-center text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase sm:px-20">
          Our Executives
        </p>
        <ExecCarousel />
      </section>

      {/* ── The Craft story ─────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            src="/about/homebase.jpg"
            alt="A CRAFT team member marshalling a Challenger at Opa-locka Executive Airport"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            The Craft Story
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            One Challenger.
            <br />
            <span className="font-medium">Then a fleet of them.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT started in 2020 in Miami with a single Challenger 300 and a
            simple conviction: private aviation should feel personal, not
            transactional. Flight after flight, that conviction earned the
            company its next aircraft — and the one after that.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            More than 45,000 flight hours later, CRAFT operates a streamlined
            all-Challenger fleet, every cabin fully renovated and equipped
            with Starlink internet, Live TV, and Apple TV — so the office, or
            the movie night, comes with you.
          </p>
        </div>
      </section>

      {/* ── Trusted at the highest level ────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Who Flies With Us
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Trusted at the
            <br />
            <span className="font-medium">highest level.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT has flown a sitting U.S. president, former presidents,
            British royalty, and some of the world&apos;s most recognized
            artists — alongside the founders, executives, and families who
            fly with us week in and week out.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Whoever is on board, the standard is the same: absolute
            discretion, meticulous preparation, and a crew that knows your
            preferences before you step on the aircraft.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <img
            src="/about/window-view.jpg"
            alt="View over the mountains from a CRAFT Challenger cabin window"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>

      {/* ── Our people ──────────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            src="/about/story-sunset.jpg"
            alt="A CRAFT Challenger on the Opa-locka ramp at sunset"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Our People
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Character first.
            <br />
            <span className="font-medium">People above all.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            At CRAFT, we hire for character before anything else. We believe
            the personality and human quality of our people is what truly
            builds a healthy, functioning company — the kind of dynamic where
            colleagues look out for one another, and that care carries all the
            way through to how we treat the people we fly.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            None of that comes at the expense of professionalism. Our team
            holds itself to the highest standards in the business — but we
            never forget that behind every flight, and every relationship, are
            real people who take genuine pride in getting it right.
          </p>
          <Link
            href="/reviews"
            className="mt-2 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Read Our Reviews →
          </Link>
        </div>
      </section>

      {/* ── Beyond charter ──────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Beyond Charter
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Rethinking how
            <br />
            <span className="font-medium">aircraft are owned.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT pioneered a new way into aviation ownership: instead of
            buying a whole jet — or a fraction with heavy management fees —
            clients join an exchange fund that diversifies a concentrated
            stock position without a taxable event. Membership in the fund is
            what unlocks the aircraft: it opens the door to the entire CRAFT
            fleet of Challengers at exceptionally low hourly rates, all the
            access of ownership without ever owning a tail.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            That same thinking led to Glidepath, our exchange fund that lets
            investors diversify concentrated stock while unlocking access to
            the CRAFT fleet.
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
            src="/about/fleet-engine.jpg"
            alt="CRAFT Challenger engine detail with the fleet on the ramp behind"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>
    </>
  );
}
