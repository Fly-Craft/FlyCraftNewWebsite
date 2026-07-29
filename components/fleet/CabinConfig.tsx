"use client";

import { useState } from "react";
import SegmentedToggle, { type SegmentedOption } from "@/components/SegmentedToggle";

type Config = { headline: string; img: string };
type Mode = "day" | "night";

const MODES: SegmentedOption<Mode>[] = [
  { id: "day", label: "Day" },
  { id: "night", label: "Night" },
];

export default function CabinConfig({
  day,
  night,
  dayNote,
  nightNote,
}: {
  day: Config;
  night: Config;
  dayNote?: number;
  nightNote?: number;
}) {
  const [mode, setMode] = useState<Mode>("day");
  const active = mode === "day" ? day : night;
  const activeNote = mode === "day" ? dayNote : nightNote;

  return (
    <div className="flex h-full flex-col text-center">
      <SegmentedToggle
        options={MODES}
        value={mode}
        onChange={setMode}
        ariaLabel="Cabin configuration"
        variant="light"
        fit
        className="mx-auto"
        buttonClassName="px-5 py-2 text-[10px] font-medium tracking-[0.2em] uppercase"
      />

      <div key={mode} style={{ animation: "pageFade 0.3s ease both" }}>
        <p className="mt-6 text-[11px] font-normal tracking-[0.25em] text-ink-3 uppercase">
          {mode === "day" ? "Day Configuration" : "Night Configuration"}
        </p>
        <p className="mt-1 text-[20px] font-light text-navy">
          {active.headline}
          {activeNote && (
            <sup className="ml-0.5 align-super text-[9px] font-normal text-ink-3">
              {activeNote}
            </sup>
          )}
        </p>
        <img
          src={active.img}
          alt={`${mode === "day" ? "Day" : "Night"} configuration — ${active.headline}`}
          className="mt-6 w-full object-contain"
        />
      </div>
    </div>
  );
}
