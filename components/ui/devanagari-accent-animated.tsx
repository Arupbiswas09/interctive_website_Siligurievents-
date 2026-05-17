"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getLetterform,
  type LetterformId,
} from "@/lib/devanagari/letterforms";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type DevanagariAccentSize = "xs" | "sm" | "md" | "lg" | "xl";
type DevanagariAccentTone = "ink" | "muted" | "gold" | "brass" | "current";

type DevanagariAccentAnimatedProps = {
  glyph: LetterformId;
  size?: DevanagariAccentSize;
  tone?: DevanagariAccentTone;
  ariaLabel?: string;
  className?: string;
};

const sizeHeightPx: Record<DevanagariAccentSize, number> = {
  xs: 18,
  sm: 28,
  md: 44,
  lg: 72,
  xl: 112,
};

const toneClass: Record<DevanagariAccentTone, string> = {
  ink: "text-[color:var(--color-ink)]",
  muted: "text-[color:var(--color-ink-muted)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
};

/**
 * Client variant of `<DevanagariAccent animated>`.
 *
 * Behaviour:
 *  • Each path is rendered with `pathLength="1"` + `stroke-dasharray: 1`
 *    so they start invisible (dashoffset 1) and "draw in" to dashoffset 0.
 *  • Filled paths additionally fade in their fill once their outline is drawn.
 *  • Animation triggers once on intersection (IntersectionObserver) — no GSAP
 *    plugin required, no scroll listener cost.
 *  • Reduced motion: paths render in final state immediately.
 *
 * We intentionally avoid importing GSAP here. CSS variable-driven transitions
 * + IntersectionObserver are enough for this micro-interaction and keep the
 * surface tree-shakeable.
 */
export function DevanagariAccentAnimated({
  glyph,
  size = "md",
  tone = "current",
  ariaLabel,
  className,
}: DevanagariAccentAnimatedProps): React.ReactElement {
  const data = getLetterform(glyph);
  const label = ariaLabel ?? data.label;
  const titleId = `dev-${data.id}-title`;
  const height = sizeHeightPx[size];
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);

  const [, , vbWidth, vbHeight] = data.viewBox.split(" ").map(Number);
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
        "dev-accent-animated inline-block shrink-0 align-middle",
        toneClass[tone],
        className
      )}
    >
      <title id={titleId}>{label}</title>
      <style>{`
        .dev-accent-animated path[data-drawline] {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1),
            fill-opacity 400ms ease-out;
          fill-opacity: 0;
        }
        .dev-accent-animated[data-drawn="true"] path[data-drawline] {
          stroke-dashoffset: 0;
          fill-opacity: 1;
        }
      `}</style>
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {data.paths.map((path, idx) => {
          const key = `${data.id}-${idx}`;
          const delay = `${idx * 90}ms`;
          if (path.strokeOnly) {
            return (
              <path
                key={key}
                d={path.d}
                data-drawline
                pathLength={1}
                fill="none"
                stroke={path.fill ?? "currentColor"}
                strokeWidth={path.strokeWidth ?? 3}
                vectorEffect="non-scaling-stroke"
                style={{ transitionDelay: delay }}
              />
            );
          }
          return (
            <path
              key={key}
              d={path.d}
              data-drawline
              pathLength={1}
              fill={path.fill ?? "currentColor"}
              stroke={path.fill ?? "currentColor"}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={{ transitionDelay: delay }}
            />
          );
        })}
      </g>
    </svg>
  );
}
