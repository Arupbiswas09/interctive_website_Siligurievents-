"use client";

/**
 * LocationsHubMapGrid — split-screen map + sortable list of cities.
 *
 * LEFT (lg): a stylized cream/brass SVG map of North Bengal with topographic
 * swirls, the Teesta as a meandering line, and dots positioned roughly
 * geographically for each city. The map is decorative — it sets context, it
 * does not handle clicks.
 *
 * RIGHT (lg): radio-chip region filter, then a card grid of cities. Each
 * card has a single Unsplash photograph, italic title, region eyebrow, an
 * "{N} events designed" stat, and a link to /locations/[slug].
 *
 * Reduced motion: chips switch without crossfade. Cards do not animate in.
 */

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Location } from "@/lib/cms/locations";

type RegionFilter = "all" | "north-bengal" | "bhutan-border" | "tea-country";

const REGION_FILTERS: ReadonlyArray<{ slug: RegionFilter; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "north-bengal", label: "North Bengal" },
  { slug: "bhutan-border", label: "Bhutan border" },
  { slug: "tea-country", label: "Tea country" },
];

/** Buckets each location into one or more region tags for the chip filter. */
const REGION_TAGS: Record<string, ReadonlyArray<RegionFilter>> = {
  siliguri: ["north-bengal"],
  bagdogra: ["north-bengal"],
  darjeeling: ["north-bengal", "tea-country"],
  kalimpong: ["north-bengal", "bhutan-border", "tea-country"],
  jalpaiguri: ["north-bengal"],
  gangtok: ["bhutan-border"],
  dooars: ["bhutan-border", "tea-country"],
};

/** Stable per-city Unsplash imagery — pulled from the curated decor pool. */
const CITY_IMAGE: Record<string, string> = {
  siliguri:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  bagdogra:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80",
  darjeeling:
    "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1600&q=80",
  kalimpong:
    "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1600&q=80",
  jalpaiguri:
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1600&q=80",
  gangtok:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
  dooars:
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=80",
};

/** Approximate map pin positions inside the 800×500 SVG viewBox. */
const MAP_PINS: Record<string, { cx: number; cy: number }> = {
  gangtok: { cx: 477, cy: 60 },
  darjeeling: { cx: 180, cy: 200 },
  kalimpong: { cx: 350, cy: 200 },
  siliguri: { cx: 290, cy: 330 },
  bagdogra: { cx: 220, cy: 340 },
  jalpaiguri: { cx: 540, cy: 420 },
  dooars: { cx: 620, cy: 320 },
};

const PROJECTS_PER_CITY: Record<string, number> = {
  siliguri: 124,
  bagdogra: 32,
  darjeeling: 18,
  kalimpong: 14,
  jalpaiguri: 36,
  gangtok: 12,
  dooars: 22,
};

type LocationsHubMapGridProps = {
  locations: ReadonlyArray<Location>;
};

