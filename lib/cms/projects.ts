/**
 * Stubbed CMS query helpers for the portfolio `projects` collection.
 *
 * Mirrors docs/08-CMS-PLAN.md (§ `projects`). Returns mock data until
 * Payload is wired in Sprint 2. The exported types are the contract —
 * when Payload comes online we swap the implementation, not the call-sites.
 *
 * Image IDs reference docs/09-IMAGE-PROMPTS.md §E (`PROJ-[name]-COVER`,
 * `PROJ-[name]-CHAPTER-[day]-[01..04]`, etc.). Gemini prompts are
 * owner-supplied.
 *
 * Back-compat: the original light `Project` interface + `getAllProjects` /
 * `getProjectsByLocation` are kept so the location pages keep compiling
 * — they read from the same source-of-truth catalogue.
 */

import type { LocationSlug } from "./locations";
import type { PriceBand } from "@/lib/seo/schemas";

// ---------------------------------------------------------------------------
// Rich types — used by the new portfolio routes
// ---------------------------------------------------------------------------

export type ProjectStatus = "draft" | "published";

export interface ProjectImage {
  /** Image placeholder ID — maps to docs/09-IMAGE-PROMPTS.md §E. */
  id: string;
  /** Public URL (or placeholder path) — Vercel Blob in Sprint 2. */
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

export interface ProjectStat {
  label: string;
  value: number;
  /** Optional unit appended after the counter ("m", "stages", "cues"). */
  unit?: string;
  /** Optional prefix ("₹", "+"). */
  prefix?: string;
}

export interface ProjectChapter {
  /** Slug for hashlinks (e.g. `haldi`, `mehendi`, `sangeet`). */
  slug: string;
  name: string;
  description: string;
  images: ReadonlyArray<ProjectImage>;
}

export interface ProjectCredit {
  role: string;
  name: string;
  link?: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectTestimonial {
  author: string;
  role?: string;
  quote: string;
}

export interface PortfolioProject {
  // Identity
  title: string;
  slug: string;
  status: ProjectStatus;

  // Taxonomy / filtering (drives portfolio index URL params)
  category: string; // "wedding" | "birthday" | "annaprashan" | "corporate"
  ceremonyName: string; // human-readable: "Bengali Wedding"
  locationSlug: LocationSlug | string;
  locationName: string;
  year: number;
  date: string; // ISO date

  // Editorial copy (TODO placeholders — sourced from CMS in Sprint 2)
  tagline: string;
  brief: string;
  setting: string;
  designStory: string;
  clientNote: ProjectTestimonial;
  /** Masonry caption / accessible labelling. */
  excerpt: string;

  // Media
  coverImage: ProjectImage;
  closingImage: ProjectImage;
  briefImage: ProjectImage;
  settingImages: ReadonlyArray<ProjectImage>;
  designImages: ReadonlyArray<ProjectImage>;
  galleryImages: ReadonlyArray<ProjectImage>;

  // Story
  specs: ReadonlyArray<ProjectSpec>;
  chapters: ReadonlyArray<ProjectChapter>;
  stats: ReadonlyArray<ProjectStat>;
  credits: ReadonlyArray<ProjectCredit>;

  // Pricing band (D-002) — never expose numeric figures publicly
  priceBand?: PriceBand;

