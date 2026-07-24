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
