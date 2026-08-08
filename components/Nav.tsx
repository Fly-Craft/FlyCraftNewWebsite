"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AIRCRAFT } from "@/lib/fleet-aircraft";
import { bookLinks, landingLinks, programLinks } from "@/lib/site-config";

const linkCls =
  "relative z-10 text-[9px] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-300 sm:text-[10px] sm:tracking-[0.25em] lg:text-[11px] lg:tracking-[0.3em]";

/**
 * Tabs that open a hover menu — one implementation for both, so the panel
 * styling can't drift; only the dimensions differ per menu.
 */
const DROPDOWNS: Record<
  string,
  {
    width: string;
    itemWidth: string;
    items: { href: string; label: React.ReactNode }[];
  }
> = {
  // Narrowest of the three — the tab labels are one short word each. The
  // pl-2 nudges all three right by the same 8px: left-aligned to each other
  // (so the labels stack cleanly), but the block as a whole was sitting
  // ~13px left of centre because the longest label doesn't fill its column.
  "/charter": {
    width: "w-[148px]",
    itemWidth: "w-[76px] pl-2",
    items: bookLinks,
  },
  "/fleet": {
    width: "w-48",
    itemWidth: "w-[120px]",
    items: AIRCRAFT.map((a) => ({
      href: `/fleet/${a.slug}`,
      label: (
        <>
          Pod {a.pod} <span className="opacity-40">·</span> {a.tail}
        </>
      ),
    })),
  },
  // ~15% narrower than Fleet, and a tighter label column so the short
  // programme names sit closer to centre while staying left-aligned
  // with each other. The pl-2 shifts all three right by the same 8px —
  // their ink sat 36px from the left edge but ~52px from the right.
  "/programs": {
    width: "w-[164px]",
    itemWidth: "w-[92px] pl-2",
    items: programLinks,
  },
};

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [capsule, setCapsule] = useState({ left: 0, width: 0, visible: false });
  // The capsule snaps into place on first paint, then glides on navigation
  const [animated, setAnimated] = useState(false);

  // Which nav tab owns the current page (sub-pages count toward their tab)
  const activeHref =
    pathname === "/"
      ? "/"
      : (landingLinks.find(
          (l) => pathname === l.href || pathname.startsWith(l.href + "/")
        )?.href ?? null);

  useEffect(() => {
    function update() {
      const el = activeHref ? linkRefs.current[activeHref] : null;
      const pill = pillRef.current;
      if (!el || !pill) {
        setCapsule((c) => ({ ...c, visible: false }));
        return;
      }
      const er = el.getBoundingClientRect();
      const pr = pill.getBoundingClientRect();
      // Two corrections so the capsule sits on the glyphs, not the box:
      // letter-spacing also trails the final character (shift back half),
      // and `left` is measured from the pill's padding box while the rect
      // is its border box (subtract the border).
      const tracking = parseFloat(getComputedStyle(el).letterSpacing) || 0;
      setCapsule({
        left: er.left - pr.left - pill.clientLeft - 10 - tracking / 2,
        width: er.width + 20,
        visible: true,
      });
      requestAnimationFrame(() => setAnimated(true));
    }
    // After fonts settle, widths can shift a hair — measure twice
    update();
    const t = setTimeout(update, 300);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [activeHref]);

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

  const linkColor = (href: string) =>
    activeHref === href ? "text-navy" : "text-navy hover:opacity-55";

  return (
    <nav
      ref={ref}
      className="fixed top-4 left-1/2 z-50 w-[92%] -translate-x-1/2 sm:w-fit sm:max-w-[92%]"
    >
      {/* ── Mobile bar: hamburger left, CRAFT centered ──── */}
      <div className="glass relative flex items-center rounded-full px-4 py-3 sm:hidden">
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
        <div className="glass absolute top-full left-0 mt-2 w-60 overflow-hidden rounded-3xl p-2 sm:hidden">
          {landingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-full px-5 py-3 text-[11px] font-medium tracking-[0.25em] text-navy uppercase transition-colors ${
                activeHref === link.href ? "glass-capsule" : "hover:bg-navy/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── Desktop pill ────────────────────────────────── */}
      <div
        ref={pillRef}
        className="glass relative hidden items-center justify-center gap-x-6 rounded-full px-7 py-3 sm:flex"
      >
        {/* Active-tab capsule — glides to whichever page you're on */}
        <div
          aria-hidden
          className={`glass-capsule absolute top-1/2 h-8 -translate-y-1/2 rounded-full ${
            animated
              ? "transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              : ""
          }`}
          style={{
            left: capsule.left,
            width: capsule.width,
            opacity: capsule.visible ? 1 : 0,
          }}
        />

        <Link
          href="/"
          ref={(el) => {
            linkRefs.current["/"] = el;
          }}
          className="relative z-10 text-[13px] font-semibold tracking-[0.32em] text-navy transition-colors duration-300"
        >
          CRAFT
        </Link>

        {landingLinks.map((link) => {
          const menu = DROPDOWNS[link.href];
          if (menu) {
            return (
              <div key={link.href} className="group relative flex items-center">
                {/* The tab itself still navigates to the section landing page;
                    the menu is hover-only. */}
                <Link
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[link.href] = el;
                  }}
                  className={`${linkCls} ${linkColor(link.href)}`}
                >
                  {link.label}
                </Link>
                <div className="pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div
                    className={`glass ${menu.width} divide-y divide-navy/10 overflow-hidden rounded-3xl`}
                  >
                    {menu.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex justify-center px-4 py-3 text-[10px] font-medium tracking-[0.2em] text-ink-2 uppercase transition-colors hover:bg-navy/5 hover:text-navy"
                      >
                        <span className={menu.itemWidth}>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                linkRefs.current[link.href] = el;
              }}
              className={`${linkCls} ${linkColor(link.href)}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
