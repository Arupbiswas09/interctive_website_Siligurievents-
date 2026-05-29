"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

// Parallel-agent factory — masked reveal (MO-08) for the map illustration.
import { maskedReveal } from "@/lib/gsap/scroll-triggers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * H7 — Locations served (docs/05-PAGE-SPECS.md §5.1 H7).
 *
 * A stylised region-map of North Bengal + the eastern Himalayan belt.
 * Pins fade in sequentially on scroll-into-view; the map outline reveals
 * via `maskedReveal` from the left edge.
 *
 * The map is a lightweight inline SVG so we never block on a network
 * fetch. Real `MAP-01` illustration drops in via Gemini in Sprint 3.
 */

type Pin = {
  slug: string;
  label: string;
  /**
   * Real lat/lng. We project equirectangularly inside the SVG viewBox so
   * pin positions are geographically accurate relative to each other.
   */
  lat: number;
  lng: number;
  /** Optional label-anchor adjustment so text doesn't collide with the pin. */
  labelOffsetX?: number;
  labelOffsetY?: number;
};

const PINS: ReadonlyArray<Pin> = [
  // Anchor — the studio sits in Siliguri (Darjeeling More).
  { slug: "siliguri", label: "Siliguri", lat: 26.7271, lng: 88.3953 },
  { slug: "bagdogra", label: "Bagdogra", lat: 26.7022, lng: 88.3170, labelOffsetY: 4 },
  { slug: "darjeeling", label: "Darjeeling", lat: 27.041, lng: 88.2663 },
  { slug: "kalimpong", label: "Kalimpong", lat: 27.0594, lng: 88.4719 },
  { slug: "jalpaiguri", label: "Jalpaiguri", lat: 26.5237, lng: 88.7239 },
  { slug: "gangtok", label: "Gangtok", lat: 27.3389, lng: 88.6065 },
  // Rangpo — the Sikkim/West Bengal road border.
  { slug: "sikkim-border", label: "Sikkim border", lat: 27.182, lng: 88.546 },
  // Lataguri — gateway to the Dooars tea estates.
  { slug: "dooars", label: "Dooars", lat: 26.8347, lng: 88.7242 },
];

// BBox of the projected region. Hand-tuned to give pins ~5% margin on all
// edges of the SVG viewBox so labels don't get clipped.
const BBOX = { latMin: 26.40, latMax: 27.45, lngMin: 88.10, lngMax: 88.95 } as const;
const VIEW = { w: 100, h: 60 } as const;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * VIEW.w;
  // Invert Y because SVG y=0 is top, lat increases northward.
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * VIEW.h;
  return { x, y };
}

