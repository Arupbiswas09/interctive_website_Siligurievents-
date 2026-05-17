/**
 * Siligurievent — Round Seal / Badge Path Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A round seal-style badge composed of:
 *   1. Two concentric thin circles (the seal's "ring").
 *   2. A stylised marigold-bud rosette inside the inner ring (12 petals).
 *   3. The SE-monogram glyph centered inside the rosette.
 *   4. Tick marks at the four cardinal points along the inner circle
 *      (separator dots between text segments).
 *   5. Type set along the OUTER circle: "SILIGURIEVENT · NORTH BENGAL · EST. {year}".
 *      Each character is rendered as its own SVG path positioned + rotated
 *      around the circle. We hand-author miniature letterform paths so the
 *      character work matches the wordmark's editorial register — NOT a
 *      generic `<textPath>`.
 *
 * Why hand-author the text-on-curve?
 * ────────────────────────────────────
 * Browser `<textPath>` falls back to the system font and looks like a Word
 * document curved into a circle — exactly the look the brief forbids. By
 * authoring each character as a small SVG glyph path and rotating it around
 * the circle's centre, we keep the seal's typographic register consistent
 * with the wordmark.
 *
 * Geometry
 * ────────
 *   • viewBox 240 × 240, centered on (120, 120).
 *   • Outer circle radius 110.
 *   • Inner ring (text baseline circle) radius 96.
 *   • Innermost circle (separates type from rosette) radius 84.
 *   • Rosette tips at radius ~64; rosette inner at ~44.
 *   • Monogram region inside radius 32.
 *
 * Text geometry
 * ─────────────
 *   The full string is "SILIGURIEVENT · NORTH BENGAL · EST. {year}". Total
 *   characters including spaces and bullets: 38–40 (depending on year length).
 *   We distribute these around the full circle (360°) with a 4° gap at the
 *   bottom of the seal so the type doesn't run continuously. This gap is
 *   filled by a small jasmine accent at the seal's "6 o'clock" position.
 */

export type SealRing = {
  /** Center x in viewBox units. */
  cx: number;
  /** Center y in viewBox units. */
  cy: number;
  /** Radius. */
  r: number;
  /** Stroke width. */
  strokeWidth: number;
};

export type SealRosettePetal = {
  /** Filled path data describing one petal. */
  d: string;
};

