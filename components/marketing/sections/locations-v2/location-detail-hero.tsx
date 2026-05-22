"use client";

/**
 * LocationDetailHero — per-city hero for /locations/[slug].
 *
 * 60svh, two-column. LEFT carries an eyebrow ("Locations · {region}"),
 * an optional Bengali script label, the city name as an italic display
 * heading, the tagline, and two CTAs. RIGHT carries a single Unsplash
 * photograph in a brass-cornered frame with a slow Ken Burns drift.
 *
 * Reduced motion: Ken Burns is skipped; the image stays static.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { buttonVariants } from "@/components/ui/button-variants";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { Location } from "@/lib/cms/locations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Bengali/Devanagari script label per city. Optional. */
const SCRIPT_LABEL: Record<string, string> = {
  siliguri: "শিলিগুড়ি",
  bagdogra: "বাগডোগরা",
  darjeeling: "দার্জিলিং",
  kalimpong: "কালিম্পং",
  jalpaiguri: "জলপাইগুড়ি",
  gangtok: "गंगटोक",
  dooars: "ডুয়ার্স",
};

/** Stable Unsplash photograph per city — same set as the hub map. */
const CITY_IMAGE: Record<string, string> = {
  siliguri:
    "/images/hero-02.webp",
  bagdogra:
    "/images/marketing/work-05.jpg",
  darjeeling:
    "/images/marketing/work-05.jpg",
  kalimpong:
    "/images/hero-01.webp",
  jalpaiguri:
    "/images/hero-02.webp",
  gangtok:
    "/images/locations/kalimpong-hero.jpg",
  dooars:
    "/images/locations/kalimpong-hero.jpg",
};

type LocationDetailHeroProps = {
  location: Location;
};

export function LocationDetailHero({
  location,
}: LocationDetailHeroProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const kenBurnsRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const kenBurns = kenBurnsRef.current;
    if (!section || !kenBurns) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        kenBurns,
        { scale: 1.05, yPercent: -2 },
        {
          scale: 1.15,
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
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const script = SCRIPT_LABEL[location.slug];
  const image = CITY_IMAGE[location.slug] ?? CITY_IMAGE.siliguri!;

  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative isolate overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            background:
              "radial-gradient(ellipse at 90% 10%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(139,26,26,0.18) 0%, transparent 55%)",
          }}
        />
      </div>

      <Container>
        <div
          ref={sectionRef}
          className="grid grid-cols-1 items-center gap-[var(--space-10)] lg:grid-cols-12 lg:gap-[var(--space-12)]"
          style={{ minHeight: "60svh" }}
        >
          {/* LEFT */}
          <div className="flex flex-col gap-[var(--space-6)] lg:col-span-6">
            <RevealOnScroll>
              <Eyebrow tone="accent">
                Locations · {location.region}
              </Eyebrow>
            </RevealOnScroll>

            {script ? (
              <RevealOnScroll delay={0.05}>
                <p
                  aria-hidden="true"
                  className="font-display text-[length:var(--text-3xl)] italic text-[color:var(--color-gold-deep)]"
                >
                  {script}
                </p>
              </RevealOnScroll>
            ) : null}

            <DisplayHeading
              as="h1"
              size="hero"
              split
              splitMode="chars"
              text={location.name}
              className="max-w-[14ch] italic [font-size:clamp(36px,7vw,84px)]"
            />

            <RevealOnScroll delay={0.2}>
              <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {location.tagline}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="flex flex-wrap items-center gap-[var(--space-4)]">
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "primary",
                    size: "lg",
                  })}
                >
                  Plan in {location.shortName}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/portfolio"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "lg",
                  })}
                >
                  See nearby work
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* RIGHT — image with brass corners + Ken Burns */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[640px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
                <div
                  ref={kenBurnsRef}
                  className="absolute inset-0 will-change-transform"
                >
                  <Image
                    src={image}
                    alt={`Event decor in ${location.name}, ${location.region}`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    priority
                    className="object-cover"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(15,12,10,0.35) 100%)",
                  }}
                />
              </div>

              {/* Brass corner gilt */}
              <BrassCorner className="absolute -left-2 -top-2 h-12 w-12" />
              <BrassCorner className="absolute -right-2 -top-2 h-12 w-12 rotate-90" />
              <BrassCorner className="absolute -bottom-2 -left-2 h-12 w-12 -rotate-90" />
              <BrassCorner className="absolute -bottom-2 -right-2 h-12 w-12 rotate-180" />

              {/* Distance / coordinate strip */}
              <div className="mt-[var(--space-4)] flex items-center justify-between text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
                <span>
                  {location.distanceFromSiliguriKm === 0
                    ? "Home base"
                    : `${location.distanceFromSiliguriKm} km from Siliguri`}
                </span>
                <span>
                  {location.latitude.toFixed(2)}° N · {location.longitude.toFixed(2)}° E
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
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
