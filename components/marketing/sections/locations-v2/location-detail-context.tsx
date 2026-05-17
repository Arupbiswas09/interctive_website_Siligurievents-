/**
 * LocationDetailContext — "About the area" editorial block.
 *
 * 4 paragraphs covering climate, typical venues, transit and a small note
 * on local-style decor. Falls back to a sensible default when the location
 * data only has a tagline + venues. Server component.
 */

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Location } from "@/lib/cms/locations";

type LocationDetailContextProps = {
  location: Location;
};

function buildClimateNote(slug: string): string {
  switch (slug) {
    case "siliguri":
    case "bagdogra":
    case "jalpaiguri":
      return "October to March is the dry season — clear evenings, cool nights, every lawn and rooftop available. Avoid mid-May to September unless we are working indoors; the pre-monsoon storms move fast.";
    case "darjeeling":
    case "kalimpong":
      return "September to early December and mid-March to May read best — mountain visibility, gentle light, no fog. Pack an indoor backup for any outdoor mandap above 1,500 m; weather turns inside an hour.";
    case "gangtok":
      return "Late September to mid-November is the cleanest window — post-monsoon, pre-winter. December weddings work but heating becomes a real line item. We never schedule outdoor receptions past 7 PM in winter.";
    case "dooars":
      return "Tea-garden weddings work November to February. Forest reserves close to events during monsoon. Generator power and night lighting are planned at design time, never improvised on the day.";
    default:
      return "We design around the season the way we design around the venue — palette, light, fabric weight all shift with the calendar.";
  }
}

function buildTransitNote(slug: string, distanceKm: number): string {
  if (slug === "siliguri") {
    return "We are based here. Warehouse, mandap workshop and floral coldroom are all inside the city — short build times, late-night last-minute changes, tighter cost control than anyone shipping in from outside.";
  }
  if (slug === "bagdogra") {
    return "Bagdogra is the airport town for the entire region. Most guests arrive here and drive on; we build around easy pickups and 20-minute resort transfers.";
  }
  return `${distanceKm} km from our Siliguri warehouse. We typically ship structures in two waves — a base build the day before, and a finishing crew on the morning of the event.`;
}

function buildVenueNote(location: Location): string {
  const sample = location.venues.slice(0, 3).map((v) => v.name);
  if (sample.length === 0) {
    return "We have a small portfolio of trusted venues across the city — hotels, banquet halls and a few outdoor lawns. Tell us where you are looking and we will tell you what works.";
  }
  return `We know venues like ${sample.join(", ")} the way we know our own warehouse — power points, sight lines, kitchen capacity, parking flow. The first site visit usually skips the 30 minutes everyone else needs to find the bathroom.`;
}

function buildOpener(location: Location): string {
  const yearCount = location.slug === "siliguri" ? "eight years" : "several seasons";
  return `${location.name} has been part of our regular calendar for ${yearCount}. Each city in this belt has its own wedding culture, its own pace, and its own visual register — we design accordingly.`;
}

export function LocationDetailContext({
  location,
}: LocationDetailContextProps): React.ReactElement {
  const paragraphs: ReadonlyArray<{ title: string; body: string }> = [
    { title: "The city", body: buildOpener(location) },
    { title: "Climate & timing", body: buildClimateNote(location.slug) },
    {
      title: "Venues we know",
      body: buildVenueNote(location),
    },
    {
      title: "Logistics",
      body: buildTransitNote(location.slug, location.distanceFromSiliguriKm),
    },
  ];

  return (
    <Section tone="elevated" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-10)] lg:grid-cols-12 lg:gap-[var(--space-12)]">
          <header className="flex flex-col gap-[var(--space-4)] lg:col-span-4">
            <Eyebrow tone="gold">About the area</Eyebrow>
            <DisplayHeading
              as="h2"
              size="lg"
              text={`Designing in ${location.name}`}
              className="italic"
            />
            <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
              A short brief on the city — climate, venues, transit. Read this
              before the first phone call; it saves us both half an hour.
            </p>
          </header>

          <div className="lg:col-span-8">
            <ol className="flex flex-col gap-[var(--space-8)]">
              {paragraphs.map((p, idx) => (
                <RevealOnScroll
                  key={p.title}
                  delay={idx * 0.05}
                  as="li"
                  className="grid grid-cols-[auto_1fr] gap-[var(--space-5)] border-t border-[color:var(--color-border)] pt-[var(--space-6)]"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[length:var(--text-2xl)] italic leading-none text-[color:var(--color-gold)]"
                  >
                    0{idx + 1}
                  </span>
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <h3 className="font-display text-[length:var(--text-2xl)] italic tracking-[var(--tracking-display)] text-[color:var(--color-ink)]">
                      {p.title}
                    </h3>
                    <p className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
                      {p.body}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
