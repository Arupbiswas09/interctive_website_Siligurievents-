/**
 * Siligurievent — Monogram Emblem Path Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A square SE-monogram with a jasmine bloom at the joining stroke. Designed
 * for favicons, app icons, certificate corners, and the inner ring of the
 * brand seal. Geometric and brass-feeling; legible at 32×32 and decorative
 * at 256×256.
 *
 * Construction
 * ────────────
 *   • viewBox 100 × 100, centered on (50, 50).
 *   • The `S` occupies the LEFT half of the emblem (x ≈ 18 → 52).
 *   • The `E` occupies the RIGHT half (x ≈ 48 → 82). The S's lower bowl and
 *     the E's middle bar share the joining point at (~ 50, 50).
 *   • A small 5-petal jasmine bloom sits exactly on that joint.
 *   • Both letters are drawn with stroke modulation — thick spines, hairline
 *     terminals — matching the wordmark.
 *
 * Variants
 * ────────
 *   Three render variants are exported so the consumer can pick the one that
 *   suits its surface. Each shares the same construction; only the paint
 *   strategy changes:
 *
 *     1. `filled`    — every spine is a solid filled shape (the default;
 *                       reads heaviest, perfect for favicons at 32px).
 *     2. `outlined`  — every spine is rendered as an outlined hairline (thin
 *                       stroke, no fill — ideal for seal interiors and
 *                       certificate watermarks).
 *     3. `twoTone`   — the spines render in `currentColor`, the jasmine
 *                       bloom + center pin render in `--color-brass-leaf`.
 *                       Best on cream surfaces.
 *
 *   Each variant is a separate list of paths so the consumer can render them
 *   without conditional branching.
 *
 * Accessibility
 * ─────────────
 *   Decorative-or-labelled via the parent SVG; no `<title>` inside this file.
 */

export type MonogramPath = {
  /** SVG path data, viewBox coords. */
  d: string;
  /** When true, render `fill="none"` and stroke this path. */
  strokeOnly?: boolean;
  /** Stroke width override (viewBox units). */
  strokeWidth?: number;
  /**
   * Paint role — the renderer can map this to a colour. For the `twoTone`
   * variant, paths flagged `accent` use the brass token; everything else
   * inherits `currentColor`.
   */
  role?: "spine" | "accent";
  /** Designer note. */
  note?: string;
};

export type MonogramVariantId = "filled" | "outlined" | "twoTone";

