import { cn } from "@/lib/utils";

type SkipToContentProps = {
  /** Target element id. Defaults to "main". */
  targetId?: string;
  /** Visible label for the link. */
  label?: string;
};

/**
 * SkipToContent — an accessibility skip link.
 *
 * Visually hidden until it receives keyboard focus, then it slides into
 * view at the top of the viewport. Bypasses header/nav for screen
 * reader and keyboard users (WCAG 2.4.1 Bypass Blocks).
 *
 * Server Component — no client APIs, purely declarative.
 */
export function SkipToContent({
  targetId = "main",
  label = "Skip to main content",
}: SkipToContentProps): React.ReactElement {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Visually-hidden by default (sr-only-like clip but focusable).
        "sr-only",
        // When focused, lift it onto the page top-left as a real chip.
        "focus:not-sr-only",
        "focus:fixed focus:left-[var(--space-4)] focus:top-[var(--space-4)] focus:z-[100]",
        "focus:inline-flex focus:items-center focus:justify-center",
        "focus:h-11 focus:px-[var(--space-4)]",
        "focus:rounded-[var(--radius-sm)]",
        "focus:bg-[color:var(--color-ink)] focus:text-[color:var(--color-bg)]",
        "focus:text-[length:var(--text-sm)] focus:font-medium",
        "focus:shadow-[var(--shadow-elevated)]",
        "focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[color:var(--color-bg)]",
      )}
    >
      {label}
    </a>
  );
}
