/**
 * LegalArticle — 12-col editorial layout for legal pages.
 *
 *  LEFT  (col-span-2, sticky)  → LegalChapterToc
 *  RIGHT (col-span-9 / col-start-3) → prose body
 *
 * The prose body renders one `<section>` per chapter with:
 *   - h2 italic display heading
 *   - drop-cap on the first paragraph of the first chapter
 *   - optional pull-quote treatment for emphasised paragraphs
 *   - brass hairline + small mandala glyph between chapters
 *
 * Generous spacing, font-body 16px, line-height 1.7 — meant for long
 * uninterrupted reading on light backgrounds.
 *
 * Server Component; only the TOC ships JS.
 */

import type { ReactNode } from "react";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { cn } from "@/lib/utils";
import {
  LegalChapterToc,
  type LegalChapter as TocChapter,
} from "./legal-chapter-toc";

export type LegalParagraph =
  | string
  | {
      kind: "pullquote";
      text: string;
    };

export type LegalChapter = {
  readonly id: string;
  readonly title: string;
  readonly body: ReadonlyArray<LegalParagraph>;
};

type LegalArticleProps = {
  chapters: ReadonlyArray<LegalChapter>;
  /** Optional content rendered above the chapter list (e.g. summary card). */
  children?: ReactNode;
};

export function LegalArticle({
  chapters,
  children,
}: LegalArticleProps): React.ReactElement {
  const tocChapters: ReadonlyArray<TocChapter> = chapters.map((c) => ({
    id: c.id,
    title: c.title,
  }));

  return (
    <div className="mt-[var(--space-16)] grid grid-cols-1 gap-[var(--space-12)] lg:grid-cols-12 lg:gap-[var(--space-8)]">
      {/* LEFT — sticky chapter rail, desktop only */}
      <aside className="lg:col-span-2 lg:col-start-1">
        <LegalChapterToc chapters={tocChapters} />
      </aside>

      {/* RIGHT — prose body */}
      <div className="lg:col-span-9 lg:col-start-4">
        {children}

        <div className="mt-[var(--space-16)] flex flex-col">
          {chapters.map((chapter, index) => (
            <Chapter
              key={chapter.id}
              chapter={chapter}
              isFirst={index === 0}
              isLast={index === chapters.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chapter({
  chapter,
  isFirst,
  isLast,
}: {
  chapter: LegalChapter;
  isFirst: boolean;
  isLast: boolean;
}): React.ReactElement {
  return (
    <>
      <section
        id={chapter.id}
        className="scroll-mt-32 mb-[var(--space-16)]"
        aria-labelledby={`${chapter.id}-heading`}
      >
        <header className="mb-[var(--space-8)] flex flex-col gap-[var(--space-2)]">
          <span
            aria-hidden="true"
            className="h-px w-12 bg-[color:var(--color-gold)] opacity-70"
          />
          <h2
            id={`${chapter.id}-heading`}
            className="font-display italic text-[color:var(--color-ink)]"
            style={{
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {chapter.title}
          </h2>
        </header>

        <div className="flex flex-col gap-[var(--space-6)]">
          {chapter.body.map((para, pIdx) => {
            if (typeof para !== "string") {
              return (
                <PullQuote
                  key={`${chapter.id}-pq-${pIdx}`}
                >
                  {para.text}
                </PullQuote>
              );
            }
            const dropCap = isFirst && pIdx === 0;
            return (
              <Paragraph
                key={`${chapter.id}-p-${pIdx}`}
                dropCap={dropCap}
              >
                {para}
              </Paragraph>
            );
          })}
        </div>
      </section>

      {/* Inter-chapter ornament — brass hairline + small mandala. */}
      {!isLast ? <ChapterDivider /> : null}
    </>
  );
}

function Paragraph({
  children,
  dropCap,
}: {
  children: ReactNode;
  dropCap?: boolean;
}): React.ReactElement {
  return (
    <p
      className={cn(
        "font-body text-[color:var(--color-ink)]",
        dropCap && "legal-dropcap",
      )}
      style={{
        fontSize: "clamp(16px, 1.05vw, 17px)",
        lineHeight: 1.75,
        letterSpacing: "0.005em",
      }}
    >
      {children}
      {/* Drop-cap styles — scoped via :where to avoid leaking. */}
      {dropCap ? (
        <style>{`
          .legal-dropcap::first-letter {
            float: left;
            font-family: var(--font-display);
            font-style: italic;
            font-weight: 400;
            font-size: 4.4em;
            line-height: 0.82;
            padding: 0.04em 0.14em 0 0;
            margin-right: 0.02em;
            color: var(--color-gold-deep);
          }
        `}</style>
      ) : null}
    </p>
  );
}

function PullQuote({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <blockquote
      className="relative my-[var(--space-6)] border-l border-[color:var(--color-gold)] pl-[var(--space-6)]"
      style={{ paddingLeft: "clamp(20px, 2vw, 32px)" }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[10px] -top-[6px] inline-block font-display text-[color:var(--color-gold)]"
        style={{
          fontSize: "44px",
          lineHeight: 1,
          fontStyle: "italic",
          fontWeight: 300,
        }}
      >
        &ldquo;
      </span>
      <p
        className="font-display italic text-[color:var(--color-ink)]"
        style={{
          fontSize: "clamp(20px, 2vw, 28px)",
          fontWeight: 300,
          lineHeight: 1.35,
          letterSpacing: "-0.005em",
        }}
      >
        {children}
      </p>
    </blockquote>
  );
}

function ChapterDivider(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="my-[var(--space-12)] flex items-center justify-center gap-[var(--space-4)]"
    >
      <span className="h-px flex-1 bg-[color:var(--color-border)]" />
      <span className="inline-block h-6 w-6 opacity-70">
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold-deep)"
          hueSecondary="var(--color-gold-deep)"
          className="h-full w-full"
        />
      </span>
      <span className="h-px flex-1 bg-[color:var(--color-border)]" />
    </div>
  );
}
