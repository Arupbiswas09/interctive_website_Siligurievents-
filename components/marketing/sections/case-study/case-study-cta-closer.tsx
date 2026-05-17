/**
 * Case study — CTA closer.
 *
 * Inverse-palette (dark) closing CTA. Uses the existing `CtaCloser`
 * primitive so the call-site is a thin wrapper with the right copy and
 * routing. Server Component.
 */

import type { ReactElement } from "react";
import { CtaCloser } from "@/components/marketing/sections/cta-closer";

export function CaseStudyCtaCloser(): ReactElement {
  return (
    <CtaCloser
      eyebrow="Your story next"
      headline="Make us your next case study."
      subline="Tell us the date, the place, and a feeling — we'll write the rest."
      primaryCta={{ label: "Start a brief", href: "/contact" }}
      secondaryCta={{ label: "See more work", href: "/portfolio" }}
      tone="dark"
    />
  );
}
