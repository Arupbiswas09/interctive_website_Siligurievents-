# 08 — CMS Plan (Payload CMS 3)

How the owner runs this site from their phone, in 5 minutes, without breaking anything.

## 8.1 Design principles for the admin

1. **One screen, one job.** Every admin task is reachable in ≤2 taps from the dashboard.
2. **Photos first.** The owner thinks visually. Image fields show large previews. Drag-to-reorder gallery.
3. **Plain-language labels.** Field labels read like instructions: "Cover photo (this is the big image at the top)" — not "heroMedia".
4. **No 'developer' surfaces.** Hide JSON, IDs, slugs (auto-generated), revisions are visible but rollback is one tap.
5. **Mobile-first admin styling.** Owner-tested on a 6.1" Android phone.
6. **Drafts and publish are obvious.** Big "Save draft" + "Publish" buttons. No ambiguous statuses.
7. **Undo > validate.** Allow saving incomplete drafts; warn but don't block.

## 8.2 Collections

Below: each collection with its fields and access rules.

### `users`
Auth + permissions. Roles: `admin` (owner — full access), `editor` (assistant — no pricing, no users, no settings).

| Field | Type | Notes |
|---|---|---|
| email | email (unique) | Auth identity |
| name | text |  |
| role | select: admin / editor | |
| avatar | upload (Media) | |

### `services`
Each ceremony / event type. Pre-seeded with ~19 entries.

| Field | Type | Notes |
|---|---|---|
| name | text (required) | "Bengali Wedding" |
| slug | text (auto from name, locked) | |
| category | select: weddings, pre-wedding, family-rituals, corporate, festivals | |
| order | number | Manual sort within category |
| tagline | text (≤80) | Hero subline |
| coverImage | upload (Media) | Hero |
| galleryImages | array of Media | Detail images |
| description | richtext (Lexical) | What we do |
| inclusions | array of { title, items: text[] } | "Decor / Florals / Lighting" sections |
| priceBand | select: ₹ / ₹₹ / ₹₹₹ | Public, required. Per `DECISIONS.md` D-002 — never a numeric figure on the site. |
| startingPriceInternal | number (INR) | **Admin-only**, never rendered publicly. For owner's internal quoting workflow only. |
| faqs | array of { question, answer (richtext) } | |
| signatureProjects | relationship → projects (multi) | |
| relatedServices | relationship → services (multi) | |
| seo | group { title, description, ogImage } | |
| status | select: draft / published | |

### `projects`
Portfolio case studies.

| Field | Type | Notes |
|---|---|---|
| title | text | "Rinki & Aditya · Bengali Wedding" |
| slug | text (auto) | |
| ceremony | relationship → services | Primary tag |
| location | relationship → locations | |
| date | date | |
| coverImage | upload | |
| heroVideo | upload (optional) | |
| stats | array of { label, value } | "Guests · 400", "Days · 4" |
| brief | richtext | The brief |
| design | richtext + image inline blocks | The design story |
| chapters | array of { name, description, images: Media[] } | Day-by-day sections |
| credits | array of { role, name, link? } | |
| testimonial | relationship → testimonials | |
| galleryImages | array of Media | Big justified grid |
| nextProject | relationship → projects (single) | Manual override; else auto-next |
| seo | group | |
| status | select: draft / published | |

### `galleries`
Standalone galleries (not tied to a single project). Used for service detail page strips.

| Field | Type | Notes |
|---|---|---|
| name | text | "Mandap Designs" |
| service | relationship → services (optional) | |
| images | array of Media | Drag to reorder |
| status | select: draft / published | |

### `packages`
Pricing entries.

| Field | Type | Notes |
|---|---|---|
| name | text | "Signature Wedding" |
| service | relationship → services | |
| tier | select: essence / signature / atelier | |
| priceBand | select: ₹ / ₹₹ / ₹₹₹ | **Public, required.** This is what renders on the site (per `DECISIONS.md` D-002). |
| bandCopy | richtext | Short copy-line describing what typically fits in this band (e.g. "most ₹₹ weddings land between 50–120 guests, 1–2 days"). Public. |
| startingPriceInternal | number (INR) | **Admin-only**, never rendered publicly. For owner's internal quoting workflow only. Field-level access restricted to `admin` role. |
| priceNote | text | Admin-only internal note (e.g. "per day, exclusive of GST"). Not rendered publicly. |
| includes | array of text | Bullet list |
| highlight | checkbox | "Recommended" badge |
| order | number | |
| status | select: draft / published | |

### `testimonials`
| Field | Type | Notes |
|---|---|---|
| author | text | "Rinki & Aditya" |
| eventType | relationship → services | |
| year | number | |
| quote | textarea | |
| portrait | upload (optional) | |
| videoTestimonial | upload (optional) | |
| location | relationship → locations (optional) | |
| status | select: draft / published | |

