"use client";

/**
 * FocusRing — emits a global stylesheet enforcing a consistent brass
 * `:focus-visible` ring everywhere: 2px solid brass, 2px offset, 200ms
 * ease-in.
 *
 * Drop once at the top of `(site)/layout.tsx`. Safe to render multiple
 * times (React de-dupes identical <style> nodes in most renderers) but a
 * single mount is preferred for clarity.
 *
 * We deliberately scope to `:focus-visible` only — pointer focus stays
 * subtle. The ring is also lifted above siblings via a small `outline` (not
 * box-shadow) so it doesn't shift layout. A second `box-shadow` halo is
 * applied to give the brass glow the site deserves.
 */

export function FocusRing(): React.ReactElement {
  return (
    <style>{`
      :where(button, a, input, textarea, select, [tabindex], [role="button"], [role="link"], [role="tab"], [role="menuitem"]):focus-visible {
        outline: 2px solid var(--color-gold, var(--brass-leaf, #b8893a));
        outline-offset: 2px;
        transition:
          outline-offset 200ms ease-in,
          outline-color 200ms ease-in,
          box-shadow 200ms ease-in;
        box-shadow: 0 0 0 4px rgba(232, 213, 168, 0.18);
        border-radius: inherit;
      }
      /* Slight extra pop for primary CTAs and surfaces explicitly opting in. */
      :where([data-focus-prominent]):focus-visible {
        outline-offset: 3px;
        box-shadow: 0 0 0 6px rgba(232, 213, 168, 0.28);
      }
      /* Never paint an outline when focus arrived via pointer. */
      :where(button, a):focus:not(:focus-visible) {
        outline: none;
      }
      @media (prefers-reduced-motion: reduce) {
        :where(button, a, input, textarea, select, [tabindex]):focus-visible {
          transition: none;
        }
      }
    `}</style>
  );
}
