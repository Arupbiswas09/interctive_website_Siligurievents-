import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  as?: ElementType;
  /** Visual tone — drives background colour. */
  tone?: "default" | "elevated" | "dark" | "gold";
  /** Vertical rhythm — `lg` for hero/showcase, `sm` for tight strips. */
  spacing?: "sm" | "md" | "lg" | "xl";
  className?: string;
  id?: string;
};

const toneMap: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-[color:var(--color-bg)] text-[color:var(--color-ink)]",
  elevated:
    "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-ink)]",
  dark: "bg-[#0E0B08] text-[#F5EDE0]",
  gold: "bg-[color:var(--color-gold-soft)] text-[color:var(--color-ink)]",
};

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-[var(--space-12)]",
  md: "py-[var(--space-16)] md:py-[var(--space-24)]",
  lg: "py-[var(--space-24)] md:py-[var(--space-32)]",
  xl: "py-[var(--space-32)] md:py-[var(--space-48)]",
};

/**
 * Section — vertical rhythm wrapper. Provides background tone + padding
 * so individual pages don't have to repeat the same Tailwind tokens.
 */
export function Section({
  children,
  as: Tag = "section",
  tone = "default",
  spacing = "md",
  className,
  id,
}: SectionProps): React.ReactElement {
  const Element = Tag as ElementType;
  return (
    <Element
      id={id}
      data-tone={tone}
      className={cn("relative w-full", toneMap[tone], spacingMap[spacing], className)}
    >
      {children}
    </Element>
  );
}
