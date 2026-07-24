import type { Airport } from "@/lib/airports-data";

const EARTH_RADIUS_NM = 3440.065;

export function distanceNm(a: Airport, b: Airport): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.sqrt(s));
}

/**
 * Planning ground speed by the dominant axis of travel:
 * whichever is larger — the east/west or the north/south component —
 * decides the speed. East→west and north→south legs plan at 420 kts;
 * west→east and south→north legs plan at 470 kts.
 * e.g. TEB→VNY is mostly east→west → 420; OPF→TEB is mostly
 * south→north → 470.
 */
export function groundSpeedKts(a: Airport, b: Airport): number {
  const dLon = ((b.lon - a.lon + 540) % 360) - 180; // wrap to [-180, 180]
  const dLat = b.lat - a.lat;
  if (Math.abs(dLon) >= Math.abs(dLat)) {
    return dLon > 0 ? 470 : 420; // west→east : east→west
  }
  return dLat > 0 ? 470 : 420; // south→north : north→south
}

export function flightMinutes(nm: number, speedKts: number): number {
  // +10% over great-circle to account for real-world routing
  return Math.round((nm / speedKts) * 60 * 1.1);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${m.toString().padStart(2, "0")} min`;
}

/** Offset (ms) of `tz` from UTC at the given UTC instant. */
function tzOffsetMs(utc: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(utc)) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    parts.hour === "24" ? 0 : +parts.hour,
    +parts.minute,
    +parts.second
  );
  return asUtc - utc.getTime();
}

/**
 * Interpret a local wall-clock date+time in `tz` and return the UTC instant.
 * Two-pass correction handles DST boundaries well enough for scheduling UI.
 */
export function zonedToUtc(dateStr: string, timeStr: string, tz: string): Date {
  const naive = new Date(`${dateStr}T${timeStr}:00Z`);
  let guess = naive.getTime() - tzOffsetMs(naive, tz);
  guess = naive.getTime() - tzOffsetMs(new Date(guess), tz);
  return new Date(guess);
}

export function formatInZone(
  utc: Date,
  tz: string,
  opts: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(utc);
}

/** "YYYY-MM-DD" wall-clock date of `utc` in `tz`. */
export function isoDateInZone(utc: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(utc);
}

/** "HH:MM" wall-clock time of `utc` in `tz`. */
export function isoTimeInZone(utc: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(utc);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const h = get("hour");
  return `${h === "24" ? "00" : h}:${get("minute")}`;
}

/** Calendar-day difference of `utc` shown in `tzB` vs shown in `tzA`. */
export function dayShift(utcA: Date, tzA: string, utcB: Date, tzB: string): number {
  const day = (d: Date, tz: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  const a = day(utcA, tzA);
  const b = day(utcB, tzB);
  return Math.round(
    (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) /
      86400000
  );
}
