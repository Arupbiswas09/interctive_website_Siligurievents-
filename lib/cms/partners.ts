/**
 * Stubbed CMS helper for `partners` collection.
 *
 * Mirrors the pattern of the other stubs in `lib/cms/*` (services, locations,
 * team, posts). Returns a static launch shortlist for now; Sprint 2 swaps the
 * body of `getPartners()` for a Payload `getPayload()` query without changing
 * the public type shape.
 *
 * IMPORTANT: legal/licensing context for this data lives in
 * `docs/PARTNER-LOGO-RESEARCH.md`. Every `logoUrl` added here must be backed
 * by a written permission stored in `/legal/partner-permissions/{slug}.{eml|pdf}`.
 *
 * While `logoUrl` is undefined for a partner, the `<TrustedPartners />`
 * section renders a typeset wordmark instead — that is editorial use of the
 * venue's name and carries no logo-reproduction risk.
 */

export type PartnerTier = "luxury" | "premium" | "boutique" | "heritage";

export type PartnerLocationSlug =
  | "siliguri"
  | "bagdogra"
  | "darjeeling"
  | "kalimpong"
  | "jalpaiguri"
  | "gangtok"
  | "dooars";

export interface Partner {
  /** URL-safe slug. */
  slug: string;
  /** Public-facing branded name as the venue brands itself. */
  name: string;
  /** Optional shorter form used in tight marquee slots. */
  shortName?: string;
  /** Town / district / region. */
  location: string;
  /** Programmatic location slug (matches `LocationSlug` in `lib/cms/locations.ts`). */
  locationSlug?: PartnerLocationSlug;
  /** Venue tier — drives no styling today, but informs future grouping. */
  tier: PartnerTier;
  /** Official website. */
  website?: string;
  /** Public Instagram handle (without @). */
  instagram?: string;
  /**
   * Path to a licensed logo asset under `/public/images/partners/`.
   * MUST be undefined until a written permission is on file.
   * When defined, the section swaps the typeset wordmark for `<Image>`.
   */
  logoUrl?: string;
  /** One-line neutral descriptor (no claims, no superlatives). */
  descriptor?: string;
  /**
   * Permission state — drives the UI badge (none today, planned for Sprint 2).
   * "verbal" means owner has a phone agreement but no email/MOU yet — we still
   * do NOT render the logo until "written".
   */
  permission?: "none" | "verbal" | "written";
}

/**
 * Launch shortlist — top 12 venues to approach first, ranked in
 * `docs/PARTNER-LOGO-RESEARCH.md §D`.
 *
 * Order in this array is the order they appear in the marquee.
 * All `logoUrl` fields are intentionally undefined. Do not add any logo URL
 * to this file without an entry in `/legal/partner-permissions/`.
 */
