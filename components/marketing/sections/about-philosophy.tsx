import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { DevanagariFlourish } from "@/components/ui/devanagari-flourish";
import { cn } from "@/lib/utils";
import { PhilosophyProgressLine } from "./about-philosophy-progress";

interface Step {
  number: string;
  title: string;
  body: string;
}

/**
 * SIG-13 "Diya" companion — a tiny inline jasmine-bloom SVG that fades in
 * at the start of each numbered step. Decorative; aria-hidden. Inline so
 * no extra HTTP request, and fade-in is handled by the containing
 * `RevealOnScroll` (so reduced-motion is honored upstream).
 */
function JasmineBloom(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width="22"
      height="22"
      className="text-[color:var(--color-gold)]"
    >
      <g fill="currentColor" fillOpacity="0.85">
        <ellipse cx="16" cy="9" rx="3" ry="6" />
        <ellipse
          cx="16"
          cy="9"
          rx="3"
          ry="6"
          transform="rotate(72 16 16)"
        />
        <ellipse
          cx="16"
          cy="9"
          rx="3"
          ry="6"
          transform="rotate(144 16 16)"
        />
        <ellipse
          cx="16"
          cy="9"
          rx="3"
          ry="6"
          transform="rotate(216 16 16)"
        />
        <ellipse
          cx="16"
          cy="9"
          rx="3"
          ry="6"
          transform="rotate(288 16 16)"
        />
      </g>
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

// Numbered, four-step process — per docs/05 §5.2.3.
const STEPS: ReadonlyArray<Step> = [
  {
    number: "01",
    title: "Discover",
    body: "TODO: copy — we start with the family, the ceremonies and the constraints. Site visit, mood board, references.",
  },
  {
    number: "02",
    title: "Design",
    body: "TODO: copy — palette, materials, lighting plan, mandap and stage drawings. Sign-off before any spend.",
  },
  {
    number: "03",
    title: "Stage",
    body: "TODO: copy — build day. Crew on site from sunrise. We finish the last petal before guests arrive.",
  },
  {
    number: "04",
    title: "Document",
    body: "TODO: copy — coordinated handoff to your photographer and videographer, a tidy strike, and the photographs sent to you.",
  },
];

/**
 * About §3 — Philosophy / how we work.
 * Four-step numbered process: Discover · Design · Stage · Document.
 */
export function AboutPhilosophy(): React.ReactElement {
  return (
    <Section as="section" tone="default" spacing="lg">
      <Container>
        <div className="flex flex-col gap-[var(--space-12)]">
          <header className="flex max-w-[80ch] flex-col gap-[var(--space-4)]">
            <RevealOnScroll>
              <Eyebrow tone="gold">How we work</Eyebrow>
            </RevealOnScroll>

            <RevealOnScroll delay={0.05}>
              <DevanagariFlourish
                glyph="utsav"
                latin=""
                placement="above"
                size="md"
              />
            </RevealOnScroll>

            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="Discover. Design. Stage. Document."
              className="max-w-[22ch]"
            />

            <RevealOnScroll delay={0.15}>
              <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: philosophy intro */}
                A process honed across hundreds of celebrations. Every event
                runs through these four stages, scaled to the brief.
              </p>
            </RevealOnScroll>
          </header>

          <div className="relative">
            {/* Scroll-progress line connecting the four steps. Sits above the
                hairline border-t of each step (lg only — the line is
                horizontal). On smaller breakpoints we hide it cleanly. */}
            <PhilosophyProgressLine className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block" />

            <ol
              className={cn(
                "grid gap-[var(--space-8)]",
                "md:grid-cols-2 lg:grid-cols-4 lg:gap-[var(--space-10)]",
              )}
              aria-label="Our four-step process"
            >
              {STEPS.map((step, idx) => (
                <RevealOnScroll
                  key={step.number}
                  delay={0.1 + idx * 0.08}
                  as="li"
                  className="relative flex flex-col gap-[var(--space-4)] border-t border-[color:var(--color-border)] pt-[var(--space-6)]"
                >
                  <div className="flex items-center gap-[var(--space-3)]">
                    <JasmineBloom />
                    <span
                      aria-hidden="true"
                      className="font-display text-[length:var(--text-4xl)] leading-none tracking-[var(--tracking-display)] text-[color:var(--color-gold)]"
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-[length:var(--text-2xl)] leading-tight tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                    {step.title}
                  </h3>
                  <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {step.body}
                  </p>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
