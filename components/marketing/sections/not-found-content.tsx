import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";

export interface NotFoundContentProps {
  whatsappHref: string;
}

/**
 * 404 — branded, full viewport.
 *
 * Motion: MO-11 JasminePetalFall (per docs/06 §6.4). The actual GSAP
 * timeline lives with the motion primitives and binds to the
 * `[data-petal]` anchor below. This component renders the static layout
 * + anchors only — animation hydrates after first paint.
 */
export function NotFoundContent({
  whatsappHref,
}: NotFoundContentProps): React.ReactElement {
  return (
    <Section
      as="section"
      tone="default"
      spacing="xl"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* MO-11 anchor — falling petals attach here. Decorative only. */}
      <div
        aria-hidden="true"
        data-petal
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(184,137,58,0.18) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(139,26,26,0.14) 0%, transparent 60%)",
        }}
      />

      <Container>
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-[var(--space-6)] text-center">
          <Eyebrow tone="gold">Error 404</Eyebrow>

          <DisplayHeading
            as="h1"
            size="hero"
            text="This page eloped."
            align="center"
            className="max-w-[20ch]"
          />

          <p className="max-w-[52ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
            It is not where we thought. Try our work, our services, or say hi
            on WhatsApp.
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-center gap-[var(--space-3)]">
            <MagneticButton>
              <Link
                href="/portfolio"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                View Work
                <span aria-hidden="true">→</span>
              </Link>
            </MagneticButton>

            <Link
              href="/services"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              See Services
            </Link>

            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              WhatsApp Us
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
