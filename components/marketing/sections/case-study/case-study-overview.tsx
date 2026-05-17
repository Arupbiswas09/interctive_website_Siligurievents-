"use client";

/**
 * Case study — Overview.
 *
 * 12-col editorial overview band: three stacked stats on the left (col-span-4)
 * with huge font-display numerals + brass hairlines, single editorial brief
 * paragraph on the right (col-span-7) with a word-by-word scrub reveal.
 *
 * Honours reduced motion: words appear at final state, no scrub.
 */

import { useEffect, useMemo, useRef } from "react";
import type { ReactElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { PortfolioProject } from "@/lib/cms/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudyOverviewProps {
  project: PortfolioProject;
}

interface OverviewStat {
  value: string;
  label: string;
}

const FALLBACK_BRIEF =
  "A multi-day Bengali wedding for over four hundred guests across two venues. The brief — classical motifs, restrained palette, every chapter staged like a still from a film.";

export function CaseStudyOverview({
  project,
}: CaseStudyOverviewProps): ReactElement {
  const briefRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const brief = useMemo(() => {
    const raw = project.brief?.replace(/^TODO:\s*/, "") || FALLBACK_BRIEF;
    return raw;
  }, [project.brief]);

  const words = useMemo(() => brief.split(/\s+/).filter(Boolean), [brief]);

  const stats = useMemo<OverviewStat[]>(() => {
    const find = (rx: RegExp): string | undefined =>
      project.specs.find((s) => rx.test(s.label))?.value;

    const list: OverviewStat[] = [
      { value: find(/guest/i) ?? "—", label: "Guest count" },
      { value: find(/day|hour|duration|runtime/i) ?? "—", label: "Days on site" },
      {
        value: find(/venue|stage|room|sqft|square|altitude/i) ?? "—",
        label: project.specs.find((s) =>
          /venue|stage|room|sqft|square|altitude/i.test(s.label),
        )?.label ?? "Venues",
      },
    ];
    return list;
  }, [project.specs]);

  useEffect(() => {
    const el = briefRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el.querySelectorAll<HTMLElement>("[data-word]"), {
        autoAlpha: 1,
      });
      return;
    }

    const targets = el.querySelectorAll<HTMLElement>("[data-word]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0.15, y: 4 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          stagger: 0.04,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion, words]);

  return (
    <Section tone="default" spacing="xl" as="section">
      <Container>
        <div className="mb-[var(--space-12)] flex items-baseline justify-between gap-[var(--space-6)]">
          <Eyebrow tone="accent">01 · Overview</Eyebrow>
          <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
            {project.locationName} · {project.year}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12 md:gap-[var(--space-16)]">
          {/* LEFT — three stats, brass hairlines */}
          <ul className="flex flex-col gap-[var(--space-10)] md:col-span-4">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="flex flex-col gap-[var(--space-3)]"
              >
                <p
                  className={cn(
                    "font-display font-extralight tabular-nums leading-[0.92]",
                    "text-[clamp(60px,8vw,80px)]",
                    "tracking-[var(--tracking-display-tight)]",
                    "text-[color:var(--color-ink)]",
                  )}
                >
                  {stat.value}
                </p>
                <span
                  aria-hidden="true"
                  className="block h-px w-[clamp(48px,8vw,96px)] bg-[color:var(--color-gold)]"
                />
                <p
                  className={cn(
                    "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                    "text-[color:var(--color-ink-soft)]",
                  )}
                >
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>

          {/* RIGHT — single editorial brief */}
          <div className="md:col-span-7 md:col-start-6">
            <p
              ref={briefRef}
              className={cn(
                "font-display italic font-normal text-balance",
                "text-[clamp(18px,1.6vw,24px)] leading-[1.6]",
                "max-w-[58ch] text-[color:var(--color-ink)]",
              )}
            >
              {words.map((word, idx) => (
                <span
                  key={`${word}-${idx.toString()}`}
                  data-word
                  className="inline-block will-change-[opacity,transform]"
                  style={{ opacity: 0.15 }}
                >
                  {word}
                  {idx < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
