"use client";

/**
 * Case study — Next project teaser.
 *
 * Pinned scroll section. As the user scrolls, a large image of the next
 * project comes into view, ultimately filling the screen. At progress=0.5
 * a small "Next case study →" link appears; by progress=1 the user has
 * "arrived" at the teaser and the title fades in.
 *
 * Cleanup pins on unmount. Honours reduced motion (no pin, no scrub —
 * renders as a static large card with the same content).
 */

import Image from "next/image";
import Link from "next/link";
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

interface CaseStudyNextProjectTeaserProps {
  nextProject: PortfolioProject | null;
}

const FALLBACK_NEXT =
  "https://images.unsplash.com/photo-1590075865003-e48277fda558?auto=format&fit=crop&w=2400&q=80";

export function CaseStudyNextProjectTeaser({
  nextProject,
}: CaseStudyNextProjectTeaserProps): ReactElement | null {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const img = imageRef.current;
    const link = linkRef.current;
    const title = titleRef.current;
    if (!section || !frame || !img) return;

    if (prefersReducedMotion) {
      // Show everything at rest, no pin.
      if (link) gsap.set(link, { autoAlpha: 1, y: 0 });
      if (title) gsap.set(title, { autoAlpha: 1, y: 0 });
      gsap.set(frame, { scale: 1, borderRadius: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Frame expands from inset card to full bleed.
      tl.fromTo(
        frame,
        { scale: 0.78, borderRadius: 4 },
        { scale: 1, borderRadius: 0, ease: "none" },
        0,
      );
      // Image subtly scales inside.
      tl.fromTo(
        img,
        { scale: 1.08 },
        { scale: 1.0, ease: "none" },
        0,
      );

      if (link) {
        tl.fromTo(
          link,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, ease: "power2.out" },
          0.4,
        );
      }
      if (title) {
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, ease: "power2.out" },
          0.7,
        );
      }
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  if (!nextProject) return null;

  const image = nextProject.coverImage?.src ?? FALLBACK_NEXT;
  const alt = nextProject.coverImage?.alt ?? nextProject.title;

  return (
    <section
      ref={sectionRef}
      aria-label={`Next case study: ${nextProject.title}`}
      className="relative h-[100svh] w-full overflow-hidden bg-[#0E0B08] text-[#F5EDE0]"
    >
      <Container size="wide" className="flex h-full items-center justify-center">
        <div
          ref={frameRef}
          className={cn(
            "relative h-full w-full overflow-hidden",
            "will-change-transform",
          )}
          style={{ transformOrigin: "center center" }}
        >
          <div ref={imageRef} className="absolute inset-0 will-change-transform">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(14,11,8,0.35) 0%, rgba(14,11,8,0.1) 50%, rgba(14,11,8,0.78) 100%)",
              }}
            />
          </div>

          {/* "Next case study →" pill — appears mid-scroll */}
          <Link
            ref={linkRef}
            href={`/portfolio/${nextProject.slug}`}
            className={cn(
              "absolute right-[var(--space-6)] top-[var(--space-6)] z-10",
              "inline-flex items-center gap-[var(--space-2)]",
              "border border-[color:var(--color-gold)]/60 bg-[#0E0B08]/40 backdrop-blur-sm",
              "px-[var(--space-4)] py-[var(--space-2)]",
              "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
              "text-[color:var(--color-gold-soft)] transition-colors hover:bg-[#0E0B08]/70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]",
            )}
            style={{ opacity: 0 }}
          >
            Next case study
            <span aria-hidden="true">→</span>
          </Link>

          {/* Title — bottom anchored, appears late in scroll */}
          <div
            ref={titleRef}
            className={cn(
              "absolute inset-x-0 bottom-[var(--space-16)] md:bottom-[var(--space-24)]",
              "px-[var(--gutter)]",
            )}
            style={{ opacity: 0 }}
          >
            <div className="mx-auto max-w-[1200px]">
              <p
                className={cn(
                  "mb-[var(--space-3)] inline-flex items-center gap-[var(--space-2)]",
                  "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                  "text-[color:var(--color-gold-soft)]",
                )}
              >
                <span aria-hidden="true" className="inline-block h-px w-6 bg-[color:var(--color-gold)]" />
                You've arrived · Next case study
              </p>
              <Link
                href={`/portfolio/${nextProject.slug}`}
                className={cn(
                  "font-display italic font-extralight text-balance block",
                  "text-[clamp(40px,8vw,96px)] leading-[1.0]",
                  "tracking-[var(--tracking-display-tight)] text-[#F5EDE0]",
                  "transition-colors hover:text-[color:var(--color-gold-soft)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]",
                )}
              >
                {nextProject.title}
              </Link>
              <p
                className={cn(
                  "mt-[var(--space-4)] text-[length:var(--text-sm)]",
                  "uppercase tracking-[var(--tracking-eyebrow)] text-[#F5EDE0]/70",
                )}
              >
                {nextProject.ceremonyName} · {nextProject.locationName} · {nextProject.year}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
