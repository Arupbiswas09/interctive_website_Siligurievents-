import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getLetterform,
  type LetterformId,
} from "@/lib/devanagari/letterforms";
import { DevanagariAccentAnimated } from "./devanagari-accent-animated";

export type DevanagariAccentSize = "xs" | "sm" | "md" | "lg" | "xl";
export type DevanagariAccentTone =
  | "ink"
  | "muted"
  | "gold"
  | "brass"
  | "current";

export type DevanagariAccentProps = {
  /** Which glyph to render. */
  glyph: LetterformId;
  /** Visual size — single letters are square; phrase glyphs scale to width. */
  size?: DevanagariAccentSize;
  /** Colour mapping. `current` inherits `currentColor` from the parent. */
  tone?: DevanagariAccentTone;
  /** Stroke-draw animation on intersection. Lazy-loaded client variant. */
  animated?: boolean;
  /** Accessible label. Falls back to the glyph's English label. */
  ariaLabel?: string;
  /** Class merged into the outer `<svg>`. */
  className?: string;
};

/**
 * Pixel heights per size. Width follows from the glyph's viewBox aspect.
 * Editorial defaults: xs is eyebrow-rule height, xl is hero accent.
 */
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
 * `<DevanagariAccent>` — renders a stylised Devanagari letterform / motif
 * as a self-contained SVG. Server-safe by default. When `animated` is true,
 * defers to the client variant which runs a stroke-draw animation on
 * intersection (respects `prefers-reduced-motion`).
 *
 * Colour cascades via `currentColor` so callers can use any Tailwind text
 * utility (`text-[color:var(--color-accent)]`, `text-white`, etc.).
 *
 * @example
 * <DevanagariAccent glyph="shubh" size="md" tone="gold" />
 * <DevanagariAccent glyph="om-mark" size="sm" tone="brass" animated />
 */
export function DevanagariAccent({
  glyph,
  size = "md",
  tone = "current",
  animated = false,
  ariaLabel,
  className,
}: DevanagariAccentProps): React.ReactElement {
  if (animated) {
    return (
      <DevanagariAccentAnimated
        glyph={glyph}
        size={size}
        tone={tone}
        ariaLabel={ariaLabel}
        className={className}
      />
    );
  }

  const data = getLetterform(glyph);
  const label = ariaLabel ?? data.label;
  const titleId = `dev-${data.id}-title`;
  const height = sizeHeightPx[size];

  // Derive a CSS width:height ratio so phrase glyphs (240×100) stretch wide.
  const [, , vbWidth, vbHeight] = data.viewBox.split(" ").map(Number);
  const aspect =
    typeof vbWidth === "number" && typeof vbHeight === "number" && vbHeight > 0
      ? vbWidth / vbHeight
      : 1;

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${height * aspect}px`,
  };

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      viewBox={data.viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      className={cn(
        "inline-block shrink-0 align-middle",
        toneClass[tone],
        className
      )}
    >
      <title id={titleId}>{label}</title>
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        // `non-scaling-stroke` keeps modulated strokes crisp at any rendered size.
        // Filled paths ignore it gracefully.
        vectorEffect="non-scaling-stroke"
      >
        {data.paths.map((path, idx) => {
          const key = `${data.id}-${idx}`;
          if (path.strokeOnly) {
            return (
              <path
                key={key}
                d={path.d}
                fill="none"
                stroke={path.fill ?? "currentColor"}
                strokeWidth={path.strokeWidth ?? 3}
                vectorEffect="non-scaling-stroke"
              />
            );
          }
          return (
            <path
              key={key}
              d={path.d}
              fill={path.fill ?? "currentColor"}
              stroke="none"
            />
          );
        })}
      </g>
    </svg>
  );
}
