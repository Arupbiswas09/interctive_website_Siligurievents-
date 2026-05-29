import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/marketing/footer";
import { StickyWhatsApp } from "@/components/marketing/sticky-whatsapp";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { ButtonStyles } from "@/components/ui/button";
import { NotFoundContent } from "@/components/marketing/sections/not-found-content";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/cms/site-settings";

/**
 * Global 404 — branded, full viewport.
 *
 * Spec: docs/05-PAGE-SPECS.md §5.12.
 * Motion: MO-11 JasminePetalFall — petal anchor lives on a `[data-petal]`
 * div inside `<NotFoundContent>`. Animation is bound via motion primitives
 * client-side; reduced motion shows a single static decorative bloom.
 *
 * Chrome: this file lives at `app/not-found.tsx` (Next.js requires the
 * root not-found at the root) so it does NOT inherit `app/(site)/layout.tsx`.
 * We render a minimal inline chrome (slim logo-only header + Footer +
 * StickyWhatsApp) instead of pulling in Lenis/full Header on a 404.
 *
 * SEO: noindex/nofollow (404 should not be crawled as a real destination).
 */

export const metadata: Metadata = buildNoIndexMetadata("404 — Page eloped");

const WHATSAPP_HREF = getWhatsAppHref(
  "Hi Siligurievent — I landed on a 404.",
);

export default function NotFound(): React.ReactElement {
  return (
    <>
      <ButtonStyles />
      <SkipToContent />

      {/* Minimal header: logo only, no nav. Keeps the page anchored to brand. */}
      <header
        aria-label="Siligurievent"
        className="relative z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]/85 backdrop-blur-md"
      >
        <Container>
          <div className="flex h-[72px] items-center md:h-[88px]">
            <Link
              href="/"
              aria-label="Siligurievent — home"
              className="font-display italic text-[length:var(--text-xl)] tracking-[-0.02em]"
            >
              Siligurievent
            </Link>
          </div>
        </Container>
      </header>

      <main id="main" className="relative">
        <NotFoundContent whatsappHref={WHATSAPP_HREF} />
      </main>

      <Footer />
      <StickyWhatsApp />
    </>
  );
}
