/**
 * LegalCtaCloser — quiet themed closer at the foot of a legal page.
 *
 * "Questions about this? → Email the studio." A small mandala glyph
 * sits beside the headline; the email link is styled as a gold
 * underline-on-hover link with an arrow. Pure Server Component.
 */

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";

const STUDIO_EMAIL = "hello@silsigurievent.com";
const CONTACT_HREF = "/contact";

type LegalCtaCloserProps = {
  /** Optional override for the headline. */
  headline?: string;
  /** Optional override for the helper subtitle. */
  subtitle?: string;
};

export function LegalCtaCloser({
  headline = "Questions about this?",
  subtitle = "Write to the studio — we reply on the same day, in plain English.",
}: LegalCtaCloserProps): React.ReactElement {
  return (
    <section
      aria-label="Contact the studio"
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-bg-soft)] py-[clamp(72px,10vh,140px)]"
    >
      {/* Background mandala drift — static, low opacity (no JS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20vmin] top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-y-1/2"
        style={{ opacity: 0.08 }}
      >
        <CeremonyOrnament
          name="mandala"
          hue="var(--color-gold-deep)"
          hueSecondary="var(--color-gold-deep)"
          className="h-full w-full"
        />
      </div>

      <Container>
        <div className="mx-auto flex max-w-[760px] flex-col items-start gap-[var(--space-6)] text-left">
          <span
            className="flex items-center gap-3 font-mono uppercase text-[color:var(--color-gold-deep)]"
            style={{ fontSize: "11px", letterSpacing: "0.32em" }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-px w-10 bg-current opacity-70"
            />
            We're here · ask us
          </span>

          <h2
            className="font-display italic text-[color:var(--color-ink)]"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.012em",
            }}
          >
            {headline}
          </h2>

          <p
            className="max-w-[52ch] font-body text-[color:var(--color-ink-muted)]"
            style={{
              fontSize: "clamp(15px, 1.1vw, 18px)",
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-6)]">
            <Link
              href={`mailto:${STUDIO_EMAIL}`}
              className="group inline-flex items-baseline gap-3 font-body text-[color:var(--color-ink)]"
              style={{ fontSize: "clamp(16px, 1.2vw, 19px)" }}
            >
              <span className="relative">
                Email the studio
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full bg-[color:var(--color-gold)] transition-transform duration-500 ease-out group-hover:scale-x-0 group-hover:origin-right"
                  style={{ transformOrigin: "left" }}
                />
              </span>
              <span
                aria-hidden="true"
                className="text-[color:var(--color-gold)] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href={CONTACT_HREF}
              className="font-mono uppercase text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] transition-colors duration-300"
              style={{ fontSize: "11px", letterSpacing: "0.28em" }}
            >
              Or use the contact form ↗
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
