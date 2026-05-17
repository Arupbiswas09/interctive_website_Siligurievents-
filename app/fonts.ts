/**
 * Font loading — Siligurievent
 *
 * Per DECISIONS.md D-003 we ship bilingual (EN + HI) at launch.
 * - Display: Cormorant Garamond
 * - Body / UI: Inter
 * - Devanagari display: Noto Serif Devanagari
 * - Devanagari body: Noto Sans Devanagari
 *
 * All four are loaded via `next/font/google` with `display: "swap"` and
 * exposed as CSS variables consumed by `globals.css` @theme tokens.
 */

import {
  Cormorant_Garamond,
  Inter,
  Allura,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";

// Cormorant: only the weights actually used across the site.
// 400 italic powers editorial pull quotes; 300/400/500/600 cover display + sub-display.
// (700 dropped — bold serif rarely reads "luxury" and we never call for it.)
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

// Inter: variable font.
export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Allura: elegant script for the "Crafting Unforgettable Celebrations" tagline
// and other handwritten accents across the site.
export const script = Allura({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-script",
});

// Devanagari families: variable where possible.
export const devanagariDisplay = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-devanagari-display",
});

export const devanagariBody = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-devanagari-body",
});

/** Concatenated className for <html>, applies all CSS variables. */
export const fontVariables = [
  display.variable,
  body.variable,
  script.variable,
  devanagariDisplay.variable,
  devanagariBody.variable,
].join(" ");
