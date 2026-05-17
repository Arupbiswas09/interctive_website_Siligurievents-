import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export interface LocationAreaContextProps {
  locationName: string;
  /** Multi-paragraph copy explaining the area. */
  paragraphs: ReadonlyArray<string>;
  /** Distance from Siliguri (km). Drives a small travel-note callout. */
  distanceFromSiliguriKm: number;
}

/**
 * Locations §2 — About the area & weddings.
 * Multi-paragraph editorial copy + small travel-note callout.
 */
export function LocationAreaContext({
  locationName,
  paragraphs,
  distanceFromSiliguriKm,
}: LocationAreaContextProps): React.ReactElement {
  return (
    <Section as="section" tone="elevated" spacing="lg">
      <Container>
        <div className="grid gap-[var(--space-10)] md:grid-cols-[1fr_auto] md:items-start md:gap-[var(--space-16)]">
          <div className="flex flex-col gap-[var(--space-6)]">
            <RevealOnScroll>
              <Eyebrow>The area</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text={`Weddings and events in ${locationName}.`}
              className="max-w-[24ch]"
            />

            <div className="flex max-w-[60ch] flex-col gap-[var(--space-4)] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {paragraphs.map((p, idx) => (
                <RevealOnScroll key={p.slice(0, 24) + idx} delay={0.06 * idx} as="p">
                  {p}
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <RevealOnScroll
            delay={0.15}
            className="self-start border-l border-[color:var(--color-gold)] pl-[var(--space-4)] md:max-w-[260px]"
          >
            <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
              Travel note
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink)]">
              {distanceFromSiliguriKm === 0
                ? "Our home base — same-day setups, late-night service, on-call crew."
                : `Approx ${distanceFromSiliguriKm} km from our Siliguri workshop — easy day-of logistics.`}
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
