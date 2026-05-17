import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  buildSealSegments,
  getSealGlyph,
  sealBottomAccent,
  sealCardinalTicks,
  sealInnerRing,
  sealOuterRing,
  sealRosetteCenter,
  sealRosettePetals,
  sealTypeRadius,
  sealViewBox,
} from "./seal-paths";
import { getMonogramVariant } from "./monogram-paths";

/**
 * Siligurievent — Round Seal / Badge
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Composes a certificate-style seal:
 *   • Double concentric ring.
 *   • 12-petal marigold rosette inside the inner ring.
 *   • SE-monogram (twoTone) centered in the rosette.
 *   • "SILIGURIEVENT · NORTH BENGAL · EST. {year}" set along the inner ring.
 *     Each character is drawn as a small SVG glyph and rotated around the
 *     centre — NOT a generic `<textPath>` — so the type matches the
 *     wordmark's editorial register.
 *   • Tick marks separating the three text segments.
 *   • A small jasmine accent at 6 o'clock filling the bottom gap.
 *
 * Server Component — no client APIs.
 */

export type SealTone = "ink" | "brass" | "cream" | "current";
export type SealSize = "sm" | "md" | "lg" | "xl";

export type SealProps = {
  /** Visual tone — applied via `currentColor`. */
  tone?: SealTone;
  /** Square pixel size — drives the rendered side length. */
  size?: SealSize;
  /** Establishment year, embedded in the seal copy. */
  year?: number;
  /** Accessible label. */
  ariaLabel?: string;
  /** Mark as decorative for a11y. */
  decorative?: boolean;
  /** Extra class names on the outer `<svg>`. */
  className?: string;
};

const sidePx: Record<SealSize, number> = {
  sm: 96,
  md: 160,
  lg: 256,
  xl: 480,
};

const toneClass: Record<SealTone, string> = {
  ink: "text-[color:var(--color-ink-deep,var(--color-ink))]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  cream: "text-[color:var(--color-cream-jasmine,var(--color-bg))]",
  current: "text-current",
};

const accentPaint = "var(--color-brass-leaf, var(--color-gold, #B8893A))";

/**
 * `<Seal />` — the badge variant of the brand mark.
 *
 * Use the seal where a certificate or stamp register is appropriate:
 *   • Footer corner
 *   • Case-study cover overlay
 *   • Event-day signage thank-you cards
 *   • "Verified" credentials inside guarantees blocks
 *
 * For primary site identity (header, footer wordmark slot, page titles),
 * prefer `<Wordmark />`.
 */
