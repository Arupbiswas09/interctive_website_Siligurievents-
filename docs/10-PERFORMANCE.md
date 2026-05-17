# 10 — Performance

Performance is a brand statement. A slow luxury site is a contradiction. Indian mobile users are price-sensitive — and bandwidth-sensitive — so this site competes on speed.

## 10.1 Targets

Per Lighthouse mobile on a throttled Pixel 4a 4G profile from a Mumbai test location:

| Metric | Target (p75) | Failure threshold |
|---|---|---|
| LCP | < 2.0s | > 2.5s ships |
| INP | < 200ms | > 300ms ships |
| CLS | < 0.05 | > 0.1 ships |
| TTFB | < 600ms | > 800ms ships |
| FCP | < 1.5s | > 1.8s ships |
| Total Blocking Time | < 200ms | > 400ms ships |
| JS transferred (home) | < 180 KB gzipped | > 250 KB ships |
| JS transferred (service detail) | < 150 KB gzipped | > 220 KB ships |
| Image bytes per route | < 1.2 MB total | > 2 MB ships |
| Lighthouse Performance | ≥ 92 | < 85 ships |

"Ships" = blocks deployment. "Target" = passing build.

## 10.2 Image strategy

Images are 70%+ of bandwidth on this site. They get the most attention.

### Pipeline
1. **Upload** to Payload → Vercel Blob.
2. **Sharp transforms** generate 4 sizes (400 / 800 / 1600 / 2400 px wide), 3 formats (AVIF, WebP, JPG).
3. **BlurHash + Plaiceholder** produce a 24-character LQIP string for `blurDataURL`.
4. **Strip EXIF**, auto-rotate by orientation, set sRGB color profile.

### Rendering rules
- `next/image` everywhere; `priority` only on the hero image of each page.
- `sizes` attribute always set, never left implicit.
- `quality={80}` for hero, `quality={70}` everywhere else.
- AVIF as primary via Next.js image API, WebP fallback.
- Galleries below the fold: `loading="lazy"`.
- Hero LCP image: `<link rel="preload" as="image" imagesrcset>` in `<head>` for the responsive set.

### Example
```tsx
<Image
  src={hero.url}
  alt={hero.altText}
  width={2400}
  height={1350}
  priority
  placeholder="blur"
  blurDataURL={hero.blurDataURL}
  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
  quality={80}
/>
```

### Memory considerations — HEIC decoding on Fluid Compute

The owner uploads predominantly from an iPhone, which means **HEIC**. HEIC decoding through Sharp (`libheif`) is significantly more memory-hungry than JPEG/PNG: a single 12 MB HEIC file can need **>256 MB of peak memory** on the first cold start, and generating our 12 derivative variants (4 sizes × 3 formats) in one process push transient peak to ~400 MB and 3–8 seconds wall time. On Fluid Compute this manifests as:

- Cold-start OOM kills on the very first upload after a cold function.
- Timeouts on a batch upload of 10+ photos.

**Mitigations** (pick at least one, ideally combined):

1. **Cap resolution at ingress** — reject originals over 6000×6000 px before they reach Sharp, with a clear error in the admin upload field. Pair with a **12 MB hard cap** (already in [§8.8](./08-CMS-PLAN.md)).
2. **Background processing via a queue** — route uploads through `/api/upload` configured with `maxDuration: 60` and `memory: 1024` MB, enqueue derivative generation to a Vercel Queue (or a separate background Function), and poll/show "Processing…" in the admin UI until variants are ready.
3. **Client-side HEIC → JPG via `heic2any`** — convert in the browser before the file ever leaves the phone; the server then only handles JPEG. Trades ~80 KB of client JS on the admin upload page (gated to the admin route) for predictable server memory.
4. **Pin upload route region to `bom1`** to keep cold-starts in a single region; warm via a tiny cron ping if upload latency matters.

All of the above must be agreed before Sprint 2 ships the upload pipeline; otherwise the owner's batch-from-phone workflow will OOM at the first reception shoot.

## 10.3 JS budget per route

Set in `package.json` with a check script:

```json
"size-limit": [
  { "name": "Home JS", "path": ".next/static/chunks/app/page-*.js", "limit": "60 kB" },
  { "name": "Service detail JS", "path": ".next/static/chunks/app/services/**/page-*.js", "limit": "50 kB" },
  { "name": "Vendor JS", "path": ".next/static/chunks/framework-*.js", "limit": "80 kB" }
]
```

Strategies:
- **Server Components by default.** Only mark Client Components when needed.
- **Dynamic import** for: GSAP timelines below-the-fold, Framer Motion lightboxes, Lottie player, the inquiry form (only on `/contact`).
- **No barrel files** — they defeat tree-shaking.
- **Route segments** keep their own chunks; verify with `next build --profile`.

## 10.4 Rendering strategy

| Route | Strategy | Why |
|---|---|---|
| `/` | Cache Components + `use cache` 5 min | CMS-driven but rarely changes |
| `/about` | Static | Updated rarely |
| `/services` | Cache Components 10 min | List page |
| `/services/[slug]` | Cache Components 10 min + on-demand revalidate | Per-service CMS edits |
| `/portfolio` | Cache Components 5 min | New projects added often |
| `/portfolio/[slug]` | Static + on-demand revalidate via Payload hook | Stable once published |
| `/pricing` | Cache Components 10 min | Slowly-changing |
| `/blog` | Cache Components 5 min | Frequent additions |
| `/blog/[slug]` | Static + on-demand revalidate | Stable once published |
| `/contact` | Dynamic | Form, no caching needed |
| `/api/inquiry` | Dynamic (POST only) | |
| `/api/og` | Cached at edge | |
| `/locations/[slug]` | Cache Components 1 hour | Slow change |
| `/decorators/[loc]/[svc]` | Static + ISR | Programmatic |

