import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  getWordmarkLayout,
  type WordmarkLayoutId,
  type WordmarkPath,
} from "./wordmark-paths";

/**
 * Siligurievent — Primary Wordmark
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Hand-authored SVG wordmark. The visual identity for siligurievent.com.
 *
 * The actual letterform geometry lives in `./wordmark-paths.ts` so a brand
 * designer can adjust a serif or a ligature without touching React. This
 * component is purely a renderer + theming layer.
 *
 * Server Component — no hooks, no client APIs.
 *
 * Theming
 * ───────
 *   The wordmark uses `currentColor` for all paint. Tone presets map to the
 *   relevant brand tokens (see `docs/03b-DESIGN-V2.md` §3b.1):
 *     • `ink`     → `--color-ink-deep` (warm near-black, light surfaces)
 *     • `brass`   → `--color-brass-leaf` (rich gold-foil, dark surfaces)
 *     • `cream`   → `--color-cream-jasmine` (off-white, deep / dark surfaces)
 *     • `current` → inherits `currentColor` from the parent so callers can
 *                   theme via Tailwind text utilities.
 *
 * Sizing
 * ──────
 *   Height-driven so the wordmark composes cleanly inside any layout. The
 *   width follows from the layout's viewBox aspect ratio.
 *
 *     | size | px height | recommended use                          |
 *     |------|-----------|-------------------------------------------|
 *     | sm   | 20px      | tiny header chrome, footer eyebrow       |
 *     | md   | 28px      | site header (default)                    |
 *     | lg   | 48px      | footer mark, hero secondary              |
 *     | xl   | 96px      | hero, splash, OG image, certificate seal |
 *
 *   The geometry is designed to remain legible at heights ≥ 18px. Below that,
 *   prefer the `<Monogram />` emblem.
 *
 * Accessibility
 * ─────────────
 *   Renders as `<svg role="img" aria-labelledby={titleId}>`. Pass
 *   `ariaLabel="Siligurievent"` (default) for the visible identity, or override
 *   for context-specific surfaces ("Siligurievent — home").
 *
 * No motion
 * ─────────
 *   The wordmark itself is static — animation belongs in the illustration /
 *   cursor packages so the wordmark stays a stable brand anchor. `prefers-
 *   reduced-motion` is therefore a no-op here.
 */

export type WordmarkTone = "ink" | "brass" | "cream" | "current";
export type WordmarkSize = "sm" | "md" | "lg" | "xl";

export type WordmarkProps = {
  /** Visual tone. Defaults to `current` so callers theme via parent text-color. */
  tone?: WordmarkTone;
  /** Pixel height bucket. Width derives from viewBox aspect. */
  size?: WordmarkSize;
  /** Single-line vs two-line stacked composition. */
  layout?: WordmarkLayoutId;
  /** Accessible label. Defaults to "Siligurievent". */
  ariaLabel?: string;
  /** Class merged onto the outer `<svg>`. */
  className?: string;
  /** Hide from assistive tech (rare — when a parent already announces). */
  decorative?: boolean;
};

const sizeHeightPx: Record<WordmarkSize, number> = {
  sm: 20,
  md: 28,
  lg: 48,
  xl: 96,
};

const toneClass: Record<WordmarkTone, string> = {
  // `--color-ink-deep` falls back to baseline `--color-ink` if V2 tokens
  // haven't been declared on the consumer's tree.
  ink: "text-[color:var(--color-ink-deep,var(--color-ink))]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  cream: "text-[color:var(--color-cream-jasmine,var(--color-bg))]",
  current: "text-current",
};

/**
 * Render one wordmark path entry — picks filled vs stroked based on flag.
 * Kept as a tight helper so the JSX in `<Wordmark />` stays scannable.
 */
function renderPath(p: WordmarkPath, key: string): React.ReactElement {
  if (p.strokeOnly) {
    return (
      <path
        key={key}
        d={p.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={p.strokeWidth ?? 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  }
  return <path key={key} d={p.d} fill="currentColor" stroke="none" />;
}

export function Wordmark({
  tone = "current",
  size = "md",
  layout = "single",
  ariaLabel = "Siligurievent",
  className,
  decorative = false,
}: WordmarkProps): React.ReactElement {
  const data = getWordmarkLayout(layout);
  const [, , vbW, vbH] = data.viewBox.split(" ").map(Number);
  const aspect =
    typeof vbW === "number" && typeof vbH === "number" && vbH > 0
      ? vbW / vbH
      : 4;
  const heightPx = sizeHeightPx[size];

  const style: CSSProperties = {
    height: `${heightPx}px`,
    width: `${heightPx * aspect}px`,
  };

  // Title id derived from layout so SSR + hydration produce a stable, unique
  // string even when multiple wordmarks share a page (header + footer).
  const titleId = `sgv-wordmark-${layout}-${size}-title`;

  return (
    <svg
      role={decorative ? "presentation" : "img"}
      aria-labelledby={decorative ? undefined : titleId}
      aria-hidden={decorative || undefined}
      viewBox={data.viewBox}
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
        {data.letters.map((letter) =>
          letter.paths.map((p, idx) =>
            renderPath(p, `${layout}-${letter.char}-${letter.index}-${idx}`),
          ),
        )}
        {data.extras?.map((p, idx) => renderPath(p, `${layout}-extra-${idx}`))}
      </g>
    </svg>
  );
}
