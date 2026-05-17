import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  buildLocalBusiness,
  buildPlace,
  jsonLdScript,
} from "@/lib/seo/schemas";
import {
  getLocationBySlug,
  getLocationSlugs,
} from "@/lib/cms/locations";
import { getProjectsByLocation } from "@/lib/cms/projects";
import { LocationDetailHero } from "@/components/marketing/sections/locations-v2/location-detail-hero";
import { LocationDetailContext } from "@/components/marketing/sections/locations-v2/location-detail-context";
import { LocationDetailProjects } from "@/components/marketing/sections/locations-v2/location-detail-projects";
import { LocationDetailCta } from "@/components/marketing/sections/locations-v2/location-detail-cta";

/**
 * /locations/[slug] — local SEO landing.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.11.
 * Rebuilt as four focused editorial sections:
 *   - LocationDetailHero    — italic city name, Ken Burns photograph, CTAs
 *   - LocationDetailContext — climate, venues, transit
 *   - LocationDetailProjects — selected work in this city
 *   - LocationDetailCta     — inverse-palette per-city close
 *
 * SEO: `LocalBusiness` (areaServed = location) + `Place` + `BreadcrumbList`.
 * Build: `generateStaticParams` over all locations.
 */

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return buildPageMetadata({
      title: "Location not found",
      description: "This service location does not exist.",
      path: "/locations",
      locale: "en",
      noIndex: true,
    });
  }

  const projectCount = getProjectsByLocation(location.slug).length;
  return buildPageMetadata({
    title: `Event Decorators in ${location.name}`,
    description: `Wedding and event decor in ${location.name} by Siligurievent. ${projectCount} signature projects nearby. Talk to a planner.`,
    path: `/locations/${location.slug}`,
    locale: "en",
    keywords: [
      `event decorator ${location.name}`,
      `wedding decorator ${location.name}`,
      `${location.name} wedding planner`,
      `event decoration ${location.region}`,
    ],
  });
}

export default async function LocationPage(props: {
  params: Promise<Params>;
}): Promise<React.ReactElement> {
  const { slug } = await props.params;
  const location = getLocationBySlug(slug);
  if (!location) {
    notFound();
  }

  const localProjects = getProjectsByLocation(location.slug);

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const localBusinessSchema = buildLocalBusiness(
    {
      businessName: "Siligurievent",
      city: "Siliguri",
      state: "WB",
      country: "IN",
    },
    {
      name: location.name,
      slug: location.slug,
      region: location.region,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      heroImageUrl: location.heroImageUrl,
    },
  );

  const placeSchema = buildPlace({
    name: location.name,
    slug: location.slug,
    region: location.region,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    heroImageUrl: location.heroImageUrl,
  });

  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.name, path: `/locations/${location.slug}` },
  ]);

  return (
    <>
      {jsonLdScript(localBusinessSchema)}
      {jsonLdScript(placeSchema)}
      {jsonLdScript(breadcrumbSchema)}

      <LocationDetailHero location={location} />
      <LocationDetailContext location={location} />
      <LocationDetailProjects location={location} projects={localProjects} />
      <LocationDetailCta location={location} />
    </>
  );
}
