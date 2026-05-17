import type { ReactElement } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ProjectTestimonial } from "@/lib/cms/projects";

interface CaseClientNoteProps {
  testimonial: ProjectTestimonial;
}

/**
 * Case study — "Client note". A testimonial quote credited to the client.
 * See docs/05 §5.6 section 7.
 *
 * Server Component. Quote is rendered as an editorial pull quote — display
 * typeface, generous tracking, italicised.
 */
export function CaseClientNote({ testimonial }: CaseClientNoteProps): ReactElement {
  return (
    <Section tone="gold" spacing="lg" as="section">
      <Container>
        <div className="mx-auto flex max-w-[1000px] flex-col items-start gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">06 · Client note</Eyebrow>
          </RevealOnScroll>

          <blockquote className="flex flex-col gap-[var(--space-6)]">
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text={`"${testimonial.quote}"`}
              className="italic"
            />
            <RevealOnScroll delay={0.2}>
              <footer className="flex items-center gap-[var(--space-3)] text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-[color:var(--color-ink-muted)]/40" />
                <cite className="not-italic">
                  {testimonial.author}
                  {testimonial.role ? (
                    <span className="ml-[var(--space-2)] text-[color:var(--color-ink-soft)]">
                      · {testimonial.role}
                    </span>
                  ) : null}
                </cite>
              </footer>
            </RevealOnScroll>
          </blockquote>
        </div>
      </Container>
    </Section>
  );
}
