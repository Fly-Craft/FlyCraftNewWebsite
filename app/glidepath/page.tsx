import type { Metadata } from "next";
import PreferToTalk from "@/components/PreferToTalk";
import DivergenceChart from "@/components/glidepath/DivergenceChart";
import Reveal from "@/components/glidepath/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Glidepath | CRAFT",
  description:
    "Glidepath is an independent 721 exchange fund. Diversify a concentrated stock position with no tax event, and fly the CRAFT fleet at a preferred hourly rate.",
};

/* ── Published figures ─────────────────────────────────────────
   Everything numeric on this page mirrors glidepath.ai's own
   published example and terms. Verify there before changing;
   never derive figures the fund hasn't published itself. */
const TAX_RANGE = "30–40%";
const PROOF = [
  {
    value: TAX_RANGE,
    label: "of the gain lost to capital gains the day you sell",
  },
  {
    value: "$0",
    label: "tax due at contribution. No management fee, ever",
  },
  {
    value: "§721",
    label: "the section of the tax code that makes it possible",
  },
];

const MOVES = [
  {
    label: "Contribute In-Kind",
    text: "Appreciated stock goes into the fund under Section 721. That's not a sale, so there's no tax event and 100% of your pre-tax balance keeps compounding.",
  },
  {
    label: "Diversify Day One",
    text: "Single-stock risk becomes a diversified portfolio whose assets include the revenue-generating CRAFT fleet.",
  },
  {
    label: "Redeem After 7 Years + 1 Day",
    text: "Exit into liquid ETF shares with carryover basis. The deferral holds until you actually need the cash.",
  },
];

const TERMS = [
  "No management fee",
  "Qualified Purchasers",
  "$100K minimum",
  "7 years + 1 day",
];

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 10 L10 2 M10 2 H4 M10 2 V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The page's one repeated CTA — always navy, always off-site. Navy fill
   is reserved for this so the click-out never competes for attention. */