export function Seal({
  tone = "current",
  size = "md",
  year = new Date().getFullYear(),
  ariaLabel,
  decorative = false,
  className,
}: SealProps): React.ReactElement {
  const side = sidePx[size];
  const titleId = `sgv-seal-${size}-title`;
  const label =
    ariaLabel ?? `Siligurievent · North Bengal · Established ${year}`;

  const segments = buildSealSegments(year);

  const style: CSSProperties = {
    width: `${side}px`,
    height: `${side}px`,
  };

  // Pre-compose the monogram outlined paths so we can paint them in
  // brass + ink without a nested SVG (keeps the file a single SVG element,
  // which matters for OG and favicon export).
  const monogram = getMonogramVariant("twoTone");

  // viewBox of the seal vs the monogram is 240/100 = 2.4x. The monogram
  // sits inside the rosette — we target a ~56px monogram footprint inside
  // a 240 viewBox seal. Side = 56 means scale = 0.56. We translate to the
  // seal centre and scale.
  const monogramTransform = `translate(120 120) scale(0.56) translate(-50 -50)`;

  return (
    <svg
      role={decorative ? "presentation" : "img"}
      aria-labelledby={decorative ? undefined : titleId}
      aria-hidden={decorative || undefined}
      viewBox={sealViewBox}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      className={cn(
        "inline-block shrink-0 align-middle select-none",
        toneClass[tone],
        className,
      )}
    >
      {!decorative ? <title id={titleId}>{label}</title> : null}

      {/* ── Outer ring ─────────────────────────────────────────────── */}
      <circle
        cx={sealOuterRing.cx}
        cy={sealOuterRing.cy}
        r={sealOuterRing.r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sealOuterRing.strokeWidth}
        vectorEffect="non-scaling-stroke"
      />

      {/* ── Inner ring ─────────────────────────────────────────────── */}
      <circle
        cx={sealInnerRing.cx}
        cy={sealInnerRing.cy}
        r={sealInnerRing.r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sealInnerRing.strokeWidth}
        vectorEffect="non-scaling-stroke"
        opacity={0.7}
      />

      {/* ── Marigold rosette ────────────────────────────────────────── */}
      <g>
        {sealRosettePetals.map((petal, idx) => (
          <path
            key={`rosette-${idx}`}
            d={petal.d}
            fill={accentPaint}
            stroke="none"
          />
        ))}
        <path d={sealRosetteCenter.d} fill="currentColor" stroke="none" />
      </g>

      {/* ── Cardinal ticks ─────────────────────────────────────────── */}
      <g>
        {sealCardinalTicks.map((tick, idx) => (
          <path key={`tick-${idx}`} d={tick.d} fill="currentColor" />
        ))}
      </g>

      {/* ── Type set along the inner ring ──────────────────────────── */}
      <g aria-hidden="true">
        {segments.flatMap((seg) => {
          const chars = seg.text.split("");
          if (chars.length === 0) return [];
          const stepDeg = seg.spanDeg / chars.length;
          const startDeg = seg.centerDeg - seg.spanDeg / 2 + stepDeg / 2;
          return chars.map((ch, idx) => {
            const glyph = getSealGlyph(ch);
            if (glyph.d === "") return null;
            const deg = startDeg + idx * stepDeg;
            const advance = glyph.advance;
            // Position each glyph at the seal centre, rotated to its deg,
            // then translated outward by the type radius, then centred on
            // its own advance so kerning reads even.
            // Local frame: glyph's baseline (y=14) sits ON the radius.
            // Therefore we want the glyph local origin (0,0) to land at
            // radius (typeRadius + something). We achieve baseline-on-ring
            // by translating up by (-typeRadius - 0) and accounting for
            // baseline within the glyph's local box: glyph centre is roughly
            // y = 8 in its 16-tall box. Translate up by typeRadius + 8 so
            // the glyph centre lies on the ring. This reads visually
            // balanced — type sits centred on the inner ring rather than
            // having its baseline crash into the rosette.
            const transform =
              `rotate(${deg.toFixed(2)} 120 120) ` +
              `translate(${(120 - advance / 2).toFixed(2)} ${(
                120 -
                sealTypeRadius -
                4
              ).toFixed(2)})`;
            return (
              <path
                key={`seg-${seg.centerDeg}-${idx}`}
                d={glyph.d}
                transform={transform}
                fill="currentColor"
                stroke="none"
              />
            );
          });
        })}
      </g>

      {/* ── Bottom jasmine accent (fills the gap at 6 o'clock) ─────── */}
      <g>
        {sealBottomAccent.petals.map((d, idx) => (
          <path key={`bottom-petal-${idx}`} d={d} fill={accentPaint} />
        ))}
        <path d={sealBottomAccent.pin} fill="currentColor" />
      </g>

      {/* ── SE monogram, twoTone — centered in the rosette ──────────── */}
      <g transform={monogramTransform}>
        {monogram.paths.map((p, idx) => {
          const paint =
            p.role === "accent" ? accentPaint : "currentColor";
          if (p.strokeOnly) {
            return (
              <path
                key={`mono-${idx}`}
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
          return (
            <path
              key={`mono-${idx}`}
              d={p.d}
              fill={paint}
              stroke="none"
            />
          );
        })}
      </g>

      {/* The transform above scales the 100-unit monogram viewBox into a
          ~56-unit footprint at the seal centre (matches the rosette inner
          radius). See `./monogram-paths.ts` for the source viewBox. */}
    </svg>
  );
}
