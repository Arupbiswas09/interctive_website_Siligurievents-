// =============================================================================
// mandap-sdf.glsl — Reusable SDF for a simplified mandap silhouette.
//
// Mandap geometry (from the front, normalized to a 2x2 quad centred at origin):
//   - Four vertical pillars (left-outer, left-inner, right-inner, right-outer).
//   - A curved canopy (capsule-arch) spanning the inner pillars.
//   - A finial (cone+ring stack) crowning the canopy.
//
// All SDFs are signed: < 0 inside, > 0 outside, units in normalized space.
// Combine with smin/smoothUnion for soft silhouette blending.
//
// Inputs are expected in roughly the range [-1, 1]. The mandap occupies
// roughly the central 1.4 wide x 1.2 tall slice.
//
// Author note: hand-tuned by eye to read as a Bengali bhadrasana mandap silhouette
// when sampled at low resolution. Not photoreal — it is the *idea* of a mandap.
// =============================================================================

// ----------- Primitive SDFs (compact, branchless) ----------------------------

float sdfRect(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdfRoundedRect(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + vec2(r);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

float sdfCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float sdfCircle(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}

// Smooth (polynomial) union — keeps the silhouette continuous so particles
// near the seam don't crease.
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// ----------- Mandap silhouette ----------------------------------------------
//
// p: position in normalized space, mandap upright with +y = up.
// scale: overall size multiplier (1.0 = default).
// returns: signed distance to the mandap silhouette.

float sdfMandap(vec2 p, float scale) {
  p /= scale;

  // Four pillars: thin rounded verticals.
  // Pillar half-width 0.045, half-height 0.55, at x ∈ {-0.55, -0.22, 0.22, 0.55}.
  float pillarHalfW = 0.045;
  float pillarHalfH = 0.55;
  float pillarR     = 0.012;

  float pillarL_o = sdfRoundedRect(p - vec2(-0.55, -0.05), vec2(pillarHalfW, pillarHalfH), pillarR);
  float pillarL_i = sdfRoundedRect(p - vec2(-0.22, -0.05), vec2(pillarHalfW, pillarHalfH), pillarR);
  float pillarR_i = sdfRoundedRect(p - vec2( 0.22, -0.05), vec2(pillarHalfW, pillarHalfH), pillarR);
  float pillarR_o = sdfRoundedRect(p - vec2( 0.55, -0.05), vec2(pillarHalfW, pillarHalfH), pillarR);

  // Plinth base — thin band beneath the pillars.
  float plinth = sdfRoundedRect(p - vec2(0.0, -0.62), vec2(0.62, 0.04), 0.01);

  // Canopy — capsule arc spanning the outer pillars; arch curves upward.
  // Approximated as a fat capsule with its center lifted, plus a circle
  // subtracted to carve the underside (kept implicit via two stacked capsules).
  float canopyTop = sdfCapsule(p, vec2(-0.58, 0.50), vec2(0.58, 0.50), 0.085);
  float canopyMid = sdfCapsule(p, vec2(-0.40, 0.58), vec2(0.40, 0.58), 0.04);
  float canopy    = smin(canopyTop, canopyMid, 0.04);

  // Lintel — small straight beam directly below the canopy, between inner pillars.
  float lintel = sdfRoundedRect(p - vec2(0.0, 0.42), vec2(0.30, 0.020), 0.005);

  // Finial stack: short stem + ring + small dome on top, centred.
  float finStem  = sdfRoundedRect(p - vec2(0.0, 0.66), vec2(0.012, 0.04), 0.004);
  float finRing  = sdfCircle(p, vec2(0.0, 0.72), 0.035);
  float finDome  = sdfCircle(p, vec2(0.0, 0.78), 0.022);
  float finial   = smin(smin(finStem, finRing, 0.02), finDome, 0.015);

  // Union all pieces with a tight smin so the silhouette reads as a
  // single object rather than separate strokes.
  float pillars = min(min(pillarL_o, pillarL_i), min(pillarR_i, pillarR_o));
  float body    = smin(pillars, plinth, 0.02);
  body          = smin(body, lintel, 0.02);
  body          = smin(body, canopy, 0.04);
  body          = smin(body, finial, 0.03);

  return body;
}

// Convenience: smooth attractor field (1 = on silhouette, 0 = far from it).
// `band` controls the width of the attraction shell; particles outside `band`
// distance feel almost no pull.
float mandapAttractor(vec2 p, float scale, float band) {
  float d = sdfMandap(p, scale);
  // Centred narrow band around the silhouette (both sides), Gaussian-ish falloff.
  return exp(-(d * d) / (band * band));
}
