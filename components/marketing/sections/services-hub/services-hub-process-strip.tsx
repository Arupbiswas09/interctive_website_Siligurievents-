"use client";

/**
 * ServicesHubProcessStrip — 4-step editorial process strip.
 *
 * Brief → Moodboard → Site visit → Production. Each step has a roman
 * numeral, a name and a one-liner. A brass progress bar underneath fills
 * as the user scrolls through the section (scrubbed via ScrollTrigger).
 *
 * Reduced motion: the bar renders at 100% immediately; no scrubbed
 * animation runs.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProcessStep = {
  index: string;
  name: string;
  description: string;
};

const STEPS: ReadonlyArray<ProcessStep> = [
  {
    index: "I",
    name: "Brief",
    description:
      "An hour-long conversation. We listen for the moments you have already imagined, and the ones you haven't.",
  },
  {
    index: "II",
    name: "Moodboard",
    description:
      "Palette, ornament, light, sound — rehearsed on paper. One studio visit, two boards, no surprises.",
  },
  {
    index: "III",
    name: "Site visit",
    description:
      "We walk the venue with you. Floor plan, sight lines, power, vendor lanes — everything pinned to the room.",
  },
  {
    index: "IV",
    name: "Production",
    description:
      "Crew rigs the night before. You arrive on the day and the room is already breathing.",
  },
];

export function ServicesHubProcessStrip(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const bar = barRef.current;
    if (!section || !bar) return;

    if (prefersReducedMotion) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.8,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section tone="elevated" spacing="lg">
      <Container>
        <div
          ref={sectionRef}
          className="flex flex-col gap-[var(--space-10)]"
        >
          <header className="flex max-w-[80ch] flex-col gap-[var(--space-3)]">
            <Eyebrow tone="accent">How we work</Eyebrow>
            <DisplayHeading
              as="h2"
              size="lg"
              text="Four steps. No surprises."
              className="italic"
            />
          </header>

          {/* Steps row */}
          <ol className="grid grid-cols-1 gap-[var(--space-8)] sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => (
              <li
                key={step.index}
                className={cn(
                  "relative flex flex-col gap-[var(--space-3)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-[length:var(--text-3xl)] italic text-[color:var(--color-gold)]"
                >
                  {step.index}
                </span>
                <h3 className="font-display text-[length:var(--text-2xl)] tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                  {step.name}
                </h3>
                <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                  {step.description}
                </p>

                {/* Diamond glyph separator (only between steps, hidden on mobile) */}
                {idx < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-22px] top-[6px] hidden h-3 w-3 rotate-45 lg:block"
                    style={{
                      background: "var(--color-gold)",
                      boxShadow:
                        "0 0 0 4px var(--color-bg-elevated), 0 0 0 5px var(--color-gold)",
                    }}
                  />
                ) : null}
              </li>
            ))}
          </ol>

          {/* Brass progress rail */}
          <div className="relative mt-[var(--space-4)] h-[2px] w-full overflow-hidden bg-[color:var(--color-border)]">
            <span
              ref={barRef}
              aria-hidden="true"
              className="block h-full w-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-deep) 100%)",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
