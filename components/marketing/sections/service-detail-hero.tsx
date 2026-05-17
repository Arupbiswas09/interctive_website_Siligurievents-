import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Parallax } from "@/components/motion/parallax";

type ServiceDetailHeroProps = {
  /** Service display name — the H1. */
  name: string;
  /** Optional secondary script (Devanagari, Bangla) shown below as accent. */
  nameSecondary?: string;
  /** ≤80 char tagline. */
  tagline: string;
  /** 1–2 sentence editorial intro. */
  description: string;
  /** Eyebrow chip — usually category label. */
  category: string;
  /** Primary CTA — defaults to "/contact". */
  primaryCta?: { label: string; href: string };
  /** Optional secondary CTA. */
  secondaryCta?: { label: string; href: string };
  /** Optional pre-built hero image URL (Sprint 3 wires this from CMS). */
  imageUrl?: string;
};

/**
 * Service detail hero — half-viewport editorial hero.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §1.
 * Motion: SplitterReveal on H1, parallax wash, magnetic CTA.
 * A11y: H1 owns the page title; `aria-label` on secondary script avoids
 * double-reading by screen readers.
 */
export function ServiceDetailHero({
  name,
  nameSecondary,
  tagline,
  description,
  category,
  primaryCta = { label: "Plan your event", href: "/contact" },
  secondaryCta = { label: "See related work", href: "/portfolio" },
  imageUrl,
}: ServiceDetailHeroProps): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      {/* Decorative parallax wash — Sprint 3 swaps with next/image hero. */}
      <Parallax speed={0.25} className="pointer-events-none absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.50]"
          style={{
            background: imageUrl
              ? `url(${imageUrl}) center/cover`
              : "radial-gradient(ellipse at 20% 0%, rgba(184,137,58,0.35) 0%, transparent 55%), radial-gradient(ellipse at 90% 30%, rgba(139,26,26,0.30) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(30,42,56,0.25) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 95%)",
          }}
        />
      </Parallax>

      <Container>
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">{category}</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text={name}
            className="max-w-[22ch]"
          />

          {nameSecondary ? (
            <RevealOnScroll delay={0.15}>
              <p
                aria-label={`${name} — ${nameSecondary}`}
                className={cn(
                  "font-devanagari-display",
                  "text-[length:var(--text-2xl)] leading-tight",
                  "text-[color:var(--color-ink-soft)]",
                )}
              >
                {nameSecondary}
              </p>
            </RevealOnScroll>
          ) : null}

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[42ch] font-display text-[length:var(--text-2xl)] italic leading-[1.15] text-[color:var(--color-ink)]">
              {tagline}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {description}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]">
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
        </div>
      </Container>
    </Section>
  );
}