export type MonogramVariant = {
  id: MonogramVariantId;
  paths: ReadonlyArray<MonogramPath>;
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Shared geometry — declared once, paint role flipped per variant.
 *
 *  The S occupies x in [18, 52], the E occupies x in [48, 82], so the two
 *  letters overlap at x ≈ 48–52, which is exactly where the jasmine bloom
 *  sits. This deliberate overlap is the monogram — not two letters side by
 *  side, but two letters knitted into one mark.
 * ──────────────────────────────────────────────────────────────────────────── */

const monoS_filled: MonogramPath = {
  d:
    "M 50 22 " +
    // Top terminal of S, curls left and down into the upper bowl.
    "C 42 18 28 18 22 26 " +
    "C 16 34 18 44 28 48 " +
    // Upper bowl interior — curls right toward center.
    "C 36 50 44 50 50 50 " +
    // Lower bowl — curls left and down from center.
    "C 56 50 52 56 46 60 " +
    "C 36 64 24 64 20 72 " +
    "C 16 80 22 86 32 86 " +
    "C 40 86 46 84 50 80 " +
    // Inner counter — describes the empty space of the S.
    "L 48 78 " +
    "C 44 82 38 84 32 84 " +
    "C 24 84 18 80 20 74 " +
    "C 24 68 36 66 46 62 " +
    "C 54 58 56 50 50 48 " +
    "C 44 46 36 46 28 46 " +
    "C 22 44 18 36 24 30 " +
    "C 30 22 42 22 50 24 Z",
  role: "spine",
  note: "Monogram S spine — both bowls + diagonal.",
};

const monoS_outlined: MonogramPath = {
  ...monoS_filled,
  strokeOnly: true,
  strokeWidth: 2.5,
};

const monoE_filled: MonogramPath = {
  d:
    "M 50 22 " +
    // Top horizontal bar of E.
    "L 78 22 " +
    "L 78 28 " +
    "L 56 28 " +
    // Down the left stem.
    "C 56 36 56 42 56 48 " +
    // Middle bar of E — meets the S join at the centre.
    "L 72 48 " +
    "L 72 54 " +
    "L 56 54 " +
    // Down the left stem to the base.
    "C 56 64 56 72 56 82 " +
    // Bottom horizontal bar.
    "L 80 82 " +
    "L 80 88 " +
    "L 50 88 " +
    // Close back up the left stem of E.
    "L 50 22 Z",
  role: "spine",
  note: "Monogram E spine — single closed path covering all three bars.",
};

const monoE_outlined: MonogramPath = {
  ...monoE_filled,
  strokeOnly: true,
  strokeWidth: 2.5,
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Jasmine bloom at the joint (50, 50)
 *  Five-petal star, ~14 viewBox units across. Each petal is a teardrop.
 *  The bloom hides the geometric awkwardness of two letters crossing.
 * ──────────────────────────────────────────────────────────────────────────── */

const jasminePetals: ReadonlyArray<MonogramPath> = [
  // Top petal.
  {
    d:
      "M 50 50 " +
      "C 48 44 47 38 50 36 " +
      "C 53 38 52 44 50 50 Z",
    role: "accent",
  },
  // Top-right petal (rotated 72°).
  {
    d:
      "M 50 50 " +
      "C 55 47 60 47 61 50 " +
      "C 60 53 55 53 50 50 Z",
    role: "accent",
  },
  // Bottom-right petal (rotated 144°).
  {
    d:
      "M 50 50 " +
      "C 54 55 56 60 53 62 " +
      "C 50 60 50 55 50 50 Z",
    role: "accent",
  },
  // Bottom-left petal (rotated 216°).
  {
    d:
      "M 50 50 " +
      "C 47 55 45 60 42 58 " +
      "C 41 55 45 52 50 50 Z",
    role: "accent",
  },
  // Top-left petal (rotated 288°).
  {
    d:
      "M 50 50 " +
      "C 45 47 40 47 39 50 " +
      "C 40 53 45 53 50 50 Z",
    role: "accent",
  },
  // Stamen / brass pin — exactly at the petal junction.
  {
    d: "M 50 50 m -1.6 0 a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0",
    role: "accent",
    note: "Center brass pin — the jasmine bud's stamen.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 *  Public variants
 * ──────────────────────────────────────────────────────────────────────────── */

export const monogramFilled: MonogramVariant = {
  id: "filled",
  paths: [monoS_filled, monoE_filled, ...jasminePetals],
};

export const monogramOutlined: MonogramVariant = {
  id: "outlined",
  paths: [
    monoS_outlined,
    monoE_outlined,
    // For outlined we render petals as light strokes too, otherwise the
    // bloom feels visually heavier than the letters.
    ...jasminePetals.map(
      (p): MonogramPath => ({ ...p, strokeOnly: true, strokeWidth: 1.5 }),
    ),
  ],
};

export const monogramTwoTone: MonogramVariant = {
  id: "twoTone",
  paths: [monoS_filled, monoE_filled, ...jasminePetals],
};

export const monogramVariants: Readonly<Record<MonogramVariantId, MonogramVariant>> =
  {
    filled: monogramFilled,
    outlined: monogramOutlined,
    twoTone: monogramTwoTone,
  } as const;

export function getMonogramVariant(id: MonogramVariantId): MonogramVariant {
  return monogramVariants[id];
}

/** Shared viewBox for all monogram variants. */
export const monogramViewBox = "0 0 100 100" as const;
