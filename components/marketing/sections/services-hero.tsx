import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { VariableFontWeightShell } from "./variable-font-weight-shell";

type ServicesHeroProps = {
  /** Plain-text H1; SplitterReveal handles the entrance. */
  headline: string;
  /** Editorial intro paragraph (≤60 words). */
  intro: string;
  /** Eyebrow label above the headline. */
  eyebrow?: string;
};

/**
 * Services index hero — editorial, no image (capability + intent matters more
 * than yet-another stock decor shot here).
 *
 * Spec: docs/05-PAGE-SPECS.md §5.3 §1.
 * Motion: SplitterReveal on H1, RevealOnScroll on intro.
 */
export function ServicesHero({
  headline,
  intro,
  eyebrow = "Our services",
}: ServicesHeroProps): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      {/* Editorial gradient field — no imagery yet (Sprint 3 fills SVC-* slots). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            background:
              "radial-gradient(ellipse at 15% 0%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 90% 40%, rgba(139,26,26,0.20) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 92%)",
          }}
        />
      </div>

      <Container>
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">{eyebrow}</Eyebrow>
          </RevealOnScroll>

          {/* SIG-05 "Bhaar" — variable-font weight pegged to scroll velocity.
              The shell finds the inner <h1> and drives `--display-wght`
              + `font-variation-settings` inline. Cormorant Garamond isn't
              variable today, so the value degrades gracefully when the
              axis isn't supported. */}
          <VariableFontWeightShell min={300} max={700} headingSelector="h1">
            <DisplayHeading
              as="h1"
              size="hero"
              split
              splitMode="words"
              text={headline}
              className="max-w-[22ch]"
            />
          </VariableFontWeightShell>

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {intro}
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
