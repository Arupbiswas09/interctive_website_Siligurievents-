/**
 * LegalSummaryCard — "TL;DR" card at the top of the article body.
 *
 * Full-width editorial card on `--color-bg-soft` with brass L-shape corner
 * gilts. Each bullet uses a small mandala glyph in place of a list marker
 * for ceremonial texture. Renders as a pure Server Component — no JS.
 */

import type { ReactNode } from "react";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";

type LegalSummaryCardProps = {
  /** 3-4 plain-English bullet points summarising the document. */
  items: ReadonlyArray<string>;
  /** Eyebrow override — defaults to "TL;DR". */
  eyebrow?: string;
  /** Optional title override — defaults to "The short version". */
  title?: string;
};

export function LegalSummaryCard({
  items,
  eyebrow = "TL;DR",
  title = "The short version",
}: LegalSummaryCardProps): React.ReactElement {
  return (
    <aside
      aria-label="Summary of this document"
      className="relative w-full bg-[color:var(--color-bg-soft)] p-[clamp(24px,4vw,56px)]"
      style={{ borderRadius: "2px" }}
    >
      {/* Brass L-shape corners — 4 corners */}
      <BrassCorner className="absolute -left-[2px] -top-[2px] h-10 w-10" />
      <BrassCorner className="absolute -right-[2px] -top-[2px] h-10 w-10 rotate-90" />
      <BrassCorner className="absolute -left-[2px] -bottom-[2px] h-10 w-10 -rotate-90" />
      <BrassCorner className="absolute -right-[2px] -bottom-[2px] h-10 w-10 rotate-180" />

      <header className="flex flex-col gap-[var(--space-2)]">
        <span
          className="font-mono uppercase text-[color:var(--color-gold-deep)]"
          style={{ fontSize: "11px", letterSpacing: "0.32em" }}
        >
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-px w-6 bg-current align-middle opacity-70"
          />
          {eyebrow}
        </span>
        <p
          className="font-display italic text-[color:var(--color-ink)]"
          style={{
            fontSize: "clamp(22px, 2.4vw, 32px)",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>
      </header>

      <ul className="mt-[var(--space-6)] flex flex-col gap-[var(--space-3)]">
        {items.map((item) => (
          <SummaryBullet key={item}>{item}</SummaryBullet>
        ))}
      </ul>
    </aside>
  );
}

function SummaryBullet({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <li className="flex items-start gap-[var(--space-3)]">
      <span
        aria-hidden="true"
        className="mt-[3px] inline-block h-[18px] w-[18px] shrink-0"
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold-deep)"
          hueSecondary="var(--color-gold-deep)"
          className="h-full w-full"
        />
      </span>
      <p
        className="font-body text-[color:var(--color-ink)]"
        style={{
          fontSize: "clamp(15px, 1.05vw, 17px)",
          lineHeight: 1.55,
        }}
      >
        {children}
      </p>
    </li>
  );
}

function BrassCorner({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 20 L2 2 L20 2"
        stroke="var(--color-gold)"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M6 20 L6 6 L20 6"
        stroke="var(--color-gold-deep)"
        strokeWidth="0.8"
        strokeLinecap="square"
        opacity="0.65"
      />
      <circle cx="6" cy="6" r="1.6" fill="var(--color-gold)" />
    </svg>
  );
}
