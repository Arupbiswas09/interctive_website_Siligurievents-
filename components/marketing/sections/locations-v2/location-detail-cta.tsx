/**
 * LocationDetailCta — inverse-palette CTA closer for /locations/[slug].
 *
 * Headline is per-city: "Plan your event in {City}.". Wraps the shared
 * CtaCloser so visual rhythm matches every other page.
 */

import { CtaCloser } from "@/components/marketing/sections/cta-closer";
import type { Location } from "@/lib/cms/locations";
import { getWhatsAppHref } from "@/lib/cms/site-settings";

function whatsappHref(city: string): string {
  return getWhatsAppHref(
    `Hi Siliguri Event, I would like to plan an event in ${city}. Could you share some options?`,
  );
}

type LocationDetailCtaProps = {
  location: Location;
};

export function LocationDetailCta({
  location,
}: LocationDetailCtaProps): React.ReactElement {
  return (
    <CtaCloser
      tone="dark"
      eyebrow={`Planning in ${location.shortName}?`}
      headline={`Plan your event in ${location.name}.`}
      subline={`A WhatsApp note reaches us inside an hour. We design and stage events across ${location.region} every week.`}
      primaryCta={{ label: "Inquire", href: "/contact" }}
      secondaryCta={{
        label: "WhatsApp us",
        href: whatsappHref(location.name),
      }}
    />
  );
}
