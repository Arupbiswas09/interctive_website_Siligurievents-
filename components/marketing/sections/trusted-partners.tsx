import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Marquee } from "@/components/motion/marquee";
import { getPartners } from "@/lib/cms/partners";
import type { Partner, PartnerTier } from "@/lib/cms/partners";
import { cn } from "@/lib/utils";

/**
 * `TrustedPartners` — venues-we-love strip.
 *
 * Server Component. Delegates the actual marquee animation to the existing
 * `<Marquee>` client primitive in `components/motion/marquee.tsx`.
 *
 * Each slot renders a typeset wordmark in Cormorant Garamond italic, framed
 * by thin brass hairlines. When (and only when) a partner's `logoUrl` field
 * is populated, the slot renders the licensed logo image instead — the swap
 * is data-driven so no markup change is required when permissions land.
 *
 * Legal context: see `docs/PARTNER-LOGO-RESEARCH.md`. We do NOT render
 * third-party logo images until written permission is on file.
 *
 * Reduced motion: handled by the underlying `<Marquee>` primitive, which
 * collapses to a static, non-animated row.
 */

export type TrustedPartnersTone = "light" | "dark";

export interface TrustedPartnersProps {
  /** Optional eyebrow. Defaults to "Venues we love". */
  eyebrow?: string;
  /** Optional display heading. Defaults to "Where we've staged celebrations". */
  heading?: string;
  /** Visual tone — drives section background and text colours. */
  tone?: TrustedPartnersTone;
  /**
   * Partner rows to render. Defaults to the launch shortlist from
   * `lib/cms/partners.ts`. Two rows are rendered with opposite directions
   * and slightly different durations; the section splits the array in half.
   */
  partners?: ReadonlyArray<Partner>;
}

/**
 * Re-export the launch shortlist as `partners` so consumers can do:
 *   `import { partners } from "@/components/marketing/sections/trusted-partners";`
 * The brief asked for a named `partners` export from this file specifically.
 */
export const partners: ReadonlyArray<Partner> = getPartners();

export function TrustedPartners({
  eyebrow = "Venues we love",
  heading = "Where we've staged celebrations",
  tone = "light",
  partners: partnersProp,
}: TrustedPartnersProps): React.ReactElement {
  const data = partnersProp ?? partners;
  const half = Math.ceil(data.length / 2);
  const rowA = data.slice(0, half);
  // Second row holds the remaining entries. If the input is short or odd,
  // top up `rowB` from the head of the list so neither row ever renders
  // empty. Both rows are duplicated internally by `<Marquee>` for the
  // seamless loop, so visual symmetry only depends on us giving each row
  // at least one entry.
  const tail = data.slice(half);
  const rowB =
    tail.length > 0
      ? tail
      : data;

  const isDark = tone === "dark";

  return (
    <Section
      as="section"
      tone={isDark ? "dark" : "default"}
      spacing="lg"
      id="trusted-partners"
    >
      <Container>
        <div className="mb-[var(--space-10)] flex max-w-[64ch] flex-col gap-[var(--space-3)]">
          <Eyebrow tone={isDark ? "gold" : "accent"}>{eyebrow}</Eyebrow>
          <DisplayHeading as="h2" size="lg" text={heading} />
          <p
            className={cn(
              "max-w-[56ch] text-[length:var(--text-sm)] leading-relaxed",
              isDark
                ? "text-[#D7CDBE]"
                : "text-[color:var(--color-ink-muted)]",
            )}
          >
            Partnerships with the region's finest hotels, resorts and heritage
            estates — across Siliguri, Darjeeling, Kalimpong, the Dooars and
            Sikkim.
          </p>
        </div>
      </Container>

      {/* Aria-labelled list outside the marquee for assistive tech. The
          marquee itself is aria-hidden — the data is also reachable via the
          visually-hidden list below for screen readers and crawlers. */}
      <h3 id="trusted-partners-label" className="sr-only">
        Partner venues
      </h3>
      <ul aria-labelledby="trusted-partners-label" className="sr-only">
        {data.map((p) => (
          <li key={p.slug}>
            {p.name}
            {p.location ? `, ${p.location}` : null}
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "flex flex-col gap-[var(--space-4)]",
          // Edge masks so wordmarks ghost in/out at the viewport sides.
          "[--mask:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]",
        )}
      >
        <div className="[mask-image:var(--mask)]">
          <Marquee speed={70} reverse={false} pauseOnHover>
            <PartnerRow partners={rowA} isDark={isDark} />
          </Marquee>
        </div>
        <div className="[mask-image:var(--mask)]">
          <Marquee speed={90} reverse pauseOnHover>
            <PartnerRow partners={rowB} isDark={isDark} />
          </Marquee>
        </div>
      </div>

      <Container>
        <p
          className={cn(
            "mx-auto mt-[var(--space-10)] max-w-[56ch] text-center text-[length:var(--text-sm)] leading-relaxed",
            isDark
              ? "text-[#D7CDBE]"
              : "text-[color:var(--color-ink-muted)]",
          )}
        >
          Partnerships announced as agreements are signed. Want to host a
          Siligurievent celebration at your venue?{" "}
          <Link
            href="/contact"
            className={cn(
              "underline decoration-[color:var(--color-gold)] decoration-1 underline-offset-4 transition-colors",
              isDark
                ? "text-[#F5EDE0] hover:text-[color:var(--color-gold)]"
                : "text-[color:var(--color-ink)] hover:text-[color:var(--color-accent)]",
            )}
          >
            Get in touch <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Row + slot helpers
// ---------------------------------------------------------------------------

function PartnerRow({
  partners,
  isDark,
}: {
  partners: ReadonlyArray<Partner>;
  isDark: boolean;
}): React.ReactElement {
  return (
    <div className="flex shrink-0 items-center">
      {partners.map((p, idx) => (
        <PartnerSlot
          key={`${p.slug}-${idx}`}
          partner={p}
          isDark={isDark}
        />
      ))}
    </div>
  );
}

function PartnerSlot({
  partner,
  isDark,
}: {
  partner: Partner;
  isDark: boolean;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "group/slot flex shrink-0 flex-col items-center justify-center",
        "px-[var(--space-10)] py-[var(--space-4)]",
        "min-w-[260px] md:min-w-[300px]",
      )}
    >
      <Hairline isDark={isDark} />
      <div className="flex h-20 items-center justify-center md:h-24">
        {partner.logoUrl ? (
          <LicensedLogo partner={partner} />
        ) : (
          <TypesetWordmark partner={partner} isDark={isDark} />
        )}
      </div>
      <TierAndLocation partner={partner} isDark={isDark} />
      <Hairline isDark={isDark} />
    </div>
  );
}

/**
 * Brass-tone hairline divider used above and below every wordmark slot.
 * 1px line with a soft fade at each end — visually editorial.
 */
function Hairline({ isDark }: { isDark: boolean }): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-px w-24",
        "bg-gradient-to-r from-transparent via-current to-transparent",
        isDark
          ? "text-[color:var(--color-gold)] opacity-50"
          : "text-[color:var(--color-gold)] opacity-60",
      )}
    />
  );
}

