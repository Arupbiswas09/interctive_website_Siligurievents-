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
 * /terms — Terms of service.
 *
 * Editorial v2 treatment. Hero, TL;DR card, 12-col chapter article with
 * sticky chapter TOC, themed closer. Indian English copy.
 */

const LAST_UPDATED = "2025-04-12";

const TERMS_TL_DR: ReadonlyArray<string> = [
  "Bookings are confirmed when 30% deposit is paid.",
  "Cancellations more than 60 days before: 80% refund. 30-60 days: 50%. Less than 30: no refund.",
  "We retain creative credit on all photographs.",
  "Force majeure (weather, govt directives) — we reschedule once free of charge.",
];

const TERMS_CHAPTERS: ReadonlyArray<LegalChapter> = [
  {
    id: "scope",
    title: "Scope",
    body: [
      "These terms govern the event design + production services delivered by Siliguri Event Studio LLP to the client named in the service agreement.",
      "Any deviation must be in writing, signed by both parties.",
    ],
  },
  {
    id: "booking-payment",
    title: "Booking and payment",
    body: [
      "A 30% deposit confirms the booking. The remaining balance is split 50% on production start and 20% on event delivery.",
      "Payments accepted via UPI, NEFT, or cheque payable to Siliguri Event Studio LLP.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation and rescheduling",
    body: [
      "More than 60 days notice — 80% refund of deposit. 30-60 days — 50% refund. Less than 30 days — no refund.",
      "Rescheduling once is included free of charge, subject to availability on the new date.",
    ],
  },
  {
    id: "deliverables",
    title: "Deliverables",
    body: [
      "The decor, lighting, florals, and on-site coordination specified in the signed scope of work.",
      "Hero photographs (14 minimum), process documentation (200 minimum), and a 60-second film cut — delivered within 30 days of the event.",
    ],
  },
  {
    id: "ip-credit",
    title: "Intellectual property and credit",
    body: [
      "The decor design, photography, and film are the studio's intellectual property. Clients receive unlimited personal-use rights.",
      {
        kind: "pullquote",
        text: "Commercial use (publications, brand campaigns) requires a written license. Photo credit on any social/PR usage is required.",
      },
    ],
  },
  {
    id: "force-majeure",
    title: "Force majeure",
    body: [
      "Cancellation or postponement due to weather, government directives, or acts beyond reasonable control entitles the client to one free reschedule.",
      "If the event cannot be rescheduled within 12 months, 50% of total fees are refunded.",
    ],
  },
  {
    id: "limit-of-liability",
    title: "Limit of liability",
    body: [
      "Our maximum liability for any claim is the total fees paid for the event in question.",
      "We carry public-liability insurance up to ₹50 lakh.",
    ],
  },
  {
    id: "law-jurisdiction",
    title: "Law and jurisdiction",
    body: [
      "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Siliguri, West Bengal.",
    ],
  },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Terms of service",
    description:
      "The terms governing event design and production services delivered by Siliguri Event Studio.",
    path: "/terms",
    locale: "en",
  });
}

export default function TermsPage(): React.ReactElement {
  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Terms", path: "/terms" },
  ]);

  return (
    <>
      {jsonLdScript(breadcrumbSchema)}

      <LegalHero
        title="Terms of service"
        subtitle="The working agreement between you and the studio — clear, fair, and written in plain English."
        lastUpdated={LAST_UPDATED}
      />

      <section
        aria-label="Terms of service contents"
        className="bg-[color:var(--color-bg)] py-[clamp(48px,8vh,120px)]"
      >
        <Container>
          <LegalSummaryCard items={TERMS_TL_DR} />
          <LegalArticle chapters={TERMS_CHAPTERS} />
        </Container>
      </section>

      <LegalCtaCloser />
    </>
  );
}
