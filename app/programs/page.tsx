import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Programs | CRAFT",
  description:
    "Aircraft Management — a leaseback program where you own the jet, capture bonus depreciation, and fly the CRAFT fleet while we cover operating costs — plus the Corporate Program for executive teams.",
};

const MANAGEMENT_POINTS = [
  "You own the aircraft — and its bonus depreciation tax benefit",
  "We cover the costs of operating the aircraft",
  "Access to the entire CRAFT Challenger fleet",
];

const CORPORATE_POINTS = [
  "Dedicated account manager",
  "Billing and reporting made easy for corporate structures",
  "A concierge service for busy executive teams",
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={
          <>
            Two Ways to <span className="font-medium">Fly</span>
          </>
        }
        subtitle="Whether you own the aircraft or move a whole executive team, CRAFT builds the program around you — and flies only its own metal, never as a broker."
        divider={false}
      />

      <section className="grid grid-cols-1 gap-8 px-6 pb-24 sm:px-20 lg:grid-cols-2">
        {/* ── Aircraft Management ───────────────────────── */}
        <div className="flex flex-col rounded-3xl glass p-10 sm:p-14">
          <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            For Owners
          </p>
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
            Aircraft <span className="font-medium">Management</span>
          </h2>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
            Structured as a leaseback: you own the airplane, and it flies on
            CRAFT&apos;s Part 135 certificate. We cover the costs of operating
            the aircraft — crew, maintenance, and compliance — while you
            capture the bonus depreciation tax benefit of ownership and get
            access to our entire fleet of Challenger 300, 350, and 3500
            aircraft. You can always fly, even when your jet is down for its
            scheduled maintenance.
          </p>

          <ul className="mt-10 flex flex-col">
            {MANAGEMENT_POINTS.map((point) => (
              <li
                key={point}
                className="border-t border-border py-4 text-[14px] font-light text-navy"
              >
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/programs/management"
            className="mt-auto pt-8 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Talk to Us About Management →
          </Link>
        </div>

        {/* ── Corporate Program ─────────────────────────── */}
        <div className="flex flex-col rounded-3xl glass p-10 sm:p-14">
          <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            For Teams
          </p>
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
            Corporate <span className="font-medium">Program</span>
          </h2>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
            Tailored travel solutions for companies moving executives on their
            own schedule, with dedicated account management built for the way
            corporations operate. We stay flexible around last-minute changes,
            and because you fly the same fleet, your team builds a real,
            intimate relationship with our crews — one reason satisfaction runs
            so high among the companies already flying with us.
          </p>

          <ul className="mt-10 flex flex-col">
            {CORPORATE_POINTS.map((point) => (
              <li
                key={point}
                className="border-t border-border py-4 text-[14px] font-light text-navy"
              >
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/programs/corporate"
            className="mt-auto pt-8 text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Build a Program →
          </Link>
        </div>
      </section>
    </>
  );
}
