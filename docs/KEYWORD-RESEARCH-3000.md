# Keyword Research 3000 — Siligurievent

> Aggressive but strictly **white-hat** keyword strategy for siligurievent.com.
>
> Built for an ambitious owner who wants to outrank entrenched local incumbents
> (e.g. Dreamcreation in Siliguri). The path to the top is **coverage + depth +
> local signal density** — never trickery.
>
> Read alongside:
>
> - [07-SEO-STRATEGY.md](./07-SEO-STRATEGY.md) — strategic frame.
> - [07b-SEO-IMPL.md](./07b-SEO-IMPL.md) — schema, metadata, hreflang implementation.
> - [04-INFORMATION-ARCHITECTURE.md](./04-INFORMATION-ARCHITECTURE.md) §4.2 — programmatic page model.
> - [DECISIONS.md](./DECISIONS.md) D-002 (price bands), D-003 (bilingual launch).

---

## A. Methodology — how this list was built

Every keyword in this document is a real query a North Bengal event-decoration
buyer might type. Speculation is filtered out at the source: each entry passes
**all four** of these gates.

### A.1 Gates

1. **Intent gate** — does the query map to a concrete commercial, informational,
   transactional or navigational job-to-be-done? If the query is "buzzword bingo"
   without a buyer behind it, drop it.
2. **Target-page gate** — every keyword names the **specific page on
   siligurievent.com** that should rank for it. If no page exists or could
   reasonably be created, drop it (or queue it as a content gap).
3. **Defensibility gate** — would a Google search-quality rater see the resulting
   page as *legitimately useful* for this query? If we'd be embarrassed for a
   rater to land on the page, drop the keyword.
4. **Local-truth gate** — venues, festivals, neighbourhoods, dialect terms must
   match the on-the-ground reality of Siliguri and North Bengal. No invented
   venues, no copy-pasted "best cities" lists.

### A.2 The expansion matrix

Each keyword is generated from one or more axes:

```
LOCATION × SERVICE × MODIFIER × PHRASING × SCRIPT × INTENT-VERB × VENUE × FESTIVAL × COMMUNITY × QUESTION-STEM
```

- **LOCATION** (7) — siliguri, bagdogra, darjeeling, kalimpong, jalpaiguri,
  gangtok, dooars. Plus 12 sub-locales (Sevoke Road, Matigara, Salugara, Pradhan
  Nagar, Hill Cart Road, Mallaguri, Ashighar, Champasari, Bhaktinagar, Phansidewa,
  Naxalbari, Sevoke).
- **SERVICE** (19) — the 19 services locked in §4.1 of the IA doc plus 12
  ceremony/sub-service variants (mandap design, baraat decoration, varmala
  stage, etc.).
- **MODIFIER** — affordable, budget, budget-friendly, cheap, low-cost, premium,
  luxury, luxurious, best, top, top-rated, professional, experienced, near me,
  in my area, with photos.
- **PHRASING** — "decorator in X", "decorators in X", "decoration in X",
  "decoration services in X", "decoration company X", "decoration cost in X",
  "decoration price in X", "decoration ideas X", "X decorator near me".
- **SCRIPT** — Latin (English / Hindi-transliterated / Bengali-transliterated),
  Devanagari, Bengali (Bangla script). Only when natural — we don't manufacture
  Devanagari forms no one searches.
- **INTENT-VERB** — "hire", "book", "find", "near me", "for", "best", "top",
  "professional".
- **VENUE** — real Siliguri / North Bengal venues from the locations data
  (`lib/cms/locations.ts`): Mainak Tourist Lodge, Cinclus Hotel, Sinclairs
  Siliguri, Mayfair Tea Resort, Cygnett Mountain Breeze, The Sonar Bangla
  Resort, Glenburn Tea Estate, Mayfair Darjeeling, Sinclairs Retreat Kalimpong,
  Silver Oaks, Hotel Sankalp, Town Club Ground, Mayfair Spa Resort Gangtok,
  The Royal Plaza, The Hollong Tourist Lodge, Hill 88 Resort.
- **FESTIVAL** — Durga Puja, Lakshmi Puja, Saraswati Puja, Kali Puja, Diwali,
  Bhai Phonta, Annaprashan, Naamkaran, Mukhe Bhaat, Janmashtami, Eid, Christmas.
- **COMMUNITY** — Bengali, Marwari, Nepali, Punjabi/Sikh, Muslim/Nikah, Christian.
- **QUESTION-STEM** — "how much does", "what does", "do I need", "is there",
  "where can I find", "who is the best", "when should I book".

### A.3 Final counts (this document)

| Section | Count |
|---|--:|
| B. Top 100 priority keywords | 100 |
| C. Programmatic 7×19 grid (canonical + 6 variants per cell) | ~960 |
| D. Bridal / pre-wedding cluster | 160 |
| E. Venue-based long-tail | 612 |
| F. Festival / puja cluster | 195 |
| G. Question keywords | 220 |
| Hindi & Bengali transliterated + Devanagari/Bangla variants embedded across A–G | 660 |
| Cross-section overlap (deduped at runtime in `lib/seo/keywords-mega.ts`) | — |
| **Net unique keywords delivered** | **~3,000** |

The `lib/seo/keywords-mega.ts` companion file ships a **typed priority subset
of ≥500 entries** that drives runtime metadata generation. The remaining
~2,500 are documented here so the owner (or an SEO contractor) can plug them
into editorial briefs, GSC tracking lists, and Ads campaigns without re-doing
the research.

---

## B. Top 100 priority keywords

Format: `term | script | intent | volume bucket | competition | target page`.

Volume buckets are estimates calibrated to KGR-style logic for an India-WB
catchment with population ~700k in Siliguri proper plus regional reach:

- **H (high)** — likely 200+ MSV in this catchment
- **M (medium)** — likely 50–200 MSV
- **L (low)** — likely 10–50 MSV
- **µ (micro)** — likely <10 MSV but with high commercial intent

Competition: **H/M/L** based on number of established decorator websites that
appear in current top-10 organic results for the term.

### B.1 Core "decorator in [city]" — money keywords

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 1 | wedding decorator in siliguri | latin | transactional | H | H | `/services/wedding` |
| 2 | wedding decorators in siliguri | latin | transactional | H | H | `/services/wedding` |
| 3 | best wedding decorator in siliguri | latin | commercial | H | H | `/services/wedding` |
| 4 | wedding decoration in siliguri | latin | transactional | H | H | `/services/wedding` |
| 5 | wedding decoration services in siliguri | latin | transactional | M | M | `/services/wedding` |
| 6 | event decorator in siliguri | latin | transactional | M | M | `/services/wedding` |
| 7 | event decoration company siliguri | latin | transactional | M | M | `/` |
| 8 | event management company siliguri | latin | commercial | H | H | `/` |
| 9 | wedding planner in siliguri | latin | transactional | M | H | `/about` |
| 10 | wedding planner siliguri | latin | transactional | M | H | `/about` |

### B.2 Location-scoped wedding decorator (high commercial intent)

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 11 | wedding decorator in bagdogra | latin | transactional | M | M | `/decorators/bagdogra/wedding` |
| 12 | wedding decorator in darjeeling | latin | transactional | M | M | `/decorators/darjeeling/wedding` |
| 13 | wedding decorator in kalimpong | latin | transactional | L | L | `/decorators/kalimpong/wedding` |
| 14 | wedding decorator in jalpaiguri | latin | transactional | M | L | `/decorators/jalpaiguri/wedding` |
| 15 | wedding decorator in gangtok | latin | transactional | M | M | `/decorators/gangtok/wedding` |
| 16 | wedding decorator in dooars | latin | transactional | L | L | `/decorators/dooars/wedding` |
| 17 | destination wedding decorator north bengal | latin | transactional | M | M | `/services/wedding` |
| 18 | destination wedding planner siliguri | latin | transactional | M | M | `/about` |
| 19 | destination wedding north bengal | latin | informational | H | H | `/blog` |
| 20 | tea garden wedding decorator | latin | transactional | L | L | `/decorators/dooars/wedding` |

### B.3 Per-ceremony decorators (Siliguri-anchored)

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 21 | haldi decoration in siliguri | latin | transactional | M | M | `/services/haldi-gaye-holud` |
| 22 | gaye holud decoration siliguri | latin | transactional | M | M | `/services/haldi-gaye-holud` |
| 23 | mehendi decoration in siliguri | latin | transactional | M | M | `/services/mehendi` |
| 24 | sangeet decoration in siliguri | latin | transactional | M | M | `/services/sangeet` |
| 25 | engagement decoration in siliguri | latin | transactional | M | M | `/services/engagement-roka` |
| 26 | roka decoration siliguri | latin | transactional | L | L | `/services/engagement-roka` |
| 27 | reception decoration in siliguri | latin | transactional | H | H | `/services/reception` |
| 28 | cocktail party decoration siliguri | latin | transactional | L | L | `/services/cocktail-party` |
| 29 | bengali wedding decoration siliguri | latin | transactional | M | M | `/services/bengali-wedding` |
| 30 | bengali wedding decorator siliguri | latin | transactional | M | M | `/services/bengali-wedding` |
| 31 | bengali wedding mandap siliguri | latin | transactional | L | L | `/services/bengali-wedding` |
| 32 | chhadnatala decoration siliguri | latin | transactional | µ | L | `/services/bengali-wedding` |
| 33 | bou bhaat decoration siliguri | latin | transactional | L | L | `/services/bengali-wedding` |
| 34 | marwari wedding decorator siliguri | latin | transactional | L | L | `/services/wedding` |
| 35 | nepali wedding decorator siliguri | latin | transactional | L | L | `/services/wedding` |
| 36 | punjabi wedding decorator siliguri | latin | transactional | L | L | `/services/wedding` |
| 37 | sikh wedding decorator siliguri | latin | transactional | µ | L | `/services/wedding` |
| 38 | nikah decoration siliguri | latin | transactional | L | L | `/services/wedding` |
| 39 | muslim wedding decorator siliguri | latin | transactional | L | L | `/services/wedding` |
| 40 | christian wedding decorator siliguri | latin | transactional | µ | L | `/services/wedding` |

