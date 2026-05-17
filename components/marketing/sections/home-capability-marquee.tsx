"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { velocityBlur } from "@/lib/gsap/scroll-triggers";

// Capability list — matches docs/05-PAGE-SPECS.md §5.1 H2.
// TODO(sprint-2): source from CMS SiteSettings.capabilityMarquee.
const CAPABILITIES = [
  "Hindu Weddings",
  "Bengali Aashirbaad",
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Reception",
  "Birthdays",
  "Anniversaries",
  "Annaprashan",
  "Corporate",
  "Durga Puja",
  "Lakshmi Puja",
  "Saraswati Puja",
  "Naamkaran",
  "Griha Pravesh",
] as const;

/**
 * H2 — Capability marquee (silent confidence).
 *
 * Continuous slow horizontal scroll of service names separated by brass
 * ornament glyphs. Slows on hover (cursor magnetism), reverses on scroll-
 * direction change (Observer-driven velocity input, SIG-03).
 *
 * Reduced motion: track is static; user can horizontally scroll the row
 * with no animation at all.
 */
export function HomeCapabilityMarquee(): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion) {
      setReady(true);
      return;
    }

    const blurCleanup = velocityBlur({ target: track, maxBlur: 3, maxSkew: 4 });

    const ctx = gsap.context(() => {
      // Continuous loop — translate half the track since content is duplicated.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1,
      });

      // Hover slow-down (cursor magnetism analog).
      const onEnter = (): void => {
        gsap.to(tween, { timeScale: 0.25, duration: 0.6 });
      };
      const onLeave = (): void => {
        gsap.to(tween, { timeScale: 1, duration: 0.6 });
      };
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      // Reverse direction on scroll-direction change.
      let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
      let lastDirection: 1 | -1 = 1;
      const onScroll = (): void => {
        const y = window.scrollY;
        const dir: 1 | -1 = y >= lastScrollY ? 1 : -1;
        if (dir !== lastDirection) {
          gsap.to(tween, {
            timeScale: dir,
            duration: 0.8,
            ease: "power2.out",
            // Preserve hover slow-down when present.
            overwrite: "auto",
          });
          lastDirection = dir;
        }
        lastScrollY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      setReady(true);

      return (): void => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("scroll", onScroll);
      };
    }, track);

    return (): void => {
      blurCleanup();
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // Render the row twice for a seamless loop. aria-hidden because the
  // capability list is also surfaced semantically on /services.
  return (
    <section
      aria-labelledby="home-capabilities-label"
      data-tone="elevated"
      className="relative w-full bg-[color:var(--color-bg-elevated)] py-[var(--space-12)]"
    >
      <h2 id="home-capabilities-label" className="sr-only">
        Our capabilities
      </h2>
      <div
        ref={wrapperRef}
        aria-hidden="true"
        data-ready={ready}
        className={cn(
          "relative overflow-hidden",
          // edge masks so words ghost-in/out at the viewport sides
          "[mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]",
        )}
      >
        <div
          ref={trackRef}
          className="flex w-max flex-nowrap items-center will-change-transform"
        >
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              className="flex shrink-0 items-center"
              aria-hidden={copyIdx === 1 ? "true" : undefined}
            >
              {CAPABILITIES.map((cap, i) => (
                <span
                  key={`${copyIdx}-${cap}-${i}`}
                  className="flex shrink-0 items-center gap-[var(--space-8)] px-[var(--space-8)]"
                >
                  <span className="font-display text-[length:var(--text-3xl)] italic leading-none text-[color:var(--color-ink)]">
                    {cap}
                  </span>
                  <Ornament />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Brass ornament separator — a flourish glyph between capability terms.
 * Inline SVG (3 KB) so we never block on a sprite load.
 */
function Ornament(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 12"
      width="36"
      height="12"
      className="shrink-0 text-[color:var(--color-gold)] opacity-80"
      role="presentation"
    >
      <path
        d="M0 6 H10 M26 6 H36"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 6 q2 -5 4 0 q2 5 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="18" cy="6" r="1.2" fill="currentColor" />
    </svg>
  );
}
