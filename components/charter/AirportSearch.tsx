"use client";

import { useEffect, useRef, useState } from "react";
import type { Airport } from "@/lib/airports-data";
import { airportLabel, searchAirports } from "@/lib/airport-search";

type Props = {
  label: React.ReactNode;
  placeholder: string;
  value: Airport | null;
  onChange: (a: Airport | null) => void;
};

export default function AirportSearch({ label, placeholder, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

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
      <label className="mb-2 block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
        {label}
      </label>

      <input
        type="text"
        value={value ? airportLabel(value) : query}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          if (!value && results.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-navy transition-colors outline-none placeholder:text-ink-3/70 ${
          value ? "border-navy/30 font-medium" : "border-border focus:border-navy/40"
        }`}
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
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-navy/10 bg-white py-2 shadow-[0_20px_60px_rgba(12,29,61,0.16)]"
        >
          {results.map((a, i) => (
            <li key={a.icao || a.iata} role="option" aria-selected={i === highlight}>
              <button
                type="button"
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
