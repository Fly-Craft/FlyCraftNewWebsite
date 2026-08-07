"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type SegmentedOption<T extends string> = { id: T; label: string };

// Position before paint on the client so the capsule never flashes at the
// wrong segment; fall back to useEffect during SSR, where there's no layout.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A segmented control whose selected state is a capsule that glides
 * between options rather than jumping — the same motion language as the
 * nav's active-tab capsule.
 *
 * `fit` sizes each segment to its own label (capsule hugs the text);
 * otherwise segments split the track evenly.
 */
export default function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  variant = "dark",
  fit = false,
  pad = 4,
  className = "",
  buttonClassName = "",
  ariaLabel,
  field,
}: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (id: T) => void;
  /** dark = navy glass capsule with white text; light = bright glass with navy text */
  variant?: "dark" | "light";
  fit?: boolean;
  /** track padding in px — the capsule insets by the same amount */
  pad?: number;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
  /** Stable automation hook, e.g. "trip-type" → [data-field="trip-type"]. */
  field?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [measured, setMeasured] = useState<{ left: number; width: number } | null>(
    null
  );
  const [animated, setAnimated] = useState(false);

  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value)
  );

  useIsoLayoutEffect(() => {
    function update() {
      const el = btnRefs.current[value];
      const track = trackRef.current;
      if (!el || !track) return;
      const er = el.getBoundingClientRect();
      const tr = track.getBoundingClientRect();
      // In fit mode the capsule hugs the glyphs, so it has to account for
      // letter-spacing trailing the final character — that pushes the ink
      // left of the button's box centre. Even segments span the whole
      // button box, where no such correction applies. `left` is measured
      // from the track's padding box, so its border comes off either way.
      const tracking = fit
        ? (parseFloat(getComputedStyle(el).letterSpacing) || 0) / 2
        : 0;
      setMeasured({
        left: er.left - tr.left - track.clientLeft - tracking,
        width: er.width,
      });
      requestAnimationFrame(() => setAnimated(true));
    }
    update();
    // Webfonts land after first layout and reflow the labels
    const t = setTimeout(update, 300);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [value, fit, options.length]);

  // Until the first measurement, even segments can be placed from the
  // index alone — so the capsule is already correct in the server HTML.
  const box =
    measured ??
    (fit
      ? { left: 0, width: 0 }
      : {
          left: `calc(${pad}px + ${index} * (100% - ${pad * 2}px) / ${options.length})`,
          width: `calc((100% - ${pad * 2}px) / ${options.length})`,
        });

  const dark = variant === "dark";

  return (
    // radiogroup, not group: these options are mutually exclusive, and
    // that's the difference between "some toggles" and "pick exactly one"
    // to a screen reader or an agent reading the tree.
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      data-field={field}
      data-value={value}
      className={`relative flex rounded-full border border-border ${fit ? "w-fit" : ""} ${className}`}
      style={{ padding: pad }}
    >
      <span
        aria-hidden
        className={`${dark ? "glass-selected" : "glass-capsule"} pointer-events-none absolute rounded-full ${
          animated
            ? "transition-[left,width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            : ""
        }`}
        style={{ left: box.left, width: box.width, top: pad, bottom: pad }}
      />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          data-value={o.id}
          ref={(el) => {
            btnRefs.current[o.id] = el;
          }}
          onClick={() => onChange(o.id)}
          className={`relative z-10 rounded-full transition-colors ${fit ? "" : "flex-1"} ${buttonClassName} ${
            value === o.id
              ? dark
                ? "text-white"
                : "text-navy"
              : "text-ink-2 hover:text-navy"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
