import type { Metadata } from "next";
import AircraftPage from "@/components/fleet/AircraftPage";
import { AIRCRAFT } from "@/lib/fleet-aircraft";

const a = AIRCRAFT.find((x) => x.slug === "n395pd")!;

export const metadata: Metadata = {
  title: `POD ${a.pod} — ${a.tail} | Challenger ${a.model} | CRAFT`,
  description: `CRAFT's Challenger ${a.model}, tail ${a.tail}. Super-midsize charter aircraft with transcontinental range and premium amenities.`,
};

export default function Page() {
  return <AircraftPage a={a} />;
}
