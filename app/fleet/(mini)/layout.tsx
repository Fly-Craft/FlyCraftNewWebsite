import type { Metadata } from "next";
import "../fleet.css";
import FleetShell from "@/components/fleet/FleetShell";

export const metadata: Metadata = {
  title: "The Fleet | CRAFT",
  description: "CRAFT's fleet of private charter aircraft.",
};

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FleetShell>{children}</FleetShell>;
}
