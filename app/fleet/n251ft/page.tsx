import type { Metadata } from "next";
import AircraftPage from "@/components/fleet/AircraftPage";
import { AIRCRAFT } from "@/lib/fleet-aircraft";

const a = AIRCRAFT.find((x) => x.slug === "n251ft")!;

export const metadata: Metadata = {
  title: `POD ${a.pod} — ${a.tail} | Challenger ${a.model} | CRAFT`,
  description: `CRAFT's Challenger ${a.model} — ${a.tail}. Super mid-size charter aircraft with transcontinental range and premium amenities.`,
};

export default function Page() {
  return <AircraftPage a={a} />;
}
