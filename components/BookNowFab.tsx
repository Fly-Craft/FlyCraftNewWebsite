"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Persistent call to action, bottom-right on every page except the two
 * where it would be redundant: the landing page (which already leads with
 * Request a Quote) and the charter form itself.
 */
export default function BookNowFab() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/charter") return null;

  return (
    <Link
      href="/charter"
      aria-label="Book now — request a charter quote"
      className="glass-selected fixed right-5 bottom-5 z-50 rounded-full px-6 py-4 text-[10px] font-medium tracking-[0.24em] text-white uppercase shadow-[0_10px_34px_rgba(12,29,61,0.3)] transition-transform duration-300 hover:-translate-y-0.5 sm:right-8 sm:bottom-8 sm:px-7 sm:text-[11px] sm:tracking-[0.28em]"
      style={{ animation: "pageFade 0.5s ease both" }}
    >
      Book Now
    </Link>
  );
}