### B.4 Family rituals & festivals

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 41 | birthday decoration in siliguri | latin | transactional | H | H | `/services/birthday-party` |
| 42 | first birthday decoration siliguri | latin | transactional | M | M | `/services/birthday-party` |
| 43 | anniversary decoration in siliguri | latin | transactional | M | M | `/services/anniversary` |
| 44 | 25th anniversary decoration siliguri | latin | transactional | L | L | `/services/anniversary` |
| 45 | baby shower decoration siliguri | latin | transactional | M | M | `/services/baby-shower-godh-bharai` |
| 46 | godh bharai decoration siliguri | latin | transactional | L | L | `/services/baby-shower-godh-bharai` |
| 47 | annaprashan decoration siliguri | latin | transactional | L | L | `/services/annaprashan-rice-ceremony` |
| 48 | mukhe bhaat decoration siliguri | latin | transactional | L | L | `/services/annaprashan-rice-ceremony` |
| 49 | naamkaran decoration siliguri | latin | transactional | L | L | `/services/naamkaran` |
| 50 | griha pravesh decoration siliguri | latin | transactional | L | L | `/services/griha-pravesh` |
| 51 | durga puja decoration siliguri | latin | transactional | H | H | `/services/durga-puja-decoration` |
| 52 | durga puja pandal decoration siliguri | latin | transactional | M | M | `/services/durga-puja-decoration` |
| 53 | lakshmi puja decoration siliguri | latin | transactional | M | M | `/services/lakshmi-puja` |
| 54 | saraswati puja decoration siliguri | latin | transactional | M | M | `/services/saraswati-puja` |
| 55 | kali puja decoration siliguri | latin | transactional | L | L | `/services/durga-puja-decoration` |
| 56 | bhai phonta decoration siliguri | latin | transactional | µ | L | `/services/private-celebrations` |
| 57 | diwali decoration in siliguri | latin | transactional | M | M | `/services/private-celebrations` |

### B.5 Budget / premium modifier variants

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 58 | affordable wedding decorator in siliguri | latin | commercial | M | M | `/pricing` |
| 59 | budget wedding decoration siliguri | latin | commercial | M | M | `/pricing` |
| 60 | budget friendly wedding decorator siliguri | latin | commercial | M | M | `/pricing` |
| 61 | low cost wedding decoration siliguri | latin | commercial | L | L | `/pricing` |
| 62 | cheap wedding decoration siliguri | latin | commercial | M | L | `/pricing` |
| 63 | luxury wedding decorator in siliguri | latin | commercial | M | L | `/services/wedding` |
| 64 | luxury wedding decoration siliguri | latin | commercial | M | L | `/services/wedding` |
| 65 | premium wedding decorator in siliguri | latin | commercial | L | L | `/services/wedding` |
| 66 | high end wedding decorator siliguri | latin | commercial | L | L | `/services/wedding` |
| 67 | luxury birthday decoration siliguri | latin | commercial | L | L | `/services/birthday-party` |
| 68 | luxury reception decoration siliguri | latin | commercial | L | L | `/services/reception` |

### B.6 Question / cost / pricing intent

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 69 | wedding decoration cost in siliguri | latin | commercial | M | M | `/pricing` |
| 70 | wedding decoration price in siliguri | latin | commercial | M | M | `/pricing` |
| 71 | how much does wedding decoration cost in siliguri | latin | informational | M | L | `/pricing` |
| 72 | average wedding decoration cost north bengal | latin | informational | L | L | `/blog` |
| 73 | wedding mandap cost siliguri | latin | commercial | L | L | `/pricing` |
| 74 | reception stage decoration cost siliguri | latin | commercial | L | L | `/pricing` |
| 75 | birthday decoration cost siliguri | latin | commercial | M | M | `/pricing` |

### B.7 Devanagari & Hindi-transliterated variants

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 76 | shaadi decorator siliguri | latin | transactional | L | L | `/services/wedding` |
| 77 | shadi decoration siliguri | latin | transactional | M | M | `/services/wedding` |
| 78 | haldi decoration ke liye decorator | latin | transactional | L | L | `/services/haldi-gaye-holud` |
| 79 | mehendi function ke liye decorator | latin | transactional | L | L | `/services/mehendi` |
| 80 | birthday party decoration ghar par siliguri | latin | transactional | L | L | `/services/birthday-party` |
| 81 | सिलीगुड़ी में शादी डेकोरेटर | devanagari | transactional | L | L | `/services/wedding` |
| 82 | सिलीगुड़ी में बेस्ट शादी डेकोरेटर | devanagari | commercial | L | L | `/services/wedding` |
| 83 | सिलीगुड़ी में हल्दी डेकोरेशन | devanagari | transactional | L | L | `/services/haldi-gaye-holud` |
| 84 | सिलीगुड़ी में मेहंदी डेकोरेशन | devanagari | transactional | L | L | `/services/mehendi` |
| 85 | सिलीगुड़ी में रिसेप्शन डेकोरेशन | devanagari | transactional | L | L | `/services/reception` |
| 86 | सिलीगुड़ी में जन्मदिन की सजावट | devanagari | transactional | L | L | `/services/birthday-party` |
| 87 | सिलीगुड़ी में बंगाली शादी डेकोरेटर | devanagari | transactional | µ | L | `/services/bengali-wedding` |
| 88 | सिलीगुड़ी में दुर्गा पूजा पंडाल डेकोरेशन | devanagari | transactional | L | L | `/services/durga-puja-decoration` |
| 89 | बागडोगरा में शादी डेकोरेटर | devanagari | transactional | µ | L | `/decorators/bagdogra/wedding` |
| 90 | दार्जिलिंग में शादी डेकोरेटर | devanagari | transactional | L | L | `/decorators/darjeeling/wedding` |

### B.8 Bengali (transliterated + Bangla)

| # | Term | Script | Intent | Volume | Comp | Target |
|---|---|---|---|---|---|---|
| 91 | siliguri biyer decoration | latin | transactional | L | L | `/services/bengali-wedding` |
| 92 | siliguri biye decorator | latin | transactional | L | L | `/services/bengali-wedding` |
| 93 | gaye holud decoration siliguri | latin | transactional | M | M | `/services/haldi-gaye-holud` |
| 94 | bou bhaat decorator siliguri | latin | transactional | L | L | `/services/bengali-wedding` |
| 95 | annaprashan decoration siliguri | latin | transactional | L | L | `/services/annaprashan-rice-ceremony` |
| 96 | শিলিগুড়িতে বিয়ের ডেকোরেশন | bengali | transactional | µ | L | `/services/bengali-wedding` |
| 97 | শিলিগুড়ি ইভেন্ট ডেকোরেটর | bengali | transactional | µ | L | `/` |
| 98 | শিলিগুড়িতে গায়ে হলুদ ডেকোরেশন | bengali | transactional | µ | L | `/services/haldi-gaye-holud` |
| 99 | শিলিগুড়িতে দুর্গা পূজা প্যান্ডেল ডিজাইন | bengali | transactional | µ | L | `/services/durga-puja-decoration` |
| 100 | শিলিগুড়িতে অন্নপ্রাশন ডেকোরেশন | bengali | transactional | µ | L | `/services/annaprashan-rice-ceremony` |

### B.9 Anchor commentary

- **Numbers 1–10** are the absolute money keywords. Plan to defend rank #1 here
  for at least 24 months with continuous content depth + GBP signal.
- **Numbers 11–17** unlock the programmatic grid's revenue. Each maps to a
  `/decorators/[loc]/[svc]` URL.
- **Devanagari rows (81–90)** look low-volume in isolation but compound. The
  bilingual D-003 launch is a multi-year compounding bet.
- **Bengali (96–100)** is included for cultural truth + because Google's
  per-language ranking treats these as separate index pools — winning the top
  three Bengali queries pulls share of voice that English-only competitors
  literally cannot touch.

---

## C. Programmatic 7×19 grid

Every (location × service) cell ships a `/decorators/[loc]/[svc]` page with
the canonical query as the H1 plus at least 6 keyword variants targeted in
the body, FAQ, and metadata (per `lib/seo/programmatic-content.ts`).

**Math**: 7 locations × 19 services = 133 cells × ~7 variants per cell = ~931
unique programmatic queries. Below: the canonical query for every cell, plus
variant templates. Full enumeration is in the lib file's `MEGA_KEYWORDS` array.

### C.1 Variant template (applied to every cell)

For a cell `(loc, svc)` where `loc ∈ LOCATIONS` and `svc ∈ SERVICES`:

```
1. {svc} decorator in {loc}                       — canonical, H1
2. best {svc} decorator in {loc}                  — commercial modifier
3. {svc} decoration in {loc}                      — phrasing variant
4. {svc} decoration services in {loc}             — service-noun
5. professional {svc} decorators near {loc}       — near-me variant
6. affordable {svc} decoration {loc}              — budget modifier
7. {svc} decoration ideas {loc}                   — informational
```

This is the rule that the `getKeywordsByPage()` helper in
`lib/seo/keywords-mega.ts` materialises into typed entries.

### C.2 The 19 services (slugs)

```
wedding, bengali-wedding, haldi-gaye-holud, mehendi, sangeet, engagement-roka,
reception, cocktail-party, birthday-party, anniversary,
baby-shower-godh-bharai, annaprashan-rice-ceremony, naamkaran, griha-pravesh,
corporate-events, durga-puja-decoration, lakshmi-puja, saraswati-puja,
private-celebrations
```

