import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/marketing/sections/case-study/case-study-hero";
import { CaseStudyOverview } from "@/components/marketing/sections/case-study/case-study-overview";
import { CaseStudyChapterRail } from "@/components/marketing/sections/case-study/case-study-chapter-rail";
import {
  CaseStudyChapters,
  type CaseStudyChapter,
} from "@/components/marketing/sections/case-study/case-study-chapters";
import { CaseStudyImageGallery } from "@/components/marketing/sections/case-study/case-study-image-gallery";
import {
  CaseStudyVendorCredits,
  type CaseStudyCredit,
} from "@/components/marketing/sections/case-study/case-study-vendor-credits";
import { CaseStudyNextProjectTeaser } from "@/components/marketing/sections/case-study/case-study-next-project-teaser";
import { CaseStudyCtaCloser } from "@/components/marketing/sections/case-study/case-study-cta-closer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  buildCreativeWork,
  jsonLdScript,
} from "@/lib/seo/schemas";
import {
  getNextProject,
  getProjectBySlug,
  listProjectSlugs,
} from "@/lib/cms/projects";

// ---------------------------------------------------------------------------
// Static params — pre-render every published case study.
// ---------------------------------------------------------------------------

export async function generateStaticParams(): Promise<
  Array<{ slug: string }>
