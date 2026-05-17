import type { Metadata } from "next";
import type { CollectionPage, WithContext } from "schema-dts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_URL,
  buildBreadcrumb,
  jsonLdScript,
} from "@/lib/seo/schemas";
import { getAllLocations } from "@/lib/cms/locations";
import { LocationsHubHero } from "@/components/marketing/sections/locations-v2/locations-hub-hero";
import { LocationsHubMapGrid } from "@/components/marketing/sections/locations-v2/locations-hub-map-grid";
import { LocationsHubStatsStrip } from "@/components/marketing/sections/locations-v2/locations-hub-stats-strip";
import { CtaCloser } from "@/components/marketing/sections/cta-closer";

/**
 * /locations — index of the 7 service locations.
 *
 * Rebuilt as a map-led editorial hub:
 *   - LocationsHubHero       — italic headline, gold haze
 *   - LocationsHubMapGrid    — stylized SVG map + filterable city cards
 *   - LocationsHubStatsStrip — 4-stat editorial strip
 *   - CtaCloser              — shared inverse-palette close
 *
 * SEO: `CollectionPage` + `BreadcrumbList`.
 */

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title:
      "Event Decorators across North Bengal & Sikkim — Service Locations",
    description:
      "Siligurievent decorates weddings and events across Siliguri, Bagdogra, Darjeeling, Kalimpong, Jalpaiguri, Gangtok and the Dooars. Pick your location to start planning.",
    path: "/locations",
    locale: "en",
    keywords: [
      "event decorators North Bengal",
      "wedding decorator Sikkim",
      "decorator Darjeeling Kalimpong",
      "wedding decorator Dooars",
    ],
  });
}

export default function LocationsIndexPage(): React.ReactElement {
  const locations = getAllLocations();

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/locations#collection`,
    name: "Service locations — Siligurievent",
    description:
      "All locations where Siligurievent designs and stages weddings, family rituals and corporate events.",
    url: `${SITE_URL}/locations`,
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Siligurievent" },
  };

  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
  ]);

  return (
    <>
      {jsonLdScript(collectionSchema)}
      {jsonLdScript(breadcrumbSchema)}

      <LocationsHubHero />
      <LocationsHubMapGrid locations={locations} />
      <LocationsHubStatsStrip />

      <CtaCloser
        eyebrow="Not sure where to start?"
        headline="Tell us your venue. We'll do the rest."
        subline="Send us the date and city — we come back with options within two days."
        primaryCta={{ label: "Plan my event", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/portfolio" }}
      />
    </>
  );
}
