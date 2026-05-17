"use client";

/**
 * LocationDetailProjects — projects done in this city.
 *
 * Uses `getProjectsByLocation(slug)` data passed in by the page, falls back
 * to a curated set of Unsplash photographs when nothing has been catalogued
 * yet. SplitImage hover effect with brass corners on each card.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SplitImage } from "@/components/effects/3d-split-image";
import type { Location } from "@/lib/cms/locations";
import type { Project } from "@/lib/cms/projects";

/** Decor-focused fallback imagery. Pulled from the curated Unsplash pool. */
const FALLBACK_IMAGES: ReadonlyArray<string> = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1607261504259-c9bf36e8e6e8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1590075865003-e48277fda558?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1600&q=80",
];

type LocationDetailProjectsProps = {
  location: Location;
  projects: ReadonlyArray<Project>;
};

type CardData = {
  slug: string;
  title: string;
  ceremony: string;
  year: number;
  image: string;
  href: string;
};

export function LocationDetailProjects({
  location,
  projects,
}: LocationDetailProjectsProps): React.ReactElement {
  const cards: ReadonlyArray<CardData> =
    projects.length > 0
      ? projects.map((p, idx) => ({
          slug: p.slug,
          title: p.title,
          ceremony: p.ceremony,
          year: p.year,
          image:
            p.coverImageUrl?.startsWith("http")
              ? p.coverImageUrl
              : (FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] ?? FALLBACK_IMAGES[0]!),
          href: `/portfolio/${p.slug}`,
        }))
      : FALLBACK_IMAGES.slice(0, 4).map((image, idx) => ({
          slug: `placeholder-${idx}`,
          title: `A recent ${location.shortName} project`,
          ceremony: ["Wedding", "Reception", "Sangeet", "Annaprashan"][idx]!,
          year: 2025 - (idx % 2),
          image,
          href: "/portfolio",
        }));

  return (
    <Section tone="default" spacing="lg">
      <Container>
        <header className="mb-[var(--space-10)] flex flex-col gap-[var(--space-3)] md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[60ch] flex-col gap-[var(--space-3)]">
            <Eyebrow tone="accent">Selected work</Eyebrow>
            <DisplayHeading
              as="h2"
              size="lg"
              text={`Projects in ${location.name}`}
              className="italic"
            />
          </div>
          <Link
            href="/portfolio"
            className="text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-accent)] underline-offset-4 hover:underline"
          >
            See the full portfolio →
          </Link>
        </header>

        <ul className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <RevealOnScroll
              key={card.slug}
              delay={Math.min(idx * 0.05, 0.4)}
              as="li"
            >
              <ProjectCard card={card} />
            </RevealOnScroll>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

type ProjectCardProps = { card: CardData };

function ProjectCard({ card }: ProjectCardProps): React.ReactElement {
  return (
    <Link
      href={card.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg-elevated)]",
        "transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-[2px] hover:border-[color:var(--color-ink)] hover:shadow-[var(--shadow-card)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <SplitImage
          src={card.image}
          alt={card.title}
          panels={3}
          trigger="hover"
          width={1600}
          height={2000}
          className="h-full w-full rounded-none"
        />
        {/* Brass corner accents */}
        <BrassCorner className="absolute -left-1 -top-1 h-9 w-9" />
        <BrassCorner className="absolute -right-1 -top-1 h-9 w-9 rotate-90" />
        <BrassCorner className="absolute -bottom-1 -left-1 h-9 w-9 -rotate-90" />
        <BrassCorner className="absolute -bottom-1 -right-1 h-9 w-9 rotate-180" />
      </div>

      <div className="flex flex-col gap-[var(--space-2)] p-[var(--space-5)]">
        <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
          {card.ceremony} · {card.year}
        </p>
        <h3 className="font-display text-[length:var(--text-2xl)] italic leading-[1.05] tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
          {card.title}
        </h3>
      </div>
    </Link>
  );
}

function BrassCorner({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 18 L2 2 L18 2"
        stroke="var(--color-gold)"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <circle cx="4" cy="4" r="1.4" fill="var(--color-gold)" />
    </svg>
  );
}
