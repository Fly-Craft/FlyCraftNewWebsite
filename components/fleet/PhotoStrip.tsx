"use client";

import { useRef, useState } from "react";

/**
 * Horizontal photo strip — native touch/trackpad scrolling plus
 * click-and-drag with the cursor (grab to pan, like the exec carousel).
 */
export default function PhotoStrip({
  images,
  tail,
}: {
  images: string[];
  tail: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  function onMouseDown(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    setDragging(true);
  }

  function onMouseMove(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  }

  function endDrag() {
    drag.current.active = false;
    setDragging(false);
  }

  return (
    <section
      ref={scrollerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      className={`overflow-x-auto px-6 pb-4 select-none sm:px-20 [scrollbar-width:thin] ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div className="flex w-max gap-5">
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt={`${tail} — gallery photo`}
            loading="lazy"
            draggable={false}
            className="pointer-events-none h-64 w-auto rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.14)] sm:h-80"
          />
        ))}
      </div>
    </section>
  );
}
