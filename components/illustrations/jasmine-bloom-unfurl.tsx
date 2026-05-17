"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { EASE } from "@/lib/gsap/eases";
import { getIllustration } from "@/lib/illustrations/paths";

export type JasmineBloomUnfurlHandle = {
  /** Replay the unfurl from petal 0. Honours reduced-motion (no-op). */
  replay: () => void;
};

export type JasmineBloomUnfurlProps = {
  /** Visual size — height in px; width follows from aspect (square). */
  size?: number;
  /** Tone class applied to the wrapper for `currentColor` cascade. */
  tone?: "ink" | "muted" | "gold" | "brass" | "current";
  /** Play once on mount. Default true. */
  autoplay?: boolean;
  /** Per-petal stagger in seconds. Default 0.08 (80ms). */
  stagger?: number;
  /** Total bloom duration in seconds. Default 1.4. */
  duration?: number;
  /** Imperative handle for replay. */
  handleRef?: React.Ref<JasmineBloomUnfurlHandle>;
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
 * `<JasmineBloomUnfurl>` — the SIG-13 jasmine bloom payoff moment.
 *
 * Each of the 5 petals scales from 0 → 1 with a slight outward rotation,
 * opacity 0 → 1, staggered 80ms. The stamen pops in last with a tiny scale
 * bounce. GSAP timeline, total ≈1.4s by default.
 *
 * Reusable as:
 *  • Inquiry form success state.
 *  • Day → Night switcher confirmation payoff.
 *  • Section H8 / H9 transition flourish on Home.
 *
 * Reduced motion: final state immediate, no tween.
 * Caller can replay via the `handleRef`.
 */
export function JasmineBloomUnfurl({
  size = 120,
  tone = "gold",
  autoplay = true,
  stagger = 0.08,
  duration = 1.4,
  handleRef,
  className,
  ariaLabel,
}: JasmineBloomUnfurlProps): React.ReactElement {
  const data = getIllustration("jasmine-bloom");
  const label = ariaLabel ?? data.label;
  const titleId = `jasmine-unfurl-title`;

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

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const petals = svg.querySelectorAll<SVGPathElement>("[data-petal]");
    const stamen = svg.querySelectorAll<SVGPathElement>("[data-stamen]");

    if (prefersReducedMotion) {
      gsap.set(petals, { autoAlpha: 1, scale: 1, rotate: 0 });
      gsap.set(stamen, { autoAlpha: 1, scale: 1 });
      return;
    }

    // Initial state: petals collapsed at centre, rotated slightly inward.
    gsap.set(petals, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: "50px 50px",
      rotate: (i) => -8 + i * 2,
    });
    gsap.set(stamen, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: "50px 50px",
    });

    const ctx = gsap.context(() => {
      const buildTimeline = (): gsap.core.Timeline => {
        const tl = gsap.timeline({ paused: !autoplay });
        // Per-petal arrival — scale 0 → 1, rotate to its outward target,
        // opacity 0 → 1, brass-curve ease.
        tl.to(petals, {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: duration * 0.78,
          stagger,
          ease: EASE.brass,
        });
        // Stamen pops last with a tiny overshoot.
        tl.to(
          stamen,
          {
            autoAlpha: 1,
            scale: 1,
            duration: duration * 0.32,
            ease: "back.out(2.4)",
          },
          `-=${duration * 0.18}`
        );
        return tl;
      };

      let tl = buildTimeline();
      if (autoplay) tl.play(0);

      play.current = (): void => {
        tl.kill();
        // Reset to initial state before replay.
        gsap.set(petals, {
          autoAlpha: 0,
          scale: 0,
          rotate: (i) => -8 + i * 2,
        });
        gsap.set(stamen, { autoAlpha: 0, scale: 0 });
        tl = buildTimeline();
        tl.play(0);
      };
    }, svg);

    return (): void => {
      ctx.revert();
      play.current = (): void => undefined;
    };
  }, [autoplay, stagger, duration, prefersReducedMotion]);

  const style: CSSProperties = { width: `${size}px`, height: `${size}px` };

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
          const key = `jasmine-${idx}`;
          const isPetal = layer.role === "petal";
          const isStamen = layer.role === "stamen";
          const dataAttrs: Record<string, string> = {};
          if (isPetal) dataAttrs["data-petal"] = "";
          if (isStamen) dataAttrs["data-stamen"] = "";
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