## 10.5 Font loading

- Self-host via `next/font` (Google Fonts proxy). No external font CDN.
- **Per-locale subsetting** (per `DECISIONS.md` D-003: EN + HI ship at launch):
  - `/en/*`: Latin subset only — Cormorant Garamond (display) + Inter (body).
  - `/hi/*`: Latin subset **plus** Devanagari subset — adds Noto Serif Devanagari (display) + Noto Sans Devanagari (body).
- **Devanagari budget reality**: Devanagari-only subsets of Noto Serif + Noto Sans (display weights 400/600 + body variable) total **~80–120 KB** even after subsetting, because the conjunct ligature set is large. Combined with Cormorant + Inter on `/hi/*`, the total font payload lands in the **~200–280 KB** range.
- **Preload strategy is per-locale**:
  - `/en/*`: preload Cormorant 400-italic + Inter 400.
  - `/hi/*`: preload Noto Serif Devanagari 400 (LCP-display) + Inter 400; lazy Cormorant since headline is Devanagari.
- **LCP target on `/hi/*`** is accordingly **2.5s p75**, not 2.0s — `10.1` targets apply to `/en/*`; the `/hi/*` carve-out is acknowledged and budgeted.
- `display: swap` everywhere.
- Variable fonts where possible to reduce file count.
- `size-adjust` descriptors set on Devanagari fallbacks to keep CLS < 0.05.
- Bengali (`/bn/*`) fonts will be added during post-launch Bengali activation (Month 4–6), not at launch.

## 10.6 CSS

- Tailwind v4 produces ~10–15 KB gzipped after purge.
- Critical CSS inlined by Next.js automatically.
- No global CSS files beyond `globals.css` (Tailwind layers, font declarations, CSS variables).
- No unused shadcn components shipped — only what we import.

## 10.7 Third-party scripts

- **Vercel Analytics & Speed Insights** — first-party, minimal overhead.
- **Google Analytics** — loaded via `next/script` with `strategy="afterInteractive"`. ONE script.
- **Resend** — server-only, no client script.
- **No** chat widgets, Hotjar, FullStory, Intercom, Tawk.to, Crisp at launch. They each cost 30–80 KB of JS and tank Web Vitals.

## 10.8 Caching headers

- **HTML**: `Cache-Control: public, max-age=0, must-revalidate, s-maxage=300` (Next handles).
- **Static assets** (`_next/static/`): immutable, 1 year.
- **Vercel Blob images**: 1 year cache, but versioned via the upload's hash.
- **API routes**: appropriate per-route headers.

## 10.9 Edge & regions

- **Primary region**: Mumbai (`bom1`) for India proximity.
- **Secondary region**: Singapore (`sin1`) fallback.
- **Vercel Image Optimization**: served from edge nodes worldwide; in India served from Mumbai POP.
- **CDN cache TTL**: 1 hour for HTML, 1 year for static.

## 10.10 Database performance

- Neon Postgres connection pooling via Prisma-style adapter.
- Indexes on `slug`, `status`, `publishedDate`, `service`, `location` on all relevant collections.
- Use Payload's `depth: 1` and explicit field selection to avoid over-fetching.
- Single round-trip per page where possible.

## 10.11 Monitoring

- **Vercel Speed Insights** — RUM Web Vitals dashboard.
- **Sentry** — performance traces on slow transactions.
- **GSC Core Web Vitals report** — weekly review.
- **Lighthouse CI** in PRs — fails the build if scores drop below thresholds.

### Lighthouse CI config (`.lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/", "http://localhost:3000/services/wedding", "http://localhost:3000/portfolio"],
      "settings": { "preset": "desktop", "throttlingMethod": "simulate" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

## 10.12 Mobile-specific optimisations

- **HTTPS only**, HTTP/3 enabled (Vercel default).
- **No client-side data fetching on initial render** — everything SSR'd or RSC.
- **Touch targets ≥ 44px**.
- **Tap-to-call**, **tap-to-WhatsApp** links use native intents.
- **Avoid `100vh`** — use `100dvh` to handle mobile address bars.
- **Pinch-zoom not blocked** (accessibility).
- **Reduce motion** on `prefers-reduced-motion`.
- **Save-Data hint** respected — when `Save-Data: on`, serve lower-quality images and skip autoplay video.

## 10.13 Pre-launch perf audit checklist

- [ ] Lighthouse mobile ≥ 92 on Home, Services index, Service detail, Portfolio index, Case study, Pricing, Contact.
- [ ] WebPageTest from Mumbai server: TTFB < 700ms.
- [ ] Bundle analyzer report — no single chunk > 100 KB gzipped.
- [ ] No layout shifts when fonts load (size-adjust descriptors set).
- [ ] No images without explicit width/height attributes.
- [ ] Inquiry form submits in < 1.5s p95.
- [ ] Tested on a real Redmi Note 11 over 3G/4G (low-tier reality check).
