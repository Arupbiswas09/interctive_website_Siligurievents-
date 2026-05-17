# 04 — Information Architecture

How the site is organised. URLs, navigation, hierarchy, and how a visitor moves through it.

## 4.1 Sitemap (URL tree)

```
/
├── /about
├── /services                              (services index)
│   ├── /services/wedding                  (generic + Hindu, Sikh, Muslim, Christian, Marwari, Nepali traditions covered via tradition sections within the page; Bengali has its own slug below)
│   ├── /services/bengali-wedding
│   ├── /services/haldi-gaye-holud
│   ├── /services/mehendi
│   ├── /services/sangeet
│   ├── /services/engagement-roka
│   ├── /services/reception
│   ├── /services/cocktail-party
│   ├── /services/birthday-party
│   ├── /services/anniversary
│   ├── /services/baby-shower-godh-bharai
│   ├── /services/annaprashan-rice-ceremony
│   ├── /services/naamkaran
│   ├── /services/griha-pravesh
│   ├── /services/corporate-events
│   ├── /services/durga-puja-decoration
│   ├── /services/lakshmi-puja
│   ├── /services/saraswati-puja
│   └── /services/private-celebrations
├── /portfolio                             (gallery + case studies index)
│   ├── /portfolio/[slug]                  (individual project case study)
│   └── /portfolio?category=wedding        (filtered views via query)
├── /pricing                               (packages index)
├── /blog                                  (content marketing hub)
│   ├── /blog/[slug]
│   └── /blog/category/[slug]
├── /contact
├── /locations                             (programmatic local SEO)
│   ├── /locations/siliguri
│   ├── /locations/bagdogra
│   ├── /locations/darjeeling
│   ├── /locations/kalimpong
│   ├── /locations/jalpaiguri
│   ├── /locations/gangtok
│   └── /locations/dooars
├── /privacy
├── /terms
└── /admin                                 (Payload CMS — not in sitemap)
```

> **Community coverage note**: Per the brief, we serve weddings across **Bengali, Marwari, Nepali, Hindu, Sikh, Muslim, and Christian** traditions. Only Bengali gets a dedicated slug (`/services/bengali-wedding`) given its regional dominance. All other traditions are covered within `/services/wedding` via tradition-specific content sections (rituals, vocabulary, signature setups) authored as Payload Lexical blocks — not as separate URL slugs. This keeps the locked service count at 19 (see §4.2) while honouring the breadth promise in `PLAN.md §1.5` and `README.md`. SEO Tier 1 keywords (`07-SEO-STRATEGY.md §7.3`) should be expanded to include "marwari wedding decorator", "punjabi/sikh wedding decorator", "christian wedding decorator", and "nikah/muslim wedding decorator" anchored to the `/services/wedding` page.

## 4.2 Programmatic landing pages (post-launch SEO multiplier)

Combine location × service for long-tail traffic. URL pattern:

```
/decorators/[location]/[service]
```

Examples:
- `/decorators/siliguri/wedding`
- `/decorators/siliguri/birthday-party`
- `/decorators/bagdogra/reception`
- `/decorators/darjeeling/destination-wedding`

These are generated from `location × service` Payload data at build time. Each gets:
- Custom H1: "Wedding Decorators in Siliguri | Siligurievent"
- Local schema markup
- 3–5 nearby venue mentions
- Filtered portfolio strip
- Identical CTA layout

7 locations × 19 services ≈ **133 indexable pages** for negligible marginal cost.

## 4.3 Primary navigation

### Desktop header
```
[ LOGO ]                  Work  Services  About  Pricing  Journal     [ Plan My Event → ]
```
- Sticky on scroll, transparent on hero, solidifies after 80px scroll.
- "Plan My Event" CTA visually distinct (wine on cream, or cream on wine pressed state).
- No mega-menus. Services dropdown is a curated 2-column flyout listing only the top 8 services + "View all →".
- Accent: tiny brass marigold mark next to logo on hover.

### Mobile header
```
[ ☰ ]                                            [ LOGO ]                [ WhatsApp ]
```
- Hamburger opens a full-screen overlay with staggered link reveal (GSAP).
- WhatsApp icon always reachable at thumb position.
- Bottom-sticky "Plan My Event" CTA bar on scroll.

