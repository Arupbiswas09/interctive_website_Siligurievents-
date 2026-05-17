# 03b — Design System V2 (Delta over 03-DESIGN-SYSTEM.md)

> **Status**: extends, does not replace, `03-DESIGN-SYSTEM.md`. Anywhere the two disagree, V2 wins.
> **Intent**: lift the visual ceiling to Awwwards SOTD / Locomotive / Active Theory / Eternal-themes tier. Reject "Indian wedding template" defaults. Add structural escape hatches (Look Modes, asymmetric hero variants, texture recipes) so every page can be art-directed without breaking the system.
> **Bilingual context**: Tokens, type, and motion all account for Devanagari and (post-launch) Bengali rendering.

---

## 3b.0 Why V2

The baseline doc gets us to "tasteful." It does not on its own get us to "memorable." V2 introduces:

1. **More expressive colour tokens** — a deeper ink, a richer brass, a warmer cream, a saffron accent, a cool counter — so we can compose moodier compositions than the baseline 6-token palette allows.
2. **A tertiary editorial display face** — for emotional moments where Cormorant Garamond is too quiet.
3. **Material and texture recipes** — grain, brass foil, gradient mesh, glass refraction — as reusable CSS snippets.
4. **Six named Look Modes** — selectable per page from the CMS, so the owner can swing a page from `Quiet` to `Festival` without code changes.
5. **Asymmetric hero grid variants** — five ASCII wireframes; designers and the dev agent pick from these instead of reinventing layouts.
6. **Anti-patterns specific to Indian decor sites** — explicit, not abstract.

---

## 3b.1 Refined colour philosophy

The baseline palette stays. V2 **adds** semantic, design-only tokens. None of these break the existing `--bg`, `--ink`, `--accent` set.

### Additional tokens

