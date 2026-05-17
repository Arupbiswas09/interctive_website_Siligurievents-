# 07b — SEO Implementation (companion to 07-SEO-STRATEGY)

This document turns the strategy in [`07-SEO-STRATEGY.md`](./07-SEO-STRATEGY.md) into wireable code. Every file below already exists in `lib/seo/`; this doc is the playbook for using them.

Decisions referenced:

- **D-002** — Public schemas expose price BANDS (`₹`, `₹₹`, `₹₹₹`) only, never numeric rupee amounts.
- **D-003** — Bilingual launch (en, hi). Hreflang + per-locale OG images mandatory.

Domain: `https://siligurievent.com`. Brand: **Siligurievent**.

---

## 1. `generateMetadata` patterns by page type

All page-type wrappers compose the canonical builder in `lib/seo/metadata.ts`:

```ts
import { buildPageMetadata } from "@/lib/seo/metadata";
```

### 1.1 Home (`app/(site)/[locale]/page.tsx`)

```ts
export async function generateMetadata(
  { params }: { params: Promise<{ locale: "en" | "hi" }> }
): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Siligurievent · Wedding & Event Decorators in Siliguri, North Bengal",
    description:
      "Cinematic wedding, haldi, sangeet, reception and event decor across Siliguri, Darjeeling and the Dooars. See our work and plan your celebration.",
    path: "/",
    locale,
    ogType: "website",
    appendBrand: false,
    keywords: englishKeywordsFor("home"),
  });
}
```

### 1.2 Service detail (`app/(site)/[locale]/services/[slug]/page.tsx`)

```ts
export async function generateMetadata(
  { params }: { params: Promise<{ locale: "en" | "hi"; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug, locale);
  return buildPageMetadata({
    title: `${service.name} Decoration in Siliguri`,
    description: service.seo?.description ?? service.tagline,
    path: `/services/${service.slug}`,
    locale,
    image: service.seo?.ogImage?.url,
    ogType: "website",
    keywords: [service.name, "siliguri", "north bengal", "decorator"],
  });
}
```

### 1.3 Portfolio index (`/portfolio`)

```ts
return buildPageMetadata({
  title: "Our Work · Wedding & Event Decor Portfolio",
  description:
    "Browse signature wedding, haldi, reception and corporate event designs by Siligurievent across Siliguri and North Bengal.",
  path: "/portfolio",
  locale,
});
```

### 1.4 Case study (`/portfolio/[slug]`)

```ts
const project = await getProject(slug, locale);
return buildPageMetadata({
  title: `${project.title} · ${project.ceremony.name}, ${project.location.name}`,
  description: project.brief.slice(0, 155),
  path: `/portfolio/${project.slug}`,
  locale,
  ogType: "article",
  publishedTime: project.date,
});
```

### 1.5 Pricing (`/pricing`)

```ts
return buildPageMetadata({
  title: "Pricing & Packages · Event Decoration",
  description:
    "Honest pricing bands for wedding, haldi, birthday and corporate event decoration across North Bengal. Get a custom quote.",
  path: "/pricing",
  locale,
});
```

### 1.6 Blog index (`/blog`)

```ts
return buildPageMetadata({
  title: "Journal · Wedding & Event Planning Stories",
  description:
    "Stories, checklists and design notes for North Bengal weddings, family rituals and celebrations — by Siligurievent.",
  path: "/blog",
  locale,
});
```

### 1.7 Blog post (`/blog/[slug]`)

```ts
const post = await getPost(slug, locale);
return buildPageMetadata({
  title: post.seoTitle ?? post.title,
  description: post.seoDescription ?? post.excerpt,
  path: `/blog/${post.slug}`,
  locale,
  ogType: "article",
  publishedTime: post.publishedDate,
  modifiedTime: post.updatedAt,
  authorName: post.author.name,
  keywords: post.tags,
});
```

### 1.8 Contact (`/contact`)