### Mobile menu overlay structure
```
Work
Services        ↓ (accordion: full list)
About
Pricing
Journal
Contact
———————
+91 XXX XXX XXXX
hello@siligurievent.com
———————
[ WhatsApp ]  [ Instagram ]  [ YouTube ]
```

## 4.4 Footer

Three columns (desktop) / stacked (mobile):

**Column 1 — Studio**
- Mark (logo)
- Tagline
- One-line elevator
- Email / phone / WhatsApp

**Column 2 — Sitemap**
- Work
- Services (top 6 + "All")
- About
- Pricing
- Journal
- Contact

**Column 3 — Locations + Social**
- Siliguri / Bagdogra / Darjeeling / Kalimpong / Jalpaiguri / Gangtok
- Instagram / YouTube / Pinterest / WhatsApp / Google Business

**Bottom strip**
- © 2026 Siligurievent · Designed for celebrations across North Bengal
- Privacy · Terms
- Small map pin: Sevoke Road, Siliguri, WB

Background: dark theme. Type: ivory on charcoal. A single brass hairline divider at top.

## 4.5 Breadcrumbs

- Visible on every page except Home, Hero-mode service pages, and Portfolio case studies.
- Format: `Home / Services / Wedding` — minimal, lowercase, hairline separators.
- Output JSON-LD `BreadcrumbList` on all pages for SEO regardless of visual rendering.

## 4.6 Internal linking strategy

Every page links to:
1. **Up to 3 sibling pages** in the same category (Services → other services).
2. **1 case study** that demonstrates the service.
3. **The contact / inquiry CTA** at least twice (header + page-specific in-context CTA + footer).
4. **Blog cluster posts** when applicable (Service → "How we plan a 500-guest Bengali wedding").

This creates a tight internal graph for SEO authority distribution.

## 4.7 URL conventions

- All lowercase.
- Hyphenated, never underscored.
- Singular nouns for service pages (`/services/wedding`, not `/services/weddings`).
- Indian ceremony names as primary slugs with English clarifier in slug where meaning helps: `/services/haldi-gaye-holud`, `/services/baby-shower-godh-bharai`.
- Blog uses descriptive slugs: `/blog/north-bengal-tea-garden-wedding-guide`.
- Portfolio cases use `[client-event-year]`: `/portfolio/rinki-aditya-bengali-wedding-2025`.

## 4.8 Page → search intent mapping

| Page | Intent | Funnel stage |
|---|---|---|
| Home | Brand discovery, social referral | Awareness |
| /services | Browsing capability | Consideration |
| /services/[slug] | Researching specific event | Consideration |
| /portfolio | Visual proof | Consideration → Decision |
| /portfolio/[slug] | Deep validation | Decision |
| /pricing | Budget feasibility | Decision |
| /blog | Top-funnel SEO | Awareness |
| /contact | Action | Action |
| /locations/[slug] | Local SEO landing | Awareness |
| /decorators/[loc]/[svc] | Long-tail local SEO | Awareness → Consideration |

## 4.9 CTA hierarchy per page

Every page has exactly **one primary CTA per viewport scroll position**, but the *language* shifts to match context:

| Page | Primary CTA | Secondary CTA |
|---|---|---|
| Home | "Plan My Event" | "See our work" |
| Services index | "Plan Your Celebration" | "See pricing" |
| Service detail | "Check Date for [Event]" | "View related work" |
| Portfolio | "Plan Yours Like This" | "Browse more" |
| Portfolio case | "Plan Your Wedding" | "See related" |
| Pricing | "Get a custom quote" | "Talk on WhatsApp" |
| Blog post | "Talk to a planner" | "Read next" |
| Contact | (form is the CTA) | "WhatsApp instead" |

## 4.10 The sticky elements

- **Sticky WhatsApp FAB** — bottom-right, always visible after first viewport scroll. Tooltip on first visit.
- **Sticky bottom CTA bar on mobile** — appears after 50% scroll, dismissable, shows event-specific text on service pages.
- **Sticky header** — solidifies after 80px scroll.
- **Sticky chapter indicator on long pages** (case studies, /about) — left rail with section dots.

## 4.11 What's NOT in nav

- Login (admin entry is `/admin` direct URL, not advertised in nav).
- Search (low-volume site — we use category filters in portfolio/blog instead).
- Newsletter signup (lives in footer only).

This keeps the header focused. Every link in the nav is a revenue-generating destination.
