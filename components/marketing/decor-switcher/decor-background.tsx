"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { useDecorSwitcher } from "./decor-switcher-context";

type DecorBackgroundProps = {
  /** The section element to write CSS variables to. */
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * DecorBackground
 *
 * Drives the section's background and tint based on `mode`.
 *
 * We mutate two CSS custom properties on the target section element:
 *   --decor-bg     — the section background colour
 *   --decor-tint   — a radial overlay tint (warm at day, cool at night)
 *
 * GSAP `to(target, { '--decor-bg': '#...' })` interpolates CSS variables
 * cleanly, and we keep the inline-style surface area to just the section.
 *
 * Curve: 1.6s per docs §M (slightly slower than the image crossfade so
 * the mood lags the lights a beat, which reads as cinematic, not snappy).
 *
 * Also renders a fixed pseudo-layer DIV inside the section that *consumes*
 * the variables — that way we don't have to set inline background colours
 * on every paint, only on transition keyframes.
 */
export function DecorBackground({
  targetRef,
  className,
}: DecorBackgroundProps): React.ReactElement {
  const { mode, isHydrated } = useDecorSwitcher();
  const prefersReducedMotion = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const dayBg = "#FAF7F2"; // warm ivory — matches --color-bg
    const nightBg = "#0E1822"; // deeper than --color-cool, intentionally inky
    const dayTint = "rgba(255, 246, 220, 0)";
    const nightTint = "rgba(184, 137, 58, 0.18)"; // warm gold glow over midnight

    const targetBg = mode === "night" ? nightBg : dayBg;
    const targetTint = mode === "night" ? nightTint : dayTint;

    // Reduced motion or initial paint — set instantly.
    if (prefersReducedMotion || !isHydrated) {
      target.style.setProperty("--decor-bg", targetBg);
      target.style.setProperty("--decor-tint", targetTint);
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(target, {
      duration: 1.6,
      ease: "power2.inOut",
      "--decor-bg": targetBg,
      "--decor-tint": targetTint,
    });

    return (): void => {
      tweenRef.current?.kill();
    };
  }, [mode, isHydrated, prefersReducedMotion, targetRef]);

  return (
    <>
      {/* Base wash */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 pointer-events-none",
          "bg-[color:var(--decor-bg,_var(--color-bg))]",
          className,
        )}
      />
      {/* Warm tint overlay (only visible at night) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 60% at 70% 30%, var(--decor-tint, transparent), transparent 70%)",
        }}
      />
    </>
  );
}
