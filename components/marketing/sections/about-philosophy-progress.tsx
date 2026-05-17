"use client";

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { scrollProgressBar } from "@/lib/gsap";

type PhilosophyProgressLineProps = {
  className?: string;
};

/**
 * Scroll-progress line that connects the four philosophy steps
 * (Discover · Design · Stage · Document) along their shared `border-t`.
 *
 * Driven by the curated `scrollProgressBar` factory — honors
 * reduced-motion (renders full) and cleans up on unmount via
 * `gsap.context.revert()` inside the factory.
 */
export function PhilosophyProgressLine({
  className,
}: PhilosophyProgressLineProps): ReactElement {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bar = barRef.current;
    if (!wrap || !bar) return;
    const cleanup = scrollProgressBar({
      bar,
      container: wrap,
      scrub: 0.3,
    });
    return cleanup;
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={className}>
      <div className="relative h-[2px] w-full bg-transparent">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full origin-left bg-[color:var(--color-gold)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
