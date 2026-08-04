import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Careers | CRAFT",
  description:
    "CRAFT hires for character first. We're always looking for captains and first officers, A&P maintenance technicians, and dispatch, client services, and sales people at our Opa-locka home base.",
};

const ROLES = [
  {
    eyebrow: "Flight Deck",
    title: (
      <>
        Captains &<br />
        <span className="font-medium">First Officers</span>
      </>
    ),
    body: "Every CRAFT flight is flown under Part 135 on a Challenger 300, 350, or 3500 — including owner trips, where the rules would allow less. Our captains hold the final word on every go decision, and we back them when they use it. You'll fly a streamlined fleet with the same crews and the same clients, week after week.",
    points: [
      "PIC — minimum 2,500 total flight hours",
      "SIC — minimum 500 total flight hours",
      "Current FAA ATP or Commercial certificate with first-class medical",
      "Challenger type rating welcome, not required",
    ],
  },
  {
    eyebrow: "Maintenance",
    title: (
      <>
        A&P
        <br />
        <span className="font-medium">Technicians</span>
      </>
    ),
    body: "CRAFT runs its own maintenance in-house at Opa-locka rather than farming it out. The same technicians see the same airframes month after month — they know every aircraft's history because they wrote it. Nothing is deferred that shouldn't be, and nothing flies until the people who know it best are satisfied.",
    points: [
      "FAA Airframe & Powerplant certificate",
      "Challenger or comparable large-cabin experience preferred",
      "Part 135 maintenance program familiarity",
      "Based at our Opa-locka home base",
    ],
  },
  {
    eyebrow: "Office",
    title: (
      <>
        Dispatch, Client
        <br />
        <span className="font-medium">Services & Sales</span>
      </>
    ),
    body: "The team on the ground is why trips feel effortless in the air. Dispatchers build and watch every trip end to end; client services know each passenger's preferences before they board; sales carry the relationships that keep the fleet flying. All three sit together, so nothing gets lost in a handoff.",
    points: [
      "Dispatchers — flight planning, permits, and trip oversight",
      "Client Services — passenger care from first call to landing",
      "Sales — charter, corporate, and wholesale relationships",
      "Aviation experience valued; the right person can be taught the rest",
    ],
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            We Hire for <span className="font-medium">Character.</span>
          </>
        }
        subtitle="CRAFT is always looking for people in three places: the flight deck, the hangar, and the office. Skill is the price of entry — the people who last here are the ones their colleagues are glad to see."
        divider={false}
      />

      <section className="grid grid-cols-1 gap-8 px-6 pb-16 sm:px-20 lg:grid-cols-3">
        {ROLES.map((role) => (
          <div
            key={role.eyebrow}
            className="flex flex-col rounded-3xl glass p-10 sm:p-12"
          >
            <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
              {role.eyebrow}
            </p>
            <h2 className="text-[clamp(26px,2.6vw,34px)] leading-tight font-extralight text-navy">
              {role.title}
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ink-2">
              {role.body}
            </p>

            <ul className="mt-8 flex flex-col">
              {role.points.map((point) => (
                <li
                  key={point}
                  className="border-t border-border py-4 text-[14px] font-light text-navy"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── How to apply ─────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl glass p-10 text-center sm:p-14">
          <p className="text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            How to Apply
          </p>
          <h2 className="text-[clamp(24px,3vw,36px)] leading-tight font-extralight text-navy">
            Send us your résumé.
          </h2>
          <p className="max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
            Tell us which of the three you&apos;re after and what you&apos;ve
            flown, fixed, or run. We read everything that comes in, and we
            keep good people on file even when the timing isn&apos;t right.
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}?subject=Careers%20at%20CRAFT`}
            className="mt-2 rounded-full glass-selected px-9 py-4 text-[12px] font-medium tracking-[0.3em] text-white uppercase transition-transform duration-300 hover:-translate-y-0.5"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}
