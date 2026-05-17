import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getIllustration,
  type IllustrationId,
} from "@/lib/illustrations/paths";

export type IllustrationSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IllustrationTone =
  | "ink"
  | "muted"
  | "gold"
  | "brass"
  | "current";

export type IllustrationBaseProps = {
  /** Which illustration to render. */
  id: IllustrationId;
  /** Visual size — height in px; width follows from viewBox aspect. */
  size?: IllustrationSize;
  /** Colour mapping. `current` inherits `currentColor` from the parent. */
  tone?: IllustrationTone;
  /** Accessible label. Falls back to the illustration's English label. */
  ariaLabel?: string;
  /** Class merged into the outer `<svg>`. */
  className?: string;
};

/**
 * Pixel heights per size. Width follows from the illustration's viewBox.
 * Editorial defaults: xs is an inline-with-text mark, xl is a hero accent.
 */
const sizeHeightPx: Record<IllustrationSize, number> = {
  xs: 24,
  sm: 40,
  md: 72,
  lg: 120,
  xl: 200,
};

const toneClass: Record<IllustrationTone, string> = {
  ink: "text-[color:var(--color-ink)]",
  muted: "text-[color:var(--color-ink-muted)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
};

/**
 * `<IllustrationBase>` — server-safe static renderer for any illustration
 * in `lib/illustrations/paths.ts`. No animation, no client JS.
 *
 * Colour cascades via `currentColor` (or `var(--color-*)` overrides on the
 * individual layer) so callers can use any Tailwind text utility.
 *
 * For the animated variants, use `<IllustrationDraw>` (stroke-draw on
 * intersection) or one of the named animated components
 * (`<JasmineBloomUnfurl>`, `<DiyaFlicker>`, etc.).
 *
 * @example
 * <IllustrationBase id="jasmine-bloom" size="md" tone="gold" />
 * <IllustrationBase id="diya-lamp" size="lg" tone="brass" />
 */
export function IllustrationBase({
  id,
  size = "md",
  tone = "current",
  ariaLabel,
  className,
}: IllustrationBaseProps): React.ReactElement {
  const data = getIllustration(id);
  const label = ariaLabel ?? data.label;
  const titleId = `illu-${data.id}-title`;
  const height = sizeHeightPx[size];

  const viewBoxParts = data.viewBox.split(" ").map(Number);
  const vbWidth = viewBoxParts[2];
  const vbHeight = viewBoxParts[3];
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
        vectorEffect="non-scaling-stroke"
      >
        {data.layers.map((layer, idx) => {
          const key = `${data.id}-${idx}`;
          const opacity = layer.opacity ?? 1;
          if (layer.strokeOnly) {
            return (
              <path
                key={key}
                d={layer.d}
                fill="none"
                stroke={layer.fill ?? "currentColor"}
                strokeWidth={layer.strokeWidth ?? 2}
                opacity={opacity}
                vectorEffect="non-scaling-stroke"
              />
            );
          }
          return (
            <path
              key={key}
              d={layer.d}
              fill={layer.fill ?? "currentColor"}
              stroke="none"
              opacity={opacity}
            />
          );
        })}
      </g>
    </svg>
  );
}
