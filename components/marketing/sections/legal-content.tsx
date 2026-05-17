import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";

export interface LegalTocItem {
  id: string;
  label: string;
}

export interface LegalContentProps {
  eyebrow: string;
  title: string;
  /** "DD MMM YYYY" — Indian English date convention. */
  lastUpdated: string;
  /** Anchors in document order for the sidebar TOC. */
  toc: ReadonlyArray<LegalTocItem>;
  /** Pre-formatted legal body as a tree of <section id> nodes. */
  children: ReactNode;
  /** Visible note at the top calling out placeholder status. */
  reviewNote?: string;
}

/**
 * Generic wrapper for legal pages with a sticky TOC and editorial spacing.
 * Server-rendered, no client JS — TOC is a plain <nav> with hash links.
 */
export function LegalContent({
  eyebrow,
  title,
  lastUpdated,
  toc,
  children,
  reviewNote,
}: LegalContentProps): React.ReactElement {
  return (
    <Section
      as="article"
      tone="default"
      spacing="lg"
      className="pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <Container size="default">
        <header className="flex flex-col gap-[var(--space-4)]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading as="h1" size="xl" text={title} className="max-w-[20ch]" />
          <p className="text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
            Last updated · {lastUpdated}
          </p>
          {reviewNote ? (
            <p
              role="note"
              className={cn(
                "mt-[var(--space-4)] max-w-[60ch] border-l border-[color:var(--color-gold)]",
                "px-[var(--space-4)] py-[var(--space-3)]",
                "text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]",
              )}
            >
              {reviewNote}
            </p>
          ) : null}
        </header>

        <div className="mt-[var(--space-16)] grid gap-[var(--space-12)] lg:grid-cols-[220px_1fr] lg:gap-[var(--space-16)]">
          <aside aria-label="Table of contents" className="lg:sticky lg:top-[120px] lg:self-start">
            <p className="mb-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
              Contents
            </p>
            <ol className="flex flex-col gap-[var(--space-2)] text-[length:var(--text-sm)]">
              {toc.map((item, idx) => (
                <li key={item.id} className="flex items-baseline gap-[var(--space-2)]">
                  <span aria-hidden="true" className="text-[color:var(--color-gold)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${item.id}`}
                    className="text-[color:var(--color-ink)] underline-offset-4 hover:text-[color:var(--color-accent)] hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div
            className={cn(
              "flex flex-col gap-[var(--space-10)]",
              "max-w-[68ch]",
              "[&_h2]:font-display [&_h2]:text-[length:var(--text-3xl)] [&_h2]:leading-tight [&_h2]:tracking-[var(--tracking-display)] [&_h2]:text-[color:var(--color-ink)]",
              "[&_h3]:font-display [&_h3]:text-[length:var(--text-xl)] [&_h3]:leading-tight [&_h3]:tracking-[var(--tracking-display)] [&_h3]:text-[color:var(--color-ink)]",
              "[&_p]:text-[length:var(--text-base)] [&_p]:leading-relaxed [&_p]:text-[color:var(--color-ink-muted)]",
              "[&_ul]:list-disc [&_ul]:pl-[var(--space-5)] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[var(--space-2)]",
              "[&_li]:text-[length:var(--text-base)] [&_li]:leading-relaxed [&_li]:text-[color:var(--color-ink-muted)]",
              "[&_a]:text-[color:var(--color-accent)] [&_a]:underline-offset-4 [&_a:hover]:underline",
              "[&_section]:flex [&_section]:flex-col [&_section]:gap-[var(--space-4)] [&_section]:scroll-mt-[120px]",
            )}
          >
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}
