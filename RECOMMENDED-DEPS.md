# Recommended dependencies

Dependencies the cinematic-hero feature requires but does not install
itself. The main agent should install these before enabling
`NEXT_PUBLIC_CINEMATIC_HERO=true`.

---

## ogl

- **Package**: `ogl`
- **Why**: Tiny (~10 KB gz) raw-WebGL helper used by the brass-dust
  particle cloud in `lib/cinematic/canvas-hero.ts`. Imported via
  dynamic `import()` so it does not appear in the initial bundle.
- **Why not three.js / @react-three/fiber**: R3F + three would add
  ~70–100 KB gz for the same use case. Our use case is one program
  with one geometry — no scene graph needed.
- **Install**:

  ```bash
  pnpm add ogl
  ```

  (Use whichever package manager the repo standardises on — `pnpm`,
  `npm`, `yarn`, or `bun`. Check `package.json` and any lockfiles
  before installing.)

- **Pin policy**: pin to the current latest minor at install time.
  OGL is a tiny library with a stable API surface, but it does ship
  occasional refactors of `Renderer` and `Geometry` between minors.
  Do not range-install (`^`); pin to an exact version once chosen
  to keep the cinematic feature reproducible.

- **TypeScript types**: OGL ships its own `.d.ts` since v1.0.x — no
  separate `@types` package needed.

- **Imports used by this feature** (for tree-shaking sanity):

  ```ts
  import { Renderer, Program, Geometry, Mesh, Vec2 } from "ogl";
  ```

---

## No other dependencies required

The cinematic hero stack reuses everything already in the repo:

- `gsap` (and `gsap/ScrollTrigger`) — already installed for the
  baseline motion system.
- `lenis` — already installed; we read scroll via ScrollTrigger so we
  do not import Lenis directly.
- Next.js / React 19 — base of the project.

No `@react-three/*`, no `three`, no postprocessing libraries.
