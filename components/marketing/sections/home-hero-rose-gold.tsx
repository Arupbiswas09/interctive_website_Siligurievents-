"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_IMAGE = "/images/marketing/hero-mandap.png";

const CATEGORIES: ReadonlyArray<{ label: string; icon: React.ReactElement }> = [
  {
    label: "Weddings",
    icon: <LotusIcon />,
  },
  {
    label: "Birthdays",
    icon: <CakeIcon />,
  },
  {
    label: "Corporate Events",
    icon: <BuildingIcon />,
  },
  {
    label: "Destination Weddings",
    icon: <PalmIcon />,
  },
  {
    label: "Decor & Design",
    icon: <ArchIcon />,
  },
];

const SOCIALS: ReadonlyArray<{ label: string; href: string; icon: React.ReactElement }> = [
  { label: "Instagram", href: "https://instagram.com", icon: <IgIcon /> },
  { label: "Facebook", href: "https://facebook.com", icon: <FbIcon /> },
  { label: "Pinterest", href: "https://pinterest.com", icon: <PinIcon /> },
  { label: "YouTube", href: "https://youtube.com", icon: <YtIcon /> },
];

export function HomeHeroRoseGold(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const washRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const scriptRef = useRef<HTMLParagraphElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const socialRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Entrance timeline — staggered choreography.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { y: 16, autoAlpha: 0, duration: 0.7 })
        .from(
          headlineRef.current?.querySelectorAll("span") ?? [],
          {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "expo.out",
          },
          "-=0.45",
        )
        .from(
          scriptRef.current,
          { y: 18, autoAlpha: 0, duration: 0.9 },
          "-=0.7",
        )
        .from(
          bodyRef.current,
          { y: 18, autoAlpha: 0, duration: 0.8 },
          "-=0.55",
        )
        .from(
          ctaRef.current?.children ?? [],
          { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08 },
          "-=0.45",
        )
        .from(
          cardsRef.current?.children ?? [],
          { y: 22, autoAlpha: 0, duration: 0.55, stagger: 0.07 },
          "-=0.3",
        )
        .from(
          socialRef.current,
          { x: 24, autoAlpha: 0, duration: 0.6 },
          "-=0.6",
        );

      // — Scroll choreography — background slow-pan, content fades out
      //   as user scrolls past the hero, mandap parallax-rises slightly.
      gsap.to(bgRef.current, {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(washRef.current, {
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        y: -56,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=70%",
          scrub: 0.6,
        },
      });

      gsap.to(cardsRef.current, {
        y: 48,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, sectionRef.current ?? undefined);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Siliguri Event — hero"
      className="relative isolate overflow-hidden bg-[color:var(--color-bg)]"
      style={{ height: "100svh", minHeight: "640px", maxHeight: "880px" }}
    >
      {/* — Background photograph (parallax) — */}
      <div ref={bgRef} className="absolute inset-0 -z-20 will-change-transform">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* — Left ivory wash — fades out as user scrolls. — */}
      <div
        ref={washRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, rgba(251,246,239,0.85) 0%, rgba(251,246,239,0.55) 28%, rgba(251,246,239,0.10) 52%, rgba(251,246,239,0) 70%)",
        }}
      />

      {/* — Right-side social rail — */}
      <aside
        ref={socialRef}
        aria-label="Follow us"
        className="pointer-events-auto absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      >
        <span
          aria-hidden="true"
          className="rotate-180 text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ink)]/70"
          style={{ writingMode: "vertical-rl" }}
        >
          Follow Us
        </span>
        <span aria-hidden="true" className="h-6 w-px bg-[color:var(--color-ink)]/30" />
        <ul className="flex flex-col items-center gap-3">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full",
                  "text-[color:var(--color-ink)]/75 transition-colors duration-200",
                  "hover:text-[color:var(--color-accent)]",
                )}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <Container className="relative h-full">
        <div
          ref={contentRef}
          className="grid h-full grid-cols-1 items-center pt-[96px] pb-[180px] md:pt-[104px] md:pb-[200px] lg:grid-cols-12"
        >
          <div className="lg:col-span-7 xl:col-span-6">
            {/* eyebrow */}
            <div
              ref={eyebrowRef}
              className="flex flex-col items-start gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.34em] text-[color:var(--color-accent)] font-medium">
                We Plan. You Celebrate.
              </span>
              <span
                aria-hidden="true"
                className="flex items-center gap-2 text-[color:var(--color-gold-deep)]/70"
              >
                <span className="h-px w-6 bg-current" />
                <DiamondGlyph />
                <span className="h-px w-6 bg-current" />
              </span>
            </div>

            {/* display headline — refined, thin weight, restrained scale */}
            <h1
              ref={headlineRef}
              className="mt-5 font-display leading-[0.94] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(44px, 6.2vw, 92px)",
                fontWeight: 300,
              }}
            >
              <span className="block text-[color:var(--color-accent)]">
                Siliguri
              </span>
              <span
                className="block text-[color:var(--color-gold-deep)] italic"
                style={{ fontWeight: 300, letterSpacing: "-0.015em" }}
              >
                Event
              </span>
            </h1>

            {/* script subtitle — modest scale, lighter color */}
            <p
              ref={scriptRef}
              className="font-script mt-5 text-[color:var(--color-accent)]/90"
              style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.1 }}
            >
              Crafting Unforgettable Celebrations
            </p>

            {/* body copy */}
            <p
              ref={bodyRef}
              className="mt-6 max-w-[40ch] text-[color:var(--color-ink)]/75"
              style={{ fontSize: "clamp(14px, 0.95vw, 16px)", lineHeight: 1.7 }}
            >
              From intimate gatherings to grand celebrations, we bring your
              dreams to life with creativity, perfection and passion.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "gold", size: "sm" }),
                  "h-11 px-6 gap-3 rounded-[2px] text-[11px] tracking-[0.18em]",
                )}
              >
                Explore Our Services
                <ArrowRight />
              </Link>
              <Link
                href="/about#story"
                className={cn(
                  buttonVariants({ variant: "outlineInk", size: "sm" }),
                  "h-11 px-5 gap-3 rounded-[2px] border-[color:var(--color-ink)]/35 text-[11px] tracking-[0.18em]",
                )}
              >
                <PlayGlyph />
                Watch Our Story
              </Link>
            </div>
          </div>
        </div>

      </Container>

      {/* — Category cards — anchored to the hero baseline so layout
            doesn't grow downward. Floats over both the wash and the
            mandap, with a translucent backdrop and a brass hairline. — */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <Container className="relative">
          <div
            ref={cardsRef}
            className="pointer-events-auto relative -mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-white/92 shadow-[0_30px_80px_-30px_rgba(58,26,36,0.35)] ring-1 ring-[color:var(--color-ink)]/5 backdrop-blur-md sm:grid-cols-3 md:grid-cols-5 md:max-w-[820px]"
          >
            {/* Top brass hairline */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-gold)]/60 to-transparent"
            />
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.label} label={c.label} icon={c.icon} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category card
// ─────────────────────────────────────────────────────────────────────────────

