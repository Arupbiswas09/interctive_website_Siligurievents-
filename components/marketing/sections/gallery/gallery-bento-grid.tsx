"use client";

/**
 * GalleryBentoGrid — asymmetric bento masonry of the studio's case studies.
 *
 * Behaviour:
 *   • Ceremony filter chips live at the top of this section (state is
 *     local so chips + tiles stay coupled).
 *   • Grid uses a 12-column CSS grid with row-spanning tiles; each project
 *     declares a `size` that maps to a (cols × rows) recipe.
 *   • Tiles use `SplitImage` on hover for the regular surface and
 *     `ParallaxStack` for the "feature" tile (a depth-layered hero).
 *   • Brass `MandalaOrnament` corner accent, plus an animated meta caption
 *     that slides up on hover / focus.
 *   • Entrance: GSAP `ScrollTrigger.batch` fades + lifts tiles as they
 *     enter the viewport (cancelled when reduced motion).
 *   • Filter changes are FLIP-animated by Framer Motion `<AnimatePresence>`
 *     with `layout` so tiles re-flow rather than snap.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitImage } from "@/components/effects/3d-split-image";
import { ParallaxStack } from "@/components/effects/3d-parallax-stack";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Photo pool (Unsplash hostnames are whitelisted in next.config) ──────
const PHOTOS: ReadonlyArray<string> = [
  "/images/services/svc-05.webp",
  "/images/services/svc-03.webp",
  "/media/decor-pairs/stage-01-day.avif",
  "/images/work/work-05.webp",
  "/images/work/work-05.webp",
  "/media/decor-pairs/stage-01-night.avif",
  "/images/marketing/work-02.jpg",
  "/images/services/svc-03.webp",
  "/media/decor-pairs/stage-01-night.avif",
  "/images/marketing/work-02.jpg",
  "/images/marketing/work-05.jpg",
  "/images/marketing/work-02.jpg",
  "/images/work/work-02.webp",
  "/images/marketing/work-02.jpg",
  "/images/services/svc-05.webp",
];

// ─── Data model ──────────────────────────────────────────────────────────
type Ceremony =
  | "Wedding"
  | "Pre-wedding"
  | "Reception"
  | "Corporate"
  | "Festival";

type TileSize = "wide" | "tall" | "square" | "feature";

type Project = {
  id: string;
  title: string;
  ceremony: Ceremony;
  location: string;
  year: number;
  image: string;
  size: TileSize;
};

const PROJECTS: ReadonlyArray<Project> = [
  { id: "01", title: "Jasmine mandap", ceremony: "Wedding", location: "Siliguri", year: 2025, image: PHOTOS[3]!, size: "feature" },
  { id: "02", title: "Wine & gold sangeet", ceremony: "Pre-wedding", location: "Darjeeling", year: 2025, image: PHOTOS[7]!, size: "tall" },
  { id: "03", title: "Marigold haldi", ceremony: "Pre-wedding", location: "Dooars", year: 2024, image: PHOTOS[2]!, size: "wide" },
  { id: "04", title: "Tea garden reception", ceremony: "Reception", location: "Jalpaiguri", year: 2024, image: PHOTOS[8]!, size: "square" },
  { id: "05", title: "Henna pavilion", ceremony: "Pre-wedding", location: "Siliguri", year: 2025, image: PHOTOS[4]!, size: "wide" },
  { id: "06", title: "Tata Tea launch", ceremony: "Corporate", location: "Siliguri", year: 2025, image: PHOTOS[12]!, size: "tall" },
  { id: "07", title: "Bengali bridal", ceremony: "Wedding", location: "Siliguri", year: 2024, image: PHOTOS[1]!, size: "square" },
  { id: "08", title: "Chandelier banquet", ceremony: "Reception", location: "Darjeeling", year: 2025, image: PHOTOS[9]!, size: "wide" },
  { id: "09", title: "Champagne engagement", ceremony: "Pre-wedding", location: "Siliguri", year: 2024, image: PHOTOS[10]!, size: "tall" },
  { id: "10", title: "Durga Puja pandal", ceremony: "Festival", location: "Siliguri", year: 2024, image: PHOTOS[6]!, size: "wide" },
  { id: "11", title: "Cocktail in cobalt", ceremony: "Reception", location: "Siliguri", year: 2025, image: PHOTOS[12]!, size: "square" },
  { id: "12", title: "Rose petal aisle", ceremony: "Wedding", location: "Dooars", year: 2025, image: PHOTOS[0]!, size: "wide" },
];

type FilterDef = { label: string; match: (p: Project) => boolean };

const FILTER_DEFS: ReadonlyArray<FilterDef> = [
  { label: "All", match: () => true },
  { label: "Weddings", match: (p) => p.ceremony === "Wedding" },
  { label: "Pre-wedding", match: (p) => p.ceremony === "Pre-wedding" },
  { label: "Receptions", match: (p) => p.ceremony === "Reception" },
  { label: "Corporate", match: (p) => p.ceremony === "Corporate" },
  { label: "Festivals", match: (p) => p.ceremony === "Festival" },
];

// ─── Tile size → grid cell recipe ────────────────────────────────────────
const SIZE_CLASS: Record<TileSize, string> = {
  feature:
    "md:col-span-7 md:row-span-2 aspect-[16/11] md:aspect-auto md:min-h-[680px]",
  wide: "md:col-span-7 md:row-span-1 aspect-[16/10] md:aspect-auto md:min-h-[320px]",
  tall: "md:col-span-5 md:row-span-2 aspect-[3/4] md:aspect-auto md:min-h-[680px]",
  square: "md:col-span-5 md:row-span-1 aspect-square md:aspect-auto md:min-h-[320px]",
};

// ─── Section component ──────────────────────────────────────────────────
export function GalleryBentoGrid(): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const activeFilter = FILTER_DEFS[activeIndex] ?? FILTER_DEFS[0]!;
  const visible = useMemo<ReadonlyArray<Project>>(
    () => PROJECTS.filter((p) => activeFilter.match(p)),
    [activeFilter],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tiles = section.querySelectorAll<HTMLElement>("[data-gallery-tile]");
      if (tiles.length === 0) return;

      ScrollTrigger.batch(Array.from(tiles), {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.05,
              overwrite: "auto",
            },
          );
        },
        once: true,
      });
    }, section);

    return (): void => {
      ctx.revert();
    };
    // Re-run entrance setup if the visible set materially changes.
  }, [prefersReducedMotion, visible.length]);

  return (
    <section
      ref={sectionRef}
      data-tone="default"
      className="relative w-full bg-[color:var(--color-bg)] py-[var(--space-16)] text-[color:var(--color-ink)] md:py-[var(--space-24)]"
    >
      <Container size="wide">
        {/* Toolbar — eyebrow + filter chips + result count */}
        <div className="mb-[var(--space-12)] flex flex-col gap-[var(--space-6)] md:sticky md:top-20 md:z-30 md:-mx-2 md:rounded-[var(--radius-md)] md:bg-[color:var(--color-bg)]/85 md:px-2 md:py-3 md:backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <Eyebrow tone="gold">The work · Bento</Eyebrow>
            <span
              className="font-mono text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {visible.length.toString().padStart(2, "0")} pieces
            </span>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Ceremony category filter"
          >
            {FILTER_DEFS.map((f, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={f.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[length:var(--text-sm)] tracking-tight transition-[background-color,color,border-color,transform] duration-200 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
                    active
                      ? "bg-[color:var(--color-gold-deep)] text-[color:var(--color-ink)] shadow-[0_6px_18px_-8px_rgba(168,123,63,0.55)]"
                      : "border border-[color:var(--color-ink)]/30 bg-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/70 hover:bg-[color:var(--color-bg-elevated)]",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento grid */}
        <ul
          className="grid grid-cols-1 gap-[var(--space-4)] md:auto-rows-[160px] md:grid-cols-12 md:gap-[var(--space-5)]"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.id}
                layout
                data-gallery-tile
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, y: 16 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.9, y: -8 }
                }
                transition={{
                  layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  default: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
                className={cn(
                  "group relative col-span-1 overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-bg-elevated)]",
                  SIZE_CLASS[project.size],
                )}
              >
                <GalleryTile project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Container>
    </section>
  );
}

