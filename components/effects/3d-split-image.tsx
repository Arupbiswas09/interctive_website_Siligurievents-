"use client";

/**
 * 3dSplitImage — image splits into N panels in 3D space.
 *
 * On the configured trigger the image is sliced into `panels` strips that
 * each translate apart, Z-translate, and slightly rotate to fan open,
 * revealing a brass-foil scrim between them. They reunify when the trigger
 * reverses (scroll past, cursor leaves).
 *
 * Constraints honoured:
 *   - perspective 1200px (within 1000–1600 luxury range).
 *   - Z-translate ≤ 80px; rotateY ≤ 6°.
 *   - 0.9s timeline, `power3.out` — slow, settled. No bounce.
 *   - prefers-reduced-motion → fade-in only, no split.
 *   - Save-Data → static image, no animation.
 *
 * Best applied to: case-study covers, portfolio hero tiles, About founder
 * portrait, signature-work feature panes.
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

export type SplitImageProps = {
  /** Image source. Next/Image-compatible (local or remote configured). */
  src: string;
  alt: string;
  /** Number of panels (2–5). Defaults to 3. */
  panels?: number;
  /** Split orientation. Default horizontal (panels stacked side-by-side). */
  axis?: "horizontal" | "vertical";
  /** When the effect plays. Defaults to scroll into view. */
  trigger?: "scroll" | "hover" | "intersection";
  /** Intrinsic width hint passed to next/image. */
  width?: number;
  /** Intrinsic height hint passed to next/image. */
  height?: number;
  /** Optional className for the outer frame. */
  className?: string;
};

const DEFAULT_PANELS = 3;