function CategoryCard({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactElement;
}): React.ReactElement {
  return (
    <button
      type="button"
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2.5 bg-white/90 px-3 py-5",
        "transition-colors duration-300 hover:bg-[color:var(--color-bg-soft)]",
      )}
    >
      <span className="text-[color:var(--color-gold-deep)] transition-transform duration-300 group-hover:-translate-y-0.5">
        {icon}
      </span>
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-center text-[color:var(--color-ink)]/80 leading-[1.35]">
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG glyphs — keeps the hero zero-dependency, all line-art in brass.
// Hand-tuned to match the reference mockup's iconography.
// ─────────────────────────────────────────────────────────────────────────────

function DiamondGlyph(): React.ReactElement {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
      <path
        d="M7 1L11 4L7 7L3 4L7 1Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
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

function PlayGlyph(): React.ReactElement {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 7.5L15 11L9 14.5V7.5Z" fill="currentColor" />
    </svg>
  );
}

function LotusIcon(): React.ReactElement {
  return (
    <svg width="28" height="26" viewBox="0 0 36 32" fill="none" aria-hidden="true">
      <path
        d="M18 6c-2 5-6 9-6 13 0 3 3 6 6 6s6-3 6-6c0-4-4-8-6-13Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6 16c2-2 6-2 8 0M30 16c-2-2-6-2-8 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M4 22h28" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function CakeIcon(): React.ReactElement {
  return (
    <svg width="26" height="26" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path d="M17 3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="17" cy="3" r="1" fill="currentColor" />
      <rect x="6" y="20" width="22" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 20v-4c0-2 1.4-3 3-3h8c1.6 0 3 1 3 3v4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6 23c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M4 30h26" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function BuildingIcon(): React.ReactElement {
  return (
    <svg width="24" height="26" viewBox="0 0 32 34" fill="none" aria-hidden="true">
      <path d="M16 3l4 5h-8l4-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 5v6" stroke="currentColor" strokeWidth="1" />
      <path d="M8 28V12h16v16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 28v-6h4v6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 16h2M19 16h2M11 20h2M19 20h2" stroke="currentColor" strokeWidth="1" />
      <path d="M4 31h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PalmIcon(): React.ReactElement {
  return (
    <svg width="24" height="26" viewBox="0 0 32 34" fill="none" aria-hidden="true">
      <path
        d="M16 12c0 6-1 12-3 18M16 12c2 5 4 9 8 12M16 12c-2 5-5 8-9 10M16 12c0-3 1-5 3-6M16 12c0-3-1-5-3-6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1" />
      <path d="M4 31h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ArchIcon(): React.ReactElement {
  return (
    <svg width="24" height="26" viewBox="0 0 32 34" fill="none" aria-hidden="true">
      <path
        d="M6 28V14L16 4l10 10v14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M12 28v-8a4 4 0 0 1 8 0v8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 31h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IgIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FbIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9.5a.5.5 0 0 1 .5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M11 8c2-1 5 0 5 3s-3 4-4 3M11 8l-1 11M11 8c-1 2-1 5 0 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function YtIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.5l5 2.5-5 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}