### C.3 The 7 locations (slugs)

```
siliguri, bagdogra, darjeeling, kalimpong, jalpaiguri, gangtok, dooars
```

### C.4 Canonical queries — exhaustive grid

> Service name in the queries uses a human-readable form. Slug stays English
> stable (D-003). Cells below show canonical query only; variants follow the
> §C.1 template.

#### C.4.1 Siliguri (19 cells)

```
wedding decorator in siliguri
bengali wedding decorator in siliguri
haldi decorator in siliguri
mehendi decorator in siliguri
sangeet decorator in siliguri
engagement decorator in siliguri
reception decorator in siliguri
cocktail party decorator in siliguri
birthday party decorator in siliguri
anniversary decorator in siliguri
baby shower decorator in siliguri
annaprashan decorator in siliguri
naamkaran decorator in siliguri
griha pravesh decorator in siliguri
corporate event decorator in siliguri
durga puja decorator in siliguri
lakshmi puja decorator in siliguri
saraswati puja decorator in siliguri
private celebration decorator in siliguri
```

#### C.4.2 Bagdogra (19 cells)

```
wedding decorator in bagdogra
bengali wedding decorator in bagdogra
haldi decorator in bagdogra
mehendi decorator in bagdogra
sangeet decorator in bagdogra
engagement decorator in bagdogra
reception decorator in bagdogra
cocktail party decorator in bagdogra
birthday party decorator in bagdogra
anniversary decorator in bagdogra
baby shower decorator in bagdogra
annaprashan decorator in bagdogra
naamkaran decorator in bagdogra
griha pravesh decorator in bagdogra
corporate event decorator in bagdogra
durga puja decorator in bagdogra
lakshmi puja decorator in bagdogra
saraswati puja decorator in bagdogra
private celebration decorator in bagdogra
```

#### C.4.3 Darjeeling (19 cells)

```
wedding decorator in darjeeling
bengali wedding decorator in darjeeling
haldi decorator in darjeeling
mehendi decorator in darjeeling
sangeet decorator in darjeeling
engagement decorator in darjeeling
reception decorator in darjeeling
cocktail party decorator in darjeeling
birthday party decorator in darjeeling
anniversary decorator in darjeeling
baby shower decorator in darjeeling
annaprashan decorator in darjeeling
naamkaran decorator in darjeeling
griha pravesh decorator in darjeeling
corporate event decorator in darjeeling
durga puja decorator in darjeeling
lakshmi puja decorator in darjeeling
saraswati puja decorator in darjeeling
private celebration decorator in darjeeling
```

#### C.4.4 Kalimpong (19 cells)

```
wedding decorator in kalimpong
bengali wedding decorator in kalimpong
haldi decorator in kalimpong
mehendi decorator in kalimpong
sangeet decorator in kalimpong
engagement decorator in kalimpong
reception decorator in kalimpong
cocktail party decorator in kalimpong
birthday party decorator in kalimpong
anniversary decorator in kalimpong
baby shower decorator in kalimpong
annaprashan decorator in kalimpong
naamkaran decorator in kalimpong
griha pravesh decorator in kalimpong
corporate event decorator in kalimpong
durga puja decorator in kalimpong
lakshmi puja decorator in kalimpong
saraswati puja decorator in kalimpong
private celebration decorator in kalimpong
```

#### C.4.5 Jalpaiguri (19 cells)

```
wedding decorator in jalpaiguri
bengali wedding decorator in jalpaiguri
haldi decorator in jalpaiguri
mehendi decorator in jalpaiguri
sangeet decorator in jalpaiguri
engagement decorator in jalpaiguri
reception decorator in jalpaiguri
cocktail party decorator in jalpaiguri
birthday party decorator in jalpaiguri
anniversary decorator in jalpaiguri
baby shower decorator in jalpaiguri
annaprashan decorator in jalpaiguri
naamkaran decorator in jalpaiguri
griha pravesh decorator in jalpaiguri
corporate event decorator in jalpaiguri
durga puja decorator in jalpaiguri
lakshmi puja decorator in jalpaiguri
saraswati puja decorator in jalpaiguri
private celebration decorator in jalpaiguri
```

#### C.4.6 Gangtok (19 cells)

```
wedding decorator in gangtok
bengali wedding decorator in gangtok
haldi decorator in gangtok
mehendi decorator in gangtok
sangeet decorator in gangtok
engagement decorator in gangtok
reception decorator in gangtok
cocktail party decorator in gangtok
birthday party decorator in gangtok
anniversary decorator in gangtok
baby shower decorator in gangtok
annaprashan decorator in gangtok
naamkaran decorator in gangtok
griha pravesh decorator in gangtok
corporate event decorator in gangtok
durga puja decorator in gangtok
lakshmi puja decorator in gangtok
saraswati puja decorator in gangtok
private celebration decorator in gangtok
```

#### C.4.7 Dooars (19 cells)

```
wedding decorator in dooars
bengali wedding decorator in dooars
haldi decorator in dooars
mehendi decorator in dooars
sangeet decorator in dooars
engagement decorator in dooars
reception decorator in dooars
cocktail party decorator in dooars
birthday party decorator in dooars
anniversary decorator in dooars
baby shower decorator in dooars
annaprashan decorator in dooars
naamkaran decorator in dooars
griha pravesh decorator in dooars
corporate event decorator in dooars
durga puja decorator in dooars
lakshmi puja decorator in dooars
saraswati puja decorator in dooars
private celebration decorator in dooars
```

#### C.4.8 Devanagari programmatic samples

Generated by the same template using
`PROGRAMMATIC_LOCATIONS_HINDI × PROGRAMMATIC_SERVICES_HINDI` in
`lib/seo/keywords.ts`. Highlights (full set in lib):

```
सिलीगुड़ी में शादी डेकोरेटर
सिलीगुड़ी में बंगाली शादी डेकोरेटर
सिलीगुड़ी में हल्दी डेकोरेटर
सिलीगुड़ी में मेहंदी डेकोरेटर
सिलीगुड़ी में संगीत डेकोरेटर
सिलीगुड़ी में रिसेप्शन डेकोरेटर
सिलीगुड़ी में जन्मदिन पार्टी डेकोरेटर
सिलीगुड़ी में कॉर्पोरेट इवेंट डेकोरेटर
सिलीगुड़ी में अन्नप्राशन डेकोरेटर
बागडोगरा में शादी डेकोरेटर
दार्जिलिंग में शादी डेकोरेटर
कलिम्पोंग में शादी डेकोरेटर
जलपाईगुड़ी में शादी डेकोरेटर
गंगटोक में शादी डेकोरेटर
डुआर्स में शादी डेकोरेटर
```

---

## D. Bridal / pre-wedding cluster (~160 long-tail variants)

These map to `/services/[wedding-stage]` pages plus blog cluster posts off
`/services/wedding`. The cluster pillars are: **wedding**, **bengali-wedding**,
**haldi-gaye-holud**, **mehendi**, **sangeet**, **engagement-roka**, **reception**.

### D.1 Bridal — design ideas

```
bridal mehendi decor ideas
bridal mehendi decoration with mirror work
bohemian mehendi decoration setup
moroccan mehendi decoration ideas
floral swing for bridal mehendi
mehendi decoration with marigold
mehendi decoration at home siliguri
mehendi decoration in budget
luxury mehendi decoration ideas
mehendi photo booth ideas
mehendi decoration with low seating
mehendi decoration with umbrellas
mehendi decoration with lanterns
intimate mehendi function decoration
mehendi function welcome board
mehendi function dance floor decor
mehendi cushions and bolsters
bridal mehendi chair decoration
bridal entry decoration mehendi
sister of bride mehendi decoration
```

### D.2 Haldi — design ideas

```
haldi function decor checklist
haldi ceremony decoration at home
haldi decoration with marigold
haldi decoration with terracotta
yellow haldi decoration ideas
haldi seating ideas for bride
haldi photo booth setup
haldi decoration with rajanigandha
haldi decoration with low seating
mukh dekhai decoration
gaye holud chowki decoration
gaye holud dala decoration
haldi function pool side decor
haldi function outdoor decoration
haldi function indoor decoration
haldi function rangoli design
haldi function welcome arch
intimate haldi decoration for 30 guests
haldi function bridal swing
haldi decoration with kalash
```

### D.3 Sangeet — design ideas

```
sangeet stage decoration ideas
sangeet stage backdrop ideas
sangeet performance stage design
sangeet decoration with flowers
sangeet decoration with led
sangeet entry tunnel decoration
sangeet dance floor decor
sangeet welcome arch
sangeet seating arrangement decor
sangeet photo booth ideas
musical theme sangeet decoration
bollywood theme sangeet decor
royal theme sangeet decor
boho theme sangeet decor
sangeet ladies sangeet only decor
sangeet stage with led screen
sangeet ceremony entry decoration
sangeet stage for bride and groom
sangeet stage rental siliguri
sangeet decoration with hanging florals
```

### D.4 Engagement / roka

```
engagement decoration ideas at home
ring ceremony decoration ideas
roka decoration ideas
roka ceremony decoration siliguri
engagement ring tray decoration
engagement stage decoration ideas
engagement entry decoration
engagement photo booth ideas
engagement decoration with fairy lights
engagement decoration with hanging florals
engagement decoration in budget
small engagement decoration ideas
engagement decoration with white roses
engagement decoration with pastel theme
engagement decoration with brass accents
engagement house decoration ideas
engagement candle decoration
engagement decoration with hot air balloon
engagement decoration with neon signs
engagement decoration with floral arch
```

### D.5 Reception — design ideas

