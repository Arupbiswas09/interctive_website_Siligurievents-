import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { PriceBand } from "@/lib/seo/schemas";

type ServicePricingTeaserProps = {
  /** Hybrid price band (₹ / ₹₹ / ₹₹₹). NEVER specific INR figures (D-002). */
  priceBand: PriceBand;
  /** Plain-language band context line, e.g. "Most ₹₹ weddings…" */
  priceContext: string;
  /** Slug used to deep-link into /pricing#<slug>. */
  serviceSlug: string;
  /** Service name — used in the CTA label. */
  serviceName: string;
};

const BAND_DESCRIPTIONS: Record<PriceBand, string> = {
  "₹": "Intimate scope — single setup, family-first guest counts.",
  "₹₹": "Mid scope — full ceremony with mandap, stage and lighting plot.",
  "₹₹₹": "Atelier scope — multi-day, multi-venue, bespoke craft and materials.",
};

const ALL_BANDS: ReadonlyArray<PriceBand> = ["₹", "₹₹", "₹₹₹"];

/**
 * Service pricing teaser — renders the hybrid band ONLY.
 *
 * Per docs/DECISIONS.md D-002 we expose `₹ / ₹₹ / ₹₹₹` bands publicly and
 * never render rupee numbers. The owner uses internal admin-only fields to
 * quote bespoke figures off-site.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §5.
 */
export function ServicePricingTeaser({
  priceBand,
  priceContext,
  serviceSlug,
  serviceName,
}: ServicePricingTeaserProps): React.ReactElement {
  return (
    <Section tone="gold" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12">
          <RevealOnScroll className="md:col-span-5">
            <div className="flex flex-col gap-[var(--space-4)]">
              <Eyebrow tone="muted">Pricing</Eyebrow>
              <DisplayHeading
                as="h2"
                size="lg"
                text="Bands, not numbers — bespoke from there."
              />
              <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: localised micro-copy explaining the band system. */}
                Every event is custom. We publish bands so you can place us
                quickly; final quotes are scoped to your guest list, venue and
                ceremony schedule.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="md:col-span-7" delay={0.15}>
            <div
              className={cn(
                "flex flex-col gap-[var(--space-6)]",
                "border border-[color:var(--color-border)]",
                "bg-[color:var(--color-bg-elevated)]",
                "p-[var(--space-8)]",
                "rounded-[var(--radius-md)]",
              )}
            >
              {/* Band display row — clearly highlights the active band. */}
              <div
                role="group"
                aria-label="Price bands"
                className="flex items-end gap-[var(--space-6)]"
              >
                {ALL_BANDS.map((band) => {
                  const active = band === priceBand;
                  return (
                    <div
                      key={band}
                      data-active={active}
                      className={cn(
                        "flex flex-col items-start gap-1",
                        active
                          ? "text-[color:var(--color-accent)]"
                          : "text-[color:var(--color-ink-soft)]",
                      )}
                    >
                      <span
                        className={cn(
                          "font-display leading-none",
                          active
                            ? "text-[length:var(--text-4xl)]"
                            : "text-[length:var(--text-2xl)] opacity-50",
                        )}
                        aria-hidden="true"
                      >
                        {band}
                      </span>
                      <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]">
                        {active ? "This service" : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink)]">
                <span className="sr-only">Price band: {priceBand}.</span>
                {BAND_DESCRIPTIONS[priceBand]}
              </p>

              <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {priceContext}
              </p>

              <div className="flex flex-wrap items-center gap-[var(--space-4)] pt-[var(--space-2)]">
                <Link
                  href={`/pricing#${serviceSlug}`}
                  className={buttonVariants({ variant: "ghost", size: "md" })}
                >
                  See packages
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "text-[length:var(--text-sm)] font-medium",
                    "text-[color:var(--color-accent)] underline-offset-4 hover:underline",
                  )}
                >
                  Get a custom quote for {serviceName.toLowerCase()}
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
