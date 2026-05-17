"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CanvasHeroHandle } from "@/lib/cinematic/canvas-hero";

/**
 * CinematicHeroCanvas — client wrapper that mounts the OGL brass-dust canvas.
 *
 * Behaviour:
 *   • Lazy-mounts the canvas only when the host enters the viewport via
 *     IntersectionObserver — saves ~3-4ms of scripting on the LCP frame for
 *     visitors who scroll past the hero (rare, but cheap to honour).
 *   • Picks up `prefers-reduced-motion` and Save-Data via canvas-hero.ts.
 *   • Reads scroll progress for the hero section via a ScrollTrigger and
 *     pipes it to the canvas (drives the mandap pull beat).
 *   • Reads `pointermove` (passive listener) and pipes it through.
 *   • Pauses on document.hidden + on tab blur.
 *   • Triggers the brass-foil sweep ~250ms after mount so the headline below
 *     gets its CSS sweep at the same beat (the overlay listens to a
 *     CustomEvent dispatched here).
 *   • Full GPU dispose on unmount (handle.destroy()).
 */

export type CinematicHeroCanvasProps = {
  /**
   * Optional override — if true, mounts immediately without waiting for
   * viewport intersection. Useful when used alongside the cold-open.
   */
  eager?: boolean;
  /** Aria-label for the canvas (a11y; mostly decorative). */
  ariaLabel?: string;
  className?: string;
};

export function CinematicHeroCanvas({
  eager = false,
  ariaLabel = "Brass-dust hero animation",
  className,
}: CinematicHeroCanvasProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<CanvasHeroHandle | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanupFns: Array<() => void> = [];

    async function boot(): Promise<void> {
      if (mountedRef.current || disposed) return;
      mountedRef.current = true;

      // Dynamic import so the OGL chunk doesn't appear in the initial bundle.
      const mod = await import("@/lib/cinematic/canvas-hero");
      if (disposed || !container) return;

      const handle = mod.mount(container);
      handleRef.current = handle;

      if (handle.mode === "off") {
        // Fallback painted; we still keep the container in the tree but no
        // further wiring needed.
        return;
      }

      // ---- Clock sync ------------------------------------------------
      // canvas-hero owns its own rAF (kept simple, no allocation per frame).
      // The Lenis provider already calls `ScrollTrigger.update()` on every
      // smooth-scroll frame, so the ScrollTrigger below stays Lenis-locked
      // even though we're not pushing canvas frames through the GSAP
      // ticker. The GSAP ticker hook here is intentionally a no-op — we
      // only register it so future consumers can hook off the same tick
      // for diagnostics without re-introducing a second rAF loop.
      const onTick = (): void => {
        /* canvas-hero advances internally; nothing to do per GSAP frame */
      };
      gsap.ticker.add(onTick);
      cleanupFns.push(() => gsap.ticker.remove(onTick));

      // ---- ScrollTrigger: hero scroll progress 0..1 -------------------
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
        onUpdate: (self) => {
          handle.setScroll(self.progress);
        },
      });
      cleanupFns.push(() => st.kill());

      // ---- Pointer move (passive) -------------------------------------
      const onPointerMove = (event: PointerEvent): void => {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Outside-container moves still count as a soft cursor effect, but
        // strength decays inside the shader by distance — fine.
        handle.setPointer(x, y);
      };
      const onPointerLeave = (): void => {
        // Push pointer well off-screen; shader's smoothstep will zero out.
        handle.setPointer(-9999, -9999);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave);
      cleanupFns.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
      });

      // ---- Page Visibility / tab blur ---------------------------------
      const onVisibility = (): void => {
        handle.setPaused(document.hidden);
      };
      const onBlur = (): void => handle.setPaused(true);
      const onFocus = (): void => handle.setPaused(false);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
      cleanupFns.push(() => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("blur", onBlur);
        window.removeEventListener("focus", onFocus);
      });

      // ---- Brass-foil sweep (kick-off) --------------------------------
      // 250ms after mount, fire the sweep and dispatch an event so the
      // overlay's H1 brass-mask animation runs to the same beat.
      const sweepTimer = window.setTimeout(() => {
        handle.triggerFoilSweep(1600);
        container.dispatchEvent(
          new CustomEvent("sgv:foil-sweep", { bubbles: true })
        );
      }, 250);
      cleanupFns.push(() => window.clearTimeout(sweepTimer));

      // Make ScrollTrigger recompute now that the canvas exists.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    // -- IntersectionObserver-gated mount.
    if (eager) {
      void boot();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              io.disconnect();
              void boot();
              break;
            }
          }
        },
        { rootMargin: "200px 0px 200px 0px", threshold: 0.01 }
      );
      io.observe(container);
      cleanupFns.push(() => io.disconnect());
    }

    return (): void => {
      disposed = true;
      for (const fn of cleanupFns) {
        try {
          fn();
        } catch {
          /* swallow */
        }
      }
      cleanupFns = [];
      handleRef.current?.destroy();
      handleRef.current = null;
      mountedRef.current = false;
    };
  }, [eager]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      data-cinematic-canvas=""
      data-aria-label={ariaLabel}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
