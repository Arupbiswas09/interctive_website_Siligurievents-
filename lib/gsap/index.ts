/**
 * Curated re-exports for the Siligurievent GSAP library.
 *
 * Import named members from here for ergonomic consumer code:
 *
 *   import { maskedReveal, createHeroTimeline, EASE } from "@/lib/gsap";
 *
 * This is NOT a fat barrel — it lists only the public API. Internal
 * helpers (e.g. clipInsetFrom, isLowBandwidth) stay private to their files.
 * For tree-shaking we use explicit `export { ... }` lists, not `export *`.
 *
 * Importing this module also pulls in `./register` for its side effects,
 * guaranteeing ScrollTrigger and Observer are registered before any
 * factory or timeline runs.
 */

// Side-effect: register plugins once. Safe (idempotent) and SSR-friendly.
import "./register";

// Eases — branded curves used across the site.
export { EASE, registerCustomEases, resolveEase } from "./eases";
export type { BrandEaseName } from "./eases";

// ScrollTrigger factory functions.
export {
  pinHorizontalScrub,
  maskedReveal,
  scrollParallax,
  stickyChapterDots,
  scrollProgressBar,
  scrubbedCounter,
  reveelOnScroll,
  pinnedNarrative,
  velocityBlur,
  scrollVelocityFontWeight,
  flipTransition,
  tintFromImage,
} from "./scroll-triggers";
export type {
  Cleanup,
  PinHorizontalScrubOpts,
  MaskedRevealOpts,
  ScrollParallaxOpts,
  StickyChapterDotsOpts,
  ScrollProgressBarOpts,
  ScrubbedCounterOpts,
  ReveelOnScrollOpts,
  PinnedNarrativeOpts,
  VelocityBlurOpts,
  ScrollVelocityFontWeightOpts,
  FlipTransitionOpts,
  TintFromImageOpts,
} from "./scroll-triggers";

// Page-level master timelines.
export {
  createHeroTimeline,
  createCaseStudyCoverTimeline,
  createSignatureWorkPinnedTimeline,
  createDayNightSwitchTimeline,
} from "./timelines";
export type {
  HeroTimelineRefs,
  CaseStudyCoverRefs,
  SignatureWorkRefs,
  DayNightSwitchRefs,
} from "./timelines";

// Observer hooks. These are the only client-only exports — consumers MUST
// be in a "use client" component to use them, which is the convention for
// any React hook.
export {
  useScrollDirection,
  useScrollVelocity,
  useGrabInteraction,
} from "./observer";
export type {
  ScrollDirection,
  GrabInteractionState,
  GrabInteractionApi,
  UseGrabInteractionOpts,
} from "./observer";
