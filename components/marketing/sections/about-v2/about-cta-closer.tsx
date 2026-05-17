"use client";

/**
 * AboutCtaCloser — dark inverse-palette closer.
 *
 * Big italic headline ("Come to the studio."), a quiet subhead with the
 * address + hours, and two CTAs (WhatsApp + Drive directions). A large
 * mandala ornament rotates slowly behind the headline at low opacity.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WHATSAPP_HREF =
  "https://wa.me/919800000000?text=Hello%20Siliguri%20Event%2C%20I%27d%20like%20to%20visit%20the%20studio.";
const DIRECTIONS_HREF =
  "https://maps.google.com/?q=Hill+Cart+Road,+Siliguri,+West+Bengal";

export function AboutCtaCloser(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Slow continuous rotation of the background ornament.
      if (ornamentRef.current) {
        gsap.to(ornamentRef.current, {
          rotation: 360,
          duration: 80,
          ease: "none",
          repeat: -1,
        });
      }

      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Come to the studio"
      className="relative isolate w-full overflow-hidden py-[clamp(96px,14vh,200px)]"
      style={{
        background: "var(--color-ink)",
        color: "var(--color-bg)",
      }}
    >
      {/* Background ornament — slow rotation */}
      <div
        ref={ornamentRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ opacity: 0.15 }}
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold)"
          hueSecondary="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      <Container>
        <div className="mx-auto max-w-[1100px] text-center">
          <div
            className="flex items-center justify-center gap-3"
            style={{ color: "var(--color-gold)" }}
          >
            <span className="h-px w-10 bg-current opacity-60" />
            <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
              The door is open
            </span>
            <span className="h-px w-10 bg-current opacity-60" />
          </div>

          <h2
            ref={headlineRef}
            className="mt-8 font-display italic"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              fontWeight: 300,
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: "var(--color-bg)",
            }}
          >
            Come to the studio.
          </h2>

          <p
            className="mx-auto mt-8 max-w-[44ch]"
            style={{
              fontSize: "clamp(15px, 1.1vw, 19px)",
              lineHeight: 1.55,
              color: "color-mix(in oklab, var(--color-bg) 80%, transparent)",
            }}
          >
            Hill Cart Road, Siliguri · weekdays 11–7. Tea and a moodboard,
            usually in that order.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-3 px-8 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors duration-200"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-ink)",
              }}
            >
              WhatsApp the studio
              <ArrowRight />
            </Link>
            <Link
              href={DIRECTIONS_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-3 px-6 text-[11px] uppercase tracking-[0.22em] font-medium"
              style={{
                color: "var(--color-bg)",
                borderBottom: "1px solid color-mix(in oklab, var(--color-bg) 50%, transparent)",
              }}
            >
              Drive directions
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
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