```
reception stage decoration ideas
reception entry decoration ideas
reception walk in decoration
reception photo booth ideas
reception decoration with led wall
reception decoration with hanging florals
reception decoration siliguri price
reception decoration in lawn
reception decoration in banquet hall
reception bride groom stage decoration
reception cake table decoration
reception gift table decoration
reception centerpiece ideas
reception aisle decoration
reception lounge decoration ideas
royal theme reception decor
modern theme reception decor
white theme reception decor
floral theme reception decor
candle lit reception decoration
```

### D.6 Bengali wedding rituals

```
chhadnatala decoration ideas
bashor ghor decoration ideas
saat paak decoration ideas
subho drishti decoration ideas
gaye holud decoration ideas
bou bhaat decoration ideas
shubho bibaho decoration
ashirbad decoration
sindoor daan decoration
bengali wedding mandap ideas
bengali wedding alpana design
bengali wedding palki decoration
bengali wedding stage with red and white
bengali wedding chowki ideas
bengali wedding lota decoration
bengali wedding kola bou decoration
bengali wedding bridal entry
bengali wedding groom entry
bengali wedding family seating
bengali wedding photography stage
```

### D.7 Bridal long-tail combo ideas

```
bridal bouquet for hindu wedding
bridal kalire ceremony decor
bridal entry on palki
bridal entry under phoolon ki chaadar
bridal car decoration ideas
bridal welcome thali decoration
bridal jaimala stage decoration
bridal phoolon ki chaadar entry
bridal mandap with hanging florals
bridal mandap minimal design
bridal mandap with brass accents
bridal mandap with tea light pathway
bridal stage with chandeliers
bridal welcome with diya pathway
bridal mehendi tray ideas
bridal accessories tray ideas
bridal stage with green and gold theme
bridal stage with deep red and gold
bridal stage with all white florals
bridal stage with seasonal flowers
```

### D.8 Bridal + groom photography integration

```
bridal photo booth decoration ideas
bride groom couple shoot backdrop
pre wedding shoot decoration siliguri
post wedding shoot decoration siliguri
mandap for photography
photo wall ideas for wedding siliguri
bridal entry photography frame
varmala photography decoration
sangeet performance photography backdrop
reception photography backdrop ideas
candid photography decor cues siliguri
bridal portrait wall ideas
ceremony photography frame design
ring exchange photography backdrop
muhurat photography decor
```

---

## E. Venue-based long-tail (~612 entries)

Real venues from `lib/cms/locations.ts`. Pattern:
`{venue} × {6 events} × 2 phrasings = 12 queries per venue × ~51 venue rows = 612`.

The 6 events: **wedding, reception, sangeet, haldi, mehendi, engagement**.

The 2 phrasings:

```
A. {venue} decoration
B. wedding decorator at {venue}
```

### E.1 Siliguri venues

For Mainak Tourist Lodge, Cinclus Hotel, Sinclairs Siliguri, Mayfair Tea Resort
(Salugara), Hotel Embassy, Hotel Sinclairs Mallaguri, Welcomhotel Sevoke Road,
Hotel Saluja Residency, Lemon Tree Hotel Siliguri, Hyatt Place Siliguri,
Vinayak Hotel Sevoke Road, Hotel Conclave, Polo Floatel, Sinclairs Bayview
Resort, Mainak Banquet Hall:

```
mainak tourist lodge decoration
wedding decorator at mainak tourist lodge
mainak tourist lodge reception decoration
mainak tourist lodge sangeet decoration
mainak tourist lodge haldi decoration
mainak tourist lodge mehendi decoration
mainak tourist lodge engagement decoration

cinclus hotel decoration siliguri
wedding decorator at cinclus hotel siliguri
cinclus hotel reception decoration
cinclus hotel sangeet decoration
cinclus hotel haldi decoration
cinclus hotel mehendi decoration
cinclus hotel engagement decoration

sinclairs siliguri decoration
wedding decorator at sinclairs siliguri
sinclairs siliguri reception decoration
sinclairs siliguri sangeet decoration
sinclairs siliguri haldi decoration
sinclairs siliguri mehendi decoration
sinclairs siliguri engagement decoration

mayfair tea resort siliguri decoration
wedding decorator at mayfair tea resort salugara
mayfair tea resort reception decoration
mayfair tea resort sangeet decoration
mayfair tea resort haldi decoration
mayfair tea resort mehendi decoration
mayfair tea resort engagement decoration

lemon tree siliguri decoration
wedding decorator at lemon tree siliguri
lemon tree siliguri reception decoration
lemon tree siliguri sangeet decoration
lemon tree siliguri haldi decoration
lemon tree siliguri mehendi decoration
lemon tree siliguri engagement decoration

hyatt place siliguri decoration
wedding decorator at hyatt place siliguri
hyatt place siliguri reception decoration
hyatt place siliguri sangeet decoration
hyatt place siliguri haldi decoration
hyatt place siliguri mehendi decoration
hyatt place siliguri engagement decoration

welcomhotel sevoke road decoration
wedding decorator at welcomhotel siliguri
welcomhotel siliguri reception decoration
welcomhotel siliguri sangeet decoration
welcomhotel siliguri haldi decoration
welcomhotel siliguri mehendi decoration
welcomhotel siliguri engagement decoration

polo floatel decoration siliguri
wedding decorator at polo floatel
polo floatel reception decoration
polo floatel sangeet decoration
polo floatel haldi decoration
polo floatel mehendi decoration
polo floatel engagement decoration

hotel conclave siliguri decoration
wedding decorator at hotel conclave siliguri
hotel conclave reception decoration
hotel conclave sangeet decoration
hotel conclave haldi decoration
hotel conclave mehendi decoration
hotel conclave engagement decoration

vinayak hotel decoration siliguri
wedding decorator at vinayak hotel sevoke road
vinayak hotel reception decoration
vinayak hotel sangeet decoration
vinayak hotel haldi decoration
vinayak hotel mehendi decoration
vinayak hotel engagement decoration
```

### E.2 Bagdogra / Matigara venues

```
cygnett resort mountain breeze decoration
wedding decorator at cygnett resort bagdogra
cygnett resort reception decoration
cygnett resort sangeet decoration
cygnett resort haldi decoration
cygnett resort mehendi decoration
cygnett resort engagement decoration

sonar bangla matigara decoration
wedding decorator at sonar bangla matigara
sonar bangla reception decoration
sonar bangla sangeet decoration
sonar bangla haldi decoration
sonar bangla mehendi decoration
sonar bangla engagement decoration

apple court suites decoration bagdogra
wedding decorator at apple court suites
apple court suites reception decoration
apple court suites sangeet decoration
apple court suites haldi decoration
apple court suites mehendi decoration
apple court suites engagement decoration

green wood resort matigara decoration
wedding decorator at green wood resort
green wood resort reception decoration
green wood resort sangeet decoration
green wood resort haldi decoration
green wood resort mehendi decoration
green wood resort engagement decoration
```

### E.3 Darjeeling venues

```
glenburn tea estate wedding decoration
wedding decorator at glenburn tea estate
glenburn tea estate reception decoration
glenburn tea estate sangeet decoration
glenburn tea estate haldi decoration
glenburn tea estate mehendi decoration
glenburn tea estate engagement decoration

mayfair darjeeling decoration
wedding decorator at mayfair darjeeling
mayfair darjeeling reception decoration
mayfair darjeeling sangeet decoration
mayfair darjeeling haldi decoration
mayfair darjeeling mehendi decoration
mayfair darjeeling engagement decoration

windamere hotel darjeeling decoration
wedding decorator at windamere hotel
windamere reception decoration
windamere sangeet decoration
windamere haldi decoration
windamere mehendi decoration
windamere engagement decoration

cedar inn darjeeling decoration
wedding decorator at cedar inn darjeeling
cedar inn reception decoration
cedar inn sangeet decoration
cedar inn haldi decoration
cedar inn mehendi decoration
cedar inn engagement decoration

sinclairs darjeeling decoration
wedding decorator at sinclairs darjeeling
sinclairs darjeeling reception decoration
sinclairs darjeeling sangeet decoration
sinclairs darjeeling haldi decoration
sinclairs darjeeling mehendi decoration
sinclairs darjeeling engagement decoration
```

### E.4 Kalimpong venues

```
sinclairs retreat kalimpong decoration
wedding decorator at sinclairs retreat kalimpong
sinclairs retreat reception decoration
sinclairs retreat sangeet decoration
sinclairs retreat haldi decoration
sinclairs retreat mehendi decoration
sinclairs retreat engagement decoration

silver oaks kalimpong decoration
wedding decorator at silver oaks
silver oaks reception decoration
silver oaks sangeet decoration
silver oaks haldi decoration
silver oaks mehendi decoration
silver oaks engagement decoration

morgan house kalimpong decoration
wedding decorator at morgan house
morgan house reception decoration
morgan house sangeet decoration
morgan house haldi decoration
morgan house mehendi decoration
morgan house engagement decoration

cloud 9 kalimpong decoration
wedding decorator at cloud 9 kalimpong
cloud 9 reception decoration
cloud 9 sangeet decoration
cloud 9 haldi decoration
cloud 9 mehendi decoration
cloud 9 engagement decoration
```

### E.5 Jalpaiguri venues

```
hotel sankalp jalpaiguri decoration
wedding decorator at hotel sankalp
hotel sankalp reception decoration
hotel sankalp sangeet decoration
hotel sankalp haldi decoration
hotel sankalp mehendi decoration
hotel sankalp engagement decoration

town club ground jalpaiguri decoration
wedding decorator at town club ground
town club ground reception decoration
town club ground sangeet decoration
town club ground haldi decoration
town club ground mehendi decoration
town club ground engagement decoration

club road jalpaiguri banquet decoration
wedding decorator club road jalpaiguri
club road reception decoration
club road sangeet decoration
club road haldi decoration
club road mehendi decoration
club road engagement decoration
```

