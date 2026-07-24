import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Glidepath | CRAFT",
  description:
    "Glidepath is an independent 721 exchange fund — diversify a concentrated stock position with no tax event, and unlock the CRAFT fleet at a preferred hourly rate.",
};

const STEPS = [
  {
    n: "1",
    label: "Contribute In-Kind",
    text: "Contribute appreciated stock directly into the fund. Under Section 721 of the tax code that's not a sale — no tax event, and 100% of your pre-tax balance keeps compounding.",
  },
  {
    n: "2",
    label: "Diversify Immediately",
    text: "Your position moves out of single-stock concentration and into a diversified fund whose assets include the revenue-generating CRAFT fleet — with no management fee.",
  },
  {
    n: "3",
    label: "Redeem After 7 Years",
    text: "After 7 years and a day, redeem into liquid ETF shares with carryover basis — the tax deferral holds until you actually need the liquidity.",
  },
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

export default function GlidepathPage() {
  return (
    <>
      <PageHero
        eyebrow="Glidepath"
        title={
          <>
            Keep More. <span className="font-medium">Fly Private.</span>
          </>
        }
        subtitle="Glidepath is an independent exchange fund built on Section 721 — diversify a concentrated stock position with no tax event, and unlock the CRAFT fleet at a preferred hourly rate while you're at it."
        divider={false}
      />

      {/* Prominent link out — projections, eligibility, and closings all live there */}
      <section className="px-6 pb-20 sm:px-20">
        <div className="flex flex-col items-center gap-5 text-center">
          <a
            href={siteConfig.glidepathUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-navy px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85"
          >
            Visit Glidepath.ai
            <ArrowIcon />
          </a>
          <p className="max-w-md text-[12px] font-light text-ink-3">
            Projections, eligibility, and fund closings are handled at
            glidepath.ai — see your numbers in 30 seconds.
          </p>
        </div>
      </section>

      {/* Two different things */}
      <section className="px-6 pb-8 sm:px-20">
        <p className="mb-8 text-center text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
          One Fleet · Two Companies
        </p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-navy/10 bg-white/90 p-10 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur sm:p-14">
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              The Operator
            </p>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
              <span className="font-medium">CRAFT</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              A Part 135 air carrier flying an all-Challenger fleet — charter,
              jet cards, and corporate programs. When you fly, CRAFT is the
              company operating your aircraft.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-navy/10 bg-white/90 p-10 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur sm:p-14">
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              The Fund
            </p>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
              <span className="font-medium">Glidepath</span>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              A completely independent 721 exchange fund that holds the CRAFT
              fleet among its assets. It stands on its own as an investment —
              whether or not you ever step on a plane.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] font-light leading-relaxed text-ink-2">
          They are different things: CRAFT runs the flights, Glidepath runs the
          fund. The overlap is the perk — Glidepath investors get access to the
          CRAFT fleet at a special hourly rate below public charter pricing.
        </p>
      </section>

      {/* How the fund works */}
      <section className="px-6 pt-16 pb-8 sm:px-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-navy/10 bg-white/90 p-10 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur sm:p-14">
          <p className="mb-3 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            How It Works
          </p>
          <h2 className="text-[clamp(26px,3vw,36px)] leading-tight font-extralight text-navy">
            Selling forfeits a third of your gain.{" "}
            <span className="font-medium">Exchanging doesn&apos;t.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-ink-2">
            An exchange fund resolves the sell-or-hold dilemma: instead of
            paying 30–40% in capital gains to escape a concentrated position,
            you exchange it.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="flex flex-col gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/25 text-[12px] font-semibold text-navy">
                  {step.n}
                </span>
                <p className="text-[11px] font-medium tracking-[0.25em] text-navy uppercase">
                  {step.label}
                </p>
                <p className="text-[13px] font-light leading-relaxed text-ink-2">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-border pt-6 text-[12px] font-light leading-relaxed text-ink-3">
            Open to Qualified Purchasers with a $100K minimum contribution.
            Full terms, live projections, and eligibility at glidepath.ai.
          </p>
        </div>
      </section>

      {/* The CRAFT perk + closing CTA */}
      <section className="px-6 pt-16 pb-28 sm:px-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-navy p-10 text-center shadow-[0_24px_80px_rgba(12,29,61,0.25)] sm:p-14">
          <p className="text-[11px] font-normal tracking-[0.35em] text-white/60 uppercase">
            The CRAFT Connection
          </p>
          <h2 className="max-w-2xl text-[clamp(26px,3vw,36px)] leading-tight font-extralight text-white">
            Invest in the fund,{" "}
            <span className="font-medium">fly the fleet for less.</span>
          </h2>
          <p className="max-w-xl text-[15px] font-light leading-relaxed text-white/80">
            Glidepath investors unlock the CRAFT Challenger fleet at a
            preferred hourly rate below what&apos;s offered to the general
            public. Use it every week or never — the fund works either way.
          </p>
          <a
            href={siteConfig.glidepathUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-navy uppercase transition-opacity hover:opacity-85"
          >
            See Your Projection
            <ArrowIcon />
          </a>
          <p className="max-w-xl text-[11px] font-light leading-relaxed text-white/50">
            Glidepath is not owned or offered by Craft Charter, LLC. Nothing on
            this page is an offer of securities — any offer is made solely
            through the fund&apos;s official documents at glidepath.ai.
          </p>
        </div>
      </section>
    </>
  );
}
