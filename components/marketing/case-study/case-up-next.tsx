import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { PortfolioProject } from "@/lib/cms/projects";

interface CaseUpNextProps {
  /** The next case study to navigate into. */
  next: PortfolioProject;
}

/**
 * Case study — "Up next". Shared-element transition placeholder.
 * See docs/05 §5.6 section 9 + docs/06 §6.7 page transitions.
 *
 * The cover image carries `viewTransitionName: project-cover-{slug}` so
 * the next case study's CaseCover picks it up as a shared element when
 * navigating via the View Transitions API. Browsers without support
 * gracefully fall back to a standard navigation with no animation cost.
 */
export function CaseUpNext({ next }: CaseUpNextProps): ReactElement {
  const { coverImage, slug, title, ceremonyName, locationName, year } = next;

  return (
    <Section tone="dark" spacing="xl" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-12)]">
          <div className="md:col-span-4">
            <RevealOnScroll>
              <Eyebrow tone="gold">08 · Up next</Eyebrow>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p className="mt-[var(--space-6)] text-[length:var(--text-base)] text-[#F5EDE0]/70">
                {/* TODO: localised CTA copy from CMS. */}
                Keep reading. The next chapter is just as good.
              </p>
            </RevealOnScroll>
          </div>

          <div className="md:col-span-8">
            <Link
              href={`/portfolio/${slug}`}
              className={cn(
                "group block",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0B08]",
                "rounded-[var(--radius-sm)]",
              )}
              aria-label={`Read the next case study: ${title}`}
            >
              <div
                className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-black"
                style={{
                  aspectRatio: `${coverImage.width} / ${coverImage.height}`,
                  // Shared-element handoff to the next CaseCover.
                  viewTransitionName: `project-cover-${slug}`,
                }}
              >
                <Image
                  src={coverImage.src}
                  alt={coverImage.alt}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className={cn(
                    "object-cover",
                    "transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-out)]",
                    "group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:group-hover:scale-100",
                  )}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-[var(--space-6)] md:p-[var(--space-12)]">
                  <p
                    className={cn(
                      "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                      "text-[#F5EDE0]/80",
                    )}
                  >
                    {ceremonyName} · {locationName} · {year}
                  </p>
                  <h2
                    className={cn(
                      "font-display mt-[var(--space-3)] italic",
                      "text-[length:var(--text-3xl)] md:text-[length:var(--text-4xl)]",
                      "leading-[1.05] text-balance text-[#F5EDE0]",
                    )}
                  >
                    {title}
                  </h2>
                  <p
                    className={cn(
                      "mt-[var(--space-6)] inline-flex items-center gap-[var(--space-2)]",
                      "text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)]",
                      "text-[color:var(--color-gold-soft)]",
                    )}
                  >
                    Read the story
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                    >
                      →
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
