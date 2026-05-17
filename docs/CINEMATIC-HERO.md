# Cinematic Hero — operator's notes

The signature hero moment for `siligurievent.com`. A brass-foil particle
cloud renders behind the H1; the mandap silhouette emerges, holds for a
beat, and dissolves as the visitor scrolls. The editorial H1 picks up a
brass-foil sweep on mount so the dust *appears to settle into* the
typography. First-time visitors see a 2.4 s cold-open before the page.

This doc is the operator-facing summary. The canonical specs live in
`docs/06b-ANIMATION-V2.md` §SIG-01.

---

## 1. How to enable

1. **Install OGL** (one-time; see `RECOMMENDED-DEPS.md` at repo root for
   the exact pin to use):

   ```bash
   pnpm add ogl
   ```

2. **Set the env flag** — Next.js inlines `NEXT_PUBLIC_*` at build time,
   so this needs to be in `.env.local` for dev and the Vercel
   project-level Environment Variables for preview/prod:

   ```env
   NEXT_PUBLIC_CINEMATIC_HERO=true
   ```

3. **Swap the import** at the home page call site
   (`app/(site)/page.tsx`):

   ```diff
   - import { HomeHero } from "@/components/marketing/sections/home-hero";
   + import { HomeHeroSwitch as HomeHero } from "@/components/cinematic/cinematic-hero-shell";
   ```

   The `HomeHeroSwitch` server component checks the env flag and renders
   either the cinematic shell or the existing `<HomeHero />` editorial
   variant. No other call sites change.

4. **Add the cold-open** to the site layout
   (`app/(site)/layout.tsx`):

   ```tsx
   import { ColdOpenMount } from "@/components/cinematic/cold-open-mount";

   <LenisProvider>
     <ColdOpenMount />
     {/* ...existing layout children */}
   </LenisProvider>
   ```

   The mount is a no-op when the env flag is off, so it is safe to
   leave in the tree permanently once added.

To disable: set `NEXT_PUBLIC_CINEMATIC_HERO=false` (or remove it) and
redeploy. The editorial hero comes back instantly.

---

## 2. Perf budget

### Targets

| Metric | Budget | Where measured |
|---|---|---|
| Per-frame GPU + scripting on Pixel 6a / iPhone 12 | ≤ 8 ms | Chrome perf, throttled 4× CPU |
| Initial JS for the home route, gzipped | ≤ +18 KB over baseline | `next build` output |
| LCP impact | 0 ms (canvas mounts lazy after LCP) | Lighthouse mobile |
| Heap growth over 60 s idle | < 4 MB | DevTools Memory |
| FPS floor on mid-tier Android | 50 fps | Real-device check |

### How we hit them

- **One canvas, one program, one geometry buffer.** No per-frame
  allocations except the rAF tick.
- **OGL, not three.** OGL is ~10 KB gz; R3F + three would be ~70 KB gz
  for the same use case.
- **Lazy mount.** Canvas only mounts when the hero enters the viewport
  via `IntersectionObserver` (rootMargin 200 px) and only if
  `prefers-reduced-motion: no-preference` and Save-Data is not set.
- **Dynamic `import('@/lib/cinematic/canvas-hero')`** so the OGL chunk
  doesn't appear in the initial JS payload.
- **Auto-degradation** (see §3).
- **`document.hidden` pause** via the Page Visibility API — the rAF
  loop short-circuits when the tab is backgrounded.
- **GSAP-ticker-synced.** Reads scroll progress via ScrollTrigger so
  it stays locked to the Lenis-driven scroll position; no separate
  scroll listener.

---

## 3. Particle count tuning

`lib/cinematic/canvas-hero.ts::resolveParticleCount` auto-tunes from
three signals; override with the `particleCount` option only when
benchmarking.

| Signal | Effect |
|---|---|
| Viewport area | Base count: `Math.round(area / 320)`, clamped to [800, 6000]. ~3000 at 1280×768, ~4500 at 1920×1080. |
| Mobile (`< 768 px` wide) | Halve the base. |
| `deviceMemory <= 4` OR `hardwareConcurrency <= 4` | Multiply by 0.3 (70% reduction). |
| Floor | 400 particles minimum. |

The auto-tune happens once at mount. To re-tune on rotation, destroy
and re-mount.

To change the breakpoint:

```tsx
<CinematicHeroCanvas /* uses default 768 */ />
```

If you need a different one, the breakpoint is a parameter to
`mount(container, { mobileBreakpoint: 1024 })` — wire it through the
canvas wrapper if the project ever needs that.

---

## 4. Fallback strategy

