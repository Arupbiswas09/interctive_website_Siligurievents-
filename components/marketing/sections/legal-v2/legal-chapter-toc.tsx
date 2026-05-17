"use client";

/**
 * LegalChapterToc — sticky left-rail desktop TOC of chapters.
 *
 * Highlights the active chapter via IntersectionObserver. On mobile, this
 * component renders nothing — the article body is read top-to-bottom; the
 * mobile reader does not need a sticky rail.
 *
 * The active item gets a brass underline + font-medium ink. Clicks
 * smooth-scroll to the chapter and update the URL hash without a jump.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type LegalChapter = {
  readonly id: string;
  readonly title: string;
};

type LegalChapterTocProps = {
  chapters: ReadonlyArray<LegalChapter>;
};

export function LegalChapterToc({
  chapters,
}: LegalChapterTocProps): React.ReactElement | null {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");

  useEffect(() => {
    if (chapters.length === 0) return;
    if (typeof window === "undefined") return;

    const observed: HTMLElement[] = [];
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observed.push(el);
    });
    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    observed.forEach((el) => observer.observe(el));
    return (): void => observer.disconnect();
  }, [chapters]);

  if (chapters.length === 0) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ): void => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Document contents" className="hidden lg:block">
      <div className="sticky top-[120px]">
        <p
          className={cn(
            "mb-[var(--space-4)] font-mono uppercase",
            "tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
          )}
          style={{ fontSize: "11px", letterSpacing: "0.22em" }}
        >
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-px w-6 bg-current opacity-70 align-middle"
          />
          Chapters
        </p>
        <ul className="space-y-[var(--space-3)]">
          {chapters.map((c, idx) => {
            const active = c.id === activeId;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => handleClick(e, c.id)}
                  className={cn(
                    "group relative inline-flex items-baseline gap-3 py-1",
                    "font-body text-[length:var(--text-sm)] leading-snug",
                    "transition-colors duration-300",
                    active
                      ? "font-medium text-[color:var(--color-ink)]"
                      : "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-mono opacity-70",
                      active
                        ? "text-[color:var(--color-gold)]"
                        : "text-[color:var(--color-ink-muted)]",
                    )}
                    style={{ fontSize: "10px" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="relative">
                    {c.title}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-[color:var(--color-gold)]",
                        "transition-all duration-500",
                        active ? "w-full" : "w-0 group-hover:w-1/2",
                      )}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