/**
 * Typeset wordmark placeholder. This is editorial use of the venue's name
 * in our house typography — NOT a reproduction of the venue's trademarked
 * logo artwork. Renders until `partner.logoUrl` is supplied.
 */
function TypesetWordmark({
  partner,
  isDark,
}: {
  partner: Partner;
  isDark: boolean;
}): React.ReactElement {
  const label = partner.shortName ?? partner.name;
  return (
    <span
      className={cn(
        "font-display italic leading-none tracking-[var(--tracking-display)]",
        "text-[length:var(--text-2xl)] md:text-[length:var(--text-3xl)]",
        "text-balance text-center",
        isDark
          ? "text-[#F5EDE0]"
          : "text-[color:var(--color-ink)]",
      )}
    >
      {label}
    </span>
  );
}

/**
 * Future state: a licensed, permission-backed logo asset.
 * Only rendered when `partner.logoUrl` is supplied — the data layer is the
 * gatekeeper, not this component.
 */
function LicensedLogo({ partner }: { partner: Partner }): React.ReactElement {
  return (
    <Image
      src={partner.logoUrl as string}
      alt={`${partner.name} logo`}
      width={180}
      height={64}
      sizes="(min-width: 768px) 180px, 140px"
      className="h-12 w-auto object-contain md:h-14"
    />
  );
}

const TIER_LABEL: Record<PartnerTier, string> = {
  luxury: "Luxury",
  premium: "Premium",
  boutique: "Boutique",
  heritage: "Heritage",
};

function TierAndLocation({
  partner,
  isDark,
}: {
  partner: Partner;
  isDark: boolean;
}): React.ReactElement {
  return (
    <span
      className={cn(
        "mt-[var(--space-2)] mb-[var(--space-2)] flex items-center gap-[var(--space-2)]",
        "text-[length:var(--text-xs)] uppercase",
        "tracking-[var(--tracking-eyebrow)]",
        isDark
          ? "text-[#B8AC99]"
          : "text-[color:var(--color-ink-soft)]",
      )}
    >
      <span>{TIER_LABEL[partner.tier]}</span>
      <span aria-hidden="true" className="opacity-50">
        &middot;
      </span>
      <span>{partner.location}</span>
    </span>
  );
}
