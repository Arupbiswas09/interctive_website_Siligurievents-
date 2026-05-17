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
import { MarigoldPetalFall } from "@/components/illustrations/marigold-petal-fall";
import { TextSplit } from "@/components/effects/3d-text-split";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HaldiHero — themed editorial hero for /services/haldi-gaye-holud.
 *
 * Layered composition (back → front):
 *   1. Saffron gradient bed (ambient warmth)
 *   2. Sun radial behind the image (dawn light)
 *   3. Hero photograph (haldi morning)
 *   4. Inline SVG marigold cluster ornaments — corner accents
 *   5. MarigoldPetalFall (ambient petals)
 *   6. Mandala border ornament (rotating slowly)
 *   7. Editorial copy — TextSplit headline + Devanagari मेहंदी label
 *
 * Choreography:
 *   • Entrance: timeline staggers eyebrow → headline (3D split) → script →
 *     body → CTAs → ornaments (Framer Motion easing).
 *   • Scroll: sun + photo translate at different speeds (parallax depth).
 *   • Mandala slowly rotates as you scroll (-360° over hero range).
 */
export function HaldiHero({
  name,
  nameHi,
  tagline,
  description,
  heroImage,
}: {
  name: string;
  nameHi?: string;
  tagline: string;
  description: string;
  heroImage: string;
}): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const mandalaRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const scriptRef = useRef<HTMLParagraphElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Entrance — quick stagger, low-amplitude (the photo & SplitText carry it).
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { y: 14, autoAlpha: 0, duration: 0.7 })
        .from(scriptRef.current, { y: 14, autoAlpha: 0, duration: 0.7 }, "-=0.35")
        .from(bodyRef.current, { y: 14, autoAlpha: 0, duration: 0.7 }, "-=0.4")
        .from(
          ctaRef.current?.children ?? [],
          { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.08 },
          "-=0.35",
        );

      // Parallax sun (slower than photo) + photo (medium speed).
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

      // Mandala border rotates as user scrolls — quiet ornament motion.
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
      data-ceremony="haldi"
      aria-label="Haldi & Gaye Holud — hero"
      className="relative isolate overflow-hidden"
      style={{
        // Per-ceremony palette override — propagates to all children using
        // the standard --color-accent / --color-gold tokens.
        // Tones tuned to Indian haldi: turmeric, saffron, marigold.
        ["--color-accent" as string]: "#c25515", // saffron rose
        ["--color-accent-deep" as string]: "#8d3a0a",
        ["--color-gold" as string]: "#e8a93a", // turmeric gold
        ["--color-gold-deep" as string]: "#b87a16",
        ["--color-gold-soft" as string]: "#f8e3a3",
        ["--color-bg" as string]: "#fbf2d8", // pale turmeric cream
        ["--color-bg-soft" as string]: "#f4e1ad",
        ["--color-ink" as string]: "#3a210a",
        ["--color-rose-soft" as string]: "#ffd9a1",
        height: "100svh",
        minHeight: "640px",
        maxHeight: "880px",
        background:
          "linear-gradient(180deg, #fff7e0 0%, #fbf2d8 38%, #f4e1ad 100%)",
        color: "#3a210a",
      }}
    >
      {/* ── 1. Sun radial (dawn light through morning mist) ── */}
      <div
        ref={sunRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] top-[8%] -z-10 h-[140%] w-[80%] will-change-transform"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(232,169,58,0.55) 0%, rgba(232,169,58,0.20) 35%, rgba(232,169,58,0) 70%)",
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
          {/* Warm haldi tint over photo */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(232,169,58,0.20) 0%, rgba(194,85,21,0.10) 60%, transparent 100%)",
            }}
          />
          {/* Left-edge wash fades photo into the warm cream canvas */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[55%]"
            style={{
              background:
                "linear-gradient(90deg, #fbf2d8 0%, rgba(251,242,216,0.85) 25%, rgba(251,242,216,0.35) 55%, rgba(251,242,216,0) 80%)",
            }}
          />
        </div>
      </div>

      {/* ── 3. Marigold cluster ornaments (corner accents) ── */}
      <MarigoldCluster className="pointer-events-none absolute -left-8 -top-8 z-0 h-44 w-44 opacity-80" />
      <MarigoldCluster className="pointer-events-none absolute -right-12 -bottom-12 z-0 h-56 w-56 opacity-80 rotate-180" />

      {/* ── 4. Slowly-rotating mandala border ornament ── */}
      <div
        ref={mandalaRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-[14%] z-0 hidden h-44 w-44 will-change-transform md:block"
      >
        <Mandala />
      </div>

      {/* ── 5. Marigold petal fall ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <MarigoldPetalFall
          tone="brass"
          maxPetals={10}
          spawnIntervalMs={1100}
          className="absolute inset-0 text-[#e8a93a]"
        />
      </div>

      {/* ── 6. Editorial copy ── */}
      <Container className="relative z-[2] h-full">
        <div className="grid h-full grid-cols-1 items-center pt-[96px] pb-[120px] md:pt-[110px] lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-6">
            <div
              ref={eyebrowRef}
              className="flex items-center gap-3"
              style={{ color: "var(--color-accent-deep)" }}
            >
              <span className="h-px w-10 bg-current opacity-60" />
              <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
                Pre-wedding · Morning ceremony
              </span>
            </div>

            {/* Hindi label */}
            {nameHi && (
              <p
                className="font-devanagari-display mt-6"
                style={{
                  color: "#b87a16",
                  fontSize: "clamp(28px, 2.6vw, 38px)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
                lang="hi"
              >
                {nameHi}
              </p>
            )}

            {/* Display headline via TextSplit (3D scattered letters settling) */}
            <h1
              className="mt-3 font-display"
              style={{
                color: "#3a210a",
                fontSize: "clamp(46px, 7.2vw, 108px)",
                fontWeight: 300,
                lineHeight: 0.94,
                letterSpacing: "-0.02em",
              }}
            >
              <TextSplit depth="medium" stagger={0.045}>
                {name.split("/")[0]?.trim() ?? name}
              </TextSplit>
              {name.includes("/") && (
                <span
                  className="block italic"
                  style={{ color: "#b87a16", fontWeight: 300 }}
                >
                  <TextSplit depth="subtle" stagger={0.035}>
                    {name.split("/")[1]?.trim() ?? ""}
                  </TextSplit>
                </span>
              )}
            </h1>

            {/* Script tagline */}
            <p
              ref={scriptRef}
              className="font-script mt-5"
              style={{
                color: "#c25515",
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
                color: "rgba(58, 33, 10, 0.8)",
                fontSize: "clamp(14px, 0.95vw, 16px)",
                lineHeight: 1.65,
              }}
            >
              {description}
            </p>

            {/* CTAs — themed turmeric gold + saffron */}
            <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "gold", size: "sm" }),
                  "h-11 px-6 gap-3 rounded-[2px] text-[11px] tracking-[0.18em]",
                )}
                style={{
                  backgroundColor: "#c25515",
                  color: "#fff7e0",
                }}
              >
                Plan your haldi morning
                <ArrowRight />
              </Link>
              <Link
                href="#ritual"
                className="inline-flex h-11 items-center gap-2.5 px-5 text-[11px] uppercase tracking-[0.18em] font-medium"
                style={{
                  color: "#3a210a",
                  borderBottom: "1px solid rgba(58, 33, 10, 0.4)",
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
// Decorative SVG components — inline so they accept currentColor + theme.
// ─────────────────────────────────────────────────────────────────────────────

function MarigoldCluster({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Cluster of 5 marigold blossoms — each is concentric petals */}
      <Marigold cx={50} cy={50} r={26} hue="#e8a93a" />
      <Marigold cx={120} cy={70} r={32} hue="#d88a1f" />
      <Marigold cx={90} cy={130} r={28} hue="#f0b449" />
      <Marigold cx={150} cy={140} r={22} hue="#c25515" />
      <Marigold cx={30} cy={130} r={20} hue="#e8a93a" />
      {/* Sprigs */}
      <path
        d="M50 50 Q 30 30 12 18"
        stroke="#4a6b2e"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path
        d="M120 70 Q 150 50 175 40"
        stroke="#4a6b2e"
        strokeWidth="1.2"
        opacity="0.6"
      />
      {/* Leaves */}
      <path
        d="M18 24 Q 26 18 30 28 Q 22 30 18 24Z"
        fill="#5d8838"
        opacity="0.7"
      />
      <path
        d="M170 36 Q 178 30 182 40 Q 174 42 170 36Z"
        fill="#5d8838"
        opacity="0.7"
      />
    </svg>
  );
}

function Marigold({
  cx,
  cy,
  r,
  hue,
}: {
  cx: number;
  cy: number;
  r: number;
  hue: string;
}): React.ReactElement {
  const petalCount = 12;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i * 360) / petalCount;
        return (
          <ellipse
            key={i}
            cx={0}
            cy={-r * 0.55}
            rx={r * 0.28}
            ry={r * 0.55}
            fill={hue}
            opacity={0.75}
            transform={`rotate(${angle})`}
          />
        );
      })}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i * 360) / petalCount + 360 / petalCount / 2;
        return (
          <ellipse
            key={`b-${i}`}
            cx={0}
            cy={-r * 0.36}
            rx={r * 0.22}
            ry={r * 0.36}
            fill={hue}
            opacity={0.95}
            transform={`rotate(${angle})`}
          />
        );
      })}
      <circle cx={0} cy={0} r={r * 0.18} fill="#8d3a0a" />
      <circle cx={0} cy={0} r={r * 0.09} fill="#b87a16" />
    </g>
  );
}

function Mandala(): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className="h-full w-full">
      {/* Concentric rings */}
      <circle cx="100" cy="100" r="92" stroke="#b87a16" strokeWidth="0.6" opacity="0.5" />
      <circle cx="100" cy="100" r="76" stroke="#b87a16" strokeWidth="0.4" opacity="0.35" />
      <circle cx="100" cy="100" r="58" stroke="#b87a16" strokeWidth="0.5" opacity="0.45" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="40" stroke="#b87a16" strokeWidth="0.4" opacity="0.4" />

      {/* 12-pointed star */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 100 + Math.cos(a) * 88;
        const y = 100 + Math.sin(a) * 88;
        return (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={x}
            y2={y}
            stroke="#b87a16"
            strokeWidth="0.35"
            opacity="0.35"
          />
        );
      })}

      {/* Petal ring at radius 50 */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * 360) / 16;
        return (
          <ellipse
            key={i}
            cx="100"
            cy="50"
            rx="3"
            ry="8"
            fill="#e8a93a"
            opacity="0.65"
            transform={`rotate(${a} 100 100)`}
          />
        );
      })}

      <circle cx="100" cy="100" r="3" fill="#8d3a0a" />
    </svg>
  );
}

function ArrowRight(): React.ReactElement {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
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
