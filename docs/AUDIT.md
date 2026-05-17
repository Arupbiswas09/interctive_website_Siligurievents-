# AUDIT — Siligurievent planning + early scaffolding

> Senior-partner review of `/CLAUDE.md`, `/PLAN.md`, `/README.md`, `docs/01..12`, `docs/DECISIONS.md`, and the empty scaffolding in `app/`, `components/`, `lib/`. No `content/` directory exists yet. Auditor: ruthless mode.

---

## Executive read

The plan is **above average for a small studio brief** but **not yet on a credible path to Awwwards SOTD in six sprints**. The strengths are real: a clean stack pick (Next 16 + Payload 3 + Tailwind v4 + GSAP + Lenis), a thoughtful audience segmentation in `01-PROJECT-VISION.md §1.4`, a serious motion catalogue in `06-ANIMATION-STRATEGY.md §6.4`, a sensible information architecture, and a `DECISIONS.md` that already overrides drift between docs (pricing bands, EN+HI launch).

The plan is **overconfident** in three places. First, the perf math: a hero-image-heavy site targeting LCP < 2.0s on a Pixel 4a 4G profile from Mumbai (`10-PERFORMANCE.md §10.1`) while loading Cormorant 5 weights + 2 styles + Inter variable + Noto Devanagari (×2) on `/hi/*` (`DECISIONS.md D-003`) is physically tight; nothing in the docs proves the math holds. Second, the scope: 19 services × 5 hero/detail shots + 6 case studies × ~25 shots + 7 locations + blog = **~355 images** (`09-IMAGE-PROMPTS.md` totals) sourced entirely from Gemini and uploaded by a non-technical owner from a phone — the bottleneck is the human, not the pipeline, and the schedule pretends otherwise. Third, the six-sprint timeline: Sprint 2 (CMS spine) is a Payload-3-on-Next-16-canary integration, custom-themed, mobile-first, with localized fields, role-gated pricing, IndexNow hooks, Resend on inquiry, and a custom dashboard — that is genuinely two sprints if done well.

The plan is **under-spec'd** on: spam protection (`11-DEPLOYMENT.md §11.11` waves at "hCaptcha or Turnstile" without picking), HEIC/EXIF pipeline cost on Fluid Compute cold-starts, Lexical→JSON-LD article body extraction, hreflang implementation specifics with `next-intl` and 133 programmatic pages, GSAP SplitText licensing, and what "mobile-first Payload admin" actually costs to build.

**Verdict: not on track for SOTD in 6 sprints as currently scoped.** It's on track for a *very good* regional decorator site in 8–10 sprints. Awwwards judging weights Creativity and Mobile heavily; current plan ships strong Usability/Content but the Creativity hook ("cinematic decor") is a vibe, not yet a signature interactive moment that a juror will remember. See "Awwwards reality check" below.

---

## Cross-doc inconsistencies

1. **Pricing model contradicts itself in three places.** `DECISIONS.md D-002` ratifies hybrid bands (`₹/₹₹/₹₹₹`) and explicitly states "**NO specific INR figures**" on `05-PAGE-SPECS.md §5.7`. But:
   - `05-PAGE-SPECS.md §5.7` still reads "Essence — entry tier, starting from ₹X / Signature — starting from ₹Y / Atelier — starting from ₹Z" and "Each card: name, **starting price**".
   - `05-PAGE-SPECS.md §5.4` step 5 still says "**Pricing teaser** — starting price + 'See packages →'".
   - `01-PROJECT-VISION.md §1.6` USP #4 still reads "**Transparent starting prices.** Every package on the site has a starting figure."
   - `07-SEO-STRATEGY.md §7.5` Pricing meta-description literally says "**Transparent starting prices** for wedding..." and the example schema `§7.6` emits `"price": "150000"`.
   - `08-CMS-PLAN.md §8.2 services` row 9 still has `startingPrice | number (INR) | Optional; admin-only visible`, and the `packages` table row 4 says `startingPrice | number (INR)` with no `priceBand` field.
   The decisions log overrides four docs that have not been edited. Anyone who reads top-to-bottom will build the wrong pricing UI.

2. **Cultural scope mismatch.** `PLAN.md §1.5` lists "**Bengali/Hindu/Marwari/Nepali/Sikh/Muslim/Christian**" weddings. `README.md` line 3 lists "**Bengali, Hindu, Marwari, Nepali, Punjabi**" — Sikh/Muslim/Christian dropped, Punjabi added. `04-INFORMATION-ARCHITECTURE.md §4.1` /services has neither Sikh, Muslim, Christian, nor Punjabi as discrete slugs — just `/services/wedding` and `/services/bengali-wedding`. SEO Tier 1 keywords `07-SEO-STRATEGY.md §7.3` capture "bengali wedding" but no Marwari/Nepali/Sikh/Muslim/Christian keyword. The brief promises breadth the IA doesn't deliver.

