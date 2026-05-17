"use client";

/**
 * CursorText — declarative wrapper that swaps the custom cursor into its
 * "image" mode with a specific label while the user hovers a region.
 *
 * Usage:
 *   <CursorText label="Open story">
 *     <article>...</article>
 *   </CursorText>
 *
 * Implementation: applies `data-cursor="image"` and `data-cursor-label` to a
 * wrapping <span> (or an explicit `as` element). No React state, no event
 * listeners — the cursor reads attributes via DOM walk on pointerover. This
 * keeps the wrapper SSR-safe and free of hydration cost.
 *
 * `mode` defaults to "image" but may be overridden ("video", "draggable",
 * "link") for matching label-bearing modes.
 */

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import type { CursorMode } from "./custom-cursor";

type CursorTextProps = {
  /** Label rendered inside the cursor — kept short ("View", "Open", "Play"). */
  label: string;
  /** Cursor mode to apply on hover. Defaults to "image". */
  mode?: Extract<CursorMode, "image" | "video" | "draggable" | "link">;
  /**
   * When `true`, clones the single child and applies the data-attributes
   * directly to it (avoids an extra wrapping span). The child must accept
   * `data-*` attributes (i.e. any intrinsic element).
   */
  asChild?: boolean;
  className?: string;
  children: ReactNode;
};

export function CursorText({
  label,
  mode = "image",
  asChild = false,
  className,
  children,
}: CursorTextProps): React.ReactElement {
  const dataProps = {
    "data-cursor": mode,
    "data-cursor-label": label,
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...dataProps,
      className: [child.props.className as string | undefined, className].filter(Boolean).join(" "),
    });
  }

  return (
    <span className={className} {...dataProps}>
      {children}
    </span>
  );
}
