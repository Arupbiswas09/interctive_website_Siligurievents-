"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type CeremonyCtaProps = {
  theme: CeremonyTheme;
  serviceName: string;
  primaryHref?: string;
  secondaryHref?: string;
};

/**
 * CeremonyCta — dramatic, full-bleed page finale.
 *
 * Inverted palette: accentDeep canvas, bg-coloured ink. A large theme
 * ornament floats centre-right at low opacity, slowly rotating with scroll
 * scrub. The hero line is word-by-word scrubbed; subline is in script.
 * Two CTAs (gold solid + ghost) sit above a hairline + caption. A drift of
 * 6 small petals descends from the top in a long Framer Motion loop.
 *
 * Reduced motion: drops ornament rotation, word-by-word reveal, and petal
 * drift. Replaces them with a single fade so the section is still composed.
 */
export function CeremonyCta({
  theme,
  serviceName,
  primaryHref = "/contact",
  secondaryHref = "/portfolio",
}: CeremonyCtaProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Build the headline once. We word-split so GSAP / framer can target each.
  const headlineWords = useMemo<ReadonlyArray<string>>(() => {
    const lowered = serviceName.toLowerCase();
    return `Design your ${lowered} morning.`.split(/\s+/u);
  }, [serviceName]);

  const subline = theme.closingMantra ?? "Crafted, lit, and staged like a film.";

  useEffect(() => {
    if (prefersReducedMotion) return;
    const sectionEl = sectionRef.current;
    const ornamentEl = ornamentRef.current;
    const headlineEl = headlineRef.current;
    if (!sectionEl || !headlineEl) return;

    const ctx = gsap.context(() => {
      // Slow ornament rotation scrubbed across the section.
      if (ornamentEl) {
        gsap.fromTo(
          ornamentEl,
          { rotate: 0 },
          {
            rotate: -360,
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );
      }

      // Word-by-word scrub reveal.
      const wordNodes = headlineEl.querySelectorAll<HTMLElement>(
        "[data-cta-word]",
      );
      gsap.set(wordNodes, { yPercent: 60, opacity: 0, filter: "blur(8px)" });
      gsap.to(wordNodes, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: headlineEl,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
    }, sectionEl);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden"
      style={{
        background: theme.palette.accentDeep,
        color: theme.palette.bg,
        minHeight: "100vh",
      }}
      aria-label="Plan your ceremony"
    >
      {/* Background ornament — centre-right, low opacity, scroll-rotated */}
      <div
        ref={ornamentRef}
        aria-hidden
        className="pointer-events-none absolute right-[-12vw] top-1/2 -translate-y-1/2"
        style={{
          width: "80vh",
          height: "80vh",
          opacity: 0.18,
          willChange: "transform",
        }}
      >
        <CeremonyOrnament
          name={theme.ornament}
          hue={theme.palette.gold}
          hueSecondary={theme.palette.goldDeep}
          className="h-full w-full"
        />
      </div>

      {/* Drifting petals */}
      {!prefersReducedMotion ? (
        <PetalDrift color={theme.palette.gold} />
      ) : null}

      {/* Content — centered vertically across 100vh */}
      <Container>
        <div className="relative flex min-h-screen flex-col justify-center py-24 md:py-32">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{ background: theme.palette.gold, opacity: 0.9 }}
              aria-hidden
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.32em]"
              style={{ color: theme.palette.gold }}
            >
              Let&rsquo;s begin
            </span>
          </div>

          {/* Devanagari label */}
          {theme.devanagariLabel ? (
            <p
              className="mt-8 font-devanagari-display"
              style={{
                color: theme.palette.gold,
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              {theme.devanagariLabel}
            </p>
          ) : null}

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="mt-4 max-w-[18ch] font-display italic"
            style={{
              color: theme.palette.bg,
              fontWeight: 200,
              fontSize: "clamp(56px, 11vw, 140px)",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
            }}
          >
            {prefersReducedMotion ? (
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-block"
              >
                {headlineWords.join(" ")}
              </motion.span>
            ) : (
              headlineWords.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  className="inline-block overflow-hidden align-bottom pr-[0.18em]"
                >
                  <span data-cta-word className="inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))
            )}
          </h2>

          {/* Script subline */}
          <p
            className="mt-8 font-script"
            style={{
              color: theme.palette.goldSoft,
              fontSize: "clamp(22px, 2.6vw, 34px)",
              lineHeight: 1.15,
              opacity: 0.95,
            }}
          >
            {subline}
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href={primaryHref}
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)] px-7 font-medium uppercase tracking-[0.14em] transition-[transform,background-color] duration-200 ease-out hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: theme.palette.gold,
                color: theme.palette.accentDeep,
                fontSize: "var(--text-sm)",
              }}
            >
              WhatsApp us with a date
            </Link>

            <Link
              href={secondaryHref}
              className="group inline-flex items-center gap-2 border-b pb-1 font-medium uppercase tracking-[0.14em] transition-opacity duration-200"
              style={{
                color: theme.palette.bg,
                borderColor: `${theme.palette.bg}66`,
                fontSize: "var(--text-sm)",
              }}
            >
              <span>See related work</span>
              <span
                aria-hidden
                className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>

          {/* Hairline + caption */}
          <div className="mt-14 flex items-center gap-4">
            <span
              className="h-px w-16"
              style={{ background: theme.palette.gold, opacity: 0.6 }}
              aria-hidden
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.24em]"
              style={{ color: theme.palette.goldSoft, opacity: 0.85 }}
            >
              Reply within 24 hours &middot; Siliguri, North Bengal
            </span>
          </div>

        </div>
      </Container>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Petal drift — 6 small SVG petals descending in long, slightly-randomised loops
// ────────────────────────────────────────────────────────────────────────────

function PetalDrift({ color }: { color: string }): React.ReactElement {
  const petals: ReadonlyArray<{
    left: string;
    delay: number;
    duration: number;
    size: number;
    drift: number;
    rotate: number;
  }> = [
    { left: "8%", delay: 0, duration: 28, size: 14, drift: 18, rotate: 220 },
    { left: "22%", delay: 6, duration: 34, size: 10, drift: -22, rotate: -180 },
    { left: "38%", delay: 2, duration: 30, size: 12, drift: 14, rotate: 260 },
    { left: "58%", delay: 9, duration: 36, size: 16, drift: -16, rotate: -240 },
    { left: "74%", delay: 4, duration: 32, size: 11, drift: 24, rotate: 200 },
    { left: "88%", delay: 12, duration: 38, size: 13, drift: -20, rotate: -210 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {petals.map((p, idx) => (
        <motion.span
          key={idx}
          className="absolute top-[-6%] block"
          style={{ left: p.left, width: p.size, height: p.size }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["-10vh", "110vh"],
            x: [0, p.drift, -p.drift / 2, p.drift / 1.5, 0],
            rotate: [0, p.rotate / 2, p.rotate],
            opacity: [0, 0.85, 0.85, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            times: [0, 0.1, 0.5, 0.85, 1],
          }}
        >
          <svg viewBox="0 0 20 20" width={p.size} height={p.size}>
            <path
              d="M10 1 Q 17 6 14 13 Q 10 19 6 13 Q 3 6 10 1 Z"
              fill={color}
              opacity="0.9"
            />
          </svg>
        </motion.span>
      ))}
    </div>
  );
}
