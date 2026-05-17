# Microinteractions Reference

Premium-tier interaction primitives for Siligurievent. All components are
client-side, mouse-only (touch falls back to native), and
`prefers-reduced-motion` aware.

## Components

### `<CustomCursor />` — `components/cursor/custom-cursor.tsx`

Mode-aware brass cursor. Mount once in `app/(site)/layout.tsx`. Renders to a
fixed-position portal at `z-index: 9999` with `pointer-events: none`. Reads
the `data-cursor` attribute on the hover target to pick a mode.

**Disabled on**: `(pointer: coarse)`, `print` media. Returns `null`.

**Reduced motion**: still renders, but no follow lag, blink, or glow
transitions.

### `<CursorProvider>` + `useCursorMode()` — `components/cursor/cursor-context.tsx`

Optional imperative override. Wrap the tree once; call
`useCursorMode().setMode("hidden")` to force a mode (useful during a cold
open over the WebGL hero). Setting back to `"default"` releases the
override. Falls back to attribute-based detection if no provider is mounted.

### `<CursorText label="View">` — `components/cursor/cursor-text.tsx`

Declarative wrapper that applies `data-cursor="image"` +
`data-cursor-label="…"` to its child or a wrapping span. Use `asChild`
when wrapping a single intrinsic element (avoids extra DOM).

```tsx
<CursorText label="Open story" asChild>
  <a href="/story">…</a>
</CursorText>
```

### `<GlowOnHover>` — `components/microinteractions/glow-on-hover.tsx`

Drops a soft brass radial glow that tracks the pointer inside its bounds.
Linear/21st.dev signature. Pure CSS variables on `pointermove`, no React
state.

### `<SpotlightCard>` — `components/microinteractions/spotlight-card.tsx`

Bordered card with a conic-gradient rim and inner glow that follow the
cursor's angle from card centre. Houdini `@property` registers
`--spotlight-angle` for smooth interpolation; non-Houdini browsers degrade
to instant snap (no errors).

### `<LetterByLetterHover text="…" as="h2">` — `components/microinteractions/letter-by-letter-hover.tsx`

GSAP-driven per-letter wave on hover. Each letter rises ~6px and returns
with a small stagger. `aria-label` carries the unbroken string; per-letter
spans are `aria-hidden`.

### `<TextShimmer>` — `components/microinteractions/text-shimmer.tsx`

Subtle brass-foil sweep across the wrapped text (~6s loop). Use sparingly —
hero italic word only, by default.

### `<FocusRing />` — `components/microinteractions/focus-ring.tsx`

Global `:focus-visible` style: 2px brass outline, 2px offset, 200ms
ease-in, plus a soft 4px brass halo. Add `data-focus-prominent` on a
primary CTA for a louder halo. Mount once in layout.

### `<ScrollTip>` — `components/microinteractions/scroll-tip.tsx`

Pill with bobbing brass chevron and "Scroll to explore" label. Fades out
once `window.scrollY > threshold` (default 100). Drop at the bottom of
hero sections.

## `data-cursor` Attribute API

| Value         | Cursor behaviour                                              |
| ------------- | ------------------------------------------------------------- |
| `default`     | 8px brass dot + 28px ring                                     |
| `link`        | 48px ring with brass glow, dot scales to 0.85                 |
| `button`      | Ring snaps to element bounds + `border-radius`; dot hidden    |
| `image`       | 96px brass pill with label, `mix-blend-mode: difference`      |
| `draggable`   | 72px brass disc with "Drag" or `data-cursor-label` glyph      |
| `video`       | 96px brass disc with play triangle                            |
| `text`        | Slim brass I-beam, subtle blink                               |
| `hidden`      | Cursor invisible (use over WebGL hero / canvas surfaces)      |

Supporting attributes:

| Attribute             | Effect                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `data-cursor-label`   | Override the label rendered inside the cursor in `image`/`draggable`/`video` modes             |

Auto-detection fallbacks when no `data-cursor` is present on the hover
chain:

- `<a>`, `<button>` → `link`
- `<input>`, `<textarea>`, `[contenteditable="true"]` → `text`
- everything else → `default`

The closest ancestor with `data-cursor` wins — wrapping a region in
`data-cursor="hidden"` opts that entire subtree out.

## Accessibility

- Cursor is `aria-hidden="true"` and never replaces the system cursor for
  keyboard users (system cursor is still drawn by the OS).
- All wave/shimmer/glow animations respect
  `prefers-reduced-motion: reduce`.
- Focus rings are `:focus-visible` only — pointer focus stays quiet.
- `<LetterByLetterHover>` exposes `aria-label` with the original text;
  per-letter spans are `aria-hidden`.
- `<ScrollTip>` is `aria-hidden` (decorative).

## Performance Budget

- Cursor: two layers (dot, ring) animated via `gsap.quickTo` /
  `quickSetter` — never via React state. `will-change: transform` is set on
  both layers. Single global pointermove listener.
- `<GlowOnHover>` / `<SpotlightCard>`: pointermove listener scoped to each
  host element; values written to CSS variables, not React state.
- `<LetterByLetterHover>`: timeline created once, replayed on
  `pointerenter`. Skipped entirely on coarse pointers.
- `<TextShimmer>`: CSS-only.
- `<ScrollTip>`: passive scroll listener flips a `data-hidden` attribute —
  the fade itself is CSS.

Touch / coarse pointers short-circuit out of every interactive listener —
nothing fires on phones beyond a static visual.

## Integration

In `app/(site)/layout.tsx`:

```tsx
import { CursorProvider } from "@/components/cursor/cursor-context";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { FocusRing } from "@/components/microinteractions/focus-ring";

// inside <LenisProvider>:
<CursorProvider>
  <FocusRing />
  <CustomCursor />
  {/* …existing tree */}
</CursorProvider>
```

Then opt elements into modes inline:

```tsx
<a data-cursor="link" href="…">Read more</a>
<img data-cursor="image" data-cursor-label="View" src="…" />
<section data-cursor="hidden">{/* WebGL hero */}</section>
<button data-cursor="button" data-focus-prominent>Plan my event</button>
```
