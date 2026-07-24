"use client";

import MainScript from "./MainScript";

/**
 * Wrapper for the fleet mini-site. All of its CSS is scoped under
 * `.fleet-site` (see app/fleet/fleet.css), and the page-enter animation
 * lives here instead of on <body> as in the original standalone app —
 * once it finishes we clear it, because a lingering transform would turn
 * this div into a containing block and break the fixed nav. The mini-site's
 * own nav bar has been retired in favor of the main site's Nav (rendered by
 * Chrome), which now carries a Fleet dropdown for the aircraft pages.
 */
export default function FleetShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fleet-site"
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        const el = e.currentTarget;
        el.style.animation = "none";
        el.style.transform = "none";
        el.style.opacity = "1";
      }}
    >
      <MainScript />
      {children}
    </div>
  );
}
