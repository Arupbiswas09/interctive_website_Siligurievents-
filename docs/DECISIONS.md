# Decisions Log

Decisions made during planning sign-off, in order. This file overrides the relevant "default" sections in other docs.

---

## D-001 · 2026-05-16 · CMS: Payload CMS 3

**Decision**: Payload CMS 3 (as recommended in [02-TECH-STACK.md §2.5](./02-TECH-STACK.md)).

**Implications**: Single Vercel deploy, admin at `/admin`, Neon Postgres + Vercel Blob storage adapter, Lexical rich text, full type safety from generated types.

---

## D-002 · 2026-05-16 · Pricing: hybrid bands (₹ · ₹₹ · ₹₹₹)

**Decision**: Public site shows price *bands* per package, not specific rupee numbers.

**Implications (overrides)**:

- **[08-CMS-PLAN.md `packages` collection](./08-CMS-PLAN.md)** — replace `startingPrice: number` with:
  - `priceBand: select { '₹' | '₹₹' | '₹₹₹' }` (public, required)
  - `startingPriceInternal: number` (admin-only, used by owner for internal quoting only — never rendered publicly)
- **[05-PAGE-SPECS.md §5.7 Pricing](./05-PAGE-SPECS.md)** — price cards show ₹ / ₹₹ / ₹₹₹ badge, plus a "What's included" list, plus the band's typical range as a copy-line ("most ₹₹ weddings land between 50–120 guests, 1–2 days"). NO specific INR figures.
- **[07-SEO-STRATEGY.md §7.6](./07-SEO-STRATEGY.md)** — `Service` schema `offers.priceRange` uses the band string (`"₹₹"`) instead of a numeric price. We still emit `priceCurrency: "INR"`.
- **[01-PROJECT-VISION.md §1.6](./01-PROJECT-VISION.md)** — USP #4 reworded to "Honest pricing bands, custom quotes from there" (not "transparent starting prices").

**Why the hybrid**: keeps the SEO/lead-quality advantage of being upfront, without revealing competitor-poachable figures. Owner controls actual numbers privately in CMS.

---

## D-003 · 2026-05-16 · Languages: English + Hindi at launch

**Decision**: Launch bilingual. English primary, Hindi secondary. Bengali deferred to post-launch.

**Implications (overrides)**:

- **Stack additions**: `next-intl` from Sprint 1 (not deferred to Sprint 6).
- **Routing**: `/en/...` and `/hi/...`. Root `/` redirects to `/en/` (or via `Accept-Language` detection — see below).
  - **Language detection**: server-side via `next-intl` middleware reading `Accept-Language` → default to `en` for `en-*`, `hi` for `hi-*`, else `en`.
  - Language switcher in header: simple "EN / हि" toggle, persisted via cookie.
- **Fonts**: Add **Noto Serif Devanagari** (display) + **Noto Sans Devanagari** (body) alongside Cormorant + Inter. Subsetted per locale to keep payload small.
- **CMS collections** (Payload):
  - All public-facing text fields become `localized: true` per locale (`en`, `hi`).
  - Pricing bands stay locale-agnostic (₹ symbol works in both).
  - Service slugs stay English-stable (`/services/wedding`, `/hi/services/wedding`) — owner doesn't have to think about Hindi slugs.
- **Image alt text**: localized per locale.
- **SEO**:
  - `hreflang` tags on every page: `en-IN`, `hi-IN`, `x-default`.
  - Locale-specific OG images via `/api/og?locale=hi`.
  - Sitemap entries per locale.
- **Performance**: Devanagari subsets (Noto Serif Devanagari display + Noto Sans Devanagari body) realistically add **~80–120 KB** to `/hi/*` routes even after Devanagari-only subsetting — the conjunct ligature set is large. Combined with Cormorant + Inter, total font payload on `/hi/*` lands in the ~200–280 KB range. English routes stay slim. The `/hi/*` LCP target is therefore **2.5s p75** (not 2.0s); see [10-PERFORMANCE.md §10.5](./10-PERFORMANCE.md) for per-locale preload strategy.
- **Owner workflow**: Payload admin shows side-by-side English + Hindi tabs for every text field. Owner can save EN only and publish; HI fields fall back to EN with a "missing translation" badge until filled. **Hindi content for launch**: owner translates the ~6 most-trafficked pages first (Home, Services index, Wedding service, Pricing, Contact, About) — other pages can stay EN-fallback at launch and be translated progressively.
- **Roadmap update**: Sprint 1 scaffolds the i18n shell. Sprint 3 onwards, every component renders from translations. Sprint 6 launch QA includes Hindi review.

**Bengali post-launch path**: Already prepared. Adding `bn` locale will be a CMS toggle + Noto Bengali fonts + content translation. No re-architecture.

---

## D-004 · 2026-05-16 · Go-signal: scaffold Sprint 1 immediately

**Decision**: Begin Sprint 1 (Foundation) immediately. Gemini prompts arrive in parallel.

**Implications**: Owner is unblocked. I'll scaffold the Next.js 16 project, configure Tailwind v4, fonts (incl. Devanagari), motion infra, primitives, and the `/_design` page. Real images come in via Payload once Sprint 2 lands the CMS.

---

## Outstanding owner-supplied inputs (not blocking scaffold)

| Item | When needed |
|---|---|
| Business phone & WhatsApp number | Sprint 4 (Contact page wire-up) |
| Business email | Sprint 4 |
| Postal address | Sprint 4 (Contact + Footer + LocalBusiness schema) |
| Founder name & founded year | Sprint 3 (About page) |
| Founder portrait + team headshots | Sprint 3 (About page) — placeholder until provided |
| Domain choice | Sprint 6 (Launch) |
| First batch of Gemini prompts (HERO-01..07, WORK-01..05, SVC-01..07, ABOUT-01..02, MOTIF-*) | Sprint 3 |
| Social media handles | Sprint 4 (Footer + schema sameAs) |
| GST / business registration | Sprint 4 (Footer fine print + Terms page) |
