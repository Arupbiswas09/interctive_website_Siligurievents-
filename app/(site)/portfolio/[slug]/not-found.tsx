import type { ReactElement } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";

/**
 * Branded 404 for missing portfolio case studies. See docs/05 §5.12 for
 * the tone — this page eloped.
 */
export default function CaseStudyNotFound(): ReactElement {
  return (
    <>

      <main id="main" className="relative">
        <Section
          as="section"
          tone="default"
          spacing="xl"
          className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at 20% 10%, rgba(184,137,58,0.22) 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(139,26,26,0.18) 0%, transparent 65%)",
            }}
          />

          <Container>
            <div className="mx-auto flex max-w-[760px] flex-col items-start gap-[var(--space-8)] py-[var(--space-24)] md:items-center md:text-center">
              <RevealOnScroll>
                <Eyebrow tone="accent">404 · Case study</Eyebrow>
              </RevealOnScroll>

              <DisplayHeading
                as="h1"
                size="hero"
                split
                splitMode="words"
                text="This case study eloped."
                className="italic"
              />

              <RevealOnScroll delay={0.15}>
                <p className="max-w-[55ch] text-[length:var(--text-lg)] text-[color:var(--color-ink-muted)]">
                  {/* TODO: localised body copy from CMS. */}
                  It isn't where we thought. The story might have moved, been
                  retitled, or never made it past the draft folder. Try the work,
                  see what's new, or write to us — we'd love to share it directly.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.3}>
                <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]">
                  <MagneticButton>
                    <Link
                      href="/portfolio"
                      className={buttonVariants({
                        variant: "primary",
                        size: "lg",
                      })}
                    >
                      View all work
                      <span aria-hidden="true">→</span>
                    </Link>
                  </MagneticButton>
                  <Link
                    href="/services"
                    className={buttonVariants({ variant: "ghost", size: "lg" })}
                  >
                    See services
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ variant: "link", size: "lg" }),
                      "text-[color:var(--color-accent)]",
                    )}
                  >
                    Talk on WhatsApp
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </Section>
      </main>

    </>
  );
}