The hero auto-falls back to a static brass-grain radial gradient (no
canvas, no WebGL) when **any** of these are true:

1. `prefers-reduced-motion: reduce` is set.
2. `navigator.connection.saveData === true`.
3. `effectiveType` is `"2g"` or `"slow-2g"`.
4. WebGL context creation throws (older Safari quirks, blocked GPUs).

The fallback is a single CSS-painted layer plus a 6%-opacity SVG-noise
grain. Zero JS after mount. Reads as "luxury film still", not "broken
canvas".

The cold-open also degrades: under reduced motion it skips the bloom
entirely and just fades the black panel out in 200 ms.

---

## 5. Browser support

| Browser | WebGL | Notes |
|---|---|---|
| Chromium ≥ 90 (desktop + Android) | ✅ | Reference target. Includes Edge / Opera / Samsung. |
| Safari ≥ 15 (macOS + iOS) | ✅ | iOS 15 had some GPU quirks; we don't use any compute / WebGL 2 features so we're safe on WebGL 1 fallback. |
| Firefox ≥ 90 | ✅ | Tested. |
| Older / fallback | n/a | Falls back to gradient. |

We never call `WebGL2RenderingContext`-only methods. OGL by default
prefers WebGL 1 unless asked otherwise, which is what we want.

---

## 6. What to monitor in production

Watch these in Vercel Web Analytics + your synthetic monitoring (e.g.,
Calibre, SpeedCurve), and bookmark a real-device session weekly.

- **LCP** on `/` (mobile + desktop). Should be identical to the
  editorial hero baseline — the canvas mounts *after* LCP, so any
  regression means the lazy mount is breaking.
- **CLS** on `/`. Must remain `0.0` — the canvas inherits the
  overlay's bounding box; if it ever shifts layout we have a bug.
- **Long Tasks** > 50 ms on the home route. The OGL setup performs
  a one-time GPU upload (~5-8 ms) — anything beyond that on
  steady-state scroll is a regression.
- **`webgl-lost-context` rate.** OGL fires `webglcontextlost` on
  GPU process crashes — surface this to Sentry if you wire it up.
- **Real-device FPS** on Redmi 12 / Pixel 6a / iPhone 12 once per
  release. Target ≥ 50 fps; if you see drops, lower the particle
  count auto-tune multiplier in `resolveParticleCount`.

---

## 7. File map

```
lib/cinematic/
├── canvas-hero.ts              # OGL setup; vanilla mount/destroy API
├── cold-open.tsx               # First-visit overlay component
└── shaders/
    ├── brass-dust.frag.glsl    # Fragment shader (canonical spec)
    ├── brass-dust.vert.glsl    # Vertex shader (canonical spec)
    └── mandap-sdf.glsl         # SDF chunk (canonical spec)

components/cinematic/
├── cinematic-hero-canvas.tsx   # Client wrapper for OGL canvas
├── cinematic-hero-overlay.tsx  # Client overlay (editorial copy + foil sweep)
├── cinematic-hero-shell.tsx    # Server component + HomeHeroSwitch
└── cold-open-mount.tsx         # Layout-level mount for the cold-open
```

> **Shader sources & runtime copy.** The `.glsl` files are the canonical,
> readable spec. The runtime shader strings are duplicated inside
> `canvas-hero.ts` because Next.js / Turbopack does not natively load
> `.glsl` imports and we refuse to add a loader dependency just for that.
> Keep the two in sync; the header of `canvas-hero.ts` says so.

---

## 8. Tuning notes for future-me

- The mandap pull beat is driven by scroll progress in
  `canvas-hero.ts::setScroll`. Currently:
  - 0–40 % scroll → silhouette emerges (pull 0 → 1).
  - 40–80 % scroll → silhouette dissolves (pull 1 → -0.4).
  - 80–100 % scroll → pull stays slightly negative so the dust drifts
    away as the visitor reads on.

  If the section is shortened or lengthened in the page spec, re-derive
  these thresholds against the new scroll range.

- The brass-foil sweep on the H1 is a CSS keyframe (no JS) triggered by
  a CustomEvent the canvas dispatches 250 ms after its own foil sweep
  kicks off. If the canvas is disabled (fallback / reduced-motion), the
  overlay fires the sweep itself after 800 ms.

- `uAccentMix` (fragment uniform, default 0.65) controls how much
  accent-crimson bleeds into bright mandap-charged particles. Drop to
  0.2 for a quieter mood; raise to 1.0 for a more saffron / Durga Puja
  look.

- The cold-open is gated by `sessionStorage["sgv:cold-open-shown"]`.
  Clear it in DevTools to re-test.
