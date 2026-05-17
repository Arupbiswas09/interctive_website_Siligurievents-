/**
 * Stubbed CMS helper for `services` collection.
 *
 * Real implementation will fetch from Payload CMS 3 (per docs/08-CMS-PLAN.md).
 * Until Sprint 2 lands the CMS, these helpers return in-memory mock data so
 * the Services routes can be scaffolded end-to-end with realistic shapes.
 *
 * Public site shows price BANDS only (₹ / ₹₹ / ₹₹₹) per docs/DECISIONS.md D-002.
 *
 * TODO(sprint-2): replace `MOCK_SERVICES` with a `getPayload()` query.
 */

import type { PriceBand } from "@/lib/seo/schemas";

// ---------------------------------------------------------------------------
// Domain types — mirror docs/08-CMS-PLAN.md `services` collection shape.
// Kept intentionally narrow; rich-text fields are placeholder strings until
// Payload's Lexical renderer lands in Sprint 2.
// ---------------------------------------------------------------------------

export type ServiceCategory =
  | "weddings"
  | "pre-wedding"
  | "family-rituals"
  | "corporate"
  | "festivals";

export interface InclusionGroup {
  /** "Decor" | "Florals" | "Lighting" | "Styling" | ... */
  title: string;
  /** Bulleted items shown under the group title. */
  items: ReadonlyArray<string>;
}

export interface FaqEntry {
  question: string;
  /** Plain text answer. Lexical-rich content lands in Sprint 2. */
  answer: string;
}

export interface Project {
  slug: string;
  title: string;
  ceremony: string;
  location: string;
  year: number;
  /** TODO: replace with Payload Media URL once Sprint 2 lands storage. */
  coverImageUrl?: string;
}

export interface Package {
  tier: "essence" | "signature" | "atelier";
  name: string;
  priceBand: PriceBand;
  typicalRange: string;
  includes: ReadonlyArray<string>;
  recommended?: boolean;
}

export interface Service {
  /** URL slug, English-stable across locales (per D-003). */
  slug: string;
  /** Display name. EN — Hindi resolution happens in CMS layer, Sprint 2. */
  name: string;
  /** Hindi display name — bilingual ready (D-003). Optional. */
  nameHi?: string;
  category: ServiceCategory;
  /** Manual sort within category. */
  order: number;
  /** ≤80 char hero subline. */
  tagline: string;
  /** 1–2 sentence intro shown in cards + on detail hero. */
  shortDescription: string;
  /** Longer narrative for the "What we do" section. */
  longDescription: string;
  /** "Decor / Florals / Lighting" style grouped inclusions. */
  inclusions: ReadonlyArray<InclusionGroup>;
  /** 4–6 step process. Optional — falls back to default house process. */
  process?: ReadonlyArray<{ step: string; description: string }>;
  /** Signature past projects (max 5). */
  signatureProjects: ReadonlyArray<Project>;
  faqs: ReadonlyArray<FaqEntry>;
  /** Related service slugs (max 4). */
  relatedSlugs: ReadonlyArray<string>;
  /** Hybrid price band per D-002. */
  priceBand: PriceBand;
  /** Plain-language description of the band, e.g. "Most ₹₹ weddings…" */
  priceContext: string;
  /** TODO: replace with Payload Media once storage lands. */
  heroImageUrl?: string;
}

// ---------------------------------------------------------------------------
// House defaults — reused across services for consistency.
// ---------------------------------------------------------------------------

const DEFAULT_PROCESS = [
  {
    step: "Discover",
    description:
      "TODO: First conversation — your story, the guest list, the venue, the dreams you can't yet describe.",
  },
  {
    step: "Design",
    description:
      "TODO: Mood boards, palette swatches, mandap mock-ups, lighting plots — every decision rehearsed on paper first.",
  },
  {
    step: "Stage",
    description:
      "TODO: Setup begins the evening before. Our crew rigs flowers, fabric, lighting and audio so day-of feels weightless.",
  },
  {
    step: "Document",
    description:
      "TODO: We coordinate with your photographer and videographer so the decor lives long after the petals are swept.",
  },
] as const;

