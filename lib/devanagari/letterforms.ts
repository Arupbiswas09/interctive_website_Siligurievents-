/**
 * Siligurievent — Stylised Devanagari Letterform Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Hand-authored SVG paths for a small set of Devanagari accents used as
 * design moments across the site. These are NOT font glyphs — they are
 * editorial brass-foil-inspired letterforms drawn as filled / stroked paths.
 *
 * Each glyph entry has:
 *   - `id`            : stable kebab-case key
 *   - `label`         : human-readable name (also used as fallback aria-label)
 *   - `transliteration` : roman approximation, used in `<title>` for SR users
 *   - `viewBox`       : SVG viewBox string — single letters 100×100, phrases 240×100
 *   - `paths`         : array of subpaths so each glyph can be drawn / stroked
 *                       independently (head bar, body, vowel mark, etc.)
 *   - `pathLengthSum` : optional sum used by the stroke-draw animation
 *
 * Design intent
 * ─────────────
 *  • All shapes carry the Devanagari shirorekha (top bar) where appropriate.
 *  • Stroke modulation: thick "downstroke" body, thin "upstroke" wedge.
 *    Achieved by stacking filled paths rather than uniform `stroke-width`.
 *  • Drawn in `currentColor` so the consumer controls hue via Tailwind utilities.
 *  • These are stylised, not linguistically perfect — some conjuncts are
 *    abstracted. Where I have deliberately simplified a form, a `// abstraction:`
 *    comment notes the call.
 *  • Coordinate convention: x grows right, y grows down.
 *    Single-letter glyphs sit on a baseline at y=82 with the shirorekha at y=14.
 *    Phrase glyphs sit on a baseline at y=82 with the shirorekha at y=18.
 *
 * Recommended placements (DO NOT integrate from here — let the next agent wire them):
 *  • `shubh`             — Home hero eyebrow, paired with the tagline
 *  • `utsav`             — /about philosophy section accent
 *  • `vivah`             — /services/wedding + /services/bengali-wedding hero accent
 *  • `mangal`            — /pricing hero flourish
 *  • `kalash-mark`       — decorative inset on /services/haldi-gaye-holud
 *  • `om-mark`           — divider between major sections on /about & case studies
 *  • `swastika-mark`     — footer corner / festival page corner accent (the Indian
 *                          rounded-arm form, NEVER the German Hakenkreuz)
 *  • `letter-shri`       — eyebrow above founder bio + invite letters
 *  • `letter-aa`         — abstract accent in margins (about, case studies)
 *  • `border-shirorekha` — horizontal cultural-accent rule above H1 on home & about
 *  • `script-marquee`    — home capability strip, replacing or augmenting
 *                          the current Latin-only marquee
 */

export type LetterformPath = {
  /** SVG path data string. */
  d: string;
  /** Optional per-path stroke width override (in viewBox units). */
  strokeWidth?: number;
  /** Optional fill override; defaults to `currentColor`. */
  fill?: string;
  /** When true, the path is rendered with `fill="none"` and stroked. */
  strokeOnly?: boolean;
  /** Optional explicit path length (for stroke-draw animation). */
  length?: number;
};

export type Letterform = {
  /** Stable id. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Roman transliteration (used in screen-reader title fallback). */
  transliteration: string;
  /** SVG viewBox string. */
  viewBox: string;
  /** Y-coordinate of the visual baseline in viewBox units. */
  baseline?: number;
  /** Composed path list — drawn in order, top-down (back-to-front). */
  paths: ReadonlyArray<LetterformPath>;
};

export type LetterformId =
  | "shubh"
  | "utsav"
  | "sneh"
  | "vivah"
  | "mangal"
  | "swastika-mark"
  | "kalash-mark"
  | "om-mark"
  | "letter-shri"
  | "letter-aa"
  | "border-shirorekha";

