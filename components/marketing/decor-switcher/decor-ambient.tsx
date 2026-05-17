"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { useDecorSwitcher } from "./decor-switcher-context";

type DecorAmbientProps = {
  className?: string;
};

type Flame = {
  /** Percentage position across the section. */
  xPct: number;
  yPct: number;
  /** Radius in px at peak. */
  size: number;
  /** Animation period for the breathing loop (ms). */
  period: number;
  /** Random phase offset so flames don't sync. */
  phase: number;
};

const FLAMES: ReadonlyArray<Flame> = [
  { xPct: 18, yPct: 28, size: 220, period: 2400, phase: 0 },
  { xPct: 68, yPct: 62, size: 280, period: 3200, phase: 700 },
  { xPct: 42, yPct: 82, size: 180, period: 2800, phase: 1500 },
];

/**
 * Has the browser signalled "Save-Data: on"?
 * If yes, we skip the ambient layer entirely.
 */
function isSaveDataOn(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

/**
 * Lazy-mount on idle. Returns true once we should render the ambient layer.
 * - On Save-Data: never returns true.
 * - On reduced motion: never returns true (the visuals are decorative).
 * - Otherwise: true after `requestIdleCallback` (or 1.2s fallback).
 */
function useLazyAmbient(disabled: boolean): boolean {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (disabled) return;
    if (isSaveDataOn()) return;

    type IdleScheduler = (cb: () => void, opts?: { timeout: number }) => number;
    const ric: IdleScheduler | undefined =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (window as unknown as { requestIdleCallback: IdleScheduler }).requestIdleCallback
        : undefined;

    const cancel = (id: number): void => {
      if (typeof window === "undefined") return;
      const w = window as unknown as { cancelIdleCallback?: (id: number) => void };
      if (typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };

    const id = ric
      ? ric(() => setReady(true), { timeout: 1200 })
      : window.setTimeout(() => setReady(true), 1200);

    return (): void => cancel(id);
  }, [disabled]);

  return ready;
}

/**
 * DecorAmbient
 *
 * Adds atmosphere ONLY in night mode:
 *  - SVG `feTurbulence` noise overlay at very low opacity (4%).
 *  - 2–3 radial-gradient "candle" point lights with breathing opacity loops.
 *
 * Lazy-mounted via requestIdleCallback. Skipped entirely if:
 *  - prefers-reduced-motion is set
 *  - Save-Data is on
 */
export function DecorAmbient({ className }: DecorAmbientProps): React.ReactElement | null {
  const { mode } = useDecorSwitcher();
  const prefersReducedMotion = useReducedMotion();
  const isNight = mode === "night";

  const ready = useLazyAmbient(prefersReducedMotion);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Breathing loops — only run when mounted, not on reduced motion.
  useEffect(() => {
    if (!ready || prefersReducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      FLAMES.forEach((flame, idx) => {
        const el = root.querySelector<HTMLElement>(`[data-flame="${idx}"]`);
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.55, scale: 0.92 },
          {
            opacity: 1,
            scale: 1.04,
            duration: flame.period / 1000,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: flame.phase / 1000,
            transformOrigin: "center",
          },
        );
      });
    }, root);

    return (): void => {
      ctx.revert();
    };
  }, [ready, prefersReducedMotion]);

  if (!ready) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-[5]",
        "transition-opacity duration-[1200ms] ease-out",
        isNight ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {/* Candle / flicker point lights */}
      {FLAMES.map((flame, idx) => (
        <span
          key={idx}
          data-flame={idx}
          className="absolute block rounded-full"
          style={{
            left: `${flame.xPct}%`,
            top: `${flame.yPct}%`,
            width: flame.size,
            height: flame.size,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(closest-side, rgba(255, 196, 110, 0.32) 0%, rgba(255, 170, 80, 0.12) 40%, rgba(0,0,0,0) 70%)",
            filter: "blur(8px)",
            mixBlendMode: "screen",
          }}
        />
      ))}

      {/* Film grain — SVG turbulence rasterised into a noise tile */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="decor-ambient-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#decor-ambient-noise)" />
      </svg>
    </div>
  );
}
