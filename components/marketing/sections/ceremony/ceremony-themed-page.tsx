/**
 * CeremonyThemedPage — assembles the themed service-detail sections in order.
 *
 * Server Component shell. Each child is a client component that owns its
 * own motion. The `theme` is resolved upstream in app/(site)/services/[slug]/page.tsx
 * via `getCeremonyTheme(slug)`; this component just walks the list.
 *
 * Order (mirrors Awwwards storytelling structure):
 *   1. Hero          — bespoke, themed, with ornament + particles
 *   2. Ritual story  — pinned scroll narrative through 5 stages
 *   3. Color story   — palette swatches with rationale
 *   4. Gallery       — masonry with 3D split / parallax hover
 *   5. Inclusions    — what we bring, themed accordion cards
 *   6. CTA closer    — dramatic finale, themed inverse palette
 */

import type { CeremonyTheme } from "@/lib/ceremony/theme";
import { CeremonyHero } from "./ceremony-hero";
import { CeremonyRitualNarrative } from "./ceremony-ritual-narrative";
import { CeremonyColorStory } from "./ceremony-color-story";
import { CeremonyGallery } from "./ceremony-gallery";
import { CeremonyInclusions } from "./ceremony-inclusions";
import { CeremonyCta } from "./ceremony-cta";

export type CeremonyThemedPageProps = {
  theme: CeremonyTheme;
  /** Service display name, e.g. "Haldi / Gaye Holud". */
  name: string;
  /** Hero tagline (one short editorial sentence). */
  tagline: string;
  /** Hero body (1–2 sentences). */
  description: string;
  /** Hero photograph path under /public. */
  heroImage: string;
  /** "What we bring" copy. */
  inclusionsDescription: string;
  /** Inclusion groups from the CMS. */
  inclusionGroups: ReadonlyArray<{
    title: string;
    items: ReadonlyArray<string>;
  }>;
};

export function CeremonyThemedPage({
  theme,
  name,
  tagline,
  description,
  heroImage,
  inclusionsDescription,
  inclusionGroups,
}: CeremonyThemedPageProps): React.ReactElement {
  return (
    <div data-ceremony={theme.slug} className="relative">
      <CeremonyHero
        theme={theme}
        name={name}
        tagline={tagline}
        description={description}
        heroImage={heroImage}
      />

      <CeremonyRitualNarrative theme={theme} />

      <CeremonyColorStory theme={theme} />

      <CeremonyGallery theme={theme} />

      <CeremonyInclusions
        theme={theme}
        description={inclusionsDescription}
        groups={inclusionGroups}
      />

      <CeremonyCta theme={theme} serviceName={name} />
    </div>
  );
}
