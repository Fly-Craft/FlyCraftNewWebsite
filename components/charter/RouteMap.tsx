"use client";

import { useEffect, useRef, useState } from "react";
import { LAND_PATHS } from "@/components/map-data";
import type { Airport } from "@/lib/airports-data";

export type MapRoute = {
  key: string;
  from: Airport;
  to: Airport;
  /** Pill content — first line is emphasized (e.g. distance), rest stack below. */
  lines: string[];
};

export type MapNotice = {
  id: string;
  title: string;
  text: string;
  /** Airport codes for the leg(s) a note applies to, e.g. "TEB → VNY". */
  legs?: string;
};

type Props = {
  routes: MapRoute[];
  pending: Airport[]; // selected airports not yet part of a complete route
  notices?: MapNotice[];
};

function arcGeom(a: Airport, b: Airport) {
  const cx = (a.x + b.x) / 2;
  const lift = Math.hypot(b.x - a.x, b.y - a.y) * 0.22;
  const cy = (a.y + b.y) / 2 - lift;
  return {
    d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`,
    ctrl: { x: cx, y: cy },
    mid: { x: (a.x + 2 * cx + b.x) / 4, y: (a.y + 2 * cy + b.y) / 4 },
  };
}

function bezPoint(a: Airport, ctrl: { x: number; y: number }, b: Airport, t: number) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y,
  };
}

function bezTangent(a: Airport, ctrl: { x: number; y: number }, b: Airport, t: number) {
  return {
    x: 2 * (1 - t) * (ctrl.x - a.x) + 2 * t * (b.x - ctrl.x),
    y: 2 * (1 - t) * (ctrl.y - a.y) + 2 * t * (b.y - ctrl.y),
  };
}

type LabelLayout = {
  a: Airport;
  code: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  w: number;
};

/**
 * Airport code labels default to the side facing away from the rest of the
 * route, but nearby airports (e.g. OPF and FLL) can still collide. Try a
 * ring of candidate offsets around each dot and keep the one that clears
 * every other dot and label already placed.
 */
function layoutEndpointLabels(endpoints: Airport[], midX: number): LabelLayout[] {
  const placed: LabelLayout[] = [];
  const CHAR_W = 8.5;
  const DOT_R = 7;

  for (const a of endpoints) {
    const code = a.iata || a.icao;
    const w = code.length * CHAR_W + 6;
    const h = 15;
    const preferred: "start" | "end" = a.x <= midX ? "end" : "start";

    const candidates: { x: number; y: number; anchor: "start" | "middle" | "end" }[] = [
      { x: a.x + 12, y: a.y + 4, anchor: "start" },
      { x: a.x - 12, y: a.y + 4, anchor: "end" },
      { x: a.x, y: a.y - 14, anchor: "middle" },
      { x: a.x, y: a.y + 22, anchor: "middle" },
      { x: a.x + 12, y: a.y - 12, anchor: "start" },
      { x: a.x - 12, y: a.y - 12, anchor: "end" },
      { x: a.x + 12, y: a.y + 20, anchor: "start" },
      { x: a.x - 12, y: a.y + 20, anchor: "end" },
    ];
    // Natural side first, then its opposite, then the rest.
    candidates.sort((c1, c2) => {
      const score = (c: (typeof candidates)[number]) =>
        c.anchor === preferred ? 0 : c.anchor === "middle" ? 1 : 2;
      return score(c1) - score(c2);
    });

    let best: { x: number; y: number; anchor: "start" | "middle" | "end"; cost: number } | null =
      null;
    for (const c of candidates) {
      const bx = c.anchor === "middle" ? c.x - w / 2 : c.anchor === "end" ? c.x - w : c.x;
      let cost = 0;
      for (const other of endpoints) {
        if (other === a) continue;
        if (Math.hypot(other.x - (bx + w / 2), other.y - c.y) < DOT_R + w / 2) cost += 50;
      }
      for (const p of placed) {
        const pbx = p.anchor === "middle" ? p.x - p.w / 2 : p.anchor === "end" ? p.x - p.w : p.x;
        const overlapX = bx < pbx + p.w && bx + w > pbx;
        const overlapY = Math.abs(c.y - p.y) < h;
        if (overlapX && overlapY) cost += 100;
      }
      cost += candidates.indexOf(c) * 0.1; // stable tiebreak toward preferred side
      if (!best || cost < best.cost) best = { ...c, cost };
      if (best.cost === 0) break;
    }
    const chosen = best ?? { x: a.x + 12, y: a.y + 4, anchor: "start" as const, cost: 0 };
    placed.push({ a, code, x: chosen.x, y: chosen.y, anchor: chosen.anchor, w });
  }

  return placed;
}

function Endpoint({ a, label }: { a: Airport; label: LabelLayout }) {
  return (
    <g>
      <circle cx={a.x} cy={a.y} r="7" fill="#85b5d8" opacity="0.4" />
      <circle cx={a.x} cy={a.y} r="3" fill="#0c1d3d" />
      <text
        x={label.x}
        y={label.y + 4}
        textAnchor={label.anchor}
        fontSize="13"
        fontWeight="600"
        letterSpacing="2"
        fill="#0c1d3d"
      >
        {label.code}
      </text>
    </g>
  );
}

type PillLayout = {
  r: MapRoute;
  x: number; // pill center (px)
  y: number;
  w: number;
  h: number;
};

/**
 * Place each pill beside its route: candidates fan out perpendicular from
 * several points along the arc, and the closest position whose box clears
 * every arc, airport label, and previously placed pill wins. Bubbles never
 * sit on a flight line.
 */
function layoutPills(
  arcs: MapRoute[],
  W: number,
  labels: LabelLayout[],
  reserveNoticeCorner: boolean
): PillLayout[] {
  const s = W / 1000;
  const H = W * 0.64;
  // Bottom-left corner where the notice stack lives. Proportional so it
  // stays sane from narrow stacked layouts up to wide desktop maps; the 3D
  // tilt makes the overlay reach higher in plane coords than on screen.
  const zone = { x: Math.min(420, W * 0.7), y: H - Math.max(160, H * 0.36) };

  // Obstacle points: every arc sampled densely…
  const samples: { x: number; y: number }[] = [];
  for (const r of arcs) {
    const { ctrl } = arcGeom(r.from, r.to);
    for (let i = 0; i <= 28; i++) {
      const p = bezPoint(r.from, ctrl, r.to, i / 28);
      samples.push({ x: p.x * s, y: p.y * s });
    }
  }
  // …plus airport dots and their actual (already-resolved) code labels
  for (const l of labels) {
    samples.push({ x: l.a.x * s, y: l.a.y * s });
    const bx = l.anchor === "middle" ? l.x - l.w / 2 : l.anchor === "end" ? l.x - l.w : l.x;
    samples.push({ x: bx * s, y: l.y * s });
    samples.push({ x: (bx + l.w) * s, y: l.y * s });
  }

  const placed: PillLayout[] = [];

  /**
   * Weighted badness of a candidate box: overlapping another pill is far
   * worse than clipping a flight line, which is worse than sitting in the
   * notice corner. 0 = completely clear.
   */
  const violation = (cx: number, cy: number, w: number, h: number) => {
    let v = 0;
    if (reserveNoticeCorner && cx - w / 2 < zone.x && cy + h / 2 > zone.y) v += 120;
    const mx = w / 2 + 9;
    const my = h / 2 + 9;
    for (const p of samples) {
      if (Math.abs(p.x - cx) < mx && Math.abs(p.y - cy) < my) v += 4;
    }
    for (const q of placed) {
      if (
        Math.abs(q.x - cx) < (q.w + w) / 2 + 10 &&
        Math.abs(q.y - cy) < (q.h + h) / 2 + 10
      )
        v += 500;
    }
    return v;
  };

  for (const r of arcs) {
    const { ctrl, mid } = arcGeom(r.from, r.to);
    const multi = r.lines.length > 1;
    const chars = Math.max(...r.lines.map((l) => l.length));
    const w = chars * 9 + 34;
    const h = multi ? r.lines.length * 22 + 16 : 36;

    // Best clear candidate wins; if the map is too crowded for a clear spot,
    // take the least-bad one (pill overlap weighted heaviest, so it's the
    // absolute last resort).
    let best: { x: number; y: number; cost: number } | null = null;

    // Geographic preference: a mostly north–south route reads best labeled
    // to its east; a mostly east–west route reads best labeled to its
    // north. (Map y grows southward, so "north" is negative y.)
    const rdx = r.to.x - r.from.x;
    const rdy = r.to.y - r.from.y;
    const preferEast = Math.abs(rdy) >= Math.abs(rdx);
    const targetX = preferEast ? 1 : 0;
    const targetY = preferEast ? 0 : -1;

    for (const t of [0.5, 0.38, 0.62, 0.26, 0.74, 0.14, 0.86]) {
      const P = bezPoint(r.from, ctrl, r.to, t);
      const T = bezTangent(r.from, ctrl, r.to, t);
      const tl = Math.hypot(T.x, T.y) || 1;
      let px = -T.y / tl;
      let py = T.x / tl;
      if (px * targetX + py * targetY < 0) {
        px = -px;
        py = -py; // preferred geographic side first
      }
      for (const [ux, uy, sidePenalty] of [
        [px, py, 0],
        [-px, -py, 30],
      ] as [number, number, number][]) {
        for (const extra of [14, 32, 54, 80, 112, 148, 190, 240]) {
          const d = (Math.abs(ux) * w) / 2 + (Math.abs(uy) * h) / 2 + extra;
          const cx = P.x * s + ux * d;
          const cy = P.y * s + uy * d;
          if (cx - w / 2 < 6 || cx + w / 2 > W - 6) continue;
          if (cy - h / 2 < 6 || cy + h / 2 > H - 6) continue;
          const cost =
            violation(cx, cy, w, h) * 1000 +
            extra +
            Math.abs(t - 0.5) * 140 +
            sidePenalty;
          if (!best || cost < best.cost) best = { x: cx, y: cy, cost };
        }
      }
    }

    // Degenerate case (tiny container): pin beside the midpoint, in-panel
    if (!best) {
      best = {
        x: Math.min(W - w / 2 - 6, Math.max(w / 2 + 6, mid.x * s)),
        y: Math.min(H - h / 2 - 6, Math.max(h / 2 + 6, mid.y * s - h)),
        cost: 0,
      };
    }

    placed.push({ r, x: best.x, y: best.y, w, h });
  }

  return placed;
}

/** Leg number from a pill's first line, e.g. "(2) 388 NM · 55 min" → "2". */
function legNumber(r: MapRoute): string | null {
  const m = /^\((\d+)\)/.exec(r.lines[0]);
  return m ? m[1] : null;
}

const BADGE_R = 10.5;

/**
 * Badge positions in viewBox coords. Each badge starts at its arc's midpoint;
 * if that collides with an already-placed badge (close parallel routes), it
 * slides along its own arc until clear — so numbers never stack.
 */
function layoutBadges(arcs: MapRoute[]): { r: MapRoute; x: number; y: number }[] {
  const placed: { r: MapRoute; x: number; y: number }[] = [];
  const MIN_GAP = BADGE_R * 2 + 4;

  for (const r of arcs) {
    const { ctrl } = arcGeom(r.from, r.to);
    let best: { x: number; y: number; sep: number } | null = null;
    for (const t of [0.5, 0.44, 0.56, 0.38, 0.62, 0.32, 0.68, 0.26, 0.74, 0.2, 0.8]) {
      const p = bezPoint(r.from, ctrl, r.to, t);
      const sep = placed.length
        ? Math.min(...placed.map((q) => Math.hypot(q.x - p.x, q.y - p.y)))
        : Infinity;
      if (!best || sep > best.sep) best = { x: p.x, y: p.y, sep };
      if (sep >= MIN_GAP) break; // candidates are ordered center-out; first clear spot wins
    }
    placed.push({ r, x: best!.x, y: best!.y });
  }
  return placed;
}

export default function RouteMap({ routes, pending, notices = [] }: Props) {
  const planeRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = planeRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Unique airports across all legs, west-most labeled to the left
  const endpoints = new Map<string, Airport>();
  for (const r of routes) {
    endpoints.set(r.from.icao || r.from.iata, r.from);
    endpoints.set(r.to.icao || r.to.iata, r.to);
  }
  for (const a of pending) endpoints.set(a.icao || a.iata, a);

  const endpointsArr = Array.from(endpoints.values());
  const xs = endpointsArr.map((a) => a.x);
  const midX = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 500;

  // Drop duplicate arcs (round trip out/back share one path)
  const uniqueArcs = new Map<string, MapRoute>();
  for (const r of routes) {
    const k = [r.from.icao, r.to.icao].sort().join("-");
    if (!uniqueArcs.has(k)) uniqueArcs.set(k, r);
  }

  const arcsArr = Array.from(uniqueArcs.values());
  const badges = arcsArr.length > 1 ? layoutBadges(arcsArr) : [];
  const labels = layoutEndpointLabels(endpointsArr, midX);
  // Five or more legs turns individually-placed bubbles into clutter —
  // switch to a single stacked card cycled with arrows instead.
  const useStack = arcsArr.length >= 5;
  const pills =
    !useStack && width > 0
      ? layoutPills(arcsArr, width, labels, notices.length > 0)
      : [];

  return (
    <div className="relative w-full [perspective:1400px]">
      <div
        ref={planeRef}
        className="relative w-full [transform:rotateX(22deg)] [transform-origin:50%_62%]"
      >
        <svg
          viewBox="0 0 1000 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="rmArcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#85b5d8" />
              <stop offset="100%" stopColor="#0c1d3d" />
            </linearGradient>
            <pattern id="rmGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#0c1d3d" opacity="0.1" />
            </pattern>
          </defs>

          <rect x="40" y="24" width="920" height="592" rx="28" fill="url(#rmGrid)" />
          <rect
            x="40"
            y="24"
            width="920"
            height="592"
            rx="28"
            stroke="#0c1d3d"
            strokeOpacity="0.1"
          />

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

          {arcsArr.map((r) => (
            <path
              key={r.key}
              d={arcGeom(r.from, r.to).d}
              stroke="url(#rmArcGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              className="rm-arc"
            />
          ))}

          {labels.map((l) => (
            <Endpoint key={l.a.icao || l.a.iata} a={l.a} label={l} />
          ))}

          {/* Leg-number badges sit directly on each flight line */}
          {badges.map((b) => {
            const num = legNumber(b.r);
            if (!num) return null;
            return (
              <g key={`badge-${b.r.key}`}>
                <circle
                  cx={b.x}
                  cy={b.y}
                  r={BADGE_R}
                  fill="#ffffff"
                  stroke="#0c1d3d"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                />
                <text
                  x={b.x}
                  y={b.y + 3.8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#0c1d3d"
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>

        {pills.map((p) => (
          <div
            key={p.r.key}
            className={`pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center glass whitespace-nowrap ${
              p.r.lines.length > 1
                ? "gap-0.5 rounded-2xl px-4 py-2.5"
                : "rounded-full px-4 py-2"
            }`}
            style={{
              left: `${p.x.toFixed(1)}px`,
              top: `${p.y.toFixed(1)}px`,
            }}
          >
            <span className="text-[11px] font-semibold tracking-[0.18em] text-navy uppercase">
              {p.r.lines[0]}
            </span>
            {p.r.lines.slice(1).map((l) => (
              <span
                key={l}
                className="text-[10px] font-medium tracking-[0.14em] text-ink-2 uppercase"
              >
                {l}
              </span>
            ))}
          </div>
        ))}

        {useStack && <LegPillStack routes={arcsArr} />}

        {arcsArr.length === 0 && (
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full glass px-5 py-2.5 text-[10px] tracking-[0.28em] whitespace-nowrap text-ink-3 uppercase">
            Select departure &amp; destination
          </div>
        )}
      </div>

      <NoticeStack notices={notices} />
    </div>
  );
}

/**
 * Five or more legs would turn individually-placed bubbles into clutter, so
 * instead show a single stacked card at the top of the map — arrows cycle
 * through each leg's distance/time, one at a time.
 */
function LegPillStack({ routes }: { routes: MapRoute[] }) {
  const [top, setTop] = useState(0);
  const n = routes.length;

  useEffect(() => {
    setTop((t) => (t >= routes.length ? 0 : t));
  }, [routes.length]);

  if (n === 0) return null;
  const idx = Math.min(top, n - 1);
  const r = routes[idx];
  const num = legNumber(r) ?? String(idx + 1);
  const firstLine = r.lines[0].replace(/^\(\d+\)\s*/, "");

  return (
    <div className="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 sm:top-4">
      <div className="relative">
        <div className="absolute inset-0 rotate-2 rounded-2xl glass" />
        <div className="absolute inset-0 -rotate-2 rounded-2xl glass" />
        <div
          key={r.key}
          className="relative flex min-w-[172px] flex-col items-center gap-0.5 whitespace-nowrap rounded-2xl glass px-5 py-3"
          style={{ animation: "pageFade 0.3s ease both" }}
        >
          <span className="text-[9px] font-semibold tracking-[0.25em] text-ink-3 uppercase">
            Leg {num} · {r.from.iata || r.from.icao} → {r.to.iata || r.to.icao}
          </span>
          <span className="text-[12px] font-semibold tracking-[0.16em] text-navy uppercase">
            {firstLine}
          </span>
          {r.lines.slice(1).map((l) => (
            <span
              key={l}
              className="text-[10px] font-medium tracking-[0.12em] text-ink-2 uppercase"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous leg"
          onClick={() => setTop((t) => (t - 1 + n) % n)}
          className="flex h-7 w-7 items-center justify-center rounded-full glass text-[13px] text-navy transition-colors hover:bg-navy-light"
        >
          ←
        </button>
        <span className="text-[10px] tracking-[0.25em] text-ink-3">
          {idx + 1} / {n}
        </span>
        <button
          type="button"
          aria-label="Next leg"
          onClick={() => setTop((t) => (t + 1) % n)}
          className="flex h-7 w-7 items-center justify-center rounded-full glass text-[13px] text-navy transition-colors hover:bg-navy-light"
        >
          →
        </button>
      </div>
    </div>
  );
}

/**
 * Notices pile up bottom-left like a stack of cards — only the top one is
 * readable, arrows flip through the rest, and the map never gets covered
 * by more than one card.
 */
function NoticeStack({ notices }: { notices: MapNotice[] }) {
  const [top, setTop] = useState(0);
  const n = notices.length;

  useEffect(() => {
    setTop((t) => (t >= notices.length ? 0 : t));
  }, [notices.length]);

  if (n === 0) return null;
  const notice = notices[Math.min(top, n - 1)];

  // Shifted right and slightly up for visibility. The rightward move is
  // free, but going much higher runs the card into transcontinental arcs
  // as they descend toward the west coast.
  return (
    <div className="pointer-events-none absolute bottom-5 left-6 z-10 flex w-full max-w-xs flex-col gap-2 sm:bottom-7 sm:left-20">
      <div className="relative">
        {n > 1 && (
          <div className="absolute inset-0 rotate-2 rounded-2xl glass" />
        )}
        {n > 2 && (
          <div className="absolute inset-0 -rotate-2 rounded-2xl glass" />
        )}
        <div
          key={notice.id}
          className="relative rounded-2xl glass px-4 py-3"
          style={{ animation: "pageFade 0.3s ease both" }}
        >
          {notice.legs && (
            <p className="mb-1 text-[10px] font-medium tracking-[0.18em] text-ink-3 uppercase">
              {notice.legs}
            </p>
          )}
          <p className="mb-1 text-[10px] font-semibold tracking-[0.22em] text-navy uppercase">
            {notice.title}
          </p>
          <p className="text-[11px] font-light leading-relaxed text-ink-2">
            {notice.text}
          </p>
        </div>
      </div>

      {n > 1 && (
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous note"
            onClick={() => setTop((t) => (t - 1 + n) % n)}
            className="flex h-7 w-7 items-center justify-center rounded-full glass text-[13px] text-navy transition-colors hover:bg-navy-light"
          >
            ←
          </button>
          <span className="text-[10px] tracking-[0.25em] text-ink-3">
            {Math.min(top, n - 1) + 1} / {n}
          </span>
          <button
            type="button"
            aria-label="Next note"
            onClick={() => setTop((t) => (t + 1) % n)}
            className="flex h-7 w-7 items-center justify-center rounded-full glass text-[13px] text-navy transition-colors hover:bg-navy-light"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
