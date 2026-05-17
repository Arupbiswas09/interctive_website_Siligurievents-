"use client";

import { cn } from "@/lib/utils";
import type { DecorPair } from "@/lib/cms/decor-pairs";
import { DecorPairCard } from "./decor-pair-card";

type DecorGridProps = {
  pairs: ReadonlyArray<DecorPair>;
  className?: string;
};

/**
 * DecorGrid
 *
 * Lays out the four launch pairs as an editorial mosaic.
 *
 * Layout intent:
 *  - Mobile (<640px): single column, full-width.
 *  - Tablet (≥640px): 2 columns.
 *  - Desktop (≥1024px): 12-column grid with a deliberate, slightly
 *    asymmetric arrangement that uses aspect ratios as composition cues.
 *    First pair (mandap 4:5) → tall left column.
 *    Second pair (stage 16:9) → wide top-right.
 *    Third pair (haldi 1:1)  → square bottom-right.
 *    Fourth pair (bday 3:2)  → middle-right wide.
 *
 * The stagger sweep across cards is handled by each <DecorPairCard />
 * using its `index` prop — the parent doesn't need an orchestrating
 * timeline because every card already subscribes to the same context.
 */
export function DecorGrid({ pairs, className }: DecorGridProps): React.ReactElement {
  return (
    <div
      className={cn(
        "grid gap-[var(--space-4)] sm:gap-[var(--space-6)]",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-12",
        className,
      )}
      data-testid="decor-grid"
    >
      {pairs.map((pair, index) => (
        <DecorPairCard
          key={pair.pairId}
          pair={pair}
          index={index}
          className={cn(
            // Default span for sm/2-col layout
            "sm:col-span-1",
            // Bespoke desktop placement keyed by index so the mosaic
            // doesn't require CMS authoring of layout.
            index === 0 && "lg:col-span-5 lg:row-span-2",
            index === 1 && "lg:col-span-7",
            index === 2 && "lg:col-span-4",
            index === 3 && "lg:col-span-3",
            // Anything beyond the 4 launch pairs falls back to a balanced 4-col span.
            index >= 4 && "lg:col-span-4",
          )}
        />
      ))}
    </div>
  );
}
