import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Service } from "@/lib/cms/services";

type ServiceRelatedProps = {
  related: ReadonlyArray<Service>;
  /** Section heading override. */
  headline?: string;
};

/**
 * Related ceremonies — sibling-page links to keep users in the funnel.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §7 + docs/04 §4.6.
 */
export function ServiceRelated({
  related,
  headline = "You might also be planning…",
}: ServiceRelatedProps): React.ReactElement | null {
  if (related.length === 0) return null;

  return (
    <Section tone="elevated" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-12)]">
          <RevealOnScroll>
            <div className="flex flex-col gap-[var(--space-3)]">
              <Eyebrow tone="muted">Related ceremonies</Eyebrow>
              <DisplayHeading
                as="h2"
                size="lg"
                text={headline}
                className="max-w-[24ch]"
              />
            </div>
          </RevealOnScroll>

          <ul
            className={cn(
              "grid grid-cols-1 gap-[var(--space-4)]",
              "sm:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {related.map((service, idx) => (
              <RevealOnScroll
                key={service.slug}
                as="li"
                delay={Math.min(idx * 0.06, 0.3)}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "group flex h-full flex-col gap-[var(--space-3)]",
                    "border-t border-[color:var(--color-ink)]/15",
                    "pt-[var(--space-4)]",
                    "transition-colors duration-200",
                    "hover:border-[color:var(--color-accent)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
                  )}
                >
                  <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]">
                    {service.priceBand}
                  </span>
                  <h3 className="font-display text-[length:var(--text-2xl)] leading-[1.05] text-[color:var(--color-ink)]">
                    {service.name}
                  </h3>
                  <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {service.tagline}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center gap-1 text-[length:var(--text-sm)] text-[color:var(--color-accent)]"
                  >
                    Read more
                    <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
                      →
                    </span>
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
