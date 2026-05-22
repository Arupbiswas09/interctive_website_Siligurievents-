"use client";

/**
 * AboutPhilosophyPinned — pinned scroll narrative.
 *
 * A 4-viewport-tall section that pins on entry. As the user scrubs, the
 * left column cross-fades through four chapters of studio philosophy and
 * the right column cycles through ornaments (mandala / marigold / jasmine
 * / chandelier) that rotate slowly throughout. A brass diamond travels
 * down a central vertical hairline tracking progress; progress dots on
 * the right indicate the active chapter.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import {
  CeremonyOrnament,
  type OrnamentName,
} from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Chapter = {
  numeral: string;
  title: string;
  body: string;
  ornament: OrnamentName;
};

const PHILOSOPHY: readonly Chapter[] = [
  {
    numeral: "I",
    title: "Light first.",
    body: "Before a single flower is hung we have already drawn the light. Daylight ceremonies are designed at dawn; evening rooms are designed in the dark. The photograph is the brief.",
    ornament: "mandala",
  },
  {
    numeral: "II",
    title: "Restraint with depth.",
    body: "Three small installations beat one large one. We let the architecture and the people in the room carry the foreground; we work in the middle distance.",
    ornament: "marigold",
  },
  {
    numeral: "III",
    title: "Family before furniture.",
    body: "Every plan is reviewed with the elders. We seat them first; the cushion choices, the height of the chowki, the side they take photographs from — all settled before the florist arrives.",
    ornament: "jasmine",
  },
  {
    numeral: "IV",
    title: "The room remembers.",
    body: "We always leave a single thing behind for the family — a brass piece, a hand-painted invite. The decor leaves; the room remembers.",
    ornament: "chandelier",
  },
] as const;

export function AboutPhilosophyPinned(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<HTMLDivElement[]>([]);
  const ornamentRefs = useRef<HTMLDivElement[]>([]);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const diamondRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  chapterRefs.current = [];
  ornamentRefs.current = [];
  dotRefs.current = [];

  const collectChapter = (el: HTMLDivElement | null): void => {
    if (el && !chapterRefs.current.includes(el)) chapterRefs.current.push(el);
  };
  const collectOrnament = (el: HTMLDivElement | null): void => {
    if (el && !ornamentRefs.current.includes(el)) ornamentRefs.current.push(el);
  };
  const collectDot = (el: HTMLSpanElement | null): void => {
    if (el && !dotRefs.current.includes(el)) dotRefs.current.push(el);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const chapters = chapterRefs.current;
      const ornaments = ornamentRefs.current;
      const dots = dotRefs.current;
      if (chapters.length === 0) return;

      // Initial state: show first, hide rest.
      gsap.set(chapters.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(ornaments.slice(1), { autoAlpha: 0, scale: 0.92 });
      gsap.set(dots, { scale: 1, autoAlpha: 0.35 });
      if (dots[0]) gsap.set(dots[0], { autoAlpha: 1, scale: 1.6 });

      // Pin the inner stage for 4 viewports.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (chapters.length - 1) * 1.1}`,
          scrub: 0.8,
          pin: pin,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Drive the central brass diamond from 0 → 100%.
      if (diamondRef.current) {
        tl.fromTo(
          diamondRef.current,
          { top: "0%" },
          { top: "100%", ease: "none", duration: chapters.length - 1 },
          0,
        );
      }

      // Cross-fade chapters + ornaments segment by segment.
      for (let i = 1; i < chapters.length; i++) {
        const seg = i - 1;
        const prevChapter = chapters[i - 1];
        const nextChapter = chapters[i];
        const prevOrn = ornaments[i - 1];
        const nextOrn = ornaments[i];
        const prevDot = dots[i - 1];
        const nextDot = dots[i];

        if (!prevChapter || !nextChapter || !prevOrn || !nextOrn || !prevDot || !nextDot) continue;

        tl.to(prevChapter, { autoAlpha: 0, y: -24, duration: 0.5 }, seg)
          .to(prevOrn, { autoAlpha: 0, scale: 0.92, duration: 0.5 }, seg)
          .to(
            nextChapter,
            { autoAlpha: 1, y: 0, duration: 0.5 },
            seg + 0.45,
          )
          .to(
            nextOrn,
            { autoAlpha: 1, scale: 1, duration: 0.5 },
            seg + 0.45,
          )
          .to(
            prevDot,
            { autoAlpha: 0.35, scale: 1, duration: 0.3 },
            seg + 0.3,
          )
          .to(
            nextDot,
            { autoAlpha: 1, scale: 1.6, duration: 0.3 },
            seg + 0.4,
          );
      }

      // Continuous slow rotation of the active ornament.
      ornaments.forEach((el) => {
        gsap.to(el, {
          rotation: 360,
          duration: 60,
          ease: "none",
          repeat: -1,
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Studio philosophy"
      className="relative w-full bg-[color:var(--color-bg)] text-[color:var(--color-ink)]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100svh] w-full items-center overflow-hidden pt-[88px]"
      >
        {/* Central vertical hairline + traveling brass diamond */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[88px] hidden h-[calc(100%-88px)] w-px -translate-x-1/2 lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-gold) 15%, var(--color-gold) 85%, transparent 100%)",
            opacity: 0.35,
          }}
        >
          <div
            ref={diamondRef}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: "0%" }}
          >
            <div
              className="h-2.5 w-2.5 rotate-45"
              style={{
                background: "var(--color-gold)",
                boxShadow: "0 0 12px rgba(200,152,96,0.55)",
              }}
            />
          </div>
        </div>

        <Container className="relative z-[2] w-full">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* LEFT — chapter copy stack */}
            <div className="relative lg:col-span-6">
              <div
                className="flex items-center gap-3"
                style={{ color: "var(--color-gold-deep)" }}
              >
                <span className="h-px w-10 bg-current opacity-60" />
                <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
                  Four ideas · One studio
                </span>
              </div>

              <div className="relative mt-8 min-h-[420px]">
                {PHILOSOPHY.map((c, i) => (
                  <div
                    key={c.numeral}
                    ref={collectChapter}
                    className={cn(
                      "absolute inset-0 will-change-transform",
                      // First chapter starts visible (others set in useEffect)
                      i === 0 ? "" : "opacity-0",
                    )}
                  >
                    <span
                      className="font-display italic"
                      style={{
                        color: "var(--color-gold-deep)",
                        fontSize: "clamp(48px, 5vw, 80px)",
                        fontWeight: 200,
                        lineHeight: 1,
                      }}
                    >
                      {c.numeral}
                    </span>
                    <h3
                      className="mt-3 font-display"
                      style={{
                        fontSize: "clamp(32px, 3.4vw, 52px)",
                        fontWeight: 300,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "var(--color-ink)",
                      }}
                    >
                      {c.title}
                    </h3>
                    <p
                      className="mt-6 max-w-[44ch]"
                      style={{
                        fontSize: "clamp(15px, 1vw, 18px)",
                        lineHeight: 1.65,
                        color: "color-mix(in oklab, var(--color-ink) 78%, transparent)",
                      }}
                    >
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — ornament stage + progress dots */}
            <div className="relative flex items-center justify-end lg:col-span-6">
              <div className="relative mx-auto h-[340px] w-[340px] md:h-[480px] md:w-[480px]">
                {PHILOSOPHY.map((c, i) => (
                  <div
                    key={`o-${c.numeral}`}
                    ref={collectOrnament}
                    className={cn(
                      "absolute inset-0 will-change-transform",
                      i === 0 ? "" : "opacity-0",
                    )}
                  >
                    <CeremonyOrnament
                      name={c.ornament}
                      hue="var(--color-gold)"
                      hueSecondary="var(--color-gold-deep)"
                      className="h-full w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Progress dots */}
              <ul
                aria-hidden="true"
                className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-4"
              >
                {PHILOSOPHY.map((c) => (
                  <li key={`d-${c.numeral}`}>
                    <span
                      ref={collectDot}
                      className="block h-1.5 w-1.5 rotate-45 will-change-transform"
                      style={{
                        background: "var(--color-gold)",
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