```ts
return buildPageMetadata({
  title: "Contact · Plan Your Event",
  description:
    "WhatsApp, call, or fill our form. We reply within an hour, 9 AM–9 PM IST.",
  path: "/contact",
  locale,
});
```

### 1.9 Location (`/locations/[slug]`)

```ts
const loc = await getLocation(slug, locale);
return buildPageMetadata({
  title: `Event Decorators in ${loc.name}`,
  description: `Wedding and event decor in ${loc.name} by Siligurievent. ${loc.projectCount} signature projects nearby. Talk to a planner.`,
  path: `/locations/${loc.slug}`,
  locale,
});
```

### 1.10 About (`/about`)

```ts
return buildPageMetadata({
  title: "About · The studio behind Siligurievent",
  description:
    "Meet the team designing weddings, festivals and family rituals across Siliguri and North Bengal — Siligurievent.",
  path: "/about",
  locale,
});
```

### 1.11 Programmatic `/decorators/[location]/[service]`

```ts
return buildPageMetadata({
  title: `${capitalise(svc)} Decorators in ${capitalise(loc)}`,
  description:
    `Plan your ${svc.replace("-", " ")} in ${capitalise(loc)} with Siligurievent. Local venues, decor inspiration and pricing bands.`,
  path: `/decorators/${loc}/${svc}`,
  locale,
});
```

---

## 2. Schema builder signatures

All exported from `lib/seo/schemas.ts`. Strict types: every builder returns a `WithContext<T>` from `schema-dts`.

```ts
buildOrganization(settings: SiteSettingsInput): WithContext<Organization>
buildLocalBusiness(settings: SiteSettingsInput, location?: LocationInput): WithContext<LocalBusiness>
buildService(service: ServiceInput, settings: SiteSettingsInput): WithContext<Service>
buildBreadcrumb(items: ReadonlyArray<BreadcrumbItem>): WithContext<BreadcrumbList>
buildFAQ(faqs: ReadonlyArray<FaqItem>): WithContext<FAQPage>
buildBlogPosting(post: BlogPostInput, author: PersonInput, settings: SiteSettingsInput): WithContext<BlogPosting>
buildOfferCatalog(packages: ReadonlyArray<PackageInput>): WithContext<OfferCatalog>
buildCreativeWork(project: ProjectInput): WithContext<CreativeWork>
buildPlace(location: LocationInput): WithContext<Place>
buildPerson(person: PersonInput): WithContext<Person>
buildImageGallery({ name, description, url, imageUrls }): WithContext<ImageGallery>
buildAggregateRatingPlaceholder(args): WithContext<Thing>  // placeholder — only emit once real reviews exist
```

Helper:

```ts
jsonLdScript(schema: object): ReactElement
```

Drop `jsonLdScript(buildService(...))` into the page body (Server Component). Multiple schemas? Render them in sequence — each becomes its own `<script>` tag.

### Pricing rule (D-002)

In `buildService` and `buildOfferCatalog`, the `priceSpecification.price` field is the **band string**, not a number:

```ts
priceSpecification: {
  "@type": "PriceSpecification",
  priceCurrency: "INR",
  price: service.priceBand, // "₹" | "₹₹" | "₹₹₹"
}
```

`buildLocalBusiness` hardcodes `priceRange: "₹₹"` — the brand-level midpoint.

---

## 3. URL → schema mapping

| URL pattern | Schemas to emit |
|---|---|
| `/` (home) | Organization, LocalBusiness, WebSite |
| `/about` | AboutPage *(future)*, Person (founder), Organization |
| `/services` | BreadcrumbList |
| `/services/[slug]` | Service, BreadcrumbList, FAQPage (if FAQs present), ImageGallery (if galleryImages) |
| `/portfolio` | CollectionPage *(future)*, BreadcrumbList |
| `/portfolio/[slug]` | CreativeWork, BreadcrumbList, ImageGallery |
| `/pricing` | OfferCatalog, BreadcrumbList |
| `/blog` | Blog *(future)*, BreadcrumbList |
| `/blog/[slug]` | BlogPosting, BreadcrumbList, FAQPage (if FAQ block in body) |
| `/contact` | LocalBusiness, BreadcrumbList |
| `/locations` | BreadcrumbList |
| `/locations/[slug]` | LocalBusiness (areaServed=this), Place, BreadcrumbList |
| `/decorators/[loc]/[svc]` | Service (areaServed=this loc), Place, BreadcrumbList |
| `/privacy`, `/terms` | none — emit `noindex,follow` only if owner prefers |

