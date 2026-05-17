"use client";

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import type { ProjectStat } from "@/lib/cms/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseNumbersProps {
  stats: ReadonlyArray<ProjectStat>;
}

/**
 * Case study — "The numbers". Large stats with animated counters (MO-09).
 * See docs/05 §5.6 section 6 + docs/06 §6.4 MO-09.
 *
 * Triggers once when the row enters viewport. Reduced motion: shows the
 * final value immediately, no counter.
 */
export function CaseNumbers({ stats }: CaseNumbersProps): ReactElement {
  return (
    <Section tone="dark" spacing="lg" as="section">
      <Container>
        <div className="mb-[var(--space-12)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow tone="gold">05 · The numbers</Eyebrow>
          </div>
          <div className="md:col-span-8">
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="By the count."
              className="italic text-[#F5EDE0]"
            />
          </div>
        </div>

        <ul
          className={cn(
            "grid grid-cols-2 gap-[var(--space-8)]",
            "md:grid-cols-4 md:gap-[var(--space-12)]",
            "border-t border-[#F5EDE0]/10 pt-[var(--space-12)]",
          )}
        >
          {stats.map((stat) => (
            <Stat key={stat.label} stat={stat} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Stat — single counter (MO-09)
// ---------------------------------------------------------------------------

interface StatProps {
  stat: ProjectStat;
}

function Stat({ stat }: StatProps): ReactElement {
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = formatNumber(stat.value);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: stat.value,
        duration: 1.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        onUpdate: (): void => {
          el.textContent = formatNumber(Math.floor(counter.value));
        },
        onComplete: (): void => {
          // Snap to exact final value — guards against floating-point drift.
          el.textContent = formatNumber(stat.value);
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [stat.value, prefersReducedMotion]);

  return (
    <li className="flex flex-col gap-[var(--space-3)]">
      <p
        className={cn(
          "font-display tabular-nums leading-none",
          "text-[length:var(--text-4xl)] md:text-[length:var(--text-5xl)]",
          "text-[#F5EDE0]",
        )}
      >
        {stat.prefix ? <span>{stat.prefix}</span> : null}
        <span ref={numberRef} aria-hidden="true">
          0
        </span>
        {stat.unit ? (
          <span className="ml-[var(--space-1)] text-[length:var(--text-2xl)] text-[#F5EDE0]/70">
            {stat.unit}
          </span>
        ) : null}
        {/* SR-only fallback so assistive tech reads the final number, not the
            interim 0. */}
        <span className="sr-only">
          {stat.prefix ?? ""}
          {formatNumber(stat.value)}
          {stat.unit ?? ""}
        </span>
      </p>
      <p
        className={cn(
          "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
          "text-[#F5EDE0]/70",
        )}
      >
        {stat.label}
      </p>
    </li>
  );
}

function formatNumber(n: number): string {
  // Indian English grouping (1,00,000 — lakhs/crores).
  return new Intl.NumberFormat("en-IN").format(n);
}
