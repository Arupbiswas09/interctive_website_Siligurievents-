/**
 * Centralized GSAP plugin registration for Siligurievent.
 *
 * Import this file ONCE at the top of any client entry that uses GSAP:
 *   import "@/lib/gsap/register";
 *
 * The module is idempotent: dev StrictMode double-invocation and HMR will
 * not re-register plugins thanks to the `__gsapRegistered` guard on
 * `globalThis`. Free plugins are imported unconditionally; paid Club GSAP
 * plugins (Flip, CustomEase, SplitText, MorphSVG, DrawSVG, MotionPath) are
 * loaded best-effort and silently dropped if not installed — callers must
 * still detect availability at runtime.
 *
 * No side effects on the server: all imports of GSAP plugins are safe in
 * Node, but the actual `registerPlugin` call only runs in the browser.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

type RegistrationGuard = { __siligurieventGsapRegistered?: true };

const guard = globalThis as typeof globalThis & RegistrationGuard;

if (!guard.__siligurieventGsapRegistered) {
  // ScrollTrigger + Observer are bundled with the free GSAP core — register
  // them eagerly so consumers never have to think about it.
  gsap.registerPlugin(ScrollTrigger, Observer);

  // Mark before attempting paid-plugin probes so a throw doesn't leave us
  // in a half-initialised state on the next import.
  guard.__siligurieventGsapRegistered = true;

  // Attempt to register optional Club GSAP plugins. These imports are wrapped
  // in dynamic `import()` to avoid hard build errors when the packages are
  // not installed — the project may not have a Club GSAP licence yet.
  //
  // We intentionally do NOT await: this runs once at module load. The
  // plugins become available shortly after; library helpers must probe
  // `gsap.plugins` (or feature-detect) before using them.
  void (async () => {
    const probes: Array<Promise<unknown>> = [
      import("gsap/CustomEase")
        .then((mod) => {
          if (mod.CustomEase) gsap.registerPlugin(mod.CustomEase);
        })
        .catch(() => undefined),
      import("gsap/Flip")
        .then((mod) => {
          if (mod.Flip) gsap.registerPlugin(mod.Flip);
        })
        .catch(() => undefined),
      import("gsap/SplitText")
        .then((mod) => {
          if (mod.SplitText) gsap.registerPlugin(mod.SplitText);
        })
        .catch(() => undefined),
      import("gsap/MorphSVGPlugin")
        .then((mod) => {
          if (mod.MorphSVGPlugin) gsap.registerPlugin(mod.MorphSVGPlugin);
        })
        .catch(() => undefined),
      import("gsap/DrawSVGPlugin")
        .then((mod) => {
          if (mod.DrawSVGPlugin) gsap.registerPlugin(mod.DrawSVGPlugin);
        })
        .catch(() => undefined),
      import("gsap/MotionPathPlugin")
        .then((mod) => {
          if (mod.MotionPathPlugin) gsap.registerPlugin(mod.MotionPathPlugin);
        })
        .catch(() => undefined),
    ];
    await Promise.allSettled(probes);
  })();
}

// Intentionally no exports. Import for side effects only.
export {};
