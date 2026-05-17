# 09 — Image Prompts (Gemini)

This is the master inventory of every image the site needs. The owner pastes Gemini prompts under each ID. We render them, optimise them, push them to Payload, and reference them on the right page.

## How to use this document

1. The owner runs each prompt in Gemini (`gemini-2.5-pro` image mode or Imagen 4).
2. Generates 3–4 candidates per prompt, picks the strongest.
3. Saves the chosen file with the ID as filename: e.g. `HERO-01.jpg`.
4. Uploads via Payload admin → Media collection, sets `altText` from the prompt's short description.
5. On the corresponding page, we wire the image by ID.

> 📌 **Style guardrails for every prompt** — include these in every prompt for consistency:
> - "cinematic, editorial luxury, golden hour or candlelit"
> - "shallow depth of field, soft directional light, film grain"
> - "muted highlights, deep shadows, warm color grading"
> - "no harsh flash, no oversaturated reds, no chaotic composition"
> - "Indian wedding decor, North Bengal aesthetic, restrained palette"
> - "shot on 35mm or 85mm prime feel"

> 🌗 **DUAL-LIGHTING REQUIREMENT** (added 2026-05-16) — for every decoration image used in the signature **Day↔Night Decor Switcher** (section M below), AND for every service-detail hero, AND for every signature-work card, the owner must generate **TWO versions of the SAME composition**:
>
> - **`*-DAY`** — natural light. Add to base prompt: *"golden-hour sunlight, soft warm daylight pouring through fabric, sun-dappled, airy, ivory whites with warm shadow, ambient indoor or outdoor day. Same exact composition, framing, props, and subjects as the night version."*
> - **`*-NIGHT`** — illuminated decor. Add to base prompt: *"after-dusk scene, candles lit, festoon lights glowing, fairy lights and uplighters on, deep velvet shadows, warm tungsten and amber highlights, brass reflecting flame, moody and immersive. Same exact composition, framing, props, and subjects as the day version. The decor and structures are unchanged — only the lighting is different."*
>
> **Critical**: in Gemini, run the DAY prompt first, then for the NIGHT version use the day image as a reference (Imagen edit / Gemini image-to-image mode) so the structure stays identical and only the lighting transforms. This is what makes the switch animation feel like a real "lights-off" moment instead of two unrelated images.

---

## A. Hero & landing images

### `HERO-01` — Home hero
- **Used on**: `/` Section H1
- **Aspect**: 16:9 desktop, 4:5 mobile crop
- **Description needed**: Signature mandap shot, golden hour, soft, dramatic
- **Owner's Gemini prompt**: *TODO*

### `HERO-02` — About hero
- **Used on**: `/about` Section 1
- **Aspect**: 3:2
- **Description needed**: Founder portrait or working portrait at an installation
- **Owner's Gemini prompt**: *TODO*

### `HERO-03` — Services index hero
- **Used on**: `/services`
- **Aspect**: 21:9 panoramic
- **Description needed**: Wide shot of an elaborate setup, multiple ceremonies hinted
- **Owner's Gemini prompt**: *TODO*

### `HERO-04` — Portfolio index hero
- **Used on**: `/portfolio`
- **Aspect**: 16:9
- **Description needed**: Cinematic flat-lay or wide editorial shot
- **Owner's Gemini prompt**: *TODO*

### `HERO-05` — Pricing hero
- **Used on**: `/pricing`
- **Aspect**: 16:9
- **Description needed**: Detail shot — flowers, fabric, candle
- **Owner's Gemini prompt**: *TODO*

### `HERO-06` — Blog index hero
- **Used on**: `/blog`
- **Aspect**: 16:9
- **Description needed**: Editorial overhead flat-lay
- **Owner's Gemini prompt**: *TODO*

### `HERO-07` — Contact hero
- **Used on**: `/contact`
- **Aspect**: 16:9
- **Description needed**: Quiet, intimate detail — a candle and stationery, mood
- **Owner's Gemini prompt**: *TODO*

---

## B. Signature work cards (Home → Section H4)

5 portrait images for the horizontal-scroll showcase.

### `WORK-01` — Bengali wedding hero shot
- **Aspect**: 4:5
- **Description needed**: Mandap with bride/groom abstracted, jasmine and brass
- **Owner's Gemini prompt**: *TODO*

### `WORK-02` — Marwari sangeet stage
- **Aspect**: 4:5
- **Description needed**: Stage with deep wine/gold, performers silhouetted
- **Owner's Gemini prompt**: *TODO*

