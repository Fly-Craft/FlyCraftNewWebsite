"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades content up once when it scrolls into view. `delay` staggers
 * siblings. Reduced-motion is handled in CSS (.gp-reveal), not here —
 * the observer still fires, the transition is simply absent.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`gp-reveal ${on ? "gp-reveal-on" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
