import type { Metadata } from "next";
import type { CollectionPage, WithContext } from "schema-dts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_URL,
  buildBreadcrumb,
  jsonLdScript,
} from "@/lib/seo/schemas";
import { getServices } from "@/lib/cms/services";
import { ServicesHubHero } from "@/components/marketing/sections/services-hub/services-hub-hero";
import { ServicesHubBento } from "@/components/marketing/sections/services-hub/services-hub-bento";
import { ServicesHubProcessStrip } from "@/components/marketing/sections/services-hub/services-hub-process-strip";
import { ServicesHubCtaCloser } from "@/components/marketing/sections/services-hub/services-hub-cta-closer";

/**
 * Services hub — `/services`.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.3.
 * Rebuilt as an editorial bento hub:
 *   - ServicesHubHero       — italic display headline + rotating mandala
 *   - ServicesHubBento      — asymmetric grid of all ceremonies
 *   - ServicesHubProcessStrip — 4-step editorial process with brass rail
 *   - ServicesHubCtaCloser  — inverse-palette close with WhatsApp + Inquire
 *
 * SEO: `CollectionPage` + `BreadcrumbList` JSON-LD.
 */

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Services — Every kind of celebration",
    description:
      "Wedding, sangeet, haldi, mehendi, reception, family rituals, festival pujas and corporate decor across Siliguri and North Bengal.",
    path: "/services",
    locale: "en",
    keywords: [
      "event decorators Siliguri",
      "wedding decoration North Bengal",
      "Bengali wedding decorator",
      "haldi mehendi sangeet decor",
      "corporate event decorators Siliguri",
    ],
  });
}

export default async function ServicesIndexPage(): Promise<React.ReactElement> {
  const services = await getServices();

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const collectionSchema: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/services#collection`,
    name: "Event Decoration Services — Siligurievent",
    description:
      "All event decoration services offered by Siligurievent across Siliguri, North Bengal and the Dooars.",
    url: `${SITE_URL}/services`,
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Siligurievent" },
  };

  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <>
      {jsonLdScript(collectionSchema)}
      {jsonLdScript(breadcrumbSchema)}

      <ServicesHubHero />
      <ServicesHubBento services={services} />
      <ServicesHubProcessStrip />
      <ServicesHubCtaCloser />
    </>
  );
}
