// Pure server-safe variant definitions for the Button. No client APIs.
// Server Components import buttonVariants from this file directly so the
// `"use client"` boundary of ./button.tsx isn't pulled into RSC graphs.

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  cn(
    "group relative inline-flex items-center justify-center gap-[var(--space-2)]",
    "font-medium tracking-[var(--tracking-tight)]",
    "rounded-[var(--radius-sm)]",
    // Premium feel: slight scale + colour ease on hover. Reduced-motion
    // reset in globals.css collapses durations to ~0 automatically.
    "transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
    "disabled:cursor-default disabled:opacity-50",
    "cursor-pointer select-none",
    // Containing box for the ::after sheen on primary. Safe to apply on
    // all variants — only primary draws the sweep.
    "overflow-hidden isolate",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-[color:var(--color-accent)] text-[color:var(--color-bg)]",
          "hover:bg-[color:var(--color-accent-deep)]",
          // Subtle lift on hover. Brass-foil sheen sweep handled by the
          // `sgv-btn-primary` class below (component-scoped CSS in button.tsx).
          "hover:scale-[1.02] active:scale-[0.99]",
          "sgv-btn-primary",
        ),
        ghost: cn(
          "bg-transparent text-[color:var(--color-ink)]",
          "border border-[color:var(--color-border)]",
          "hover:border-[color:var(--color-ink)] hover:bg-[color:var(--color-bg-elevated)]",
        ),
        gold: cn(
          "bg-[color:var(--color-gold)] text-white",
          "hover:bg-[color:var(--color-gold-deep)]",
          "hover:scale-[1.02] active:scale-[0.99]",
          "uppercase tracking-[0.14em] text-[length:var(--text-sm)]",
        ),
        outlineInk: cn(
          "bg-transparent text-[color:var(--color-ink)]",
          "border border-[color:var(--color-ink)]/35",
          "hover:border-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)]/5",
          "uppercase tracking-[0.14em] text-[length:var(--text-sm)]",
        ),
        link: cn(
          "bg-transparent px-0 text-[color:var(--color-accent)]",
          "underline-offset-4 hover:underline",
        ),
      },
      size: {
        sm: "h-9 px-[var(--space-4)] text-[length:var(--text-sm)]",
        md: "h-12 px-[var(--space-6)] text-[length:var(--text-base)]",
        lg: "h-14 px-[var(--space-8)] text-[length:var(--text-lg)]",
        cta: "h-16 px-[var(--space-12)] text-[length:var(--text-lg)] tracking-tight",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
