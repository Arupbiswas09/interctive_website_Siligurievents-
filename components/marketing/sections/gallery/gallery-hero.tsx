"use client";

/**
 * GalleryHero — editorial hero for the Gallery (`/portfolio`) page.
 *
 * Composition:
 *   • Eyebrow row: brass hairline + "Selected work · 2024 — 2025".
 *   • Oversized italic display heading, word-split, GSAP scrub reveal
 *     (each word lifts + un-blurs as the section enters the viewport).
 *   • Brass diamond divider beneath the headline.
 *   • Subline, then a looping "Scroll to wander" cue at the bottom.
 *   • Background mandala ornament, slow-rotated via ScrollTrigger scrub.
 *
 * Honours `prefers-reduced-motion` (static layout, no GSAP timelines).
 */

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADING_WORDS: ReadonlyArray<string> = [
  "Five",
  "years",
  "of",
  "mandap,",
  "marigold,",
  "and",
  "music.",
];

export function GalleryHero(): ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Reset on every render so the ref array stays in sync with the DOM.
  wordsRef.current = [];
  const collectWord = (el: HTMLSpanElement | null): void => {
    if (el && !wordsRef.current.includes(el)) wordsRef.current.push(el);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Word-by-word lift + blur fade-in, scrubbed against scroll.
      gsap.fromTo(
        wordsRef.current,
        { y: 48, autoAlpha: 0, filter: "blur(12px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.6,
          },
        },
      );

      // Slow rotation on the backdrop mandala while the hero is in view.
      if (ornamentRef.current) {
        gsap.to(ornamentRef.current, {
          rotate: 35,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <header
      ref={sectionRef}
      data-tone="default"
      className="relative isolate flex min-h-[80svh] w-full items-end overflow-hidden bg-[color:var(--color-bg)] py-[var(--space-24)] pt-[var(--space-32)] text-[color:var(--color-ink)] md:py-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      {/* Background mandala — top-right, low opacity, scrub-rotated. */}
      <div
        aria-hidden="true"
        ref={ornamentRef}
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[640px] w-[640px] opacity-[0.08] md:-right-32 md:-top-32 md:h-[820px] md:w-[820px]"
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      {/* Atmospheric wash so the heading reads cleanly. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse at 10% 0%, rgba(184,137,58,0.22) 0%, transparent 55%), radial-gradient(ellipse at 95% 80%, rgba(164,54,92,0.18) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 100%)",
          }}
        />
      </div>

      <Container className="relative pb-[var(--space-24)]">
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-10)]">
          <Eyebrow tone="gold">Selected work · 2024 — 2025</Eyebrow>

          <h1
            className="font-display italic text-[color:var(--color-ink)]"
            style={{
              fontSize: "clamp(2.75rem, 7.4vw, 7.5rem)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              maxWidth: "18ch",
            }}
          >
            <span className="sr-only">
              Five years of mandap, marigold, and music.
            </span>
            <span aria-hidden="true" className="block">
              {HEADING_WORDS.map((word, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: words are stable per render
                  key={`${word}-${index}`}
                  ref={collectWord}
                  className="mr-[0.18em] inline-block will-change-transform"
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Brass diamond divider */}
          <div aria-hidden="true" className="flex items-center gap-3">
            <span className="block h-px w-16 bg-[color:var(--color-gold)] opacity-70" />
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 text-[color:var(--color-gold)]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0 L 16 8 L 8 16 L 0 8 Z" />
            </svg>
            <span className="block h-px w-16 bg-[color:var(--color-gold)] opacity-70" />
          </div>

          <p
            className="max-w-[58ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]"
            style={{ color: "rgba(30, 30, 32, 0.75)" }}
          >
            248 events. Six rooms per room. Every photograph composed before
            the day.
          </p>
        </div>

        {/* Scroll cue */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.7 }
              : { opacity: [0.4, 0.85, 0.4], y: [0, 6, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.4 }
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
          className="mt-[var(--space-16)] flex items-center gap-2 font-mono text-[length:var(--text-xs)] uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]"
        >
          <span aria-hidden="true">↓</span>
          <span>Scroll to wander</span>
        </motion.div>
      </Container>
    </header>
  );
}
