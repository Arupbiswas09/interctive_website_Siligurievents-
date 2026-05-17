import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  /** Visual width — default `default` (max 1440), `narrow` for editorial copy. */
  size?: "default" | "narrow" | "wide" | "full";
  className?: string;
};

const sizeMap: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-[1440px]",
  narrow: "max-w-[860px]",
  wide: "max-w-[1680px]",
  full: "max-w-none",
};

/**
 * Container — page-level responsive max-width with horizontal gutters.
 * The gutter scales from 16px to 32px via the `--gutter` design token.
 */
export function Container({
  children,
  as: Tag = "div",
  size = "default",
  className,
}: ContainerProps): React.ReactElement {
  const Element = Tag as ElementType;
  return (
    <Element
      className={cn(
        "mx-auto w-full",
        "px-[var(--gutter)]",
        sizeMap[size],
        className
      )}
    >
      {children}
    </Element>
  );
}
