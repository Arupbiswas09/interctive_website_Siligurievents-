import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";
import { getFeaturedDecorPairs, type DecorPair } from "@/lib/cms/decor-pairs";
import { DecorSwitcherStage } from "@/components/marketing/decor-switcher/decor-switcher-stage";

type DayNightDecorSwitcherProps = {
  /**
   * Override the displayed pairs. When omitted, the section pulls
   * its 4 launch pairs from `getFeaturedDecorPairs()`.
   * Pass a subset to embed the switcher on a service page with a
   * curated set (e.g. only mandap variants).
   */
  pairs?: ReadonlyArray<DecorPair>;
  /** Override the eyebrow label — defaults to the Home-page copy. */
  eyebrow?: string;
  /** Override the section heading. */
  heading?: string;
  /** Override the intro paragraph. */
  intro?: string;
  className?: string;
};

const DEFAULT_EYEBROW = "Same decor, after dark";
const DEFAULT_HEADING = "Same decor. After dark.";
const DEFAULT_INTRO =
  "Pull the rope. Every set you see was photographed twice — once by daylight, " +
  "once after sunset with its own lights turned on. The decor never changes; " +
  "only the hour does.";

/**
 * DayNightDecorSwitcher — signature interactive section.
 *
 * Server Component shell:
 *  - Eyebrow + display heading + intro paragraph (static).
 *  - JSON-LD-ready data attributes on the gallery (consumed by the
 *    SEO layer in lib/seo/ when we wire structured data per page).
 *  - Hands off interactivity to <DecorSwitcherStage /> (Client).
 *
 * The component is also embeddable on any service page — pass
 * `pairs` to override the curated set.
 */
export function DayNightDecorSwitcher({
  pairs,
  eyebrow = DEFAULT_EYEBROW,
  heading = DEFAULT_HEADING,
  intro = DEFAULT_INTRO,
  className,
}: DayNightDecorSwitcherProps): React.ReactElement {
  const resolvedPairs = pairs ?? getFeaturedDecorPairs();

  return (
    <Section
      tone="default"
      spacing="lg"
      className={cn("relative", className)}
      // Data attributes used by lib/seo to emit an ImageGallery JSON-LD
      // structured-data block at the page level.
      // The attributes are namespaced (`data-sd-*`) so any structured-data
      // walker can recognise them.
    >
      <Container>
        <div
          className="mb-[var(--space-8)] max-w-[640px]"
          data-sd-type="ImageGallery"
          data-sd-name={heading}
          data-sd-count={resolvedPairs.length}
        >
          <Eyebrow tone="gold">{eyebrow}</Eyebrow>
          <div className="mt-[var(--space-3)]">
            <DisplayHeading as="h2" text={heading} split splitMode="words" />
          </div>
          <p
            className={cn(
              "mt-[var(--space-4)] max-w-[56ch]",
              "text-[length:var(--text-base)] leading-[1.55]",
              "text-[color:var(--color-ink-muted)]",
            )}
          >
            {intro}
          </p>
        </div>

        {/* Hidden microdata for the gallery — one node per pair */}
        <ul className="sr-only" aria-hidden="true">
          {resolvedPairs.map((pair) => (
            <li
              key={pair.pairId}
              data-sd-image-pair={pair.pairId}
              data-sd-caption={pair.caption}
              data-sd-day={pair.dayImageSrc}
              data-sd-night={pair.nightImageSrc}
            />
          ))}
        </ul>

        <DecorSwitcherStage pairs={resolvedPairs} />
      </Container>
    </Section>
  );
}
