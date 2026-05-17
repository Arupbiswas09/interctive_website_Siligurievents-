/**
 * canvas-hero.ts — Vanilla OGL setup for the brass-dust hero particle cloud.
 *
 * Single canvas. Single program. Single geometry buffer. No classes.
 *
 * Why OGL, not three: OGL is ~10 KB gz, raw WebGL on top, no scene graph
 * we don't need. Three / R3F would add ~70-100 KB to a route whose entire
 * job is one point-cloud program.
 *
 * GLSL canonical source lives at:
 *   - lib/cinematic/shaders/brass-dust.vert.glsl
 *   - lib/cinematic/shaders/brass-dust.frag.glsl
 *   - lib/cinematic/shaders/mandap-sdf.glsl
 *
 * Those files are the readable spec. The shader strings below are the
 * runtime copy — kept in sync by hand because Next.js / Turbopack does
 * not load `.glsl` imports without a custom loader, and we refuse to
 * add a dependency just for that. If you edit a `.glsl` file, also
 * update the corresponding string constant in this file.
 *
 * Public API:
 *   mount(container, opts) → handle
 *
 *   handle.destroy()         — full GPU teardown (program, buffers, context).
 *   handle.setScroll(0..1)   — normalized hero scroll progress.
 *   handle.setPointer(x, y)  — pointer in CSS px, container-relative.
 *   handle.setPaused(bool)   — pause rAF (Page Visibility integration).
 *   handle.setMandapPull(v)  — -1..1 attractor strength (scroll-driven).
 *   handle.setIntro(v)       — 0..1 cold-open progress.
 *   handle.setFoilSweep(v)   — 0..1 brass-foil sweep phase.
 *   handle.triggerFoilSweep()— animate sweep 0→1 once over ~1.6s.
 *
 * Degradation:
 *   - If `prefers-reduced-motion: reduce` or Save-Data, mount() bails and
 *     paints a static brass-grain radial gradient into the container.
 *   - If WebGL context creation fails, same fallback.
 *   - Particle count auto-scales by hardwareConcurrency / deviceMemory /
 *     viewport — see resolveParticleCount.
 */

import { Renderer, Program, Geometry, Mesh, Vec2 } from "ogl";

// =============================================================================
// Shader sources (kept in sync with .glsl files — see header comment).
// =============================================================================

const VERTEX_SRC = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute float seed;
attribute float radius;

uniform mat4  uProjection;
uniform float uTime;
uniform float uScroll;
uniform vec2  uPointer;
uniform float uPointerActive;
uniform float uMandapPull;
uniform vec2  uResolution;
uniform float uDpr;
uniform float uIntro;

varying float vBrightness;
varying float vCharge;
varying float vSeed;
varying vec2  vPointWorld;

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

vec2 curl2D(vec2 p, float t) {
  float e = 0.08;
  float nx0 = snoise(vec3(p.x, p.y - e, t));
  float nx1 = snoise(vec3(p.x, p.y + e, t));
  float ny0 = snoise(vec3(p.x - e, p.y, t));
  float ny1 = snoise(vec3(p.x + e, p.y, t));
  return vec2(nx1 - nx0, -(ny1 - ny0)) / (2.0 * e);
}

float sdMandap(vec2 p, float scale) {
  p /= scale;
  vec2 hP = vec2(0.045, 0.55);
  float pL0 = length(max(abs(p - vec2(-0.55,-0.05)) - hP, 0.0));
  float pL1 = length(max(abs(p - vec2(-0.22,-0.05)) - hP, 0.0));
  float pR0 = length(max(abs(p - vec2( 0.22,-0.05)) - hP, 0.0));
  float pR1 = length(max(abs(p - vec2( 0.55,-0.05)) - hP, 0.0));
  float pillars = min(min(pL0, pL1), min(pR0, pR1));
  vec2 ca = vec2(-0.58, 0.50); vec2 cb = vec2(0.58, 0.50);
  vec2 pa = p - ca; vec2 ba = cb - ca;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float canopy = length(pa - ba * h) - 0.085;
  float finial = length(p - vec2(0.0, 0.74)) - 0.05;
  vec2 hPl = vec2(0.62, 0.04);
  float plinth = length(max(abs(p - vec2(0.0, -0.62)) - hPl, 0.0));
  return min(min(pillars, canopy), min(finial, plinth));
}

