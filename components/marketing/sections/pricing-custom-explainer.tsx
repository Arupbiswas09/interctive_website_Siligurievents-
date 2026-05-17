import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * Pricing — "Everything custom" explainer.
 * Per docs/05-PAGE-SPECS.md §5.7 §4.
 *
 * Two-column editorial. Bands are reference points; the quote is custom.
 */
export function PricingCustomExplainer(): React.ReactElement {
  return (
    <Section tone="elevated" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12 md:gap-[var(--space-16)]">
          <div className="md:col-span-5">
            <Eyebrow>Our approach</Eyebrow>
            <DisplayHeading
              as="h2"
              size="lg"
              text="Every event we touch is custom."
              className="mt-[var(--space-3)] text-balance"
            />
          </div>

          <div className="flex flex-col gap-[var(--space-5)] md:col-span-7">
            <RevealOnScroll>
              <p className="text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink)]">
                The bands above are reference points — not menu prices. We
                build to your venue, your guest list, your story. A ₹₹ wedding
                in Bagdogra is not the same as a ₹₹ wedding in a Dooars
                tea-estate, even if both sit in the same tier.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                Every quote we send walks line-by-line through what's
                included — design, florals, lighting, set-build, crew,
                logistics — so you know exactly what your money buys. No
                packages-disguised-as-templates, no surprises on the day.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.18}>
              <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                Tell us your event date, guest count and one venue option.
                We'll come back with a tailored proposal — usually within
                twenty-four hours.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </Section>
  );
}
