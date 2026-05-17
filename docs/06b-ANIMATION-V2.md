# 06b — Animation Strategy V2 (Delta over 06-ANIMATION-STRATEGY.md)

> **Status**: extends, does not replace, `06-ANIMATION-STRATEGY.md`. Anywhere the two disagree, V2 wins.
> **Ambition**: Active Theory / Resn / Locomotive Studio / Pitch tier. Awwwards SOTD-grade. Every signature moment must be discoverable in a 5-second scrub video.
> **Bilingual context**: EN + HI at launch (per D-003). Devanagari treatment is a first-class concern, not an afterthought.

---

## 6b.0 Why V2

The baseline doc (06) gets us to "nicely animated." This delta gets us to **memorable**. The owner has explicitly asked for extraordinary — so we lift the ceiling on technique (WebGL, SVG filter physics, FLIP transitions, variable-font scroll-axis), keep the floor on performance (Pixel 4a 4G stays at ≥92 Lighthouse mobile), and add **named signature moments** that map 1:1 to specific page sections in `05-PAGE-SPECS.md`.

V2 also introduces a **`motion-intensity` token** (`hushed | refined | cinematic | maximal`) that hooks into the "Look Modes" defined in `03b-DESIGN-V2.md §3b.4`. Each page can dial intensity from CMS, so the owner can quiet a section that feels too loud without code changes.

---

## 6b.1 Tech additions to the stack (no version guesses — read docs at install time)

| Library | Purpose | Lazy/eager | Bundle target |
|---|---|---|---|
| `@react-three/fiber` (R3F) + `@react-three/drei` | WebGL hero distortion, signature moments only | Lazy via `next/dynamic({ ssr: false })` | ≤ 80 KB gz per route that uses it |
| `three` (peer of R3F) | Underlying engine | Lazy | shared chunk |
| `ogl` (alternative to R3F where we want raw control) | Cursor-distortion image hover, blob mesh | Lazy | ≤ 25 KB gz |
| `gsap` core + `ScrollTrigger` + `Observer` + `SplitText` + `MorphSVGPlugin` + `DrawSVGPlugin` + `MotionPathPlugin` + `CustomEase` + `Flip` | Everything scroll-tied and SVG morph | Eager (one chunk) | ≤ 60 KB gz incl. plugins (tree-shake unused) |
| `lenis` | Smooth scroll | Eager | ~6 KB gz |
| `lottie-web` (or `@lottiefiles/dotlottie-web`) | Single jasmine-bloom moment on success/404 | Lazy | only on that route |
| `motion` (Framer Motion v11+) | Layout/`layoutId`, FLIP for portfolio → case study | Eager | already in baseline |
| `splitting` (fallback to GSAP SplitText) | Variable-font weight per-letter on scroll | Either | optional |
| `colorthief` or `fast-average-color` | Extract dominant colour from active card for ambient tint | Lazy | only on case study |
| Native `View Transitions API` | Cross-document and same-document transitions where supported | Native | 0 KB |
| Native `feTurbulence` + `feDisplacementMap` | SVG noise & morphs (no canvas needed) | Native | 0 KB |
| Native `backdrop-filter`, `mask-image`, `clip-path` | Glass, masks, reveals | Native | 0 KB |

**Plugin registration** lives in `lib/gsap/register.ts` and is imported once on the client root. Never call `registerPlugin` inside a component effect — it duplicates instances.

```ts
// lib/gsap/register.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText"; // licensed via GSAP Club
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Observer, SplitText, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin, CustomEase, Flip);

// Brand eases — reuse, do not invent new ones per component.
CustomEase.create("brass", "M0,0 C0.16,0.84 0.22,1 1,1");          // pulled-from-back, settles
CustomEase.create("ink",   "M0,0 C0.65,0.05 0.36,1 1,1");          // expressive, gentle
CustomEase.create("petal", "M0,0 C0.2,0.9 0.1,1 0.4,1 0.7,1 1,1 1,1"); // organic drop
```

---

## 6b.2 Performance guardrails specific to WebGL/canvas/heavy motion

These are **hard ceilings**. CI will Lighthouse on every PR and block merges that breach them.

| Metric | Budget | Measured on |
|---|---|---|
| JS scripting time on Pixel 4a 4G, route load | ≤ 350ms total | Lighthouse mobile |
| Per-effect scripting on scroll | ≤ 6ms/frame | Chrome Performance, 4× CPU throttle |
| Initial JS for any route that uses WebGL | ≤ 180 KB gz, with R3F lazy-chunked separately | `next build` output |
| Layout / paint per scroll frame | 0 layout, 0 paint (transforms + opacity only) | Performance panel |
| FPS floor on signature moments (mid-tier Android) | 50 fps | manual on a real Redmi 12 / Pixel 6a |
| Heap growth over 60s of idle scroll | < 5 MB | DevTools memory |