float mandapField(vec2 p, float scale, float band) {
  float d = sdMandap(p, scale);
  return exp(-(d * d) / (band * band));
}

void main() {
  vec2 p = position.xy;
  float z = position.z;

  float tSlow = uTime * 0.08;
  vec2 drift = curl2D(p * 0.7 + seed * 13.0, tSlow) * 0.045;

  float wobble = snoise(vec3(p * 3.2, uTime * 0.6 + seed * 31.0)) * 0.012;
  drift += vec2(wobble, wobble * 0.6);

  float field = mandapField(p, 0.95, 0.35);
  float e = 0.04;
  vec2 grad = vec2(
    sdMandap(p + vec2(e, 0.0), 0.95) - sdMandap(p - vec2(e, 0.0), 0.95),
    sdMandap(p + vec2(0.0, e), 0.95) - sdMandap(p - vec2(0.0, e), 0.95)
  ) / (2.0 * e);
  float gl = max(length(grad), 1e-4);
  vec2 toward = -grad / gl;
  vec2 pull = toward * field * uMandapPull * 0.18;

  vec2 toPointer = p - uPointer;
  float dPointer = length(toPointer);
  float pointerStrength = 1.0 - smoothstep(0.0, 0.18, dPointer);
  vec2 push = normalize(toPointer + vec2(1e-5)) * pointerStrength * 0.07 * uPointerActive;

  vec2 scrollLift = vec2(0.0, -uScroll * 0.18);
  float zLift = uScroll * 0.25;

  vec2 bloom = normalize(p + vec2(1e-5)) * uIntro * (1.4 + seed * 0.6);

  vec2 worldPos = p + drift + pull + push + scrollLift + bloom;

  gl_Position = uProjection * vec4(worldPos, z + zLift, 1.0);

  float depthScale = 0.55 + (z + 1.0) * 0.5;
  float chargeBoost = 1.0 + field * abs(uMandapPull) * 0.45;
  float introScale = mix(1.0, 0.55, uIntro);
  gl_PointSize = radius * depthScale * chargeBoost * introScale * uDpr;

  vBrightness = mix(0.55, 1.0, seed) * (0.7 + 0.5 * field * abs(uMandapPull));
  vCharge     = field * max(0.0, uMandapPull);
  vSeed       = seed;
  vPointWorld = worldPos;
}
`;

const FRAGMENT_SRC = /* glsl */ `
precision highp float;

const vec3 BRASS_LEAF = vec3(0.643, 0.478, 0.173);
const vec3 GOLD       = vec3(0.722, 0.537, 0.227);
const vec3 GOLD_SOFT  = vec3(0.910, 0.835, 0.659);
const vec3 ACCENT     = vec3(0.545, 0.102, 0.102);

uniform float uTime;
uniform float uFoilSweep;
uniform float uIntro;
uniform float uAccentMix;

varying float vBrightness;
varying float vCharge;
varying float vSeed;
varying vec2  vPointWorld;

