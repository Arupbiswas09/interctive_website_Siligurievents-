/**
 * CMS — Packages (stub).
 *
 * Sprint 2 will replace this with a typed Payload query. Until then we expose
 * the same shape so consumers (pricing page, schema builders, service pricing
 * teasers) can be wired without churn.
 *
 * Pricing rule (per docs/DECISIONS.md D-002):
 *   - Only `priceBand` ('₹' | '₹₹' | '₹₹₹') is exposed to public renderers.
 *   - `startingPriceInternal` stays admin-only and is NEVER exported by the
 *     CMS helpers used by public pages.
 */

import type { PriceBand } from "@/lib/seo/schemas";

export type PackageTier = "essence" | "signature" | "atelier";

export type PackageCategory =
  | "weddings"
  | "pre-wedding"
  | "birthdays"
  | "anniversaries"
  | "corporate"
  | "pujas";

export interface PackageCategoryMeta {
  slug: PackageCategory;
  label: string;
  blurb: string;
}

export const PACKAGE_CATEGORIES: ReadonlyArray<PackageCategoryMeta> = [
  {
    slug: "weddings",
    label: "Weddings",
    blurb:
      "Hindu, Bengali, Marwari, Nepali, Sikh, Muslim and Christian ceremonies.",
  },
  {
    slug: "pre-wedding",
    label: "Pre-wedding",
    blurb: "Haldi, Mehendi, Sangeet, Engagement and cocktail evenings.",
  },
  {
    slug: "birthdays",
    label: "Birthdays",
    blurb: "First birthdays, milestone parties, kid and adult celebrations.",
  },
  {
    slug: "anniversaries",
    label: "Anniversaries",
    blurb:
      "Silver, ruby, golden — intimate dinners through to grand receptions.",
  },
  {
    slug: "corporate",
    label: "Corporate",
    blurb: "Launches, summits, awards nights, hospitality activations.",
  },
  {
    slug: "pujas",
    label: "Pujas & Festivals",
    blurb: "Durga, Lakshmi, Saraswati pandals and private home pujas.",
  },
];

export interface Package {
  /** Stable identifier — combination of category + tier. */
  id: string;
  category: PackageCategory;
  tier: PackageTier;
  name: string;
  tagline: string;
  /** Public-facing band. Never include a numeric price. */
  priceBand: PriceBand;
  /** Free-text typical-range copy ("most ₹₹ weddings land between 50–120 guests"). */
  bandNote: string;
  includes: ReadonlyArray<string>;
  /** Surfaced as the "Signature / Recommended" card. */
  highlight: boolean;
}

const TIER_NAMES: Record<PackageTier, string> = {
  essence: "Essence",
  signature: "Signature",
  atelier: "Atelier",
};

const BAND_FOR_TIER: Record<PackageTier, PriceBand> = {
  essence: "₹",
  signature: "₹₹",
  atelier: "₹₹₹",
};

function makePackage(
  category: PackageCategory,
  tier: PackageTier,
  tagline: string,
  bandNote: string,
  includes: ReadonlyArray<string>,
): Package {
  return {
    id: `${category}-${tier}`,
    category,
    tier,
    name: TIER_NAMES[tier],
    tagline,
    priceBand: BAND_FOR_TIER[tier],
    bandNote,
    includes,
    highlight: tier === "signature",
  };
}

