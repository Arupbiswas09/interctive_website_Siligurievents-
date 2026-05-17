"use client";

/**
 * LegalHero — editorial themed hero for legal pages (Privacy, Terms).
 *
 * Eyebrow gold hairline + page name, italic display heading, single-line
 * subtitle, last-updated date in mono, and a small scroll cue at the
 * baseline. A faint mandala drifts behind the headline at low opacity.
 *
 * Motion: word-by-word fade-in on the heading. Reduced-motion → static.
 */

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type LegalHeroProps = {
  /** Page name — appears in the eyebrow strip, e.g. "Privacy policy". */
  title: string;
  /** Single-line editorial subtitle below the display heading. */
  subtitle: string;
  /** ISO date string (YYYY-MM-DD) — rendered in DD MMM YYYY. */
  lastUpdated: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatLastUpdated(iso: string): string {
  // Defensive: if the parent already passed a pretty string, return it.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const month = MONTHS[m - 1] ?? "";
  return `${String(d).padStart(2, "0")} ${month} ${y}`;
}

export function LegalHero({
  title,
  subtitle,
  lastUpdated,
}: LegalHeroProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Compute display heading words once.
  const words = useMemo(() => title.split(/\s+/), [title]);
  const formattedDate = useMemo(() => formatLastUpdated(lastUpdated), [
    lastUpdated,
  ]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      const wordEls = heading.querySelectorAll<HTMLSpanElement>("[data-word]");
      gsap.set(wordEls, { autoAlpha: 0, y: 18 });
      gsap.to(wordEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.1,
      });

      if (ornamentRef.current) {
        gsap.to(ornamentRef.current, {
          rotation: 360,
          duration: 120,
          ease: "none",
          repeat: -1,
        });
      }
    }, section);

    return (): void => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-ink)]"
      style={{ minHeight: "40svh" }}
    >
      {/* Slow mandala drift behind the heading */}
      <div
        ref={ornamentRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12vmin] top-1/2 -z-10 h-[80vmin] w-[80vmin] -translate-y-1/2 will-change-transform"
        style={{ opacity: 0.08 }}
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold)"
          hueSecondary="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      {/* Hairline grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          color: "var(--color-ink)",
        }}
      />

      <Container className="relative z-[1] flex min-h-[40svh] flex-col justify-end pb-[clamp(48px,7vh,96px)] pt-[clamp(120px,16vh,200px)]">
        <div className="flex flex-col gap-[var(--space-8)]">
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3"
            style={{ color: "var(--color-gold-deep)" }}
          >
            <span className="h-px w-10 bg-current opacity-60" />
            <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
              Legal · {title}
            </span>
          </div>

          {/* Display heading */}
          <h1
            ref={headingRef}
            className="font-display italic text-[color:var(--color-ink)]"
            style={{
              fontSize: "clamp(28px, 5.4vw, 60px)",
              fontWeight: 300,
              lineHeight: 1.04,
              letterSpacing: "-0.012em",
            }}
          >
            {words.map((word, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: stable per title
                key={`${word}-${i}`}
                data-word
                className="inline-block"
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {/* Subtitle + meta row */}
          <div className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-end md:justify-between md:gap-[var(--space-12)]">
            <p
              className="max-w-[58ch] font-body text-[color:var(--color-ink-muted)]"
              style={{
                fontSize: "clamp(15px, 1.1vw, 18px)",
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>

            <p
              className="shrink-0 font-mono uppercase tracking-[0.2em] text-[color:var(--color-ink-muted)]"
              style={{ fontSize: "11px" }}
            >
              <span
                aria-hidden="true"
                className="mr-2 inline-block h-px w-6 align-middle bg-[color:var(--color-gold)] opacity-70"
              />
              Last updated · {formattedDate}
            </p>
          </div>

          {/* Scroll cue */}
          <div
            aria-hidden="true"
            className="mt-[var(--space-8)] flex items-center gap-3 text-[color:var(--color-ink-muted)]"
          >
            <span
              className="font-mono uppercase tracking-[0.32em]"
              style={{ fontSize: "10px" }}
            >
              Read on
            </span>
            <span className="h-px w-12 bg-[color:var(--color-gold)] opacity-70" />
            <svg
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
              className="opacity-80"
            >
              <path
                d="M5 1V13M5 13L1 9M5 13L9 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
