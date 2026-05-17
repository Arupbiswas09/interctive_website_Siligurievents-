"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxProps = {
  children: React.ReactNode;
  /**
   * Parallax speed — `0` is static, `1` is page-locked.
   * Use negative values to scroll in the opposite direction.
   */
  speed?: number;
  className?: string;
};

/**
 * MO-03 — Parallax
 * Translates Y based on scroll position; speed is the share of scroll travel
 * mapped to the element. Reduced motion: static, no transform.
 */
export function Parallax({
  children,
  speed = 0.3,
  className,
}: ParallaxProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Distance to travel = speed * viewport height (cinematic but bounded).
      const distance = speed * window.innerHeight;
      gsap.fromTo(
        el,
        { yPercent: 0, y: -distance / 2 },
        {
          y: distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