// Stable placeholder projects until Payload + Gemini imagery land.
const STUB_PROJECTS = (slug: string): ReadonlyArray<Project> => [
  {
    slug: `${slug}-signature-01`,
    title: "TODO: Project name",
    ceremony: "TODO: Ceremony",
    location: "Siliguri",
    year: 2025,
  },
  {
    slug: `${slug}-signature-02`,
    title: "TODO: Project name",
    ceremony: "TODO: Ceremony",
    location: "Darjeeling",
    year: 2025,
  },
  {
    slug: `${slug}-signature-03`,
    title: "TODO: Project name",
    ceremony: "TODO: Ceremony",
    location: "Dooars",
    year: 2024,
  },
];

const STUB_FAQS: ReadonlyArray<FaqEntry> = [
  {
    question: "TODO: How far in advance should we book?",
    answer:
      "TODO: For peak season (October–February), six months is comfortable. For shoulder seasons, three months. We take on a limited number of events each month.",
  },
  {
    question: "TODO: Do you travel outside Siliguri?",
    answer:
      "TODO: Yes — across North Bengal, Sikkim border zones, the Dooars and tea estates. Travel and lodging for the crew is quoted separately.",
  },
  {
    question: "TODO: Can you work with the venue's in-house decorator?",
    answer:
      "TODO: Most venues allow outside decorators with a coordination meeting. We handle the logistics on your behalf.",
  },
  {
    question: "TODO: What's included in the price band?",
    answer:
      "TODO: The band is a starting reference for typical scope. Final quotes are bespoke and depend on guest count, days, lighting complexity, and flower season.",
  },
  {
    question: "TODO: Do you arrange flowers, lighting and sound under one roof?",
    answer:
      "TODO: Florals and lighting are in-house. Sound, video and photography are partner-led — we coordinate them so you have a single point of contact.",
  },
  {
    question: "TODO: What happens if it rains?",
    answer:
      "TODO: Every outdoor plan ships with a covered backup. Tea-estate weddings especially — we plan the monsoon contingency at design time, not on the day.",
  },
];

// ---------------------------------------------------------------------------
// The 19 services per docs/04-INFORMATION-ARCHITECTURE.md §4.1
//
// Copy is intentionally `TODO:` marked — content lands via Payload in Sprint 2.
// Slugs are stable across locales (D-003).
// ---------------------------------------------------------------------------

