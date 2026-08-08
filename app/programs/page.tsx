import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PreferToTalk from "@/components/PreferToTalk";
import { PROGRAMS } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs | CRAFT",
  description:
    "Aircraft Leaseback, the Fleet Jet Card, the Corporate Program, and the Glidepath exchange fund — four routes onto the CRAFT Challenger fleet.",
};

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
            key={p.slug}
            id={p.slug}
            className="flex scroll-mt-32 flex-col rounded-3xl glass p-8 sm:p-10"
          >
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              {p.eyebrow}
            </p>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-tight font-extralight text-navy">
              {p.titleLead}{" "}
              <span className="font-medium">{p.titleEmphasis}</span>
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

            {/* Contact Us is the only way into the programme enquiry form —
                it carries which card you came from, and the form redirects
                to /programs if that slug doesn't resolve. Glidepath opts out
                (`enquire: false`): it's a separate company, so its card
                sends people to Glidepath rather than to CRAFT's inbox. */}
            <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pt-8">
              {p.enquire !== false ? (
                <Link
                  href={`/programs/enquire?program=${p.slug}`}
                  className="glass-selected glass-btn rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-white uppercase"
                >
                  Contact Us
                </Link>
              ) : null}
              {p.href && p.cta ? (
                <Link
                  href={p.href}
                  className="glass-capsule glass-btn rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-navy uppercase"
                >
                  {p.cta}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
