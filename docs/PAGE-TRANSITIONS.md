# Page Transitions — Siligurievent

A two-layer choreography system for cinematic route changes.

> **Status**: implements SIG-08 hand-off ("Phera") and the broader "film-cut" feel
> requested for Siligurievent. Layered on top of the GSAP Flip transition already
> wired in `lib/gsap/scroll-triggers.ts#flipTransition`.

---

## Lifecycle

```
user clicks <Link>
        │
        ▼
InterceptNav.onClick (capture)
  ├─ filters disqualified clicks (modifier, _blank, external, hash-only, …)
  ├─ classifyTransition(fromPath, toPath) → CurtainVariant
  ├─ e.preventDefault()
  └─ window.dispatchEvent("sgv:transition-start", { variant, fromPath, toPath })
        │
        ▼
Curtain (portaled into <body>)
  ├─ "brass-sweep"  → 360ms in, 360ms out  (display ease)
  ├─ "grain-fade"   → 600ms in, 600ms out  (ink ease)
  └─ "none"         → no-op (let shared-element FLIP own the hand-off)
        │
        ▼ at variantCommitMs (curtain at full coverage)
router.push(toPath)
        │
        ▼
template.tsx re-mounts under the cover
  └─ Framer Motion subtle scale + opacity (0.98 → 1.0, 0.6 → 1.0)
        │
        ▼ at variantDurationMs
window.dispatchEvent("sgv:transition-end")
  └─ TransitionProvider.useTransitionState() flips isTransitioning → false
```

Total durations:

| Variant       | In   | Hold | Out  | Total |
|---------------|------|------|------|-------|
| `brass-sweep` | 360ms | 1f  | 360ms | 720ms |
| `grain-fade`  | 600ms | 1f  | 600ms | 1200ms |
| `none`        | —    | —    | —    | 0ms   |

---

## Variant matrix

Defined in `lib/transitions/route-classifier.ts`:

| from → to                              | variant       | why                                            |
|----------------------------------------|---------------|------------------------------------------------|
| any → `/portfolio/[slug]`              | `none`        | shared-element FLIP owns the hand-off          |
| `/portfolio/[slug]` → `/portfolio/[slug]` | `none`     | cover-to-cover morph                            |
| `/portfolio/[slug]` → anywhere else    | `grain-fade`  | slow exit from immersion                       |
| `/contact` → `/`                       | `brass-sweep` | post-submit celebration                        |
| `/portfolio` → `/`                     | `brass-sweep` | calm default                                    |
| anywhere → anywhere (default)          | `brass-sweep` | film-cut floor                                 |

---

## Opting out of the curtain

Three escape hatches, in order of specificity:

```tsx
{/* 1. Per-link */}
<Link href="/contact" data-no-transition>
  Contact
</Link>

{/* 2. Per-subtree (any ancestor of the click target) */}
<div data-no-transition>
  <Link href="/blog">…</Link>
  <Link href="/about">…</Link>
</div>

{/* 3. Native browser intents bypass automatically */}
<a href="/" target="_blank">…</a>           {/* respected */}
<a href="/contact" download="…">…</a>       {/* respected */}
<a href="https://other.com">…</a>           {/* respected */}
```

Also bypassed by default:
- modifier-key clicks (`cmd`, `ctrl`, `shift`, `alt`)
- middle-click and right-click
- `mailto:`, `tel:`, `sms:`, `javascript:` schemes
- hash-only links (`href="#section"`)
- destination resolves to the same pathname

---

## Adding a new variant

1. Add the variant key to `CurtainVariant` in `lib/transitions/route-classifier.ts`.
2. Extend `variantDurationMs` and `variantCommitMs` switches.
3. In `components/transitions/curtain.tsx`, add a branch inside the
   `onStart` handler that builds a fresh GSAP timeline. Reuse `EASE.*`
   from `lib/gsap/eases`.
4. Add the routing rule(s) to `classifyTransition`.
5. Manually verify the new variant kills cleanly when a second click
   lands mid-flight (the in-flight timeline is `.kill()`ed by the
   curtain's own start handler).

---

## Shared elements (View Transitions API)

For elements that should morph across routes (portfolio tile image →
case-study cover image):

```tsx
import { SharedElement } from "@/components/transitions/shared-element-wrapper";

// On the portfolio tile:
<SharedElement id={`project-cover-${slug}`}>
  <Image src={cover} alt={title} fill />
</SharedElement>

// On the case-study cover (same id):
<SharedElement id={`project-cover-${slug}`}>
  <Image src={cover} alt={title} fill priority />
</SharedElement>
```

The browser handles the morph natively when the API is available
(Chromium 111+, Safari TP). Where it isn't, `flipTransition` in
`lib/gsap/scroll-triggers.ts` takes over as the FLIP fallback. The
curtain variant is `"none"` for portfolio-cover hand-offs precisely so
this morph is unobstructed.

---

## Reduced motion + Save-Data

The system respects `prefers-reduced-motion: reduce` AND `Save-Data: on`
(via `navigator.connection.saveData`):

- Curtain collapses to a 150ms `opacity` cross-fade.
- Template tween drops `scale`, keeps a 150ms opacity ramp.
- Shared elements still get `viewTransitionName` — browsers under
  reduced motion already cross-fade rather than morph by spec.

Listeners can also observe directly:

```tsx
import { useTransitionState } from "@/components/transitions/transition-provider";

const { isTransitioning, fromPath, toPath } = useTransitionState();
```

Useful to disable expensive hover effects while the curtain is up, or to
fire analytics on settled arrivals.

---

## Performance characteristics

| Metric                          | Budget       | Actual (target)                        |
|---------------------------------|--------------|----------------------------------------|
| Curtain DOM nodes               | ≤ 4          | 4 (root, brass, grain, defs svg)       |
| Paints during sweep             | 0            | 0 (transform + opacity only)           |
| Layout during sweep             | 0            | 0 (curtain has `contain: strict`)      |
| JS cost per nav                 | ≤ 2ms        | ~0.5ms (event dispatch + setTimeout)   |
| Bundle delta                    | ≤ 4 KB gz    | ~3 KB (no new deps; reuses gsap+motion)|
| LCP impact                      | 0            | curtain is `autoAlpha: 0` until used   |
| First-paint flash               | none         | inline GSAP `set` before CSS class     |

Aborts: clicking a second link mid-transition kills the in-flight GSAP
timeline and clears both the commit timer and end timer. The new sweep
starts cleanly; no orphan `sgv:transition-end` events fire.

---

## File index

| File | Role |
|------|------|
| `lib/transitions/route-classifier.ts`            | Pure: pair → variant       |
| `lib/transitions/intercept-nav.tsx`              | Global click delegate      |
| `components/transitions/curtain.tsx`             | GSAP-driven overlay        |
| `components/transitions/transition-provider.tsx` | Context + portal + intercept |
| `components/transitions/shared-element-wrapper.tsx` | `view-transition-name` helper |
| `app/(site)/template.tsx`                        | Per-route mount tween      |
| `app/(site)/layout.tsx`                          | Wraps `{children}` in provider |
