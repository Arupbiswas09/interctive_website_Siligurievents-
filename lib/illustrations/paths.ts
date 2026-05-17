/**
 * Siligurievent — Animated Illustration Path Library
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Hand-authored SVG path data for the small set of cultural illustrations that
 * carry the site's editorial character: jasmine bloom, marigold petal fall,
 * brass diya flame, mehendi tendril draw-on, regional pin reveal, etc.
 *
 * Each illustration entry has:
 *   - `id`             : stable kebab-case key
 *   - `label`          : human-readable name (also used as fallback aria-label)
 *   - `viewBox`        : SVG viewBox string
 *   - `layers`         : ordered list of paths drawn back-to-front. Each layer
 *                        is independently addressable so the animated variants
 *                        can stagger / sequence / morph individual pieces.
 *   - `baseline?`      : optional y-coordinate of the visual baseline
 *
 * Design intent (follows the register set in `lib/devanagari/letterforms.ts`):
 *  • Hand-drawn feel — varying stroke widths, generous curves, no symmetric
 *    machine-perfect circles. Slight asymmetry where it adds warmth.
 *  • Renders in `currentColor` so the consumer controls hue via Tailwind
 *    text utilities. Layers may override with `fill` for two-tone accents.
 *  • Layer ordering matters — bloom/flower layers are emitted petal-by-petal
 *    so the stagger reads from centre outward (or outward → in).
 *  • Coordinate convention: x grows right, y grows down.
 *
 * Recommended placements (DO NOT integrate from here — let the next agent wire):
 *  • `jasmine-bloom-unfurl`   — inquiry form success state; Day→Night switcher
 *                                payoff; section H8 / H9 transition flourish
 *                                on Home.
 *  • `marigold-petal-fall`    — 404 page background ambience; Sangeet service
 *                                hero corner.
 *  • `diya-flicker`           — Haldi service hero corner ambient; Annaprashan
 *                                service ambient corner.
 *  • `mehendi-draw`           — Mehendi service hero; Bengali wedding case
 *                                study chapter transitions.
 *  • `region-pin-reveal`      — /locations grid; Home H7 (locations served)
 *                                map markers.
 *  • `brass-divider-spin`     — between major sections on /about and case
 *                                studies (heavier counterpart to the
 *                                Devanagari border-shirorekha).
 *  • `mandap-mark`            — favicon-large variant; Wedding service hero;
 *                                footer brand corner.
 *  • `shubh-laxmi-coin`       — Pricing-page deposit affordance; Annaprashan
 *                                / Mundan ceremony eyebrow accent.
 *  • `kalash-flourish`        — Haldi & Gaye Holud heroes (animatable
 *                                counterpart to the static `kalash-mark`
 *                                Devanagari motif).
 */

export type IllustrationLayer = {
  /** SVG path data string. */
  d: string;
  /** Optional per-path stroke width override (in viewBox units). */
  strokeWidth?: number;
  /** Optional fill override; defaults to `currentColor`. */
  fill?: string;
  /** When true, the path is rendered with `fill="none"` and stroked. */
  strokeOnly?: boolean;
  /** Optional opacity (0..1). */
  opacity?: number;
  /** Optional transform-origin in viewBox units (e.g. "50% 50%"). */
  transformOrigin?: string;
  /** Optional semantic tag — animations may filter on this. */
  role?:
    | "petal"
    | "stamen"
    | "stem"
    | "leaf"
    | "floral"
    | "tendril"
    | "flame"
    | "vessel"
    | "pin"
    | "medallion"
    | "rule"
    | "bloom"
    | "ornament"
    | "coin-rim"
    | "coin-glyph";
};

export type Illustration = {
  /** Stable id. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** SVG viewBox string. */
  viewBox: string;
  /** Y-coordinate of the visual baseline in viewBox units (optional). */
  baseline?: number;
  /** Composed layer list — drawn in order, back-to-front. */
  layers: ReadonlyArray<IllustrationLayer>;
};

export type IllustrationId =
  | "jasmine-bloom"
  | "marigold-bloom"
  | "marigold-petal"
  | "diya-lamp"
  | "mandap-mark"
  | "mehendi-tendril"
  | "shubh-laxmi-coin"
  | "region-pin"
  | "kalash-flourish"
  | "brass-divider";

