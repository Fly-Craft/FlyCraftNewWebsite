/**
 * The former /safety page, appended below the About content on /company.
 * Image sits left here to keep the page's left/right alternation going —
 * the Maintenance section above it leads with text.
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
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            src="/safety/pedestal.jpg"
            alt="Challenger center pedestal and flight displays"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>

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
      </section>
    </>
  );
}
