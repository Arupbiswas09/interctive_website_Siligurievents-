/**
 * Siligurievent — Custom Wordmark Path Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Hand-authored SVG path data for the Siligurievent wordmark. These are NOT
 * font glyphs — every letter is drawn from scratch as filled / stroked
 * sub-paths. The construction follows the same stroke-modulation discipline
 * Agent B used in `lib/devanagari/letterforms.ts`: a thick "downstroke"
 * filled body paired with a thin "upstroke" wedge, rather than a single
 * uniform `stroke-width`. The result reads as hand-drawn rather than typeset.
 *
 * Design intent (per docs/01 §1.8, §1.9 and the V2 brand brief):
 *   • Editorial-luxury serif register — Cormorant, Bodoni, Le Labo, Aesop.
 *   • Mild italic slant (≈ 8°) — letters lean right just enough to feel set
 *     by a calligrapher's hand.
 *   • Stroke contrast: thick verticals, thin horizontals, faceted serifs.
 *   • Custom ligatures:
 *       - `S` caps with a small jasmine-bud flourish that grows out of the
 *         top terminal.
 *       - `i` and `g` (positions 5 and 6) merge into one another via a
 *         shared baseline curl — the dot over `i` becomes a foil bud,
 *         the descender of `g` loops back up to support the joining `i`.
 *       - `v` and `e` (positions 11 and 12) overlap slightly — the right
 *         shoulder of `v` and the left bowl of `e` share a vertex.
 *       - `t` (position 10) wears a delicate cross-stroke flourish that
 *         flares out beyond the letter on the left.
 *
 * Coordinate system
 * ─────────────────
 *   • viewBox 720 × 140 (single-line layout) — generous side margins of
 *     ~24 units; cap-height ≈ 92, x-height ≈ 64, baseline at y=110.
 *   • viewBox 360 × 200 (stacked layout) — "siliguri" line baseline 88,
 *     "event" line baseline 178, with a thin brass rule between.
 *   • x grows right, y grows down. All paths use absolute coords.
 *
 * Stroke-modulation convention
 * ────────────────────────────
 *   Each letter is composed of several sub-paths:
 *     a) a filled "spine" path that gives the thick stem its modulated
 *        weight,
 *     b) optional `strokeOnly` paths for thin connectives (cross-strokes,
 *        joining hairlines, ligatures),
 *     c) optional accent dots / buds (the jasmine bud on S, the dot on i).
 *
 * Render contract
 * ───────────────
 *   The consumer (`<Wordmark />`) walks `paths` in order and emits either a
 *   filled `<path>` or a `fill="none" stroke="…"` path per entry. Stroke
 *   widths are *intentionally* hand-tuned per path, NOT uniform — that's
 *   the whole point of stroke modulation.
 *
 * Accessibility
 * ─────────────
 *   The wordmark is decorative SVG by default; the consumer wraps it in a
 *   `<svg role="img">` with an `aria-label`. Internally we expose `<title>`
 *   text for screen readers.
 */

export type WordmarkPath = {
  /** SVG path data — absolute coordinates against the viewBox. */
  d: string;
  /** When true, render `fill="none"` and stroke this path. */
  strokeOnly?: boolean;
  /** Stroke width in viewBox units. Ignored unless `strokeOnly` is true. */
  strokeWidth?: number;
  /** Optional designer note — printed as an SVG comment in dev only. */
  note?: string;
};

export type WordmarkLetter = {
  /** Latin character this group renders. */
  char: string;
  /** Order index (1..13 for "Siligurievent"). */
  index: number;
  /** Approximate left-most x of this letter in the single-line viewBox. */
  metricX: number;
  /** Approximate advance width for the letter (excluding ligature overflow). */
  metricAdvance: number;
  /** Optional human-readable design note. */
  note?: string;
  /** Composed paths drawn back-to-front. */
  paths: ReadonlyArray<WordmarkPath>;
};

export type WordmarkLayout = {
  /** SVG viewBox. */
  viewBox: string;
  /** Baseline y in viewBox units. */
  baseline: number;
  /** Cap height in viewBox units. */
  capHeight: number;
  /** x-height in viewBox units. */
  xHeight: number;
  /** Letters in order. */
  letters: ReadonlyArray<WordmarkLetter>;
  /** Extra non-letter paths (rules, flourishes, the brass divider on
   * stacked layout). */
  extras?: ReadonlyArray<WordmarkPath>;
};

