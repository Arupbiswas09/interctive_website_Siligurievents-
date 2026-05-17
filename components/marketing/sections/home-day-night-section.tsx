// Parallel-agent component — see docs/09-IMAGE-PROMPTS.md §M.
// The switcher is already a self-contained <Section> with eyebrow + heading
// + intro slots, so this wrapper just supplies the Home-page-specific copy
// and stays a Server Component. The masked-reveal scroll trigger lives
// inside the switcher's own stage component (parallel-agent contract).
import { DayNightDecorSwitcher } from "@/components/marketing/sections/day-night-decor-switcher";

/**
 * Home — Day/Night decor switcher section.
 *
 * Sits between H5 (services overview) and H6 (testimonials marquee).
 * The underlying `DayNightDecorSwitcher` owns its own Section primitive,
 * structured-data attributes, and the interactive stage; we override the
 * default eyebrow + heading + intro with Home-flavoured copy.
 *
 * Scroll trigger: the switcher's stage internally registers the masked-
 * reveal entrance (per docs/06b-ANIMATION-V2.md SIG-12 family).
 */
export function HomeDayNightSection(): React.ReactElement {
  return (
    <DayNightDecorSwitcher
      eyebrow="The same venue, twice"
      heading="What we design at midday is not what we design at midnight."
      intro={
        // TODO(sprint-2): replace with CMS SiteSettings.dayNightBlurb
        "Drag the slider to see how a single setting transforms across the day — the same flowers, the same fabric, an entirely new room of feeling."
      }
    />
  );
}
