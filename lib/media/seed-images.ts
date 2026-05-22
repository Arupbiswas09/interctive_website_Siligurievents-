/**
 * Seed image catalogue — local-only seed data used as fallback / placeholder
 * across all CMS stub helpers until Payload + Vercel Blob land in Sprint 2.
 *
 * All entries live under `/public/{images,media}/...` so they resolve offline
 * and never depend on a third-party host. The catalogue groups files into
 * thematic pools (wedding, pre-wedding, stage, family, etc.) so callers can
 * pick a category-relevant image without thinking about specific files.
 *
 * Repetition across pools is deliberate — with ~30 unique files spread across
 * ~10 pools, the same shot may anchor more than one theme. That's a feature:
 * the brand voice stays consistent across pages.
 */

// ---------------------------------------------------------------------------
// Themed pools — every page that needs an image picks from one of these.
// ---------------------------------------------------------------------------

/** Mandap, baraat, pheras, full Indian wedding scenes. */
export const SEED_WEDDING: ReadonlyArray<string> = [
  "/images/marketing/work-01.jpg",
  "/images/marketing/work-03.jpg",
  "/images/marketing/work-05.jpg",
  "/images/work/work-01.webp",
  "/images/work/work-03.webp",
  "/images/work/work-05.webp",
  "/media/decor-pairs/mandap-01-day.avif",
  "/media/decor-pairs/mandap-01-night.avif",
];

/** Haldi, gaye holud, mehendi — yellow, marigold, intimate morning shots. */
export const SEED_PRE_WEDDING: ReadonlyArray<string> = [
  "/images/marketing/work-04.jpg",
  "/images/work/work-04.webp",
  "/images/services/svc-02.webp",
  "/images/services/svc-04.webp",
  "/media/decor-pairs/haldi-01-day.avif",
  "/media/decor-pairs/haldi-01-night.avif",
];

/** Sangeet, reception, cocktail — stage, lighting, after-dark. */
export const SEED_STAGE: ReadonlyArray<string> = [
  "/images/marketing/work-02.jpg",
  "/images/marketing/work-05.jpg",
  "/images/work/work-02.webp",
  "/images/work/work-05.webp",
  "/images/services/svc-03.webp",
  "/images/services/svc-05.webp",
  "/media/decor-pairs/stage-01-day.avif",
  "/media/decor-pairs/stage-01-night.avif",
];

/** Birthday, anniversary, godh bharai, intimate family rituals. */
export const SEED_FAMILY: ReadonlyArray<string> = [
  "/images/marketing/service-06.jpg",
  "/images/services/svc-01.webp",
  "/images/services/svc-06.webp",
  "/images/services/svc-07.webp",
  "/images/marketing/work-02.jpg",
  "/media/decor-pairs/bday-01-day.avif",
  "/media/decor-pairs/bday-01-night.avif",
];

/** Corporate launches, conferences, awards. */
export const SEED_CORPORATE: ReadonlyArray<string> = [
  "/images/services/svc-05.webp",
  "/images/services/svc-07.webp",
  "/images/marketing/work-02.jpg",
  "/images/work/work-02.webp",
  "/media/decor-pairs/stage-01-night.avif",
];

/** Durga / Lakshmi / Saraswati puja, festival decor. */
export const SEED_FESTIVAL: ReadonlyArray<string> = [
  "/images/services/svc-04.webp",
  "/images/marketing/work-04.jpg",
  "/images/work/work-04.webp",
  "/images/services/svc-02.webp",
];

/** Hero / cover plates — magazine-grade, used on home + section heroes. */
export const SEED_HERO: ReadonlyArray<string> = [
  "/images/marketing/hero-home-alt.jpg",
  "/images/hero-01.webp",
  "/images/hero-02.webp",
  "/images/marketing/work-01.jpg",
  "/images/marketing/work-03.jpg",
  "/images/marketing/work-05.jpg",
];

/** Location heroes — Siliguri, Darjeeling, Dooars landscapes + venues. */
export const SEED_LOCATIONS: ReadonlyArray<string> = [
  "/images/locations/kalimpong-hero.jpg",
  "/images/marketing/work-05.jpg",
  "/images/marketing/work-01.jpg",
  "/images/marketing/work-03.jpg",
  "/images/marketing/hero-home-alt.jpg",
  "/images/hero-01.webp",
  "/images/hero-02.webp",
];

/** Editorial florals, brass, tablescape, close-ups (for design/brief shots). */
export const SEED_DETAIL: ReadonlyArray<string> = [
  "/images/services/svc-01.webp",
  "/images/services/svc-02.webp",
  "/images/services/svc-06.webp",
  "/media/decor-pairs/mandap-01-day.avif",
  "/media/decor-pairs/haldi-01-day.avif",
  "/media/decor-pairs/bday-01-day.avif",
];

/** Founder + crew portrait stand-ins. Neutral, warm, candid. */
export const SEED_TEAM: ReadonlyArray<string> = [
  "/images/marketing/service-06.jpg",
  "/images/services/svc-01.webp",
  "/images/services/svc-06.webp",
  "/images/services/svc-07.webp",
  "/images/marketing/work-04.jpg",
  "/images/work/work-04.webp",
];

/** Blog post covers — wedding planning, mandap design, venues, florals. */
export const SEED_BLOG: ReadonlyArray<string> = [
  "/images/marketing/work-01.jpg",
  "/images/marketing/work-02.jpg",
  "/images/marketing/work-03.jpg",
  "/images/marketing/work-04.jpg",
  "/images/marketing/work-05.jpg",
  "/images/marketing/hero-home-alt.jpg",
  "/images/hero-01.webp",
  "/images/hero-02.webp",
  "/images/services/svc-03.webp",
];

// ---------------------------------------------------------------------------
// Helpers — deterministic pickers so SSG output stays stable across builds.
// ---------------------------------------------------------------------------

/** Hash a string to a non-negative integer (FNV-1a 32-bit). */
function hash(key: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministically pick one image from `pool` for a stable `key`.
 * Same key always returns the same image — safe for SSG / cache.
 */
export function pickSeedImage(
  pool: ReadonlyArray<string>,
  key: string,
): string {
  if (pool.length === 0) throw new Error("pickSeedImage: empty pool");
  return pool[hash(key) % pool.length] ?? pool[0]!;
}

/** Map a service / event category to the most thematic pool. */
export function poolForCategory(
  category: string,
): ReadonlyArray<string> {
  switch (category) {
    case "weddings":
    case "wedding":
      return SEED_WEDDING;
    case "pre-wedding":
      return SEED_PRE_WEDDING;
    case "family-rituals":
    case "birthday":
    case "annaprashan":
      return SEED_FAMILY;
    case "corporate":
      return SEED_CORPORATE;
    case "festivals":
      return SEED_FESTIVAL;
    default:
      return SEED_WEDDING;
  }
}
