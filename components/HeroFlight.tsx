"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LAND_PATHS, MAP_CITIES } from "@/components/map-data";
import { TRIPS, TRIP_POINTS } from "@/components/trips-data";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function arcPath(a: [number, number], b: [number, number]): string {
  const mx = (a[0] + b[0]) / 2;
  const lift = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.22;
  const my = (a[1] + b[1]) / 2 - lift;
  // Round the control point: Math.hypot isn't required to be correctly
  // rounded, so Node and the browser can disagree in the last bit and
  // React reports a hydration mismatch on every arc.
  const r = (n: number) => Math.round(n * 100) / 100;
  return `M ${a[0]} ${a[1]} Q ${r(mx)} ${r(my)} ${b[0]} ${b[1]}`;
}

// Legs to airports beyond the map frame (Europe, South America…) still count
// in the ticker but aren't drawn — clipped arcs read as visual noise.
const onMap = (p: [number, number]) =>
  p[0] >= 0 && p[0] <= 1000 && p[1] >= 0 && p[1] <= 640;

const seg = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

// Intro (plane + map reveal) plays over the first 45% of the scroll;
// the 2025 trips draw chronologically over the rest.
const INTRO_END = 0.45;
const TRIPS_START = 0.47;
const TRIPS_END = 0.97;

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The cloud deck the plane rests on. Three depth layers — small slow
 * wisps up high, mid clouds, and big fast ones low — each assigned to
 * the left or right half of the split. `speed` is how far (vw) a cloud
 * travels when the deck parts: near clouds move farther and scale up
 * more, which sells the parallax. Clouds from both halves overlap the
 * center seam so the split is invisible at rest.
 */
type CloudSpec = {
  src: number;
  left: number; // vw
  top: number; // vh
  w: number; // vw
  side: -1 | 1;
  speed: number; // vw travelled at full split
  op: number;
  flip?: boolean;
  dur: number; // idle drift seconds
  delay?: number;
};

const CLOUDS: CloudSpec[] = [
  // far layer — high, small, slow
  { src: 8, left: 8, top: 20, w: 13, side: -1, speed: 55, op: 0.7, dur: 26 },
  { src: 2, left: 32, top: 16, w: 16, side: -1, speed: 50, op: 0.75, dur: 30, delay: -8 },
  { src: 8, left: 58, top: 19, w: 14, side: 1, speed: 55, op: 0.7, flip: true, dur: 24, delay: -14 },
  // mid layer
  { src: 1, left: 1, top: 30, w: 22, side: -1, speed: 72, op: 0.92, dur: 22 },
  { src: 3, left: 66, top: 27, w: 24, side: 1, speed: 76, op: 0.92, dur: 25, delay: -6 },
  { src: 2, left: 46, top: 28, w: 20, side: 1, speed: 66, op: 0.85, flip: true, dur: 28, delay: -12 },
  // near layer — low, big, fast (these carry the split)
  { src: 6, left: 34, top: 42, w: 33, side: 1, speed: 96, op: 1, dur: 18 },
  { src: 4, left: 6, top: 44, w: 30, side: -1, speed: 100, op: 1, dur: 20, delay: -5 },
  { src: 7, left: 70, top: 45, w: 28, side: 1, speed: 92, op: 1, dur: 19, delay: -9 },
  { src: 5, left: -6, top: 50, w: 26, side: -1, speed: 88, op: 0.97, dur: 21, delay: -3 },
  { src: 5, left: 86, top: 55, w: 20, side: 1, speed: 84, op: 0.92, flip: true, dur: 23, delay: -11 },
  { src: 1, left: 33, top: 52, w: 24, side: -1, speed: 90, op: 0.97, flip: true, dur: 20, delay: -7 },
];

