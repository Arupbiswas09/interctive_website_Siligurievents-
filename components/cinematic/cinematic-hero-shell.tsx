import { CinematicHeroCanvas } from "@/components/cinematic/cinematic-hero-canvas";
import { CinematicHeroOverlay } from "@/components/cinematic/cinematic-hero-overlay";
import { HomeHero } from "@/components/marketing/sections/home-hero";

/**
 * CinematicHeroShell — Server Component drop-in replacement for <HomeHero />.
 *
 * Layers:
 *   1. <CinematicHeroCanvas /> — absolutely positioned WebGL/OGL particle
 *      cloud (or fallback gradient) covering the hero bounds.
 *   2. <CinematicHeroOverlay /> — the editorial copy + brass-foil sweep on
 *      the H1, identical content to the current HomeHero.
 *
 * The shell takes the same prop shape as <HomeHero /> (currently no props),
 * so the main agent can swap `<HomeHero />` → `<CinematicHeroShell />` at
 * the call site without other changes.
 *
 * Server component: composes two client islands; doesn't itself need
 * "use client".
 */
export type CinematicHeroShellProps = Record<string, never>;

export function CinematicHeroShell(_props: CinematicHeroShellProps = {}): React.ReactElement {
  void _props;
  return (
    <div className="relative isolate">
      {/*
        Canvas sits behind the overlay. It is absolute-inset on its own
        container; the overlay (a Section with its own padding) defines the
        actual hero height. We pin the canvas to the overlay's bounding box
        via a wrapping `relative` element here.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          // Cap mobile height per perf spec (70vh).
          maxHeight: "min(100%, 100vh)",
        }}
      >
        <CinematicHeroCanvas />
      </div>

      <CinematicHeroOverlay />
    </div>
  );
}

// =============================================================================
// HomeHeroSwitch — env-flag-gated switch between cinematic and editorial.
// =============================================================================

/**
 * HomeHeroSwitch — server component picker. Renders the cinematic hero when
 * `NEXT_PUBLIC_CINEMATIC_HERO=true` is set at build time, otherwise falls
 * back to the existing <HomeHero />.
 *
 * Why env, not feature-flag service: we want this decision baked into the
 * static prerender so there's no flash of editorial hero on first paint.
 * The env reads at build time (Next.js inlines NEXT_PUBLIC_*).
 *
 * Usage in app/(site)/page.tsx:
 *
 *   - import { HomeHero } from "@/components/marketing/sections/home-hero";
 *   + import { HomeHeroSwitch as HomeHero } from "@/components/cinematic/cinematic-hero-shell";
 *
 * (One-line swap. Or import HomeHeroSwitch explicitly and replace `<HomeHero/>`
 * with `<HomeHeroSwitch/>`.)
 */
export function HomeHeroSwitch(): React.ReactElement {
  const enabled =
    process.env.NEXT_PUBLIC_CINEMATIC_HERO === "true" ||
    process.env.NEXT_PUBLIC_CINEMATIC_HERO === "1";

  if (enabled) {
    return <CinematicHeroShell />;
  }
  return <HomeHero />;
}
