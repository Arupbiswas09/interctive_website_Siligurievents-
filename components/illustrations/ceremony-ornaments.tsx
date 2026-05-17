/**
 * Per-ceremony decorative SVG ornaments.
 *
 * Each component takes the same shape: a square viewBox 0..200 and uses
 * `currentColor` / explicit hue stops so the consumer can theme it via
 * CSS color / hex props. They are intentionally illustrative — not icons —
 * and read as decoration corners, side rails, or backdrop motifs.
 *
 * Use through the `<CeremonyOrnament name="..." />` switcher when you want
 * to render the ornament for a given theme slug, or import the named
 * component directly when the surface is fixed.
 */

import type { SVGProps } from "react";

type OrnamentProps = SVGProps<SVGSVGElement> & {
  hue?: string;
  hueSecondary?: string;
};

// ────────────────────────────────────────────────────────────────────────────
// HALDI — Marigold cluster (already used in hero, exported here for parity).
// ────────────────────────────────────────────────────────────────────────────

export function MarigoldOrnament({
  hue = "#e8a93a",
  hueSecondary = "#c25515",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <Marigold cx={50} cy={50} r={26} hue={hue} center={hueSecondary} />
      <Marigold cx={120} cy={70} r={32} hue="#d88a1f" center={hueSecondary} />
      <Marigold cx={90} cy={130} r={28} hue="#f0b449" center={hueSecondary} />
      <Marigold cx={150} cy={140} r={22} hue={hueSecondary} center="#3a210a" />
      <Marigold cx={30} cy={130} r={20} hue={hue} center={hueSecondary} />
      <path d="M50 50 Q 30 30 12 18" stroke="#4a6b2e" strokeWidth="1.2" opacity="0.6" />
      <path d="M120 70 Q 150 50 175 40" stroke="#4a6b2e" strokeWidth="1.2" opacity="0.6" />
      <path d="M18 24 Q 26 18 30 28 Q 22 30 18 24Z" fill="#5d8838" opacity="0.7" />
      <path d="M170 36 Q 178 30 182 40 Q 174 42 170 36Z" fill="#5d8838" opacity="0.7" />
    </svg>
  );
}

function Marigold({
  cx,
  cy,
  r,
  hue,
  center,
}: {
  cx: number;
  cy: number;
  r: number;
  hue: string;
  center: string;
}): React.ReactElement {
  const petalCount = 12;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: petalCount }).map((_, i) => (
        <ellipse
          key={`o-${i}`}
          cx={0}
          cy={-r * 0.55}
          rx={r * 0.28}
          ry={r * 0.55}
          fill={hue}
          opacity={0.75}
          transform={`rotate(${(i * 360) / petalCount})`}
        />
      ))}
      {Array.from({ length: petalCount }).map((_, i) => (
        <ellipse
          key={`i-${i}`}
          cx={0}
          cy={-r * 0.36}
          rx={r * 0.22}
          ry={r * 0.36}
          fill={hue}
          opacity={0.95}
          transform={`rotate(${(i * 360) / petalCount + 360 / petalCount / 2})`}
        />
      ))}
      <circle cx={0} cy={0} r={r * 0.18} fill={center} />
      <circle cx={0} cy={0} r={r * 0.09} fill={hue} />
    </g>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MEHENDI — Henna paisley / vine sprig
// ────────────────────────────────────────────────────────────────────────────

