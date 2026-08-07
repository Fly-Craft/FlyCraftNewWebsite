import Link from "next/link";
import type { Aircraft } from "@/lib/fleet-aircraft";
import CabinByNumbers from "./CabinByNumbers";
import CabinConfig from "./CabinConfig";
import PhotoStrip from "./PhotoStrip";
import RangeMapCard from "./RangeMapCard";

const card =
  "rounded-3xl glass p-8 sm:p-10";
const cardLabel =
  "mb-6 block text-center text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase";

const FOOTNOTES_300 = [
  "These are best-case figures and may vary depending on weather conditions, aircraft weight, and client-specific requests.",
  "Cruising speed shown is ground speed, assuming no wind.",
  "Standard crew does not include a flight attendant. Optional upon request (additional charges apply).",
  "Flight attendant on board reduces maximum passenger occupancy to 8.",
  "Use of the bed reduces passenger capacity to 7 or 8 passengers, depending if the bed is being used by 1 or 2 occupants.",
  "The maximum cargo compartment allowable load is 750 pounds. If a client arrives with more luggage than the aircraft can accommodate, some items may need to be left behind and not loaded onto the aircraft.",
  "Max range displayed, real range may vary based on a variety of factors such as weight and weather.",
];

const FOOTNOTES_350 = [
  "These are best-case figures and may vary depending on weather conditions, aircraft weight, and client-specific requests.",
  "Cruising speed shown is ground speed, assuming no wind.",
  "Standard crew does not include a flight attendant. Optional upon request (additional charges apply).",
  "Each bed reduces the maximum passenger occupancy by 1, for example if 1 bed is open the maximum passenger occupancy is 7.",
  "The maximum cargo compartment allowable load is 750 pounds. If a client arrives with more luggage than the aircraft can accommodate, some items may need to be left behind and not loaded onto the aircraft.",
  "Available services include live TV (via YouTube TV), as well as Apple TV and Netflix.",
  "Max range displayed, real range may vary based on a variety of factors such as weight and weather.",
];

// Note numbers run in reading order down the page, so inserting one means
// renumbering everything below it. Keep these in step with the FOOTNOTES
// arrays — index n-1 of the array is the note rendered as n.
const NOTE_MAP_300 = {
  performance: 1,
  cruiseSpeed: 2,
  crew: 3,
  dayHeadline: 4,
  nightHeadline: 5,
  luggage: 6,
  appleTv: undefined as number | undefined,
  rangeMap: 7,
};

const NOTE_MAP_350 = {
  performance: 1,
  cruiseSpeed: 2,
  crew: 3,
  dayHeadline: undefined as number | undefined,
  nightHeadline: 4,
  luggage: 5,
  appleTv: 6,
  rangeMap: 7,
};

function Note({ n }: { n?: number }) {
  if (!n) return null;
  return (
    <sup className="ml-0.5 align-super text-[9px] font-normal tracking-normal text-ink-3 normal-case">
      {n}
    </sup>
  );
}