### Disable conditions (auto, no opt-in)

Lazy-mounted WebGL / canvas moments **must self-disable** if any of these are true:

1. `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
2. `navigator.connection?.saveData === true`
3. `navigator.connection?.effectiveType` is `"2g"` or `"slow-2g"`
4. `navigator.deviceMemory && navigator.deviceMemory < 4`
5. `navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4`
6. WebGL context creation returns `null` (paranoid fallback)
7. The element is not in viewport (Intersection Observer gate before mounting)
8. The tab is hidden (`document.visibilityState !== "visible"` → pause `raf`)

Helper:

```ts
// lib/motion/should-animate.ts
export function shouldRunHeavyMotion(): "full" | "lite" | "none" {
  if (typeof window === "undefined") return "none";
  const m = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (m.matches) return "none";
  const c = (navigator as any).connection;
  if (c?.saveData) return "lite";
  if (["2g", "slow-2g"].includes(c?.effectiveType)) return "lite";
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) return "lite";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return "lite";
  return "full";
}
```

`"lite"` means: render the **fallback** (static image, CSS-only reveal, no shader). `"none"` means: render final state, no motion at all.

### Mobile-specific carve-outs

- WebGL hero (SIG-01) → **disabled below 768px**; replaced by an animated SVG noise+gradient still.
- Cursor distortion (SIG-04) → **disabled on `(pointer: coarse)`**.
- Pinned horizontal showcase (SIG-06) → **collapses to vertical stack of cards** with snap scroll on mobile.
- 3D card stack (SIG-07) → **flattens to a 2D stack with rotateZ flicker** on mobile (no perspective).
- FLIP cover transition (SIG-08) → **falls back to View Transitions API** (already supported in Chromium mobile; Safari static fade).

---

## 6b.3 Twelve signature moments

Each moment is a **named, planned thing**. We allocate them per page in §6b.4. Format below:
ID · Name · Section · What it does · Why signature · Tech · Perf budget · Reduced-motion fallback · Mobile.

---

### SIG-01 · "Tilaka" — WebGL fluid-mesh hero distortion
- **Where**: Home `H1` hero behind the headline (also reusable on Service detail hero when `motion-intensity = cinematic`).
- **What**: Mid-fidelity full-screen WebGL plane carrying the hero image. Vertex shader applies a low-frequency simplex-noise displacement; fragment shader adds a chromatic-aberration shimmer plus a brass-foil gradient that drifts based on mouse position. Cursor acts as a soft attractor (pulls the mesh ~6px toward it). On scroll, a uniform `uScroll` tilts the displacement so the image "settles deeper" as you scroll into the page.
- **Why signature**: This is the first frame visitors see. Static images read AI-generated; subtle, alive distortion reads "studio-built". The brass shimmer encodes the brand without painting marigolds.
- **Tech**: R3F + drei `<Image>` shader override OR raw `ogl` (lighter). Custom GLSL: ~120 lines. Mouse via `useFrame` + `event.point`. Scroll via `ScrollTrigger.scrollerProxy` reading Lenis position into a uniform.
- **Perf budget**: ≤ 12ms scripting on first paint (loaded behind a paint-blocking `Suspense` with the still-image fallback shown first via blurDataURL). Steady-state ≤ 4ms/frame.
- **Reduced-motion fallback**: Static hero image with a CSS `radial-gradient` brass-foil overlay (defined in 03b §3b.3). Zero JS.
- **Mobile**: Replaced entirely below 768px by an animated SVG `feTurbulence` overlay over the same still (see SIG-09 — same recipe). No WebGL on phones.
- **Awwwards ref**: [active-theory.com](https://activetheory.net/), [resn.co.nz](https://resn.co.nz), [www.locomotive.ca](https://locomotive.ca).

```glsl
// fragment, condensed
uniform float uTime; uniform float uScroll; uniform vec2 uMouse;
void main() {
  vec2 uv = vUv;
  float n = snoise(vec3(uv * 2.0, uTime * 0.08));
  uv += n * 0.012 + (uMouse - 0.5) * 0.006;
  vec3 col = texture(uMap, uv).rgb;
  col += vec3(0.95, 0.78, 0.45) * 0.04 * n; // brass shimmer
  col *= 1.0 - uScroll * 0.18;              // settle deeper on scroll
  gl_FragColor = vec4(col, 1.0);
}
```

---

### SIG-02 · "Sindoor" — SVG turbulence morph on section transitions
- **Where**: Between Home H2 (capability marquee) → H3 (editorial intro), and between every chapter in case studies.
- **What**: A full-width SVG band uses `feTurbulence` + `feDisplacementMap` with `baseFrequency` and `scale` tweened by GSAP as the section scrolls into view. Result: the divider visibly "melts" between sections like ink bleeding into rice paper.
- **Why signature**: Section transitions on luxury sites are usually a hairline. Ours becomes a tactile moment without adding any raster textures.
- **Tech**: Inline `<svg>` with `<filter>` containing `<feTurbulence baseFrequency="..."/>` and `<feDisplacementMap scale="..."/>`. GSAP tweens the `baseFrequency` (yes, it's animatable as a string attribute) and `scale` along ScrollTrigger progress 0→1.
- **Perf budget**: ≤ 2ms/frame; filter is composited.
- **Reduced-motion fallback**: Static hairline divider at final state.
- **Mobile**: Same effect, lower `numOctaves` (1 instead of 2) for fill cost.

```tsx
// pattern
<svg width="100%" height="64" aria-hidden>
  <filter id="bleed">
    <feTurbulence baseFrequency="0.02 0.6" numOctaves="2" seed="3" />
    <feDisplacementMap in="SourceGraphic" scale="0" />
  </filter>
  <rect width="100%" height="64" fill="var(--ink-deep)" filter="url(#bleed)" />
