import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

type CeremonyRitualNarrativeProps = {
  theme: CeremonyTheme;
};

type PaletteStyle = CSSProperties & {
  "--color-bg": string;
  "--color-bg-soft": string;
  "--color-ink": string;
  "--color-accent": string;
  "--color-accent-deep": string;
  "--color-gold": string;
  "--color-gold-deep": string;
  "--color-gold-soft": string;
};

/**
 * CeremonyRitualNarrative
 *
 * Editorial vertical layout — each ritual stage is its own row: image on
 * one side, text on the other, alternating sides. Server Component, no
 * GSAP scroll-pin (the pin pattern produced blank canvas gaps on slow /
 * smooth-scroll devices).
 */
export function CeremonyRitualNarrative({
  theme,
}: CeremonyRitualNarrativeProps): ReactElement {
  const stages = theme.ritualStages;

  const paletteStyle: PaletteStyle = {
    "--color-bg": theme.palette.bg,
    "--color-bg-soft": theme.palette.bgSoft,
    "--color-ink": theme.palette.ink,
    "--color-accent": theme.palette.accent,
    "--color-accent-deep": theme.palette.accentDeep,
    "--color-gold": theme.palette.gold,
    "--color-gold-deep": theme.palette.goldDeep,
    "--color-gold-soft": theme.palette.goldSoft,
    backgroundColor: theme.palette.bg,
    color: theme.palette.ink,
  };

  return (
    <section
      aria-label="The ritual, stage by stage"
      className="relative isolate overflow-hidden py-[var(--space-20)]"
      style={paletteStyle}
    >
      <Container>
        <header className="mb-[var(--space-12)]">
          <Eyebrow tone="gold">
            <span>The ritual, stage by stage</span>
            <span
              aria-hidden="true"
              className="mx-2 inline-block h-px w-3"
              style={{ backgroundColor: theme.palette.goldDeep }}
            />
            <span>{theme.periodLabel}</span>
          </Eyebrow>
        </header>
      </Container>

      <Container>
        <ul className="space-y-[var(--space-16)] md:space-y-[var(--space-24)]">
          {stages.map((stage, i) => (
            <li
              key={stage.index}
              className="grid gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-12)] md:items-center"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-sm md:col-span-7 ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}
                style={{
                  boxShadow: `0 30px 80px -40px ${theme.palette.ink}66, 0 0 0 1px ${theme.palette.goldDeep}22`,
                }}
              >
                <Image
                  src={stage.image}
                  alt={stage.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: theme.palette.photoTint }}
                />
                <div className="pointer-events-none absolute right-[var(--space-5)] bottom-[var(--space-5)] left-[var(--space-5)] flex items-end justify-between gap-4">
                  <span
                    className="font-mono text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)] uppercase"
                    style={{
                      color: theme.palette.bg,
                      textShadow: `0 1px 12px ${theme.palette.ink}99`,
                    }}
                  >
                    {stage.index} · {theme.periodLabel}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-px w-12"
                    style={{
                      backgroundColor: theme.palette.bg,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>

              <div
                className={`md:col-span-5 ${i % 2 === 0 ? "md:order-2" : "md:order-1"}`}
              >
                <span
                  aria-hidden="true"
                  className="font-display block leading-none italic"
                  style={{
                    color: theme.palette.accent,
                    fontWeight: 200,
                    fontSize: "clamp(72px, 10vw, 160px)",
                  }}
                >
                  {stage.index}
                </span>
                <h3
                  className="font-display mt-[var(--space-3)] italic"
                  style={{
                    color: theme.palette.goldDeep,
                    fontSize: "clamp(28px, 3.4vw, 52px)",
                    lineHeight: 1.1,
                    fontWeight: 400,
                  }}
                >
                  {stage.title}
                </h3>
                <p
                  className="mt-[var(--space-4)] max-w-[50ch] text-[length:var(--text-base)] leading-relaxed md:text-[length:var(--text-lg)]"
                  style={{ color: theme.palette.ink, opacity: 0.86 }}
                >
                  {stage.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {theme.closingMantra ? (
        <Container>
          <p
            className="font-script mx-auto mt-[var(--space-16)] max-w-[40ch] py-[var(--space-12)] text-center"
            style={{
              color: theme.palette.accent,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.2,
            }}
          >
            {theme.closingMantra}
          </p>
        </Container>
      ) : null}
    </section>
  );
}
