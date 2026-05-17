"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  PACKAGE_CATEGORIES,
  type PackageCategory,
} from "@/lib/cms/packages";

type Props = {
  active: PackageCategory;
};

/**
 * Pricing — Category selector tabs.
 * URL state: ?category=weddings. Routes through next/navigation to keep
 * the active tab shareable + bookmarkable. Smooth transition via
 * `useTransition` while the Server Component re-renders the rows.
 *
 * Per docs/05-PAGE-SPECS.md §5.7 §2 — six categories.
 */
export function PricingCategorySelector({ active }: Props): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const select = useCallback(
    (slug: PackageCategory) => {
      const next = new URLSearchParams(params?.toString() ?? "");
      next.set("category", slug);
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}#packages`, {
          scroll: false,
        });
      });
    },
    [params, pathname, router],
  );

  return (
    <Section
      tone="default"
      spacing="sm"
      id="categories"
      className="sticky top-[72px] z-30 border-y border-[color:var(--color-border)] bg-[color:var(--color-bg)]/90 backdrop-blur-md md:top-[88px]"
    >
      <Container>
        <div
          role="tablist"
          aria-label="Pricing categories"
          className={cn(
            "flex w-full snap-x snap-mandatory gap-[var(--space-2)] overflow-x-auto",
            "py-[var(--space-3)]",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            pending && "opacity-80",
          )}
        >
          {PACKAGE_CATEGORIES.map((cat) => {
            const isActive = cat.slug === active;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`packages-${cat.slug}`}
                onClick={() => select(cat.slug)}
                className={cn(
                  "shrink-0 snap-start",
                  "rounded-[var(--radius-sm)]",
                  "px-[var(--space-5)] py-[var(--space-2)]",
                  "text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
                  "transition-[background-color,color,border-color] duration-200",
                  "border",
                  isActive
                    ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-bg)]"
                    : "border-[color:var(--color-border)] text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)]",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