</svg>
```
GSAP: `gsap.to("#bleed feDisplacementMap", { attr: { scale: 24 }, scrollTrigger: { trigger, scrub: true }})`.

---

### SIG-03 · "Velocity Bend" — marquee with reactive blur on scroll velocity
- **Where**: Home H2 capability marquee; Testimonials marquee (H6).
- **What**: Continuous marquee. As the user scrolls (any direction), GSAP reads `ScrollTrigger.normalizedScroll` velocity and pipes it into a CSS `filter: blur()` + `transform: skewX()` on the marquee. Faster scroll = more motion blur + more horizontal skew. When scroll stops, both decay to 0 over ~600ms via `gsap.quickTo`.
- **Why signature**: Marquees are everywhere — but a marquee that *feels* the user's scroll velocity makes the rest of the site feel responsive even where nothing else is animating. Same trick used on Locomotive's own site.
- **Tech**: GSAP Observer for velocity, `gsap.quickTo` for buttery output. `filter: blur()` capped at 4px; `skewX` capped at 6deg.
- **Perf budget**: ≤ 1ms/frame.
- **Reduced-motion fallback**: Static marquee, no blur/skew, infinite-loop disabled (single static row of pills).
- **Mobile**: Active. Velocity readings from touch scroll are reliable.
- **Awwwards ref**: [locomotive.ca](https://locomotive.ca), [pitch.com](https://pitch.com), [igloo.inc](https://igloo.inc).

---

### SIG-04 · "Drishti" — cursor-distortion image hover
- **Where**: Portfolio index tiles (5.5), Signature work strip (5.1 H4) on desktop.
- **What**: On `pointerenter` over a project tile, the image swaps from a static `<img>` to an `ogl` plane that applies a radial RGB-split + barrel-distortion lens that follows the cursor. On leave, easing-decays back to identity over 700ms then unmounts the WebGL context.
- **Why signature**: A normal hover is "scale 1.04". A cursor-glass hover makes browsing the work feel like flipping a portfolio. Recognisable Active-Theory move.
- **Tech**: `ogl` with one shared renderer instance reused across tiles (created on `pointermove` over the grid, destroyed on `pointerleave` from grid). Single-pass fragment shader: `texture(uv + (uMouse - uv) * uStrength)` with chromatic offset per channel.
- **Perf budget**: ≤ 6ms/frame while active; 0 cost when no hover.
- **Reduced-motion fallback**: Standard CSS `scale(1.03)` + `filter: brightness(1.05)` on hover.
- **Mobile**: Disabled (`(pointer: coarse)`); tap → navigate.
- **Awwwards ref**: [activetheory.net/work](https://activetheory.net), [tendril.ca](https://tendril.ca).

---

### SIG-05 · "Bhaar" — scroll-velocity-driven variable-font weight shift
- **Where**: Editorial pull quote on Home H3, all H2s on case studies, "Big-type CTA closer" (H9).
- **What**: Headlines use a variable display font (Cormorant Garamond variable axis or `Reckless Neue` variable per 03b). On scroll, GSAP reads velocity and tweens `font-variation-settings` weight 300 ↔ 700 (capped) and optical-size 12 ↔ 96 axes. The result: type physically "compresses" under your scroll input and "blooms" when you stop.
- **Why signature**: Variable-axis-on-scroll is rarely done well; when it is (Pitch, Vercel's design site, Linear's marketing) it's instantly recognisable as craft.
- **Tech**: GSAP `quickSetter("h", "css", ... )` or directly tween `font-variation-settings: 'wght' var, 'opsz' var`. Throttle to `requestAnimationFrame`.
- **Perf budget**: ≤ 1ms/frame; no layout — `font-variation-settings` repaints text only.
- **Reduced-motion fallback**: Final font-variation-settings frozen at the "settled" state (e.g., `'wght' 400, 'opsz' 60`).
- **Mobile**: Active. Headlines are smaller, so the swing is reduced (max wght 600).

```css
.headline {
  font-family: "Cormorant Garamond", "Reckless Neue Variable", serif;
  font-variation-settings: "wght" var(--wght, 400), "opsz" var(--opsz, 48);
  will-change: font-variation-settings;
}
```
```ts
const setWght = gsap.quickSetter(el, "css", "--wght");
ScrollTrigger.create({
  onUpdate: (self) => setWght(gsap.utils.clamp(300, 700, 400 + Math.abs(self.getVelocity()) * 0.0008)),
});
```

---

### SIG-06 · "Saat Paak" — pinned horizontal showcase with chromatic-mask reveal
- **Where**: Home H4 signature work strip.
- **What**: ScrollTrigger pins the section; vertical scroll scrubs horizontal translate of a 5-card row. Each card, as it enters the centre band, reveals its image through an SVG-path mask that draws diagonally (DrawSVGPlugin). Active card lifts +8px and applies a backdrop-tinted ambient glow whose colour is sampled from the image via ColorThief.
- **Why signature**: The combination — pin + horizontal scrub + per-card mask draw + image-derived ambient — is more than any one of those tricks alone. The ambient tint subliminally previews the brand-colour of each project before the user clicks.
- **Tech**: GSAP ScrollTrigger `pin: true`, `scrub: 0.8`. Mask via `<clipPath>` + `DrawSVGPlugin`. ColorThief on image load → CSS variable on the card's `::before`.
- **Perf budget**: ≤ 5ms/frame during the pin.
- **Reduced-motion fallback**: Vertical stack, no pin, no draw — images appear at final state.
- **Mobile**: **Collapses** to vertical snap-scroll stack (`scroll-snap-type: y mandatory`) with the same mask-reveal applied per card on enter — keeps the moment without the pin.
- **Awwwards ref**: [pitch.com](https://pitch.com), [eternal-themes.com](https://eternal-themes.com), [northface.com/pinnacle](https://www.thenorthface.com).

---

### SIG-07 · "Tash" — scroll-tied 3D card stack
- **Where**: Pricing (5.7) packages section; alt use on About philosophy steps (Discover · Design · Stage · Document).
- **What**: A stack of 3 cards rendered with CSS `transform-style: preserve-3d` and `perspective`. As the user scrolls, the front card drifts up + back (Z translate + Y translate + rotateX), and the next card animates from behind into the front position. Brass-leaf shadow extrudes underneath each card.
- **Why signature**: Pricing is usually flat tiles. A pure CSS 3D stack with motion choreography reads "designed", not "templated."
- **Tech**: No JS for the actual transforms — pure CSS keyframes scrubbed by `ScrollTrigger.create({ scrub: true })` setting CSS custom properties (`--progress`). Cards use `transform: translate3d(0, calc(var(--progress) * -120px), calc(var(--progress) * 80px)) rotateX(calc(var(--progress) * 18deg))`.
- **Perf budget**: ≤ 2ms/frame (compositor-only).
- **Reduced-motion fallback**: All three cards visible side-by-side in a 2D grid; no scroll-tie.
- **Mobile**: 3D collapses to 2D vertical list (perspective hurts on small viewports + reads "buggy"). The choreography becomes a sequential opacity-staircase reveal on scroll.

---

### SIG-08 · "Phera" — FLIP layout transition portfolio → case study
- **Where**: Portfolio index tile → case study cover (5.5 → 5.6).
- **What**: User clicks a portfolio tile. The tile's image is `Flip.getState()`'d, the route changes (App Router transition), and on the new route's mount, `Flip.from(state, { absolute: true, duration: 0.9, ease: "brass" })` morphs the tile from grid-position into the full-bleed case study cover. Surrounding chrome (header, captions) crossfades. Total feels seamless — the image is the constant.
- **Why signature**: This is the difference between "a portfolio site" and "a portfolio experience." Universally cited as best-in-class (Locomotive, Active Theory, Cuberto).
- **Tech**: GSAP `Flip` plugin + App Router's `router.push()`. Use `unstable_ViewTransition` (Next 16) as the primary mechanism on supporting browsers; FLIP runs underneath as the canonical fallback. Shared `view-transition-name: project-{slug}` on both endpoints.
- **Perf budget**: ≤ 16ms per frame for the duration of the morph; intentional moment, not steady-state.
- **Reduced-motion fallback**: Native View Transition crossfade (browser native), 150ms.
- **Mobile**: **Active.** Touch-tap → FLIP. View Transitions API has good Chromium-Android support.
- **Awwwards ref**: [locomotive.ca](https://locomotive.ca), [cuberto.com](https://cuberto.com), [bruno-simon.com](https://bruno-simon.com) (portfolio).

```ts
// onTileClick
const state = Flip.getState(".tile-img", { props: "borderRadius,filter" });
document.startViewTransition?.(() => router.push(`/portfolio/${slug}`)) ?? router.push(`/portfolio/${slug}`);
// On case study mount:
Flip.from(state, { absolute: true, duration: 0.9, ease: "brass", scale: true });
```

---

### SIG-09 · "Reza" — generative SVG noise over hero stills
- **Where**: All hero stills (Home, About, Services, Case study cover, Pricing, Contact, Blog post, Locations, 404). Acts as the visual base layer regardless of intensity setting.
- **What**: A 100%-wide `<svg>` overlay with `feTurbulence baseFrequency="0.9" numOctaves="2"` + `feColorMatrix` (low alpha) blended `multiply` at 4–6% opacity. Tiny GSAP-driven `seed` jitter (1 frame per 2s) so it never looks frozen.
- **Why signature**: Solves the "AI-generated image" problem. Real film grain on every visual baseline. Free.
- **Tech**: Inline SVG generated server-side (no client-side cost beyond paint). Optional `requestAnimationFrame` to bump `seed` once every 2s if `motion-intensity >= refined`.
- **Perf budget**: ≤ 0.3ms/frame.
- **Reduced-motion fallback**: Static (no seed jitter).
- **Mobile**: Active everywhere.

---

### SIG-10 · "Bhasha" — Devanagari letter-by-letter scramble during EN ↔ HI toggle
- **Where**: Header language switcher applies this to **the headline of whatever page you're on** when the user toggles `EN ⇄ हि`.
- **What**: GSAP SplitText splits the current headline into chars. Each char tweens through a randomised set of Devanagari (or Latin, depending on direction) glyphs for ~150ms before settling on the final char of the target language. Stagger 0.012s. Crucially: layout doesn't reflow during scramble — we measure final width first and lock the container.
- **Why signature**: A bilingual site usually just hot-swaps the DOM. We turn it into a transliteration ritual that reinforces the brand's bilingual identity.
- **Tech**: GSAP SplitText (chars). Two glyph pools: Latin punctuation+ASCII for EN→HI source, Devanagari consonants (क, ख, ग, घ, च, ज, ट, ड, त, द, न, प, ब, म, य, र, ल, व, श, स, ह) for HI→EN source. Pre-measure final headline width with a hidden mirror node; lock parent `min-width` during animation.
- **Perf budget**: ≤ 4ms/frame for 180ms total.
- **Reduced-motion fallback**: Immediate text swap with a 200ms crossfade.
- **Mobile**: Active. Stagger reduced to 0.008s, total duration 120ms.
- **Awwwards ref**: Tooled after the FFConf and TVMaze scramble patterns; for Devanagari specifically there's no famous reference — that's *why* it's signature for us.

```ts
// pattern
const split = new SplitText(headlineRef.current, { type: "chars" });
gsap.to(split.chars, {
  duration: 0.15,
  stagger: 0.012,
  ease: "none",
  onStart() { lockWidth(headlineRef.current); },
  onComplete() { unlockWidth(headlineRef.current); split.revert(); },
  textContent: (i) => devanagariPool[Math.floor(Math.random() * devanagariPool.length)],
  repeat: 4, // scramble cycles before settling
  yoyoEase: false,
  onRepeat() { /* keep scrambling */ },
});
// then write the real target characters at the end
```

---

### SIG-11 · "Akarshan" — magnetic-distortion CTAs with brass-foil sweep
- **Where**: Every primary CTA (`<Button variant="primary">`) site-wide.
- **What**: Three layered effects on a single button:
  1. Magnetic follow within a 64px radius (GSAP `quickTo`, ease `power3`).
  2. Subtle SVG `feDisplacementMap` distortion of the button's edge that strengthens with cursor proximity.
  3. A brass-foil radial gradient sweeps across the button label tracking the cursor X position (CSS `background-position` from `--mx`).
- **Why signature**: Single CTAs are make-or-break for inquiries. Magnetic alone is now common — pairing it with edge distortion + brass sweep makes it feel handcrafted.
- **Tech**: Magnetic via `gsap.quickTo`. Edge distortion via SVG filter on the button (`<filter><feTurbulence/><feDisplacementMap/></filter>`) with `scale` tweened by proximity. Sweep via CSS `background: radial-gradient(...) var(--mx) 50%`.
- **Perf budget**: ≤ 1ms/frame.
- **Reduced-motion fallback**: Static button, brass underline draws on focus (DrawSVGPlugin or pure CSS `transform: scaleX`).
- **Mobile**: Magnetic disabled. Sweep effect on `:active` instead (radial origin = tap point).

---

### SIG-12 · "Vidaai" — masked image reveal along custom Bengali-script path
- **Where**: Case study chapter dividers (Haldi → Mehendi → Sangeet → Wedding → Reception); About origin-story imagery.
- **What**: An image is masked by a custom SVG path shaped like a calligraphic Bengali letter (e.g., the chapter's initial: হ for Haldi, ম for Mehendi). As the user scrolls into view, `DrawSVGPlugin` draws the stroke 0% → 100%, the path is then converted into a `clipPath`, and the image is unveiled through the calligraphic shape before expanding into a rectangle for body reading.
- **Why signature**: Cultural specificity without being kitsch. The mask uses Bengali typography as a structural device, not a decoration.
- **Tech**: A small set of hand-drawn or font-derived `<path>` for each ceremony glyph (Bengali/Hindi). Two ScrollTriggers: (1) draw stroke from 0 → 1, (2) once drawn, morph the clip-path from the glyph outline to a `inset(0)` rectangle using MorphSVGPlugin over 400ms.
- **Perf budget**: ≤ 6ms during the reveal moment.
- **Reduced-motion fallback**: Image appears at final rectangle state with a 200ms fade.
- **Mobile**: Active. Mask scaled to image bounds.
- **Awwwards ref**: [eternal-themes.com](https://eternal-themes.com), [www.studiodumbar.com](https://www.studiodumbar.com) (calligraphic reveals).

---

### (Bonus) SIG-13 · "Diya" — petal-fall on success, jasmine-bloom on 404
- **Where**: Inquiry form success state (5.10); 404 page (5.12).
- **What**: One-time choreographed Lottie of 4–6 jasmine/marigold petals falling along MotionPath SVG curves, randomised slightly per visit (seed → MotionPath progress offsets). Single playback, no loop. After settle, petals stay as static decor.
- **Why signature**: Emotional payoff moments are where users screenshot. We earn it.
- **Tech**: Lottie (or pure GSAP MotionPath if Lottie file too heavy). Curves drawn in `<path>` and bound via `motionPath: { path: "#curve-1" }`.
- **Perf budget**: ≤ 8ms during the 6s animation; 0 after.
- **Reduced-motion fallback**: Single static jasmine bloom illustration.
- **Mobile**: Active. Reduce particle count from 6 → 4.

---

## 6b.4 Signature page treatments — which moments live where

| Page | SIG moments active (in scroll order) | Notes |
|---|---|---|
| Home `/` | SIG-01 hero · SIG-09 grain · SIG-03 marquee · SIG-02 divider · SIG-05 type-on-scroll · SIG-06 pinned showcase · SIG-11 CTAs · SIG-03 testimonial marquee · SIG-05 closer | The flagship; uses 8 of 12. |
| About `/about` | SIG-09 grain · SIG-12 calligraphic mask (origin) · SIG-07 3D step stack (process) · SIG-11 CTAs · SIG-05 closer | Calmer; story-led. |
| Services index `/services` | SIG-09 grain · SIG-08 FLIP into a service tile (lite) · SIG-11 CTAs | Tab transitions use Framer Motion `layoutId`. |
| Service detail `/services/[slug]` | SIG-09 · optional SIG-01 (cinematic intensity) · SIG-05 H2s · SIG-02 dividers · SIG-11 | Owner can dial intensity per service. |
| Portfolio index `/portfolio` | SIG-09 · SIG-04 cursor-distortion tiles · SIG-08 FLIP into case · SIG-03 filter pill marquee | Most "interactive" page. |
| Case study `/portfolio/[slug]` | SIG-08 FLIP arrival · SIG-09 grain · SIG-12 chapter masks · SIG-02 between chapters · SIG-05 H2s · NumberCounter (baseline MO-09) · SIG-11 | Highest motion budget per 06 §6.2. |
| Pricing `/pricing` | SIG-09 · SIG-07 3D card stack · SIG-11 CTAs · brass ribbon draw (DrawSVG) on "recommended" | Numbers are sober; type-only. |
| Blog index `/blog` | SIG-09 · SIG-05 featured headline · SIG-08 lite into post | Restraint. |
| Blog post `/blog/[slug]` | SIG-09 · reading-progress bar · SIG-05 H2s · drop-cap reveal | No flashy moments — content is king. |
| Contact `/contact` | SIG-09 · SIG-11 CTAs · step-slide transitions · SIG-13 jasmine-bloom on success | Calm UX. |
| 404 | SIG-09 · SIG-13 petal-fall | Branded moment. |
| Locations `/locations/[slug]` | SIG-09 · SIG-02 dividers · SIG-11 | Lean — built for SEO. |

---

## 6b.5 Designer → developer handoff notes

### Tooling & decisions, not theory

1. **Lenis instance is singular** — one provider in `app/(site)/layout.tsx`. Never instantiate Lenis in a section component. `lenis.on("scroll", ScrollTrigger.update)` is bound once.
2. **All ScrollTriggers register in a `gsap.context(scope)` and call `ctx.revert()` on unmount.** Non-negotiable for React 19. App Router unmounts more aggressively than Pages did.
3. **Use `useGSAP` from `@gsap/react`** — handles `gsap.context` lifecycle automatically; pairs with `useRef`. Prefer this over hand-rolled `useEffect + ctx.revert()`.
4. **Plugin imports**: all GSAP plugins are paid (Club). Install via the registry token described in GSAP docs; do **not** check tokens into the repo.
5. **R3F is lazy.** Every WebGL component is `next/dynamic(() => import("@/components/motion/webgl/Tilaka"), { ssr: false, loading: () => <Fallback/> })`. The fallback is the static hero so LCP is the still image, not a black canvas.
6. **One `Canvas` per route, not per component.** Reuse a single `<Canvas>` mounted at layout level with multiple `<Scene>` children gated by route. (Active Theory pattern.) Cuts GL context churn dramatically on navigation.
7. **`ScrollTrigger.refresh()` on every route transition** — `useEffect` in the layout, watch `pathname`, call `ScrollTrigger.refresh()` after a `requestAnimationFrame`. This catches pin-point miscalculations after FLIP-driven layouts settle.
8. **`will-change` is set on enter, removed on complete.** A persistent `will-change` is the #1 cause of mid-tier-Android FPS drops on this kind of site.
9. **No animation runs before mount of its trigger.** Use `IntersectionObserver` to delay heavy timeline creation until the section is within 1× viewport of entry. (Saves ~80ms on initial scripting for routes with many ScrollTriggers.)
10. **All SVG filters live in a single, app-root `<svg width=0 height=0>` defs sprite** — `lib/motion/filters.tsx`. Inline filters re-create their own context per node, which kills paint.

### Concrete code-shape hints

```tsx
// components/motion/sig-05-bhaar.tsx
"use client";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";

