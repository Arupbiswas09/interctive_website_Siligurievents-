# 06 — Animation Strategy

How motion works on this site. Patterns, budget, accessibility, named effects.

## 6.1 Principles

1. **Motion serves content, not the other way around.** Every animation must have a reason: hierarchy, focus, continuity, delight. If we can't name the reason, kill it.
2. **One signature moment per page.** Hero on Home. Pinned showcase on Services. Chapter scrub on case studies. Not every section needs a hero animation.
3. **GSAP for scroll, Framer Motion for components.** Don't mix them on the same effect.
4. **Mobile parity.** If a desktop effect can't survive on mobile (perf or UX), don't ship it on desktop either — design something that scales down gracefully.
5. **Reduced motion is a first-class state.** `useReducedMotion()` everywhere; entire timelines collapse to fades or no-ops.

## 6.2 Motion budget per route

| Route type | Max scroll-triggered animations | Max parallax layers | Pinned sections allowed |
|---|---|---|---|
| Home | 8 | 3 | 1 |
| Service detail | 5 | 2 | 1 |
| Portfolio index | 3 | 1 | 0 |
| Portfolio case | 10 | 3 | 2 |
| Pricing | 3 | 1 | 0 |
| Blog post | 3 | 1 | 0 |
| Contact | 2 | 0 | 0 |

Anything above these limits requires a deliberate decision documented in the PR.

## 6.3 Scroll engine — Lenis + ScrollTrigger

Single Lenis instance lives in `app/(site)/layout.tsx` via a client provider component.

```tsx
// components/motion/lenis-provider.tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis"; // NOT "@studio-freight/lenis" — that scope is deprecated; see 02-TECH-STACK.md §2.4
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

ScrollTrigger reads from Lenis automatically once `lenis.on("scroll", ScrollTrigger.update)` is bound.

## 6.4 Named effects catalog

These are the reusable, named motion primitives. Each lives in `components/motion/` and is documented with a Storybook-like entry on the internal `/_design` page.

### MO-01 — SplitterReveal
- Wraps the in-repo **splitter primitive** (`components/motion/splitter.tsx`) — a pure-React, SSR-safe component that splits a heading into `<span>`s by line / word / char and exposes refs for GSAP to animate. Reveals each segment with stagger.
- Props: `mode: "lines" | "words" | "chars"`, `stagger: number`, `from: { y, opacity, rotation }`.
- Default ease: `--ease-emphatic`.
- Used on: every H1, section H2s.
- **Note**: this is NOT the GSAP `SplitText` plugin (paid Club GreenSock) — we use our own primitive so the dependency tree stays MIT/free for commercial use.

### MO-02 — RevealOnScroll
- Generic fade + translate-up on entry.
- ScrollTrigger threshold `top 85%`.
- Used on: paragraphs, cards, mid-page imagery.

### MO-03 — Parallax
- Translate Y based on scroll position, `speed` prop 0–1 (0 = static, 1 = full scroll, -0.5 = reverse).
- Used on: hero background images, decorative elements.

### MO-04 — MagneticCursor
- Element follows cursor within a radius, snapping back when cursor leaves.
- Used on: primary CTAs, logo on hover.
- Disabled on touch devices via `matchMedia("(pointer: coarse)")`.

### MO-05 — MarqueeScroll
- Infinite-loop horizontal scroll, slows on hover, reverses direction based on scroll direction (Observer plugin).
- Used on: capability strip, testimonials row.

### MO-06 — PinnedHorizontal
- ScrollTrigger pins the section, scrubs horizontal translate of a child row.
- Used on: signature work showcase on Home.

### MO-07 — ImageScrub
- Frame-by-frame image sequence scrubbed by scroll progress. (Optional, Phase 4+ — heavy.)
- Used on: ONE editorial moment if owner has frame sequence assets.

### MO-08 — MaskedReveal
- Image revealed via clip-path animating from 0% to 100% as it enters viewport.
- Used on: feature images in case studies.

### MO-09 — NumberCounter
- Counts from 0 to target value as it enters viewport.
- Used on: stats section in case studies.

### MO-10 — PageTransition
- Route change → exit timeline (slight fade + scale 0.98) → enter timeline.
- Implemented via `<AnimatePresence>` wrapping the route children + the View Transitions API as enhancement.

### MO-11 — JasminePetalFall
- One-time decorative falling petal animation on 404 and form-success.
- 4–6 petals, randomized paths, total duration ~6s, then static.

### MO-12 — ScrambleText
- Letters scramble through random glyphs before settling. (Subtle.)
- Used on: hero word emphasis ("celebrations"), section transitions, sparingly.

## 6.5 Reduced motion behavior

> **SSR-safe pattern only.** Do NOT call `window.matchMedia(...)` at module top level — that will throw in React Server Components / SSR. Read `prefers-reduced-motion` from inside a Client Component, either via Framer Motion's `useReducedMotion()` hook or a guarded `useEffect`:

```tsx
// components/motion/use-reduced-motion.ts (Client Component hook)
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
```

Or simply import `useReducedMotion` from `framer-motion` (already a dependency) — it does the same thing.

| Effect | Reduced motion behavior |
|---|---|
| SplitterReveal | Show fully, no animation |
| RevealOnScroll | Single fade-in, 200ms |
| Parallax | No translate; static |
| MagneticCursor | Disabled |
| MarqueeScroll | Static (or very slow, optional) |
| PinnedHorizontal | Section becomes a vertical stack |
| MaskedReveal | Image appears immediately |
| NumberCounter | Final value shown immediately |
| PageTransition | Crossfade only, 150ms |
| JasminePetalFall | Single static decorative bloom |
| ScrambleText | Final text shown immediately |

Implementation pattern (inside a Client Component):

```tsx
"use client";
import { useReducedMotion } from "framer-motion"; // or our in-repo hook

