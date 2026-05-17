import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const ADDRESS = {
  line1: "Siligurievent Studio",
  line2: "Hill Cart Road",
  line3: "Siliguri, West Bengal 734001",
  hours: "Weekdays · 11 AM – 7 PM",
  weekend: "Saturdays · by appointment",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=Siliguri+Event+Hill+Cart+Road+Siliguri",
} as const;

/**
 * ContactStudioLocation — studio details + stylised SVG "map" placeholder.
 * No external map service; the right column is a hand-styled brass cartouche
 * with wandering roads and a mandala pin marking the studio.
 */
export function ContactStudioLocation(): React.ReactElement {
  return (
    <Section tone="elevated" spacing="lg" id="studio">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] lg:grid-cols-12 lg:gap-[var(--space-16)]">
          {/* LEFT — editorial studio block */}
          <div className="lg:col-span-5 flex flex-col gap-[var(--space-6)]">
            <span className="inline-flex items-center gap-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[color:var(--color-gold)]"
              />
              The studio
            </span>

            <h2
              className="font-display italic font-light text-[color:var(--color-ink)]"
              style={{
                fontSize: "clamp(28px, 3.4vw + 14px, 48px)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-display-tight)",
              }}
            >
              {ADDRESS.line1}
            </h2>

            <address className="not-italic text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {ADDRESS.line2}
              <br />
              {ADDRESS.line3}
            </address>

            <ul className="flex flex-col gap-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-5)] text-[length:var(--text-base)]">
              <li className="flex items-center gap-[var(--space-3)]">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rotate-45 bg-[color:var(--color-gold)]"
                />
                {ADDRESS.hours}
              </li>
              <li className="flex items-center gap-[var(--space-3)]">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rotate-45 bg-[color:var(--color-gold)]"
                />
                {ADDRESS.weekend}
              </li>
            </ul>

            <a
              href={ADDRESS.directionsHref}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "group inline-flex items-center gap-[var(--space-2)] self-start",
                "text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)]",
                "text-[color:var(--color-ink)] hover:text-[color:var(--color-gold-deep)]",
                "transition-colors duration-200",
              )}
            >
              <span
                aria-hidden="true"
                className="inline-block h-px w-6 bg-current transition-[width] duration-200 group-hover:w-10"
              />
              Drive directions
            </a>
          </div>

          {/* RIGHT — stylised SVG map */}
          <div className="lg:col-span-7">
            <StylisedMap />
          </div>
        </div>

        {/* Hairline + closing line */}
        <div className="mt-[var(--space-16)] flex flex-col items-center gap-[var(--space-4)]">
          <span
            aria-hidden="true"
            className="block h-px w-full max-w-[420px] bg-[color:var(--color-border)]"
          />
          <p className="font-display italic text-[length:var(--text-lg)] text-[color:var(--color-ink-muted)]">
            Or come find us — open weekdays 11–7.
          </p>
        </div>
      </Container>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stylised map — hand-drawn brass roads + mandala pin
// ─────────────────────────────────────────────────────────────────────────────

function StylisedMap(): React.ReactElement {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "4 / 3",
        background: "var(--color-bg-soft)",
      }}
    >
      {/* Soft radial wash for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 45%, rgba(200,152,96,0.18) 0%, transparent 60%)",
        }}
      />

      {/* SVG roads + pin */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern
            id="map-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="var(--color-gold)"
              strokeOpacity="0.06"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#map-grid)" />

        {/* Wandering roads — brass strokes */}
        <g
          fill="none"
          stroke="var(--color-gold)"
          strokeOpacity="0.55"
          strokeLinecap="round"
        >
          <path d="M -20 420 Q 180 380 320 320 T 620 240 Q 720 220 820 200" strokeWidth="2.6" />
          <path d="M 40 -10 Q 80 140 200 220 T 420 340 Q 540 380 820 360" strokeWidth="2.2" />
          <path d="M -20 100 Q 140 130 280 200 T 540 280 Q 640 300 820 280" strokeWidth="1.4" strokeOpacity="0.35" />
          <path d="M 120 620 Q 220 540 360 480 T 600 380 Q 700 360 820 380" strokeWidth="1.4" strokeOpacity="0.35" />
          <path d="M 380 -20 Q 400 120 440 220 T 480 460 Q 500 540 510 620" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="4 6" />
          <path d="M -10 540 Q 200 500 420 460 T 820 440" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 6" />
        </g>

        {/* Compass mark */}
        <g transform="translate(70 70)" opacity="0.6">
          <circle r="22" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" />
          <path d="M 0 -18 L 4 0 L 0 18 L -4 0 Z" fill="var(--color-gold)" />
          <text
            x="0"
            y="-26"
            textAnchor="middle"
            fill="var(--color-gold)"
            fontSize="10"
            letterSpacing="0.2em"
            fontFamily="ui-monospace, monospace"
          >
            N
          </text>
        </g>

        {/* Studio pin — mandala glyph */}
        <g transform="translate(440 290)">
          {/* Glow */}
          <circle r="58" fill="var(--color-gold)" fillOpacity="0.10" />
          <circle r="40" fill="var(--color-gold)" fillOpacity="0.18" />

          {/* Mandala rings */}
          <g stroke="var(--color-gold-deep)" fill="none">
            <circle r="36" strokeWidth="1" />
            <circle r="26" strokeWidth="0.6" strokeDasharray="2 3" />
            <circle r="16" strokeWidth="0.8" />
          </g>
          {/* Petals */}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-22"
              rx="2.4"
              ry="6"
              fill="var(--color-gold-deep)"
              opacity="0.85"
              transform={`rotate(${(i * 360) / 12})`}
            />
          ))}
          {/* Centre dot */}
          <circle r="4" fill="var(--color-gold-deep)" />

          {/* Pin stem */}
          <path
            d="M 0 8 L 0 56"
            stroke="var(--color-gold-deep)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="0" cy="60" r="3" fill="var(--color-gold-deep)" />
        </g>

        {/* Label — pin caption */}
        <g transform="translate(440 230)">
          <rect
            x="-118"
            y="-22"
            width="236"
            height="32"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-gold-deep)"
            strokeOpacity="0.7"
            strokeWidth="0.6"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="var(--color-ink)"
            fontSize="13"
            fontFamily="serif"
            fontStyle="italic"
          >
            Siliguri Event · Hill Cart Road
          </text>
        </g>
      </svg>

      {/* Map corner brass caption */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-[var(--space-2)] font-mono text-[length:var(--text-xs)] tracking-wide text-[color:var(--color-ink-muted)]">
        <span
          aria-hidden="true"
          className="inline-block h-px w-4 bg-[color:var(--color-gold)]"
        />
        26.71°N · 88.43°E
      </div>
    </div>
  );
}