export function VariableWeightOnScroll({ children, max = 700, min = 300 }: { children: React.ReactNode; max?: number; min?: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const setWght = gsap.quickSetter(ref.current!, "css", "--wght");
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        const v = Math.min(Math.abs(s.getVelocity()) * 0.0008, 1);
        setWght(gsap.utils.mapRange(0, 1, 400, max, v));
      },
    });
    return () => st.kill();
  }, { scope: ref });
  return <div ref={ref} className="will-bend">{children}</div>;
}
```

```css
.will-bend {
  font-variation-settings: "wght" var(--wght, 400), "opsz" 96;
}
```

### Things to NEVER ship

- Per-frame `getBoundingClientRect()` calls (cache once, refresh on resize).
- ScrollTrigger created inside a `useEffect` without cleanup.
- `whileInView` Framer Motion props on scroll-heavy pages (they fight ScrollTrigger).
- Inline `style={{ transform: ... }}` updated every render (CSS variables + GSAP setters only).
- A WebGL canvas mounted higher than necessary in the tree (it should be a leaf).

---

## 6b.6 Awwwards & studio reference set (10+)

Pulled deliberately — each one exemplifies a specific technique we're borrowing.

| # | Site | Technique we steal |
|---|---|---|
| 1 | [locomotive.ca](https://locomotive.ca) | Smooth scroll + velocity-aware UI (SIG-03, SIG-05) |
| 2 | [activetheory.net](https://activetheory.net) | WebGL hero + shared `<Canvas>` per route (SIG-01) |
| 3 | [resn.co.nz](https://resn.co.nz) | Cursor-distortion hover + WebGL motion (SIG-04) |
| 4 | [pitch.com](https://pitch.com) | Editorial pinned showcase, typographic restraint (SIG-06) |
| 5 | [thenorthface.com — Pinnacle](https://www.thenorthface.com) | Image-driven case study scroll, chapter scrubs (SIG-08, SIG-12) |
| 6 | [eternal-themes.com](https://eternal-themes.com) | Luxury wedding typography + mask reveals (SIG-12) |
| 7 | [cuberto.com](https://cuberto.com) | FLIP-style portfolio → case transitions (SIG-08) |
| 8 | [bruno-simon.com](https://bruno-simon.com) | WebGL portfolio (technique benchmarks for shaders) |
| 9 | [tendril.ca](https://tendril.ca) | Reactive cursor effects (SIG-04) |
| 10 | [linear.app/method](https://linear.app/method) | Variable-font motion, type-as-interface (SIG-05) |
| 11 | [igloo.inc](https://igloo.inc) | Velocity-blurred marquees (SIG-03) |
| 12 | [studiodumbar.com](https://www.studiodumbar.com) | Calligraphic / type-as-form mask reveals (SIG-12) |
| 13 | [vercel.com/design](https://vercel.com/design) | Variable font on scroll, restrained motion (SIG-05) |
| 14 | [www.northeastern.edu](https://www.northeastern.edu) | Section-divider SVG bleed (SIG-02 inspiration) |
| 15 | [www.areweb.com](https://www.areweb.com) | 3D card stacks with CSS perspective (SIG-07) |

Keep these in a shared Pinterest board / Notion gallery for the impeccable + ui-motion skill loops when iterating each section.

---

## 6b.7 Quick-reference matrix (build order, intensity, owner-toggle)

| SIG | Build order | Default intensity floor | CMS toggle? | Required plugins |
|---|---|---|---|---|
| SIG-09 grain | First (everywhere) | hushed | no (global on) | SVG only |
| SIG-11 CTAs | First | refined | no | GSAP core |
| SIG-03 marquee | Sprint 4 | refined | yes (per marquee) | GSAP + Observer |
| SIG-05 var-font | Sprint 4 | refined | yes (per section) | GSAP core |
| SIG-02 bleed divider | Sprint 4 | refined | no | SVG only |
| SIG-12 calligraphic mask | Sprint 5 | cinematic | yes (case study only) | DrawSVG + MorphSVG |
| SIG-06 pinned showcase | Sprint 5 | cinematic | no | ScrollTrigger pin |
| SIG-07 3D stack | Sprint 5 | cinematic | yes (pricing tier) | CSS + ScrollTrigger |
| SIG-08 FLIP transition | Sprint 5 | cinematic | no | Flip + ViewTransitions |
| SIG-04 cursor distortion | Sprint 5 | cinematic | yes (per page) | OGL |
| SIG-10 Devanagari scramble | Sprint 5 | refined | no (global on switcher) | SplitText |
| SIG-01 WebGL hero | Sprint 6 (final polish) | cinematic | yes (per page) | R3F + drei + custom GLSL |
| SIG-13 jasmine bloom | Sprint 5 | refined | no | Lottie or MotionPath |

---

## 6b.8 Tie-back to 06 baseline

The baseline doc's MO-01..MO-12 are still the **lingua franca** primitives. V2 signature moments **compose** those primitives, not replace them. For example, SIG-06 internally uses MO-06 (PinnedHorizontal) + MO-08 (MaskedReveal) + a new ColorThief integration; the named SIG- moments are the design-level promises, the MO- primitives are the implementation atoms.

Motion budget caps in 06 §6.2 still apply. The signature moments are designed to fit within those caps, not exceed them — they replace generic effects, they don't pile on top of them.

End of V2 delta.
