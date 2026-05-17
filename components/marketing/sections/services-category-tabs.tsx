"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type Tab = {
  /** URL slug — used as `?cat=...` query param. */
  slug: string;
  /** Visible label. */
  label: string;
};

type ServicesCategoryTabsProps = {
  tabs: ReadonlyArray<Tab>;
  /** Currently active tab slug. Resolved server-side from `searchParams`. */
  activeSlug: string;
};

/**
 * Services category tab strip.
 *
 * URL is the source of truth: `?cat=weddings`. We mutate it via
 * `router.replace` (no scroll) inside a `useTransition` so the page can
 * stream the filtered grid without hydration thrash.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.3 §2.
 * Why client: tabs read/write `searchParams` and animate the active rail.
 */
export function ServicesCategoryTabs({
  tabs,
  activeSlug,
}: ServicesCategoryTabsProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const dispMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // SIG-02 "Sindoor" — when the active tab changes, briefly animate the
  // SVG turbulence + displacement-map scale so the grid below appears
  // to "melt" between states. Reduced motion = no morph (CSS handles the
  // fade via tabpanel re-render). Targets a globally addressable filter
  // that the consumer (`services-grid`) opts into via `filter:url(#...)`.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const map = dispMapRef.current;
    if (!map) return;

    const proxy = { scale: 0 };
    const tl = gsap.timeline({
      onUpdate: () => {
        map.setAttribute("scale", String(proxy.scale));
      },
      onComplete: () => {
        map.setAttribute("scale", "0");
      },
    });
    tl.to(proxy, { scale: 12, duration: 0.24, ease: "power2.out" }).to(
      proxy,
      { scale: 0, duration: 0.36, ease: "power2.in" },
    );

    return () => {
      tl.kill();
      map.setAttribute("scale", "0");
    };
  }, [activeSlug, prefersReducedMotion]);

  const onSelect = useCallback(
    (slug: string): void => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (slug === tabs[0]?.slug) {
        // Default tab — remove the query for cleaner URLs.
        params.delete("cat");
      } else {
        params.set("cat", slug);
      }
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, searchParams, tabs],
  );

  return (
    <Section tone="default" spacing="sm" id="services-tabs">
      {/* SIG-02 "Sindoor" turbulence morph filter — shared with the grid
          below. The filter id is stable so `services-grid` can opt into
          it via `filter: url(#tab-morph)`. Reduced motion never tweens
          the displacement scale so the grid renders crisply. */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        focusable="false"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter id="tab-morph" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.04"
              numOctaves={2}
              seed={3}
            />
            <feDisplacementMap
              ref={dispMapRef}
              in="SourceGraphic"
              scale="0"
            />
          </filter>
        </defs>
      </svg>

      <Container>
        <div
          role="tablist"
          aria-label="Service categories"
          aria-busy={pending}
          className={cn(
            "flex flex-wrap items-center gap-[var(--space-2)]",
            "border-b border-[color:var(--color-border)]",
            "pb-[var(--space-3)]",
          )}
        >
          {tabs.map((tab) => {
            const active = tab.slug === activeSlug;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`tabpanel-${tab.slug}`}
                id={`tab-${tab.slug}`}
                onClick={() => onSelect(tab.slug)}
                className={cn(
                  "relative inline-flex items-center",
                  "px-[var(--space-4)] py-[var(--space-3)]",
                  "text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-tight)]",
                  "transition-colors duration-200",
                  "cursor-pointer select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
                  active
                    ? "text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                )}
              >
                {tab.label}
                {/* Active rail — animates via transition; survives reduced motion. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[var(--space-4)] right-[var(--space-4)] -bottom-[calc(var(--space-3)+1px)]",
                    "h-[2px] origin-left transition-[transform,background-color] duration-300",
                    active
                      ? "scale-x-100 bg-[color:var(--color-accent)]"
                      : "scale-x-0 bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
