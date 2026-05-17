"use client";

/**
 * 3dParallaxStack — depth-stacked image layers with cursor parallax.
 *
 * Each layer has a `depth` 0..1 — closer (higher) layers translate more on
 * pointer move, distant layers translate less, producing a parallax window.
 * On scroll, the entire stack tilts subtly to sell its physicality.
 *
 * Constraints honoured:
 *   - perspective default 1200px (consumer-overrideable within 1000–1600).
 *   - Pointer-driven via `gsap.quickTo` so React never re-renders mid-move.
 *   - Coarse-pointer (mobile / tablet) → cursor parallax disabled, scroll
 *     tilt remains.
 *   - prefers-reduced-motion → static stack, no listeners.
 *
 * Best applied to: Home hero secondary image, About founder portrait, About
 * "studio in Siliguri" vignette, Contact section vista.
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
  clamp,
  getCoarsePointer,
  getSaveData,
} from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ParallaxLayer = {
  src: string;
  alt: string;
  /** Perceived depth in [0, 1]. 1 = nearest (moves most). Default 0.5. */
  depth?: number;
  /** Optional className on the layer itself. */
  className?: string;
  /** Optional width / height to pass to next/image. */
  width?: number;
  height?: number;
};

export type ParallaxStackProps = {
  layers: ReadonlyArray<ParallaxLayer>;
  /** Stack perspective in px. Clamped to 1000–1600. */
  perspective?: number;
  /** Max cursor parallax travel (px) at depth=1. Default 24. */
  travel?: number;
  /** Wrapper className. */
  className?: string;
};

export function ParallaxStack({
  layers,
  perspective = DEPTH.perspectiveDefault,
  travel = 24,
  className,
}: ParallaxStackProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  layerRefs.current = [];
  const collect = (el: HTMLDivElement | null): void => {
    if (el && !layerRefs.current.includes(el)) layerRefs.current.push(el);
  };

  const safePerspective = clamp(
    perspective,
    DEPTH.perspectiveMin,
    DEPTH.perspectiveMax
  );

  useEffect(() => {
    const container = containerRef.current;
    const els = layerRefs.current;
    if (!container || els.length === 0) return;
    if (prefersReducedMotion || getSaveData()) return;

    let detachPointer: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // ── Cursor parallax (desktop / fine pointer only) ────────────────
      if (!getCoarsePointer()) {
        const setters = els.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: EASE_3D.hover }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: EASE_3D.hover }),
        }));

        const onMove = (e: PointerEvent): void => {
          if (document.hidden) return;
          const rect = container.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          // Map 0..1 → -1..1.
          const nx = px * 2 - 1;
          const ny = py * 2 - 1;
          layers.forEach((layer, i) => {
            const depth = clamp(layer.depth ?? 0.5, 0, 1);
            const t = setters[i];
            if (!t) return;
            t.x(nx * travel * depth);
            t.y(ny * travel * depth);
          });
        };
        const onLeave = (): void => {
          setters.forEach((s) => {
            s.x(0);
            s.y(0);
          });
        };
        container.addEventListener("pointermove", onMove);
        container.addEventListener("pointerleave", onLeave);
        detachPointer = (): void => {
          container.removeEventListener("pointermove", onMove);
          container.removeEventListener("pointerleave", onLeave);
        };
      }

      // ── Scroll tilt — gentle Y rotation tied to scroll progress. ─────
      gsap.fromTo(
        container,
        { rotateX: 2, rotateY: -2 },
        {
          rotateX: -2,
          rotateY: 2,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );

    }, container);

    return (): void => {
      detachPointer?.();
      ctx.revert();
    };
  }, [layers, prefersReducedMotion, travel]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        perspective: `${safePerspective}px`,
        transformStyle: "preserve-3d",
      }}
    >
      {layers.map((layer, i) => {
        const depth = clamp(layer.depth ?? 0.5, 0, 1);
        // Map depth → Z so the stack reads as actually layered.
        const z = depth * DEPTH.zMax * 0.6;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: layer index is the identity here
            key={`${layer.src}-${i}`}
            ref={collect}
            className={cn(
              "absolute inset-0 will-change-transform",
              i === 0 ? "relative" : "",
              layer.className
            )}
            style={{
              transform: `translateZ(${z}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={layer.src}
              alt={layer.alt}
              width={layer.width ?? 1600}
              height={layer.height ?? 1000}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block h-full w-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
