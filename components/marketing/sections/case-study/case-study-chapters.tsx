"use client";

/**
 * Case study — Chapters (editorial body).
 *
 * Five chapters in alternating layouts. Each chapter has a giant numeral on
 * the left, italic h2, two paragraphs of body copy, and ONE inline image
 * with brass gilt. Image alignment alternates (odd → right, even → left).
 *
 * Optional pull quote per chapter — rendered as a centred blockquote in
 * font-display italic.
 *
 * Honours reduced motion (no scroll-tied reveals). Each chapter section is
 * tagged `id="chapter-{numeral}"` so the chapter rail can highlight it.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CaseStudyChapter {
  numeral: string;
  title: string;
  body: ReadonlyArray<string>;
  image: string;
  imageAlt?: string;
  quote?: string;
}

interface CaseStudyChaptersProps {
  chapters: ReadonlyArray<CaseStudyChapter>;
}

export function CaseStudyChapters({
  chapters,
}: CaseStudyChaptersProps): ReactElement {
  return (
    <Section tone="default" spacing="xl" as="section">
      <Container>
        <ol className="flex flex-col gap-[var(--space-32)]">
          {chapters.map((chapter, idx) => (
            <Chapter
              key={chapter.numeral}
              chapter={chapter}
              index={idx}
            />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------

interface ChapterProps {
  chapter: CaseStudyChapter;
  index: number;
}

function Chapter({ chapter, index }: ChapterProps): ReactElement {
  const rootRef = useRef<HTMLLIElement | null>(null);
  const numeralRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // odd index → image right, even index → image left (alternating rhythm).
  const imageOnRight = index % 2 === 0;

  useEffect(() => {
    const root = rootRef.current;
    const numeral = numeralRef.current;
    if (!root) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (numeral) {
        gsap.fromTo(
          numeral,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          },
        );
      }
    }, root);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <li
      ref={rootRef}
      id={`chapter-${chapter.numeral}`}
      className="scroll-mt-[var(--space-24)]"
    >
      <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-12)]">
        {/* Numeral — large, ink-soft */}
        <div
          ref={numeralRef}
          className={cn(
            "md:col-span-2",
            imageOnRight ? "" : "md:order-1",
          )}
        >
          <p
            aria-hidden="true"
            className={cn(
              "font-display font-extralight leading-[0.85]",
              "text-[clamp(80px,12vw,160px)]",
              "tracking-[var(--tracking-display-tight)]",
              "text-[color:var(--color-ink-soft)]",
            )}
          >
            {chapter.numeral}
          </p>
        </div>

        {/* Text column */}
        <div
          className={cn(
            "flex flex-col gap-[var(--space-6)]",
            imageOnRight ? "md:col-span-5" : "md:col-span-5 md:order-2",
          )}
        >
          <h2
            className={cn(
              "font-display italic font-normal text-balance",
              "text-[length:var(--text-3xl)] md:text-[length:var(--text-4xl)]",
              "leading-[1.05] tracking-[var(--tracking-display)]",
              "text-[color:var(--color-ink)]",
            )}
          >
            {chapter.title}
          </h2>

          {chapter.body.map((para, pIdx) => (
            <p
              key={`p-${chapter.numeral}-${pIdx.toString()}`}
              className={cn(
                "text-[length:var(--text-lg)] leading-[1.7]",
                "max-w-[58ch] text-[color:var(--color-ink-muted)]",
              )}
            >
              {para}
            </p>
          ))}

          {chapter.quote ? (
            <blockquote
              className={cn(
                "mt-[var(--space-4)] border-l-2 border-[color:var(--color-gold)]",
                "py-[var(--space-2)] pl-[var(--space-6)]",
                "font-display italic text-[length:var(--text-xl)] leading-[1.4]",
                "max-w-[40ch] text-[color:var(--color-ink)]",
              )}
            >
              “{chapter.quote}”
            </blockquote>
          ) : null}
        </div>

        {/* Image column with brass gilt */}
        <div
          className={cn(
            "md:col-span-5",
            imageOnRight ? "" : "md:order-3",
          )}
        >
          <ChapterImage src={chapter.image} alt={chapter.imageAlt ?? chapter.title} />
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------

interface ChapterImageProps {
  src: string;
  alt: string;
}

function ChapterImage({ src, alt }: ChapterImageProps): ReactElement {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = imgRef.current;
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
          duration: 1.3,
          ease: "cubic-bezier(0.85, 0, 0.15, 1)",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, el);
    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <figure
      className={cn(
        "group relative w-full overflow-hidden rounded-[var(--radius-sm)]",
        "bg-[color:var(--color-bg-elevated)]",
      )}
      style={{ aspectRatio: "4 / 5" }}
    >
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
      {/* Brass gilt frame — inner 1px line + outer 4 corner marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-gold)]/45"
      />
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span
          aria-hidden="true"
          key={pos}
          className={cn(
            "pointer-events-none absolute h-3 w-3 border-[color:var(--color-gold)]",
            pos === "tl" && "top-0 left-0 border-t-[1.5px] border-l-[1.5px]",
            pos === "tr" && "top-0 right-0 border-t-[1.5px] border-r-[1.5px]",
            pos === "bl" && "bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]",
            pos === "br" && "bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]",
          )}
        />
      ))}
    </figure>
  );
}
