"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EditorialImage } from "@/components/ui/editorial-image";
import { buttonVariants } from "@/components/ui/button-variants";
import { SITE_IMAGES } from "@/lib/media/images";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * H3 — Editorial intro.
 *
 * Asymmetric editorial layout with:
 *   • Large oversized italic display heading
 *   • Brass numerical chapter glyph in the gutter
 *   • Image with brass corner gilt + parallax-rise on scroll
 *   • Side-rail Roman numerals + accent line (gallery wall vibe)
 *   • Word-by-word headline reveal scrubbed by ScrollTrigger
 */
export function HomeEditorialIntro(): React.ReactElement {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const headline = headlineRef.current;
      const image = imageRef.current;
      const rail = railRef.current;

      // Word-by-word reveal
      if (headline) {
        const words = headline.querySelectorAll<HTMLElement>("[data-word]");
        gsap.set(words, { autoAlpha: 0.25, y: 20, filter: "blur(3px)" });
        gsap.to(words, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: headline,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 0.8,
          },
        });
      }

      // Image parallax rise
      if (image) {
        const innerImg = image.querySelector<HTMLElement>("[data-parallax-img]");
        if (innerImg) {
          gsap.fromTo(
            innerImg,
            { yPercent: -8, scale: 1.1 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      }

      // Roman rail subtle entrance
      if (rail) {
        gsap.from(rail.children, {
          autoAlpha: 0,
          x: -20,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: rail, start: "top 85%", once: true },
        });
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const headlineText = "A celebration is a story in light, flower, and fabric.";
  const words = headlineText.split(/(\s+)/);

  return (
    <Section as="section" tone="default" spacing="lg" id="home-editorial">
      <Container>
        <div className="relative grid grid-cols-1 items-center gap-[var(--space-12)] md:grid-cols-12 md:gap-[var(--space-10)]">
          {/* Left rail — Roman numerals (gallery vibe) */}
          <aside
            ref={railRef}
            aria-hidden="true"
            className="hidden flex-col gap-1 md:col-span-1 md:flex"
          >
            <span className="font-display text-[10px] tracking-[0.3em] text-[color:var(--color-gold-deep)]/80">
              III
            </span>
            <span className="h-12 w-px bg-[color:var(--color-gold-deep)]/40" />
            <span className="font-display text-[9px] tracking-[0.32em] text-[color:var(--color-ink)]/50">
              CHAPTER
            </span>
          </aside>

          {/* Right image */}
          <div
            ref={imageRef}
            className="relative md:col-span-5 md:col-start-8 md:row-start-1"
          >
            {/* Brass corner gilt */}
            <span aria-hidden="true" className="pointer-events-none absolute -inset-2 z-0">
              <CornerGilt position="tl" />
              <CornerGilt position="tr" />
              <CornerGilt position="bl" />
              <CornerGilt position="br" />
            </span>
            <div
              className="relative z-[1] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)]"
            >
              <div data-parallax-img className="will-change-transform">
                <EditorialImage
                  src={SITE_IMAGES.hero.homeAlt}
                  alt="Brass diya and marigold detail on a North Bengal wedding mandap"
                  aspectClassName="aspect-[3/4] md:aspect-[4/5]"
                  sizes="(max-width: 768px) 100vw, 38vw"
                />
              </div>
            </div>
          </div>

          {/* Left copy column */}
          <div className="flex flex-col gap-[var(--space-6)] md:col-span-6 md:col-start-2 md:row-start-1 md:pr-[var(--space-6)]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--color-gold-deep)]/60" />
              <Eyebrow tone="accent">Our philosophy</Eyebrow>
            </div>

            <h2
              ref={headlineRef}
              className="font-display italic text-[color:var(--color-ink)]"
              style={{
                fontSize: "clamp(28px, 3.6vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
              }}
            >
              {words.map((w, i) =>
                /^\s+$/.test(w) ? (
                  <span key={i}>{w}</span>
                ) : (
                  <span
                    key={i}
                    data-word
                    className="inline-block will-change-[opacity,transform,filter]"
                  >
                    {w}
                  </span>
                ),
              )}
            </h2>

            <p className="max-w-[42ch] text-[color:var(--color-ink)]/70 leading-relaxed">
              Thirty events a year — each shot, lit, and staged like a film.
              From intimate Annaprashan to destination weddings in the Dooars.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className={buttonVariants({ variant: "ghost", size: "md" })}
              >
                How we work <span aria-hidden="true">→</span>
              </Link>
              <span
                aria-hidden="true"
                className="h-px w-12 bg-[color:var(--color-gold-deep)]/40"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink)]/45">
                Est. 2014 · Siliguri
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CornerGilt({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
  const placement = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];
  return (
    <span
      className={
        "absolute h-8 w-8 text-[color:var(--color-gold)] " + placement
      }
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12V4a2 2 0 0 1 2-2h8"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.85"
        />
        <path
          d="M5 12V7a2 2 0 0 1 2-2h5"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
