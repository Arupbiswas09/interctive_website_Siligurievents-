import type { Metadata } from "next";
import { ContactHeroEditorial } from "@/components/marketing/sections/contact-v2/contact-hero-editorial";
import { ContactPromiseStrip } from "@/components/marketing/sections/contact-v2/contact-promise-strip";
import { ContactFormCard } from "@/components/marketing/sections/contact-v2/contact-form-card";
import { ContactChannels } from "@/components/marketing/sections/contact-v2/contact-channels";
import { ContactStudioLocation } from "@/components/marketing/sections/contact-v2/contact-studio-location";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  buildLocalBusiness,
  jsonLdScript,
  SITE_URL,
} from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Contact — let's plan something",
    description:
      "Plan your wedding, reception, sangeet or corporate event with Siligurievent. WhatsApp, phone, email or our inquiry form. Reply within 24 hours.",
    path: "/contact",
    locale: "en",
    keywords: [
      "contact event decorator Siliguri",
      "Siligurievent inquiry",
      "wedding decorator North Bengal contact",
      "plan event Siliguri",
    ],
  });
}

// TODO (Sprint 4): source from CMS SiteSettings.
const SITE_SETTINGS = {
  businessName: "Siligurievent",
  tagline:
    "Cinematic event decorators in Siliguri, North Bengal — weddings, receptions, sangeet, haldi, corporate, pujas.",
  phone: "+91 XXXXX XXXXX",
  email: "hello@siligurievent.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+91XXXXXXXXXX",
  addressLine1: "Hill Cart Road",
  addressLine2: "Siliguri",
  city: "Siliguri",
  state: "WB",
  pincode: "734001",
  country: "IN",
  openingHours: [
    { day: "Monday", open: "11:00", close: "19:00" },
    { day: "Tuesday", open: "11:00", close: "19:00" },
    { day: "Wednesday", open: "11:00", close: "19:00" },
    { day: "Thursday", open: "11:00", close: "19:00" },
    { day: "Friday", open: "11:00", close: "19:00" },
    { day: "Saturday", open: "11:00", close: "19:00" },
    { day: "Sunday", open: "10:00", close: "18:00" },
  ],
} as const;

/**
 * Minimal ContactPage schema builder — lives here until we promote it to
 * `lib/seo/schemas.ts`. Per docs/07-SEO-IMPL.md §7.6.
 */
function buildContactPageSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contactpage`,
    url: `${SITE_URL}/contact`,
    name: "Contact Siligurievent",
    description:
      "Plan your event with Siligurievent. WhatsApp, phone, email or the inquiry form.",
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}#website` },
    mainEntity: { "@id": `${SITE_URL}#localbusiness` },
  };
}

export default async function ContactPage(): Promise<React.ReactElement> {
  const localBusiness = buildLocalBusiness(SITE_SETTINGS);
  const contactPage = buildContactPageSchema();
  const breadcrumb = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <>
      {jsonLdScript(contactPage)}
      {jsonLdScript(localBusiness)}
      {jsonLdScript(breadcrumb)}

      <main id="main" className="relative">
        <ContactHeroEditorial />
        <ContactPromiseStrip />
        <ContactFormCard />
        <ContactChannels />
        <ContactStudioLocation />
      </main>
    </>
  );
}
