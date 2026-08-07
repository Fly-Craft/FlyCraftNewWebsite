import { AIRPORTS, type Airport } from "@/lib/airports-data";

/**
 * Rank airports for a query: exact IATA/ICAO first, then city prefix,
 * then city/name/code substring. Large hubs get a slight boost via
 * scheduled-airport ordering already present in the dataset.
 */
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toUpperCase();
  if (q.length < 2) return [];

  const scored: { a: Airport; s: number }[] = [];

  for (const a of AIRPORTS) {
    const city = a.city.toUpperCase();
    const name = a.name.toUpperCase();
    let s = -1;

    if (a.iata === q || a.icao === q || a.local === q) s = 100;
    else if (
      a.iata.startsWith(q) ||
      a.icao.startsWith(q) ||
      a.local?.startsWith(q)
    )
      s = 80;
    else if (city.startsWith(q)) s = 70;
    else if (name.startsWith(q)) s = 60;
    else if (city.includes(q)) s = 40;
    else if (name.includes(q)) s = 30;

    if (s >= 0) scored.push({ a, s });
  }

  scored.sort(
    (x, y) => y.s - x.s || x.a.city.localeCompare(y.a.city) || x.a.name.localeCompare(y.a.name)
  );
  return scored.slice(0, limit).map((x) => x.a);
}

export function airportLabel(a: Airport): string {
  const code = a.iata || a.icao;
  return `${a.city || a.name} (${code})`;
}

/** Strip punctuation and collapse runs of space: "Opa-locka" → "OPA LOCKA". */
const normalize = (s: string) =>
  s.toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();

/**
 * Resolve free text to exactly one airport, or report the ambiguity.
 *
 * Separate from `searchAirports` because the two have different jobs: that
 * one ranks live suggestions for a human who will pick from a list, this
 * one has to commit to a single answer for a caller that can't look. It
 * matches punctuation-insensitively — "Opa-locka" has to find "Miami-Opa
 * Locka Executive Airport", which a literal substring search misses.
 */
export function resolveAirport(
  input: string,
): { airport: Airport } | { candidates: Airport[] } {
  const raw = (input ?? "").trim();
  if (raw.length < 2) return { candidates: [] };

  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const exact = AIRPORTS.find(
    (a) => a.iata === code || a.icao === code || a.local === code,
  );
  if (exact) return { airport: exact };

  const ranked = searchAirports(raw, 6);
  if (ranked.length === 1) return { airport: ranked[0] };

  const norm = normalize(raw);
  if (ranked.length > 1) {
    // A query naming the city outright beats the rest of the ranked list.
    const cityHit = ranked.filter((a) => normalize(a.city) === norm);
    if (cityHit.length === 1) return { airport: cityHit[0] };
    return { candidates: ranked };
  }

  // Nothing ranked — fall back to a token match over city + name, which
  // survives hyphens, apostrophes, and "St." vs "St".
  const tokens = norm.split(" ").filter(Boolean);
  const loose = AIRPORTS.filter((a) => {
    const hay = normalize(`${a.city} ${a.name}`);
    return tokens.every((t) => hay.includes(t));
  });
  if (loose.length === 1) return { airport: loose[0] };
  return { candidates: loose.slice(0, 6) };
}
