"use client";

import { useState } from "react";

const DEBRIEFS = [
  { src: "/safety/debrief-1.png", alt: "Redacted CRAFT owner flight delay report" },
  { src: "/safety/debrief-2.png", alt: "Redacted CRAFT rejected take-off report" },
  { src: "/safety/debrief-3.png", alt: "Redacted CRAFT incident report" },
];

// Visual treatment by stack depth: 0 = top card, then fanned behind
const DEPTH_CLASSES = [
  "rotate-0 z-30 shadow-[0_24px_72px_rgba(12,29,61,0.22)]",
  "rotate-3 z-20 shadow-[0_16px_48px_rgba(12,29,61,0.16)]",
  "-rotate-6 z-10 shadow-[0_16px_48px_rgba(12,29,61,0.16)]",
];

export default function DebriefStack() {
  const [top, setTop] = useState(0);
  const n = DEBRIEFS.length;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      <div className="relative aspect-[1184/1544] w-full">
        {DEBRIEFS.map((d, i) => {
          const depth = (i - top + n) % n;
          return (
            <img
              key={d.src}
              src={d.src}
              alt={d.alt}
              className={`absolute inset-0 w-full rounded-2xl border border-navy/10 transition-transform duration-500 ease-out ${DEPTH_CLASSES[depth]}`}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Previous debrief"
          onClick={() => setTop((t) => (t - 1 + n) % n)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-[16px] text-navy transition-colors hover:bg-navy-light"
        >
          ←
        </button>
        <span className="w-10 text-center text-[11px] tracking-[0.25em] text-ink-3">
          {top + 1} / {n}
        </span>
        <button
          type="button"
          aria-label="Next debrief"
          onClick={() => setTop((t) => (t + 1) % n)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-[16px] text-navy transition-colors hover:bg-navy-light"
        >
          →
        </button>
      </div>
    </div>
  );
}
