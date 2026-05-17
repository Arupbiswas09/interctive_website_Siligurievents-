/**
 * Page-level master timelines for Siligurievent.
 *
 * Each `create*Timeline` returns a GSAP timeline (or a `{ timeline, cleanup }`
 * pair where ScrollTrigger pin/state is involved). Timelines are paused by
 * default; callers `play()` or attach them to a ScrollTrigger.
 *
 * All timelines respect `prefers-reduced-motion`: under reduce, the timeline
 * is built with collapsed durations and no transforms (everything reaches
 * its final state in ≤200ms).
 */

import "@/lib/gsap/register";
import { gsap } from "gsap";
import { EASE } from "@/lib/gsap/eases";
import { pinHorizontalScrub, type Cleanup } from "@/lib/gsap/scroll-triggers";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ============================================================
// createHeroTimeline — Home page hero (docs 06 §6.10)
// ============================================================

export type HeroTimelineRefs = {
  eyebrow: Element | null;
  /** The H1 word(s). Each child element with [data-hero-word] animates in. */
  headline: Element | null;
  /** Italic emphasis span(s) inside the headline (e.g., "celebrations"). */
  emphasis: Element | null;
  body: Element | null;
  cta: Element | null;
  /** Figure wrapper — clip-path reveal. */
  image: Element | null;
  /** Inner media layer — Ken-Burns scale. */
  imageMedia?: Element | null;
};

/**
 * Home page hero choreography per docs/06-ANIMATION-STRATEGY.md §6.10:
 *   0.0s   Eyebrow fade + slide-up 12px
 *   0.2s   H1 splits in (chars/words, stagger)
 *   0.6s   Italic emphasis scramble settles (we collapse to autoAlpha here)
 *   0.9s   H1 word 2 splits in (handled by the same word stagger)
 *   1.3s   Body fades in (no translate)
 *   1.5s   CTA fades + scales 0.96 → 1
 *   1.6s   Hero image clip-path inset 100% → 0%
 *   1.6s   Hero image starts subtle 4% Ken-Burns scale
 *
 * Returns a paused timeline. Caller plays it on mount.
 */
export function createHeroTimeline(refs: HeroTimelineRefs): gsap.core.Timeline {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.brass } });

  if (reduced) {
    // Collapsed: every element crossfades into place at the same time.
    const targets = [
      refs.eyebrow,
      refs.headline,
      refs.emphasis,
      refs.body,
      refs.cta,
      refs.image,
    ].filter((t): t is Element => t !== null);
    if (targets.length === 0) return tl;
    tl.fromTo(
      targets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: "none" }
    );
    return tl;
  }

  if (refs.eyebrow) {
    tl.fromTo(
      refs.eyebrow,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      0
    );
  }

  if (refs.headline) {
    const words = refs.headline.querySelectorAll<HTMLElement>("[data-hero-word]");
    const targets: Element[] = words.length > 0 ? Array.from(words) : [refs.headline];
    tl.fromTo(
      targets,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: EASE.display,
        stagger: 0.06,
      },
      0.2
    );
  }

  if (refs.emphasis) {
    tl.fromTo(
      refs.emphasis,
      { autoAlpha: 0, yPercent: 40 },
      { autoAlpha: 1, yPercent: 0, duration: 0.7, ease: EASE.ink },
      0.6
    );
  }

  if (refs.body) {
    tl.fromTo(
      refs.body,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6, ease: "none" },
      1.3
    );
  }

  if (refs.cta) {
    tl.fromTo(
      refs.cta,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE.brass },
      1.5
    );
  }

  if (refs.image) {
    const reveal = "inset(0% 0% 0% 0%)";
    const initial = "inset(0% 100% 0% 0%)";
    tl.fromTo(
      refs.image,
      { clipPath: initial, webkitClipPath: initial },
      {
        clipPath: reveal,
        webkitClipPath: reveal,
        duration: 1.2,
        ease: EASE.brass,
      },
      1.6
    );
  }

  const kenBurnsTarget = refs.imageMedia ?? refs.image;
  if (kenBurnsTarget) {
    tl.fromTo(
      kenBurnsTarget,
      { scale: 1.0 },
      { scale: 1.04, duration: 6, ease: "none" },
      1.6
    );
  }

  return tl;
}

// ============================================================
// createCaseStudyCoverTimeline
// ============================================================

export type CaseStudyCoverRefs = {
  /** The pinned section wrapping the cover. */
  trigger: Element | null;
  /** Background image (full-bleed) with parallax. */
  background: Element | null;
  /** Project title element. */
  title: Element | null;
  /** Optional meta line (year · ceremony · location). */
  meta?: Element | null;
};

/**
 * Full-bleed case-study cover: a parallax background and a title that
 * slides up tied to scroll. Returns a paused timeline plus a ScrollTrigger
 * options bag the caller can wire up — keeps the pin/cleanup contract in
 * the caller's hands so it can compose with `flipTransition`'s arrival.
 */
