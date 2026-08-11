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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:py-8"
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

      {/* Capped to the space between the container's padding so the panel
          can never run off the top or bottom of the screen. The form is
          sized to fit inside that on a normal laptop or phone; on anything
          shorter the inner div takes the scroll, which keeps the close
          button and the programme name pinned in view. */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass relative flex max-h-full w-full max-w-xl flex-col rounded-3xl outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="glass-capsule glass-btn absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[15px] leading-none text-navy sm:top-5 sm:right-5"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="overflow-y-auto overscroll-contain px-5 pt-12 pb-5 sm:px-8 sm:pt-12 sm:pb-8">
          <ProgramEnquiryForm
            program={program.slug}
            programLabel={program.label}
            fields={program.fields}
            variant="modal"
            titleId={titleId}
            onDone={close}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
