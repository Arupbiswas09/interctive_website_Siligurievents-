import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumb, jsonLdScript } from "@/lib/seo/schemas";
import { Container } from "@/components/ui/container";
import { LegalHero } from "@/components/marketing/sections/legal-v2/legal-hero";
import { LegalSummaryCard } from "@/components/marketing/sections/legal-v2/legal-summary-card";
import {
  LegalArticle,
  type LegalChapter,
} from "@/components/marketing/sections/legal-v2/legal-article";
import { LegalCtaCloser } from "@/components/marketing/sections/legal-v2/legal-cta-closer";

/**
 * /privacy — Privacy policy.
 *
 * Editorial v2 treatment. Hero, TL;DR card, 12-col chapter article with
 * sticky chapter TOC, themed closer. Indian English copy.
 */

const LAST_UPDATED = "2025-04-12";

const PRIVACY_TL_DR: ReadonlyArray<string> = [
  "We never sell your data. Ever.",
  "We store your inquiry only until your event is delivered, then archive it.",
  "We use analytics that anonymise IPs.",
  "If you'd like your data deleted, email hello@siligurievent.com — we do it in 7 days.",
];

const PRIVACY_CHAPTERS: ReadonlyArray<LegalChapter> = [
  {
    id: "what-we-collect",
    title: "What we collect",
    body: [
      "When you submit an inquiry — name, email, phone, date of event, city, guest count, and anything you choose to share in the message. When you visit the site — anonymised analytics on which pages you read.",
      "We do not place tracking pixels for advertisers. We use one analytics provider (Vercel) and one email service (Resend, for inquiry replies).",
    ],
  },
  {
    id: "why-we-collect",
    title: "Why we collect it",
    body: [
      "To reply to your inquiry. To help us write better content (what pages get read).",
      {
        kind: "pullquote",
        text: "Nothing else.",
      },
    ],
  },
  {
    id: "how-we-store-it",
    title: "How we store it",
    body: [
      "Inquiry data is stored in a private database for the duration of the event planning + 60 days after delivery. After that it is archived in encrypted cold storage for 7 years (Indian tax + business compliance), then permanently deleted.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: [
      "You can ask us what data we hold about you, correct it, or have it deleted. Email hello@siligurievent.com and we'll respond in 7 days.",
      "If you're in the EU or California, the equivalent regulations apply — same response time.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies + analytics",
    body: [
      "We use one functional cookie (theme preference) and one analytics tool (Vercel Analytics) that anonymises IP addresses. No third-party ad tracking.",
      "You can disable cookies in your browser without losing site functionality.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      "Privacy questions: hello@siligurievent.com",
      "Postal: Siliguri Event Studio, Hill Cart Road, Siliguri, West Bengal 734001",
    ],
  },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Privacy policy",
    description:
      "How Siliguri Event Studio collects, uses, and protects your personal data — written in plain English.",
    path: "/privacy",
    locale: "en",
  });
}

export default function PrivacyPage(): React.ReactElement {
  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Privacy", path: "/privacy" },
  ]);

  return (
    <>
      {jsonLdScript(breadcrumbSchema)}

      <LegalHero
        title="Privacy policy"
        subtitle="How we handle the things you share with us — written in plain English, not legalese."
        lastUpdated={LAST_UPDATED}
      />

      <section
        aria-label="Privacy policy contents"
        className="bg-[color:var(--color-bg)] py-[clamp(48px,8vh,120px)]"
      >
        <Container>
          <LegalSummaryCard items={PRIVACY_TL_DR} />
          <LegalArticle chapters={PRIVACY_CHAPTERS} />
        </Container>
      </section>

      <LegalCtaCloser />
    </>
  );
}
