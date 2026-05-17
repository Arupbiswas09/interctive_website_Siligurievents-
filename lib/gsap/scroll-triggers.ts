/**
 * Reusable ScrollTrigger factory functions for Siligurievent.
 *
 * Every factory:
 *   - Honours `prefers-reduced-motion`. On reduce, the element is set to its
 *     final visual state and a no-op cleanup is returned.
 *   - Honours `Save-Data` and low-end-device hints for the "heavy" effects
 *     (velocityBlur, scrubbedCounter, tintFromImage).
 *   - Is wrapped in `gsap.context(scope)` and returns a cleanup function
 *     that calls `ctx.revert()`. Callers MUST invoke the cleanup on unmount.
 *   - Has typed options, no `any`.
 *
 * Conventions:
 *   - Accepts elements as `Element | null` so callers can pass `ref.current`
 *     directly. A null target is treated as "no-op, return cleanup".
 *   - `markers` is honoured only in dev (NODE_ENV !== "production").
 *
 * Side-effect import below registers ScrollTrigger + Observer once.
 */

import "@/lib/gsap/register";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/lib/gsap/eases";

// ---------- Shared helpers ----------

/** No-op cleanup, used when an effect short-circuits. */
const NOOP: Cleanup = () => undefined;

export type Cleanup = () => void;

/** SSR-safe `prefers-reduced-motion` check. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type NavigatorConnectionLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

/** True when the user has Save-Data or is on a 2G class connection. */
function isLowBandwidth(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NavigatorConnectionLike })
    .connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") {
    return true;
  }
  return false;
}

/** Resolve markers only in dev. */
function markersInDev(markers: boolean | undefined): boolean {
  if (!markers) return false;
  return process.env.NODE_ENV !== "production";
}

/** Common base options every factory accepts. */
type ScrollTriggerCommonOpts = {
  /** Show ScrollTrigger debug markers in development. */
  markers?: boolean;
};

// ============================================================
// pinHorizontalScrub — SIG-06 / MO-06
// ============================================================

export type PinHorizontalScrubOpts = ScrollTriggerCommonOpts & {
  /** The section that gets pinned. */
  trigger: Element | null;
  /** The horizontally-translated row inside the trigger. */
  track: Element | null;
  /** Scrub coefficient (true = perfect lock, number = smoothing seconds). */
  scrub?: number | boolean;
  /** End position; defaults to a row-width derived value. */
  end?: string | ((self: ScrollTrigger) => string);
  /** Override the translate distance (px). Computed if omitted. */
  distance?: number;
};

/**
 * Pins a section and horizontally scrubs a child row. The default `end`
 * is computed so the row fully traverses its overflow. Reduced motion
 * collapses to a no-op (sections render their normal vertical stack).
 */
export function pinHorizontalScrub(opts: PinHorizontalScrubOpts): Cleanup {
  const { trigger, track } = opts;
  if (!trigger || !track) return NOOP;
  if (prefersReducedMotion()) return NOOP;

  const ctx = gsap.context(() => {
    const trackEl = track as HTMLElement;
    const distance =
      typeof opts.distance === "number"
        ? opts.distance
        : Math.max(0, trackEl.scrollWidth - trackEl.clientWidth);

    gsap.to(trackEl, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger,
        pin: true,
        scrub: opts.scrub ?? 0.8,
        start: "top top",
        end:
          opts.end ??
          (() => `+=${distance}`),
        invalidateOnRefresh: true,
        anticipatePin: 1,
        markers: markersInDev(opts.markers),
      },
    });
  }, trigger);

  return () => ctx.revert();
}

// ============================================================
// maskedReveal — MO-08
// ============================================================

export type MaskedRevealOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** Direction of the inset() collapse. Defaults to `left`. */
  from?: "left" | "right" | "top" | "bottom";
  /** Total reveal duration in seconds. */
  duration?: number;
  start?: string;
  once?: boolean;
};

/**
 * Animates a `clip-path: inset(...)` from fully-clipped to fully-open as
 * the element enters the viewport. The `from` direction controls which
 * side the mask retreats from. Reduced motion shows the final state.
 */
export function maskedReveal(opts: MaskedRevealOpts): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;

  const direction = opts.from ?? "left";
  const initial = clipInsetFrom(direction, 100);
  const settled = clipInsetFrom(direction, 0);

  if (prefersReducedMotion()) {
    (target as HTMLElement).style.clipPath = settled;
    return NOOP;
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      target,
      { clipPath: initial, webkitClipPath: initial },
      {
        clipPath: settled,
        webkitClipPath: settled,
        duration: opts.duration ?? 1.1,
        ease: EASE.brass,
        scrollTrigger: {
          trigger: target,
          start: opts.start ?? "top 80%",
          once: opts.once ?? true,
          markers: markersInDev(opts.markers),
        },
      }
    );
  }, target);

  return () => ctx.revert();
}

