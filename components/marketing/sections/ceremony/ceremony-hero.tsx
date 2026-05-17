"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Suspense } from "react";
import { MarigoldPetalFall } from "@/components/illustrations/marigold-petal-fall";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { TextSplit } from "@/components/effects/3d-text-split";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type CeremonyHeroProps = {
  /** Per-page theme contract — palette, ornaments, particles, labels. */
  theme: CeremonyTheme;
  /** Display name, may contain a "/" separator (e.g. "Haldi / Gaye Holud"). */
  name: string;
  /** Script tagline rendered in Allura. */
  tagline: string;
  /** Single-paragraph editorial body copy. */
  description: string;
  /** Hero photograph path under /public. */
  heroImage: string;
};

/**
 * CeremonyHero — theme-driven editorial hero for service detail pages.
 *
 * Single hero used by every ceremony page (haldi, mehendi, sangeet,
 * bengali-wedding, reception, ...). Every visual detail comes from the
 * `theme: CeremonyTheme` prop — colours flow in as CSS custom properties
 * on the section, ornaments resolve via `CeremonyOrnament`, particles
 * gate on `theme.particles.kind`, and devanagari label / period eyebrow
 * are pulled directly from the theme.
 *
 * Layered composition (back → front):
 *   1. Section gradient bed using theme bg / bgSoft
 *   2. Sun radial behind the image (parallax slower)
 *   3. Hero photograph (parallax medium)
 *   4. Photo tint overlay (theme.palette.photoTint)
 *   5. Left-edge wash — fades photo into the canvas
 *   6. Corner ornaments (theme.ornament — top-left + bottom-right mirrored)
 *   7. Mandala accent (top-right, slow scroll-linked rotation)
 *   8. Particle layer (currently: marigold only)
 *   9. Editorial copy column with TextSplit headline, script tagline, CTAs
 *
 * Choreography:
 *   • Entrance timeline (eyebrow → headline → script → body → CTAs)
 *   • Scroll: sun + photo translate at different speeds (parallax)
 *   • Mandala rotates -180° over hero range
 *
 * Reduced motion: skip entrance + parallax + rotation. Static layout is
 * already complete; nothing depends on the tweens to be visible.
 */
