# Siligurievent — Brand Book (V2)

> The visual identity system for **siligurievent.com**. This document is the source of truth for the wordmark, monogram, seal, colour palette, typography pairings, photography direction, voice, co-branding, and forbidden moves. Hand-authored geometry lives in `components/brand/*` and `public/*.svg`. Anywhere this book disagrees with `03-DESIGN-SYSTEM.md` or `03b-DESIGN-V2.md`, **BRAND-V2 wins for brand-mark concerns** (logo, monogram, seal, mark colour use); the design-system docs win for everything else.

---

## 1 · Identity at a glance

| Asset | File | Purpose |
|---|---|---|
| Primary wordmark | `components/brand/wordmark.tsx` (+ `wordmark-paths.ts`) | Site-wide identity — header, footer, hero, OG. |
| Monogram emblem | `components/brand/monogram.tsx` (+ `monogram-paths.ts`) | Favicon, app icon, certificate corners, sealed-letter-style accents. |
| Round seal | `components/brand/seal.tsx` (+ `seal-paths.ts`) | Stamp-of-quality contexts — case-study covers, signage cards, footer corner. |
| Favicon SVG | `public/favicon.svg` | Primary browser-tab favicon (32×32 optimised). |
| Apple touch icon | `public/apple-touch-icon.svg` | iOS home-screen icon (180×180). |
| OG fallback | `public/og-default.svg` | 1200×630 default share image. |

All marks are pure SVG. No web fonts, no rasters in the wordmark itself — the geometry is hand-authored so the identity reads as drawn-not-typeset.

---

## 2 · Wordmark — usage rules

### 2.1 What it is

The wordmark renders the word **Siligurievent** as a single editorial mark. Custom-drawn letterforms with stroke modulation (thick spines, hairline terminals), a mild italic slant (~8°), a jasmine bud flourishing the cap of the `S`, an `i↔g` ligature whose descender loops left under the preceding `i`, a `v↔e` overlap, and a cross-stroke flourish on the `t` finished with a brass tip-dot.

The component:

```tsx
import { Wordmark } from "@/components/brand/wordmark";

<Wordmark size="md" tone="ink" />              // header default
<Wordmark size="lg" tone="cream" layout="stacked" /> // footer default
<Wordmark size="xl" tone="brass" />            // hero
```

### 2.2 Layouts

| Layout | Use |
|---|---|
| `single` | Default — single-line "Siligurievent" with the leading capital `S`. Use in headers, page-title areas, OG images. |
| `stacked` | Two-line "siliguri / event" composition with a thin brass divider between. Use in footers, certificate-style blocks, signage cards. The stacked layout deliberately drops the leading capital — it reads as a deeper monogram (mirrors how Aesop sets its name lower-case on its stacked seal). |

### 2.3 Size rules

| Size | Rendered height | When to use |
|---|---|---|
| `sm` | 20px | Footer eyebrows, tiny chrome contexts |
| `md` | 28px | Site header (default) |
| `lg` | 48px | Footer wordmark slot, hero secondary |
| `xl` | 96px | Hero, splash, OG image, certificate seal |

**Minimum rendered height: 18px.** Below that, prefer the `<Monogram />` emblem — the wordmark's stroke modulation starts to clip at sub-18px and the jasmine bud reads as visual noise.

### 2.4 Clear space

The minimum clear space around the wordmark is **`= height-of-S × 0.8`** — measured from the wordmark's bounding box outward. No type, image, or border may sit inside that quarantine.

```
       ┌─────────────────────────────────────────┐
       │  (clear space = 0.8 × S-height)         │
       │   ┌──────────────────────────┐          │
       │   │       Siligurievent       │          │
       │   └──────────────────────────┘          │
       │                                          │
       └─────────────────────────────────────────┘
```

At default `size="md"` (28px height), the S-height is ~24px → clear space is ~19px on all sides.

### 2.5 Allowed colours

The wordmark accepts only the following tones via the `tone` prop:

| Tone | Token | Use on |
|---|---|---|
| `ink` | `--color-ink-deep` (fallback `--color-ink`) | Light surfaces (`--color-bg`, `--color-cream-jasmine`, hero photography with cream scrim) |
| `brass` | `--color-brass-leaf` | Premium dark surfaces, foil moments, hover states (`--color-ink-deep`, `--color-petrol-midnight`) |
| `cream` | `--color-cream-jasmine` | Dark surfaces, footer, hero overlays (`--color-ink-deep`, `--color-petrol-midnight`) |
| `current` | inherits `currentColor` | When parent already sets text colour; preferred inside themed sections |

**Never invent a new wordmark colour.** Never paint the wordmark in `--color-accent` (wine) — wine is reserved for CTAs and emphasis, not identity. Never paint the wordmark in `--success` / `--error` — those are state colours.

### 2.6 Forbidden — wordmark

1. **No gradients.** The wordmark is a flat ink mark. Brass-foil sweep is allowed only on the *one-off hero closer* H1, never on the wordmark in the header.
2. **No drop shadows.** Sharp silhouette only.
3. **No stretching or squashing.** Width follows the viewBox aspect; never override `width` independently of `height`.
4. **No rotation.** The wordmark is always horizontal. (The stacked layout is a separate composition, not a rotation.)
5. **No outline / stroke-only variants.** The filled silhouette is the wordmark. Outlining strips the stroke modulation that makes it look hand-drawn.
6. **No emoji / icon fusion.** Don't bolt a heart or a lotus onto the wordmark for Diwali; use a marigold accent *next to* the mark instead.
7. **No filters.** No blur, no glow, no neon stroke, no glitter, no chrome bevel.
8. **No background plate.** The wordmark uses `currentColor` — let it breathe on whatever surface it sits on. If contrast fails, swap the tone (don't add a box).
9. **Never re-type the wordmark in HTML.** If you find yourself writing `<span className="font-display italic">Siligurievent</span>` anywhere — stop. Use `<Wordmark />`.
10. **Never set the wordmark in all-caps.** The mark is cased deliberately — `Siligurievent` with one leading cap.

---

## 3 · Monogram — usage rules

### 3.1 What it is

A square SE-emblem with a 5-petal jasmine bloom at the joining stroke. The `S` occupies the left half, the `E` the right half, and the two share a vertex at the centre where the jasmine sits. Three variants:

| Variant | Use |
|---|---|
| `filled` (default) | Favicons, app icons, social profile avatars, dense small-scale chrome. |
| `outlined` | Watermarks, certificate interiors, deboss-style print. |
| `twoTone` | Larger placements — spines paint `currentColor`, bloom paints brass. Best on cream surfaces. |

### 3.2 Size buckets

| Size | px side | When to use |
|---|---|---|
| `favicon` | 32 | Browser tabs, OS pin |
| `sm` | 48 | Mobile chrome |
| `md` | 64 | Default inline (avatars, badges) |
| `lg` | 96 | Section dividers, footer signature |
| `xl` | 160+ | Certificate, signage |

### 3.3 Clear space

Minimum clear space around the monogram = **side × 0.25** — i.e. a 64px monogram demands a 16px halo on all sides.

### 3.4 Forbidden — monogram

1. No rotation.
2. No skewing.
3. No colour-shifting the bloom — it is *always* brass on cream surfaces, *always* brass on dark surfaces. The bloom is the one consistent foil moment in the entire identity.
4. No replacing the bloom with another bloom (rose, marigold, lotus). The jasmine is the brand-specific bloom.
5. No background colour fill behind the monogram except the cream `#F4ECDF` plate already baked into `favicon.svg`. Don't introduce other backgrounds.
6. No stretching to non-square aspect.

---

## 4 · Seal — usage rules

### 4.1 What it is

A round badge composing the monogram inside a marigold rosette, ringed by hand-drawn type set along the curve: **"SILIGURIEVENT · NORTH BENGAL · EST. {year}"**. Includes two concentric circles, 12 rosette petals, cardinal tick marks at 45/135/225/315°, and a small jasmine accent at 6 o'clock.

### 4.2 When to use the seal vs the wordmark

| Context | Use |
|---|---|
| Primary site identity (header / page title) | **Wordmark** |
| Footer brand slot | **Wordmark** (stacked) |
| Case-study cover overlay (small) | **Seal** |
| "Established 2017" trust block | **Seal** |
| Certificate / thank-you card / signage corner | **Seal** |
| Footer right-corner brand mark | **Seal** (`size="sm"`) |
| Event-day place card | **Seal** (`size="md"`) |
| Email signature | **Wordmark** (single) |
| Press kit cover | **Wordmark** + **Seal** stacked |

If both feel right — use the wordmark. The seal is the rarer move.

### 4.3 Forbidden — seal

1. No rotation. The seal is gravity-aligned: top of the type-strip is true north.
2. No re-typing the seal's text. The string is drawn glyph-by-glyph; the only acceptable customisation is the `year` prop.
3. No swapping the rosette for another motif.
4. No removing the inner monogram — the seal without the SE inside is just a circle.
5. No filling the rings with colour — the rings are hairlines.
6. No drop shadow on the seal. If the seal needs separation from its surface, lift it onto a cream-jasmine plate or change tone.

---

## 5 · Colour palette — consolidated

The site currently carries two overlapping palettes (baseline `03 §3.1` and V2 `03b §3b.1`). This section consolidates them into one set with clear roles. **No new tokens are introduced here** — only mappings.

### 5.1 Master palette

| Token | Hex | RGB | CMYK (approx) | Role | Pairs |
|---|---|---|---|---|---|
| `--color-bg` | `#FAF7F2` | 250,247,242 | 0,1,3,2 | Page background — warm ivory | Pairs with `--color-ink` (AAA), `--color-accent` (AA Normal) |
| `--color-bg-elevated` | `#FFFFFF` | 255,255,255 | 0,0,0,0 | Cards, modals | Pairs with `--color-ink` |
| `--color-ink` | `#1A1714` | 26,23,20 | 0,12,23,90 | Primary text, body | Pairs with `--color-bg` (AAA Normal) |
| `--color-ink-deep` | `#0F0C09` | 15,12,9 | 0,20,40,94 | Hero text, premium dark backgrounds, **wordmark `tone="ink"`** | Pairs with `--color-cream-jasmine` (AAA), `--color-bg` (AAA) |
| `--color-ink-muted` | `#5C544B` | 92,84,75 | 0,9,18,64 | Secondary text | Pairs with `--color-bg` |
| `--color-ink-soft` | `#8A8074` | 138,128,116 | 0,7,16,46 | Tertiary / metadata | Pairs with `--color-bg` (Large only) |
| `--color-cream-jasmine` | `#F4ECDF` | 244,236,223 | 0,3,9,4 | Cards on dark, callouts, **wordmark `tone="cream"`** | Pairs with `--color-ink-deep` (AAA), `--color-petrol-midnight` (AA) |
| `--color-accent` | `#8B1A1A` | 139,26,26 | 0,81,81,45 | Wine — primary CTA stroke, links on hover | Pairs with `--color-bg` (AAA), `--color-cream-jasmine` (AAA) |
| `--color-accent-deep` | `#5A0E0E` | 90,14,14 | 0,84,84,65 | Pressed CTA state | Pairs with `--color-bg` |
| `--color-blood-saffron` | `#6B1418` | 107,20,24 | 0,81,78,58 | Emphasis-on-dark, Bridal look mode accent, italic emphasis in display | Pairs with `--color-cream-jasmine` (AAA), `--color-bg` (AAA) |
| `--color-gold` | `#B8893A` | 184,137,58 | 0,26,68,28 | Baseline brass — dividers, micro details | Pairs with `--color-ink-deep` (AA Large) |
| `--color-brass-leaf` | `#A47A2C` | 164,122,44 | 0,26,73,36 | Rich gold-foil — wordmark `tone="brass"`, monogram bloom, M4 foil text | Pairs with `--color-ink-deep` (AA), `--color-cream-jasmine` (AA Large) |
| `--color-gold-soft` | `#E8D5A8` | 232,213,168 | 0,8,28,9 | Highlight background tint | Pairs with `--color-ink` |
| `--color-cool` | `#1E2A38` | 30,42,56 | 46,25,0,78 | Sparing cool contrast | Pairs with `--color-cream-jasmine` |
| `--color-petrol-midnight` | `#0E1C26` | 14,28,38 | 63,26,0,85 | Footer background, Editorial look mode background, deeper cool counter | Pairs with `--color-cream-jasmine` (AAA) |
| `--color-success` | `#3E6B47` | 62,107,71 | 42,0,34,58 | Form success | Pairs with `--color-bg` |
| `--color-error` | `#9B2C2C` | 155,44,44 | 0,72,72,39 | Form error | Pairs with `--color-bg` (AA) |
| `--color-border` | `rgba(26,23,20,0.08)` | — | — | Hairline dividers | — |

### 5.2 Redundancies + recommended consolidation

The current token set carries three overlapping warm-red and two overlapping brass tokens. Recommendation:

| Group | Tokens | Recommendation |
|---|---|---|
| Warm-red family | `--color-accent` (`#8B1A1A`), `--color-blood-saffron` (`#6B1418`), `--color-error` (`#9B2C2C`) | **Keep all three.** They serve distinct roles: `accent` is the CTA wine (lighter, brand voice), `blood-saffron` is the emphasis-on-dark (deeper, used sparingly), `error` is the form-state colour (slightly warmer, semantic). The differences are intentional and read distinctly when paired with the correct background. **Do not collapse `accent` into `blood-saffron`** — `accent` reads better at small CTA sizes on `--color-bg`. |
| Brass family | `--color-gold` (`#B8893A`), `--color-brass-leaf` (`#A47A2C`) | **Keep both, with clear roles.** `--color-gold` is the legacy hairline/divider/micro-detail brass — used wherever a token is needed for "brass-ish neutral." `--color-brass-leaf` is the premium foil colour — used for the wordmark, the monogram bloom, the M4 brass-foil text effect, hero halos. The 1-step darker `brass-leaf` photographs as actual gold leaf where `gold` reads as honey. |
| Ink family | `--color-ink` (`#1A1714`), `--color-ink-deep` (`#0F0C09`) | **Keep both.** `ink` is for body copy (AAA on `--bg`). `ink-deep` is for hero text, the wordmark, and premium dark backgrounds where extra punch matters. The 6-unit lift is intentional. |
| Cream/ivory family | `--color-bg` (`#FAF7F2`), `--color-bg-elevated` (`#FFFFFF`), `--color-cream-jasmine` (`#F4ECDF`) | **Keep all three.** `bg` is the warm page tint. `bg-elevated` is the card highlight. `cream-jasmine` is the warmer, slightly pinker tone used as text colour on dark surfaces. Never use `cream-jasmine` as a page background — it's a foreground / on-dark token. |
| Cool family | `--color-cool` (`#1E2A38`), `--color-petrol-midnight` (`#0E1C26`) | **Keep both.** `cool` is the sparing colour-accent (used in micro-illustrations, badge backgrounds). `petrol-midnight` is the footer + dark-section background — deeper, more pigmented. |

**No tokens are slated for removal.** The two-tier palette structure (baseline + V2) is intentional: V2 tokens lift the ceiling, baseline tokens cover the broad case. The pairing rules above make the choice mechanical, not artful.

### 5.3 Brand-mark colour contract

The wordmark, monogram, and seal observe only these colour combinations:

| Surface | Mark tone | Why |
|---|---|---|
| `--color-bg` (warm ivory page) | `tone="ink"` | Standard light context — deep ink + warm cream is the editorial register. |
| `--color-cream-jasmine` (card on dark) | `tone="ink"` | Same. |
| `--color-ink-deep` (premium dark hero) | `tone="cream"` for default, `tone="brass"` for foil moments only | Cream is the workhorse on dark; brass is the gala-night version. |
| `--color-petrol-midnight` (footer) | `tone="cream"` | Cream-jasmine reads cleanly here; brass on petrol is too muddied. |
| Photography (any) | `tone="cream"` on a `--scrim-cinematic` overlay only | Never put the wordmark over raw photography without the cinematic scrim — the silhouette gets lost in busy florals. |

---

## 6 · Typography pairing — at the brand level

The system supports three faces. Brand-mark surfaces follow a strict pairing rule:

| Slot | Face | Weight / style | Use |
|---|---|---|---|
| Display (default) | Cormorant Garamond | 400 italic | All H1 / H2, pull quotes, editorial accents |
| Editorial (premium) | Reckless Neue Variable | 300–500, wide opsz | Hero closer, case-study cover, About origin story, 404 |
| Body / UI | Inter Variable | 380–500 wght | All body copy, navigation, buttons, captions |
| Script accent (rare) | Cormorant SC italic | small caps | Founder signature line, "Plan My Event" decorative underline only |
| Devanagari (Hindi) | Tiro Devanagari Hindi (display) + Noto Sans Devanagari (body) | — | All Hindi locale type |
| Bengali (post-launch) | Tiro Bangla (display) + Noto Sans Bengali (body) | — | All Bengali locale type |

**The wordmark is never set in any of these.** The wordmark is the hand-drawn SVG mark — when the wordmark needs to appear in a heading slot, render `<Wordmark />`, not styled text. The brand identity stays inviolate.

Pairing rule for the brand surfaces (header, footer, hero):

- Header → Wordmark + Inter for nav.
- Hero → Wordmark + Cormorant or Reckless for the H1.
- Footer → Wordmark stacked + Inter for sitemap + Cormorant SC `Eyebrow` for column titles.

Never set the wordmark and a similar-weighted italic Cormorant headline side-by-side — they visually collide. Let the wordmark do the editorial work in the chrome and Cormorant take the H1.

---

## 7 · Photography direction (brand-mark surface)

(See `09-IMAGE-PROMPTS.md` / Gemini Prompt Book for full direction.)

When photography lives next to the wordmark — hero panels, case-study covers, OG images — the photography must observe two rules. **(1)** A single warm accent reads through the frame (jasmine cream, terracotta, brass, burgundy velvet, midnight silk — pick ONE). **(2)** A soft cinematic scrim sits between the photography and the mark so the wordmark silhouette stays crisp. Use `--scrim-cinematic` (a 72% `--color-ink-deep` overlay in oklab) on dark heroes; on light heroes, target a desaturated highlight zone where the mark sits. Never place the wordmark over a busy floral or a high-contrast face — the eye loses the mark inside three breaths.

---

## 8 · Voice on brand surfaces

Confident, never boastful; specific, never generic; warm but not saccharine. The brand voice is the editorial register of `01-PROJECT-VISION.md §1.5` — we work *with* families, we don't shout *at* them. When the wordmark sits alongside copy (hero subtitle, OG tagline, seal tagline), the copy holds the same register: short, specific, declarative. The tagline `"Cinematic decor for North Bengal's celebrations."` is the canonical example. Never pair the wordmark with exclamation marks, emoji, all-caps shouting, or saccharine fairy-tale language. The mark is quiet; let it stay quiet.

---

## 9 · Co-branding (partner-hotel logo strip)

When the Siligurievent wordmark sits in a partner logo strip (Mayfair, Cinnamon Grand, Sinclair's, etc.), observe the following geometry:

| Slot | Rule |
|---|---|
| Strip background | `--color-bg` or `--color-cream-jasmine` — never dark. Partner marks were not designed for dark surfaces and read poorly. |
| Strip height | 64px desktop, 48px mobile. Wordmark `size="md"` (28px) sits 18px from top and bottom — generous breathing room. |
| Wordmark position | First or last in the strip. The Siligurievent mark anchors the row; never in the middle. |
| Partner mark height | Match the Siligurievent wordmark's height ±2px. Larger partner marks pull focus; smaller ones look subordinate. |
| Inter-mark spacing | Minimum 48px between marks. No vertical dividers between partner logos — let the marks breathe. |
| Hover state | None. The strip is a trust signal, not a navigation row. |
| Alt text | Each partner mark needs a real `alt`, never empty. |

For partner-mark licensing, format approval, and the trademark/usage-rights process, defer to `docs/PARTNER-LOGO-RESEARCH.md` (forthcoming). The Siligurievent wordmark is the *only* mark in the strip that may not be substituted by a partner-provided file — it is always rendered live via `<Wordmark />` so the brand identity stays canonical and the strip self-updates.

---

## 10 · Don'ts gallery

The 12 explicit don'ts — eight is the brief; we kept going because the Indian decor web is full of these traps.

1. **No rainbow / multi-stop gradients on the wordmark.** Flat fill only. Brass-foil sweep is allowed only as an M4 effect on one-off hero H1, never on the chrome wordmark.
2. **No drop shadows on any brand mark.** No `filter: drop-shadow`, no `box-shadow`, no "glow." The wordmark, monogram, and seal cast no shadow.
3. **No rotation of the monogram or the seal.** Both are gravity-aligned. If the layout *demands* angled placement, you have the wrong layout.
4. **No stretching the wordmark.** The height-aspect contract in `Wordmark` is the only sanctioned scaling.
5. **No neon-stroke / outline-only "modern" wordmark variant.** The stroke modulation is the identity; stripping it kills the mark.
6. **No glittery / sparkle / animated chrome on the brand marks.** No CSS-animated brass shimmer on the header wordmark. The mark is a stable anchor — animation happens *around* it.
7. **No emoji or icon fusion.** Don't put a heart in place of the `i` dot for Valentine's. Don't put a marigold in place of the `o` for Diwali. Theme the page, not the mark.
8. **No background plate behind the wordmark in body content.** The wordmark uses `currentColor` and breathes on its surface. If contrast fails, change tone; don't box it.
9. **No off-system colour fill.** Never `tone="current"` over an unthemed parent. Pass `tone` explicitly when the parent isn't a known theme context.
10. **No re-typing "Siligurievent" anywhere.** No `<span>Siligurievent</span>`, no `Siliguri Events` (two words is wrong), no `SE` written out in text. The wordmark renders the brand; everywhere else the brand is referenced, use the word `Siligurievent` exactly.
11. **No mixing the seal text with marketing copy.** The seal text is "SILIGURIEVENT · NORTH BENGAL · EST. {year}" — that string is sacred. Don't insert "WEDDINGS" or "DECORATORS" into the ring.
12. **No use of the brand marks as link icons inside body copy.** The wordmark is identity, not iconography. For inline links use `<Link>`. For inline brand references in long-form, use the word `Siligurievent`.

---

## 11 · Asset export checklist (manual, no tooling in this PR)

The SVG sources for favicons / OG are in `public/`. Raster exports are pending — owner or main agent to produce them with an SVG-to-PNG tool. Suggested exports:

| Source | Outputs |
|---|---|
| `public/favicon.svg` | `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon.ico` (multi-res ICO containing 16/32/48) |
| `public/apple-touch-icon.svg` | `apple-touch-icon.png` (180×180) |
| `public/og-default.svg` | `og-default.png` (1200×630, 90% JPEG quality also acceptable as `og-default.jpg`) |

Recommended tooling — any of:

- `sharp` (Node): `sharp("favicon.svg").resize(32).png().toFile("favicon-32.png")`
- `rsvg-convert` (cairo): `rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32.png`
- `inkscape` (CLI): `inkscape favicon.svg --export-filename favicon-32.png --export-width=32 --export-height=32`
- Vercel OG (`@vercel/og`): can substitute `og-default.svg` for dynamic, per-route OG generation; the static SVG fallback covers crawlers that fail dynamic.

Once rasters exist, wire them in `app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { images: ["/og-default.jpg"] },
};
```

---

## 12 · Versioning

This brand book is V2. Bumps require a written rationale in the file header. Don't silently mutate path data in `*-paths.ts` — those files carry comments showing each letter's metric so a designer can adjust without re-deriving; if you change them, update the comments too.

End of brand book.