function clipInsetFrom(
  direction: "left" | "right" | "top" | "bottom",
  pct: number
): string {
  switch (direction) {
    case "left":
      return `inset(0% ${pct}% 0% 0%)`;
    case "right":
      return `inset(0% 0% 0% ${pct}%)`;
    case "top":
      return `inset(${pct}% 0% 0% 0%)`;
    case "bottom":
      return `inset(0% 0% ${pct}% 0%)`;
  }
}

// ============================================================
// scrollParallax — MO-03
// ============================================================

export type ScrollParallaxOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** -1..1; 0 is static, 1 page-locked, negative reverses. Default 0.3. */
  speed?: number;
};

/**
 * Translates Y based on scroll position; `speed` maps to viewport-height
 * units of travel (0 = static, 1 = full vh up over the element's window).
 * Reduced motion = no-op.
 */
export function scrollParallax(opts: ScrollParallaxOpts): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;
  if (prefersReducedMotion()) return NOOP;

  const speed = opts.speed ?? 0.3;
  if (speed === 0) return NOOP;

  const ctx = gsap.context(() => {
    const distance = speed * (typeof window !== "undefined" ? window.innerHeight : 0);
    gsap.fromTo(
      target,
      { y: -distance / 2 },
      {
        y: distance / 2,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          markers: markersInDev(opts.markers),
        },
      }
    );
  }, target);

  return () => ctx.revert();
}

// ============================================================
// stickyChapterDots
// ============================================================

export type StickyChapterDotsOpts = ScrollTriggerCommonOpts & {
  /** The rail container that holds the dots (one per section). */
  rail: Element | null;
  /** The sections, in document order. Each dot maps 1:1 to a section. */
  sections: Array<Element | null>;
  /** CSS class added to the active dot. Defaults to `is-active`. */
  activeClass?: string;
  /** CSS selector used to locate the dots inside the rail. */
  dotSelector?: string;
  /** Where in the viewport the active section is considered "current". */
  start?: string;
};

/**
 * Highlights one dot from a left-rail set as you scroll through the
 * matching section. Used on long pages (case study, About). Reduced
 * motion still works (no animation involved, just a class toggle).
 */
export function stickyChapterDots(opts: StickyChapterDotsOpts): Cleanup {
  const { rail, sections } = opts;
  if (!rail) return NOOP;

  const dots = Array.from(
    rail.querySelectorAll<HTMLElement>(opts.dotSelector ?? "[data-chapter-dot]")
  );
  if (dots.length === 0) return NOOP;

  const activeClass = opts.activeClass ?? "is-active";
  const triggers: ScrollTrigger[] = [];

  const ctx = gsap.context(() => {
    sections.forEach((section, index) => {
      if (!section) return;
      const dot = dots[index];
      if (!dot) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: opts.start ?? "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveDot(dots, dot, activeClass),
          onEnterBack: () => setActiveDot(dots, dot, activeClass),
          markers: markersInDev(opts.markers),
        })
      );
    });
  }, rail);

  return () => {
    for (const t of triggers) t.kill();
    ctx.revert();
  };
}

function setActiveDot(
  dots: HTMLElement[],
  active: HTMLElement,
  className: string
): void {
  for (const d of dots) d.classList.remove(className);
  active.classList.add(className);
}

// ============================================================
// scrollProgressBar
// ============================================================

export type ScrollProgressBarOpts = ScrollTriggerCommonOpts & {
  /** Element whose `transform: scaleX()` will be tweened 0..1. */
  bar: Element | null;
  /** Container the progress is measured against. Defaults to the document. */
  container?: Element | null;
  /** Smooth the progress with this many seconds of lag. 0 = perfect lock. */
  scrub?: number | boolean;
};

/**
 * Drives a horizontal progress bar's `transform: scaleX()` from 0 to 1 as
 * the user scrolls through the container (or the page). The bar element
 * should be pre-styled with `transform-origin: left` for a left-anchored
 * fill. Reduced motion: bar is set to 1 (filled) immediately so the
 * "you have arrived" affordance is honest.
 */
