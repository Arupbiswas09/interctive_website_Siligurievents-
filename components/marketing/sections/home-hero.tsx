"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/media/images";
import { createHeroTimeline } from "@/lib/gsap/timelines";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * H1 — Cinematic hero, Variant A "Margin Steal" (docs/03b-DESIGN-V2 §3b.5).
 *
 * Headline left; 4:5 mandap photography bleeds off the right margin.
 * Image-led on mobile (stacked) with scroll-scrubbed copy fade.
 */
export function HomeHero(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const emphasisRef = useRef<HTMLSpanElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const imageMediaRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const tl = createHeroTimeline({
      eyebrow: eyebrowRef.current,
      headline: headlineRef.current,
      emphasis: emphasisRef.current,
      body: bodyRef.current,
      cta: ctaRef.current,
      image: imageFrameRef.current,
      imageMedia: imageMediaRef.current,
    });
    tl.play();
    return (): void => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        autoAlpha: 0,
        y: -48,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=70%",
          scrub: 0.6,
        },
      });
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="home-hero"
      data-look="cinematic"
      className={cn(
        "relative min-h-[100svh] overflow-hidden",
        "bg-[color:var(--color-bg)] pt-[var(--space-24)] md:pt-[var(--space-32)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 85% 20%, color-mix(in oklab, var(--color-brass-leaf, #a47a2c) 22%, transparent), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, color-mix(in oklab, var(--color-blood-saffron, #6b1418) 8%, transparent), transparent)",
        }}
      />

      <Container>
        <div
          ref={contentRef}
          className="relative z-10 grid grid-cols-1 items-end gap-[var(--space-12)] md:grid-cols-12 md:gap-[var(--space-8)] lg:gap-[var(--space-12)]"
        >
          <div className="flex flex-col gap-[var(--space-6)] md:col-span-6 md:pb-[var(--space-16)] lg:col-span-5">
            <span ref={eyebrowRef} className="inline-block">
              <Eyebrow tone="accent">North Bengal · Est. 2024</Eyebrow>
            </span>

            <h1
              ref={headlineRef}
              className={cn(
                "font-display-light text-balance",
                "text-[length:var(--text-5xl)]",
                "text-[color:var(--color-ink)]",
                "max-w-[14ch] md:max-w-[12ch]",
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
              </span>
              <br className="hidden sm:block" />
              <span
                ref={emphasisRef}
                data-hero-word
                data-hero-emphasis
                className="inline-block italic text-[color:var(--color-accent)]"
              >
                celebrations
              </span>
              <br className="hidden sm:block" />
              <span data-hero-word className="inline-block">
                in stills.
              </span>
            </h1>

            <p
              ref={bodyRef}
              className="max-w-[32ch] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)] md:text-[length:var(--text-lg)]"
            >
              Mandap, haldi, sangeet — staged across Siliguri, Darjeeling, and
              the Dooars.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-[var(--space-4)]">
              <MagneticButton>
                <Link
                  href="/contact"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
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

          <div className="relative md:col-span-6 md:-mr-[clamp(24px,6vw,120px)] lg:col-span-7 lg:col-start-6">
            <Parallax speed={0.22} className="w-full">
              <div
                ref={imageFrameRef}
                className={cn(
                  "relative aspect-[4/5] w-full overflow-hidden",
                  "rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)]",
                  "md:min-h-[min(72vh,720px)] md:aspect-auto md:h-[min(72vh,720px)]",
                )}
              >
                <div
                  ref={imageMediaRef}
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    src={SITE_IMAGES.hero.home}
                    alt="Indian wedding mandap with jasmine garlands and brass accents at golden hour"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover object-[center_35%]"
                  />
                </div>

                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[2] mix-blend-multiply opacity-[0.06]"
                >
                  <filter id="home-hero-grain">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.9"
                      numOctaves={2}
                      stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#home-hero-grain)" />
                </svg>

                <div
                  aria-hidden
                  className="absolute inset-0 z-[3] bg-gradient-to-t from-[color:var(--color-ink-deep)]/25 via-transparent to-transparent md:opacity-60"
                />
              </div>
            </Parallax>
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-t from-[color:var(--color-bg)] to-transparent md:hidden"
      />
    </section>
  );
}