export default function AircraftPage({ a }: { a: Aircraft }) {
  const isThreeFifty = a.model === "350";
  const notes = isThreeFifty ? NOTE_MAP_350 : NOTE_MAP_300;
  const footnotes = isThreeFifty ? FOOTNOTES_350 : FOOTNOTES_300;
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex min-h-[44vh] flex-col items-center justify-end px-6 pt-32 pb-12 text-center sm:px-20">
        <p className="mb-5 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
          POD {a.pod} · {a.tail}
        </p>
        <h1 className="max-w-3xl text-navy uppercase">
          <span className="block text-[clamp(40px,7vw,88px)] leading-[0.95] font-thin tracking-[0.05em]">
            Challenger
          </span>
          <span className="block text-[clamp(40px,7vw,88px)] leading-[0.95] font-extrabold tracking-tight">
            {a.model}
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          The perfectly designed charter aircraft.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          <a
            href={a.tour}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            3D Virtual Tour
          </a>
          {/* ?from carries the aircraft so the menu can offer a way back to
              it — the menu is also reachable from the FAQ and directly, where
              there is no aircraft to return to. */}
          <Link
            href={`/fleet/menu?from=${a.slug}`}
            className="text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Inflight Menu
          </Link>
          <Link
            href="/charter"
            className="text-[11px] font-medium tracking-[0.3em] text-navy uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      {/* ── Photo strip ──────────────────────────────────── */}
      <PhotoStrip images={a.upper} tail={a.tail} />

      {/* ── About / Performance / Details / Cabin ────────── */}
      <section className="grid grid-cols-1 gap-8 px-6 py-16 sm:px-20 lg:grid-cols-2">
        <div className={`${card} text-center`}>
          <span className={cardLabel}>About the Aircraft</span>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[26px] font-extralight text-navy">{a.yom}</div>
              <div className="mt-1 text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                Year of Manufacture
              </div>
            </div>
            <div>
              <div className="text-[26px] font-extralight text-navy">
                {a.refurbished}
              </div>
              <div className="mt-1 text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                Refurbished
              </div>
            </div>
          </div>
        </div>

        <div className={card}>
          <span className={cardLabel}>
            Performance
            <Note n={notes.performance} />
          </span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-center sm:grid-cols-3">
            {a.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[26px] font-extralight text-navy">
                  {s.value}
                  {s.label === "Knots" && <Note n={notes.cruiseSpeed} />}
                  {s.label === "Crew" && <Note n={notes.crew} />}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <span className={cardLabel}>Cabin by Numbers</span>
          <CabinByNumbers />
        </div>

        <div className={card}>
          <span className={cardLabel}>Cabin Configuration</span>
          <CabinConfig
            day={a.day}
            night={a.night}
            dayNote={notes.dayHeadline}
            nightNote={notes.nightHeadline}
          />
        </div>
      </section>

      {/* ── Lower gallery ────────────────────────────────── */}
      {/* Phones get the same swipeable strip as the top gallery — stacked
          full-width, the three photos were most of a screen each. */}
      <div className="pb-12 sm:hidden">
        <PhotoStrip images={a.lower.slice(0, 3)} tail={a.tail} />
      </div>

      {/* Explicit heights everywhere: an auto-sized grid row would let the
          intrinsic image heights overflow the section onto the cards below */}
      <section className="hidden px-6 pb-16 sm:block sm:px-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[3fr_2fr]">
          <img
            src={a.lower[0]}
            alt={`${a.tail} — interior`}
            loading="lazy"
            className="h-64 w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.14)] sm:h-[560px]"
          />
          <div className="grid grid-rows-2 gap-6 sm:h-[560px]">
            {a.lower.slice(1, 3).map((src) => (
              <img
                key={src}
                src={src}
                alt={`${a.tail} — interior detail`}
                loading="lazy"
                className="h-64 w-full min-h-0 rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.14)] sm:h-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Luggage / Amenities ──────────────────────────── */}
      <section className="grid grid-cols-1 gap-8 px-6 pb-16 sm:px-20 lg:grid-cols-2">
        <div className={card}>
          <span className={cardLabel}>
            Luggage Capacity
            <Note n={notes.luggage} />
          </span>
          <div className="flex items-center justify-center gap-8 py-4 text-center">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[32px] font-extralight text-navy">6</div>
                <div className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                  Small Bags
                </div>
              </div>
              <img
                src="/assets/SmallLuggageDark.png?v=2"
                alt="Small luggage"
                className="h-20 object-contain"
              />
            </div>
            <div className="text-[22px] font-extralight text-ink-3">+</div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[32px] font-extralight text-navy">8</div>
                <div className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                  Large Bags
                </div>
              </div>
              <img
                src="/assets/LargeLuggageDark.png?v=2"
                alt="Large luggage"
                className="h-24 object-contain"
              />
            </div>
          </div>
        </div>

        <div className={card}>
          <span className={cardLabel}>Amenities</span>
          {/* items-start: the icon wells are a fixed height, so aligning
              from the top keeps every label on the same line even when a
              column has no sub-caption (e.g. N971MC's Bluetooth). */}
          <div className="grid grid-cols-3 items-start gap-6 py-4 text-center">
            <div>
              <div className="flex h-14 items-center justify-center">
                <img
                  src="/assets/Starlink.png"
                  alt="Starlink"
                  className="max-h-10 object-contain"
                />
              </div>
              <div className="mt-3 text-[13px] font-medium text-navy">
                Starlink
              </div>
              <div className="text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                High Speed WiFi
              </div>
            </div>
            {isThreeFifty ? (
              <div>
                <div className="flex h-14 items-center justify-center">
                  <img
                    src="/assets/AppleTV.png"
                    alt="Apple TV"
                    className="max-h-12 object-contain"
                  />
                </div>
                <div className="mt-3 text-[13px] font-medium text-navy">
                  Apple TV
                  <Note n={notes.appleTv} />
                </div>
                <div className="text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                  In-Flight Entertainment
                </div>
              </div>
            ) : (
              <div>
                <div className="flex h-14 items-center justify-center">
                  <img
                    src="/assets/Bluetooth-13.png"
                    alt="Bluetooth Speakers"
                    className="max-h-12 object-contain"
                  />
                </div>
                <div className="mt-3 text-[13px] font-medium text-navy">
                  Bluetooth Speakers
                </div>
                {a.slug !== "n971mc" && (
                  <div className="text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                    Premium Audio
                  </div>
                )}
              </div>
            )}
            <div>
              <div className="flex h-14 items-center justify-center">
                <img
                  src="/assets/Nespresso.png"
                  alt="Nespresso"
                  className="max-h-12 object-contain"
                />
              </div>
              <div className="mt-3 text-[13px] font-medium text-navy">
                Nespresso
              </div>
              <div className="text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                Premium Coffee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Range map ────────────────────────────────────── */}
      <section className="px-6 pb-12 sm:px-20">
        <div className={card}>
          <span className={cardLabel}>
            Range Map
            <Note n={notes.rangeMap} />
          </span>
          <RangeMapCard rangeNm={a.model === "350" ? 3200 : 3000} />
        </div>
      </section>

      {/* ── Footnotes ────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-20">
        <div className="mx-auto max-w-4xl border-t border-navy/10 pt-8">
          <ol className="space-y-5">
            {footnotes.map((note, i) => (
              <li
                key={i}
                className="flex gap-4 text-[13px] leading-relaxed text-ink-3"
              >
                <span className="w-4 shrink-0">{i + 1}</span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
