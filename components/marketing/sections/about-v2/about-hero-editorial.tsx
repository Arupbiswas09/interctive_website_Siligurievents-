"use client";

/**
 * AboutHeroEditorial — full-bleed, two-column editorial hero for /about.
 *
 * Left column carries the founder quote (word-by-word scrub reveal); right
 * column carries the founder portrait in a brass-cornered frame with a slow
 * Ken Burns drift + 3D hover split. Reduced-motion → static fallback.
 */

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { SplitImage } from "@/components/effects/3d-split-image";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FOUNDER = {
  name: "Aritra Roy",
  role: "Founder · Creative director",
  quote:
    "I started Siliguri Event because the first wedding I designed — for my own sister — felt like a film I wanted to keep watching. Every event since has been an attempt to make the next one feel that way.",
  portrait:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1200&q=80",
} as const;

export function AboutHeroEditorial(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const quoteRef = useRef<HTMLParagraphElement | null>(null);
  const kenBurnsRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Pre-split the quote into word spans so GSAP can scrub each opacity.
  const words = useMemo(() => FOUNDER.quote.split(/\s+/), []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const quote = quoteRef.current;
    const kenBurns = kenBurnsRef.current;
    if (!section || !quote) return;

    const ctx = gsap.context(() => {
      const wordEls = quote.querySelectorAll<HTMLSpanElement>("[data-word]");

      gsap.set(wordEls, { autoAlpha: 0.12, y: 6 });

      gsap.to(wordEls, {
        autoAlpha: 1,
        y: 0,
        ease: "none",
        stagger: { each: 0.04, from: "start" },
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      if (kenBurns) {
        gsap.fromTo(
          kenBurns,
          { scale: 1.04, yPercent: -2 },
          {
            scale: 1.14,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="About — founder note"
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-ink)]"
      style={{ minHeight: "100svh" }}
    >
      {/* Hairline grid backdrop for editorial gravitas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          color: "var(--color-ink)",
        }}
      />

      <Container className="relative z-[2] flex h-full min-h-[100svh] flex-col justify-center py-[clamp(96px,12vh,160px)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — editorial copy */}
          <div className="lg:col-span-7">
            <div
              className="flex items-center gap-3"
              style={{ color: "var(--color-gold-deep)" }}
            >
              <span className="h-px w-10 bg-current opacity-60" />
              <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
                About the studio
              </span>
            </div>

            <p
              ref={quoteRef}
              className="mt-8 font-display italic"
              style={{
                fontSize: "clamp(28px, 3.4vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                color: "var(--color-ink)",
              }}
            >
              <span aria-hidden="true">&ldquo;</span>
              {words.map((word, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable per quote
                  key={`${word}-${i}`}
                  data-word
                  className="inline-block"
                >
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
              <span aria-hidden="true">&rdquo;</span>
            </p>

            <div className="mt-10 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-16"
                style={{ background: "var(--color-gold)" }}
              />
              <div>
                <p
                  className="text-[length:var(--text-base)] font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  {FOUNDER.name}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.28em] mt-1"
                  style={{ color: "var(--color-gold-deep)" }}
                >
                  {FOUNDER.role}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — portrait in brass-cornered frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[480px]">
              <div ref={kenBurnsRef} className="will-change-transform">
                <SplitImage
                  src={FOUNDER.portrait}
                  alt={`${FOUNDER.name}, ${FOUNDER.role}`}
                  panels={3}
                  trigger="hover"
                  width={900}
                  height={1200}
                  className="rounded-[2px]"
                />
              </div>

              {/* Brass corner gilt — 4 corners */}
              <BrassCorner className="absolute -left-2 -top-2 h-12 w-12" />
              <BrassCorner
                className="absolute -right-2 -top-2 h-12 w-12 rotate-90"
              />
              <BrassCorner
                className="absolute -left-2 -bottom-2 h-12 w-12 -rotate-90"
              />
              <BrassCorner
                className="absolute -right-2 -bottom-2 h-12 w-12 rotate-180"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BrassCorner({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 24 L2 2 L24 2"
        stroke="var(--color-gold)"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M6 24 L6 6 L24 6"
        stroke="var(--color-gold-deep)"
        strokeWidth="0.8"
        strokeLinecap="square"
        opacity="0.65"
      />
      <circle cx="6" cy="6" r="1.8" fill="var(--color-gold)" />
    </svg>
  );
}
