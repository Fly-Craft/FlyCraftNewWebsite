"use client";

import { useState } from "react";
import SegmentedToggle, { type SegmentedOption } from "@/components/SegmentedToggle";
import CharterBooking from "@/components/charter/CharterBooking";
import ContactForm from "@/components/ContactForm";
import AsapTeam from "@/components/AsapTeam";
import type { Tab } from "@/lib/book-tabs";

const TABS: readonly SegmentedOption<Tab>[] = [
  { id: "contact", label: "Contact Us" },
  { id: "planner", label: "Trip Planner" },
  { id: "asap", label: "ASAP" },
];

/* One headline for all three tabs — only the blurb changes, so the title
   and the toggle never shift as you slide between them. */
const BLURBS: Record<Tab, string> = {
  contact:
    "Send us the outline of your trip and Charter Sales will come back with a quote — or reach them directly if you'd rather talk it through.",
  planner:
    "Tell us the route and timing, tailor the details, and our team comes back with availability and a price built for that specific trip.",
  asap: "When a trip needs to move today, skip the form — call Shaked or Paul directly and they'll price whatever we have available right now.",
};

/**
 * The three ways to start a trip, on one page. Switching rewrites `?tab=`
 * with replaceState — the tab stays shareable and survives a reload
 * without stacking history entries between the visitor and wherever they
 * came from.
 */
export default function BookTabs({ initialTab }: { initialTab: Tab }) {
  // The server already resolved ?tab= (see app/charter/page.tsx), so the
  // correct panel is in the initial HTML — no effect, no wrong-panel flash.
  const [tab, setTab] = useState<Tab>(initialTab);

  function select(next: Tab) {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === "planner") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <section className="flex flex-col px-6 pt-40 pb-8 sm:px-20">
        <h1 className="display-title max-w-3xl text-[clamp(40px,6vw,76px)] leading-title font-extralight tracking-tight text-navy">
          Each Flight is{" "}
          <span className="font-medium">Quoted Uniquely</span>
        </h1>

        {/* All three blurbs share one grid cell, so the block is always as
            tall as the longest one and the toggle below never moves when
            you switch tabs. Only the active blurb is visible — and it
            cross-fades rather than snapping. */}
        <div className="mt-6 grid max-w-xl">
          {TABS.map((t) => (
            <p
              key={t.id}
              aria-hidden={t.id !== tab}
              className={`col-start-1 row-start-1 text-[15px] leading-relaxed font-light text-ink-2 transition-opacity duration-300 ${
                t.id === tab ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {BLURBS[t.id]}
            </p>
          ))}
        </div>

        <div className="mt-10 w-full max-w-xl sm:mx-auto">
          <SegmentedToggle
            options={TABS}
            value={tab}
            onChange={select}
            ariaLabel="How would you like to start?"
            field="book-tab"
            buttonClassName="px-2 py-3 text-[10px] font-medium tracking-[0.16em] whitespace-nowrap uppercase sm:text-[11px]"
          />
        </div>
      </section>

      <section key={`panel-${tab}`} className="page-fade px-6 pb-28 sm:px-20">
        {tab === "planner" && <CharterBooking />}
        {tab === "contact" && <ContactForm />}
        {tab === "asap" && <AsapTeam />}
      </section>
    </>
  );
}
