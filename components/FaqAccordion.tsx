"use client";

import { useState, type ReactNode } from "react";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={i}
            className="overflow-hidden rounded-3xl glass"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
            >
              <span className="text-[15px] font-medium text-navy sm:text-[16px]">
                {item.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navy/15 text-[14px] text-navy transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                className="px-6 pb-6 text-[14px] leading-relaxed font-light text-ink-2 sm:px-8"
                style={{ animation: "pageFade 0.25s ease both" }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