### `WORK-03` — Tea garden reception
- **Aspect**: 4:5
- **Description needed**: Outdoor evening in tea estate, string lights, fabric
- **Owner's Gemini prompt**: *TODO*

### `WORK-04` — Intimate Haldi
- **Aspect**: 4:5
- **Description needed**: Marigold and turmeric tones, sunlight, soft
- **Owner's Gemini prompt**: *TODO*

### `WORK-05` — Corporate / heritage event
- **Aspect**: 4:5
- **Description needed**: Modern minimal setup with floral architecture
- **Owner's Gemini prompt**: *TODO*

---

## C. Service tiles (Home → Section H5)

7 images.

| ID | Service | Aspect | Notes |
|---|---|---|---|
| `SVC-01` | Weddings (big hero tile) | 4:3 | Wide mandap, all-encompassing |
| `SVC-02` | Haldi | 1:1 | Marigold, turmeric, light |
| `SVC-03` | Mehendi | 1:1 | Glass jars, fabric drapes, mehendi station |
| `SVC-04` | Sangeet | 1:1 | Stage with lighting drama |
| `SVC-05` | Reception | 1:1 | Elegant table setup |
| `SVC-06` | Birthday | 1:1 | Modern milestone celebration setup |
| `SVC-07` | Corporate | 1:1 | Conference hall with floral architecture |

For each: *Owner's Gemini prompt: TODO*

---

## D. Service detail page heroes (per service)

For each of the 19 services in [04-INFORMATION-ARCHITECTURE.md](./04-INFORMATION-ARCHITECTURE.md), we need:

```
SVC-[slug]-HERO        → hero image, 16:9
SVC-[slug]-DETAIL-01   → detail crop, 4:5
SVC-[slug]-DETAIL-02   → detail crop, 4:5
SVC-[slug]-DETAIL-03   → detail crop, 3:2
SVC-[slug]-DETAIL-04   → detail crop, 3:2
```

Total: 19 × 5 = **95 service-page images**.

Slugs:
- wedding
- bengali-wedding
- haldi-gaye-holud
- mehendi
- sangeet
- engagement-roka
- reception
- cocktail-party
- birthday-party
- anniversary
- baby-shower-godh-bharai
- annaprashan-rice-ceremony
- naamkaran
- griha-pravesh
- corporate-events
- durga-puja-decoration
- lakshmi-puja
- saraswati-puja
- private-celebrations

For each ID: *Owner's Gemini prompt: TODO*

---

## E. Portfolio case study placeholders

We'll need 6 starter case studies for launch. Each needs:

```
PROJ-[name]-COVER      → 16:9 cinematic hero
PROJ-[name]-BRIEF      → editorial inset
PROJ-[name]-SETTING-01..04 → venue/setting shots
PROJ-[name]-DESIGN-01..03  → design detail shots
PROJ-[name]-CHAPTER-[day]-[01..04] → per-day shots (4 per day, 3-day average)
PROJ-[name]-CLOSING    → final hero
```

That's ~25 images per case study × 6 = **150 case-study images**.

Initial 6 case studies (suggested):
1. `rinki-aditya-bengali-wedding-2025`
2. `arpita-sanjay-marwari-wedding-2025`
3. `tea-garden-destination-darjeeling-2025`
4. `rohit-50th-birthday-2026`
5. `mukherjee-annaprashan-2025`
6. `prestige-corporate-launch-2026`

For each ID: *Owner's Gemini prompt: TODO*

---

## F. About page

| ID | Description |
|---|---|
| `ABOUT-01` | Hero portrait of founder |
| `ABOUT-02` | Founder at work, installing florals |
| `BTS-01` | Hands stringing jasmines |
| `BTS-02` | Team rigging a mandap, ladders |
| `BTS-03` | Lighting test, evening |
| `BTS-04` | Fabric draping in detail |
| `BTS-05` | Truck unloading at venue |
| `BTS-06` | Late-night working candid |
| `TEAM-01..08` | Individual team headshots (4:5) |

For each: *Owner's Gemini prompt: TODO*

---

## G. Testimonials

| ID | Description |
|---|---|
| `TEST-01..09` | Small client portraits, 1:1, candid, soft |

For each: *Owner's Gemini prompt: TODO*

---

## H. Blog posts (6 launch posts)