void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q);
  float core = 1.0 - smoothstep(0.10, 0.50, r);
  if (core <= 0.001) discard;

  float b = clamp(vBrightness + (vSeed - 0.5) * 0.12, 0.0, 1.0);
  vec3 col;
  if (b < 0.55) {
    col = mix(BRASS_LEAF, GOLD, smoothstep(0.0, 0.55, b));
  } else {
    col = mix(GOLD, GOLD_SOFT, smoothstep(0.55, 1.0, b));
  }

  float sweepCenter = mix(-1.4, 1.4, uFoilSweep);
  float sweepDist   = abs(vPointWorld.x - sweepCenter);
  float sweepGlow   = exp(-sweepDist * sweepDist / 0.06);
  col = mix(col, GOLD_SOFT, sweepGlow * 0.55);

  float kiss = vCharge * smoothstep(0.7, 1.0, b) * uAccentMix;
  col = mix(col, ACCENT, kiss * 0.28);

  float aberr = 0.18 * vCharge + 0.04;
  float aR = 1.0 - smoothstep(0.10, 0.50 + aberr * 0.04, r);
  float aG = 1.0 - smoothstep(0.10, 0.50,                  r);
  float aB = 1.0 - smoothstep(0.10, 0.50 - aberr * 0.04, r);

  vec3 splat = vec3(col.r * aR, col.g * aG, col.b * aB);

  float bloomGain = 1.0 + pow(b, 3.0) * 0.85;
  splat *= bloomGain;

  float introFade = 1.0 - uIntro * 0.55;
  float alpha = core * (0.45 + 0.55 * b) * introFade;
  alpha *= 0.92 + 0.08 * sin(uTime * 0.9 + vSeed * 47.0);

  gl_FragColor = vec4(splat, alpha);
}
`;

// =============================================================================
// Types
// =============================================================================

export type CanvasHeroMode = "full" | "lite" | "off";

export type CanvasHeroOpts = {
  /** Target visual mode. Caller derives from prefers-reduced-motion / Save-Data. */
  mode?: CanvasHeroMode;
  /** Override the auto-tuned particle count (mostly for testing). */
  particleCount?: number;
  /** Mobile threshold in CSS px. Default 768. */
  mobileBreakpoint?: number;
};

export type CanvasHeroHandle = {
  destroy: () => void;
  setScroll: (progress: number) => void;
  setPointer: (xCss: number, yCss: number) => void;
  setPaused: (paused: boolean) => void;
  setMandapPull: (value: number) => void;
  setIntro: (value: number) => void;
  setFoilSweep: (value: number) => void;
  /** Animate the brass-foil sweep 0→1 over `durationMs` (default 1600ms). */
  triggerFoilSweep: (durationMs?: number) => void;
  /** Get the underlying canvas (or null after destroy / fallback). */
  getCanvas: () => HTMLCanvasElement | null;
  /** Current mode after resolution (e.g., 'lite' if WebGL failed). */
  mode: CanvasHeroMode;
};

// =============================================================================
// Capability detection & particle budgeting
// =============================================================================

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

function detectMode(requested: CanvasHeroMode | undefined): CanvasHeroMode {
  if (typeof window === "undefined") return "off";
  if (requested === "off") return "off";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const conn = (navigator as Navigator & { connection?: ConnectionLike })
    .connection;
  if (conn?.saveData === true) return "off";
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
    return "lite";
  }

  return requested ?? "full";
}

type DeviceMemoryNav = Navigator & { deviceMemory?: number };

function resolveParticleCount(
  containerWidth: number,
  containerHeight: number,
  isMobile: boolean,
  override?: number
): number {
  if (typeof override === "number" && override > 0) {
    return Math.floor(override);
  }

  // Base count derived from area, capped & floored.
  const area = containerWidth * containerHeight;
  let base = Math.round(area / 320); // ~3000 on 1280x768, ~4500 on 1920x1080

  base = Math.max(800, Math.min(6000, base));

  // Mobile: halve.
  if (isMobile) base = Math.round(base * 0.5);

  // Weak hardware: degrade by 70%.
  const memory = (navigator as DeviceMemoryNav).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 8;
  if ((memory !== undefined && memory <= 4) || cores <= 4) {
    base = Math.round(base * 0.3);
  }

  // Hard floor for very weak hardware.
  return Math.max(400, base);
}

// =============================================================================
// Fallback (static brass-grain gradient painted into the container)
// =============================================================================

function paintFallback(container: HTMLElement): () => void {
  const layer = document.createElement("div");
  layer.setAttribute("data-cinematic-fallback", "");
  layer.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    "background:" +
      [
        "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(164,122,44,0.18), transparent 60%)",
        "radial-gradient(ellipse 50% 40% at 80% 25%, rgba(232,213,168,0.12), transparent 65%)",
        "radial-gradient(ellipse 70% 50% at 50% 90%, rgba(139,26,26,0.12), transparent 70%)",
        "radial-gradient(circle at 50% 50%, rgba(250,247,242,0) 0%, rgba(250,247,242,0.0) 60%, rgba(250,247,242,0.55) 100%)",
      ].join(","),
    "mix-blend-mode:normal",
    "opacity:0.85",
  ].join(";");

  // Add an SVG grain overlay (4% opacity) so the fallback isn't a flat gradient.
  const grain = document.createElement("div");
  grain.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    "mix-blend-mode:overlay",
    "opacity:0.06",
    "background-image:url(\"data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.65 0 0 0 0 0.48 0 0 0 0 0.17 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
      ) +
      "\")",
    "background-size:160px 160px",
  ].join(";");

  layer.appendChild(grain);
  container.appendChild(layer);

  return () => {
    if (layer.parentNode) layer.parentNode.removeChild(layer);
  };
}

// =============================================================================
// Main entry — `mount`
// =============================================================================

/**
 * Mount the brass-dust canvas into `container`. Returns a handle the React
 * wrapper uses to feed scroll/pointer state and to clean up on unmount.
 */
export function mount(
  container: HTMLElement,
  opts: CanvasHeroOpts = {}
): CanvasHeroHandle {
  const mode = detectMode(opts.mode);

  if (mode === "off") {
    const undo = paintFallback(container);
    return {
      destroy: undo,
      setScroll: () => undefined,
      setPointer: () => undefined,
      setPaused: () => undefined,
      setMandapPull: () => undefined,
      setIntro: () => undefined,
      setFoilSweep: () => undefined,
      triggerFoilSweep: () => undefined,
      getCanvas: () => null,
      mode: "off",
    };
  }

  // ---------------------------------------------------------------------------
  // Renderer
  // ---------------------------------------------------------------------------

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: false, // points don't benefit; cheaper
      dpr: Math.min(window.devicePixelRatio || 1, 1.75),
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
  } catch {
    const undo = paintFallback(container);
    return {
      destroy: undo,
      setScroll: () => undefined,
      setPointer: () => undefined,
      setPaused: () => undefined,
      setMandapPull: () => undefined,
      setIntro: () => undefined,
      setFoilSweep: () => undefined,
      triggerFoilSweep: () => undefined,
      getCanvas: () => null,
      mode: "off",
    };
  }

  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
  // Allow CSS to control sizing; renderer.setSize handles backing store.
  container.appendChild(canvas);

  // Additive blending — dust over a dark/cream background reads as light.
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  // ---------------------------------------------------------------------------
  // Sizing
  // ---------------------------------------------------------------------------

  const rect = container.getBoundingClientRect();
  let cssW = Math.max(1, rect.width);
  let cssH = Math.max(1, rect.height);
  const isMobile = cssW < (opts.mobileBreakpoint ?? 768);

  renderer.setSize(cssW, cssH);

  // ---------------------------------------------------------------------------
  // Geometry — generate particle positions
  // ---------------------------------------------------------------------------

  const particleCount = resolveParticleCount(
    cssW,
    cssH,
    isMobile,
    opts.particleCount
  );

  // Aspect-correcting NDC: x ∈ [-aspect, aspect], y ∈ [-1, 1].
  const aspect = cssW / cssH;
  const halfX = aspect * 1.05;

  const positions = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);
  const radii = new Float32Array(particleCount);

  // Mulberry32 — deterministic, lightweight RNG so reloads look identical
  // and bug-repros are easier.
  let prngState = 0x9e3779b9 >>> 0;
  const rand = (): number => {
    prngState = (prngState + 0x6d2b79f5) >>> 0;
    let t = prngState;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < particleCount; i += 1) {
    // Bias 70% of particles into the mandap-friendly zone (-0.9..0.9 x, -0.7..0.9 y)
    // and 30% spread to the full canvas — so the cloud has a halo plus body.
    const isInner = rand() < 0.7;
    let x: number, y: number;
    if (isInner) {
      x = (rand() - 0.5) * 1.9;
      y = (rand() - 0.4) * 1.7;
    } else {
      x = (rand() - 0.5) * 2 * halfX;
      y = (rand() - 0.5) * 2;
    }
    // Depth: bias toward z=0 (mid plane) with shoulders.
    const z = (rand() + rand() + rand()) / 3 - 0.5; // [-0.5, 0.5]-ish, centered

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z * 2; // expand to [-1, 1]

    seeds[i] = rand();
    // Base radius in CSS px (before DPR multiplication in vertex shader).
    // Larger range gives the cloud visual depth.
    radii[i] = 1.2 + rand() * rand() * 5.0; // skews small with occasional fat motes
  }

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    seed: { size: 1, data: seeds },
    radius: { size: 1, data: radii },
  });

  // ---------------------------------------------------------------------------
  // Uniforms + Program
  // ---------------------------------------------------------------------------

  // Orthographic projection: we pass world coords roughly in NDC ourselves,
  // but we still want the projection to correct for aspect. Pre-compute a
  // simple ortho matrix as a column-major Float32Array.
  function makeOrtho(aspectIn: number): Float32Array {
    // Map x ∈ [-aspect, aspect] → [-1, 1], y ∈ [-1, 1] → [-1, 1] (passthrough).
    const a = 1 / aspectIn;
    // prettier-ignore
    return new Float32Array([
      a, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  const uniforms = {
    uProjection: { value: makeOrtho(aspect) },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new Vec2(2.0, 2.0) }, // off-screen by default
    uPointerActive: { value: 0 },
    uMandapPull: { value: 0 },
    uResolution: { value: new Vec2(cssW, cssH) },
    uDpr: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
    uIntro: { value: 0 },
    uFoilSweep: { value: -0.5 },
    uAccentMix: { value: 0.65 },
  };

  const program = new Program(gl, {
    vertex: VERTEX_SRC,
    fragment: FRAGMENT_SRC,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  // OGL has no `Points` primitive; render the Mesh as POINTS via the gl mode.
  const mesh = new Mesh(gl, {
    geometry,
    program,
    mode: gl.POINTS,
  });

  // ---------------------------------------------------------------------------
  // State (closure-scoped, no classes)
  // ---------------------------------------------------------------------------

  const state = {
    paused: false,
    pointerActiveTarget: 0,
    pointerActiveCurrent: 0,
    pointerNdc: { x: 2, y: 2 }, // off-screen
    pointerNdcTarget: { x: 2, y: 2 },
    mandapPullTarget: 0,
    mandapPullCurrent: 0,
    scrollTarget: 0,
    scrollCurrent: 0,
    introCurrent: 0,
    foilSweepCurrent: -0.5,
    foilSweepFrom: -0.5,
    foilSweepTo: -0.5,
    foilSweepStartMs: 0,
    foilSweepDurationMs: 0,
    startTime: performance.now(),
  };

  // ---------------------------------------------------------------------------
  // Resize observer — debounced via rAF
  // ---------------------------------------------------------------------------

  let resizeRaf = 0;
  const onResize = (): void => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const r = container.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      renderer.setSize(cssW, cssH);
      const a = cssW / cssH;
      uniforms.uProjection.value = makeOrtho(a);
      uniforms.uResolution.value.set(cssW, cssH);
      uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 1.75);
    });
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(container);

  // ---------------------------------------------------------------------------
  // Visibility pause
  // ---------------------------------------------------------------------------

  const onVisibility = (): void => {
    state.paused = document.hidden;
  };
  document.addEventListener("visibilitychange", onVisibility);

  // ---------------------------------------------------------------------------
  // Render loop — driven externally by GSAP ticker (the React wrapper hooks it
  // up). We still expose a self-rAF fallback if no external tick arrives.
  // ---------------------------------------------------------------------------

  let lastTickMs = performance.now();
  let internalRaf = 0;

  function tick(nowMs: number): void {
    if (state.paused) return;

    const dt = Math.min(0.05, (nowMs - lastTickMs) / 1000); // clamp dt at 50ms (10fps floor)
    lastTickMs = nowMs;

    // Smooth lerp into targets for buttery transitions.
    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
    state.scrollCurrent = lerp(state.scrollCurrent, state.scrollTarget, 0.12);
    state.mandapPullCurrent = lerp(
      state.mandapPullCurrent,
      state.mandapPullTarget,
      0.06
    );
    state.pointerActiveCurrent = lerp(
      state.pointerActiveCurrent,
      state.pointerActiveTarget,
      0.18
    );
    state.pointerNdc.x = lerp(state.pointerNdc.x, state.pointerNdcTarget.x, 0.25);
    state.pointerNdc.y = lerp(state.pointerNdc.y, state.pointerNdcTarget.y, 0.25);

    // Foil sweep tween (if running).
    if (state.foilSweepDurationMs > 0) {
      const elapsed = nowMs - state.foilSweepStartMs;
      const k = Math.min(1, elapsed / state.foilSweepDurationMs);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - k, 4);
      state.foilSweepCurrent =
        state.foilSweepFrom + (state.foilSweepTo - state.foilSweepFrom) * eased;
      if (k >= 1) state.foilSweepDurationMs = 0;
    }

    uniforms.uTime.value = (nowMs - state.startTime) / 1000;
    uniforms.uScroll.value = state.scrollCurrent;
    uniforms.uMandapPull.value = state.mandapPullCurrent;
    uniforms.uPointer.value.set(state.pointerNdc.x, state.pointerNdc.y);
    uniforms.uPointerActive.value = state.pointerActiveCurrent;
    uniforms.uIntro.value = state.introCurrent;
    uniforms.uFoilSweep.value = state.foilSweepCurrent;

    // Pointer activity decays toward 0 if no recent move.
    state.pointerActiveTarget = Math.max(0, state.pointerActiveTarget - dt * 0.6);

    renderer.render({ scene: mesh });
  }

  // Self-rAF: in case the React wrapper hasn't (yet) bound the GSAP ticker,
  // we keep a soft heartbeat so the canvas isn't black. The wrapper will
  // call setPaused(true)+resume after binding so we don't double-render.
  function softRaf(now: number): void {
    tick(now);
    internalRaf = requestAnimationFrame(softRaf);
  }
  internalRaf = requestAnimationFrame(softRaf);

  // ---------------------------------------------------------------------------
  // Public handle
  // ---------------------------------------------------------------------------

  const handle: CanvasHeroHandle = {
    destroy(): void {
      cancelAnimationFrame(internalRaf);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);

      // GL teardown — OGL exposes remove() helpers; also nuke the program.
      try {
        geometry.remove();
      } catch {
        /* noop */
      }
      try {
        // Force-lose context so the browser reclaims GPU memory immediately.
        const loseExt = gl.getExtension("WEBGL_lose_context");
        if (loseExt && "loseContext" in loseExt) {
          (loseExt as { loseContext: () => void }).loseContext();
        }
      } catch {
        /* noop */
      }
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    },

    setScroll(progress: number): void {
      state.scrollTarget = Math.max(0, Math.min(1, progress));
      // Mandap pull is driven by scroll: emerges (0 → 1) by 40%, dissolves
      // (1 → -0.4) by 80%. This is the load-bearing brand beat: the silhouette
      // *appears* as you read the headline, then disperses as you scroll on.
      const p = state.scrollTarget;
      if (p < 0.4) {
        state.mandapPullTarget = p / 0.4; // 0 → 1
      } else if (p < 0.8) {
        const k = (p - 0.4) / 0.4;
        state.mandapPullTarget = 1 - k * 1.4; // 1 → -0.4
      } else {
        state.mandapPullTarget = -0.4 + (p - 0.8) * 0.5; // tail off back to 0-ish
      }
    },

    setPointer(xCss: number, yCss: number): void {
      // Convert CSS px (container-relative) to our world coords
      // (x ∈ [-aspect, aspect], y ∈ [-1, 1], y up).
      const nx = (xCss / cssW - 0.5) * 2 * (cssW / cssH);
      const ny = -((yCss / cssH - 0.5) * 2);
      state.pointerNdcTarget.x = nx;
      state.pointerNdcTarget.y = ny;
      state.pointerActiveTarget = 1;
    },

    setPaused(paused: boolean): void {
      state.paused = paused;
      if (!paused) lastTickMs = performance.now();
    },

    setMandapPull(value: number): void {
      state.mandapPullTarget = Math.max(-1, Math.min(1, value));
    },

    setIntro(value: number): void {
      state.introCurrent = Math.max(0, Math.min(1, value));
    },

    setFoilSweep(value: number): void {
      state.foilSweepCurrent = value;
      state.foilSweepDurationMs = 0;
    },

    triggerFoilSweep(durationMs: number = 1600): void {
      state.foilSweepFrom = -0.5;
      state.foilSweepTo = 1.5;
      state.foilSweepCurrent = state.foilSweepFrom;
      state.foilSweepStartMs = performance.now();
      state.foilSweepDurationMs = durationMs;
    },

    getCanvas(): HTMLCanvasElement | null {
      return canvas;
    },

    mode,
  };

  return handle;
}