const MOCK_SERVICES: ReadonlyArray<Service> = [
  // ── Weddings ────────────────────────────────────────────────────────────
  {
    slug: "wedding",
    name: "Weddings",
    nameHi: "विवाह",
    category: "weddings",
    order: 1,
    tagline: "TODO: The whole arc — from haldi to bidaai, staged like a film.",
    shortDescription:
      "TODO: End-to-end wedding decor for ceremonies of every faith and tradition across North Bengal.",
    longDescription:
      "TODO: From an intimate court-yard nikah for forty to a four-day destination wedding for eight hundred, we plan, design and stage every chapter — mandap, baraat, varmala, pheras, reception. One studio, one standard.",
    inclusions: [
      {
        title: "Decor",
        items: [
          "TODO: Mandap design (traditional, contemporary, fusion)",
          "TODO: Stage and seating design",
          "TODO: Entrance arches and welcome installations",
          "TODO: Aisle and walkway styling",
        ],
      },
      {
        title: "Florals",
        items: [
          "TODO: Fresh-flower mandap drapes",
          "TODO: Aisle florals, pillars, hanging installations",
          "TODO: Bridal car and palki decoration",
          "TODO: Seasonal Indian and imported blooms",
        ],
      },
      {
        title: "Lighting",
        items: [
          "TODO: Architectural up-lighting in brand palette",
          "TODO: Mandap and aisle spot-lighting cues",
          "TODO: Outdoor festoon, fairy and gobo lighting",
          "TODO: Tested and dimmer-controlled by our crew",
        ],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("wedding"),
    faqs: STUB_FAQS,
    relatedSlugs: ["bengali-wedding", "haldi-gaye-holud", "sangeet", "reception"],
    priceBand: "₹₹",
    priceContext:
      "TODO: Most ₹₹ weddings land between 150–400 guests over 1–2 days, with mandap, reception stage and lighting in scope.",
  },
  {
    slug: "bengali-wedding",
    name: "Bengali Wedding",
    nameHi: "बंगाली विवाह",
    category: "weddings",
    order: 2,
    tagline: "TODO: Subho Drishti, Saat Paak, Sindoor Daan — staged with care.",
    shortDescription:
      "TODO: Editorial Bengali wedding decor — gaye holud through bou bhaat, with every traditional moment given its own frame.",
    longDescription:
      "TODO: We design Bengali weddings the way they were meant to feel — bashor ghor lit like a stage, the chhadnatala built for the family, and bou bhaat scenography that hands the night to the new home. Every ritual gets its visual.",
    inclusions: [
      {
        title: "Decor",
        items: [
          "TODO: Chhadnatala (traditional canopy) design",
          "TODO: Bashor Ghor styling",
          "TODO: Bou Bhaat stage design",
          "TODO: Topor & accessory styling",
        ],
      },
      {
        title: "Florals",
        items: [
          "TODO: Marigold + rajanigandha installations",
          "TODO: Bengali-style banana-leaf and conch motifs",
          "TODO: Bridal palki florals",
        ],
      },
      {
        title: "Lighting",
        items: [
          "TODO: Diya pathway lighting",
          "TODO: Subho Drishti moment spot",
          "TODO: Sindoor Daan ceremony lighting cue",
        ],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("bengali-wedding"),
    faqs: STUB_FAQS,
    relatedSlugs: ["wedding", "haldi-gaye-holud", "reception", "annaprashan-rice-ceremony"],
    priceBand: "₹₹",
    priceContext:
      "TODO: Most Bengali weddings we design are 150–500 guests across 2–3 ceremonies. The band reflects mandap + stage + reception scope.",
  },
  // ── Pre-wedding ─────────────────────────────────────────────────────────
  {
    slug: "haldi-gaye-holud",
    name: "Haldi / Gaye Holud",
    nameHi: "हल्दी",
    category: "pre-wedding",
    order: 1,
    tagline: "TODO: Yellow, marigold, sunlight — the brightest morning of the year.",
    shortDescription:
      "TODO: Sunlit, marigold-saturated haldi & gaye holud setups for intimate morning ceremonies.",
    longDescription:
      "TODO: We treat haldi as the warmest, most photographable ceremony of the wedding week. Courtyards strung with marigold, bamboo swings, low seating, terracotta everywhere — designed for daylight, designed for the family.",
    inclusions: [
      {
        title: "Decor",
        items: [
          "TODO: Bamboo swings and low seating",
          "TODO: Courtyard backdrops with marigold and rajanigandha",
          "TODO: Earthen-ware platters and brass accents",
        ],
      },
      {
        title: "Florals",
        items: [
          "TODO: Marigold strings (toran), garlands and rangoli",
          "TODO: Rajanigandha hair-strings",
        ],
      },
      {
        title: "Lighting",
        items: [
          "TODO: Daylight-optimised, no overheads needed",
          "TODO: Indoor variant with warm tungsten haze",
        ],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("haldi"),
    faqs: STUB_FAQS,
    relatedSlugs: ["mehendi", "sangeet", "bengali-wedding"],
    priceBand: "₹",
    priceContext:
      "TODO: Haldi setups are intimate — most ₹ events are 40–120 guests in a 4-hour morning window.",
  },
  {
    slug: "mehendi",
    name: "Mehendi",
    nameHi: "मेहंदी",
    category: "pre-wedding",
    order: 2,
    tagline: "TODO: Low cushions, mirror work, a courtyard that hums.",
    shortDescription:
      "TODO: Bohemian-meets-baithak mehendi setups designed for long afternoons of music and storytelling.",
    longDescription:
      "TODO: A mehendi belongs on the floor. We design low-seating tableaux with mirror chowkis, hanging lanterns, dhurries, brass and bolsters — atmospheric, photographable, and built to hold a hundred conversations at once.",
    inclusions: [
      {
        title: "Decor",
        items: [
          "TODO: Low seating chowkis, dhurries, bolsters",
          "TODO: Suspended umbrellas, lanterns, rajasthani florals",
          "TODO: Custom mehendi artist station",
        ],
      },
      {
        title: "Florals",
        items: [
          "TODO: Marigold and rose canopies",
          "TODO: Hanging gypsophila clouds",
        ],
      },
      {
        title: "Lighting",
        items: [
          "TODO: Festoon, fairy and warm gobo lighting",
          "TODO: Candle clusters for the seating area",
        ],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("mehendi"),
    faqs: STUB_FAQS,
    relatedSlugs: ["haldi-gaye-holud", "sangeet", "wedding"],
    priceBand: "₹",
    priceContext: "TODO: Mehendi evenings are typically 50–150 guests across 3–5 hours.",
  },
  {
    slug: "sangeet",
    name: "Sangeet",
    nameHi: "संगीत",
    category: "pre-wedding",
    order: 3,
    tagline: "TODO: A stage, a dance floor, a night the family writes about.",
    shortDescription:
      "TODO: Cinematic sangeet stages built for performance, photography and a thousand-watt dance floor.",
    longDescription:
      "TODO: Our sangeet design is engineered first — stage rigging, audio, lighting cues — then dressed. We work with your choreographer to make sure every entry, freeze and finale has its frame.",
    inclusions: [
      {
        title: "Stage & decor",
        items: [
          "TODO: Bespoke stage with LED back-walls",
          "TODO: Audience seating layout (lounge or banquet)",
          "TODO: Entry tunnel and dance-floor design",
        ],
      },
      {
        title: "Florals",
        items: [
          "TODO: Stage flanks and hanging installations",
          "TODO: Entrance archway",
        ],
      },
      {
        title: "Lighting & sound",
        items: [
          "TODO: Moving heads, washes, blinders",
          "TODO: Lighting cues built to your performance script",
          "TODO: PA system coordination with partners",
        ],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("sangeet"),
    faqs: STUB_FAQS,
    relatedSlugs: ["mehendi", "wedding", "reception"],
    priceBand: "₹₹",
    priceContext:
      "TODO: Sangeet evenings with stage + lighting + sound usually land in ₹₹ band for 150–400 guests.",
  },
  {
    slug: "engagement-roka",
    name: "Engagement / Roka",
    nameHi: "सगाई / रोका",
    category: "pre-wedding",
    order: 4,
    tagline: "TODO: The first promise — intimate, photographed, remembered.",
    shortDescription:
      "TODO: Refined engagement and roka ceremonies designed for the close family — quiet, ceremonial, and visually still.",
    longDescription:
      "TODO: We treat the roka with the same care as the wedding itself, on a smaller canvas. A single beautiful chowki, a focal floral installation, a tea-light pathway. The day is short — every frame must hold.",
    inclusions: [
      {
        title: "Decor",
        items: [
          "TODO: Centre table or chowki design",
          "TODO: Ring exchange focal installation",
          "TODO: Family seating arrangement",
        ],
      },
      {
        title: "Florals",
        items: ["TODO: Imported and seasonal florals", "TODO: Ring tray florals"],
      },
      {
        title: "Lighting",
        items: ["TODO: Soft warm wash", "TODO: Hero spot for the ring moment"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("engagement"),
    faqs: STUB_FAQS,
    relatedSlugs: ["wedding", "reception", "cocktail-party"],
    priceBand: "₹",
    priceContext: "TODO: Engagements are typically 30–100 guests in a tightly designed single setup.",
  },
  {
    slug: "reception",
    name: "Reception",
    nameHi: "रिसेप्शन",
    category: "weddings",
    order: 3,
    tagline: "TODO: The first walk-in as a couple. Make it count.",
    shortDescription:
      "TODO: Reception decor designed around the couple's stage walk-in — banquet, lawn or rooftop.",
    longDescription:
      "TODO: A reception is a portrait night. We design around the centre stage — the walk-in, the cake, the photo-call — then build the room outward. Guest seating, lounge zones, F&B styling, gift table — all considered.",
    inclusions: [
      {
        title: "Stage & decor",
        items: [
          "TODO: Couple stage and walk-in design",
          "TODO: Guest seating (banquet or lounge)",
          "TODO: Cake table and gift station",
        ],
      },
      {
        title: "Florals",
        items: ["TODO: Stage backdrop florals", "TODO: Centerpieces", "TODO: Walk-in archway"],
      },
      {
        title: "Lighting",
        items: ["TODO: Up-lighting in event palette", "TODO: Spotlight and follow-spot for walk-in"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("reception"),
    faqs: STUB_FAQS,
    relatedSlugs: ["wedding", "cocktail-party", "sangeet"],
    priceBand: "₹₹",
    priceContext: "TODO: Receptions typically scale 200–600 guests in the ₹₹ band.",
  },
  {
    slug: "cocktail-party",
    name: "Cocktail Party",
    nameHi: "कॉकटेल पार्टी",
    category: "weddings",
    order: 4,
    tagline: "TODO: After-dark, lounge-y, deliberately moody.",
    shortDescription:
      "TODO: Late-night cocktail decor — bar styling, lounge zones, moody lighting, and a soundtrack room.",
    longDescription:
      "TODO: Cocktail nights belong in a different visual register from the wedding. We design with deeper palettes, lounge furniture clusters, sculptural bar styling and lighting that lets the room exhale.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Lounge furniture clusters", "TODO: Bar back-wall styling", "TODO: Photo wall / step-and-repeat"],
      },
      {
        title: "Florals",
        items: ["TODO: Bar florals", "TODO: Lounge centerpieces"],
      },
      {
        title: "Lighting",
        items: ["TODO: Moody warm wash", "TODO: Gobo logo projection", "TODO: DJ-synced lighting cues"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("cocktail"),
    faqs: STUB_FAQS,
    relatedSlugs: ["reception", "sangeet", "corporate-events"],
    priceBand: "₹₹",
    priceContext: "TODO: Cocktail nights are typically 100–300 guests indoors.",
  },
  // ── Family rituals ──────────────────────────────────────────────────────
  {
    slug: "birthday-party",
    name: "Birthday Party",
    nameHi: "जन्मदिन समारोह",
    category: "family-rituals",
    order: 1,
    tagline: "TODO: Milestone birthdays styled like editorial covers.",
    shortDescription:
      "TODO: First birthdays, sweet-sixteens, fortieths, sixtieths — themed, photographed, and built around the guest of honour.",
    longDescription:
      "TODO: We design birthdays around one motif and execute it ruthlessly — cake table, photo wall, dessert station, signage and party favours. No clutter, no novelty-store balloons.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Cake table and dessert station", "TODO: Photo wall / step-and-repeat", "TODO: Signage and party favours"],
      },
      {
        title: "Florals & props",
        items: ["TODO: Balloon-and-floral arches (custom palette)", "TODO: Numerical / monogram installations"],
      },
      {
        title: "Lighting",
        items: ["TODO: Theme-coloured wash", "TODO: Cake-moment spotlight"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("birthday"),
    faqs: STUB_FAQS,
    relatedSlugs: ["anniversary", "baby-shower-godh-bharai", "annaprashan-rice-ceremony"],
    priceBand: "₹",
    priceContext: "TODO: Most birthday setups are 30–150 guests in a single room or lawn.",
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    nameHi: "वर्षगांठ",
    category: "family-rituals",
    order: 2,
    tagline: "TODO: A second wedding, quietly.",
    shortDescription:
      "TODO: 25th and 50th anniversaries — restaged with the original palette, the original people, the original promise.",
    longDescription:
      "TODO: For silver and golden anniversaries we design like a second wedding — but quieter, deeper, with archival references. Photo timelines, family seating, a portrait wall, an honoured stage for the couple.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Couple stage / honoured seating", "TODO: Photo timeline wall", "TODO: Family seating layout"],
      },
      {
        title: "Florals",
        items: ["TODO: Anniversary monogram installation", "TODO: Centerpieces"],
      },
      {
        title: "Lighting",
        items: ["TODO: Warm wash", "TODO: Toast-moment spot"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("anniversary"),
    faqs: STUB_FAQS,
    relatedSlugs: ["birthday-party", "private-celebrations", "reception"],
    priceBand: "₹",
    priceContext: "TODO: Anniversaries are typically 50–200 guests.",
  },
  {
    slug: "baby-shower-godh-bharai",
    name: "Baby Shower / Godh Bharai",
    nameHi: "गोद भराई",
    category: "family-rituals",
    order: 3,
    tagline: "TODO: The softest possible welcome.",
    shortDescription:
      "TODO: Godh bharai, baby shower and seemantham — pastel palettes, family-only intimacy, every blessing photographed.",
    longDescription:
      "TODO: We design godh bharai and baby shower setups around pastel palettes, soft fabrics and a single hero swing or chowki for the mother-to-be. Family-only, family-first.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Mother-to-be hero seating (swing / chowki)", "TODO: Gift station and dessert table"],
      },
      {
        title: "Florals",
        items: ["TODO: Pastel floral garlands", "TODO: Blessing-moment florals"],
      },
      {
        title: "Lighting",
        items: ["TODO: Soft daylight or candle-warm cluster"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("baby-shower"),
    faqs: STUB_FAQS,
    relatedSlugs: ["annaprashan-rice-ceremony", "naamkaran", "birthday-party"],
    priceBand: "₹",
    priceContext: "TODO: Most godh bharai setups are 30–80 family guests.",
  },
  {
    slug: "annaprashan-rice-ceremony",
    name: "Annaprashan",
    nameHi: "अन्नप्राशन",
    category: "family-rituals",
    order: 4,
    tagline: "TODO: First rice. First photo album. Built to last.",
    shortDescription:
      "TODO: Bengali annaprashan and mukhe bhaat ceremonies with traditional brass, banana leaf and family-portrait styling.",
    longDescription:
      "TODO: The annaprashan is a single hero moment — the child seated, the elders feeding the first rice. We build the frame around that moment, then dress the room outward.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Child's hero chowki", "TODO: Banana-leaf and brass styling", "TODO: Family seating"],
      },
      {
        title: "Florals",
        items: ["TODO: Marigold and rajanigandha", "TODO: Brass-thali florals"],
      },
      {
        title: "Lighting",
        items: ["TODO: Daylight optimised", "TODO: Family photo cluster lighting"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("annaprashan"),
    faqs: STUB_FAQS,
    relatedSlugs: ["naamkaran", "baby-shower-godh-bharai", "bengali-wedding"],
    priceBand: "₹",
    priceContext: "TODO: Annaprashan setups are intimate — 30–80 guests is typical.",
  },
  {
    slug: "naamkaran",
    name: "Naamkaran",
    nameHi: "नामकरण",
    category: "family-rituals",
    order: 5,
    tagline: "TODO: A name, a blessing, a quiet room.",
    shortDescription:
      "TODO: Naamkaran ceremonies designed for the family priest, the parents and the cradle — nothing more, nothing less.",
    longDescription:
      "TODO: We keep naamkaran setups disciplined — the cradle, the puja station, the family seating. Soft palettes, brass, fresh flowers, candle warmth.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Decorated cradle / palna", "TODO: Puja station", "TODO: Family seating"],
      },
      {
        title: "Florals",
        items: ["TODO: Cradle florals", "TODO: Puja station marigold"],
      },
      {
        title: "Lighting",
        items: ["TODO: Soft cluster lighting"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("naamkaran"),
    faqs: STUB_FAQS,
    relatedSlugs: ["annaprashan-rice-ceremony", "baby-shower-godh-bharai"],
    priceBand: "₹",
    priceContext: "TODO: Naamkaran setups are 20–60 guests.",
  },
  {
    slug: "griha-pravesh",
    name: "Griha Pravesh",
    nameHi: "गृह प्रवेश",
    category: "family-rituals",
    order: 6,
    tagline: "TODO: The first threshold of the new home.",
    shortDescription:
      "TODO: Griha pravesh decor — entrance toran, courtyard puja, kalash styling and a welcome that reads from the gate.",
    longDescription:
      "TODO: We design griha pravesh from the gate inward — toran at the doorway, footprint rangoli, kalash at the threshold, puja station inside. Every visitor walks into a curated frame.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Doorway toran and entrance arch", "TODO: Courtyard puja station", "TODO: Family seating"],
      },
      {
        title: "Florals",
        items: ["TODO: Toran and marigold strings", "TODO: Kalash florals"],
      },
      {
        title: "Lighting",
        items: ["TODO: Diya pathway", "TODO: Soft warm wash"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("griha-pravesh"),
    faqs: STUB_FAQS,
    relatedSlugs: ["naamkaran", "private-celebrations", "lakshmi-puja"],
    priceBand: "₹",
    priceContext: "TODO: Griha pravesh setups are 30–100 guests, typically a half-day.",
  },
  // ── Corporate ───────────────────────────────────────────────────────────
  {
    slug: "corporate-events",
    name: "Corporate Events",
    nameHi: "कॉर्पोरेट इवेंट्स",
    category: "corporate",
    order: 1,
    tagline: "TODO: Brand-grade events, on-time and on-message.",
    shortDescription:
      "TODO: Conferences, product launches, awards nights, off-sites and team celebrations — branded, lit and run like a production.",
    longDescription:
      "TODO: For corporates we design as a production team — stage, lighting plot, run-sheet, AV coordination, brand styling. Decor serves the message and the camera.",
    inclusions: [
      {
        title: "Stage & branding",
        items: ["TODO: Stage with branded back-wall", "TODO: Step-and-repeat / photo wall", "TODO: Registration & lounge zones"],
      },
      {
        title: "Florals",
        items: ["TODO: On-brand floral accents (minimal)"],
      },
      {
        title: "Lighting & AV",
        items: ["TODO: Stage lighting plot", "TODO: Audio + projection coordination", "TODO: Gobo logo projection"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("corporate"),
    faqs: STUB_FAQS,
    relatedSlugs: ["private-celebrations", "cocktail-party", "reception"],
    priceBand: "₹₹",
    priceContext: "TODO: Most corporate events we run are 100–500 attendees in a single ballroom or lawn.",
  },
  // ── Festivals ───────────────────────────────────────────────────────────
  {
    slug: "durga-puja-decoration",
    name: "Durga Puja",
    nameHi: "दुर्गा पूजा",
    category: "festivals",
    order: 1,
    tagline: "TODO: Pandal aesthetics — concept-led, neighbourhood-loved.",
    shortDescription:
      "TODO: Themed Durga Puja pandal design for community committees and apartment associations across North Bengal.",
    longDescription:
      "TODO: We design Durga Puja pandals around a single concept — heritage, abstract, regional — then execute structure, idol staging, lighting and crowd flow. Theme-led, community-friendly, photograph-ready.",
    inclusions: [
      {
        title: "Pandal & structure",
        items: ["TODO: Themed pandal exterior + interior", "TODO: Devi mancha staging", "TODO: Crowd-flow signage"],
      },
      {
        title: "Florals",
        items: ["TODO: Marigold and rajanigandha installations", "TODO: Devi-mancha florals"],
      },
      {
        title: "Lighting",
        items: ["TODO: Concept lighting plot", "TODO: Aarti spotlights"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("durga-puja"),
    faqs: STUB_FAQS,
    relatedSlugs: ["lakshmi-puja", "saraswati-puja", "private-celebrations"],
    priceBand: "₹₹",
    priceContext: "TODO: Themed community pandals range widely; the ₹₹ band reflects typical 4-day setups.",
  },
  {
    slug: "lakshmi-puja",
    name: "Lakshmi Puja",
    nameHi: "लक्ष्मी पूजा",
    category: "festivals",
    order: 2,
    tagline: "TODO: The home, lit for prosperity.",
    shortDescription:
      "TODO: Home and community Lakshmi Puja setups — alpana, kalash, diya pathways and a styled devi mancha.",
    longDescription:
      "TODO: For Lakshmi Puja we focus on the home or hall threshold — alpana at the doorway, kalash with mango leaves, a tightly styled devi mancha, diya clusters. A clean, lit, deeply photographable moment.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Devi mancha staging", "TODO: Alpana and doorway toran", "TODO: Family seating"],
      },
      {
        title: "Florals",
        items: ["TODO: Marigold and lotus florals", "TODO: Kalash decoration"],
      },
      {
        title: "Lighting",
        items: ["TODO: Diya pathway clusters", "TODO: Devi spot"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("lakshmi-puja"),
    faqs: STUB_FAQS,
    relatedSlugs: ["durga-puja-decoration", "saraswati-puja", "griha-pravesh"],
    priceBand: "₹",
    priceContext: "TODO: Home Lakshmi Puja setups are usually 30–80 family + neighbours.",
  },
  {
    slug: "saraswati-puja",
    name: "Saraswati Puja",
    nameHi: "सरस्वती पूजा",
    category: "festivals",
    order: 3,
    tagline: "TODO: Yellow, books, basant — the gentlest puja of the year.",
    shortDescription:
      "TODO: School, college, society and home Saraswati Puja setups in basanti yellow with a quiet devi mancha.",
    longDescription:
      "TODO: We design Saraswati Puja around the basanti palette — yellow drapes, palash flowers, a low devi mancha, books and instruments staged with care. Calm, classical, photogenic.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Devi mancha", "TODO: Yellow drapes and book / instrument styling"],
      },
      {
        title: "Florals",
        items: ["TODO: Palash and marigold installations"],
      },
      {
        title: "Lighting",
        items: ["TODO: Daylight optimised", "TODO: Anjali moment spot"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("saraswati-puja"),
    faqs: STUB_FAQS,
    relatedSlugs: ["durga-puja-decoration", "lakshmi-puja"],
    priceBand: "₹",
    priceContext: "TODO: Community Saraswati Pujas are typically 50–200 attendees over a single day.",
  },
  {
    slug: "private-celebrations",
    name: "Private Celebrations",
    nameHi: "निजी समारोह",
    category: "family-rituals",
    order: 7,
    tagline: "TODO: One-off moments — proposals, retirements, homecomings.",
    shortDescription:
      "TODO: Bespoke private celebrations that don't fit a category — proposals, retirements, homecomings, surprise parties.",
    longDescription:
      "TODO: When the moment is one-of-a-kind, we design from scratch. A rooftop proposal, a forty-year retirement, a soldier coming home — every brief gets its own visual language.",
    inclusions: [
      {
        title: "Decor",
        items: ["TODO: Custom installation around the hero moment", "TODO: Photo-ready focal point"],
      },
      {
        title: "Florals",
        items: ["TODO: Bespoke floral arrangement"],
      },
      {
        title: "Lighting",
        items: ["TODO: Mood lighting tailored to the moment"],
      },
    ],
    process: DEFAULT_PROCESS,
    signatureProjects: STUB_PROJECTS("private-celebrations"),
    faqs: STUB_FAQS,
    relatedSlugs: ["anniversary", "birthday-party", "engagement-roka"],
    priceBand: "₹",
    priceContext: "TODO: Scope varies — most private celebrations land in ₹ for an intimate setup.",
  },
];

// ---------------------------------------------------------------------------
// Public helpers — replace internals with Payload queries in Sprint 2.
// ---------------------------------------------------------------------------

export const SERVICE_CATEGORIES: ReadonlyArray<{
  slug: ServiceCategory;
  label: string;
  description: string;
}> = [
  {
    slug: "weddings",
    label: "Weddings",
    description:
      "TODO: Mandap, baraat, varmala, pheras, reception — full-arc wedding decor across faiths and traditions.",
  },
  {
    slug: "pre-wedding",
    label: "Pre-wedding",
    description:
      "TODO: Haldi, mehendi, sangeet, engagement — every chapter before the big day.",
  },
  {
    slug: "family-rituals",
    label: "Family Rituals",
    description:
      "TODO: Annaprashan, naamkaran, griha pravesh, birthdays, anniversaries — the quiet, important ones.",
  },
  {
    slug: "corporate",
    label: "Corporate",
    description:
      "TODO: Conferences, launches, awards, off-sites — production-grade brand events.",
  },
  {
    slug: "festivals",
    label: "Festivals",
    description:
      "TODO: Durga Puja, Lakshmi Puja, Saraswati Puja — community and home festival decor.",
  },
];

/** Returns all services, sorted by category order then per-category order. */
export async function getServices(): Promise<ReadonlyArray<Service>> {
  // TODO(sprint-2): replace with getPayload().find({ collection: 'services', sort: 'order' })
  const sorted = [...MOCK_SERVICES].sort((a, b) => {
    if (a.category === b.category) return a.order - b.order;
    return a.category.localeCompare(b.category);
  });
  return sorted;
}

/** Returns services filtered by category. */
export async function getServicesByCategory(
  category: ServiceCategory,
): Promise<ReadonlyArray<Service>> {
  const all = await getServices();
  return all.filter((s) => s.category === category);
}

/** Returns a single service by slug, or `null` if not found. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  // TODO(sprint-2): replace with getPayload().find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1 })
  const match = MOCK_SERVICES.find((s) => s.slug === slug);
  return match ?? null;
}

/** Returns all service slugs — used by `generateStaticParams`. */
export async function getServiceSlugs(): Promise<ReadonlyArray<string>> {
  return MOCK_SERVICES.map((s) => s.slug);
}

/** Resolves related services from slugs (drops missing). */
export async function getRelatedServices(
  slugs: ReadonlyArray<string>,
): Promise<ReadonlyArray<Service>> {
  const all = await getServices();
  return slugs
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}
