import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export interface LocationHeroProps {
  locationName: string;
  tagline: string;
  region: string;
  heroImageUrl: string;
}

/**
 * Locations §1 — Hero.
 * H1: "Event Decorators in {Location}" per docs/05 §5.11.1 + docs/07 §7.5.
 */
export function LocationHero({
  locationName,
  tagline,
  region,
  heroImageUrl,
}: LocationHeroProps): React.ReactElement {
  return (
    <Section
      as="section"
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 10%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 10% 60%, rgba(139,26,26,0.22) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 90%)",
          }}
        />
      </div>

      <Container>
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-6)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">
              {region} · Local studio
            </Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text={`Event Decorators in ${locationName}`}
            className="max-w-[22ch]"
          />

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {tagline}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="sr-only">
              IMG: {heroImageUrl}
              {/* TODO: replace with next/image hero once asset lands */}
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