---

## 4. Hreflang + Next.js `alternates.languages`

`buildPageMetadata` calls `buildAlternates(path)` internally. Output for `/services/wedding` is:

```ts
alternates: {
  canonical: "https://siligurievent.com/en/services/wedding",
  languages: {
    "en-IN": "https://siligurievent.com/en/services/wedding",
    "hi-IN": "https://siligurievent.com/hi/services/wedding",
    "x-default": "https://siligurievent.com/en/services/wedding",
  },
}
```

If a Hindi version doesn't exist yet (owner translates progressively per D-003), pass a slimmed map manually:

```ts
buildPageMetadata({
  // ...
  alternates: {
    canonical: localeUrl("/services/wedding", "en"),
    languages: {
      "en-IN": localeUrl("/services/wedding", "en"),
      "x-default": localeUrl("/services/wedding", "en"),
    },
  },
});
```

---

## 5. `next-sitemap.config.js` example

Place at repo root. Run via `pnpm postbuild`:

```js
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://siligurievent.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin*", "/api/*", "/preview*", "/*?preview=*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api/", "/preview"] },
    ],
    additionalSitemaps: ["https://siligurievent.com/sitemap.xml"],
  },
  alternateRefs: [
    { href: "https://siligurievent.com/en", hreflang: "en-IN" },
    { href: "https://siligurievent.com/hi", hreflang: "hi-IN" },
  ],
  transform: async (config, path) => {
    // Per-route priorities aligned with lib/seo/sitemap.ts STATIC_ROUTES.
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/" || /^\/(en|hi)$/.test(path)) {
      priority = 1.0;
      changefreq = "weekly";
    } else if (/\/services(\/|$)/.test(path)) {
      priority = 0.9;
    } else if (/\/portfolio(\/|$)/.test(path)) {
      priority = 0.9;
    } else if (/\/decorators\//.test(path)) {
      priority = 0.5;
    } else if (/\/blog\//.test(path)) {
      priority = 0.6;
    }

    const cleanPath = path.replace(/^\/(en|hi)/, "") || "/";
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `https://siligurievent.com/en${cleanPath === "/" ? "" : cleanPath}`, hreflang: "en-IN" },
        { href: `https://siligurievent.com/hi${cleanPath === "/" ? "" : cleanPath}`, hreflang: "hi-IN" },
        { href: `https://siligurievent.com/en${cleanPath === "/" ? "" : cleanPath}`, hreflang: "x-default" },
      ],
    };
  },
  additionalPaths: async () => {
    // For CMS-driven routes the build script reads from Payload and pushes here.
    // See lib/seo/sitemap.ts → buildSitemap().
    return [];
  },
};
```

For full CMS-driven control we instead use `app/sitemap.ts` (Next.js 16 native) that imports `buildSitemap` from `lib/seo/sitemap.ts` — preferred when we need typed Payload queries.

---

## 6. IndexNow

Function: `submitToIndexNow(urls, options?)` in `lib/seo/indexnow.ts`.

### Setup steps

1. Generate a UUID-ish key (32+ hex chars). Save as `INDEXNOW_KEY` env var on Vercel.
2. Create `public/<KEY>.txt` containing exactly the key string (no trailing newline). Commit it.
3. Wire into Payload hooks:

```ts
// lib/payload/hooks/afterPublish.ts
import { submitToIndexNow, expandPathsForIndexNow } from "@/lib/seo/indexnow";

