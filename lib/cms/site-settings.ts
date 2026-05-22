/**
 * Single source of truth for owner-supplied contact / brand details.
 *
 * Reads from environment variables (with sensible launch defaults) so the
 * owner can update phone / WhatsApp / email / address without a code change
 * once Payload lands. Until then, set these in `.env.local` or Vercel env.
 */

export interface SiteSettings {
  /** Display phone, formatted (e.g. "+91 98765 43210"). */
  phoneDisplay: string;
  /** E.164 phone for `tel:` href (e.g. "+919876543210"). */
  phoneTel: string;
  /** wa.me path (digits only, no leading + e.g. "919876543210"). */
  whatsappNumber: string;
  /** Public contact email. */
  email: string;
  /** Studio address — single line for footer/schema. */
  addressLine: string;
  /** Locality (city). */
  addressCity: string;
  /** Region (state). */
  addressRegion: string;
  /** Postal code. */
  addressPostalCode: string;
  /** Country code (ISO 3166-1 alpha-2). */
  addressCountry: string;
  /** Founder / owner name — used in JSON-LD `founder`. */
  founderName: string;
  /** Studio opening-hours summary (used in `OpeningHoursSpecification`). */
  openingHours: string;
}

const DEFAULTS: SiteSettings = {
  phoneDisplay: "+91 98320 12345",
  phoneTel: "+919832012345",
  whatsappNumber: "919832012345",
  email: "hello@siligurievent.com",
  addressLine: "Sevoke Road",
  addressCity: "Siliguri",
  addressRegion: "West Bengal",
  addressPostalCode: "734001",
  addressCountry: "IN",
  founderName: "Arup Roy",
  openingHours: "Mo-Sa 10:00-19:00",
};

export function getSiteSettings(): SiteSettings {
  return {
    phoneDisplay: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY ?? DEFAULTS.phoneDisplay,
    phoneTel: process.env.NEXT_PUBLIC_SITE_PHONE_TEL ?? DEFAULTS.phoneTel,
    whatsappNumber: process.env.NEXT_PUBLIC_SITE_WHATSAPP ?? DEFAULTS.whatsappNumber,
    email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? DEFAULTS.email,
    addressLine: process.env.NEXT_PUBLIC_SITE_ADDRESS_LINE ?? DEFAULTS.addressLine,
    addressCity: process.env.NEXT_PUBLIC_SITE_ADDRESS_CITY ?? DEFAULTS.addressCity,
    addressRegion: process.env.NEXT_PUBLIC_SITE_ADDRESS_REGION ?? DEFAULTS.addressRegion,
    addressPostalCode: process.env.NEXT_PUBLIC_SITE_ADDRESS_POSTAL ?? DEFAULTS.addressPostalCode,
    addressCountry: process.env.NEXT_PUBLIC_SITE_ADDRESS_COUNTRY ?? DEFAULTS.addressCountry,
    founderName: process.env.NEXT_PUBLIC_SITE_FOUNDER ?? DEFAULTS.founderName,
    openingHours: process.env.NEXT_PUBLIC_SITE_HOURS ?? DEFAULTS.openingHours,
  };
}

export function getWhatsAppHref(prefilledMessage?: string): string {
  const settings = getSiteSettings();
  const base = `https://wa.me/${settings.whatsappNumber}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}
