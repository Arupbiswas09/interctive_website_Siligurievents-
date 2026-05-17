"use client";

import { useEffect, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type CalligraphicRevealProps = {
  children: ReactNode;
  /** Identifier whose change triggers a fresh reveal — usually the slug. */
  keyToken: string;
  className?: string;
  id?: string;
  role?: string;
};

/**
 * SIG-12 "Vidaai" — calligraphic clip-path reveal applied to the active
 * package row when the category slug changes.
 *
 * Animates `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` over 600ms
 * with `power3.out` so the new row sweeps in from the left like a brush
 * stroke. Reduced motion: 200ms autoAlpha fade only (factory-style
 * fallback). Cleans up via `gsap.context.revert()` on unmount.
 */
export function CalligraphicReveal({
  children,
  keyToken,
  className,
  id,
  role,
}: CalligraphicRevealProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2, ease: "none" },
        );
        return;
      }
      gsap.fromTo(
        el,
        {
          clipPath: "inset(0 100% 0 0)",
          webkitClipPath: "inset(0 100% 0 0)",
        },
        {
          clipPath: "inset(0 0 0 0)",
          webkitClipPath: "inset(0 0 0 0)",
          duration: 0.6,
          ease: "power3.out",
        },
      );
    }, el);

    return (): void => {
      ctx.revert();
    };
    // Re-run whenever the slug changes so the same DOM container animates
    // each transition. `prefersReducedMotion` is included so toggling the
    // OS setting mid-session rebuilds correctly.
  }, [keyToken, prefersReducedMotion]);

  return (
    <div ref={ref} id={id} role={role} className={className}>
      {children}
    </div>
  );
}
