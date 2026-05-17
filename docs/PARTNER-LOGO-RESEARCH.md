# Partner Logo Research — Siligurievent Trusted Partners Strip

_Last updated: 2026-05-16 · Owner: Siligurievent founder · Maintainer: web team_

> **Verification note for the owner.** This document was prepared from public knowledge of the North Bengal hospitality market. **Before any outreach goes out, the owner (or an assistant) must re-verify each row by opening the official website and copy-pasting the venue name as it brands itself today**, plus the current contact email. Hotel brands rebrand, rename and change ownership frequently in this region (e.g. Sinclairs, Cygnett, Welcomhotel transitions). Treat the "Website" column below as the starting URL, not as a confirmed live URL. Where re-verification fails, strike the row and remove it from the `partners.ts` shortlist before launch.

---

## A. Legal and licensing — read this first

**1. Third-party logos are trademarks, not free assets.** Every venue logo in this document is the registered or common-law trademark of its respective owner. Trademark law in India (the Trade Marks Act, 1999), supplemented by passing-off doctrine and the Copyright Act, 1957 (which covers the logo's stylised artwork), means a logo cannot be reproduced on a commercial third-party site without permission, even when the reproduction is small and respectful. The fact that a logo is publicly visible on a venue's own marketing materials does **not** confer a licence to redistribute it.

**2. Use without permission produces real-world consequences.** The most common outcomes are: (a) a cease-and-desist letter from the venue's brand or legal team — typically the first step, almost always granted on demand; (b) a takedown notice escalated to the hosting provider or, on Instagram/Facebook, to Meta's IP team — these are processed quickly and can remove pages without notice; (c) reputational damage — venues talk to each other in this market, and being known as the decorator who lifted logos is a serious problem; (d) in rare but escalating cases, a suit for passing-off or trademark infringement under §29 of the Trade Marks Act, with damages and an injunction. The cost-to-benefit ratio of "just adding the logo" is therefore deeply unfavourable.

**3. The legitimate paths.** There are exactly three: **(i) Formal partnership agreement** — a short written MOU signed by both parties granting Siligurievent the right to display the venue's logo on a defined surface (website, brochure, social) in return for reciprocal listing or a referral arrangement; **(ii) Vendor-listing permission** — the venue adds Siligurievent to its in-house preferred-vendor or recommended-decorator list, and as part of that arrangement the venue grants logo-use permission via email confirmation; **(iii) "Venues we've worked at" with written consent** — the venue confirms in writing (email is enough) that we may reference the venue by name and logo for the specific past project, framed as portfolio rather than partnership. All three should be filed by the owner in a single folder (`/legal/partner-permissions/`) with the email proof attached.

**4. Until consent is secured, the site renders typeset placeholder wordmarks.** The `<TrustedPartners />` component is designed so each "slot" renders an editorial wordmark in our own Cormorant Garamond italic — visually intentional, not a stock SVG and not a stolen logo. The component checks `partner.logoUrl`; while that field is `undefined`, the wordmark renders. The moment the owner has a signed permission, the licensed logo asset is dropped into `public/images/partners/`, the `logoUrl` is added to the partner row in `lib/cms/partners.ts` (or later, Payload), and the component swaps to `<Image>` automatically. **No legal risk is incurred while the field remains undefined.**

---

## B. Outreach template (cut-and-paste)

> Send from `hello@siligurievent.com` or directly from the founder's address. Personalise the first paragraph for each venue (mention a specific room, lawn or recent feature you genuinely admire). Volume sending kills response rate — keep it to 3–4 a day, in batches.

**Subject:** Partnership enquiry — Siligurievent ↔ {{Venue Name}}

> Dear {{First Name}} / Marketing team at {{Venue Name}},
>
> I'm {{Founder Name}}, founder of **Siligurievent** (siligurievent.com), an event decoration studio in Siliguri. We design and stage weddings, sangeets, receptions, haldis, annaprashans and private celebrations across North Bengal, Sikkim and the Dooars — roughly thirty events a year, deliberately small, with a film-set standard of finish.
>
> {{Personalised line: "We last staged a Bengali wedding at your Mallaguri property in February — your banquet team were exceptional." or, for venues we haven't yet worked at: "Your lawn at {{property}} is one of the most cinematic spaces in the region — we'd love to bring an event there."}}
>
> I'm writing to ask three quick things:
>
> 1. **May we display the {{Venue Name}} logo** in a "Venues we partner with" strip on siligurievent.com? The strip carries 10–12 venues and is presented as a sign of shared standard rather than an exclusive arrangement. Happy to share a mock-up before anything goes live.
> 2. **Would {{Venue Name}} consider listing Siligurievent** as a preferred decorator on your in-house vendor list / weddings page / banquet enquiry sheet? We sign vendor agreements, carry our own crew insurance, and complete teardown to your team's specification.
> 3. **Are you open to a referral arrangement** — a small commission or reciprocal referral for confirmed bookings each of us sends the other's way? Standard market terms apply; we're happy to use yours.
>
> I'm in Siliguri most weeks and would welcome a 20-minute meeting at your property at any time that suits you. If a quick email reply is easier, even a "yes / not now / no" on each of the three questions is enormously helpful.
>
> Warm regards,
> {{Founder Name}}
> Founder, Siligurievent
> {{Phone}} · siligurievent.com · @siligurievent

**Follow-up cadence**: Day 0 send. Day 5 nudge ("just bumping this in case it was missed"). Day 14 final ("happy to close the file if not a fit at present — please keep us in mind").

---

## C. Researched venue table

> **Reading this table.** "Public branding" means the venue is a publicly known operating property in the North Bengal / Sikkim hospitality market and the URL column shows the canonical-looking domain to start verification from. **Every row needs a 60-second click-through by the owner before outreach.** Where the owner finds a venue has closed, rebranded or moved, mark the row STRUCK in this file and remove it from `lib/cms/partners.ts`.
>
> **Tier definitions.** _Luxury_ = recognised five-star or premium boutique with a strong national/international booking footprint. _Premium_ = strong four-star or upper-mid boutique, regionally recognised. _Boutique_ = small, design-led, often family-run. _Heritage_ = property with named historical lineage, regardless of star rating.

### Siliguri (primary catchment — 0–15 km from studio)

| Official Name (re-verify) | Location | Tier | Website (starting point) | Instagram (likely) | Contact path | One-line descriptor | Verified |
|---|---|---|---|---|---|---|---|
| Mayfair Tea Resort, Siliguri | Salugara, Siliguri | Luxury | `mayfairhotels.com/mayfair-tea-resort-siliguri` | `@mayfairhotels` | Site contact form / banquet enquiry | Tea-garden resort within the city — large lawns, signature wedding venue | Public branding, owner to re-verify |
| Sinclairs Siliguri | Mallaguri, Siliguri | Premium | `sinclairshotels.com` | `@sinclairshotels` | Banquet enquiry form / `siliguri@sinclairshotels.com` (verify) | Premium business hotel with banquet and poolside reception | Public branding, owner to re-verify |
| Lemon Tree Hotel, Siliguri | Sevoke Road, Siliguri | Premium | `lemontreehotels.com` (Siliguri property page) | `@lemontreehotels` | Site enquiry form | Reliable contemporary banquet venue near the Sevoke Road catchment | Public branding, owner to re-verify |
| Summit Hermon Hotel & Spa | Sevoke Road, Siliguri | Premium | `summithotels.in` (Hermon property) | `@summithotels` | Site enquiry form | Spa-led property with mid-size banquet hall | Public branding, owner to re-verify |
| Cygnett Park Asia | Sevoke Road area, Siliguri | Premium | `cygnetthotels.com` (Park Asia property) | `@cygnetthotels` | Banquet form | Business-and-banquet property in the Cygnett mid-tier | Public branding, owner to re-verify |
| Bhramari Resort | NH-31, Salugara, Siliguri | Boutique | direct search — verify current URL | venue-specific | Direct phone / WhatsApp | Boutique resort with outdoor settings — strong for haldi and mehendi | Public branding, owner to re-verify |
| Royal Sarovar Portico | Sevoke Road, Siliguri | Premium | `sarovarhotels.com` (Royal Sarovar Portico Siliguri page) | `@sarovarhotels` | Site enquiry form | Banquet-led property in the Sarovar group | Public branding, owner to re-verify |
| Saluja Residency | Hill Cart Road, Siliguri | Boutique | direct search — verify current URL | venue-specific | Direct phone | Long-standing local banquet, family-run | Public branding, owner to re-verify |

### Bagdogra and Matigara

| Official Name | Location | Tier | Website | Instagram | Contact | Descriptor | Verified |
|---|---|---|---|---|---|---|---|
| The Sonar Bangla Resort | Matigara, near Bagdogra | Premium | `sonarbanglaresorts.com` (verify) | `@sonarbangla` | Site form | Large-lawn resort, popular for 400+ guest weddings | Public branding, owner to re-verify |
| Cygnett Resort Mountain Breeze | Bagdogra | Premium | `cygnetthotels.com` | `@cygnetthotels` | Banquet form | Resort property close to the airport, pool-deck reception | Public branding, owner to re-verify |

### Darjeeling

| Official Name | Location | Tier | Website | Instagram | Contact | Descriptor | Verified |
|---|---|---|---|---|---|---|---|
| Mayfair Darjeeling | The Mall, Darjeeling | Luxury/Heritage | `mayfairhotels.com/mayfair-darjeeling` | `@mayfairhotels` | Site contact form | Heritage hill-station property with central Mall location | Public branding, owner to re-verify |
| Glenburn Tea Estate | Glenburn, Darjeeling district | Luxury/Heritage | `glenburnteaestate.com` | `@glenburnteaestate` | `reservations@glenburnteaestate.com` (verify) | Boutique tea-estate bungalow, internationally recognised | Public branding, owner to re-verify |
| Windamere Hotel | Observatory Hill, Darjeeling | Heritage | `windamerehotel.com` (verify) | venue-specific | Reservations form | Colonial-era heritage hotel, Observatory Hill | Public branding, owner to re-verify |
| New Elgin | HD Lama Road, Darjeeling | Heritage | `elginhotels.com` (New Elgin property) | `@elginhotels` | Site form | Heritage property in the Elgin group | Public branding, owner to re-verify |
| The Elgin Mount Pandim | Pelling area (Sikkim) — verify | Heritage | `elginhotels.com` | `@elginhotels` | Site form | Heritage property in the Elgin group (Sikkim border) | Public branding, owner to re-verify |
| Cedar Inn | Jalapahar Road, Darjeeling | Boutique | direct search | venue-specific | Reservations form | Boutique heritage-style inn with views | Public branding, owner to re-verify |
| Sterling Darjeeling | various Darjeeling locations | Premium | `sterlingholidays.com` | `@sterlingholidays` | Site form | Banquet-capable property in the Sterling group | Public branding, owner to re-verify |
| Mayfair Hill Resort, Darjeeling | Darjeeling | Luxury | `mayfairhotels.com` | `@mayfairhotels` | Site form | Sister property of Mayfair Darjeeling, hill resort format | Public branding, owner to re-verify |
| Cochrane Place | Kurseong (Darjeeling district) | Heritage/Boutique | `cochraneplace.com` (verify) | venue-specific | Reservations form | Heritage boutique in Kurseong, tea-country setting | Public branding, owner to re-verify |

### Kalimpong

| Official Name | Location | Tier | Website | Instagram | Contact | Descriptor | Verified |
|---|---|---|---|---|---|---|---|
| Sinclairs Retreat Kalimpong | Upper Cart Road, Kalimpong | Premium | `sinclairshotels.com` | `@sinclairshotels` | Site form | Wide-lawn retreat, popular for full-day weddings | Public branding, owner to re-verify |
| Mayfair Himalayan Spa Resort | Kalimpong | Luxury | `mayfairhotels.com` | `@mayfairhotels` | Site form | Spa-led mountain resort | Public branding, owner to re-verify |
| The Silk Route Retreat | Pedong/Kalimpong corridor — verify | Boutique | direct search | venue-specific | Reservations form | Boutique stay on the historic Silk Route | Public branding, owner to re-verify |
| Holumba Haven | Upper Cart Road, Kalimpong | Boutique | `holumba.com` (verify) | venue-specific | Reservations form | Family-run orchid garden cottages, intimate ceremonies | Public branding, owner to re-verify |

### Jalpaiguri and the Dooars

| Official Name | Location | Tier | Website | Instagram | Contact | Descriptor | Verified |
|---|---|---|---|---|---|---|---|
| Cygnett Resort Mainak | Jalpaiguri | Premium | `cygnetthotels.com` | `@cygnetthotels` | Banquet form | Resort with banquet hall and lawn | Public branding, owner to re-verify |
| Sinclairs Retreat Dooars | Chalsa, Dooars | Premium | `sinclairshotels.com` | `@sinclairshotels` | Site form | Forest-edge retreat in the Dooars belt | Public branding, owner to re-verify |
| Hollong Tourist Lodge | Jaldapara National Park | Heritage (WBTDC) | `wbtdcl.com` (West Bengal Tourism) | n/a — govt | Phone reservation | Forest-edge state-run lodge, intimate haldi/mehendi venue | Public branding, owner to re-verify |
| Aranya Jungle Resort | Lataguri, Dooars | Premium | direct search | venue-specific | Reservations form | Jungle-adjacent resort with conference and event spaces | Public branding, owner to re-verify |
| Tigers Eye Resort | Murti, Dooars | Boutique | direct search | venue-specific | Reservations form | Riverside resort, boutique destination-style weddings | Public branding, owner to re-verify |
| Suntalekhola Tourist Lodge | Suntalekhola, Dooars | Heritage (WBTDC) | `wbtdcl.com` | n/a — govt | Phone reservation | State-run forest lodge, very small-format events only | Public branding, owner to re-verify |

### Gangtok (Sikkim)

| Official Name | Location | Tier | Website | Instagram | Contact | Descriptor | Verified |
|---|---|---|---|---|---|---|---|
| Mayfair Spa Resort & Casino, Gangtok | Ranipool, Gangtok | Luxury | `mayfairhotels.com/mayfair-spa-resort-gangtok` | `@mayfairhotels` | Site contact form | Luxury spa resort, largest indoor banquet for monsoon dates | Public branding, owner to re-verify |
| The Elgin Nor-Khill | Gangtok | Heritage | `elginhotels.com` | `@elginhotels` | Site form | Heritage royal-house property, intimate weddings | Public branding, owner to re-verify |
| The Royal Plaza | Tibet Road, Gangtok | Premium | `theroyalplaza.com` (verify) | venue-specific | Site form | Central premium hotel, banquet capability | Public branding, owner to re-verify |
| Summit Denzong Hotel & Spa | Gangtok | Premium | `summithotels.in` | `@summithotels` | Site form | Spa-led premium property in the Summit group | Public branding, owner to re-verify |
| Hidden Forest Retreat | Sichey, Gangtok | Boutique | direct search | venue-specific | Reservations form | Boutique nursery-and-stay, niche intimate ceremonies | Public branding, owner to re-verify |
| Hotel Sonam Delek | Gangtok | Boutique | direct search | venue-specific | Reservations form | Long-standing mid-range Gangtok hotel | Public branding, owner to re-verify |

### Could not verify within research window (skip unless owner confirms)

- **Vivanta by Taj Siliguri** — could not confirm a Vivanta-branded property currently operating in Siliguri. The Taj group's North Bengal footprint should be re-verified at `tajhotels.com` before listing.
- **Welcomhotel Tashi Taj, Gangtok** — could not confirm this exact branding. Welcomhotel is the ITC brand; verify the precise Gangtok property name at `itchotels.com`.
- **"Crown Hotel Gangtok", "Cinnamon Hotel Bagdogra", "Tabu Inn", "Sandhya Resorts", "Hotel Yashoda International", "Saramsa Resort"** — recognisable local names but each needs the owner to confirm current operation, current ownership, and current branded name before any logo use is proposed.
- **"Sinclairs Retreat Ooty" reference in Kalimpong line of the brief** — Ooty is in Tamil Nadu; this is almost certainly a brief-typo. We have listed **Sinclairs Retreat Kalimpong** instead.
- **"Mount Magnolia, Darjeeling"** — could not confirm under that exact name as a current operating brand; possibly conflated with another Darjeeling property. Skipped.
- **"Hollong Eco Village"** — possibly a local/recent property; could not confirm.

### Investigation: "Rupang Villages"

The owner's note **"Rupang Villages"** does not match any well-known venue brand we can confirm in the North Bengal–Sikkim hospitality circuit. The most likely candidates worth checking are:

1. **Rupang Valley** — a phrase used for stays in the East Sikkim / Pakyong direction (Rupang is referenced in some travel itineraries near Pakyong / Aritar / Zuluk circuit). There may be a small home-stay-style property the owner has visited; this needs direct re-confirmation with the owner.
2. **Rolep Adventure Camp / Rolep Valley** — phonetically similar; sometimes mis-transcribed as Rupang in spoken handover. Located on the East Sikkim Rolep River.
3. **Local home-stay collective** — Rupang may be the home-stay-cluster name in a specific Sikkim village rather than a single hotel brand.

**Recommended action**: Ask the owner directly which property they meant. Until confirmed, this name is **not** on the launch shortlist.

---

## D. Recommended launch shortlist (top 12 to approach first)

Ranking criteria, in order: **(1) brand cachet** — recognised by national wedding-publication readers, instantly conveys "high standard"; **(2) geographic fit** — Siliguri primary, Bagdogra/Darjeeling/Gangtok secondary, Dooars tertiary; **(3) wedding-friendliness** — has a banquet hall, lawn or destination-wedding programme already; **(4) likelihood of agreeing** — based on whether the venue has an established preferred-vendor model and an accessible marketing team.

| Rank | Venue | Why this one first |
|---|---|---|
| 1 | **Mayfair Tea Resort, Siliguri** | Highest cachet local property, in our home city, runs an active wedding-and-banquet programme — best single anchor for the strip. |
| 2 | **Sinclairs Siliguri** | Established Siliguri premium hotel, has hosted many local weddings, brand recognition is high. |
| 3 | **Mayfair Darjeeling** | Sister property to (1) — approaching the Mayfair group through Siliguri and asking for Darjeeling listing in the same email is efficient. |
| 4 | **Glenburn Tea Estate** | Internationally recognised tea-estate brand — instant credibility, signals destination-wedding capability. |
| 5 | **Mayfair Spa Resort & Casino, Gangtok** | Largest banquet in Gangtok, third Mayfair listing strengthens the page — group-level conversation rather than three separate ones. |
| 6 | **Lemon Tree Hotel, Siliguri** | National brand, strong Siliguri presence, marketing team is reachable and quick to reply (corporate process). |
| 7 | **Summit Hermon Hotel & Spa, Siliguri** | Locally well-known; spa-led brand signals premium without competing on the same axis as Mayfair. |
| 8 | **Sinclairs Retreat Kalimpong** | Same group as (2) — group-level conversation again; adds Kalimpong coverage. |
| 9 | **The Elgin Nor-Khill, Gangtok** | Heritage royal property — adds heritage tier to the strip alongside Mayfair luxury and Glenburn tea-estate. |
| 10 | **Cygnett Park Asia, Siliguri** | National mid-premium brand, accessible marketing team, completes the Siliguri stack. |
| 11 | **Sinclairs Retreat Dooars** | Adds Dooars/forest tier to the strip; same group as (2) and (8). |
| 12 | **The Royal Plaza, Gangtok** | Adds a second Gangtok property of a different tier, central location, well-known to Sikkim brides. |

**Why this 12 makes a strong strip**: three Mayfair properties + three Sinclairs properties = six logos won via two group conversations. The remaining six are independents distributed across geography (Siliguri, Darjeeling, Gangtok, Dooars). The strip reads as "we work with the top venues across the entire region" without leaning on any single brand.

---

## E. Risk register

### Trademark infringement risk

- **Rendering a third-party logo without written permission** is the single biggest legal risk for the project. The mitigation is structural: the `<TrustedPartners />` component will only render a logo image when `partner.logoUrl` is supplied. While that field is `undefined`, a typeset wordmark in our own house typography is rendered — this is editorial use of the venue's name (factual, descriptive) rather than reproduction of its trademark. Indian fair-use jurisprudence treats nominative reference to a third-party brand by name as low-risk; reproduction of the logo artwork is high-risk. The component is built to keep us on the low-risk side until a permission email lands.
- **Process control**: do not allow direct uploads to `public/images/partners/` without a corresponding entry in `/legal/partner-permissions/{venue-slug}.eml` (or `.pdf` of the signed MOU). Add this as a pre-commit reminder in `CLAUDE.md` once outreach begins.

### Reputational risk if a listed partner has a recent negative news event

- Once a venue is listed on our site as a partner, the public reads that as endorsement. If the venue makes the news for the wrong reasons (a service incident, a sanitation issue, an industrial dispute, an ownership dispute), Siligurievent's "Trusted Partners" page becomes a liability.
- **Mitigation**: (a) set a monthly 10-minute Google News review of every listed partner, using the search pattern `"{Venue Name}" -site:siligurievent.com`; (b) build the component so removing a partner is a one-line change to the data file — no rebuild of the layout; (c) keep the strip to 10–12 entries (not 40), so a quick swap is feasible; (d) prefer venues with multi-decade brand stability over newer launches.

### "We've worked at X" vs "we partner with X" — legally and reputationally distinct

- **"We partner with X"** implies a current, ongoing commercial relationship and entitles the venue to expect: prior approval of how their logo is used, reciprocal listing, and right of termination. Requires a written MOU.
- **"We've worked at X"** is a statement of past-tense fact about a specific event and is treated under nominative-use principles — but **still requires permission** to reproduce the venue's logo artwork. The name can be referenced without permission; the logo cannot.
- **Recommendation**: the strip heading should be **"Venues we've staged celebrations at"** (factual, past-tense, defensible), with a sub-line that says "partnerships announced as agreements are signed". This positions the strip as work-evidence, not partnership-claim, until partnerships are actually inked. Once an MOU exists for a given venue, that venue moves to a future **"Official partners"** section, visually distinct.

### Operational hygiene

- Maintain `/legal/partner-permissions/{slug}.{eml|pdf}` for every logo used.
- Keep a `partners.removedAt` field in CMS for venues that have asked to be de-listed, with the date — audit trail matters if a venue later disputes.
- On the `<TrustedPartners />` heading, never make a claim ("Top 12 venues in North Bengal", "Best banquet partners") — descriptive only ("Venues we've staged celebrations at").
