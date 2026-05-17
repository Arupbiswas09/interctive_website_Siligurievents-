import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  buildFAQ,
  buildService,
  jsonLdScript,
  type SiteSettingsInput,
} from "@/lib/seo/schemas";
import {
  SERVICE_CATEGORIES,
  getRelatedServices,
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/cms/services";
import { ServiceDetailHero } from "@/components/marketing/sections/service-detail-hero";
import { ServiceInclusions } from "@/components/marketing/sections/service-inclusions";
import { ServiceSignatureProjects } from "@/components/marketing/sections/service-signature-projects";
import { ServicePricingTeaser } from "@/components/marketing/sections/service-pricing-teaser";
import { ServiceFaqs } from "@/components/marketing/sections/service-faqs";
import { ServiceRelated } from "@/components/marketing/sections/service-related";
import { CtaCloser } from "@/components/marketing/sections/cta-closer";
import { CeremonyThemedPage } from "@/components/marketing/sections/ceremony/ceremony-themed-page";
import { getCeremonyTheme } from "@/lib/ceremony/theme";

/**
 * Service detail — `/services/[slug]`.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 — all 8 sections, in order.
 * Architecture: Server Component. SSG via `generateStaticParams` for the 19
 *   services. CMS replacement in Sprint 2 will swap the lookups but keep this
 *   page shape intact.
 *
 * SEO: `Service` + `BreadcrumbList` + `FAQPage` JSON-LD.
 *
 * TODO(sprint-2): pull `SiteSettingsInput` from Payload's `siteSettings` global
 *   instead of the inline fallback below.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Static params + metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ServiceDetailPageProps = {
  /** Next.js 15+ — `params` is a Promise. */
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildPageMetadata({
      title: "Service not found",
      description: "This event service page is no longer available.",
      path: `/services/${slug}`,
      locale: "en",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${service.name} decoration in Siliguri`,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    locale: "en",
    keywords: [
      `${service.name.toLowerCase()} decorator Siliguri`,
      `${service.name.toLowerCase()} decoration North Bengal`,
      "event decorators Siliguri",
      "wedding decorator Siliguri",
    ],
  });
}

// Stand-in until Sprint 2 wires Payload's `siteSettings` global.
// All public-facing fields are placeholders — schema accuracy is preserved
// (correct shape, correct city, no fake business numbers).
const SITE_SETTINGS_STUB: SiteSettingsInput = {
  businessName: "Siligurievent",
  city: "Siliguri",
  state: "West Bengal",
  country: "IN",
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const related = await getRelatedServices(service.relatedSlugs);
  const categoryLabel =
    SERVICE_CATEGORIES.find((c) => c.slug === service.category)?.label ??
    "Services";

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const serviceSchema = buildService(
    {
      name: service.name,
      slug: service.slug,
      tagline: service.tagline,
      description: service.shortDescription,
      priceBand: service.priceBand,
      coverImageUrl: service.heroImageUrl,
    },
    SITE_SETTINGS_STUB,
  );

  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ]);

  const faqSchema = buildFAQ(
    service.faqs.map((f) => ({ question: f.question, answer: f.answer })),
  );

  // If a per-ceremony theme is registered for this slug, render the bespoke
  // themed template (themed hero + ritual narrative + color story + gallery +
  // themed inclusions + themed CTA). Otherwise fall through to the generic
  // service template below. Themed sections still get all SEO JSON-LD.
  const theme = getCeremonyTheme(service.slug);

  if (theme) {
    return (
      <>
        {jsonLdScript(serviceSchema)}
        {jsonLdScript(breadcrumbSchema)}
        {jsonLdScript(faqSchema)}

        <Suspense fallback={null}>
          <CeremonyThemedPage
            theme={theme}
            name={service.name}
            tagline={service.tagline}
            description={service.shortDescription}
            // Fall back to the theme's first gallery image when the CMS
            // stub omits a dedicated hero URL — avoids empty Image src.
            heroImage={service.heroImageUrl || theme.gallery[0] || "/images/work/work-01.webp"}
            inclusionsDescription={service.longDescription}
            inclusionGroups={service.inclusions}
          />
        </Suspense>

        {/* Generic-template carry-overs the themed page doesn't replace yet —
            pricing teaser, FAQs, related services. Keeps SEO/structured data
            consistent across themed and non-themed pages. */}
        <ServicePricingTeaser
          priceBand={service.priceBand}
          priceContext={service.priceContext}
          serviceSlug={service.slug}
          serviceName={service.name}
        />

        <ServiceFaqs faqs={service.faqs} />

        <ServiceRelated related={related} />
      </>
    );
  }

  return (
    <>
      {jsonLdScript(serviceSchema)}
      {jsonLdScript(breadcrumbSchema)}
      {jsonLdScript(faqSchema)}

      <ServiceDetailHero
        category={categoryLabel}
        name={service.name}
        nameSecondary={service.nameHi}
        tagline={service.tagline}
        description={service.shortDescription}
        primaryCta={{
          label: `Plan your ${service.name.toLowerCase()}`,
          href: "/contact",
        }}
        secondaryCta={{ label: "See related work", href: "/portfolio" }}
        imageUrl={service.heroImageUrl}
      />

      <ServiceInclusions
        description={service.longDescription}
        groups={service.inclusions}
        process={service.process}
      />

      <ServiceSignatureProjects
        projects={service.signatureProjects}
        serviceSlug={service.slug}
      />

      <ServicePricingTeaser
        priceBand={service.priceBand}
        priceContext={service.priceContext}
        serviceSlug={service.slug}
        serviceName={service.name}
      />

      <ServiceFaqs faqs={service.faqs} />

      <ServiceRelated related={related} />

      <CtaCloser
        eyebrow="Let's begin"
        headline="Let's design your moment."
        subline="WhatsApp us with a date and a guest count — we'll come back with a moodboard."
        primaryCta={{
          label: `Plan your ${service.name.toLowerCase()}`,
          href: "/contact",
        }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