export function HennaPaisleyOrnament({
  hue = "#2e6e3a",
  hueSecondary = "#7b3f0a",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <g stroke={hueSecondary} strokeWidth="1.6" strokeLinecap="round" fill="none">
        {/* Paisley body */}
        <path d="M50 160 C 30 110, 60 60, 110 50 C 160 40, 170 90, 130 120 C 105 138, 80 130, 75 105 C 70 80, 90 70, 110 80 C 130 90, 130 110, 115 115" />
        {/* Vine */}
        <path d="M60 165 Q 50 175 35 180" />
        <path d="M115 115 q 5 15 18 22" />
        {/* Inner dot pattern */}
      </g>
      <g fill={hue}>
        <circle cx="105" cy="92" r="2.4" />
        <circle cx="115" cy="100" r="1.8" />
        <circle cx="98" cy="100" r="1.4" />
        <circle cx="110" cy="108" r="1.4" />
      </g>
      {/* Leaves */}
      <path d="M30 178 Q 20 170 24 158 Q 36 168 30 178" fill={hue} opacity="0.85" />
      <path d="M138 142 Q 148 134 144 122 Q 132 132 138 142" fill={hue} opacity="0.85" />
      {/* Dot scatter */}
      {[
        [40, 80],
        [50, 100],
        [62, 120],
        [78, 60],
        [92, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill={hueSecondary} opacity="0.75" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SANGEET — Jasmine garland / fairy lights
// ────────────────────────────────────────────────────────────────────────────

export function JasmineOrnament({
  hue = "#f5ede0",
  hueSecondary = "#a4365c",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 30 Q 60 70 100 50 T 190 60"
        stroke={hueSecondary}
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 60 Q 70 100 110 80 T 190 100"
        stroke={hueSecondary}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      {[
        [22, 36],
        [50, 56],
        [82, 50],
        [120, 56],
        [156, 60],
        [38, 72],
        [80, 86],
        [122, 88],
        [164, 96],
        [60, 110],
        [100, 116],
        [140, 122],
        [44, 138],
        [88, 152],
        [128, 152],
        [170, 142],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          {/* Jasmine: 5 petals */}
          {Array.from({ length: 5 }).map((_, j) => {
            const a = (j * 360) / 5;
            return (
              <ellipse
                key={j}
                cx="0"
                cy="-3"
                rx="1.6"
                ry="3.2"
                fill={hue}
                opacity="0.95"
                transform={`rotate(${a})`}
              />
            );
          })}
          <circle cx="0" cy="0" r="1" fill="#e8d5a8" />
        </g>
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// WEDDING / BENGALI WEDDING — Mandap pillar + rose petals
// ────────────────────────────────────────────────────────────────────────────

export function MandapOrnament({
  hue = "#c89860",
  hueSecondary = "#a4365c",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {/* Pillar */}
      <rect x="92" y="40" width="16" height="120" fill={hue} opacity="0.65" />
      <rect x="86" y="36" width="28" height="6" fill={hue} />
      <rect x="86" y="158" width="28" height="6" fill={hue} />
      {/* Capital */}
      <path d="M82 36 L 118 36 L 110 22 L 90 22 Z" fill={hueSecondary} opacity="0.8" />
      {/* Drape */}
      <path
        d="M86 42 Q 60 80 50 160 Q 75 130 86 90 Z"
        fill={hue}
        opacity="0.35"
      />
      <path
        d="M114 42 Q 140 80 150 160 Q 125 130 114 90 Z"
        fill={hue}
        opacity="0.35"
      />
      {/* Rose petals scattered */}
      {[
        [40, 30],
        [160, 50],
        [30, 110],
        [170, 130],
        [70, 170],
        [130, 175],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) rotate(${i * 30})`}>
          <ellipse cx="0" cy="0" rx="8" ry="5" fill={hueSecondary} opacity="0.7" />
          <ellipse cx="0" cy="-2" rx="6" ry="3.5" fill={hue} opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BENGALI — Conch (shankha) + dhaak silhouette
// ────────────────────────────────────────────────────────────────────────────

export function ConchOrnament({
  hue = "#f5ede0",
  hueSecondary = "#a4365c",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {/* Conch spiral */}
      <g transform="translate(100 100)">
        <path
          d="M0 -60 C 32 -55, 50 -25, 40 5 C 32 30, 0 38, -20 25 C -38 12, -38 -10, -22 -22 C -10 -32, 6 -28, 8 -16 C 10 -6, 0 0, -8 -2"
          stroke={hueSecondary}
          strokeWidth="1.6"
          fill={hue}
          fillOpacity="0.85"
          strokeLinecap="round"
        />
        <path
          d="M-22 -22 Q -10 -36 8 -34"
          stroke={hueSecondary}
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        {/* Detail ridges */}
        <path d="M-2 -45 Q 8 -38 16 -28" stroke={hueSecondary} strokeWidth="0.6" fill="none" opacity="0.45" />
        <path d="M-6 -50 Q 4 -42 12 -32" stroke={hueSecondary} strokeWidth="0.6" fill="none" opacity="0.35" />
      </g>
      {/* Dhaak drum sticks crossing */}
      <line x1="20" y1="170" x2="80" y2="60" stroke={hueSecondary} strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
      <line x1="80" y1="60" x2="20" y2="60" stroke={hueSecondary} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ENGAGEMENT — Champagne flute + pearls
// ────────────────────────────────────────────────────────────────────────────

export function ChampagneOrnament({
  hue = "#c89860",
  hueSecondary = "#e8d5a8",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {/* Flute */}
      <path d="M70 40 L 90 130 L 110 130 L 130 40 Z" stroke={hue} strokeWidth="1.2" fill={hueSecondary} fillOpacity="0.4" />
      <rect x="98" y="130" width="4" height="36" fill={hue} />
      <rect x="78" y="166" width="44" height="3" fill={hue} />
      {/* Bubbles */}
      {[
        [88, 90],
        [98, 70],
        [108, 100],
        [94, 80],
        [104, 85],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.6 + (i % 2)} fill={hueSecondary} opacity="0.85" />
      ))}
      {/* Pearl strand */}
      <path d="M20 170 Q 60 180 100 174 Q 140 168 180 178" stroke={hue} strokeWidth="0.6" fill="none" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={20 + i * 12} cy={170 + (i % 2) * 4} r="2.6" fill={hueSecondary} stroke={hue} strokeWidth="0.5" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// RECEPTION — Chandelier
// ────────────────────────────────────────────────────────────────────────────

export function ChandelierOrnament({
  hue = "#c89860",
  hueSecondary = "#a4365c",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <line x1="100" y1="0" x2="100" y2="40" stroke={hue} strokeWidth="0.8" />
      <ellipse cx="100" cy="42" rx="20" ry="6" stroke={hue} strokeWidth="1" fill={hueSecondary} fillOpacity="0.25" />
      <path d="M82 42 Q 100 80 118 42" stroke={hue} strokeWidth="0.8" fill="none" />
      <path d="M70 50 Q 100 100 130 50" stroke={hue} strokeWidth="0.6" fill="none" />
      {/* Crystals */}
      {[
        [80, 60],
        [88, 75],
        [100, 88],
        [112, 75],
        [120, 60],
        [70, 90],
        [88, 110],
        [112, 110],
        [130, 90],
        [60, 110],
        [100, 130],
        [140, 110],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <path d="M0 -6 L 4 0 L 0 6 L -4 0 Z" fill={hue} opacity="0.85" />
        </g>
      ))}
      {/* Drops */}
      {[
        [60, 130],
        [80, 145],
        [100, 152],
        [120, 145],
        [140, 130],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <path d="M0 -8 Q 4 0 0 8 Q -4 0 0 -8" fill={hueSecondary} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BIRTHDAY — Balloon cluster + confetti
// ────────────────────────────────────────────────────────────────────────────

export function BalloonOrnament({
  hue = "#a4365c",
  hueSecondary = "#c89860",
  ...props
}: OrnamentProps): React.ReactElement {
  const balloons = [
    { cx: 60, cy: 60, r: 24, fill: hue },
    { cx: 110, cy: 50, r: 28, fill: "#5d8838" },
    { cx: 160, cy: 70, r: 22, fill: hueSecondary },
    { cx: 80, cy: 110, r: 20, fill: "#1e2a38" },
    { cx: 140, cy: 120, r: 24, fill: hue },
  ] as const;
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {balloons.map((b, i) => (
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.85} ry={b.r} fill={b.fill} opacity="0.92" />
          {/* Highlight */}
          <ellipse cx={b.cx - b.r * 0.3} cy={b.cy - b.r * 0.4} rx={b.r * 0.18} ry={b.r * 0.3} fill="white" opacity="0.45" />
          {/* Knot */}
          <path d={`M${b.cx - 2} ${b.cy + b.r} L${b.cx} ${b.cy + b.r + 4} L${b.cx + 2} ${b.cy + b.r} Z`} fill={b.fill} />
          {/* String */}
          <path
            d={`M${b.cx} ${b.cy + b.r + 4} Q ${b.cx + (i % 2 ? -6 : 6)} ${b.cy + b.r + 40} ${b.cx + (i % 2 ? -10 : 10)} 200`}
            stroke={b.fill}
            strokeWidth="0.6"
            fill="none"
            opacity="0.7"
          />
        </g>
      ))}
      {/* Confetti */}
      {[
        [22, 30, hue],
        [180, 36, hueSecondary],
        [38, 100, "#5d8838"],
        [184, 110, hue],
        [28, 160, hueSecondary],
        [180, 170, "#5d8838"],
      ].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width="6" height="2.5" fill={c as string} transform={`rotate(${i * 32} ${x} ${y})`} opacity="0.85" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CORPORATE — Brass cog + pinstripe
// ────────────────────────────────────────────────────────────────────────────

export function BrassCogOrnament({
  hue = "#c89860",
  hueSecondary = "#1e2a38",
  ...props
}: OrnamentProps): React.ReactElement {
  const teeth = 14;
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <g transform="translate(100 100)">
        {Array.from({ length: teeth }).map((_, i) => {
          const a = (i * 360) / teeth;
          return (
            <rect
              key={i}
              x="-5"
              y="-78"
              width="10"
              height="14"
              fill={hue}
              transform={`rotate(${a})`}
              opacity="0.85"
            />
          );
        })}
        <circle r="62" stroke={hue} strokeWidth="3" fill={hueSecondary} fillOpacity="0.06" />
        <circle r="44" stroke={hue} strokeWidth="1" fill="none" opacity="0.55" />
        <circle r="18" fill={hue} opacity="0.9" />
        <circle r="6" fill={hueSecondary} />
      </g>
      {/* Pinstripes */}
      {[10, 22, 178, 190].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="200" y2={y} stroke={hue} strokeWidth="0.5" opacity="0.55" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ANNAPRASHAN — Banana leaf platter + brass diya
// ────────────────────────────────────────────────────────────────────────────

export function BananaLeafOrnament({
  hue = "#3d6b2f",
  hueSecondary = "#c89860",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {/* Leaf */}
      <path d="M30 110 Q 60 40 140 40 Q 170 100 140 160 Q 60 170 30 110 Z" fill={hue} opacity="0.78" />
      {/* Midrib */}
      <path d="M30 110 Q 90 100 170 100" stroke={hueSecondary} strokeWidth="0.8" opacity="0.7" fill="none" />
      {/* Veins */}
      {[
        [60, 70, 60, 130],
        [85, 56, 85, 140],
        [110, 50, 110, 144],
        [135, 56, 135, 134],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hueSecondary} strokeWidth="0.5" opacity="0.6" />
      ))}
      {/* Brass diya at centre */}
      <ellipse cx="100" cy="105" rx="20" ry="6" fill={hueSecondary} />
      <path d="M80 105 Q 100 122 120 105" fill={hueSecondary} opacity="0.85" />
      {/* Flame */}
      <path d="M100 95 Q 96 86 100 78 Q 104 86 100 95" fill="#f0b449" />
      <path d="M100 90 Q 98 84 100 80 Q 102 84 100 90" fill="#fff7e0" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DURGA PUJA — Dhunuchi + trishul
// ────────────────────────────────────────────────────────────────────────────

export function DhunuchiOrnament({
  hue = "#c25515",
  hueSecondary = "#c89860",
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      {/* Dhunuchi */}
      <path d="M70 130 L 130 130 L 120 168 L 80 168 Z" fill={hueSecondary} />
      <rect x="80" y="124" width="40" height="8" fill={hueSecondary} />
      <ellipse cx="100" cy="124" rx="22" ry="4" stroke={hue} strokeWidth="1" fill={hueSecondary} />
      {/* Smoke / coconut husk fire */}
      <path d="M100 122 Q 92 100 100 80 Q 108 100 100 122" fill={hue} opacity="0.7" />
      <path d="M100 100 Q 92 80 100 60 Q 108 80 100 100" fill="#f0b449" opacity="0.85" />
      <path d="M100 80 Q 96 64 100 50 Q 104 64 100 80" fill="#fff7e0" opacity="0.95" />
      <circle cx="92" cy="92" r="1.4" fill={hue} opacity="0.7" />
      <circle cx="108" cy="80" r="1.2" fill={hue} opacity="0.7" />
      {/* Trishul behind */}
      <line x1="40" y1="20" x2="40" y2="180" stroke={hueSecondary} strokeWidth="1.2" opacity="0.45" />
      <path d="M30 20 L 40 0 L 50 20 Z M 32 12 L 48 12" stroke={hueSecondary} strokeWidth="0.8" fill="none" opacity="0.45" />
      <line x1="160" y1="20" x2="160" y2="180" stroke={hueSecondary} strokeWidth="1.2" opacity="0.45" />
      <path d="M150 20 L 160 0 L 170 20 Z M 152 12 L 168 12" stroke={hueSecondary} strokeWidth="0.8" fill="none" opacity="0.45" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MANDALA — Generic background motif for all ceremonies (rotating accent)
// ────────────────────────────────────────────────────────────────────────────

export function MandalaOrnament({
  hue = "#c89860",
  hueSecondary,
  ...props
}: OrnamentProps): React.ReactElement {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" {...props}>
      <circle cx="100" cy="100" r="92" stroke={hue} strokeWidth="0.6" opacity="0.5" />
      <circle cx="100" cy="100" r="76" stroke={hue} strokeWidth="0.4" opacity="0.35" />
      <circle cx="100" cy="100" r="58" stroke={hue} strokeWidth="0.5" opacity="0.45" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="40" stroke={hue} strokeWidth="0.4" opacity="0.4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 100 + Math.cos(a) * 88;
        const y = 100 + Math.sin(a) * 88;
        return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke={hue} strokeWidth="0.35" opacity="0.35" />;
      })}
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={i} cx="100" cy="50" rx="3" ry="8" fill={hue} opacity="0.55" transform={`rotate(${(i * 360) / 16} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="3" fill={hue} />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Slug → ornament resolver
// ────────────────────────────────────────────────────────────────────────────

export const ORNAMENTS = {
  marigold: MarigoldOrnament,
  paisley: HennaPaisleyOrnament,
  jasmine: JasmineOrnament,
  mandap: MandapOrnament,
  conch: ConchOrnament,
  champagne: ChampagneOrnament,
  chandelier: ChandelierOrnament,
  balloon: BalloonOrnament,
  cog: BrassCogOrnament,
  bananaLeaf: BananaLeafOrnament,
  dhunuchi: DhunuchiOrnament,
  mandala: MandalaOrnament,
} as const;

export type OrnamentName = keyof typeof ORNAMENTS;

export function CeremonyOrnament({
  name,
  ...rest
}: OrnamentProps & { name: OrnamentName }): React.ReactElement {
  const Cmp = ORNAMENTS[name];
  return <Cmp {...rest} />;
}
