"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import type { PortfolioProject } from "@/lib/cms/projects";

interface PortfolioMasonryProps {
  /** Server-rendered initial slice for SSR / SEO. */
  initialItems: ReadonlyArray<PortfolioProject>;
  /** Whether the API has more pages after the initial slice. */
  initialHasNext: boolean;
  /** 1-indexed page that produced `initialItems`. */
  initialPage: number;
}

/**
 * Justified masonry grid for /portfolio (per docs/05 §5.5).
 *
 * Variable column spans + aspect ratios driven by the image dimensions so
 * tiles read like an editorial spread, not a uniform grid. Tile hover:
 * image scale 1.04 + caption slide-up (per spec).
 *
 * Infinite-scroll: an `IntersectionObserver` sentinel at the foot of the
 * grid bumps `?page=N+1` and asks the router to re-fetch the server
 * component. Pagination state lives in the URL so deep links stay valid
 * (consumer pages should read `page` from `searchParams`).
 */
export function PortfolioMasonry({
  initialItems,
  initialHasNext,
  initialPage,
}: PortfolioMasonryProps): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(initialHasNext);

  // When the server returns a fresh slice (filter changed, page bumped),
  // mirror the navigation result back into local pagination state.
  useEffect(() => {
    setHasNext(initialHasNext);
    setIsLoading(false);
  }, [initialHasNext, initialItems]);

  const loadMore = useCallback((): void => {
    if (!hasNext || isLoading) return;
    setIsLoading(true);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", String(initialPage + 1));
    router.replace(`/portfolio?${params.toString()}`, { scroll: false });
  }, [hasNext, isLoading, searchParams, router, initialPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore();
          }
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return (): void => observer.disconnect();
  }, [hasNext, loadMore]);

  if (initialItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <section
      aria-label="Portfolio gallery"
      className="py-[var(--space-16)] md:py-[var(--space-24)]"
      // View Transitions API hook — crossfades the whole grid on filter change.
      style={{ viewTransitionName: "portfolio-grid" }}
    >
      <Container>
        <ul
          className={cn(
            "grid gap-[var(--space-4)] md:gap-[var(--space-6)]",
            "grid-cols-2 md:grid-cols-6",
          )}
        >
          {initialItems.map((project, idx) => (
            <MasonryTile key={project.slug} project={project} index={idx} />
          ))}
        </ul>

        {hasNext ? (
          <div
            ref={sentinelRef}
            aria-hidden="true"
            className="mt-[var(--space-12)] flex h-12 items-center justify-center"
          >
            <span
              className={cn(
                "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                "text-[color:var(--color-ink-soft)]",
                isLoading ? "animate-pulse" : "opacity-60",
              )}
            >
              {isLoading ? "Loading more" : "Scroll for more"}
            </span>
          </div>
        ) : (
          <p
            className={cn(
              "mt-[var(--space-12)] text-center",
              "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
              "text-[color:var(--color-ink-soft)]",
            )}
          >
            End of selected work
          </p>
        )}
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MasonryTile — span / row variants driven by index + image aspect.
// ---------------------------------------------------------------------------

interface MasonryTileProps {
  project: PortfolioProject;
  index: number;
}

/** Deterministic span pattern — keeps SSR + CSR markup identical. */
function getTileSpan(index: number, aspectRatio: number): {
  col: string;
  row: string;
} {
  // 6-col base; cycle through editorial spans to break the grid.
  const mod = index % 6;
  // Portrait (aspect < 1) gets 2-col by default; landscape can stretch wider.
  if (aspectRatio >= 1.6) {
    if (mod === 0 || mod === 3) return { col: "md:col-span-4", row: "md:row-span-1" };
    return { col: "md:col-span-3", row: "md:row-span-1" };
  }
  if (aspectRatio <= 0.9) {
    if (mod === 1 || mod === 4) return { col: "md:col-span-2", row: "md:row-span-2" };
    return { col: "md:col-span-3", row: "md:row-span-2" };
  }
  // Square-ish / 3:2 — medium.
  if (mod === 2) return { col: "md:col-span-4", row: "md:row-span-1" };
  if (mod === 5) return { col: "md:col-span-2", row: "md:row-span-1" };
  return { col: "md:col-span-3", row: "md:row-span-1" };
}

function MasonryTile({ project, index }: MasonryTileProps): ReactElement {
  const { coverImage } = project;
  const aspect = coverImage.width / coverImage.height;
  const { col, row } = getTileSpan(index, aspect);

  return (
    <li className={cn("col-span-2", col, row, "group relative")}>
      <Link
        href={`/portfolio/${project.slug}`}
        prefetch={false}
        className={cn(
          "relative block h-full w-full overflow-hidden",
          "rounded-[var(--radius-sm)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
        )}
        aria-label={`${project.title}, ${project.ceremonyName}, ${project.locationName} ${project.year}`}
      >
        <div
          className="relative w-full overflow-hidden bg-[color:var(--color-bg-elevated)]"
          style={{
            aspectRatio: `${coverImage.width} / ${coverImage.height}`,
            // View Transitions — the cover image is the shared element when
            // navigating into the case study. Per-slug name keeps tiles unique.
            viewTransitionName: `project-cover-${project.slug}`,
          }}
        >
          <Image
            src={coverImage.src}
            alt={coverImage.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(
              "object-cover",
              "transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-out)]",
              "group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:group-hover:scale-100",
            )}
            priority={index < 2}
          />

          {/* Scrim — appears on hover, slides caption up. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0",
              "bg-gradient-to-t from-black/55 via-black/10 to-transparent",
              "opacity-0 transition-opacity duration-300",
              "group-hover:opacity-100 motion-reduce:group-hover:opacity-100",
            )}
          />

          {/* Caption — slides up on hover. */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 p-[var(--space-4)] md:p-[var(--space-6)]",
              "translate-y-3 opacity-0 transition-[transform,opacity] duration-[400ms] ease-[var(--ease-out)]",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "motion-reduce:transform-none motion-reduce:opacity-100",
            )}
          >
            <p
              className={cn(
                "font-display text-[length:var(--text-xl)] leading-tight",
                "text-[#F5EDE0]",
              )}
            >
              {project.title}
            </p>
            <p
              className={cn(
                "mt-[var(--space-1)] text-[length:var(--text-xs)] uppercase",
                "tracking-[var(--tracking-eyebrow)] text-[#F5EDE0]/80",
              )}
            >
              {project.ceremonyName} · {project.locationName} · {project.year}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}

function EmptyState(): ReactElement {
  return (
    <section className="py-[var(--space-24)]">
      <Container>
        <div className="mx-auto max-w-[60ch] text-center">
          <p
            className={cn(
              "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
              "text-[color:var(--color-ink-soft)]",
            )}
          >
            No results
          </p>
          <h2 className="font-display mt-[var(--space-3)] text-[length:var(--text-3xl)] text-[color:var(--color-ink)]">
            Nothing matches that combination — yet.
          </h2>
          <p className="mt-[var(--space-4)] text-[color:var(--color-ink-muted)]">
            Try removing a filter, or browse the full set of case studies.
          </p>
        </div>
      </Container>
    </section>
  );
}