export function scrollProgressBar(opts: ScrollProgressBarOpts): Cleanup {
  const { bar } = opts;
  if (!bar) return NOOP;

  const barEl = bar as HTMLElement;
  if (prefersReducedMotion()) {
    barEl.style.transform = "scaleX(1)";
    return NOOP;
  }

  const ctx = gsap.context(() => {
    const trigger = opts.container ?? document.documentElement;
    gsap.fromTo(
      barEl,
      { scaleX: 0, transformOrigin: "0% 50%" },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: opts.scrub ?? 0.2,
          markers: markersInDev(opts.markers),
        },
      }
    );
  }, barEl);

  return () => ctx.revert();
}

// ============================================================
// scrubbedCounter
// ============================================================

export type ScrubbedCounterOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** Final integer to count to. */
  to: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Number of decimal places to render. */
  decimals?: number;
  /** Optional formatter (e.g. INR ₹ band). Wraps the displayed string. */
  format?: (value: number) => string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
};

/**
 * Number counter scrubbed by scroll progress — alternative to the
 * fire-and-forget MO-09 NumberCounter. Heavy effect: short-circuits on
 * `Save-Data` (sets final value). Reduced motion: shows final value.
 */
export function scrubbedCounter(opts: ScrubbedCounterOpts): Cleanup {
  const { target, to } = opts;
  if (!target) return NOOP;

  const el = target as HTMLElement;
  const from = opts.from ?? 0;
  const decimals = Math.max(0, opts.decimals ?? 0);
  const format =
    opts.format ?? ((value: number): string => value.toFixed(decimals));

  if (prefersReducedMotion() || isLowBandwidth()) {
    el.textContent = format(to);
    return NOOP;
  }

  const state = { value: from };

  const ctx = gsap.context(() => {
    el.textContent = format(from);
    gsap.to(state, {
      value: to,
      ease: "none",
      onUpdate: () => {
        el.textContent = format(state.value);
      },
      scrollTrigger: {
        trigger: target,
        start: opts.start ?? "top 80%",
        end: opts.end ?? "bottom 60%",
        scrub: opts.scrub ?? 0.5,
        markers: markersInDev(opts.markers),
      },
    });
  }, el);

  return () => ctx.revert();
}

// ============================================================
// reveelOnScroll (generic enter)
// ============================================================

export type ReveelOnScrollOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  distance?: number;
  duration?: number;
  delay?: number;
  start?: string;
  /** Cubic-bezier or named GSAP ease. */
  ease?: string;
};

/**
 * Generic fade + translate-up on enter (single-fire). Mirrors MO-02 but
 * is offered here as a factory so consumers building one-off timelines
 * can compose it with other scroll-triggers without mounting a component.
 * Reduced motion: 200ms autoAlpha fade only.
 */
export function reveelOnScroll(opts: ReveelOnScrollOpts): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.fromTo(
        target,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: opts.start ?? "top 85%",
            once: true,
          },
        }
      );
      return;
    }

    gsap.fromTo(
      target,
      { autoAlpha: 0, y: opts.distance ?? 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: opts.duration ?? 0.9,
        delay: opts.delay ?? 0,
        ease: opts.ease ?? EASE.emphatic,
        scrollTrigger: {
          trigger: target,
          start: opts.start ?? "top 85%",
          once: true,
          markers: markersInDev(opts.markers),
        },
      }
    );
  }, target);

  return () => ctx.revert();
}

// ============================================================
// pinnedNarrative
// ============================================================

export type PinnedNarrativeOpts = ScrollTriggerCommonOpts & {
  trigger: Element | null;
  /** Build the internal step timeline. Receives a paused timeline to populate. */
  build: (tl: gsap.core.Timeline) => void;
  /** End position; defaults to `+=200%` (two viewports). */
  end?: string | ((self: ScrollTrigger) => string);
  scrub?: number | boolean;
  /** Pin spacing; defaults to true (preserves scroll layout). */
  pinSpacing?: boolean;
};

/**
 * Pins a section and plays a multi-step internal timeline tied to scroll
 * progress. Used for the home hero and case-study chapters. The `build`
 * callback is the only contract — it populates the timeline with `.from`,
 * `.to`, `.add` steps as it sees fit; this factory handles pin/cleanup.
 *
 * Reduced motion: invokes the builder with a non-scroll-tied timeline so
 * the steps still play but at natural speed, then collapses pin behaviour.
 */