/* ════════════════════════════════════════════════════════════════════════════
 *  Glyph definitions
 *  All paths use viewBox coordinates. Single letters: 100×100. Phrases: 240×100.
 *  Shirorekha (top bar) is a fundamental Devanagari feature — every letter
 *  except a few hangs from it. We render it as its own filled rect so the
 *  draw-animation can stagger it before the body strokes.
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 *  शुभ  ·  "shubh"  ·  auspicious
 *  Phrase of three letters: श + ु + भ
 *  Abstraction: the conjunct vowel sign ु (u-kar) is rendered as a small
 *  hooked counter beneath श rather than the literal Unicode form.
 */
const shubh: Letterform = {
  id: "shubh",
  label: "Shubh — auspicious",
  transliteration: "shubh",
  viewBox: "0 0 240 100",
  baseline: 82,
  paths: [
    // Shirorekha (top bar) — spans both letters, with a 6-unit gap between them
    {
      d: "M 18 18 L 108 18 L 108 24 L 18 24 Z M 130 18 L 220 18 L 220 24 L 130 24 Z",
    },
    // श — left stem (thick downstroke)
    {
      d: "M 30 24 C 28 38 28 54 32 72 C 33 76 36 78 40 78 C 44 78 47 74 47 70 C 47 56 45 42 44 24 Z",
    },
    // श — central serpentine body (the characteristic "shra" curve)
    {
      d: "M 50 24 C 52 38 56 50 66 56 C 74 60 80 56 84 52 C 88 48 88 42 86 36 C 84 30 80 26 76 26 C 70 26 64 32 60 38 C 56 44 56 52 60 60 C 64 68 72 74 82 76 C 90 78 100 76 104 70",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // श — right stem (thin upstroke)
    {
      d: "M 100 24 L 102 26 C 100 40 99 56 100 76 C 100 79 102 80 104 80 C 106 80 107 79 107 76 C 107 56 106 40 105 24 Z",
    },
    // ु — u-kar vowel sign tucked under श (abstraction: drawn as a curled hook)
    {
      d: "M 56 78 C 56 84 60 90 68 90 C 74 90 78 86 78 82 C 78 79 76 77 74 78 C 72 79 72 82 74 83",
      strokeOnly: true,
      strokeWidth: 3,
    },
    // भ — left stem
    {
      d: "M 142 24 C 140 40 140 58 144 76 C 145 80 148 82 152 82 C 156 82 159 78 158 74 C 156 56 154 40 156 24 Z",
    },
    // भ — top loop opening down-left (the "bha" knot)
    {
      d: "M 158 28 C 168 30 178 32 188 36 C 196 39 204 44 208 52 C 212 60 210 70 202 74 C 194 78 184 76 178 70 C 174 66 174 60 178 58 C 182 56 186 60 186 64",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // भ — right stem & lower flourish
    {
      d: "M 200 24 C 198 38 196 54 196 70 L 196 76 C 196 80 198 82 200 82 C 204 82 206 80 206 76 C 206 56 204 40 206 24 Z",
    },
    // Small brass dot accent under the gap (editorial flourish, not a literal mark)
    {
      d: "M 117 70 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0",
    },
  ],
};

/**
 *  उत्सव  ·  "utsav"  ·  celebration
 *  Four letters with prominent shirorekha. The उ at the start carries
 *  the distinctive open-bowl form (no shirorekha on उ itself by tradition,
 *  so we drop the bar over the first letter — authentic).
 */
const utsav: Letterform = {
  id: "utsav",
  label: "Utsav — celebration",
  transliteration: "utsav",
  viewBox: "0 0 240 100",
  baseline: 82,
  paths: [
    // Shirorekha — covers त्सव only (skips उ — historically accurate)
    {
      d: "M 70 18 L 222 18 L 222 24 L 70 24 Z",
    },
    // उ — the open bowl letter (no top bar). Two strokes: top cap + body bowl.
    {
      d: "M 14 26 C 22 24 32 24 40 28 C 44 30 45 34 42 36 C 38 38 34 36 32 34",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // उ — main bowl body
    {
      d: "M 20 40 C 18 50 18 62 22 72 C 26 80 36 84 46 82 C 56 80 62 72 60 62 C 58 54 50 50 44 54 C 40 56 40 62 44 64",
      strokeOnly: true,
      strokeWidth: 5,
    },
    // त — left curve (the t-letter's hooked spine)
    {
      d: "M 78 24 C 76 38 74 54 78 72 C 80 78 86 80 90 78 C 94 76 94 70 92 64 C 88 56 82 50 78 44",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // त — right stem
    {
      d: "M 96 24 C 94 40 94 58 96 76 C 96 80 99 82 102 82 C 105 82 107 80 107 76 C 107 58 106 40 108 24 Z",
    },
    // ् (halant) below त — small angled tick (joining त to स)
    {
      d: "M 102 84 L 110 92",
      strokeOnly: true,
      strokeWidth: 2,
    },
    // स — left curved bowl
    {
      d: "M 122 24 C 118 36 118 50 124 60 C 130 68 140 70 146 64 C 150 60 148 54 144 52 C 140 50 134 54 134 60",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // स — vertical descender from shirorekha
    {
      d: "M 138 24 C 136 40 136 58 140 76 C 141 80 144 82 147 82 C 150 82 152 80 152 76 C 152 60 150 42 152 24 Z",
    },
    // स — right stem
    {
      d: "M 160 24 C 158 40 158 58 160 76 C 160 80 163 82 166 82 C 169 82 171 80 171 76 C 171 58 170 40 172 24 Z",
    },
    // व — bowl forming the v-letter
    {
      d: "M 184 24 C 180 36 180 52 188 64 C 196 76 210 78 216 70 C 220 64 218 56 212 54 C 206 52 200 56 200 62 C 200 68 206 72 212 70",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // व — right stem
    {
      d: "M 212 24 C 210 40 210 58 212 76 C 212 80 215 82 218 82 C 221 82 223 80 223 76 C 223 58 222 40 224 24 Z",
    },
  ],
};

/**
 *  स्नेह  ·  "sneh"  ·  affection
 *  Three letters with a conjunct स्न at the start.
 *  Abstraction: the conjunct halant is implied via the joining stroke between
 *  स and न rather than rendered as a separate Unicode mark.
 */
const sneh: Letterform = {
  id: "sneh",
  label: "Sneh — affection",
  transliteration: "sneh",
  viewBox: "0 0 240 100",
  baseline: 82,
  paths: [
    // Shirorekha — spans the whole word
    {
      d: "M 16 18 L 224 18 L 224 24 L 16 24 Z",
    },
    // स — left bowl
    {
      d: "M 28 24 C 24 36 24 50 30 60 C 36 68 46 70 52 64 C 56 60 54 54 50 52 C 46 50 40 54 40 60",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // स — middle stem
    {
      d: "M 44 24 C 42 40 42 58 46 76 C 47 80 50 82 53 82 C 56 82 58 80 58 76 C 58 60 56 42 58 24 Z",
    },
    // स — right stem (becomes joining stroke into न)
    {
      d: "M 66 24 C 64 40 64 56 64 72 C 64 76 66 78 70 78 C 78 78 84 76 90 76",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // न — left curve (with conjunct join from स above)
    {
      d: "M 96 24 C 92 36 92 52 98 64 C 104 74 114 76 120 70 C 124 66 122 60 118 58 C 114 56 108 60 108 66",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // न — right stem
    {
      d: "M 122 24 C 120 40 120 58 122 76 C 122 80 125 82 128 82 C 131 82 133 80 133 76 C 133 58 132 40 134 24 Z",
    },
    // े — e-kar vowel sign above (slight comma-like mark above shirorekha)
    {
      d: "M 138 6 C 142 4 148 6 148 12 C 148 16 144 18 140 18",
      strokeOnly: true,
      strokeWidth: 3,
    },
    // ह — left curl (h-letter's distinctive open-loop)
    {
      d: "M 164 24 C 160 36 160 52 166 64 C 172 72 184 74 192 68 C 198 64 198 56 192 52 C 186 48 178 50 174 56 C 170 62 174 70 182 70",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // ह — right stem with a small tail loop (characteristic of ह)
    {
      d: "M 200 24 C 198 40 198 56 200 72 C 200 76 202 78 204 78 C 208 78 210 76 210 72 C 210 56 208 40 210 24 Z M 204 78 C 208 82 214 86 220 84 C 224 82 224 76 220 76",
    },
  ],
};

/**
 *  विवाह  ·  "vivah"  ·  marriage
 *  Four letters: व + ि (i-kar prefix) + व + ा (aa-kar) + ह
 *  The leading ि vowel is rendered as a tall hook before the first व.
 */
const vivah: Letterform = {
  id: "vivah",
  label: "Vivah — marriage",
  transliteration: "vivah",
  viewBox: "0 0 240 100",
  baseline: 82,
  paths: [
    // Shirorekha — note the ि vowel sign has its own bar that joins
    {
      d: "M 14 18 L 224 18 L 224 24 L 14 24 Z",
    },
    // ि — i-kar prefix (long hook descending from the bar before व)
    {
      d: "M 22 24 C 20 36 20 54 24 72 C 26 80 32 82 36 80 C 40 78 40 72 36 70 C 32 68 28 72 28 76",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // First व — bowl
    {
      d: "M 48 24 C 44 36 44 52 52 64 C 60 74 72 74 78 68 C 82 64 80 58 76 56 C 72 54 66 58 68 64",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // First व — right stem
    {
      d: "M 76 24 C 74 40 74 58 76 76 C 76 80 79 82 82 82 C 85 82 87 80 87 76 C 87 58 86 40 88 24 Z",
    },
    // Second व — bowl
    {
      d: "M 104 24 C 100 36 100 52 108 64 C 116 74 128 74 134 68 C 138 64 136 58 132 56 C 128 54 122 58 124 64",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // Second व — right stem (carries ा aa-kar to its right via an extra vertical)
    {
      d: "M 132 24 C 130 40 130 58 132 76 C 132 80 135 82 138 82 C 141 82 143 80 143 76 C 143 58 142 40 144 24 Z",
    },
    // ा — aa-kar (tall vertical bar after व)
    {
      d: "M 156 24 C 154 40 154 60 156 80 C 156 82 158 84 160 84 C 162 84 164 82 164 80 C 164 60 162 40 164 24 Z",
    },
    // ह — left open loop
    {
      d: "M 178 24 C 174 36 174 52 180 64 C 186 72 198 74 206 68 C 212 64 212 56 206 52 C 200 48 192 50 188 56 C 184 62 188 70 196 70",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // ह — right stem + lower tail (the visarga-like flick at base)
    {
      d: "M 212 24 C 210 40 210 56 212 72 C 212 76 214 78 216 78 C 220 78 222 76 222 72 C 222 56 220 40 222 24 Z M 216 78 C 220 84 224 88 218 92",
    },
  ],
};

/**
 *  मंगल  ·  "mangal"  ·  auspicious / well-being
 *  Three letters: म + anusvara dot + ग + ल.
 */
const mangal: Letterform = {
  id: "mangal",
  label: "Mangal — auspicious",
  transliteration: "mangal",
  viewBox: "0 0 240 100",
  baseline: 82,
  paths: [
    // Shirorekha
    {
      d: "M 18 18 L 222 18 L 222 24 L 18 24 Z",
    },
    // म — left curve (the characteristic m-loop, opens downward)
    {
      d: "M 32 24 C 28 38 28 56 36 70 C 44 80 58 80 64 72 C 68 66 64 58 58 58 C 54 58 50 62 52 66",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // म — middle stem
    {
      d: "M 58 24 C 56 40 56 58 60 76 C 61 80 64 82 67 82 C 70 82 72 80 72 76 C 72 60 70 42 72 24 Z",
    },
    // म — right stem
    {
      d: "M 82 24 C 80 40 80 58 82 76 C 82 80 85 82 88 82 C 91 82 93 80 93 76 C 93 58 92 40 94 24 Z",
    },
    // ं — anusvara (the nasal dot, sits above the shirorekha)
    {
      d: "M 102 10 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0",
    },
    // ग — left vertical (the g-letter's single-leg form)
    {
      d: "M 122 24 C 120 38 120 54 124 70 C 126 80 134 82 138 78 C 142 74 140 68 134 66 C 130 64 126 68 128 72",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // ग — right stem with descending tail (the diagnostic ग tail)
    {
      d: "M 144 24 C 142 40 142 58 144 76 C 144 80 147 82 150 82 C 153 82 155 80 155 76 C 155 58 154 40 156 24 Z M 150 82 C 154 86 156 90 152 92",
    },
    // ल — left curl
    {
      d: "M 168 24 C 164 36 164 52 170 64 C 176 72 188 74 196 68 C 202 64 202 56 196 52 C 190 48 182 50 178 56",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // ल — right stem with characteristic underturned hook at base
    {
      d: "M 200 24 C 198 40 198 58 200 76 C 200 80 203 82 206 82 C 210 82 212 80 212 76 C 212 58 210 40 212 24 Z M 206 82 C 212 86 218 84 220 78 C 222 74 218 70 214 72",
    },
  ],
};

/**
 *  Swastika-mark (Indian, rounded-arm, clearly distinct from Hakenkreuz)
 *  4-fold rotational symmetry, rounded ends, dot accents in each quadrant.
 *  Drawn inside 100×100 viewBox centered on (50, 50).
 */
const swastikaMark: Letterform = {
  id: "swastika-mark",
  label: "Swastika — auspicious mark (Indian)",
  transliteration: "swastika",
  viewBox: "0 0 100 100",
  paths: [
    // Central vertical bar
    {
      d: "M 47 22 L 53 22 L 53 78 L 47 78 Z",
    },
    // Central horizontal bar
    {
      d: "M 22 47 L 78 47 L 78 53 L 22 53 Z",
    },
    // Top arm — bends right with rounded cap (clockwise rotation pattern)
    {
      d: "M 53 22 L 70 22 C 73 22 75 24 75 27 L 75 36 L 69 36 L 69 28 L 53 28 Z",
    },
    // Right arm — bends down with rounded cap
    {
      d: "M 78 53 L 78 70 C 78 73 76 75 73 75 L 64 75 L 64 69 L 72 69 L 72 53 Z",
    },
    // Bottom arm — bends left with rounded cap
    {
      d: "M 47 78 L 30 78 C 27 78 25 76 25 73 L 25 64 L 31 64 L 31 72 L 47 72 Z",
    },
    // Left arm — bends up with rounded cap
    {
      d: "M 22 47 L 22 30 C 22 27 24 25 27 25 L 36 25 L 36 31 L 28 31 L 28 47 Z",
    },
    // Four quadrant dots (traditional auspicious accents)
    {
      d: "M 35 35 m -2.5 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0",
    },
    {
      d: "M 65 35 m -2.5 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0",
    },
    {
      d: "M 65 65 m -2.5 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0",
    },
    {
      d: "M 35 65 m -2.5 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0",
    },
  ],
};

/**
 *  Kalash — ceremonial brass pot motif.
 *  Body + neck + rim + coconut + mango-leaves crown (the puja arrangement).
 */
const kalashMark: Letterform = {
  id: "kalash-mark",
  label: "Kalash — ceremonial pot",
  transliteration: "kalash",
  viewBox: "0 0 100 100",
  paths: [
    // Body (round belly of the pot)
    {
      d: "M 30 56 C 30 44 38 36 50 36 C 62 36 70 44 70 56 C 70 70 64 82 50 82 C 36 82 30 70 30 56 Z",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
    // Belly inner shading line (decorative engraved rule)
    {
      d: "M 36 60 C 40 64 60 64 64 60",
      strokeOnly: true,
      strokeWidth: 1.5,
    },
    // Foot / base
    {
      d: "M 38 82 L 62 82 L 60 87 L 40 87 Z",
    },
    // Neck (cinch above the belly)
    {
      d: "M 42 36 L 58 36 L 58 30 L 42 30 Z",
    },
    // Rim (wider lip)
    {
      d: "M 38 26 L 62 26 L 62 30 L 38 30 Z",
    },
    // Coconut on top
    {
      d: "M 50 16 C 44 16 40 19 40 23 C 40 26 44 26 50 26 C 56 26 60 26 60 23 C 60 19 56 16 50 16 Z",
      strokeOnly: true,
      strokeWidth: 2,
    },
    // Mango leaf — center
    {
      d: "M 50 16 C 48 11 50 6 52 4 C 53 8 53 12 50 16 Z",
    },
    // Mango leaf — left
    {
      d: "M 44 22 C 38 18 34 12 33 8 C 38 11 43 16 44 22 Z",
    },
    // Mango leaf — right
    {
      d: "M 56 22 C 62 18 66 12 67 8 C 62 11 57 16 56 22 Z",
    },
    // Tiny tilak dot on the belly (auspicious mark)
    {
      d: "M 50 56 m -1.8 0 a 1.8 1.8 0 1 0 3.6 0 a 1.8 1.8 0 1 0 -3.6 0",
    },
  ],
};

/**
 *  ॐ  ·  "om"  ·  the sacred syllable.
 *  Stylised drawing — keeps the recognisable silhouette: 3-curve body,
 *  a curl-and-tail above, a crescent moon and a dot (chandrabindu) on top.
 */
const omMark: Letterform = {
  id: "om-mark",
  label: "Om — sacred syllable",
  transliteration: "om",
  viewBox: "0 0 100 100",
  paths: [
    // Lower large 3-shape (the body of the glyph)
    {
      d: "M 22 56 C 22 44 32 36 44 36 C 56 36 64 44 62 54 C 60 64 50 64 44 58 C 40 54 42 48 48 48 C 52 48 54 50 54 54",
      strokeOnly: true,
      strokeWidth: 5,
    },
    // Lower large curl extending right — the foot-stroke
    {
      d: "M 62 54 C 64 64 66 74 60 80 C 54 86 42 84 36 78 C 30 72 30 64 36 60",
      strokeOnly: true,
      strokeWidth: 5,
    },
    // Mid-right shoulder hook (the small horn that defines om)
    {
      d: "M 64 44 C 70 38 76 36 82 40 C 86 44 84 50 78 50 C 74 50 72 46 74 44",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // Upper tail rising to the right (the elongated headstroke flourish)
    {
      d: "M 78 38 C 80 32 80 26 76 22",
      strokeOnly: true,
      strokeWidth: 3.5,
    },
    // Chandra (crescent moon) above
    {
      d: "M 58 18 C 62 14 70 14 74 18 C 70 22 62 22 58 18 Z",
    },
    // Bindu (dot) sitting in the chandra
    {
      d: "M 66 14 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0",
    },
  ],
};

/**
 *  श्री  ·  "shri"  ·  honorific prefix.
 *  Used as an eyebrow accent — short, ornate, with the diagnostic ी (long-i)
 *  vowel mark trailing to the right.
 */
const letterShri: Letterform = {
  id: "letter-shri",
  label: "Shri — honorific prefix",
  transliteration: "shri",
  viewBox: "0 0 100 100",
  baseline: 82,
  paths: [
    // Shirorekha
    {
      d: "M 16 18 L 84 18 L 84 24 L 16 24 Z",
    },
    // श — left stem
    {
      d: "M 22 24 C 20 38 20 54 24 72 C 25 76 28 78 31 78 C 34 78 36 74 36 70 C 36 56 34 42 34 24 Z",
    },
    // श — central body curve
    {
      d: "M 38 24 C 40 38 46 50 54 56 C 60 60 66 56 66 50 C 66 44 62 40 58 42 C 54 44 54 50 58 52",
      strokeOnly: true,
      strokeWidth: 4,
    },
    // श — right stem
    {
      d: "M 60 24 L 62 26 C 60 40 60 56 62 76 C 62 79 64 80 66 80 C 68 80 69 79 69 76 C 69 56 68 40 67 24 Z",
    },
    // ्र — r-kar conjunct below (small angled stroke under श)
    {
      d: "M 42 78 L 52 90",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
    // ी — long-i vowel sign (vertical bar to the right with topward hook)
    {
      d: "M 80 6 C 86 4 90 8 88 14 C 86 18 82 18 80 16 M 82 18 C 80 36 80 56 82 78 C 82 82 84 84 86 84 C 88 84 90 82 90 78 C 90 56 88 36 90 18 Z",
    },
  ],
};

/**
 *  आ  ·  "aa"  ·  single long-a vowel letter.
 *  Used as an abstract margin accent. Single character with shirorekha + ा.
 */
const letterAa: Letterform = {
  id: "letter-aa",
  label: "Aa — long vowel",
  transliteration: "aa",
  viewBox: "0 0 100 100",
  baseline: 82,
  paths: [
    // Shirorekha
    {
      d: "M 18 18 L 82 18 L 82 24 L 18 24 Z",
    },
    // आ — main body (the a-glyph: a left bowl + descending stem)
    {
      d: "M 30 24 C 26 38 26 56 32 70 C 38 80 50 82 56 76 C 60 72 58 64 52 62 C 46 60 40 64 42 70",
      strokeOnly: true,
      strokeWidth: 4.5,
    },
    // आ — small inner hook (the a-letter's central horn)
    {
      d: "M 44 38 C 48 36 54 36 56 40",
      strokeOnly: true,
      strokeWidth: 3,
    },
    // आ — right stem
    {
      d: "M 56 24 C 54 40 54 58 56 76 C 56 80 59 82 62 82 C 65 82 67 80 67 76 C 67 58 66 40 68 24 Z",
    },
    // ा — aa-kar vowel sign (additional tall vertical, the "long a")
    {
      d: "M 76 24 C 74 40 74 60 76 80 C 76 82 78 84 80 84 C 82 84 84 82 84 80 C 84 60 82 40 84 24 Z",
    },
  ],
};

/**
 *  Border shirorekha — a horizontal cultural-accent rule.
 *  Stylised top-bar with small flourishes at each end and three subtle
 *  hangings (mimicking the descenders of a stylised inscription).
 *  Designed to sit ABOVE a Latin H1 as a cross-cultural accent.
 */
const borderShirorekha: Letterform = {
  id: "border-shirorekha",
  label: "Devanagari border rule",
  transliteration: "border",
  viewBox: "0 0 240 28",
  paths: [
    // Main bar — slightly tapered ends (thicker centre, thin ends)
    {
      d: "M 18 12 C 30 11 60 10 120 10 C 180 10 210 11 222 12 L 222 16 C 210 15 180 14 120 14 C 60 14 30 15 18 16 Z",
    },
    // Left bookend flourish — a brass dot + a small descender
    {
      d: "M 10 13 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0",
    },
    {
      d: "M 14 16 L 14 22",
      strokeOnly: true,
      strokeWidth: 1.5,
    },
    // Right bookend flourish
    {
      d: "M 230 13 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0",
    },
    {
      d: "M 226 16 L 226 22",
      strokeOnly: true,
      strokeWidth: 1.5,
    },
    // Three subtle hanging accents along the bar (decorative descenders)
    {
      d: "M 70 16 L 70 21",
      strokeOnly: true,
      strokeWidth: 1.25,
    },
    {
      d: "M 120 16 L 120 23",
      strokeOnly: true,
      strokeWidth: 1.5,
    },
    {
      d: "M 170 16 L 170 21",
      strokeOnly: true,
      strokeWidth: 1.25,
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════════
 *  Public registry
 * ════════════════════════════════════════════════════════════════════════════ */

export const letterforms: Readonly<Record<LetterformId, Letterform>> = {
  shubh,
  utsav,
  sneh,
  vivah,
  mangal,
  "swastika-mark": swastikaMark,
  "kalash-mark": kalashMark,
  "om-mark": omMark,
  "letter-shri": letterShri,
  "letter-aa": letterAa,
  "border-shirorekha": borderShirorekha,
} as const;

/** Ordered list — useful for showcase pages and iteration. */
export const letterformIds: ReadonlyArray<LetterformId> = [
  "shubh",
  "utsav",
  "sneh",
  "vivah",
  "mangal",
  "swastika-mark",
  "kalash-mark",
  "om-mark",
  "letter-shri",
  "letter-aa",
  "border-shirorekha",
] as const;

/** Look up a glyph by id. */
export function getLetterform(id: LetterformId): Letterform {
  return letterforms[id];
}
