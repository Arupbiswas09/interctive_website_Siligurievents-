/**
 * Shared utilities for the Siligurievent 3D effects library.
 *
 * Every helper here is SSR-safe and dependency-free so the effects
 * components remain tree-shake friendly (< 1 KB shared cost).
 *
 * Conventions:
 *   - Named exports only (no default).
 *   - No DOM access at import time.
 *   - All transforms are in the conservative luxury range:
 *       Z translate ≤ 80px, rotateX/rotateY ≤ 8°, rotateZ ≤ 4°.
 *   - Easings match `lib/gsap/eases.ts` so consumers can compose
 *     factories with these effects without curve mismatch.
 */

// ─────────────────────────────────────────────────────────────────────────
// Math helpers
// ─────────────────────────────────────────────────────────────────────────

/** Linear interpolation between `a` and `b` by `t` in [0, 1]. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp a value to the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Map a value from one range to another with clamping at the
 * destination edges. Used pervasively for pointer-to-transform mapping.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

// ─────────────────────────────────────────────────────────────────────────
// Environment hints (SSR-safe)
// ─────────────────────────────────────────────────────────────────────────

/** SSR-safe `prefers-reduced-motion` check. Static, not reactive. */
export function getReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type NavigatorConnectionLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

/** SSR-safe Save-Data / 2G check. */
export function getSaveData(): boolean {
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

/** Coarse pointer (phones / tablets). Used to disable cursor-bound effects. */
export function getCoarsePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

// ─────────────────────────────────────────────────────────────────────────
// Timing constants — mirror lib/gsap/eases.ts so the 3D layer is
// rhythmically consistent with the rest of the site.
// ─────────────────────────────────────────────────────────────────────────

export const TIMING = {
  /** Reveals — slow, settled. */
  reveal: 0.9,
  /** Folds / unfolds — longer, deliberate. */
  fold: 1.2,
  /** Multi-slice book reveals — luxurious. */
  slice: 1.4,
  /** Letter splits in 3D space. */
  textSplit: 1.6,
  /** Maximum any single 3D motion may run. */
  max: 1.8,
} as const;

export const EASE_3D = {
  /** Reveal & scroll-into-view entries. */
  reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Cursor-tracking hover. */
  hover: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Card folds — GSAP named ease (power4.out). */
  fold: "power4.out",
  /** Generic slow ease for slice reveals. */
  slice: "power3.out",
} as const;

/**
 * Luxury depth caps. Every component reads from this object so the
 * brand-wide perspective never drifts.
 */
export const DEPTH = {
  perspectiveMin: 1000,
  perspectiveMax: 1600,
  perspectiveDefault: 1200,
  zMax: 80,
  rotateXMax: 8,
  rotateYMax: 8,
  rotateZMax: 4,
} as const;

// ─────────────────────────────────────────────────────────────────────────
// Panel transform math (used by 3d-split-image and 3d-slice-reveal)
// ─────────────────────────────────────────────────────────────────────────

export type PanelTransform = {
  /** Translate X in px (horizontal axis splits). */
  x: number;
  /** Translate Y in px (vertical axis splits). */
  y: number;
  /** Translate Z in px. */
  z: number;
  /** Rotation around Y in deg. */
  rotateY: number;
  /** Rotation around X in deg. */
  rotateX: number;
};

/**
 * Compute the per-panel 3D transform for a split-image effect at the
 * given progress (0 = unified, 1 = fully split).
 *
 * The panels are distributed symmetrically around the centre. Panels
 * further from the centre travel further on the axis, and Z-translate
 * is centre-biased so the middle panel pops forward.
 *
 * @param panelIndex   Zero-based panel index.
 * @param totalPanels  Total number of panels in the split (2–5).
 * @param progress     Animation progress in [0, 1].
 * @param axis         Split axis. Defaults to horizontal.
 */
export function getPanelTransform(
  panelIndex: number,
  totalPanels: number,
  progress: number,
  axis: "horizontal" | "vertical" = "horizontal"
): PanelTransform {
  const safeTotal = clamp(totalPanels, 2, 5);
  const t = clamp(progress, 0, 1);

  // Offset from centre, in panel widths. Centre panel: 0. Edges: ±(N-1)/2.
  const centreOffset = panelIndex - (safeTotal - 1) / 2;

  // Travel along the split axis (in px) — outer panels travel more.
  const axisTravelPx = lerp(0, 24, t) * centreOffset;

  // Z-translate: centre-most panel comes furthest forward.
  const centreness = 1 - Math.abs(centreOffset) / Math.max(1, (safeTotal - 1) / 2);
  const z = lerp(0, DEPTH.zMax, t) * centreness;

  // Slight rotation around the perpendicular axis so panels fan, not slide.
  const rotateMagnitude = lerp(0, DEPTH.rotateYMax * 0.75, t);
  const rotateY = axis === "horizontal" ? rotateMagnitude * centreOffset * -1 : 0;
  const rotateX = axis === "vertical" ? rotateMagnitude * centreOffset : 0;

  return {
    x: axis === "horizontal" ? axisTravelPx : 0,
    y: axis === "vertical" ? axisTravelPx : 0,
    z,
    rotateY,
    rotateX,
  };
}

/**
 * Serialise a `PanelTransform` to a single `transform` string.
 * Keeps the translateZ first so GPU layer promotion is consistent.
 */
export function toTransformString(t: PanelTransform): string {
  return [
    `translate3d(${t.x}px, ${t.y}px, ${t.z}px)`,
    `rotateX(${t.rotateX}deg)`,
    `rotateY(${t.rotateY}deg)`,
  ].join(" ");
}