function GlidepathCta({ label }: { label: string }) {
  return (
    <a
      href={siteConfig.glidepathUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-selected inline-flex items-center gap-3 rounded-full px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-transform duration-300 hover:-translate-y-0.5"
    >
      {label}
      <ArrowIcon />
    </a>
  );
}

export default function GlidepathPage() {
  return (
    <>
      {/* ── Hero — compressed so the chart shares the first viewport ── */}
      <section className="flex flex-col px-6 pt-40 pb-8 sm:px-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col">
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              Glidepath: An Independent 721 Exchange Fund
            </p>
            {/* Set smaller than the other display titles on purpose. This
                one shares its row with Natan's card, so the heading column
                is ~736px at desktop rather than the full width — and
                "Compound everything." is the longest emphasis line on the
                site. At 5.5vw/72px it needed 772px and broke onto a third
                line; 4.6vw/64px keeps the two-line pattern intact. */}
            <h1 className="display-title max-w-4xl text-[clamp(38px,4.1vw,58px)] leading-title font-extralight tracking-tight text-navy">
              Keep more. <span className="font-medium">Compound everything.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
              Exchange a concentrated stock position. No sale, no tax event, and
              access to the CRAFT fleet at a preferred hourly rate.
            </p>
          </div>
          <div className="lg:shrink-0">
            <PreferToTalk />
          </div>
        </div>
      </section>

      {/* ── The Divergence — two paths out of the same $1M ── */}
      <section className="px-6 pb-6 sm:px-20">
        <DivergenceChart />
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <GlidepathCta label="See Your Numbers In 30 Seconds" />
          <p className="max-w-md text-[12px] font-light text-ink-3">
            Projections, eligibility, and closings live at glidepath.ai.
          </p>
        </div>
      </section>

      {/* ── Proof — three numbers in a glass card, same material as the
          rest of the page ── */}
      <section className="px-6 pt-16 pb-8 sm:px-20">
        <div className="rounded-3xl glass p-10 sm:p-14">
          <Reveal>
            <h2 className="max-w-3xl text-[clamp(26px,3.2vw,40px)] leading-tight font-extralight text-navy">
              Concentration built the fortune.{" "}
              <span className="font-medium">
                It&apos;s also the biggest risk to it.
              </span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0">
            {PROOF.map((stat, i) => (
              <Reveal
                key={stat.value}
                delay={i * 120}
                className={
                  i > 0 ? "lg:border-l lg:border-border lg:pl-10" : undefined
                }
              >
                <p className="text-[clamp(40px,4.8vw,64px)] leading-none font-extralight whitespace-nowrap text-navy">
                  {stat.value}
                </p>
                <p className="mt-4 max-w-[240px] text-[10px] font-medium tracking-[0.3em] text-ink-3 uppercase">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The mechanism ── */}
      <section className="px-6 pt-20 pb-8 sm:px-20 sm:pt-24">
        <h2 className="text-[clamp(26px,3vw,36px)] leading-tight font-extralight text-navy">
          Three moves.{" "}
          <span className="font-medium">Seven years. No tax event.</span>
        </h2>

        <div className="relative mt-12">
          {/* the line the three moves sit on */}
          <div className="absolute top-[5px] right-0 left-0 hidden h-px bg-accent/40 sm:block" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {MOVES.map((move, i) => (
              <Reveal key={move.label} delay={i * 120}>
                <span className="relative block h-[11px] w-[11px] rounded-full border border-accent bg-white sm:bg-background" />
                <p className="mt-5 text-[11px] font-medium tracking-[0.25em] text-navy uppercase">
                  {move.label}
                </p>
                <p className="mt-3 max-w-xs text-[13px] font-light leading-relaxed text-ink-2">
                  {move.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {TERMS.map((term) => (
            <span
              key={term}
              className="glass-capsule rounded-full px-4 py-2 text-[10px] font-medium tracking-[0.25em] text-navy uppercase"
            >
              {term}
            </span>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <GlidepathCta label="Run It With Your Ticker" />
          <p className="text-[12px] font-light text-ink-3">
            glidepath.ai. Your projection in 30 seconds.
          </p>
        </div>
      </section>

      {/* ── Operator / fund split + the perk ── */}
      <section className="px-6 pt-16 pb-8 sm:px-20">
        <div className="mx-auto max-w-4xl rounded-3xl glass p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0">
            <div>
              <p className="mb-4 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
                The Operator
              </p>
              <p className="text-[15px] font-light leading-relaxed text-ink-2">
                <span className="font-medium text-navy">CRAFT</span> is a Part
                135 air carrier flying an all-Challenger fleet. When you fly,
                CRAFT is the company operating your aircraft.
              </p>
            </div>
            <div className="border-t border-border pt-8 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
              <p className="mb-4 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
                The Fund
              </p>
              <p className="text-[15px] font-light leading-relaxed text-ink-2">
                <span className="font-medium text-navy">Glidepath</span> is a
                fully independent 721 exchange fund that holds the CRAFT fleet
                among its assets.
              </p>
            </div>
          </div>
          <p className="mt-8 border-t border-border pt-6 text-[15px] font-light leading-relaxed text-ink-2">
            The overlap is the perk.{" "}
            <span className="font-medium text-navy">
              Fund investors fly the CRAFT fleet at a preferred hourly rate
            </span>{" "}
            below public charter pricing. Use it weekly or never; the fund
            works either way.
          </p>
        </div>
      </section>

      {/* ── Closing — reserve a spot ── */}
      <section className="px-6 pt-16 pb-28 sm:px-20">
        <div className="glass-dark mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl p-10 text-center sm:p-14">
          <p className="flex items-center gap-3 text-[11px] font-normal tracking-[0.35em] text-white/60 uppercase">
            <span className="hf-live-dot" />
            Next Closing
          </p>
          <h2 className="max-w-2xl text-[clamp(26px,3vw,36px)] leading-tight font-extralight text-white">
            Allocations are taken in closings.{" "}
            <span className="font-medium">Reserve yours.</span>
          </h2>
          <p className="max-w-xl text-[15px] font-light leading-relaxed text-white/80">
            Eligibility and live projections run at glidepath.ai, along with the
            current closing.
          </p>
          <a
            href={siteConfig.glidepathUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-navy uppercase transition-opacity hover:opacity-85"
          >
            Reserve a Spot
            <ArrowIcon />
          </a>
          <a
            href={siteConfig.glidepathUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-light text-white/60 underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            or see your projection first
          </a>
          <p className="max-w-xl text-[11px] font-light leading-relaxed text-white/50">
            Glidepath is not owned or offered by Craft Charter, LLC. Nothing on
            this page is an offer of securities. Any offer is made solely
            through the fund&apos;s official documents at glidepath.ai.
          </p>
        </div>
      </section>
    </>
  );
}