export function createCaseStudyCoverTimeline(
  refs: CaseStudyCoverRefs
): gsap.core.Timeline {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.ink } });
  if (!refs.trigger) return tl;

  if (reduced) {
    const targets = [refs.background, refs.title, refs.meta ?? null].filter(
      (t): t is Element => t !== null
    );
    if (targets.length === 0) return tl;
    tl.fromTo(
      targets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: "none" }
    );
    return tl;
  }

  if (refs.background) {
    tl.fromTo(
      refs.background,
      { scale: 1.1, yPercent: 0 },
      { scale: 1.0, yPercent: -10, duration: 1, ease: "none" },
      0
    );
  }

  if (refs.title) {
    tl.fromTo(
      refs.title,
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.brass },
      0.1
    );
  }

  if (refs.meta) {
    tl.fromTo(
      refs.meta,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      0.4
    );
  }

  return tl;
}

// ============================================================
// createSignatureWorkPinnedTimeline — Home H4 horizontal scrub
// ============================================================

export type SignatureWorkRefs = {
  /** The section that gets pinned. */
  section: Element | null;
  /** The horizontal track. */
  track: Element | null;
  /** Optional cards inside the track; if provided, each gets a subtle scale tie. */
  cards?: Array<Element | null>;
  markers?: boolean;
};

/**
 * Composes `pinHorizontalScrub` + optional per-card scale ties for the
 * Home page signature work strip. Returns a single cleanup that reverts
 * every owned context. Reduced motion: callers should render a vertical
 * stack in CSS; this factory becomes a no-op.
 */
export function createSignatureWorkPinnedTimeline(
  refs: SignatureWorkRefs
): Cleanup {
  const cleanups: Cleanup[] = [];

  cleanups.push(
    pinHorizontalScrub({
      trigger: refs.section,
      track: refs.track,
      scrub: 0.8,
      markers: refs.markers,
    })
  );

  if (refs.cards && refs.section && !prefersReducedMotion()) {
    const ctx = gsap.context(() => {
      // Stagger a subtle scale-in across cards as the section enters; the
      // horizontal-scrub itself comes from `pinHorizontalScrub` above.
      const cards = (refs.cards ?? []).filter(
        (c): c is Element => c !== null
      );
      if (cards.length === 0) return;
      gsap.fromTo(
        cards,
        { scale: 0.96, autoAlpha: 0.85 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: EASE.brass,
          scrollTrigger: {
            trigger: refs.section,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, refs.section);
    cleanups.push(() => ctx.revert());
  }

  return () => {
    for (const c of cleanups) c();
  };
}

// ============================================================
// createDayNightSwitchTimeline
// ============================================================

export type DayNightSwitchRefs = {
  /** The grid of tiles that crossfades from day to night (or vice versa). */
  tiles: Array<Element | null>;
  /** The background element whose colour/gradient curves. */
  background: Element | null;
  /** Direction of the switch — informs the stagger order. */
  direction: "to-night" | "to-day";
};

/**
 * The visual payoff for the Day↔Night switcher (parallel to the rope-pull
 * state machine). Specs per requirements: stagger 60ms, total 1.2s tile
 * sweep, background curve 1.6s. Returns a paused timeline.
 *
 * Reduced motion: a single 200ms crossfade replaces the choreography.
 */
export function createDayNightSwitchTimeline(
  refs: DayNightSwitchRefs
): gsap.core.Timeline {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ paused: true });

  const validTiles = refs.tiles.filter((t): t is Element => t !== null);

  if (reduced) {
    const targets: Element[] = [...validTiles];
    if (refs.background) targets.push(refs.background);
    if (targets.length === 0) return tl;
    tl.to(targets, { autoAlpha: 1, duration: 0.2, ease: "none" });
    return tl;
  }

  // Order tiles to sweep top-left to bottom-right for "to-night",
  // bottom-right to top-left for "to-day".
  const ordered =
    refs.direction === "to-night" ? validTiles : [...validTiles].reverse();

  // Tile sweep: stagger 60ms over a 1.2s window, ending just before the
  // background fully resolves at 1.6s.
  if (ordered.length > 0) {
    tl.to(
      ordered,
      {
        // Tiles toggle their "is-night" / "is-day" class via a CSS variable;
        // we use a tween on a custom property so consumers can drive whatever
        // their CSS pleases.
        "--switch-progress": 1,
        duration: 0.6,
        ease: EASE.brass,
        stagger: 0.06,
      },
      0
    );
  }

  // Background curve: parallel 1.6s easing on a separate variable.
  if (refs.background) {
    tl.to(
      refs.background,
      {
        "--bg-progress": 1,
        duration: 1.6,
        ease: EASE.ink,
      },
      0
    );
  }

  return tl;
}