| ID | Post slug |
|---|---|
| `POST-01-COVER` | bengali-wedding-rituals-checklist |
| `POST-02-COVER` | mandap-design-ideas-cinematic |
| `POST-03-COVER` | best-wedding-venues-siliguri |
| `POST-04-COVER` | tea-garden-weddings-darjeeling |
| `POST-05-COVER` | indian-wedding-decoration-cost-2026 |
| `POST-06-COVER` | annaprashan-decoration-ideas |

Plus inline images per post (3–5 each).

For each: *Owner's Gemini prompt: TODO*

---

## I. Location pages

For each location (siliguri, bagdogra, darjeeling, kalimpong, jalpaiguri, gangtok, dooars):

```
LOC-[slug]-HERO → 16:9 of the location's character (not necessarily an event)
LOC-[slug]-VENUE-01..03 → local venue shots (if available)
```

For each: *Owner's Gemini prompt: TODO*

---

## J. Decorative / motif assets

These are non-photo SVG or PNG elements:

| ID | Description |
|---|---|
| `MOTIF-MARIGOLD` | A single marigold bloom illustration |
| `MOTIF-JASMINE` | Jasmine sprig illustration |
| `MOTIF-DIYA` | Brass diya line illustration |
| `MOTIF-DIVIDER` | Ornate horizontal divider |
| `MAP-01` | Stylised North Bengal region map |
| `LOGO-WORDMARK` | "SILIGURI EVENT" wordmark SVG |
| `LOGO-MARK` | Optional monogram mark |

For each: *Owner's Gemini prompt or hand-drawn SVG: TODO*

---

## K. Open Graph / social images (auto-generated)

These are NOT manually authored — they're generated dynamically via `@vercel/og` at `/api/og` using the page's title, primary image, and brand mark.

No prompts needed; mentioned here for completeness.

---

## L. 404 page

| ID | Description |
|---|---|
| `404-ART` | A single dramatic but quiet image — e.g., a tipped chair after a celebration, or a fallen marigold on stone |

*Owner's Gemini prompt: TODO*

---

## M. Day ↔ Night Decor Showcase (signature interactive section)

**Where it lives**: Home page — new dedicated section between H5 (Services tiles) and H6 (Testimonials). Also embeddable on any service page.

**What it does**: a grid of 6–10 decoration photographs of identical compositions in TWO lighting states. The visitor pulls a hanging brass-tipped rope (or taps a "Lights off" toggle on mobile) — every image in the grid crossfades from its **DAY** version to its **NIGHT** version simultaneously. Candles "ignite," festoon lights "switch on," shadows deepen, the section background dims. Pull again → daylight returns.

**Why it's signature**: it's tactile, it's culturally specific (rope-pulled bulb is an Indian-house memory), and it demonstrates the studio's craft at both lighting conditions in one interaction — the actual core value proposition. **One of the strongest engagement-time multipliers we can build.**

### Image pairs needed (each = DAY + NIGHT version of the SAME composition)

| Pair ID | Subject | Aspect | Composition notes |
|---|---|---|---|
| `DECOR-MANDAP-01` | Traditional Bengali mandap | 4:5 | Centre-frame, brass and banana-leaf, marigold pillars |
| `DECOR-MANDAP-02` | Modern minimal mandap | 4:5 | White florals, crystal pendant lighting, sheer drapes |
| `DECOR-STAGE-01` | Sangeet stage | 16:9 | Performer stage, layered drapes, statement floral arch |
| `DECOR-STAGE-02` | Reception stage | 16:9 | Couple seating, backdrop, ground florals |
| `DECOR-HALDI-01` | Haldi backdrop | 1:1 | Marigold + jasmine wall, copper urli, low-seat setup |
| `DECOR-MEHENDI-01` | Mehendi corner | 1:1 | Cushions, parasols, glass jars, henna station |
| `DECOR-BDAY-01` | Milestone birthday setup | 3:2 | Modern dessert table with floral arch, balloons replaced by florals |
| `DECOR-BDAY-02` | Kids' themed birthday | 3:2 | Restrained, editorial — not balloon-shop energy |
| `DECOR-ANNIV-01` | 25th/50th anniversary table | 3:2 | Intimate long table, taper candles, brass |
| `DECOR-ENTRY-01` | Wedding entry arch | 4:5 | Garlanded entryway, pathway petals |

**That's 10 compositions × 2 lighting states = 20 images.** Plus optional 3D variants of 2–3 hero pairs if we can budget time.

### Generation pipeline (Gemini)

For each pair:

