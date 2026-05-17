# 05 — Page Specifications

Section-by-section blueprint for every page. Each section lists: layout, content, motion, image needs, CTA.

> All image slots reference IDs that map to [09-IMAGE-PROMPTS.md](./09-IMAGE-PROMPTS.md). Owner supplies prompts for each ID.

---

## 5.1 Home — `/`

The brand statement. ~5 viewports of scroll, optimised for high LCP, low CLS.

### Section H1 — Cinematic hero
- **Layout**: Full viewport. Single hero image right-cropped, large display headline left.
- **Content**:
  - Eyebrow: "North Bengal · Est. [Year]"
  - H1 (display, two lines, italic mid-word): *Cinematic decor for **celebrations** you'll remember in stills.*
  - One-line body: "Wedding, Haldi, Sangeet, Reception — and every chapter in between. Across Siliguri, Darjeeling, and the Dooars."
  - Primary CTA: "Plan My Event →"
  - Secondary link: "See our work"
- **Motion**: Headline split-text reveal (stagger by word, then by letter for italicised emphasis). Image: subtle 4% Ken-Burns scale on load. Cursor near image: parallax tilt 3°.
- **Image**: `HERO-01` — signature mandap shot at golden hour.
- **Mobile**: Image becomes full-bleed background, headline overlays with scrim. CTA pinned within thumb reach.

### Section H2 — Capability marquee (silent confidence)
- **Layout**: Single-row horizontal marquee of service names, separated by brass ornaments.
- **Content**: "Hindu Weddings · Bengali Ashirbaad · Haldi · Mehendi · Sangeet · Reception · Birthdays · Anniversaries · Annaprashan · Corporate · Durga Puja · …"
- **Motion**: Continuous slow scroll, slows on hover (cursor magnetism), reverses on scroll up.
- **Image**: none.

### Section H3 — Editorial intro / philosophy
- **Layout**: Two-column. Left: oversized italic pull quote. Right: two-paragraph body.
- **Content**:
  - Quote: *"A celebration is a story told in light, flower, fabric, and sound."*
  - Body: "We're a North Bengal studio with one rule — every event we touch is shot, lit, and staged like a film. Whether it's an intimate Annaprashan for twenty or a four-day destination wedding for eight hundred, the standard doesn't change."
  - "Founded in [Year] by [Owner Name], we plan and execute thirty events a year by design — never more. Each gets our entire studio."
- **Motion**: Quote letters reveal on scroll-into-view (via our `<SplitterReveal>` primitive — see `02-TECH-STACK.md §2.4`; not the paid GSAP SplitText plugin). Body paragraph fades in 0.6s after.
- **Image**: none — the typography is the visual.

### Section H4 — Signature work strip
- **Layout**: Horizontal scroll-pinned showcase. 5 large project cards, each occupying ~80% viewport when scrolled to.
- **Content**: 5 hero projects. Each card: large image, project name, ceremony type, location, year, "Read story →".
- **Motion**: ScrollTrigger pins section, scrubs horizontal translate of card row. Active card scales 1.02, others 0.98 with reduced opacity.
- **Image**: `WORK-01` through `WORK-05`. 4:5 portrait, dramatic.
- **CTA at end**: "View all work →"

### Section H5 — Services overview (categorised tiles)
- **Layout**: Asymmetric grid. Big hero tile (Weddings) + 6 smaller tiles.
- **Content**:
  - Big: "Weddings" — links to /services/wedding. Image + 1-line tagline.
  - Smaller: Haldi, Mehendi, Sangeet, Reception, Birthday, Corporate. Each: image + label.
- **Motion**: On hover/tap — image zoom 1.03, label slides up, accent line draws across.
- **Image**: `SVC-01` through `SVC-07`.

### Section H6 — Testimonials marquee
- **Layout**: Three rows of horizontal-scrolling quote cards, each row in opposite direction.
- **Content**: 9–15 testimonials. Each card: quote excerpt, client name, event type, year, small portrait.
- **Motion**: Continuous slow drift, mouse hover pauses row.
- **Image**: small client portraits (`TEST-01`…). Optional — names without portraits work too.

### Section H7 — Locations served
- **Layout**: Single-column editorial. Map illustration or stylized region map of North Bengal.
- **Content**: "We travel across Siliguri, Bagdogra, Darjeeling, Kalimpong, Jalpaiguri, Sikkim border, Dooars tea estates, and beyond on request."
- **Motion**: Region pins fade in sequentially on scroll.
- **Image**: `MAP-01` — stylized line-art map.

### Section H8 — Journal teaser
- **Layout**: Three-card row of latest blog posts.
- **Content**: Card title, date, 1-line excerpt, cover image, "Read →".
- **Motion**: Staggered card reveal.

