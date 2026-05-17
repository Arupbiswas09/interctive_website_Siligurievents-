// =============================================================================
// brass-dust.vert.glsl — Vertex shader for the brass-foil particle cloud.
//
// Each vertex is one particle. Attributes carry the "rest" position + a seed
// for per-particle randomness (so noise is stable per particle across frames,
// not flickering).
//
// Pipeline:
//   1. Read rest position + seed.
//   2. Sample 3D simplex noise to drift the particle slowly (curl-noise-ish).
//   3. Apply the mandap attractor field — particles drift toward the silhouette
//      as `uMandapPull` increases, drift away when negative.
//   4. Apply cursor displacement (push away within ~200px screen radius).
//   5. Apply scroll lift (uScroll moves particles down + back as page scrolls).
//   6. Project to clip space; size particles by z-depth so far particles are
//      crisp specks, near particles are larger dust motes.
//
// Outputs to fragment:
//   vBrightness  — per-particle brightness (used for bloom + colour mix).
//   vCharge      — 0..1; how close this particle is to the mandap silhouette.
//   vSeed        — per-particle seed for fragment-side variation.
//   vPointWorld  — world-space position (for chromatic aberration falloff).
// =============================================================================

precision highp float;

// --- Attributes (one per particle) ------------------------------------------
attribute vec3 position;   // rest position in normalized space (x,y in [-1,1], z is depth)
attribute float seed;       // [0,1) per-particle random seed
attribute float radius;     // base point radius in CSS px (pre-DPR)

// --- Uniforms ---------------------------------------------------------------
uniform mat4  uProjection;   // 2D ortho projection (built in JS)
uniform float uTime;          // seconds since mount
uniform float uScroll;        // 0..1 normalized hero scroll progress
uniform vec2  uPointer;       // pointer in NDC space (-1..1), x right, y up
uniform float uPointerActive; // 0..1; lerps in/out so cursor effect is smooth
uniform float uMandapPull;    // -1..1; positive = attract, negative = repel
uniform vec2  uResolution;    // canvas size in CSS px
uniform float uDpr;           // device pixel ratio (capped)
uniform float uIntro;         // 0..1 cold-open bloom; 0 = settled, 1 = exploding outward

// --- Varyings ---------------------------------------------------------------
varying float vBrightness;
varying float vCharge;
varying float vSeed;
varying vec2  vPointWorld;