export const afterPublishPost: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== "update" && operation !== "create") return;
  if (doc.status !== "published") return;
  const urls = expandPathsForIndexNow([`/blog/${doc.slug}`, "/blog"]);
  const result = await submitToIndexNow(urls);
  if (!result.ok) console.warn("[indexnow]", result);
};
```

Retries: 3 attempts with 500ms exponential backoff. 4xx responses fail-fast (don't retry).

---

## 7. `/api/og` route stub

Dynamic OG images via `@vercel/og`. Templates per `type` query param.

```tsx
// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "default"; // service | project | post | location | default
  const title = searchParams.get("title") ?? "Siligurievent";
  const subtitle = searchParams.get("subtitle") ?? "";
  const locale = searchParams.get("locale") ?? "en";

  // Common scaffolding
  const fontFamily =
    locale === "hi"
      ? "'Noto Serif Devanagari', 'Cormorant Garamond', serif"
      : "'Cormorant Garamond', serif";

  const palette = {
    bg: "#1a0d0d",       // wine-charcoal
    fg: "#f7f1e8",       // ivory
    accent: "#c8a472",   // brass
  };

  // Per-type accent + label
  const labelMap: Record<string, string> = {
    service: locale === "hi" ? "सेवा" : "Service",
    project: locale === "hi" ? "हमारा काम" : "Our Work",
    post: locale === "hi" ? "जर्नल" : "Journal",
    location: locale === "hi" ? "स्थान" : "Location",
    default: "Siligurievent",
  };
  const label = labelMap[type] ?? labelMap.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: palette.bg,
          color: palette.fg,
          fontFamily,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: palette.accent }}>
            Siligurievent
          </span>
          <span style={{ fontSize: 22, color: palette.accent, textTransform: "uppercase", letterSpacing: 4 }}>
            {label}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontSize: 88, lineHeight: 1.05, margin: 0, maxWidth: "85%" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 32, opacity: 0.8, margin: 0, maxWidth: "75%" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <span>siligurievent.com</span>
          <span style={{ color: palette.accent }}>{locale === "hi" ? "उत्तर बंगाल" : "North Bengal · India"}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

Type templates:

- **service** — accent brass border-left, label "Service / सेवा".
- **project** — full-bleed image overlay using `searchParams.cover` URL (post-launch when uploads are stable).
- **post** — italic Cormorant title, smaller sans subtitle, "Journal / जर्नल".
- **location** — pin glyph + region name as subtitle.
- **default** — brand-only fallback.

Cache: `@vercel/og` images cache on the edge keyed by URL. Send `cache-control: public, max-age=60, s-maxage=86400, stale-while-revalidate=2592000` for stability.

---

## 8. Localized keyword variants (Hindi / Devanagari)

The full canonical list lives in `lib/seo/keywords.ts`. Highlights for transliterated search intent:

### Tier 1 (transactional)

| English | Hindi (Devanagari) |
|---|---|
| wedding decorator in siliguri | सिलीगुड़ी में शादी डेकोरेटर |
| event decorator in siliguri | सिलीगुड़ी में इवेंट डेकोरेटर |
| bengali wedding decoration siliguri | सिलीगुड़ी में बंगाली शादी की सजावट |
| haldi decoration siliguri | सिलीगुड़ी में हल्दी की सजावट |
| mehendi decoration siliguri | सिलीगुड़ी में मेहंदी की सजावट |
| sangeet decoration siliguri | सिलीगुड़ी में संगीत की सजावट |
| reception decoration siliguri | सिलीगुड़ी में रिसेप्शन की सजावट |
| birthday decoration siliguri | सिलीगुड़ी में जन्मदिन की सजावट |
| corporate event decorator siliguri | सिलीगुड़ी में कॉर्पोरेट इवेंट डेकोरेटर |
| destination wedding decorator north bengal | उत्तर बंगाल में डेस्टिनेशन वेडिंग डेकोरेटर |
| wedding decorator in bagdogra | बागडोगरा में शादी डेकोरेटर |
| wedding decorator in darjeeling | दार्जिलिंग में शादी डेकोरेटर |

