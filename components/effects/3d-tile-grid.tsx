"use client";

/**
 * 3dTileGrid — grid of tiles with a scroll-driven 3D ripple.
 *
 * Each child becomes a tile. As the grid passes through the viewport,
 * tiles rotate small amounts on X and Y based on their position in the
 * ripple wave. Restrained — never gimmicky.
 *
 * Constraints honoured:
 *   - perspective default 1200px (consumer override 1000–1600).
 *   - rotateX/rotateY ≤ 6° (`subtle`), ≤ 8° (`bold`).
 *   - Scrubbed timeline, so motion is wholly user-controlled.
 *   - prefers-reduced-motion → flat grid, no transforms.
 *
 * Best applied to: Portfolio masonry, Services tile grid, Case-study
 * gallery, Recognition / Awards strip.
 */

import { Children, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { DEPTH, clamp, getSaveData } from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type TileGridProps = {
  children: React.ReactNode;
  /** Column count. Maps to CSS `grid-template-columns`. */
  columns?: number;
  /** Perspective px. Clamped to 1000–1600. */
  perspective?: number;
  /** Wave amplitude. */
  intensity?: "subtle" | "medium" | "bold";
  /** Gap between tiles using site space tokens. Default `var(--space-4)`. */
  gap?: string;
  className?: string;
};

const INTENSITY_MAP: Record<
  "subtle" | "medium" | "bold",
  { rotMax: number; zMax: number }
> = {
  subtle: { rotMax: 3, zMax: 24 },
  medium: { rotMax: 5, zMax: 40 },
  bold: { rotMax: 8, zMax: 64 },
};

export function TileGrid({
  children,
  columns = 3,
  perspective = DEPTH.perspectiveDefault,
  intensity = "subtle",
  gap = "var(--space-4)",
  className,
}: TileGridProps): React.ReactElement {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  tileRefs.current = [];
  const collect = (el: HTMLDivElement | null): void => {
    if (el && !tileRefs.current.includes(el)) tileRefs.current.push(el);
  };

  const safePerspective = clamp(
    perspective,
    DEPTH.perspectiveMin,
    DEPTH.perspectiveMax
  );

  useEffect(() => {
    const grid = gridRef.current;
    const tiles = tileRefs.current;
    if (!grid || tiles.length === 0) return;
    if (prefersReducedMotion || getSaveData()) return;

    const { rotMax, zMax } = INTENSITY_MAP[intensity];

    const ctx = gsap.context(() => {
      tiles.forEach((tile, i) => {
        // Spread the wave: each tile's phase offset is its index.
        const col = i % columns;
        const row = Math.floor(i / columns);
        const phase = (col + row) * 0.12;

        gsap.fromTo(
          tile,
          {
            rotateX: rotMax,
            rotateY: -rotMax * 0.7,
            z: -zMax * 0.4,
          },
          {
            rotateX: -rotMax,
            rotateY: rotMax * 0.7,
            z: zMax * 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: `top bottom-=${phase * 50}`,
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });
    }, grid);

    return (): void => ctx.revert();
  }, [columns, intensity, prefersReducedMotion]);

  return (
    <div
      ref={gridRef}
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        perspective: `${safePerspective}px`,
      }}
    >
      {Children.map(children, (child, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: tile slot identity is structural
          key={i}
          ref={collect}
          className="will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
