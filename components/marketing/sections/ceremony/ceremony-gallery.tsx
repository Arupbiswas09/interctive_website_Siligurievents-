"use client";

/**
 * CeremonyGallery — asymmetric editorial masonry for a ceremony's gallery.
 *
 * Layout is a 12-col CSS grid with one large feature tile and five companion
 * tiles. The feature tile uses ParallaxStack (cursor depth + scroll tilt);
 * companion tiles use SplitImage on hover (3-panel horizontal fan).
 *
 * Each tile carries a brass mandala corner and a "Room — Stage N" caption
 * that slides up from the bottom on hover. The section closes with the
 * optional `theme.closingMantra` rendered HUGE in Allura with a scroll-scrub
 * opacity + y-lift reveal.
 *
 * Reduced-motion: skip closing-mantra scrub. Tile effects already gate
 * internally via their own reduced-motion guards.
 */

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { SplitImage } from "@/components/effects/3d-split-image";
import { ParallaxStack } from "@/components/effects/3d-parallax-stack";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type CeremonyGalleryProps = {
  theme: CeremonyTheme;
};

// Roman numerals for stage captions, capped at the gallery length we support.
const STAGE_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"] as const;

// Tile slot definitions for up to 6 images. Index 0 is the feature.
type TileSlot = {
  /** Tailwind grid spans for the desktop layout. */
  className: string;
  /** Min-height range for the tile so the masonry stays sculpted. */
  minHeight: string;
  /** next/image width hint. */
  width: number;
  /** next/image height hint. */
  height: number;
};

const TILE_SLOTS: ReadonlyArray<TileSlot> = [
  {
    className: "md:col-span-7 md:row-span-2",
    minHeight: "min-h-[420px] md:min-h-[520px]",
    width: 1600,
    height: 1100,
  },
  {
    className: "md:col-span-5 md:row-span-1",
    minHeight: "min-h-[280px] md:min-h-[300px]",
    width: 1200,
    height: 800,
  },
  {
    className: "md:col-span-5 md:row-span-1",
    minHeight: "min-h-[280px] md:min-h-[300px]",
    width: 1200,
    height: 800,
  },
  {
    className: "md:col-span-4 md:row-span-1",
    minHeight: "min-h-[280px] md:min-h-[320px]",
    width: 1000,
    height: 800,
  },
  {
    className: "md:col-span-4 md:row-span-1",
    minHeight: "min-h-[280px] md:min-h-[320px]",
    width: 1000,
    height: 800,
  },
  {
    className: "md:col-span-4 md:row-span-1",
    minHeight: "min-h-[280px] md:min-h-[320px]",
    width: 1000,
    height: 800,
  },
];

