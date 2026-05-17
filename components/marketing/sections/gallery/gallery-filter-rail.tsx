"use client";

/**
 * GalleryFilterRail — minimal standalone chip rail.
 *
 * Note: in production the rail is rendered *inside* `GalleryBentoGrid`
 * because filter state and tile presentation are tightly coupled. This
 * file is retained as a thin, reusable primitive in case a future page
 * wants to expose the rail elsewhere (e.g. on a /work landing strip).
 *
 * If you want to use it independently, lift state up:
 *   const [active, setActive] = useState("All");
 *   <GalleryFilterRail active={active} onChange={setActive} count={n} />
 */

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

export type FilterRailOption = { label: string };

export type GalleryFilterRailProps = {
  options: ReadonlyArray<FilterRailOption>;
  active: string;
  onChange: (next: string) => void;
  count: number;
  className?: string;
};

export function GalleryFilterRail({
  options,
  active,
  onChange,
  count,
  className,
}: GalleryFilterRailProps): ReactElement {
  return (
    <div
      className={cn(
        "sticky top-20 z-30 flex flex-col gap-[var(--space-3)] rounded-[var(--radius-md)] bg-[color:var(--color-bg)]/85 px-2 py-3 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className="font-mono text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {count.toString().padStart(2, "0")} pieces
        </span>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Ceremony category filter"
      >
        {options.map((opt) => {
          const isActive = opt.label === active;
          return (
            <button
              key={opt.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(opt.label)}
              className={cn(
                "rounded-full px-4 py-2 text-[length:var(--text-sm)] tracking-tight transition-[background-color,color,border-color,transform] duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
                isActive
                  ? "bg-[color:var(--color-gold-deep)] text-[color:var(--color-ink)] shadow-[0_6px_18px_-8px_rgba(168,123,63,0.55)]"
                  : "border border-[color:var(--color-ink)]/30 bg-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/70 hover:bg-[color:var(--color-bg-elevated)]",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