// 18 packages — 3 tiers × 6 categories. Stub copy that the owner can refine
// in Payload once Sprint 2 lands.
const PACKAGES: ReadonlyArray<Package> = [
  // — Weddings —
  makePackage(
    "weddings",
    "essence",
    "Intimate ceremonies, restrained styling.",
    "Most ₹ weddings land between 25–80 guests, single day, in-town venues.",
    [
      "Single-day decor for ceremony hall",
      "Curated stage backdrop and mandap",
      "Floral arrangement — seasonal palette",
      "Entry arch and guest seating styling",
      "Studio lighting basics",
      "On-day stylist and a four-person crew",
    ],
  ),
  makePackage(
    "weddings",
    "signature",
    "Two-day weddings, our recommended canvas.",
    "Most ₹₹ weddings land between 100–250 guests, 1–2 days, Siliguri to Bagdogra.",
    [
      "Two-day decor across ceremony and reception",
      "Bespoke mandap with imported florals",
      "Three styled lounges and selfie corners",
      "Layered architectural lighting cues",
      "Choreographed entry walk and pheras setup",
      "Dedicated lead stylist and ten-person crew",
      "On-day coordination with photo and catering",
    ],
  ),
  makePackage(
    "weddings",
    "atelier",
    "Multi-day destination weddings, full studio.",
    "Most ₹₹₹ weddings span 3–5 days, 300+ guests, across Darjeeling, Dooars, Sikkim border.",
    [
      "Full multi-day storyline across every chapter",
      "Custom-built sets, hand-stitched canopies, jasmine in volume",
      "Five lounges, two stages, full design language",
      "Cinematic lighting design with eighteen-plus cues",
      "Imported florals and material sourcing",
      "Logistics across venues and overnight changeovers",
      "Studio principal, lead stylist and twenty-five-person crew",
    ],
  ),

  // — Pre-wedding —
  makePackage(
    "pre-wedding",
    "essence",
    "Haldi or mehendi at home, sun-soaked and joyful.",
    "Most ₹ pre-wedding moments land between 30–60 guests, single function, daytime.",
    [
      "Single-function decor — haldi, mehendi or sangeet",
      "Marigold and tuberose-led floral palette",
      "Photo-ready seating swing or low majlis",
      "Backdrop and signage",
      "Daylight lighting touch-ups",
      "Stylist plus three-person on-day crew",
    ],
  ),
  makePackage(
    "pre-wedding",
    "signature",
    "Two-function evenings — mehendi to sangeet.",
    "Most ₹₹ pre-wedding spans span two functions across one day or a weekend.",
    [
      "Two functions decorated and changed-over",
      "Themed colour story across both events",
      "Custom backdrop and stage for sangeet",
      "Dance floor lighting design",
      "Floral installations and aisle styling",
      "Dedicated stylist and eight-person crew",
    ],
  ),
  makePackage(
    "pre-wedding",
    "atelier",
    "Full pre-wedding storyline.",
    "Most ₹₹₹ pre-wedding spans run 3+ functions across two days, often destination.",
    [
      "Three-plus functions with distinct themes",
      "Set-build for sangeet stage and haldi pavilion",
      "Imported florals and bespoke props",
      "Theatrical lighting plot and rehearsal cues",
      "End-to-end logistics across venues",
      "Studio principal and full crew",
    ],
  ),

  // — Birthdays —
  makePackage(
    "birthdays",
    "essence",
    "Intimate first-birthday or milestone parties.",
    "Most ₹ birthdays land between 20–50 guests, single venue.",
    [
      "Single-room decor — backdrop, table styling",
      "Themed balloon sculpture and floral mix",
      "Cake stand and dessert table styling",
      "Photo wall and signage",
      "Lighting touch-ups",
      "Stylist plus two-person crew",
    ],
  ),
  makePackage(
    "birthdays",
    "signature",
    "Themed birthdays with curated detail.",
    "Most ₹₹ birthdays span larger halls, 50–150 guests, custom storylines.",
    [
      "Full-room decor with themed entry arch",
      "Set-build for photo opportunities",
      "Bespoke cake stage and table runners",
      "Themed lighting and audio cues",
      "Custom signage and party favours",
      "Stylist plus six-person crew",
    ],
  ),
  makePackage(
    "birthdays",
    "atelier",
    "Statement parties — concept-led, immersive.",
    "Most ₹₹₹ birthdays are full venue takeovers with custom builds.",
    [
      "Concept design and mood-boarding",
      "Custom set-build and immersive entry sequence",
      "Imported florals and material sourcing",
      "Programmable lighting and AV",
      "Entertainment styling alignment",
      "Studio principal and twelve-person crew",
    ],
  ),

  // — Anniversaries —
  makePackage(
    "anniversaries",
    "essence",
    "Quiet dinners, elegant styling.",
    "Most ₹ anniversaries land between 10–30 guests, single space.",
    [
      "Intimate dining setup with linen styling",
      "Centerpiece florals and candle palette",
      "Backdrop and personalised signage",
      "Soft ambient lighting",
      "Stylist plus two-person crew",
    ],
  ),
  makePackage(
    "anniversaries",
    "signature",
    "Renewal-of-vows or milestone receptions.",
    "Most ₹₹ anniversaries land between 50–150 guests, evening reception.",
    [
      "Full-room reception decor",
      "Stage and photo wall design",
      "Floral arrangements and table styling",
      "Choreographed lighting cues",
      "Memory lane installation",
      "Stylist plus six-person crew",
    ],
  ),
  makePackage(
    "anniversaries",
    "atelier",
    "Grand silver / golden jubilees.",
    "Most ₹₹₹ anniversaries are full venue events with family programming.",
    [
      "Multi-zone decor — welcome, dining, dance floor",
      "Custom-built memory installation",
      "Imported florals and props",
      "Theatrical lighting plot",
      "Programmed entertainment cues",
      "Studio principal and ten-person crew",
    ],
  ),

  // — Corporate —
  makePackage(
    "corporate",
    "essence",
    "Boardroom dinners and quiet activations.",
    "Most ₹ corporate moments host 30–80 guests, single-room setups.",
    [
      "Single-room decor with brand-aligned palette",
      "Stage and signage",
      "Floral and table styling",
      "Ambient lighting",
      "On-day stylist and three-person crew",
    ],
  ),
  makePackage(
    "corporate",
    "signature",
    "Conferences, awards nights and launches.",
    "Most ₹₹ corporate events host 100–400 guests across a half-day to evening.",
    [
      "Full-venue branded decor",
      "Stage build with corporate identity",
      "Speaker and award area styling",
      "Programmable lighting and AV alignment",
      "Branded signage and wayfinding",
      "Stylist plus ten-person crew",
    ],
  ),
  makePackage(
    "corporate",
    "atelier",
    "Hospitality activations and multi-day summits.",
    "Most ₹₹₹ corporate events run multi-day with full venue takeovers.",
    [
      "Concept design and immersive set-build",
      "Multi-venue decor logistics",
      "Imported props and custom fabrication",
      "Programmable lighting plot and rehearsals",
      "Brand-immersion experiences",
      "Studio principal and twenty-person crew",
    ],
  ),

  // — Pujas & festivals —
  makePackage(
    "pujas",
    "essence",
    "Home pujas — Lakshmi, Saraswati, Ganesh.",
    "Most ₹ pujas are home-scale with focused mandir styling.",
    [
      "Mandir or altar decor with flowers and lamps",
      "Single-day setup and teardown",
      "Garlands and entrance arch",
      "Ritual-aligned palette and material",
      "Stylist plus two-person crew",
    ],
  ),
  makePackage(
    "pujas",
    "signature",
    "Community Durga or Lakshmi pandals.",
    "Most ₹₹ pujas span 3–5 days with mid-scale pandal styling.",
    [
      "Pandal interior decor and idol pedestal styling",
      "Themed entry gateway",
      "Daily floral refresh through the festival",
      "Lighting plot for aarti hours",
      "Stylist plus eight-person crew",
    ],
  ),
  makePackage(
    "pujas",
    "atelier",
    "Statement Durga Puja pandals — concept-led.",
    "Most ₹₹₹ pandals run full neighbourhood-scale themes across the festival week.",
    [
      "Full conceptual theme design",
      "Custom-built pandal architecture",
      "Imported and locally-sourced materials",
      "Aarti-hour lighting choreography",
      "Daily floral refresh and stewardship",
      "Studio principal and full crew on rotation",
    ],
  ),
];

/**
 * Public read — never includes internal pricing fields. Safe for any
 * Server Component to call.
 */
export async function getPackages(): Promise<ReadonlyArray<Package>> {
  return PACKAGES;
}

export async function getPackagesByCategory(
  category: PackageCategory,
): Promise<ReadonlyArray<Package>> {
  return PACKAGES.filter((p) => p.category === category);
}

export async function getCategories(): Promise<
  ReadonlyArray<PackageCategoryMeta>
> {
  return PACKAGE_CATEGORIES;
}

export function isPackageCategory(value: string): value is PackageCategory {
  return PACKAGE_CATEGORIES.some((c) => c.slug === value);
}
