/**
 * Mock locations data — stub for the Payload `locations` collection
 * defined in docs/08-CMS-PLAN.md §locations.
 *
 * Replace `getAllLocations` / `getLocationBySlug` with live Payload
 * queries in Sprint 2. Keep the public type shape stable so consumers
 * (pages, schema builders, sitemap) don't need to change.
 */

export type LocationSlug =
  | "siliguri"
  | "bagdogra"
  | "darjeeling"
  | "kalimpong"
  | "jalpaiguri"
  | "gangtok"
  | "dooars";

export interface LocationVenue {
  name: string;
  area: string;
  type: "hotel" | "resort" | "banquet" | "tea-garden" | "heritage" | "outdoor";
  notes: string;
}

export interface Location {
  slug: LocationSlug;
  name: string;
  /** Short label used in breadcrumbs and nav. */
  shortName: string;
  /** West Bengal / Sikkim. */
  region: string;
  country: string;
  /** Approx coordinates for `Place` schema. */
  latitude: number;
  longitude: number;
  /** Hero image (placeholder until Gemini imagery arrives). */
  heroImageUrl: string;
  /** One-line summary for cards. */
  tagline: string;
  /** Multi-paragraph area context for the location page. */
  introCopy: ReadonlyArray<string>;
  /** Distance from Siliguri (km). Useful for travel notes. */
  distanceFromSiliguriKm: number;
  /** Curated list of venues we know well. */
  venues: ReadonlyArray<LocationVenue>;
}

