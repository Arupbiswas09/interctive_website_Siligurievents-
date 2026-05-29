# SEO Ranking Plan — "Siliguri balloon decoration" & "Siliguri decoration"

**Goal:** rank Siligurievent #1 on Google for **"Siliguri balloon decoration"** and **"Siliguri decoration"**.
**Canonical domain:** `https://siligurievent.com` (non-www). The owner must flip the Vercel
redirect so **www → non-www** (currently it is non-www → www, which points away from the canonical).

This is the single owner-readable action plan. The honest summary: on-page work (in this
repo) is roughly 70% there; the remaining 30% that actually decides local ranking is
**off-page** and only the owner can do it — Google Business Profile, reviews, and citations.

---

## 1. What's already done in code

- **Dedicated balloon page exists.** `/services/balloon-decoration` is live with real
  (non-`TODO`) copy, 4 real FAQs, and keyword-rich inclusions — `lib/cms/services.ts:535-602`.
- **Auto-listed everywhere a service list is generated:** it appears in the `/services`
  bento grid, in `generateStaticParams` (gets its own static page), in the sitemap
  (`app/sitemap.ts` pulls `getServiceSlugs()`), and in related-service blocks.
- **Home + root metadata retargeted** to "Wedding, Balloon & Event Decoration in Siliguri"
  — `app/(site)/page.tsx:58-76` and `app/layout.tsx:7-65`. Keywords now lead with
  "balloon decoration Siliguri" and "decoration in Siliguri".
- **Canonical + metadata framework** is centralised (`lib/seo/metadata.ts`): every page gets
  `<link rel="canonical">`, OG, Twitter, robots `index,follow`, hreflang (en-IN + x-default),
  all anchored to `https://siligurievent.com`.
- **Structured data** on every service page: `Service` + `BreadcrumbList` + `FAQPage`
  JSON-LD; `Organization` + `LocalBusiness` + `WebSite` (SearchAction) on the home page
  (`lib/seo/schemas.ts`). `Service` includes `areaServed` (Siliguri, Bagdogra, Darjeeling…)
  and `provider` (LocalBusiness).
- **NAP standardised** in `lib/cms/site-settings.ts`: Darjeeling More, Siliguri, West Bengal
  734001; phone +91 62940 92551. Used by footer + JSON-LD.
