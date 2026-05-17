"use client";

/**
 * Case study — Chapter Rail.
 *
 * Sticky left-rail TOC of chapters. Desktop-only (hidden under lg).
 * Highlights active chapter as the user scrolls — uses IntersectionObserver
 * on `#chapter-{numeral}` targets rendered by `CaseStudyChapters`.
 *
 * Pure client component. No GSAP — IntersectionObserver is sufficient.
 */

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface ChapterRailItem {
  numeral: string;
  title: string;
}

interface CaseStudyChapterRailProps {
  chapters: ReadonlyArray<ChapterRailItem>;
}

export function CaseStudyChapterRail({
  chapters,
}: CaseStudyChapterRailProps): ReactElement | null {
  const [active, setActive] = useState<string>(chapters[0]?.numeral ?? "");

  useEffect(() => {
    if (chapters.length === 0) return;

    const targets = chapters
      .map((c) => document.getElementById(`chapter-${c.numeral}`))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const numeral = entry.target.id.replace(/^chapter-/, "");
          if (entry.isIntersecting) {
            visible.set(numeral, entry.intersectionRatio);
          } else {
            visible.delete(numeral);
          }
        }
        if (visible.size === 0) return;
        const sorted = Array.from(visible.entries()).sort(
          (a, b) => b[1] - a[1],
        );
        const top = sorted[0];
        if (top) setActive(top[0]);
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((el) => observer.observe(el));
    return (): void => observer.disconnect();
  }, [chapters]);

  if (chapters.length === 0) return null;

  return (
    <nav
      aria-label="Chapters"
      className={cn(
        "pointer-events-none hidden lg:block",
        "fixed left-[var(--space-6)] top-1/2 z-30 -translate-y-1/2",
      )}
    >
      <ol className="pointer-events-auto flex flex-col gap-[var(--space-3)]">
        {chapters.map((c) => {
          const isActive = c.numeral === active;
          return (
            <li key={c.numeral}>
              <a
                href={`#chapter-${c.numeral}`}
                className={cn(
                  "group flex items-baseline gap-[var(--space-3)]",
                  "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                  "transition-[color,transform] duration-300 ease-out",
                  isActive
                    ? "translate-x-1 font-medium text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink-muted)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-display text-[length:var(--text-sm)] not-italic",
                    isActive
                      ? "text-[color:var(--color-gold)]"
                      : "text-[color:var(--color-ink-soft)]",
                  )}
                >
                  {c.numeral}
                </span>
                <span
                  className={cn(
                    "relative",
                    "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px",
                    "after:bg-[color:var(--color-gold)] after:transition-[transform,opacity] after:duration-300",
                    isActive
                      ? "after:scale-x-100 after:opacity-100"
                      : "after:origin-left after:scale-x-0 after:opacity-0 group-hover:after:scale-x-50 group-hover:after:opacity-60",
                  )}
                >
                  {c.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
