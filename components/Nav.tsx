"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AIRCRAFT } from "@/lib/fleet-aircraft";
import { landingLinks } from "@/lib/site-config";

const linkCls =
  "text-[9px] font-medium tracking-[0.2em] whitespace-nowrap text-navy uppercase transition-opacity hover:opacity-55 sm:text-[10px] sm:tracking-[0.25em] lg:text-[11px] lg:tracking-[0.3em]";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Close the mobile menu on outside tap or Escape
  useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <nav
      ref={ref}
      className="fixed top-4 left-1/2 z-50 w-[92%] -translate-x-1/2 sm:w-fit sm:max-w-[92%]"
    >
      {/* ── Mobile bar: hamburger left, CRAFT centered ──── */}
      <div className="relative flex items-center rounded-full border border-navy/10 bg-white/95 px-4 py-3 shadow-[0_4px_32px_rgba(12,29,61,0.08)] backdrop-blur-xl sm:hidden">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
        >
          <span
            className={`h-[1.5px] w-[18px] bg-navy transition-transform duration-200 ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-[18px] bg-navy transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-[18px] bg-navy transition-transform duration-200 ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold tracking-[0.32em] text-navy"
        >
          CRAFT
        </Link>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────── */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-60 overflow-hidden rounded-3xl border border-navy/10 bg-white/95 py-2 shadow-[0_24px_60px_rgba(12,29,61,0.16)] backdrop-blur-xl sm:hidden">
          {landingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-7 py-3.5 text-[11px] font-medium tracking-[0.25em] text-navy uppercase transition-colors hover:bg-navy/5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Desktop pill (unchanged) ────────────────────── */}
      <div className="hidden items-center justify-center gap-x-8 rounded-full border border-navy/10 bg-white/95 px-12 py-3 shadow-[0_4px_32px_rgba(12,29,61,0.08)] backdrop-blur-xl sm:flex">
        <Link
          href="/"
          className="text-[13px] font-semibold tracking-[0.32em] text-navy"
        >
          CRAFT
        </Link>

        {landingLinks.map((link) => {
          if (link.href === "/fleet") {
            return (
              <div key={link.href} className="group relative flex items-center">
                <Link href={link.href} className={linkCls}>
                  {link.label}
                </Link>
                <div className="pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="w-48 divide-y divide-navy/10 overflow-hidden rounded-3xl border border-navy/10 bg-white/95 shadow-[0_24px_60px_rgba(12,29,61,0.14)] backdrop-blur-xl">
                    {AIRCRAFT.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/fleet/${a.slug}`}
                        className="flex justify-center px-4 py-3 text-[10px] font-medium tracking-[0.2em] text-ink-2 uppercase transition-colors hover:bg-navy/5 hover:text-navy"
                      >
                        <span className="w-[120px]">
                          Pod {a.pod} <span className="opacity-40">·</span>{" "}
                          {a.tail}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <Link key={link.href} href={link.href} className={linkCls}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
