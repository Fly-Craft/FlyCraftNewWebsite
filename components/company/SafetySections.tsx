/**
 * The former /safety page, appended below the About content on /company.
 * Its <h1> is demoted to <h2> — the page already has one in the hero — and
 * the nav-clearing top padding becomes a divider, since it now sits
 * mid-page rather than at the top of its own route.
 */
export default function SafetySections() {
  return (
    <>
      <section
        id="safety"
        className="flex flex-col scroll-mt-28 border-t border-navy/10 px-6 pt-24 pb-10 sm:px-20"
      >
        <h2 className="max-w-3xl text-[clamp(40px,6vw,76px)] leading-[0.95] font-extralight tracking-tight text-navy">
          Safety <span className="font-medium">Above All</span>
        </h2>
        <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          Tens of thousands of flight hours without an accident — earned one
          disciplined flight at a time.
        </p>
      </section>

      {/* ── Part 135 + captains ─────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20">
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
            same technicians see the same airframes week after week — they
            know every aircraft&apos;s history because they wrote it.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Nothing is deferred that shouldn&apos;t be, and nothing flies
            until the people who know it best are satisfied.
          </p>
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
