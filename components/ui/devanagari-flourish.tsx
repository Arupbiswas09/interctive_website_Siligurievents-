import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LetterformId } from "@/lib/devanagari/letterforms";
import { DevanagariAccent } from "./devanagari-accent";

export type DevanagariFlourishPlacement =
  | "above"
  | "below"
  | "beside-left"
  | "beside-right";

export type DevanagariFlourishSize = "sm" | "md" | "lg";

export type DevanagariFlourishProps = {
  /** Latin text or any inline ReactNode (e.g. a `<DisplayHeading>`). */
  latin: ReactNode;
  /** Which Devanagari accent to pair with it. */
  glyph: LetterformId;
  /** Where the glyph sits relative to the Latin. Defaults to `above`. */
  placement?: DevanagariFlourishPlacement;
  /** Visual size of the glyph. */
  size?: DevanagariFlourishSize;
  /** Animate the glyph drawing in on intersection. */
  animated?: boolean;
  /** Tone of the glyph; defaults to gold so it reads as an editorial accent. */
  tone?: "ink" | "muted" | "gold" | "brass" | "current";
  className?: string;
};

/**
 * Map flourish sizes to the underlying accent size scale.
 * Flourishes always run smaller than the Latin they accompany —
 * they are accents, not headlines.
 */
const accentSizeForFlourish: Record<
  DevanagariFlourishSize,
  "xs" | "sm" | "md" | "lg"
> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const placementClass: Record<DevanagariFlourishPlacement, string> = {
  above: "flex-col items-start",
  below: "flex-col-reverse items-start",
  "beside-left": "flex-row items-center",
  "beside-right": "flex-row-reverse items-center justify-end",
};

const gapClass: Record<DevanagariFlourishSize, string> = {
  sm: "gap-[var(--space-2)]",
  md: "gap-[var(--space-3)]",
  lg: "gap-[var(--space-4)]",
};

/**
 * `<DevanagariFlourish>` — pairs a Latin display element with a stylised
 * Devanagari accent. Use to give a headline a cultural eyebrow without
 * relying on the Devanagari font fallback.
 *
 * @example
 * <DevanagariFlourish
 *   glyph="shubh"
 *   latin={<DisplayHeading as="h1" text="Cinematic decor for celebrations." />}
 *   placement="above"
 *   size="md"
 * />
 *
 * @example
 * <DevanagariFlourish
 *   glyph="letter-shri"
 *   latin={<Eyebrow tone="gold">Founder</Eyebrow>}
 *   placement="beside-left"
 *   size="sm"
 * />
 */
export function DevanagariFlourish({
  latin,
  glyph,
  placement = "above",
  size = "md",
  animated = false,
  tone = "gold",
  className,
}: DevanagariFlourishProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex",
        placementClass[placement],
        gapClass[size],
        className
      )}
    >
      <DevanagariAccent
        glyph={glyph}
        size={accentSizeForFlourish[size]}
        tone={tone}
        animated={animated}
        className="opacity-90"
      />
      <span className="block">{latin}</span>
    </span>
  );
}
