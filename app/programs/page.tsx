import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PreferToTalk from "@/components/PreferToTalk";

export const metadata: Metadata = {
  title: "Programs | CRAFT",
  description:
    "Aircraft Leaseback, the Fleet Jet Card, the Corporate Program, and the Glidepath exchange fund — four routes onto the CRAFT Challenger fleet.",
};

type Program = {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  points: string[];
  /** Only Glidepath has a page behind it; the rest are brochures. */
  href?: string;
  cta?: string;
};

/* Leaseback and the Jet Card lead — the two ways onto the fleet that start
   with the aircraft rather than a portfolio or a company. */
const PROGRAMS: Program[] = [
  {
    eyebrow: "For Owners",
    title: (
      <>
        Aircraft <span className="font-medium">Leaseback</span>
      </>
    ),
    body: "You own the airplane, and it flies on CRAFT's Part 135 certificate. We cover the costs of operating the aircraft — crew, maintenance, and compliance — while you capture the bonus depreciation tax benefit of ownership and get access to our entire fleet of Challenger 300, 350, and 3500 aircraft. You can always fly, even when your jet is down for its scheduled maintenance.",
    points: [
      "You own the aircraft — and its bonus depreciation tax benefit",
      "We cover the costs of operating the aircraft",
      "Access to the entire CRAFT Challenger fleet",
    ],
  },
  {
    eyebrow: "For Frequent Flyers",
    title: (
      <>
        Fleet <span className="font-medium">Jet Card</span>
      </>
    ),
    body: "Fleet access at a discounted hourly rate — thousands of dollars an hour below what a broker charges, because there is no broker. You book and communicate directly with the operator flying the aircraft. In exchange, callouts run at least five days ahead, which makes this the right card for people who plan their travel rather than chase it.",
    points: [
      "Thousands per hour less than booking through a broker",
      "Book and communicate directly with the operator",
      "Five-day minimum callout — built for planning ahead",
      "Starting at 25 hours per year",
    ],
  },
  {
    eyebrow: "For Teams",
    title: (
      <>
        Corporate <span className="font-medium">Program</span>
      </>
    ),
    body: "Tailored travel solutions for companies moving executives on their own schedule, with dedicated account management built for the way corporations operate. We stay flexible around last-minute changes, and because you fly the same fleet, your team builds a real, intimate relationship with our crews — one reason satisfaction runs so high among the companies already flying with us.",
    points: [
      "Dedicated account manager",
      "Billing and reporting made easy for corporate structures",
      "A concierge service for busy executive teams",
    ],
  },
  {
    eyebrow: "For Investors",
    title: (
      <>
        Glidepath <span className="font-medium">Exchange Fund</span>
      </>
    ),
    body: "A way into private aviation that starts with your portfolio rather than an aircraft purchase. Investors contribute a concentrated stock position to an exchange fund and diversify it without triggering a taxable event — and membership opens the door to the CRAFT Challenger fleet at exceptionally low hourly rates, with all the access of ownership and none of the tail.",
    points: [
      "Diversify a concentrated stock position without selling",
      "Fleet access at exceptionally low hourly rates",
      "A separate company from CRAFT",
    ],
    href: "/glidepath",
    cta: "Explore Glidepath →",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={
          <>
            One Fleet. <span className="font-medium">Many Ways In.</span>
          </>
        }
        subtitle="Whether you own the aircraft, buy hours on the card, move a whole executive team, or come in through the fund, CRAFT builds the program around you — and flies only its own metal, never as a broker."
        divider={false}
        aside={<PreferToTalk />}
      />

      {/* Two-up: the brochures are long enough that three across squeezed
          the body copy, and it puts Leaseback and the Jet Card on the
          first row where they were asked to sit. */}
      <section className="grid grid-cols-1 gap-8 px-6 pb-24 sm:px-20 lg:grid-cols-2">
        {PROGRAMS.map((p) => (
          <div
            key={p.eyebrow}
            className="flex flex-col rounded-3xl glass p-8 sm:p-10"
          >
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              {p.eyebrow}
            </p>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
              {p.title}
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              {p.body}
            </p>

            <ul className="mt-10 flex flex-col">
              {p.points.map((point) => (
                <li
                  key={point}
                  className="border-t border-border py-4 text-[14px] font-light text-navy"
                >
                  {point}
                </li>
              ))}
            </ul>

            {p.href && p.cta ? (
              <Link
                href={p.href}
                className="mt-auto pt-8 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                {p.cta}
              </Link>
            ) : null}
          </div>
        ))}
      </section>
    </>
  );
}