/* ════════════════════════════════════════════════════════════════════════════
 *  SINGLE-LINE LAYOUT — "Siligurievent" as one continuous mark.
 *  viewBox 720 × 140, baseline 110, cap 18, x-height baseline ~46.
 *  Italic slant: ~8°. Every vertical stem is drawn with a slight rightward
 *  tilt so the whole word leans together coherently.
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * S (capital, position 1)
 * ───────────────────────
 * Two-bowl Bodoni-style S with high stress, foil-thin junction. A small
 * jasmine bud grows out of the top terminal — three soft petals plus a tiny
 * stamen dot, in the same `currentColor` so foil renders correctly.
 */
const letterS: WordmarkLetter = {
  char: "S",
  index: 1,
  metricX: 28,
  metricAdvance: 60,
  note: "Bodoni-stress S with jasmine bud cap flourish.",
  paths: [
    // S — main filled spine. Modulated: thick at the bowls' shoulders,
    // hair-thin at the diagonal junction. Italic slant baked into curves.
    {
      d:
        "M 86 30 " +
        // top-right terminal, pulls down to top bowl
        "C 78 22 64 18 52 22 " +
        "C 38 26 30 38 32 50 " +
        // top bowl rolling into the diagonal
        "C 34 60 46 64 60 66 " +
        "C 74 68 84 72 86 82 " +
        // diagonal junction (hair-thin via narrow path geometry)
        "C 88 92 78 102 64 104 " +
        "C 50 106 36 102 28 94 " +
        // bottom terminal
        "L 30 96 " +
        "C 38 102 50 106 60 104 " +
        "C 72 102 80 96 80 88 " +
        // inner counter back up
        "C 80 82 70 78 56 76 " +
        "C 40 74 28 68 26 56 " +
        "C 24 42 32 28 50 22 " +
        "C 64 18 78 22 86 28 " +
        "Z",
      note: "Italic S body — high contrast between bowl + diagonal.",
    },
    // S — top terminal serif (small triangular cap)
    {
      d: "M 80 24 L 90 22 L 88 28 Z",
      note: "Top serif on S — small triangular cap.",
    },
    // Jasmine bud — left petal
    {
      d:
        "M 78 14 " +
        "C 74 8 70 6 66 8 " +
        "C 64 10 65 14 70 16 " +
        "C 74 18 78 18 78 14 Z",
      note: "Jasmine bud — left petal.",
    },
    // Jasmine bud — center petal (taller)
    {
      d:
        "M 84 10 " +
        "C 84 4 82 0 79 0 " +
        "C 76 0 74 4 75 10 " +
        "C 76 14 80 16 84 14 Z",
      note: "Jasmine bud — center petal (apex of the bud).",
    },
    // Jasmine bud — right petal
    {
      d:
        "M 90 14 " +
        "C 94 10 96 6 94 4 " +
        "C 92 2 88 4 86 8 " +
        "C 84 12 86 16 90 14 Z",
      note: "Jasmine bud — right petal.",
    },
    // Bud stamen dot (the tiny brass bead at petal junction)
    {
      d: "M 84 14 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
      note: "Bud stamen — brass pin-dot.",
    },
  ],
};

/**
 * i (lowercase, position 2)
 * ─────────────────────────
 * Tall stem + tittle (dot). Slight italic slant. The tittle is rendered as a
 * subtle teardrop, not a circle — gives the wordmark its hand-drawn signal.
 */
const letterI1: WordmarkLetter = {
  char: "i",
  index: 2,
  metricX: 100,
  metricAdvance: 22,
  note: "Lower-case i — italic teardrop tittle.",
  paths: [
    // Stem — italic, modulated (thicker at center, hair ends).
    {
      d:
        "M 108 46 " +
        "C 109 60 109 76 110 96 " +
        "C 110 102 112 106 116 106 " +
        "C 120 106 122 102 121 96 " +
        "C 120 76 118 60 118 46 Z",
    },
    // Tittle — teardrop, not a circle. Tilts right with the italic.
    {
      d:
        "M 114 34 " +
        "C 117 32 120 34 121 38 " +
        "C 122 41 120 43 117 43 " +
        "C 114 43 112 41 113 38 " +
        "C 113 36 114 35 114 34 Z",
      note: "Teardrop tittle — leans right.",
    },
  ],
};

/**
 * l (lowercase, position 3)
 * ─────────────────────────
 * Ascender with a slight upward terminal flick — classical Garamond gesture.
 */
