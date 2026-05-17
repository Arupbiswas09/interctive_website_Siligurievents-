"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { EASE } from "@/lib/gsap/eases";
import { getIllustration } from "@/lib/illustrations/paths";

export type BrassDividerSpinProps = {
  /** Visual height in px; width follows from 240×40 aspect (6×). */
  height?: number;
  /** Spin duration in seconds. Default 1.1. */
  duration?: number;
  /** ScrollTrigger start threshold. Default `top 85%`. */
  start?: string;
  /** Tone applied to the wrapper for `currentColor` cascade. */
  tone?: "ink" | "muted" | "gold" | "brass" | "current";
  /** Wrapper class. */
  className?: string;
  /** Accessible label override. */
  ariaLabel?: string;
};

const toneClass = {
  ink: "text-[color:var(--color-ink)]",
  muted: "text-[color:var(--color-ink-muted)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
} as const;

/**
 * `<BrassDividerSpin>` — section divider whose central medallion rotates a
 * full 360° once on scroll-into-view; the surrounding hairlines draw
 * outward from centre at the same time.
 *
 * Reduced motion: final state immediate, no tween.
 * Recommended placements: between major sections on /about and case studies.
 */
export function BrassDividerSpin({
  height = 40,
  duration = 1.1,
  start = "top 85%",
  tone = "brass",
  className,
  ariaLabel,
}: BrassDividerSpinProps): React.ReactElement {
  const data = getIllustration("brass-divider");
  const label = ariaLabel ?? data.label;
  const titleId = "brass-divider-spin-title";

  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // 240×40 → aspect 6
  const viewBoxParts = data.viewBox.split(" ").map(Number);
  const vbW = viewBoxParts[2] ?? 240;
  const vbH = viewBoxParts[3] ?? 40;
  const aspect = vbW / vbH;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const medallion = svg.querySelectorAll<SVGPathElement>("[data-medallion]");
    const rules = svg.querySelectorAll<SVGPathElement>("[data-rule]");
    const ornaments = svg.querySelectorAll<SVGPathElement>("[data-ornament]");

    if (prefersReducedMotion) {
      gsap.set([medallion, ornaments], { autoAlpha: 1, scale: 1, rotate: 0 });
      gsap.set(rules, { strokeDashoffset: 0 });
      return;
    }

    // Initial state.
    gsap.set(medallion, {
      autoAlpha: 0,
      scale: 0.4,
      rotate: -180,
      transformOrigin: "120px 20px",
    });
    gsap.set(ornaments, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: "center",
    });
    gsap.set(rules, { strokeDasharray: 1, strokeDashoffset: 1 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start, once: true },
      });

      // Medallion enters: fade + scale + 360° rotation (starts -180, ends +180).
      tl.to(medallion, {
        autoAlpha: 1,
        scale: 1,
        rotate: 180,
        duration,
        ease: EASE.brass,
      });
      // Hairlines draw outward from centre at the same time.
      tl.to(
        rules,
        {
          strokeDashoffset: 0,
          duration: duration * 0.9,
          ease: "power2.out",
        },
        "<"
      );
      // Bookend brass dots pop in just after the lines reach them.
      tl.to(
        ornaments,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.32,
          stagger: 0.05,
          ease: "back.out(2)",
        },
        `-=${duration * 0.3}`
      );
    }, svg);

    return (): void => {
      ctx.revert();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === svg)
        .forEach((t) => t.kill());
    };
  }, [duration, start, prefersReducedMotion]);

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${height * aspect}px`,
    maxWidth: "100%",
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
          const key = `divider-${idx}`;
          const dataAttrs: Record<string, string> = {};
          if (layer.role === "medallion") dataAttrs["data-medallion"] = "";
          if (layer.role === "rule") dataAttrs["data-rule"] = "";
          if (layer.role === "ornament") dataAttrs["data-ornament"] = "";

          if (layer.strokeOnly) {
            return (
              <path
                key={key}
                d={layer.d}
                pathLength={1}
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
