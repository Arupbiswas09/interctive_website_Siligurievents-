"use client";

import { useEffect } from "react";
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
 * Two non-obvious things this fixes:
 *
 * 1. `ScrollTrigger.defaults({ scroller })` tells every subsequent
 *    ScrollTrigger to read scroll position from our Lenis-driven proxy
 *    instead of `window`. Without it, pins + horizontal scrubs never
 *    release at the right scroll position.
 *
 * 2. Scroll-revealed sections were rendering blank because their
 *    `gsap.from(autoAlpha: 0)` state never resolved — the trigger had
 *    mis-measured the section position before images/fonts settled.
 *    We now refresh ScrollTrigger on a staggered schedule (50ms, 250ms,
 *    750ms, 1500ms, 3000ms), on the window `load` event, AND on every
 *    pathname change (client-side route nav). One of those will catch
 *    the right post-layout moment for every section.
 */
export function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.4,
    });

    const scroller = document.documentElement;

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length > 0 && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
          return value;
        }
        return lenis.animatedScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scroller.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({ scroller });

    const onScroll = (): void => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refresh = (): void => {
      ScrollTrigger.refresh();
    };

    // Staggered refresh schedule — catches the moment when layout settles
    // after font swap, hero image decoding, and async section mounts.
    const refreshTimings = [50, 250, 750, 1500, 3000];
    const settleTimers = refreshTimings.map((ms) =>
      window.setTimeout(refresh, ms),
    );

    // Once all images are loaded the layout height is final.
    const onWindowLoad = (): void => refresh();
    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    window.addEventListener("resize", refresh);

    return (): void => {
      settleTimers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", onWindowLoad);
      window.removeEventListener("resize", refresh);
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      ScrollTrigger.defaults({ scroller: undefined });
      ScrollTrigger.scrollerProxy(scroller, undefined);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  // On every client-side route change, kill any stale ScrollTriggers from
  // the previous page (their underlying DOM nodes are gone) and re-measure
  // the new layout. Without this, navigating from /services/haldi to
  // /services/mehendi leaves the new page with mis-positioned triggers
  // and reveal-on-scroll sections rendering blank.
  useEffect(() => {
    // Kill triggers whose trigger element is no longer in the document.
    ScrollTrigger.getAll().forEach((t) => {
      const tr = t.trigger as Element | null | undefined;
      if (tr && !document.contains(tr)) {
        t.kill();
      }
    });

    // Refresh on the next frame and again after a beat — new components
    // may not have laid out yet.
    const t1 = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    const t3 = window.setTimeout(() => ScrollTrigger.refresh(), 1000);

    // Reset scroll to top so the new page starts at its hero, not
    // mid-page (mirrors browser behaviour for hard nav).
    window.scrollTo(0, 0);

    return () => {
      window.cancelAnimationFrame(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname]);

  return <>{children}</>;
}