const letterL: WordmarkLetter = {
  char: "l",
  index: 3,
  metricX: 124,
  metricAdvance: 22,
  paths: [
    // Stem — ascender (tall), modulated.
    {
      d:
        "M 132 22 " +
        "C 134 40 134 60 134 80 " +
        "C 134 94 134 102 136 106 " +
        "C 138 108 142 108 144 106 " +
        "C 146 102 145 94 144 80 " +
        "C 142 60 141 40 142 22 Z",
    },
    // Upward terminal flick at base — tiny calligraphic exit.
    {
      d: "M 144 104 C 148 106 152 106 154 104",
      strokeOnly: true,
      strokeWidth: 2,
      note: "Calligraphic exit flick on l.",
    },
  ],
};

/**
 * i (lowercase, position 4)
 * ─────────────────────────
 * Companion to position 2 but slightly compressed — the ligature pulls its
 * tittle slightly inward, anticipating the merge with the next i+g.
 */
const letterI2: WordmarkLetter = {
  char: "i",
  index: 4,
  metricX: 148,
  metricAdvance: 22,
  paths: [
    {
      d:
        "M 156 46 " +
        "C 157 60 157 76 158 96 " +
        "C 158 102 160 106 164 106 " +
        "C 168 106 170 102 169 96 " +
        "C 168 76 166 60 166 46 Z",
    },
    {
      d:
        "M 162 34 " +
        "C 165 32 168 34 169 38 " +
        "C 170 41 168 43 165 43 " +
        "C 162 43 160 41 161 38 " +
        "C 161 36 162 35 162 34 Z",
    },
  ],
};

/**
 * g (lowercase, position 5) — LIGATURE PARTNER WITH i (position 4)
 * ─────────────────────────────────────────────────────────────────
 * Double-storey g with a generous tail-loop. The loop swings LEFT under the
 * preceding `i`, creating the i↔g ligature — instead of two discrete letters
 * the two share a base curl. The body bowl of g sits at x-height; the loop
 * descends past the baseline.
 *
 * NOTE: this is intentionally ambitious — the loop crosses x territory that
 * would normally belong to letter 4. That's the whole ligature.
 */
const letterG: WordmarkLetter = {
  char: "g",
  index: 5,
  metricX: 172,
  metricAdvance: 50,
  note: "Double-storey g whose descender loops LEFT under the i (ligature).",
  paths: [
    // Upper bowl — sits on x-height, italic.
    {
      d:
        "M 198 46 " +
        "C 188 44 178 48 174 56 " +
        "C 170 64 172 74 178 80 " +
        "C 184 86 196 86 202 82 " +
        "C 206 80 208 76 208 72 " +
        "C 208 66 204 60 200 56 " +
        "C 196 52 192 50 188 52 " +
        "C 184 54 182 58 184 62 " +
        "C 186 66 192 68 198 66 " +
        "C 204 64 206 58 204 54 " +
        "C 202 50 198 48 198 46 Z",
      note: "Upper bowl of g — high-contrast modulation.",
    },
    // Right stem & connection to lower loop.
    {
      d:
        "M 206 56 " +
        "C 208 72 209 90 210 110 " +
        "C 210 118 208 124 200 128 " +
        "L 198 130 " +
        "C 208 126 212 118 212 110 " +
        "C 211 90 210 72 208 56 Z",
    },
    // Descender loop — THIS is the ligature stroke. Loops LEFT under the
    // preceding `i` (around x ≈ 155-165), then sweeps back right.
    {
      d:
        "M 200 128 " +
        "C 192 132 180 134 168 132 " +
        "C 158 130 152 124 154 116 " +
        "C 156 110 162 108 168 112 ",
      strokeOnly: true,
      strokeWidth: 3.5,
      note:
        "i↔g LIGATURE descender — passes left under letter 4 (i) and " +
        "returns rightward. The ligature is the whole point.",
    },
    // Tiny brass tie-pin at the deepest point of the loop — a deliberate
    // editorial flourish marking the ligature junction.
    {
      d: "M 154 122 m -1.6 0 a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0",
      note: "Brass pin at the ligature junction.",
    },
  ],
};

/**
 * u (lowercase, position 6)
 * ─────────────────────────
 * Italic u — two stems joined by a soft curve at the base.
 */
