// =============================================================================
// brass-dust.frag.glsl — Fragment shader for brass-foil dust particles.
//
// Each rendered fragment is one point splat. We:
//   1. Discard outside a soft circular falloff (no square dust).
//   2. Mix three brass tones along the per-particle brightness curve so
//      the cloud reads as gold-foil + brass-leaf + accent crimson highlights,
//      tied to the brand tokens (--color-gold / --brass-leaf / --color-accent).
//   3. Drive subtle chromatic aberration on charged (mandap-attracted)
//      particles so bright dust gets a slight RGB split — reads as "foil".
//   4. Apply a one-particle bloom by raising bright particles' alpha cube.
//
// The bloom + chromatic aberration are intentionally cheap (per-fragment, no
// post-pass) — a real bloom pass would double our fill cost. Awwwards-grade
// "foil shimmer" is achievable in-particle by skewing R/G/B alphas separately.
// =============================================================================

precision highp float;

// --- Brand palette ----------------------------------------------------------
// Hardcoded from app/globals.css so the shader compiles standalone; if these
// drift from the design tokens, update both. (--color-gold, --brass-leaf,
// --color-accent, --color-bg as the "dust dark" end.)
const vec3 BRASS_LEAF   = vec3(0.643, 0.478, 0.173); // #A47A2C
const vec3 GOLD         = vec3(0.722, 0.537, 0.227); // #B8893A
const vec3 GOLD_SOFT    = vec3(0.910, 0.835, 0.659); // #E8D5A8
const vec3 ACCENT       = vec3(0.545, 0.102, 0.102); // #8B1A1A
const vec3 INK_DEEP     = vec3(0.102, 0.090, 0.078); // #1A1714 (reserved unused, kept for tuning)

// --- Uniforms ---------------------------------------------------------------
uniform float uTime;
uniform float uFoilSweep;   // 0..1 phase of brass-foil sweep across cloud
uniform float uIntro;       // 0..1 cold-open progress (1 = exploding, 0 = settled)
uniform float uAccentMix;   // 0..1 how much accent crimson bleeds into bright sparks

// --- Varyings ---------------------------------------------------------------
varying float vBrightness;
varying float vCharge;
varying float vSeed;
varying vec2  vPointWorld;

// ---------------------------------------------------------------------------
void main() {
  // gl_PointCoord is [0,1]^2 across the point splat.
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q);

  // -- Soft circular mask: discard outside ~0.5 radius with a smooth edge.
  // Inner 0.15 is fully opaque, then a soft falloff to 0.5.
  float core   = 1.0 - smoothstep(0.10, 0.50, r);
  if (core <= 0.001) discard;

  // -- Brass mix: along brightness, walk from BRASS_LEAF (dim) →
  // GOLD (mid) → GOLD_SOFT (highlight), then ACCENT bleed at the top.
  // Per-particle seed nudges the curve so the cloud isn't monochrome.
  float b = clamp(vBrightness + (vSeed - 0.5) * 0.12, 0.0, 1.0);
  vec3 col;
  if (b < 0.55) {
    col = mix(BRASS_LEAF, GOLD, smoothstep(0.0, 0.55, b));
  } else {
    col = mix(GOLD, GOLD_SOFT, smoothstep(0.55, 1.0, b));
  }

  // -- Brass-foil sweep: a horizontal phase travelling across the cloud once
  // per cold-open / on demand. Particles whose worldPos.x is near the sweep
  // pick up a saturated highlight + small accent kiss.
  float sweepCenter = mix(-1.4, 1.4, uFoilSweep);
  float sweepDist   = abs(vPointWorld.x - sweepCenter);
  float sweepGlow   = exp(-sweepDist * sweepDist / 0.06);
  col = mix(col, GOLD_SOFT, sweepGlow * 0.55);

  // -- Mandap-charged particles get a tiny accent-crimson kiss when very bright,
  // so the silhouette emergent reads "wedding mandap", not "warm fog".
  float kiss = vCharge * smoothstep(0.7, 1.0, b) * uAccentMix;
  col = mix(col, ACCENT, kiss * 0.28);

  // -- Per-fragment chromatic aberration: shift channels' alpha slightly so
  // the splat shows a faint colour fringe at the edges (cheap "foil" tell).
  // Strength scales with charge so it's a *highlight* effect, not a baseline.
  float aberr = 0.18 * vCharge + 0.04;
  // Sample three concentric radial masks — wider for R, narrower for B.
  float aR = 1.0 - smoothstep(0.10, 0.50 + aberr * 0.04, r);
  float aG = 1.0 - smoothstep(0.10, 0.50,                  r);
  float aB = 1.0 - smoothstep(0.10, 0.50 - aberr * 0.04, r);

  // Premultiplied colour with per-channel alpha to fake chromatic split.
  vec3 splat = vec3(col.r * aR, col.g * aG, col.b * aB);

  // -- Single-particle "bloom": cube the brightest particles' alpha so they
  // pop above the dust without needing a real bloom pass.
  float bloomGain = 1.0 + pow(b, 3.0) * 0.85;
  splat *= bloomGain;

  // -- Final alpha: combine core + brightness + intro fade.
  // During cold-open (uIntro near 1) particles spawn faint and bloom in.
  float introFade = 1.0 - uIntro * 0.55;
  float alpha = core * (0.45 + 0.55 * b) * introFade;

  // Subtle twinkle: per-particle phase, very low amplitude, never strobes.
  alpha *= 0.92 + 0.08 * sin(uTime * 0.9 + vSeed * 47.0);

  gl_FragColor = vec4(splat, alpha);
}
