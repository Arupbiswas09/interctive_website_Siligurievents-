import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";

/**
 * Branded 404 — fires when a service slug doesn't match a CMS entry.
 *
 * Spec lineage: docs/05-PAGE-SPECS.md §5.12 (global 404 voice).
 * We keep the headline service-specific so it reads as if the page —
 * not the whole site — is what wandered off.
 */
export default function ServiceNotFound(): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.40]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(184,137,58,0.28) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(139,26,26,0.20) 0%, transparent 60%)",
          }}
        />
      </div>

      <Container>
        <div className="flex max-w-[1100px] flex-col gap-[var(--space-8)]">
          <Eyebrow tone="accent">404 · Service not found</Eyebrow>

          <DisplayHeading
            as="h1"
            size="xl"
            text="This celebration is not on our list — yet."
            className="max-w-[24ch] italic"
          />

          <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
            {/* TODO: localise. */}
            We may have moved this page, or it might be coming soon. Have a
            look at the full list of what we design — or tell us what you're
            planning and we'll let you know whether we can build it.
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]">
            <Link
              href="/services"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              See all services
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
