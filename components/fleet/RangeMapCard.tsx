"use client";

import { useMemo, useState } from "react";
import AirportSearch from "@/components/charter/AirportSearch";
import { RANGE_LAND_PATHS } from "@/components/range-map-data";
import { AIRPORTS, type Airport } from "@/lib/airports-data";
import { rangeProjection, rangeRingPath } from "@/lib/map-projection";

const DEFAULT_ORIGIN = AIRPORTS.find((a) => a.iata === "TEB") ?? null;

/** Kill server/client floating-point tail mismatches before hydration. */
const round1 = (n: number) => Math.round(n * 10) / 10;

// Notable cities shown for scale — a fixed reference frame the ring is
// measured against, independent of the selected origin.
const REFERENCE_CITIES: {
  name: string;
  lat: number;
  lon: number;
  anchor: "start" | "end";
  labelDy?: number;
}[] = [
  { name: "Vancouver", lat: 49.28, lon: -123.12, anchor: "end", labelDy: -5 },
  { name: "Seattle", lat: 47.61, lon: -122.33, anchor: "end", labelDy: 8 },
  { name: "Los Angeles", lat: 34.05, lon: -118.24, anchor: "end" },
  { name: "Denver", lat: 39.74, lon: -104.99, anchor: "end" },
  { name: "Anchorage", lat: 61.22, lon: -149.9, anchor: "end", labelDy: -5 },
  { name: "Dallas", lat: 32.78, lon: -96.8, anchor: "start" },
  { name: "Chicago", lat: 41.88, lon: -87.63, anchor: "start" },
  { name: "Toronto", lat: 43.65, lon: -79.38, anchor: "end", labelDy: -6 },
  { name: "New York", lat: 40.71, lon: -74.01, anchor: "start" },
  { name: "Miami", lat: 25.76, lon: -80.19, anchor: "start" },
  { name: "Mexico City", lat: 19.43, lon: -99.13, anchor: "start" },
  { name: "Honolulu", lat: 21.31, lon: -157.86, anchor: "end" },
  // A light touch of international capitals for scale beyond North
  // America — deliberately sparse so the map doesn't get busy.
  { name: "London", lat: 51.51, lon: -0.13, anchor: "end" },
  { name: "Bogotá", lat: 4.71, lon: -74.07, anchor: "start" },
];

export default function RangeMapCard({ rangeNm }: { rangeNm: number }) {
  const [origin, setOrigin] = useState<Airport | null>(DEFAULT_ORIGIN);

  const geometry = useMemo(() => {
    if (!origin) return null;
    const ring = rangeRingPath(origin.lat, origin.lon, rangeNm).replace(
      /-?\d+\.\d+/g,
      (m) => Number.parseFloat(m).toFixed(1)
    );
    const marker = rangeProjection([origin.lon, origin.lat]);
    return marker ? { ring, mx: round1(marker[0]), my: round1(marker[1]) } : null;
  }, [origin, rangeNm]);

  const cities = useMemo(
    () =>
      REFERENCE_CITIES.map((c) => {
        const p = rangeProjection([c.lon, c.lat]);
        return p ? { ...c, x: round1(p[0]), y: round1(p[1]) } : null;
      })
        .filter((c): c is NonNullable<typeof c> => c !== null)
        // Hide a reference city sitting on top of the selected origin marker
        .filter(
          (c) =>
            !geometry ||
            Math.hypot(c.x - geometry.mx, c.y - geometry.my) > 16
        ),
    [geometry]
  );

  return (
    <div>
      <div className="mx-auto max-w-sm">
        <AirportSearch
          label="Range From"
          placeholder="City or airport code (TEB, KOPF…)"
          value={origin}
          onChange={setOrigin}
        />
      </div>

      {/* Same map treatment as the charter page — tilted holographic panel,
          framed wide enough to hold the entire range ring */}
      <div className="relative mt-3 w-full [perspective:1400px]">
        <div className="relative w-full [transform:rotateX(16deg)] [transform-origin:50%_62%]">
          <svg
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="rangeGrid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.2" fill="#0c1d3d" opacity="0.1" />
              </pattern>
              <clipPath id="rangePanel">
                <rect x="20" y="14" width="1160" height="772" rx="28" />
              </clipPath>
            </defs>

            <rect x="20" y="14" width="1160" height="772" rx="28" fill="url(#rangeGrid)" />
            <rect
              x="20"
              y="14"
              width="1160"
              height="772"
              rx="28"
              stroke="#0c1d3d"
              strokeOpacity="0.1"
            />

            <g clipPath="url(#rangePanel)">
              <g
                stroke="#0c1d3d"
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeLinejoin="round"
                fill="#0c1d3d"
                fillOpacity="0.03"
              >
                {RANGE_LAND_PATHS.map((c, i) => (
                  <path key={`${c.name}-${i}`} d={c.d} />
                ))}
              </g>

              {/* Notable cities, shown for scale regardless of selection */}
              <g>
                {cities.map((c) => (
                  <g key={c.name}>
                    <circle cx={c.x} cy={c.y} r="2.6" fill="#0c1d3d" fillOpacity="0.45" />
                    <text
                      x={c.x + (c.anchor === "end" ? -8 : 8)}
                      y={c.y + 3.5 + (c.labelDy ?? 0)}
                      textAnchor={c.anchor}
                      fontSize="11"
                      letterSpacing="1"
                      fill="#0c1d3d"
                      fillOpacity="0.42"
                      style={{ textTransform: "uppercase" }}
                    >
                      {c.name}
                    </text>
                  </g>
                ))}
              </g>

              {geometry && (
                <g style={{ animation: "pageFade 0.4s ease both" }}>
                  <path
                    d={geometry.ring}
                    fill="#85b5d8"
                    fillOpacity="0.12"
                    stroke="#0c1d3d"
                    strokeOpacity="0.45"
                    strokeWidth="1.6"
                    strokeDasharray="6 5"
                  />
                  <circle cx={geometry.mx} cy={geometry.my} r="7" fill="#85b5d8" opacity="0.4" />
                  <circle cx={geometry.mx} cy={geometry.my} r="3" fill="#0c1d3d" />
                  <text
                    x={geometry.mx + 12}
                    y={geometry.my + 4}
                    fontSize="14"
                    fontWeight="600"
                    letterSpacing="2"
                    fill="#0c1d3d"
                  >
                    {origin!.iata || origin!.icao}
                  </text>
                </g>
              )}
            </g>
          </svg>

          {!origin && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/10 bg-white/80 px-5 py-2.5 text-[10px] tracking-[0.28em] whitespace-nowrap text-ink-3 uppercase backdrop-blur">
              Select a departure city
            </div>
          )}
        </div>
      </div>

      {origin && (
        <p className="mt-2 text-center text-[11px] font-medium tracking-[0.18em] text-navy uppercase">
          {rangeNm.toLocaleString()} NM from {origin.city || origin.name} (
          {origin.iata || origin.icao})
        </p>
      )}

      <p className="mt-3 text-center text-[11px] font-light tracking-[0.06em] text-ink-3">
        Generic assumptions — real range may vary based on a variety of factors
        such as weights and weather.
      </p>
    </div>
  );
}
