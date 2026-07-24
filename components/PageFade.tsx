"use client";

import { usePathname } from "next/navigation";

/**
 * This patched Next.js only remounts app/template.tsx when the first path
 * segment changes (see node_modules/next/dist/docs/.../template.md) — so
 * navigating between sibling routes under the same segment (e.g. between
 * /fleet/n971mc and /fleet/n150mb) never remounted the old plain-div
 * template, and the fade-in animation only ever played once. Keying on the
 * full pathname forces a fresh element on every navigation, independent of
 * the framework's segment-boundary rules.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
