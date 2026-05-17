"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getIllustration } from "@/lib/illustrations/paths";

export type MehendiDrawProps = {
  /** Visual height in px; width follows from 240×100 aspect (typically 2.4×). */
  height?: number;
  /** Tone applied to the wrapper for `currentColor` cascade. */
  tone?: "ink" | "muted" | "gold" | "brass" | "current";
  /** Total tendril-draw duration in seconds. Default 2.2. */
  duration?: number;
  /** Delay after tendril completes before leaves/florals fade in. Default 0.4. */
  ornamentDelay?: number;
  /** ScrollTrigger start threshold. Default `top 80%`. */
  start?: string;
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
 * `<MehendiDraw>` — the mehendi tendril draws itself on scroll-into-view.
 *
 * Sequence (ceremonial pace, very deliberate):
 *  1. Tendril spine + sub-tendrils draw via stroke-dashoffset 1 → 0
 *     over `duration` seconds with `power3.inOut`.
 *  2. After completion + `ornamentDelay`, leaves fade & scale in (small
 *     stagger between them).
 *  3. Florals fade in last, slightly slower than the leaves.
 *
 * Reduced motion: final state immediate, no tween.
 * ScrollTrigger fires once.
 */
export function MehendiDraw({
  height = 80,
  tone = "gold",
  duration = 2.2,
  ornamentDelay = 0.4,
  start = "top 80%",
  className,
  ariaLabel,
}: MehendiDrawProps): React.ReactElement {
  const data = getIllustration("mehendi-tendril");
  const label = ariaLabel ?? data.label;
  const titleId = "mehendi-draw-title";

  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // 240×100 → aspect 2.4
  const viewBoxParts = data.viewBox.split(" ").map(Number);
  const vbW = viewBoxParts[2] ?? 240;
  const vbH = viewBoxParts[3] ?? 100;
  const aspect = vbW / vbH;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const tendrils = svg.querySelectorAll<SVGPathElement>("[data-tendril]");
    const leaves = svg.querySelectorAll<SVGPathElement>("[data-leaf]");
    const florals = svg.querySelectorAll<SVGPathElement>("[data-floral]");
    const ornaments = svg.querySelectorAll<SVGPathElement>("[data-ornament]");

    if (prefersReducedMotion) {
      gsap.set(tendrils, { strokeDashoffset: 0 });
      gsap.set([leaves, florals, ornaments], { autoAlpha: 1, scale: 1 });
      return;
    }

    // Initial state — tendrils invisible (dashed-out), ornaments hidden.
    gsap.set(tendrils, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(leaves, { autoAlpha: 0, scale: 0.5, transformOrigin: "center" });
    gsap.set(florals, { autoAlpha: 0, scale: 0.6, transformOrigin: "center" });
    gsap.set(ornaments, { autoAlpha: 0, scale: 0.5, transformOrigin: "center" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start,
          once: true,
        },
      });

      // Step 1 — tendril draws (main spine first, then sub-tendrils slightly behind).
      tl.to(tendrils[0] ?? null, {
        strokeDashoffset: 0,
        duration,
        ease: "power3.inOut",
      });
      // Sub-tendrils stagger in, finishing as the main spine settles.
      const subs = Array.from(tendrils).slice(1);
      if (subs.length > 0) {
        tl.to(
          subs,
          {
            strokeDashoffset: 0,
            duration: duration * 0.4,
            stagger: duration * 0.08,
            ease: "power2.out",
          },
          `-=${duration * 0.55}`
        );
      }
      // Bookend brass dots — pop in at the same time as the spine completes.
      if (ornaments.length > 0) {
        tl.to(
          ornaments,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
            stagger: 0.06,
          },
          `-=${duration * 0.2}`
        );
      }
      // Step 2 — pause, then leaves fade + scale in.
      tl.to(
        leaves,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.6)",
          stagger: 0.12,
        },
        `+=${ornamentDelay}`
      );
      // Step 3 — florals last, slower.
      tl.to(
        florals,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          stagger: 0.18,
        },
        "-=0.2"
      );
    }, svg);

    return (): void => {
      ctx.revert();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === svg)
        .forEach((t) => t.kill());
    };
  }, [duration, ornamentDelay, start, prefersReducedMotion]);

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${height * aspect}px`,
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
          const key = `mehendi-${idx}`;
          const dataAttrs: Record<string, string> = {};
          if (layer.role === "tendril") dataAttrs["data-tendril"] = "";
          if (layer.role === "leaf") dataAttrs["data-leaf"] = "";
          if (layer.role === "floral") dataAttrs["data-floral"] = "";
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
