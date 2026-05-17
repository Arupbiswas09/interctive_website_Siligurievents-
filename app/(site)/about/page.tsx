import type { Metadata } from "next";
import type { AboutPage as AboutPageSchema, WithContext } from "schema-dts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_URL,
  buildBreadcrumb,
  buildOrganization,
  buildPerson,
  jsonLdScript,
} from "@/lib/seo/schemas";
import { getFounder } from "@/lib/cms/team";
import { AboutHeroEditorial } from "@/components/marketing/sections/about-v2/about-hero-editorial";
import { AboutPhilosophyPinned } from "@/components/marketing/sections/about-v2/about-philosophy-pinned";
import { AboutTimeline } from "@/components/marketing/sections/about-v2/about-timeline";
import { AboutTeamGrid } from "@/components/marketing/sections/about-v2/about-team-grid";
import { AboutPressStrip } from "@/components/marketing/sections/about-v2/about-press-strip";
import { AboutCtaCloser } from "@/components/marketing/sections/about-v2/about-cta-closer";

/**
 * /about — the trust page.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.2.
 * SEO: `AboutPage` + `Person` (founder) + `Organization` + `BreadcrumbList`.
 * Architecture: Server Component end-to-end. Motion lives inside primitives.
 */

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "About Siligurievent — Cinematic event decorators in North Bengal",
    description:
      "Meet the studio behind Siligurievent. Founder, team, process and the behind-the-scenes work that powers our weddings, receptions and ceremonies across North Bengal.",
    path: "/about",
    locale: "en",
    keywords: [
      "about Siligurievent",
      "Siliguri event decorators",
      "North Bengal wedding decorator team",
      "Bengali wedding designers",
    ],
  });
}

export default function AboutPage(): React.ReactElement {
  const founder = getFounder();

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const aboutPageSchema: WithContext<AboutPageSchema> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#aboutpage`,
    name: "About Siligurievent",
    description:
      "About Siligurievent — a studio of decorators, florists and stage builders working across Siliguri and North Bengal.",
    url: `${SITE_URL}/about`,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Siligurievent" },
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
    },
  };

  const personSchema = buildPerson({
    name: founder.name,
    role: founder.role,
    bio: founder.longBio ?? founder.bio,
    imageUrl: founder.imageUrl,
    sameAs: founder.sameAs,
  });

  // Minimal SiteSettings until Sprint 2 wires Payload — Organization needs at
  // least name + address; everything else has sensible defaults in the schema.
  const organizationSchema = buildOrganization({
    businessName: "Siligurievent",
    city: "Siliguri",
    state: "WB",
    country: "IN",
    founderName: founder.name,
  });

  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      {jsonLdScript(aboutPageSchema)}
      {jsonLdScript(personSchema)}
      {jsonLdScript(organizationSchema)}
      {jsonLdScript(breadcrumbSchema)}

      <AboutHeroEditorial />
      <AboutPhilosophyPinned />
      <AboutTimeline />
      <AboutTeamGrid />
      <AboutPressStrip />
      <AboutCtaCloser />
    </>
  );
}
