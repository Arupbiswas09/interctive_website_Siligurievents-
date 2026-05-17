import type { ReactElement } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ProjectImage } from "@/lib/cms/projects";

interface CaseDesignProps {
  /** Editorial paragraph(s) explaining theme, palette, materials. */
  designStory: string;
  /** Inline design detail images — 1 to 3 work well. */
  images: ReadonlyArray<ProjectImage>;
  /** Optional theme heading (e.g. "Red, jasmine, brass."). */
  themeHeading?: string;
}

/**
 * Case study — "The design". Theme, palette, materials, with image inset.
 * See docs/05 §5.6 section 4.
 *
 * Layout: a wide editorial sentence (display heading) on top, two paragraphs
 * to one side, design detail tiles staggered through the column.
 */
export function CaseDesign({
  designStory,
  images,
  themeHeading = "The design.",
}: CaseDesignProps): ReactElement {
  const paragraphs = splitParagraphs(designStory);
  const [primary, ...rest] = images;

  return (
    <Section tone="default" spacing="lg" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-16)]">
          <div className="md:col-span-5">
            <RevealOnScroll>
              <Eyebrow tone="accent">03 · The design</Eyebrow>
            </RevealOnScroll>
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text={themeHeading}
              className="mt-[var(--space-6)] italic"
            />

            <div className="mt-[var(--space-10)] flex flex-col gap-[var(--space-5)]">
              {paragraphs.map((p, idx) => (
                <RevealOnScroll
                  key={`des-p-${idx.toString()}`}
                  delay={idx * 0.1}
                >
                  <p className="text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {p}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            {primary ? (
              <RevealOnScroll>
                <figure
                  className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]"
                  style={{ aspectRatio: `${primary.width} / ${primary.height}` }}
                >
                  <Image
                    src={primary.src}
                    alt={primary.alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              </RevealOnScroll>
            ) : null}

            {rest.length > 0 ? (
              <div className="mt-[var(--space-6)] grid grid-cols-2 gap-[var(--space-4)] md:gap-[var(--space-6)]">
                {rest.map((img) => (
                  <RevealOnScroll key={img.id}>
                    <figure
                      className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]"
                      style={{ aspectRatio: `${img.width} / ${img.height}` }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 50vw"
                        className="object-cover"
                      />
                    </figure>
                  </RevealOnScroll>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function splitParagraphs(text: string): ReadonlyArray<string> {
  return text
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
