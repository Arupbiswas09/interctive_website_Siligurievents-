/**
 * Case study — Vendor credits.
 *
 * Two-column layout. LEFT eyebrow "Credits" + heading "The hands behind
 * the room.". RIGHT lists each credit with the role on the left
 * (uppercase eyebrow) and the name on the right (font-display italic).
 * Brass hairline between every row.
 *
 * Pure Server Component — no client-side motion needed.
 */

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";

export interface CaseStudyCredit {
  role: string;
  name: string;
  link?: string;
}

interface CaseStudyVendorCreditsProps {
  credits: ReadonlyArray<CaseStudyCredit>;
}

export function CaseStudyVendorCredits({
  credits,
}: CaseStudyVendorCreditsProps): ReactElement | null {
  if (credits.length === 0) return null;

  return (
    <Section tone="default" spacing="lg" as="section">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12 md:gap-[var(--space-16)]">
          <div className="md:col-span-5">
            <Eyebrow tone="accent">Credits</Eyebrow>
            <h2
              className={cn(
                "mt-[var(--space-6)] font-display italic font-normal text-balance",
                "text-[length:var(--text-3xl)] md:text-[length:var(--text-4xl)]",
                "leading-[1.05] tracking-[var(--tracking-display)]",
                "text-[color:var(--color-ink)]",
              )}
            >
              The hands behind the room.
            </h2>
            <p className="mt-[var(--space-6)] max-w-[40ch] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
              Every chapter is the work of a small crew. Photographers,
              florists, fabricators — listed here with gratitude.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <dl className="flex flex-col">
              {credits.map((credit, idx) => (
                <div
                  key={`${credit.role}-${idx.toString()}`}
                  className={cn(
                    "flex flex-col gap-[var(--space-1)] py-[var(--space-5)]",
                    "md:flex-row md:items-baseline md:justify-between md:gap-[var(--space-8)]",
                    // Brass hairline between rows (top border on each except first via custom border)
                    "border-t border-[color:var(--color-gold)]/35",
                    idx === credits.length - 1 ? "border-b border-[color:var(--color-gold)]/35" : "",
                  )}
                >
                  <dt
                    className={cn(
                      "text-[length:var(--text-xs)] uppercase",
                      "tracking-[var(--tracking-eyebrow)]",
                      "text-[color:var(--color-ink-soft)]",
                    )}
                  >
                    {credit.role}
                  </dt>
                  <dd
                    className={cn(
                      "font-display italic font-normal leading-tight",
                      "text-[length:var(--text-xl)] text-[color:var(--color-ink)]",
                    )}
                  >
                    {credit.link ? (
                      <a
                        href={credit.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 transition-colors hover:text-[color:var(--color-accent)] hover:underline"
                      >
                        {credit.name}
                      </a>
                    ) : (
                      credit.name
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