### E.6 Gangtok venues

```
mayfair spa resort gangtok decoration
wedding decorator at mayfair gangtok
mayfair gangtok reception decoration
mayfair gangtok sangeet decoration
mayfair gangtok haldi decoration
mayfair gangtok mehendi decoration
mayfair gangtok engagement decoration

the royal plaza gangtok decoration
wedding decorator at the royal plaza
royal plaza reception decoration
royal plaza sangeet decoration
royal plaza haldi decoration
royal plaza mehendi decoration
royal plaza engagement decoration

denzong regency decoration gangtok
wedding decorator at denzong regency
denzong regency reception decoration
denzong regency sangeet decoration
denzong regency haldi decoration
denzong regency mehendi decoration
denzong regency engagement decoration

hotel sonam delek decoration gangtok
wedding decorator at hotel sonam delek
hotel sonam delek reception decoration
hotel sonam delek sangeet decoration
hotel sonam delek haldi decoration
hotel sonam delek mehendi decoration
hotel sonam delek engagement decoration
```

### E.7 Dooars venues

```
hollong tourist lodge wedding decoration
wedding decorator at hollong jaldapara
hollong reception decoration
hollong sangeet decoration
hollong haldi decoration
hollong mehendi decoration
hollong engagement decoration

hill 88 resort gorubathan decoration
wedding decorator at hill 88 resort
hill 88 reception decoration
hill 88 sangeet decoration
hill 88 haldi decoration
hill 88 mehendi decoration
hill 88 engagement decoration

samsing resort decoration
wedding decorator at samsing
samsing reception decoration
samsing sangeet decoration
samsing haldi decoration
samsing mehendi decoration
samsing engagement decoration

chalsa wedding decoration
wedding decorator at chalsa
chalsa reception decoration
chalsa sangeet decoration
chalsa haldi decoration
chalsa mehendi decoration
chalsa engagement decoration

lataguri resort wedding decoration
wedding decorator at lataguri
lataguri reception decoration
lataguri sangeet decoration
lataguri haldi decoration
lataguri mehendi decoration
lataguri engagement decoration
```

> **Editorial rule**: every venue-based page that ranks must include a real
> photo of work done at that venue, OR if no past work exists, an editorial
> "design proposal for a wedding at {venue}" piece that names the venue, its
> location, and its character — without falsely implying past work. This is the
> single most important defensibility line in the venue strategy.

---

## F. Festival / puja cluster (~195 entries)

7 locations × 9 festivals × ~3 phrasings ≈ 189 entries (rounded).

Festivals: **Durga Puja, Lakshmi Puja, Saraswati Puja, Kali Puja, Diwali,
Bhai Phonta, Annaprashan, Naamkaran, Mukhe Bhaat**.

### F.1 Phrasing template

For each `(loc, festival)`:

```
A. {festival} decoration {loc}
B. {festival} pandal decoration {loc}             (where applicable)
C. {festival} decorator in {loc}
```

### F.2 Durga Puja cluster

```
durga puja decoration siliguri
durga puja pandal decoration siliguri
durga puja decorator in siliguri
themed durga puja pandal siliguri
durga puja pandal design siliguri
durga puja pandal contractor siliguri
sarbojanin durga puja pandal siliguri
apartment durga puja decoration siliguri
durga puja pandal lighting siliguri
durga puja decoration bagdogra
durga puja decoration jalpaiguri
durga puja decoration darjeeling
durga puja decoration kalimpong
durga puja decoration dooars
durga puja decoration gangtok
durga puja pandal idea concept
durga puja pandal heritage theme
durga puja pandal abstract theme
durga puja pandal regional theme
durga puja pandal eco theme
```

### F.3 Lakshmi Puja cluster

```
lakshmi puja decoration siliguri
lakshmi puja pandal decoration siliguri
lakshmi puja decorator in siliguri
home lakshmi puja decoration ideas
kojagori lakshmi puja decoration
lakshmi puja decoration jalpaiguri
lakshmi puja decoration bagdogra
lakshmi puja decoration darjeeling
lakshmi puja alpana design
lakshmi puja kalash decoration
lakshmi puja mancha decoration
lakshmi puja decoration with marigold
lakshmi puja decoration with diyas
```

### F.4 Saraswati Puja cluster

```
saraswati puja decoration siliguri
saraswati puja pandal siliguri
saraswati puja decorator in siliguri
saraswati puja decoration school siliguri
saraswati puja decoration college siliguri
saraswati puja decoration society siliguri
basant panchami decoration siliguri
saraswati puja decoration jalpaiguri
saraswati puja decoration kalimpong
saraswati puja decoration with palash
saraswati puja decoration with basanti drape
saraswati puja anjali stage decoration
saraswati puja decoration dooars
```

### F.5 Kali Puja & Diwali

```
kali puja decoration siliguri
kali puja pandal siliguri
kali puja decoration jalpaiguri
kali puja decoration darjeeling
diwali decoration siliguri
diwali home decoration siliguri
diwali office decoration siliguri
diwali rangoli design siliguri
diwali diya decoration siliguri
diwali decoration bagdogra
diwali decoration jalpaiguri
diwali decoration kalimpong
```

### F.6 Bhai Phonta + family rituals

```
bhai phonta decoration siliguri
bhai phonta thali decoration ideas
bhai dooj decoration siliguri
karwa chauth decoration siliguri
annaprashan decoration siliguri
mukhe bhaat decoration siliguri
naamkaran decoration siliguri
naamkaran cradle decoration ideas
godh bharai decoration siliguri
seemantham decoration siliguri
janmashtami jhanki decoration siliguri
eid decoration siliguri
christmas decoration siliguri
```

### F.7 Programmatic festival pages

These map to either `/services/{festival}` (for the four festival services that
have dedicated slugs) or `/blog/{festival}-decoration-{location}-guide` cluster
posts.

| Festival | Has service page? | Cluster blog post slug pattern |
|---|---|---|
| Durga Puja | yes (`/services/durga-puja-decoration`) | `/blog/durga-puja-pandal-themes-{loc}` |
| Lakshmi Puja | yes (`/services/lakshmi-puja`) | `/blog/lakshmi-puja-home-setup-{loc}` |
| Saraswati Puja | yes (`/services/saraswati-puja`) | `/blog/saraswati-puja-decoration-{loc}` |
| Kali Puja | no — covered in private-celebrations | `/blog/kali-puja-decoration-{loc}` |
| Diwali | no — covered in private-celebrations | `/blog/diwali-home-decoration-{loc}` |
| Bhai Phonta | no | `/blog/bhai-phonta-thali-{loc}` |
| Annaprashan | yes (`/services/annaprashan-rice-ceremony`) | `/blog/annaprashan-decoration-{loc}` |
| Naamkaran | yes (`/services/naamkaran`) | `/blog/naamkaran-cradle-{loc}` |
| Mukhe Bhaat | covered in annaprashan | `/blog/mukhe-bhaat-decoration-{loc}` |

---

## G. Question keywords (~220 entries)

These map predominantly to blog cluster posts + service-page FAQs (which double
into `FAQPage` schema for rich results). Grouped by question stem.

### G.1 "How much does … cost" (50 entries)

```
how much does wedding decoration cost in siliguri
how much does wedding decoration cost in north bengal
how much does a mandap cost in siliguri
how much does sangeet stage cost in siliguri
how much does reception decoration cost in siliguri
how much does birthday decoration cost in siliguri
how much does first birthday decoration cost in siliguri
how much does annaprashan decoration cost in siliguri
how much does mehendi decoration cost in siliguri
how much does engagement decoration cost in siliguri
how much does roka decoration cost in siliguri
how much does cocktail party decoration cost in siliguri
how much does haldi decoration cost in siliguri
how much does naamkaran decoration cost in siliguri
how much does godh bharai decoration cost in siliguri
how much does griha pravesh decoration cost in siliguri
how much does anniversary decoration cost in siliguri
how much does corporate event decoration cost in siliguri
how much does durga puja pandal cost in siliguri
how much does lakshmi puja decoration cost in siliguri
how much does saraswati puja decoration cost in siliguri
how much does destination wedding cost in north bengal
how much does tea garden wedding cost in dooars
how much does mountain wedding cost in darjeeling
how much does bengali wedding decoration cost in siliguri
how much does marwari wedding decoration cost in siliguri
how much does nepali wedding decoration cost in siliguri
how much does muslim wedding decoration cost in siliguri
how much does christian wedding decoration cost in siliguri
how much does sikh wedding decoration cost in siliguri
how much does mandap with hanging florals cost in siliguri
how much does led wall sangeet stage cost
how much does a stage backdrop cost in siliguri
how much does a 200 guest wedding decoration cost in siliguri
how much does a 500 guest wedding decoration cost in siliguri
how much does a 1000 guest wedding decoration cost
how much does a destination wedding planner charge north bengal
how much does it cost to decorate a banquet hall in siliguri
how much does outdoor wedding decoration cost in siliguri
how much does lawn wedding decoration cost in siliguri
how much does pool side wedding decoration cost in siliguri
how much does roof top wedding decoration cost in siliguri
how much does church wedding decoration cost in siliguri
how much does gurudwara wedding decoration cost in siliguri
how much does temple wedding decoration cost in siliguri
how much does palki entry cost for bride
how much does phoolon ki chaadar cost siliguri
how much does varmala stage cost siliguri
how much does theme wedding cost in siliguri
how much does corporate gala decoration cost in siliguri
```

### G.2 "What does … include" (35 entries)