### `posts`
Blog posts.

| Field | Type | Notes |
|---|---|---|
| title | text | |
| slug | text (auto) | |
| author | relationship → users | |
| publishedDate | date | |
| category | select: planning / bengali-weddings / trends / behind-the-scenes / locations | |
| tags | array of text | |
| coverImage | upload | |
| excerpt | textarea (≤200) | |
| body | richtext (Lexical) | with blocks: image, image-pair, gallery, pull-quote, callout, faq |
| readTime | number (auto-calc) | |
| relatedPosts | relationship → posts | |
| seo | group | |
| status | select: draft / published | |

### `locations`
| Field | Type | Notes |
|---|---|---|
| name | text | "Siliguri" |
| slug | text (auto) | |
| heroImage | upload | |
| introCopy | richtext | |
| venues | array of { name, area, type, notes } | |
| status | select: draft / published | |

### `faqs`
Reusable FAQ entries (also embedded inline in services / posts).

| Field | Type | Notes |
|---|---|---|
| question | text | |
| answer | richtext | |
| topic | select: pricing / planning / logistics / general | |
| order | number | |

### `inquiries`
Form submissions — write-only from frontend, read-only in admin.

| Field | Type | Notes |
|---|---|---|
| eventType | relationship → services | |
| eventDate | date | |
| guestCount | number | |
| venue | text | |
| budgetRange | select | |
| addOns | array of select | |
| name | text | |
| phone | text | |
| email | email | |
| whatsappPreferred | checkbox | |
| message | textarea | |
| status | select: new / contacted / quoted / won / lost | |
| notes | textarea (admin-only) | |
| sourcePage | text (hidden, auto) | |
| receivedAt | date (auto) | |

### `siteSettings` (global, single doc)
| Field | Type | Notes |
|---|---|---|
| businessName | text | "Siligurievent" |
| tagline | text | |
| phone | text | |
| whatsappNumber | text | +91XXXXXXXXXX |
| email | email | |
| addressLine1 | text | |
| addressLine2 | text | |
| city | text | |
| state | text | |
| pincode | text | |
| openingHours | array of { day, open, close, closed: bool } | |
| social | group { instagram, youtube, pinterest, facebook, googleBusiness } | |
| founderName | text | |
| foundedYear | number | |
| logoLight | upload | |
| logoDark | upload | |
| favicon | upload | |
| defaultOgImage | upload | |
| heroHeadline | richtext | Editable home hero |
| heroSubline | text | |

### `homepage` (global, single doc)
Owner-controlled assembly of home page sections, drag-to-reorder.

| Field | Type | Notes |
|---|---|---|
| heroVariant | select: cinematic / split / video | |
| heroImage | upload | |
| heroVideo | upload (optional) | |
| signatureProjects | relationship → projects (5) | Order matters |
| featuredServices | relationship → services (7) | |
| featuredTestimonials | relationship → testimonials (9) | |
| featuredPosts | relationship → posts (3) | |
| ctaCloserText | richtext | |

## 8.3 Custom Lexical blocks (rich text)

These are the blocks the owner can drop into any rich-text field:

- **Paragraph** (default)
- **Heading** (H2, H3)
- **Image** — single image, with caption + alt
- **Image Pair** — two images side-by-side with optional captions
- **Gallery Row** — 3–6 images in a horizontal row
- **Pull Quote** — large italic quote with optional attribution
- **Callout** — small bordered note ("Pro tip:")
- **Stats Row** — 3–4 stat tiles
- **CTA Inline** — button with custom label + link
- **FAQ Block** — accordion of question/answer
- **Embed Video** — YouTube/Vimeo

## 8.4 Access control

```ts
// Pseudocode
services: { read: () => true, create: admin, update: admin || editor, delete: admin }
projects: { read: () => true, create: admin || editor, update: admin || editor, delete: admin }
packages: { read: () => true, create: admin, update: admin, delete: admin }
posts: { read: () => true, create: admin || editor, update: admin || editor, delete: admin }
testimonials: { create: admin || editor, ... }
inquiries: { create: () => true (from API only), read: admin || editor, update: admin || editor, delete: admin }
siteSettings: { read: () => true, update: admin }
users: admin-only across the board
```

## 8.5 Admin UX customisations

- **Custom dashboard at `/admin`** — replaces the default with:
  - "Today" panel: new inquiries count, unanswered count.
  - Quick links: "Add a project", "Add a blog post", "Add a testimonial", "Edit homepage".
  - Recent activity list.
