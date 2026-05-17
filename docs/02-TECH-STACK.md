# 02 — Tech Stack & Rationale

Every choice with a reason. If you're tempted to swap something out, the rationale should tell you what trade-off you're making.

## 2.1 Core framework

### Next.js 16 (App Router) — **chosen**
- Server Components reduce JS bundle on luxury-image-heavy pages.
- Cache Components (`use cache`, `cacheLife`, `cacheTag`) — perfect for CMS-driven pages with selective revalidation.
- Built-in image optimization (`next/image`) + AVIF/WebP for slow Indian mobile networks.
- Vercel-native: zero-config Fluid Compute, Vercel Blob, Edge config, OG image generation.
- Streaming SSR for fast TTFB on heavy galleries.

**Alternative considered**: Astro (faster static), SvelteKit (lighter JS). Rejected — Payload CMS integrates cleanly with Next.js, and we want React's animation ecosystem (Framer Motion, GSAP-React adapters, Lottie-react).

## 2.2 Language

### TypeScript (strict) — **chosen**
- Payload generates types automatically from collections.
- Catches `undefined` errors before production for non-tech owner.

## 2.3 Styling

### Tailwind CSS v4 — **chosen**
- New `@theme` directive — design tokens live in CSS, no JS config.
- ~10× faster builds than v3.
- First-class CSS variable support for theming and dark mode.

### shadcn/ui — **chosen**
- Component primitives we own (Radix-based, accessible).
- We restyle aggressively for the luxury brand. shadcn gives us the structure, we give it the soul.

## 2.4 Motion stack

### GSAP 3 + ScrollTrigger + Observer — **chosen** (free, MIT-bundled plugins only)
- Industry standard for Awwwards-tier sites.
- ScrollTrigger handles parallax, pinning, scrubbed timelines.
- Observer for direction-aware marquee scrolling.
- Pairs with Lenis via `ScrollTrigger.update`.
- **Text splitting**: we do **NOT** use GSAP's `SplitText` plugin — it is a paid Club GreenSock plugin and not free for commercial distribution outside Webflow hosting at the time of writing. The foundation dev has built a **custom pure-React splitter primitive** (`components/motion/splitter.tsx`) that splits headings into `<span>`s by line / word / char and exposes refs for GSAP to animate. License-clean, ~1.5 KB gzip, SSR-safe.

### Lenis (`lenis`) — **chosen**
- Smooth scroll without the jank of Locomotive.
- Tiny (~3 KB gzip), works on mobile.
- Single source of scroll truth — GSAP reads from it.
- **Package name**: import from `lenis` (the maintained scope-less package). The legacy `@studio-freight/lenis` scope is deprecated — Studio Freight rebranded and migrated maintenance to the un-scoped `lenis` package. Main agent: update `package.json` accordingly.

### Framer Motion 11 — **chosen for components**
- Component-level state-driven transitions (modals, lightboxes, tabs).
- `layoutId` for shared-element lightbox transitions.
- GSAP owns scroll, Motion owns components — clean split.

### Lottie (`@lottiefiles/dotlottie-react`) — **optional**
- For 3–4 small icon-level micro animations (loading, success checkmark).
- Not used for hero — GSAP handles that.

## 2.5 CMS

### Payload CMS 3 — **chosen** (locked per `DECISIONS.md` D-001)
- Lives inside the Next.js app, deploys as one Vercel project.
- Admin UI at `/admin` — mobile-responsive out of the box (mobile-first tweaks budgeted; see [08-CMS-PLAN.md §8.5](./08-CMS-PLAN.md)).
- Field-level access control: owner sees pricing fields, editor doesn't.
- Postgres-backed (Neon), version control on every doc, drafts + published.
- Open-source, MIT, no vendor lock-in.
- Block-based rich text (Lexical) — owner composes pages from pre-designed sections.

### Alternative considered: Sanity.io
- Slightly slicker mobile UX for owner.
- Hosted (no DB management).
- Rejected: vendor lock-in, content lives outside our infra, free tier limits at scale, and pricing fields cannot be admin-gated as cleanly.

~~**Decision needed from owner before Phase 2**: Payload (recommended) or Sanity?~~ **Decided: Payload CMS 3** — see `DECISIONS.md` D-001.

## 2.6 Database & storage

### Neon Postgres (via Vercel Marketplace) — **chosen**
- Serverless Postgres, scales to zero.
- Branching per Vercel preview = isolated content per PR.
- Generous free tier.

### Vercel Blob — **chosen**
- Image and video storage for Payload media collection.
- Public + private namespaces; we use public for gallery, private for unpublished drafts.
- CDN-backed globally.

## 2.7 Forms & validation

- **react-hook-form** — performant, minimal re-renders.
- **zod** — schema validation, same schema runs on client + server.
- **@hookform/resolvers/zod** — bridge.

## 2.8 Email

