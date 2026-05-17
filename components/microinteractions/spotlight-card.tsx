"use client";

/**
 * SpotlightCard — bordered card with a conic-gradient spotlight border that
 * follows the cursor (21st.dev's "spotlight-card" pattern).
 *
 * Two-layer effect:
 *   1. A conic-gradient border ring (the "spotlight rim") rotated by an
 *      angle CSS variable that's updated to point AT the cursor.
 *   2. A radial-gradient inner glow that brightens the side closest to the
 *      cursor (gives the card "lit-from-within" feeling).
 *
 * Uses CSS Houdini `@property` to register `--spotlight-angle` as a typed
 * `<angle>` so transitions interpolate smoothly between two rotational
 * positions instead of jumping (browsers without Houdini still get an
 * instant snap — no errors). Reduced-motion: static centred spotlight.
 *
 * Tailwind-friendly via className passthrough.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Rim brightness 0–1. Default 0.7. */
  rimIntensity?: number;
  /** Inner glow size in px. Default 280. */
  glowSize?: number;
};

export function SpotlightCard({
  children,
  className,
  rimIntensity = 0.7,
  glowSize = 280,
}: SpotlightCardProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Angle from card centre to pointer (deg, 0 = up).
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      el.style.setProperty("--spotlight-angle", `${angle}deg`);
      el.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
      el.style.setProperty("--spotlight-on", "1");
    };

    const onLeave = (): void => {
      el.style.setProperty("--spotlight-on", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return (): void => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "sgv-spotlight-host relative isolate overflow-hidden rounded-2xl",
        className
      )}
      style={
        {
          "--spotlight-rim": rimIntensity,
          "--spotlight-glow-size": `${glowSize}px`,
        } as React.CSSProperties
      }
    >
      <style>{`
        @supports (background: paint(houdini)) {
          @property --spotlight-angle {
            syntax: "<angle>";
            inherits: false;
            initial-value: 0deg;
          }
        }
        .sgv-spotlight-host {
          --spotlight-angle: 0deg;
          --spotlight-x: 50%;
          --spotlight-y: 50%;
          --spotlight-on: 0;
          border: 1px solid rgba(232, 213, 168, 0.18);
          background-color: rgba(11, 11, 11, 0.6);
          transition: border-color 220ms ease, transform 220ms ease;
        }
        /* Conic rim — masked to a 1px border via two layered ::before stacks.
           We can't use ::before twice, so we use ::before for the rim and a
           tiny pseudo on a child via ::after on the host for inner glow. */
        .sgv-spotlight-host::before {
          content: "";
          position: absolute;
          inset: -1px;
          padding: 1px;
          border-radius: inherit;
          background: conic-gradient(
            from var(--spotlight-angle, 0deg),
            transparent 0deg,
            rgba(232, 213, 168, calc(var(--spotlight-rim, 0.7))) 30deg,
            transparent 90deg,
            transparent 360deg
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: var(--spotlight-on, 0);
          transition: opacity 280ms ease;
          pointer-events: none;
          z-index: 0;
        }
        .sgv-spotlight-host::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            var(--spotlight-glow-size, 280px) circle at var(--spotlight-x) var(--spotlight-y),
            rgba(232, 213, 168, 0.18),
            transparent 60%
          );
          opacity: var(--spotlight-on, 0);
          transition: opacity 280ms ease;
          z-index: 0;
        }
        .sgv-spotlight-host:hover {
          border-color: rgba(232, 213, 168, 0.32);
        }
        .sgv-spotlight-host > * {
          position: relative;
          z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .sgv-spotlight-host::before,
          .sgv-spotlight-host::after {
            transition: none;
            opacity: 0;
          }
          .sgv-spotlight-host:hover::before {
            opacity: 0.4;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