- **Branded admin theme** — uses the same color tokens as the public site.
- **Mobile bottom-nav for admin on small screens**.
- **Big image previews** in upload fields (`displayPreview: true`).
- **Drag-and-drop reorder** wherever order matters (array fields with sort).
- **Auto-save drafts** every 30 seconds.
- **Localized fallback UX (Hindi missing-translation badge)** — Payload's `localized: true` does **not** ship a fallback badge OOTB; it just shows an empty field. We build this in two places:
  1. **Query-side fallback** (server rendering): every helper in `lib/cms/` passes `fallbackLocale: 'en'` (or uses the `?fallback-locale=en` query param) so the public site never renders a `null` Hindi field — it falls through to the English value.
  2. **Admin-side "Missing translation" badge** (custom field component): a small `components/payload/MissingTranslationBadge.tsx` field-level component reads the document's `en` value, compares against the active locale tab value, and renders a subtle amber badge next to the field label when the active locale is empty. Plugged in via Payload's `admin.components.Field` override on every `localized: true` text/richtext field.
  - Budget: ~half a sprint of work (custom React component + access-aware wiring); track under Sprint 2 CMS spine.

## 8.6 Hooks

| Trigger | Action |
|---|---|
| `projects.afterChange (published)` | Revalidate `/portfolio`, `/portfolio/[slug]`, `/`, related service page. POST to IndexNow. |
| `services.afterChange (published)` | Revalidate `/services`, `/services/[slug]`, `/`. POST to IndexNow. |
| `posts.afterChange (published)` | Revalidate `/blog`, `/blog/[slug]`. POST to IndexNow. |
| `inquiries.afterChange (created)` | Send Resend email to owner with a pre-filled `wa.me` deep link in the email body (so the owner can tap-to-open WhatsApp). Resend itself does NOT send WhatsApp — see [11-DEPLOYMENT.md §11.8 "WhatsApp notification clarification"](./11-DEPLOYMENT.md). A first-party WhatsApp Business Cloud API integration is a post-launch stream. |
| `siteSettings.afterChange` | Revalidate ALL routes (settings are layout-level). |
| `homepage.afterChange` | Revalidate `/`. |

## 8.7 Seed data

`scripts/seed.ts` populates:
- 1 admin user (owner) + 1 editor user (placeholder credentials)
- All 19 services with full schema, descriptions, placeholder images
- 6 sample projects (case studies) with chapters
- 9 testimonials
- 6 blog posts (cluster strategy seeds)
- 7 locations (Siliguri, Bagdogra, Darjeeling, Kalimpong, Jalpaiguri, Gangtok, Dooars)
- 3 packages per category (15 total)
- 12 FAQs
- Site settings with placeholder business info
- Homepage assembly

Owner replaces placeholders post-launch.

## 8.8 Image handling

- **Storage**: Vercel Blob.
- **On upload**: Sharp generates 4 sizes (thumb 400, sm 800, md 1600, lg 2400) + AVIF + WebP + JPG variants.
- **BlurHash / LQIP** generated and stored as `blurDataURL` field.
- **EXIF stripping** for privacy.
- **Owner uploads from phone**: HEIC support (Sharp), auto-rotate based on orientation.
- **File size cap**: 12 MB on upload (HEIC + RAW filter at edge).

### To-do for Sprint 2 — `withPayload` wrapper on `next.config.ts`

> **Critical, easy to forget**: at the start of Sprint 2 the main agent MUST wrap `next.config.ts`'s default export with `withPayload(...)` from `@payloadcms/next/withPayload`. Without this wrapper the Payload routes mounted at `/(payload)/admin/[[...segments]]` and `/(payload)/api/[...slug]` will not resolve under Next 16 and the admin UI will 404. Pattern:
>
> ```ts
> // next.config.ts
> import { withPayload } from "@payloadcms/next/withPayload";
> const nextConfig: NextConfig = { /* ... */ };
> export default withPayload(nextConfig);
> ```
>
> Track alongside the collection-build tasks in [12-ROADMAP.md Sprint 2](./12-ROADMAP.md).

## 8.9 Migrations & versioning

- Payload's built-in migrations for schema changes.
- Drafts preview on the live site at `?preview=<token>` — owner shares previews with stakeholders before publishing.

## 8.10 Owner onboarding plan

Day 1 of launch:
1. 30-minute Loom walkthrough recorded — covers all 8 routine tasks.
2. Cheat-sheet PDF: "Adding a new wedding project — 4 steps."
3. WhatsApp support channel for 30 days post-launch.
4. Monthly check-in call for first 3 months.

## 8.11 Backup & disaster recovery

- Neon Postgres has point-in-time recovery (7 days on free, 30 days on paid).
- Weekly `pg_dump` to a Vercel Blob bucket via cron job.
- Vercel Blob objects backed up to a secondary S3 bucket monthly (optional, post-launch).
- All content versioned in Payload (every change is a revision).
