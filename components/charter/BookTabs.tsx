"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import SegmentedToggle, { type SegmentedOption } from "@/components/SegmentedToggle";
import CharterBooking from "@/components/charter/CharterBooking";
import ContactForm from "@/components/ContactForm";
import AsapTeam from "@/components/AsapTeam";

type Tab = "contact" | "planner" | "asap";

const TABS: readonly SegmentedOption<Tab>[] = [
  { id: "contact", label: "Contact Us" },
  { id: "planner", label: "Trip Planner" },
  { id: "asap", label: "ASAP" },
];

const COPY: Record<Tab, { title: React.ReactNode; blurb: string }> = {
  contact: {
    title: (
      <>
        Get in <span className="font-medium">Touch</span>
      </>
    ),
    blurb:
      "Reach Charter Sales directly, or send us a message and we'll follow up.",
  },
  planner: {
    title: (
      <>
        Plan Your <span className="font-medium">Flight</span>
      </>
    ),
    blurb:
      "Pick your route and timing, tailor the details, and send it to our team — we'll come back with availability and a quote.",
  },
  asap: {
    title: (
      <>
        Need It <span className="font-medium">ASAP?</span>
      </>
    ),
    blurb:
      "When a trip needs to move now, contact our team directly — Shaked and Paul will work to see if we can help.",
  },
};

const isTab = (v: string | null): v is Tab =>
  v === "contact" || v === "planner" || v === "asap";

/**
 * The three ways to start a trip, on one page. `?tab=` keeps a chosen tab
 * shareable and survives a reload; the URL is rewritten with replaceState
 * so switching tabs doesn't stack history entries between the visitor and
 * the page they arrived from.
 */
export default function BookTabs() {
  // useSearchParams rather than reading location in an effect: the initial
  // tab is known at first render, so there's no flash of the wrong panel
  // and no setState-during-effect cascade.
  const params = useSearchParams();
  const fromUrl = params.get("tab");
  const [tab, setTab] = useState<Tab>(isTab(fromUrl) ? fromUrl : "planner");

  function select(next: Tab) {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === "planner") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  }

  const copy = COPY[tab];

  return (
    <>
      <section className="flex flex-col px-6 pt-40 pb-8 sm:px-20">
        <h1 className="max-w-3xl text-[clamp(40px,6vw,76px)] leading-[0.95] font-extralight tracking-tight text-navy">
          {copy.title}
        </h1>
        {/* keyed so the blurb cross-fades with the tab rather than snapping */}
        <p
          key={tab}
          className="page-fade mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2"
        >
          {copy.blurb}
        </p>

        <div className="mt-10 w-full max-w-xl">
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
