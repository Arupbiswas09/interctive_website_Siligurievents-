import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildLocalBusiness,
  buildOrganization,
  jsonLdScript,
  SITE_URL,
  type SiteSettingsInput,
} from "@/lib/seo/schemas";

import { HomeHeroRoseGold as HomeHero } from "@/components/marketing/sections/home-hero-rose-gold";
import { HomeCapabilityMarquee } from "@/components/marketing/sections/home-capability-marquee";
import { HomeEditorialIntro } from "@/components/marketing/sections/home-editorial-intro";
import { HomeSignatureWork } from "@/components/marketing/sections/home-signature-work";
import { HomeServicesOverview } from "@/components/marketing/sections/home-services-overview";
import { HomeDayNightSection } from "@/components/marketing/sections/home-day-night-section";
import { HomeTestimonialsMarquee } from "@/components/marketing/sections/home-testimonials-marquee";
import { HomeLocationsServed } from "@/components/marketing/sections/home-locations-served";
import { HomeJournalTeaser } from "@/components/marketing/sections/home-journal-teaser";
import { HomeCtaCloser } from "@/components/marketing/sections/home-cta-closer";
import { TrustedPartners } from "@/components/marketing/sections/trusted-partners";
import { getPartners } from "@/lib/cms/partners";
import { SectionDivider } from "@/components/ui/section-divider";

/**
 * Home — `/`
 *
 * 9-section cinematic assembly per docs/05-PAGE-SPECS.md §5.1.
 * Server Component shell — each section component owns its own client
 * motion. Sprint 1 places the foundation; CMS content + Gemini images
 * land in Sprint 2/3.
 *
 * Chrome (Lenis + Header + Footer + StickyWhatsApp) is provided by the
 * shared `app/(site)/layout.tsx`. Do not re-wrap here.
 */

// TODO(sprint-2): replace with `getSiteSettings()` from a CMS helper.
const SITE_SETTINGS: SiteSettingsInput = {
  businessName: "Siligurievent",
  tagline:
    "Cinematic decor for celebrations across Siliguri, Darjeeling, and the Dooars.",
  city: "Siliguri",
  state: "WB",
  country: "IN",
  pincode: "734001",
  email: "hello@siligurievent.com",
  // Phone / WhatsApp numbers are intentionally omitted until owner confirms.
  founderName: "TODO: Owner Name",
  foundedYear: 2024,
};

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Siligurievent — Cinematic event decor in North Bengal",
    description:
      "Editorial wedding, haldi, sangeet, reception and corporate decor across Siliguri, Darjeeling and the Dooars. Designed like film stills.",
    path: "/",
    locale: "en",
    keywords: [
      "wedding decorators Siliguri",
      "event decorators North Bengal",
      "Bengali wedding decoration",
      "haldi mehendi sangeet decor",
      "destination wedding Darjeeling",
      "Durga Puja pandal design",
    ],
  });
}

export default function HomePage(): React.ReactElement {
  // Organization + LocalBusiness JSON-LD identify the brand & GMB equivalent.
  // WebSite JSON-LD declares the site name + SearchAction (sitelinks search box).
  const organizationLd = buildOrganization(SITE_SETTINGS);
  const localBusinessLd = buildLocalBusiness(SITE_SETTINGS);
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Siligurievent",
    description:
      "Cinematic event decor in Siliguri & North Bengal — weddings, haldi, sangeet, reception, corporate, festival pujas.",
    inLanguage: ["en-IN", "hi-IN"],
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      // Schema.org requires this exact literal — not a placeholder.
      // biome-ignore lint/style/useNamingConvention: schema.org spec key
      "query-input": "required name=search_term_string",
    },
  } as const;

  return (
    <div data-look="cinematic" className="bg-[color:var(--color-bg)]">
      {jsonLdScript(organizationLd)}
      {jsonLdScript(localBusinessLd)}
      {jsonLdScript(websiteLd)}

      {/* H1 — Cinematic hero. createHeroTimeline owns entrance + parallax + scroll-out. */}
      <HomeHero />

      <SectionDivider tone="brass" />

      {/* H2 — Continuous capability marquee. Reverses on scroll direction change. */}
      <HomeCapabilityMarquee />

      <SectionDivider tone="ink" className="opacity-40" />

      {/* H3 — Editorial pull-quote + philosophy. SplitText char reveal. */}
      <HomeEditorialIntro />

      <SectionDivider tone="accent" className="opacity-30" />

      {/* H4 — Pinned horizontal signature work scrub (SIG-06). */}
      <HomeSignatureWork />

      <SectionDivider tone="brass" className="opacity-50" />

      {/* H5 — Services overview with asymmetric tiles. Per-tile reveal. */}
      <HomeServicesOverview />

      {/* H5.5 — Day/Night decor switcher (between services and testimonials). */}
      <HomeDayNightSection />

      <SectionDivider tone="ink" />

      {/* H6 — Three-row testimonial marquee with velocity drift. */}
      <HomeTestimonialsMarquee />

      {/* H6.5 — Trusted Partners — luxury venue strip marquee. */}
      <TrustedPartners partners={getPartners()} />

      {/* H7 — Locations served — region map with sequential pin reveal. */}
      <HomeLocationsServed />

      {/* H8 — Journal teaser — latest three posts, stagger reveal. */}
      <HomeJournalTeaser />

      {/* H9 — CTA closer — oversized italic letter-drift headline. */}
      <HomeCtaCloser />
    </div>
  );
}