function HeroTimeline() {
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: !!prefersReducedMotion });
      if (!prefersReducedMotion) tl.from(/* ... */).to(/* ... */).play();
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion]);
  // ...
}
```

Never read `window.matchMedia` at module scope — that path runs in RSC/SSR and breaks the build.

## 6.6 Cursor design

- Default OS cursor on touch and reduced-motion.
- Desktop: custom cursor — a small brass-coloured dot (8px) with a 24px outline ring.
- On hover over interactive elements (a, button): cursor grows to 48px, dot fills.
- On hover over images: cursor shows "View →" label (large, custom-typed).
- Powered by GSAP `quickTo` for buttery 60fps tracking.

## 6.7 Page transitions

Two layers:
1. **Native View Transitions API** — enabled for in-app navigation via Next.js App Router (when stable, behind feature flag if needed).
2. **Framer Motion exit/enter** — used as fallback and for orchestrated effects on case study covers (shared-element transitions using `layoutId`).

Pattern:
- Background dim 0 → 0.6 → 0 (150ms each direction).
- Outgoing content scales 0.98, fades.
- Incoming content scales from 1.02, fades in.
- Total transition ≤ 400ms.

## 6.8 Animation lifecycle hygiene

Every ScrollTrigger and GSAP timeline must be cleaned up on unmount:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top 80%" },
    }).from(...).to(...);
  }, ref);
  return () => ctx.revert();
}, []);
```

`gsap.context` + `ctx.revert()` is the standard pattern for cleanup in React 19.

## 6.9 Performance guardrails

- Animate only `transform` and `opacity`. No `top/left/width/height` animations.
- Use `will-change` sparingly — set it on enter, remove on complete.
- Lazy-mount heavy animation components below the fold via `next/dynamic({ ssr: false })`.
- Pause off-screen ScrollTriggers — they shouldn't tick when not in viewport.
- Profile every new effect on a Pixel 4a + 4G Lighthouse run. Cost > 30ms in scripting = simplify.

## 6.10 Hero animation spec (Home)

A worked example. This is the most visible animation on the site.

**Timeline (entrance, fires on page load):**

```
0.0s   Eyebrow label fades in + slides up 12px
0.2s   H1 word 1 splits in (chars, stagger 0.02s, y 100% → 0)
0.6s   H1 italic emphasis word — ScrambleText to final text
0.9s   H1 word 2 splits in
1.3s   Body paragraph fades in (no translate)
1.5s   CTA fades in + scales from 0.96 → 1
1.6s   Hero image reveals via clip-path inset 100% 0 → 0% 0
1.6s   Hero image starts subtle 4% Ken-Burns scale
```

**Scroll behavior:**
- Hero image parallax: scrolls 30% slower than page.
- Hero text: fades out as page scrolls down (opacity 1 → 0 across 80vh).

**Reduced motion:**
- All elements appear at final state, 200ms crossfade.
- No Ken-Burns, no parallax.

## 6.11 What we are NOT animating

- Form fields (they should feel immediate, not theatrical).
- Body paragraphs longer than 3 lines.
- Footer.
- Admin / CMS surfaces.
- Anything that could induce vestibular discomfort (large rotations, full-page parallax on body content).
