"use client";

import { useEffect, useRef, useState } from "react";

/**
 * cold-open.tsx — First-visit "cold open" intro overlay.
 *
 * Renders a full-screen black panel that fades out as brass-dust particles
 * bloom outward from the centre, revealing the page underneath. Single-shot
 * per session (sessionStorage key `sgv:cold-open-shown`).
 *
 * Total duration: 2.4s.
 * Skippable: Esc / tap / scroll → finishes in 200ms.
 * Reduced motion: instant fade out in 200ms, no particle bloom.
 *
 * The particle bloom uses the same OGL canvas-hero machinery as the main
 * hero, mounted with `setIntro(1)` and tweened to `setIntro(0)` over the
 * cold-open duration. We mount a separate, full-screen canvas instance
 * (cheap because it tears down immediately on completion).
 *
 * Architectural note: this is split from `cold-open-mount.tsx` so the
 * mount component is a tiny client island the layout can drop in without
 * carrying the gesture/keyboard wiring up the tree.
 */

type ColdOpenState = "playing" | "exiting" | "done";

const STORAGE_KEY = "sgv:cold-open-shown";
const TOTAL_DURATION_MS = 2400;
const EXIT_DURATION_MS = 600;
const REDUCED_EXIT_MS = 200;

export type ColdOpenProps = {
  /** Force the cold-open to play even if it has already been shown this session. */
  force?: boolean;
};

export function ColdOpen({ force = false }: ColdOpenProps): React.ReactElement | null {
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [state, setState] = useState<ColdOpenState>("playing");
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Loose handle type since canvas-hero is dynamically imported.
  // Using `unknown` avoids leaking module types to consumers.
  const handleRef = useRef<{
    destroy: () => void;
    setIntro: (v: number) => void;
  } | null>(null);
  const startMsRef = useRef<number>(0);
  const exitStartedRef = useRef<boolean>(false);

  // Decide whether to mount at all — runs once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!force) {
      try {
        const shown = window.sessionStorage.getItem(STORAGE_KEY);
        if (shown === "1") {
          return;
        }
      } catch {
        // sessionStorage blocked (private mode / iframe sandbox) — play once anyway.
      }
    }
    setShouldRender(true);
  }, [force]);

  // Mount the particle canvas + drive the bloom.
  useEffect(() => {
    if (!shouldRender) return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let bloomRaf = 0;
    const cleanupFns: Array<() => void> = [];

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    startMsRef.current = performance.now();

    // Mark as shown immediately — even if the user reloads mid-animation we
    // don't want to re-trigger.
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }

    // Reduced motion: skip canvas, just fade the panel out.
    if (reduced) {
      const timer = window.setTimeout(() => beginExit(), 80);
      cleanupFns.push(() => window.clearTimeout(timer));
      return () => {
        disposed = true;
        for (const fn of cleanupFns) fn();
      };
    }

    // Mount canvas asynchronously.
    void (async () => {
      const mod = await import("@/lib/cinematic/canvas-hero");
      if (disposed) return;
      const handle = mod.mount(container, {
        // Cold-open mounts even on slower setups (it's brief). canvas-hero
        // still degrades to fallback on prefers-reduced / Save-Data.
      });
      if (handle.mode === "off") {
        // Fallback painted; just trigger exit on schedule.
        const timer = window.setTimeout(() => beginExit(), 1000);
        cleanupFns.push(() => window.clearTimeout(timer));
        return;
      }
      handleRef.current = handle;

      // Drive uIntro 1 → 0 over the bloom phase (first ~1.6s).
      const bloomDurationMs = TOTAL_DURATION_MS - EXIT_DURATION_MS - 200; // ~1600ms
      handle.setIntro(1);
      // Trigger the foil sweep to coincide with bloom completion.
      window.setTimeout(() => {
        handle.triggerFoilSweep(1200);
      }, bloomDurationMs * 0.4);

      const bloomStart = performance.now();
      const tick = (): void => {
        if (disposed) return;
        const k = Math.min(
          1,
          (performance.now() - bloomStart) / bloomDurationMs
        );
        // ease-out-cubic
        const eased = 1 - Math.pow(1 - k, 3);
        handle.setIntro(1 - eased);
        if (k < 1) {
          bloomRaf = requestAnimationFrame(tick);
        } else {
          beginExit();
        }
      };
      bloomRaf = requestAnimationFrame(tick);
    })();

    // ---- Skip gestures: Esc / tap / scroll / wheel ----
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") beginExit();
    };
    const onPointerDown = (): void => beginExit();
    const onScroll = (): void => beginExit();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown, { once: true });
    window.addEventListener("wheel", onScroll, { passive: true, once: true });
    window.addEventListener("touchmove", onScroll, { passive: true, once: true });
    cleanupFns.push(() => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
    });

    return (): void => {
      disposed = true;
      cancelAnimationFrame(bloomRaf);
      for (const fn of cleanupFns) {
        try {
          fn();
        } catch {
          /* noop */
        }
      }
      handleRef.current?.destroy();
      handleRef.current = null;
    };

    function beginExit(): void {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      setState("exiting");

      const exitMs = reduced ? REDUCED_EXIT_MS : EXIT_DURATION_MS;
      window.setTimeout(() => {
        setState("done");
        // Destroy the canvas after the panel fades — keeps the GPU active
        // until the very last frame to avoid a visual pop.
        handleRef.current?.destroy();
        handleRef.current = null;
      }, exitMs);
    }
  }, [shouldRender]);

  if (!shouldRender) return null;
  if (state === "done") return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      data-cinematic-cold-open=""
      data-state={state}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--color-ink, #0e0b08)",
        opacity: state === "exiting" ? 0 : 1,
        transition:
          state === "exiting"
            ? "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
        // While playing, block pointer; exiting should pass through so the
        // visitor can interact with the page underneath the fade.
        pointerEvents: state === "exiting" ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Particle canvas mount target */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          // Slight radial vignette so the bloom reads as light-from-centre.
          background:
            "radial-gradient(circle at 50% 50%, rgba(164,122,44,0.08) 0%, rgba(14,11,8,0.0) 55%)",
        }}
      />

      {/* Centre mark — a single brass hairline that draws in as the bloom blooms.
          Subtle, but it gives the visitor's eye a focal point. */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      >
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="var(--color-gold, #b8893a)"
          strokeWidth="0.75"
          fill="none"
          style={{
            strokeDasharray: 138,
            strokeDashoffset: 138,
            animation: "sgv-cold-open-ring 1800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards",
          }}
        />
        <style>{`
          @keyframes sgv-cold-open-ring {
            to { stroke-dashoffset: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-cinematic-cold-open] svg circle { animation: none; stroke-dashoffset: 0; }
          }
        `}</style>
      </svg>
    </div>
  );
}