const letterU: WordmarkLetter = {
  char: "u",
  index: 6,
  metricX: 224,
  metricAdvance: 38,
  paths: [
    // Left stem.
    {
      d:
        "M 232 46 " +
        "C 233 60 233 80 234 96 " +
        "C 234 100 232 104 230 106 " +
        "L 232 108 " +
        "C 236 106 240 104 244 100 " +
        "C 246 92 246 76 244 46 Z",
    },
    // Right stem with exit flick.
    {
      d:
        "M 250 46 " +
        "C 251 60 251 76 252 96 " +
        "C 252 102 254 106 258 106 " +
        "C 262 106 264 102 263 96 " +
        "C 262 76 260 60 260 46 Z",
    },
    // Base curve joining the two stems (filled, modulated).
    {
      d:
        "M 232 96 " +
        "C 232 102 240 108 250 108 " +
        "C 256 108 260 104 260 100 " +
        "L 258 102 " +
        "C 256 104 252 106 248 106 " +
        "C 240 106 234 100 234 96 Z",
    },
  ],
};

/**
 * r (lowercase, position 7)
 * ─────────────────────────
 * Italic r — stem plus a small high arm and a brass dot at the arm-tip
 * (calligraphic emphasis).
 */
const letterR: WordmarkLetter = {
  char: "r",
  index: 7,
  metricX: 264,
  metricAdvance: 30,
  paths: [
    // Stem.
    {
      d:
        "M 272 46 " +
        "C 273 60 273 80 274 96 " +
        "C 274 102 276 106 280 106 " +
        "C 284 106 286 102 285 96 " +
        "C 284 76 282 60 282 46 Z",
    },
    // Arm — short, climbs and curls right.
    {
      d: "M 280 48 C 286 44 292 44 296 48 C 298 50 298 52 296 54",
      strokeOnly: true,
      strokeWidth: 3.5,
      note: "Italic r arm — short, high.",
    },
    // Brass tip-dot at the arm terminal (editorial accent).
    {
      d: "M 297 53 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
      note: "Brass tip on r arm.",
    },
  ],
};

/**
 * i (lowercase, position 8)
 * ─────────────────────────
 * Third i — back to normal proportions.
 */
const letterI3: WordmarkLetter = {
  char: "i",
  index: 8,
  metricX: 294,
  metricAdvance: 22,
  paths: [
    {
      d:
        "M 302 46 " +
        "C 303 60 303 76 304 96 " +
        "C 304 102 306 106 310 106 " +
        "C 314 106 316 102 315 96 " +
        "C 314 76 312 60 312 46 Z",
    },
    {
      d:
        "M 308 34 " +
        "C 311 32 314 34 315 38 " +
        "C 316 41 314 43 311 43 " +
        "C 308 43 306 41 307 38 " +
        "C 307 36 308 35 308 34 Z",
    },
  ],
};

/**
 * e (lowercase, position 9)
 * ─────────────────────────
 * Italic e — closed bowl with a hairline horizontal bar across the eye.
 */
