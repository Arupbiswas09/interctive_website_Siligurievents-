"use client";

/**
 * Case study — Hero.
 *
 * Full-bleed 100svh cover image with brass corner gilt, slow Ken Burns
 * scale, scrub parallax, and editorial overlay positioned bottom-left.
 *
 * Honours `prefers-reduced-motion` (no scrub, no Ken Burns), uses
 * next/image with `fill` + `priority`, and registers ScrollTrigger inside
 * a window guard. Owns at most one pinned ScrollTrigger per viewport.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import type { PortfolioProject } from "@/lib/cms/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudyHeroProps {
  project: PortfolioProject;
}

const FALLBACK_HERO =
  "/media/decor-pairs/mandap-01-night.avif";

export function CaseStudyHero({ project }: CaseStudyHeroProps): ReactElement {
  const rootRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const heroImage = project.coverImage;
  const guests =
    project.specs.find((s) => /guest/i.test(s.label))?.value ?? "—";
  const days = project.specs.find((s) => /day/i.test(s.label))?.value ?? "—";

  useEffect(() => {
    const root = rootRef.current;
    const img = imageRef.current;
    const meta = metaRef.current;
    const cue = cueRef.current;
    if (!root) return;

    if (prefersReducedMotion) {
      if (meta) gsap.set(meta, { autoAlpha: 1, y: 0 });
      if (cue) gsap.set(cue, { autoAlpha: 0.75 });
      return;
    }

    const ctx = gsap.context(() => {
      if (meta) {
        gsap.fromTo(
          meta,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
      }
      if (cue) {
        gsap.fromTo(
          cue,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 0.8, y: 0, duration: 0.8, delay: 1.1, ease: "power2.out" },
        );
      }

      // Slow Ken Burns + scrub parallax (image)
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.0 },
          {
            yPercent: 12,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Fade meta out as user scrolls past the hero.
      if (meta) {
        gsap.to(meta, {
          autoAlpha: 0,
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
        });
      }
    }, root);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={rootRef}
      aria-label={`${project.title} — cover`}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0E0B08] text-[#F5EDE0]"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src={heroImage?.src || FALLBACK_HERO}
          alt={heroImage?.alt || project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,11,8,0.55) 0%, rgba(14,11,8,0.18) 28%, rgba(14,11,8,0.55) 72%, rgba(14,11,8,0.88) 100%)",
          }}
        />
      </div>

      {/* Brass gilt corners — all four corners */}
      <BrassCorner position="tl" />
      <BrassCorner position="tr" />
      <BrassCorner position="bl" />
      <BrassCorner position="br" />

      {/* Editorial overlay — bottom-left rail */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-[var(--space-16)] md:pb-[var(--space-24)]">
        <Container>
          <div
            ref={metaRef}
            className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-12 md:items-end"
          >
            <div className="md:col-span-9">
              <p
                className={cn(
                  "mb-[var(--space-4)] inline-flex items-center gap-[var(--space-2)]",
                  "text-[length:var(--text-xs)] font-medium uppercase",
                  "tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold-soft)]",
                )}
              >
                <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--color-gold)] opacity-80" />
                {project.ceremonyName} · {project.year}
              </p>
              <h1
                className={cn(
                  "font-display italic font-extralight",
                  "text-balance leading-[1.0] tracking-[var(--tracking-display-tight)]",
                  "text-[clamp(40px,9vw,96px)]",
                  "text-[#F5EDE0]",
                )}
              >
                {project.title}
              </h1>
              <p
                className={cn(
                  "mt-[var(--space-6)] flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-1)]",
                  "text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)]",
                  "text-[#F5EDE0]/70",
                )}
              >
                <span>{project.locationName}</span>
                <span aria-hidden="true" className="text-[color:var(--color-gold)]">·</span>
                <span>{guests} guests</span>
                <span aria-hidden="true" className="text-[color:var(--color-gold)]">·</span>
                <span>{days} days</span>
              </p>
            </div>
          </div>
        </Container>

        <div
          ref={cueRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-[var(--space-4)]",
            "flex flex-col items-center gap-[var(--space-2)]",
            "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
            "text-[#F5EDE0]/70",
          )}
        >
          <span>Scroll to read</span>
          <span className="block h-8 w-px bg-[#F5EDE0]/40" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Brass corner gilt — pure SVG, currentColor + brass gold tone.
// ---------------------------------------------------------------------------

type CornerPosition = "tl" | "tr" | "bl" | "br";

function BrassCorner({ position }: { position: CornerPosition }): ReactElement {
  const sizeClass = "h-[clamp(40px,5vw,72px)] w-[clamp(40px,5vw,72px)]";
  const positionMap: Record<CornerPosition, string> = {
    tl: "top-[var(--space-4)] left-[var(--space-4)] md:top-[var(--space-6)] md:left-[var(--space-6)]",
    tr: "top-[var(--space-4)] right-[var(--space-4)] md:top-[var(--space-6)] md:right-[var(--space-6)] rotate-90",
    bl: "bottom-[var(--space-4)] left-[var(--space-4)] md:bottom-[var(--space-6)] md:left-[var(--space-6)] -rotate-90",
    br: "bottom-[var(--space-4)] right-[var(--space-4)] md:bottom-[var(--space-6)] md:right-[var(--space-6)] rotate-180",
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className={cn(
        "pointer-events-none absolute z-20 text-[color:var(--color-gold)]",
        sizeClass,
        positionMap[position],
      )}
      fill="none"
    >
      <path
        d="M2 28 V4 H28"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        opacity="0.95"
      />
      <path
        d="M8 18 V10 H18"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="square"
        opacity="0.55"
      />
      <circle cx="4" cy="4" r="1.4" fill="currentColor" opacity="0.95" />
    </svg>
  );
}
