# Siligurievent — Illustration Library

Hand-authored animated SVG illustrations: jasmine bloom unfurl, marigold petal
fall, brass diya flame flicker, mehendi tendrils, region pin reveal, brass
divider spin. The small but memorable moments that elevate the site from
polished to memorable.

Quality bar: hand-drawn feel, intentional weight, varied stroke widths, never
sterile. Same visual register as `lib/devanagari/letterforms.ts`.

## Files

- `lib/illustrations/paths.ts` — registry of SVG path data and layer metadata.
- `components/illustrations/illustration-base.tsx` — server-safe static renderer.
- `components/illustrations/illustration-draw.tsx` — generic stroke-draw on
  intersection (CSS only).
- `components/illustrations/jasmine-bloom-unfurl.tsx` — GSAP petal-stagger.
- `components/illustrations/marigold-petal-fall.tsx` — ambient continuous fall.
- `components/illustrations/diya-flicker.tsx` — GSAP flame flicker + halo bloom.
- `components/illustrations/mehendi-draw.tsx` — scroll-triggered draw-on.
- `components/illustrations/region-pin-reveal.tsx` — drop + inner bloom.
- `components/illustrations/brass-divider-spin.tsx` — medallion rotation +
  hairline draw from centre.
- `app/design/illustrations/page.tsx` — internal showcase under `/design/illustrations`.

Reference benchmarks: LottieFiles Editor's Picks, rauno.me demos, basement.studio
illustrations, anton & irene loaders.

## Catalog

| id                 | viewBox | Use                                              |
| ------------------ | ------- | ------------------------------------------------ |
| `jasmine-bloom`    | 100×100 | 5-petal flower with stamen — payoff moment.      |
| `marigold-bloom`   | 100×100 | Dense ~16-petal genda phool.                     |
| `marigold-petal`   | 40×60   | Single petal — used by the petal-fall ambience.  |
| `diya-lamp`        | 100×100 | Brass oil lamp + animatable flame.               |
| `mandap-mark`      | 100×100 | 4-pillar mandap silhouette with canopy + finial. |
| `mehendi-tendril`  | 240×100 | Horizontal curling vine with leaves + florals.   |
| `shubh-laxmi-coin` | 100×100 | Coin with om-mark glyph + beaded ring.           |
| `region-pin`       | 60×80   | Teardrop pin with inner jasmine bloom.           |
| `kalash-flourish`  | 100×100 | Ceremonial pot, coconut, mango-leaf crown.       |
| `brass-divider`    | 240×40  | Hairline rule with centred brass medallion.      |

## Components

### `<IllustrationBase>` (server-safe)

Static SVG renderer. No client JS. Use anywhere the static form is enough.

```tsx
import { IllustrationBase } from "@/components/illustrations/illustration-base";

<IllustrationBase id="jasmine-bloom" size="md" tone="gold" />
<IllustrationBase id="mandap-mark" size="xl" tone="brass" />
```

Props: `{ id; size?: "xs"|"sm"|"md"|"lg"|"xl"; tone?: "ink"|"muted"|"gold"|"brass"|"current"; ariaLabel?; className? }`.

### `<IllustrationDraw>` (generic stroke-draw, CSS only)

Animates each layer's `stroke-dasharray` from full → 0 on intersection. Pure
CSS — no GSAP plugin required. Once per intersection. Honours reduced motion.

```tsx
import { IllustrationDraw } from "@/components/illustrations/illustration-draw";

<IllustrationDraw id="mehendi-tendril" duration={2200} tone="gold" />
```

Props: `{ id; size?; tone?; duration?: number; stagger?: number; ariaLabel?; className? }`.

### `<JasmineBloomUnfurl>`

5 petals scale 0 → 1 with 80ms stagger, slight outward rotation; stamen pops
last. GSAP timeline, total ≈1.4s. Reusable as success state on inquiry form,
Day → Night switcher confirmation, section transitions.

```tsx
import {
  JasmineBloomUnfurl,
  type JasmineBloomUnfurlHandle,
} from "@/components/illustrations/jasmine-bloom-unfurl";

const ref = useRef<JasmineBloomUnfurlHandle | null>(null);
<JasmineBloomUnfurl handleRef={ref} size={140} tone="gold" />
<button onClick={() => ref.current?.replay()}>Again</button>
```

Props: `{ size?: number; tone?; autoplay?: boolean; stagger?: number; duration?: number; handleRef?; className?; ariaLabel? }`.

### `<MarigoldPetalFall>`

Continuous ambient petal-fall. Spawns one petal every ~1.2s (jittered), max 8
active, sine-wave sway, randomised rotation. Lazy via IntersectionObserver —
only runs when the wrapper is in view. **Save-Data or 2G → no spawning.**
**Reduced motion → no spawning.**

```tsx
import { MarigoldPetalFall } from "@/components/illustrations/marigold-petal-fall";

<div className="relative h-[60vh] overflow-hidden">
  <MarigoldPetalFall className="absolute inset-0" tone="gold" />
  {/* page content underneath */}
</div>
```

Props: `{ maxPetals?: number; spawnIntervalMs?: number; tone?; className? }`.

