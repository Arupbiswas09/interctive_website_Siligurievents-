/**
 * LocationsHubStatsStrip — 4-stat editorial strip with brass diamond
 * separators. Server component, no animation needed.
 */

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";

type Stat = {
  value: string;
  label: string;
};

const STATS: ReadonlyArray<Stat> = [
  { value: "36", label: "Cities" },
  { value: "4", label: "States" },
  { value: "248", label: "Events" },
  {
    value: "Mahananda Park",
    label: "Most-frequented venue · Siliguri",
  },
];

export function LocationsHubStatsStrip(): React.ReactElement {
  return (
    <Section tone="gold" spacing="md">
      <Container>
        <div className="flex flex-col gap-[var(--space-6)]">
          <Eyebrow tone="accent">By the numbers</Eyebrow>

          <ul className="flex flex-col items-stretch gap-[var(--space-6)] md:flex-row md:items-end md:gap-0">
            {STATS.map((stat, idx) => (
              <li
                key={stat.label}
                className="relative flex flex-1 flex-col gap-[var(--space-2)] md:px-[var(--space-6)]"
              >
                <span className="font-display text-[length:var(--text-4xl)] italic leading-none tracking-[var(--tracking-display)] text-[color:var(--color-ink)] md:text-[length:var(--text-5xl)]">
                  {stat.value}
                </span>
                <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
                  {stat.label}
                </span>

                {idx < STATS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-6px] top-1/2 hidden h-3 w-3 -translate-y-1/2 rotate-45 md:block"
                    style={{ background: "var(--color-gold)" }}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
