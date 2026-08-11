"use client";

import { usePathname } from "next/navigation";
import SkyBackdrop from "@/components/SkyBackdrop";

/**
 * The fleet orbit page's sky and cloud deck.
 *
 * Rendered from the site chrome rather than from the page, because it has
 * to sit outside `.page-fade` (app/template.tsx). That wrapper's entrance
 * animation carries a transform, and a transform makes an element a
 * containing block for fixed-position descendants — which re-anchored the
 * sky to the page wrapper and cut it off where the orbit scene ended,
 * leaving the footer on the flat page background. Out here it is a direct
 * child of <body>, so it covers the viewport and the footer sits on it.
 *
 * It pairs with body::before (the site gradient, z-index -2) and layers
 * over it at z-index -1, which is what globals.css already assumes.
 */
export default function RouteSky() {
  const pathname = usePathname();
  if (pathname !== "/fleet") return null;
  return <SkyBackdrop />;
}
