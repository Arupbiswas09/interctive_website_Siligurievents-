"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  /** Pixel radius from element centre that the cursor "magnetizes" within. */
  radius?: number;
  /** 0–1; how strongly the element follows the cursor. */
  strength?: number;
  className?: string;
};

/**
 * MO-04 — MagneticButton
 * Element follows the cursor within a radius, snapping back on leave.
 * Disabled on coarse pointers (touch) and reduced motion.
 *
 * Wrap your <Button> in this to opt-in:
 *   <MagneticButton><Button>Plan my event</Button></MagneticButton>
 */
export function MagneticButton({
  children,
  radius = 80,
  strength = 0.35,
  className,
}: MagneticButtonProps): React.ReactElement {
  const ref = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: MouseEvent): void => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const distance = Math.hypot(dx, dy);
        if (distance > radius) {
          xTo(0);
          yTo(0);
          return;
        }
        xTo(dx * strength);
        yTo(dy * strength);
      };

      const onLeave = (): void => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return (): void => {
        window.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [radius, strength, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </span>
  );
}