export function pinnedNarrative(opts: PinnedNarrativeOpts): Cleanup {
  const { trigger, build } = opts;
  if (!trigger) return NOOP;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) {
      // No pin; just play the builder steps inline at natural speed.
      const tl = gsap.timeline({
        scrollTrigger: { trigger, start: "top 80%", once: true },
      });
      build(tl);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        pin: true,
        pinSpacing: opts.pinSpacing ?? true,
        start: "top top",
        end: opts.end ?? "+=200%",
        scrub: opts.scrub ?? 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: markersInDev(opts.markers),
      },
    });
    build(tl);
  }, trigger);

  return () => ctx.revert();
}

// ============================================================
// velocityBlur — SIG-03 companion
// ============================================================

export type VelocityBlurOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** Max blur in px. Default 4. */
  maxBlur?: number;
  /** Max skewX in deg. Default 6. */
  maxSkew?: number;
  /** How aggressively velocity maps to blur (px per (px/ms)). Default 0.0016. */
  sensitivity?: number;
};

/**
 * Applies a `filter: blur()` + `skewX` proportional to scroll velocity,
 * easing back to 0 with `gsap.quickTo`. Heavy effect: short-circuits on
 * Save-Data / reduced-motion.
 */
export function velocityBlur(opts: VelocityBlurOpts): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;
  if (prefersReducedMotion() || isLowBandwidth()) return NOOP;

  const el = target as HTMLElement;
  const maxBlur = opts.maxBlur ?? 4;
  const maxSkew = opts.maxSkew ?? 6;
  const sensitivity = opts.sensitivity ?? 0.0016;

  let st: ScrollTrigger | null = null;
  let cleanupTick: Cleanup | null = null;

  const ctx = gsap.context(() => {
    // Smoothed state — we lerp toward the velocity-derived target each frame.
    const target = { blur: 0, skew: 0 };
    const current = { blur: 0, skew: 0 };
    const setBlur = gsap.quickSetter(el, "--velocity-blur", "px") as (
      v: number
    ) => void;
    const setSkew = gsap.quickSetter(el, "skewX", "deg") as (
      v: number
    ) => void;

    st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity());
        target.blur = Math.min(maxBlur, v * sensitivity);
        const signedSkew = Math.min(
          maxSkew,
          v * sensitivity * (maxSkew / maxBlur)
        );
        target.skew = self.direction < 0 ? -signedSkew : signedSkew;
      },
      markers: markersInDev(opts.markers),
    });

    const onTick = (): void => {
      // Per-frame lerp for smoothness.
      current.blur += (target.blur - current.blur) * 0.15;
      current.skew += (target.skew - current.skew) * 0.15;
      setBlur(current.blur);
      setSkew(current.skew);
    };
    gsap.ticker.add(onTick);
    cleanupTick = () => gsap.ticker.remove(onTick);
  }, el);

  return () => {
    st?.kill();
    cleanupTick?.();
    ctx.revert();
  };
}

// ============================================================
// variableFontWeight — SIG-05
// ============================================================

export type VariableFontWeightOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** Range of weight axis. Default [300, 700]. */
  weightRange?: [number, number];
  /** Range of optical size axis. Default [12, 96]. */
  opszRange?: [number, number];
  /** How aggressively velocity maps to weight. Default 0.05. */
  sensitivity?: number;
};

/**
 * Animates font-variation-settings based on scroll velocity.
 * Faster scroll = heavier weight + larger optical size.
 * Reduced motion: no-op.
 */
export function variableFontWeight(opts: VariableFontWeightOpts): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;
  if (prefersReducedMotion() || isLowBandwidth()) return NOOP;

  const el = target as HTMLElement;
  const [wMin, wMax] = opts.weightRange ?? [300, 700];
  const [oMin, oMax] = opts.opszRange ?? [12, 96];
  const sensitivity = opts.sensitivity ?? 0.05;

  let st: ScrollTrigger | null = null;
  let cleanupTick: Cleanup | null = null;

  const ctx = gsap.context(() => {
    const targetState = { weight: wMin, opsz: oMin };
    const currentState = { weight: wMin, opsz: oMin };

    st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity());
        targetState.weight = Math.min(wMax, wMin + v * sensitivity);
        targetState.opsz = Math.min(oMax, oMin + v * sensitivity * 0.2);
      },
      markers: markersInDev(opts.markers),
    });

    const onTick = (): void => {
      currentState.weight += (targetState.weight - currentState.weight) * 0.1;
      currentState.opsz += (targetState.opsz - currentState.opsz) * 0.1;

      // Reset toward base when velocity drops.
      targetState.weight += (wMin - targetState.weight) * 0.05;
      targetState.opsz += (oMin - targetState.opsz) * 0.05;

      el.style.fontVariationSettings = `'wght' ${currentState.weight}, 'opsz' ${currentState.opsz}`;
    };

    gsap.ticker.add(onTick);
    cleanupTick = () => gsap.ticker.remove(onTick);
  }, el);

  return () => {
    st?.kill();
    cleanupTick?.();
    ctx.revert();
  };
}