3. **GSAP SplitText is named everywhere; license is mentioned nowhere.** `CLAUDE.md` line 26, `02-TECH-STACK.md §2.4` (`GSAP 3 + ScrollTrigger + SplitText + Observer`), `03-DESIGN-SYSTEM.md §3.9` (`<SplitTextReveal>`), `05-PAGE-SPECS.md §5.1 H1 §5.1 H3` (Quote letters via SplitText), `06-ANIMATION-STRATEGY.md §6.4 MO-01` and `§6.10` (Home hero timeline depends on SplitText). As of May 2024 GSAP moved its premium plugins (SplitText, MorphSVG, etc.) to free under Webflow, BUT plugin licensing has shifted historically and the plan must (a) confirm the current licensing for commercial sites and (b) include the plugin URL in the package list. `02-TECH-STACK.md §2.17` lists `gsap` only — no SplitText package. This will be discovered at install time, not plan time.

4. **CMS choice is "decided" twice with contradiction.** `DECISIONS.md D-001` says Payload is chosen, but `02-TECH-STACK.md §2.5` still ends with "**Decision needed from owner before Phase 2**: Payload (recommended) or Sanity?" and `PLAN.md §4.1` says "Confirm tech choices... especially Payload CMS vs Sanity." The decision overrides aren't replicated upstream.

5. **i18n timeline conflict.** `02-TECH-STACK.md §2.13` calls i18n a "**post-launch hook**" and `12-ROADMAP.md` post-launch Month 4–6 says "Add Hindi + Bengali via `next-intl`". But `DECISIONS.md D-003` overrides this to ship bilingual EN+HI at launch and adds Devanagari fonts in Sprint 1. `10-PERFORMANCE.md §10.5` still says "Subset to Latin only at launch; add Bengali/Devanagari subsets only when i18n activates." Three docs disagree on whether Devanagari ships in Sprint 1 or Month 4.

6. **Reduced-motion implementation pattern is wrong.** `06-ANIMATION-STRATEGY.md §6.5` shows `const prefersReducedMotion = window.matchMedia(...).matches` at module top-level — this fires in React Server Components / SSR where `window` is undefined. The example below it (`const tl = gsap.timeline({ paused: prefersReducedMotion });`) implies the same pattern; correct is `useReducedMotion` inside a Client Component or `useSyncExternalStore`. Anyone copy-pasting will hit SSR error.

7. **Lenis package path is wrong/deprecated.** `package.json` and `02-TECH-STACK.md §2.4` import `@studio-freight/lenis`. Studio Freight rebranded to Darkroom and Lenis moved to `lenis` (npm) some time ago; `@studio-freight/lenis` is the legacy package. The code in `06-ANIMATION-STRATEGY.md §6.3` will install but may not be the maintained version. Pin to `lenis` and remove the scoped name.

8. **Footer copyright year mismatch with site context.** `04-INFORMATION-ARCHITECTURE.md §4.4` bottom strip reads "© **2026** Siligurievent". `DECISIONS.md` is dated `2026-05-16`. If the site is actually being built now and not in 2026 (`currentDate` per session says 2026-05-16), fine — but `01-PROJECT-VISION.md §1.6` USP #5 mentions "signed venue partners across Darjeeling and Dooars tea estates" as fact, and the owner has not yet provided business info per `DECISIONS.md` outstanding inputs table. The copy is writing checks the business hasn't cashed.

9. **"Footer" CTA hierarchy mismatch.** `04-INFORMATION-ARCHITECTURE.md §4.9` says Contact's primary CTA is "(form is the CTA)". `05-PAGE-SPECS.md §5.10` describes Contact as a hero + 3-step form + WhatsApp card + map. No issue with that, but `06-ANIMATION-STRATEGY.md §6.2` budget caps Contact at "2 scroll-triggered animations, 0 parallax" — yet the successful-submission Lottie + overlay in `05-PAGE-SPECS.md §5.10` Motion section + jasmine petal fall (`MO-11`) implies more activity. Not a blocker, but state the budget includes success states or not.

10. **`/_design` access control claimed twice, gating not specified.** `03-DESIGN-SYSTEM.md §3.10` says "Visible only in dev or behind a basic-auth gate in production." But the route `/app/_design/page.tsx` exists at the public route level; there is no middleware spec in any doc to gate it. Will leak. `next.config.ts` headers don't gate it either. Decide: middleware-level basic auth, or move under `(payload)` admin auth.

11. **133 indexable pages, 50,000 sitemap cap referenced, no canonicalisation rule for filtered portfolio URLs.** `04-INFORMATION-ARCHITECTURE.md §4.1` includes `/portfolio?category=wedding` — filtered views via query — but `07-SEO-STRATEGY.md §7.4` only says "Canonical URL set" without specifying these queries canonicalize to `/portfolio`. Without that, GSC will see infinite query variants as duplicates.

