import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { CalligraphicReveal } from "./pricing-calligraphic-reveal";
import type {
  Package,
  PackageCategoryMeta,
} from "@/lib/cms/packages";

type Props = {
  category: PackageCategoryMeta;
  packages: ReadonlyArray<Package>;
};

/**
 * Pricing — 3-package row per category.
 * Per docs/05-PAGE-SPECS.md §5.7 §3.
 *
 * The "Signature / Recommended" tier renders with a subtle brass ribbon
 * animation on scroll-in (CSS-only — honors prefers-reduced-motion via the
 * global media-query reset in globals.css).
 *
 * Band display rule (D-002): only ₹ / ₹₹ / ₹₹₹ symbol is shown. No rupee
 * numbers anywhere in this rendered text.
 */
export function PricingPackageRow({
  category,
  packages,
}: Props): React.ReactElement {
  return (
    <Section
      id="packages"
      tone="default"
      spacing="lg"
      aria-labelledby={`packages-heading-${category.slug}`}
    >
      <Container>
        <div className="mb-[var(--space-12)] flex max-w-[68ch] flex-col gap-[var(--space-3)]">
          <Eyebrow>{category.label}</Eyebrow>
          <DisplayHeading
            as="h2"
            size="lg"
            text={`Packages for ${category.label.toLowerCase()}.`}
            className="text-balance"
          />
          <p className="text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
            {category.blurb}
          </p>
        </div>

        {/* SIG-12 "Vidaai" — calligraphic clip-path reveal on category
            change. The client child watches the slug and runs a 600ms
            left → right `clip-path: inset(...)` sweep. Reduced motion
            falls back to a 200ms autoAlpha fade. */}
        <CalligraphicReveal
          keyToken={category.slug}
          id={`packages-${category.slug}`}
          role="tabpanel"
          className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-3 md:gap-[var(--space-8)]"
        >
          {packages.map((pkg, idx) => (
            <RevealOnScroll
              key={pkg.id}
              delay={idx * 0.08}
              as="article"
              className={cn(
                "group relative isolate flex h-full flex-col overflow-hidden",
                "rounded-[var(--radius-md)] border",
                "p-[var(--space-8)] md:p-[var(--space-10)]",
                "transition-[border-color,transform] duration-300",
                pkg.highlight
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-bg-elevated)]"
                  : "border-[color:var(--color-border)] bg-[color:var(--color-bg)] hover:border-[color:var(--color-ink)]",
                pkg.highlight && "md:-translate-y-[var(--space-3)]",
              )}
            >
              {/* Brass ribbon — subtle scroll-in animation via CSS keyframes. */}
              {pkg.highlight && (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute -right-12 top-7 z-10",
                      "rotate-45 select-none",
                      "bg-[color:var(--color-gold)] px-12 py-[2px]",
                      "text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-eyebrow)]",
                      "text-[color:var(--color-ink)]",
                      "shadow-[0_4px_12px_-4px_rgba(184,137,58,0.45)]",
                      "animate-[ribbon-slide_900ms_var(--ease-out)_both]",
                    )}
                  >
                    Recommended
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-gold)] opacity-70"
                  />
                </>
              )}

              <header className="flex items-baseline justify-between gap-[var(--space-4)]">
                <h3 className="font-display text-[length:var(--text-2xl)] tracking-[var(--tracking-display)] leading-[1.05]">
                  {pkg.name}
                </h3>
                <span
                  aria-label={`Price band ${pkg.priceBand}`}
                  className={cn(
                    "font-display text-[length:var(--text-2xl)] leading-none",
                    pkg.highlight
                      ? "text-[color:var(--color-gold)]"
                      : "text-[color:var(--color-ink-muted)]",
                  )}
                >
                  {pkg.priceBand}
                </span>
              </header>

              <p className="mt-[var(--space-3)] text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
                {pkg.tagline}
              </p>

              <p className="mt-[var(--space-2)] text-[length:var(--text-sm)] italic text-[color:var(--color-ink-soft)]">
                {pkg.bandNote}
              </p>

              <hr className="my-[var(--space-6)] border-0 border-t border-[color:var(--color-border)]" />

              <ul className="flex flex-col gap-[var(--space-3)] text-[length:var(--text-sm)]">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-[var(--space-3)] text-[color:var(--color-ink)]"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-[0.55em] inline-block h-[1.5px] w-3 shrink-0",
                        pkg.highlight
                          ? "bg-[color:var(--color-gold)]"
                          : "bg-[color:var(--color-ink-soft)]",
                      )}
                    />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-[var(--space-8)]">
                {pkg.highlight ? (
                  // SIG-11 — magnetic CTA on the "Signature" highlighted card.
                  // Disabled on coarse pointers + reduced motion inside the
                  // primitive, so this is safe to ship unconditionally.
                  <MagneticButton>
                    <Link
                      href={{
                        pathname: "/contact",
                        query: {
                          source: `pricing:${pkg.id}`,
                          budget: pkg.priceBand,
                        },
                      }}
                      className={buttonVariants({
                        variant: "primary",
                        size: "md",
                      })}
                    >
                      Talk to us
                      <span aria-hidden="true">→</span>
                    </Link>
                  </MagneticButton>
                ) : (
                  <Link
                    href={{
                      pathname: "/contact",
                      query: {
                        source: `pricing:${pkg.id}`,
                        budget: pkg.priceBand,
                      },
                    }}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "md",
                    })}
                  >
                    Talk to us
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </CalligraphicReveal>

        {/* Local keyframes — subtle ribbon slide-in. */}
        <style>{`
          @keyframes ribbon-slide {
            0%   { transform: translate(40%, -100%) rotate(45deg); opacity: 0; }
            60%  { opacity: 1; }
            100% { transform: translate(0, 0) rotate(45deg); opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            [class*="animate-[ribbon-slide"] { animation: none !important; }
          }
        `}</style>
      </Container>
    </Section>
  );
}