// ============================================================================
// 3D simplex noise (Ashima / Ian McEwan, public domain — single-line snippet
// inlined here to avoid an extra include and keep one-pass compile cheap).
// ============================================================================
vec3 mod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289_4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289_4(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289_3(i);
  vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// 2D curl from snoise gradient (approximate, cheap).
vec2 curl2D(vec2 p, float t) {
  float e = 0.08;
  float nx0 = snoise(vec3(p.x, p.y - e, t));
  float nx1 = snoise(vec3(p.x, p.y + e, t));
  float ny0 = snoise(vec3(p.x - e, p.y, t));
  float ny1 = snoise(vec3(p.x + e, p.y, t));
  return vec2(nx1 - nx0, -(ny1 - ny0)) / (2.0 * e);
}

// ============================================================================
// Mandap SDF — duplicated (compact) here to avoid a second compile unit.
// The full annotated version lives in mandap-sdf.glsl; this is the same math.
// ============================================================================
float sdMandap(vec2 p, float scale) {
  p /= scale;
  // Pillars
  vec2 hP = vec2(0.045, 0.55);
  float pL0 = length(max(abs(p - vec2(-0.55,-0.05)) - hP, 0.0));
  float pL1 = length(max(abs(p - vec2(-0.22,-0.05)) - hP, 0.0));
  float pR0 = length(max(abs(p - vec2( 0.22,-0.05)) - hP, 0.0));
  float pR1 = length(max(abs(p - vec2( 0.55,-0.05)) - hP, 0.0));
  float pillars = min(min(pL0, pL1), min(pR0, pR1));
  // Canopy (capsule)
  vec2 ca = vec2(-0.58, 0.50); vec2 cb = vec2(0.58, 0.50);
  vec2 pa = p - ca; vec2 ba = cb - ca;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float canopy = length(pa - ba * h) - 0.085;
  // Finial dome
  float finial = length(p - vec2(0.0, 0.74)) - 0.05;
  // Plinth
  vec2 hPl = vec2(0.62, 0.04);
  float plinth = length(max(abs(p - vec2(0.0, -0.62)) - hPl, 0.0));
  return min(min(pillars, canopy), min(finial, plinth));
}

float mandapField(vec2 p, float scale, float band) {
  float d = sdMandap(p, scale);
  return exp(-(d * d) / (band * band));
}

// ============================================================================
// Main
// ============================================================================
void main() {
  vec2 p = position.xy;
  float z = position.z; // depth slot in [-1, 1]

  // -- Slow drift via curl noise (organic, divergence-free-ish) ---------------
  float tSlow = uTime * 0.08;
  vec2 drift = curl2D(p * 0.7 + seed * 13.0, tSlow) * 0.045;

  // Per-particle wobble — high-frequency, low-amplitude jasmine breath.
  float wobble = snoise(vec3(p * 3.2, uTime * 0.6 + seed * 31.0)) * 0.012;
  drift += vec2(wobble, wobble * 0.6);

  // -- Mandap attractor: particles within the silhouette's gravity shell are
  // pulled toward (or pushed away from) it, weighted by uMandapPull.
  float field = mandapField(p, 0.95, 0.35);
  // Direction toward silhouette: numerical gradient of the SDF.
  float e = 0.04;
  vec2 grad = vec2(
    sdMandap(p + vec2(e, 0.0), 0.95) - sdMandap(p - vec2(e, 0.0), 0.95),
    sdMandap(p + vec2(0.0, e), 0.95) - sdMandap(p - vec2(0.0, e), 0.95)
  ) / (2.0 * e);
  // Normalize (safe).
  float gl = max(length(grad), 1e-4);
  vec2 toward = -grad / gl;
  // Pull strength: field weights it so far particles are unaffected.
  vec2 pull = toward * field * uMandapPull * 0.18;

  // -- Cursor displacement: push particles away from the pointer within
  // ~0.18 NDC units (~200px on a 1080-tall viewport). Quadratic falloff.
  vec2 toPointer = p - uPointer;
  float dPointer = length(toPointer);
  float pointerStrength = 1.0 - smoothstep(0.0, 0.18, dPointer);
  vec2 push = normalize(toPointer + vec2(1e-5)) * pointerStrength * 0.07 * uPointerActive;

  // -- Scroll lift: as the user scrolls, particles drift downward in screen
  // (the hero is going "behind" them) and slightly backward in z.
  vec2 scrollLift = vec2(0.0, -uScroll * 0.18);
  float zLift = uScroll * 0.25;

  // -- Cold-open bloom: at uIntro=1 particles are exploded outward from centre
  // and converge to rest at uIntro=0.
  vec2 bloom = normalize(p + vec2(1e-5)) * uIntro * (1.4 + seed * 0.6);

  vec2 worldPos = p + drift + pull + push + scrollLift + bloom;

  // -- Build clip-space position via the JS-supplied ortho projection.
  gl_Position = uProjection * vec4(worldPos, z + zLift, 1.0);

  // -- Point size: vary by depth + a small per-particle jitter.
  // Far particles (z negative) smaller; near (z positive) larger.
  float depthScale = 0.55 + (z + 1.0) * 0.5; // [0.55, 1.55]
  // Pull-charged particles get a tiny size boost — they bloom on the silhouette.
  float chargeBoost = 1.0 + field * abs(uMandapPull) * 0.45;
  // Cold-open particles spawn smaller and grow as they settle.
  float introScale = mix(1.0, 0.55, uIntro);
  gl_PointSize = radius * depthScale * chargeBoost * introScale * uDpr;

  // -- Varyings for the fragment.
  vBrightness = mix(0.55, 1.0, seed) * (0.7 + 0.5 * field * abs(uMandapPull));
  vCharge     = field * max(0.0, uMandapPull);
  vSeed       = seed;
  vPointWorld = worldPos;
}
