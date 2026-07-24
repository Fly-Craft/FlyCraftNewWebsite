"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Site-wide chrome. The fleet orbit selector and menu pages ship their own
 * footer (ported from the standalone fleet app), so the main footer steps
 * aside there — but they use the main site's Nav like every other page, so
 * the Fleet dropdown and the rest of the pill nav stay consistent everywhere.
 */
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFleetMini = pathname === "/fleet" || pathname === "/fleet/menu";

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      {!isFleetMini && <Footer />}
    </>
  );
}
