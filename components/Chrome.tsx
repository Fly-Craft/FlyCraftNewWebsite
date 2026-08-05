"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookNowFab from "@/components/BookNowFab";

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
      {/* Content stops widening past 16:9 so ultrawide monitors don't
          stretch the layout — the page background fills the sides. See
          .site-main in globals.css. */}
      <main className="site-main flex-1">{children}</main>
      {!isFleetMini && <Footer />}
      <BookNowFab />
    </>
  );
}
