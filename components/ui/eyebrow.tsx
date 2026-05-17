import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: ReactNode;
  tone?: "default" | "accent" | "gold" | "muted";
  className?: string;
};

const toneMap: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  default: "text-[color:var(--color-ink-muted)]",
  accent: "text-[color:var(--color-accent)]",
  gold: "text-[color:var(--color-gold)]",
  muted: "text-[color:var(--color-ink-soft)]",
};

/**
 * Eyebrow — small uppercase tracker label that sits above section headings.
 * Tracking: 0.12em per design tokens.
 */
export function Eyebrow({
  children,
  tone = "default",
  className,
}: EyebrowProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[var(--space-2)]",
        "font-medium uppercase",
        "text-[length:var(--text-xs)]",
        "tracking-[var(--tracking-eyebrow)]",
        toneMap[tone],
        className
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-px w-6 bg-current opacity-60"
      />
      {children}
    </span>
  );
}
