"use client";

import { cloneElement, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

/**
 * SharedElement — formalises the `view-transition-name` contract for
 * cross-route shared-element transitions.
 *
 * Usage:
 *
 *   <SharedElement id={`project-cover-${slug}`}>
 *     <Image ... />
 *   </SharedElement>
 *
 * When the View Transitions API is supported, both endpoints (the portfolio
 * tile and the case-study cover) declare the same `view-transition-name`,
 * and the browser cross-fades + morphs the bounding boxes automatically.
 * When the API is unavailable, the wrapper is a no-op — GSAP Flip handles
 * the morph in `lib/gsap/scroll-triggers.ts#flipTransition`.
 *
 * Design notes:
 *   - We DO NOT introduce an extra DOM node. If `children` is a single
 *     element, we clone it with the merged style. If `children` is text /
 *     a fragment / multiple elements, we wrap with a `<span>` (display
 *     inherits from layout context).
 *   - The id MUST be globally unique per route render. Convention:
 *     `"<kind>-<slug>"`, e.g. `"project-cover-rinki-aditya-bengali-wedding-2025"`.
 *   - Pass `disabled` when conditional shared-element transitions are
 *     undesirable (e.g., the same component is rendered multiple times on
 *     one page and only one instance should "carry" the transition).
 */

export type SharedElementProps = {
  /**
   * Stable id used for `view-transition-name`. Must be unique across the
   * document while the element is mounted. Pair this exact id on both the
   * source (portfolio tile) and destination (case-study cover).
   */
  id: string;
  /**
   * The child to receive the `view-transition-name` style. If multiple
   * children are passed, they will be wrapped in a `<span>`.
   */
  children: ReactNode;
  /**
   * Skip wiring the view-transition-name. Useful for client-side
   * conditional dimming (e.g., when not in the LCP slot). Defaults to
   * `false`.
   */
  disabled?: boolean;
};

type StyledProps = {
  style?: CSSProperties;
};

export function SharedElement({
  id,
  children,
  disabled = false,
}: SharedElementProps): React.ReactElement {
  if (disabled) {
    return <>{children}</>;
  }

  // `viewTransitionName` is a CSS property; React 19 + TS DOM lib accepts
  // it on `CSSProperties` (`viewTransitionName?: string`). For older lib
  // versions we cast through `Record<string, string>` defensively.
  const transitionStyle: CSSProperties = {
    viewTransitionName: id,
  } as CSSProperties & Record<"viewTransitionName", string>;

  if (isValidElement(children)) {
    const child = children as ReactElement<StyledProps>;
    const childStyle: CSSProperties = child.props.style ?? {};
    const merged: CSSProperties = { ...childStyle, ...transitionStyle };
    return cloneElement(child, { style: merged });
  }

  return <span style={transitionStyle}>{children}</span>;
}