12. **Service slug list disagreement.** `04-INFORMATION-ARCHITECTURE.md §4.1` lists 19 service slugs. `09-IMAGE-PROMPTS.md §D` enumerates the same 19 slugs. `08-CMS-PLAN.md §8.7 Seed data` says "All 19 services". But `12-ROADMAP.md Sprint 1 §` references "Sprint 3 — Service detail template — handles all 19 services dynamically" while `05-PAGE-SPECS.md §5.4` says "Template — used for all **~19** services" — the ~ implies wiggle room. Lock the number; programmatic = 7 locations × 19 services = 133 in `§4.2` math relies on it.

---

## Gaps that will burn at implementation (15)

1. **HEIC uploads on Vercel Fluid Compute will cold-start and OOM.** `08-CMS-PLAN.md §8.8` waves at "HEIC support (Sharp), auto-rotate". Sharp's HEIC decode requires `libheif` which is NOT included in the default Vercel build's Sharp binary. On Fluid Compute, decoding a 12 MB iPhone HEIC (`§8.8` cap) plus generating 4 sizes × 3 formats = 12 outputs is ~400 MB peak memory, ~3–8s wall time. The owner uploading 10 photos batch from her phone will hit timeouts. **Fix**: spec a separate `/api/upload` route configured with `maxDuration: 60`, `memory: 1024 MB`, server-side image processing via `@vercel/blob`'s `put` + background `sharp` via Vercel Queue or move to a separate Vercel Function with `runtime: 'nodejs'` and `regions: ['bom1']`. And budget for the fact that AVIF encoding from HEIC may have to happen client-side via `heic2any` before upload.

2. **Lenis + iOS Safari + `100dvh` trap is named but not solved.** `10-PERFORMANCE.md §10.12` says "Avoid `100vh` — use `100dvh`." But the Home hero (`05-PAGE-SPECS.md §5.1 H1`) is "Full viewport" — on iOS Safari `100dvh` resizes during scroll, which (a) creates layout shifts that violate the CLS < 0.05 target in `10-PERFORMANCE.md §10.1`, (b) makes ScrollTrigger boundaries snap on toolbar collapse. **Fix**: pin hero height to `100svh` initially, ScrollTrigger `invalidateOnRefresh: true` on resize, or use `--vh` JS-set custom property. None of this is in `06-ANIMATION-STRATEGY.md`.

3. **Lexical → JSON-LD article body extraction is unaddressed.** `07-SEO-STRATEGY.md §7.6` says blog posts emit `BlogPosting`. `08-CMS-PLAN.md §8.3` lists 11 custom Lexical blocks (image-pair, gallery row, callout, FAQ, etc.). `BlogPosting.articleBody` should be plain text. Nothing in the docs specifies a Lexical-tree-walker that emits plain text for `articleBody` (and `description` truncation, and `headline` from H1, and `image` array). Without it, schema is malformed or thin. **Fix**: spec a `lexicalToPlainText(root)` helper in `lib/seo/`, define `articleBody` length cap (~5,000 chars).

4. **Hindi font subset cost on `/hi/*` is real and untested against LCP target.** `DECISIONS.md D-003` says "Devanagari subset adds ~30 KB to fonts for `/hi/*` routes only." Realistic: Noto Serif Devanagari (display weights 400 + 600) + Noto Sans Devanagari (body variable) subset is ~80–120 KB even on Devanagari-only subset because the conjunct ligature set is large. Add Cormorant + Inter (already shipping) and you're at 200–280 KB of fonts on `/hi/*`. With LCP < 2.0s target and `preload` directives in `10-PERFORMANCE.md §10.5` only naming "Cormorant 400-italic + Inter 400", `/hi/*` will fail LCP at the 75th percentile on a Pixel 4a 4G unless display text on Hindi routes is itself Noto Serif Devanagari (so it's the LCP element and must preload). **Fix**: define per-locale preload set, test on a real device, accept that `/hi/*` LCP target is 2.5s not 2.0s.

5. **`localized: true` fallback UX in Payload admin is hand-waved.** `DECISIONS.md D-003` claims "HI fields fall back to EN with a 'missing translation' badge until filled". Payload's `localized: true` does NOT show a fallback badge OOTB — it shows an empty field. The "missing translation badge" is custom UI work. And **rendering** fallback: by default Payload's REST returns `null` for unfilled localized fields; you have to set `fallback: true` on query OR use the `?fallback-locale=en` query param. None of `lib/cms/` query-helper specs in the docs mentions this. **Fix**: in `lib/cms/` helpers, always pass `fallbackLocale: 'en'`. Build a Payload admin custom field component that renders the badge. Budget half a sprint.

