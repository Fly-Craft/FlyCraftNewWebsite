import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Reviews | CRAFT",
  description:
    "What clients, team members, and investors say about CRAFT — charter reviews, employee voices, and investor testimonials.",
};

// Public client ratings — virtualhangar.com operator directory
const CLIENT_RATINGS = [
  { name: "Giuseppe", rating: "5.0", date: "September 2025" },
  { name: "Brenda", rating: "4.66", date: "December 2024" },
  { name: "Amy", rating: "5.0", date: "October 2024" },
  { name: "Paul", rating: "5.0", date: "August 2023" },
];

// Written client reviews — Google
const CLIENT_QUOTES = [
  {
    quote:
      "Smooth and friendly process from booking to touchdown. Gaby was phenomenal with communication and details. Plane was sharp and clients were very happy with crew and flight. Looking forward to more flights.",
    name: "Kevin Valencia",
    date: "August 2025",
  },
  {
    quote:
      "Had an excellent experience with Craft! The team communicated seamlessly, the pilots were punctual for a last-minute trip, the aircraft were top-notch, and most importantly, our clients were happy. Highly recommend!",
    name: "Diego Couttenye",
    date: "February 2025",
  },
];

// Employee voices — public reviews on Indeed
const TEAM_REVIEWS = [
  {
    quote: "A place where pilots grow fast and thrive",
    role: "Check Airman",
    detail: "With CRAFT since 2020 — upgraded to Captain within a year.",
  },
  {
    quote: "Demanding but rewarding",
    role: "Pilot in Command",
    detail: "A company that values independence and proactive problem-solving.",
  },
  {
    quote: "Growing and thriving in a dynamic environment",
    role: "Sales Manager",
    detail: "Collaboration and flexibility in a fast-paced operation.",
  },
  {
    quote: "A supportive culture",
    role: "Pilot",
    detail: "Colleagues who genuinely care about one another — and the travel.",
  },
];

function Stars({ rating }: { rating: string }) {
  const value = parseFloat(rating);
  return (
    <span className="relative inline-block leading-none" aria-label={`${rating} out of 5`}>
      <span className="text-[13px] tracking-[0.15em] text-navy/15">★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-[13px] tracking-[0.15em] text-navy"
        style={{ width: `${(value / 5) * 100}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

const sectionLabel =
  "mb-8 text-center text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase";
const card =
  "rounded-3xl border border-navy/10 bg-white/90 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur";

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={
          <>
            In Their <span className="font-medium">Words</span>
          </>
        }
        subtitle="The people who fly with us and the team behind every flight — collected from public review platforms."
        divider={false}
      />

      {/* ── Clients ─────────────────────────────────────── */}
      <section className="px-6 pb-8 sm:px-20">
        <p className={sectionLabel}>From Our Clients</p>
        <div className={`mx-auto grid max-w-4xl grid-cols-1 gap-8 p-10 sm:p-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14 ${card}`}>
          <div className="flex flex-col items-center gap-3 text-center">
            {/* Weighted across all public platforms:
                Virtual Hangar 4.86×5 + Google 5.0×2 + Indeed 4.4×7 = 4.65 */}
            <span className="text-[64px] leading-none font-extralight text-navy">
              4.65
            </span>
            <Stars rating="4.65" />
            <span className="text-[11px] tracking-[0.2em] text-ink-3 uppercase">
              Overall Rating
            </span>
            <span className="text-[11px] font-light text-ink-3">
              14 reviews across Virtual Hangar,
              <br />
              Google &amp; Indeed
            </span>
          </div>
          <div className="flex flex-col">
            {CLIENT_RATINGS.map((r) => (
              <div
                key={`${r.name}-${r.date}`}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-border py-4 first:border-t-0 first:pt-0 last:pb-0"
              >
                <span className="text-[14px] font-medium text-navy">{r.name}</span>
                <span className="flex items-center gap-3">
                  <Stars rating={r.rating} />
                  <span className="text-[11px] font-light text-ink-3">{r.date}</span>
                </span>
              </div>
            ))}
            <p className="mt-6 border-t border-border pt-5 text-[12px] font-light leading-relaxed text-ink-3">
              CRAFT is ARGUS Platinum rated — the industry&apos;s highest
              safety standard — and flies supplemental lift for the biggest
              names in private aviation.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          {CLIENT_QUOTES.map((r) => (
            <div key={r.name} className={`flex flex-col p-10 ${card}`}>
              <Stars rating="5.0" />
              <p className="mt-5 flex-1 text-[14px] leading-relaxed font-light text-ink-2">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5">
                <span className="text-[13px] font-medium text-navy">{r.name}</span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-ink-3 uppercase">
                  {r.date} · via Google
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-28 sm:px-20">
        <p className={sectionLabel}>From Our Team</p>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
          {TEAM_REVIEWS.map((r) => (
            <div key={r.quote} className={`flex flex-col p-10 ${card}`}>
              <p className="text-[19px] leading-snug font-extralight text-navy">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-4 text-[13px] font-light leading-relaxed text-ink-2">
                {r.detail}
              </p>
              <p className="mt-6 text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                {r.role} · via Indeed
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] font-light leading-relaxed text-ink-3">
          Client reviews via Google and the Virtual Hangar operator
          directory; team reviews via Indeed. All marks belong to their
          respective owners.
        </p>
      </section>
    </>
  );
}