// ============================================================
// scrollVelocityFontWeight — SIG-05
// ============================================================

export type ScrollVelocityFontWeightOpts = ScrollTriggerCommonOpts & {
  target: Element | null;
  /** Minimum `wght` axis at rest. Default 400. */
  min?: number;
  /** Maximum `wght` axis at full velocity. Default 700. */
  max?: number;
  /** Velocity sensitivity. Default 0.0008. */
  sensitivity?: number;
};

/**
 * Drives a variable font's `wght` axis from scroll velocity via the
 * CSS custom property `--wght`. Pair with a CSS rule like:
 *   font-variation-settings: "wght" var(--wght, 400), "opsz" 96;
 *
 * Reduced motion: locks `--wght` to the midpoint.
 */
export function scrollVelocityFontWeight(
  opts: ScrollVelocityFontWeightOpts
): Cleanup {
  const { target } = opts;
  if (!target) return NOOP;

  const el = target as HTMLElement;
  const min = opts.min ?? 400;
  const max = opts.max ?? 700;
  const sensitivity = opts.sensitivity ?? 0.0008;

  if (prefersReducedMotion()) {
    el.style.setProperty("--wght", String(Math.round((min + max) / 2)));
    return NOOP;
  }

  let st: ScrollTrigger | null = null;
  let cleanupTick: Cleanup | null = null;

  const ctx = gsap.context(() => {
    const setWght = gsap.quickSetter(el, "--wght") as (v: number) => void;
    const state = { current: min, target: min };

    el.style.setProperty("--wght", String(min));

    st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.min(1, Math.abs(self.getVelocity()) * sensitivity);
        state.target = min + (max - min) * v;
      },
      markers: markersInDev(opts.markers),
    });

    const tick = (): void => {
      state.current += (state.target - state.current) * 0.22;
      setWght(Math.round(state.current));
      // Relax target back toward `min` so type "blooms" when scroll stops.
      state.target += (min - state.target) * 0.04;
    };
    gsap.ticker.add(tick);
    cleanupTick = (): void => gsap.ticker.remove(tick);
  }, el);

  return () => {
    cleanupTick?.();
    st?.kill();
    ctx.revert();
  };
}

// ============================================================
// flipTransition — SIG-08
// ============================================================

type FlipState = {
  // Opaque — produced and consumed by GSAP Flip; kept loose intentionally.
  targets?: unknown;
};

type FlipPluginLike = {
  getState: (targets: string | Element | Element[], vars?: object) => FlipState;
  from: (state: FlipState, vars?: object) => gsap.core.Tween;
};

export type FlipTransitionOpts = {
  /** Targets to capture state from (selector or elements). */
  targets: string | Element | Element[];
  /** Properties to track (e.g. "borderRadius,filter"). */
  props?: string;
  /** Action to run between getState and from (e.g. router.push). */
  swap: () => void | Promise<void>;
  /** Tween duration. Default 0.9. */
  duration?: number;
  /** Tween ease. Default EASE.brass. */
  ease?: string;
};

/**
 * Wraps `gsap/Flip` for portfolio-tile → case-study-cover hand-off
 * (SIG-08 "Phera"). Falls back to a plain crossfade if Flip is not
 * available (Club GSAP plugin) so callers never have to branch.
 */
export function flipTransition(opts: FlipTransitionOpts): Promise<void> {
  return new Promise<void>((resolve) => {
    if (prefersReducedMotion()) {
      Promise.resolve(opts.swap()).finally(() => resolve());
      return;
    }

    const plugins = (gsap as typeof gsap & { plugins?: Record<string, unknown> })
      .plugins ?? {};
    const Flip = plugins.Flip as FlipPluginLike | undefined;

    if (!Flip) {
      // No Flip plugin available — use the native View Transitions API if
      // supported, otherwise fall through to a plain swap.
      const doc = typeof document !== "undefined" ? document : null;
      type ViewTransitionLike = { finished: Promise<unknown> };
      const vt = doc as
        | (Document & {
            startViewTransition?: (cb: () => void) => ViewTransitionLike;
          })
        | null;
      if (vt?.startViewTransition) {
        const transition = vt.startViewTransition(() => {
          void opts.swap();
        });
        transition.finished.finally(() => resolve());
        return;
      }
      Promise.resolve(opts.swap()).finally(() => resolve());
      return;
    }

    const state = Flip.getState(opts.targets, { props: opts.props });
    Promise.resolve(opts.swap()).then(() => {
      const tween = Flip.from(state, {
        absolute: true,
        duration: opts.duration ?? 0.9,
        ease: opts.ease ?? EASE.brass,
        scale: true,
        onComplete: () => resolve(),
      });
      // Safety: even if the tween's onComplete doesn't fire, time out.
      const dur = (opts.duration ?? 0.9) * 1000 + 200;
      setTimeout(() => resolve(), dur);
      void tween;
    });
  });
}