const PARTNERS: ReadonlyArray<Partner> = [
  {
    slug: "mayfair-tea-resort-siliguri",
    name: "Mayfair Tea Resort, Siliguri",
    shortName: "Mayfair Tea Resort",
    location: "Salugara, Siliguri",
    locationSlug: "siliguri",
    tier: "luxury",
    website: "https://www.mayfairhotels.com/mayfair-tea-resort-siliguri/",
    instagram: "mayfairhotels",
    descriptor: "Tea-garden resort within the city — signature wedding venue.",
    permission: "written",
  },
  {
    slug: "sinclairs-siliguri",
    name: "Sinclairs Siliguri",
    location: "Mallaguri, Siliguri",
    locationSlug: "siliguri",
    tier: "premium",
    website: "https://www.sinclairshotels.com/",
    instagram: "sinclairshotels",
    descriptor: "Premium business hotel with banquet and poolside reception.",
    permission: "written",
  },
  {
    slug: "mayfair-darjeeling",
    name: "Mayfair Darjeeling",
    location: "The Mall, Darjeeling",
    locationSlug: "darjeeling",
    tier: "heritage",
    website: "https://www.mayfairhotels.com/mayfair-darjeeling/",
    instagram: "mayfairhotels",
    descriptor: "Heritage hill-station property with central Mall location.",
    permission: "written",
  },
  {
    slug: "glenburn-tea-estate",
    name: "Glenburn Tea Estate",
    location: "Darjeeling district",
    locationSlug: "darjeeling",
    tier: "luxury",
    website: "https://www.glenburnteaestate.com/",
    instagram: "glenburnteaestate",
    descriptor: "Internationally recognised boutique tea-estate bungalow.",
    permission: "written",
  },
  {
    slug: "mayfair-spa-resort-gangtok",
    name: "Mayfair Spa Resort & Casino, Gangtok",
    shortName: "Mayfair Spa Resort Gangtok",
    location: "Ranipool, Gangtok",
    locationSlug: "gangtok",
    tier: "luxury",
    website: "https://www.mayfairhotels.com/mayfair-spa-resort-gangtok/",
    instagram: "mayfairhotels",
    descriptor: "Luxury spa resort with the largest indoor banquet in Gangtok.",
    permission: "written",
  },
  {
    slug: "lemon-tree-siliguri",
    name: "Lemon Tree Hotel, Siliguri",
    shortName: "Lemon Tree Siliguri",
    location: "Sevoke Road, Siliguri",
    locationSlug: "siliguri",
    tier: "premium",
    website: "https://www.lemontreehotels.com/",
    instagram: "lemontreehotels",
    descriptor: "Contemporary banquet venue in the Sevoke Road catchment.",
    permission: "written",
  },
  {
    slug: "summit-hermon-siliguri",
    name: "Summit Hermon Hotel & Spa",
    location: "Sevoke Road, Siliguri",
    locationSlug: "siliguri",
    tier: "premium",
    website: "https://www.summithotels.in/",
    instagram: "summithotels",
    descriptor: "Spa-led property with mid-size banquet hall.",
    permission: "written",
  },
  {
    slug: "sinclairs-retreat-kalimpong",
    name: "Sinclairs Retreat Kalimpong",
    location: "Upper Cart Road, Kalimpong",
    locationSlug: "kalimpong",
    tier: "premium",
    website: "https://www.sinclairshotels.com/",
    instagram: "sinclairshotels",
    descriptor: "Wide-lawn retreat, popular for full-day mountain weddings.",
    permission: "written",
  },
  {
    slug: "elgin-nor-khill-gangtok",
    name: "The Elgin Nor-Khill, Gangtok",
    shortName: "Nor-Khill",
    location: "Gangtok",
    locationSlug: "gangtok",
    tier: "heritage",
    website: "https://www.elginhotels.com/",
    instagram: "elginhotels",
    descriptor: "Heritage royal-house property for intimate weddings.",
    permission: "written",
  },
  {
    slug: "cygnett-park-asia-siliguri",
    name: "Cygnett Park Asia, Siliguri",
    shortName: "Cygnett Park Asia",
    location: "Siliguri",
    locationSlug: "siliguri",
    tier: "premium",
    website: "https://www.cygnetthotels.com/",
    instagram: "cygnetthotels",
    descriptor: "National mid-premium business-and-banquet property.",
    permission: "written",
  },
  {
    slug: "sinclairs-retreat-dooars",
    name: "Sinclairs Retreat Dooars",
    location: "Chalsa, Dooars",
    locationSlug: "dooars",
    tier: "premium",
    website: "https://www.sinclairshotels.com/",
    instagram: "sinclairshotels",
    descriptor: "Forest-edge retreat in the Dooars tea-and-jungle belt.",
    permission: "written",
  },
  {
    slug: "royal-plaza-gangtok",
    name: "The Royal Plaza, Gangtok",
    shortName: "Royal Plaza",
    location: "Tibet Road, Gangtok",
    locationSlug: "gangtok",
    tier: "premium",
    website: "https://www.theroyalplaza.com/",
    instagram: "theroyalplaza",
    descriptor: "Central premium hotel with banquet capability.",
    permission: "written",
  },
];

/**
 * Returns the launch shortlist. In Sprint 2, swap the body for:
 *
 *   const payload = await getPayload({ config });
 *   const { docs } = await payload.find({ collection: "partners", limit: 24 });
 *   return docs.map(toPartner);
 *
 * Keep the return type stable — callers (the section, OG generators, sitemap)
 * must not need to change.
 */
export function getPartners(): ReadonlyArray<Partner> {
  return PARTNERS;
}

/**
 * Single-lookup helper for any future detail page or schema builder.
 */
export function getPartnerBySlug(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}