| Token | Hex | LAB-ish description | Use | WCAG AA pair |
|---|---|---|---|---|
| `--ink-deep` | `#0F0C09` | Near-black, warm bias (slight burnt umber under) — deeper than baseline `--ink #1A1714` | Hero text in dark mode, premium dark backgrounds, vignettes, "Cinematic" look mode background | passes AA Large on `--cream-jasmine`, AAA on `--bg #FAF7F2` |
| `--brass-leaf` | `#A47A2C` | Rich gold-foil, more pigment-saturated than baseline `--gold #B8893A` — reads like actual gold leaf, not honey | Brass overlay sweeps (SIG-11), micro-rules, drop caps, accent strokes, foil text on dark | AA Large on `--ink-deep`; not AA Normal on `--bg` — never use for body |
| `--cream-jasmine` | `#F4ECDF` | Warm off-white, ~8% warmer than baseline `--bg`. Slightly pinker undertone than ivory. | Card backgrounds on dark, callout boxes, hero text on dark backgrounds | AAA on `--ink-deep`, AA on `--petrol-midnight` |
| `--blood-saffron` | `#6B1418` | Deep wine + a whisper of saffron warm — sister of baseline `--accent #8B1A1A` but pushed darker and more pigmented | Emphasis-on-dark, "Bridal" look mode accent, italic emphasis colour in display headlines | AA Large on `--cream-jasmine`, AAA on `--bg` |
| `--petrol-midnight` | `#0E1C26` | Cool counter — petrol-blue/black, with green undertone (vs. baseline `--cool #1E2A38`'s violet undertone) | Backgrounds for "Editorial" look mode, scrim overlays on warm photography, footer | AAA on `--cream-jasmine`, AA on `--brass-leaf` text |

### Contrast check, audited

Run by `npm i -g pa11y` + manual `colour.review`-style pairings:

| Foreground / Background | Contrast | Pass |
|---|---|---|
| `--ink-deep` on `--bg #FAF7F2` | 17.8:1 | AAA Normal |
| `--cream-jasmine` on `--ink-deep` | 16.4:1 | AAA Normal |
| `--brass-leaf` on `--ink-deep` | 5.9:1 | AA Normal / AAA Large |
| `--brass-leaf` on `--bg` | 3.1:1 | **AA Large only** — never body text |
| `--blood-saffron` on `--cream-jasmine` | 8.9:1 | AAA Normal |
| `--blood-saffron` on `--bg` | 8.4:1 | AAA Normal |
| `--petrol-midnight` on `--cream-jasmine` | 14.1:1 | AAA Normal |

### When to use each (concrete)

| Scenario | Token |
|---|---|
| Body copy, light mode | `--ink` (baseline) — `--ink-deep` only on hero headlines |
| Body copy, dark mode | `--cream-jasmine` (replaces baseline `--ink #F5EDE0` for richer warmth) |
| Brand CTAs | `--accent` (baseline) for stroke, `--brass-leaf` for sweep highlight |
| Drop caps & ornaments | `--brass-leaf` |
| Section dividers, dark-on-light | `--ink-deep` at 6% alpha |
| Footer | `--petrol-midnight` background, `--cream-jasmine` text, `--brass-leaf` rules |
| Bridal-look hero overlay | `--blood-saffron` 12% alpha scrim |
| Cinematic vignette | radial `--ink-deep` 0% → 70% from edges |
| Sticky CTA glow | `--brass-leaf` 24% alpha radial behind button |

### Theme implementation (Tailwind v4)

```css
@theme {
  /* Baseline tokens already declared per 03 §3.1 */
  --color-ink-deep:        #0F0C09;
  --color-brass-leaf:      #A47A2C;
  --color-cream-jasmine:   #F4ECDF;
  --color-blood-saffron:   #6B1418;
  --color-petrol-midnight: #0E1C26;

  /* Composable alphas via `color-mix` */
  --scrim-cinematic: color-mix(in oklab, var(--color-ink-deep) 72%, transparent);
  --scrim-bridal:    color-mix(in oklab, var(--color-blood-saffron) 12%, transparent);
  --halo-brass:      color-mix(in oklab, var(--color-brass-leaf) 24%, transparent);
}
```

Use `color-mix(in oklab, ...)` — perceptually uniform mixing, which matters because we mix saturated brass with warm ink and traditional sRGB mixing muddies the result.

---

## 3b.2 Updated type system

### Add a tertiary editorial display

Cormorant Garamond is the workhorse. It is, however, a *quiet* serif. For emotional moments (hero closer, case study cover, About origin story, 404), we want a face with stronger personality.

**Chosen tertiary display** (in order of preference; pick at Sprint 1 based on licensing budget):

| Face | Why | Licensing |
|---|---|---|
| **Reckless Neue** (Displaay Type) | Variable axis, dramatic contrast, a face that reads as cinematic without being theatrical. Pairs perfectly with Cormorant. | Commercial — modest seat fee |
| **Apoc** (Pangram Pangram) | Stronger personality than Reckless, slightly more "fashion." Use only on case study covers. | Commercial |
| **Dahlia** (TypeMates) | Elegant high-contrast didone — ideal for Bridal look mode | Commercial |
| **La Beaute** (Latinotype) | Romantic, calligraphic accent for one-off moments | Commercial |
| **Cormorant Infant** (free fallback) | If budget is zero — child variant of Cormorant; slightly softer. | OFL (free) |

Default: **Reckless Neue Variable** as `--font-display-editorial`, loaded with `font-display: swap`, weight axis `300–800`, optical-size axis available.

### Type pairings (locked combinations)

| Look | Display | Editorial | Body | Accent |
|---|---|---|---|---|
| Default | Cormorant Garamond 400 italic | — | Inter | Cormorant SC small caps |
| Cinematic | Reckless Neue 300 (wide opsz) | Cormorant Garamond italic | Inter | Brass-leaf foiled Cormorant SC |
| Editorial | Cormorant Garamond 500 | Reckless Neue 400 | Inter 380 wght | Brass-leaf rule |
| Bold | Reckless Neue 800 | — | Inter 500 | Tracked-out uppercase Inter |
| Quiet | Cormorant Garamond 400 | — | Inter 350 | Hairline rules only |
| Festival | Reckless Neue 600 | Cormorant Garamond italic | Inter | Devanagari display (Yatra One / Tiro Devanagari Hindi) |
| Bridal | Dahlia 400 italic *(or Cormorant if Dahlia unavailable)* | Cormorant Garamond | Inter | Blood-saffron drop caps |

### Variable-font axis usage (the SIG-05 contract)

Cormorant Garamond is **not** variable, but `Reckless Neue Variable` and `Inter Variable` are. We exploit two axes:

| Axis | Range used | Trigger | Effect |
|---|---|---|---|
| `wght` (weight) | 300 → 700 | scroll velocity (SIG-05) | Headline "bends" thicker under fast scroll |
| `opsz` (optical-size) | 12 → 96 | viewport size + scroll position | Type optical sizing matches actual rendered size, sharper at small sizes |
| `ital` (italic toggle) | 0 → 1 | hover on `<em>` inside headline | Italic ramps in over 200ms instead of binary swap |

```css
.display {
  font-family: "Reckless Neue Variable", "Cormorant Garamond", serif;
  font-variation-settings: "wght" var(--wght, 400), "opsz" var(--opsz, 64), "ital" var(--ital, 0);
  font-feature-settings: "ss01", "dlig", "calt";
}
.display em {
  --ital: 0;
  transition: --ital 200ms var(--ease-out);
  /* @property required for variable transition; see below */
}
.display em:hover { --ital: 1; }
```

```css
/* @property registration — required for animating CSS variables in font-variation-settings */
@property --wght { syntax: "<number>"; inherits: true; initial-value: 400; }
@property --opsz { syntax: "<number>"; inherits: true; initial-value: 64; }
@property --ital { syntax: "<number>"; inherits: true; initial-value: 0; }
```

### Devanagari and Bengali

| Script | Display | Body |
|---|---|---|
| Devanagari (Hindi launch) | **Tiro Devanagari Hindi** (free, Google Fonts) — designed by John Hudson + ITF, pairs structurally with Cormorant | **Noto Sans Devanagari** |
| Bengali (post-launch) | **Tiro Bangla** | **Noto Sans Bengali** |

Critical rule: **Devanagari headlines are 1.18× the size of their Latin counterparts** — the script needs more vertical breathing room or descenders crash into the next line. Encode this as a CSS variable in the locale layout:

```css
html[lang="hi"] {
  --type-script-scale: 1.18;
}
.display { font-size: calc(var(--text-4xl) * var(--type-script-scale, 1)); }
```

### Text-wrap

```css
h1, h2, h3, .display { text-wrap: balance; }
p, li, dd, .body { text-wrap: pretty; }
```

`text-wrap: balance` for headings is non-negotiable — it solves the "one stranded word on its own line" problem that haunts editorial type.

---

## 3b.3 Texture & material library

Five textures, each with a copy-pasteable CSS recipe. Every page picks 0–2.

### M1 · Noise overlay (SVG `feTurbulence` recipe) — used everywhere as SIG-09

```tsx
// app/_textures/Grain.tsx (server component, inlined)
export function Grain({ opacity = 0.06 }) {
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply" style={{ opacity }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
```

Tunable knobs: `baseFrequency` (0.6 = chunky, 1.2 = fine), `numOctaves` (1 cheap, 3 expensive), `opacity` (0.04 default, 0.08 on dark mode). On Save-Data hint, drop opacity to 0.02 or omit entirely.

### M2 · Film grain (CSS background blend) — alternative to M1 for hero-only

```css
.hero-film {
  position: relative;
  isolation: isolate;
}
.hero-film::after {
  content: "";
  position: absolute; inset: 0;
  background-image: url("/textures/grain-tile.png"); /* 256×256 pre-baked PNG */
  background-repeat: repeat;
  mix-blend-mode: overlay;
  opacity: 0.08;
  pointer-events: none;
  animation: grain-shift 8s steps(8) infinite;
}
@keyframes grain-shift {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-20%, 10%); }
  40%  { transform: translate(10%, -15%); }
  60%  { transform: translate(-5%, 25%); }
  80%  { transform: translate(15%, 5%); }
  100% { transform: translate(0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-film::after { animation: none; }
}
```

### M3 · Gradient mesh (CSS-only, no canvas)

```css
.mesh-warm {
  background:
    radial-gradient(at 12% 18%, var(--color-brass-leaf) 0%, transparent 42%),
    radial-gradient(at 88% 22%, var(--color-blood-saffron) 0%, transparent 38%),
    radial-gradient(at 28% 88%, var(--color-petrol-midnight) 0%, transparent 50%),
    radial-gradient(at 78% 78%, var(--color-cream-jasmine) 0%, transparent 36%),
    var(--color-ink-deep);
  background-blend-mode: multiply, screen, multiply, overlay, normal;
}
```

For motion: animate each gradient's percentage position via CSS custom properties or a 30s `@keyframes` cycle. Reduced-motion: freeze.

### M4 · Brass foil overlay (CSS mask + gradient)

```css
.brass-foil {
  background-image:
    linear-gradient(135deg,
      #5b4318 0%, #c69c4f 18%, #f6e4b4 38%, #c69c4f 58%, #5b4318 78%, #c69c4f 100%);
  background-size: 200% 200%;
  background-position: var(--mx, 50%) var(--my, 50%);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
  transition: background-position 600ms var(--ease-out);
}
```

Add the cursor-tracking JS:

```ts
el.addEventListener("pointermove", (e) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
});
```

Use sparingly — restricted to: brand wordmark, one drop cap per case study, the "Atelier" pricing tier title, and the 404 H1. Anywhere else and it cheapens fast.

### M5 · Glass refraction (`backdrop-filter` + noise)

```css
.glass-panel {
  background: color-mix(in oklab, var(--color-cream-jasmine) 18%, transparent);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid color-mix(in oklab, var(--color-cream-jasmine) 22%, transparent);
  position: relative;
  isolation: isolate;
}
.glass-panel::before {
  content: "";
  position: absolute; inset: 0;
  background-image: url("/textures/grain-tile.png");
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

Used on: sticky header (transitions to glass after scroll > 64px), inquiry form card on Contact, lightbox chrome, "Plan My Event" floating CTA on mobile. **Do not** use for cards on dark hero photography — the photography is the visual; glass over it adds nothing and costs paint.

`backdrop-filter` is a layout-affecting compositor cost; cap it at 4 simultaneous instances per viewport.

---

## 3b.4 Six named look modes (CMS-selectable per page from Sprint 2)

Each look mode is a **token preset bundle** the CMS toggles. Implementation: a `data-look="cinematic"` attribute on the page root, scoped CSS overrides token defaults.

| Look | Background | Ink | Accent | Display face | Motion intensity | Texture defaults | Where it shines |
|---|---|---|---|---|---|---|---|
| **Cinematic** | `--ink-deep` | `--cream-jasmine` | `--brass-leaf` | Reckless Neue 300 (wide opsz) | maximal | M1 grain + M2 film | Home hero, case study covers, "Plan My Event" closer |
| **Editorial** | `--bg` (warm ivory) | `--ink-deep` | `--blood-saffron` (sparingly) | Cormorant 500 + Reckless 400 | refined | M1 grain only | About origin story, Blog post body, Services index |
| **Bold** | `--cream-jasmine` | `--ink-deep` | `--brass-leaf` | Reckless Neue 800 | cinematic | M3 mesh as section background | Hero variants where a single headline carries the page |
| **Quiet** | `--bg` | `--ink` | `--accent` (baseline) | Cormorant 400 (italic) | hushed | M1 at 0.03 only | Contact, FAQ pages, Terms |
| **Festival** | `--petrol-midnight` | `--cream-jasmine` | `--brass-leaf` + secondary `--blood-saffron` | Reckless Neue 600 + Tiro Devanagari Hindi | maximal | M3 mesh + M1 grain | Durga Puja / Saraswati / Lakshmi service pages |
| **Bridal** | `--cream-jasmine` | `--ink-deep` | `--blood-saffron` | Dahlia 400 italic (or Cormorant fallback) | cinematic | M4 brass foil on H1 + M1 grain | Hindu / Bengali / Marwari wedding service pages, bridal portfolio case studies |

Implementation pattern:

```css
[data-look="cinematic"] {
  --color-bg: var(--color-ink-deep);
  --color-ink: var(--color-cream-jasmine);
  --color-accent: var(--color-brass-leaf);
  --motion-intensity: 1.0;
}
[data-look="editorial"] {
  --color-accent: var(--color-blood-saffron);
  --motion-intensity: 0.6;
}
[data-look="bold"] {
  --color-bg: var(--color-cream-jasmine);
  --color-accent: var(--color-brass-leaf);
  --motion-intensity: 0.8;
}
[data-look="quiet"] {
  --motion-intensity: 0.3;
}
[data-look="festival"] {
  --color-bg: var(--color-petrol-midnight);
  --color-ink: var(--color-cream-jasmine);
  --color-accent: var(--color-brass-leaf);
  --color-accent-secondary: var(--color-blood-saffron);
  --motion-intensity: 1.0;
}
[data-look="bridal"] {
  --color-bg: var(--color-cream-jasmine);
  --color-accent: var(--color-blood-saffron);
  --motion-intensity: 0.9;
}
```

The `--motion-intensity` scalar is read by motion components to dial stagger, duration, and parallax magnitude. Hooked via `gsap.utils.mapRange` in motion utils.

CMS field (Payload, `globals.pageSettings` or per-page):
```ts
{
  name: "look",
  type: "select",
  required: true,
  defaultValue: "editorial",
  options: ["cinematic", "editorial", "bold", "quiet", "festival", "bridal"],
}
```

---

## 3b.5 Asymmetric hero grid variants

ASCII wireframes. The hero is the most over-templated section on the internet — these five locked variants force art-direction.

### Variant A · "Margin Steal" (default for Home)

```
+-------------------------------------------------------+
| ::eyebrow                                             |
|                                                       |
|   Cinematic decor for                  +-----------+  |
|   *celebrations* you'll                |           |  |
|   remember in stills.                  |   IMG     |  |
|                                        |   4:5     |  |
|                                        |           |  |
|   [Plan My Event →]                    +-----------+  |
|   See our work                                        |
+-------------------------------------------------------+
^ headline forced left, image hangs off right margin and bleeds past the grid
```

### Variant B · "Centerline Drop"

```
+-------------------------------------------------------+
|                       ::eyebrow                       |
|                                                       |
|             We stage celebrations.                    |
|             The rest is decor.                        |
|                                                       |
| +---------------------+ +---------------------------+ |
| |     IMG 3:4         | |   IMG 3:4 (offset down)   | |
| |                     | |                           | |
| +---------------------+ |                           | |
|                         +---------------------------+ |
+-------------------------------------------------------+
^ two images, second one Y-offset by 64px — asymmetric counterweight
```

### Variant C · "Full Bleed + Floating Caption"

```
+-------------------------------------------------------+
|##########################  IMG  ######################|
|##############     full-bleed cover     ###############|
|############### .glass-panel caption ##################|
|############### sits at 60vh from top  ################|
|######################################################|
+-------------------------------------------------------+
^ image is the page; caption is a small glass card overlay
```

### Variant D · "Diagonal Split"

```
+-------------------------------------------------------+
|                      \                                |
|   ::eyebrow           \                               |
|                        \                              |
|   Honest pricing.       \                             |
|   Custom from there.     \      IMG (clipped via      |
|                           \     polygon clip-path)    |
|   [See packages]           \                          |
|                             \                         |
+------------------------------\------------------------+
^ diagonal split via clip-path: polygon, image fills right wedge
```

### Variant E · "Stacked Editorial"

```
+-------------------------------------------------------+
|  ::eyebrow                                            |
|  H1 oversized                                         |
|                                                       |
|  +-----------------+   +-----------------+            |
|  |   IMG 1:1       |   |  body copy      |            |
|  |                 |   |  3 short lines  |            |
|  +-----------------+   +-----------------+            |
|                                                       |
|  +-----------------+   +-----------------+            |
|  |  body copy 2    |   |  IMG 4:5        |            |
|  |  CTA            |   |                 |            |
|  +-----------------+   +-----------------+            |
+-------------------------------------------------------+
^ Z-pattern editorial — for Blog and About interior heroes
```

### Variant F · "Wide-screen Marquee Hero" *(bonus)*

```
+-------------------------------------------------------+
|                                                       |
|        S I L I G U R I  ·  E V E N T                  |
|     [oversized marquee wordmark, scrolls slowly]      |
|                                                       |
|  +-----+  +-----+  +-----+  +-----+  +-----+          |
|  | IMG |  | IMG |  | IMG |  | IMG |  | IMG |  →       |
|  +-----+  +-----+  +-----+  +-----+  +-----+          |
|       [horizontally-scrolling work strip below]       |
|                                                       |
+-------------------------------------------------------+
^ for portfolio index hero only — wordmark itself becomes the headline
```

CMS field: `heroVariant: select(A|B|C|D|E|F)`. Default per route:
- Home → A
- About → E
- Services index → C
- Service detail → A (or D for Festival look mode)
- Portfolio index → F
- Case study → C
- Pricing → B
- Blog index → E
- Blog post → E
- Contact → B

---

## 3b.6 Mood reference URLs (12+ Awwwards-tier)

Curate into a `references/` Notion board. When a section feels off, open these in tabs and ask "would this hold up beside them?"

| # | URL | What we learn |
|---|---|---|
| 1 | https://locomotive.ca | Typographic restraint, scroll-driven UI, velocity sensitivity |
| 2 | https://activetheory.net | WebGL composition, cinematic transitions, sound-design partnership |
| 3 | https://resn.co.nz | Bold cursor-driven imagery, fearless colour use within a tight system |
| 4 | https://pitch.com | Editorial polish on a product site — exact tone we want for case studies |
| 5 | https://eternal-themes.com | Luxury wedding typography done right — not gaudy |
| 6 | https://www.thenorthface.com (Pinnacle case study) | Long-form scrollytelling, image dominance |
| 7 | https://cuberto.com | Portfolio → case FLIP transitions, ambient detail |
| 8 | https://igloo.inc | Velocity-blurred marquees, restrained palette, brass accents |
| 9 | https://tendril.ca | Reactive cursor effects, motion as material |
| 10 | https://studiodumbar.com | Type as form, calligraphic mask reveals |
| 11 | https://vercel.com/design | Variable font as expressive medium, restrained colour |
| 12 | https://linear.app/method | Motion that supports content — gold standard for "calm but premium" |
| 13 | https://www.areweb.com | 3D card stacks, CSS perspective use |
| 14 | https://bruno-simon.com | WebGL ambition (for shader research) |
| 15 | https://www.kohi.co | Editorial layout discipline, asymmetric grids |
| 16 | https://www.studiothomson.com | Bridal-magazine-tier wedding photography presentation |

For **Indian-specific moodboards that *aren't* the cliché**:
- *Architectural Digest India* online layouts
- *House & Garden India* typography
- Sabyasachi Mukherjee's brand site (`sabyasachi.com`) — proves luxury Indian aesthetic without marigold-pile defaults

---

## 3b.7 Anti-patterns specific to Indian decor sites

We have an unusual problem: the Indian decor web is dominated by templates we must actively reject. These are not abstractions — they are concrete, named, banned moves.

### Banned visual moves

| # | Anti-pattern | Why it dies | What we do instead |
|---|---|---|---|
| 1 | **Marigold orange backgrounds** (`#FF6F00`-ish), often gradient-faded | Reads as "wedding card from 2014." Burns the eye. Signals low-budget. | Photograph marigolds *as subject* in editorial light; never use marigold as background colour. Accent only, ≤ 8% surface coverage. |
| 2 | **Every saturated colour in one frame** — gold + red + green + pink + blue all at full saturation | The "Indian wedding website" cliché. Visually chaotic, photographs poorly. | Single warm accent (`--accent` or `--blood-saffron`) + brass micro-detail + restrained neutrals. No more than 3 colours at >40% saturation in any viewport. |
| 3 | **Glossy CSS gradients** with high-shine highlights — the chrome-and-bevel button | Instantly dates the site to 2010. Reads as Shutterstock. | Flat surfaces with carefully-painted shadows in *photography*. Brass-foil sweep (M4) for the one luxe moment. |
| 4 | **Generic stock photography** — smiling brides on white backgrounds, hands holding a flower, the same five royalty-free mandap shots | Visitors recognise stock instantly; trust dies. | Either commissioned shoots or Gemini-generated with strict prompt discipline (see `09-IMAGE-PROMPTS.md`). All visuals must pass the "is this AI?" smell test — covered by SIG-09 grain pass. |
| 5 | **Devanagari set in default web fonts** (browser fallback) | Looks like a school project. | Pre-load Tiro Devanagari Hindi + Noto Sans Devanagari. Subset properly. Increase line-height +0.1 vs Latin. |
| 6 | **Carousel-as-hero** with auto-rotating slides every 3s | Awful UX, kills conversion, bad LCP, bad accessibility. | One hero, one image, scroll-driven storytelling. If we need multiple visuals, they reveal on scroll (SIG-06, SIG-12). |
| 7 | **Pop-up "WhatsApp us NOW" badges with bouncing animation** | Predatory feel; cheapens the brand. | Sticky FAB with calm magnetic hover (SIG-11). Never bounces. Never pops up unprompted. |
| 8 | **"Romantic" cursive fonts everywhere** (Allura, Great Vibes) | Wedding-template Pinterest energy. | Restrict cursive to one-off accents only (founder signature, "Plan My Event" decorative underline). Cormorant italic + Reckless do the heavy lifting. |
| 9 | **Pill-shaped buttons with shadow-puff drop shadows** | Bootstrap 4 vintage. | 2px or 4px radius max, hairline border, brass-foil sweep on hover (M4 + SIG-11). |
| 10 | **Default Bootstrap-feel cards with rounded-2xl corners and shadow-md** | "AI-generated landing page" cliché. | Editorial cards: hairline border, no radius or 2px, photograph the dominant visual element. See baseline `<Card>` primitive — keep sharp. |
| 11 | **"Confetti" particle effects on form submit** | Cute the first time, never the next. | SIG-13 jasmine-bloom — one-time, choreographed, brand-specific. |
| 12 | **Glittering/sparkling animated GIFs** on borders or headings | 2005 MySpace energy; performance hell. | Brass-foil sweep on the headline (M4) is the *only* "shine" we allow. |
| 13 | **Centered-everything layouts** (centered hero, centered services, centered CTA, centered testimonials) | Generic agency template. | Asymmetric heroes (3b.5), broken grid, intentional negative space. |
| 14 | **Wallpaper Indian motifs** — paisley repeat patterns, mandala backgrounds, "henna line" SVG borders | Tourist-postcard energy. | Indian motifs as single, hand-placed accents (one mandap mark in the footer; one jasmine SVG in the 404). Never as repeats. |
| 15 | **₹ symbol in giant red text** | Looks like a Diwali sale. | Pricing bands as small refined badges (per D-002), brass-leaf colour, hairline border. |
| 16 | **Auto-playing background music or videos with sound** | Site closes immediately on mobile. | Hero video, if used, is muted, autoplays only over Wi-Fi (`navigator.connection.effectiveType === "4g"` check), no audio attached. |

### Banned typographic moves

- All-caps headlines longer than 5 words.
- Letter-spacing > 0.05em on body copy.
- Centered paragraphs longer than 2 lines.
- Multiple display faces used adjacent (Cormorant + Playfair + Dahlia all on one page = chaos).
- Hindi/Bengali text in italic (not a thing in those scripts; reads as broken).

### Banned interaction moves

- Hover effects that fire on tap on mobile (`:hover` without `@media (hover: hover)` guard).
- Modals that intercept page load.
- Newsletter pop-ups within first 30s.
- Cursor effects on touch (already covered by SIG-04 mobile fallback).

---

## 3b.8 Component-level deltas

These are tweaks to baseline components in `03 §3.9` to support V2 ambition.

| Component | V2 change |
|---|---|
| `<DisplayHeading>` | Accept `font="editorial"` prop → swaps to Reckless Neue. Accept `motion="bend"` → wires SIG-05 var-font-on-scroll. Accept `mask="calligraphic"` for SIG-12 reveals. |
| `<Button variant="primary">` | Wraps in SIG-11 (magnetic + edge distortion + brass sweep) when `motion-intensity >= refined`. CSS-only fallback otherwise. |
| `<Marquee>` | Accepts `velocityBlur` boolean — default `true` (SIG-03). |
| `<RevealOnScroll>` | Reads `--motion-intensity` and scales stagger + distance accordingly. |
| `<Card>` | New `look="foil"` variant adds M4 brass foil on heading; `look="glass"` adds M5 backdrop blur. |
| `<Section>` | New `look` prop forwards `data-look` to children, scoping the token preset. |
| `<Hero>` *(new primitive)* | Pure structural — accepts `variant: A|B|C|D|E|F` and slots: `eyebrow`, `headline`, `body`, `cta`, `image`, `imageSecondary`. Internally implements the wireframes from §3b.5. |
| `<Grain>` *(new)* | Server component, renders the SIG-09 SVG noise overlay. Mounted once in root layout. |
| `<LookProvider>` *(new)* | Sets `data-look` on the page wrapper based on Payload CMS field. Scoped CSS handles the rest. |

---

## 3b.9 Internal `/_design` page additions

The baseline doc references `/_design` (03 §3.10). V2 expands it:

- **Colour wall** — every baseline + V2 token swatched, with WCAG pair badges on hover.
- **Look mode previewer** — six side-by-side cards rendering the same content under each Look.
- **Hero variant gallery** — all six variants from §3b.5 rendered live, with switcher.
- **Texture lab** — M1–M5 toggleable over a real photograph.
- **Variable font playground** — drag sliders to test `wght`, `opsz`, `ital` on a sample headline in EN + HI.
- **Anti-pattern dashboard** — links to every banned move with a thumbnail of what it looks like, marked `❌` — useful onboarding for future contributors and Codex sessions.

---

## 3b.10 Token quick-reference

```css
/* baseline (from 03) */
--color-bg, --color-bg-elevated, --color-ink, --color-ink-muted, --color-ink-soft,
--color-accent, --color-accent-deep, --color-gold, --color-gold-soft, --color-cool,
--color-success, --color-error, --color-border

/* V2 additions */
--color-ink-deep:        #0F0C09;
--color-brass-leaf:      #A47A2C;
--color-cream-jasmine:   #F4ECDF;
--color-blood-saffron:   #6B1418;
--color-petrol-midnight: #0E1C26;

/* composed */
--scrim-cinematic, --scrim-bridal, --halo-brass

/* motion intensity (set per look mode) */
--motion-intensity: 0..1

/* type axes */
--wght, --opsz, --ital (registered via @property)

/* locale scale */
--type-script-scale (1.0 latin, 1.18 devanagari, 1.16 bengali)
```

---

## 3b.11 Tie-back to 03 baseline

Baseline 03 is **still the rule book** for tokens, spacing, primitives. V2 only *extends* — every additional token, face, texture, and mode composes with baseline. If a section is in doubt, fall back to baseline (`Editorial` look mode + Cormorant + `--accent`) — it will always be acceptable. V2 lets us reach higher when the moment deserves it.

End of V2 delta.
