"use client";

/**
 * 3dImageMarquee — horizontal marquee where each tile tilts based on its
 * viewport position. Tiles near the centre sit flat; tiles near the edges
 * tilt away on Y so the strip feels like a curved film reel. On hover, the
 * tile under the cursor pops forward (Z +40px) and tilts toward the
 * cursor.
 *
 * Constraints honoured:
 *   - perspective 1200px.
 *   - rotateY ≤ 6° per tile from position, ≤ 4° from cursor.
 *   - Z-hover ≤ 40px.
 *   - prefers-reduced-motion / coarse-pointer → flat marquee.
 *
 * Best applied to: Portfolio strip, Press logos / Recognition marquee,
 * Vendor partners strip on About, Case-study related-work footer.
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
  mapRange,
} from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type MarqueeTile = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ImageMarqueeProps = {
  tiles: ReadonlyArray<MarqueeTile>;
  /** Marquee speed in seconds per cycle. Default 36s — slow. */
  speed?: number;
  /** Tile height in px. */
  tileHeight?: number;
  /** Wrapper className. */
  className?: string;
};

export function ImageMarquee({
  tiles,
  speed = 36,
  tileHeight = 240,
  className,
}: ImageMarqueeProps): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (prefersReducedMotion || getSaveData()) return;

    const isCoarse = getCoarsePointer();

    let cleanupExtras: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // ── Marquee loop ────────────────────────────────────────────────
      const distance = track.scrollWidth / 2;
      // Wrap-around modifier: keep `x` in (-distance, 0] so the duplicated
      // tile list seams invisibly.
      const wrapX = gsap.utils.wrap(-distance, 0);
      const tween = gsap.to(track, {
        x: `-=${distance}`,
        ease: "none",
        duration: speed,
        repeat: -1,
        modifiers: {
          x: (value: string): string => `${wrapX(Number.parseFloat(value))}px`,
        },
      });

      // Pause when the marquee is offscreen.
      const visibilityST = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tween.play(),
        onLeave: () => tween.pause(),
        onEnterBack: () => tween.play(),
        onLeaveBack: () => tween.pause(),
      });

      // Pause when the tab is hidden.
      const onVis = (): void => {
        if (document.hidden) tween.pause();
        else tween.resume();
      };
      document.addEventListener("visibilitychange", onVis);

      // ── Per-tile tilt based on viewport position ────────────────────
      const tileEls = Array.from(
        track.querySelectorAll<HTMLDivElement>("[data-marquee-tile]")
      );
      const tilters = tileEls.map((el) => ({
        el,
        ry: gsap.quickTo(el, "rotateY", { duration: 0.5, ease: EASE_3D.hover }),
        z: gsap.quickTo(el, "z", { duration: 0.5, ease: EASE_3D.hover }),
      }));

      const updateTilts = (): void => {
        const vpw = window.innerWidth || 1;
        for (const t of tilters) {
          const rect = t.el.getBoundingClientRect();
          const centre = rect.left + rect.width / 2;
          const fromCentre = (centre - vpw / 2) / (vpw / 2); // -1..1
          t.ry(clamp(fromCentre * -6, -DEPTH.rotateYMax, DEPTH.rotateYMax));
        }
      };

      gsap.ticker.add(updateTilts);

      // ── Cursor pop (fine pointer only) ──────────────────────────────
      let detachPointer: (() => void) | null = null;
      if (!isCoarse) {
        const onEnter = (e: PointerEvent): void => {
          const target = (e.currentTarget as HTMLElement) ?? null;
          const tilter = tilters.find((t) => t.el === target);
          if (!tilter) return;
          tilter.z(40);
        };
        const onLeave = (e: PointerEvent): void => {
          const target = (e.currentTarget as HTMLElement) ?? null;
          const tilter = tilters.find((t) => t.el === target);
          if (!tilter) return;
          tilter.z(0);
        };
        const onMove = (e: PointerEvent): void => {
          const target = e.currentTarget as HTMLElement | null;
          if (!target) return;
          const tilter = tilters.find((t) => t.el === target);
          if (!tilter) return;
          const rect = target.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          tilter.ry(mapRange(px, 0, 1, -4, 4));
        };
        tileEls.forEach((el) => {
          el.addEventListener("pointerenter", onEnter);
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
        });
        detachPointer = (): void => {
          tileEls.forEach((el) => {
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          });
        };
      }

      cleanupExtras = (): void => {
        gsap.ticker.remove(updateTilts);
        document.removeEventListener("visibilitychange", onVis);
        visibilityST.kill();
        detachPointer?.();
      };
    }, wrap);

    return (): void => {
      cleanupExtras?.();
      ctx.revert();
    };
  }, [prefersReducedMotion, speed]);

  // Duplicate the tile set so the looped translate is seamless.
  const doubled = [...tiles, ...tiles];

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ perspective: `${DEPTH.perspectiveDefault}px` }}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-[var(--space-6)] will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {doubled.map((tile, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated track key is index
            key={`${tile.src}-${i}`}
            data-marquee-tile=""
            className="relative shrink-0 overflow-hidden rounded-[var(--radius-md)] will-change-transform"
            style={{
              height: `${tileHeight}px`,
              width: `${(tile.width ?? 480) * (tileHeight / (tile.height ?? 320))}px`,
              transformStyle: "preserve-3d",
              boxShadow:
                "0 28px 56px -20px rgba(0, 0, 0, 0.24), 0 2px 4px -2px rgba(0, 0, 0, 0.10)",
            }}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              width={tile.width ?? 480}
              height={tile.height ?? 320}
              sizes="50vw"
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
