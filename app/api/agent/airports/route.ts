import { NextResponse } from "next/server";
import { searchAirports } from "@/lib/airport-search";

/**
 * Airport resolution for agents. An agent is given "Aspen" or "Teterboro",
 * not KASE — this turns loose text into the unambiguous codes /quote wants,
 * and surfaces the ambiguity rather than silently picking one.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(
    20,
    Math.max(1, Number(searchParams.get("limit")) || 8),
  );

  if (q.length < 2) {
    return NextResponse.json(
      { error: "Query `q` must be at least 2 characters.", results: [] },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }

  const results = searchAirports(q, limit).map((a) => ({
    iata: a.iata,
    icao: a.icao,
    faa: a.local ?? null,
    name: a.name,
    city: a.city,
    region: a.region,
    timezone: a.tz,
    coordinates: { lat: a.lat, lon: a.lon },
    majorHub: a.classB ?? false,
  }));

  return NextResponse.json(
    {
      query: q,
      count: results.length,
      // Only claim a winner when the top hit is clearly ahead.
      unambiguous: results.length === 1,
      results,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