6. **Local citation claiming is unscoped manual labour.** `07-SEO-STRATEGY.md §7.8` lists 6 directories (JustDial, Sulekha, WedMeGood, ShaadiSaga, BookEventz, Wedding Wire India); `12-ROADMAP.md Sprint 6` reduces to 4. Each of these requires phone-verification, photo upload, profile completion. JustDial in particular has aggressive upsell calls and a verification process that takes 3–10 days. **Fix**: assign to the **owner** explicitly, time-box at Sprint 5 not 6 (so verification calls clear by launch), and accept WedMeGood listing is paid (₹5–25k/year) — not free.

7. **WhatsApp click-to-chat number isn't an API; rate limits don't apply, but Resend webhooks to "WhatsApp deep link summary" don't exist as a feature.** `08-CMS-PLAN.md §8.6` says `inquiries.afterChange (created)` should "Send Resend email to owner. **Send WhatsApp deep link summary**." Resend does not send WhatsApp. There is no WhatsApp webhook in scope; the click-to-chat URL is a user-side intent only. **Fix**: either (a) drop the WhatsApp leg and rely on email + owner-checks-WhatsApp-manually, or (b) integrate WhatsApp Business Cloud API (Meta) with a `template message`, which requires Meta Business Manager verification, a Cloud API number (NOT the owner's personal +91 number), and approval of a template — a 1–2 week setup not budgeted.

8. **Vercel Blob bandwidth on a 355-image gallery-heavy portfolio is a real cost.** `09-IMAGE-PROMPTS.md` totals 355 images at launch. Vercel Blob has bandwidth pricing that includes egress for image transformation. With 4 sizes × 3 formats per image = 4,260 variants stored; if half are >1 MB, baseline storage is 4–8 GB and monthly egress on a launched site doing even 5k uniques/month is plausibly 50–150 GB. **Fix**: include a cost model in `11-DEPLOYMENT.md §11.7`, set explicit `Cache-Control: public, max-age=31536000, immutable` on Blob objects (current `10-PERFORMANCE.md §10.8` says "1 year cache" but doesn't say `immutable` or how it's set on Blob `put`).

9. **Multi-region (bom1 + sin1) edge cold-start trade-off untreated.** `11-DEPLOYMENT.md §11.1` says "bom1 primary, sin1 fallback." For Fluid Compute, two regions ≠ active-active by default — Vercel Functions with multiple regions cold-start independently per region. Lambda warmup matters more than region pick. **Fix**: confirm Fluid Compute behavior, decide if Singapore is a true failover (probably unnecessary; bom1 is enough for India audience), and remove sin1 unless there's a real reason.

10. **133 programmatic location × service pages will trigger Search Console "duplicate content" / "soft 404" / "discovered, not indexed".** `04-INFORMATION-ARCHITECTURE.md §4.2` says each gets "Custom H1, Local schema, 3–5 nearby venue mentions, Filtered portfolio strip, **Identical CTA layout**." Identical CTA + identical schema + boilerplate intro = Google will pick a canonical and ignore most of them. Many programmatic SEO experiments in 2024–25 saw <30% indexation rates. **Fix**: require ≥300 words of unique copy per page (location-specific venue notes, season-specific notes, real local nuance), gate Sprint 6 on having that content, OR start with the 7 × top-5-services = 35 pages and add more only as content is ready.

11. **Payload admin mobile UX is NOT mobile-first OOTB; "tweaks" cost is unknown.** `02-TECH-STACK.md §2.5` says "Admin UI at `/admin` — mobile-responsive out of the box." It's responsive but not mobile-first — the upload-with-large-preview, drag-to-reorder, side-by-side EN/HI tabs (`DECISIONS.md D-003`) require custom field components and theme overrides. `08-CMS-PLAN.md §8.5` lists 6 customisations including "Mobile bottom-nav for admin on small screens" and "Auto-save drafts every 30 seconds." Mobile bottom-nav is custom React; auto-save is custom logic via Payload's `useForm` hook. Realistic effort: 4–6 days of focused work, not "Sprint 2 also does everything else."

12. **GSAP SplitText license + plugin install path.** Covered in cross-doc #3 — also a gap because `package.json` doesn't list it and CDN-based install via `gsap-trial` is not production-safe.

13. **React 19 + Next 16 + GSAP StrictMode double-fire.** `next.config.ts` line 4 sets `reactStrictMode: true`. In dev, every `useEffect` fires twice. GSAP ScrollTrigger setups created in `useEffect` without `gsap.context` cleanup (`06-ANIMATION-STRATEGY.md §6.8` shows the right pattern) will accumulate triggers. The LenisProvider in `§6.3` is correctly cleaned, but the spec doesn't note that motion primitives in `components/motion/` MUST use `gsap.context` not raw `gsap.to`. **Fix**: add a code rule + lint pattern (Biome custom rule or a checked-in ESLint rule wrapper) — or accept developer discipline.