### `<DiyaFlicker>`

Brass diya with a flame that flickers convincingly: per-flame independent
scale jitter via `gsap.utils.random`, rotation ±1.6°, opacity 0.82 → 1.0,
random sub-300ms timing on each cycle. CSS box-shadow halo bloom oscillates
with it. **Reduced motion or Save-Data → static flame.**

```tsx
import { DiyaFlicker } from "@/components/illustrations/diya-flicker";

<DiyaFlicker size={120} tone="brass" />
```

Props: `{ size?: number; tone?; className?; ariaLabel? }`.

### `<MehendiDraw>`

On scroll-into-view: main tendril draws over 2.2s (`power3.inOut`), sub-tendrils
join, then after `ornamentDelay` (default 0.4s) the leaves and florals fade in
along the path. Very deliberate, ceremonial pace. Once.

```tsx
import { MehendiDraw } from "@/components/illustrations/mehendi-draw";

<MehendiDraw height={80} tone="gold" />
```

Props: `{ height?: number; tone?; duration?: number; ornamentDelay?: number; start?: string; className?; ariaLabel? }`.

### `<RegionPinReveal>`

Pin drops from above with a slight overshoot bounce (`back.out(1.6)`), the
inner jasmine then unfurls inside it. Used on `/locations` and on Home H7
(locations served) map markers.

```tsx
import {
  RegionPinReveal,
  type RegionPinRevealHandle,
} from "@/components/illustrations/region-pin-reveal";

<RegionPinReveal size={80} tone="accent" />
{/* For map markers with manual control, pass triggerOnScroll={false} and
    call ref.current.replay() when the parent decides */}
```

Props: `{ size?: number; dropFrom?: number; triggerOnScroll?: boolean; start?: string; handleRef?; tone?; className?; ariaLabel? }`.

### `<BrassDividerSpin>`

Section divider where the brass medallion rotates 360° once on scroll-into-view;
the surrounding hairline draws outward from centre simultaneously. Heavier
counterpart to the Devanagari `border-shirorekha`.

```tsx
import { BrassDividerSpin } from "@/components/illustrations/brass-divider-spin";

<BrassDividerSpin height={40} tone="brass" />
```

Props: `{ height?: number; duration?: number; start?: string; tone?; className?; ariaLabel? }`.

## Recommended placements

| Illustration            | Recommended placement                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `jasmine-bloom-unfurl`  | Inquiry form success state; Day → Night switcher payoff; Home H8/H9 transition flourish.            |
| `marigold-petal-fall`   | 404 page background ambience; Sangeet service hero corner.                                          |
| `diya-flicker`          | Haldi service hero corner ambient; Annaprashan service ambient corner.                              |
| `mehendi-draw`          | Mehendi service hero; Bengali wedding case study chapter transitions.                               |
| `region-pin-reveal`     | `/locations` grid; Home H7 (locations served) map markers.                                          |
| `brass-divider-spin`    | Between major sections on `/about` and case studies.                                                |
| `mandap-mark`           | Favicon-large variant; Wedding service hero; footer brand corner.                                   |
| `shubh-laxmi-coin`      | Pricing-page deposit affordance; Annaprashan / Mundan ceremony eyebrow accent.                      |
| `kalash-flourish`       | Haldi & Gaye Holud heroes (animatable counterpart to the Devanagari `kalash-mark`).                 |

## Performance notes

- **Server vs client.** `<IllustrationBase>` is server-safe. Every other
  component is `"use client"`. Use the base wherever possible.
- **Reduced motion.** Every animated component honours
  `prefers-reduced-motion: reduce` — final state is set immediately with no
  tween.
- **Save-Data / 2G.** Continuous loops (`<MarigoldPetalFall>`, `<DiyaFlicker>`)
  short-circuit to a static state on Save-Data or 2G connections.
- **Concurrency caps.** `<MarigoldPetalFall>` caps active petals at 8 by
  default and auto-pauses when the wrapper leaves the viewport (IO).
- **Once.** Scroll-triggered draws (`<MehendiDraw>`, `<RegionPinReveal>`,
  `<BrassDividerSpin>`, `<IllustrationDraw>`) fire **once** per page load.
- **No paid plugins.** All animations use core GSAP + ScrollTrigger (which the
  project already loads) or pure CSS. No DrawSVG / MorphSVG dependency.
- **Colour cascade.** Every illustration renders in `currentColor`; layers
  with semantic accents (flame, brass) override with `var(--color-gold)` etc.
  Consumers should set hue via Tailwind text utilities on a parent.

## Internal showcase

Visit `/design/illustrations` (dev only — `notFound()` in production) for the
full catalog, every tone, every animated variant with replay buttons, and
copy-paste-ready snippets.

## Accessibility

- Every SVG has `role="img"` and a `<title>` element referenced via
  `aria-labelledby`. Pass `ariaLabel` to override the default.
- Continuous ambient layers (`<MarigoldPetalFall>`) render `aria-hidden="true"`
  on the wrapper — they're decorative, not informational.
- All `pointer-events` on ambient layers are disabled so they never block
  interactive content underneath.
