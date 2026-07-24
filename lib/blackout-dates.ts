/**
 * Standard private-aviation peak / blackout date windows — the periods when
 * charter demand (and pricing) spikes industry-wide: winter holidays, MLK,
 * Presidents' Day, spring break & Easter, Memorial Day, July 4th, Labor Day,
 * and Thanksgiving.
 */
type BlackoutRange = { start: string; end: string; label: string };

const BLACKOUTS: BlackoutRange[] = [
  // 2026
  { start: "2026-01-01", end: "2026-01-04", label: "New Year's" },
  { start: "2026-01-16", end: "2026-01-19", label: "MLK Weekend" },
  { start: "2026-02-13", end: "2026-02-16", label: "Presidents' Day Weekend" },
  { start: "2026-03-13", end: "2026-03-29", label: "Spring Break" },
  { start: "2026-04-02", end: "2026-04-12", label: "Easter & Passover" },
  { start: "2026-05-22", end: "2026-05-25", label: "Memorial Day Weekend" },
  { start: "2026-07-02", end: "2026-07-06", label: "Independence Day" },
  { start: "2026-09-04", end: "2026-09-08", label: "Labor Day Weekend" },
  { start: "2026-11-24", end: "2026-11-29", label: "Thanksgiving" },
  { start: "2026-12-18", end: "2027-01-03", label: "Christmas & New Year's" },
  // 2027
  { start: "2027-01-15", end: "2027-01-18", label: "MLK Weekend" },
  { start: "2027-02-12", end: "2027-02-15", label: "Presidents' Day Weekend" },
  { start: "2027-03-12", end: "2027-03-28", label: "Spring Break" },
  { start: "2027-03-22", end: "2027-04-04", label: "Easter & Passover" },
  { start: "2027-05-28", end: "2027-05-31", label: "Memorial Day Weekend" },
  { start: "2027-07-01", end: "2027-07-05", label: "Independence Day" },
  { start: "2027-09-03", end: "2027-09-07", label: "Labor Day Weekend" },
  { start: "2027-11-23", end: "2027-11-28", label: "Thanksgiving" },
  { start: "2027-12-17", end: "2028-01-02", label: "Christmas & New Year's" },
];

/** Returns the blackout window label for a YYYY-MM-DD date, or null. */
export function blackoutLabel(dateStr: string): string | null {
  if (!dateStr) return null;
  for (const r of BLACKOUTS) {
    if (dateStr >= r.start && dateStr <= r.end) return r.label;
  }
  return null;
}
