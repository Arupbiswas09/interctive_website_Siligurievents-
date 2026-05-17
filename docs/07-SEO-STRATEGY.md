# 07 — SEO Strategy

The plan to rank for North Bengal event decoration queries within 6 months.

## 7.1 Goals & success metrics

| Metric | 3-month target | 6-month target |
|---|---|---|
| Organic clicks/month (GSC) | 500 | 3,000 |
| Indexed pages | 60+ | 150+ |
| Top-10 keywords | 30 | 120 |
| "Wedding decorator in Siliguri" position | top 5 | #1 |
| LCP (75th percentile, mobile) | < 2.5s | < 2.0s |
| Local pack appearance | yes | dominant |

## 7.2 Audience search behavior

Indian event decoration buyers search in patterns like:

- `[event type] decorator in [city]`  — high commercial intent
- `[ceremony] decoration ideas` — informational
- `best [event] decorators near me` — local
- `wedding decoration cost in [city]` — pricing intent
- `[venue name] decoration` — long-tail
- `[ceremony in regional script]` — Bengali / Hindi text occasionally

Many queries are conversational on mobile (voice search), so we use natural-language H2s.

## 7.3 Keyword universe

### Tier 1 — core money keywords (target home + services)
- wedding decorator in siliguri
- event decorator in siliguri
- bengali wedding decoration siliguri
- haldi decoration siliguri
- mehendi decoration siliguri
- sangeet decoration siliguri
- reception decoration siliguri
- birthday decoration siliguri
- corporate event decorator siliguri
- destination wedding decorator north bengal
- wedding decorator in bagdogra
- wedding decorator in darjeeling

### Tier 2 — informational (target blog)
- bengali wedding rituals checklist
- how to plan a haldi ceremony
- wedding decoration cost in north bengal
- best wedding venues in siliguri
- best destination wedding locations in north bengal
- tea garden wedding north bengal
- darjeeling wedding photography venues
- annaprashan decoration ideas
- griha pravesh decoration
- durga puja pandal decoration siliguri

### Tier 3 — long-tail (programmatic location × service pages)
- wedding decorator in [bagdogra|kalimpong|jalpaiguri|gangtok]
- [haldi|mehendi|sangeet|reception] decorator in [each location]
- corporate event decorator in [each location]
- [event] in [specific venue name]

### Tier 4 — branded (auto-rank)
- siliguri events
- siliguri events decorator
- siliguri events reviews

## 7.4 On-page SEO checklist (every page)

- [ ] Unique `<title>` ≤ 60 chars
- [ ] Unique meta description ≤ 155 chars, includes primary keyword + CTA verb
- [ ] One `<h1>`, includes primary keyword naturally
- [ ] Logical H2/H3 hierarchy
- [ ] All images have descriptive `alt` text (no decorative images without alt="")
- [ ] Internal links: ≥3 to relevant pages, descriptive anchor text
- [ ] Outbound link to one authoritative source (venue site, news article) where it helps trust
- [ ] Open Graph + Twitter Card tags
- [ ] Canonical URL set
- [ ] JSON-LD structured data appropriate to page type
- [ ] No broken links
- [ ] Mobile-optimised
- [ ] Page exists in `sitemap.xml`

## 7.5 Title & meta templates

| Page | Title template | Meta description template |
|---|---|---|
| Home | `Siligurievent · Wedding & Event Decorators in Siliguri, North Bengal` | `Cinematic wedding, haldi, sangeet, reception and event decor across Siliguri, Darjeeling and the Dooars. See our work & plan your celebration.` |
| Service | `{Event} Decoration in Siliguri \| Siligurievent` | `{Event} decor by Siligurievent — {short USP}. Honest pricing bands; custom quotes from there. Plan yours across North Bengal.` |
| Portfolio | `Our Work \| Wedding & Event Decor Portfolio \| Siligurievent` | `Browse signature wedding, haldi, reception and corporate event designs by Siligurievent across Siliguri and North Bengal.` |
| Case study | `{Project Name} · {Ceremony}, {Location} \| Siligurievent` | `Behind the scenes of {Project Name} — a {Ceremony} we designed in {Location}. {N} guests, {N} days.` |
| Pricing | `Pricing & Packages \| Event Decoration \| Siligurievent` | `Honest pricing bands (₹ / ₹₹ / ₹₹₹) for wedding, haldi, birthday and corporate event decoration across North Bengal. Custom quotes from there.` |
| Blog post | `{Title} \| Siligurievent Journal` | `{Excerpt — 145 chars max}` |
| Contact | `Contact \| Plan Your Event with Siligurievent` | `WhatsApp, call, or fill our form. We reply within an hour, 9 AM–9 PM IST.` |
| Location | `Event Decorators in {Location} \| Siligurievent` | `Wedding and event decor in {Location} by Siligurievent. {N} signature projects nearby. Talk to a planner.` |

## 7.6 Structured data (JSON-LD)

All schemas authored via `schema-dts` for type safety.

### Site-wide
- **Organization** (in root layout) — name, logo, sameAs (social), contactPoint.
- **LocalBusiness** (on Home + Contact) — address, geo, openingHours, telephone, priceRange, areaServed.
- **WebSite** (in root layout) — with potential `SearchAction` once we add search.

