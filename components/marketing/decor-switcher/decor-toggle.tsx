"use client";

import { cn } from "@/lib/utils";
import {
  useDecorKeyboardToggle,
  useDecorSwitcher,
} from "./decor-switcher-context";

type DecorToggleProps = {
  className?: string;
};

/**
 * DecorToggle
 *
 * Labelled "Day / Night" switch. Used on coarse-pointer devices as the
 * mobile replacement for the rope, and as a visible affordance in the
 * section header on every viewport.
 *
 * Visual: a pill with two label slots and a sliding indicator. The
 * indicator slides between slots based on `mode`. The element is the
 * accessible switch — `role="switch"`, `aria-checked` reflects "night".
 *
 * Keyboard: Space and Enter toggle (native button behaviour + scoped
 * Space handler via `useDecorKeyboardToggle`).
 */
export function DecorToggle({ className }: DecorToggleProps): React.ReactElement {
  const { mode, toggle } = useDecorSwitcher();
  const focusRef = useDecorKeyboardToggle<HTMLButtonElement>();
  const isNight = mode === "night";

  return (
    <div className={cn("inline-flex items-center gap-[var(--space-3)]", className)}>
      <button
        ref={focusRef}
        type="button"
        role="switch"
        aria-checked={isNight}
        aria-label="Toggle decoration lighting between day and night"
        onClick={toggle}
        className={cn(
          "relative inline-flex h-10 w-[148px] items-center",
          "rounded-full border border-[color:var(--color-border)]",
          "bg-[color:var(--color-bg-elevated)]",
          "transition-colors duration-500 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
          isNight && "bg-[color:var(--color-cool)] border-transparent",
        )}
      >
        {/* Sliding indicator */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 h-8 w-[68px] rounded-full",
            "transition-transform duration-500",
            "[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            "shadow-[0_2px_8px_rgba(0,0,0,0.18)]",
          )}
          style={{
            transform: `translateX(${isNight ? 76 : 4}px)`,
            background: isNight
              ? "linear-gradient(140deg, color-mix(in oklab, var(--color-cool) 60%, white) 0%, var(--color-cool) 100%)"
              : "linear-gradient(140deg, #FFF6DC 0%, var(--color-gold-soft) 100%)",
          }}
        />

        {/* Day label */}
        <span
          className={cn(
            "relative z-10 flex-1 text-center",
            "text-[length:var(--text-xs)] font-medium uppercase",
            "tracking-[var(--tracking-eyebrow)]",
            "transition-colors duration-300",
            isNight
              ? "text-[color:var(--color-ink-soft)]"
              : "text-[color:var(--color-ink)]",
          )}
        >
          Day
        </span>

        {/* Night label */}
        <span
          className={cn(
            "relative z-10 flex-1 text-center",
            "text-[length:var(--text-xs)] font-medium uppercase",
            "tracking-[var(--tracking-eyebrow)]",
            "transition-colors duration-300",
            isNight
              ? "text-[color:var(--color-bg)]"
              : "text-[color:var(--color-ink-soft)]",
          )}
        >
          Night
        </span>
      </button>
    </div>
  );
}
