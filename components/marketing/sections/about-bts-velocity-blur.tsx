"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { velocityBlur } from "@/lib/gsap";

type BtsVelocityBlurProps = {
  children: ReactNode;
  className?: string;
  role?: string;
  "aria-label"?: string;
};

/**
 * SIG-03 "Velocity Bend" — applies `velocityBlur` to the BTS row so it
 * subtly blurs + skews during fast scroll, decaying to 0 when scroll
 * stops. Lazy-mounts via IntersectionObserver so the GSAP ticker doesn't
 * tick before the row is anywhere near the viewport.
 *
 * The factory itself short-circuits on `prefers-reduced-motion` and
 * `Save-Data`, so this wrapper stays minimal.
 */
export function BtsVelocityBlur({
  children,
  className,
  role,
  "aria-label": ariaLabel,
}: BtsVelocityBlurProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mount, setMount] = useState(false);

  // Lazy gate — only mount the effect when the row is within 1× viewport.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setMount(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setMount(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mount) return;
    const node = ref.current;
    if (!node) return;
    const cleanup = velocityBlur({ target: node, maxBlur: 3, maxSkew: 4 });
    return cleanup;
  }, [mount]);

  return (
    <div ref={ref} className={className} role={role} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
