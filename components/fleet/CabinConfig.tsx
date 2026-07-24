"use client";

import { useState } from "react";

type Config = { headline: string; img: string };

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
  const [mode, setMode] = useState<"day" | "night">("day");
  const active = mode === "day" ? day : night;
  const activeNote = mode === "day" ? dayNote : nightNote;

  return (
    <div className="flex h-full flex-col text-center">
      <div className="mx-auto flex w-fit rounded-full border border-border p-1">
        {(["day", "night"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors ${
              mode === m
                ? "bg-navy text-white"
                : "text-ink-2 hover:text-navy"
            }`}
          >
            {m === "day" ? "Day" : "Night"}
          </button>
        ))}
      </div>

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