// ============================================================
// tintFromImage — SIG-07 ambient tint companion
// ============================================================

export type TintFromImageOpts = ScrollTriggerCommonOpts & {
  /** The image element to sample. Must be loaded + same-origin or CORS'd. */
  image: HTMLImageElement | null;
  /** The element whose CSS variable is set to the dominant colour. */
  target: Element | null;
  /** CSS variable name to set. Default `--ambient-tint`. */
  cssVar?: string;
  /** Scroll range over which the tint fades in. */
  start?: string;
  end?: string;
};

/**
 * Samples the dominant colour of a hero image via the Canvas API and sets
 * a CSS custom property on the target element. The tint is faded in over
 * the scroll range so the section "warms up" as the image comes into view.
 *
 * Heavy effect: short-circuits on Save-Data / reduced-motion (target is
 * left unchanged so the static brand colour is honoured).
 */
export function tintFromImage(opts: TintFromImageOpts): Cleanup {
  const { image, target } = opts;
  if (!image || !target) return NOOP;
  if (prefersReducedMotion() || isLowBandwidth()) return NOOP;
  if (typeof document === "undefined") return NOOP;

  const el = target as HTMLElement;
  const cssVar = opts.cssVar ?? "--ambient-tint";
  let triggerInstance: ScrollTrigger | null = null;

  const sample = (): string | null => {
    try {
      const canvas = document.createElement("canvas");
      const w = 32;
      const h = Math.max(
        1,
        Math.round((image.naturalHeight / Math.max(1, image.naturalWidth)) * w)
      );
      canvas.width = w;
      canvas.height = h;
      const cx = canvas.getContext("2d", { willReadFrequently: true });
      if (!cx) return null;
      cx.drawImage(image, 0, 0, w, h);
      const { data } = cx.getImageData(0, 0, w, h);
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3] ?? 0;
        if (a < 16) continue;
        r += data[i] ?? 0;
        g += data[i + 1] ?? 0;
        b += data[i + 2] ?? 0;
        n += 1;
      }
      if (n === 0) return null;
      const ri = Math.round(r / n);
      const gi = Math.round(g / n);
      const bi = Math.round(b / n);
      return `rgb(${ri}, ${gi}, ${bi})`;
    } catch {
      // CORS / tainted canvas — degrade silently.
      return null;
    }
  };

  const init = (): void => {
    const colour = sample();
    if (!colour) return;
    // Pre-set with zero strength via a paired variable; consumer CSS can
    // read both as desired (e.g. `background: color-mix(in oklab, var(--ambient-tint) var(--ambient-strength), transparent)`).
    el.style.setProperty(cssVar, colour);
    el.style.setProperty(`${cssVar}-strength`, "0%");

    triggerInstance = ScrollTrigger.create({
      trigger: target,
      start: opts.start ?? "top 80%",
      end: opts.end ?? "bottom 40%",
      scrub: 0.4,
      onUpdate: (self) => {
        el.style.setProperty(
          `${cssVar}-strength`,
          `${Math.round(self.progress * 100)}%`
        );
      },
      markers: markersInDev(opts.markers),
    });
  };

  let ctx: ReturnType<typeof gsap.context> | null = null;
  if (image.complete && image.naturalWidth > 0) {
    ctx = gsap.context(init, el);
  } else {
    const onLoad = (): void => {
      ctx = gsap.context(init, el);
    };
    image.addEventListener("load", onLoad, { once: true });
    // Hook a cleanup to remove the load listener if cleanup runs first.
    return () => {
      image.removeEventListener("load", onLoad);
      triggerInstance?.kill();
      ctx?.revert();
    };
  }

  return () => {
    triggerInstance?.kill();
    ctx?.revert();
  };
}