export function CeremonyHero({
  theme,
  name,
  tagline,
  description,
  heroImage,
}: CeremonyHeroProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const mandalaRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const devanagariRef = useRef<HTMLParagraphElement | null>(null);
  const scriptRef = useRef<HTMLParagraphElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Resolve language tag for the devanagari/bengali label.
  const scriptLang: "bn" | "hi" =
    theme.slug === "bengali-wedding" ? "bn" : "hi";

  // Split name on first "/" — left part is primary, right part is italic sub.
  const [primaryNameRaw, secondaryNameRaw] = name.split("/");
  const primaryName = (primaryNameRaw ?? name).trim();
  const secondaryName = secondaryNameRaw?.trim() ?? "";

  const { palette } = theme;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Entrance — quick stagger, low amplitude (photo + TextSplit carry it).
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { y: 14, autoAlpha: 0, duration: 0.7 });
      if (devanagariRef.current) {
        tl.from(
          devanagariRef.current,
          { y: 14, autoAlpha: 0, duration: 0.7 },
          "-=0.4",
        );
      }
      tl.from(
        scriptRef.current,
        { y: 14, autoAlpha: 0, duration: 0.7 },
        "-=0.35",
      )
        .from(
          bodyRef.current,
          { y: 14, autoAlpha: 0, duration: 0.7 },
          "-=0.4",
        )
        .from(
          ctaRef.current?.children ?? [],
          { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.08 },
          "-=0.35",
        );

      // Parallax sun — slowest layer (atmospheric depth).
      gsap.to(sunRef.current, {
        yPercent: -18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      // Parallax photograph — mid-depth.
      gsap.to(photoRef.current, {
        yPercent: 8,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Mandala — quiet ornament rotation tied to scroll.
      gsap.to(mandalaRef.current, {
        rotation: -180,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef.current ?? undefined);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-ceremony={theme.slug}
      aria-label={`${primaryName} — hero`}
      className="relative isolate overflow-hidden"
      style={{
        // Per-ceremony palette propagates as CSS custom properties so
        // descendant components can theme without prop-drilling.
        ["--color-bg" as string]: palette.bg,
        ["--color-bg-soft" as string]: palette.bgSoft,
        ["--color-ink" as string]: palette.ink,
        ["--color-accent" as string]: palette.accent,
        ["--color-accent-deep" as string]: palette.accentDeep,
        ["--color-gold" as string]: palette.gold,
        ["--color-gold-deep" as string]: palette.goldDeep,
        ["--color-gold-soft" as string]: palette.goldSoft,
        height: "100svh",
        minHeight: "640px",
        maxHeight: "880px",
        background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bg} 38%, ${palette.bgSoft} 100%)`,
        color: palette.ink,
      }}
    >
      {/* ── 1. Sun radial — themed warmth behind the photograph ── */}
      <div
        ref={sunRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] top-[8%] -z-10 h-[140%] w-[80%] will-change-transform"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${palette.gold}8c 0%, ${palette.gold}33 35%, ${palette.gold}00 70%)`,
        }}
      />

      {/* ── 2. Hero photograph (parallax) ── */}
      <div
        ref={photoRef}
        className="absolute inset-y-0 right-[-4%] -z-10 w-[64%] will-change-transform"
      >
        <div className="relative h-full w-full">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-center"
            style={{ filter: "saturate(1.06) brightness(1.02)" }}
          />
          {/* Themed tint over photo */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: palette.photoTint }}
          />
          {/* Left-edge wash — fades the photo into the canvas */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[55%]"
            style={{
              background: `linear-gradient(90deg, ${palette.bg} 0%, ${palette.bg}d9 25%, ${palette.bg}59 55%, ${palette.bg}00 80%)`,
            }}
          />
        </div>
      </div>

      {/* ── 3. Corner ornaments — themed per ceremony ── */}
      <CeremonyOrnament
        name={theme.ornament}
        hue={palette.gold}
        hueSecondary={palette.accent}
        className="pointer-events-none absolute -left-8 -top-8 z-0 h-44 w-44 opacity-80"
      />
      <CeremonyOrnament
        name={theme.ornament}
        hue={palette.gold}
        hueSecondary={palette.accent}
        className="pointer-events-none absolute -right-12 -bottom-12 z-0 h-56 w-56 rotate-180 opacity-80"
      />

      {/* ── 4. Mandala accent — scroll-rotated quiet motion ── */}
      <div
        ref={mandalaRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-[14%] z-0 hidden h-44 w-44 will-change-transform md:block"
      >
        <CeremonyOrnament
          name="mandala"
          hue={palette.gold}
          hueSecondary={palette.accent}
          className="h-full w-full"
        />
      </div>

      {/* ── 5. Particle layer — gated by theme.particles.kind ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        {theme.particles.kind === "marigold" ? (
          // Next.js 16 Cache Components flags Math.random() inside client
          // components without a Suspense boundary above them. The petal
          // fall spawns its randomness in useEffect so it cannot affect
          // the prerendered HTML — Suspense satisfies the static check.
          <Suspense fallback={null}>
            <MarigoldPetalFall
              tone="brass"
              maxPetals={10}
              spawnIntervalMs={1100}
              className="absolute inset-0"
              style={{ color: palette.gold }}
            />
          </Suspense>
        ) : null}
        {/*
          TODO: render dedicated particle components when they exist:
            • jasmine     → <JasminePetalFall />
            • rosePetals  → <RosePetalFall />
            • confetti    → <ConfettiBurst />
            • balloons    → <BalloonFloat />
            • sparks      → <SparkEmber />
            • none        → render nothing (current default)
        */}
      </div>

      {/* ── 6. Editorial copy ── */}
      <Container className="relative z-[2] h-full">
        <div className="grid h-full grid-cols-1 items-center pt-[96px] pb-[120px] md:pt-[110px] lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-6">
            {/* Period eyebrow */}
            <div
              ref={eyebrowRef}
              className="flex items-center gap-3"
              style={{ color: palette.accentDeep }}
            >
              <span className="h-px w-10 bg-current opacity-60" />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em]">
                {theme.periodLabel}
              </span>
            </div>

            {/* Devanagari / Bengali script label */}
            {theme.devanagariLabel ? (
              <p
                ref={devanagariRef}
                className="font-devanagari-display mt-6"
                style={{
                  color: palette.goldDeep,
                  fontSize: "clamp(28px, 2.6vw, 38px)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
                lang={scriptLang}
              >
                {theme.devanagariLabel}
              </p>
            ) : null}

            {/* Display headline — TextSplit takes string children only */}
            <h1
              className="mt-3 font-display"
              style={{
                color: palette.ink,
                fontSize: "clamp(46px, 7.2vw, 108px)",
                fontWeight: 300,
                lineHeight: 0.94,
                letterSpacing: "-0.02em",
              }}
            >
              <TextSplit depth="medium" stagger={0.045}>
                {primaryName}
              </TextSplit>
              {secondaryName ? (
                <span
                  className="block italic"
                  style={{ color: palette.goldDeep, fontWeight: 300 }}
                >
                  <TextSplit depth="subtle" stagger={0.035}>
                    {secondaryName}
                  </TextSplit>
                </span>
              ) : null}
            </h1>

            {/* Script tagline */}
            <p
              ref={scriptRef}
              className="font-script mt-5"
              style={{
                color: palette.accent,
                fontSize: "clamp(22px, 2.4vw, 34px)",
                lineHeight: 1.1,
                opacity: 0.95,
              }}
            >
              {tagline}
            </p>

            {/* Body */}
            <p
              ref={bodyRef}
              className="mt-6 max-w-[42ch]"
              style={{
                color: `${palette.ink}cc`,
                fontSize: "clamp(14px, 0.95vw, 16px)",
                lineHeight: 1.65,
              }}
            >
              {description}
            </p>

            {/* CTAs — themed gold + ghost-with-underline */}
            <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "gold", size: "sm" }),
                  "h-11 gap-3 rounded-[2px] px-6 text-[11px] tracking-[0.18em]",
                )}
                style={{
                  backgroundColor: palette.accent,
                  color: palette.bg,
                }}
              >
                Plan your {primaryName.toLowerCase()}
                <ArrowRight />
              </Link>
              <Link
                href="#ritual"
                className="inline-flex h-11 items-center gap-2.5 px-5 text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{
                  color: palette.ink,
                  borderBottom: `1px solid ${palette.ink}66`,
                }}
              >
                Read the ritual story
                <span aria-hidden="true">↓</span>
              </Link>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-12 hidden items-center gap-3 md:flex"
            >
              <span className="text-[9px] uppercase tracking-[0.36em] opacity-60">
                Scroll
              </span>
              <span className="relative block h-[1px] w-12 bg-current opacity-40">
                <motion.span
                  className="absolute inset-y-0 left-0 block w-3 bg-current"
                  animate={{ x: [0, 36, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Local arrow glyph — kept inline so the CTA owns its own marker.
// ─────────────────────────────────────────────────────────────────────────────

function ArrowRight(): React.ReactElement {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6H15M15 6L10 1M15 6L10 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
