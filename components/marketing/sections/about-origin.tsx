import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * About §2 — Origin story.
 * Three editorial paragraphs + image inset (founder at work).
 */
export function AboutOrigin(): React.ReactElement {
  return (
    <Section as="section" tone="elevated" spacing="lg">
      <Container>
        <div className="grid gap-[var(--space-12)] md:grid-cols-[0.9fr_1.1fr] md:gap-[var(--space-16)]">
          <div className="order-2 md:order-1">
            <RevealOnScroll>
              <figure
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]"
                aria-label="TODO: founder-at-work alt text"
              >
                {/* TODO: replace with next/image once ABOUT-02 lands */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 20%, rgba(184,137,58,0.30) 0%, transparent 60%), linear-gradient(180deg, rgba(30,42,56,0.20), rgba(30,42,56,0.05))",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-[var(--space-4)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
                  IMG: ABOUT-02 founder at work
                </figcaption>
              </figure>
            </RevealOnScroll>
          </div>

          <div className="order-1 flex flex-col gap-[var(--space-6)] md:order-2">
            <RevealOnScroll>
              <Eyebrow>Origin</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="A studio built between Sevoke Road and a coldroom of jasmines."
              className="max-w-[22ch]"
            />

            <div className="flex max-w-[60ch] flex-col gap-[var(--space-4)] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
              <RevealOnScroll delay={0.1} as="p">
                {/* TODO: origin paragraph 1 */}
                Siligurievent began as a one-person decoration practice on
                Sevoke Road, taking on Bengali weddings and Annaprashan
                ceremonies for friends of friends. The first mandap was built
                in a borrowed garage, with bamboo from the timber yard down
                the road.
              </RevealOnScroll>

              <RevealOnScroll delay={0.18} as="p">
                {/* TODO: origin paragraph 2 */}
                Twelve years later the studio runs a full workshop, a floral
                coldroom and a small permanent crew, but the working idea has
                not changed: design every event the way you would design a
                room you have to live in afterwards.
              </RevealOnScroll>

              <RevealOnScroll delay={0.26} as="p">
                {/* TODO: origin paragraph 3 */}
                We work across the whole of North Bengal — Siliguri, Bagdogra,
                Jalpaiguri, Kalimpong, Darjeeling — and over the border into
                Sikkim and the Dooars when families bring us along.
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
