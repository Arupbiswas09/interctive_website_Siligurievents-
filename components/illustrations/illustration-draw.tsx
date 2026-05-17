"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getIllustration,
  type IllustrationId,
} from "@/lib/illustrations/paths";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export type IllustrationDrawSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IllustrationDrawTone =
  | "ink"
  | "muted"
  | "gold"
  | "brass"
  | "current";

export type IllustrationDrawProps = {
  /** Which illustration to render. */
  id: IllustrationId;
  /** Visual size — height in px; width follows from viewBox aspect. */
  size?: IllustrationDrawSize;
  /** Colour mapping. `current` inherits `currentColor` from the parent. */
  tone?: IllustrationDrawTone;
  /** Total draw-in duration in ms. Default 1400. */
  duration?: number;
  /** Per-layer stagger in ms. Default 80. */
  stagger?: number;
  /** Accessible label. Falls back to the illustration's English label. */
  ariaLabel?: string;
  /** Class merged into the outer `<svg>`. */
  className?: string;
};

const sizeHeightPx: Record<IllustrationDrawSize, number> = {
  xs: 24,
  sm: 40,
  md: 72,
  lg: 120,
  xl: 200,
};

const toneClass: Record<IllustrationDrawTone, string> = {
  ink: "text-[color:var(--color-ink)]",
  muted: "text-[color:var(--color-ink-muted)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
};

/**
 * `<IllustrationDraw>` — client variant of `<IllustrationBase>` that animates
 * each layer's `stroke-dasharray` from full length → 0 (the classic
 * path-draw effect). Filled layers fade in their fill once their outline
 * is drawn.
 *
 * Behaviour:
 *  • Triggers once on intersection (IntersectionObserver, threshold 0.2).
 *  • Honours `prefers-reduced-motion`: final state is set immediately.
 *  • Pure CSS animation — no GSAP plugin required (DrawSVG is paid).
 *  • Each layer uses `pathLength="1"` so `stroke-dasharray: 1 / dashoffset: 1`
 *    works regardless of the path's actual computed length.
 *
 * @example
 * <IllustrationDraw id="mehendi-tendril" tone="gold" duration={2200} />
 */
export function IllustrationDraw({
  id,
  size = "md",
  tone = "current",
  duration = 1400,
  stagger = 80,
  ariaLabel,
  className,
}: IllustrationDrawProps): React.ReactElement {
  const data = getIllustration(id);
  const label = ariaLabel ?? data.label;
  const titleId = `illu-draw-${data.id}-title`;
  const height = sizeHeightPx[size];
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);

  const viewBoxParts = data.viewBox.split(" ").map(Number);
  const vbWidth = viewBoxParts[2];
  const vbHeight = viewBoxParts[3];
  const aspect =
    typeof vbWidth === "number" && typeof vbHeight === "number" && vbHeight > 0
      ? vbWidth / vbHeight
      : 1;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    if (prefersReducedMotion) {
      svg.dataset.drawn = "true";
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      svg.dataset.drawn = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            svg.dataset.drawn = "true";
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(svg);
    return (): void => observer.disconnect();
  }, [prefersReducedMotion]);

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${height * aspect}px`,
  };

  // Unique class to scope the inline <style> so multiple instances on a
  // single page can have different durations without colliding.
  const scopeClass = `illu-draw-${data.id}`;

  return (
    <svg
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      viewBox={data.viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      data-drawn="false"
      className={cn(
        scopeClass,
        "illu-draw inline-block shrink-0 align-middle",
        toneClass[tone],
        className
      )}
    >
      <title id={titleId}>{label}</title>
      <style>{`
        .${scopeClass} path[data-drawline] {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset ${duration}ms cubic-bezier(0.16, 1, 0.3, 1),
            fill-opacity 400ms ease-out;
          fill-opacity: 0;
        }
        .${scopeClass}[data-drawn="true"] path[data-drawline] {
          stroke-dashoffset: 0;
          fill-opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .${scopeClass} path[data-drawline] {
            transition: none;
            stroke-dashoffset: 0;
            fill-opacity: 1;
          }
        }
      `}</style>
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {data.layers.map((layer, idx) => {
          const key = `${data.id}-${idx}`;
          const delay = `${idx * stagger}ms`;
          const opacity = layer.opacity ?? 1;
          if (layer.strokeOnly) {
            return (
              <path
                key={key}
                d={layer.d}
                data-drawline
                pathLength={1}
                fill="none"
                stroke={layer.fill ?? "currentColor"}
                strokeWidth={layer.strokeWidth ?? 2}
                opacity={opacity}
                vectorEffect="non-scaling-stroke"
                style={{ transitionDelay: delay }}
              />
            );
          }
          return (
            <path
              key={key}
              d={layer.d}
              data-drawline
              pathLength={1}
              fill={layer.fill ?? "currentColor"}
              stroke={layer.fill ?? "currentColor"}
              strokeWidth={1}
              opacity={opacity}
              vectorEffect="non-scaling-stroke"
              style={{ transitionDelay: delay }}
            />
          );
        })}
      </g>
    </svg>
  );
}
