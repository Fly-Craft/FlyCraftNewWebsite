// Generates lib/airports-data.ts from the OurAirports public dataset
// (/tmp/airports.csv — download from
// https://davidmegginson.github.io/ourairports-data/airports.csv).
// Filters to North America + Caribbean + Hawaii, adds an IANA timezone
// per airport (tz-lookup) and the airport's position projected onto the
// same Albers map used by the landing page (viewBox 1000x640).
import { readFileSync, writeFileSync } from "node:fs";
import { geoConicEqualArea } from "d3-geo";
import tzlookup from "tz-lookup";

const CSV_PATH = "/tmp/airports.csv";
const RUNWAYS_CSV_PATH = "/tmp/runways.csv";
const MIN_RUNWAY_FT = 4000;

// Primary US Class B airports (FAA) — flagged so the UI can suggest
// smaller nearby fields for cost savings.
const CLASS_B = new Set([
  "KATL", "KBOS", "KBWI", "KCLT", "KORD", "KCVG", "KCLE", "KDFW", "KDEN",
  "KDTW", "PHNL", "KIAH", "KHOU", "KMCI", "KLAS", "KLAX", "KMEM", "KMIA",
  "KMSP", "KMSY", "KJFK", "KLGA", "KEWR", "KMCO", "KPHL", "KPHX", "KPIT",
  "KSTL", "KSLC", "KSAN", "KSFO", "KSEA", "KTPA", "KDCA", "KIAD",
]);

// Same projection + frame as scripts/gen-map.mjs — keep in sync.
const frame = {
  type: "MultiPoint",
  coordinates: [
    [-162, 16],
    [-60, 16],
    [-140, 62],
    [-60, 62],
  ],
};

const projection = geoConicEqualArea()
  .parallels([20, 50])
  .rotate([96, 0])
  .fitExtent(
    [
      [50, 30],
      [950, 610],
    ],
    frame
  );

const COUNTRIES = new Set([
  "US", "CA", "MX",
  // Caribbean + nearby
  "BS", "CU", "JM", "HT", "DO", "PR", "VI", "VG", "TC", "KY", "AG", "AI",
  "AW", "BB", "BM", "CW", "DM", "GD", "GP", "KN", "LC", "MF", "MQ", "MS",
  "SX", "TT", "VC", "BQ",
  // Central America
  "BZ", "GT", "HN", "SV", "NI", "CR", "PA",
]);

// Popular business-aviation fields that must make the cut even if they
// are classified small / have no scheduled service.
const FORCE_IDENTS = new Set([
  "KTEB", "KVNY", "KHPN", "KASE", "KEGE", "KJAC", "KSUN", "KTRK", "KSDL",
  "KAPF", "KOPF", "KFXE", "KBCT", "KMMU", "KFRG", "KISP", "KBED", "KPWK",
  "KDPA", "KADS", "KAPA", "KBJC", "KCNO", "KCRQ", "KHTO", "KMVY", "KACK",
  "KPDK", "KFTY", "KLUK", "KAGC", "KSGR", "KVGT", "KHND", "KSMO", "KBUR",
]);

// Every airport code CRAFT actually flew to (extracted from the
// "Craft Flights" spreadsheets by scripts/gen-airports helpers). Any
// in-region airport matching one of these is included regardless of
// size or runway length — the fleet has demonstrably operated there.
const FLOWN_CODES = new Set(
  JSON.parse(
    readFileSync(new URL("./craft-flight-codes.json", import.meta.url), "utf8")
  )
);

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Longest open runway (ft) per airport ident
const runwayRows = parseCSV(readFileSync(RUNWAYS_CSV_PATH, "utf8"));
const rHeader = runwayRows[0];
const rCol = Object.fromEntries(rHeader.map((h, i) => [h, i]));
const maxRunway = new Map();
for (const r of runwayRows.slice(1)) {
  if (r.length < rHeader.length - 2) continue;
  if (r[rCol.closed] === "1") continue;
  const ident = r[rCol.airport_ident];
  const len = parseInt(r[rCol.length_ft], 10);
  if (!ident || !Number.isFinite(len)) continue;
  if (!maxRunway.has(ident) || maxRunway.get(ident) < len) maxRunway.set(ident, len);
}

