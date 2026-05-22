import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

interface PressItem {
  id: string;
  /** Publication / award / association name. */
  name: string;
  /** Short context line that we render below the placeholder logo. */
  note?: string;
}

// Press list. Real publication relationships replace these placeholders
// once the owner shares the verified list.
const PRESS: ReadonlyArray<PressItem> = [
  { id: "PRESS-01", name: "WeddingSutra", note: "Featured Decorator, 2024" },
  { id: "PRESS-02", name: "Wedding Affair", note: "North Bengal Issue" },
  { id: "PRESS-03", name: "ShaadiSaga", note: "Vendor of the Year, North" },
  { id: "PRESS-04", name: "The Telegraph", note: "Lifestyle column" },
  { id: "PRESS-05", name: "WedMeGood", note: "Top-rated, Siliguri" },
];

/**
 * About §6 — Press / features.
 * Logo strip — keeps a visible "TODO" until real press links land in CMS.
 */
export function AboutPress(): React.ReactElement {
  return (
    <Section as="section" tone="default" spacing="md">
      <Container>
        <div className="flex flex-col gap-[var(--space-8)]">
          <RevealOnScroll>
            <Eyebrow>As seen in</Eyebrow>
          </RevealOnScroll>

          <ul
            className="grid grid-cols-2 gap-[var(--space-6)] sm:grid-cols-3 md:grid-cols-5"
            aria-label="Press features and accolades"
          >
            {PRESS.map((item, idx) => (
              <RevealOnScroll
                key={item.id}
                delay={0.04 * idx}
                as="li"
                className="flex flex-col items-start gap-[var(--space-2)]"
              >
                <div
                  className="flex h-14 w-full items-center border border-dashed border-[color:var(--color-border)] px-[var(--space-3)] text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]"
                  aria-hidden="true"
                >
                  {item.name}
                </div>
                {item.note ? (
                  <p className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
                    {item.note}
                  </p>
                ) : null}
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
