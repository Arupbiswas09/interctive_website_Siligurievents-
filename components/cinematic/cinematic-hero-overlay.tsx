"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { cn } from "@/lib/utils";
import { variableFontWeight } from "@/lib/gsap/scroll-triggers";

// Same timeline contract as the editorial hero — the cinematic variant lays
// the canvas behind this overlay, but keeps the entrance choreography
// identical so the brand voice is preserved.
import { createHeroTimeline } from "@/lib/gsap/timelines";

/**
 * CinematicHeroOverlay — editorial copy layer rendered above the brass-dust
 * canvas. Visually identical wording/structure to `home-hero.tsx`, with two
 * additions:
 *
 *   1. Brass-foil sweep across the H1 letters once on mount, kicked off by
 *      a `sgv:foil-sweep` CustomEvent dispatched by the canvas wrapper. The
 *      effect uses `background-clip: text` + a CSS-animated background-position
 *      so the dust *appears to settle into* the typography itself.
 *
 *   2. A custom brass downward-pointing chevron at the bottom that draws
 *      itself in via SVG stroke-dasharray (DrawSVG-equivalent without the
 *      paid plugin — the chevron is two line segments).
 *
 * Reduced motion: createHeroTimeline collapses to a 200ms crossfade, the
 * foil sweep collapses to a static end-state (no animation), the chevron
 * skips the draw and renders pre-drawn.
 */
export function CinematicHeroOverlay(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const emphasisRef = useRef<HTMLSpanElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<SVGSVGElement | null>(null);

  // Run the standard hero timeline (eyebrow → words → italic → body → CTA).
  useEffect(() => {
    const tl = createHeroTimeline({
      eyebrow: eyebrowRef.current,
      headline: headlineRef.current,
      emphasis: emphasisRef.current,
      body: bodyRef.current,
      cta: ctaRef.current,
      image: null, // canvas owns the visual plate, not an image
    });
    tl.play();
    return (): void => {
      tl.kill();
    };
  }, []);

  // Variable font weight shift (SIG-05)
  useEffect(() => {
    if (!headlineRef.current) return;
    const cleanup = variableFontWeight({ target: headlineRef.current });
    return cleanup;
  }, []);

  // Foil-sweep on the H1 — listens for the canvas-fired event so the visual
  // beat (dust sweep → typography sweep) lines up to the same frame.
  useEffect(() => {
    const headline = headlineRef.current;
    const section = sectionRef.current;
    if (!headline || !section) return;

    let timer: number | null = null;

    const start = (): void => {
      // Trigger via class — the CSS keyframe owns the animation curve.
      headline.classList.remove("is-foil-swept");
      // Reflow to restart animation reliably.
      void headline.offsetWidth;
      headline.classList.add("is-foil-swept");
    };

    const onSweep = (): void => start();
    section.addEventListener("sgv:foil-sweep", onSweep as EventListener);

    // Failsafe: if the canvas never mounted (reduced motion / fallback),
    // still fire the sweep after 800ms so the typography moment plays.
    timer = window.setTimeout(start, 800);

    return (): void => {
      section.removeEventListener("sgv:foil-sweep", onSweep as EventListener);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  // Draw the chevron — pure CSS keyframes via inline style block below.
  // The ref is left for callers / debugging.

  return (
    <Section
      as="section"
      tone="default"
      spacing="xl"
      id="home-hero"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      {/* Local CSS for foil sweep + chevron draw. Scoped to data attribute. */}
      <style>{CINEMATIC_HERO_CSS}</style>

      {/*
        Note: this section is a positioning context. The actual canvas is
        rendered by `cinematic-hero-shell.tsx` as a sibling absolute layer so
        we keep this overlay focused on copy + chrome.
      */}
      <div ref={sectionRef} className="relative">
        <Container>
          <div className="relative flex max-w-[1100px] flex-col gap-[var(--space-8)]">
            <span ref={eyebrowRef} className="inline-block">
              <Eyebrow tone="accent">North Bengal · Est. 20XX</Eyebrow>
            </span>

            <h1
              ref={headlineRef}
              data-cinematic-headline=""
              className={cn(
                "font-display text-balance",
                "text-[length:var(--text-6xl)] leading-[1.02]",
                "tracking-[var(--tracking-display)] text-[color:var(--color-ink)]",
                "max-w-[20ch]",
              )}
            >
              <span data-hero-word className="inline-block">
                Cinematic
              </span>{" "}
              <span data-hero-word className="inline-block">
                decor
              </span>{" "}
              <span data-hero-word className="inline-block">
                for
              </span>{" "}
              <span
                ref={emphasisRef}
                data-hero-word
                data-hero-emphasis
                className="inline-block italic"
              >
                celebrations
              </span>{" "}
              <span data-hero-word className="inline-block">
                you&apos;ll
              </span>{" "}
              <span data-hero-word className="inline-block">
                remember
              </span>{" "}
              <span data-hero-word className="inline-block">
                in
              </span>{" "}
              <span data-hero-word className="inline-block">
                stills.
              </span>
            </h1>

            <p
              ref={bodyRef}
              className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]"
            >
              Wedding, Haldi, Sangeet, Reception — and every chapter in
              between. Across Siliguri, Darjeeling, and the Dooars.
            </p>

            <div
              ref={ctaRef}
              className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]"
            >
              <MagneticButton>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                  )}
                >
                  Plan my event
                  <span aria-hidden="true">→</span>
                </Link>
              </MagneticButton>
              <Link
                href="/portfolio"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                See our work
              </Link>
            </div>
          </div>
        </Container>

        {/* Scroll indicator — custom brass chevron that draws itself in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[var(--space-8)] flex justify-center"
          data-cinematic-scroll-cue=""
        >
          <svg
            ref={chevronRef}
            width="22"
            height="36"
            viewBox="0 0 22 36"
            fill="none"
            data-cinematic-chevron=""
            aria-hidden="true"
          >
            {/* Vertical stem */}
            <line
              x1="11"
              y1="2"
              x2="11"
              y2="26"
              stroke="var(--color-gold, #b8893a)"
              strokeWidth="1.25"
              strokeLinecap="round"
              data-stem
            />
            {/* Chevron tip — two strokes forming a V */}
            <path
              d="M3 23 L11 32 L19 23"
              stroke="var(--color-gold, #b8893a)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              data-tip
            />
          </svg>
        </div>
      </div>
    </Section>
  );
}

