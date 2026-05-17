"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { aspectRatioToCss, type DecorPair } from "@/lib/cms/decor-pairs";
import { useDecorSwitcher } from "./decor-switcher-context";

type DecorPairCardProps = {
  pair: DecorPair;
  /**
   * Position in the grid — used by the parent to compute the
   * 60ms staggered sweep. The card uses it to delay its own
   * crossfade timeline.
   */
  index: number;
  /**
   * Stagger delay in seconds applied on top of index * baseDelay.
   * The parent passes 0; we compute the per-card delay locally so
   * the parent doesn't need to micro-orchestrate.
   */
  staggerStep?: number;
  /** `(min-width: …) Npx` etc. — passed to next/image. */
  sizes?: string;
  className?: string;
};

const DEFAULT_STAGGER_STEP = 0.06; // 60ms per docs §M.

/**
 * DecorPairCard
 *
 * Stacks the DAY and NIGHT versions of a single composition.
 *
 * - Both images are absolutely positioned in the wrapper; the wrapper
 *   has the card's aspect ratio.
 * - Crossfade is driven by `mode` from context.
 * - Fade-out current = 0.4s, fade-in next = 0.8s (overlapping),
 *   delayed by `index * staggerStep` to create the grid sweep.
 * - On the day→night transition we briefly bump saturation + brightness
 *   on the night image to suggest "candles igniting" before settling.
 * - Reduced motion: instant swap, no timeline.
 */
export function DecorPairCard({
  pair,
  index,
  staggerStep = DEFAULT_STAGGER_STEP,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: DecorPairCardProps): React.ReactElement {
  const { mode, isHydrated } = useDecorSwitcher();
  const prefersReducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dayRef = useRef<HTMLDivElement | null>(null);
  const nightRef = useRef<HTMLDivElement | null>(null);
  // Track the previous mode so we know which way to transition.
  const prevModeRef = useRef<typeof mode | null>(null);

  useEffect(() => {
    const day = dayRef.current;
    const night = nightRef.current;
    if (!day || !night) return;

    // First render — set initial visibility without animation.
    if (prevModeRef.current === null) {
      gsap.set(day, { autoAlpha: mode === "day" ? 1 : 0 });
      gsap.set(night, { autoAlpha: mode === "night" ? 1 : 0, filter: "saturate(1) brightness(1)" });
      prevModeRef.current = mode;
      return;
    }

    // Reduced motion: instant swap.
    if (prefersReducedMotion) {
      gsap.set(day, { autoAlpha: mode === "day" ? 1 : 0 });
      gsap.set(night, { autoAlpha: mode === "night" ? 1 : 0 });
      prevModeRef.current = mode;
      return;
    }

    const goingToNight = mode === "night";
    const delay = index * staggerStep;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay });

      if (goingToNight) {
        // Fade DAY out, fade NIGHT in with a brief ignite flash.
        tl.to(day, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0);
        tl.fromTo(
          night,
          { autoAlpha: 0, filter: "saturate(1.25) brightness(1.18)" },
          {
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          0.05,
        );
        tl.to(
          night,
          {
            filter: "saturate(1) brightness(1)",
            duration: 0.7,
            ease: "power2.out",
          },
          0.5,
        );
      } else {
        // Fade NIGHT out, fade DAY in — softer, no ignite flash on the way back.
        tl.to(night, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0);
        tl.fromTo(
          day,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          0.05,
        );
      }
    }, rootRef);

    prevModeRef.current = mode;

    return (): void => {
      ctx.revert();
    };
  }, [mode, prefersReducedMotion, index, staggerStep]);

  return (
    <figure
      ref={rootRef}
      data-pair-id={pair.pairId}
      data-mode={isHydrated ? mode : "day"}
      className={cn(
        "group relative isolate overflow-hidden rounded-[6px]",
        "bg-[color:var(--color-bg-elevated)]",
        "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]",
        className,
      )}
      style={{ aspectRatio: aspectRatioToCss(pair.aspectRatio) }}
    >
      {/* DAY layer */}
      <div
        ref={dayRef}
        className="absolute inset-0"
        // Initial visibility is set imperatively in the effect (SSR-safe default
        // matches first-render expectations: day is visible).
        style={{ opacity: 1 }}
        aria-hidden={mode === "night"}
      >
        <Image
          src={pair.dayImageSrc}
          alt={`${pair.caption} — daylight`}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={pair.blurDataURL}
          className="object-cover"
        />
      </div>

      {/* NIGHT layer */}
      <div
        ref={nightRef}
        className="absolute inset-0"
        style={{ opacity: 0 }}
        aria-hidden={mode === "day"}
      >
        <Image
          src={pair.nightImageSrc}
          alt={`${pair.caption} — after dark`}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={pair.blurDataURL}
          className="object-cover"
        />
      </div>

      {/* Caption */}
      <figcaption
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10",
          "px-[var(--space-4)] py-[var(--space-3)]",
          "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
          "font-medium text-white",
          "bg-gradient-to-t from-black/55 to-transparent",
        )}
      >
        {pair.caption}
      </figcaption>
    </figure>
  );
}
