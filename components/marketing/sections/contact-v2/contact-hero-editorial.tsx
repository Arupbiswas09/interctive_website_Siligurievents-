"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADING = "Tell us the date. We'll send a moodboard within 24 hours.";

/**
 * ContactHeroEditorial — editorial inquiry hero.
 * 60svh, oversized italic display heading with word-by-word scrub reveal,
 * slow scroll-tied rotation on the corner mandala, gold hairline eyebrow.
 */
export function ContactHeroEditorial(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const words = HEADING.split(" ");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Ornament: slow scroll-tied rotation.
      if (ornamentRef.current && !reducedMotion) {
        gsap.to(ornamentRef.current, {
          rotation: 90,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Word-by-word reveal scrub.
      const wordEls = wordsRef.current?.querySelectorAll<HTMLElement>(
        "[data-word]",
      );
      if (wordEls && wordEls.length > 0) {
        if (reducedMotion) {
          gsap.set(wordEls, { autoAlpha: 1, y: 0 });
        } else {
          gsap.fromTo(
            wordEls,
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "cubic-bezier(0.16, 1, 0.3, 1)",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "top 25%",
                scrub: true,
              },
            },
          );
        }
      }

      // Scroll cue: subtle vertical bob (skipped if reduced).
      if (cueRef.current && !reducedMotion) {
        gsap.to(cueRef.current, {
          y: 6,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden",
        "bg-[color:var(--color-bg)] text-[color:var(--color-ink)]",
      )}
      style={{ minHeight: "60svh" }}
    >
      {/* Background ornament — top-right mandala */}
      <div
        ref={ornamentRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] -top-[14%] z-0 h-[58svh] w-[58svh] opacity-[0.08] md:-right-[6%] md:-top-[10%]"
        style={{ willChange: "transform" }}
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      <Container className="relative z-10 flex flex-col justify-center" >
        <div
          className="flex flex-col gap-[var(--space-8)] py-[var(--space-32)] md:py-[var(--space-48)]"
        >
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
            <span
              aria-hidden="true"
              className="inline-block h-px w-10 bg-[color:var(--color-gold)]"
            />
            Inquire · Siliguri
          </span>

          {/* Display heading */}
          <h1
            className="font-display italic font-light text-[color:var(--color-ink)] max-w-[20ch]"
            style={{
              fontSize: "clamp(28px, 5.4vw + 8px, 60px)",
              lineHeight: 1.05,
              letterSpacing: "var(--tracking-display-tight)",
            }}
          >
            <span ref={wordsRef} className="inline">
              {words.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  data-word
                  className="inline-block will-change-transform"
                  style={{ marginRight: "0.25em" }}
                >
                  {w}
                </span>
              ))}
            </span>
          </h1>

          {/* Body */}
          <p className="max-w-[58ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
            We design for 30 events a year. Each one is composed weeks before
            the cushion arrives. Start by telling us the simplest version of
            what you're imagining.
          </p>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="absolute bottom-[var(--space-8)] left-[var(--gutter)] flex items-center gap-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]"
        >
          <span>Scroll</span>
          <svg
            width="16"
            height="22"
            viewBox="0 0 16 22"
            fill="none"
            className="text-[color:var(--color-gold)]"
          >
            <path
              d="M8 1 V20 M2 14 L8 20 L14 14"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Container>
    </section>
  );
}
