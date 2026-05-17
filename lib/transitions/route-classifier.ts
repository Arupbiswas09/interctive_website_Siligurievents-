/**
 * Route classifier for Siligurievent page transitions.
 *
 * Decides which curtain variant fires for a given `(fromPath, toPath)` pair.
 * Kept as a pure function with no React / DOM dependencies so it can be
 * unit-tested and reused on the server if we ever need to print transition
 * metadata into the document head.
 *
 * Variants:
 *   - "brass-sweep" — 720ms brass-foil panel sweep (default).
 *   - "grain-fade"  — 1.2s vertical scrim with SVG grain (reflective exits).
 *   - "none"        — skip the curtain entirely (lets shared-element FLIP
 *                     own the visual hand-off, e.g. portfolio → case study).
 */

export type CurtainVariant = "brass-sweep" | "grain-fade" | "none";

/** A normalised pathname segment list (no leading slash, lowercased). */
type PathParts = readonly string[];

function toParts(path: string | null | undefined): PathParts {
  if (!path) return [];
  const cleaned = path.split("?")[0]?.split("#")[0] ?? "";
  return cleaned
    .split("/")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

function isPortfolioSlug(parts: PathParts): boolean {
  // /portfolio/<slug>  — the case-study route
  return parts.length >= 2 && parts[0] === "portfolio" && parts[1] !== undefined;
}

function isPortfolioIndex(parts: PathParts): boolean {
  return parts.length === 1 && parts[0] === "portfolio";
}

function isHome(parts: PathParts): boolean {
  return parts.length === 0;
}

/**
 * Classify a navigation pair into a curtain variant.
 *
 * Rules (top-down, first match wins):
 *   1. any → /portfolio/[slug]   → "none"        (shared-element FLIP rules)
 *   2. /portfolio/[slug] → any   → "grain-fade"  (slow exit from immersion)
 *   3. /contact → /              → "brass-sweep" (post-submit celebration)
 *   4. otherwise                 → "brass-sweep"
 *
 * `null`/`undefined` `fromPath` (initial load) always returns "brass-sweep"
 * — but the interceptor short-circuits the first paint so this only matters
 * when the same provider mounts mid-session.
 */
export function classifyTransition(
  fromPath: string | null | undefined,
  toPath: string | null | undefined
): CurtainVariant {
  const from = toParts(fromPath);
  const to = toParts(toPath);

  // Rule 1: arriving at a case study — let the shared element flip.
  if (isPortfolioSlug(to) && !isPortfolioSlug(from)) return "none";

  // Rule 1b: case-study → case-study (e.g. next-project link) — also no
  // curtain so the cover image can shared-element morph.
  if (isPortfolioSlug(from) && isPortfolioSlug(to)) return "none";

  // Rule 2: leaving a case study to any non-case-study route.
  if (isPortfolioSlug(from)) return "grain-fade";

  // Rule 3: contact → home (post-inquiry-success redirect convention).
  if (from[0] === "contact" && isHome(to)) return "brass-sweep";

  // Rule 4: same-page navigations (e.g. hash-only) — caller is expected to
  // short-circuit before we get here, but be defensive.
  if (from.length > 0 && to.length > 0 && samePath(from, to)) return "none";

  // Rule 5: portfolio index → home and other "calmer" transitions stay on
  // brass-sweep for consistency. Grain-fade is reserved for case-study exits.
  if (isPortfolioIndex(from) && isHome(to)) return "brass-sweep";

  return "brass-sweep";
}

function samePath(a: PathParts, b: PathParts): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Total duration (ms) for a variant. Used by the interceptor to know when
 * to dispatch `sgv:transition-end` even if the curtain element fails to
 * fire its own `onComplete` (defensive timeout).
 */
export function variantDurationMs(variant: CurtainVariant): number {
  switch (variant) {
    case "brass-sweep":
      return 720;
    case "grain-fade":
      return 1200;
    case "none":
      return 0;
  }
}

/**
 * The midpoint of a variant in ms — the moment when the new route should
 * be committed (curtain is fully covering the viewport). Used by the
 * Framer Motion template to time its content swap, when the curtain
 * variant is not "none".
 */
export function variantCommitMs(variant: CurtainVariant): number {
  switch (variant) {
    case "brass-sweep":
      return 360;
    case "grain-fade":
      return 600;
    case "none":
      return 0;
  }
}
