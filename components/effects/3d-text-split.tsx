"use client";

/**
 * 3dTextSplit — display headline letters scattered in 3D space, settling flat.
 *
 * Each letter is wrapped in a span with a deterministic but varied initial
 * 3D transform (Z 0–80px, rotateX 0–12°, rotateY 0–8°). On enter, all
 * letters settle to identity with a staggered timeline.
 *
 * Uses a deterministic pseudo-random seed (index-based) so SSR + CSR
 * produce identical markup — no hydration mismatch.
 *
 * Constraints honoured:
 *   - 1.6s total, stagger ≤ 0.06s, `power3.out`.
 *   - prefers-reduced-motion → instant flat, no animation.
 *   - Letters are wrapped in `aria-hidden` spans; the original text is
 *     exposed to assistive tech via `sr-only`.
 *
 * Best applied to: Home hero H1 (alternates with `<SplitterReveal>`),
 * Case-study cover title, About hero title.
 */

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { DEPTH, EASE_3D, TIMING, getSaveData } from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type TextSplitProps = {
  /** Plain string only — markup inside text isn't supported. */
  children: string;
  /** Stagger between letters in seconds. Default 0.04. */
  stagger?: number;
  /** Depth preset. */
  depth?: "subtle" | "medium" | "bold";
  /** Wrapper className. */
  className?: string;
  /** Render element. Defaults to span (use h1/h2 in consumer). */
  as?: "span" | "div" | "h1" | "h2" | "h3";
};

const DEPTH_PRESETS: Record<
  "subtle" | "medium" | "bold",
  { z: number; rx: number; ry: number }
> = {
  subtle: { z: 32, rx: 6, ry: 4 },
  medium: { z: 56, rx: 10, ry: 6 },
  bold: { z: DEPTH.zMax, rx: 12, ry: 8 },
};

/**
 * Deterministic pseudo-random ∈ [-1, 1] from an integer seed. Avoids
 * runtime `Math.random()` so SSR markup matches CSR exactly.
 */
function seededRand(seed: number): number {
  // Classic 32-bit mix.
  let x = seed | 0;
  x = (x ^ 61) ^ (x >>> 16);
  x = x + (x << 3);
  x = x ^ (x >>> 4);
  x = Math.imul(x, 0x27d4eb2d);
  x = x ^ (x >>> 15);
  // Map to [-1, 1].
  return ((x >>> 0) / 0xffffffff) * 2 - 1;
}

export function TextSplit({
  children,
  stagger = 0.04,
  depth = "subtle",
  className,
  as: Tag = "span",
}: TextSplitProps): React.ReactElement {
  const wrapRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Split into chars but preserve whitespace tokens.
  const tokens = useMemo(() => {
    const chars = Array.from(children);
    return chars.map((ch, i) => {
      if (ch === " ") return { kind: "space" as const, i };
      return { kind: "char" as const, ch, i };
    });
  }, [children]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const letterEls = wrap.querySelectorAll<HTMLSpanElement>(
      "[data-3d-text-letter]"
    );
    if (letterEls.length === 0) return;

    if (prefersReducedMotion || getSaveData()) {
      gsap.set(letterEls, { clearProps: "transform,opacity" });
      return;
    }

    const preset = DEPTH_PRESETS[depth];

    const ctx = gsap.context(() => {
      // Seeded scatter as initial state. One ScrollTrigger drives the
      // settle-tween for all letters via stagger.
      letterEls.forEach((el, i) => {
        gsap.set(el, {
          z: seededRand(i + 1) * preset.z,
          rotateX: seededRand(i + 17) * preset.rx,
          rotateY: seededRand(i + 31) * preset.ry,
          autoAlpha: 0,
          transformOrigin: "50% 50%",
        });
      });

      gsap.to(letterEls, {
        z: 0,
        rotateX: 0,
        rotateY: 0,
        autoAlpha: 1,
        duration: TIMING.textSplit / 1.6,
        ease: EASE_3D.slice,
        stagger,
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          once: true,
        },
      });
    }, wrap);

    return (): void => ctx.revert();
  }, [depth, prefersReducedMotion, stagger]);

  const Element = Tag as React.ElementType;

  return (
    <Element
      ref={wrapRef as React.Ref<HTMLElement>}
      className={cn("inline-block will-change-transform", className)}
      style={{
        perspective: `${DEPTH.perspectiveDefault}px`,
        transformStyle: "preserve-3d",
      }}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-block">
        {tokens.map((tok) =>
          tok.kind === "space" ? (
            <span key={`s-${tok.i}`}>&nbsp;</span>
          ) : (
            <span
              key={`c-${tok.i}`}
              data-3d-text-letter=""
              className="inline-block will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {tok.ch}
            </span>
          )
        )}
      </span>
    </Element>
  );
}
