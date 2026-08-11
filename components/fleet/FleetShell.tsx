"use client";

import MainScript from "./MainScript";

/**
 * Wrapper for the fleet mini-site. All of its CSS is scoped under
 * `.fleet-site` (see app/fleet/fleet.css). The mini-site's own nav bar and
 * footer have been retired in favour of the main site's, so this is now
 * just the style scope plus the page-enter fade.
 *
 * That fade is opacity-only on purpose: a transform here would make this
 * div a containing block for fixed-position descendants and trap the sky
 * backdrop inside it. See the note on @keyframes page-enter.
 */
export default function FleetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fleet-site">
      <MainScript />
      {children}
    </div>
  );
}