  // Navigation
  nextProjectSlug: string;
}

// ---------------------------------------------------------------------------
// Back-compat type (used by location pages)
// ---------------------------------------------------------------------------

export interface Project {
  slug: string;
  title: string;
  ceremony: string;
  year: number;
  locationSlug: LocationSlug;
  brief: string;
  coverImageUrl: string;
}

// ---------------------------------------------------------------------------
// Filtering surface — consumed by /portfolio query-state UI
// ---------------------------------------------------------------------------

export interface PortfolioFilterOptions {
  category?: string;
  year?: number;
  location?: string;
  /** 1-indexed page (per docs/05 §5.5 — `?page=2`). */
  page?: number;
  /** Items per page; defaults to 9. */
  pageSize?: number;
}

export interface PortfolioPage {
  items: ReadonlyArray<PortfolioProject>;
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface PortfolioFacets {
  categories: ReadonlyArray<{ slug: string; label: string; count: number }>;
  years: ReadonlyArray<{ value: number; count: number }>;
  locations: ReadonlyArray<{ slug: string; label: string; count: number }>;
}

// ---------------------------------------------------------------------------
// Mock image factory
// ---------------------------------------------------------------------------

type Ratio = "4:5" | "16:9" | "3:2" | "1:1" | "9:16";

const RATIO_DIMS: Record<Ratio, { w: number; h: number }> = {
  "4:5": { w: 1600, h: 2000 },
  "16:9": { w: 1920, h: 1080 },
  "3:2": { w: 1800, h: 1200 },
  "1:1": { w: 1600, h: 1600 },
  "9:16": { w: 1080, h: 1920 },
};

// Whitelist of project covers we generated specific imagery for. All other
// sub-images (chapter shots, gallery, brief, etc.) fall back to a per-ratio
// hero tile so the grid never shows a 404.
const GENERATED_COVERS = new Set<string>([
  "PROJ-rinki-aditya-COVER",
  "PROJ-arpita-sanjay-COVER",
  "PROJ-tea-garden-COVER",
  "PROJ-darjeeling-COVER",
  "PROJ-corporate-gala-COVER",
  "PROJ-bday-milestone-COVER",
]);

function mockImage(id: string, alt: string, ratio: Ratio = "3:2"): ProjectImage {
  const { w, h } = RATIO_DIMS[ratio];
  const src = GENERATED_COVERS.has(id)
    ? `/images/placeholders/${id}.jpg`
    : `/images/placeholders/_fallback-${ratio.replace(":", "x")}.jpg`;
  return { id, src, alt, width: w, height: h };
}

// ---------------------------------------------------------------------------
// Mock catalogue — 6 case studies (slugs per docs/09 §E)
// ---------------------------------------------------------------------------

const PROJECTS: ReadonlyArray<PortfolioProject> = [
  {
    title: "Rinki & Aditya · Bengali Wedding",
    slug: "rinki-aditya-bengali-wedding-2025",
    status: "published",
    category: "wedding",
    ceremonyName: "Bengali Wedding",
    locationSlug: "siliguri",
    locationName: "Siliguri",
    year: 2025,
    date: "2025-02-08",
    tagline: "Four days of jasmine, brass, and red.",
    brief:
      "TODO: A four-day Bengali wedding for 420 guests across two venues in Siliguri. The brief was unambiguous — classical motifs, restrained palette, every chapter shot like a film still.",
    setting:
      "TODO: A heritage banquet on Sevoke Road, the bride's family home for the Gaye Holud, and a riverside reception lawn. Three rooms; one continuous mood.",
    designStory:
      "TODO: Marigold, jasmine, raw silk, brass lanterns. A single red sari draped behind the mandap as the dominant gesture. Lighting cued to the priest's chants.",
    clientNote: {
      author: "Rinki & Aditya",
      role: "Bride and groom",
      quote:
        "TODO: They turned our four days into a film. Every chapter — Haldi, Mehendi, Wedding, Reception — felt deliberately staged and entirely ours.",
    },
    excerpt: "Bengali wedding · Siliguri · February 2025",
    coverImage: mockImage("PROJ-rinki-aditya-COVER", "Mandap at golden hour", "16:9"),
    closingImage: mockImage("PROJ-rinki-aditya-CLOSING", "Reception at dusk", "16:9"),
    briefImage: mockImage("PROJ-rinki-aditya-BRIEF", "Brass diya and red silk", "4:5"),
    settingImages: [
      mockImage("PROJ-rinki-aditya-SETTING-01", "Banquet hall before setup", "3:2"),
      mockImage("PROJ-rinki-aditya-SETTING-02", "Family courtyard", "3:2"),
      mockImage("PROJ-rinki-aditya-SETTING-03", "Reception lawn dusk", "3:2"),
      mockImage("PROJ-rinki-aditya-SETTING-04", "Aisle and mandap from above", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-rinki-aditya-DESIGN-01", "Marigold and jasmine garland", "4:5"),
      mockImage("PROJ-rinki-aditya-DESIGN-02", "Brass lantern at table setting", "1:1"),
      mockImage("PROJ-rinki-aditya-DESIGN-03", "Red silk drape behind mandap", "4:5"),
    ],
    galleryImages: [
      mockImage("PROJ-rinki-aditya-CHAPTER-1-01", "Haldi — yellow ritual", "3:2"),
      mockImage("PROJ-rinki-aditya-CHAPTER-1-02", "Haldi — family", "4:5"),
      mockImage("PROJ-rinki-aditya-CHAPTER-2-01", "Mehendi — palms", "1:1"),
      mockImage("PROJ-rinki-aditya-CHAPTER-2-02", "Mehendi — courtyard", "16:9"),
      mockImage("PROJ-rinki-aditya-CHAPTER-3-01", "Sangeet — stage", "3:2"),
      mockImage("PROJ-rinki-aditya-CHAPTER-3-02", "Sangeet — dance", "4:5"),
      mockImage("PROJ-rinki-aditya-CHAPTER-4-01", "Wedding — Subho Drishti", "4:5"),
      mockImage("PROJ-rinki-aditya-CHAPTER-4-02", "Wedding — Saat Paak", "3:2"),
      mockImage("PROJ-rinki-aditya-CHAPTER-5-01", "Reception — Bou Bhaat", "3:2"),
      mockImage("PROJ-rinki-aditya-CHAPTER-5-02", "Reception — couple portrait", "4:5"),
    ],
    specs: [
      { label: "Guests", value: "420" },
      { label: "Days", value: "4" },
      { label: "Venues", value: "3" },
    ],
    chapters: [
      {
        slug: "haldi",
        name: "Haldi",
        description:
          "TODO: Morning of day one — the family courtyard wrapped in yellow marigold strings and white linen.",
        images: [
          mockImage("PROJ-rinki-aditya-CHAPTER-1-01", "Haldi — yellow ritual", "4:5"),
          mockImage("PROJ-rinki-aditya-CHAPTER-1-02", "Haldi — family", "3:2"),
          mockImage("PROJ-rinki-aditya-CHAPTER-1-03", "Haldi — bride", "4:5"),
        ],
      },
      {
        slug: "mehendi",
        name: "Mehendi",
        description:
          "TODO: Afternoon — low brass stools, marigold canopy, a courtyard lit by 200 oil lamps as dusk fell.",
        images: [
          mockImage("PROJ-rinki-aditya-CHAPTER-2-01", "Mehendi — palms", "1:1"),
          mockImage("PROJ-rinki-aditya-CHAPTER-2-02", "Mehendi — courtyard", "16:9"),
          mockImage("PROJ-rinki-aditya-CHAPTER-2-03", "Mehendi — diyas", "4:5"),
        ],
      },
      {
        slug: "sangeet",
        name: "Sangeet",
        description:
          "TODO: Evening of day two — a black-stage proscenium, custom gobos, and a live tabla and sitar ensemble.",
        images: [
          mockImage("PROJ-rinki-aditya-CHAPTER-3-01", "Sangeet — stage", "3:2"),
          mockImage("PROJ-rinki-aditya-CHAPTER-3-02", "Sangeet — dance", "4:5"),
          mockImage("PROJ-rinki-aditya-CHAPTER-3-03", "Sangeet — guests", "16:9"),
        ],
      },
      {
        slug: "wedding",
        name: "Wedding",
        description:
          "TODO: Subho Drishti through Saat Paak, with a single red sari draped behind the mandap as the dominant motif.",
        images: [
          mockImage("PROJ-rinki-aditya-CHAPTER-4-01", "Wedding — Subho Drishti", "4:5"),
          mockImage("PROJ-rinki-aditya-CHAPTER-4-02", "Wedding — Saat Paak", "3:2"),
          mockImage("PROJ-rinki-aditya-CHAPTER-4-03", "Wedding — Sindoor Daan", "4:5"),
        ],
      },
      {
        slug: "reception",
        name: "Reception",
        description:
          "TODO: Bou Bhaat on the riverside lawn — brass lanterns, jasmine veils, a 40-piece sit-down menu.",
        images: [
          mockImage("PROJ-rinki-aditya-CHAPTER-5-01", "Reception — Bou Bhaat", "3:2"),
          mockImage("PROJ-rinki-aditya-CHAPTER-5-02", "Reception — couple", "4:5"),
          mockImage("PROJ-rinki-aditya-CHAPTER-5-03", "Reception — lawn dusk", "16:9"),
        ],
      },
    ],
    stats: [
      { label: "Jasmine flowers", value: 40000 },
      { label: "Metres of fabric", value: 200, unit: "m" },
      { label: "Stages built", value: 4 },
      { label: "Lighting cues", value: 18 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Photography", name: "TODO Studio" },
      { role: "Florist", name: "TODO Floral Atelier" },
      { role: "Lighting", name: "TODO Lighting" },
      { role: "Catering", name: "TODO Caterers" },
    ],
    priceBand: "₹₹₹",
    nextProjectSlug: "arpita-sanjay-marwari-wedding-2025",
  },
  {
    title: "Arpita & Sanjay · Marwari Wedding",
    slug: "arpita-sanjay-marwari-wedding-2025",
    status: "published",
    category: "wedding",
    ceremonyName: "Marwari Wedding",
    locationSlug: "siliguri",
    locationName: "Siliguri",
    year: 2025,
    date: "2025-04-22",
    tagline: "Tilak, Mahira Dastoor, Pithi — staged in saffron and ivory.",
    brief:
      "TODO: A traditional Marwari wedding for 600 guests across three days. The brief: classical Rajasthani motifs filtered through a restrained palette.",
    setting:
      "TODO: A garden estate near Sevoke Road and a banquet hall for the main wedding — both treated as one continuous set.",
    designStory:
      "TODO: Saffron, ivory, bandhej. A canopy of mirror-work umbrellas above the baraat path. The mandap built from carved teak rented from Jaipur.",
    clientNote: {
      author: "Arpita & Sanjay",
      role: "Bride and groom",
      quote: "TODO: Every Marwari ritual got its own room, its own light, its own palette.",
    },
    excerpt: "Marwari wedding · Siliguri · April 2025",
    coverImage: mockImage("PROJ-arpita-sanjay-COVER", "Mirror-work canopy at baraat", "16:9"),
    closingImage: mockImage("PROJ-arpita-sanjay-CLOSING", "Mandap under saffron silk", "16:9"),
    briefImage: mockImage("PROJ-arpita-sanjay-BRIEF", "Saffron and ivory detail", "4:5"),
    settingImages: [
      mockImage("PROJ-arpita-sanjay-SETTING-01", "Garden estate dusk", "3:2"),
      mockImage("PROJ-arpita-sanjay-SETTING-02", "Banquet hall before setup", "3:2"),
      mockImage("PROJ-arpita-sanjay-SETTING-03", "Baraat path", "3:2"),
      mockImage("PROJ-arpita-sanjay-SETTING-04", "Mandap from above", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-arpita-sanjay-DESIGN-01", "Carved teak mandap", "4:5"),
      mockImage("PROJ-arpita-sanjay-DESIGN-02", "Mirror-work detail", "1:1"),
      mockImage("PROJ-arpita-sanjay-DESIGN-03", "Bandhej drapery", "4:5"),
    ],
    galleryImages: [
      mockImage("PROJ-arpita-sanjay-CHAPTER-1-01", "Tilak ceremony", "3:2"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-1-02", "Tilak — close-up", "4:5"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-2-01", "Mahira Dastoor", "1:1"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-2-02", "Mahira Dastoor — family", "16:9"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-3-01", "Pithi — turmeric", "3:2"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-4-01", "Wedding — mandap", "4:5"),
      mockImage("PROJ-arpita-sanjay-CHAPTER-5-01", "Reception — stage", "3:2"),
    ],
    specs: [
      { label: "Guests", value: "600" },
      { label: "Days", value: "3" },
      { label: "Venues", value: "2" },
    ],
    chapters: [
      {
        slug: "tilak",
        name: "Tilak",
        description: "TODO: Opening ritual — saffron and gold under a ribbon-laced canopy.",
        images: [
          mockImage("PROJ-arpita-sanjay-CHAPTER-1-01", "Tilak ceremony", "4:5"),
          mockImage("PROJ-arpita-sanjay-CHAPTER-1-02", "Tilak — close-up", "3:2"),
        ],
      },
      {
        slug: "mahira-dastoor",
        name: "Mahira Dastoor",
        description: "TODO: A family-only afternoon — low seating, ivory canopy.",
        images: [
          mockImage("PROJ-arpita-sanjay-CHAPTER-2-01", "Mahira Dastoor", "1:1"),
          mockImage("PROJ-arpita-sanjay-CHAPTER-2-02", "Mahira Dastoor — family", "16:9"),
        ],
      },
      {
        slug: "pithi",
        name: "Pithi",
        description: "TODO: Turmeric ritual — set in the open courtyard with a marigold canopy.",
        images: [mockImage("PROJ-arpita-sanjay-CHAPTER-3-01", "Pithi — turmeric", "3:2")],
      },
      {
        slug: "wedding",
        name: "Wedding",
        description: "TODO: The main wedding — saat phera under a carved teak mandap.",
        images: [mockImage("PROJ-arpita-sanjay-CHAPTER-4-01", "Wedding — mandap", "4:5")],
      },
      {
        slug: "reception",
        name: "Reception",
        description: "TODO: A banquet reception staged like a slow film.",
        images: [mockImage("PROJ-arpita-sanjay-CHAPTER-5-01", "Reception — stage", "3:2")],
      },
    ],
    stats: [
      { label: "Marigold strings", value: 1200, unit: "m" },
      { label: "Mirror-work umbrellas", value: 36 },
      { label: "Stages built", value: 3 },
      { label: "Lighting cues", value: 22 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Photography", name: "TODO Studio" },
      { role: "Florist", name: "TODO Floral Atelier" },
      { role: "Mandap fabrication", name: "TODO Jaipur Workshop" },
    ],
    priceBand: "₹₹₹",
    nextProjectSlug: "tea-garden-destination-darjeeling-2025",
  },
  {
    title: "A Tea Garden Wedding · Darjeeling",
    slug: "tea-garden-destination-darjeeling-2025",
    status: "published",
    category: "wedding",
    ceremonyName: "Destination Wedding",
    locationSlug: "darjeeling",
    locationName: "Darjeeling",
    year: 2025,
    date: "2025-05-14",
    tagline: "Two days, one ridge, eighty guests, mist on cue.",
    brief:
      "TODO: An intimate wedding for 80 guests on a working tea estate in the Darjeeling hills. The brief: let the landscape do the heavy lifting.",
    setting:
      "TODO: A century-old planter's bungalow and the tea garden ridge below it. Mist arrived on schedule.",
    designStory:
      "TODO: White linen, pale-green eucalyptus, copper. The mandap was a single carved wooden arch set against the ridgeline.",
    clientNote: {
      author: "Aanya & Reuben",
      role: "Bride and groom",
      quote: "TODO: They didn't decorate the venue. They framed it.",
    },
    excerpt: "Destination wedding · Darjeeling · May 2025",
    coverImage: mockImage("PROJ-tea-garden-COVER", "Wooden mandap on the ridge at dawn", "16:9"),
    closingImage: mockImage("PROJ-tea-garden-CLOSING", "Dinner table at dusk on ridge", "16:9"),
    briefImage: mockImage("PROJ-tea-garden-BRIEF", "Eucalyptus and copper detail", "4:5"),
    settingImages: [
      mockImage("PROJ-tea-garden-SETTING-01", "Planter's bungalow morning", "3:2"),
      mockImage("PROJ-tea-garden-SETTING-02", "Tea garden ridge", "16:9"),
      mockImage("PROJ-tea-garden-SETTING-03", "Mist over rows", "3:2"),
      mockImage("PROJ-tea-garden-SETTING-04", "Lantern path at dusk", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-tea-garden-DESIGN-01", "Wooden arch mandap", "4:5"),
      mockImage("PROJ-tea-garden-DESIGN-02", "Copper place card", "1:1"),
      mockImage("PROJ-tea-garden-DESIGN-03", "Eucalyptus garland", "4:5"),
    ],
    galleryImages: [
      mockImage("PROJ-tea-garden-CHAPTER-1-01", "Welcome tea", "3:2"),
      mockImage("PROJ-tea-garden-CHAPTER-1-02", "Garden walk", "16:9"),
      mockImage("PROJ-tea-garden-CHAPTER-2-01", "Wedding — vows", "4:5"),
      mockImage("PROJ-tea-garden-CHAPTER-2-02", "Wedding — ridgeline", "16:9"),
      mockImage("PROJ-tea-garden-CHAPTER-3-01", "Dinner — long table", "3:2"),
      mockImage("PROJ-tea-garden-CHAPTER-3-02", "Dinner — lanterns", "4:5"),
    ],
    specs: [
      { label: "Guests", value: "80" },
      { label: "Days", value: "2" },
      { label: "Altitude", value: "1,950 m" },
    ],
    chapters: [
      {
        slug: "welcome",
        name: "Welcome tea",
        description: "TODO: Arrival ceremony on the bungalow veranda — first-flush teas on copper.",
        images: [
          mockImage("PROJ-tea-garden-CHAPTER-1-01", "Welcome tea", "3:2"),
          mockImage("PROJ-tea-garden-CHAPTER-1-02", "Garden walk", "16:9"),
        ],
      },
      {
        slug: "wedding",
        name: "Wedding",
        description: "TODO: Vows on the ridge — a single wooden arch, eucalyptus, mist.",
        images: [
          mockImage("PROJ-tea-garden-CHAPTER-2-01", "Wedding — vows", "4:5"),
          mockImage("PROJ-tea-garden-CHAPTER-2-02", "Wedding — ridgeline", "16:9"),
        ],
      },
      {
        slug: "dinner",
        name: "Long-table dinner",
        description: "TODO: A 40-metre long table down the ridge, lit by 120 copper lanterns.",
        images: [
          mockImage("PROJ-tea-garden-CHAPTER-3-01", "Dinner — long table", "3:2"),
          mockImage("PROJ-tea-garden-CHAPTER-3-02", "Dinner — lanterns", "4:5"),
        ],
      },
    ],
    stats: [
      { label: "Copper lanterns", value: 120 },
      { label: "Eucalyptus stems", value: 800 },
      { label: "Long-table length", value: 40, unit: "m" },
      { label: "Hours of natural light", value: 11 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Photography", name: "TODO Studio" },
      { role: "Florist", name: "TODO Floral Atelier" },
      { role: "Venue", name: "TODO Tea Estate" },
    ],
    priceBand: "₹₹₹",
    nextProjectSlug: "rohit-50th-birthday-2026",
  },
  {
    title: "Rohit · 50th Birthday",
    slug: "rohit-50th-birthday-2026",
    status: "published",
    category: "birthday",
    ceremonyName: "Birthday",
    locationSlug: "siliguri",
    locationName: "Siliguri",
    year: 2026,
    date: "2026-01-19",
    tagline: "A black-tie supper club, in five hours flat.",
    brief: "TODO: A 50th birthday for 120 guests, dressed as a one-night supper club.",
    setting:
      "TODO: A converted warehouse on Sevoke Road, transformed in five hours from empty shell to 30s jazz club.",
    designStory:
      "TODO: Black velvet, brass, dim amber. A live trio at one end, twelve round tables at the other.",
    clientNote: {
      author: "Rohit",
      role: "Host",
      quote: "TODO: They built a private club for one night. I wish I could keep it.",
    },
    excerpt: "50th birthday · Siliguri · January 2026",
    coverImage: mockImage("PROJ-rohit-50-COVER", "Black-tie supper club hall", "16:9"),
    closingImage: mockImage("PROJ-rohit-50-CLOSING", "Stage and trio at midnight", "16:9"),
    briefImage: mockImage("PROJ-rohit-50-BRIEF", "Brass candelabra detail", "4:5"),
    settingImages: [
      mockImage("PROJ-rohit-50-SETTING-01", "Empty warehouse — before", "3:2"),
      mockImage("PROJ-rohit-50-SETTING-02", "Dressed hall", "3:2"),
      mockImage("PROJ-rohit-50-SETTING-03", "Stage detail", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-rohit-50-DESIGN-01", "Brass candelabra", "4:5"),
      mockImage("PROJ-rohit-50-DESIGN-02", "Velvet banquette", "1:1"),
      mockImage("PROJ-rohit-50-DESIGN-03", "Menu and place card", "4:5"),
    ],
    galleryImages: [
      mockImage("PROJ-rohit-50-CHAPTER-1-01", "Arrival cocktails", "3:2"),
      mockImage("PROJ-rohit-50-CHAPTER-2-01", "Dinner service", "4:5"),
      mockImage("PROJ-rohit-50-CHAPTER-3-01", "Trio on stage", "3:2"),
    ],
    specs: [
      { label: "Guests", value: "120" },
      { label: "Hours of build", value: "5" },
      { label: "Tables", value: "12" },
    ],
    chapters: [
      {
        slug: "arrival",
        name: "Arrival",
        description: "TODO: Welcome cocktails at a long brass bar.",
        images: [mockImage("PROJ-rohit-50-CHAPTER-1-01", "Arrival cocktails", "3:2")],
      },
      {
        slug: "dinner",
        name: "Dinner",
        description: "TODO: Seated dinner with a five-course tasting menu.",
        images: [mockImage("PROJ-rohit-50-CHAPTER-2-01", "Dinner service", "4:5")],
      },
      {
        slug: "show",
        name: "The show",
        description: "TODO: A live jazz trio and a surprise gospel finale.",
        images: [mockImage("PROJ-rohit-50-CHAPTER-3-01", "Trio on stage", "3:2")],
      },
    ],
    stats: [
      { label: "Candles burning", value: 280 },
      { label: "Hours of music", value: 4 },
      { label: "Velvet metres", value: 90, unit: "m" },
      { label: "Lighting cues", value: 14 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Photography", name: "TODO Studio" },
      { role: "Lighting", name: "TODO Lighting" },
      { role: "Music", name: "TODO Trio" },
    ],
    priceBand: "₹₹",
    nextProjectSlug: "mukherjee-annaprashan-2025",
  },
  {
    title: "Mukherjee · Annaprashan",
    slug: "mukherjee-annaprashan-2025",
    status: "published",
    category: "annaprashan",
    ceremonyName: "Annaprashan",
    locationSlug: "siliguri",
    locationName: "Siliguri",
    year: 2025,
    date: "2025-08-03",
    tagline: "A rice ceremony for sixty, staged like an editorial.",
    brief:
      "TODO: A family-only Annaprashan for 60 guests. The brief: gentle, white, the baby is the only headline.",
    setting:
      "TODO: A flat in central Siliguri, two rooms re-set as one editorial space.",
    designStory:
      "TODO: White cotton, palm leaves, brass thala. A single chair for the baby, framed by a wreath of jasmine.",
    clientNote: {
      author: "The Mukherjee family",
      quote: "TODO: It felt like an editorial we'd been waiting to be in.",
    },
    excerpt: "Annaprashan · Siliguri · August 2025",
    coverImage: mockImage("PROJ-mukherjee-COVER", "Baby's chair with jasmine wreath", "16:9"),
    closingImage: mockImage("PROJ-mukherjee-CLOSING", "Family around brass thala", "16:9"),
    briefImage: mockImage("PROJ-mukherjee-BRIEF", "Palm-leaf and brass detail", "4:5"),
    settingImages: [
      mockImage("PROJ-mukherjee-SETTING-01", "Flat — before", "3:2"),
      mockImage("PROJ-mukherjee-SETTING-02", "Flat — after", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-mukherjee-DESIGN-01", "Jasmine wreath detail", "4:5"),
      mockImage("PROJ-mukherjee-DESIGN-02", "Brass thala close-up", "1:1"),
    ],
    galleryImages: [
      mockImage("PROJ-mukherjee-CHAPTER-1-01", "Ritual moment", "4:5"),
      mockImage("PROJ-mukherjee-CHAPTER-1-02", "Family looking on", "3:2"),
      mockImage("PROJ-mukherjee-CHAPTER-2-01", "Lunch service", "3:2"),
    ],
    specs: [
      { label: "Guests", value: "60" },
      { label: "Duration", value: "1 day" },
      { label: "Rooms staged", value: "2" },
    ],
    chapters: [
      {
        slug: "ritual",
        name: "Ritual",
        description: "TODO: The Annaprashan ritual — first rice from the maternal uncle.",
        images: [
          mockImage("PROJ-mukherjee-CHAPTER-1-01", "Ritual moment", "4:5"),
          mockImage("PROJ-mukherjee-CHAPTER-1-02", "Family looking on", "3:2"),
        ],
      },
      {
        slug: "lunch",
        name: "Lunch",
        description: "TODO: A seven-course Bengali thali on banana leaves.",
        images: [mockImage("PROJ-mukherjee-CHAPTER-2-01", "Lunch service", "3:2")],
      },
    ],
    stats: [
      { label: "Jasmine strings", value: 80, unit: "m" },
      { label: "Banana-leaf thalis", value: 60 },
      { label: "Brass diyas", value: 24 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Photography", name: "TODO Studio" },
      { role: "Catering", name: "TODO Caterers" },
    ],
    priceBand: "₹",
    nextProjectSlug: "prestige-corporate-launch-2026",
  },
  {
    title: "Prestige · Corporate Launch",
    slug: "prestige-corporate-launch-2026",
    status: "published",
    category: "corporate",
    ceremonyName: "Corporate Launch",
    locationSlug: "siliguri",
    locationName: "Siliguri",
    year: 2026,
    date: "2026-03-11",
    tagline: "A product launch staged as a 90-minute film.",
    brief:
      "TODO: A regional product launch for 240 attendees. The brief: 90 minutes from arrival to applause, no slack.",
    setting:
      "TODO: A black-box theatre in central Siliguri, fully draped, with three reveal moments.",
    designStory:
      "TODO: Three colour states — graphite, indigo, brass. Each cued to a chapter in the keynote.",
    clientNote: {
      author: "Prestige India",
      role: "Client",
      quote: "TODO: We've launched four times before. This was the only one that felt directed.",
    },
    excerpt: "Corporate launch · Siliguri · March 2026",
    coverImage: mockImage("PROJ-prestige-COVER", "Black-box stage during keynote", "16:9"),
    closingImage: mockImage("PROJ-prestige-CLOSING", "Applause moment — confetti", "16:9"),
    briefImage: mockImage("PROJ-prestige-BRIEF", "Stage lighting plot", "4:5"),
    settingImages: [
      mockImage("PROJ-prestige-SETTING-01", "Theatre — empty", "3:2"),
      mockImage("PROJ-prestige-SETTING-02", "Theatre — full", "3:2"),
      mockImage("PROJ-prestige-SETTING-03", "Foyer lounge", "3:2"),
    ],
    designImages: [
      mockImage("PROJ-prestige-DESIGN-01", "Indigo lighting state", "4:5"),
      mockImage("PROJ-prestige-DESIGN-02", "Brass reveal moment", "1:1"),
      mockImage("PROJ-prestige-DESIGN-03", "Graphite proscenium", "4:5"),
    ],
    galleryImages: [
      mockImage("PROJ-prestige-CHAPTER-1-01", "Arrival foyer", "3:2"),
      mockImage("PROJ-prestige-CHAPTER-2-01", "Keynote", "16:9"),
      mockImage("PROJ-prestige-CHAPTER-3-01", "Reception drinks", "4:5"),
    ],
    specs: [
      { label: "Attendees", value: "240" },
      { label: "Runtime", value: "90 min" },
      { label: "Reveal cues", value: "3" },
    ],
    chapters: [
      {
        slug: "arrival",
        name: "Arrival",
        description: "TODO: Foyer lounge — light graphite, soft jazz, branded cocktails.",
        images: [mockImage("PROJ-prestige-CHAPTER-1-01", "Arrival foyer", "3:2")],
      },
      {
        slug: "keynote",
        name: "Keynote",
        description: "TODO: 45-minute keynote with three light states and a product reveal.",
        images: [mockImage("PROJ-prestige-CHAPTER-2-01", "Keynote", "16:9")],
      },
      {
        slug: "reception",
        name: "Reception",
        description: "TODO: Post-launch reception with live press wall and dinner stations.",
        images: [mockImage("PROJ-prestige-CHAPTER-3-01", "Reception drinks", "4:5")],
      },
    ],
    stats: [
      { label: "Lighting cues", value: 36 },
      { label: "Square metres of stage", value: 220, unit: "m²" },
      { label: "Reveal moments", value: 3 },
      { label: "Crew", value: 28 },
    ],
    credits: [
      { role: "Decor & Design", name: "Siligurievent Studio" },
      { role: "Stage & Lighting", name: "TODO Stagecraft" },
      { role: "AV", name: "TODO AV Co." },
      { role: "Production", name: "TODO Production" },
    ],
    priceBand: "₹₹₹",
    nextProjectSlug: "rinki-aditya-bengali-wedding-2025",
  },
];

// ---------------------------------------------------------------------------
// Public helpers — async to mirror the future Payload-backed implementation.
// ---------------------------------------------------------------------------

/**
 * List published projects, optionally filtered and paginated.
 * Stable ordering by date desc for deterministic SSG.
 */
export async function listProjects(
  options: PortfolioFilterOptions = {},
): Promise<PortfolioPage> {
  const { category, year, location, page = 1, pageSize = 9 } = options;

  const filtered = PROJECTS.filter((p) => p.status === "published")
    .filter((p) => (category ? p.category === category : true))
    .filter((p) => (year ? p.year === year : true))
    .filter((p) => (location ? p.locationSlug === location : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const total = filtered.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    hasNext: start + items.length < total,
  };
}

/** Fetch a single project by slug. Returns `null` if missing or unpublished. */
export async function getProjectBySlug(
  slug: string,
): Promise<PortfolioProject | null> {
  const project = PROJECTS.find(
    (p) => p.slug === slug && p.status === "published",
  );
  return project ?? null;
}

/** Slug list for `generateStaticParams`. */
export async function listProjectSlugs(): Promise<ReadonlyArray<string>> {
  return PROJECTS.filter((p) => p.status === "published").map((p) => p.slug);
}

/** Facets for the filter rail — distinct categories / years / locations. */
export async function getPortfolioFacets(): Promise<PortfolioFacets> {
  const published = PROJECTS.filter((p) => p.status === "published");

  const categoryMap = new Map<string, { label: string; count: number }>();
  const yearMap = new Map<number, number>();
  const locationMap = new Map<string, { label: string; count: number }>();

  for (const p of published) {
    const existingCat = categoryMap.get(p.category);
    categoryMap.set(p.category, {
      label: humaniseCategory(p.category),
      count: (existingCat?.count ?? 0) + 1,
    });

    yearMap.set(p.year, (yearMap.get(p.year) ?? 0) + 1);

    const slugForLocation = String(p.locationSlug);
    const existingLoc = locationMap.get(slugForLocation);
    locationMap.set(slugForLocation, {
      label: p.locationName,
      count: (existingLoc?.count ?? 0) + 1,
    });
  }

  return {
    categories: Array.from(categoryMap.entries())
      .map(([slug, v]) => ({ slug, label: v.label, count: v.count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    years: Array.from(yearMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.value - a.value),
    locations: Array.from(locationMap.entries())
      .map(([slug, v]) => ({ slug, label: v.label, count: v.count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}

/**
 * Resolve the "Up next" project for a case study. Honors `nextProjectSlug`
 * with graceful fallback to the next-newest published project.
 */
export async function getNextProject(
  slug: string,
): Promise<PortfolioProject | null> {
  const current = await getProjectBySlug(slug);
  if (!current) return null;

  const explicit = await getProjectBySlug(current.nextProjectSlug);
  if (explicit) return explicit;

  const published = PROJECTS.filter(
    (p) => p.status === "published" && p.slug !== slug,
  ).sort((a, b) => (a.date < b.date ? 1 : -1));

  return published[0] ?? null;
}

function humaniseCategory(category: string): string {
  return category
    .split("-")
    .map((part) =>
      part.length === 0 ? part : `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`,
    )
    .join(" ");
}

// ---------------------------------------------------------------------------
// Back-compat helpers (used by /locations/[slug])
// ---------------------------------------------------------------------------

function toLightProject(p: PortfolioProject): Project {
  return {
    slug: p.slug,
    title: p.title,
    ceremony: p.ceremonyName,
    year: p.year,
    locationSlug: p.locationSlug as LocationSlug,
    brief: p.brief,
    coverImageUrl: p.coverImage.src,
  };
}

export function getAllProjects(): ReadonlyArray<Project> {
  return PROJECTS.filter((p) => p.status === "published").map(toLightProject);
}

export function getProjectsByLocation(
  slug: LocationSlug,
): ReadonlyArray<Project> {
  return PROJECTS.filter(
    (p) => p.status === "published" && (p.locationSlug as LocationSlug) === slug,
  ).map(toLightProject);
}
