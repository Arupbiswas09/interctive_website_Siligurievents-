# 03 — Design System

The visual grammar of Siligurievent. Every component pulls from these tokens.

## 3.1 Color tokens

### Palette philosophy
Editorial luxury. Restrained base, single warm accent, one cool counterpoint, deep neutrals. Indian wedding palettes can drift into "every saturated color in one frame" — we resist that.

### Light theme
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAF7F2` | Page background — warm ivory |
| `--bg-elevated` | `#FFFFFF` | Cards, modals |
| `--ink` | `#1A1714` | Primary text — near-black, warm |
| `--ink-muted` | `#5C544B` | Secondary text |
| `--ink-soft` | `#8A8074` | Tertiary, metadata |
| `--accent` | `#8B1A1A` | Wine — brand primary (CTAs, links on hover) |
| `--accent-deep` | `#5A0E0E` | Wine pressed state |
| `--gold` | `#B8893A` | Brass gold — accents, dividers, micro details |
| `--gold-soft` | `#E8D5A8` | Background tint for highlight sections |
| `--cool` | `#1E2A38` | Midnight blue — used sparingly for contrast |
| `--success` | `#3E6B47` | Form success |
| `--error` | `#9B2C2C` | Form error |
| `--border` | `rgba(26,23,20,0.08)` | Hairline dividers |

### Dark theme (used for hero sections, gallery overlays, immersive blocks)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0E0B08` | Charcoal warm-black |
| `--bg-elevated` | `#1A1612` | Cards |
| `--ink` | `#F5EDE0` | Cream-ivory text |
| `--ink-muted` | `#B8A992` | Secondary |
| `--ink-soft` | `#7A6E5E` | Tertiary |
| `--accent` | `#D4A574` | Warm gold-cream on dark |
| `--accent-deep` | `#B8893A` | Accent hover |
| `--gold` | `#E8D5A8` | Highlight |
| `--cool` | `#A8C5E0` | Cool accent |
| `--border` | `rgba(245,237,224,0.08)` | Dividers |

### Implementation
```css
@theme {
  --color-bg: light-dark(#FAF7F2, #0E0B08);
  --color-ink: light-dark(#1A1714, #F5EDE0);
  --color-accent: light-dark(#8B1A1A, #D4A574);
  /* … */
}

:root { color-scheme: light dark; }
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }
```

## 3.2 Typography

### Type families
- **Display**: `"Cormorant Garamond"` — serif, italic available, dramatic display weights. For all H1/H2 and editorial pull quotes.
- **Body & UI**: `"Inter"` — variable, neutral, performant.
- **Mono (rare)**: `"JetBrains Mono"` — only on admin/dev surfaces.
- **Script accent (optional)**: `"Allura"` or `"Cormorant SC"` italic — one-time decorative moments. Reserved.
- **Devanagari (post-launch)**: `"Noto Serif Devanagari"` for Hindi.
- **Bengali (post-launch)**: `"Noto Serif Bengali"` for Bengali.

### Loading
```ts
// app/fonts.ts
import { Cormorant_Garamond, Inter } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
```

### Type scale (fluid via `clamp`)
| Token | Mobile → Desktop | Use |
|---|---|---|
| `--text-xs`  | 12px → 13px | Eyebrow labels, captions |
| `--text-sm`  | 14px → 15px | Secondary copy |
| `--text-base`| 16px → 17px | Body |
| `--text-lg`  | 18px → 20px | Lead paragraphs |
| `--text-xl`  | 22px → 28px | Sub-headings |
| `--text-2xl` | 28px → 40px | H3 |
| `--text-3xl` | 36px → 56px | H2 |
| `--text-4xl` | 48px → 80px | H1 |
| `--text-5xl` | 64px → 120px | Hero display |
| `--text-6xl` | 80px → 180px | Marquee/oversized accent |

Implementation:
```css
--text-4xl: clamp(3rem, 2rem + 5vw, 5rem);
```

### Type rules
- Display headings use `font-display`, weight 400 italic by default.
- Letterspacing: tight on display (`-0.02em` to `-0.04em`), neutral on body, generous on uppercase labels (`+0.12em`).
- Line height: 1.0–1.05 on display, 1.5 on body.
- No more than ~65 characters per line in body.
- Avoid all-caps except for tiny eyebrow labels and footer.

### Hero example
```
<h1>
  <span class="eyebrow">North Bengal Decorators</span>
  <span class="display">
    Cinematic decor for <em>celebrations</em><br/>
    you'll remember in stills.
  </span>
</h1>
```

## 3.3 Spacing scale

Multiples of 4, named semantically.

