# Typography Tuning — 2026-05-16

Owner reported the site felt "too big" on mobile and tablet. This pass rebases
the fluid type scale around mobile-first floors, tightens display leading,
introduces a prose width cap, and turns on `text-wrap: balance` / `pretty`.
Edits limited to `app/globals.css` and `app/fonts.ts`.

---

## 1. Before → After: `clamp()` deltas

All values resolve in px (rem assumes the browser default 16px root).

| Token       | Before (mobile → desktop) | After (mobile → desktop) | Use                |
| ----------- | ------------------------- | ------------------------ | ------------------ |
| `--text-xs`   | 12 → 13                   | **11 → 12**              | Eyebrow, captions  |
| `--text-sm`   | 14 → 15                   | **13 → 14**              | Secondary copy     |
| `--text-base` | 16 → 17                   | **15 → 16**              | Body               |
| `--text-lg`   | 18 → 20                   | **16 → 18**              | Lead paragraphs    |
| `--text-xl`   | 22 → 28                   | **18 → 24**              | Sub-headings       |
| `--text-2xl`  | 28 → 40                   | **22 → 32**              | H3                 |
| `--text-3xl`  | 36 → 56                   | **28 → 44**              | H2                 |
| `--text-4xl`  | 48 → 80                   | **36 → 64**              | H1 (hero default)  |
| `--text-5xl`  | 64 → 120                  | **44 → 88**              | Hero display       |
| `--text-6xl`  | 80 → 180                  | **56 → 128**              | Oversized accent   |

Biggest wins on mobile:
- 5xl down from 64 → 44 px (-31%) — the original hero literally did not fit on
  a 375 px viewport without aggressive word breaks.
- 6xl down from 80 → 56 px (-30%).
- 4xl down from 48 → 36 px (-25%).

---

## 2. Viewport math (resolved px at each breakpoint)

Each clamp is `clamp(min, A·vw/100 + B, max)`. Numbers below are the **rendered**
px after clamping.

| Token       | 320  | 375  | 414  | 768  | 1024 | 1440 | 1920 |
| ----------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| `--text-xs`   | 11   | 11   | 12   | 12   | 12   | 12   | 12   |
| `--text-sm`   | 13   | 13   | 14   | 14   | 14   | 14   | 14   |
| `--text-base` | 15   | 15   | 16   | 16   | 16   | 16   | 16   |
| `--text-lg`   | 16   | 17.2 | 17.5 | 18   | 18   | 18   | 18   |
| `--text-xl`   | 19.2 | 20.0 | 20.6 | 24   | 24   | 24   | 24   |
| `--text-2xl`  | 24.1 | 25.4 | 26.3 | 32   | 32   | 32   | 32   |
| `--text-3xl`  | 28.8 | 31.0 | 32.6 | 44   | 44   | 44   | 44   |
| `--text-4xl`  | 36   | 36.5 | 38.8 | 60.1 | 64   | 64   | 64   |
| `--text-5xl`  | 44   | 44   | 45.1 | 73.4 | 88   | 88   | 88   |
| `--text-6xl`  | 56   | 56   | 56   | 86.8 | 112.4| 128  | 128  |

Reading the table:
- Body (`--text-base`) sits at a comfortable 15 px on phones, lifts to 16 px on
  tablet upwards. With `--leading-body: 1.55` and `--prose-max: 65ch`, body
  copy now reads like editorial print rather than a wall.
- The hero (`--text-5xl`) sits at 44 px on a 320-414 px viewport — still
  cinematic for Cormorant, but no longer breaking layout.
- Desktop ceilings keep the dramatic scale the brand wants from 1024 px up.

---

## 3. Supporting tokens (new / changed)

```css
--leading-display: 0.95;
--leading-tight:   1.1;    /* h1–h6 default */
--leading-snug:    1.25;
--leading-body:    1.55;   /* p, body */
--leading-loose:   1.75;
--prose-max:       65ch;
--type-script-scale: 1.18; /* Devanagari headings */
```