// ─── Single tile ────────────────────────────────────────────────────────
function GalleryTile({ project }: { project: Project }): ReactElement {
  const isFeature = project.size === "feature";

  return (
    <article className="relative h-full w-full">
      {/* Image surface */}
      <div className="absolute inset-0">
        {isFeature ? (
          <ParallaxStack
            className="h-full w-full"
            travel={20}
            layers={[
              {
                src: project.image,
                alt: project.title,
                depth: 0.25,
                width: 1600,
                height: 1100,
              },
              {
                src: project.image,
                alt: "",
                depth: 0.7,
                width: 1600,
                height: 1100,
                className: "opacity-70 mix-blend-luminosity",
              },
            ]}
          />
        ) : (
          <SplitImage
            src={project.image}
            alt={project.title}
            panels={3}
            axis="horizontal"
            trigger="hover"
            width={1600}
            height={1000}
            className="h-full w-full"
          />
        )}
      </div>

      {/* Brass corner ornament */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-8 w-8 opacity-70"
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      {/* Bottom-edge ink gradient for caption legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(14,11,8,0.78) 85%, rgba(14,11,8,0.92) 100%)",
        }}
      />

      {/* Meta caption — slides up on hover/focus */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-[var(--space-5)] text-[color:#f4ecdf] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:p-[var(--space-6)]">
        <span
          className="font-mono text-[length:var(--text-xs)] uppercase tracking-[0.22em] text-[color:var(--color-gold-soft)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {project.id}
        </span>
        <h3
          className="mt-1 font-display italic"
          style={{
            fontSize: isFeature
              ? "clamp(1.5rem, 2.6vw, 2.25rem)"
              : "clamp(1.125rem, 1.8vw, 1.6rem)",
            lineHeight: 1.05,
            fontWeight: 300,
          }}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:#f4ecdf]/80">
          {project.ceremony} · {project.location} · {project.year}
        </p>
      </div>

      {/* Focusable anchor — keeps tile in the tab order for accessibility. */}
      <a
        href="#"
        aria-label={`${project.title} — ${project.ceremony} in ${project.location}, ${project.year}`}
        className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
        onClick={(e) => e.preventDefault()}
      />
    </article>
  );
}