### Section H9 — Big-type CTA closer
- **Layout**: Full viewport. Oversized italic display headline, single CTA.
- **Content**:
  - H2: *"Let's make your next moment cinematic."*
  - CTA: "Plan My Event →"
  - Sub-line: "Or WhatsApp us — we usually reply within an hour."
- **Motion**: Letters of the headline drift in from random Y offsets and settle (GSAP stagger).

---

## 5.2 About — `/about`

The trust page. Story, team, philosophy, behind the scenes.

### Sections
1. **Hero** — half viewport. H1: "We stage celebrations. The rest is decor." + portrait of owner.
2. **Origin story** — 3 paragraphs, editorial. Image inset: founder at work.
3. **Philosophy / how we work** — 4-step numbered process: Discover · Design · Stage · Document.
4. **Team grid** — photo + name + role + 1-line bio. 4–8 people.
5. **Behind the scenes** — full-bleed gallery row, 6 images of setup, flower-stringing, mandap-rigging.
6. **Press / features (when available)** — logo strip of publications, awards, certifications.
7. **CTA closer** — same as Home H9.

### Image needs
`ABOUT-01` (hero portrait), `ABOUT-02` (founder at work), `TEAM-01..08`, `BTS-01..06`, `PRESS-01..N`.

---

## 5.3 Services index — `/services`

### Sections
1. **Hero** — H1: "Every kind of celebration. Every kind of decor." + intro paragraph.
2. **Category tabs** — Weddings · Pre-wedding · Family rituals · Corporate · Festivals.
3. **Tab content** — grid of service cards filtered to active tab. Smooth tab transitions via Framer Motion `layoutId`.
4. **Closing CTA strip**.

---

## 5.4 Service detail — `/services/[slug]`

Template — used for all ~19 services. Content varies per service via Payload.

### Sections
1. **Hero** — Service name as H1, event-specific tagline, "Plan Your [Event]" CTA, hero image.
2. **What we do** — 3-column "Decor / Florals / Lighting" or service-specific breakdown.
3. **Process / what's included** — bullet matrix of inclusions.
4. **Signature setups** — 3–5 project cards showing past work of this type.
5. **Pricing teaser** — price band (₹ / ₹₹ / ₹₹₹) + "See packages →" linking to /pricing#wedding. No specific INR figures (see `DECISIONS.md` D-002).
6. **FAQs** — accordion, 6–10 questions per service.
7. **Related ceremonies** — for wedding: links to Haldi, Mehendi, Sangeet, Reception.
8. **CTA closer**.

### Service-specific copy considerations
- Bengali wedding page mentions Subho Drishti, Saat Paak, Sindoor Daan, Bashor Ghor, Bou Bhaat.
- Marwari wedding mentions Tilak, Mahira Dastoor, Pithi.
- Festival pages mention pandal aesthetics, theme variations.

### Image needs (per service)
`SVC-[slug]-HERO`, `SVC-[slug]-DETAIL-01..04`.

---

## 5.5 Portfolio index — `/portfolio`

### Sections
1. **Editorial hero** — H1: "Our work."
2. **Filter rail** — sticky on scroll, filter by category, year, location.
3. **Justified grid** — variable aspect ratio masonry. Each tile: image, on-hover overlay with project name + ceremony.
4. **Infinite scroll / load more**.
5. **CTA closer**.

### Motion
- Filter changes use `view-transition-name` + Framer Motion crossfade.
- Tile hover: image scale 1.04 + caption slide up.

---

## 5.6 Portfolio case study — `/portfolio/[slug]`

Long-form editorial. ~6 viewports of scroll. This is the brand-defining content.

### Sections
1. **Cover** — full-bleed hero image, project name, ceremony, location, date, scroll-down hint.
2. **The brief** — 1 paragraph + 3 specs (Guests · Days · Venues).
3. **The setting** — 2 paragraphs + venue image gallery.
4. **The design** — explanation of theme, color, materials, with image inset.
5. **The chapters** — for weddings: Haldi → Mehendi → Sangeet → Wedding → Reception, each with image strip.
6. **The numbers** — large stats: "40,000 jasmines · 200m fabric · 4 stages · 18 lighting cues".
7. **Client note** — testimonial.
8. **Credits** — photography, planning, florist, etc.
9. **Up next** — link to another case study.

### Motion
- Cover: parallax background + scrim, title slides in on scroll.
- Each section uses a different reveal style (GSAP timelines) to feel composed.
- "Numbers" section: number counter animation.
- Final section: shared-element transition to the "up next" cover.

---

## 5.7 Pricing — `/pricing`

> Pricing shown as **bands only** (₹ / ₹₹ / ₹₹₹) on the public site — never specific INR figures. See `DECISIONS.md` D-002.

