import { cn } from "@/lib/utils";
import type { LetterformId } from "@/lib/devanagari/letterforms";
import { DevanagariAccent } from "./devanagari-accent";

export type DevanagariDividerProps = {
  /** Centerpiece glyph. Defaults to `om-mark`. */
  glyph?: LetterformId;
  /** Tone for the rule + glyph. Defaults to gold. */
  tone?: "ink" | "muted" | "gold" | "brass" | "current";
  /** Visual scale of the centerpiece glyph. */
  size?: "sm" | "md" | "lg";
  /** Animate the mark drawing in on intersection. */
  animated?: boolean;
  /** Optional accessible label override. */
  ariaLabel?: string;
  className?: string;
};

const toneClass: Record<NonNullable<DevanagariDividerProps["tone"]>, string> = {
  ink: "text-[color:var(--color-ink)]",
  muted: "text-[color:var(--color-ink-muted)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
};

const sizeMap: Record<NonNullable<DevanagariDividerProps["size"]>, string> = {
  sm: "h-[var(--space-12)]",
  md: "h-[var(--space-16)]",
  lg: "h-[var(--space-24)]",
};

/**
 * `<DevanagariDivider>` — section divider with a thin gold rule and a small
 * Devanagari mark (default `om-mark`) centred. Drop-in replacement for `<hr>`.
 *
 * Renders as a semantic `<hr>` for assistive tech via role="separator" on
 * the wrapper, with the visual rules built from spans.
 *
 * @example
 * <DevanagariDivider />            // om-mark, gold, md
 * <DevanagariDivider glyph="swastika-mark" tone="brass" size="lg" />
 */
export function DevanagariDivider({
  glyph = "om-mark",
  tone = "gold",
  size = "md",
  animated = false,
  ariaLabel,
  className,
}: DevanagariDividerProps): React.ReactElement {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label={ariaLabel ?? "section divider"}
      className={cn(
        "flex w-full items-center justify-center",
        "gap-[var(--space-4)]",
        sizeMap[size],
        toneClass[tone],
        className
      )}
    >
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-current opacity-30"
      />
      <DevanagariAccent
        glyph={glyph}
        size={size === "lg" ? "md" : "sm"}
        tone="current"
        animated={animated}
        ariaLabel={ariaLabel}
      />
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-current opacity-30"
      />
    </div>
  );
}
