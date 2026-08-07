"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const pad = (n: number) => String(n).padStart(2, "0");

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDate(value: string): string {
  const d = new Date(`${value}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${am ? "AM" : "PM"}`;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const GAP = 8; // breathing room between the trigger and the floating panel
const EDGE = 8; // minimum distance from the viewport edge

/**
 * Anchors a floating panel to a trigger and closes it on outside click / Esc.
 *
 * The panel can't live inside the form: `.glass` sets `backdrop-filter`, which
 * makes every card its own stacking context, so a popover nested in one card
 * is painted under any later card no matter how high its z-index goes. So the
 * panel is portalled to <body> and positioned from the trigger's rect instead —
 * which also means outside-click needs to check both subtrees, since the panel
 * is no longer a DOM descendant of the trigger.
 */
function useAnchoredPopover(open: boolean, onClose: () => void) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useIsoLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = anchorRef.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    measure();
    // capture:true so scrolling any ancestor container repositions it too
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return { anchorRef, panelRef, rect };
}

/**
 * The floating half of the pair. `height` is the panel's approximate rendered
 * height — used only to decide whether it fits below the trigger; when it
 * flips above we pin the panel's bottom edge instead, so the estimate never
 * has to be exact.
 */
function Popover({
  panelRef,
  rect,
  width,
  height,
  className,
  children,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  rect: DOMRect | null;
  width?: number;
  height: number;
  className: string;
  children: React.ReactNode;
}) {
  // `rect` doubles as the client-side guard: it stays null until the layout
  // effect measures the trigger, so document.body is never touched on the
  // server, and the measure lands before paint so there's no flash.
  if (!rect) return null;

  const panelWidth = width ?? rect.width;
  const spaceBelow = window.innerHeight - rect.bottom;
  const flipUp = spaceBelow < height + GAP && rect.top > spaceBelow;

  const left = Math.min(
    Math.max(EDGE, rect.left),
    Math.max(EDGE, window.innerWidth - panelWidth - EDGE),
  );

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left,
        width: panelWidth,
        ...(flipUp
          ? { bottom: window.innerHeight - rect.top + GAP }
          : { top: rect.bottom + GAP }),
      }}
      className={`z-40 ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
}

const triggerCls = (hasValue: boolean) =>
  `flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-left text-[14px] outline-none transition-colors ${
    hasValue
      ? "border-navy/30 font-medium text-navy"
      : "border-border text-ink-3 hover:border-navy/30"
  }`;

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-ink-3">
      <rect x="1.5" y="2.5" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6H14.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 1V4M11 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-ink-3">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function DateField({
  value,
  onChange,
  min,
  placeholder = "Select date",
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = value
      ? new Date(`${value}T00:00:00`)
      : min
        ? new Date(`${min}T00:00:00`)
        : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const { anchorRef, panelRef, rect } = useAnchoredPopover(open, () =>
    setOpen(false),
  );

  function openPicker() {
    if (!open && value) {
      const d = new Date(`${value}T00:00:00`);
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    setOpen(!open);
  }

  const year = view.getFullYear();
  const month = view.getMonth();
  const startPad = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toDateStr(new Date());

  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          value ? `Departure date, ${formatDate(value)}` : "Choose departure date"
        }
        data-field="date"
        data-value={value || ""}
        className={triggerCls(!!value)}
      >
        <span className="truncate">{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon />
      </button>

      {open && (
        <Popover
          panelRef={panelRef}
          rect={rect}
          width={288}
          height={348}
          className="rounded-2xl glass-popover p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy-light"
            >
              ‹
            </button>
            <span className="text-[12px] font-medium tracking-[0.14em] text-navy uppercase">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy-light"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {WEEKDAYS.map((w, i) => (
              <span
                key={`${w}-${i}`}
                className="flex h-8 items-center justify-center text-[10px] font-medium tracking-[0.1em] text-ink-3"
              >
                {w}
              </span>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <span key={`pad-${i}`} />;
              const dStr = `${year}-${pad(month + 1)}-${pad(day)}`;
              const disabled = !!min && dStr < min;
              const selected = value === dStr;
              const isToday = dStr === todayStr;
              return (
                <button
                  key={dStr}
                  type="button"
                  disabled={disabled}
                  // "18" alone is meaningless out of context. The ISO date
                  // in data-date is the automation hook: an agent can go
                  // straight to [data-date="2026-12-18"] without reading
                  // the header to work out which month is showing.
                  data-date={dStr}
                  aria-label={formatDate(dStr)}
                  aria-current={selected ? "date" : undefined}
                  onClick={() => {
                    onChange(dStr);
                    setOpen(false);
                  }}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors ${
                    selected
                      ? "glass-selected font-medium text-white"
                      : disabled
                        ? "cursor-not-allowed text-ink-3/40"
                        : `text-navy hover:bg-navy-light ${isToday ? "border border-navy/30" : ""}`
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Popover>
      )}
    </div>
  );
}

export function TimeField({
  value,
  onChange,
  min,
  placeholder = "Select time",
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const { anchorRef, panelRef, rect } = useAnchoredPopover(open, () =>
    setOpen(false),
  );

  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      options.push(`${pad(h)}:${pad(m)}`);
    }
  }

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    // min may not sit on the 15-min grid — scroll to the first pickable slot
    const firstAllowed = min
      ? options.find((t) => t >= min)
      : undefined;
    const target = value || firstAllowed || "08:00";
    const el = panel.querySelector<HTMLElement>(`[data-t="${target}"]`);
    // set scrollTop directly rather than scrollIntoView — the panel is
    // position:fixed, and scrollIntoView would also scroll the page behind it,
    // dragging the anchor out from under us
    if (el) {
      panel.scrollTop =
        el.offsetTop - panel.clientHeight / 2 + el.offsetHeight / 2;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is a constant grid
  }, [open, rect, value, min]);

  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          value ? `Departure time, ${formatTime(value)}` : "Choose departure time"
        }
        data-field="time"
        data-value={value || ""}
        className={triggerCls(!!value)}
      >
        <span className="truncate">{value ? formatTime(value) : placeholder}</span>
        <ClockIcon />
      </button>

      {open && (
        <Popover
          panelRef={panelRef}
          rect={rect}
          height={256}
          className="max-h-64 min-w-36 overflow-auto rounded-2xl glass-popover py-2"
        >
          {options.map((t) => {
            const disabled = !!min && t < min;
            return (
              <button
                key={t}
                type="button"
                data-t={t}
                disabled={disabled}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2 text-[13px] transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-ink-3/40"
                    : value === t
                      ? "bg-navy-light font-medium text-navy"
                      : "text-ink-2 hover:bg-navy-light hover:text-navy"
                }`}
              >
                {formatTime(t)}
              </button>
            );
          })}
        </Popover>
      )}
    </div>
  );
}
