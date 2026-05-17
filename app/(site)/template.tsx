"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Site template — runs on EVERY route change inside the `(site)` group
 * (Next.js 16 contract). Unlike `layout.tsx`, this re-mounts; we use it
 * to apply a very subtle scale + opacity ramp on incoming content so the
 * route swap reads as a deliberate film cut, not a yank.
 *
 * Layered with `<Curtain>` (mounted via `<TransitionProvider>` in the
 * sibling layout): the curtain owns the brass sweep at viewport scale,
 * this template owns the micro-tween of the content beneath it.
 *
 * Reduced motion: zero transform, single 150ms cross-fade. Same code path
 * — Framer Motion's `useReducedMotion` flips off `scale` automatically
 * since we honour it explicitly below.
 */

const ENTER_DURATION = 0.42; // seconds

export default function SiteTemplate({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Keyed on pathname so Framer Motion treats each route as a fresh mount
  // — guarantees the enter tween re-fires even if React reconciles the
  // template subtree across navigations.
  return (
    <motion.div
      key={pathname ?? "root"}
      // Slight scale curve: 0.98 → 1.02 → 1.0 conveys "settling in"
      // without ever crossing a perceptible threshold. Opacity 0.6 → 1.0
      // so the page never feels invisible mid-arrival.
      initial={reduced ? { opacity: 0 } : { opacity: 0.6, scale: 0.98 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={
        reduced
          ? { duration: 0.15, ease: "linear" }
          : {
              duration: ENTER_DURATION,
              // Approximates EASE.brass (matches the curtain's display ease).
              ease: [0.16, 0.84, 0.22, 1],
              // Independent overshoot on scale to land at 1.0 cleanly.
              scale: { duration: ENTER_DURATION, ease: [0.16, 0.84, 0.22, 1] },
            }
      }
      // No exit — Next 16 unmounts the template synchronously on nav.
      // The curtain's outgoing sweep is what the user sees during exit;
      // the template re-enters on the new route with this tween.
      style={{
        // Important: do not introduce a stacking context that would trap
        // children's `position: fixed`. `willChange` is enough.
        willChange: reduced ? "opacity" : "opacity, transform",
        // Avoid `transform-origin: center` interacting with full-bleed
        // hero images on routes that use 100vw layouts.
        transformOrigin: "50% 40%",
      }}
    >
      {children}
    </motion.div>
  );
}
