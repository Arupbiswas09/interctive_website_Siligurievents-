"use client";

/**
 * GalleryCtaCloser — themed CTA closer for the Gallery page.
 *
 * Composition:
 *   • Inverse palette (ink background, cream text).
 *   • Large rotating MandapOrnament behind the headline (scroll-scrub).
 *   • Gold eyebrow → big italic headline (word-by-word scrub reveal) →
 *     WhatsApp primary CTA + Inquiry ghost CTA.
 */

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { buttonVariants } from "@/components/ui/button-variants";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADLINE_WORDS: ReadonlyArray<string> = [
  "Browse",
  "the",
  "work.",
  "Then",
  "bring",
  "us",
  "the",
  "date.",
];

const WHATSAPP_HREF =
  "https://wa.me/91XXXXXXXXXX?text=" +
  encodeURIComponent(
    "Hi Siligurievent — I just saw your gallery and would like to discuss an event.",
  );

export function GalleryCtaCloser(): ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  wordsRef.current = [];
  const collectWord = (el: HTMLSpanElement | null): void => {
    if (el && !wordsRef.current.includes(el)) wordsRef.current.push(el);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Word-by-word reveal, scrubbed.
      gsap.fromTo(
        wordsRef.current,
        { y: 56, autoAlpha: 0, filter: "blur(14px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          stagger: 0.08,
          duration: 0.9,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.6,
          },
        },
      );

      if (ornamentRef.current) {
        gsap.to(ornamentRef.current, {
          rotate: 30,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      }
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-tone="dark"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[color:var(--color-ink)] text-[color:var(--color-bg)]"
      style={{ backgroundColor: "#0E0B08", color: "#F5EDE0" }}
    >
      {/* Background ornament — large, low-opacity, scrub-rotated */}
      <div
        aria-hidden="true"
        ref={ornamentRef}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
      >
        <CeremonyOrnament
          name="mandap"
          hue="var(--color-gold)"
          className="h-full w-full"
        />
      </div>

      {/* Atmospheric vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse at 25% 20%, rgba(184,137,58,0.22), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(164,54,92,0.2), transparent 55%)",
        }}
      />

      <Container>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-[var(--space-10)] py-[var(--space-24)] text-center">
          <Eyebrow tone="gold">What's next</Eyebrow>

          <h2
            className="font-display italic"
            style={{
              fontSize: "clamp(2.5rem, 7.2vw, 6rem)",
              lineHeight: 0.98,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              maxWidth: "20ch",
              color: "#F5EDE0",
            }}
          >
            <span className="sr-only">Browse the work. Then bring us the date.</span>
            <span aria-hidden="true" className="block">
              {HEADLINE_WORDS.map((word, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: words stable per render
                  key={`${word}-${index}`}
                  ref={collectWord}
                  className="mr-[0.18em] inline-block will-change-transform"
                >
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <p className="max-w-[52ch] text-[length:var(--text-base)] leading-relaxed text-[#f5ede0]/75">
            Tell us the date, the venue, and the vibe — we'll come back with a
            mood board, a price band, and a calendar hold inside 24 hours.
          </p>

          <div className="mt-[var(--space-2)] flex flex-col items-center gap-[var(--space-4)] sm:flex-row">
            <Link
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "gold", size: "lg" })}
            >
              WhatsApp us
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outlineInk", size: "lg" })}
              style={{
                color: "#F5EDE0",
                borderColor: "rgba(245, 237, 224, 0.35)",
              }}
            >
              Send an inquiry <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
