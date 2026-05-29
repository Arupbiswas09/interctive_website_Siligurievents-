import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";
import { serviceImageSrc } from "@/lib/media/images";

/**
 * H5 — Services overview (docs/05-PAGE-SPECS.md §5.1 H5).
 *
 * Asymmetric grid: one big "Weddings" hero tile + 6 smaller tiles
 * (Haldi, Mehendi, Sangeet, Reception, Birthday, Corporate).
 *
 * Server Component shell — each tile owns its own hover state in CSS,
 * and `RevealOnScroll` (client) provides the per-tile staggered fade-up.
 */

type ServiceTile = {
  slug: string;
  label: string;
  tagline: string;
  imageIndex: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Gradient angle for the placeholder plate — varied for visual rhythm. */
  hue: "warm" | "cool" | "brass" | "wine" | "neutral";
};

const HERO_TILE: ServiceTile = {
  slug: "wedding",
  label: "Weddings",
  tagline: "Haldi to bidaai — one cinematic arc.",
  imageIndex: 1,
  hue: "wine",
};

const SUB_TILES: ReadonlyArray<ServiceTile> = [
  {
    slug: "haldi-gaye-holud",
    label: "Haldi",
    tagline: "Marigold-saturated mornings.",
    imageIndex: 2,
    hue: "brass",
  },
  {
    slug: "mehendi",
    label: "Mehendi",
    tagline: "Low cushions, mirror work, a courtyard that hums.",
    imageIndex: 3,
    hue: "warm",
  },
  {
    slug: "sangeet",
    label: "Sangeet",
    tagline: "A stage, a dance floor, a story.",
    imageIndex: 4,
    hue: "cool",
  },
  {
    slug: "reception",
    label: "Reception",
    tagline: "The first walk-in as a couple.",
    imageIndex: 5,
    hue: "wine",
  },
  {
    slug: "balloon-decoration",
    label: "Balloon Decor",
    tagline: "Birthday & event balloon decoration, styled clean.",
    imageIndex: 6,
    hue: "neutral",
  },
  {
    slug: "corporate-events",
    label: "Corporate",
    tagline: "Brand-grade events, on-time and on-message.",
    imageIndex: 7,
    hue: "cool",
  },
];

const HUE_BG: Record<ServiceTile["hue"], string> = {
  warm: "linear-gradient(155deg, rgba(232,213,168,0.85) 0%, rgba(184,137,58,0.65) 100%)",
  cool: "linear-gradient(155deg, rgba(30,42,56,0.75) 0%, rgba(26,23,20,0.85) 100%)",
  brass:
    "linear-gradient(155deg, rgba(184,137,58,0.80) 0%, rgba(139,26,26,0.55) 100%)",
  wine: "linear-gradient(155deg, rgba(139,26,26,0.85) 0%, rgba(26,23,20,0.85) 100%)",
  neutral:
    "linear-gradient(155deg, rgba(250,247,242,0.96) 0%, rgba(232,213,168,0.55) 100%)",
};

export function HomeServicesOverview(): React.ReactElement {
  return (
    <Section as="section" tone="elevated" spacing="lg" id="home-services">
      <Container>
        <div className="mb-[var(--space-12)] flex max-w-[64ch] flex-col gap-[var(--space-3)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">What we do</Eyebrow>
          </RevealOnScroll>
          <DisplayHeading
            as="h2"
            size="lg"
            split
            splitMode="words"
            text="Decor for every chapter."
          />
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-12 md:grid-rows-2 md:gap-[var(--space-6)]">
          {/* Big hero tile — Weddings. Spans 6 cols, both rows. */}
          <RevealOnScroll
            as="div"
            className="md:col-span-6 md:row-span-2"
          >
            <ServiceTileCard tile={HERO_TILE} variant="hero" />
          </RevealOnScroll>

          {SUB_TILES.map((tile, idx) => (
            <RevealOnScroll
              key={tile.slug}
              as="div"
              delay={0.08 * (idx + 1)}
              className="md:col-span-3"
            >
              <ServiceTileCard tile={tile} variant="small" />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ServiceTileCard({
  tile,
  variant,
}: {
  tile: ServiceTile;
  variant: "hero" | "small";
}): React.ReactElement {
  const isHero = variant === "hero";
  const lightOnDark = tile.hue !== "neutral" && tile.hue !== "warm";
  return (
    <Link
      href={`/services/${tile.slug}`}
      className={cn(
        "group relative block overflow-hidden",
        "rounded-[var(--radius-md)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-elevated)]",
        isHero ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-[4/5]",
      )}
    >
      {/* Image plate — zooms 1.03 on hover (CSS — no JS cost). */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)]",
          "group-hover:scale-[1.03] group-focus-visible:scale-[1.03]",
        )}
      >
        <Image
          src={serviceImageSrc(tile.imageIndex)}
          alt={`${tile.label} event decoration`}
          fill
          sizes={
            isHero
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
          className="object-cover"
        />
        <div
          className="absolute inset-0 opacity-35 mix-blend-multiply"
          style={{ background: HUE_BG[tile.hue] }}
        />
      </div>
      {/* Bottom scrim. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-2/3",
          lightOnDark
            ? "bg-gradient-to-t from-black/70 to-transparent"
            : "bg-gradient-to-t from-white/85 to-transparent",
        )}
      />
      {/* Accent line — draws across on hover. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-[var(--space-4)] left-[var(--space-6)] right-[var(--space-6)] h-px",
          lightOnDark ? "bg-white/70" : "bg-[color:var(--color-ink)]/70",
          // 0% → 100% width via scaleX, transform-origin left.
          "origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out)]",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
        )}
      />
      {/* Label cluster — slides up on hover. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-[var(--space-2)] p-[var(--space-6)]",
          "transition-transform duration-500 ease-[var(--ease-out)]",
          "group-hover:-translate-y-[var(--space-3)] group-focus-visible:-translate-y-[var(--space-3)]",
          lightOnDark ? "text-white" : "text-[color:var(--color-ink)]",
        )}
      >
        <h3
          className={cn(
            "font-display leading-tight",
            isHero
              ? "text-[length:var(--text-4xl)]"
              : "text-[length:var(--text-2xl)]",
          )}
        >
          {tile.label}
        </h3>
        <p
          className={cn(
            "max-w-[36ch] text-[length:var(--text-sm)] leading-snug",
            lightOnDark ? "text-white/80" : "text-[color:var(--color-ink-muted)]",
          )}
        >
          {tile.tagline}
        </p>
      </div>
    </Link>
  );
}
