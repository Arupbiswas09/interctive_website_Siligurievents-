"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * LenisProvider — smooth scroll synced with GSAP ScrollTrigger.
 *
 *  - Lenis drives the scroll; on each `scroll` event we call
 *    `ScrollTrigger.update()` so pins and scrubs stay in sync.
 *  - A single `ResizeObserver` on `document.body` debounces
 *    `ScrollTrigger.refresh()` so we don't thrash layout on every
 *    font swap, image decode, or async section mount.
 *  - On route change we kill stale triggers (their DOM is gone), run
 *    one debounced refresh, and use Lenis to jump to the top so we
 *    don't bypass its internal scroll state.
 */
export function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const onScroll = (): void => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let refreshTimer: number | null = null;
    const refreshDebounced = (): void => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        refreshTimer = null;
      }, 80);
    };

    // One observer covers font-swap, image decode, async mount, dynamic
    // section growth — all the things the old staggered refresh schedule
    // was guessing at.
    const ro = new ResizeObserver(refreshDebounced);
    ro.observe(document.body);

    // Final settle after document `load` (last image decoded).
    const onWindowLoad = (): void => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    return (): void => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      ro.disconnect();
      window.removeEventListener("load", onWindowLoad);
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  // On every client-side route change, kill any stale ScrollTriggers from
  // the previous page (their underlying DOM nodes are gone) and re-measure
  // the new layout. Scroll-to-top goes through Lenis so its internal
  // animatedScroll value stays in sync (a raw window.scrollTo would jolt
  // on the next wheel event).
  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => {
      const tr = t.trigger as Element | null | undefined;
      if (tr && !document.contains(tr)) t.kill();
    });

    const raf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
