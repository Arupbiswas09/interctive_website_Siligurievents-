"use client";

/**
 * 3dFoldCard — invitation-style fold-open card.
 *
 * The card begins as a closed booklet: a left "cover" half sits on top of
 * the inner content. On trigger, the cover rotates 180° around its right
 * edge (Y-axis) and the inner content rests in place behind it.
 *
 * Constraints honoured:
 *   - perspective 1400px.
 *   - 1.2s, `power4.out` — deliberate, no overshoot.
 *   - prefers-reduced-motion → both halves visible side-by-side, no
 *     transform, no animation.
 *
 * Best applied to: wedding-invitation case-study reveals, package "open"
 * tiles on the Services page, founder note unfold on About.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { DEPTH, EASE_3D, TIMING, getSaveData } from "@/lib/effects/3d-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FoldCardProps = {
  /** Visible cover content (closed state). */
  cover: React.ReactNode;
  /** Inner content revealed when the cover folds open. */
  content: React.ReactNode;
  /** Trigger mode. Default: intersection (single open as you scroll in). */
  trigger?: "hover" | "intersection" | "click";
  /**
   * If true, hover/click can reverse the fold (close back). Intersection
   * is always single-fire so the reveal feels intentional.
   */
  reversible?: boolean;
  /** Optional className for the outer frame. */
  className?: string;
};

export function FoldCard({
  cover,
  content,
  trigger = "intersection",
  reversible = true,
  className,
}: FoldCardProps): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const coverEl = coverRef.current;
    if (!wrap || !coverEl) return;

    // Save-Data → static. Show both halves immediately, no listeners.
    if (getSaveData() || prefersReducedMotion) {
      gsap.set(coverEl, { rotationY: -180, autoAlpha: 0 });
      return;
    }

    let detachListeners: (() => void) | null = null;

    const ctx = gsap.context(() => {
      gsap.set(coverEl, {
        rotationY: 0,
        transformOrigin: "100% 50%",
        transformPerspective: DEPTH.perspectiveMax,
      });

      const tween = gsap.to(coverEl, {
        rotationY: -180,
        duration: TIMING.fold,
        ease: EASE_3D.fold,
        paused: true,
      });

      if (trigger === "intersection") {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 70%",
          once: true,
          onEnter: () => tween.play(),
        });
        return;
      }

      if (trigger === "hover") {
        const open = (): void => {
          tween.play();
        };
        const close = (): void => {
          if (reversible) tween.reverse();
        };
        wrap.addEventListener("pointerenter", open);
        wrap.addEventListener("pointerleave", close);
        wrap.addEventListener("focus", open);
        wrap.addEventListener("blur", close);
        detachListeners = (): void => {
          wrap.removeEventListener("pointerenter", open);
          wrap.removeEventListener("pointerleave", close);
          wrap.removeEventListener("focus", open);
          wrap.removeEventListener("blur", close);
        };
        return;
      }

      // Click trigger — toggles when reversible, single-fires otherwise.
      const onClick = (): void => {
        if (!tween.paused() && !tween.reversed()) return;
        if (reversible) {
          if (tween.reversed()) tween.play();
          else tween.reverse();
        } else {
          tween.play();
        }
        setIsOpen((o) => !o);
      };
      wrap.addEventListener("click", onClick);
      detachListeners = (): void => {
        wrap.removeEventListener("click", onClick);
      };
    }, wrap);

    return (): void => {
      detachListeners?.();
      ctx.revert();
    };
  }, [trigger, reversible, prefersReducedMotion]);

  const isStatic = prefersReducedMotion;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative",
        // Static fallback lays both halves side-by-side; animated mode
        // overlays them so the cover hides the content until it folds.
        isStatic ? "grid grid-cols-2 gap-[var(--space-2)]" : "block",
        className
      )}
      style={{
        perspective: `${DEPTH.perspectiveMax}px`,
      }}
      {...(trigger === "click" && !isStatic
        ? {
            role: "button",
            tabIndex: 0,
            "aria-pressed": isOpen,
            "aria-label": isOpen ? "Close card" : "Open card",
          }
        : {})}
    >
      {/* Inner content — sits underneath in animated mode, beside in static. */}
      <div
        className={cn(
          "rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-[var(--space-6)]",
          !isStatic && "absolute inset-0"
        )}
      >
        {content}
      </div>

      {/* Cover — rotates open in animated mode. */}
      <div
        ref={coverRef}
        className={cn(
          "rounded-[var(--radius-md)] p-[var(--space-6)] will-change-transform",
          // Brass-foil edge using border + inner gradient. Subtle.
          "bg-[linear-gradient(135deg,var(--color-bg-elevated)_0%,var(--color-bg-elevated)_85%,var(--color-gold-soft)_100%)]",
          "border border-[color:var(--color-gold-soft)]",
          !isStatic && "absolute inset-0",
          // Backface-hidden so the back of the cover isn't visible mid-fold.
          !isStatic && "[backface-visibility:hidden]"
        )}
        style={{
          boxShadow: !isStatic
            ? "0 32px 64px -24px rgba(0, 0, 0, 0.25), 0 2px 8px -2px rgba(0, 0, 0, 0.12)"
            : undefined,
        }}
      >
        {cover}
      </div>
    </div>
  );
}
