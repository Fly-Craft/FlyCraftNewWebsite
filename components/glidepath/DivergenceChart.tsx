"use client";

import { useEffect, useRef, useState } from "react";

/* ── Published figures ─────────────────────────────────────────
   Every number on this page comes from glidepath.ai's own $1M NVDA
   example. Never derive intermediate dollar values (endpoints, tax
   dollars) that the fund hasn't published — show the delta only.
   Verify against glidepath.ai before changing. */
const DELTA = 673_595;

const DRAW_MS = 2200;
const COUNT_START = 1300; // counter starts once the lines are ~60% drawn
const COUNT_MS = 1600;

/* The SVG stretches to fill its container (preserveAspectRatio="none"),
   so all text lives in HTML overlays positioned by viewBox percentage —
   labels stay a fixed pixel size no matter how the chart scales. */
const VB_W = 1000;
const VB_H = 420;

// Both paths leave the same origin: the $1M position, today.
const EXCHANGE_D = "M70,300 C300,296 640,245 930,110";
const AREA_D = "M70,300 C300,296 640,245 930,110 L930,370 L70,370 Z";
// Sell drops first (the tax cliff), then compounds from the lower base.
const SELL_D = "M70,300 L82,300 L82,348 C320,342 660,312 930,268";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function PlaneDart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M15 8 L1.5 2.5 L5 8 L1.5 13.5 Z" fill="#0c1d3d" />
    </svg>
  );
}

