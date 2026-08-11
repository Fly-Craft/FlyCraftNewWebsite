"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ProgramEnquiryForm from "./ProgramEnquiryForm";
import type { Program } from "@/lib/programs";

/**
 * The enquiry form as a floating dialog.
 *
 * Portaled to <body> rather than rendered in place: the programme cards
 * are `.glass`, and backdrop-filter makes an element a containing block
 * for fixed-position descendants, so an in-place overlay would be clipped
 * inside its card instead of covering the viewport.
 *
 * Mounted only while open (see ProgramEnquiry), so `document` is never
 * touched during SSR and the form starts clean on every open.
 */
export default function ProgramEnquiryDialog({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = `pe-dialog-${program.slug}`;

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    /* Hold the page still behind the dialog. Replacing the scrollbar with
       equivalent padding keeps the fixed nav and the page from jumping
       sideways as it disappears. */
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    /* Focus the panel rather than the first field: it gets the dialog's
       name announced, and it doesn't throw up a mobile keyboard before
       anyone has decided to type. */
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep focus inside the dialog while it's open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (
        e.shiftKey &&
        (active === first || !panelRef.current?.contains(active))
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      // Hand focus back to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [close]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 py-10 sm:p-8 sm:py-14"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop. Clicking it closes, same as the X. */}
      <div
        className="fixed inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass relative my-auto w-full max-w-xl rounded-3xl p-6 pt-14 outline-none sm:p-10 sm:pt-16"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="glass-capsule glass-btn absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full text-[15px] leading-none text-navy sm:top-6 sm:right-6"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <ProgramEnquiryForm
          program={program.slug}
          programLabel={program.label}
          fields={program.fields}
          variant="modal"
          titleId={titleId}
          onDone={close}
        />
      </div>
    </div>,
    document.body,
  );
}