export function CeremonyGallery({
  theme,
}: CeremonyGalleryProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mantraRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { palette } = theme;

  // Cap gallery to the slots we support (6). Theme allows 4–8; extras drop.
  const tiles = useMemo(
    () => theme.gallery.slice(0, TILE_SLOTS.length),
    [theme.gallery],
  );

  // Section heading: take the first 5 words of the closing mantra, else fallback.
  const headingTail = useMemo<string>(() => {
    if (theme.closingMantra) {
      const words = theme.closingMantra
        .replace(/[.,;:!?—–-]+$/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 5);
      if (words.length > 0) return words.join(" ");
    }
    return "Designed like film stills";
  }, [theme.closingMantra]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const mantra = mantraRef.current;
    if (!mantra) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mantra,
        { autoAlpha: 0.2, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: mantra,
            start: "top 90%",
            end: "top 40%",
            scrub: 0.8,
          },
        },
      );
    }, sectionRef);

    return (): void => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label={`${theme.slug} — gallery`}
      className="relative isolate overflow-hidden py-24 md:py-32"
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
      }}
    >
      <Container>
        {/* ── Eyebrow + heading ── */}
        <div
          className="flex items-center gap-3"
          style={{ color: palette.goldDeep }}
        >
          <span
            aria-hidden="true"
            className="h-px w-10"
            style={{ backgroundColor: palette.gold }}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.32em]">
            The gallery
          </span>
        </div>

        <h2
          className="font-display mt-6"
          style={{
            color: palette.ink,
            fontSize: "clamp(34px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            maxWidth: "22ch",
          }}
        >
          Selected rooms{" "}
          <span
            aria-hidden="true"
            className="font-display"
            style={{ color: palette.gold }}
          >
            ·
          </span>{" "}
          <span className="italic" style={{ color: palette.goldDeep }}>
            {headingTail}
          </span>
        </h2>

        {/* ── Gallery grid ── */}
        <div
          className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-12 md:gap-5 md:auto-rows-[260px] lg:auto-rows-[300px]"
        >
          {tiles.map((src, i) => {
            const slot = TILE_SLOTS[i] ?? TILE_SLOTS[TILE_SLOTS.length - 1];
            if (!slot) return null;
            const stageLabel = `Room — Stage ${STAGE_ROMAN[i] ?? i + 1}`;
            const isFeature = i === 0;

            return (
              <figure
                key={`${src}-${i}`}
                className={cn(
                  "group relative col-span-1 overflow-hidden rounded-[2px]",
                  slot.className,
                  slot.minHeight,
                )}
                style={{
                  backgroundColor: palette.bgSoft,
                  boxShadow: `0 24px 60px -28px ${palette.goldDeep}66`,
                }}
              >
                {/* Image surface */}
                {isFeature ? (
                  <ParallaxStack
                    perspective={1200}
                    travel={24}
                    className="absolute inset-0 h-full w-full"
                    layers={[
                      {
                        src,
                        alt: stageLabel,
                        depth: 0.35,
                        width: slot.width,
                        height: slot.height,
                      },
                      {
                        src,
                        alt: "",
                        depth: 0.85,
                        width: slot.width,
                        height: slot.height,
                        className: "mix-blend-soft-light opacity-40",
                      },
                    ]}
                  />
                ) : (
                  <SplitImage
                    src={src}
                    alt={stageLabel}
                    panels={3}
                    axis="horizontal"
                    trigger="hover"
                    width={slot.width}
                    height={slot.height}
                    className="absolute inset-0 h-full w-full"
                  />
                )}

                {/* Bottom-edge vignette so caption reads on any image */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-2/5",
                    "opacity-0 transition-opacity duration-500 ease-out",
                    "group-hover:opacity-100 group-focus-within:opacity-100",
                  )}
                  style={{
                    background: `linear-gradient(180deg, ${palette.ink}00 0%, ${palette.ink}99 100%)`,
                  }}
                />

                {/* Brass corner ornament */}
                <CeremonyOrnament
                  name="mandala"
                  hue={palette.gold}
                  className="pointer-events-none absolute top-3 right-3 z-[2] h-8 w-8 opacity-70"
                />

                {/* Caption — slides up on hover/focus */}
                <figcaption
                  className={cn(
                    "pointer-events-none absolute bottom-4 left-4 z-[2]",
                    "translate-y-3 opacity-0 transition-all duration-500 ease-out",
                    "group-hover:translate-y-0 group-hover:opacity-100",
                    "group-focus-within:translate-y-0 group-focus-within:opacity-100",
                  )}
                >
                  <span
                    className="font-display block text-[14px] italic"
                    style={{ color: palette.bg, letterSpacing: "0.01em" }}
                  >
                    {stageLabel}
                  </span>
                </figcaption>

                {/* Accessible non-hover fallback — visually hidden image alt
                    is already provided by SplitImage/ParallaxStack. We still
                    render a hidden <Image> for `loading=lazy` priming on
                    very small viewports where masonry collapses to 1 col. */}
                <noscript>
                  <Image
                    src={src}
                    alt={stageLabel}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </noscript>
              </figure>
            );
          })}
        </div>

        {/* ── Closing mantra — huge Allura ── */}
        {theme.closingMantra ? (
          <p
            ref={mantraRef}
            className="font-script mx-auto mt-24 text-center md:mt-32"
            style={{
              color: palette.accent,
              fontSize: "clamp(40px, 8vw, 96px)",
              lineHeight: 1.05,
              maxWidth: "22ch",
              willChange: "transform, opacity",
            }}
          >
            {theme.closingMantra}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
