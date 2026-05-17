"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SplitterReveal } from "@/components/motion/splitter";
import { variableFontWeight } from "@/lib/gsap/scroll-triggers";

type Level = "h1" | "h2" | "h3";

type DisplayHeadingProps = {
  /**
   * Plain-text heading. Required when `split` is true.
   * If you need inline emphasis (e.g. italic), pass `children` instead and
   * leave `split` undefined.
   */
  text?: string;
  children?: ReactNode;
  as?: Level;
  /** Apply SplitText reveal (MO-01). Requires `text`. */
  split?: boolean;
  splitMode?: "chars" | "words" | "lines";
  /** Apply variable font weight shift (SIG-05). */
  variableWeight?: boolean;
  /** Visual size override. Defaults derive from `as`. */
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  align?: "left" | "center";
  className?: string;
};

const sizeFor: Record<Level, NonNullable<DisplayHeadingProps["size"]>> = {
  h1: "xl",
  h2: "lg",
  h3: "md",
};

const sizeMap: Record<NonNullable<DisplayHeadingProps["size"]>, string> = {
  sm: "text-[length:var(--text-2xl)]",
  md: "text-[length:var(--text-3xl)]",
  lg: "text-[length:var(--text-4xl)]",
  xl: "text-[length:var(--text-5xl)]",
  hero: "text-[length:var(--text-6xl)]",
};

/**
 * DisplayHeading — H1/H2/H3 with Cormorant Garamond by default.
 *
 * Use `text` + `split` for SplitText reveals. Use `children` when you need
 * inline JSX (e.g. <em>, <span>). Two modes are intentionally separate
 * because splitting requires a plain string upstream.
 */
export function DisplayHeading({
  text,
  children,
  as = "h2",
  split = false,
  splitMode = "words",
  variableWeight = false,
  size,
  align = "left",
  className,
}: DisplayHeadingProps): React.ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  const resolvedSize = size ?? sizeFor[as];

  useEffect(() => {
    if (!variableWeight || !ref.current) return;
    const cleanup = variableFontWeight({ target: ref.current });
    return cleanup;
  }, [variableWeight]);

  const composed = cn(
    "font-display text-balance text-[color:var(--color-ink)]",
    sizeMap[resolvedSize],
    resolvedSize === "hero" || resolvedSize === "xl"
      ? "font-light leading-[0.96] tracking-[var(--tracking-display-tight)]"
      : "font-normal leading-[1.02] tracking-[var(--tracking-display)]",
    align === "center" && "text-center",
    variableWeight && "will-change-[font-variation-settings]",
    className
  );

  const Tag = as as React.ElementType;

  if (split && text) {
    return (
      <SplitterReveal
        as={as}
        text={text}
        mode={splitMode}
        className={composed}
      />
    );
  }

  return (
    <Tag ref={ref} className={composed}>
      {children ?? text}
    </Tag>
  );
}
