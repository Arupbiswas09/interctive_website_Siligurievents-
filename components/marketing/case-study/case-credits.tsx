import type { ReactElement } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ProjectCredit } from "@/lib/cms/projects";

interface CaseCreditsProps {
  credits: ReadonlyArray<ProjectCredit>;
}

/**
 * Case study — "Credits". Photography, planning, florist, etc.
 * See docs/05 §5.6 section 8.
 *
 * Editorial split-rule layout: role on the left, name on the right, with
 * hairline dividers between rows. Server Component.
 */
export function CaseCredits({ credits }: CaseCreditsProps): ReactElement {
  if (credits.length === 0) return <></>;

  return (
    <Section tone="default" spacing="lg" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12">
          <div className="md:col-span-4">
            <RevealOnScroll>
              <Eyebrow tone="accent">07 · Credits</Eyebrow>
            </RevealOnScroll>
            <p className="mt-[var(--space-4)] max-w-[40ch] text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
              {/* TODO: localised intro copy from CMS SiteSettings. */}
              Every project is the product of a small, talented team. With
              gratitude.
            </p>
          </div>

          <div className="md:col-span-8">
            <dl className="flex flex-col">
              {credits.map((credit, idx) => (
                <RevealOnScroll key={`${credit.role}-${idx.toString()}`}>
                  <div className="flex flex-col gap-[var(--space-1)] border-t border-[color:var(--color-border)] py-[var(--space-5)] md:flex-row md:items-baseline md:justify-between md:gap-[var(--space-8)]">
                    <dt className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
                      {credit.role}
                    </dt>
                    <dd className="font-display text-[length:var(--text-xl)] leading-tight text-[color:var(--color-ink)]">
                      {credit.link ? (
                        <a
                          href={credit.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-4 hover:underline"
                        >
                          {credit.name}
                        </a>
                      ) : (
                        credit.name
                      )}
                    </dd>
                  </div>
                </RevealOnScroll>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
