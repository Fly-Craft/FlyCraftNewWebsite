"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Airport } from "@/lib/airports-data";
import { airportLabel, searchAirports } from "@/lib/airport-search";

type Props = {
  label: React.ReactNode;
  placeholder: string;
  value: Airport | null;
  onChange: (a: Airport | null) => void;
  /** Centre the label and field text (the fleet range map); default left. */
  centered?: boolean;
  /**
   * Stable hook for the field's purpose ("from", "to"), independent of the
   * generated id. Automation targets [data-field="from"] rather than a
   * React-generated id that changes between builds.
   */
  field?: string;
  /** Submitted name, so the control reads as a real form field. */
  name?: string;
};

export default function AirportSearch({
  label,
  placeholder,
  value,
  onChange,
  centered = false,
  field,
  name,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const inputId = `airport-${uid}`;
  const listId = `airport-list-${uid}`;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleInput(text: string) {
    setQuery(text);
    if (value) onChange(null);
    const r = searchAirports(text);
    setResults(r);
    setHighlight(0);
    setOpen(r.length > 0);
  }

  function select(a: Airport) {
    onChange(a);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[highlight]) select(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={inputId}
        className={`mb-2 block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase ${
          centered ? "text-center" : ""
        }`}
      >
        {label}
      </label>

      {/* Full combobox semantics: without role/aria-expanded/aria-controls
          this reads to assistive tech — and to an agent — as a plain text
          box with a mysterious list appearing somewhere nearby. */}
      <input
        id={inputId}
        name={name}
        data-field={field}
        type="text"
        role="combobox"
        aria-expanded={open && !value}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && !value && results[highlight]
            ? `${listId}-${highlight}`
            : undefined
        }
        value={value ? airportLabel(value) : query}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          if (!value && results.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
        className={`w-full rounded-xl border bg-white py-3.5 text-[14px] text-navy transition-colors outline-none placeholder:text-ink-3/70 ${
          centered ? "px-10 text-center" : "px-4"
        } ${value ? "border-navy/30 font-medium" : "border-border focus:border-navy/40"}`}
      />

      {value && (
        <button
          type="button"
          aria-label={typeof label === "string" ? `Clear ${label}` : "Clear airport"}
          onClick={() => {
            onChange(null);
            setQuery("");
          }}
          className="absolute top-[38px] right-3 flex h-6 w-6 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-navy-light hover:text-navy"
        >
          ×
        </button>
      )}

      {open && !value && (
        <ul
          id={listId}
          role="listbox"
          aria-label={typeof label === "string" ? `${label} airport results` : "Airport results"}
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl glass py-2"
        >
          {results.map((a, i) => (
            <li
              key={a.icao || a.iata}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === highlight}
              aria-label={`${a.iata || a.icao} — ${a.city || a.name}, ${a.name}`}
              data-airport={a.iata || a.icao}
              data-icao={a.icao}
            >
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => select(a)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === highlight ? "bg-navy-light" : ""
                }`}
              >
                <span className="w-12 shrink-0 text-[12px] font-semibold tracking-[0.1em] text-navy">
                  {a.iata || a.icao}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-navy">
                    {a.city || a.name}
                    {a.region ? (
                      <span className="font-light text-ink-3">, {a.region}</span>
                    ) : null}
                  </span>
                  <span className="block truncate text-[11px] font-light text-ink-2">
                    {a.name}
                    {a.icao && a.iata ? ` · ${a.icao}` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