const rows = parseCSV(readFileSync(CSV_PATH, "utf8"));
const header = rows[0];
const col = Object.fromEntries(header.map((h, i) => [h, i]));

const airports = [];
const seen = new Set();

for (const r of rows.slice(1)) {
  if (r.length < header.length - 2) continue;
  const type = r[col.type];
  const country = r[col.iso_country];
  const ident = r[col.ident];
  const iata = (r[col.iata_code] || "").trim().toUpperCase();
  const local = (r[col.local_code] || "").trim().toUpperCase();
  const flown =
    FLOWN_CODES.has(ident) ||
    (iata && FLOWN_CODES.has(iata)) ||
    (local && FLOWN_CODES.has(local));
  const forced = FORCE_IDENTS.has(ident) || flown;

  if (!COUNTRIES.has(country)) continue;
  if (type === "closed" || type === "heliport" || type === "seaplane_base")
    continue;
  if (!forced) {
    if (type !== "large_airport" && type !== "medium_airport") continue;
    if (!/^[A-Z0-9]{3}$/.test(iata)) continue;
  }

  // Challenger ops: keep only fields with a runway longer than 4,000 ft.
  // Airports from the flight logs are exempt — the fleet has landed there.
  if (!flown && (maxRunway.get(ident) ?? 0) <= MIN_RUNWAY_FT) continue;

  const lat = parseFloat(r[col.latitude_deg]);
  const lon = parseFloat(r[col.longitude_deg]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

  const icaoRaw = (r[col.icao_code] || "").trim().toUpperCase();
  const icao = /^[A-Z0-9]{4}$/.test(icaoRaw)
    ? icaoRaw
    : /^[A-Z0-9]{4}$/.test(ident)
      ? ident
      : "";
  if (!icao && !iata) continue;
  if (seen.has(icao || iata)) continue;
  seen.add(icao || iata);

  let tz;
  try {
    tz = tzlookup(lat, lon);
  } catch {
    continue;
  }

  const [x, y] = projection([lon, lat]);
  const region = (r[col.iso_region] || "").split("-")[1] || "";

  airports.push({
    iata,
    icao,
    name: r[col.name].replace(/\s+/g, " ").trim(),
    city: (r[col.municipality] || "").trim(),
    region: country === "US" || country === "CA" ? region : country,
    lat: +lat.toFixed(4),
    lon: +lon.toFixed(4),
    tz,
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    ...(CLASS_B.has(icao) ? { classB: true } : {}),
    // FAA local code when it differs from the IATA code (e.g. Carlsbad is
    // CRQ locally but CLD to the airlines; digit LIDs like E25 have no
    // IATA at all) — searchable alias.
    ...(local && local !== iata ? { local } : {}),
  });
}

airports.sort((a, b) => a.name.localeCompare(b.name));

const out = `// AUTO-GENERATED by scripts/gen-airports.mjs — do not edit by hand.
// Source: OurAirports public-domain dataset. North America, Caribbean,
// Central America. x/y are projected onto the landing-page map
// (viewBox 0 0 1000 640, Albers conic equal-area).

export type Airport = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  tz: string;
  x: number;
  y: number;
  /** Primary US Class B airport — expect higher fees/fuel prices. */
  classB?: boolean;
  /** FAA local code when it differs from the IATA code (e.g. CRQ vs CLD). */
  local?: string;
};

export const AIRPORTS: Airport[] = ${JSON.stringify(airports)};
`;

writeFileSync(new URL("../lib/airports-data.ts", import.meta.url), out);
console.log(`Wrote ${airports.length} airports.`);
const probe = ["KTEB", "KLAX", "KASE", "PHNL", "TJSJ", "CYYZ", "MYNN"];
for (const p of probe) {
  const a = airports.find((a) => a.icao === p);
  console.log(
    p,
    a ? `${a.iata} ${a.city} tz=${a.tz} xy=(${a.x},${a.y})` : "MISSING"
  );
}