- All `h1–h6` get `text-wrap: balance` + `letter-spacing: -0.025em` globally.
- All `p` get `text-wrap: pretty` + `line-height: 1.55`.
- `.prose` / `[data-prose]` clamps paragraphs at 65 characters.
- `.eyebrow` / `[data-eyebrow]` ships with `letter-spacing: 0.16em`, uppercase,
  weight 500, `--text-xs`.
- Devanagari (`[lang="hi"]`) headings render at `1em × 1.18`, paragraphs at
  `1em × 1.06`, with looser leading (1.18 / 1.7) — matches the script's needs
  per `docs/03b-DESIGN-V2.md`.

### Font-feature settings

- **Body (Inter)**: `"ss01", "cv11", "kern"` — single-storey `a`, open `4`,
  kerned at all sizes.
- **Display (Cormorant)**: `"liga", "dlig", "ss01", "kern"` — discretionary
  ligatures + stylistic swash caps for editorial moments.

### Font weight payload trim (`app/fonts.ts`)

- Cormorant: dropped 700 (we never call for bold serif). Now 300/400/500/600
  + italic 400.
- Inter: dropped 300 (insufficient contrast on warm ivory). Now
  400/500/600/700.
- Noto Serif/Sans Devanagari: unchanged (400/500/600/700, kept for HI
  surfaces).
- All four families remain `display: "swap"`.

Estimated savings: ~2 weight files removed (1 Cormorant + 1 Inter), roughly
30–50 KB compressed off `/en/*` initial font payload.

---

## 4. WCAG contrast (relative luminance method, sRGB)

### Light theme — `--bg #FAF7F2` (L = 0.949)

| Pair                              | Ratio   | AA body | AA large | AAA body |
| --------------------------------- | ------- | ------- | -------- | -------- |
| `--ink` `#1A1714` on bg           | 16.46:1 | ✓       | ✓        | ✓        |
| `--ink-muted` `#5C544B` on bg     | 7.18:1  | ✓       | ✓        | ✓        |
| `--ink-soft` `#8A8074` on bg      | 3.65:1  | ✗       | ✓        | ✗        |
| `--accent` `#8B1A1A` on bg        | 7.91:1  | ✓       | ✓        | ✓        |

### Dark theme — `--bg #0E0B08` (L = 0.0046)

| Pair                                  | Ratio   | AA body | AA large | AAA body |
| ------------------------------------- | ------- | ------- | -------- | -------- |
| `--ink` `#F5EDE0` on bg               | 16.39:1 | ✓       | ✓        | ✓        |
| `--ink-muted` `#B8A992` on bg         | 8.61:1  | ✓       | ✓        | ✓        |
| `--ink-soft` `#7A6E5E` on bg          | 3.92:1  | ✗       | ✓        | ✗        |
| `--accent` `#D4A574` (dark) on bg     | 8.94:1  | ✓       | ✓        | ✓        |

**Note**: `--ink-soft` is a tertiary token used for non-essential metadata
(timestamps, image credits, badge counts). It clears AA Large only — which
matches its intended role. Body copy uses `--ink-muted` (AAA). No tokens were
darkened — current palette already passes its intended thresholds.

---

## 5. How to revert

If a stakeholder wants the prior scale back:

1. In `app/globals.css`, restore the previous `--text-*` clamp block (the
   numbers in the "Before" column of §1 above). The original values lived in
   rem units — see git history of `app/globals.css` at the commit immediately
   preceding 2026-05-16 for the exact rem expressions.
2. Optionally remove the `--leading-*`, `--prose-max`, `--type-script-scale`
   variables and the `h1–h6 / p / .prose / .eyebrow / [lang="hi"]` blocks if
   you also want the old (looser) behaviour — they live below the `body {}`
   reset in the same file.
3. In `app/fonts.ts`, re-add `"300"` to Inter and `"700"` to Cormorant if any
   page started depending on them in the meantime.

No component, page, or library file was touched in this pass, so a single
file-pair revert restores prior visual state without cascading damage.