/* ════════════════════════════════════════════════════════════════════════════
 *  Helper — generate a teardrop petal path on demand.
 *  Used internally to compose the marigold bloom from 16 rotated petals
 *  without paying the authoring cost 16 times. We still hand-tune each angle
 *  and a few jitter offsets so the result reads as hand-drawn, not stamped.
 * ════════════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────────────
 *  Jasmine bloom — single 5-petal flower (Jasminum sambac / Mogra abstraction)
 *  Each petal is its own teardrop, slightly asymmetric, so the stagger
 *  animation reads as "unfurling" rather than "blooming-in-a-circle".
 *  100×100 viewBox, centred on (50, 50).
 *  ────────────────────────────────────────────────────────────────────────── */
const jasmineBloom: Illustration = {
  id: "jasmine-bloom",
  label: "Jasmine bloom — single flower",
  viewBox: "0 0 100 100",
  layers: [
    // Petal 1 — top (12 o'clock). Asymmetric curl to the left.
    {
      d: "M 50 50 C 47 42 45 30 48 18 C 49 14 52 14 53 18 C 56 30 54 42 51 50 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Petal 2 — upper-right (~72°). Slightly broader.
    {
      d: "M 50 50 C 56 44 65 38 76 34 C 80 33 81 36 79 39 C 71 47 61 51 52 53 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Petal 3 — lower-right (~144°). Tip falls slightly downward.
    {
      d: "M 50 50 C 58 53 67 60 74 70 C 76 73 73 75 70 74 C 60 70 53 62 49 53 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Petal 4 — lower-left (~216°). Mirror of petal 3 with shorter curl.
    {
      d: "M 50 50 C 42 53 32 58 25 67 C 23 70 26 72 29 71 C 39 67 47 60 51 52 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Petal 5 — upper-left (~288°). Crisp lift.
    {
      d: "M 50 50 C 44 44 35 38 24 35 C 20 34 19 37 21 40 C 29 47 39 51 48 53 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Stamen — tiny gold dot at centre (drawn last → on top).
    {
      d: "M 50 50 m -2.4 0 a 2.4 2.4 0 1 0 4.8 0 a 2.4 2.4 0 1 0 -4.8 0",
      role: "stamen",
      fill: "var(--color-gold)",
      transformOrigin: "50px 50px",
    },
    // Stamen micro-pistil tick (asymmetric — hand-drawn feel).
    {
      d: "M 50 47 L 50.6 43",
      role: "stamen",
      strokeOnly: true,
      strokeWidth: 0.8,
      opacity: 0.7,
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Marigold bloom — dense, ~16 petals in two overlapping rings.
 *  Outer ring (8 petals) drawn first, inner ring (8 petals) on top, then
 *  a centred boss disc. 100×100 viewBox, centred on (50, 50).
 *  Layered so the animated variant can stagger ring-by-ring.
 *  ────────────────────────────────────────────────────────────────────────── */
const marigoldBloom: Illustration = {
  id: "marigold-bloom",
  label: "Marigold bloom — genda phool",
  viewBox: "0 0 100 100",
  layers: [
    // ─── Outer ring — 8 petals, longer reach, slight ellipse ───
    // 12 o'clock
    {
      d: "M 50 50 C 47 38 46 26 49 14 C 50 12 52 12 53 14 C 56 26 55 38 52 50 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 1:30
    {
      d: "M 50 50 C 58 44 70 38 82 32 C 84 31 85 33 84 35 C 76 47 64 53 52 54 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 3 o'clock
    {
      d: "M 50 50 C 62 47 76 46 88 49 C 90 50 90 52 88 53 C 76 56 62 55 50 52 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 4:30
    {
      d: "M 50 50 C 58 56 70 64 82 70 C 84 71 83 73 81 73 C 68 71 58 64 52 54 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 6 o'clock
    {
      d: "M 50 50 C 47 62 46 74 49 86 C 50 88 52 88 53 86 C 56 74 55 62 52 50 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 7:30
    {
      d: "M 50 50 C 42 56 30 64 18 70 C 16 71 17 73 19 73 C 32 71 42 64 48 54 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 9 o'clock
    {
      d: "M 50 50 C 38 47 24 46 12 49 C 10 50 10 52 12 53 C 24 56 38 55 50 52 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // 10:30
    {
      d: "M 50 50 C 42 44 30 38 18 32 C 16 31 15 33 16 35 C 24 47 36 53 48 54 Z",
      role: "petal",
      opacity: 0.92,
      transformOrigin: "50px 50px",
    },
    // ─── Inner ring — 8 shorter petals, rotated 22.5° offset, brighter ───
    // ~22.5° (between 12 and 1:30)
    {
      d: "M 50 50 C 52 42 56 34 62 28 C 64 27 65 29 64 31 C 60 39 56 45 51 49 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~67.5°
    {
      d: "M 50 50 C 58 48 66 48 74 50 C 76 51 75 53 73 53 C 66 54 58 53 51 51 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~112.5°
    {
      d: "M 50 50 C 52 58 56 66 62 72 C 64 73 65 71 64 69 C 60 61 56 55 51 51 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~157.5°
    {
      d: "M 50 50 C 48 58 44 66 38 72 C 36 73 35 71 36 69 C 40 61 44 55 49 51 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~202.5°
    {
      d: "M 50 50 C 42 52 34 52 26 50 C 24 49 25 47 27 47 C 34 46 42 47 49 49 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~247.5°
    {
      d: "M 50 50 C 48 42 44 34 38 28 C 36 27 35 29 36 31 C 40 39 44 45 49 49 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~292.5°
    {
      d: "M 50 50 C 52 52 60 52 68 50 C 70 49 69 47 67 47 C 60 46 52 47 50 49 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // ~337.5°
    {
      d: "M 50 50 C 53 47 58 42 64 38 C 65 37 66 39 65 40 C 60 45 55 49 51 50 Z",
      role: "petal",
      transformOrigin: "50px 50px",
    },
    // Central boss disc — slightly darker than petals to read as the seed bed.
    {
      d: "M 50 50 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0",
      fill: "var(--color-accent-deep, currentColor)",
      opacity: 0.85,
    },
    // Tiny highlight tick on the boss (hand-drawn warmth).
    {
      d: "M 47.5 47.5 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
      fill: "var(--color-gold-soft, currentColor)",
      opacity: 0.7,
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Marigold petal — single petal, used by the petal-fall animation.
 *  Drawn in 40×60 so the natural aspect is closer to the real petal.
 *  Anchor at top centre (20, 4) so rotation reads as "falling from the stem".
 *  ────────────────────────────────────────────────────────────────────────── */
const marigoldPetal: Illustration = {
  id: "marigold-petal",
  label: "Marigold petal",
  viewBox: "0 0 40 60",
  layers: [
    // Petal body — asymmetric teardrop with a curved spine.
    {
      d: "M 20 4 C 14 12 10 24 12 38 C 13 48 17 56 20 56 C 23 56 27 48 28 38 C 30 24 26 12 20 4 Z",
      role: "petal",
      transformOrigin: "20px 4px",
    },
    // Spine vein — single soft stroke, slightly off-centre (hand-drawn).
    {
      d: "M 20.5 8 C 19.5 22 19.8 38 20.2 52",
      role: "petal",
      strokeOnly: true,
      strokeWidth: 0.8,
      opacity: 0.45,
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Diya lamp — brass oil lamp profile + flame.
 *  Flame is its own layer so it can flicker independently of the brass body.
 *  100×100 viewBox; bowl sits at y≈70, flame peaks at y≈18.
 *  ────────────────────────────────────────────────────────────────────────── */
const diyaLamp: Illustration = {
  id: "diya-lamp",
  label: "Diya — brass oil lamp",
  viewBox: "0 0 100 100",
  baseline: 92,
  layers: [
    // Wick wisp inside the bowl (drawn first so flame covers it slightly).
    {
      d: "M 50 60 L 50 72",
      role: "stem",
      strokeOnly: true,
      strokeWidth: 1.2,
      fill: "var(--color-ink, currentColor)",
      opacity: 0.55,
    },
    // Diya bowl — shallow curved vessel with a pinched spout on the right.
    // Authored as a single closed path for the silhouette.
    {
      d: "M 14 72 C 16 64 24 60 36 60 L 68 60 C 74 60 80 62 84 66 C 86 68 86 70 84 72 L 80 78 C 78 82 72 84 64 84 L 34 84 C 26 84 20 82 16 78 L 14 72 Z",
      role: "vessel",
      fill: "var(--color-brass-leaf, var(--color-gold))",
    },
    // Bowl inner shadow line — the lip of the brass rim catching light.
    {
      d: "M 18 68 C 30 70 70 70 82 68",
      role: "vessel",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.5,
    },
    // Spout pinch (right side of bowl, where the wick rests).
    {
      d: "M 82 64 C 88 64 90 68 88 72 C 86 74 82 73 80 70 Z",
      role: "vessel",
      fill: "var(--color-brass-leaf, var(--color-gold))",
    },
    // Foot / base — narrower than the bowl, slight asymmetric tilt.
    {
      d: "M 30 84 L 70 84 L 66 92 L 34 92 Z",
      role: "vessel",
      fill: "var(--color-accent-deep, var(--color-gold))",
      opacity: 0.85,
    },
    // Tiny brass dot on the foot (engraved decorative accent).
    {
      d: "M 50 88 m -1.3 0 a 1.3 1.3 0 1 0 2.6 0 a 1.3 1.3 0 1 0 -2.6 0",
      opacity: 0.6,
    },
    // ─── Flame — separate role, animatable independently ───
    // Flame body — the classic teardrop with a slight S-curve at the tip
    // (real candle flames are never perfectly symmetric).
    {
      d: "M 50 58 C 44 52 42 44 45 36 C 47 30 48 26 50 18 C 52 26 54 32 55 36 C 58 44 56 52 50 58 Z",
      role: "flame",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "50px 58px",
    },
    // Flame inner — hotter core, slightly lower opacity layer for warmth.
    {
      d: "M 50 56 C 47 52 46 46 48 40 C 49 36 50 32 50.5 26 C 51 32 52 36 53 40 C 55 46 54 52 50 56 Z",
      role: "flame",
      fill: "var(--color-gold-soft, var(--color-gold))",
      opacity: 0.85,
      transformOrigin: "50px 58px",
    },
    // Flame highlight — tiny wick-line at the very base.
    {
      d: "M 50 58 L 50 60",
      role: "flame",
      strokeOnly: true,
      strokeWidth: 1.5,
      fill: "var(--color-accent, currentColor)",
      opacity: 0.6,
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Mandap mark — 4-pillar mandap silhouette with canopy + finial.
 *  Drawn in 100×100. Outline version (strokeOnly layers) reads at favicon
 *  size; silhouette is the same form but filled for the corner mark.
 *  ────────────────────────────────────────────────────────────────────────── */
const mandapMark: Illustration = {
  id: "mandap-mark",
  label: "Mandap — wedding canopy",
  viewBox: "0 0 100 100",
  baseline: 88,
  layers: [
    // Ground line — thin stroke under the pillars.
    {
      d: "M 12 88 L 88 88",
      role: "rule",
      strokeOnly: true,
      strokeWidth: 1,
      opacity: 0.6,
    },
    // Left pillar
    {
      d: "M 22 88 L 22 38 L 28 38 L 28 88 Z",
      role: "vessel",
    },
    // Inner-left pillar (slight setback so the four pillars read at depth)
    {
      d: "M 40 88 L 40 38 L 44 38 L 44 88 Z",
      role: "vessel",
      opacity: 0.85,
    },
    // Inner-right pillar
    {
      d: "M 56 88 L 56 38 L 60 38 L 60 88 Z",
      role: "vessel",
      opacity: 0.85,
    },
    // Right pillar
    {
      d: "M 72 88 L 72 38 L 78 38 L 78 88 Z",
      role: "vessel",
    },
    // Pillar capitals — small rectangular flares atop each post.
    {
      d: "M 20 34 L 30 34 L 30 38 L 20 38 Z M 38 34 L 46 34 L 46 38 L 38 38 Z M 54 34 L 62 34 L 62 38 L 54 38 Z M 70 34 L 80 34 L 80 38 L 70 38 Z",
      role: "vessel",
    },
    // Canopy — gently arched roof spanning all pillars.
    {
      d: "M 18 34 C 18 22 30 14 50 14 C 70 14 82 22 82 34 L 78 34 C 78 24 68 18 50 18 C 32 18 22 24 22 34 Z",
      role: "ornament",
    },
    // Inner canopy ridge line (engraved detail).
    {
      d: "M 24 30 C 32 22 68 22 76 30",
      role: "ornament",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.55,
    },
    // Canopy hangings — three small droplets along the front edge.
    {
      d: "M 36 18 L 36 22 M 36 22 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      strokeOnly: true,
      strokeWidth: 0.8,
    },
    {
      d: "M 50 16 L 50 21 M 50 21 m -1.4 0 a 1.4 1.4 0 1 0 2.8 0 a 1.4 1.4 0 1 0 -2.8 0",
      role: "ornament",
      strokeOnly: true,
      strokeWidth: 0.8,
    },
    {
      d: "M 64 18 L 64 22 M 64 22 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      strokeOnly: true,
      strokeWidth: 0.8,
    },
    // Finial — central spire + crowning bud.
    {
      d: "M 49 14 L 51 14 L 51 6 L 49 6 Z",
      role: "ornament",
    },
    // Finial bud
    {
      d: "M 50 6 C 47 5 47 1 50 0 C 53 1 53 5 50 6 Z",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Mehendi tendril — curling vine + 3 leaves + 2 small flower motifs.
 *  Designed for progressive draw: the spine is one continuous path so
 *  stroke-dasharray animates as a single line, then leaves + flowers
 *  fade in along the path.
 *  240×100 viewBox — horizontal flourish, used along section transitions.
 *  ────────────────────────────────────────────────────────────────────────── */
const mehendiTendril: Illustration = {
  id: "mehendi-tendril",
  label: "Mehendi tendril",
  viewBox: "0 0 240 100",
  layers: [
    // Spine — the main curling vine, one continuous strokable path.
    // S-curve with two small loops where the floral motifs will sit.
    {
      d: "M 8 60 C 24 60 36 48 48 38 C 60 28 76 26 92 36 C 108 46 112 60 124 64 C 138 68 150 60 162 50 C 174 40 188 38 200 46 C 212 54 220 60 232 56",
      role: "tendril",
      strokeOnly: true,
      strokeWidth: 1.8,
    },
    // Sub-tendril 1 — small curl branching up from x≈40
    {
      d: "M 44 42 C 40 36 38 30 42 26",
      role: "tendril",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.85,
    },
    // Sub-tendril 2 — curl branching down near x≈140
    {
      d: "M 140 62 C 144 70 148 76 144 82",
      role: "tendril",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.85,
    },
    // Sub-tendril 3 — curl branching up at x≈198
    {
      d: "M 198 44 C 202 38 206 34 202 28",
      role: "tendril",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.85,
    },
    // Leaf 1 — at the apex of the first arc (around x=48, y=38).
    {
      d: "M 48 38 C 42 32 42 26 48 22 C 54 26 54 32 48 38 Z",
      role: "leaf",
      transformOrigin: "48px 38px",
    },
    // Leaf 1 — vein
    {
      d: "M 48 23 L 48 36",
      role: "leaf",
      strokeOnly: true,
      strokeWidth: 0.6,
      opacity: 0.45,
    },
    // Leaf 2 — at the inner valley (around x=124, y=64).
    {
      d: "M 124 64 C 120 70 120 76 124 82 C 128 76 128 70 124 64 Z",
      role: "leaf",
      transformOrigin: "124px 64px",
    },
    // Leaf 2 — vein
    {
      d: "M 124 66 L 124 80",
      role: "leaf",
      strokeOnly: true,
      strokeWidth: 0.6,
      opacity: 0.45,
    },
    // Leaf 3 — at the second arc apex (around x=200, y=46).
    {
      d: "M 200 46 C 194 40 194 34 200 30 C 206 34 206 40 200 46 Z",
      role: "leaf",
      transformOrigin: "200px 46px",
    },
    // Leaf 3 — vein
    {
      d: "M 200 31 L 200 44",
      role: "leaf",
      strokeOnly: true,
      strokeWidth: 0.6,
      opacity: 0.45,
    },
    // Floral motif 1 — small mehendi flower at x≈88, y=34.
    // 5 tiny petals around a centre dot (a stylised "phool").
    {
      d: "M 88 28 C 86 30 86 32 88 32 C 90 32 90 30 88 28 Z M 92 32 C 94 32 94 34 92 34 C 90 34 90 32 92 32 Z M 90 38 C 92 36 90 34 88 36 C 86 34 84 36 86 38 C 86 39 88 40 88 39 C 88 40 90 39 90 38 Z M 84 34 C 86 32 86 32 84 32 C 82 32 82 34 84 34 Z M 88 36 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "floral",
      transformOrigin: "88px 34px",
    },
    // Floral motif 2 — small mehendi flower at x≈164, y=50.
    {
      d: "M 164 44 C 162 46 162 48 164 48 C 166 48 166 46 164 44 Z M 168 48 C 170 48 170 50 168 50 C 166 50 166 48 168 48 Z M 166 54 C 168 52 166 50 164 52 C 162 50 160 52 162 54 C 162 55 164 56 164 55 C 164 56 166 55 166 54 Z M 160 50 C 162 48 162 48 160 48 C 158 48 158 50 160 50 Z M 164 52 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "floral",
      transformOrigin: "164px 52px",
    },
    // Endpoint dots — tiny brass beads at both ends of the spine for closure.
    {
      d: "M 6 60 m -1.6 0 a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
    },
    {
      d: "M 234 56 m -1.6 0 a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Shubh Laxmi coin — stylised coin with a small Devanagari glyph centre.
 *  Reuses the "om-mark" visual register from Agent B's letterforms.ts.
 *  100×100 viewBox, centred on (50, 50).
 *  Layered: outer rim, inner rim, beaded ring, centre om silhouette.
 *  ────────────────────────────────────────────────────────────────────────── */
const shubhLaxmiCoin: Illustration = {
  id: "shubh-laxmi-coin",
  label: "Shubh Laxmi — auspicious coin",
  viewBox: "0 0 100 100",
  layers: [
    // Outer rim — slightly thicker
    {
      d: "M 50 6 C 74 6 94 26 94 50 C 94 74 74 94 50 94 C 26 94 6 74 6 50 C 6 26 26 6 50 6 Z M 50 12 C 29 12 12 29 12 50 C 12 71 29 88 50 88 C 71 88 88 71 88 50 C 88 29 71 12 50 12 Z",
      role: "coin-rim",
      fill: "var(--color-brass-leaf, var(--color-gold))",
    },
    // Beaded ring — 12 tiny dots equidistant around the inner edge
    {
      d: "M 50 18 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 66 22 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 78 34 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 82 50 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 78 66 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 66 78 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 50 82 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 34 78 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 22 66 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 18 50 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 22 34 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    {
      d: "M 34 22 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "ornament",
      opacity: 0.85,
    },
    // Central om glyph — stylised, sits in the coin face. Tighter than the
    // standalone om-mark so it reads at small sizes too.
    // Body of the 3-shape
    {
      d: "M 36 52 C 36 44 42 38 50 38 C 58 38 64 44 62 50 C 60 58 52 58 48 54 C 46 52 48 48 52 48",
      role: "coin-glyph",
      strokeOnly: true,
      strokeWidth: 3,
    },
    // Lower foot-stroke of the om
    {
      d: "M 62 50 C 64 58 64 64 60 68 C 56 72 48 70 44 66",
      role: "coin-glyph",
      strokeOnly: true,
      strokeWidth: 3,
    },
    // Shoulder hook
    {
      d: "M 64 44 C 68 40 72 40 74 44 C 75 47 72 50 70 48",
      role: "coin-glyph",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
    // Chandra (crescent) above
    {
      d: "M 46 30 C 48 28 54 28 56 30 C 54 32 48 32 46 30 Z",
      role: "coin-glyph",
    },
    // Bindu dot
    {
      d: "M 51 26 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "coin-glyph",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Region pin — teardrop pin with a small jasmine bloom inside.
 *  Designed so the pin can drop in from above and the inner bloom can
 *  unfurl separately afterwards.
 *  60×80 viewBox so the natural aspect reads as taller than wide.
 *  ────────────────────────────────────────────────────────────────────────── */
const regionPin: Illustration = {
  id: "region-pin",
  label: "Region pin with jasmine",
  viewBox: "0 0 60 80",
  layers: [
    // Shadow on the ground (separate so it stays in place when pin bounces)
    {
      d: "M 30 76 m -10 0 a 10 2 0 1 0 20 0 a 10 2 0 1 0 -20 0",
      role: "ornament",
      fill: "var(--color-ink, currentColor)",
      opacity: 0.18,
    },
    // Pin body — teardrop. Wider top circle that tapers to a point at y=72.
    {
      d: "M 30 4 C 16 4 6 14 6 28 C 6 38 14 50 26 64 C 28 68 30 70 30 72 C 30 70 32 68 34 64 C 46 50 54 38 54 28 C 54 14 44 4 30 4 Z",
      role: "pin",
      fill: "var(--color-accent, currentColor)",
    },
    // Pin inner highlight — gives volume.
    {
      d: "M 30 8 C 20 8 12 16 12 26 C 16 16 24 12 30 12 C 36 12 44 16 48 26 C 48 16 40 8 30 8 Z",
      role: "pin",
      fill: "var(--color-gold-soft, var(--color-gold))",
      opacity: 0.35,
    },
    // Inner circle well — where the jasmine sits.
    {
      d: "M 30 28 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0",
      role: "pin",
      fill: "var(--color-bg, currentColor)",
    },
    // Inner well rim
    {
      d: "M 30 28 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0",
      role: "pin",
      strokeOnly: true,
      strokeWidth: 1.2,
      opacity: 0.6,
    },
    // Jasmine bloom inside the well — 5 small petals + stamen.
    // (Tighter geometry than the standalone jasmine, scaled to the well.)
    {
      d: "M 30 28 C 28.5 24 28 19 29.5 16 C 30 15 30.5 15 30.5 16 C 32 19 31.5 24 30 28 Z",
      role: "petal",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "30px 28px",
    },
    {
      d: "M 30 28 C 33 25.5 37 23 41 22 C 42 22 42 23 41.5 23.5 C 38 26.5 33.5 28.5 30.5 29 Z",
      role: "petal",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "30px 28px",
    },
    {
      d: "M 30 28 C 33.5 30 37 33 39 36.5 C 39.5 37.5 38.5 38 37.5 37.5 C 33.5 35.5 30.5 32 29.5 28.5 Z",
      role: "petal",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "30px 28px",
    },
    {
      d: "M 30 28 C 26.5 30 23 33 21 36.5 C 20.5 37.5 21.5 38 22.5 37.5 C 26.5 35.5 29.5 32 30.5 28.5 Z",
      role: "petal",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "30px 28px",
    },
    {
      d: "M 30 28 C 27 25.5 23 23 19 22 C 18 22 18 23 18.5 23.5 C 22 26.5 26.5 28.5 29.5 29 Z",
      role: "petal",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "30px 28px",
    },
    // Stamen dot
    {
      d: "M 30 28 m -1.2 0 a 1.2 1.2 0 1 0 2.4 0 a 1.2 1.2 0 1 0 -2.4 0",
      role: "stamen",
      fill: "var(--color-accent-deep, var(--color-accent))",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Kalash flourish — animatable layered version of the kalash motif.
 *  Same forms as Agent B's `kalash-mark` but separated into addressable
 *  layers (pot, neck, rim, coconut, three leaves) so the animation can
 *  build them up in sequence.
 *  100×100 viewBox.
 *  ────────────────────────────────────────────────────────────────────────── */
const kalashFlourish: Illustration = {
  id: "kalash-flourish",
  label: "Kalash — ceremonial pot flourish",
  viewBox: "0 0 100 100",
  baseline: 92,
  layers: [
    // Base/foot — drawn first (back of stack)
    {
      d: "M 38 82 L 62 82 L 60 92 L 40 92 Z",
      role: "vessel",
      fill: "var(--color-brass-leaf, var(--color-gold))",
    },
    // Body — round belly of the pot (slight asymmetry for hand-drawn warmth)
    {
      d: "M 30 56 C 30 44 38 36 50.5 36 C 62 36 70 44 70 56 C 70 70 64 82 50 82 C 36 82 30 70 30 56 Z",
      role: "vessel",
      strokeOnly: true,
      strokeWidth: 2.5,
    },
    // Belly inner shading curve (engraved decorative rule)
    {
      d: "M 36 60 C 40 64 60 64 64 60",
      role: "vessel",
      strokeOnly: true,
      strokeWidth: 1.4,
      opacity: 0.6,
    },
    // Tilak dot on the belly
    {
      d: "M 50 58 m -1.8 0 a 1.8 1.8 0 1 0 3.6 0 a 1.8 1.8 0 1 0 -3.6 0",
      role: "ornament",
      fill: "var(--color-accent, currentColor)",
    },
    // Neck — narrow cinch above the belly
    {
      d: "M 42 36 L 58 36 L 58 30 L 42 30 Z",
      role: "vessel",
    },
    // Rim — wider lip
    {
      d: "M 38 26 L 62 26 L 62 30 L 38 30 Z",
      role: "vessel",
    },
    // Coconut — sits on the rim
    {
      d: "M 50 16 C 44 16 40 19 40 23 C 40 26 44 26 50 26 C 56 26 60 26 60 23 C 60 19 56 16 50 16 Z",
      role: "ornament",
      strokeOnly: true,
      strokeWidth: 2,
    },
    // Coconut fibre dot — small accent
    {
      d: "M 50 22 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "ornament",
      opacity: 0.45,
    },
    // Mango leaf — left
    {
      d: "M 44 22 C 38 18 34 12 33 8 C 38 11 43 16 44 22 Z",
      role: "leaf",
      transformOrigin: "44px 22px",
    },
    // Mango leaf — centre
    {
      d: "M 50 16 C 48 11 50 6 52 4 C 53 8 53 12 50 16 Z",
      role: "leaf",
      transformOrigin: "50px 16px",
    },
    // Mango leaf — right
    {
      d: "M 56 22 C 62 18 66 12 67 8 C 62 11 57 16 56 22 Z",
      role: "leaf",
      transformOrigin: "56px 22px",
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Brass divider — horizontal hairline rule with a centred brass medallion.
 *  The medallion rotates on scroll-in; the hairline draws outward from
 *  centre at the same time.
 *  240×40 viewBox — wide and short, designed for between-section breaks.
 *  ────────────────────────────────────────────────────────────────────────── */
const brassDivider: Illustration = {
  id: "brass-divider",
  label: "Brass divider with medallion",
  viewBox: "0 0 240 40",
  layers: [
    // Left hairline — draws from centre (x=120) outward to x=10
    {
      d: "M 120 20 L 10 20",
      role: "rule",
      strokeOnly: true,
      strokeWidth: 1,
    },
    // Right hairline — draws from centre (x=120) outward to x=230
    {
      d: "M 120 20 L 230 20",
      role: "rule",
      strokeOnly: true,
      strokeWidth: 1,
    },
    // Left bookend brass dot
    {
      d: "M 8 20 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
    },
    // Right bookend brass dot
    {
      d: "M 232 20 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
    },
    // Medallion outer rim — sits at (120, 20), radius 14
    {
      d: "M 120 6 C 127.7 6 134 12.3 134 20 C 134 27.7 127.7 34 120 34 C 112.3 34 106 27.7 106 20 C 106 12.3 112.3 6 120 6 Z M 120 9 C 113.9 9 109 13.9 109 20 C 109 26.1 113.9 31 120 31 C 126.1 31 131 26.1 131 20 C 131 13.9 126.1 9 120 9 Z",
      role: "medallion",
      fill: "var(--color-brass-leaf, var(--color-gold))",
      transformOrigin: "120px 20px",
    },
    // Medallion inner cross-petal (4-fold motif, the auspicious mark form)
    {
      d: "M 120 11 C 121 14 121 16 120 18 C 119 16 119 14 120 11 Z M 129 20 C 126 21 124 21 122 20 C 124 19 126 19 129 20 Z M 120 29 C 119 26 119 24 120 22 C 121 24 121 26 120 29 Z M 111 20 C 114 19 116 19 118 20 C 116 21 114 21 111 20 Z",
      role: "medallion",
      transformOrigin: "120px 20px",
    },
    // Medallion centre dot
    {
      d: "M 120 20 m -1.6 0 a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0",
      role: "medallion",
      fill: "var(--color-gold, currentColor)",
      transformOrigin: "120px 20px",
    },
    // Four tiny quadrant accents around the medallion
    {
      d: "M 120 4 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
      opacity: 0.75,
    },
    {
      d: "M 136 20 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
      opacity: 0.75,
    },
    {
      d: "M 120 36 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
      opacity: 0.75,
    },
    {
      d: "M 104 20 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0",
      role: "ornament",
      fill: "var(--color-gold, currentColor)",
      opacity: 0.75,
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════════
 *  Public registry
 * ════════════════════════════════════════════════════════════════════════════ */

export const illustrations: Readonly<Record<IllustrationId, Illustration>> = {
  "jasmine-bloom": jasmineBloom,
  "marigold-bloom": marigoldBloom,
  "marigold-petal": marigoldPetal,
  "diya-lamp": diyaLamp,
  "mandap-mark": mandapMark,
  "mehendi-tendril": mehendiTendril,
  "shubh-laxmi-coin": shubhLaxmiCoin,
  "region-pin": regionPin,
  "kalash-flourish": kalashFlourish,
  "brass-divider": brassDivider,
} as const;

/** Ordered list — useful for showcase pages and iteration. */
export const illustrationIds: ReadonlyArray<IllustrationId> = [
  "jasmine-bloom",
  "marigold-bloom",
  "marigold-petal",
  "diya-lamp",
  "mandap-mark",
  "mehendi-tendril",
  "shubh-laxmi-coin",
  "region-pin",
  "kalash-flourish",
  "brass-divider",
] as const;

/** Look up an illustration by id. */
export function getIllustration(id: IllustrationId): Illustration {
  return illustrations[id];
}
