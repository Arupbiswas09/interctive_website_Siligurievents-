import type { Metadata } from "next";
import { Suspense, type ReactElement } from "react";

import { GalleryHero } from "@/components/marketing/sections/gallery/gallery-hero";
import { GalleryBentoGrid } from "@/components/marketing/sections/gallery/gallery-bento-grid";
import { GalleryCtaCloser } from "@/components/marketing/sections/gallery/gallery-cta-closer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  jsonLdScript,
  SITE_URL,
  BRAND_NAME,
} from "@/lib/seo/schemas";
import { listProjects } from "@/lib/cms/projects";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Portfolio · Selected event decor case studies",
    description:
      "Selected case studies from Siligurievent — weddings, receptions, birthdays and corporate launches across Siliguri, Darjeeling and the Dooars.",
    path: "/portfolio",
    locale: "en",
    keywords: [
      "wedding decorator Siliguri portfolio",
      "Bengali wedding case study",
      "destination wedding North Bengal",
      "event decoration portfolio India",
    ],
  });
}

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string;
    year?: string;
    location?: string;
    page?: string;
  }>;
}

/**
 * JSON-LD subtree — isolated in its own Suspense boundary so the cached
 * `listProjects` fetch doesn't block the page shell (Cache Components
 * contract).
 */
async function PortfolioJsonLd({
  searchParams,
}: PortfolioPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const category = params.category;
  const location = params.location;
  const year = params.year ? Number.parseInt(params.year, 10) : undefined;
  const page = params.page ? Math.max(1, Number.parseInt(params.page, 10)) : 1;

  const slice = await listProjects({
    category,
    year,
    location,
    page: 1,
    pageSize: 9 * page,
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/portfolio#collectionpage`,
    name: "Portfolio — Siligurievent",
    description:
      "Selected event decoration case studies from Siligurievent — weddings, receptions, birthdays and corporate launches across North Bengal.",
    url: `${SITE_URL}/portfolio`,
    isPartOf: { "@type": "WebSite", name: BRAND_NAME, url: SITE_URL },
    hasPart: slice.items.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      url: `${SITE_URL}/portfolio/${p.slug}`,
      about: p.ceremonyName,
      dateCreated: p.date,
    })),
  };

  const breadcrumb = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
  ]);

  return (
    <>
      {jsonLdScript(collectionSchema)}
      {jsonLdScript(breadcrumb)}
    </>
  );
}

export default function PortfolioPage({
  searchParams,
}: PortfolioPageProps): ReactElement {
  return (
    <>
      <Suspense fallback={null}>
        <PortfolioJsonLd searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={null}>
        <GalleryHero />
        <GalleryBentoGrid />
        <GalleryCtaCloser />
      </Suspense>
    </>
  );
}
