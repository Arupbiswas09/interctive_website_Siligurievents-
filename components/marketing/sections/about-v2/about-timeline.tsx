"use client";

/**
 * AboutTimeline — editorial timeline with central brass rail.
 *
 * 6 milestones placed zig-zag against a vertical brass rail down the centre.
 * As the user scrolls the rail fills (top → bottom), each entry fades in
 * from the appropriate side, and the year for each entry counts up via a
 * scrubbed counter.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Milestone = {
  year: number;
  title: string;
  body: string;
  image: string;
};

const TIMELINE: readonly Milestone[] = [
  {
    year: 2014,
    title: "Studio founded",
    body: "Started in a one-room rental on Hill Cart Road. First event was my sister's mehendi.",
    image:
      "/images/work/work-04.webp",
  },
  {
    year: 2016,
    title: "First destination wedding",
    body: "Three days in the Dooars. Marigold strung between bamboo and tea bushes.",
    image:
      "/images/services/svc-02.webp",
  },
  {
    year: 2018,
    title: "Durga Puja debut",
    body: "First public pandal design — a Bengali-Bengali jugalbandi.",
    image:
      "/images/services/svc-04.webp",
  },
  {
    year: 2020,
    title: "Press: Vogue Wedding Co",
    body: "First feature; the team grew from 4 to 9 in the next six months.",
    image:
      "/media/decor-pairs/haldi-01-night.avif",
  },
  {
    year: 2023,
    title: "100th event",
    body: "A bridal mandap on the edge of Mahananda Park. We knew the room before the family arrived.",
    image:
      "/media/decor-pairs/haldi-01-day.avif",
  },
  {
    year: 2025,
    title: "250 events, 36 cities",
    body: "Still in Siliguri. Still designing dawn ceremonies in clay. Still leaving a single brass piece behind.",
    image:
      "/images/services/svc-04.webp",
  },
] as const;

export function AboutTimeline(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const entryRefs = useRef<HTMLDivElement[]>([]);
  const yearRefs = useRef<HTMLSpanElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  entryRefs.current = [];
  yearRefs.current = [];

  const collectEntry = (el: HTMLDivElement | null): void => {
    if (el && !entryRefs.current.includes(el)) entryRefs.current.push(el);
  };
  const collectYear = (el: HTMLSpanElement | null): void => {
    if (el && !yearRefs.current.includes(el)) yearRefs.current.push(el);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Rail fill — gradient mask grows top→bottom.
      if (railFillRef.current) {
        gsap.fromTo(
          railFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );
      }

      // Per-entry: fade + slide + year count-up.
      entryRefs.current.forEach((entry, i) => {
        const side = i % 2 === 0 ? -50 : 50;
        gsap.fromTo(
          entry,
          { autoAlpha: 0, x: side, y: 28 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            ease: "power3.out",
            duration: 0.9,
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          },
        );

        const yearEl = yearRefs.current[i];
        const yearValue = TIMELINE[i]?.year;
        if (yearEl && typeof yearValue === "number") {
          const obj = { v: yearValue - 8 };
          gsap.to(obj, {
            v: yearValue,
            ease: "none",
            scrollTrigger: {
              trigger: entry,
              start: "top 85%",
              end: "top 40%",
              scrub: 0.5,
            },
            onUpdate: () => {
              yearEl.textContent = String(Math.round(obj.v));
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Studio milestones"
      className="relative w-full overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-ink)] py-[clamp(72px,10vh,140px)]"
    >
      <Container>
        <div
          className="flex items-center gap-3"
          style={{ color: "var(--color-gold-deep)" }}
        >
          <span className="h-px w-10 bg-current opacity-60" />
          <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
            Eleven years · A short list
          </span>
        </div>
        <h2
          className="mt-4 font-display"
          style={{
            fontSize: "clamp(36px, 4.8vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
          }}
        >
          The way the studio grew up.
        </h2>

        <div className="relative mt-[clamp(48px,8vh,96px)]">
          {/* Brass vertical rail */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
            style={{ background: "color-mix(in oklab, var(--color-gold) 35%, transparent)" }}
          >
            <div
              ref={railFillRef}
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, var(--color-gold) 0%, var(--color-gold-deep) 100%)",
                transform: "scaleY(0)",
              }}
            />
          </div>

          <ol className="relative flex flex-col gap-[clamp(64px,9vh,128px)]">
            {TIMELINE.map((m, i) => {
              const onLeft = i % 2 === 0;
              return (
                <li key={m.year} className="relative">
                  {/* Brass diamond on the rail */}
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-4 z-[2] block h-3 w-3 -translate-x-1/2 rotate-45 md:left-1/2"
                    style={{
                      background: "var(--color-gold)",
                      boxShadow: "0 0 12px rgba(200,152,96,0.6)",
                    }}
                  />

                  <div
                    ref={collectEntry}
                    className={cn(
                      "grid grid-cols-1 gap-6 pl-14 will-change-transform md:grid-cols-12 md:pl-0",
                    )}
                  >
                    <div
                      className={cn(
                        "md:col-span-6",
                        onLeft ? "md:order-1 md:pr-12 md:text-right" : "md:order-2 md:pl-12",
                      )}
                    >
                      <span
                        ref={collectYear}
                        className="block font-display"
                        style={{
                          fontSize: "clamp(80px, 9vw, 140px)",
                          fontWeight: 200,
                          lineHeight: 0.9,
                          letterSpacing: "-0.02em",
                          color: "var(--color-gold-deep)",
                        }}
                      >
                        {m.year}
                      </span>
                      <h3
                        className="mt-2 font-display"
                        style={{
                          fontSize: "clamp(22px, 2vw, 30px)",
                          fontWeight: 400,
                          lineHeight: 1.1,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {m.title}
                      </h3>
                      <p
                        className="mt-3 max-w-[44ch] md:max-w-none"
                        style={{
                          fontSize: "clamp(14px, 0.95vw, 16px)",
                          lineHeight: 1.65,
                          color: "color-mix(in oklab, var(--color-ink) 75%, transparent)",
                          marginLeft: onLeft ? "auto" : undefined,
                        }}
                      >
                        {m.body}
                      </p>
                    </div>

                    {/* Image with brass corner gilt */}
                    <div
                      className={cn(
                        "md:col-span-6",
                        onLeft ? "md:order-2 md:pl-12" : "md:order-1 md:pr-12",
                      )}
                    >
                      <div className="relative max-w-[420px]" style={{ marginLeft: onLeft ? undefined : "auto", marginRight: onLeft ? "auto" : undefined }}>
                        <div
                          className="relative overflow-hidden rounded-[2px]"
                          style={{ aspectRatio: "4 / 3" }}
                        >
                          <Image
                            src={m.image}
                            alt={`${m.year} — ${m.title}`}
                            fill
                            sizes="(min-width: 768px) 420px, 100vw"
                            className="object-cover"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)",
                            }}
                          />
                        </div>
                        <TimelineCorner className="absolute -left-1.5 -top-1.5 h-7 w-7" />
                        <TimelineCorner className="absolute -right-1.5 -top-1.5 h-7 w-7 rotate-90" />
                        <TimelineCorner className="absolute -left-1.5 -bottom-1.5 h-7 w-7 -rotate-90" />
                        <TimelineCorner className="absolute -right-1.5 -bottom-1.5 h-7 w-7 rotate-180" />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function TimelineCorner({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 14 L1 1 L14 1"
        stroke="var(--color-gold)"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <circle cx="3.5" cy="3.5" r="1.4" fill="var(--color-gold)" />
    </svg>
  );
}
