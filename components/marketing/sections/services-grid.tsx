import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Service } from "@/lib/cms/services";

type ServicesGridProps = {
  services: ReadonlyArray<Service>;
  /** Tab slug that's currently rendered — for ARIA `aria-labelledby`. */
  activeTabSlug: string;
};

/**
 * Services grid — editorial cards filtered by the active tab.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.3 §3.
 * Motion: stagger of RevealOnScroll via small CSS delay multiplier.
 * Reduced motion: cards crossfade in via primitive's fallback.
 */
export function ServicesGrid({
  services,
  activeTabSlug,
}: ServicesGridProps): React.ReactElement {
  return (
    <Section tone="default" spacing="lg">
      <Container>
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabSlug}`}
          aria-labelledby={`tab-${activeTabSlug}`}
          // SIG-02 — opts into the turbulence morph filter mounted by the
          // sibling category-tabs. Filter is no-op (`scale=0`) until the
          // active tab changes; reduced motion never animates the scale.
          style={{ filter: "url(#tab-morph)" }}
          className={cn(
            "grid grid-cols-1 gap-[var(--space-6)]",
            "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {services.length === 0 ? (
            <RevealOnScroll className="col-span-full">
              <p className="text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
                {/* TODO: localised empty state. */}
                No services found for this category yet — we're updating this
                page. Meanwhile, please reach out and we'll talk you through
                what we can build for you.
              </p>
            </RevealOnScroll>
          ) : (
            services.map((service, idx) => (
              <RevealOnScroll
                key={service.slug}
                delay={Math.min(idx * 0.05, 0.4)}
              >
                <ServiceCard service={service} />
              </RevealOnScroll>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}

function ServiceCard({ service }: { service: Service }): React.ReactElement {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex h-full flex-col gap-[var(--space-4)]",
        "border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]",
        "p-[var(--space-6)]",
        "rounded-[var(--radius-md)]",
        "transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-[2px] hover:border-[color:var(--color-ink)] hover:shadow-[var(--shadow-card)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
      )}
    >
      {/* Image placeholder — Sprint 3 wires `service.heroImageUrl` via next/image. */}
      <div
        aria-hidden="true"
        className={cn(
          "relative aspect-[4/5] overflow-hidden",
          "rounded-[var(--radius-sm)]",
          "bg-[color:var(--color-bg)]",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-80",
            "transition-transform duration-700 ease-[var(--ease-out)]",
            "group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
          )}
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(184,137,58,0.30) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,26,26,0.18) 0%, transparent 60%), linear-gradient(180deg, rgba(26,23,20,0.04) 0%, rgba(26,23,20,0.10) 100%)",
          }}
        />
        {/* Brass accent line — draws left → right on hover. Reduced
            motion: instant final state via the global media reset. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-[2px] w-full",
            "origin-left scale-x-0 bg-[color:var(--color-gold)]",
            "transition-transform duration-500 ease-[var(--ease-out)]",
            "group-hover:scale-x-100 motion-reduce:group-hover:scale-x-0",
          )}
        />
        <span
          className={cn(
            "absolute left-[var(--space-3)] top-[var(--space-3)]",
            "inline-flex items-center gap-1",
            "rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]/85 backdrop-blur",
            "px-[var(--space-2)] py-[2px]",
            "text-[length:var(--text-xs)] font-medium tracking-[var(--tracking-eyebrow)] uppercase",
            "text-[color:var(--color-ink-muted)]",
          )}
        >
          {service.priceBand}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--space-3)]">
        <h3
          className={cn(
            "font-display text-[length:var(--text-2xl)] tracking-[var(--tracking-display)] leading-[1.05] text-[color:var(--color-ink)]",
            "transition-transform duration-300 ease-[var(--ease-out)]",
            "group-hover:-translate-y-[2px] motion-reduce:transform-none",
          )}
        >
          {service.name}
        </h3>
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
          {service.tagline}
        </p>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center gap-1",
          "text-[length:var(--text-sm)] text-[color:var(--color-accent)]",
          "mt-auto",
        )}
      >
        Read more
        <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
      </span>
    </Link>
  );
}
