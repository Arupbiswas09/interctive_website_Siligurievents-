import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Project } from "@/lib/cms/projects";

export interface LocationLocalProjectsProps {
  locationName: string;
  projects: ReadonlyArray<Project>;
}

/**
 * Locations §3 — Featured local projects.
 * 3–4 case studies tagged with this location.
 */
export function LocationLocalProjects({
  locationName,
  projects,
}: LocationLocalProjectsProps): React.ReactElement {
  if (projects.length === 0) {
    return (
      <Section as="section" tone="default" spacing="md">
        <Container>
          <Eyebrow>Recent work</Eyebrow>
          <p className="mt-[var(--space-3)] max-w-[60ch] text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
            TODO: more {locationName} projects coming soon — meanwhile, see{" "}
            <Link
              href="/portfolio"
              className="underline-offset-4 hover:underline"
            >
              our full portfolio
            </Link>
            .
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section as="section" tone="default" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-10)]">
          <header className="flex flex-col gap-[var(--space-4)]">
            <RevealOnScroll>
              <Eyebrow tone="gold">Recent work · {locationName}</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text={`Recent celebrations we have staged in ${locationName}.`}
              className="max-w-[26ch]"
            />
          </header>

          <ul className="grid gap-[var(--space-8)] sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <RevealOnScroll
                key={project.slug}
                delay={0.05 * idx}
                as="li"
                className="group flex flex-col gap-[var(--space-3)]"
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="flex flex-col gap-[var(--space-3)]"
                >
                  <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]">
                    {/* TODO: replace with next/image once project covers land */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(184,137,58,0.20), rgba(30,42,56,0.30))",
                      }}
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 p-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bg)]">
                      IMG: {project.coverImageUrl}
                    </figcaption>
                  </figure>

                  <div className="flex flex-col gap-[var(--space-1)]">
                    <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
                      {project.ceremony} · {project.year}
                    </p>
                    <h3 className="font-display text-[length:var(--text-2xl)] leading-tight tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                      {project.title}
                    </h3>
                    <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                      {project.brief}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
