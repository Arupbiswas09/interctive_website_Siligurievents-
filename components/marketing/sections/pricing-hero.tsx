import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * Pricing — Hero.
 * Per docs/05-PAGE-SPECS.md §5.7 §1.
 * Headline + intro about how we quote. Bands only — no rupee numbers.
 */
export function PricingHero(): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(139,26,26,0.22) 0%, transparent 55%)",
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
        <div className="flex max-w-[1080px] flex-col gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">Pricing — honest bands</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text="Honest pricing bands. Custom quotes from there."
            className="max-w-[18ch]"
          />

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[62ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              Three tiers per category — Essence, Signature and Atelier —
              shown as ₹, ₹₹ and ₹₹₹ bands. Every event is built bespoke, so
              your final quote depends on guest count, location, season and the
              chapters of your celebration. We'd rather have a real conversation
              than publish a misleading sticker price.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="max-w-[60ch] text-[length:var(--text-base)] text-[color:var(--color-ink-soft)]">
              Looking for a number quickly? WhatsApp us your event type and
              guest count — we usually quote within the hour, 9 AM – 9 PM IST.
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
