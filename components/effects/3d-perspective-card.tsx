"use client";

/**
 * 3dPerspectiveCard — luxurious cursor-tilt card with optional brass sheen.
 *
 * The card tilts toward the cursor with a slow, settled ease. Max tilt is
 * intentionally 6° (not 20°). An optional brass-foil sheen follows the
 * pointer via CSS variables — no React state in the hot path.
 *
 * Constraints honoured:
 *   - perspective 1200px.
 *   - Max tilt clamped to 8° absolute, 6° default.
 *   - `cubic-bezier(0.22, 1, 0.36, 1)` via `gsap.quickTo`.
 *   - prefers-reduced-motion / coarse-pointer / Save-Data → static.
 *
 * Best applied to: Services tiles, Process-step cards, Testimonial cards,
 * Recognition logos card, Contact CTA card.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  DEPTH,
  EASE_3D,
  clamp,
  getCoarsePointer,
  getSaveData,
  mapRange,
} from "@/lib/effects/3d-utils";

export type PerspectiveCardProps = {
  children: React.ReactNode;
  /** Max tilt in degrees. Default 6, hard-capped at 8. */
  maxTilt?: number;
  /** Show a brass-foil sheen that follows the cursor. Default true. */
  sheen?: boolean;
  /** Sheen strength. */
  glareIntensity?: "off" | "subtle" | "rich";
  /** Outer className for the card frame. */
  className?: string;
};

const GLARE_OPACITY: Record<"off" | "subtle" | "rich", number> = {
  off: 0,
  subtle: 0.14,
  rich: 0.28,
};

export function PerspectiveCard({
  children,
  maxTilt = 6,
  sheen = true,
  glareIntensity = "subtle",
  className,
}: PerspectiveCardProps): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const safeTilt = clamp(maxTilt, 0, DEPTH.rotateXMax);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    if (!wrap || !tilt) return;
    if (prefersReducedMotion || getSaveData() || getCoarsePointer()) return;

    let detachPointer: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const rotX = gsap.quickTo(tilt, "rotateX", {
        duration: 0.6,
        ease: EASE_3D.hover,
      });
      const rotY = gsap.quickTo(tilt, "rotateY", {
        duration: 0.6,
        ease: EASE_3D.hover,
      });

      const onMove = (e: PointerEvent): void => {
        if (document.hidden) return;
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        // Centre = 0; edges = ±safeTilt.
        rotY(mapRange(px, 0, 1, -safeTilt, safeTilt));
        rotX(mapRange(py, 0, 1, safeTilt, -safeTilt));

        // CSS-driven sheen — no React update needed.
        if (sheen) {
          wrap.style.setProperty("--sheen-x", `${(px * 100).toFixed(2)}%`);
          wrap.style.setProperty("--sheen-y", `${(py * 100).toFixed(2)}%`);
        }
      };
      const onLeave = (): void => {
        rotX(0);
        rotY(0);
        if (sheen) {
          wrap.style.setProperty("--sheen-x", "50%");
          wrap.style.setProperty("--sheen-y", "50%");
        }
      };

      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      detachPointer = (): void => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    }, wrap);

    return (): void => {
      detachPointer?.();
      ctx.revert();
    };
  }, [prefersReducedMotion, safeTilt, sheen]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      style={
        {
          perspective: `${DEPTH.perspectiveDefault}px`,
          "--sheen-x": "50%",
          "--sheen-y": "50%",
        } as React.CSSProperties
      }
    >
      <div
        ref={tiltRef}
        className="relative will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {sheen && glareIntensity !== "off" && !prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background:
                "radial-gradient(circle at var(--sheen-x) var(--sheen-y), var(--color-gold-soft) 0%, transparent 55%)",
              mixBlendMode: "soft-light",
              opacity: GLARE_OPACITY[glareIntensity],
              transition: "opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}
      </div>
    </div>
  );
}