> {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: RouteParams,
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return buildPageMetadata({
      title: "Case study not found",
      description: "This case study has moved or is no longer published.",
      path: `/portfolio/${slug}`,
      locale: "en",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${project.title} · ${project.ceremonyName} in ${project.locationName}`,
    description: `${project.tagline} — ${project.brief.slice(0, 110).replace(/^TODO:\s*/, "")}`,
    path: `/portfolio/${slug}`,
    locale: "en",
    ogType: "article",
    publishedTime: project.date,
    image: project.coverImage.src,
    keywords: [
      project.ceremonyName,
      project.locationName,
      `${project.ceremonyName.toLowerCase()} decorator`,
      `${project.locationName.toLowerCase()} wedding decor`,
    ],
  });
}

// ---------------------------------------------------------------------------
// Fallback content — applied per-component when CMS data is absent.
// ---------------------------------------------------------------------------

const FALLBACK_CHAPTERS: ReadonlyArray<CaseStudyChapter> = [
  {
    numeral: "I",
    title: "The brief",
    body: [
      "The family wanted three rooms: a haldi morning, a mehendi afternoon, and a reception evening — all in the same courtyard.",
      "Our job was to make each evening feel like its own film while keeping the architecture continuous.",
    ],
    image:
      "/media/decor-pairs/mandap-01-night.avif",
    imageAlt: "Sketches and palette sample on the studio table",
  },
  {
    numeral: "II",
    title: "The concept",
    body: [
      "We started with the light. Dawn for haldi, golden hour for mehendi, candle and chandelier for reception. The same courtyard, three temperatures.",
    ],
    image:
      "/media/decor-pairs/mandap-01-night.avif",
    imageAlt: "Mood board with marigold and brass references",
    quote: "Three rooms, one architecture, three temperatures of light.",
  },
  {
    numeral: "III",
    title: "Production",
    body: [
      "Brass diya stands at 1.2m. Marigold strung in 6m runs. The mandap canopy in benarasi silk.",
      "Every element was tested in the workshop two weeks ahead — nothing arrived on site untried.",
    ],
    image:
      "/images/work/work-05.webp",
    imageAlt: "Brass diya stands being prepared in the workshop",
  },
  {
    numeral: "IV",
    title: "The day",
    body: [
      "The shehnai came in at 7:08. Family was seated by 7:25. The first turmeric was mixed at 8.",
      "The room was lit to its final cue before the first guest arrived.",
    ],
    image:
      "/images/marketing/work-01.jpg",
    imageAlt: "Family seated as the shehnai begins",
  },
  {
    numeral: "V",
    title: "Photographs",
    body: [
      "What we delivered: 14 hero photographs, 200 process photos, a 60-second film cut.",
      "The album was bound in raw silk a fortnight after the last guest left.",
    ],
    image:
      "/images/marketing/work-01.jpg",
    imageAlt: "Bound silk album on the studio table",
  },
];

const GALLERY_FALLBACK: ReadonlyArray<string> = [
  "/media/decor-pairs/mandap-01-night.avif",
  "/images/work/work-05.webp",
  "/images/marketing/work-03.jpg",
  "/media/decor-pairs/mandap-01-night.avif",
  "/media/decor-pairs/mandap-01-day.avif",
  "/images/work/work-05.webp",
  "/images/marketing/work-01.jpg",
  "/media/decor-pairs/mandap-01-night.avif",
];

const CREDITS_FALLBACK: ReadonlyArray<CaseStudyCredit> = [
  { role: "Decor + design", name: "Siliguri Event" },
  { role: "Photography", name: "Mihir Das · Day 1, Day 3" },
  { role: "Florals", name: "Riya Sen (in-house)" },
  { role: "Venue", name: "Mahananda Park" },
  { role: "Catering", name: "Banglar Rann" },
  { role: "Music", name: "Soumya Banerjee Quartet" },
];

// ---------------------------------------------------------------------------
// Page — Server Component
// ---------------------------------------------------------------------------

export default async function CaseStudyPage(
  { params }: RouteParams,
): Promise<ReactElement> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const next = await getNextProject(slug);

  // CMS-driven content with safe fallbacks.
  const chapters: ReadonlyArray<CaseStudyChapter> =
    deriveChaptersFromProject(project) ?? FALLBACK_CHAPTERS;

  const images: ReadonlyArray<string> = project.galleryImages.length > 0
    ? project.galleryImages.map((i) => i.src)
    : GALLERY_FALLBACK;

  const credits: ReadonlyArray<CaseStudyCredit> = project.credits.length > 0
    ? project.credits.map((c) => ({
        role: c.role,
        name: c.name,
        link: c.link,
      }))
    : CREDITS_FALLBACK;

  // ── JSON-LD ────────────────────────────────────────────────────────────
  const creativeWork = buildCreativeWork({
    title: project.title,
    slug: project.slug,
    brief: project.brief,
    ceremonyName: project.ceremonyName,
    locationName: project.locationName,
    date: project.date,
    coverImageUrl: project.coverImage.src,
    galleryImageUrls: project.galleryImages.map((g) => g.src),
    credits: project.credits.map((c) => ({ role: c.role, name: c.name })),
  });

  const breadcrumb = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: project.title, path: `/portfolio/${project.slug}` },
  ]);

  const railItems = chapters.map((c) => ({
    numeral: c.numeral,
    title: c.title,
  }));

  return (
    <>
      {jsonLdScript(creativeWork)}
      {jsonLdScript(breadcrumb)}

      <main id="main" className="relative">
        <Suspense fallback={null}>
          <CaseStudyHero project={project} />
        </Suspense>

        <Suspense fallback={null}>
          <CaseStudyOverview project={project} />
        </Suspense>

        <div className="relative">
          <Suspense fallback={null}>
            <CaseStudyChapterRail chapters={railItems} />
          </Suspense>
          <Suspense fallback={null}>
            <CaseStudyChapters chapters={chapters} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <CaseStudyImageGallery images={images} />
        </Suspense>

        <CaseStudyVendorCredits credits={credits} />

        <Suspense fallback={null}>
          <CaseStudyNextProjectTeaser nextProject={next ?? null} />
        </Suspense>

        <CaseStudyCtaCloser />
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a 5-chapter editorial spine from the rich `PortfolioProject`.
 *
 * If the project doesn't ship at least 3 chapters, we let the page fall
 * back to the curated FALLBACK_CHAPTERS content instead of rendering a
 * thin, incomplete editorial.
 */
function deriveChaptersFromProject(
  project: Awaited<ReturnType<typeof getProjectBySlug>>,
): ReadonlyArray<CaseStudyChapter> | null {
  if (!project) return null;
  if (project.chapters.length < 3) return null;

  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"] as const;
  return project.chapters.slice(0, numerals.length).map((c, idx) => ({
    numeral: numerals[idx] ?? String(idx + 1),
    title: c.name,
    body: [c.description?.replace(/^TODO:\s*/, "") || project.tagline],
    image: c.images[0]?.src ?? project.coverImage.src,
    imageAlt: c.images[0]?.alt ?? c.name,
  }));
}