// =============================================================================
// Inline CSS (scoped via data attributes — no global leakage).
// Lives in this file so the overlay is self-contained and the main agent
// doesn't have to touch globals.css to wire it up.
// =============================================================================

const CINEMATIC_HERO_CSS = `
/* Brass-foil sweep across the H1.
   The headline gets a brass-leaf gradient as its text fill; an animated
   highlight band travels from -120% to 220% across the background, masked
   to text via background-clip: text. Runs once on .is-foil-swept. */
[data-cinematic-headline] {
  background-image:
    linear-gradient(
      100deg,
      var(--color-ink) 0%,
      var(--color-ink) 40%,
      var(--color-gold, #b8893a) 48%,
      #e8d5a8 50%,
      var(--color-gold, #b8893a) 52%,
      var(--color-ink) 60%,
      var(--color-ink) 100%
    );
  background-size: 220% 100%;
  background-position: -120% 0%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  /* Fallback color preserved for browsers without bg-clip:text. */
  color: var(--color-ink);
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  transition: background-position 0s;
  will-change: background-position;
}

@keyframes sgv-foil-sweep {
  0%   { background-position: -120% 0%; }
  100% { background-position:  220% 0%; }
}

[data-cinematic-headline].is-foil-swept {
  animation: sgv-foil-sweep 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Scroll cue: bobbing motion + chevron draws itself in. */
[data-cinematic-scroll-cue] {
  animation: sgv-cue-bob 2.4s ease-in-out infinite;
  opacity: 0;
  animation:
    sgv-cue-fade-in 0.6s ease-out 2.2s forwards,
    sgv-cue-bob 2.4s ease-in-out 2.8s infinite;
}

@keyframes sgv-cue-fade-in {
  to { opacity: 0.85; }
}

@keyframes sgv-cue-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(6px); }
}

/* Chevron stroke draws in: stem first (0.5s), tip second (0.4s). */
[data-cinematic-chevron] [data-stem] {
  stroke-dasharray: 26;
  stroke-dashoffset: 26;
  animation: sgv-draw 0.55s cubic-bezier(0.22, 1, 0.36, 1) 2.4s forwards;
}
[data-cinematic-chevron] [data-tip] {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: sgv-draw 0.45s cubic-bezier(0.22, 1, 0.36, 1) 2.9s forwards;
}
@keyframes sgv-draw {
  to { stroke-dashoffset: 0; }
}

/* Reduced motion: skip the animations, show final state. */
@media (prefers-reduced-motion: reduce) {
  [data-cinematic-headline] {
    animation: none !important;
    /* Restore solid ink colour — bg-clip:text becomes irrelevant. */
    -webkit-text-fill-color: var(--color-ink);
    text-fill-color: var(--color-ink);
    background-image: none;
  }
  [data-cinematic-scroll-cue] {
    animation: none;
    opacity: 0.85;
  }
  [data-cinematic-chevron] [data-stem],
  [data-cinematic-chevron] [data-tip] {
    animation: none;
    stroke-dashoffset: 0;
  }
}
`;
