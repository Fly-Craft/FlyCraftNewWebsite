import { siteConfig } from "@/lib/site-config";

/**
 * The former /safety page, appended below the About content on /company.
 * Its <h1> is demoted to <h2> — the page already has one in the hero — and
 * the nav-clearing top padding becomes a divider, since it now sits
 * mid-page rather than at the top of its own route.
 */
export default function SafetySections() {
  return (
    <>
      {/* ── Part 135 + captains ─────────────────────────── */}
      {/* Carries the #safety anchor now that the section header above it is
          gone — the home page and FAQ both link here. */}
      <section
        id="safety"
        className="grid grid-cols-1 scroll-mt-28 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20"
      >
        <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Standards
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight font-extralight text-navy">
            Part 135.
            <br />
            <span className="font-medium">Every single flight.</span>
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Every CRAFT flight operates under FAA Part 135 commercial
            regulations — including owner trips, where the rules would allow
            less. We don&apos;t fly to two standards; we fly to the higher
            one, every time.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Our captains are highly experienced aviators who know our
            aircraft, our routes, and our clients — and they hold the final
            word on every go decision.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <img
            src="/safety/pedestal.jpg"
            alt="Challenger center pedestal and flight displays"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
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
            src="/safety/ramp.jpg"
            alt="View from the flight deck at the CRAFT ramp"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </section>

    </>
  );
}