export function HomeLocationsServed(): React.ReactElement {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Masked reveal for the map illustration. Returns Cleanup (a function).
    const cleanupMask = maskedReveal({
      target: map,
      from: "left",
      start: "top 80%",
      once: true,
    });

    // Sequential pin fade-in — own gsap.context for tidy revert.
    const ctx = gsap.context(() => {
      const pins = map.querySelectorAll<SVGGElement>("[data-pin]");
      if (pins.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(pins, { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(pins, { opacity: 0, scale: 0.6, transformOrigin: "50% 100%" });
      gsap.to(pins, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.12,
        scrollTrigger: { trigger: map, start: "top 75%", once: true },
      });
    }, map);

    return (): void => {
      ctx.revert();
      cleanupMask();
    };
  }, [prefersReducedMotion]);

  return (
    <Section as="section" tone="elevated" spacing="lg" id="home-locations">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12">
          <div className="flex flex-col gap-[var(--space-4)] md:col-span-5">
            <RevealOnScroll>
              <Eyebrow tone="accent">Where we travel</Eyebrow>
            </RevealOnScroll>
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="From a Siliguri courtyard to a Darjeeling tea estate."
              className="max-w-[20ch]"
            />
            <RevealOnScroll delay={0.2}>
              <p className="max-w-[55ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: CMS — SiteSettings.locationsBlurb */}
                We travel across Siliguri, Bagdogra, Darjeeling, Kalimpong,
                Jalpaiguri, the Sikkim border and the Dooars tea estates — and
                beyond, on request.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <ul className="mt-[var(--space-4)] flex flex-wrap gap-x-[var(--space-4)] gap-y-[var(--space-2)] text-[length:var(--text-sm)] text-[color:var(--color-ink)]">
                {PINS.map((p) => (
                  <li
                    key={p.slug}
                    className="border-b border-dotted border-[color:var(--color-border)] pb-[2px]"
                  >
                    {p.label}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>

          <div
            ref={mapRef}
            data-masked-reveal-root=""
            className="md:col-span-7"
          >
            <RegionMap pins={PINS} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * RegionMap — North Bengal & East Sikkim belt.
 *
 * Pin coordinates are projected from real lat/lng so they sit in their
 * correct relative positions:
 *   • Siliguri anchors the centre-south
 *   • Bagdogra sits just SW of Siliguri (10 km, the airport)
 *   • Darjeeling NW (up the hill, ~70 km)
 *   • Kalimpong NE (~50 km)
 *   • Gangtok far north (Sikkim, ~115 km)
 *   • Rangpo border south of Gangtok on the same axis
 *   • Jalpaiguri E (~45 km)
 *   • Dooars (Lataguri) E of Siliguri, S of Kalimpong
 *
 * The outline approximates the rough geographic envelope: a thin southern
 * plain (Dooars belt) sweeping up into the Himalayan crescent through
 * Darjeeling–Kalimpong–Gangtok. The Teesta line traces the real river
 * path: born at Cholamu (Sikkim) → south through Rangpo → past Kalimpong
 * & Siliguri → into the Brahmaputra (off-frame).
 */
function RegionMap({ pins }: { pins: ReadonlyArray<Pin> }): React.ReactElement {
  // Pre-project pin positions.
  const projected = pins.map((p) => ({ ...p, ...project(p.lat, p.lng) }));

  return (
    <svg
      viewBox="0 0 100 60"
      role="img"
      aria-labelledby="home-map-title"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="home-map-title">North Bengal &amp; East Sikkim — service region</title>

      {/* Background plate. */}
      <rect x="0" y="0" width="100" height="60" fill="var(--color-bg)" opacity="0.4" />

      {/*
        Himalayan crescent (north arc) — abstract outline of the foothills
        from west (Darjeeling/Mirik area) through Kalimpong to Gangtok.
      */}
      <path
        d="M 8 26
           Q 18 12 30 20
           Q 42 6 60 8
           Q 72 4 84 12
           Q 90 18 92 26"
        fill="none"
        stroke="var(--color-ink-muted)"
        strokeWidth="0.4"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/*
        Dooars/Terai plain (south arc) — the flat tea-belt below the hills.
      */}
      <path
        d="M 6 52
           Q 22 56 40 54
           Q 60 52 80 56
           Q 90 56 94 52"
        fill="none"
        stroke="var(--color-ink-muted)"
        strokeWidth="0.4"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/*
        Teesta river — descends from Sikkim (top, near Gangtok), past
        Rangpo, between Darjeeling & Kalimpong, through Siliguri, then
        southeast into the Dooars. Single calm bezier.
      */}
      <path
        d="M 60 6 Q 56 14 50 18 Q 42 26 38 38 Q 40 48 50 54"
        fill="none"
        stroke="var(--color-cool)"
        strokeWidth="0.35"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* International boundary hint (Sikkim/WB) — dotted west of Rangpo. */}
      <path
        d="M 16 18 Q 28 18 44 16"
        fill="none"
        stroke="var(--color-ink-muted)"
        strokeWidth="0.25"
        strokeDasharray="0.6 0.9"
        opacity="0.4"
      />

      {/* Pins. */}
      {projected.map((p) => {
        const labelDx = p.labelOffsetX ?? 2.2;
        const labelDy = p.labelOffsetY ?? 0.6;
        const isAnchor = p.slug === "siliguri";
        return (
          <g key={p.slug} data-pin data-slug={p.slug}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isAnchor ? 1.4 : 0.95}
              fill="var(--color-accent)"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={isAnchor ? 3.2 : 2.2}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.25"
              opacity={isAnchor ? 0.7 : 0.45}
            />
            {isAnchor ? (
              <circle
                cx={p.x}
                cy={p.y}
                r={4.6}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.18"
                opacity={0.3}
              />
            ) : null}
            <text
              x={p.x + labelDx}
              y={p.y + labelDy}
              fontSize={isAnchor ? 2.4 : 2}
              fontFamily="var(--font-body, Inter)"
              fontWeight={isAnchor ? 600 : 400}
              fill="var(--color-ink)"
              style={{ paintOrder: "stroke" }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
