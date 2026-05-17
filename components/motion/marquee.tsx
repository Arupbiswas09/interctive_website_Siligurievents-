"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type MarqueeProps = {
  children: React.ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Reverse the scroll direction. */
  reverse?: boolean;
  /** Pause animation when cursor enters. */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * MO-05 — Marquee
 * Infinite horizontal scroll. Content is duplicated for a seamless loop.
 * Reduced motion: shows content static, no animation.
 */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion) {
      setReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Translate the track by half its width (the original copy width),
      // since we render content twice for a seamless loop.
      const tween = gsap.to(track, {
        xPercent: reverse ? 50 : -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
      setReady(true);

      if (pauseOnHover) {
        const onEnter = (): void => {
          gsap.to(tween, { timeScale: 0, duration: 0.4 });
        };
        const onLeave = (): void => {
          gsap.to(tween, { timeScale: 1, duration: 0.4 });
        };
        track.addEventListener("mouseenter", onEnter);
        track.addEventListener("mouseleave", onLeave);
        return (): void => {
          track.removeEventListener("mouseenter", onEnter);
          track.removeEventListener("mouseleave", onLeave);
        };
      }
    }, track);

    return (): void => {
      ctx.revert();
    };
  }, [speed, reverse, pauseOnHover, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden", className)}
      data-ready={ready}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap will-change-transform"
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
