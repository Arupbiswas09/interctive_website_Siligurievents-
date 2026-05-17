import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * Contact — Hero.
 * Per docs/05-PAGE-SPECS.md §5.10 §1.
 */
export function ContactHero(): React.ReactElement {
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
              "radial-gradient(ellipse at 80% 10%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 10% 60%, rgba(139,26,26,0.20) 0%, transparent 55%)",
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
            <Eyebrow tone="accent">Contact · 9 AM – 9 PM IST</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text="Let's plan something."
            className="max-w-[16ch]"
          />

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              Tell us a little about your event — type, date, guest count and
              where you'd like to celebrate. We reply within an hour during
              working hours, and always by the next morning.
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