export type SealGlyphSpec = {
  /**
   * Path data describing a single character drawn at viewBox-local origin
   * (the character "lives" in roughly a 12 × 14 box centered on the
   * baseline). The render layer translates + rotates each glyph around
   * the seal's centre using its degree on the circle.
   */
  d: string;
  /** Approximate path width for kerning. */
  advance: number;
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Rings
 * ──────────────────────────────────────────────────────────────────────────── */

export const sealOuterRing: SealRing = {
  cx: 120,
  cy: 120,
  r: 110,
  strokeWidth: 1.5,
};

export const sealInnerRing: SealRing = {
  cx: 120,
  cy: 120,
  r: 84,
  strokeWidth: 1,
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Marigold rosette
 *
 *  12 petals, each a teardrop with its tip pointing outward at 30° intervals.
 *  Petals overlap slightly at the center to read as a continuous bloom.
 *  Drawn around (120, 120). One canonical petal is authored; the renderer
 *  rotates it 12× — but to keep this static and inspectable we expand all
 *  twelve rotations as explicit path data so the file stays a pure data
 *  manifest (no math at render time).
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Build a marigold petal pointing at angle `deg` from north.
 *
 * Petal geometry: a leaf-like teardrop whose tip is at radius 64, whose
 * widest point sits at radius 52, and whose base is at radius 38 from
 * the seal centre. We construct it in a North-pointing frame, then apply
 * a 2D rotation manually.
 */
function makePetal(deg: number): SealRosettePetal {
  const cx = 120;
  const cy = 120;
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Round to two decimals to keep path strings tight + diffable.
  const r = (n: number): string => (Math.round(n * 100) / 100).toString();

  // Rotate a (dx, dy) about the seal centre.
  // dy is negative-north (SVG y grows down), so we pass values relative to
  // a North-pointing template.
  const rot = (
    dx: number,
    dy: number,
  ): { x: number; y: number } => ({
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  });

  // Template (North-pointing): tip at (0, -64), shoulders at (±5, -52),
  // waist at (±3, -44), base at (0, -38).
  const tip = rot(0, -64);
  const leftShoulder = rot(-5, -52);
  const rightShoulder = rot(5, -52);
  const leftWaist = rot(-3, -44);
  const rightWaist = rot(3, -44);
  const base = rot(0, -38);

  // Path: M base -> C left waist + left shoulder -> tip -> C right shoulder +
  // right waist -> base. Forms a tear-drop.
  const d =
    `M ${r(base.x)} ${r(base.y)} ` +
    `C ${r(leftWaist.x)} ${r(leftWaist.y)} ` +
    `${r(leftShoulder.x)} ${r(leftShoulder.y)} ` +
    `${r(tip.x)} ${r(tip.y)} ` +
    `C ${r(rightShoulder.x)} ${r(rightShoulder.y)} ` +
    `${r(rightWaist.x)} ${r(rightWaist.y)} ` +
    `${r(base.x)} ${r(base.y)} Z`;

  return { d };
}

export const sealRosettePetals: ReadonlyArray<SealRosettePetal> = [
  makePetal(0),
  makePetal(30),
  makePetal(60),
  makePetal(90),
  makePetal(120),
  makePetal(150),
  makePetal(180),
  makePetal(210),
  makePetal(240),
  makePetal(270),
  makePetal(300),
  makePetal(330),
];

/**
 * Central rosette pin — a small brass disc at the rosette centre. Sits
 * above the SE monogram which is composited separately by the renderer.
 */
export const sealRosetteCenter = {
  d:
    "M 120 120 m -3.5 0 " +
    "a 3.5 3.5 0 1 0 7 0 " +
    "a 3.5 3.5 0 1 0 -7 0",
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Cardinal tick marks on inner ring — small radial flecks at 0°, 90°,
 *  180°, 270°. They separate text segments visually.
 * ──────────────────────────────────────────────────────────────────────────── */

function makeTick(deg: number): { d: string } {
  const cx = 120;
  const cy = 120;
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const r = (n: number): string => (Math.round(n * 100) / 100).toString();

  // Tick: from radius 76 to radius 92, ±0.5 wide.
  const inner = (x: number, y: number) => ({
    x: cx + x * cos - y * sin,
    y: cy + x * sin + y * cos,
  });

  const a = inner(-0.6, -76);
  const b = inner(0.6, -76);
  const c = inner(0.6, -92);
  const d = inner(-0.6, -92);

  return {
    d: `M ${r(a.x)} ${r(a.y)} L ${r(b.x)} ${r(b.y)} L ${r(c.x)} ${r(c.y)} L ${r(d.x)} ${r(d.y)} Z`,
  };
}

export const sealCardinalTicks: ReadonlyArray<{ d: string }> = [
  makeTick(45),
  makeTick(135),
  makeTick(225),
  makeTick(315),
];

/* ────────────────────────────────────────────────────────────────────────────
 *  Custom-drawn micro-letterforms for type-on-curve.
 *
 *  Each glyph is authored in a local 12 × 16 box, baseline at y = 14, cap at
 *  y = 2. The renderer translates+rotates the glyph around the seal centre
 *  so the baseline tangents the circle of radius 96.
 *
 *  Style: condensed, slightly tall, hairline (the seal type wants to feel
 *  inscribed, not bold). Modulated where it matters (S, R, E, B).
 *
 *  NOTE: we only author the glyphs we actually need for the seal copy:
 *  S, I, L, G, U, R, E, V, N, T, O, H, B, A, ".", "·", " ", and digits 0-9.
 * ──────────────────────────────────────────────────────────────────────────── */

export const sealGlyphs: Readonly<Record<string, SealGlyphSpec>> = {
  S: {
    advance: 8,
    d:
      "M 8 3 C 6 2 3 2 2 4 C 1 6 2 8 5 8 C 8 8 9 10 9 12 C 9 14 6 15 3 14 " +
      "L 2 13 C 4 14 7 14 8 12 C 9 11 7 10 5 10 C 2 9 1 7 2 5 C 3 3 6 2 8 3 Z",
  },
  I: {
    advance: 4,
    d:
      "M 2 2 L 4 2 L 4 14 L 2 14 Z",
  },
  L: {
    advance: 7,
    d:
      "M 2 2 L 4 2 L 4 12 L 7 12 L 7 14 L 2 14 Z",
  },
  G: {
    advance: 9,
    d:
      "M 8 4 C 7 2 4 2 3 3 C 1 5 1 11 3 13 C 5 15 8 14 9 12 L 9 9 L 6 9 " +
      "L 6 8 L 9 8 L 9 13 C 7 15 4 15 2 13 C 0 11 0 5 2 3 C 4 1 7 1 9 3 Z",
  },
  U: {
    advance: 8,
    d:
      "M 2 2 L 4 2 L 4 11 C 4 13 6 14 8 13 L 8 2 L 9 2 L 9 12 C 9 14 6 15 4 14 " +
      "C 3 13 2 13 2 11 Z",
  },
  R: {
    advance: 8,
    d:
      "M 2 2 L 5 2 C 7 2 9 3 9 5 C 9 7 7 8 5 8 L 4 8 L 4 14 L 2 14 Z " +
      // counter
      "M 4 4 L 5 4 C 6 4 7 4 7 6 C 7 7 6 7 5 7 L 4 7 Z " +
      // leg
      "M 5 8 L 9 14 L 7 14 L 4 9 Z",
  },
  E: {
    advance: 7,
    d:
      "M 2 2 L 7 2 L 7 4 L 4 4 L 4 7 L 6 7 L 6 9 L 4 9 L 4 12 L 7 12 L 7 14 L 2 14 Z",
  },
  V: {
    advance: 8,
    d:
      "M 2 2 L 4 2 L 5 11 L 7 2 L 9 2 L 6 14 L 4 14 Z",
  },
  N: {
    advance: 8,
    d:
      "M 2 2 L 4 2 L 7 11 L 7 2 L 9 2 L 9 14 L 7 14 L 4 5 L 4 14 L 2 14 Z",
  },
  T: {
    advance: 7,
    d:
      "M 1 2 L 8 2 L 8 4 L 5 4 L 5 14 L 4 14 L 4 4 L 1 4 Z",
  },
  O: {
    advance: 9,
    d:
      "M 2 5 C 2 3 4 2 5 2 C 7 2 9 3 9 5 L 9 11 C 9 13 7 14 5 14 C 4 14 2 13 2 11 Z " +
      "M 4 5 L 4 11 C 4 12 5 13 5 13 C 6 13 7 12 7 11 L 7 5 C 7 4 6 3 5 3 C 4 3 4 4 4 5 Z",
  },
  H: {
    advance: 9,
    d:
      "M 2 2 L 4 2 L 4 7 L 7 7 L 7 2 L 9 2 L 9 14 L 7 14 L 7 9 L 4 9 L 4 14 L 2 14 Z",
  },
  B: {
    advance: 8,
    d:
      "M 2 2 L 5 2 C 7 2 9 3 9 5 C 9 6 8 7 7 7 C 8 7 9 8 9 10 C 9 12 7 14 5 14 L 2 14 Z " +
      "M 4 4 L 5 4 C 6 4 7 4 7 5 C 7 6 6 7 5 7 L 4 7 Z " +
      "M 4 9 L 5 9 C 6 9 7 10 7 11 C 7 12 6 12 5 12 L 4 12 Z",
  },
  A: {
    advance: 9,
    d:
      "M 5 2 L 6 2 L 9 14 L 7 14 L 6 11 L 4 11 L 3 14 L 2 14 Z " +
      "M 5 4 L 4 9 L 6 9 Z",
  },
  ".": {
    advance: 4,
    d: "M 3 12 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
  },
  "·": {
    advance: 5,
    // Mid-baseline bullet
    d: "M 3 8 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
  },
  " ": {
    advance: 4,
    d: "",
  },
  "0": {
    advance: 8,
    d:
      "M 2 5 C 2 3 4 2 5 2 C 7 2 8 3 8 5 L 8 11 C 8 13 7 14 5 14 C 4 14 2 13 2 11 Z " +
      "M 4 5 L 4 11 L 6 11 L 6 5 Z",
  },
  "1": {
    advance: 5,
    d: "M 3 2 L 5 2 L 5 14 L 3 14 Z M 2 4 L 3 2 L 3 4 Z",
  },
  "2": {
    advance: 8,
    d:
      "M 2 5 C 2 3 4 2 5 2 C 7 2 8 3 8 5 C 8 7 6 9 4 11 L 8 11 L 8 14 L 2 14 L 2 12 C 4 10 6 8 6 6 C 6 5 5 4 5 4 C 4 4 4 5 4 6 Z",
  },
  "3": {
    advance: 8,
    d:
      "M 2 4 C 3 2 6 2 7 4 C 8 5 7 7 6 7 C 7 7 8 9 8 11 C 8 13 6 14 4 14 C 3 14 2 13 2 12 L 4 12 C 4 12 5 12 5 11 L 5 9 C 5 9 4 8 4 8 L 4 7 L 5 7 C 5 7 6 6 6 5 L 5 5 L 4 5 Z",
  },
  "4": {
    advance: 8,
    d: "M 5 2 L 7 2 L 7 14 L 5 14 L 5 11 L 2 11 L 2 9 Z M 5 5 L 4 9 L 5 9 Z",
  },
  "5": {
    advance: 8,
    d: "M 2 2 L 8 2 L 8 4 L 4 4 L 4 7 L 6 7 C 7 7 8 8 8 10 L 8 12 C 8 13 7 14 6 14 L 2 14 L 2 12 L 5 12 L 6 12 L 6 10 L 6 9 L 5 9 L 2 9 Z",
  },
  "6": {
    advance: 8,
    d: "M 2 5 C 2 3 4 2 5 2 L 7 2 L 7 4 L 5 4 L 4 4 L 4 7 L 5 7 C 7 7 8 8 8 10 L 8 12 C 8 13 7 14 5 14 C 3 14 2 13 2 12 Z M 4 9 L 4 12 L 6 12 L 6 9 Z",
  },
  "7": {
    advance: 8,
    d: "M 2 2 L 8 2 L 8 4 L 5 14 L 3 14 L 6 4 L 2 4 Z",
  },
  "8": {
    advance: 8,
    d:
      "M 2 5 C 2 3 4 2 5 2 C 6 2 8 3 8 5 C 8 6 7 7 6 8 C 7 8 8 9 8 11 C 8 13 7 14 5 14 C 3 14 2 13 2 11 C 2 9 3 8 4 8 C 3 7 2 6 2 5 Z " +
      "M 4 5 L 4 6 L 5 7 L 6 6 L 6 5 L 5 4 Z " +
      "M 4 11 L 4 12 L 5 13 L 6 12 L 6 11 L 5 10 Z",
  },
  "9": {
    advance: 8,
    d: "M 2 5 C 2 3 4 2 5 2 C 7 2 8 3 8 5 L 8 11 C 8 13 6 14 4 14 L 3 14 L 3 12 L 5 12 L 6 12 L 6 9 L 5 9 C 3 9 2 8 2 7 Z M 4 5 L 4 7 L 6 7 L 6 5 Z",
  },
};

const FALLBACK_GLYPH: SealGlyphSpec = { advance: 8, d: "" };

/** Return a glyph spec by char, with a graceful fallback to space. */
export function getSealGlyph(ch: string): SealGlyphSpec {
  return sealGlyphs[ch] ?? sealGlyphs[" "] ?? FALLBACK_GLYPH;
}

/**
 * Default seal copy. The renderer accepts a `year` prop and substitutes
 * `{year}` here. Three segments separated by · (dot operator) cardinal
 * separators are exactly aligned with the rosette ticks.
 *
 * Layout strategy: three equal-length-ish segments around the circle,
 * starting at the top and going clockwise.
 *   Segment A (top arc, centre = 0°)   → "SILIGURIEVENT"
 *   Segment B (right arc, centre = 120°) → "NORTH BENGAL"
 *   Segment C (left arc, centre = 240°)  → "EST. {year}"
 *
 * Each segment is fitted into an arc of approximately 100° (with 20° gaps
 * separating segments). The 6-o'clock gap is filled with a tiny jasmine
 * accent rendered by `<Seal />`.
 */
export const sealCopySegments = {
  top: "SILIGURIEVENT",
  right: "NORTH BENGAL",
  left: "EST.",
  // The year appended to `left`; consumer-formatted to keep this a constant.
} as const;

/**
 * Geometry for a text segment laid along the inner ring.
 */
export type SealSegmentGeometry = {
  /** Pre-formatted string. */
  text: string;
  /** Centre of the arc, degrees (0 = top, clockwise positive). */
  centerDeg: number;
  /** Total angular span the segment occupies (degrees). */
  spanDeg: number;
  /** Whether the segment baseline faces the centre (inward) or outward.
   * Outward for top/right/left; inward for the rare bottom segment. */
  facing: "outward" | "inward";
};

/**
 * Build the three segment geometries given the seal year.
 */
export function buildSealSegments(year: number): ReadonlyArray<SealSegmentGeometry> {
  return [
    {
      text: sealCopySegments.top,
      centerDeg: 0,
      spanDeg: 110,
      facing: "outward",
    },
    {
      text: sealCopySegments.right,
      centerDeg: 120,
      spanDeg: 90,
      facing: "outward",
    },
    {
      text: `${sealCopySegments.left} ${year}`,
      centerDeg: 240,
      spanDeg: 75,
      facing: "outward",
    },
  ];
}

/**
 * Compute the per-character placement (centre x, centre y, rotation deg)
 * for a segment along the inner ring. Returned as a flat array so the
 * renderer can map each entry to a `<g>` with a transform.
 */
export type SealGlyphPlacement = {
  ch: string;
  x: number;
  y: number;
  rotate: number;
  advance: number;
};

export function placeSegment(
  seg: SealSegmentGeometry,
  _ringRadius: number,
): ReadonlyArray<SealGlyphPlacement> {
  // Pure helper retained for future per-glyph layout tweaks (e.g. inserting
  // a brass dot between two characters). The render path in `<Seal />`
  // currently inlines this logic for performance — see the `<g>` block
  // that maps segments to rotated `<path>` transforms.
  //
  // `_ringRadius` is intentionally accepted (and ignored) so this function
  // signature stays stable for downstream callers that pass it explicitly.
  void _ringRadius;

  const cx = 120;
  const cy = 120;
  const chars = seg.text.split("");
  if (chars.length === 0) return [];

  const stepDeg = seg.spanDeg / chars.length;
  const startDeg = seg.centerDeg - seg.spanDeg / 2 + stepDeg / 2;

  return chars.map((ch, idx) => ({
    ch,
    x: cx,
    y: cy,
    rotate: startDeg + idx * stepDeg,
    advance: getSealGlyph(ch).advance,
  }));
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Bottom jasmine accent (filling the gap between segments at 6 o'clock).
 * ──────────────────────────────────────────────────────────────────────────── */

export const sealBottomAccent = {
  // Three jasmine petals + center pin, drawn at (120, 200) — y=200 sits
  // just above the bottom of the inner ring.
  petals: [
    "M 120 200 C 116 196 113 192 116 188 C 120 188 122 192 120 200 Z",
    "M 120 200 C 124 196 127 192 124 188 C 120 188 118 192 120 200 Z",
    "M 120 200 C 120 194 116 190 113 192 C 113 196 116 199 120 200 Z",
  ],
  pin: "M 120 196 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
};

/* ────────────────────────────────────────────────────────────────────────────
 *  Public seal viewBox + ring radius for the renderer.
 * ──────────────────────────────────────────────────────────────────────────── */

export const sealViewBox = "0 0 240 240" as const;
export const sealTypeRadius = 96 as const;
