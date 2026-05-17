"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getIllustration } from "@/lib/illustrations/paths";

export type RegionPinRevealHandle = {
  /** Replay the drop + bloom. */
  replay: () => void;
};

export type RegionPinRevealProps = {
  /** Visual height in px; width follows from 60×80 aspect (0.75×). */
  size?: number;
  /** Drop distance in px (offset above resting position). Default 56. */
  dropFrom?: number;
  /** Trigger on scroll-into-view (true) or autoplay on mount (false). Default true. */
  triggerOnScroll?: boolean;
  /** ScrollTrigger start threshold. Default `top 85%`. */
  start?: string;
  /** Imperative handle for replay. */
  handleRef?: React.Ref<RegionPinRevealHandle>;
  /** Tone applied to the wrapper for `currentColor` cascade. */
  tone?: "ink" | "gold" | "brass" | "current" | "accent";
  /** Wrapper class. */
  className?: string;
  /** Accessible label override. */
  ariaLabel?: string;
};

const toneClass = {
  ink: "text-[color:var(--color-ink)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  accent: "text-[color:var(--color-accent)]",
  current: "text-current",
} as const;

/**
 * `<RegionPinReveal>` — a teardrop region pin drops in from above with a
 * slight back-ease overshoot bounce, then the small jasmine bloom inside
 * unfurls petal-by-petal.
 *
 * Sequence:
 *  1. Shadow pre-renders subtle (compressed) under the resting position.
 *  2. Pin drops -dropFrom → 0 (Y), back.out(1.6), 0.8s.
 *     Shadow scales 0.5 → 1 in parallel (squash-bounce read).
 *  3. After 80ms, inner jasmine petals scale-stagger 0 → 1, 80ms each,
 *     stamen pops in last.
 *
 * Reduced motion: final state immediate, no tween.
 */
export function RegionPinReveal({
  size = 80,
  dropFrom = 56,
  triggerOnScroll = true,
  start = "top 85%",
  handleRef,
  tone = "accent",
  className,
  ariaLabel,
}: RegionPinRevealProps): React.ReactElement {
  const data = getIllustration("region-pin");
  const label = ariaLabel ?? data.label;
  const titleId = "region-pin-reveal-title";

  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const play = useRef<() => void>(() => undefined);

  useImperativeHandle(
    handleRef,
    () => ({
      replay: () => play.current(),
    }),
    []
  );

  // 60×80 → aspect 0.75
  const viewBoxParts = data.viewBox.split(" ").map(Number);
  const vbW = viewBoxParts[2] ?? 60;
  const vbH = viewBoxParts[3] ?? 80;
  const aspect = vbW / vbH;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pinBody = svg.querySelectorAll<SVGPathElement>("[data-pin]");
    const petals = svg.querySelectorAll<SVGPathElement>("[data-petal]");
    const stamen = svg.querySelectorAll<SVGPathElement>("[data-stamen]");
    const shadow = svg.querySelectorAll<SVGPathElement>("[data-shadow]");

    if (prefersReducedMotion) {
      gsap.set([pinBody, shadow], { autoAlpha: 1, y: 0, scaleX: 1 });
      gsap.set(petals, { autoAlpha: 1, scale: 1 });
      gsap.set(stamen, { autoAlpha: 1, scale: 1 });
      return;
    }

    const setInitial = (): void => {
      gsap.set(pinBody, { autoAlpha: 1, y: -dropFrom });
      gsap.set(shadow, { autoAlpha: 0.18, scaleX: 0.5, transformOrigin: "30px 76px" });
      gsap.set(petals, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: "30px 28px",
      });
      gsap.set(stamen, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: "30px 28px",
      });
    };
    setInitial();

    const buildTimeline = (): gsap.core.Timeline => {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: triggerOnScroll
          ? { trigger: svg, start, once: true }
          : undefined,
      });
      // Step 1 — pin drops + shadow spreads.
      tl.to(pinBody, {
        y: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
      });
      tl.to(
        shadow,
        {
          scaleX: 1,
          autoAlpha: 0.22,
          duration: 0.8,
          ease: "power2.out",
        },
        "<"
      );
      // Step 2 — petals stagger in.
      tl.to(
        petals,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.4)",
        },
        "-=0.15"
      );
      // Step 3 — stamen pop.
      tl.to(
        stamen,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.25,
          ease: "back.out(2.4)",
        },
        "-=0.1"
      );
      return tl;
    };

    let tl = buildTimeline();
    if (!triggerOnScroll) tl.play(0);

    const ctx = gsap.context(() => {
      // ctx scope — captures the timeline created above.
    }, svg);

    play.current = (): void => {
      tl.kill();
      setInitial();
      tl = buildTimeline();
      tl.play(0);
    };

    return (): void => {
      tl.kill();
      ctx.revert();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === svg)
        .forEach((t) => t.kill());
      play.current = (): void => undefined;
    };
  }, [dropFrom, triggerOnScroll, start, prefersReducedMotion]);

  const style: CSSProperties = {
    height: `${size}px`,
    width: `${size * aspect}px`,
  };

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-labelledby={titleId}
      viewBox={data.viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      className={cn(
        "inline-block shrink-0 align-middle",
        toneClass[tone],
        className
      )}
    >
      <title id={titleId}>{label}</title>
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {data.layers.map((layer, idx) => {
          const key = `pin-${idx}`;
          // First layer is the ground shadow. Detect via index AND role.
          const isShadow = idx === 0 && layer.role === "ornament";
          const dataAttrs: Record<string, string> = {};
          if (isShadow) dataAttrs["data-shadow"] = "";
          else if (layer.role === "pin") dataAttrs["data-pin"] = "";
          else if (layer.role === "petal") dataAttrs["data-petal"] = "";
          else if (layer.role === "stamen") dataAttrs["data-stamen"] = "";
          else dataAttrs["data-pin"] = ""; // anything else rides with the pin

          if (layer.strokeOnly) {
            return (
              <path
                key={key}
                d={layer.d}
                fill="none"
                stroke={layer.fill ?? "currentColor"}
                strokeWidth={layer.strokeWidth ?? 2}
                opacity={layer.opacity ?? 1}
                vectorEffect="non-scaling-stroke"
                {...dataAttrs}
              />
            );
          }
          return (
            <path
              key={key}
              d={layer.d}
              fill={layer.fill ?? "currentColor"}
              stroke="none"
              opacity={layer.opacity ?? 1}
              {...dataAttrs}
            />
          );
        })}
      </g>
    </svg>
  );
}
