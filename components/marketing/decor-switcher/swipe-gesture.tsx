"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDecorSwitcher } from "./decor-switcher-context";

type SwipeGestureProps = {
  children: ReactNode;
  /** Minimum vertical travel (px) to register as a swipe-down. */
  threshold?: number;
  /**
   * Maximum horizontal drift allowed (px) before we ignore the gesture
   * as "not a vertical swipe".
   */
  maxHorizontalDrift?: number;
  /** Maximum time (ms) from touch-start to touch-end for the gesture. */
  maxDurationMs?: number;
  className?: string;
};

/**
 * SwipeGesture
 *
 * Wraps the switcher section's interactive surface and triggers
 * `toggle()` when the user swipes vertically inside it.
 *
 * Touch-only — we register `touchstart`/`touchend` directly and bail
 * out on mouse/pointer input (the rope owns desktop interaction).
 *
 * Detection rules:
 *  - Vertical travel ≥ `threshold` (default 60px) in either direction
 *    (swipe-down lights the room; swipe-up wakes it back up).
 *  - Horizontal drift ≤ `maxHorizontalDrift` (40px).
 *  - Duration ≤ `maxDurationMs` (700ms).
 *  - The touch must NOT have started on an interactive element
 *    (button/link/input) — we don't want to swallow taps on the toggle.
 */
export function SwipeGesture({
  children,
  threshold = 60,
  maxHorizontalDrift = 40,
  maxDurationMs = 700,
  className,
}: SwipeGestureProps): React.ReactElement {
  const { toggle } = useDecorSwitcher();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let active = false;

    const isInteractive = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest('button, a, input, textarea, select, [role="switch"]'),
      );
    };

    const onStart = (event: TouchEvent): void => {
      if (isInteractive(event.target)) {
        active = false;
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      active = true;
    };

    const onEnd = (event: TouchEvent): void => {
      if (!active) return;
      active = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;
      if (dt > maxDurationMs) return;
      if (Math.abs(dx) > maxHorizontalDrift) return;
      if (Math.abs(dy) < threshold) return;
      toggle();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });

    return (): void => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [threshold, maxHorizontalDrift, maxDurationMs, toggle]);

  return (
    <div ref={wrapRef} className={cn(className)}>
      {children}
    </div>
  );
}
