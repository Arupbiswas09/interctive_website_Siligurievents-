/**
 * ServicesHubCtaCloser — closing CTA for /services.
 *
 * Inverse palette (ink background, warm cream text). Italic display
 * headline, two CTAs: WhatsApp and Inquire. Reuses the shared CtaCloser
 * shell so the visual rhythm matches every other page.
 */

import { CtaCloser } from "@/components/marketing/sections/cta-closer";
import { getWhatsAppHref } from "@/lib/cms/site-settings";

export function ServicesHubCtaCloser(): React.ReactElement {
  const whatsappHref = getWhatsAppHref(
    "Hi Siliguri Event, I would like to plan an event. Could you share some options?",
  );
  return (
    <CtaCloser
      tone="dark"
      eyebrow="Ready when you are"
      headline="Tell us the date. We'll design the rest."
      subline="A WhatsApp message reaches us inside an hour. A full inquiry — moodboard, palette and a phone call — usually inside two days."
      primaryCta={{ label: "Inquire", href: "/contact" }}
      secondaryCta={{ label: "WhatsApp us", href: whatsappHref }}
    />
  );
}
