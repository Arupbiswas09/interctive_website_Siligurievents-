"use client";

import { useEffect, useRef } from "react";
import "@/lib/gsap/register";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getIllustration } from "@/lib/illustrations/paths";

export type MarigoldPetalFallProps = {
  /** Max concurrent active petals. Default 8. */
  maxPetals?: number;
  /** Mean spawn interval in ms. Default 1200. */
  spawnIntervalMs?: number;
  /** Tone class for the petals. Default "gold". */
  tone?: "ink" | "gold" | "brass" | "current" | "accent";
  /** Wrapper class — usually `absolute inset-0` to fill a positioned parent. */
  className?: string;
};

type NavigatorConnectionLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

function isLowBandwidth(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & { connection?: NavigatorConnectionLike }
  ).connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") {
    return true;
  }
  return false;
}

const toneClass = {
  ink: "text-[color:var(--color-ink)]",
  gold: "text-[color:var(--color-gold)]",
  brass: "text-[color:var(--color-brass-leaf,var(--color-gold))]",
  accent: "text-[color:var(--color-accent)]",
  current: "text-current",
} as const;

/**
 * `<MarigoldPetalFall>` — continuous ambient petal-fall.
 *
 * Behaviour:
 *  • Spawns one petal every ~1.2s (jittered) from above the wrapper's top edge.
 *  • Random x within the wrapper. Falls full height with a sine-wave side
 *    sway, gentle rotation, terminal opacity fade-out.
 *  • Hard cap of `maxPetals` concurrently alive — prevents perf blowups.
 *  • Lazy: spawning is gated behind IntersectionObserver. We only start
 *    when the wrapper is in view.
 *  • Reduced motion → no spawning, nothing rendered.
 *  • Save-Data / 2G → no spawning, nothing rendered.
 *  • Auto-pauses spawning when the wrapper leaves the viewport.
 *
 * The wrapper itself is positioned via the caller (typically `absolute inset-0
 * pointer-events-none overflow-hidden` over a hero or 404 background).
 */
export function MarigoldPetalFall({
  maxPetals = 8,
  spawnIntervalMs = 1200,
  tone = "gold",
  className,
}: MarigoldPetalFallProps): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const data = getIllustration("marigold-petal");

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (prefersReducedMotion) return;
    if (isLowBandwidth()) return;

    let intervalId: number | null = null;
    let active = 0;
    let running = false;
    const tweens: Array<gsap.core.Tween> = [];

    const spawn = (): void => {
      if (!running) return;
      if (active >= maxPetals) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;

      const petal = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      petal.setAttribute("viewBox", data.viewBox);
      petal.setAttribute("preserveAspectRatio", "xMidYMid meet");
      petal.setAttribute("aria-hidden", "true");
      petal.style.position = "absolute";
      petal.style.top = "0";
      petal.style.left = "0";
      petal.style.pointerEvents = "none";
      petal.style.willChange = "transform, opacity";

      // Randomised petal size (small / medium / occasional larger).
      const sizeRoll = Math.random();
      const petalHeight = sizeRoll < 0.7 ? 18 : sizeRoll < 0.95 ? 28 : 38;
      const aspect = 40 / 60;
      petal.style.width = `${petalHeight * aspect}px`;
      petal.style.height = `${petalHeight}px`;

      // Build the petal layers as DOM nodes (cheap — we only have 2).
      data.layers.forEach((layer) => {
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        p.setAttribute("d", layer.d);
        if (layer.strokeOnly) {
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", "currentColor");
          p.setAttribute("stroke-width", String(layer.strokeWidth ?? 1));
          p.setAttribute("stroke-linecap", "round");
          p.setAttribute("stroke-linejoin", "round");
          p.setAttribute("opacity", String(layer.opacity ?? 1));
        } else {
          p.setAttribute("fill", layer.fill ?? "currentColor");
          p.setAttribute("opacity", String(layer.opacity ?? 1));
        }
        petal.appendChild(p);
      });

      wrap.appendChild(petal);
      active += 1;

      const startX = Math.random() * w;
      const startY = -petalHeight - 8;
      const endY = h + petalHeight + 8;
      const swayAmp = 16 + Math.random() * 28; // viewport px
      const swayFreq = 1.2 + Math.random() * 1.6; // full sine cycles over the fall
      const rotateStart = Math.random() * 60 - 30;
      const rotateEnd = rotateStart + (Math.random() * 240 - 120);
      const fallDuration = 6 + Math.random() * 4; // 6..10s
      const startOpacity = 0;
      const peakOpacity = 0.7 + Math.random() * 0.3;

      gsap.set(petal, {
        x: startX,
        y: startY,
        rotation: rotateStart,
        opacity: startOpacity,
      });

      // Sine-wave sway driven by a proxy progress object.
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        duration: fallDuration,
        ease: "none",
        onUpdate: () => {
          const t = proxy.p;
          // Fade in for first 12%, hold, then fade out for last 18%.
          let op = peakOpacity;
          if (t < 0.12) op = peakOpacity * (t / 0.12);
          else if (t > 0.82) op = peakOpacity * (1 - (t - 0.82) / 0.18);
          const x = startX + Math.sin(t * Math.PI * 2 * swayFreq) * swayAmp;
          const y = startY + (endY - startY) * t;
          const rot = rotateStart + (rotateEnd - rotateStart) * t;
          gsap.set(petal, { x, y, rotation: rot, opacity: op });
        },
        onComplete: () => {
          petal.remove();
          active -= 1;
          const idx = tweens.indexOf(tween);
          if (idx >= 0) tweens.splice(idx, 1);
        },
      });
      tweens.push(tween);
    };

    const tickStart = (): void => {
      if (running) return;
      running = true;
      // Stagger initial spawn so we don't get a synchronised burst.
      window.setTimeout(spawn, 200);
      const jitter = (): number =>
        spawnIntervalMs * (0.7 + Math.random() * 0.6);
      const schedule = (): void => {
        if (!running) return;
        intervalId = window.setTimeout(() => {
          spawn();
          schedule();
        }, jitter());
      };
      schedule();
    };

    const tickStop = (): void => {
      running = false;
      if (intervalId !== null) {
        window.clearTimeout(intervalId);
        intervalId = null;
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) tickStart();
            else tickStop();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(wrap);
    } else {
      tickStart();
    }

    return (): void => {
      observer?.disconnect();
      tickStop();
      for (const t of tweens) t.kill();
      // Clean up any remaining child SVGs.
      while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
    };
  }, [maxPetals, spawnIntervalMs, prefersReducedMotion, data]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative overflow-hidden",
        toneClass[tone],
        className
      )}
    />
  );
}