14. **Inquiry form spam protection is unselected.** `11-DEPLOYMENT.md §11.11` says "Form spam: hCaptcha or Cloudflare Turnstile". `12-ROADMAP.md Sprint 4` lists "hCaptcha / Turnstile on form." Neither doc commits. Turnstile is free + invisible on most users + Cloudflare account needed; hCaptcha free tier is fine. **Pick Turnstile** (invisible mode preserves the cinematic UX, no captcha modal). And the rate-limit `5 req/min/IP` (`§11.11`) needs Vercel Edge Middleware + KV/Redis — not free, not specified.

15. **Image LCP math doesn't close.** Hero `HERO-01` on Home is the LCP element. At 2400px wide, AVIF q80, optimized = ~180–280 KB. On Pixel 4a 4G (1.6 Mbps effective), 280 KB = ~1.4s download + decode + paint. Add 600ms TTFB cap (`10-PERFORMANCE.md §10.1`) = ~2.0s baseline before fonts. With Cormorant 400 italic + Inter 400 also blocking visible text, and the cinematic hero animation timeline (`06-ANIMATION-STRATEGY.md §6.10`) starting the H1 reveal at 0.2s and Hero image clip-path at 1.6s — the LCP is the image at >1.6s by design. There is no slack. **Fix**: either accept LCP 2.5s on mobile, or pre-decode the hero on `<link rel="preload">` (already in `§10.2`) AND ship a smaller `sizes` mobile crop (4:5 mentioned in `§5.1`, but no `srcset` breakpoints specified) AND measure on real device, not just CI.

---

## Over-engineering

Ranked top candidates:

1. **133-page programmatic SEO at launch.** `04-INFORMATION-ARCHITECTURE.md §4.2` and `12-ROADMAP.md Sprint 6`. Should be **35 pages** (top 7 locations × top 5 services) at launch, expand after measuring indexation rate. The unique-content cost is the bottleneck, not the template.

2. **`/admin.siligurievent.com` subdomain optionality.** `11-DEPLOYMENT.md §11.6` mentions it as optional. Don't even mention. Adds DNS, SSL, and confusion. `/admin` path is correct.

3. **Vercel Rolling Releases for "risky changes."** `11-DEPLOYMENT.md §11.4` describes 10%→50%→100% rollout. This is a portfolio site for a regional decorator. Standard immediate deploys + git revert if broken is enough. Rolling releases are for products with paid users.

4. **Sentry on launch.** `11-DEPLOYMENT.md §11.10`. Vercel logs + Speed Insights cover 95% of needs for a content site. Sentry adds a JS payload and another dashboard. Defer to Month 2 if errors emerge.

5. **Lighthouse CI gating every PR.** `10-PERFORMANCE.md §10.11` and `11-DEPLOYMENT.md §11.4`. Solid in theory; in practice owner-driven content commits (image swaps, copy edits via CMS) don't generate PRs — only developer PRs do. Useful but not as critical as the doc presents.

6. **3 different OG image paths.** `07-SEO-STRATEGY.md §7.9` + `09-IMAGE-PROMPTS.md §K` + per-locale via `/api/og?locale=hi` (`DECISIONS.md D-003`). For launch, one OG template handles all routes; per-page customization in Month 2.

7. **Multi-region `bom1` + `sin1`.** Covered as gap #9 — redundant.

8. **Internal `/_design` page parity with Storybook ambition.** `03-DESIGN-SYSTEM.md §3.10`. Useful but the rule "Visible only in dev or behind basic-auth" + custom gating + parity with all primitives is real work. Keep minimal — tokens + 6 key primitives, not all 18.

9. **JetBrains Mono font for admin surfaces.** `03-DESIGN-SYSTEM.md §3.2`. Admin already has its own theme; ship without a mono font.

10. **YouTube channel as a launch dependency.** `07-SEO-STRATEGY.md §7.12` and `12-ROADMAP.md` post-launch reference. Not over-engineering per se, but flagged: any "channel" plan that depends on cinematic recap videos every project requires a video editor on the team — not budgeted.

---

## Under-spec'd risk areas

- **"Editorial luxury" visual direction (`01-PROJECT-VISION.md §1.7`, `03-DESIGN-SYSTEM.md §3.11`)** — references Locomotive, Active Theory, Pitch.com but no actual moodboard / Figma source file / annotated component cuts. "Would this hold up next to those?" is a feel, not a spec. **Fix**: build a Figma frame with 6 hero compositions before Sprint 3.

- **Cursor design (`06-ANIMATION-STRATEGY.md §6.6`)** — "small brass-coloured dot... grows to 48px... shows 'View →' label." No fallback for keyboard navigation focus visibility (default cursor disabled means default focus styles may also be hidden). a11y review needed.

- **Form success Lottie (`05-PAGE-SPECS.md §5.10`)** — "jasmine bloom unfurling — Lottie." No source asset specified. Lottie player adds ~40 KB.

