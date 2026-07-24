export default function PageHero({
  eyebrow,
  title,
  subtitle,
  divider = true,
  titleClassName = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  divider?: boolean;
  /** Optical alignment nudge — large display letters (e.g. a rounded "G")
   * carry more left-side-bearing than the small eyebrow/body text above
   * and below, so the box edges can match while the ink still looks off. */
  titleClassName?: string;
}) {
  return (
    <section
      className={`flex flex-col px-6 pt-40 pb-16 sm:px-20 ${divider ? "border-b border-border" : ""}`}
    >
      <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
        {eyebrow}
      </p>
      <h1
        className={`max-w-3xl text-[clamp(40px,7vw,88px)] leading-[0.95] font-extralight tracking-tight text-navy ${titleClassName}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          {subtitle}
        </p>
      )}
    </section>
  );
}
