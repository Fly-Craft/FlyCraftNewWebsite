/**
 * The former /safety page, appended below the About content on /company.
 * Image sits left here to keep the page's left/right alternation going —
 * the Maintenance section above it leads with text.
 */
export default function SafetySections() {
  return (
    <>
      {/* ── Part 135 standards ──────────────────────────── */}
      {/* Carries the #safety anchor now that the section header above it is
          gone — the home page and FAQ both link here. */}
      <section
        id="safety"
        className="grid grid-cols-1 scroll-mt-28 items-center gap-12 px-6 py-24 sm:px-20 lg:grid-cols-2 lg:gap-20"
      >
        <div className="mx-auto w-full max-w-xl max-lg:order-last">
          <img
            /* Filename carries a hash of the source image. Replacing the
               photo produces a new URL, so a browser that cached the old
               one can't keep serving it — which is exactly what happened
               the first two times this image changed. */
            src="/about/part135-1200-412176be.jpg"
            alt="A CRAFT Challenger taxiing head-on with the crew visible in the flight deck"
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
            regulations, including owner trips, where the rules would allow
            less. We hold every flight to one standard, and it&apos;s the
            higher one.
          </p>
          <p className="text-[15px] font-light leading-relaxed text-ink-2">
            Part 135 sets the limits, and they hold even when a schedule would
            rather they didn&apos;t. Every crew flies to FAA duty and rest
            rules, with recurrent training and checkrides on a fixed cycle. The
            same rules govern the weather we can launch in and the runways we
            can use, leaving extra margin on every landing.
          </p>
        </div>
      </section>
    </>
  );
}
