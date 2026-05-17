import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { BtsVelocityBlur } from "./about-bts-velocity-blur";

interface BtsImage {
  id: string;
  caption: string;
}

const BTS_IMAGES: ReadonlyArray<BtsImage> = [
  { id: "BTS-01", caption: "TODO: Flower-stringing at dawn." },
  { id: "BTS-02", caption: "TODO: Mandap rigging in progress." },
  { id: "BTS-03", caption: "TODO: Stage build before guests arrive." },
  { id: "BTS-04", caption: "TODO: Coldroom — jasmines and marigolds." },
  { id: "BTS-05", caption: "TODO: Lighting test on a Sevoke Road banquet." },
  { id: "BTS-06", caption: "TODO: Last brass detail before the baraat." },
];

/**
 * About §5 — Behind the scenes.
 * Full-bleed gallery row, 6 images of setup work (per docs/05 §5.2.5).
 *
 * Implementation: horizontal scroll on mobile, full-bleed strip on desktop.
 */
export function AboutBtsGallery(): React.ReactElement {
  return (
    <Section
      as="section"
      tone="dark"
      spacing="lg"
      className="overflow-hidden"
    >
      <Container>
        <header className="flex flex-col gap-[var(--space-4)]">
          <RevealOnScroll>
            <Eyebrow tone="gold">Behind the scenes</Eyebrow>
          </RevealOnScroll>

          <DisplayHeading
            as="h2"
            size="lg"
            split
            splitMode="words"
            text="The night before the wedding."
            className="max-w-[26ch] text-[color:var(--color-bg)]"
          />
        </header>
      </Container>

      <BtsVelocityBlur
        className="mt-[var(--space-10)] w-full overflow-x-auto"
        role="region"
        aria-label="Behind the scenes gallery"
      >
        <ul className="flex w-max gap-[var(--space-4)] px-[var(--gutter)] pb-[var(--space-4)]">
          {BTS_IMAGES.map((img, idx) => (
            <RevealOnScroll
              key={img.id}
              delay={0.04 * idx}
              as="li"
              className="w-[78vw] shrink-0 md:w-[40vw] lg:w-[28vw]"
            >
              <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:#1A1410]">
                {/* TODO: replace with next/image once BTS-0N lands */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(184,137,58,0.18), rgba(0,0,0,0.45))",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:#F5EDE0]">
                  {img.id} — {img.caption}
                </figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </ul>
      </BtsVelocityBlur>
    </Section>
  );
}
