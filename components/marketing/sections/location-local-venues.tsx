import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { LocationVenue } from "@/lib/cms/locations";

export interface LocationLocalVenuesProps {
  locationName: string;
  venues: ReadonlyArray<LocationVenue>;
}

const TYPE_LABEL: Record<LocationVenue["type"], string> = {
  hotel: "Hotel",
  resort: "Resort",
  banquet: "Banquet",
  "tea-garden": "Tea garden",
  heritage: "Heritage",
  outdoor: "Outdoor",
};

/**
 * Locations §5 — Local venues we love.
 * Named venues with short notes — drives long-tail venue-name SEO.
 */
export function LocationLocalVenues({
  locationName,
  venues,
}: LocationLocalVenuesProps): React.ReactElement {
  if (venues.length === 0) return <></>;

  return (
    <Section as="section" tone="elevated" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-10)]">
          <header className="flex max-w-[80ch] flex-col gap-[var(--space-4)]">
            <RevealOnScroll>
              <Eyebrow>Venues we love</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text={`A short list from around ${locationName}.`}
              className="max-w-[24ch]"
            />

            <RevealOnScroll delay={0.12}>
              <p className="max-w-[60ch] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: copy */}
                The venues we know well — what they fit, where they sit, and
                how we typically design for them. Mention any of these when
                you message us and we can move faster on quotes.
              </p>
            </RevealOnScroll>
          </header>

          <ul className="grid gap-[var(--space-6)] md:grid-cols-2">
            {venues.map((venue, idx) => (
              <RevealOnScroll
                key={`${venue.name}-${venue.area}`}
                delay={0.04 * idx}
                as="li"
                className="flex flex-col gap-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-5)]"
              >
                <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
                  {TYPE_LABEL[venue.type]} · {venue.area}
                </p>
                <h3 className="font-display text-[length:var(--text-2xl)] leading-tight tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                  {venue.name}
                </h3>
                <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                  {venue.notes}
                </p>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