### Tier 2 (informational)

| English | Hindi (Devanagari) |
|---|---|
| bengali wedding rituals checklist | बंगाली शादी की रस्में चेकलिस्ट |
| how to plan a haldi ceremony | हल्दी समारोह की योजना कैसे बनाएं |
| wedding decoration cost in north bengal | उत्तर बंगाल में शादी की सजावट का खर्च |
| best wedding venues in siliguri | सिलीगुड़ी के सबसे अच्छे शादी के वेन्यू |
| best destination wedding locations in north bengal | उत्तर बंगाल में सबसे अच्छे डेस्टिनेशन वेडिंग स्थान |
| tea garden wedding north bengal | उत्तर बंगाल में चाय बागान की शादी |
| darjeeling wedding photography venues | दार्जिलिंग में शादी की फोटोग्राफी के स्थान |
| annaprashan decoration ideas | अन्नप्राशन सजावट के विचार |
| griha pravesh decoration | गृह प्रवेश की सजावट |
| durga puja pandal decoration siliguri | सिलीगुड़ी में दुर्गा पूजा पंडाल की सजावट |
| mandap design ideas | मंडप डिज़ाइन के विचार |
| indian wedding flower decoration ideas | इंडियन शादी फूल सजावट के विचार |
| engagement ceremony decoration ideas | सगाई समारोह की सजावट के विचार |
| naamkaran decoration ideas | नामकरण सजावट के विचार |
| godh bharai decoration | गोद भराई सजावट |

### Tier 3 (programmatic location × service)

7 locations × 9 services = **63 EN + 63 HI** generated by `expandProgrammaticKeywords()`. Examples:

- बागडोगरा में शादी डेकोरेटर
- कलिम्पोंग में रिसेप्शन डेकोरेटर
- जलपाईगुड़ी में हल्दी डेकोरेटर
- गंगटोक में बंगाली शादी डेकोरेटर
- दार्जिलिंग में जन्मदिन पार्टी डेकोरेटर
- डुआर्स में कॉर्पोरेट इवेंट डेकोरेटर

Total bilingual coverage: **30+ Tier 1+2 pairs + 63 programmatic pairs = ~150+ keyword variants**.

---

## 9. Google Search Console + GA4 + Google Business Profile checklist

### Google Search Console (GSC)

1. Verify property `https://siligurievent.com` via DNS TXT record (provided by GSC).
2. Add both URL-prefix properties: `https://siligurievent.com` AND `sc-domain:siligurievent.com`.
3. Submit `https://siligurievent.com/sitemap.xml` under Sitemaps.
4. Submit alternates: confirm `hreflang` shows no errors under International Targeting.
5. Set preferred country: India.
6. Enable email alerts: indexing drops, manual actions, security.
7. Connect to GA4 (Settings → Associations).
8. After 7 days, review Performance → Queries, group by country=IN.

### GA4