### Sections
1. **Hero** — H1: "Honest pricing bands. Custom quotes from there." + intro about how we quote.
2. **Category selector** — Weddings · Pre-wedding · Birthdays · Anniversaries · Corporate · Pujas.
3. **3 packages per category**:
   - **Essence** — entry tier, band **₹**.
   - **Signature** — mid, recommended, band **₹₹**.
   - **Atelier** — bespoke, band **₹₹₹**.
   - Each card: name, band badge (₹ / ₹₹ / ₹₹₹), the band's typical-range copy-line (e.g. "most ₹₹ weddings land between 50–120 guests, 1–2 days"), "What's included" list, "Talk to us →" CTA.
4. **"Everything custom" section** — paragraph explaining we customise everything; the bands are reference points, not fixed quotes.
5. **What affects price** — guest count, days, location distance, season, flowers in/out of season, lighting complexity.
6. **CTA closer**.

### Motion
- Active category tab: card row transitions with stagger.
- Recommended package: subtle golden ribbon animation on scroll into view.

---

## 5.8 Blog index — `/blog`

### Sections
1. **Hero** — H1: "Journal. Notes on decor, weddings, and Bengal."
2. **Featured post** — large card with full-bleed image and overlaid title.
3. **Category chips** — Wedding planning · Bengali weddings · Trends · Behind the scenes · Locations.
4. **Post grid** — 3-col, cover image + title + excerpt + date + read-time.
5. **Newsletter signup** — single email field, optional name. "Get our seasonal guide."

---

## 5.9 Blog post — `/blog/[slug]`

### Sections
1. **Cover image + title** — full-bleed.
2. **Meta strip** — author, date, read-time, category tags.
3. **Article body** — Lexical-rendered rich text with custom blocks: image (full / half / inline), pull quote, image pair, gallery row, callout, FAQ section.
4. **Author bio** — small.
5. **Share strip** — WhatsApp, copy link, Pinterest.
6. **Related posts** — 3 cards.
7. **CTA closer**.

### Reading aids
- Reading progress bar at top.
- Sticky table-of-contents on desktop sidebar (auto-generated from H2s).

---

## 5.10 Contact — `/contact`

### Sections
1. **Hero** — H1: "Let's plan something."
2. **Multi-step inquiry form** (3 steps):
   - **Step 1**: Event type (radio cards w/ icons) · Event date (date picker w/ "Not decided yet") · Guest count (range slider 25–1000+).
   - **Step 2**: Venue (text + "Help us find one"), Budget range (radio, ranges), Add-ons (checkboxes: photography, planning, catering coord).
   - **Step 3**: Name, phone (+91), email, WhatsApp preference checkbox, free-text "Tell us more".
   - Progress bar across top. "Back" + "Next" buttons. Submit on step 3.
3. **WhatsApp alternative** — large card: "Prefer WhatsApp?" with deep link pre-filled with form data if user has filled any.
4. **Other ways to reach** — phone, email, hours.
5. **Studio** — map static image, address, parking note.
6. **Closing line** — "We reply within an hour, 9 AM – 9 PM IST."

### Motion
- Step transitions slide horizontal with content fade.
- Successful submission: full-screen confirmation overlay with subtle animation (jasmine bloom unfurling — Lottie).

---

## 5.11 Locations — `/locations/[slug]`

Template for local SEO landing pages.

### Sections
1. **Hero** — "Event Decorators in [Location]".
2. **About the area & weddings** — paragraph mentioning local venues, travel notes.
3. **Featured local projects** — 3–4 case studies tagged with this location.
4. **Local services** — links to all service detail pages.
5. **Local venues we love** — list of named venues with short notes.
6. **CTA**.

---

## 5.12 404

Not a generic 404. Branded.

- Full viewport.
- H1: "This page eloped."
- Body: "It's not where we thought. Try the work, services, or say hi."
- Three buttons: View Work · See Services · WhatsApp Us.
- Subtle animation: a falling marigold petal loop.

---

## 5.13 Admin — `/admin`

Payload-rendered. See [08-CMS-PLAN.md](./08-CMS-PLAN.md) for collection structure and admin customizations.

---

## 5.14 Component reuse matrix

| Component | Home | Service | Portfolio | Blog | Contact |
|---|:-:|:-:|:-:|:-:|:-:|
| Hero (variant) | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProjectCard | ✓ | ✓ | ✓ | - | - |
| ServiceTile | ✓ | ✓ | - | - | - |
| TestimonialBlock | ✓ | ✓ | ✓ | - | - |
| CtaCloser | ✓ | ✓ | ✓ | ✓ | - |
| PriceCard | - | ✓ | - | - | - |
| FaqAccordion | ✓ | ✓ | - | ✓ | - |
| InquiryForm | - | - | - | - | ✓ |
| StatsRow | - | ✓ | ✓ | - | - |
| GalleryMasonry | - | - | ✓ | - | - |

This matrix drives the component build order in Phase 1.