1. **Run the DAY prompt** in Gemini (use the style guardrails block above + the day-lighting block).
2. **Take the selected day image** and feed it back to Gemini in image-to-image / "edit" mode with the night-lighting block. Critical instruction in the night prompt: *"keep every element of the decor unchanged — same drapes, same flowers, same furniture, same camera angle. ONLY the lighting changes. Turn candles ON, dim ambient light, add warm tungsten/amber glow from practical light sources visible in the scene, deepen shadows in non-lit areas. The decor must read as the EXACT SAME installation photographed after sunset with its lights turned on."*
3. **Spot-check the night image** for: (a) identical framing, (b) identical decor positions, (c) believable practical light sources (candles, festoons, uplighters), (d) no AI-introduced new objects.
4. **Save** as `DECOR-MANDAP-01-DAY.jpg` and `DECOR-MANDAP-01-NIGHT.jpg`.
5. **Upload both** to Payload Media collection — they become a linked pair via the `decorPair` field (see CMS update below).

### CMS update needed (Sprint 2)

Add a new collection `decorPairs` (or extend Media with a `nightVariant` self-relationship):

| Field | Type | Notes |
|---|---|---|
| `pairId` | text | e.g., "DECOR-MANDAP-01" |
| `subject` | select: mandap / stage / haldi / mehendi / bday / anniv / entry / sangeet / reception / other | |
| `dayImage` | upload (Media) | The DAY version |
| `nightImage` | upload (Media) | The NIGHT version |
| `caption` | text (localized en/hi) | Short subject label |
| `order` | number | Display order in switcher |
| `featuredOnHome` | checkbox | Include in the Home-page switcher (curated subset) |

### Interaction specification (for designer + developer)

- **Desktop**: a thick brass-tipped rope hangs from the top-right of the section. Cursor approaches → rope sways with magnetic ease. Cursor grabs (mousedown) and drags down → rope follows physics, length stretches, then snaps. On release past threshold → "click" haptic moment, all images crossfade to night. The section's background, eyebrow color, and ambient tint also shift.
- **Mobile**: replace rope with a labelled toggle ("Day / Night") at the top of the section. Swipe-down gesture inside the section also triggers the toggle (delightful).
- **Crossfade**: 1.2s total. Stagger images by 60ms (grid sweep), not all-at-once. Background shifts on a separate, slightly longer curve (1.6s) to anchor the mood change.
- **Optional audio** (off by default, accessible toggle in footer): a soft click and a low ambient swell on switch. Honor `prefers-reduced-motion` and a silent default.
- **Reduced motion**: instant swap, no rope physics, simple toggle. The feature still works — just without theatre.
- **State persistence**: remember the choice for the session (sessionStorage). Don't auto-flip back.
- **Accessibility**: rope element has `role="switch"`, `aria-checked`, keyboard-operable (Space toggles), `aria-label="Toggle decoration lighting between day and night"`.

### Suggested file naming convention

```
public/media/decor-pairs/
  mandap-01-day.avif
  mandap-01-night.avif
  stage-01-day.avif
  stage-01-night.avif
  ...
```

---

## Image totals (launch)

| Bucket | Count |
|---|---|
| Heroes | 7 |
| Signature work | 5 |
| Service tiles | 7 |
| Service detail | 95 |
| Case studies | 150 |
| About | 16 |
| Testimonials | 9 |
| Blog | ~30 |
| Locations | ~28 |
| Motifs / SVGs | 7 |
| 404 | 1 |
| **Day↔Night decor pairs** (10 × 2 lighting states) | **20** |
| **TOTAL** | **~375 images** |

This is a lot. We'll seed the site at launch with placeholders rendered from a small library of ~30 fallback images, and the owner can swap in finals progressively. **Priority for the day/night switcher: get 4 strong pairs (mandap, stage, haldi, birthday) shipped before launch — the section can ship with 4 pairs and grow.**

## Suggested batch order for the owner

1. **First 25 images** to unblock launch shell: HERO-01..07, WORK-01..05, SVC-01..07, ABOUT-01..02, MOTIF-* (7).
2. **Next 50** for service detail pages of the 6 most-requested services: wedding, bengali-wedding, haldi, mehendi, sangeet, reception.
3. **Next 100** for 4 case studies + remaining services.
4. **Remaining** for completeness, blog, locations, BTS.

---

> Once the owner pastes prompts under any ID above, I'll render the images via the agreed pipeline and wire them in.