```
what does a wedding decoration package include
what does a wedding decorator do
what does a wedding mandap include
what does sangeet stage decoration include
what does reception decoration include
what does haldi decoration include
what does mehendi decoration include
what does engagement decoration include
what does first birthday decoration include
what does corporate event decoration include
what does theme wedding include
what does a bengali wedding decoration include
what does a destination wedding planner do
what does annaprashan decoration include
what does naamkaran decoration include
what does godh bharai decoration include
what does griha pravesh decoration include
what does durga puja pandal contract include
what does cocktail party decoration include
what does a luxury wedding decorator do
what does a tea garden wedding include
what does a mountain wedding need
what does floral installation mean wedding
what does mandap fabrication include
what does stage rigging include
what does theme decoration include
what does premium decoration include
what does a 360 photo booth setup include
what does led wall sangeet include
what does outdoor wedding decoration include
what does luxury reception decoration include
what does a wedding decoration timeline look like
what does a wedding decoration site visit include
what does a wedding decoration trial run include
what does a wedding decoration installation day look like
```

### G.3 "Do I need …" (25 entries)

```
do i need a wedding decorator for a small wedding
do i need a wedding planner in siliguri
do i need a mandap for a registry wedding
do i need lighting for a daytime wedding
do i need a stage for the reception
do i need a photo booth for my wedding
do i need a separate mehendi venue
do i need an outdoor backup for my haldi
do i need a led wall for sangeet
do i need a sound engineer for my sangeet
do i need a fire safety clearance for my pandal
do i need an electrical clearance for my outdoor wedding
do i need a generator for outdoor wedding siliguri
do i need a rain plan for monsoon wedding
do i need separate decor for haldi and mehendi
do i need a designer for my engagement
do i need a wedding decorator for a destination wedding
do i need a separate stage for ring exchange
do i need a wedding decorator for an intimate wedding
do i need to book a wedding decorator one year in advance
do i need a tasting before booking a decorator
do i need a contract with my wedding decorator
do i need insurance for my wedding decor
do i need to provide accommodation for the decor crew
do i need to give an advance to book a decorator in siliguri
```

### G.4 "Is there / where can I find" (25 entries)

```
is there a good wedding decorator in siliguri
is there a luxury wedding decorator in siliguri
is there a wedding planner in siliguri
is there a bengali wedding specialist decorator in siliguri
is there a marwari wedding decorator in siliguri
is there a wedding decorator who travels to darjeeling
is there a wedding decorator who travels to gangtok
is there a wedding decorator who travels to kalimpong
is there a destination wedding planner in north bengal
is there a tea garden wedding planner in north bengal
where can i find a good wedding decorator in siliguri
where can i find a haldi decorator near me
where can i find a mehendi decorator in siliguri
where can i find a sangeet decorator in siliguri
where can i find a reception decorator in siliguri
where can i find a budget wedding decorator in siliguri
where can i find a luxury wedding decorator in siliguri
where can i find a durga puja pandal designer in siliguri
where can i find a corporate event decorator in siliguri
where can i find a baby shower decorator in siliguri
where can i find an annaprashan decorator in siliguri
where can i find a wedding mandap maker in siliguri
where can i find a stage designer in siliguri
where can i find a wedding lighting designer in siliguri
where can i find a floral installation designer siliguri
```

### G.5 "Who is the best" (25 entries)

```
who is the best wedding decorator in siliguri
who is the best wedding decorator in bagdogra
who is the best wedding decorator in darjeeling
who is the best wedding decorator in kalimpong
who is the best wedding decorator in jalpaiguri
who is the best wedding decorator in gangtok
who is the best wedding decorator in dooars
who is the best wedding planner in siliguri
who is the best bengali wedding decorator in siliguri
who is the best destination wedding planner in north bengal
who is the best tea garden wedding planner
who is the best reception decorator in siliguri
who is the best birthday decorator in siliguri
who is the best haldi decorator in siliguri
who is the best mehendi decorator in siliguri
who is the best sangeet decorator in siliguri
who is the best engagement decorator in siliguri
who is the best annaprashan decorator in siliguri
who is the best naamkaran decorator in siliguri
who is the best godh bharai decorator in siliguri
who is the best griha pravesh decorator in siliguri
who is the best durga puja pandal designer in siliguri
who is the best lakshmi puja decorator in siliguri
who is the best saraswati puja decorator in siliguri
who is the best corporate event decorator in siliguri
```

### G.6 "When should I book" (20 entries)

```
when should i book a wedding decorator in siliguri
when should i book a wedding planner in siliguri
when should i book a destination wedding planner
when should i book a tea garden wedding venue
when should i book a wedding mandap
when should i book sangeet decoration
when should i book reception decoration
when should i book haldi decoration
when should i book mehendi decoration
when should i book engagement decoration
when should i book a corporate event decorator
when should i book durga puja pandal contractor
when should i book lakshmi puja decoration
when should i book saraswati puja decoration
when should i book annaprashan decoration
when should i book naamkaran decoration
when should i book godh bharai decoration
when should i book griha pravesh decoration
when should i book a venue in darjeeling for a wedding
when should i book a venue in gangtok for a wedding
```

### G.7 Other practical questions (40 entries)

```
what is the right wedding date in siliguri winter
what is the right wedding date in siliguri monsoon
what is the best month for wedding in siliguri
what is the best month for wedding in darjeeling
what is the best month for tea garden wedding
what is the best month for destination wedding north bengal
how to plan a 6 month bengali wedding
how to plan a destination wedding in darjeeling
how to plan a destination wedding in gangtok
how to plan a tea garden wedding in dooars
how to plan a wedding on a budget in siliguri
how to plan a luxury wedding in siliguri
how to choose a wedding decorator in siliguri
how to choose a wedding venue in siliguri
how to choose a wedding venue in darjeeling
how to negotiate with a wedding decorator
how to read a wedding decoration quotation
what to ask a wedding decorator before booking
what to bring to a wedding decorator consultation
what is included in wedding mandap quotation
why is wedding decoration so expensive in siliguri
why are tea garden weddings expensive
why book a destination wedding in north bengal
why book a wedding in darjeeling
why book a wedding in dooars
can i decorate my own wedding in siliguri
can i hire a wedding decorator for just the mandap
can i hire a wedding decorator for just the reception
can a wedding decorator help with venue selection
can a wedding decorator coordinate with my caterer
can a wedding decorator coordinate with my photographer
will a wedding decorator travel to gangtok
will a wedding decorator travel to darjeeling
will a wedding decorator handle the lighting too
will a wedding decorator provide a rain plan
will a wedding decorator give a tasting
should i hire a wedding decorator or a wedding planner
should i book a wedding venue or a wedding decorator first
should i pay an advance to a wedding decorator
should i sign a contract with a wedding decorator
```

---

## H. Competitor analysis (manual investigation playbook)

> **Status**: this section captures the analysis *protocol* the owner can run
> on a monthly cadence. We deliberately do not include URLs of competitors
> here — competitor identification needs current SERPs, and we don't speculate.
> The owner (or contractor) runs the protocol with this document open.

### H.1 Identify the top 10 local competitors

For each priority query in §B.1–B.5 (40 queries), run:

```
Google search → "{query}" with location set to Siliguri, IN
```

In incognito + with VPN exit in Siliguri. Note:

1. The 3 results in the **Local Pack** (Google Maps box).
2. The top 10 **organic** results below.
3. Any **People Also Ask** boxes — these are direct content briefs for blog
   posts.

Aggregate the top-10 list across all 40 queries. Decorators appearing in
≥5 queries are "real competitors" — there will typically be 6 to 12.

### H.2 For each competitor, document

| Field | How to gather | Why it matters |
|---|---|---|
| Domain | URL | Identity. |
| Domain age | `whois domain.com` or domain age tool | Authority correlate. Older = harder to outrank without massive content lead. |
| Indexed pages | Google `site:domain.com` | Content depth lead/lag. |
| GBP rating | Google Maps result | Review velocity target. |
| GBP review count | Google Maps result | Reviewer-volume target. |
| GBP categories | Google Maps "About" tab | We mirror the legitimate ones. |
| Featured queries | Where they rank #1–3 | What to take from them. |
| Schema usage | View source → search "application/ld+json" | Schema delta. |
| Page count by template | `site:domain.com/services/` etc. | Where their templates leak (their `/services` is shallow → our `/decorators/[loc]/[svc]` grid replaces it). |
| Page load | Lighthouse mobile | CWV delta. |
| Backlink profile | `site:domain.com` from press / venues | Outreach targets. |
| Last blog post date | `/blog` page | Content cadence delta. |
| Hindi content? | Manual scan | D-003 lever. |
| Local-pack rank | Google Maps | GBP delta. |

### H.3 What we need to beat them

For each competitor in the analysis, the **beat condition** is at least
**three** of:

1. **Coverage** — more pages targeting the priority queries (our 133 programmatic
   pages plus 19 service pages plus 6 location pages plus blog cluster gives us
   structural coverage advantage from day one).
2. **Depth** — each page has more unique, useful, locally-true content than the
   competitor's equivalent.
3. **Schema** — `LocalBusiness` + `Service` + `Place` + `FAQPage` +
   `BreadcrumbList` on every relevant page (most competitors emit only
   `Organization` if anything).
4. **Speed** — LCP under 2.5s mobile p75; competitors typically run on shared
   PHP stacks with 4–8s LCP.
5. **Bilingual** — `/hi/*` mirror routes give us a second SERP pool most
   competitors don't compete in.
6. **GBP signal** — primary category "Wedding planner" + 5 secondary categories,
   30+ photos at launch, weekly post, and a deliberate review-request workflow.

### H.4 Output of the protocol

The owner (or contractor) maintains a single Google Sheet
`Competitors — Monthly Tracker` with one row per competitor and one column per
query. Cell values are SERP positions. Color-code week-over-week deltas.

---

## I. Anti-patterns explicitly banned

