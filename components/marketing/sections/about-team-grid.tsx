import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { TeamMember } from "@/lib/cms/team";

export interface AboutTeamGridProps {
  team: ReadonlyArray<TeamMember>;
}

/**
 * About §4 — Team grid.
 * Photo + name + role + 1-line bio. 4–8 people per docs/05 §5.2.4.
 */
export function AboutTeamGrid({ team }: AboutTeamGridProps): React.ReactElement {
  return (
    <Section as="section" tone="elevated" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-10)]">
          <header className="flex max-w-[80ch] flex-col gap-[var(--space-4)]">
            <RevealOnScroll>
              <Eyebrow>The team</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="The people who build it."
              className="max-w-[22ch]"
            />

            <RevealOnScroll delay={0.12}>
              <p className="max-w-[60ch] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: team intro */}
                A small permanent crew, augmented by trusted florists,
                fabricators and lighting technicians during the wedding
                season.
              </p>
            </RevealOnScroll>
          </header>

          <ul className="grid grid-cols-2 gap-[var(--space-8)] md:grid-cols-3 lg:grid-cols-4 lg:gap-[var(--space-10)]">
            {team.map((member, idx) => (
              <RevealOnScroll
                key={member.slug}
                delay={0.05 + idx * 0.06}
                as="li"
                className="flex flex-col gap-[var(--space-3)]"
              >
                <figure
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]"
                  aria-label={`Portrait of ${member.name}`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(184,137,58,0.20), rgba(30,42,56,0.30))",
                    }}
                  />
                  <figcaption className="sr-only">
                    {member.name}
                  </figcaption>
                </figure>

                <div className="flex flex-col gap-[var(--space-1)]">
                  <h3 className="font-display text-[length:var(--text-xl)] leading-tight tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                    {member.name}
                  </h3>
                  <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
                    {member.role}
                  </p>
                  <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {member.bio}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