const letterE1: WordmarkLetter = {
  char: "e",
  index: 9,
  metricX: 318,
  metricAdvance: 40,
  paths: [
    // Bowl spine — modulated.
    {
      d:
        "M 326 46 " +
        "C 336 42 350 44 354 54 " +
        "C 358 64 354 76 348 82 " +
        "C 340 88 330 88 324 80 " +
        "C 318 70 320 56 326 46 Z " +
        "M 326 80 " +
        "C 332 86 342 86 348 80 " +
        "C 352 76 354 70 352 64 " +
        "C 350 56 342 52 334 54 " +
        "C 328 56 324 64 326 72 " +
        "C 326 76 326 78 326 80 Z",
      note: "e — outer bowl + counter together as a filled compound path.",
    },
    // Eye bar (the horizontal hairline that crosses the counter of italic e).
    {
      d: "M 326 64 L 354 62",
      strokeOnly: true,
      strokeWidth: 2,
      note: "e — hairline eye bar.",
    },
    // Exit terminal — small flick.
    {
      d: "M 352 78 C 356 84 358 86 358 90",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

/**
 * v (lowercase, position 10) — LIGATURE PARTNER WITH e (position 11)
 * ──────────────────────────────────────────────────────────────────
 * Italic v — diagonals meeting at the baseline. The right diagonal
 * intentionally crosses INTO the bowl of the following e (position 11)
 * for the overlap ligature.
 *
 * NOTE: the task brief mentions "v and e overlapping slightly" — we
 * implement that here by extending the right shoulder of `v` ~6 units
 * into the start of `e`.
 */
const letterV: WordmarkLetter = {
  char: "v",
  index: 10,
  metricX: 358,
  metricAdvance: 42,
  note: "Italic v whose right diagonal overlaps into the next e.",
  paths: [
    // Left diagonal — thick.
    {
      d:
        "M 366 46 " +
        "L 380 102 " +
        "C 381 105 382 107 384 107 " +
        "L 382 102 " +
        "L 370 48 " +
        "C 369 46 367 46 366 46 Z",
    },
    // Right diagonal — thin, extends slightly into the next letter (the
    // v↔e overlap). Drawn as a stroke for the hairline contrast.
    {
      d: "M 396 46 L 386 100 L 384 107",
      strokeOnly: true,
      strokeWidth: 3,
      note: "v right diagonal — hairline, extends into e ligature.",
    },
    // Tiny entry serif on top-left.
    {
      d: "M 364 44 L 372 44 L 368 48 Z",
    },
  ],
};

/**
 * e (lowercase, position 11) — LIGATURE WITH v (position 10)
 * ──────────────────────────────────────────────────────────
 * Companion e whose left bowl shoulder sits where the v's right diagonal
 * lands. The two share a vertex at approximately (384, 100).
 */
const letterE2: WordmarkLetter = {
  char: "e",
  index: 11,
  metricX: 392,
  metricAdvance: 40,
  paths: [
    // Bowl — note the left edge meets the v diagonal.
    {
      d:
        "M 400 46 " +
        "C 410 42 424 44 428 54 " +
        "C 432 64 428 76 422 82 " +
        "C 414 88 404 88 398 80 " +
        "C 392 70 394 56 400 46 Z " +
        "M 400 80 " +
        "C 406 86 416 86 422 80 " +
        "C 426 76 428 70 426 64 " +
        "C 424 56 416 52 408 54 " +
        "C 402 56 398 64 400 72 " +
        "C 400 76 400 78 400 80 Z",
    },
    // Eye bar.
    {
      d: "M 400 64 L 428 62",
      strokeOnly: true,
      strokeWidth: 2,
    },
    // Exit flick.
    {
      d: "M 426 78 C 430 84 432 86 432 90",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

/**
 * n (lowercase, position 12)
 * ──────────────────────────
 * Italic n — left stem + a soft shoulder curve + right stem.
 */
const letterN: WordmarkLetter = {
  char: "n",
  index: 12,
  metricX: 432,
  metricAdvance: 40,
  paths: [
    // Left stem.
    {
      d:
        "M 440 46 " +
        "C 441 60 441 80 442 96 " +
        "C 442 102 444 106 448 106 " +
        "C 452 106 454 102 453 96 " +
        "C 452 76 450 60 450 46 Z",
    },
    // Shoulder curve into right stem.
    {
      d: "M 450 50 C 458 44 466 44 470 50",
      strokeOnly: true,
      strokeWidth: 3.5,
    },
    // Right stem.
    {
      d:
        "M 468 50 " +
        "C 469 64 469 80 470 96 " +
        "C 470 102 472 106 476 106 " +
        "C 480 106 482 102 481 96 " +
        "C 480 76 478 64 478 50 Z",
    },
  ],
};

/**
 * t (lowercase, position 13)
 * ──────────────────────────
 * Italic t with a generous CROSS-STROKE FLOURISH that flares well to the
 * LEFT of the stem — this is the editorial signature of the wordmark. The
 * flourish has a small upward hook at its left terminal.
 */
const letterT: WordmarkLetter = {
  char: "t",
  index: 13,
  metricX: 480,
  metricAdvance: 38,
  note: "Italic t with editorial cross-stroke flourish.",
  paths: [
    // Stem — taller than x-height (typical of t ascender).
    {
      d:
        "M 492 32 " +
        "C 493 50 493 76 494 96 " +
        "C 494 102 496 108 502 108 " +
        "C 508 108 510 104 509 98 " +
        "C 508 76 506 50 504 32 Z",
    },
    // Cross-stroke flourish — flares LEFT of stem by ~14 units, has a
    // soft upward hook at the left terminal.
    {
      d:
        "M 476 46 " +
        "C 474 42 474 40 478 40 " +
        "C 484 40 494 42 502 44 " +
        "L 516 44 " +
        "C 518 44 518 48 516 48 " +
        "L 502 48 " +
        "C 494 46 484 46 478 46 Z",
      note: "Cross-stroke flourish — extends LEFT of stem.",
    },
    // Brass tip-dot at the very left tip of the flourish.
    {
      d: "M 476 43 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
      note: "Brass terminal on t cross-stroke.",
    },
    // Base exit flick.
    {
      d: "M 506 106 C 512 108 516 108 518 104",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

/* ---------------------------------------------------------------------------
 *  Public single-line layout
 * --------------------------------------------------------------------------- */

export const wordmarkSingle: WordmarkLayout = {
  viewBox: "0 0 540 140",
  baseline: 110,
  capHeight: 92,
  xHeight: 64,
  letters: [
    letterS,
    letterI1,
    letterL,
    letterI2,
    letterG,
    letterU,
    letterR,
    letterI3,
    letterE1,
    letterV,
    letterE2,
    letterN,
    letterT,
  ],
};

/* ════════════════════════════════════════════════════════════════════════════
 *  STACKED LAYOUT — "siliguri" line 1, "event" line 2.
 *
 *  Conceptual approach: re-use the same letter shapes from the single-line
 *  layout but rescale + reposition. To keep this file maintainable (and to
 *  honor Agent B's "comment liberally" rule), we manually re-author the
 *  paths here at the stacked metrics rather than trying to transform them
 *  programmatically — programmatic scaling would lose the stroke modulation
 *  contrast.
 *
 *  viewBox: 460 × 220.
 *  Line 1 ("siliguri"): cap at y=8, baseline at y=92.  All lowercase here —
 *  the wordmark deliberately drops the leading capital on the stacked layout
 *  to read as a deeper monogram (mirrors how Aesop sets "aesop" lower-case
 *  for its stacked seal).
 *  Line 2 ("event"): cap at y=120, baseline at y=204.
 *  Brass divider rule at y=104.
 * ════════════════════════════════════════════════════════════════════════════ */

/* ---------------- LINE 1 ---------------- */

const stack_s: WordmarkLetter = {
  char: "s",
  index: 1,
  metricX: 28,
  metricAdvance: 50,
  paths: [
    // Lower-case italic s — bodoni-stress, no jasmine bud (that flourish is
    // reserved for the single-line capital).
    {
      d:
        "M 72 36 " +
        "C 66 30 56 26 46 30 " +
        "C 36 34 30 42 32 50 " +
        "C 34 58 44 60 54 62 " +
        "C 66 64 74 68 74 76 " +
        "C 74 84 64 88 54 88 " +
        "C 44 88 36 84 30 78 " +
        "L 32 80 " +
        "C 38 84 46 88 56 88 " +
        "C 68 88 76 82 74 74 " +
        "C 72 68 62 66 50 64 " +
        "C 36 62 28 56 28 48 " +
        "C 28 38 38 28 52 26 " +
        "C 62 26 68 30 72 34 Z",
    },
  ],
};

const stack_i1: WordmarkLetter = {
  char: "i",
  index: 2,
  metricX: 78,
  metricAdvance: 18,
  paths: [
    {
      d:
        "M 86 40 " +
        "C 87 54 87 70 88 84 " +
        "C 88 88 90 90 92 90 " +
        "C 94 90 96 88 95 84 " +
        "C 94 70 93 54 93 40 Z",
    },
    {
      d:
        "M 90 28 " +
        "C 92 26 95 28 95 31 " +
        "C 95 33 93 35 91 35 " +
        "C 89 35 88 33 89 31 Z",
    },
  ],
};

const stack_l: WordmarkLetter = {
  char: "l",
  index: 3,
  metricX: 96,
  metricAdvance: 18,
  paths: [
    {
      d:
        "M 104 14 " +
        "C 106 32 106 56 106 76 " +
        "C 106 84 106 88 108 90 " +
        "C 110 92 113 92 114 90 " +
        "C 115 88 115 84 114 76 " +
        "C 113 56 112 32 112 14 Z",
    },
  ],
};

const stack_i2: WordmarkLetter = {
  char: "i",
  index: 4,
  metricX: 114,
  metricAdvance: 18,
  paths: [
    {
      d:
        "M 122 40 " +
        "C 123 54 123 70 124 84 " +
        "C 124 88 126 90 128 90 " +
        "C 130 90 132 88 131 84 " +
        "C 130 70 129 54 129 40 Z",
    },
    {
      d:
        "M 126 28 " +
        "C 128 26 131 28 131 31 " +
        "C 131 33 129 35 127 35 " +
        "C 125 35 124 33 125 31 Z",
    },
  ],
};

const stack_g: WordmarkLetter = {
  char: "g",
  index: 5,
  metricX: 132,
  metricAdvance: 42,
  note: "Stacked g — descender ligatures LEFT under preceding i.",
  paths: [
    // Upper bowl
    {
      d:
        "M 156 40 " +
        "C 148 38 138 42 134 50 " +
        "C 130 58 134 68 142 70 " +
        "C 150 72 158 68 162 62 " +
        "C 164 58 162 54 158 52 " +
        "C 154 50 150 52 150 56 " +
        "C 150 60 156 62 160 60 " +
        "C 162 58 162 54 160 52 " +
        "C 158 50 156 48 156 46 Z",
    },
    // Right stem to descender
    {
      d:
        "M 162 50 " +
        "C 164 64 165 80 166 96 " +
        "C 166 102 164 108 156 110 " +
        "L 154 112 " +
        "C 164 110 170 102 170 96 " +
        "C 169 80 168 64 166 50 Z",
    },
    // LIGATURE descender — loops left under stack_i2 (at x ≈ 120)
    {
      d: "M 156 110 C 148 114 140 116 130 114 C 120 112 116 106 118 100 C 120 96 124 96 128 100",
      strokeOnly: true,
      strokeWidth: 3,
      note: "Stacked-layout ligature curl under preceding i.",
    },
    // Brass pin at ligature deepest point
    {
      d: "M 118 106 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
    },
  ],
};

const stack_u: WordmarkLetter = {
  char: "u",
  index: 6,
  metricX: 176,
  metricAdvance: 34,
  paths: [
    {
      d:
        "M 184 40 " +
        "C 185 54 185 72 186 84 " +
        "C 186 88 184 90 182 92 " +
        "L 184 94 " +
        "C 188 92 192 90 196 86 " +
        "C 198 80 198 64 196 40 Z",
    },
    {
      d:
        "M 202 40 " +
        "C 203 54 203 70 204 84 " +
        "C 204 88 206 92 210 92 " +
        "C 214 92 216 88 215 84 " +
        "C 214 70 212 54 212 40 Z",
    },
    {
      d:
        "M 184 84 " +
        "C 184 88 192 94 202 94 " +
        "C 208 94 212 90 212 86 " +
        "L 210 88 " +
        "C 208 90 204 92 200 92 " +
        "C 192 92 186 88 186 84 Z",
    },
  ],
};

const stack_r: WordmarkLetter = {
  char: "r",
  index: 7,
  metricX: 214,
  metricAdvance: 26,
  paths: [
    {
      d:
        "M 222 40 " +
        "C 223 54 223 72 224 84 " +
        "C 224 88 226 92 230 92 " +
        "C 234 92 236 88 235 84 " +
        "C 234 70 232 54 232 40 Z",
    },
    {
      d: "M 230 42 C 236 38 242 38 244 42 C 246 44 246 46 244 48",
      strokeOnly: true,
      strokeWidth: 3,
    },
    {
      d: "M 245 47 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
    },
  ],
};

const stack_i3: WordmarkLetter = {
  char: "i",
  index: 8,
  metricX: 240,
  metricAdvance: 18,
  paths: [
    {
      d:
        "M 248 40 " +
        "C 249 54 249 70 250 84 " +
        "C 250 88 252 90 254 90 " +
        "C 256 90 258 88 257 84 " +
        "C 256 70 255 54 255 40 Z",
    },
    {
      d:
        "M 252 28 " +
        "C 254 26 257 28 257 31 " +
        "C 257 33 255 35 253 35 " +
        "C 251 35 250 33 251 31 Z",
    },
  ],
};

/* ---------------- LINE 2 — "event" ---------------- */

const stack_e1: WordmarkLetter = {
  char: "e",
  index: 9,
  metricX: 60,
  metricAdvance: 40,
  paths: [
    {
      d:
        "M 68 150 " +
        "C 78 146 92 148 96 158 " +
        "C 100 168 96 180 90 186 " +
        "C 82 192 72 192 66 184 " +
        "C 60 174 62 160 68 150 Z " +
        "M 68 184 " +
        "C 74 190 84 190 90 184 " +
        "C 94 180 96 174 94 168 " +
        "C 92 160 84 156 76 158 " +
        "C 70 160 66 168 68 176 " +
        "C 68 180 68 182 68 184 Z",
    },
    {
      d: "M 68 168 L 96 166",
      strokeOnly: true,
      strokeWidth: 2,
    },
    {
      d: "M 94 182 C 98 188 100 190 100 194",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

const stack_v: WordmarkLetter = {
  char: "v",
  index: 10,
  metricX: 100,
  metricAdvance: 44,
  paths: [
    {
      d:
        "M 108 150 " +
        "L 122 206 " +
        "C 123 209 124 211 126 211 " +
        "L 124 206 " +
        "L 112 152 " +
        "C 111 150 109 150 108 150 Z",
    },
    {
      d: "M 138 150 L 128 204 L 126 211",
      strokeOnly: true,
      strokeWidth: 3,
      note: "v hairline diagonal — overlaps into next e.",
    },
    {
      d: "M 106 148 L 114 148 L 110 152 Z",
    },
  ],
};

const stack_e2: WordmarkLetter = {
  char: "e",
  index: 11,
  metricX: 134,
  metricAdvance: 40,
  paths: [
    {
      d:
        "M 142 150 " +
        "C 152 146 166 148 170 158 " +
        "C 174 168 170 180 164 186 " +
        "C 156 192 146 192 140 184 " +
        "C 134 174 136 160 142 150 Z " +
        "M 142 184 " +
        "C 148 190 158 190 164 184 " +
        "C 168 180 170 174 168 168 " +
        "C 166 160 158 156 150 158 " +
        "C 144 160 140 168 142 176 " +
        "C 142 180 142 182 142 184 Z",
    },
    {
      d: "M 142 168 L 170 166",
      strokeOnly: true,
      strokeWidth: 2,
    },
    {
      d: "M 168 182 C 172 188 174 190 174 194",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

const stack_n: WordmarkLetter = {
  char: "n",
  index: 12,
  metricX: 174,
  metricAdvance: 40,
  paths: [
    {
      d:
        "M 182 150 " +
        "C 183 164 183 184 184 200 " +
        "C 184 206 186 210 190 210 " +
        "C 194 210 196 206 195 200 " +
        "C 194 180 192 164 192 150 Z",
    },
    {
      d: "M 192 154 C 200 148 208 148 212 154",
      strokeOnly: true,
      strokeWidth: 3.5,
    },
    {
      d:
        "M 210 154 " +
        "C 211 168 211 184 212 200 " +
        "C 212 206 214 210 218 210 " +
        "C 222 210 224 206 223 200 " +
        "C 222 180 220 168 220 154 Z",
    },
  ],
};

const stack_t: WordmarkLetter = {
  char: "t",
  index: 13,
  metricX: 222,
  metricAdvance: 40,
  paths: [
    {
      d:
        "M 234 136 " +
        "C 235 154 235 180 236 200 " +
        "C 236 206 238 212 244 212 " +
        "C 250 212 252 208 251 202 " +
        "C 250 180 248 154 246 136 Z",
    },
    {
      d:
        "M 218 150 " +
        "C 216 146 216 144 220 144 " +
        "C 226 144 236 146 244 148 " +
        "L 258 148 " +
        "C 260 148 260 152 258 152 " +
        "L 244 152 " +
        "C 236 150 226 150 220 150 Z",
      note: "Cross-stroke flourish (line 2).",
    },
    {
      d: "M 218 147 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
    },
    {
      d: "M 248 210 C 254 212 258 212 260 208",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
  ],
};

/* ---------------- STACKED EXTRAS (brass divider) ---------------- */

const stackExtras: ReadonlyArray<WordmarkPath> = [
  // Brass divider rule between "siliguri" and "event" — tapered ends,
  // thicker centre. Hangs at y = 108.
  {
    d:
      "M 36 108 " +
      "C 80 107 200 106 280 108 " +
      "L 280 110 " +
      "C 200 109 80 109 36 110 Z",
    note: "Brass divider rule — tapered hairline.",
  },
  // Small bookend dot left of the rule
  {
    d: "M 30 109 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
  },
  // Small bookend dot right of the rule
  {
    d: "M 286 109 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
  },
];

/* ---------------------------------------------------------------------------
 *  Public stacked layout
 * --------------------------------------------------------------------------- */

export const wordmarkStacked: WordmarkLayout = {
  viewBox: "0 0 320 220",
  baseline: 92,
  capHeight: 78,
  xHeight: 52,
  letters: [
    stack_s,
    stack_i1,
    stack_l,
    stack_i2,
    stack_g,
    stack_u,
    stack_r,
    stack_i3,
    stack_e1,
    stack_v,
    stack_e2,
    stack_n,
    stack_t,
  ],
  extras: stackExtras,
};

/* ════════════════════════════════════════════════════════════════════════════
 *  Layout lookup
 * ════════════════════════════════════════════════════════════════════════════ */

export type WordmarkLayoutId = "single" | "stacked";

export const wordmarkLayouts: Readonly<Record<WordmarkLayoutId, WordmarkLayout>> =
  {
    single: wordmarkSingle,
    stacked: wordmarkStacked,
  } as const;

export function getWordmarkLayout(id: WordmarkLayoutId): WordmarkLayout {
  return wordmarkLayouts[id];
}
