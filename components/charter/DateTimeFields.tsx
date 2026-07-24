"use client";

import { useEffect, useRef, useState } from "react";

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

function usePopover(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
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
  }, [onClose]);
  return ref;
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
  const ref = usePopover(() => setOpen(false));

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
    <div ref={ref} className="relative">
      <button type="button" onClick={openPicker} className={triggerCls(!!value)}>
        <span className="truncate">{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_20px_60px_rgba(12,29,61,0.16)]">
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
                  onClick={() => {
                    onChange(dStr);
                    setOpen(false);
                  }}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors ${
                    selected
                      ? "bg-navy font-medium text-white"
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
        </div>
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
  const ref = usePopover(() => setOpen(false));
  const listRef = useRef<HTMLDivElement>(null);

  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      options.push(`${pad(h)}:${pad(m)}`);
    }
  }

  useEffect(() => {
    if (!open || !listRef.current) return;
    // min may not sit on the 15-min grid — scroll to the first pickable slot
    const firstAllowed = min
      ? options.find((t) => t >= min)
      : undefined;
    const target = value || firstAllowed || "08:00";
    const el = listRef.current.querySelector<HTMLElement>(`[data-t="${target}"]`);
    el?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is a constant grid
  }, [open, value, min]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={triggerCls(!!value)}
      >
        <span className="truncate">{value ? formatTime(value) : placeholder}</span>
        <ClockIcon />
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute z-30 mt-2 max-h-64 w-full min-w-36 overflow-auto rounded-2xl border border-navy/10 bg-white py-2 shadow-[0_20px_60px_rgba(12,29,61,0.16)]"
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
        </div>
      )}
    </div>
  );
}
