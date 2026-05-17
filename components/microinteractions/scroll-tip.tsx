"use client";

/**
 * ScrollTip — a small "Scroll to explore" pill with a brass downward
 * chevron that bobs up and down. Auto-hides after the user scrolls past
 * the configured threshold (default 100px).
 *
 * Pure CSS for the bob animation; a single scroll listener flips a class
 * to fade the pill out — no per-frame React state.
 *
 * Accessibility: the pill is decorative (`aria-hidden`) but its inner
 * label is rendered as visible text so it doubles as content for
 * screen-zoom users. Reduced-motion: bob removed, fade preserved.
 */

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ScrollTipProps = {
  label?: string;
  /** Scroll distance (px) at which the pill fades out. Default 100. */
  threshold?: number;
  className?: string;
};

export function ScrollTip({
  label = "Scroll to explore",
  threshold = 100,
  className,
}: ScrollTipProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    let hidden = false;
    const onScroll = (): void => {
      const shouldHide = window.scrollY > threshold;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        el.dataset.hidden = String(shouldHide);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return (): void => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hidden="false"
      className={cn("sgv-scroll-tip", className)}
    >
      <style>{`
        .sgv-scroll-tip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
          border-radius: 9999px;
          border: 1px solid rgba(232, 213, 168, 0.25);
          background: rgba(11, 11, 11, 0.4);
          backdrop-filter: blur(8px);
          color: var(--color-gold-soft, #e8d5a8);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 1;
          transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
          user-select: none;
        }
        .sgv-scroll-tip[data-hidden="true"] {
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
        }
        .sgv-scroll-tip__chevron {
          width: 12px;
          height: 12px;
          color: var(--color-gold, var(--brass-leaf, #b8893a));
          animation: sgv-scroll-tip-bob 1.6s ease-in-out infinite;
        }
        @keyframes sgv-scroll-tip-bob {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50%      { transform: translateY(4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sgv-scroll-tip__chevron { animation: none; opacity: 0.85; }
          .sgv-scroll-tip { transition: opacity 320ms ease; }
        }
      `}</style>
      <span>{label}</span>
      <svg
        className="sgv-scroll-tip__chevron"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4l4 4 4-4" />
      </svg>
    </div>
  );
}