const LOCATIONS: ReadonlyArray<Location> = [
  {
    slug: "siliguri",
    name: "Siliguri",
    shortName: "Siliguri",
    region: "West Bengal",
    country: "IN",
    latitude: 26.7271,
    longitude: 88.3953,
    heroImageUrl: "/images/locations/siliguri-hero.jpg",
    tagline:
      "Our home ground — the gateway to North Bengal, Sikkim and the Dooars.",
    introCopy: [
      "Siliguri is where Siligurievent was founded, and where most of our weekly setups happen. The city sits at the foot of the Eastern Himalayas, an easy night drive from Kolkata and a short flight from Delhi or Bengaluru.",
      "From Sevoke Road banquets to riverside lawns past Mahananda Bridge, we have decorated weddings, receptions, sangeets, haldis, annaprashans and corporate evenings across every part of the city.",
      "Our warehouse, mandap workshop and floral coldroom are all within Siliguri, which means short build times, late-night last-minute changes, and tighter cost control than anyone shipping in from outside.",
    ],
    distanceFromSiliguriKm: 0,
    venues: [
      {
        name: "Mainak Tourist Lodge",
        area: "Sevoke Road",
        type: "banquet",
        notes:
          "Reliable government property, large lawn — works well for 300+ guests.",
      },
      {
        name: "Cinclus Hotel",
        area: "Sevoke Road",
        type: "hotel",
        notes: "Mid-range banquet, easy parking, our most frequent stage build.",
      },
      {
        name: "Sinclairs Siliguri",
        area: "Mallaguri",
        type: "hotel",
        notes: "Premium reception venue with poolside option.",
      },
      {
        name: "Mayfair Tea Resort",
        area: "Salugara",
        type: "resort",
        notes:
          "Tea-garden setting inside the city — popular for cinematic destination-style weddings.",
      },
    ],
  },
  {
    slug: "bagdogra",
    name: "Bagdogra",
    shortName: "Bagdogra",
    region: "West Bengal",
    country: "IN",
    latitude: 26.6981,
    longitude: 88.3286,
    heroImageUrl: "/images/locations/bagdogra-hero.jpg",
    tagline:
      "Resort weddings around the airport — easy arrivals, easy logistics.",
    introCopy: [
      "Bagdogra is the airport town for the entire North Bengal–Sikkim circuit. We design events here for families flying in from Delhi, Mumbai, Bengaluru and Kolkata, then driving on to Darjeeling or Sikkim later.",
      "The catchment around Bagdogra and Matigara has grown into a serious resort belt — air-conditioned banquet halls, lawn weddings and pool-deck receptions are all within 15 minutes of arrivals.",
    ],
    distanceFromSiliguriKm: 14,
    venues: [
      {
        name: "Cygnett Resort Mountain Breeze",
        area: "Bagdogra",
        type: "resort",
        notes: "Pool-deck reception, lawn for mandap.",
      },
      {
        name: "The Sonar Bangla Resort",
        area: "Matigara",
        type: "resort",
        notes: "Large open lawn — preferred for 400+ guest Bengali weddings.",
      },
    ],
  },
  {
    slug: "darjeeling",
    name: "Darjeeling",
    shortName: "Darjeeling",
    region: "West Bengal",
    country: "IN",
    latitude: 27.041,
    longitude: 88.2663,
    heroImageUrl: "/images/locations/darjeeling-hero.jpg",
    tagline:
      "Mountain weddings with Kanchenjunga in the frame — intimate, cinematic, rare.",
    introCopy: [
      "Darjeeling is for the small, considered wedding — 40 to 120 guests, a tea estate or a heritage hotel, and a mandap that frames the mountain instead of competing with it.",
      "We have decorated weddings in Glenburn, Sinclairs Retreat Kalimpong and a handful of private bungalows. Travel logistics matter here — narrow roads, weather, altitude — so we plan flowers and fabricated structures in two waves: one from Siliguri, one finished on site.",
    ],
    distanceFromSiliguriKm: 72,
    venues: [
      {
        name: "Glenburn Tea Estate",
        area: "Glenburn",
        type: "tea-garden",
        notes: "Boutique tea bungalow — fewer than 40 guests works best.",
      },
      {
        name: "Mayfair Darjeeling",
        area: "The Mall",
        type: "heritage",
        notes: "Heritage venue with views — needs careful flower budgeting.",
      },
    ],
  },
  {
    slug: "kalimpong",
    name: "Kalimpong",
    shortName: "Kalimpong",
    region: "West Bengal",
    country: "IN",
    latitude: 27.06,
    longitude: 88.4685,
    heroImageUrl: "/images/locations/kalimpong-hero.jpg",
    tagline:
      "A quieter alternative to Darjeeling — flower country, gentle weather, lovely light.",
    introCopy: [
      "Kalimpong has the same mountain backdrop as Darjeeling with less traffic and a wider choice of villa-style venues. The town is historically a flower-growing region — orchids and gerberas literally grow up the hill — which we lean into for the floral design.",
      "Most of our Kalimpong setups are 60–150 guests, often Marwari or Nepali weddings, with a strong emphasis on warm-white lighting and brass detailing.",
    ],
    distanceFromSiliguriKm: 70,
    venues: [
      {
        name: "Sinclairs Retreat Kalimpong",
        area: "Upper Cart Road",
        type: "resort",
        notes: "Wide lawn — works for mandap and stage on the same day.",
      },
      {
        name: "Silver Oaks",
        area: "Rinkingpong Road",
        type: "heritage",
        notes: "Smaller, more boutique — best for the haldi and mehendi only.",
      },
    ],
  },
  {
    slug: "jalpaiguri",
    name: "Jalpaiguri",
    shortName: "Jalpaiguri",
    region: "West Bengal",
    country: "IN",
    latitude: 26.5435,
    longitude: 88.7188,
    heroImageUrl: "/images/locations/jalpaiguri-hero.jpg",
    tagline:
      "Bengali wedding country — old families, classical aesthetics, generous baraats.",
    introCopy: [
      "Jalpaiguri has its own distinct wedding culture — slightly more traditional than Siliguri, with longer rituals and bigger families. We design with that pace in mind: separate mandaps for ceremony and bhog, ornate alpana detailing, brass and red as the dominant palette.",
      "Most venues here are banquet halls and community grounds rather than resorts. We bring in fabricated structures from Siliguri and finish them on site.",
    ],
    distanceFromSiliguriKm: 48,
    venues: [
      {
        name: "Hotel Sankalp",
        area: "Station Road",
        type: "hotel",
        notes: "Reliable banquet, good for receptions of up to 350.",
      },
      {
        name: "Town Club Ground",
        area: "Town Centre",
        type: "outdoor",
        notes: "Open ground — requires our own canopy and lighting.",
      },
    ],
  },
  {
    slug: "gangtok",
    name: "Gangtok",
    shortName: "Gangtok",
    region: "Sikkim",
    country: "IN",
    latitude: 27.3389,
    longitude: 88.6065,
    heroImageUrl: "/images/locations/gangtok-hero.jpg",
    tagline:
      "Sikkimese hospitality, monastery aesthetics — a different visual language entirely.",
    introCopy: [
      "Gangtok pulls us into a different design language — prayer-flag colour palettes, brass butter lamps, monastery-inspired drapery. We have done a small number of Sikkim weddings (Nepali, Marwari, Tibetan-Buddhist) and treat each as a separate brief from our standard North Bengal work.",
      "Travel from Siliguri takes about four hours. We plan in pre-built modules so the on-site team can finish without our full warehouse crew.",
    ],
    distanceFromSiliguriKm: 115,
    venues: [
      {
        name: "Mayfair Spa Resort & Casino",
        area: "Ranipool",
        type: "resort",
        notes: "Best for receptions — large indoor banquet for monsoon dates.",
      },
      {
        name: "The Royal Plaza",
        area: "Tibet Road",
        type: "hotel",
        notes: "Mid-range, central, easy access for guests in town.",
      },
    ],
  },
  {
    slug: "dooars",
    name: "The Dooars",
    shortName: "Dooars",
    region: "West Bengal",
    country: "IN",
    latitude: 26.7,
    longitude: 89.0,
    heroImageUrl: "/images/locations/dooars-hero.jpg",
    tagline:
      "Tea-garden and forest weddings — the boldest setting we work in.",
    introCopy: [
      "The Dooars stretch east from Siliguri toward Bhutan — a belt of tea gardens, forest reserves and rivers. Weddings here lean into the landscape: open lawns, tall canopies, a lot of greenery and very little fabric.",
      "We have decorated tea-garden weddings in Chalsa, Gorubathan and Lataguri. Permits, generators and night lighting are part of the planning conversation from day one.",
    ],
    distanceFromSiliguriKm: 60,
    venues: [
      {
        name: "The Hollong Tourist Lodge",
        area: "Jaldapara",
        type: "outdoor",
        notes: "Forest-edge venue — works for intimate haldi and mehendi.",
      },
      {
        name: "Hill 88 Resort",
        area: "Gorubathan",
        type: "resort",
        notes: "Hillside resort with lawn — destination-style.",
      },
    ],
  },
];

export function getAllLocations(): ReadonlyArray<Location> {
  return LOCATIONS;
}

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getLocationSlugs(): ReadonlyArray<LocationSlug> {
  return LOCATIONS.map((l) => l.slug);
}
