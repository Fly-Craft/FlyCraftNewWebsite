import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PreferToTalk from "@/components/PreferToTalk";
import {
  ProgramEnquiryProvider,
  ProgramEnquireButton,
} from "@/components/programs/ProgramEnquiry";
import { PROGRAMS, enquirableProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs | CRAFT",
  description:
    "Aircraft Leaseback, the Fleet Jet Card, the Corporate Program, and the Glidepath exchange fund. Four routes onto the CRAFT Challenger fleet.",
};

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { enquire } = await searchParams;

  /* The Programs nav menu links here with ?enquire=<slug> to open a card's
     form on arrival. Resolved against the known list on the server, so an
     unrecognised value simply opens nothing — the raw parameter is never
     handed to the client or used to build anything. */
  const initialSlug = enquirableProgram(enquire)?.slug;

  return (
    <ProgramEnquiryProvider initialSlug={initialSlug}>
      <PageHero
        eyebrow="Programs"
        title={
          <>
            One Fleet. <span className="font-medium">Many Ways In.</span>
          </>
        }
        subtitle="Whether you own the aircraft, buy hours on the card, move a whole executive team, or come in through the fund, CRAFT builds the program around you. We fly only our own metal, never as a broker."
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

            {/* Contact Us opens the enquiry form in a dialog rather than
                sending you to another page, so you keep your place among
                the cards. Glidepath opts out (`enquire: false`): it's a
                separate company, so its card sends people to Glidepath
                rather than to CRAFT's inbox. */}
            <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pt-8">
              {p.enquire !== false ? (
                <ProgramEnquireButton slug={p.slug} />
              ) : null}
              {p.href && p.cta ? (
                p.externalHref ? (
                  /* Leaves the site, so it says so: a new tab, the outbound
                     arrow, and a note for anyone on a screen reader, who
                     gets no warning from the icon alone. */
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-capsule glass-btn inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-navy uppercase"
                  >
                    {p.cta}
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path
                        d="M5.5 2.5H2.5v9h9v-3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 2.5h3v3M11.5 2.5 6.75 7.25"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className="glass-capsule glass-btn rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-navy uppercase"
                  >
                    {p.cta}
                  </Link>
                )
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </ProgramEnquiryProvider>
  );
}
