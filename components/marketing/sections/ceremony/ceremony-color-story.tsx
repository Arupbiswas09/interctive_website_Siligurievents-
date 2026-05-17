"use client";

/**
 * CeremonyColorStory — editorial two-zone palette story for a ceremony page.
 *
 * Top zone is a slow word-by-word reveal of the display headline (scrub-linked
 * to ScrollTrigger). Bottom zone is a responsive grid of tall swatches — each
 * carries label, hex code, and the rationale note. Swatches stagger-fade-in
 * via `ScrollTrigger.batch` and lift on hover with a brass shadow.
 *
 * All visuals are sourced from `theme: CeremonyTheme` — no hard-coded copy or
 * colours (other than the swatch hex values, which ARE the content).
 *
 * Reduced-motion: skip word-reveal and stagger; render fully visible.
 */

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type CeremonyColorStoryProps = {
  theme: CeremonyTheme;
};

export function CeremonyColorStory({
  theme,
}: CeremonyColorStoryProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const swatchesRef = useRef<HTMLUListElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { palette } = theme;
  const swatchCount = theme.colorStory.length;

  // English number words for 1..10 — palettes are 4–6 so this is sufficient.
  const headlineWords = useMemo<string[]>(() => {
    const NUMBER_WORDS: Record<number, string> = {
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      10: "ten",
    };
    const word = NUMBER_WORDS[swatchCount] ?? String(swatchCount);
    return ["A", "ceremony", "in", word, "colours."];
  }, [swatchCount]);

  const ornamentName = theme.ornamentSecondary ?? "mandala";

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const swatchList = swatchesRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ── Word-by-word headline reveal (scrub). ──────────────────────────
      if (headline) {
        const words = headline.querySelectorAll<HTMLSpanElement>(
          "[data-headline-word]",
        );
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { yPercent: 60, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: headline,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            },
          );
        }
      }

      // ── Swatch batch — staggered entrance on first reveal. ─────────────
      if (swatchList) {
        const items = Array.from(
          swatchList.querySelectorAll<HTMLLIElement>("[data-swatch]"),
        );
        if (items.length > 0) {
          gsap.set(items, { y: 24, autoAlpha: 0 });
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.07,
                overwrite: true,
              }),
          });
        }
      }
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label={`${theme.slug} — colour story`}
      className="relative isolate overflow-hidden py-24 md:py-32"
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
      }}
    >
      {/* Decorative ornament — very low opacity, breaks negative space. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2"
      >
        <CeremonyOrnament
          name={ornamentName}
          hue={palette.gold}
          hueSecondary={palette.accent}
          className="h-[560px] w-[560px]"
          style={{ opacity: 0.06 }}
        />
      </div>

      <Container className="relative z-[1]">
        {/* ── Eyebrow ── */}
        <div
          className="flex items-center gap-3"
          style={{ color: palette.goldDeep }}
        >
          <span
            aria-hidden="true"
            className="h-px w-10"
            style={{ backgroundColor: palette.gold }}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.32em]">
            The palette
          </span>
          <span
            aria-hidden="true"
            className="text-[10px] uppercase tracking-[0.32em] opacity-60"
          >
            · {theme.periodLabel}
          </span>
        </div>

        {/* ── Display headline ── */}
        <h2
          ref={headlineRef}
          className="font-display mt-6 italic"
          style={{
            color: palette.ink,
            fontSize: "clamp(36px, 5.6vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            maxWidth: "18ch",
          }}
        >
          {headlineWords.map((word, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: stable word order
              key={`${word}-${i}`}
              className="inline-block overflow-hidden align-baseline"
            >
              <span
                data-headline-word
                className="inline-block will-change-transform"
              >
                {word}
                {i < headlineWords.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h2>

        {/* ── Swatch grid ── */}
        <ul
          ref={swatchesRef}
          className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-20 md:grid-cols-3 lg:grid-cols-6"
        >
          {theme.colorStory.map((swatch) => (
            <li
              key={`${swatch.label}-${swatch.hex}`}
              data-swatch
              className="group flex flex-col will-change-transform"
            >
              {/* Tall vertical strip */}
              <div
                aria-hidden="true"
                className={cn(
                  "relative h-40 w-full overflow-hidden md:h-56",
                  "transition-transform duration-500 ease-out",
                  "group-hover:-translate-y-1",
                  "rounded-[2px]",
                )}
                style={{
                  backgroundColor: swatch.hex,
                  boxShadow: `0 18px 36px -22px ${palette.goldDeep}80`,
                }}
              >
                {/* Subtle inner highlight to give cloth-like depth. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.08) 100%)",
                  }}
                />
                {/* Brass hairline at base — reads as foil edge. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{ backgroundColor: palette.gold, opacity: 0.55 }}
                />
              </div>

              {/* Meta */}
              <div className="mt-4">
                <p
                  className="text-[11px] font-medium uppercase"
                  style={{
                    color: palette.ink,
                    letterSpacing: "0.16em",
                  }}
                >
                  {swatch.label}
                </p>
                <p
                  className="font-mono mt-1 text-[10px]"
                  style={{ color: palette.ink, opacity: 0.6 }}
                >
                  {swatch.hex.toUpperCase()}
                </p>
                <p
                  className="mt-3 max-w-[28ch] text-sm leading-relaxed"
                  style={{ color: palette.ink, opacity: 0.75 }}
                >
                  {swatch.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
