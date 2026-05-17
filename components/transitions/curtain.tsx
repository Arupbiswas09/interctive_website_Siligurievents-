"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "@/lib/gsap/register";
import { EASE } from "@/lib/gsap/eases";
import type { CurtainVariant } from "@/lib/transitions/route-classifier";

/**
 * Curtain — the visual layer of Siligurievent page transitions.
 *
 * A single absolutely-positioned `<div>` that lives in a portal at the
 * document `<body>` level. Two visual variants:
 *
 *   1. "brass-sweep"
 *      A wide brass-gradient panel slides in from the left over 360ms
 *      (`display` ease, x: -100% → 0%), holds for one frame at full
 *      coverage (the host page commits the route swap here), then sweeps
 *      off to the right over another 360ms (x: 0% → 100%). Total 720ms.
 *
 *   2. "grain-fade"
 *      A vertical full-bleed scrim with an `feTurbulence` SVG grain layer
 *      crossfades in over 600ms, then crossfades out over 600ms. Total
 *      1.2s. Used when leaving an immersive case-study route.
 *
 * The curtain listens for two global window events:
 *   - "sgv:transition-start" { detail: { variant, fromPath, toPath } }
 *   - "sgv:transition-end"   (no detail)
 *
 * If a new "sgv:transition-start" arrives while one is mid-flight, the
 * current GSAP timeline is killed and the new one starts cleanly.
 *
 * Reduced motion + Save-Data: the curtain mounts but never plays — events
 * become no-ops. The interceptor still dispatches them so that downstream
 * listeners (analytics, custom logic) keep working.
 *
 * Perf: no images. Brass gradient is a CSS conic+linear stack. Grain is
 * a single inline `feTurbulence` filter. Only `transform` and `opacity`
 * are tweened — zero layout, zero paint.
 */

export type CurtainTransitionDetail = {
  variant: CurtainVariant;
  fromPath: string | null;
  toPath: string | null;
};

const FILTER_ID = "sgv-curtain-grain";

type NavigatorConnectionLike = {
  saveData?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NavigatorConnectionLike })
    .connection;
  return conn?.saveData === true;
}

export function Curtain(): React.ReactElement {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const brassRef = useRef<HTMLDivElement | null>(null);
  const grainRef = useRef<HTMLDivElement | null>(null);
  const activeTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const brass = brassRef.current;
    const grain = grainRef.current;
    if (!root || !brass || !grain) return;

    // Start hidden. We rely on inline GSAP `set` (not CSS) so the curtain
    // is guaranteed never to flash on first paint regardless of stylesheet
    // load order.
    gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(brass, { xPercent: -100, autoAlpha: 1 });
    gsap.set(grain, { autoAlpha: 0 });

    const lightWeight = prefersReducedMotion() || isSaveData();

    const onStart = (event: Event): void => {
      const detail = (event as CustomEvent<CurtainTransitionDetail>).detail;
      const variant = detail?.variant ?? "brass-sweep";

      // Kill any in-flight timeline. We do NOT call `reverse()` — abrupt
      // re-targets during navigation are smoother with a hard cut to the
      // new sweep than a half-reverse.
      activeTl.current?.kill();
      activeTl.current = null;

      // Light-weight path: cross-fade only via a quick autoAlpha pulse on
      // the root. 150ms total. Honours reduced-motion / Save-Data.
      if (lightWeight || variant === "none") {
        if (variant === "none") {
          // Hard skip — let the shared-element FLIP / View Transition own
          // the visual hand-off entirely.
          gsap.set(root, { autoAlpha: 0 });
          return;
        }
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
            activeTl.current = null;
          },
        });
        tl.to(root, { autoAlpha: 1, duration: 0.075, ease: "none" });
        tl.set(root, { pointerEvents: "auto" });
        tl.to(root, { autoAlpha: 0, duration: 0.075, ease: "none" }, "+=0.0");
        activeTl.current = tl;
        return;
      }

      if (variant === "brass-sweep") {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
            gsap.set(brass, { xPercent: -100 });
            activeTl.current = null;
          },
        });
        // Bring the layer into the paint pipeline.
        tl.set(root, { autoAlpha: 1, pointerEvents: "auto" });
        tl.set(grain, { autoAlpha: 0 });
        tl.set(brass, { xPercent: -100, autoAlpha: 1 });
        // Outgoing sweep: -100% → 0% over 360ms.
        tl.to(brass, {
          xPercent: 0,
          duration: 0.36,
          ease: EASE.display,
        });
        // Incoming sweep continues immediately: 0% → 100% over another
        // 360ms. The route swap commits at the seam (managed externally
        // via variantCommitMs in the interceptor — no explicit hold here
        // since GSAP frames the seam atomically).
        tl.to(brass, {
          xPercent: 100,
          duration: 0.36,
          ease: EASE.display,
        });
        activeTl.current = tl;
        return;
      }

      // grain-fade
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(grain, { autoAlpha: 0 });
          activeTl.current = null;
        },
      });
      tl.set(root, { autoAlpha: 1, pointerEvents: "auto" });
      tl.set(brass, { autoAlpha: 0 });
      tl.set(grain, { autoAlpha: 0 });
      tl.to(grain, { autoAlpha: 1, duration: 0.6, ease: EASE.ink });
      tl.to(grain, { autoAlpha: 0, duration: 0.6, ease: EASE.ink });
      // Restore for the next cycle.
      tl.set(brass, { autoAlpha: 1 });
      activeTl.current = tl;
    };

    const onEnd = (): void => {
      // Defensive: if the host fires an end event mid-flight (e.g. on
      // abort) make sure the curtain returns to its rest state without
      // leaving pointer-events trapped.
      if (!activeTl.current) {
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      }
    };

    window.addEventListener("sgv:transition-start", onStart);
    window.addEventListener("sgv:transition-end", onEnd);

    return (): void => {
      window.removeEventListener("sgv:transition-start", onStart);
      window.removeEventListener("sgv:transition-end", onEnd);
      activeTl.current?.kill();
      activeTl.current = null;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-sgv-curtain=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        pointerEvents: "none",
        // Make the layer compositor-only.
        willChange: "transform, opacity",
        // Below the OS focus ring; above every page chrome element.
        contain: "strict",
      }}
    >
      {/* Brass-foil sweep panel. 110% width so the trailing edge clears the
          viewport even at sub-pixel rounding. */}
      <div
        ref={brassRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "110%",
          // Brass gradient: warm gold core, deeper bronze edges, plus a
          // diagonal sheen line. Pure CSS — no images, no canvas.
          backgroundImage:
            "linear-gradient(105deg, #2a1a0a 0%, #6b4a1c 18%, #c89a3f 38%, #f5d97a 50%, #c89a3f 62%, #6b4a1c 82%, #2a1a0a 100%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18))",
          backgroundBlendMode: "screen, normal",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Grain-fade scrim. Ink-deep panel with the same SVG grain filter
          used by SIG-09. */}
      <div
        ref={grainRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,7,4,0.96) 0%, rgba(10,7,4,0.98) 50%, rgba(10,7,4,0.96) 100%)",
          // Layered filter: pulls grain from inline SVG defs below.
          filter: `url(#${FILTER_ID})`,
          willChange: "opacity",
        }}
      />

      {/* Inline SVG filter defs — zero-sized so it never participates in
          layout. */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id={FILTER_ID} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              seed={7}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.95
                      0 0 0 0 0.85
                      0 0 0 0 0.55
                      0 0 0 0.04 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