- **Favicon / icons / theme-color / OG image** wired in `app/layout.tsx`.
- **Search Console verification hook** already wired:
  `metadata.verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  (`app/layout.tsx:62-64`) — just needs the env value set.

---

## 2. Code fixes still recommended

Ordered by ranking impact. Each is a small, safe edit.

### HIGH — fix the balloon page's own on-page signals

- [ ] **Duplicate word in `<title>`.** The page title resolves to
  **"Balloon Decoration decoration in Siliguri | Siligurievent"** — "Decoration decoration"
  because the generic builder appends " decoration in Siliguri" to a name that already ends
  in "Decoration". Fix in `app/(site)/services/[slug]/page.tsx:73` — either special-case names
  ending in "decoration", or change the template to not double the word
  (e.g. `` `${service.name} in Siliguri` `` and add an explicit balloon override). Target title:
  **"Balloon Decoration in Siliguri | Siligurievent"**.
- [ ] **H1 does not contain "Siliguri".** The H1 is just `service.name` = "Balloon Decoration"
  (`ServiceDetailHero`, fed at `app/(site)/services/[slug]/page.tsx:188-200`). For the #1
  target term the H1 should read **"Balloon Decoration in Siliguri"**. Cheapest fix: pass a
  per-service `h1`/heading override, or for the balloon slug pass
  `name={"Balloon Decoration in Siliguri"}` to `ServiceDetailHero` only (keep `service.name`
  for cards/schema). Do NOT globally rename — it would distort every other service H1.
- [ ] **Meta description too long.** `shortDescription` is 192 chars
  (`lib/cms/services.ts:542-543`); Google truncates ~155–160. Trim to ~155 while keeping
  "balloon decoration" + "Siliguri" in the first 120 chars.
- [ ] **Broken keyword interpolation.** Keywords resolve to
  "balloon decoration **decorator** Siliguri" and "balloon decoration **decoration** North
  Bengal" (`page.tsx:77-82` lower-cases `service.name` and appends "decorator"/"decoration").
  For balloon that reads awkwardly. Add a per-service `keywords` field on `Service` and use it
  when present; fall back to the generated list otherwise. Target set:
  `["balloon decoration Siliguri", "balloon decorator Siliguri", "birthday balloon decoration Siliguri", "balloon decoration North Bengal"]`.

### HIGH — internal linking (anchor text is a ranking signal)

- [ ] **Home page does not link to the balloon page.** `HomeServicesOverview` hard-codes 7
  tiles (wedding, haldi, mehendi, sangeet, reception, **birthday-party**, corporate) —
  `components/marketing/sections/home-services-overview.tsx:30-81`. Add a tile linking to
  `/services/balloon-decoration` with anchor/label text **"Balloon Decoration"** (replace one
  weaker tile or extend the grid). A home-page internal link with exact-match anchor text is
  one of the strongest cheap wins for the target term.
- [ ] **Footer has no Services sub-list.** `components/marketing/footer.tsx:7-23` only lists
  top-level pages + Locations. Add a short "Popular services" column (or extend Sitemap) with
  links to `/services/balloon-decoration` ("Balloon Decoration"),
  `/services/wedding`, `/services/birthday-party`. Sitewide footer links pass anchor-text
  equity to the balloon page from every page.

### MEDIUM — body copy & images

- [ ] **No `<h2>` carries "Siliguri".** Section headings on the page are generic
  ("A studio's worth of detail, per ceremony.", "Four steps…" —
  `components/marketing/sections/service-inclusions.tsx:39,98`). These are shared across all
  services so don't hard-code "balloon" there. Instead lean on the H1 fix + the already-good
  body copy in `longDescription` (which does repeat "Siliguri" + "balloon" naturally).
- [ ] **Image alt text is weak/generic.** The balloon hero resolves to a *wedding* hero plate
  (`pickSeedImage(SEED_HERO, "balloon-decoration")` → one of `/images/marketing/hero-*` etc.,
  `lib/cms/services.ts:601` + `lib/media/seed-images.ts:82-89`) — not a balloon image, and the
  hero renders it as a CSS background with `aria-hidden` (no alt at all,
  `service-detail-hero.tsx:56-65`). On the `/services` bento tile the alt is just
  `service.name` = "Balloon Decoration" (`services-hub-bento.tsx:189`). Recommended:
  (a) add a real balloon photo to `/public/images/services/` and a `balloon` seed pool so the
  hero/tile shows balloons; (b) give the bento `alt` a descriptive value like
  **"Balloon decoration in Siliguri — birthday arch"**. Real, relevant, well-`alt`-ed images
  help Google Images + the local pack.
- [ ] **Replace the remaining stub content on the page.** `signatureProjects` are
  `TODO: Project name` stubs (`STUB_PROJECTS`, `lib/cms/services.ts:574`). Real captioned
  project cards ("First birthday balloon arch, Siliguri") add unique, keyword-relevant text.

### LOW — nice-to-have

- [ ] Add `OpeningHoursSpecification` to LocalBusiness (the data exists in
  `site-settings.ts:45` `"Mo-Sa 10:00-19:00"` but isn't passed into `buildSiteSettings()` in
  `app/(site)/page.tsx:39-56`). Opening hours strengthen the LocalBusiness entity.
- [ ] Add a numeric/geo `geo` (lat/lng) to LocalBusiness once the exact studio pin is known —
  improves map relevance.
- [ ] Consider a dedicated `/locations/siliguri` cross-link to the balloon service.

---

## 3. JSON-LD validation (schema.org + Google Rich Results)

Validated the four schemas the balloon page emits. File refs are `lib/seo/schemas.ts` unless noted.

**Service** (`buildService`, `schemas.ts:299-342`) — PASSES.
- Has `name`, `serviceType`, `description`, `provider` (LocalBusiness), `areaServed` (array of
  City), `offers`, `url`, `@id`. `areaServed` is present (good — its absence is the most common
  Service warning).
- `priceRange` carries the band glyph "₹"; `Offer.priceCurrency` = "INR". **No numeric `price`
  is emitted** — correct. Google's price validator rejects glyphs in `price`, but `priceRange`
  accepts band glyphs, so this is safe (the comment at `schemas.ts:310-313` documents the
  intent). No rejection.
- Note: `Service` is **not** a Rich-Result-eligible type on its own (no special SERP feature),
  but it is valid and useful for entity understanding. No errors/warnings expected.

**FAQPage** (`buildFAQ`, `schemas.ts:361-374`) — VALID, with one important caveat.
- Shape is correct: `mainEntity[]` of `Question` → `acceptedAnswer` → `Answer.text`.
- The balloon page passes **real** FAQs (`services.ts:575-596`), so this is genuine content —
  good. (Other services still pass `TODO:`-prefixed STUB_FAQS; emitting `TODO:` text in
  FAQPage on those pages is a content-quality risk, not a balloon-page problem.)
- **Google policy caveat:** since 2023 the FAQ rich result is shown **only for well-known
  authoritative government/health sites**. The markup is still valid and worth keeping (entity
  signals, future-proofing) but **do not expect FAQ accordions in the SERP**. Not a rejection.
- **CONTENT-MATCH WARNING:** Google requires FAQPage markup to match visible on-page Q&A. The
  page does render the same FAQs via `ServiceFaqs` (`page.tsx:220`), so this is satisfied —
  keep it that way (don't let schema FAQs drift from the rendered ones).

**BreadcrumbList** (`buildBreadcrumb`, `schemas.ts:344-359`) — PASSES.
- `itemListElement[]` with `position`, `name`, `item` (absolute URLs). Eligible for breadcrumb
  rich result. No issues.

**LocalBusiness** (`buildLocalBusiness`, `schemas.ts:255-297`) — VALID, two soft warnings.
Note: LocalBusiness is emitted on the **home page**, not on the service page; the service
page's `Service.provider` embeds a LocalBusiness object built from `SITE_SETTINGS_STUB`.
- The service page's provider uses **`SITE_SETTINGS_STUB`** (`page.tsx:89-94`) which only sets
  `businessName`, `city`, `state`, `country` — so **no `telephone`, no `streetAddress`, no
  `postalCode`, no `geo`** on the provider object. The full NAP only appears in the *home page*
  LocalBusiness (which reads `getSiteSettings()`). **Recommendation:** feed real
  `getSiteSettings()` into the service page too (replace the stub at `page.tsx:86-94`) so every
  Service.provider carries phone + full address. This is a real, fixable gap. (Listed again as
  a code fix below.)
- `priceRange` is hard-coded "₹₹" on LocalBusiness (`schemas.ts:293`) regardless of service —
  acceptable (it's a business-level band), not an error.
- `address.addressRegion` falls back to "WB" when state missing (`schemas.ts:174`); home page
  passes "West Bengal" so it's fine there. No rejection.

**Additional code fix surfaced by validation:**
- [ ] **Service.provider is missing NAP.** Replace `SITE_SETTINGS_STUB`
  (`app/(site)/services/[slug]/page.tsx:86-94`) with values from `getSiteSettings()` so the
  embedded LocalBusiness on every service page carries `telephone`, `streetAddress`,
  `postalCode`. HIGH value for local relevance.

**Net:** nothing in the JSON-LD would be *rejected* by Google's validator. The only true
warnings are (a) the stubbed provider NAP on service pages, and (b) `TODO:` FAQ text on the
*other* (non-balloon) services — both fixable in code.

---

## 4. Will the balloon service show up automatically on /services?

**Yes.** `/services` calls `getServices()` (`app/(site)/services/page.tsx:46`), which returns
**all** `MOCK_SERVICES` sorted by **category, then per-category `order`**
(`lib/cms/services.ts:1011-1021`). The balloon entry is `category: "family-rituals"`,
`order: 0` (`services.ts:539-540`), so:

- **Label in the grid:** "Balloon Decoration" (the `service.name`), with category eyebrow
  **"Family ritual"** (`services-hub-bento.tsx:35-41`).
- **Order:** categories are sorted alphabetically by slug
  (`"corporate" < "family-rituals" < "festivals" < "pre-wedding" < "weddings"`), and within
  family-rituals `order: 0` makes balloon the **first family-ritual tile** (before
  birthday-party `order: 1`). So it appears in the second category block, first tile.
- **Image:** no real balloon image — it falls back to a generic decor photo from
  `FALLBACK_IMAGES` (`services-hub-bento.tsx:44-55`, because `heroImageUrl` is a local `/images`
  path, not `http`, so the `startsWith("http")` check at line 165 sends it to the fallback).
  Worth adding a real balloon image (see §2).

No code change is required for it to *appear*; the recommended changes are about *quality*
(real image, "Family ritual" vs a more discoverable label, and the on-page fixes in §2).

---

## 5. Off-page — what only the owner can do (this decides #1)

For a local query like "Siliguri balloon decoration", Google's local pack ranks mostly on
**Google Business Profile (GBP) relevance + proximity + prominence (reviews)** — not on website
copy. The website supports the GBP; it rarely outranks it. Be realistic: **the items below
matter more than everything in §2–§4 combined.**

### Google Business Profile (do this first, this week)
- [ ] **Claim / create the GBP** at business.google.com with the **exact** NAP — it must match
  the website character-for-character:
  - Name: **Siligurievent**
  - Address: **Darjeeling More, Siliguri, West Bengal 734001**
  - Phone: **+91 6294092551**
  - Website: **https://siligurievent.com**
- [ ] **Verify** the listing (postcard / phone / video) — unverified listings don't rank.
- [ ] **Categories:** primary **"Balloon decoration service"** (or closest available, e.g.
  "Party planner"); secondary **"Event planner"**, **"Wedding planner"**. Primary category is a
  major relevance lever for the balloon term.
- [ ] **Service area:** list Siliguri + Bagdogra, Matigara, Jalpaiguri, Darjeeling.
- [ ] **Photos:** upload **15+ real photos** (balloon arches, birthday setups, weddings) —
  geotagged, well-lit. Listings with many real photos get more clicks and rank better.
- [ ] **Reviews:** target **20+ genuine Google reviews**. Ask every happy client to review and
  to mention "balloon decoration" / "Siliguri" naturally. Reply to every review. **This is the
  single biggest factor for local #1.** Never buy or fake reviews.
- [ ] **Google Posts:** post weekly (offers, recent setups, festival specials).
- [ ] **Products/Services:** add "Balloon Decoration", "Birthday Decoration", "Wedding Decor"
  as services with photos + the website service-page URLs.

### Facebook page — match the NAP
- The screenshot showed an existing Facebook page (reportedly named **"Club Gravity"**).
  - [ ] Either rename/align it to **Siligurievent** with the **exact same NAP** and website, or
    create/keep a dedicated **Siligurievent** page. Inconsistent business name + NAP across
    Facebook/GBP **hurts** local ranking (Google cross-checks citations). Pick ONE business
    name and make every profile identical.
  - [ ] Add the GBP/Facebook/Instagram URLs to `social` in site settings so they flow into the
    `sameAs` of the Organization/LocalBusiness JSON-LD (the builder already supports
    `social.facebook`, `social.googleBusiness`, etc. — `schemas.ts:178-188`).

### Local citations (NAP consistency across the web)
Create listings with the **identical** NAP on:
- [ ] JustDial, Sulekha, IndiaMART, AskLaila, TradeIndia
- [ ] Google Maps (via GBP), Bing Places, Apple Business Connect
- [ ] Facebook, Instagram (business profile with address), WhatsApp Business catalogue
- [ ] Wedding directories: **WedMeGood**, **WeddingWire India (weddingz / wedmegood)**,
  ShaadiSaga, Eventective — list under decorators/balloon decor, link the website.

### Local backlinks (prominence)
- [ ] Get links from local Siliguri sites: venue partners, banquet halls, photographers,
  caterers, school/college event pages, local news / blog features. A few relevant local
  backlinks move the needle more than many generic ones.

---

## 6. Realistic timeline & caveat

Stated plainly:

- **Indexing:** once Search Console verification + sitemap submission are done, the balloon page
  is typically crawled and indexed within **days to ~2 weeks**.
- **Ranking for the target terms:** with the on-page fixes in §2 **plus** a verified,
  well-populated GBP and a steady flow of genuine reviews, a local business in a mid-size city
  like Siliguri can realistically reach the **first page / local pack in roughly 4–12 weeks**,
  and often the top 3 within **2–4 months** if competition is light and reviews keep coming.
- **#1 is never guaranteed.** Local ranking is dominated by **GBP proximity to the searcher,
  review quantity/quality, and category match** — factors that are partly outside anyone's
  control (proximity especially). What we *can* control: NAP consistency, review velocity,
  category accuracy, photos, and on-page relevance. Do those relentlessly and #1 (or a strong
  top-3) is achievable, but treat anyone promising a guaranteed #1 as a red flag.
- **Maintenance, not a one-off:** weekly GBP posts + a continuous trickle of reviews is what
  *holds* a top position. Rankings decay if the profile goes quiet.

---

## 7. How to verify Google Search Console

1. **Add property** in [Search Console](https://search.google.com/search-console) — choose the
   **URL-prefix** property `https://siligurievent.com` (the canonical, non-www).
2. **HTML-tag verification** is already wired: copy the `content` value from the
   `google-site-verification` meta tag Google gives you and set it as a Vercel env var:
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<the-code>`
   - It is consumed at `app/layout.tsx:62-64` → renders `<meta name="google-site-verification">`.
   - Redeploy, then click **Verify**. (Domain-property + DNS TXT also works and verifies www +
     non-www together — preferable once the www→non-www redirect is flipped.)
3. **Submit the sitemap:** in Search Console → Sitemaps, submit
   **`https://siligurievent.com/sitemap.xml`** (served by `app/sitemap.ts`, includes the balloon
   page automatically).
4. **Request indexing:** use the URL Inspection tool on
   `https://siligurievent.com/services/balloon-decoration` and the home page → "Request indexing".
5. **Monitor:** after ~1–2 weeks, watch the Performance report for impressions/clicks on
   "balloon decoration" / "decoration" + "Siliguri" queries; check Coverage for any excluded
   pages.

Also link the GBP and Search Console to the same Google account so Insights line up.