- **"AI image curation pass" (`PLAN.md §5` Risks)** — "Image curation pass: cinematic prompts only, mood-rich grading, real-event references." This is the difference between "AI cheap" and "Awwwards-tier." Who does the curation? Not specified. The owner generates 3–4 candidates per prompt and picks (`09-IMAGE-PROMPTS.md` step 2) — that's curation by a non-designer.

- **"Custom Payload admin dashboard" (`08-CMS-PLAN.md §8.5`)** — 5 bullet items; no wireframe.

- **"Live iteration with impeccable + ui-motion skills" (`PLAN.md §5` Risks)** — process not spec.

- **Drafts preview at `?preview=<token>`** (`08-CMS-PLAN.md §8.9`) — no token issuance/revocation logic.

- **Pricing card "band's typical range as a copy-line"** (`DECISIONS.md D-002`) — who writes the copy per category? Owner? Where stored in CMS? Add `packages.bandCopy: richtext`.

- **"Newsletter signup"** (`05-PAGE-SPECS.md §5.8`, `04-INFORMATION-ARCHITECTURE.md §4.11`) — what ESP? Resend has no list management. No collection in `08-CMS-PLAN.md`. Either spec Mailchimp/Buttondown/ConvertKit integration, or remove the field at launch.

- **Reading progress bar + auto-TOC** (`05-PAGE-SPECS.md §5.9`) — no implementation note. TOC auto-gen requires walking Lexical tree post-render.

- **"Lightbox with shared-element transition"** (`05-PAGE-SPECS.md §5.5`, `12-ROADMAP.md Sprint 5`) — Framer Motion `layoutId` works on layout-preserved elements, not on grid→fullscreen. Specifics needed.

---

## Tech stack risks

- **Payload 3 + Next 16 compat.** Payload 3 is RSC-friendly but Next 16 (with Cache Components / `use cache`) is bleeding edge. The mounting pattern at `/(payload)/admin/[[...segments]]` and `/(payload)/api/[...slug]` (`CLAUDE.md` line 49-53) needs `@payloadcms/next/utilities` for the `withPayload` config wrapper and the `next.config.ts` needs that wrapper applied — `next.config.ts` does NOT currently apply `withPayload(config)`. Will break at install.

- **Tailwind v4 maturity.** v4.0 stable released Jan 2025. `@theme` directive works; `light-dark()` in CSS variables (used in `03-DESIGN-SYSTEM.md §3.1` example) is correct modern CSS but has nuances with `[data-theme="..."]` overrides. Test the dark-mode override path before declaring v4 done.

- **GSAP 3 + Lenis on iOS Safari.** Lenis touch behaviour can fight native momentum scroll. `06-ANIMATION-STRATEGY.md §6.3` config doesn't set `smoothTouch: false` (the recommended default — touch should stay native; smooth only on wheel). Will cause "scroll feels wrong" complaints on iPhone.

- **R3F not in scope at launch but mentioned for post-launch.** `12-ROADMAP.md` Month 4-6 says "Consider: 3D hero treatment via R3F." 100+ KB of three.js for a single hero on a perf-strict portfolio site is a poor trade — flag this in `DECISIONS.md` as a "no" unless owner explicitly wants it.

- **`next-intl` v4 with Next 16 App Router.** The middleware pattern + App Router (with locale segments `/[locale]/...`) requires `next-intl@4` plus careful interaction with `headers()`/`cookies()` async APIs (Next 15+ change). `DECISIONS.md D-003` doesn't name the version. Confirm v4+ before scaffolding.

- **Turbopack production builds.** `dev: "next dev --turbo"` is fine. `next build` in Next 16 may also use Turbopack — verify Tailwind v4 + Payload 3 + GSAP + Lenis all build through Turbopack without webpack fallback.

- **Sharp on Vercel + HEIC.** Covered in gap #1.

- **`@studio-freight/lenis` is the legacy package.** Use `lenis` instead. Covered in cross-doc #7.

- **Biome's `noUnknownAtRules`** may flag Tailwind v4's `@theme`, `@apply`, `@layer` directives. Biome 1.9 supports a CSS parser but ruleset depends on version. Add CSS file exclusion or rely on `tailwindcss` PostCSS to keep CSS uninspected by Biome.

- **`@vercel/og` runtime.** Edge runtime; doesn't support `next/image`. Custom OG generation for `/hi/*` needs Devanagari font embedded — adds 80 KB to the OG function bundle.

- **`schema-dts`** is type-only; doesn't validate at runtime. Schema bugs slip past TS. Add a runtime check on the most-trafficked pages via `Schema.org validator` API or a snapshot test.

---

## Awwwards-level reality check

Awwwards Site of the Day judging weights (publicly): **Design 40% / Usability 30% / Creativity 20% / Content 10%**. Mobile-specific judging is its own award (Mobile Excellence) but the standard SOTD is desktop-first scored.

Does the plan ACTUALLY get to SOTD-tier? **Not as written.** Reasoning:

