"use client";

import { useCallback, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type AboutHeroPortraitProps = {
  portraitImageUrl: string;
};

/**
 * SIG-04 "Drishti" — cursor-distortion-feel for the founder portrait.
 *
 * Subtle CSS-only hover: a brief `filter: hue-rotate + saturate` shift
 * paired with a `scale(1.02)` lift and a brass-foil radial gradient that
 * tracks the cursor X position via a CSS variable. No GSAP, no WebGL —
 * the spec asks for the *feel* of SIG-04, not the full OGL hover.
 *
 * Disabled on:
 *   - `prefers-reduced-motion`
 *   - coarse pointers (touch)
 */
export function AboutHeroPortrait({
  portraitImageUrl,
}: AboutHeroPortraitProps): ReactElement {
  const figureRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      // Coarse-pointer guard (mobile, stylus-only) — avoid sticky-hover state.
      if (event.pointerType === "touch") return;
      const el = figureRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      const my = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    },
    [prefersReducedMotion],
  );

  const onPointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      if (event.pointerType === "touch") return;
      setActive(true);
    },
    [prefersReducedMotion],
  );

  const onPointerLeave = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <figure
      ref={figureRef}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)] [transition:transform_600ms_var(--ease-out),filter_400ms_var(--ease-out)] will-change-transform motion-reduce:transition-none"
      style={{
        transform: active ? "scale(1.02)" : "scale(1)",
        filter: active ? "hue-rotate(2deg) saturate(1.08)" : "none",
      }}
      aria-label="TODO: founder portrait alt text"
    >
      {/* TODO: replace placeholder div with next/image once ABOUT-01 lands */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(184,137,58,0.25) 0%, rgba(30,42,56,0.35) 100%)",
        }}
      />
      {/* Brass-foil cursor-tracking glow overlay (SIG-04 feel). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [transition:opacity_400ms_var(--ease-out)] motion-reduce:transition-none"
        style={{
          opacity: active ? 0.55 : 0,
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(184,137,58,0.45), rgba(184,137,58,0.10) 45%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 p-[var(--space-4)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bg)]"
      >
        IMG: {portraitImageUrl}
      </div>
    </figure>
  );
}