### Resend — **chosen**
- Modern API, React Email templates.
- Inquiry submission → email to owner with a pre-filled `wa.me` deep link in the body (Resend sends **email only**; there is no Resend → WhatsApp bridge). See [11-DEPLOYMENT.md §11.8](./11-DEPLOYMENT.md) for the launch flow and the post-launch WhatsApp Business Cloud API option.
- Sender domain authentication via DNS (SPF / DKIM / DMARC).

## 2.9 Analytics & monitoring

- **Vercel Analytics** — page views, core vitals in-house.
- **Vercel Speed Insights** — RUM Web Vitals.
- **Google Analytics 4** — owner-facing dashboards.
- **Google Search Console** — indexing, search performance.
- **Sentry** (light tier) — runtime error tracking.

## 2.10 SEO toolchain

- **next-sitemap** — sitemap.xml + robots.txt generation.
- **`schema-dts`** — type-safe JSON-LD authoring.
- **`@vercel/og`** — dynamic OG image generation per page.
- **IndexNow API** — push fresh URLs to Bing/Yandex/Naver.
- Google Business Profile — manual setup, linked from footer.

## 2.11 WhatsApp / chat

- **Click-to-chat link** (`https://wa.me/91XXXXXXXXXX?text=...`) — sticky button + every CTA.
- Pre-filled message with event type when launched from a service page.
- Optional Phase 6: WhatsApp Business Cloud API for conversational bot (not at launch).

## 2.12 Maps

- **Static map image** (Mapbox or OpenStreetMap static) in footer.
- Click → opens Google Maps with business pin.
- No interactive map embed — saves ~150 KB of JS.

## 2.13 Internationalization (English + Hindi from launch)

Per `DECISIONS.md` D-003: launch bilingual. English primary, Hindi secondary. Bengali deferred to post-launch.

- **`next-intl` v4+** wired from Sprint 1 (not deferred).
- Routes: `/en/...` and `/hi/...`. Root `/` resolves via `Accept-Language` middleware (`en-*` → `en`, `hi-*` → `hi`, else `en`). Language switcher in header persists choice via cookie.
- `/bn/...` reserved for post-launch Bengali activation — no re-architecture required.
- All public-facing CMS text fields are `localized: true` per locale (`en`, `hi`).
- Devanagari fonts (Noto Serif Devanagari + Noto Sans Devanagari) loaded only on `/hi/*` routes; see [10-PERFORMANCE.md §10.5](./10-PERFORMANCE.md).

## 2.14 Testing

- **Playwright** — E2E for inquiry form, navigation, CMS auth.
- **Vitest** — unit tests for SEO helpers, form validators.
- No visual regression test framework — owner-driven QA. Add Chromatic if it ever becomes pain.

## 2.15 Dev tooling

- **pnpm** — workspace-ready, fast.
- **Biome** — formatter + linter in one (replaces ESLint + Prettier).
- **Husky + lint-staged** — pre-commit hygiene.
- **TypeScript strict** + `noUncheckedIndexedAccess`.
- **VS Code workspace settings** committed (`.vscode/settings.json`).

## 2.16 Hosting

- **Vercel** — Fluid Compute (default), Node 24 LTS.
- **Domain** — registered via owner-controlled registrar, DNS at Vercel.
- **Preview deploys** — every PR gets a URL the owner can comment on.

## 2.17 Package list (planned)

Production:
```
next react react-dom typescript
@payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical
@payloadcms/storage-vercel-blob payload
tailwindcss @tailwindcss/postcss
gsap lenis framer-motion
next-intl
react-hook-form zod @hookform/resolvers
resend react-email
@vercel/og @vercel/analytics @vercel/speed-insights
schema-dts next-sitemap
clsx tailwind-merge class-variance-authority
lucide-react
sharp
```

> **Notes for the main agent updating `package.json`:**
> - Use `lenis` (NOT `@studio-freight/lenis`, which is the legacy/deprecated scope).
> - **Do NOT install** the GSAP `SplitText` plugin (paid Club GreenSock plugin) — text splitting is handled by our in-repo splitter primitive (`components/motion/splitter.tsx`). Only the free, MIT-bundled GSAP plugins (`ScrollTrigger`, `Observer`) are used.
> - `next-intl` is added because EN + HI ship at launch (per `DECISIONS.md` D-003).

Dev:
```
@biomejs/biome husky lint-staged
@types/node @types/react @types/react-dom
playwright vitest @testing-library/react
```

## 2.18 Things we deliberately are NOT using

| Tool | Why not |
|---|---|
| Redux / Zustand | No global client state needed. URL + React Server Components handle state. |
| GraphQL | Payload has REST + Local API; GraphQL adds a layer we don't need. |
| Storybook | Overkill for this scope; design system page at `/_design` covers it. |
| Three.js | Beautiful but heavy. Reserve for one signature hero treatment IF the owner wants it; even then, lazy-loaded. |
| Locomotive Scroll | Lenis is the modern successor. |
| Webpack config tweaks | We use Turbopack via Next 16 default. |
