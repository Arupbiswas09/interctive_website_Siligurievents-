"use client";

/**
 * GSAP Observer-powered hooks for Siligurievent.
 *
 * - `useScrollDirection()` — "up" | "down" | "idle"
 * - `useScrollVelocity()`  — smoothed velocity (px/ms)
 * - `useGrabInteraction()` — drag/grab primitive (rope, etc.)
 *
 * All hooks SSR-safely no-op until mounted in the browser. They register
 * the Observer plugin once via `@/lib/gsap/register`.
 *
 * NOTE: this file does emit the `"use client"` directive because the
 * exported symbols are React hooks. The rest of `lib/gsap/*` is plain
 * library code consumed BY client components.
 */

import "@/lib/gsap/register";
import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

// ============================================================
// useScrollDirection
// ============================================================

export type ScrollDirection = "up" | "down" | "idle";

/**
 * Tracks the last scroll direction at a coarse grain ("up" | "down").
 * Idle is reported when the user hasn't scrolled in `idleDelayMs` ms.
 * Useful for header show/hide patterns.
 */
export function useScrollDirection(idleDelayMs: number = 240): ScrollDirection {
  const [dir, setDir] = useState<ScrollDirection>("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,scroll",
      onUp: () => {
        setDir("up");
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setDir("idle"), idleDelayMs);
      },
      onDown: () => {
        setDir("down");
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setDir("idle"), idleDelayMs);
      },
    });

    return (): void => {
      if (idleTimer) clearTimeout(idleTimer);
      observer.kill();
    };
  }, [idleDelayMs]);

  return dir;
}

// ============================================================
// useScrollVelocity
// ============================================================

/**
 * Returns a smoothed scroll velocity (px per frame). Smoothing uses a
 * one-pole low-pass filter so consumers can drive blur/skew values
 * without juddery readouts. Caps at the supplied maximum.
 *
 * The returned value is the same number on every render — to consume it
 * without re-rendering on every frame, read `ref.current` instead by
 * also calling `useScrollVelocityRef`.
 */
export function useScrollVelocity(opts?: {
  smoothing?: number;
  max?: number;
}): number {
  const smoothing = opts?.smoothing ?? 0.18;
  const max = opts?.max ?? 4000;
  const [velocity, setVelocity] = useState(0);
  const valueRef = useRef(0);
  const reportedRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    let lastTs = performance.now();
    let lastY = window.scrollY;
    let stopped = false;

    const tick = (): void => {
      if (stopped) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastTs);
      const y = window.scrollY;
      const instantaneous = Math.min(max, Math.abs((y - lastY) / dt) * 1000);
      // One-pole low-pass: v += (target - v) * smoothing
      const next = valueRef.current + (instantaneous - valueRef.current) * smoothing;
      valueRef.current = next;
      // Only push to React if the change is large enough to matter — avoids
      // re-renders on tiny noise.
      if (Math.abs(next - reportedRef.current) > 1) {
        reportedRef.current = next;
        setVelocity(next);
      }
      lastTs = now;
      lastY = y;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return (): void => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [smoothing, max]);

  return velocity;
}

// ============================================================
// useGrabInteraction
// ============================================================

export type GrabInteractionState = {
  isDragging: boolean;
  /** Current drag delta along Y (px); resets to 0 on release. */
  dragY: number;
};

export type GrabInteractionApi = GrabInteractionState & {
  /** Call to release the grab programmatically (e.g. after a tween completes). */
  release: () => void;
  /** Reset dragY to 0 without firing release callbacks. */
  reset: () => void;
};

export type UseGrabInteractionOpts = {
  /** The element that becomes the drag target. */
  ref: RefObject<HTMLElement | null>;
  /** Maximum dragY (clamps after this). Default 240. */
  max?: number;
  /** Min dragY needed to count as a "pull" on release. Default 80. */
  threshold?: number;
  /** Called when the user releases past the threshold (a successful pull). */
  onCommit?: (info: { dragY: number; durationMs: number }) => void;
  /** Called on every release (commit or cancel). */
  onRelease?: (info: { dragY: number; committed: boolean }) => void;
};

/**
 * Tactile drag/grab primitive intended for the day↔night rope and any
 * other physical-feeling UI. Listens via GSAP `Observer` so it cleanly
 * supports mouse, touch and pointer events with the same handlers.
 *
 * The returned `dragY` reports the current grab offset along Y (positive
 * = pulled down). It's `0` when not dragging. Consumers can render the
 * rope position from this value directly. `release()` lets callers
 * dismiss the grab from outside (e.g. when a state machine commits).
 */
export function useGrabInteraction(
  opts: UseGrabInteractionOpts
): GrabInteractionApi {
  const { ref, onCommit, onRelease } = opts;
  const max = opts.max ?? 240;
  const threshold = opts.threshold ?? 80;

  const [state, setState] = useState<GrabInteractionState>({
    isDragging: false,
    dragY: 0,
  });

  const dragYRef = useRef(0);
  const startTsRef = useRef(0);
  const observerRef = useRef<ReturnType<typeof Observer.create> | null>(null);

  // We need a stable, mutable bag for the release/reset callbacks below.
  const apiRef = useRef({
    release: () => {
      // Replaced inside the effect with a live implementation.
    },
    reset: () => {
      dragYRef.current = 0;
      setState({ isDragging: false, dragY: 0 });
    },
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;

    const commit = (): void => {
      const dy = dragYRef.current;
      const committed = dy >= threshold;
      const durationMs = Math.max(0, performance.now() - startTsRef.current);
      dragging = false;
      dragYRef.current = 0;
      setState({ isDragging: false, dragY: 0 });
      if (committed && onCommit) onCommit({ dragY: dy, durationMs });
      if (onRelease) onRelease({ dragY: dy, committed });
    };

    apiRef.current.release = commit;

    observerRef.current = Observer.create({
      target: el,
      type: "pointer,touch",
      onPress: () => {
        dragging = true;
        startTsRef.current = performance.now();
        dragYRef.current = 0;
        setState({ isDragging: true, dragY: 0 });
      },
      onDrag: (self) => {
        if (!dragging) return;
        // Observer reports incremental deltaY since the last frame.
        const next = gsap.utils.clamp(
          -max,
          max,
          dragYRef.current + self.deltaY
        );
        dragYRef.current = next;
        setState({ isDragging: true, dragY: next });
      },
      onRelease: () => {
        if (!dragging) return;
        commit();
      },
    });

    return (): void => {
      observerRef.current?.kill();
      observerRef.current = null;
    };
  }, [ref, max, threshold, onCommit, onRelease]);

  return {
    ...state,
    release: () => apiRef.current.release(),
    reset: () => apiRef.current.reset(),
  };
}
