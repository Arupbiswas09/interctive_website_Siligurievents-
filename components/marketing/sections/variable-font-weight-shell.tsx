"use client";

import { useEffect, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
import { scrollVelocityFontWeight } from "@/lib/gsap";

type VariableFontWeightShellProps = {
  children: ReactNode;
  /** Selector resolved within this shell to find the heading to drive. */
  headingSelector?: string;
  /** Minimum weight axis at rest. Default 300. */
  min?: number;
  /** Maximum weight axis at full velocity. Default 700. */
  max?: number;
  className?: string;
};

/**
 * SIG-05 "Bhaar" — drives a variable-font `wght` axis from scroll
 * velocity on the first matching heading inside the shell. Sets
 * `--display-wght` and an inline `font-variation-settings` so any
 * variable Cormorant Garamond fallback (or future Reckless Neue
 * variable) picks it up. Graceful no-op on static fonts.
 *
 * Honours `prefers-reduced-motion` (locked to midpoint inside the
 * factory) and cleans up on unmount via `gsap.context.revert()`.
 */
export function VariableFontWeightShell({
  children,
  headingSelector = "h1, h2, h3",
  min = 300,
  max = 700,
  className,
}: VariableFontWeightShellProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const heading = wrap.querySelector<HTMLElement>(headingSelector);
    if (!heading) return;

    // Inline binding so the CSS variable flows into the type axis even
    // without a stylesheet hook. Cap weight to the 300–700 contract.
    heading.style.fontVariationSettings = '"wght" var(--display-wght, 400)';
    heading.style.setProperty("--display-wght", String(min));
    // The factory writes to `--wght`; we mirror to `--display-wght` via a
    // small observer-free tick: passing the same heading element below
    // means it sets `--wght`; we shim by aliasing via `style.setProperty`.
    // Cleanest: drive the var the factory uses directly on the heading.
    const cleanup = scrollVelocityFontWeight({
      target: heading,
      min,
      max,
    });

    // Mirror `--wght` → `--display-wght` on the same node so consumer
    // selectors can read either name. We poll via rAF only while alive.
    let raf = 0;
    const mirror = (): void => {
      const v = heading.style.getPropertyValue("--wght");
      if (v) heading.style.setProperty("--display-wght", v);
      raf = requestAnimationFrame(mirror);
    };
    raf = requestAnimationFrame(mirror);

    return (): void => {
      cancelAnimationFrame(raf);
      heading.style.removeProperty("--wght");
      heading.style.removeProperty("--display-wght");
      heading.style.fontVariationSettings = "";
      cleanup();
    };
  }, [headingSelector, min, max]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
