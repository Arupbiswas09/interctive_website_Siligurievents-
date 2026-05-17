"use client";

/**
 * 3dSliceReveal — hero-tier image reveal via N horizontal slices.
 *
 * Slices fly in from alternating directions (1: left, 2: right, 3: left …),
 * each Z-translated so they overlap like the leaves of a book before
 * settling flat into a single image. Reads as a cinematic title-card moment.
 *
 * Constraints honoured:
 *   - 1.4s staggered timeline, `power3.out`.
 *   - Z-translate ≤ 80px, no rotateZ.
 *   - Single-fire — never replays.
 *   - prefers-reduced-motion → instant flat image, no animation.
 *
 * Best applied to: signature case-study covers, About / Founder feature,
 * Home hero secondary panel.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  DEPTH,
  EASE_3D,
  TIMING,
  clamp,
  getSaveData,
} from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SliceRevealProps = {
  src: string;
  alt: string;
  /** Number of slices. 3–6 reads best. Default 4. */
  slices?: number;
  /** Width hint for next/image. */
  width?: number;
  /** Height hint for next/image. */
  height?: number;
  className?: string;
};

const DEFAULT_SLICES = 4;

export function SliceReveal({
  src,
  alt,
  slices = DEFAULT_SLICES,
  width = 1600,
  height = 1000,
  className,
}: SliceRevealProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliceRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const safeSlices = clamp(slices, 2, 6);

  sliceRefs.current = [];
  const collect = (el: HTMLDivElement | null): void => {
    if (el && !sliceRefs.current.includes(el)) sliceRefs.current.push(el);
  };

  useEffect(() => {
    const container = containerRef.current;
    const slicesEls = sliceRefs.current;
    if (!container || slicesEls.length === 0) return;

    if (prefersReducedMotion || getSaveData()) {
      gsap.set(slicesEls, { clearProps: "transform,opacity" });
      return;
    }

    const ctx = gsap.context(() => {
      const w = container.clientWidth || 800;

      // Initial: alternating off-screen + Z-stagger.
      slicesEls.forEach((el, i) => {
        const fromLeft = i % 2 === 0;
        gsap.set(el, {
          x: fromLeft ? -w * 0.6 : w * 0.6,
          z: DEPTH.zMax * (1 - i / safeSlices),
          autoAlpha: 0,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: EASE_3D.slice },
      });

      slicesEls.forEach((el, i) => {
        tl.to(
          el,
          {
            x: 0,
            z: 0,
            autoAlpha: 1,
            duration: TIMING.slice,
          },
          i * 0.08
        );
      });
    }, container);

    return (): void => ctx.revert();
  }, [prefersReducedMotion, safeSlices]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)]",
        className
      )}
      style={{
        perspective: `${DEPTH.perspectiveDefault}px`,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      {Array.from({ length: safeSlices }).map((_, index) => {
        const pct = 100 / safeSlices;
        const top = pct * index;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: slice slot is structural
            key={index}
            ref={collect}
            className="absolute left-0 w-full overflow-hidden will-change-transform"
            style={{
              top: `${top}%`,
              height: `${pct}%`,
              transformStyle: "preserve-3d",
              boxShadow:
                "0 20px 40px -16px rgba(0, 0, 0, 0.22), 0 1px 2px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Image
              src={src}
              alt={index === 0 ? alt : ""}
              aria-hidden={index === 0 ? undefined : true}
              width={width}
              height={height}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="block max-w-none object-cover"
              style={{
                width: "100%",
                height: `${safeSlices * 100}%`,
                transform: `translateY(${-100 * index}%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
