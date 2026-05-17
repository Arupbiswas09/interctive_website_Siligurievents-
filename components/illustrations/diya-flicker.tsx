"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getIllustration } from "@/lib/illustrations/paths";

export type DiyaFlickerProps = {
  /** Visual size — height in px; width follows from aspect (square). */
  size?: number;
  /** Tone applied to the wrapper for `currentColor` cascade. */
  tone?: "ink" | "gold" | "brass" | "current";
  /** Wrapper class. */
  className?: string;
  /** Accessible label override. */
  ariaLabel?: string;
};

const toneClass = {
  ink: "text-[color:var(--color-ink)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  current: "text-current",
} as const;

type NavigatorConnectionLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

function isLowBandwidth(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & { connection?: NavigatorConnectionLike }
  ).connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") {
    return true;
  }
  return false;
}

/**
 * `<DiyaFlicker>` — brass diya with a flame that flickers convincingly.
 *
 * Behaviour:
 *  • Flame paths scale 0.92 → 1.08 with irregular jitter via `gsap.utils.random`.
 *  • Opacity oscillates 0.85 → 1.0.
 *  • Slight horizontal wobble (±1.5° rotation) — real flames lean.
 *  • A CSS box-shadow on the flame's halo div oscillates for a soft bloom.
 *  • Animations run in a repeating, randomised loop — never two identical frames.
 *  • Reduced motion → static flame (no animation).
 *  • Save-Data → static flame (no animation, perf-friendly).
 *
 * The diya body (brass vessel) is rendered static — only the flame moves.
 *
 * Recommended placements: Haldi service hero corner ambient, Annaprashan
 * service ambient corner, Diwali / Lakshmi-puja festival pages.
 */
export function DiyaFlicker({
  size = 120,
  tone = "brass",
  className,
  ariaLabel,
}: DiyaFlickerProps): React.ReactElement {
  const data = getIllustration("diya-lamp");
  const label = ariaLabel ?? data.label;
  const titleId = "diya-flicker-title";

  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const haloRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    const halo = haloRef.current;
    if (!svg) return;

    if (prefersReducedMotion || isLowBandwidth()) {
      // Static state — flame at rest.
      return;
    }

    const flames = svg.querySelectorAll<SVGPathElement>("[data-flame]");
    if (flames.length === 0) return;

    const ctx = gsap.context(() => {
      // Per-flame independent flicker tweens.
      flames.forEach((flame, idx) => {
        gsap.set(flame, {
          transformOrigin: "50px 58px",
          scale: 1,
          rotation: 0,
        });

        // Continuous random keyframe sequence — each repeat picks new targets.
        const flicker = (): gsap.core.Tween => {
          return gsap.to(flame, {
            scaleY: gsap.utils.random(0.94, 1.08, 0.01),
            scaleX: gsap.utils.random(0.92, 1.05, 0.01),
            rotation: gsap.utils.random(-1.6, 1.6, 0.1),
            opacity: gsap.utils.random(0.82, 1.0, 0.01),
            duration: gsap.utils.random(0.12, 0.32, 0.01),
            ease: "sine.inOut",
            // Slight per-layer offset so the inner flame and outer flame
            // don't move together (reads as turbulent fluid, not rigid).
            delay: idx * 0.03,
            onComplete: () => {
              flicker();
            },
          });
        };
        flicker();
      });

      // Halo glow oscillation — drives a CSS variable that the halo div reads.
      if (halo) {
        const haloState = { v: 0.6 };
        gsap.to(haloState, {
          v: 1,
          duration: 0.18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          onUpdate: () => {
            // Layer two box-shadow rings for depth.
            const v = haloState.v;
            halo.style.boxShadow = `
              0 0 ${10 + v * 14}px ${v * 3}px var(--color-gold, #b8893a),
              0 0 ${24 + v * 24}px ${v * 6}px color-mix(in oklab, var(--color-gold, #b8893a) ${Math.round(v * 50)}%, transparent)
            `;
            halo.style.opacity = String(0.65 + v * 0.25);
          },
          // Slight random offset on each cycle so the glow doesn't tick exactly.
          onRepeat: () => {
            // Vary the cycle duration on each yoyo to break the periodicity.
            const tween = gsap.getTweensOf(haloState)[0];
            if (tween)
              tween.duration(gsap.utils.random(0.14, 0.26, 0.01));
          },
        });
      }
    }, svg);

    return (): void => ctx.revert();
  }, [prefersReducedMotion]);

  const wrapStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    position: "relative",
    display: "inline-block",
  };

  const haloStyle: CSSProperties = {
    position: "absolute",
    // The flame sits roughly at viewBox (50, 36) — convert to wrapper px.
    left: `${size * 0.5}px`,
    top: `${size * 0.36}px`,
    width: 1,
    height: 1,
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    opacity: 0.7,
    boxShadow:
      "0 0 16px 3px var(--color-gold, #b8893a), 0 0 32px 8px color-mix(in oklab, var(--color-gold, #b8893a) 40%, transparent)",
  };

  return (
    <span
      ref={wrapRef}
      style={wrapStyle}
      className={cn("shrink-0 align-middle", toneClass[tone], className)}
    >
      {/* Halo glow — sits behind the SVG via z-order (SVG follows) */}
      <span ref={haloRef} aria-hidden="true" style={haloStyle} />
      <svg
        ref={svgRef}
        role="img"
        aria-labelledby={titleId}
        viewBox={data.viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "relative", width: "100%", height: "100%" }}
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
            const key = `diya-${idx}`;
            const isFlame = layer.role === "flame";
            const dataAttrs: Record<string, string> = {};
            if (isFlame) dataAttrs["data-flame"] = "";
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
    </span>
  );
}
