import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getMonogramVariant,
  monogramViewBox,
  type MonogramPath,
  type MonogramVariantId,
} from "./monogram-paths";

/**
 * Siligurievent — Monogram Emblem
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A square S/E emblem with a jasmine bloom at the junction. The shape is
 * designed to read at extremes: a clean silhouette at 32×32 (favicon), and a
 * detailed brass emblem at 256×256+.
 *
 * Variants
 * ────────
 *   • `filled`   — default; solid spines, brass jasmine bloom.
 *   • `outlined` — hairline-stroked spines + bloom (watermarks, certificates).
 *   • `twoTone`  — spines inherit `currentColor`, jasmine bloom + center pin
 *                  paint with `--color-brass-leaf` independently.
 *
 * Tone
 * ────
 *   The spines paint with `currentColor`; the consumer themes via Tailwind
 *   text utilities. The `tone` prop is a convenience preset.
 *
 * Server Component — no client APIs, no animation, no hooks.
 */

export type MonogramTone = "ink" | "brass" | "cream" | "current";
export type MonogramSize = "favicon" | "sm" | "md" | "lg" | "xl";

export type MonogramProps = {
  /** Visual tone for the spines. Defaults to `current`. */
  tone?: MonogramTone;
  /** Render variant. */
  variant?: MonogramVariantId;
  /** Sizing bucket — drives pixel side length. */
  size?: MonogramSize;
  /** Accessible label. */
  ariaLabel?: string;
  /** Mark as decorative — hides from a11y tree. */
  decorative?: boolean;
  /** Extra class names on the outer `<svg>`. */
  className?: string;
};

const sidePx: Record<MonogramSize, number> = {
  favicon: 32,
  sm: 48,
  md: 64,
  lg: 96,
  xl: 160,
};

const toneClass: Record<MonogramTone, string> = {
  ink: "text-[color:var(--color-ink-deep,var(--color-ink))]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  cream: "text-[color:var(--color-cream-jasmine,var(--color-bg))]",
  current: "text-current",
};

/** Brass accent paint — applied to `role: "accent"` paths in twoTone. */
const accentPaint = "var(--color-brass-leaf, var(--color-gold, #B8893A))";

function renderPath(
  p: MonogramPath,
  key: string,
  twoTone: boolean,
): React.ReactElement {
  const isAccent = p.role === "accent";
  const paint = twoTone && isAccent ? accentPaint : "currentColor";

  if (p.strokeOnly) {
    return (
      <path
        key={key}
        d={p.d}
        fill="none"
        stroke={paint}
        strokeWidth={p.strokeWidth ?? 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  }
  return <path key={key} d={p.d} fill={paint} stroke="none" />;
}

export function Monogram({
  tone = "current",
  variant = "filled",
  size = "md",
  ariaLabel = "Siligurievent monogram",
  decorative = false,
  className,
}: MonogramProps): React.ReactElement {
  const data = getMonogramVariant(variant);
  const side = sidePx[size];

  const style: CSSProperties = {
    width: `${side}px`,
    height: `${side}px`,
  };

  const titleId = `sgv-monogram-${variant}-${size}-title`;
  const twoTone = variant === "twoTone";

  return (
    <svg
      role={decorative ? "presentation" : "img"}
      aria-labelledby={decorative ? undefined : titleId}
      aria-hidden={decorative || undefined}
      viewBox={monogramViewBox}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      className={cn(
        "inline-block shrink-0 align-middle select-none",
        toneClass[tone],
        className,
      )}
    >
      {!decorative ? <title id={titleId}>{ariaLabel}</title> : null}
      <g>
        {data.paths.map((p, idx) =>
          renderPath(p, `mono-${variant}-${idx}`, twoTone),
        )}
      </g>
    </svg>
  );
}
