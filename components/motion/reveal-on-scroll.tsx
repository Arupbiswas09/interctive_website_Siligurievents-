"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealOnScrollProps = {
  children: React.ReactNode;
  /** Pixels translated from below before resting at 0. */
  distance?: number;
  /** Stagger delay in seconds if children are individually targetable. */
  delay?: number;
  /** ScrollTrigger threshold (default `top 85%` per docs MO-02). */
  start?: string;
  /** Render as a different element. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

/**
 * MO-02 — RevealOnScroll
 * Fade + translate-up on enter, ScrollTrigger threshold `top 85%`.
 * Reduced motion: simple 200ms fade.
 */
export function RevealOnScroll({
  children,
  distance = 32,
  delay = 0,
  start = "top 85%",
  as: Tag = "div",
  className,
}: RevealOnScrollProps): React.ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: "none",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
        return;
      }

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: distance },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [distance, delay, start, prefersReducedMotion]);

  const Element = Tag as React.ElementType;
  return (
    <Element
      ref={ref as React.Ref<HTMLElement>}
      className={cn("will-change-transform", className)}
    >
      {children}
    </Element>
  );
}
