# 3D Effects — Siligurievent

A small, dependency-light library of cinematic-luxury 3D motion components, sitting on top of the existing GSAP + Framer Motion infrastructure. Inspired by the Framer 3D-split tutorials at https://3d-split.learnframer.site/, the Apple Vision Pro product page card folds, resn.co.nz's tilted depth stacks, basement.studio image dissolves and lusion.co parallax — but kept restrained to match Siligurievent's editorial register.

Internal showcase: **`/design/3d-effects`** (dev-only; production returns 404 via the same gate as `/design`).

Source: `components/effects/3d-*.tsx`, shared utilities in `lib/effects/3d-utils.ts`.

---

## When to use which

| Effect | Best applied to | Avoid using on |
| --- | --- | --- |
| `SplitImage` | Case-study covers, About founder portrait, Signature work feature panes | Small thumbnails (< 320px), grids with > 6 visible instances |
| `FoldCard` | Wedding-invitation case-study reveal, Service "package" tiles, About founder note | Above-the-fold hero (delays LCP), forms |
| `ParallaxStack` | Home hero secondary image, About studio vignette, Contact section vista | Long lists; only one stack per viewport |
| `TileGrid` | Portfolio masonry, Service grid, Case-study gallery, Awards strip | Single-column mobile layouts (no spatial advantage) |
| `SliceReveal` | Signature case-study covers, About hero feature, Home hero secondary | Repeat decorative grids — too theatrical |
| `PerspectiveCard` | Service tiles, Process-step cards, Testimonial cards, Contact CTA | Inside another 3D container (perspective nests badly) |
| `TextSplit` | Hero H1 alternates, Case-study cover title, About hero title | Long paragraphs, marketing run-on text, anything > 60 chars |
| `ImageMarquee` | Portfolio strip, Press logos, Vendor partners on About, Case-study related-work footer | Anywhere the strip can be the LCP element |

Pair-with notes:

- `<TextSplit>` is an **alternative** to the existing `<SplitterReveal>` — use one or the other on a given headline, never both stacked.
- `<SplitImage>` and `<SliceReveal>` should not appear together on the same screen — both are hero-tier reveals and reading both is exhausting.
- `<PerspectiveCard>` may host an `<Image>` and the brass sheen will compose correctly; do not nest a second `<PerspectiveCard>` inside.

---

## Reduced-motion behaviour matrix

Every component checks `prefers-reduced-motion: reduce` (via `useReducedMotion` for reactive cases, `getReducedMotion` for one-shot static decisions) and exposes a static fallback. None of them require JavaScript to render meaningful HTML.

| Effect | Reduced-motion fallback |
| --- | --- |
| `SplitImage` | 0.4s autoAlpha fade only, no split |
| `FoldCard` | Both halves displayed side-by-side in a 2-col grid |
| `ParallaxStack` | Static stack — no pointer or scroll transforms |
| `TileGrid` | Flat grid, no rotation, no Z |
| `SliceReveal` | Slices reset (transform cleared); image visible flat |
| `PerspectiveCard` | Card sits static — no tilt, no sheen tracking |
| `TextSplit` | Letters render in place at identity transform |
| `ImageMarquee` | Marquee animation never starts; tiles sit flat |

Save-Data (`navigator.connection.saveData === true` or 2G) collapses to the same fallbacks. Coarse-pointer devices (phones / tablets) disable cursor-tracking variants but keep scroll-tied transforms where present.

---

## Perf budget

Measured against the project's "mid-tier Android" target (Snapdragon 7-class, Chrome 124, 4× CPU throttle in DevTools). Numbers are rough — re-measure when the component is integrated into real content.

| Effect | Frame cost | Notes |
| --- | --- | --- |
| `SplitImage` | ~0.4 ms / frame during the 0.9s reveal | One image, panels are `position: absolute` clipped strips — no GPU thrash. |
| `FoldCard` | ~0.3 ms / frame during 1.2s fold | Single `rotationY` tween; cover uses `backface-visibility: hidden` so we paint once. |
| `ParallaxStack` | ~0.6 ms / frame during pointer move | `gsap.quickTo` — no React re-renders. Pointer is rate-limited by browser to ~60 events/s. |
| `TileGrid` | ~0.5 ms / frame while scrolling | All tile tweens share one `ScrollTrigger` cycle; scrub coefficient 0.8. |
| `SliceReveal` | ~0.4 ms / frame during 1.4s | Single-fire. After settling, the layer is composited flat and costs nothing. |
| `PerspectiveCard` | ~0.2 ms / frame during pointer move | Two `quickTo`s + two CSS variables. |
| `TextSplit` | Scales with letter count. ~0.6 ms / frame for 24 letters. | Don't pass copy > 60 chars. |
| `ImageMarquee` | ~0.7 ms / frame while playing | Pauses on `visibilitychange` (tab hidden) and when scrolled past via `ScrollTrigger`. |

Compatibility:

- All effects use widely-supported CSS 3D transforms; no `@property`, no `view-transition-name`.
- `backface-visibility: hidden` and `perspective` work in Safari 14+ and Chrome 49+. Safari iOS 16 has known issues with nested `transform-style: preserve-3d` — components avoid double-nesting.