| Token | px | Use |
|---|---|---|
| `space-1` | 4 | Tight icon padding |
| `space-2` | 8 | Form inner |
| `space-3` | 12 | Button x-padding |
| `space-4` | 16 | Default gap |
| `space-6` | 24 | Card inner |
| `space-8` | 32 | Section inner |
| `space-12` | 48 | Block separation |
| `space-16` | 64 | Section padding mobile |
| `space-24` | 96 | Section padding desktop |
| `space-32` | 128 | Hero breathing room |
| `space-48` | 192 | Editorial gutters |

## 3.4 Grid & layout

- Page max-width: `1440px`. Beyond that, content centers and outer margins grow.
- Hero sections: full-bleed (no max-width).
- Editorial grid: 12 cols desktop, 6 cols tablet, 4 cols mobile.
- Gutter: `clamp(16px, 2vw, 32px)`.
- Asymmetric layouts encouraged — break the grid for hero moments.

## 3.5 Border, radius, shadow

- **Radius**: minimal. `--radius-sm: 2px`, `--radius-md: 4px`, `--radius-lg: 8px`. NO pill buttons, NO round-everything. Sharp edges read luxury.
- **Border**: `0.5px solid var(--border)` for editorial dividers. Hairlines only.
- **Shadow**: use sparingly. `--shadow-card: 0 10px 40px -10px rgba(0,0,0,0.12)`. Most depth comes from contrast and motion, not shadows.

## 3.6 Iconography

- **lucide-react** — clean, geometric, consistent stroke (1.5px).
- Override stroke to 1.25px for premium feel.
- Custom SVGs for: marigold mark, mandap mark, lamp/diya mark, jasmine wreath — used as section dividers and brand stamps.

## 3.7 Imagery rules

- **Aspect ratios** allowed: 16:9, 4:5, 1:1, 3:2, 2:3. Mix them for editorial rhythm.
- **Always** ship `blurDataURL` (BlurHash or Plaiceholder).
- **Always** use `next/image` with `sizes` set.
- AVIF first, WebP fallback, JPG last.
- Max dimensions stored: 2400px on long edge. CMS-side validation rejects larger uploads.
- Galleries: lazy-load below the fold.

## 3.8 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default reveal |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Section transitions |
| `--ease-emphatic` | `cubic-bezier(0.85, 0, 0.15, 1)` | Heroic moments |
| `--ease-spring` | (Framer Motion `{ type: "spring", stiffness: 120, damping: 18 }`) | UI components |
| `--duration-fast` | `200ms` | Hover, focus |
| `--duration-base` | `400ms` | Standard reveal |
| `--duration-slow` | `800ms` | Hero reveals |
| `--duration-cinematic` | `1400ms` | Hero scrub |

Reduced-motion override: all durations collapse to `1ms`, transforms become opacity-only.

## 3.9 Component primitives (initial set)

These are built first in Phase 1 against the design system page (`/_design`).

- `<Container>` — responsive max-width + padding
- `<Section>` — vertical rhythm wrapper
- `<Eyebrow>` — small uppercase tracker label
- `<DisplayHeading>` — H1/H2 with split-text capability
- `<Button>` — variants: primary, ghost, link, icon; sizes: sm/md/lg
- `<Link>` — underlined on hover, accent color
- `<Image>` — wraps next/image with blur + sizes defaults
- `<RevealOnScroll>` — generic reveal wrapper (GSAP)
- `<Parallax>` — speed-controlled translate on scroll
- `<SplitterReveal>` — letter/word animation on enter (wraps our in-repo splitter primitive; NOT the paid GSAP SplitText plugin — see `02-TECH-STACK.md §2.4`)
- `<MagneticButton>` — cursor magnetism for CTAs
- `<Marquee>` — infinite-scroll text/image row
- `<Lightbox>` — gallery image expanded with shared-element transition
- `<Card>` — editorial card with image + caption
- `<Tag>` — pill-less, hairline-bordered category label
- `<StickyContact>` — WhatsApp + call FAB
- `<InquiryForm>` — multi-step
- `<TestimonialBlock>` — quote + author + portrait
- `<PriceCard>` — package display

## 3.10 Internal design system page

Build `/app/_design/page.tsx` early. Renders:
- All tokens (color, type, spacing, motion).
- All primitive components in every state.
- Motion playground (each motion primitive triggerable).
- Visible only in dev or behind a basic-auth gate in production.

## 3.11 Awwwards reference set

While designing, keep these tabs open:

- **Locomotive Studio** — typographic restraint, scroll mastery.
- **Active Theory** — cinematic transitions.
- **The North Face — Pinnacle** — image-driven storytelling.
- **Pitch.com** — editorial polish on a product site.
- **Resn.co.nz** — interactive boldness.
- **Eternal-themes** / Awwwards SOTD recent wedding sites — palette and luxury cues.

When a section is built, ask: "would this hold up next to those?" If no — keep iterating.
