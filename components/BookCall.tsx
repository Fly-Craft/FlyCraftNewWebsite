"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/site-config";

/**
 * "Book a Call" — Natan's Google scheduling page in a dialog.
 *
 * Portaled to <body> for the same reason the enquiry dialog is: the cards it
 * opens from are `.glass`, and backdrop-filter makes an element a containing
 * block for fixed-position descendants, so an in-place overlay would be
 * clipped inside its card rather than covering the viewport.
 *
 * The iframe is only mounted while the dialog is open. Google's scheduler is
 * a heavy third-party embed, and four of them sitting idle behind closed
 * dialogs on /programs would be four needless loads on every visit.
 */

const NEVER_CHANGES = () => () => {};
/** False on the server, true once mounted, so the portal never runs in SSR. */
const useHydrated = () =>
  useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false
  );

function BookCallDialog({ url, onClose }: { url: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    /* No Tab trap here, unlike the enquiry dialog: focus that enters the
       scheduler crosses into a cross-origin iframe, where the keydown
       handler can't see it, so a trap would fight the embed rather than
       help. Escape and the close button both still work. */
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      previouslyFocused?.focus?.();
    };
  }, [close]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Book a call with Natan Benchimol"
    >
      <div
        className="fixed inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass relative flex h-full max-h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="glass-capsule glass-btn absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[15px] leading-none text-navy sm:top-5 sm:right-5"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        {/* The embed brings its own white page, so it gets the full panel
            below the close button rather than sitting on the glass. */}
        <iframe
          src={url}
          title="Book a call with Natan Benchimol"
          className="h-full w-full flex-1 rounded-3xl border-0 bg-white pt-2"
        />
      </div>
    </div>,
    document.body
  );
}

/**
 * `variant` picks the weight: "solid" sits beside a quieter button, "quiet"
 * beside the filled Contact Us on the programme cards.
 */
export default function BookCallButton({
  variant = "quiet",
  className = "",
  url,
}: {
  variant?: "quiet" | "solid";
  className?: string;
  /** A programme's own schedule. Omitted on Natan's card, which stays general. */
  url?: string;
}) {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();

  const base =
    "rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] uppercase";
  const skin =
    variant === "solid"
      ? "glass-selected glass-btn text-white"
      : "glass-capsule glass-btn text-navy";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`${base} ${skin} ${className}`}
      >
        Book a Call
      </button>
      {hydrated && open ? (
        <BookCallDialog
          url={url ?? siteConfig.bookingUrl}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