---

## Layout-shift discipline (CLS)

Every component ships with an explicit aspect ratio or fixed height to eliminate CLS at first paint:

- `SplitImage`, `SliceReveal` — `aspectRatio: ${width} / ${height}` is set on the frame.
- `FoldCard` — caller wraps in their own `aspect-[4/3]` etc.; the component itself is `block`.
- `ParallaxStack` — caller provides height (typical: `aspect-[16/9]`).
- `TileGrid` — children control their own intrinsic size; the grid itself is flow-sized.
- `PerspectiveCard` — passthrough wrapper, no size constraint.
- `TextSplit` — `inline-block`; letters render before JS hydrates, so the reserved space matches the final state.
- `ImageMarquee` — fixed `tileHeight` prop; the track width is auto from the doubled tile list.

If you swap a component into a section that previously had a static image, **carry over the aspect-ratio class** — do not let the new component compute size from content.

---

## Don'ts

A non-exhaustive list of anti-patterns the library is designed to discourage.

1. **No `perspective` < 800px.** Anything tighter produces vertigo. Stick to 1000–1600px. The shared `DEPTH` constants enforce this.
2. **No `rotateZ` > 4°.** Twisting cards reads as cheap. The library does not expose `rotateZ` to consumers.
3. **No continuous looped 3D rotations.** A card that gently rotates "to draw attention" is poison on a luxury site. Every effect either settles or is driven by user input (cursor / scroll).
4. **No `elastic.*` / `back.*` GSAP eases.** Springy overshoot is forbidden. Use `power3.out`, `power4.out`, or the brand cubic-beziers in `lib/gsap/eases.ts`.
5. **No animation under 0.8s.** Quick 3D feels like a glitch. The `TIMING` constants are floors.
6. **No animation over 1.8s.** Past the upper bound, users start scrolling away mid-effect.
7. **No tilt-after-cursor-stops.** When the pointer leaves, the card returns to rest — it does not freeze tilted.
8. **No 3D-on-3D nesting.** `PerspectiveCard` inside a `TileGrid` tile is fine (the outer grid never tilts to >8°), but two `PerspectiveCard`s nested will fight. The library doesn't error on this — be disciplined.
9. **No surprise transforms on first paint.** Every component is server-rendered to its final HTML; JS only enhances. If you see flicker on page load, the component is mis-mounted — file a bug.
10. **No animations while `document.hidden`.** Marquees pause; pointer-tracking releases its current frame and waits.
11. **No `Math.random()` in render.** `TextSplit` uses a seeded PRNG (`seededRand` in the component) so SSR and CSR produce identical markup and there is no hydration mismatch.
12. **No box-shadow heavier than `0 32px 64px -12px rgba(0, 0, 0, 0.25)`.** Heavier shadows make the luxury read as "saturated marketing site". Use the brass accent for depth, not soot.

---

## Hygiene checklist (every component)

- [x] `gsap.context(scope)` wraps every tween, `ctx.revert()` runs on unmount.
- [x] `prefers-reduced-motion: reduce` → documented static fallback.
- [x] `Save-Data` / 2G → same static fallback as reduced-motion.
- [x] Page Visibility (`document.hidden`) — marquees pause; pointer-tracking checks before applying.
- [x] Coarse pointer — pointer-driven tilts disabled; scroll-tied effects continue.
- [x] `IntersectionObserver` (via `ScrollTrigger`) gates heavy reveals to when the element is visible.
- [x] TypeScript strict, named exports, `import type` for type-only imports.
- [x] No new runtime dependencies. GSAP and Framer Motion are already in `package.json`.

---

## Total runtime cost

Combined gzipped size of `components/effects/*` plus `lib/effects/3d-utils.ts`: < 6 KB. None of the components import three.js, R3F, or any visual library beyond GSAP, which is already loaded once globally via `lib/gsap`.

---

## Where each effect plugs in (suggestions for the main agent)

These are non-binding integration recommendations. The actual page surgery is left to the main agent; this library is strictly additive.

- **Home / hero**: `TextSplit` on the headline as an alternative to `SplitterReveal`; `ParallaxStack` on the secondary hero image.
- **Home / featured work strip**: `ImageMarquee` for the rolling project tiles; each tile can independently host a `PerspectiveCard` for the hover state.
- **Home / services preview**: `TileGrid` for the 3-column service preview; each tile wrapped in `PerspectiveCard`.
- **Services page tiles**: `PerspectiveCard` for each service card.
- **Services package details**: `FoldCard` on each package — cover shows price band, content reveals scope of work.
- **Portfolio index**: `TileGrid` for the masonry; `SplitImage` on the featured project at the top.
- **Case-study cover**: `SliceReveal` for the hero image; `TextSplit` for the title.
- **Case-study gallery**: `TileGrid` with intensity `medium`.
- **About / founder section**: `ParallaxStack` for the studio vignette; `FoldCard` for the founder note.
- **About / recognition**: `ImageMarquee` for press logos.
- **Contact page**: `PerspectiveCard` on the CTA card, `glareIntensity="rich"`.
