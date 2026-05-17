import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

type CtaCloserProps = {
  /** Optional kicker label above the headline. */
  eyebrow?: string;
  /** Italic-friendly oversized display headline. Plain text — split is applied. */
  headline: string;
  /** Sub-line under the CTA — e.g. "Or WhatsApp us — we usually reply within an hour." */
  subline?: string;
  /** Primary CTA label + href. */
  primaryCta: { label: string; href: string };
  /** Optional ghost secondary CTA. */
  secondaryCta?: { label: string; href: string };
  /** Visual tone — defaults to `dark` for the cinematic Home-H9 treatment. */
  tone?: "default" | "dark" | "gold" | "elevated";
  /** Heading element — H1 only on standalone pages, H2 elsewhere (default). */
  as?: "h1" | "h2";
  /** Additional children rendered below the CTA row (e.g. trust badges). */
  children?: ReactNode;
  className?: string;
};

/**
 * CtaCloser — the big-type closing CTA reused across marketing pages.
 *
 * Spec reference: docs/05-PAGE-SPECS.md §5.1 H9 + §5.4 §8.
 * Motion: MO-01 SplitterReveal on the headline + MO-02 reveal on CTAs.
 * Reduced motion: heading + CTAs render at final state via primitives.
 *
 * Reused by: Home (H9), Service detail (§8), About, Portfolio close, Blog.
 */
export function CtaCloser({
  eyebrow,
  headline,
  subline,
  primaryCta,
  secondaryCta,
  tone = "dark",
  as = "h2",
  children,
  className,
}: CtaCloserProps): React.ReactElement {
  return (
    <Section tone={tone} spacing="xl" className={cn("relative overflow-hidden", className)}>
      {/* Decorative gold haze — sits behind the type, hidden from a11y. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(184,137,58,0.35) 0%, transparent 60%)",
          }}
        />
      </div>

      <Container>
        <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center gap-[var(--space-8)] text-center">
          {eyebrow ? (
            <RevealOnScroll>
              <Eyebrow tone="gold">{eyebrow}</Eyebrow>
            </RevealOnScroll>
          ) : null}

          <DisplayHeading
            as={as}
            size="hero"
            split
            splitMode="words"
            text={headline}
            align="center"
            className="italic"
          />

          <RevealOnScroll delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-[var(--space-4)]">
              <MagneticButton>
                <Link
                  href={primaryCta.href}
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  {primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </MagneticButton>
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </RevealOnScroll>

          {subline ? (
            <RevealOnScroll delay={0.3}>
              <p className="max-w-[60ch] text-[length:var(--text-base)] leading-relaxed opacity-80">
                {subline}
              </p>
            </RevealOnScroll>
          ) : null}

          {children ? <div className="mt-[var(--space-4)]">{children}</div> : null}
        </div>
      </Container>
    </Section>
  );
}
