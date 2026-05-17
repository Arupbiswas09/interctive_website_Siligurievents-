"use client";

import { useEffect, useState } from "react";

/**
 * Reads `(prefers-reduced-motion: reduce)` and reactively updates if the
 * user toggles the OS setting. SSR-safe: returns `false` until mounted.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(media.matches);

    const onChange = (event: MediaQueryListEvent): void => {
      setPrefersReduced(event.matches);
    };

    media.addEventListener("change", onChange);
    return (): void => media.removeEventListener("change", onChange);
  }, []);

  return prefersReduced;
}
