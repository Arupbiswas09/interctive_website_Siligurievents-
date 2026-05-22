import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactHeroEditorial } from "@/components/marketing/sections/contact-v2/contact-hero-editorial";
import { ContactPromiseStrip } from "@/components/marketing/sections/contact-v2/contact-promise-strip";
import { ContactChannels } from "@/components/marketing/sections/contact-v2/contact-channels";
import { ContactStudioLocation } from "@/components/marketing/sections/contact-v2/contact-studio-location";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumb,
  buildLocalBusiness,
  jsonLdScript,
  SITE_URL,
} from "@/lib/seo/schemas";
import { getSiteSettings } from "@/lib/cms/site-settings";

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
  const settings = getSiteSettings();
  const localBusiness = buildLocalBusiness({
    businessName: "Siligurievent",
    tagline:
      "Cinematic event decorators in Siliguri, North Bengal — weddings, receptions, sangeet, haldi, corporate, pujas.",
    phone: settings.phoneDisplay,
    email: settings.email,
    whatsappNumber: settings.whatsappNumber,
    addressLine1: settings.addressLine,
    city: settings.addressCity,
    state: settings.addressRegion,
    pincode: settings.addressPostalCode,
    country: settings.addressCountry,
    founderName: settings.founderName,
    openingHours: [
      { day: "Monday", open: "10:00", close: "19:00" },
      { day: "Tuesday", open: "10:00", close: "19:00" },
      { day: "Wednesday", open: "10:00", close: "19:00" },
      { day: "Thursday", open: "10:00", close: "19:00" },
      { day: "Friday", open: "10:00", close: "19:00" },
      { day: "Saturday", open: "10:00", close: "19:00" },
      { day: "Sunday", open: "10:00", close: "18:00", closed: false },
    ],
  });
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

      <ContactHeroEditorial />
      <ContactPromiseStrip />
      <Section spacing="lg" id="inquiry">
        <Container>
          <Suspense fallback={null}>
            <InquiryForm sourcePage="/contact" />
          </Suspense>
        </Container>
      </Section>
      <ContactChannels />
      <ContactStudioLocation />
    </>
  );
}
