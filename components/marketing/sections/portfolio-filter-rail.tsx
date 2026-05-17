"use client";

import { useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import type { ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { velocityBlur } from "@/lib/gsap";
import type { PortfolioFacets } from "@/lib/cms/projects";

interface PortfolioFilterRailProps {
  facets: PortfolioFacets;
  /** Resolved filter values (so server-rendered chips reflect URL state). */
  active: {
    category?: string;
    year?: number;
    location?: string;
  };
}

type FilterKey = "category" | "year" | "location";

/**
 * Sticky filter rail for `/portfolio` (per docs/05 §5.5 + §6.2 motion budget).
 *
 * - Sticks below the page header on scroll, with a subtle bottom hairline.
 * - State persists in the URL (`?category=wedding&year=2025&location=siliguri`)
 *   so deep links + sharing work. `useTransition` keeps the UI snappy during
 *   server re-render of the masonry below.
 * - Sets `view-transition-name: portfolio-grid` on the trigger area so the
 *   page can crossfade tiles when filters change (graceful no-op when the
 *   browser doesn't support View Transitions).
 */
export function PortfolioFilterRail({
  facets,
  active,
}: PortfolioFilterRailProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = useMemo(
    () => Boolean(active.category ?? active.year ?? active.location),
    [active.category, active.year, active.location],
  );

  const updateFilter = useCallback(
    (key: FilterKey, value: string | number | undefined): void => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      // Reset pagination on filter change — fresh slice always starts at p1.
      params.delete("page");
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [router, pathname, searchParams, startTransition],
  );

  const clearAll = useCallback((): void => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname, startTransition]);

  // SIG-03 "Velocity Bend" — chip row subtly blurs + skews during fast
  // scroll. The factory short-circuits on `prefers-reduced-motion` and
  // Save-Data so we just attach the ref unconditionally.
  const chipRowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = chipRowRef.current;
    if (!node) return;
    const cleanup = velocityBlur({
      target: node,
      maxBlur: 2,
      maxSkew: 3,
    });
    return cleanup;
  }, []);

  return (
    <div
      data-pending={isPending ? "true" : "false"}
      className={cn(
        "sticky z-30 backdrop-blur-md",
        "top-[64px] md:top-[72px]",
        "border-y border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg)]/85",
        "transition-colors",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex flex-col gap-[var(--space-4)] py-[var(--space-4)]",
            "md:flex-row md:items-center md:justify-between md:gap-[var(--space-8)]",
          )}
        >
          <div className="flex items-center gap-[var(--space-4)]">
            <Eyebrow tone="muted">Filter</Eyebrow>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className={cn(
                  "text-[length:var(--text-xs)] uppercase",
                  "tracking-[var(--tracking-eyebrow)]",
                  "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)]",
                  "transition-colors",
                )}
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div
            ref={chipRowRef}
            role="group"
            aria-label="Portfolio filters"
            className={cn(
              "flex flex-wrap items-center gap-[var(--space-3)]",
              "md:gap-[var(--space-4)]",
            )}
          >
            <FilterGroup
              label="Category"
              activeValue={active.category}
              options={facets.categories.map((c) => ({
                value: c.slug,
                label: c.label,
                count: c.count,
              }))}
              onChange={(v) => updateFilter("category", v)}
            />

            <span aria-hidden="true" className="hidden h-4 w-px bg-[color:var(--color-border)] md:block" />

            <FilterGroup
              label="Year"
              activeValue={active.year ? String(active.year) : undefined}
              options={facets.years.map((y) => ({
                value: String(y.value),
                label: String(y.value),
                count: y.count,
              }))}
              onChange={(v) => updateFilter("year", v ? Number(v) : undefined)}
            />

            <span aria-hidden="true" className="hidden h-4 w-px bg-[color:var(--color-border)] md:block" />

            <FilterGroup
              label="Location"
              activeValue={active.location}
              options={facets.locations.map((l) => ({
                value: l.slug,
                label: l.label,
                count: l.count,
              }))}
              onChange={(v) => updateFilter("location", v)}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterGroup — a labelled cluster of chips, single-select.
// ---------------------------------------------------------------------------

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterGroupProps {
  label: string;
  activeValue?: string;
  options: ReadonlyArray<FilterOption>;
  onChange: (value: string | undefined) => void;
}

function FilterGroup({
  label,
  activeValue,
  options,
  onChange,
}: FilterGroupProps): ReactElement {
  return (
    <fieldset className="flex flex-wrap items-center gap-[var(--space-2)]">
      <legend className="sr-only">{label}</legend>
      <span
        aria-hidden="true"
        className={cn(
          "mr-[var(--space-1)] text-[length:var(--text-xs)] uppercase",
          "tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
        )}
      >
        {label}
      </span>
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? undefined : opt.value)}
            className={cn(
              "group inline-flex items-center gap-[var(--space-1)]",
              "rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-1)]",
              "text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
              "transition-[color,background-color,border-color,transform] duration-200 ease-[var(--ease-out)]",
              // SIG-11 magnetic-feel — active chip lifts and gains a
              // subtle brass shadow on hover. Reduced motion bypasses
              // the transform via the global motion-reduce reset.
              "motion-safe:hover:-translate-y-[1px]",
              isActive
                ? cn(
                    "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-bg)]",
                    "motion-safe:-translate-y-[1px] shadow-[0_4px_18px_-8px_rgba(184,137,58,0.55)]",
                  )
                : "border-[color:var(--color-border)] text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)]",
            )}
          >
            {opt.label}
            <span
              aria-hidden="true"
              className={cn(
                "text-[length:var(--text-xs)] tabular-nums",
                isActive
                  ? "text-[color:var(--color-bg)]/70"
                  : "text-[color:var(--color-ink-soft)]",
              )}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}
