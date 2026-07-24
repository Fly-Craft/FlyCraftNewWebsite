import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";

// Runtime copy of the build-time range-map projection so client components
// can project arbitrary lon/lat onto the pre-generated Mercator land.

// Same as scripts/gen-range-map.mjs (viewBox 0 0 1200 800) — keep in sync.
const rangeFrame = {
  type: "MultiPoint" as const,
  coordinates: [
    [-170, -35],
    [-10, -35],
    [-170, 74],
    [-10, 74],
  ] as [number, number][],
};

export const rangeProjection = geoRobinson()
  .rotate([90, 0])
  .fitExtent(
    [
      [30, 20],
      [1170, 780],
    ],
    rangeFrame
  )
  .clipExtent([
    [0, 0],
    [1200, 800],
  ]);

const rangePathGen = geoPath(rangeProjection);

const DEG = Math.PI / 180;

// Prevailing winds run west→east: a tailwind eastbound stretches usable
// range, a headwind westbound shrinks it. Tapered with a cosine so the
// ring is a smooth distorted oval rather than a hard east/west split —
// full range due east, 10% less due west, ~5% less due north/south.
function windRangeFactor(bearingDeg: number): number {
  const rad = (bearingDeg - 90) * DEG; // 0 when bearing points due east
  return 1 - 0.05 * (1 - Math.cos(rad));
}

/** Great-circle destination point, given a start point, bearing, and angular distance (all degrees in/out, distance in radians). */
function destinationPoint(
  lat: number,
  lon: number,
  bearingDeg: number,
  angularDistance: number
): [number, number] {
  const phi1 = lat * DEG;
  const lambda1 = lon * DEG;
  const theta = bearingDeg * DEG;

  const sinPhi2 =
    Math.sin(phi1) * Math.cos(angularDistance) +
    Math.cos(phi1) * Math.sin(angularDistance) * Math.cos(theta);
  const phi2 = Math.asin(sinPhi2);
  const y = Math.sin(theta) * Math.sin(angularDistance) * Math.cos(phi1);
  const x = Math.cos(angularDistance) - Math.sin(phi1) * sinPhi2;
  const lambda2 = lambda1 + Math.atan2(y, x);

  return [lambda2 / DEG, phi2 / DEG]; // [lon, lat]
}

const RING_STEPS = 144; // one point every 2.5° — smooth at this map's scale

/**
 * SVG path for a wind-distorted range ring around (lat, lon) — full range
 * due east (tailwind), 10% less due west (headwind), tapering smoothly
 * between. Built as a spherical polygon and rendered through d3's geoPath,
 * which handles antimeridian cutting and viewport clipping correctly — a
 * naive point-sampled ring streaks across the map when it wraps the globe.
 */
export function rangeRingPath(
  lat: number,
  lon: number,
  distanceNm: number
): string {
  const coordinates: [number, number][] = [];
  for (let i = 0; i <= RING_STEPS; i++) {
    const bearing = (360 * i) / RING_STEPS;
    const nm = distanceNm * windRangeFactor(bearing);
    const angularDistance = (nm / 60) * DEG; // 1° of great-circle arc = 60 NM
    coordinates.push(destinationPoint(lat, lon, bearing, angularDistance));
  }
  const polygon = { type: "Polygon" as const, coordinates: [coordinates] };
  return rangePathGen(polygon) ?? "";
}