- **Design (40%)** — plan is strong on type system, palette restraint, and motion vocabulary. Weak on layout originality. The IA reads like every premium decorator site — Hero → Marquee → Two-column quote → Horizontal showcase → Tile grid → Testimonials → CTA. No editorial layout invention (asymmetric module grids, broken-baseline typography, off-canvas storytelling, scroll-triggered chapter typography). **Fix**: design one section per major page that doesn't fit the template.

- **Usability (30%)** — strong. The plan respects reduced motion, mobile, a11y. This is plan's best dimension.

- **Creativity (20%)** — middling. SOTD winners have ONE thing the juror tells colleagues about — a scroll-driven puppet, a typographic experiment, a 3D moment, an interactive mechanism. The plan has "cinematic hero parallax + pinned horizontal showcase + cursor magnetism." All competent. None memorable. **Fix**: invest a half-sprint on ONE genuinely novel mechanism, e.g. a scroll-controlled chapter-by-chapter wedding day-arc with synced audio, or a CMS-driven "design palette generator" that shows how flower/fabric/light combinations form a mood.

- **Content (10%)** — strong if the copy is written by someone good. Brand voice in `§1.5` is excellent. Risk: AI-generated images undercut it. SOTD winners rarely use generated imagery — jurors notice.

**Three weakest links for SOTD aspiration:**

1. **Generated images.** No SOTD winner in the last 24 months has been Gemini-imaged. The plan acknowledges the risk (`PLAN.md §5`) but the mitigation ("cinematic prompts only") is hope. Real shoots from the owner's actual decoration work, even on amateur cameras, will out-perform Gemini.
2. **Conventional IA.** No section breaks the template a juror has seen 100 times.
3. **No signature interactive moment.** Cursor magnetism + parallax + pinned showcase is competent but commodity in 2026.

A realistic ceiling at current scope is **Awwwards Honorable Mention** (still meaningful for SEO + credibility) — not SOTD. Push toward SOTD by adding a signature moment in Sprint 5 and committing to real photography for the first 4 case studies.

---

## CMS owner usability reality check

Scenario: non-technical owner, 6.1" Android phone, weekday evening, wants to add a new project from yesterday's reception.

**What will work**: Logging in (Payload auth is fine on mobile), opening "Projects" collection, tapping "Create" — basic CRUD is mobile-OK.

**What will break or grind:**

1. **Image upload, 30 photos, HEIC.** Owner taps the `galleryImages` array field on `projects` (`08-CMS-PLAN.md §8.2`). Payload's default array field with media subfields requires tapping "+ Add" then "Choose file" 30 times unless we build a bulk-upload component. Not budgeted.

2. **Drag-to-reorder on a phone.** `08-CMS-PLAN.md §8.5` promises drag-to-reorder. On a touch screen, dragging a list row that includes a thumbnail and a delete button — without a dedicated drag handle — fails. Need explicit drag handle UI. Custom field component.

3. **Side-by-side EN/HI tabs.** `DECISIONS.md D-003`. On a 6.1" screen, "side by side" is impossible — it becomes stacked or tabbed. Tabs are fine but each language tab is a separate keyboard pop and reflow. The owner will fill EN and forget HI tabs exist for half the fields.

4. **Lexical rich-text on touch.** The Lexical mobile UX is improving but still finicky: cursor positioning inside an `Image Pair` block on touch is hard, toolbar overflows, and pasting from another app loses formatting. The owner will write all blog posts on desktop in practice. Plan should acknowledge this.

5. **The `inquiries` collection 'status' workflow.** `08-CMS-PLAN.md §8.2 inquiries` has a status field (new/contacted/quoted/won/lost). Owner expectation: tap an inquiry, tap "Contacted", done. Payload's default doc-edit flow requires Save. Without a custom row-action button, every status change is a 3-tap flow. Friction.

6. **Pricing field is admin-only (per `DECISIONS.md D-002`).** If the owner shares the admin with an editor, the editor sees the field exists (as hidden) and may ask why. Field-level visibility in Payload is solid, but the explanation copy in the field needs to be tight.

7. **Image preview on slow rural North Bengal mobile data.** The admin loads full thumbnails. On a 200 KBps connection (common in Dooars), opening a project with 30 images = 30s of waiting. Need lazy-load thumbnails in admin custom field.

8. **The owner will publish a draft accidentally.** Payload's draft/publish on mobile collapses into a single confirmation. Loom walkthrough won't save you the third time. Spec a "Are you sure? This will go live." native-confirm style modal for `status: published`.

9. **Auto-save every 30s (`§8.5`)** — collides with a flaky mobile network. Will surface as "Failed to save" toast spam. Needs offline-buffered queue. Realistic: drop auto-save, ship explicit Save button + warn-on-leave.

