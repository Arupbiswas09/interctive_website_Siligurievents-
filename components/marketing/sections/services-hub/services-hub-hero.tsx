/**
 * ServicesHubHero — opening editorial hero for /services.
 *
 * 60svh, eyebrow, italic display headline, body, scroll cue. A slowly
 * rotating mandala ornament sits behind the type at low opacity.
 *
 * Mostly a Server Component. The rotation is CSS-driven (no JS) so the
 * whole section stays free of "use client" overhead.
 */

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";

export function ServicesHubHero(): React.ReactElement {
  return (
    <Section
      tone="default"
      spacing="xl"
      className="relative isolate overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
    >
      {/* Backdrop colour wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            background:
              "radial-gradient(ellipse at 15% 0%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 90% 40%, rgba(139,26,26,0.20) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-bg) 92%)",
          }}
        />
      </div>

      {/* Rotating mandala — CSS-only animation, paused for reduced motion via
          the global motion-reduce reset in globals.css. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[6%] -z-10 w-[min(82vw,840px)] opacity-[0.18] motion-reduce:animate-none"
        style={{
          animation: "sgv-spin-slow 180s linear infinite",
        }}
      >
        <CeremonyOrnament name="mandala" hue="var(--color-gold)" />
      </div>

      <style>{`
        @keyframes sgv-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Container>
        <div
          className="flex flex-col gap-[var(--space-8)]"
          style={{ minHeight: "60svh" }}
        >
          <div className="flex max-w-[1100px] flex-col gap-[var(--space-6)]">
            <RevealOnScroll>
              <Eyebrow tone="accent">What we design</Eyebrow>
            </RevealOnScroll>

            <DisplayHeading
              as="h1"
              size="hero"
              split
              splitMode="words"
              text="Twelve ceremonies. One studio."
              className="max-w-[18ch] italic [font-size:clamp(28px,5.4vw,60px)]"
            />

            <RevealOnScroll delay={0.2}>
              <p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
                From a 40-guest haldi morning to a 600-guest reception — every
                ceremony we stage is designed in the same studio, with the same
                eye for cloth, light and flower. Pick the one you are planning
                and we will show you the world we have already built for it.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll
            delay={0.35}
            className="mt-auto flex items-center gap-[var(--space-3)] text-[color:var(--color-ink-muted)]"
          >
            <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]">
              Scroll
            </span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-12 bg-current opacity-60"
            />
            <span
              aria-hidden="true"
              className="inline-block animate-bounce text-[length:var(--text-sm)] motion-reduce:animate-none"
            >
              ↓
            </span>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