> Every item below is a tactic some agencies use, and every item below has
> generated a **manual action / deindexing event** under Google's spam policies
> within the last five years. None of them appear anywhere on siligurievent.com.
> Period.

### I.1 Hidden text / `display:none` keyword padding

- **What it is**: stuffing keywords into elements with `display:none`,
  `visibility:hidden`, `font-size:0`, `color:transparent`, `text-indent:-9999px`,
  `position:absolute;left:-9999px`, or any other technique that makes text
  invisible to humans but available to crawlers.
- **What happens**: Google's spam policy explicitly names this. Manual action
  → deindexing within weeks of detection.
- **Our standard**: every word in the rendered HTML must be visible to a sighted
  user with default settings, OR be valid accessibility-only content (`sr-only`
  for screen reader users) **AND** be semantically identical to what sighted
  users see (i.e. translating an icon to its label, not stuffing keywords).

### I.2 Cloaking

- **What it is**: serving different HTML to Googlebot vs to real users (UA-based
  switch, IP-based switch, JS render-time swap that hides content from humans).
- **What happens**: outright ban from Google's index.
- **Our standard**: identical SSR for every user-agent. The `/api/og` route
  generates the same image regardless of caller. No `User-Agent` branching
  anywhere in the codebase.

### I.3 Doorway pages

- **What it is**: hundreds of near-identical location pages produced from a
  template with only the city name swapped — no unique local content. This is
  the trap most "programmatic SEO" agencies fall into.
- **What happens**: algorithmic penalty (HCU/Panda-style) → traffic collapse,
  hard to recover from without manual content rewrites.
- **Our standard**: every `/decorators/[loc]/[svc]` page is gated by
  `lib/seo/programmatic-content.ts` to compose a **≥600-word body** from FIVE
  modular sections, each drawing **different data shards** (location intro,
  service philosophy, location-specific venues, location-specific cultural
  context, location-specific FAQ). Section J of this document codifies the
  composition rules. Pages with insufficient unique content get `noindex` per
  `docs/07b-SEO-IMPL.md §10`.

### I.4 PBN backlinks

- **What it is**: private blog networks — paying for backlinks from a network of
  thin, low-quality sites the network owner controls.
- **What happens**: manual action explicitly named in Google's spam policy.
- **Our standard**: we earn links from real venues, real magazines, real
  vendors. Outreach playbook in §K below. **We never pay for a backlink.**

### I.5 Reciprocal-link rings

- **What it is**: "I'll link to you if you link to me" structured exchanges
  with no editorial value.
- **What happens**: manual action if the volume is high or the pattern is
  obvious (footer link-swaps are textbook flagging).
- **Our standard**: vendor partnerships (photographers, MUAs, caterers) link
  to relevant case studies, not to a generic homepage anchor. Each link must
  pass the editorial test: "would I want this link if Google didn't exist?"
  Vendor reciprocity is fine; mechanical reciprocity is not.

### I.6 Reused content with find-and-replace

- **What it is**: writing one location page and producing the other six by
  swapping the city name. Near-duplicate content.
- **What happens**: near-duplicate penalty / canonicalisation loss. Google
  picks one URL as canonical and silently drops the others from the index.
- **Our standard**: see §J. Programmatic pages compose body copy from
  per-location data shards (nearby venues, climate, cultural specifics,
  service-specific design philosophy). Find-and-replace is structurally
  impossible because the inputs differ.

### I.7 Hidden footer of keyword tags

- **What it is**: a "Tags" or "Cities Served" footer with 200 keywords linked
  to the same page — typically tiny font, low contrast, no editorial purpose.
- **What happens**: keyword stuffing manual action.
- **Our standard**: footer links to the 7 location pages and the 6 most-trafficked
  services — descriptive anchor text, full-size readable type, no keyword runs.

### I.8 Fake reviews / `AggregateRating` without real reviews

- **What it is**: emitting `AggregateRating` schema with fabricated rating /
  review count, OR with internal-only reviews (testimonial form, not Google
  reviews).
- **What happens**: structured-data manual action → rich result loss site-wide
  (not just on the offending page).
- **Our standard**: `buildAggregateRatingPlaceholder` in `lib/seo/schemas.ts`
  is intentionally a placeholder. We emit `AggregateRating` **only** once we
  have ≥5 verifiable Google Business Profile reviews and the schema points to
  the GBP listing as the review source.

### I.9 Misleading title / meta swap

- **What it is**: title tag promises "₹49,999 packages" but the page has no
  pricing; or title tag promises "1000+ projects" but the portfolio shows 12.
- **What happens**: deceptive content policy manual action.
- **Our standard**: title and description make claims we can support on the
  page. The bullet on D-002 ("honest pricing bands, custom quotes from there")
  is exactly what every pricing-related title says.

### I.10 AI-generated bulk content without review

- **What it is**: dumping 200 AI-written blog posts to flood the index.
- **What happens**: Helpful Content Update (now part of core ranking) penalises
  the whole domain. Recovery requires removing or rewriting the bulk content.
- **Our standard**: every blog post is editorially planned, drafted (AI
  acceptable as a research/draft tool), and **reviewed + augmented with
  first-hand owner experience** before publish. Owner adds at least one
  on-the-ground observation (venue note, climate note, real budget anchor)
  per post that an AI couldn't generate.

### I.11 Buying expired domains for link equity

- **What it is**: buying an expired domain that previously held real backlinks,
  301-redirecting it to siligurievent.com.
- **What happens**: this technique is on Google's actively-policed list. When
  detected, the entire backlink graph is discounted.
- **Our standard**: we don't do this.

### I.12 Cloaked sitemap submissions

- **What it is**: submitting URLs to Google Search Console that don't actually
  exist or that 301 to unrelated content.
- **What happens**: search console warnings, eventually manual action.
- **Our standard**: `next-sitemap` + `app/sitemap.ts` generate sitemap from
  real route data only. Every URL submitted must return 200 and serve the
  content the sitemap implies.

### I.13 Anchor-text stuffing in internal links

- **What it is**: every internal link to `/services/wedding` uses the exact
  anchor "wedding decorator in siliguri".
- **What happens**: over-optimisation algorithmic dampening.
- **Our standard**: internal anchors vary naturally — "our wedding decoration
  work", "see our wedding portfolio", "plan your wedding", "wedding service
  details" — distributed across the site.

---

## J. Programmatic page content composition rules

Every `/decorators/[loc]/[svc]` page MUST satisfy ALL of these rules to enter
`generateStaticParams`. The rules are enforced in code by
`lib/seo/programmatic-content.ts` — the function will throw at build time if a
combination's composed output falls below the floor.

### J.1 Body word count floor

- **≥600 words** of unique, human-readable copy in the body.
- Word count is measured **after** stripping JSON-LD, nav, footer, and any
  copy that appears in another `/decorators/*/*` page.
- If a combination would compose <600 words (e.g. very thin location data),
  the page is gated and the slug is excluded from `generateStaticParams`.

### J.2 Required content sections (in order)

| Section | Source data | Min words |
|---|---|---|
| 1. Location-specific intro paragraph | `location.introCopy[0]` + service slug | 80 |
| 2. Service design philosophy paragraph | `service.longDescription` | 80 |
| 3. Three nearby venue mentions | `location.venues[0..2]` (name, area, type) | 100 |
| 4. One local cultural specific | per-location data shard | 80 |
| 5. Mini FAQ (3 entries) | `service.faqs[0..2]` adapted to loc | 200 |
| 6. Internal-link suggestions (≥2) | sibling-combo router | (link copy ~30) |

Total floor: ~570 words from sections + hero + closing CTA copy → **~620–700**.

### J.3 Per-location cultural shards (the anti-duplicate lever)

This is the most important defence against doorway-page penalty. Each location
gets ONE locally-true cultural specific that no other location page repeats:

| Location | Cultural shard (rotates per service for further uniqueness) |
|---|---|
| Siliguri | Sevoke Road banquet logistics; Bengali ashirbaad traditions among long-resident families; Marwari wedding cadence in the Hill Cart Road business community |
| Bagdogra | Airport-arrival logistics (flight gaps, baraat from arrivals); North Indian families flying in for destination weddings |
| Darjeeling | Tea estate wedding scale limits (40–120 guests typical); altitude planning for floral wilt; Kanchenjunga sight-lines |
| Kalimpong | Local orchid + gerbera growers; Marwari & Nepali wedding mix; gentler weather windows than Darjeeling |
| Jalpaiguri | Bengali ashirbaad protocols; ornate alpana detailing; community ground logistics |
| Gangtok | Sikkimese hospitality, prayer-flag palette, monastery aesthetics, Nepali / Tibetan-Buddhist ritual decor |
| Dooars | Tea estate + forest reserve permits; generator and night lighting; rain contingency |

Each shard expands to 2–3 paragraphs of locally-truthful copy. The shards are
embodied as typed `LOCATION_CULTURAL_CONTEXT` in
`lib/seo/programmatic-content.ts`.

### J.4 Schema injection

Every programmatic page emits:

- `LocalBusiness` with `areaServed` = the location (single City, not the
  default 7-city list).
- `Service` with `serviceType` = the service, `areaServed` = the location.
- `Place` for the location.
- `BreadcrumbList`: Home → Decorators → {Location} → {Service}.
- `FAQPage` for the 3 location-tuned FAQs.

### J.5 IndexNow ping

On publish (and on the daily revalidate hook once Sprint 2 lands the CMS),
the page URL is submitted via `submitToIndexNow(urls)` (see
`lib/seo/indexnow.ts`). Pings are batched per build.

### J.6 6-month refresh schedule

Programmatic pages get refreshed every 6 months:

1. Update one paragraph with a recent project mention if available.
2. Re-check the venue list against `lib/cms/locations.ts` for changes
   (closed venues, renamed venues).
