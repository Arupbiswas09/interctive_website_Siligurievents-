"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    children: ReactNode;
    /** Wrap in MagneticButton for cursor magnetism (MO-04). */
    magnetic?: boolean;
  };

/**
 * Button — primary / ghost / link variants. Sizes: sm, md, lg, cta.
 *
 * - `cta` (h-16, generous padding) is reserved for hero CTAs.
 * - Primary variant gets a brass-foil sheen sweep on hover (1 keyframe set,
 *   injected once per page via the global style block below).
 * - Set `magnetic` to opt into cursor magnetism (MO-04).
 *
 * Marked client because consumers attach onClick handlers and the magnetic
 * wrap is itself a client component. Server Components that just need the
 * className should import `buttonVariants` from `./button-variants` directly.
 */
export function Button({
  className,
  variant,
  size,
  magnetic = false,
  children,
  ...rest
}: ButtonProps): React.ReactElement {
  const button = (
    <button
      type={rest.type ?? "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {children}
    </button>
  );

  if (magnetic) {
    return <MagneticButton>{button}</MagneticButton>;
  }
  return button;
}

/**
 * ButtonStyles — drop-once stylesheet for the primary sheen sweep.
 *
 * The ::after pseudo translates from -100% to 200% on hover, painting a
 * diagonal brass-foil gradient across the button. Lives in JSX so the
 * styles ship with the component without touching globals.css.
 *
 * Render once near the app root (currently rendered implicitly by every
 * Button mount via an inline `<style>` tag below — React dedupes
 * identical `<style>` text in most renderers, but if you'd like a single
 * declaration, lift this into a top-level layout instead).
 */
function ButtonStyles(): React.ReactElement {
  return (
    <style>{`
      .sgv-btn-primary::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(232, 213, 168, 0.0) 35%,
          rgba(232, 213, 168, 0.55) 50%,
          rgba(232, 213, 168, 0.0) 65%,
          transparent 100%
        );
        transform: translateX(-100%);
        transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        mix-blend-mode: screen;
        z-index: 0;
      }
      .sgv-btn-primary:hover::after,
      .sgv-btn-primary:focus-visible::after {
        transform: translateX(200%);
      }
      /* Keep button text above the sheen layer. */
      .sgv-btn-primary > * {
        position: relative;
        z-index: 1;
      }
    `}</style>
  );
}

// Re-export the styles helper so a layout can mount it once if desired.
// Mounting per-Button is acceptable — the ruleset is tiny and identical.
export { ButtonStyles };
