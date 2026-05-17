"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { LetterformId } from "@/lib/devanagari/letterforms";
import { DevanagariAccent } from "./devanagari-accent";

/**
 * Item in the marquee. Either a Latin label, a Devanagari text string
 * (rendered with `lang="hi"` so font fallback + script-scale rules apply),
 * or a stylised SVG accent from the letterform library.
 */
export type ScriptMarqueeItem =
  | { kind: "latin"; text: string }
  | { kind: "devanagari"; text: string; transliteration?: string }
  | { kind: "accent"; glyph: LetterformId; label?: string };

export type ScriptMarqueeProps = {
  /** Ordered items that compose the marquee strip. */
  items: ReadonlyArray<ScriptMarqueeItem>;
  /** Seconds per full loop. Lower is faster. */
  speed?: number;
  /** Reverse the scroll direction. */
  reverse?: boolean;
  /** Pause animation when cursor enters. */
  pauseOnHover?: boolean;
  /** Size of the type and accents. */
  size?: "sm" | "md" | "lg";
  /** Tone of the Devanagari accents within the strip. */
  accentTone?: "ink" | "muted" | "gold" | "brass" | "current";
  className?: string;
};

const textSizeClass: Record<NonNullable<ScriptMarqueeProps["size"]>, string> = {
  sm: "text-[length:var(--text-2xl)]",
  md: "text-[length:var(--text-3xl)]",
  lg: "text-[length:var(--text-4xl)]",
};

const accentSizeMap: Record<
  NonNullable<ScriptMarqueeProps["size"]>,
  "sm" | "md" | "lg"
> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

/**
 * `<ScriptMarquee>` — horizontally-scrolling editorial strip that mixes
 * Latin event names with Devanagari counterparts.
 *
 * Renders Devanagari text inside `<span lang="hi">` so:
 *  • Browser falls back to the loaded Devanagari font (Noto Serif Devanagari).
 *  • Per-locale CSS rules (e.g. `--type-script-scale`) apply naturally.
 *  • Screen readers announce the script correctly.
 *
 * Accent items use stylised SVG letterforms — the brass-foil moments.
 *
 * @example
 * <ScriptMarquee
 *   items={[
 *     { kind: "latin", text: "Weddings" },
 *     { kind: "devanagari", text: "विवाह", transliteration: "Vivah" },
 *     { kind: "accent", glyph: "om-mark" },
 *     { kind: "latin", text: "Sangeet" },
 *     { kind: "devanagari", text: "संगीत", transliteration: "Sangeet" },
 *     { kind: "accent", glyph: "swastika-mark" },
 *   ]}
 * />
 */
export function ScriptMarquee({
  items,
  speed = 36,
  reverse = false,
  pauseOnHover = true,
  size = "md",
  accentTone = "gold",
  className,
}: ScriptMarqueeProps): React.ReactElement {
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

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: reverse ? 50 : -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
      setReady(true);

      if (pauseOnHover) {
        const onEnter = (): void => {
          gsap.to(tween, { timeScale: 0, duration: 0.4 });
        };
        const onLeave = (): void => {
          gsap.to(tween, { timeScale: 1, duration: 0.4 });
        };
        track.addEventListener("mouseenter", onEnter);
        track.addEventListener("mouseleave", onLeave);
        return (): void => {
          track.removeEventListener("mouseenter", onEnter);
          track.removeEventListener("mouseleave", onLeave);
        };
      }
    }, track);

    return (): void => {
      ctx.revert();
    };
  }, [speed, reverse, pauseOnHover, prefersReducedMotion]);

  const renderItem = (item: ScriptMarqueeItem, idx: number): React.ReactNode => {
    const key = `${item.kind}-${idx}`;
    switch (item.kind) {
      case "latin":
        return (
          <span
            key={key}
            className={cn(
              "px-[var(--space-8)] font-display",
              textSizeClass[size]
            )}
          >
            {item.text}
          </span>
        );
      case "devanagari":
        return (
          <span
            key={key}
            lang="hi"
            className={cn(
              "font-devanagari-display px-[var(--space-8)]",
              textSizeClass[size],
              "text-[color:var(--color-gold)]"
            )}
            aria-label={item.transliteration}
          >
            {item.text}
          </span>
        );
      case "accent":
        return (
          <span
            key={key}
            className="px-[var(--space-6)] inline-flex items-center"
          >
            <DevanagariAccent
              glyph={item.glyph}
              size={accentSizeMap[size]}
              tone={accentTone}
              ariaLabel={item.label}
            />
          </span>
        );
    }
  };

  const renderTrack = (label: string): React.ReactElement => (
    <div
      key={label}
      className="flex shrink-0 items-center"
      aria-hidden={label === "duplicate"}
    >
      {items.map(renderItem)}
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "border-y border-[color:var(--color-border)]",
        "py-[var(--space-4)]",
        className
      )}
      data-ready={ready}
      role="group"
      aria-label="Event types we stage"
    >
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap will-change-transform"
      >
        {renderTrack("primary")}
        {renderTrack("duplicate")}
      </div>
    </div>
  );
}
