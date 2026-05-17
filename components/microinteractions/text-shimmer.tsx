"use client";

/**
 * TextShimmer — subtle brass-foil sweep across text. CSS only, ~6s loop.
 *
 * Implementation: a linear-gradient is used as the text's
 * `background-image` with `background-clip: text` and the foreground colour
 * set to transparent. The gradient's `background-position` animates from
 * 200% to -200% over the configured duration on an infinite loop.
 *
 * USE SPARINGLY — by default only on the hero's italic emphasis word. A
 * single line per page max.
 *
 * Reduced-motion: animation removed, text falls back to solid brass.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TextShimmerProps = {
  children: ReactNode;
  className?: string;
  /** Loop duration in seconds. Default 6. */
  duration?: number;
  /** Render element. Default "span". */
  as?: "span" | "em" | "strong";
};

export function TextShimmer({
  children,
  className,
  duration = 6,
  as: Tag = "span",
}: TextShimmerProps): React.ReactElement {
  return (
    <Tag
      className={cn("sgv-shimmer inline-block", className)}
      style={{ ["--sgv-shimmer-duration" as string]: `${duration}s` }}
    >
      <style>{`
        .sgv-shimmer {
          background-image: linear-gradient(
            110deg,
            var(--color-gold, var(--brass-leaf, #b8893a)) 0%,
            var(--color-gold, var(--brass-leaf, #b8893a)) 35%,
            var(--color-gold-soft, #e8d5a8) 50%,
            #ffffff 53%,
            var(--color-gold-soft, #e8d5a8) 56%,
            var(--color-gold, var(--brass-leaf, #b8893a)) 70%,
            var(--color-gold, var(--brass-leaf, #b8893a)) 100%
          );
          background-size: 250% 100%;
          background-position: 200% 0;
          -webkit-background-clip: text;
                  background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: sgv-shimmer-sweep var(--sgv-shimmer-duration, 6s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes sgv-shimmer-sweep {
          0%   { background-position: 200% 0; }
          60%  { background-position: -200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sgv-shimmer {
            animation: none;
            background: none;
            color: var(--color-gold, var(--brass-leaf, #b8893a));
            -webkit-text-fill-color: currentColor;
          }
        }
      `}</style>
      {children}
    </Tag>
  );
}
