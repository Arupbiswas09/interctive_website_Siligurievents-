import type { ReactElement } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Parallax } from "@/components/motion/parallax";
import type { ProjectImage } from "@/lib/cms/projects";

interface CaseSettingProps {
  /** 2 paragraphs, separated by a single blank line. */
  setting: string;
  images: ReadonlyArray<ProjectImage>;
}

/**
 * Case study — "The setting". 2 paragraphs + venue image gallery.
 * See docs/05 §5.6 section 3.
 *
 * Server Component. Gallery uses Parallax on alternating tiles for a
 * subtle depth read (within the §6.2 motion budget for case studies).
 */
export function CaseSetting({ setting, images }: CaseSettingProps): ReactElement {
  const paragraphs = splitParagraphs(setting);

  return (
    <Section tone="elevated" spacing="lg" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12">
          <div className="md:col-span-4">
            <RevealOnScroll>
              <Eyebrow tone="accent">02 · The setting</Eyebrow>
            </RevealOnScroll>
          </div>
          <div className="md:col-span-8">
            <div className="flex max-w-[60ch] flex-col gap-[var(--space-6)]">
              {paragraphs.map((p, idx) => (
                <RevealOnScroll
                  key={`set-p-${idx.toString()}`}
                  delay={idx * 0.1}
                >
                  <p className="text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {p}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="mt-[var(--space-24)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-12">
            {images.map((img, idx) => (
              <SettingImage key={img.id} image={img} index={idx} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

interface SettingImageProps {
  image: ProjectImage;
  index: number;
}

function SettingImage({ image, index }: SettingImageProps): ReactElement {
  // Alternate column spans for editorial rhythm.
  const span =
    index % 4 === 0
      ? "md:col-span-7"
      : index % 4 === 1
        ? "md:col-span-5"
        : index % 4 === 2
          ? "md:col-span-5"
          : "md:col-span-7";

  // Mild parallax on the deep half of each row.
  const parallaxSpeed = index % 2 === 0 ? 0.1 : 0.2;

  return (
    <figure className={span}>
      <Parallax speed={parallaxSpeed}>
        <div
          className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Parallax>
    </figure>
  );
}

function splitParagraphs(text: string): ReadonlyArray<string> {
  return text
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
