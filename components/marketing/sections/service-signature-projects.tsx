import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Project } from "@/lib/cms/services";

type ServiceSignatureProjectsProps = {
  projects: ReadonlyArray<Project>;
  /** Slug of the parent service — used in the "view all" CTA. */
  serviceSlug: string;
};

/**
 * Signature setups — 3–5 project cards demonstrating recent work.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §4.
 * Note: this is intentionally lighter than the case-study card on the
 * portfolio index — those land in Phase 3. We link out to `/portfolio/[slug]`.
 */
export function ServiceSignatureProjects({
  projects,
  serviceSlug,
}: ServiceSignatureProjectsProps): React.ReactElement {
  if (projects.length === 0) {
    return <></>;
  }
  return (
    <Section tone="default" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-12)]">
          <div className="flex flex-col items-start justify-between gap-[var(--space-4)] md:flex-row md:items-end">
            <RevealOnScroll className="flex flex-col gap-[var(--space-3)]">
              <Eyebrow tone="gold">Signature setups</Eyebrow>
              <DisplayHeading
                as="h2"
                size="lg"
                text="Recent work, in this register."
                className="max-w-[24ch]"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <Link
                href={`/portfolio?service=${serviceSlug}`}
                className={cn(
                  "inline-flex items-center gap-1",
                  "text-[length:var(--text-sm)] font-medium",
                  "text-[color:var(--color-accent)]",
                  "hover:underline underline-offset-4",
                )}
              >
                View all <span aria-hidden="true">→</span>
              </Link>
            </RevealOnScroll>
          </div>

          <ul
            className={cn(
              "grid grid-cols-1 gap-[var(--space-6)]",
              "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {projects.map((project, idx) => (
              <RevealOnScroll
                key={project.slug}
                as="li"
                delay={Math.min(idx * 0.08, 0.4)}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className={cn(
                    "group block",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden",
                      "rounded-[var(--radius-sm)]",
                      "bg-[color:var(--color-bg-elevated)]",
                    )}
                    aria-hidden="true"
                  >
                    {/* Placeholder gradient — Sprint 3 wires next/image with project.coverImageUrl. */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      style={{
                        background:
                          "radial-gradient(ellipse at 30% 20%, rgba(184,137,58,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,26,26,0.22) 0%, transparent 60%), linear-gradient(180deg, rgba(26,23,20,0.05) 0%, rgba(26,23,20,0.18) 100%)",
                      }}
                    />
                    {/* Caption overlay — slides up on hover. */}
                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0",
                        "p-[var(--space-4)]",
                        "bg-gradient-to-t from-black/55 to-transparent",
                        "translate-y-[12px] opacity-0",
                        "transition-[transform,opacity] duration-500 ease-out",
                        "group-hover:translate-y-0 group-hover:opacity-100",
                        "group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                      )}
                    >
                      <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-white/90">
                        Read the story →
                      </span>
                    </div>
                  </div>
                  <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-1)]">
                    <h3 className="font-display text-[length:var(--text-xl)] leading-[1.1] text-[color:var(--color-ink)]">
                      {project.title}
                    </h3>
                    <p className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
                      {project.ceremony} · {project.location} · {project.year}
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