1. Create GA4 property "Siligurievent — Production".
2. Data streams: Web → `https://siligurievent.com`.
3. Enhanced measurement: on (scrolls, outbound clicks, file downloads).
4. Mark conversions: `inquiry_submit`, `whatsapp_click`, `phone_click`.
5. Disable Google signals only if you don't have a privacy notice ready.
6. Inject via `@next/third-parties/google` — `<GoogleAnalytics gaId="G-XXXXXXX" />` in root layout (after consent if EU traffic).
7. Filter internal IPs (owner's home + office).
8. Set up Looker Studio dashboard pinned to "Organic + Conversion" report.

### Google Business Profile (GBP)

1. Claim listing at business.google.com.
2. Verify via postcard (Siliguri address) or phone (if available).
3. Categories: Wedding planner (primary), Event planner, Decorator, Florist.
4. Service areas: Siliguri, Bagdogra, Darjeeling, Kalimpong, Jalpaiguri, Gangtok, Naxalbari, Sevoke, Salugara.
5. Hours: import from CMS `siteSettings.openingHours`.
6. Website URL → `https://siligurievent.com`.
7. Photos: upload 30+ at launch (logo, cover, interior, work samples). Refresh monthly.
8. Posts: weekly project highlight with CTA to `/portfolio/[slug]`.
9. Q&A: pre-seed 8 owner-authored FAQs (price band, areas served, lead time, languages).
10. Booking link: `https://siligurievent.com/contact`.
11. Reviews: after every event, send a take-home card with QR linking to GBP review URL.
12. Mirror NAP exactly on every citation site (JustDial, Sulekha, WedMeGood, ShaadiSaga, BookEventz, Wedding Wire India).

---

## 10. Programmatic `/decorators/[location]/[service]` — duplicate-content strategy

Risk: 7 × 19 = up to 133 pages that share scaffold copy. Mitigations:

1. **Content composition algorithm**: each page is assembled from 5 modular sections, each pulling a different data shard:
   - **Hero** — H1 uses `${service.name} Decorators in ${location.name}`; subhead pulls a location-specific sentence from CMS (`locations.introCopy`).
   - **Local lens** — minimum **3 nearby venues** with `(name, area, type)` triplets from `locations.venues`. Avoids generic filler.
   - **Filtered portfolio strip** — 3 projects geo-matched to the location AND ceremony-tagged to the service. If <3, fall back to the nearest location with a "Nearby work" label.
   - **Pricing band block** — pulls the `priceBand` from the service + a 2-sentence note about the location's typical scale (small destination crowds in Darjeeling vs. larger Siliguri receptions, etc.).
   - **FAQ** — 3 question/answers blended from {service FAQ pool} ∪ {location FAQ pool}. Order seeded by `(location.slug + service.slug)` hash to produce stable but unique ordering across the grid.

2. **Unique meta description** generated from `{service} × {location}` template with **location-specific clauses** (e.g., "tea-garden venues in Darjeeling," "monsoon planning for Dooars").

3. **Internal linking**: each programmatic page links to:
   - parent service page (`/services/[svc]`),
   - parent location page (`/locations/[loc]`),
   - 2 sibling combos (different service same location, same service different location),
   - 1 cluster blog post if topically relevant.

4. **Canonical**: self-canonical, but if a particular combo has thin content (no projects + no venues + no FAQs), set `noIndex: true` and emit `<link rel="canonical">` pointing at the parent service page.

5. **Image art-direction**: each combo gets a **location-specific OG image** via `/api/og?type=service&location=darjeeling&service=wedding` — distinct visuals signal distinct pages to image-aware crawlers.

6. **Content min-bar gate**: a page only enters `generateStaticParams` output if it passes:
   - ≥1 nearby venue,
   - ≥1 portfolio project geo-matched OR ceremony-matched,
   - meta description not byte-identical to any other emitted page.

   The build script logs gated pages and the owner can fill content gaps in CMS to enable them later.

7. **Robots policy on the grid root**: `/decorators` itself is `noindex,follow` — only the leaf combo pages enter the index.

---

## 11. WebSite + sitelink search box (future)

Once an in-site search is added, drop this into the root layout via `jsonLdScript`:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://siligurievent.com",
  "name": "Siligurievent",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://siligurievent.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

Until search exists, omit `potentialAction` and emit only `WebSite { url, name, inLanguage }`.

---

## 12. Anti-pattern checklist (gates before deploy)

- [ ] No numeric INR figures in any emitted JSON-LD (`price` is band string only).
- [ ] Every page has exactly one `<h1>`.
- [ ] No page emits `AggregateRating` until real reviews exist.
- [ ] Programmatic pages with zero nearby content are `noindex`.
- [ ] Hindi pages without a translated body fall back to EN with a banner AND the page's hreflang map drops `hi-IN`.
- [ ] `/admin` and Payload API routes are disallowed in robots.txt.
- [ ] No duplicate canonicals across pages.
- [ ] OG images return 200 with correct content-type within 1s P95.
