import { Mail, MapPin, Phone, Clock, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";

/**
 * Contact — Studio block.
 * Per docs/05-PAGE-SPECS.md §5.10 §4 + §5.
 *
 * Static map image placeholder (real Mapbox / Google static map wired in
 * Sprint 4 once owner provides exact pin and Mapbox key). Owner-supplied
 * address, hours, parking note.
 */

// TODO (Sprint 4): source from CMS SiteSettings.
const STUDIO = {
  addressLines: [
    "TODO — Studio address line 1",
    "Sevoke Road, Siliguri",
    "West Bengal 734001",
  ],
  hours: [
    { day: "Mon – Sat", time: "9 AM – 9 PM IST" },
    { day: "Sunday", time: "By appointment" },
  ],
  phone: "+91 XXXXX XXXXX",
  email: "hello@siligurievent.com",
  parking: "Visitor parking available on-site. Wheelchair accessible.",
};

export function ContactStudio(): React.ReactElement {
  return (
    <Section
      tone="elevated"
      spacing="lg"
      id="studio"
      aria-labelledby="studio-heading"
    >
      <Container>
        <div className="mb-[var(--space-10)] flex max-w-[60ch] flex-col gap-[var(--space-3)]">
          <Eyebrow>Studio</Eyebrow>
          <DisplayHeading
            as="h2"
            size="lg"
            text="Find us on Sevoke Road."
            className="text-balance"
          />
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-12)]">
          {/* Map placeholder ─────────────────────────────────────────── */}
          <div className="md:col-span-7">
            <div
              className={cn(
                "relative aspect-[4/3] w-full overflow-hidden",
                "rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
                "bg-[color:var(--color-bg)]",
              )}
            >
              {/* biome-ignore lint/a11y/useAltText: decorative placeholder backdrop */}
              <img
                src="/images/map-placeholder.svg"
                alt="Static map of Siligurievent studio on Sevoke Road, Siliguri"
                width={1200}
                height={900}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                // TODO (Sprint 4): replace with /api/static-map?lat=…&lng=…
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(184,137,58,0.10) 0%, transparent 60%)",
                }}
              />
              <div className="absolute bottom-[var(--space-4)] left-[var(--space-4)] flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]/95 px-[var(--space-3)] py-[var(--space-2)] backdrop-blur">
                <MapPin
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="h-4 w-4 text-[color:var(--color-accent)]"
                />
                <span className="text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]">
                  Sevoke Road, Siliguri
                </span>
              </div>
            </div>
          </div>

          {/* Address + hours + parking ──────────────────────────────── */}
          <div className="flex flex-col gap-[var(--space-8)] md:col-span-5">
            <div className="flex items-start gap-[var(--space-4)]">
              <MapPin
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-[2px] h-5 w-5 shrink-0 text-[color:var(--color-accent)]"
              />
              <address className="not-italic">
                {STUDIO.addressLines.map((line) => (
                  <span key={line} className="block leading-relaxed">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="flex items-start gap-[var(--space-4)]">
              <Clock
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-[2px] h-5 w-5 shrink-0 text-[color:var(--color-accent)]"
              />
              <dl className="grid grid-cols-[max-content_1fr] gap-x-[var(--space-6)] gap-y-[var(--space-1)]">
                {STUDIO.hours.map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
                      {h.day}
                    </dt>
                    <dd className="text-[length:var(--text-sm)] text-[color:var(--color-ink)]">
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex items-start gap-[var(--space-4)]">
              <Phone
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-[2px] h-5 w-5 shrink-0 text-[color:var(--color-accent)]"
              />
              <a
                href={`tel:${STUDIO.phone.replace(/\s/g, "")}`}
                className="text-[length:var(--text-base)] tracking-[var(--tracking-tight)] hover:text-[color:var(--color-accent)]"
              >
                {STUDIO.phone}
              </a>
            </div>

            <div className="flex items-start gap-[var(--space-4)]">
              <Mail
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-[2px] h-5 w-5 shrink-0 text-[color:var(--color-accent)]"
              />
              <a
                href={`mailto:${STUDIO.email}`}
                className="text-[length:var(--text-base)] tracking-[var(--tracking-tight)] hover:text-[color:var(--color-accent)]"
              >
                {STUDIO.email}
              </a>
            </div>

            <div className="flex items-start gap-[var(--space-4)] border-t border-[color:var(--color-border)] pt-[var(--space-6)]">
              <Car
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-[2px] h-5 w-5 shrink-0 text-[color:var(--color-ink-soft)]"
              />
              <p className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
                {STUDIO.parking}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
