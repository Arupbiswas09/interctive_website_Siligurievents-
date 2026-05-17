import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/seo/sitemap";
import { getServiceSlugs } from "@/lib/cms/services";
import { getLocationSlugs } from "@/lib/cms/locations";
import { getAllPostSlugs } from "@/lib/cms/posts";
import { listProjectSlugs } from "@/lib/cms/projects";

// Generated from CMS stubs + the programmatic 7×19 grid (in lib/seo/sitemap.ts).
// Re-built on every request; deploy a static `force-static` build with revalidate
// once content stabilises.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, locationSlugs, postSlugs, projectSlugs] = await Promise.all([
    getServiceSlugs(),
    Promise.resolve(getLocationSlugs()),
    Promise.resolve(getAllPostSlugs()),
    listProjectSlugs(),
  ]);

  const entries = buildSitemap({
    services: serviceSlugs.map((slug) => ({ slug })),
    locations: locationSlugs.map((slug) => ({ slug })),
    posts: postSlugs.map((slug) => ({ slug })),
    projects: projectSlugs.map((slug) => ({ slug })),
    // Hindi is available everywhere at launch (D-003) but stubs return EN-only.
    // Default to true; missing-translation fallback lives in the Payload helpers.
    hindiAvailable: () => true,
  });

  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified ? new Date(e.lastModified) : undefined,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    alternates: e.alternates,
  }));
}
