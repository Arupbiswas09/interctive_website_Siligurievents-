"use client";

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { tintFromImage } from "@/lib/gsap";
import type { ProjectImage } from "@/lib/cms/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseCoverProps {
  title: string;
  ceremonyName: string;
  locationName: string;
  /** ISO date string. Rendered in Indian English DD MMM YYYY. */
  date: string;
  tagline: string;
  coverImage: ProjectImage;
  /** Slug used for the View Transitions shared-element name. */
  slug: string;
}

/**
 * Case study cover — full-bleed hero. See docs/05 §5.6 + docs/06 §6.10.
 *
 * GSAP timeline on scroll:
 *   - Background image parallax (yPercent: -10 → 10, scrub).
 *   - Title fades + lifts as the user scrolls deeper.
 *
 * The cover image carries `viewTransitionName: project-cover-{slug}` so
 * navigating in from /portfolio crossfades the shared element (graceful
 * no-op where View Transitions API is unsupported).
 */
export function CaseCover({
  title,
  ceremonyName,
  locationName,
  date,
  tagline,
  coverImage,
  slug,
}: CaseCoverProps): ReactElement {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // SIG-06 "ColorThief" ambient tint — the section's `--ambient-tint`
  // shifts based on the cover image's dominant colour as the user scrolls
  // past. Lazy + Save-Data aware inside the factory. We resolve the
  // <img> via querySelector so we don't depend on the next/image ref API.
  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    if (!root || !bg) return;
    const img = bg.querySelector("img");
    if (!img) return;
    const cleanup = tintFromImage({
      image: img,
      target: root,
      cssVar: "--ambient-tint",
    });
    return cleanup;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const title = titleRef.current;
    const hint = hintRef.current;
    if (!root) return;

    if (prefersReducedMotion) {
      if (title) gsap.set(title, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Entrance — title and hint.
      if (title) {
        gsap.fromTo(
          title,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 1.1, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
      }
      if (hint) {
        gsap.fromTo(
          hint,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 0.85, y: 0, duration: 0.8, delay: 1.2, ease: "power2.out" },
        );
      }

      // Background parallax — scrubbed across cover height.
      if (bg) {
        gsap.fromTo(
          bg,
          { yPercent: -10, scale: 1.06 },
          {
            yPercent: 10,
            scale: 1.0,
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

      // Title fades out as the page scrolls past the cover.
      if (title) {
        gsap.to(title, {
          autoAlpha: 0,
          y: -48,
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
      aria-label={`${title} — cover`}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0E0B08] text-[#F5EDE0]"
    >
      {/* Background image + scrim */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          // Shared element transition with the masonry tile.
          viewTransitionName: `project-cover-${slug}`,
        }}
      >
        <Image
          src={coverImage.src}
          alt={coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* SIG-09 "Reza" — generative SVG grain overlay (4% opacity, multiply). */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-multiply"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="case-cover-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              seed={5}
            />
            <feColorMatrix
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#case-cover-grain)" />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,11,8,0.55) 0%, rgba(14,11,8,0.20) 30%, rgba(14,11,8,0.55) 75%, rgba(14,11,8,0.85) 100%)",
          }}
        />
      </div>

      {/* Foreground — title, meta, scroll hint */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-[var(--space-16)] md:pb-[var(--space-24)]">
        <Container>
          <div ref={titleRef} className="flex max-w-[1100px] flex-col gap-[var(--space-6)]">
            <Eyebrow tone="gold">
              {ceremonyName} · {locationName} · {formatIndianDate(date)}
            </Eyebrow>
            <h1
              className={cn(
                "font-display italic",
                "text-balance leading-[1.02] tracking-[var(--tracking-display)]",
                "text-[length:var(--text-5xl)] md:text-[length:var(--text-6xl)]",
                "text-[#F5EDE0]",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed",
                "text-[#F5EDE0]/85",
              )}
            >
              {tagline}
            </p>
          </div>
        </Container>

        <div
          ref={hintRef}
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

function formatIndianDate(iso: string): string {
  // Indian English — DD MMM YYYY (per CLAUDE.md §7).
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
