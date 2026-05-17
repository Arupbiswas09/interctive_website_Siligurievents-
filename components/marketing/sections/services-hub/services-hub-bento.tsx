"use client";

/**
 * ServicesHubBento — bento grid of all ceremonies on /services.
 *
 * Asymmetric 12-col grid; each tile is a service with a SplitImage hover
 * reveal, a brass corner ornament resolved from CEREMONY_THEMES, eyebrow,
 * italic display title, tagline and a "Read →" link.
 *
 * Tiles fade-up in batches via ScrollTrigger.batch so the visible viewport
 * only ever runs the staggered entrance for the rows the user can see.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitImage } from "@/components/effects/3d-split-image";
import {
  CeremonyOrnament,
  type OrnamentName,
} from "@/components/illustrations/ceremony-ornaments";
import { CEREMONY_THEMES } from "@/lib/ceremony/theme";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { Service, ServiceCategory } from "@/lib/cms/services";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  weddings: "Weddings",
  "pre-wedding": "Pre-wedding",
  "family-rituals": "Family ritual",
  corporate: "Corporate",
  festivals: "Festival",
};

// Fallback decoration photos for services without a heroImageUrl.
const FALLBACK_IMAGES: ReadonlyArray<string> = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1607261504259-c9bf36e8e6e8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1590075865003-e48277fda558?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=80",
];

/** Asymmetric tile sizing — repeats across the visible service list. */
const TILE_LAYOUT: ReadonlyArray<string> = [
  // Row 1 — hero + two
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  // Row 2
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  // Row 3 — wide editorial
  "lg:col-span-8",
  "lg:col-span-4",
  // Row 4
  "lg:col-span-5",
  "lg:col-span-7",
];

type ServicesHubBentoProps = {
  services: ReadonlyArray<Service>;
};

export function ServicesHubBento({
  services,
}: ServicesHubBentoProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion) return;

    const tiles = Array.from(
      root.querySelectorAll<HTMLElement>("[data-bento-tile]"),
    );
    if (tiles.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(tiles, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(tiles, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            stagger: 0.08,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section tone="default" spacing="lg">
      <Container>
        <header className="mb-[var(--space-10)] flex max-w-[80ch] flex-col gap-[var(--space-3)]">
          <Eyebrow tone="gold">The full catalogue</Eyebrow>
          <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
            Every ceremony has its own visual language — palette, ornament,
            light, sound. Tap any tile to read how we design it, see signature
            projects, and price the scope.
          </p>
        </header>

        <div
          ref={sectionRef}
          className={cn(
            "grid grid-cols-1 gap-[var(--space-5)]",
            "sm:grid-cols-2",
            "lg:grid-cols-12 lg:auto-rows-[minmax(260px,auto)]",
          )}
        >
          {services.map((service, idx) => (
            <BentoTile
              key={service.slug}
              service={service}
              spanClass={TILE_LAYOUT[idx % TILE_LAYOUT.length] ?? "lg:col-span-4"}
              fallbackImage={
                FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] ??
                FALLBACK_IMAGES[0]!
              }
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

type BentoTileProps = {
  service: Service;
  spanClass: string;
  fallbackImage: string;
};

function BentoTile({
  service,
  spanClass,
  fallbackImage,
}: BentoTileProps): React.ReactElement {
  const theme = CEREMONY_THEMES[service.slug];
  const ornamentName: OrnamentName = theme?.ornament ?? "mandala";
  const accent = theme?.palette.accent ?? "var(--color-accent)";
  const imageSrc = service.heroImageUrl?.startsWith("http")
    ? service.heroImageUrl
    : fallbackImage;
  const categoryLabel = CATEGORY_LABEL[service.category];

  return (
    <article
      data-bento-tile
      className={cn(
        "group relative isolate flex h-full min-h-[300px] flex-col overflow-hidden",
        "rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg-elevated)]",
        "transition-[transform,border-color,box-shadow] duration-500",
        "hover:-translate-y-[2px] hover:border-[color:var(--color-ink)] hover:shadow-[var(--shadow-card)]",
        spanClass,
      )}
    >
      {/* Image — SplitImage on hover for desktop, static on mobile. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SplitImage
          src={imageSrc}
          alt={service.name}
          panels={3}
          trigger="hover"
          width={1600}
          height={1200}
          className="h-full w-full rounded-none"
        />
        {/* Photo tint — bottom-up wash for legibility. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(15,12,10,0.45) 100%)",
          }}
        />
        {/* Brass corner ornament */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 h-14 w-14 opacity-90 transition-transform duration-700 group-hover:scale-105"
        >
          <CeremonyOrnament
            name={ornamentName}
            hue={accent}
            hueSecondary="var(--color-gold)"
          />
        </div>
        {/* Price band chip */}
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1",
            "rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]/85 backdrop-blur",
            "px-[var(--space-2)] py-[2px]",
            "text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-eyebrow)]",
            "text-[color:var(--color-ink-muted)]",
          )}
        >
          {service.priceBand}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--space-3)] p-[var(--space-6)]">
        <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
          {categoryLabel}
        </p>
        <h3
          className={cn(
            "font-display italic leading-[1.05] tracking-[var(--tracking-display)]",
            "text-[color:var(--color-ink)]",
            "text-[length:var(--text-3xl)]",
            "inline-block w-fit pb-[var(--space-1)]",
          )}
          style={{ borderBottom: `2px solid ${accent}` }}
        >
          {service.name}
        </h3>
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
          {service.tagline}
        </p>
        <Link
          href={`/services/${service.slug}`}
          aria-label={`Read more about ${service.name}`}
          className={cn(
            "mt-auto inline-flex items-center gap-[var(--space-2)]",
            "text-[length:var(--text-sm)] text-[color:var(--color-accent)]",
            "underline-offset-4 hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
            // Full-tile click area
            "after:absolute after:inset-0 after:content-['']",
          )}
        >
          Read
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-[3px]"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