export default function HeroFlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);
  const starlinkRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const trailLRef = useRef<HTMLSpanElement>(null);
  const trailRRef = useRef<HTMLSpanElement>(null);
  const trailsRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tripsTitleRef = useRef<HTMLDivElement>(null);
  const tripsMonthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const plane = planeRef.current;
    const starlink = starlinkRef.current;
    const title = titleRef.current;
    const map = mapRef.current;
    const trails = trailsRef.current;
    const trailL = trailLRef.current;
    const trailR = trailRRef.current;
    const hint = hintRef.current;
    const svg = svgRef.current;
    const tripsTitle = tripsTitleRef.current;
    const tripsMonth = tripsMonthRef.current;
    if (
      !section || !plane || !starlink || !title || !map || !trails ||
      !trailL || !trailR || !hint || !svg || !tripsTitle || !tripsMonth
    )
      return;

    const clouds = cloudsRef.current;
    // Skip clouds hidden by CSS (mobile shows fewer) — no wasted style writes
    const cloudEls = clouds
      ? Array.from(clouds.querySelectorAll<HTMLDivElement>(".hf-cloud"))
          .filter((el) => el.offsetParent !== null)
          .map((el) => ({
            el,
            side: Number(el.dataset.side),
            speed: Number(el.dataset.speed),
            op: Number(el.dataset.op),
          }))
      : [];

    // Mobile: the clip-path wipe is recomputed every frame and janks on
    // phone GPUs — fall back to the plain opacity fade there.
    const mobileMq = window.matchMedia("(max-width: 640px)");

    const cities = Array.from(svg.querySelectorAll<SVGGElement>(".hf-city"));
    // Sparse: indexed by chronological trip index; off-map legs have no path
    const tripEls: (SVGPathElement | undefined)[] = [];
    svg.querySelectorAll<SVGPathElement>(".hf-trip").forEach((el) => {
      tripEls[Number(el.dataset.i)] = el;
    });
    const n = TRIPS.length;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      map.style.opacity = "1";
      map.style.clipPath = "none";
      plane.style.opacity = "0.9";
      hint.style.display = "none";
      tripsTitle.style.opacity = "1";
      tripsMonth.textContent = `December · ${n.toLocaleString()} flights`;
      tripEls.forEach((t) => {
        if (!t) return;
        t.style.strokeDashoffset = "0";
        t.style.opacity = "0.3";
      });
      return;
    }

    cities.forEach((c) => (c.style.opacity = "0"));

    let lastVisible = 0;
    let lastMonthText = "";
    let ticking = false;
    let planeFlying = false;
    let lastMapTransform = "";
    let cloudsIdle = false;

    function apply() {
      ticking = false;
      const vh = window.innerHeight;
      const rect = section!.getBoundingClientRect();
      const total = rect.height - vh;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const ip = Math.min(1, p / INTRO_END); // intro-phase progress

      // Headline fades out as soon as scrolling starts
      const tOut = seg(ip, 0, 0.14);
      title!.style.opacity = `${1 - tOut}`;
      title!.style.transform = `translate(-50%, ${tOut * -28}px)`;

      // Starlink badge below the plane fades the instant the flight begins
      starlink!.style.opacity = `${1 - seg(ip, 0, 0.08)}`;

      // Cloud deck parts down the middle as the plane accelerates: each
      // half slides out its own side with parallax (near clouds travel
      // farther and swell slightly), sinking a touch as they pass under
      // the camera, then fading to hand the stage to the map.
      const split = smooth(seg(ip, 0.05, 0.5));
      const cloudFade = 1 - smooth(seg(ip, 0.3, 0.52));
      // Once fully faded, stop touching the cloud layers entirely
      if (cloudFade > 0 || !cloudsIdle) {
        for (const c of cloudEls) {
          c.el.style.transform = `translate3d(${c.side * split * c.speed}vw, ${
            split * c.speed * 0.14
          }vh, 0) scale(${1 + split * (c.speed / 260)})`;
          c.el.style.opacity = `${c.op * cloudFade}`;
        }
        cloudsIdle = cloudFade <= 0;
      }

      // Plane flies toward the viewer, then past the camera
      const fly = seg(ip, 0, 0.5);
      const scale = 1 + fly * 2.6;
      const drop = fly * 18;
      plane!.style.transform = `translate(-50%, ${drop}vh) scale(${scale})`;
      plane!.style.opacity = `${1 - seg(ip, 0.42, 0.6)}`;

      // Promote to a composited layer only while flying — at rest the layer
      // is released so the multiply-blended wireframe rasterizes sharply on
      // high-DPI displays instead of being upscaled from a base-size texture.
      const flying = fly > 0.001;
      if (flying !== planeFlying) {
        plane!.style.willChange = flying ? "transform, opacity" : "auto";
        planeFlying = flying;
      }

      // Contrails stream back toward the horizon
      const trailGrow = seg(ip, 0.04, 0.5);
      trails!.style.opacity = `${seg(ip, 0.04, 0.14) * (1 - seg(ip, 0.5, 0.64))}`;
      const spread = 14 + trailGrow * 56;
      const tilt = 4 + trailGrow * 4;
      trailL!.style.height = `${trailGrow * 38}vh`;
      trailR!.style.height = `${trailGrow * 38}vh`;
      trailL!.style.transform = `translateX(${-spread}px) rotate(${tilt}deg)`;
      trailR!.style.transform = `translateX(${spread}px) rotate(${-tilt}deg)`;

      // Map reveal: contrail wake wipes it open
      const mapIn = seg(ip, 0.16, 0.34);
      const wake = seg(ip, 0.18, 0.62);
      const settle = seg(ip, 0.16, 0.7);
      map!.style.opacity = `${mapIn}`;
      // Skip redundant transform writes once the map has settled
      const mapTransform = `rotateX(${50 - settle * 12}deg) scale(${0.9 + settle * 0.14})`;
      if (mapTransform !== lastMapTransform) {
        map!.style.transform = mapTransform;
        lastMapTransform = mapTransform;
      }
      map!.style.clipPath = mobileMq.matches
        ? "none"
        : wake >= 1
          ? "none"
          : `polygon(${50 - 100 * wake}% 0%, ${50 + 100 * wake}% 0%, ${50 + 170 * wake}% 100%, ${50 - 170 * wake}% 100%)`;

      // City dots + labels pop in (statically visible on mobile via CSS)
      if (!mobileMq.matches) {
        cities.forEach((c, i) => {
          c.style.opacity = `${seg(ip, 0.75 + i * 0.01, 0.85 + i * 0.01)}`;
        });
      }

      // ── 2025 trips, chronological ──────────────────────
      const tp = seg(p, TRIPS_START, TRIPS_END);
      const visible = Math.round(tp * n);

      // Mobile shows the whole network as one frozen, pre-drawn layer
      // (see globals.css) — only the counter below animates.
      if (!mobileMq.matches && visible !== lastVisible) {
        if (visible > lastVisible) {
          for (let i = lastVisible; i < visible; i++) {
            const el = tripEls[i];
            if (!el) continue;
            el.style.strokeDashoffset = "0";
            el.style.opacity = "0.3";
          }
        } else {
          for (let i = visible; i < lastVisible; i++) {
            const el = tripEls[i];
            if (!el) continue;
            el.style.strokeDashoffset = "1";
            el.style.opacity = "0";
          }
        }
        lastVisible = visible;
      }

      tripsTitle!.style.opacity = `${seg(p, 0.42, 0.5)}`;
      const monthText =
        visible > 0
          ? `${MONTHS[TRIPS[visible - 1][0]]} · ${visible.toLocaleString()} flights`
          : "January";
      if (monthText !== lastMonthText) {
        tripsMonth!.textContent = monthText;
        lastMonthText = monthText;
      }

      hint!.style.opacity = `${1 - seg(p, 0, 0.04)}`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hf-section">
      <div className="hf-sticky">
        {/* Tilted holographic map */}
        <div className="hf-map-persp">
          <div ref={mapRef} className="hf-map">
            <svg
              ref={svgRef}
              viewBox="0 0 1000 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hfArcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#85b5d8" />
                  <stop offset="100%" stopColor="#0c1d3d" />
                </linearGradient>
                <pattern id="hfGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.2" fill="#0c1d3d" opacity="0.1" />
                </pattern>
              </defs>

              {/* Hologram floor panel */}
              <rect
                className="hf-frame"
                x="40"
                y="24"
                width="920"
                height="592"
                rx="28"
                fill="url(#hfGrid)"
              />
              <rect
                className="hf-frame"
                x="40"
                y="24"
                width="920"
                height="592"
                rx="28"
                stroke="#0c1d3d"
                strokeOpacity="0.1"
              />

              {/* Real North America — Natural Earth geometry, Albers projection */}
              <g
                stroke="#0c1d3d"
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeLinejoin="round"
                fill="#0c1d3d"
                fillOpacity="0.03"
              >
                {LAND_PATHS.map((c) => (
                  <path key={c.name} d={c.d} />
                ))}
              </g>

              {/* Real 2025 CRAFT flight legs, chronological */}
              <g stroke="url(#hfArcGrad)" strokeWidth="0.9" strokeLinecap="round">
                {TRIPS.map(([, a, b], i) =>
                  onMap(TRIP_POINTS[a]) && onMap(TRIP_POINTS[b]) ? (
                    <path
                      key={i}
                      data-i={i}
                      className="hf-trip"
                      d={arcPath(TRIP_POINTS[a], TRIP_POINTS[b])}
                      pathLength={1}
                    />
                  ) : null
                )}
              </g>

              {/* Cities */}
              <g>
                {MAP_CITIES.map((c) => (
                  <g key={c.id} className="hf-city">
                    <circle
                      className="hf-dot-halo"
                      cx={c.x}
                      cy={c.y}
                      r="7"
                      fill="#85b5d8"
                      opacity="0.35"
                    />
                    <circle cx={c.x} cy={c.y} r="2.6" fill="#0c1d3d" />
                    <text
                      x={c.x + (c.anchor === "end" ? -10 : 10)}
                      y={c.y + (c.labelDy ?? 4)}
                      textAnchor={c.anchor ?? "start"}
                      fontSize="11"
                      letterSpacing="2"
                      fill="#0c1d3d"
                      fillOpacity="0.5"
                      style={{ textTransform: "uppercase" }}
                    >
                      {c.name}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* 2025 trips title */}
        <div ref={tripsTitleRef} className="hf-trips-title">
          <p className="text-[clamp(20px,2.6vw,32px)] font-extralight tracking-tight text-navy">
            Real Craft Trips <span className="font-medium">in 2025</span>
          </p>
          <span
            ref={tripsMonthRef}
            className="text-[11px] font-medium tracking-[0.3em] text-ink-3 uppercase"
          />
        </div>

        {/* Cloud deck — parts down the middle on scroll to reveal the map */}
        <div ref={cloudsRef} className="hf-clouds" aria-hidden="true">
          {CLOUDS.map((c, i) => (
            <div
              key={i}
              className="hf-cloud"
              data-side={c.side}
              data-speed={c.speed}
              data-op={c.op}
              style={{
                left: `${c.left}vw`,
                top: `${c.top}vh`,
                width: `${c.w}vw`,
                opacity: c.op,
              }}
            >
              <div
                className={`hf-cloud-drift${c.flip ? " hf-cloud-flip" : ""}`}
                style={
                  {
                    "--drift-dur": `${c.dur}s`,
                    "--drift-delay": `${c.delay ?? 0}s`,
                    "--drift-x": `${c.side * 22}px`,
                    "--drift-y": `${i % 2 ? -10 : 8}px`,
                  } as React.CSSProperties
                }
              >
                <img src={`/clouds/${c.src}.webp`} alt="" loading="eager" />
              </div>
            </div>
          ))}
        </div>

        {/* Contrails */}
        <div ref={trailsRef} className="hf-trails">
          <span ref={trailLRef} />
          <span ref={trailRRef} />
        </div>

        {/* The jet */}
        <img
          ref={planeRef}
          src="/plane.png"
          alt="CRAFT Challenger 300/350 front-view technical wireframe"
          className="hf-plane"
        />

        {/* Starlink — our flagship in-cabin feature, sits under the plane */}
        <div ref={starlinkRef} className="hf-starlink">
          <span className="text-[11px] font-normal tracking-[0.3em] text-ink-3 uppercase">
            Equipped with Starlink
          </span>
        </div>

        {/* Headline */}
        <div ref={titleRef} className="hf-title">
          <p className="mb-6 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Welcome to
          </p>
          <h1 className="text-[clamp(40px,7vw,96px)] leading-[0.95] font-bold tracking-[0.01em] text-navy uppercase">
            CRAFT
          </h1>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="w-64 rounded-full border border-navy/20 px-8 py-4 text-center text-[11px] font-medium tracking-[0.3em] text-navy uppercase transition-colors hover:bg-navy-light"
            >
              Contact Us
            </Link>
            <Link
              href="/charter"
              className="w-64 rounded-full border border-navy/20 px-8 py-4 text-center text-[11px] font-medium tracking-[0.3em] text-navy uppercase transition-colors hover:bg-navy-light"
            >
              Request a Quote
            </Link>
            <Link
              href="/asap"
              className="w-64 rounded-full border border-navy/20 px-8 py-4 text-center text-[11px] font-medium tracking-[0.3em] text-navy uppercase transition-colors hover:bg-navy-light"
            >
              ASAP
            </Link>
          </div>
        </div>

        <div ref={hintRef} className="hf-hint">
          Scroll
          <span className="hf-hint-line" />
        </div>
      </div>
    </section>
  );
}