export function LocationsHubMapGrid({
  locations,
}: LocationsHubMapGridProps): React.ReactElement {
  const [filter, setFilter] = useState<RegionFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return locations;
    return locations.filter((l) => REGION_TAGS[l.slug]?.includes(filter));
  }, [filter, locations]);

  return (
    <Section tone="default" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-10)] lg:grid-cols-12 lg:gap-[var(--space-12)]">
          {/* ── LEFT — stylized map ─────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="sticky top-[var(--space-24)] flex flex-col gap-[var(--space-4)]">
              <Eyebrow tone="gold">North Bengal · Sikkim</Eyebrow>
              <NorthBengalMap activeSlugs={filtered.map((l) => l.slug)} />
              <p className="max-w-[40ch] text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                We work the full belt — from the tea-garden valleys of the
                Dooars to the high streets of Gangtok. Pick a region on the
                right to narrow the list.
              </p>
            </div>
          </div>

          {/* ── RIGHT — filter + cards ───────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-[var(--space-8)]">
              {/* Filter chips */}
              <fieldset
                className="flex flex-wrap gap-[var(--space-2)]"
                aria-label="Region filter"
              >
                <legend className="sr-only">Filter by region</legend>
                {REGION_FILTERS.map((opt) => {
                  const active = filter === opt.slug;
                  return (
                    <label
                      key={opt.slug}
                      className={cn(
                        "cursor-pointer rounded-full border px-[var(--space-4)] py-[var(--space-2)]",
                        "text-[length:var(--text-sm)] uppercase tracking-[var(--tracking-eyebrow)]",
                        "transition-colors duration-200",
                        active
                          ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-bg)]"
                          : "border-[color:var(--color-border)] text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)]",
                      )}
                    >
                      <input
                        type="radio"
                        name="region-filter"
                        value={opt.slug}
                        checked={active}
                        onChange={() => setFilter(opt.slug)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </fieldset>

              {/* City cards */}
              {filtered.length === 0 ? (
                <p className="text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
                  No cities in this region yet — we are growing.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
                  {filtered.map((location) => (
                    <li key={location.slug}>
                      <CityCard location={location} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────────────

type CityCardProps = { location: Location };

function CityCard({ location }: CityCardProps): React.ReactElement {
  const image = CITY_IMAGE[location.slug] ?? CITY_IMAGE.siliguri!;
  const count = PROJECTS_PER_CITY[location.slug] ?? 0;

  return (
    <Link
      href={`/locations/${location.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg-elevated)]",
        "transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-[2px] hover:border-[color:var(--color-ink)] hover:shadow-[var(--shadow-card)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={`Decor by Siliguri Event in ${location.name}`}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, rgba(15,12,10,0.55) 100%)",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]/85 px-[var(--space-2)] py-[2px] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)] backdrop-blur"
        >
          {location.region}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--space-2)] p-[var(--space-5)]">
        <h3 className="font-display text-[length:var(--text-3xl)] italic leading-[1.05] tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
          {location.name}
        </h3>
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
          {location.tagline}
        </p>
        <p className="mt-auto flex items-center justify-between gap-[var(--space-3)] pt-[var(--space-3)] text-[length:var(--text-sm)]">
          <span className="text-[color:var(--color-gold)]">
            {count} events designed
          </span>
          <span
            aria-hidden="true"
            className="text-[color:var(--color-accent)] transition-transform duration-200 group-hover:translate-x-[3px]"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}

// ────────────────────────────────────────────────────────────────────────────

type NorthBengalMapProps = {
  activeSlugs: ReadonlyArray<string>;
};

function NorthBengalMap({
  activeSlugs,
}: NorthBengalMapProps): React.ReactElement {
  const active = new Set(activeSlugs);
  return (
    <div
      className="relative w-full overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)]"
      style={{ aspectRatio: "8 / 5", background: "#f6efe1" }}
    >
      <svg
        viewBox="0 0 800 500"
        className="h-full w-full"
        role="img"
        aria-label="Stylised map of North Bengal and Sikkim with Siliguri Event service cities"
      >
        <title>Service area map — North Bengal and Sikkim</title>

        {/* Topographic swirls — concentric curves suggesting foothill ridges */}
        <g stroke="#c89860" strokeWidth="0.6" fill="none" opacity="0.45">
          <path d="M 40 130 Q 220 60 420 90 T 760 80" />
          <path d="M 40 170 Q 240 110 460 130 T 760 130" />
          <path d="M 40 220 Q 260 170 480 180 T 760 190" />
          <path d="M 40 280 Q 200 240 420 250 T 760 260" />
        </g>

        {/* Lower plain — Dooars belt */}
        <g stroke="#b87a16" strokeWidth="0.5" fill="none" opacity="0.35">
          <path d="M 60 380 Q 220 410 420 400 T 760 410" />
          <path d="M 60 430 Q 220 460 420 450 T 760 460" />
        </g>

        {/* Teesta river — meandering line */}
        <path
          d="M 477 50
             Q 440 130 380 200
             Q 320 270 290 330
             Q 320 380 420 420
             Q 540 440 700 430"
          fill="none"
          stroke="#3a7ad8"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Bhutan border hint — dashed eastern arc */}
        <path
          d="M 700 60 Q 720 220 700 430"
          fill="none"
          stroke="#a67518"
          strokeWidth="0.9"
          strokeDasharray="3 6"
          opacity="0.45"
        />

        {/* City pins */}
        {Object.entries(MAP_PINS).map(([slug, { cx, cy }]) => {
          const isActive = active.has(slug);
          const isAnchor = slug === "siliguri";
          const label =
            slug.charAt(0).toUpperCase() +
            slug.slice(1).replace(/-/g, " ");
          return (
            <g key={slug} opacity={isActive ? 1 : 0.4}>
              {isAnchor ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r="18"
                  fill="none"
                  stroke="#b51d36"
                  strokeWidth="1.2"
                  opacity="0.45"
                />
              ) : null}
              <circle
                cx={cx}
                cy={cy}
                r={isAnchor ? 7 : 5}
                fill={isAnchor ? "#b51d36" : "#c89860"}
                stroke="#3a1a24"
                strokeWidth="0.6"
              />
              <text
                x={cx + 12}
                y={cy + 4}
                fontSize={isAnchor ? 16 : 13}
                fontWeight={isAnchor ? 600 : 400}
                fill="#3a1a24"
                fontFamily="var(--font-display, serif)"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
