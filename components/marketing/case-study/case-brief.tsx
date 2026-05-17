import type { ReactElement } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ProjectImage, ProjectSpec } from "@/lib/cms/projects";

interface CaseBriefProps {
  brief: string;
  specs: ReadonlyArray<ProjectSpec>;
  image?: ProjectImage;
}

/**
 * Case study — "The brief". One paragraph + 3 specs (Guests · Days · Venues).
 * See docs/05 §5.6 section 2.
 *
 * Server Component. Motion handled by `RevealOnScroll`.
 */
export function CaseBrief({ brief, specs, image }: CaseBriefProps): ReactElement {
  return (
    <Section tone="default" spacing="lg" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-16)] md:grid-cols-12 md:gap-[var(--space-24)]">
          {/* Copy column */}
          <div className="md:col-span-7">
            <RevealOnScroll>
              <Eyebrow tone="accent">01 · The brief</Eyebrow>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p
                className="font-display mt-[var(--space-6)] text-[length:var(--text-3xl)] leading-[1.15] text-balance text-[color:var(--color-ink)]"
              >
                {brief}
              </p>
            </RevealOnScroll>

            <div className="mt-[var(--space-12)] grid grid-cols-3 gap-[var(--space-6)]">
              {specs.map((spec) => (
                <RevealOnScroll key={spec.label}>
                  <div className="border-t border-[color:var(--color-border)] pt-[var(--space-3)]">
                    <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
                      {spec.label}
                    </p>
                    <p className="font-display mt-[var(--space-2)] text-[length:var(--text-2xl)] text-[color:var(--color-ink)]">
                      {spec.value}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Editorial inset image */}
          {image ? (
            <div className="md:col-span-5">
              <RevealOnScroll>
                <figure className="relative overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]">
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: `${image.width} / ${image.height}`,
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </RevealOnScroll>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
