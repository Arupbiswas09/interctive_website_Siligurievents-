import type { ReactElement } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

interface PortfolioHeroProps {
  /** TODO: localized copy from CMS — keep stub plain-text for SplitText reveals. */
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** Compact mode when filter rail sits underneath (less bottom padding). */
  compact?: boolean;
}

/**
 * Portfolio editorial hero — `/portfolio` H1. See docs/05 §5.5.
 *
 * Pure Server Component. Reveals are delegated to motion primitives which
 * encapsulate `prefers-reduced-motion` handling internally.
 */
export function PortfolioHero({
  eyebrow = "Selected work · 2024 – 2026",
  heading = "Our work.",
  body = "Selected case studies from across Siliguri, Darjeeling, the Dooars, and Sikkim border. Every event we touch is staged like a film — these are the chapters worth keeping.",
  compact = false,
}: PortfolioHeroProps): ReactElement {
  return (
    <Section
      as="header"
      tone="default"
      spacing={compact ? "md" : "lg"}
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            background:
              "radial-gradient(ellipse at 12% 0%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 92% 20%, rgba(139,26,26,0.22) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 100%)",
          }}
        />
      </div>

      <Container>
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow tone="accent">{eyebrow}</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h1"
            size="hero"
            split
            splitMode="words"
            text={heading}
            className="max-w-[18ch] italic"
          />

          <RevealOnScroll delay={0.2}>
            <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {body}
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
