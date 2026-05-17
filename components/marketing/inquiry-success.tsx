"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type Props = {
  name?: string;
  whatsappHref?: string;
  onDismiss?: () => void;
};

/**
 * Inquiry success overlay.
 *
 * Renders the post-submit confirmation per docs/05-PAGE-SPECS.md §5.10.
 * Subtle jasmine bloom animation — Lottie placeholder. While the real
 * Lottie file lands (asset pipeline in Sprint 4), we render an SVG bloom
 * that unfurls via CSS keyframes. Honors prefers-reduced-motion.
 *
 * Focus management:
 *   - Auto-focuses the dismiss button on mount.
 *   - Traps escape → onDismiss.
 *   - aria-live="polite" announces the success message.
 */
export function InquirySuccess({
  name,
  whatsappHref,
  onDismiss,
}: Props): React.ReactElement {
  const dismissRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    dismissRef.current?.focus();
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && onDismiss) onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-success-title"
      aria-describedby="inquiry-success-body"
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-[color:var(--color-bg)]/95 backdrop-blur-sm",
        "p-[var(--space-6)]",
      )}
    >
      <div className="flex max-w-[640px] flex-col items-center gap-[var(--space-6)] text-center">
        {/* Jasmine bloom — SVG placeholder for the eventual Lottie. */}
        <JasmineBloom reduced={prefersReducedMotion} />

        <h2
          id="inquiry-success-title"
          className="font-display text-[length:var(--text-3xl)] tracking-[var(--tracking-display)] leading-[1.05]"
        >
          {name ? `Thank you, ${name}.` : "Thank you."}
        </h2>

        <p
          id="inquiry-success-body"
          aria-live="polite"
          className="max-w-[48ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]"
        >
          Your note is with us. We reply within an hour, 9 AM – 9 PM IST. If
          we're past hours, you'll hear from us first thing tomorrow morning.
        </p>

        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-center gap-[var(--space-3)]">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Continue on WhatsApp
              <span aria-hidden="true">→</span>
            </a>
          )}
          <Link
            href="/portfolio"
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            See our work
          </Link>
          {onDismiss && (
            <button
              ref={dismissRef}
              type="button"
              onClick={onDismiss}
              className={buttonVariants({ variant: "link", size: "md" })}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function JasmineBloom({
  reduced,
}: {
  reduced: boolean;
}): React.ReactElement {
  // Six petals + center. CSS keyframes unfurl petals with stagger.
  const petals = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div
      aria-hidden="true"
      className="relative h-[120px] w-[120px]"
      data-reduced={reduced}
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <title>Jasmine bloom</title>
        <g transform="translate(60 60)">
          {petals.map((i) => (
            <g
              key={i}
              transform={`rotate(${(360 / petals.length) * i})`}
            >
              <ellipse
                cx="0"
                cy="-26"
                rx="10"
                ry="22"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-gold)"
                strokeWidth="1"
                style={{
                  transformOrigin: "0 0",
                  animation: reduced
                    ? "none"
                    : `petal-bloom 900ms var(--ease-out) ${i * 80}ms both`,
                }}
              />
            </g>
          ))}
          <circle r="6" fill="var(--color-gold)" />
        </g>
      </svg>

      <style>{`
        @keyframes petal-bloom {
          0%   { opacity: 0; transform: scale(0.3) translateY(8px); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
