/**
 * Branded eases for Siligurievent.
 *
 * Two forms are exported:
 *   - `EASE.*` — cubic-bezier strings safe to pass to any GSAP `ease`.
 *   - `registerCustomEases()` — best-effort registration of named eases
 *     ("brass", "ink", "petal") via the Club GSAP `CustomEase` plugin.
 *
 * If CustomEase is unavailable, the named eases fall back to the closest
 * cubic-bezier string — call sites can continue to reference `EASE.brass`
 * without branching.
 */

import { gsap } from "gsap";

/**
 * Cubic-bezier strings. These are GSAP-compatible (`ease: EASE.brass`).
 * Numbers chosen per docs/06b §6b.1 brand-ease intentions.
 */
export const EASE = {
  /** Pulled-from-back, settles. Use for entrances, hero-class moments. */
  brass: "cubic-bezier(0.16, 0.84, 0.22, 1)",
  /** Expressive, gentle. Use for paragraph/body reveals. */
  ink: "cubic-bezier(0.65, 0.05, 0.36, 1)",
  /** Organic drop. Use for floating/falling decoration. */
  petal: "cubic-bezier(0.2, 0.9, 0.4, 1)",
  /** Generic emphatic out — matches existing motion library default. */
  emphatic: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Strong both-sides — display copy splits. */
  display: "cubic-bezier(0.85, 0, 0.15, 1)",
} as const;

export type BrandEaseName = keyof typeof EASE;

type CustomEaseLike = {
  create: (id: string, definition: string) => unknown;
};

type GsapWithPlugins = typeof gsap & {
  plugins?: Record<string, unknown>;
};

let registered = false;

/**
 * Idempotently registers the three brand-curve eases as GSAP CustomEases
 * ("brass", "ink", "petal") so they can be referenced by NAME in any tween
 * (`ease: "brass"`). Safe to call repeatedly. No-op if CustomEase plugin
 * is not available — call sites should keep using `EASE.brass` (the
 * cubic-bezier string fallback) so this remains optional.
 *
 * @returns `true` if registration succeeded, `false` if the plugin was
 *          unavailable and string fallbacks must be used instead.
 */
export function registerCustomEases(): boolean {
  if (registered) return true;
  if (typeof window === "undefined") return false;

  const plugins = (gsap as GsapWithPlugins).plugins ?? {};
  const CustomEase = plugins.CustomEase as CustomEaseLike | undefined;
  if (!CustomEase || typeof CustomEase.create !== "function") return false;

  try {
    // Curves per docs/06b-ANIMATION-V2.md §6b.1.
    CustomEase.create("brass", "M0,0 C0.16,0.84 0.22,1 1,1");
    CustomEase.create("ink", "M0,0 C0.65,0.05 0.36,1 1,1");
    CustomEase.create("petal", "M0,0 C0.2,0.9 0.1,1 0.4,1 0.7,1 1,1 1,1");
    registered = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve a brand ease name to a value GSAP can consume right now.
 * Prefers the registered CustomEase name (smoother curve); falls back to
 * the cubic-bezier string if CustomEase isn't available.
 */
export function resolveEase(name: BrandEaseName): string {
  if (registered && (name === "brass" || name === "ink" || name === "petal")) {
    return name;
  }
  return EASE[name];
}
