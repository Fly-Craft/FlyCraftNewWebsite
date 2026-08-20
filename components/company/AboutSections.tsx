import Link from "next/link";
import ExecCarousel from "@/components/ExecCarousel";

/** The former /about page body, minus its hero — now the top half of /company. */
export default function AboutSections() {
  return (
    <>
      <section className="py-16">
        <p className="mb-10 px-6 text-center text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase sm:px-20">
          Our Leadership
        </p>
        <ExecCarousel />
      </section>

      {/* ── The Craft story ─────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            /* Filename carries a hash of the source image, so replacing the
               photo produces a new URL and a browser holding the old one
               can't keep serving it. */
            src="/about/part135-1200-412176be.jpg"
            alt="A CRAFT Challenger taxiing head-on with the crew visible in the flight deck"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            The Craft Story
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            One Challenger,
            <br />
            <span className="font-medium">Then a fleet of them.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT started in 2020 in Miami with a single Challenger 300 and
            one belief: private aviation should feel personal, not
            transactional. Flight after flight, that belief earned the
            company its next aircraft, and then the one after that.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            More than 45,000 flight hours later, CRAFT operates a streamlined
            all-Challenger fleet. Every cabin is fully renovated and equipped
            with Starlink internet, Live TV, and Apple TV, so the office, or
            the movie night, comes with you.
          </p>
        </div>
      </section>

      {/* ── Track record + ratings ──────────────────────── */}
      {/* Carries the #safety anchor, inherited from the Part 135 section
          that used to sit below. The FAQ links here for the credentials. */}
      <section
        id="safety"
        className="grid grid-cols-1 scroll-mt-28 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20"
      >
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Track Record
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Tens of thousands of hours.
            <br />
            <span className="font-medium">A spotless record.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Since 2020, CRAFT has flown tens of thousands of hours and kept
            that record clean the whole way. It comes from standards we refuse
            to bend, audited and verified by the two most respected
            independent safety authorities in aviation.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT is ARGUS Platinum rated and Wyvern certified. Only a small
            fraction of charter operators worldwide hold the Platinum rating.
          </p>
          <div className="mt-2 flex w-full items-center justify-center gap-8">
            <a
              href="https://www.argus.aero/operator-registry-new"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <img
                src="/safety/argus.png"
                alt="ARGUS Platinum rating"
                className="h-20 w-auto object-contain"
              />
            </a>
            <a
              href="https://app.wyvern.systems/public/directory/registered"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <img
                src="/safety/wyvern.png"
                alt="Wyvern certification"
                className="h-16 w-auto object-contain"
              />
            </a>
          </div>
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
            src="/about/yan-1200.jpg"
            alt="A CRAFT crew member in uniform beside a Challenger on the ramp"
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
            the personality and human quality of our people is what builds a
            healthy, functioning company, one where colleagues look out for
            one another. That care carries all the way through to how we
            treat the people we fly.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            None of that comes at the expense of professionalism. Our team
            holds itself to the highest standards in the business. But we
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

      {/* ── Maintenance ─────────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Maintenance
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Our own hands,
            <br />
            <span className="font-medium">on our own fleet.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            CRAFT runs in-house maintenance at our Opa-locka home base. The
            same technicians see the same airframes week after week, so they
            know every nick and every scratch on every aircraft, because they
            logged it themselves. A contractor closes a squawk and moves on to
            the next customer&apos;s airplane. Our team lives with these
            cabins for years, and it shows in the condition they keep them in.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            The same thinking runs through our cabin interior committee, where
            technicians, pilots, and leadership decide together what gets
            addressed, refreshed, or replaced. The people who maintain the
            aircraft, the people who fly it, and the people accountable for
            the experience all have a say. That is how the cabin you step into
            stays pristine.
          </p>
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
