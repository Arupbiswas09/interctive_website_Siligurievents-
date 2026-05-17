/**
 * Local marketing imagery — WebP assets under `/public/images`.
 * IDs align with docs/09-IMAGE-PROMPTS.md; swap files in place when Gemini renders land.
 */

export const SITE_IMAGES = {
  hero: {
    // Home hero is owned by the dedicated rose-gold hero component.
    // This URL is only consumed by non-hero surfaces / fallbacks.
    home: "/images/marketing/hero-home-alt.jpg",
    homeAlt: "/images/marketing/hero-home-alt.jpg",
  },
  work: {
    "01": "/images/marketing/work-01.jpg",
    "02": "/images/marketing/work-02.jpg",
    "03": "/images/marketing/work-03.jpg",
    "04": "/images/marketing/work-04.jpg",
    "05": "/images/marketing/work-05.jpg",
  },
  services: {
    "01": "/images/marketing/work-01.jpg",
    "02": "/images/marketing/work-04.jpg",
    "03": "/images/marketing/work-03.jpg",
    "04": "/images/marketing/work-02.jpg",
    "05": "/images/marketing/work-05.jpg",
    "06": "/images/marketing/service-06.jpg",
    "07": "/images/marketing/service-07.jpg",
  },
  brand: {
    emblem: "/images/logo-emblem-a.webp",
  },
} as const;

export type WorkImageKey = keyof typeof SITE_IMAGES.work;

export function workImageSrc(index: 1 | 2 | 3 | 4 | 5): string {
  const key = String(index).padStart(2, "0") as WorkImageKey;
  return SITE_IMAGES.work[key];
}

export function serviceImageSrc(svcIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7): string {
  const key = String(svcIndex).padStart(2, "0") as keyof typeof SITE_IMAGES.services;
  return SITE_IMAGES.services[key];
}
