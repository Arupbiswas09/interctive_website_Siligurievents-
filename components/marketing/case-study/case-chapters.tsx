"use client";

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import type { ProjectChapter, ProjectImage } from "@/lib/cms/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseChaptersProps {
  chapters: ReadonlyArray<ProjectChapter>;
}

/**
 * Case study — "The chapters". For weddings: Haldi → Mehendi → Sangeet →
 * Wedding → Reception. See docs/05 §5.6 section 5 + docs/06 MO-08.
 *
 * Each chapter image is revealed via clip-path inset (100% → 0%) as it
 * scrolls into view (MaskedReveal). Reduced motion: images appear at rest.
 *
 * Chapter number + name uses a sticky-feeling layout: title column on the
 * left holds while images flow on the right, then the next chapter takes
 * over. This is achieved with simple sticky positioning (no ScrollTrigger
 * pin — keeping us inside the §6.2 motion budget of 2 pinned sections).
 */
export function CaseChapters({ chapters }: CaseChaptersProps): ReactElement {
  return (
    <Section tone="elevated" spacing="xl" as="section">
      <Container>
        <header className="mb-[var(--space-24)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow tone="accent">04 · The chapters</Eyebrow>
          </div>
          <div className="md:col-span-8">
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="Told as it unfolded."
              className="italic"
            />
            <p className="mt-[var(--space-6)] max-w-[60ch] text-[length:var(--text-lg)] text-[color:var(--color-ink-muted)]">
              {/* TODO: replace with per-project intro copy from CMS. */}
              Each chapter staged on its own day, lit on its own cue. Read
              top-to-bottom, the way the days actually arrived.
            </p>
          </div>
        </header>

        <ol className="flex flex-col gap-[var(--space-32)]">
          {chapters.map((chapter, idx) => (
            <Chapter
              key={chapter.slug}
              chapter={chapter}
              index={idx}
              total={chapters.length}
            />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Chapter — sticky meta column + revealed image stack on the right.
// ---------------------------------------------------------------------------

interface ChapterProps {
  chapter: ProjectChapter;
  index: number;
  total: number;
}

function Chapter({ chapter, index, total }: ChapterProps): ReactElement {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li
      id={`chapter-${chapter.slug}`}
      className="scroll-mt-[var(--space-32)] grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-12)]"
    >
      {/* Meta column — sticks while images flow. */}
      <div className="md:col-span-4">
        <div className="md:sticky md:top-[120px]">
          <p
            className={cn(
              "font-display text-[length:var(--text-4xl)] leading-none",
              "text-[color:var(--color-gold)]",
            )}
            aria-hidden="true"
          >
            {number} <span className="text-[color:var(--color-ink-soft)]">/ {String(total).padStart(2, "0")}</span>
          </p>
          <h3 className="font-display mt-[var(--space-4)] text-[length:var(--text-3xl)] italic text-[color:var(--color-ink)]">
            {chapter.name}
          </h3>
          <p className="mt-[var(--space-4)] max-w-[40ch] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
            {chapter.description}
          </p>
        </div>
      </div>

      {/* Image column — MaskedReveal per tile. */}
      <div className="md:col-span-8">
        <div className="flex flex-col gap-[var(--space-6)]">
          {chapter.images.map((img, imgIdx) => (
            <MaskedReveal
              key={img.id}
              image={img}
              priority={index === 0 && imgIdx === 0}
              /** Offset start a touch so subsequent images reveal one after another. */
              startOffset={imgIdx * 80}
            />
          ))}
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// MaskedReveal (MO-08) — clip-path inset 100% → 0% on scroll-into-view.
// ---------------------------------------------------------------------------

interface MaskedRevealProps {
  image: ProjectImage;
  /** Priority load for first image on the page. */
  priority?: boolean;
  /** Optional ScrollTrigger start offset in pixels, distinguishes sibling tiles. */
  startOffset?: number;
}

function MaskedReveal({
  image,
  priority = false,
  startOffset = 0,
}: MaskedRevealProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "cubic-bezier(0.85, 0, 0.15, 1)",
          scrollTrigger: {
            trigger: el,
            start: `top-=${startOffset} 80%`,
            once: true,
          },
        },
      );
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion, startOffset]);

  return (
    <figure
      className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <div
        ref={ref}
        className="absolute inset-0 will-change-[clip-path]"
        // Initial value mirrors the GSAP `from` state so SSR doesn't flash
        // the full image before hydration completes.
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      </div>
      {/* Fallback for users with JS disabled — image still resolves via Image fill. */}
      <noscript>
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {/* biome-ignore lint/a11y/useAltText: alt is provided via the React <Image>; this is the no-JS fallback */}
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </noscript>
    </figure>
  );
}