export default function DivergenceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const exchangeRef = useRef<SVGPathElement>(null);
  const sellClipRef = useRef<SVGRectElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const exch = exchangeRef.current;
    const clip = sellClipRef.current;
    if (!exch || !clip) return;

    const exchLen = exch.getTotalLength();
    const setProgress = (f: number) => {
      exch.style.strokeDasharray = `${exchLen}`;
      exch.style.strokeDashoffset = `${exchLen * (1 - f)}`;
      // The sell line is itself dashed, so its reveal can't reuse the
      // dashoffset trick — a clip rect sweeps it in left-to-right instead.
      clip.setAttribute("width", `${f * VB_W}`);
    };

    const placePlane = (f: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      const p = exch.getPointAtLength(f * exchLen);
      const q = exch.getPointAtLength(Math.max(0, f * exchLen - 2));
      // The SVG is stretched, so the on-screen angle has to be computed
      // in pixel space, not viewBox space.
      const box = containerRef.current?.getBoundingClientRect();
      const dx = ((p.x - q.x) / VB_W) * (box?.width ?? VB_W);
      const dy = ((p.y - q.y) / VB_H) * (box?.height ?? VB_H);
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      plane.style.left = `${(p.x / VB_W) * 100}%`;
      plane.style.top = `${(p.y / VB_H) * 100}%`;
      plane.style.transform = `translate(-50%,-50%) rotate(${deg}deg)`;
    };

    const finish = () => {
      setProgress(1);
      placePlane(1);
      if (counterRef.current) counterRef.current.textContent = fmt(DELTA);
      setDrawn(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    setProgress(0);
    const total = Math.max(DRAW_MS, COUNT_START + COUNT_MS);
    let raf = 0;
    let start: number | null = null;
    let areaShown = false;
    const tick = (now: number) => {
      if (start === null) start = now;
      const el = now - start;
      const df = easeOut(Math.min(1, el / DRAW_MS));
      setProgress(df);
      placePlane(df);
      if (counterRef.current) {
        const cf = Math.min(1, Math.max(0, (el - COUNT_START) / COUNT_MS));
        counterRef.current.textContent = fmt(easeOut(cf) * DELTA);
      }
      if (!areaShown && el >= DRAW_MS * 0.55) {
        areaShown = true;
        setDrawn(true);
      }
      if (el < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const micro =
    "text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase";

  return (
    <div
      className="w-full"
      role="img"
      aria-label={`Chart: exchanging a $1,000,000 position under Section 721 instead of selling it leaves ${fmt(DELTA)} more value at year seven. Illustrative — assumptions at glidepath.ai.`}
    >
      {/* The delta readout sits above the plot rather than inside it —
          overlaid, its third line landed on the exchange curve's tip. */}
      <div className="flex flex-col items-end text-right">
        <span
          ref={counterRef}
          className="block text-[clamp(30px,4.2vw,54px)] leading-none font-extralight tracking-tight text-navy tabular-nums"
        >
          $0
        </span>
        <span className="mt-3 block text-[9px] font-medium tracking-[0.22em] text-ink-3 uppercase sm:text-[10px]">
          More at year 7 · $1M NVDA position
        </span>
        <span className="mt-1.5 block text-[10px] font-light text-ink-3">
          Illustrative — assumptions at glidepath.ai
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative mt-7 h-[clamp(230px,36vh,340px)] w-full"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gpLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0c1d3d" />
              <stop offset="100%" stopColor="#85b5d8" />
            </linearGradient>
            <linearGradient id="gpArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#85b5d8" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#85b5d8" stopOpacity="0" />
            </linearGradient>
            <clipPath id="gpSellClip">
              <rect ref={sellClipRef} x="0" y="0" width="0" height={VB_H} />
            </clipPath>
          </defs>

          <path
            d={AREA_D}
            fill="url(#gpArea)"
            className={`transition-opacity duration-700 ${drawn ? "opacity-100" : "opacity-0"}`}
          />

          {/* baseline */}
          <line
            x1="40"
            y1="370"
            x2="960"
            y2="370"
            stroke="#0c1d3d"
            strokeOpacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
          {/* the redemption threshold — year 7 + 1 day */}
          <line
            x1="930"
            y1="70"
            x2="930"
            y2="370"
            stroke="#0c1d3d"
            strokeOpacity="0.15"
            strokeDasharray="2 6"
            vectorEffect="non-scaling-stroke"
          />

          <g clipPath="url(#gpSellClip)">
            <path
              d={SELL_D}
              stroke="#0c1d3d"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="2 6"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <path
            ref={exchangeRef}
            d={EXCHANGE_D}
            stroke="url(#gpLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* delta bracket between the two endings */}
          <g
            stroke="#0c1d3d"
            strokeOpacity="0.4"
            className={`transition-opacity duration-500 ${drawn ? "opacity-100" : "opacity-0"}`}
          >
            <line
              x1="944"
              y1="110"
              x2="944"
              y2="268"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="938"
              y1="110"
              x2="950"
              y2="110"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="938"
              y1="268"
              x2="950"
              y2="268"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>

        {/* the plane rides the tip of the exchange line */}
        <span
          ref={planeRef}
          className="absolute"
          style={{
            left: "7%",
            top: "71.4%",
            transform: "translate(-50%,-50%)",
          }}
          aria-hidden="true"
        >
          <PlaneDart />
        </span>

        {/* ── HTML annotations ──
          Positioned by percentage against the plot's own box. The two
          curves leave a common origin at 71% and the baseline sits at
          88%, so the origin label goes ABOVE the origin (below it runs
          the dotted tax-cliff drop) and the axis row goes below the
          baseline, clear of every stroke. */}
        <span className={`absolute left-[4%] top-[57%] ${micro}`}>
          $1,000,000<span className="hidden sm:inline"> · Today</span>
        </span>
        <span className={`absolute right-[3%] top-[91%] ${micro}`}>
          Year 7 + 1 Day
        </span>
        <span className="absolute left-[4%] top-[91%] hidden text-[11px] font-light text-ink-3 sm:block">
          the tax hit — capital gains due the day you sell
        </span>
        <span
          className={`absolute left-[56%] top-[78%] hidden sm:block ${micro}`}
        >
          Sell
        </span>
        <span className="absolute left-[56%] top-[44%] hidden text-[10px] font-medium tracking-[0.25em] text-navy/70 uppercase sm:block">
          Exchange — §721
        </span>
      </div>
    </div>
  );
}