export function SplitImage({
  src,
  alt,
  panels = DEFAULT_PANELS,
  axis = "horizontal",
  trigger = "intersection",
  width = 1600,
  height = 1000,
  className,
}: SplitImageProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const safePanels = clamp(panels, 2, 5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const panelEls = Array.from(container.querySelectorAll<HTMLDivElement>("[data-split-panel]"));
    if (panelEls.length === 0) return;

    // Save-Data → no animation, no listeners, just static image.
    if (getSaveData()) {
      gsap.set(panelEls, { clearProps: "transform,opacity" });
      return;
    }

    let detachHover: (() => void) | null = null;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Fade-in only, single-fire.
        gsap.fromTo(
          container,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.4,
            ease: "none",
            scrollTrigger: { trigger: container, start: "top 90%", once: true },
          }
        );
        return;
      }

      // Build the open-state targets once (symmetrical fan).
      const openTargets = panelEls.map((_, index) => {
        const centreOffset = index - (safePanels - 1) / 2;
        const axisShift = 18 * centreOffset;
        const centreness =
          1 - Math.abs(centreOffset) / Math.max(1, (safePanels - 1) / 2);
        return {
          x: axis === "horizontal" ? axisShift : 0,
          y: axis === "vertical" ? axisShift : 0,
          z: DEPTH.zMax * centreness * 0.85,
          rotateY:
            axis === "horizontal"
              ? -DEPTH.rotateYMax * 0.65 * centreOffset
              : 0,
          rotateX:
            axis === "vertical" ? DEPTH.rotateYMax * 0.65 * centreOffset : 0,
        };
      });

      if (trigger === "scroll" || trigger === "intersection") {
        // Scroll: open as the image enters, close as it exits.
        panelEls.forEach((el, index) => {
          const target = openTargets[index];
          if (!target) return;
          gsap.fromTo(
            el,
            { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0 },
            {
              x: target.x,
              y: target.y,
              z: target.z,
              rotateX: target.rotateX,
              rotateY: target.rotateY,
              duration: TIMING.reveal,
              ease: EASE_3D.slice,
              scrollTrigger: {
                trigger: container,
                start: "top 75%",
                end: "bottom 30%",
                toggleActions:
                  trigger === "intersection"
                    ? "play none none reverse"
                    : "play reverse play reverse",
              },
            }
          );
        });
        return;
      }

      // Hover trigger — bind pointerenter / pointerleave on the container.
      gsap.set(panelEls, { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0 });

      const setters = panelEls.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: TIMING.reveal, ease: EASE_3D.slice }),
        y: gsap.quickTo(el, "y", { duration: TIMING.reveal, ease: EASE_3D.slice }),
        z: gsap.quickTo(el, "z", { duration: TIMING.reveal, ease: EASE_3D.slice }),
        rx: gsap.quickTo(el, "rotateX", {
          duration: TIMING.reveal,
          ease: EASE_3D.slice,
        }),
        ry: gsap.quickTo(el, "rotateY", {
          duration: TIMING.reveal,
          ease: EASE_3D.slice,
        }),
      }));

      const open = (): void => {
        setters.forEach((s, i) => {
          const t = openTargets[i];
          if (!t) return;
          s.x(t.x);
          s.y(t.y);
          s.z(t.z);
          s.rx(t.rotateX);
          s.ry(t.rotateY);
        });
      };
      const close = (): void => {
        setters.forEach((s) => {
          s.x(0);
          s.y(0);
          s.z(0);
          s.rx(0);
          s.ry(0);
        });
      };

      container.addEventListener("pointerenter", open);
      container.addEventListener("pointerleave", close);
      container.addEventListener("focus", open);
      container.addEventListener("blur", close);
      detachHover = (): void => {
        container.removeEventListener("pointerenter", open);
        container.removeEventListener("pointerleave", close);
        container.removeEventListener("focus", open);
        container.removeEventListener("blur", close);
      };
    }, container);

    return (): void => {
      detachHover?.();
      ctx.revert();
    };
  }, [axis, prefersReducedMotion, safePanels, trigger]);

  // Each panel is a clipped strip of the same image. The image inside is
  // shifted so its visible region aligns to the panel's slot.
  const stripStyle = (index: number): React.CSSProperties => {
    const pct = 100 / safePanels;
    const offset = pct * index;
    if (axis === "horizontal") {
      return {
        width: `${pct}%`,
        height: "100%",
        left: `${offset}%`,
        top: 0,
      };
    }
    return {
      width: "100%",
      height: `${pct}%`,
      top: `${offset}%`,
      left: 0,
    };
  };

  const innerImageStyle = (index: number): React.CSSProperties => {
    if (axis === "horizontal") {
      return {
        width: `${safePanels * 100}%`,
        height: "100%",
        transform: `translateX(${-100 * index}%)`,
      };
    }
    return {
      width: "100%",
      height: `${safePanels * 100}%`,
      transform: `translateY(${-100 * index}%)`,
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)]",
        // Brass-foil scrim sits beneath the panels, visible only where
        // they part. Linear gradient using brand gold tokens.
        "before:absolute before:inset-0 before:rounded-[inherit] before:content-['']",
        "before:bg-[linear-gradient(135deg,var(--color-gold-soft)_0%,var(--color-gold)_45%,var(--color-accent-deep)_100%)]",
        className
      )}
      style={{
        perspective: `${DEPTH.perspectiveDefault}px`,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      {Array.from({ length: safePanels }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable per render
          key={index}
          data-split-panel
          className="absolute will-change-transform"
          style={{
            ...stripStyle(index),
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            // Layer shadow so panels read as physical when they part.
            boxShadow:
              "0 24px 48px -16px rgba(0, 0, 0, 0.22), 0 2px 6px -2px rgba(0, 0, 0, 0.12)",
            // Inner overflow hidden clips the wider <img> to the strip.
            overflow: "hidden",
          }}
        >
          <Image
            src={src}
            alt={index === 0 ? alt : ""}
            aria-hidden={index === 0 ? undefined : true}
            width={width}
            height={height}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={trigger === "intersection"}
            className="block h-full max-w-none object-cover"
            style={innerImageStyle(index)}
          />
        </div>
      ))}
    </div>
  );
}
