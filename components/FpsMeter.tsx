"use client";

import { useEffect, useState } from "react";

type Stats = { fps: number; long: number; worst: number };

/**
 * Frame-rate readout for on-device diagnosis, rendered only when the URL
 * carries ?fps=1 — visit /?fps=1 on the phone that's janking and read the
 * chip while scrolling. Green means the frame fit its budget; the `long`
 * count is frames over 33ms (two missed vsyncs at 60Hz) since load.
 * Costs nothing when the flag is absent: the effect bails before
 * scheduling a single frame.
 */
export default function FpsMeter() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("fps")) return;

    let raf = 0;
    let last = performance.now();
    let lastReport = last;
    let frames = 0;
    let long = 0;
    let worst = 0;

    const tick = (t: number) => {
      const d = t - last;
      last = t;
      frames++;
      if (d > 33) long++;
      if (d > worst) worst = d;
      // Update the readout at 4Hz — updating per frame would make the
      // meter itself the jank.
      if (t - lastReport > 250) {
        setStats({
          fps: Math.round((frames * 1000) / (t - lastReport)),
          long,
          worst: Math.round(worst),
        });
        frames = 0;
        lastReport = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!stats) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "max(12px, env(safe-area-inset-top))",
        right: 12,
        zIndex: 9999,
        pointerEvents: "none",
        background: "rgba(12, 29, 61, 0.85)",
        color: stats.fps >= 50 ? "#7dffa8" : stats.fps >= 30 ? "#ffd97d" : "#ff8a7d",
        font: "600 12px/1.5 ui-monospace, monospace",
        padding: "6px 10px",
        borderRadius: 10,
      }}
    >
      {stats.fps} fps · {stats.long} long · worst {stats.worst}ms
    </div>
  );
}
