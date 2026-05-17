"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { FaqEntry } from "@/lib/cms/services";

type ServiceFaqsProps = {
  faqs: ReadonlyArray<FaqEntry>;
  /** Optional override headline. */
  headline?: string;
};

/**
 * Service detail — FAQ accordion.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.4 §6.
 * A11y: native `<button aria-expanded>` per WAI-ARIA APG accordion pattern.
 * Motion: max-height + opacity transitions (CSS only — survives reduced motion
 * cleanly because Tailwind transitions collapse to ~0ms under the global rule).
 *
 * Note: We use Tailwind transitions instead of GSAP here so this section
 * remains tiny and accessible without paying for ScrollTrigger.
 */
export function ServiceFaqs({
  faqs,
  headline = "Frequently asked.",
}: ServiceFaqsProps): React.ReactElement | null {
  if (faqs.length === 0) return null;

  return (
    <Section tone="default" spacing="lg" id="faqs">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12">
          <RevealOnScroll className="md:col-span-4">
            <div className="flex flex-col gap-[var(--space-4)] md:sticky md:top-[120px]">
              <Eyebrow tone="muted">FAQs</Eyebrow>
              <DisplayHeading as="h2" size="lg" text={headline} />
              <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                {/* TODO: localised intro copy. */}
                Can't find your question here? WhatsApp us — we usually reply
                within an hour, 9 AM to 9 PM IST.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="md:col-span-7 md:col-start-6" delay={0.15}>
            <ul className="flex flex-col border-t border-[color:var(--color-border)]">
              {faqs.map((faq, idx) => (
                <FaqItem key={faq.question} faq={faq} index={idx} />
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}

function FaqItem({
  faq,
  index,
}: {
  faq: FaqEntry;
  index: number;
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const headingId = useId();
  const panelId = useId();

  return (
    <li className="border-b border-[color:var(--color-border)]">
      <h3 className="m-0">
        <button
          type="button"
          id={headingId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group flex w-full items-start justify-between gap-[var(--space-6)]",
            "py-[var(--space-6)]",
            "text-left",
            "cursor-pointer select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
          )}
        >
          <span className="flex flex-1 items-baseline gap-[var(--space-4)]">
            <span className="font-display text-[length:var(--text-sm)] text-[color:var(--color-gold)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-[length:var(--text-xl)] leading-[1.2] text-[color:var(--color-ink)]">
              {faq.question}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "mt-[6px] inline-flex h-6 w-6 shrink-0 items-center justify-center",
              "text-[color:var(--color-ink-muted)]",
              "transition-transform duration-300",
              open ? "rotate-45" : "rotate-0",
            )}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14" strokeLinecap="round" />
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div
          className={cn(
            "overflow-hidden",
            // Prevent focus trapping inside collapsed content.
            open ? "visible" : "invisible",
          )}
        >
          <p className="pb-[var(--space-6)] pl-[calc(var(--space-4)+1.5rem)] pr-[var(--space-6)] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
            {faq.answer}
          </p>
        </div>
      </div>
    </li>
  );
}
