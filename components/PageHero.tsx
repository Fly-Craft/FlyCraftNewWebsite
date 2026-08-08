export default function PageHero({
  eyebrow,
  title,
  subtitle,
  divider = true,
  titleClassName = "",
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  divider?: boolean;
  /** Optical alignment nudge — large display letters (e.g. a rounded "G")
   * carry more left-side-bearing than the small eyebrow/body text above
   * and below, so the box edges can match while the ink still looks off. */
  titleClassName?: string;
  /** Sits top-right beside the title on wide screens and drops below the
   * copy on narrow ones. Used for the programme contact card. */
  aside?: React.ReactNode;
}) {
  const copy = (
    <div className="flex flex-col">
      <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
        {eyebrow}
      </p>
      <h1
        className={`display-title max-w-3xl text-[clamp(40px,7vw,88px)] leading-title font-extralight tracking-tight text-navy ${titleClassName}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <section
      className={`flex flex-col px-6 pt-40 pb-16 sm:px-20 ${divider ? "border-b border-border" : ""}`}
    >
      {aside ? (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {copy}
          <div className="lg:shrink-0">{aside}</div>
        </div>
      ) : (
        copy
      )}
    </section>
  );
}