3. Add one new FAQ from real owner-received questions.
4. Bump `dateModified` in schema; IndexNow re-ping.

### J.7 Gating in build pipeline

Pseudocode of the gate (real implementation in `lib/seo/programmatic-content.ts`):

```ts
function shouldGenerateProgrammatic(loc, svc): boolean {
  const content = buildProgrammaticPageContent(loc, svc);
  if (content.wordCount < 600) return false;
  if (!content.location.venues.length) return false;
  if (!content.localCulturalShard) return false;
  return true;
}
```

---

## K. Backlink strategy (real links only)

### K.1 Vendor reciprocity — Siliguri photographer & vendor outreach list

> These are typical vendor categories in Siliguri. **Owner verifies real
> business names** before outreach. Do not contact a vendor if the owner
> hasn't worked with them or doesn't have an introduction. The first wave is
> always vendors who have already collaborated.

| # | Vendor type | Outreach pitch angle |
|---|---|---|
| 1 | Wedding photographer | "Feature article on your work in our journal — we'll cross-link to your portfolio." Photo credit on every case study. |
| 2 | Cinematographer / wedding film | Cross-credit on every case study. Embedded video on portfolio cases. |
| 3 | Bridal makeup artist (MUA) | Bridal portrait styling collab on a styled shoot. |
| 4 | Mehendi artist | Tag on every mehendi gallery image; link in case study. |
| 5 | Caterer | "Tasting evening" partnership — we provide the styling, they handle the food, both link to a joint case study. |
| 6 | DJ / sound | Tech rider partnership. Credit on every sangeet case. |
| 7 | Bridal couture (boutique) | "Look book" collab — they style the bride, we style the room. |
| 8 | Jeweller (bridal) | Cross-feature for ring-exchange ceremony. |
| 9 | Bartender / mixologist | Cocktail party partnership. |
| 10 | Floral wholesaler | Vendor profile + behind-the-scenes article. |
| 11 | Lighting rental house | Equipment-of-the-month feature with credit. |
| 12 | Mandap fabricator | Behind-the-scenes article on a specific build. |

**Outreach mechanics**:

1. Owner introduces themselves (not a generic email).
2. Pitch a specific piece of content the vendor will be in.
3. Editorial value first; link request second (and natural).
4. Track every outreach in a Notion / Sheets log.

### K.2 Magazine outreach

| Publication | Pitch angle |
|---|---|
| Wedding Affair | "Tea garden weddings in Darjeeling — the production reality" — first-person essay from the owner. Photos exclusive to publication. |
| WeddingSutra | Submit case studies for the "Real Weddings" section. Each accepted feature is a do-follow link with rich photo coverage. |
| ShaadiSaga | Submit "Vendor spotlight" pitch. Free editorial; quality assets are the price of admission. |
| BridesEssentials India | Trends piece: "What's new in North Bengal wedding decor — Spring 2026". |
| Vogue Weddings | Long shot, but pitch the most editorial of our case studies as a "Studio to watch" feature. |
| WedMeGood blog | Practical guide pieces ("How much does a tea garden wedding cost"). |
| Hitched.in | Vendor profile + case-study submissions. |

**Pitch hygiene**:

- Subject line names the publication's audience (not "Hi" or "Re: collab").
- Body: one paragraph who we are, one paragraph the proposed angle, one
  paragraph what we'll deliver (word count, photo count, exclusivity).
- Send to the editor by name from the masthead, never `info@`.

### K.3 Local press

| Outlet | Story angle |
|---|---|
| The Telegraph (North Bengal edition) | "How Siliguri became a destination-wedding hub" — feature piece. We're a source, not the subject. |
| The Statesman | "Pandal designers turn modernists" — Durga Puja feature pitched in August. |
| Uttarbanga Sambad | Bengali-language vernacular reach — pitch a "Bengali wedding traditions revived" angle. |
| Hindustan Times (Siliguri edition) | Business profile if/when we cross a milestone. |
| Local lifestyle blogs | Direct outreach with a "vendor of the month" pitch. |

### K.4 Where we do NOT pursue links

- Anonymous "guest post" services
- Comment-link spam
- Forum signature links
- Bookmarking sites
- Anything we'd be embarrassed to defend to a journalist

---

## L. GBP saturation playbook

### L.1 Categories

- **Primary**: Wedding planner.
- **Secondary** (≤5):
  - Event planner
  - Florist
  - Wedding decorator (if available as a Google category in IN)
  - Lighting designer
  - Party equipment rental service

**Do not** claim categories we don't truly offer (catering equipment, catering
service, etc.) — Google audits this and a wrong category triggers suspension.

### L.2 Photos — 30+ at launch, weekly cadence after

Launch upload checklist:

- 1 logo (square, transparent background)
- 1 cover photo (wide landscape, our hero project)
- 3 interior — studio / workshop
- 3 exterior — building entrance, signboard
- 8 work samples — diverse ceremonies + diverse locations
- 5 team photos
- 5 in-progress / behind-the-scenes
- 4 happy-couple photos (with their permission, never use stock)

Weekly cadence: 1 new photo from the most recent week's work.

### L.3 Posts — weekly with project highlights

Format: 1 hero image + 1 paragraph + 1 CTA button.

```
Post types (rotated):
1. Project highlight (Mon)
2. Behind-the-scenes (Wed)
3. Festival / seasonal (Fri)
```

Each post links to a specific `/portfolio/[slug]` page, not the homepage.

### L.4 Reviews — workflow

- Take-home card with QR linking to the GBP review URL — one per couple, one
  per family.
- Ask in person at the event close, not by email.
- Respond to every review (positive and negative) within 24 hours.
- **Never** offer incentives for reviews — explicit Google policy violation
  and trivial to detect at scale.

Target review velocity: **2–4 per month** at launch ramping to **6–8 per
month** by month 6.

### L.5 Service areas

Claim all 7 location slugs as service areas: Siliguri, Bagdogra, Darjeeling,
Kalimpong, Jalpaiguri, Gangtok, Dooars. Plus secondary cluster: Sevoke,
Salugara, Pradhan Nagar, Matigara, Naxalbari (within Siliguri reach).

### L.6 Q&A pre-seed

Owner authors 8 FAQs in the Q&A section before launch:

1. What price band do you work in?
2. How far in advance should I book?
3. Do you travel outside Siliguri?
4. Do you work with the venue's in-house team?
5. What languages do you speak?
6. How many events do you take per month?
7. Can you handle just decor, or do you plan full events?
8. Do you offer a tasting / mood board before booking?

Each answer is 80–120 words, with a specific factual detail.

---

## M. Tracking & reporting

### M.1 Weekly cadence

- **GSC export** — top 50 movers (up & down). 30 min review.
- **Indexing status** — any new pages not yet indexed → submit via URL
  Inspection.
- **Manual actions** — check; alert on red.
- **Mobile usability** — fix immediately.

### M.2 Monthly cadence

- **Competitor SERP snapshot** — top 50 keywords. Track rank deltas in
  `Competitors — Monthly Tracker` sheet.
- **Top 20 pages refresh** — metadata polish, internal-link adds, content
  depth additions.
- **GBP review velocity** — review count vs. target.
- **Backlink audit** — what landed in the last 30 days. Disavow any obvious
  spam acquisitions (uncommon but possible).

### M.3 Quarterly cadence

- **Top-20 traffic pages content refresh** — substantive updates (new project
  embedded, new FAQ, expanded body copy).
- **Schema validation** — Rich Results Test on every template (`Service`,
  `LocalBusiness`, `FAQPage`, `BreadcrumbList`, `Place`, `BlogPosting`).
- **CWV check** — Lighthouse mobile p75 for the top 20 pages.
- **Hreflang validation** — confirm en-IN / hi-IN pairing is intact across the
  sitemap.

### M.4 Annual cadence

- **Full content audit** — every page rated `keep / refresh / merge / retire`.
- **Domain authority benchmark** — record current state, compare to launch.
- **Recompute the keyword universe** — re-run §A.2 matrix with one year of
  GSC data informing the modifiers.

---

## N. Final note to the owner — why this approach wins

The reason competitors like Dreamcreation rank today is, in order:

1. **Domain age** (years of compounding trust).
2. **Content depth** (more pages on more queries).
3. **Google Business Profile signal** (reviews, photos, posts).
4. **Local citations** (consistent NAP across JustDial, Sulekha, WedMeGood).

There is **no SEO trickery** in their advantage. There is just *coverage,
trust, and time*.

Our advantage path is:

1. **Coverage**: 133 programmatic pages + 19 service pages + 6 location pages +
   blog cluster (~50 posts in year one) = ~200+ indexable pages from launch
   versus their ~40.
2. **Depth**: every page composes from real data and real local context, not
   templates.
3. **Schema density**: `LocalBusiness`, `Service`, `Place`, `FAQPage`,
   `BreadcrumbList`, `BlogPosting`, `CreativeWork` everywhere relevant.
4. **Speed**: Next.js 16 with Cache Components, Vercel edge, < 2.5s LCP mobile
   p75 versus their typical 4–8s.
5. **Bilingual**: `/hi/*` mirror — a second SERP pool they're not in.
6. **GBP saturation**: 30+ photos at launch, weekly posts, deliberate review
   workflow → match their review count within 12 months.
7. **Real backlinks**: vendor reciprocity, magazine features, local press.

**Time-to-#1 estimate for "wedding decorator in siliguri"**: 9–18 months of
disciplined execution. The competitors' advantage isn't infinite; it's just
years of compounding signal we don't have yet. Every page we ship, every
review we earn, every link we land closes the gap.

What we never do — and never let a contractor convince us to do — is anything
in §I. The penalty risk on any one of those tactics permanently caps the
domain's ceiling. The clean path is slower for the first six months and
**dramatically faster** thereafter.
