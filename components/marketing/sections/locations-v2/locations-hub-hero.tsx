/**
 * LocationsHubHero — opening hero for /locations.
 *
 * 50svh, eyebrow, italic display headline, body. Decorative gold haze
 * sits behind the type; no imagery in this strip.
 */

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function LocationsHubHero(): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative isolate overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(30,42,56,0.30) 0%, transparent 60%)",
          }}
        />
      </div>

      <Container>
        <div
          className="flex max-w-[1100px] flex-col justify-end gap-[var(--space-6)]"
          style={{ minHeight: "50svh" }}
        >
          <RevealOnScroll>
            <Eyebrow tone="accent">Where we work</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text="From Siliguri to the Dooars — and anywhere worth the drive."
            className="max-w-[20ch] italic [font-size:clamp(28px,5vw,56px)]"
          />

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              Our studio sits in Siliguri, but a wedding worth designing is
              worth a five-hour drive. We have decorated events from the tea
              gardens of Glenburn to the Sikkim border, and pretty much every
              banquet hall in between. Pick your nearest city to start.
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
