import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

type Factor = {
  title: string;
  body: string;
};

const FACTORS: ReadonlyArray<Factor> = [
  {
    title: "Guest count",
    body:
      "More guests means more seating, more florals, larger stages and a bigger crew. The single biggest driver of cost.",
  },
  {
    title: "Days and functions",
    body:
      "A single haldi versus a four-day wedding storyline — every additional day means changeovers, fresh florals and overnight logistics.",
  },
  {
    title: "Location and distance",
    body:
      "In-town Siliguri is one thing; tea-estate destinations in the Dooars or hillside venues in Darjeeling and Kalimpong carry travel, freight and setup costs.",
  },
  {
    title: "Season and dates",
    body:
      "Auspicious peak-season dates and Durga Puja weeks command premium florals and crew. Off-season is more flexible.",
  },
  {
    title: "Flowers in or out of season",
    body:
      "Marigold in October behaves very differently from imported lilies in May. We design to season wherever we can.",
  },
  {
    title: "Lighting complexity",
    body:
      "Ambient warm-light is one budget. Programmed cues, moving heads and a full plot for a stage choreography is another.",
  },
  {
    title: "Set-build and custom fabrication",
    body:
      "Standard mandap versus a hand-built one. Borrowed props versus made-to-measure. The deeper we go bespoke, the further up the band you climb.",
  },
];

/**
 * Pricing — "What affects price" list.
 * Per docs/05-PAGE-SPECS.md §5.7 §5.
 */
export function PricingAffectsList(): React.ReactElement {
  return (
    <Section tone="default" spacing="lg">
      <Container>
        <div className="mb-[var(--space-12)] max-w-[60ch]">
          <Eyebrow>What shapes a quote</Eyebrow>
          <DisplayHeading
            as="h2"
            size="lg"
            text="Seven things that move the number."
            className="mt-[var(--space-3)] text-balance"
          />
        </div>

        <ol className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 md:gap-[var(--space-12)]">
          {FACTORS.map((f, idx) => (
            <RevealOnScroll
              key={f.title}
              delay={idx * 0.05}
              as="li"
              className="flex flex-col gap-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-5)]"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[length:var(--text-xl)] tracking-[var(--tracking-display)] leading-[1.05]">
                {f.title}
              </h3>
              <p className="text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
                {f.body}
              </p>
            </RevealOnScroll>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
