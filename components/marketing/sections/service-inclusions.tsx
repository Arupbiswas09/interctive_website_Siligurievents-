import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { InclusionGroup, Service } from "@/lib/cms/services";

type ServiceInclusionsProps = {
  /** Longer-form narrative shown above the inclusions grid. */
  description: string;
  /** Grouped inclusions (Decor / Florals / Lighting). */
  groups: ReadonlyArray<InclusionGroup>;
  /** Optional house process (4–6 steps). Defaults to none. */
  process?: Service["process"];
};

/**
 * Service detail — combined "What we do" + "Process / what's included".
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §2 + §3.
 * Layout: narrative paragraph → 3-column inclusion matrix → process strip.
 * Motion: staggered RevealOnScroll for each group.
 */
export function ServiceInclusions({
  description,
  groups,
  process,
}: ServiceInclusionsProps): React.ReactElement {
  return (
    <Section tone="elevated" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-16)]">
          {/* — What we do narrative — */}
          <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12">
            <RevealOnScroll className="md:col-span-4">
              <div className="flex flex-col gap-[var(--space-4)]">
                <Eyebrow tone="muted">What we do</Eyebrow>
                <DisplayHeading as="h2" size="lg" text="A studio's worth of detail, per ceremony." />
              </div>
            </RevealOnScroll>
            <RevealOnScroll className="md:col-span-7 md:col-start-6" delay={0.15}>
              <p className="text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {description}
              </p>
            </RevealOnScroll>
          </div>

          {/* — Inclusions matrix — */}
          <div
            className={cn(
              "grid grid-cols-1 gap-[var(--space-8)]",
              "md:grid-cols-2 lg:grid-cols-3",
              "border-t border-[color:var(--color-border)]",
              "pt-[var(--space-12)]",
            )}
          >
            {groups.map((group, idx) => (
              <RevealOnScroll key={group.title} delay={idx * 0.08}>
                <article className="flex h-full flex-col gap-[var(--space-4)]">
                  <h3
                    className={cn(
                      "text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-eyebrow)]",
                      "text-[color:var(--color-gold)]",
                    )}
                  >
                    {String(idx + 1).padStart(2, "0")} — {group.title}
                  </h3>
                  <ul className="flex flex-col gap-[var(--space-3)]">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-start gap-[var(--space-3)]",
                          "text-[length:var(--text-base)] leading-relaxed",
                          "text-[color:var(--color-ink)]",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[10px] h-[1px] w-4 shrink-0 bg-[color:var(--color-ink-soft)]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {/* — Process strip (optional) — */}
          {process && process.length > 0 ? (
            <div className="flex flex-col gap-[var(--space-8)] border-t border-[color:var(--color-border)] pt-[var(--space-12)]">
              <RevealOnScroll>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <Eyebrow tone="muted">How we work</Eyebrow>
                  <DisplayHeading as="h2" size="md" text="Four steps. The same four, every time." />
                </div>
              </RevealOnScroll>
              <ol
                className={cn(
                  "grid grid-cols-1 gap-[var(--space-6)]",
                  "sm:grid-cols-2 lg:grid-cols-4",
                )}
              >
                {process.map((step, idx) => (
                  <RevealOnScroll
                    key={step.step}
                    as="li"
                    delay={idx * 0.08}
                    className="flex flex-col gap-[var(--space-3)] border-t border-[color:var(--color-ink)]/15 pt-[var(--space-4)]"
                  >
                    <span className="font-display text-[length:var(--text-3xl)] tracking-[var(--tracking-display)] text-[color:var(--color-gold)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[length:var(--text-xl)] leading-[1.1] text-[color:var(--color-ink)]">
                      {step.step}
                    </h3>
                    <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                      {step.description}
                    </p>
                  </RevealOnScroll>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
