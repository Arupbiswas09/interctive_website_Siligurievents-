import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { DevanagariAccent } from "@/components/ui/devanagari-accent";
import { AboutHeroPortrait } from "./about-hero-portrait";

export interface AboutHeroProps {
  /** Founder image — placeholder until Gemini asset arrives. */
  portraitImageUrl?: string;
}

/**
 * About §1 — Hero (half viewport).
 * H1 + portrait of owner per docs/05 §5.2.1.
 *
 * Motion: SIG-04 cursor-distortion-feel applied to the portrait via a
 * dedicated client child (`AboutHeroPortrait`) — keeps this server
 * component pure while the hover effect is lazy-loaded only when needed.
 */
export function AboutHero({
  portraitImageUrl = "/images/about/founder-portrait.jpg",
}: AboutHeroProps): React.ReactElement {
  return (
    <Section
      as="section"
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <Container>
        <div className="grid items-end gap-[var(--space-12)] md:grid-cols-[1.1fr_0.9fr] md:gap-[var(--space-16)]">
          <div className="flex flex-col gap-[var(--space-6)]">
            <RevealOnScroll>
              <Eyebrow tone="accent">About Siligurievent</Eyebrow>
            </RevealOnScroll>

            <RevealOnScroll delay={0.05}>
              <DevanagariAccent
                glyph="border-shirorekha"
                size="lg"
                tone="gold"
                ariaLabel="Devanagari shirorekha — cultural accent"
                className="-mb-[var(--space-2)] block"
              />
            </RevealOnScroll>

            <DisplayHeading
              as="h1"
              size="hero"
              split
              splitMode="words"
              text="We stage celebrations. The rest is decor."
              className="max-w-[18ch]"
            />

            <RevealOnScroll delay={0.2}>
              <p className="max-w-[52ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: hero body from CMS About settings */}
                A studio of decorators, florists and stage builders working
                across Siliguri, the Dooars, Darjeeling, Kalimpong and Sikkim.
                We design weddings, family rituals and corporate evenings the
                way you would design a film — in stills, sequences and light.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={0.15}>
            <AboutHeroPortrait portraitImageUrl={portraitImageUrl} />
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