### Per-page
| Page | Schemas |
|---|---|
| Home | `Organization`, `LocalBusiness`, `WebSite` |
| About | `AboutPage`, `Person` (founder), `Organization` |
| Service | `Service` (with `provider`, `areaServed`, `offers`), `BreadcrumbList`, `FAQPage` |
| Portfolio index | `CollectionPage`, `BreadcrumbList` |
| Case study | `CreativeWork` or `Event`, `ImageObject` array, `BreadcrumbList` |
| Pricing | `OfferCatalog` with nested `Offer` per package |
| Blog index | `Blog`, `BreadcrumbList` |
| Blog post | `BlogPosting` (with author, datePublished, image), `BreadcrumbList`, `FAQPage` (if FAQs present) |
| Contact | `ContactPage`, `LocalBusiness` |
| Location | `LocalBusiness` (areaServed = location), `Place`, `BreadcrumbList` |

### Example — Service page
```jsonld
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Wedding Decoration",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Siligurievent",
    "telephone": "+91-XXXXXXXXXX",
    "address": { "@type": "PostalAddress", "addressLocality": "Siliguri", "addressRegion": "WB", "addressCountry": "IN" }
  },
  "areaServed": [
    { "@type": "City", "name": "Siliguri" },
    { "@type": "City", "name": "Bagdogra" },
    { "@type": "City", "name": "Darjeeling" }
  ],
  "offers": { "@type": "Offer", "priceCurrency": "INR", "priceRange": "₹₹" },
  "image": [...]
}
```

> Per `DECISIONS.md` D-002, we emit `priceRange` as the band string (`"₹"`, `"₹₹"`, or `"₹₹₹"`) and **never** a numeric `price` / `minPrice`. The internal-only `startingPriceInternal` value lives in the CMS for the owner's quoting workflow and is never serialised into schema or HTML.

## 7.7 Content cluster strategy

Each major service is a "pillar." The pillar service page links to 6–10 supporting cluster posts on the blog.

### Wedding pillar example
- Pillar: `/services/wedding`
- Cluster posts (in `/blog`):
  - "How to plan a Bengali wedding in 6 months"
  - "Mandap design ideas that stay cinematic"
  - "Best wedding venues in Siliguri (with photos)"
  - "Tea garden weddings in Darjeeling: what to know"
  - "Indian wedding decoration cost breakdown 2026"
  - "Floral choices for North Bengal weddings"
  - "Wedding photography vs videography: what to invest in"
  - "Destination wedding logistics from Siliguri"

Each cluster post links back to the pillar with descriptive anchor text. Pillar links out to clusters in a "Read more on weddings" section.

## 7.8 Local SEO

### Google Business Profile
- Owner-controlled.
- Categories: Wedding planner, Event planner, Decorator, Florist.
- Service areas: Siliguri, Bagdogra, Darjeeling, Kalimpong, Jalpaiguri, Gangtok, Naxalbari, Sevoke, Salugara.
- Photos: 30+ at launch, refreshed monthly.
- Posts: 1/week with case studies.
- Reviews: gentle ask after every event delivery (with QR code on take-home card).

### Local citations
- JustDial, Sulekha, WedMeGood, ShaadiSaga, BookEventz, Wedding Wire India — claim and standardise NAP.
- Same name, address, phone format everywhere.

### Geo schema
- Embed `geo` coordinates in LocalBusiness schema.
- City-specific landing pages with `Place` schema.

## 7.9 Technical SEO

- `next-sitemap` generates `sitemap.xml` + `robots.txt` post-build.
- `sitemap-index.xml` if we exceed 50,000 URLs (won't happen at this scale, but config is ready).
- **IndexNow** API: POST new and updated URLs to Bing/Yandex on Payload `afterChange` hook for publish events.
- `hreflang` tags ready for future i18n (`en-IN`, `hi-IN`, `bn-IN`).
- Open Graph dynamic image generation via `@vercel/og` — one per service, case study, blog post.
- Twitter Card type: `summary_large_image`.

### `<head>` example pattern (in `generateMetadata`)
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await getService(params.slug);
  return {
    title: `${service.name} Decoration in Siliguri | Siligurievent`,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.name,
      description: service.metaDescription,
      images: [{ url: `/api/og?type=service&slug=${service.slug}`, width: 1200, height: 630 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}
```

## 7.10 Performance SEO (Core Web Vitals)

CWV is a ranking signal in India where competitors are slow. See [10-PERFORMANCE.md](./10-PERFORMANCE.md).

## 7.11 Content publishing cadence

- **Launch**: 6 cluster blog posts ready.
- **Month 1–3**: 1 post/week, focus on transactional intent (decorator-cost, venue-guides).
- **Month 4–6**: 2 posts/week including event recap case studies (which double as portfolio + blog).
- **Always**: refresh top-3 traffic posts every 6 months.

## 7.12 Off-page

- Backlinks from Bengali wedding magazines (Wedding Affair, WeddingSutra, ShaadiSaga blog).
- Guest posts on local lifestyle blogs.
- Vendor reciprocity: photographers, MUAs, caterers link-exchange.
- YouTube channel — every project gets a 60-90s cinematic recap, links back to portfolio.

## 7.13 Tracking & iteration

- Weekly GSC review (query positions, indexing, mobile usability).
- Monthly: top-20 pages — refresh metadata, internal linking, content depth.
- Quarterly: full audit (Screaming Frog mock + Lighthouse).
- A/B test homepage hero copy (Vercel Edge Config flags).

## 7.14 Anti-patterns we avoid

- Keyword stuffing in body copy.
- "Best wedding decorator in Siliguri 2026" repeated 14 times.
- Fake reviews / structured data on pages without real reviews.
- Linking out to competitors (instead, link to neutral resources).
- Doorway pages without unique content.
- Hidden text or schema markup that doesn't match visible content.