10. **The dashboard "Today panel" needs to NOT require a fresh fetch every load.** Owner opens 10x/day. Cache via Payload's `localAPI` + 60s TTL.

---

## Top-10 must-fix list (ranked by impact)

| # | Fix | Who | Urgency |
|---|---|---|---|
| 1 | **Resolve pricing-band drift in `05-PAGE-SPECS.md §5.7`, `01-PROJECT-VISION.md §1.6 USP #4`, `07-SEO-STRATEGY.md §7.5–7.6`, `08-CMS-PLAN.md §8.2 services+packages`.** Replace every "starting from ₹X" with band copy. Update schema example to use `priceRange: "₹₹"` not `price: "150000"`. Add `priceBand` + `bandCopy` fields to `packages` schema. | main agent | **blocker** (Sprint 0) |
| 2 | **Add Payload + Next 16 mount wrapper to `next.config.ts`** (`withPayload`), pin Lenis to `lenis` (drop scoped name), pin GSAP SplitText plugin install path + license note in `02-TECH-STACK.md §2.17` + `package.json`. | developer | **blocker** (Sprint 1 start) |
| 3 | **Spec the image upload pipeline** in `08-CMS-PLAN.md §8.8`: client-side HEIC→JPG via `heic2any`, server `maxDuration: 60` route, Sharp variants generated async via Vercel Queue or background function, explicit Cache-Control headers on Blob. | developer | **sprint-1** |
| 4 | **Lock cultural scope.** Reconcile `PLAN.md §1.5` (Sikh/Muslim/Christian) vs `README.md` (Punjabi) vs `04-INFORMATION-ARCHITECTURE.md §4.1` slugs. Drop or add discrete service slugs; align SEO Tier 1 keywords. | SEO + main agent | **sprint-1** |
| 5 | **Per-locale font preload + LCP test plan.** Spec Devanagari preload set, accept `/hi/*` LCP target of 2.5s, document in `10-PERFORMANCE.md §10.1` and `§10.5`, add a real-device test step before Sprint 6 sign-off. | developer + main agent | **sprint-1** |
| 6 | **Cut programmatic SEO to 35 pages at launch** (top 7 locations × top 5 services), with a unique-copy gate (≥300 words/location-service). Update `04-INFORMATION-ARCHITECTURE.md §4.2` and `12-ROADMAP.md Sprint 6`. | SEO + main agent | **sprint-2** |
| 7 | **Spam protection: pick Turnstile, spec invisible mode, spec rate-limit via Vercel KV / Upstash.** Update `11-DEPLOYMENT.md §11.11` + `12-ROADMAP.md Sprint 4`. | developer | **sprint-2** |
| 8 | **Add a signature interactive moment to Sprint 5 scope** that is genuinely novel (not parallax/pin/cursor). One concrete idea, owner-approved. This is the SOTD lever. | designer + main agent | **sprint-2** to plan, **sprint-5** to ship |
| 9 | **Fix the reduced-motion code pattern in `06-ANIMATION-STRATEGY.md §6.5`.** Replace top-level `window.matchMedia` with `useReducedMotion` Client-Component hook. Add lint rule against direct `window` access in motion components. | developer | **sprint-1** |
| 10 | **WhatsApp inquiry leg: pick.** Either drop the "send WhatsApp deep link summary" claim in `08-CMS-PLAN.md §8.6` and document email-only, or schedule a Sprint-7 WhatsApp Cloud API integration with template approval. Update CLAUDE rules and roadmap. | owner + main agent | **post-launch** for full API, **blocker** for honesty in docs (sprint-1) |

---

## Summary to the main agent

The Siligurievent planning corpus is articulate, opinionated, and 80% production-ready — but it is dragging four un-merged decision overrides, two outright API errors (Lenis package name, reduced-motion `window` usage in SSR), a pricing model that contradicts itself in four files, a launch image inventory (~355 Gemini assets) the owner cannot realistically deliver while she is also being asked to claim 6 directory citations and translate 6 pages to Hindi, and a Payload-on-Next-16 mount that will not boot until `next.config.ts` wraps with `withPayload`. The Awwwards aspiration is honest in tone but currently uninvested at the strategy layer: there is no signature interactive moment, the IA is template-shaped, and the imagery is generated — three drags on Creativity that will keep the site in the Honorable Mention band, not SOTD. **Before Sprint 1 code lands**, complete must-fixes #1, #2, #4, #5, #9, #10 (all are doc edits, not code). **In Sprint 1**, complete #3 and #7. **In Sprint 2**, scope #6 and #8. The schedule otherwise should be 8–9 sprints, not 6, to do this at the quality the brief demands; if calendar is fixed at 6, descope to 35 programmatic pages, 12 services not 19, 4 case studies not 6, English-only at launch with Hindi flipped on at Sprint 7. The team has the right instincts and the right stack — what's missing is the discipline to make the decisions log binding and to lock scope to what a non-technical owner can actually feed the machine.
