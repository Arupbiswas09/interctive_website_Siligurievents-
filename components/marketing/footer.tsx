import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Wordmark } from "@/components/brand/wordmark";

// TODO: source from CMS SiteSettings once Sprint 2 lands Payload.
const SITEMAP_LINKS = [
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const LOCATIONS = [
  { label: "Siliguri", href: "/locations/siliguri" },
  { label: "Bagdogra", href: "/locations/bagdogra" },
  { label: "Darjeeling", href: "/locations/darjeeling" },
  { label: "Kalimpong", href: "/locations/kalimpong" },
  { label: "Jalpaiguri", href: "/locations/jalpaiguri" },
  { label: "Gangtok", href: "/locations/gangtok" },
] as const;

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" }, // TODO: real handle
  { label: "YouTube", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "WhatsApp", href: "#" },
] as const;

/**
 * Footer — three-column on desktop, stacked on mobile.
 * Dark theme per docs/04 §4.4.
 */
export function Footer(): React.ReactElement {
  return (
    <footer
      data-theme="dark"
      className="bg-[#0E0B08] text-[#F5EDE0]"
      aria-label="Site footer"
    >
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ backgroundColor: "var(--color-gold, #B8893A)" }}
      />
      <Container>
        <div className="grid grid-cols-1 gap-[var(--space-12)] py-[var(--space-24)] md:grid-cols-3">
          {/* — Studio — */}
          <div className="flex flex-col gap-[var(--space-4)]">
            <Link
              href="/"
              aria-label="Siligurievent — home"
              className="inline-flex"
            >
              <Wordmark
                size="lg"
                tone="cream"
                layout="stacked"
                ariaLabel="Siligurievent — home"
              />
            </Link>
            <p className="max-w-prose text-[length:var(--text-base)] leading-relaxed text-[#B8A992]">
              {/* TODO: tagline from CMS */}
              Cinematic event decoration across Siliguri & North Bengal.
              Designed to be remembered in stills.
            </p>
            <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] text-[length:var(--text-sm)] text-[#B8A992]">
              <li>
                <a
                  href="mailto:hello@siligurievent.com"
                  className="hover:text-[#F5EDE0]"
                >
                  hello@siligurievent.com {/* TODO: real email */}
                </a>
              </li>
              <li>
                <a href="tel:+91XXXXXXXXXX" className="hover:text-[#F5EDE0]">
                  +91 XXXXX XXXXX {/* TODO: real phone */}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F5EDE0]"
                >
                  WhatsApp {/* TODO: real number */}
                </a>
              </li>
            </ul>
          </div>

          {/* — Sitemap — */}
          <div className="flex flex-col gap-[var(--space-4)]">
            <Eyebrow tone="gold">Sitemap</Eyebrow>
            <ul className="grid grid-cols-2 gap-x-[var(--space-6)] gap-y-[var(--space-2)] md:grid-cols-1">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[length:var(--text-base)] text-[#B8A992] hover:text-[#F5EDE0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* — Locations + Social — */}
          <div className="flex flex-col gap-[var(--space-6)]">
            <div className="flex flex-col gap-[var(--space-4)]">
              <Eyebrow tone="gold">Locations</Eyebrow>
              <ul className="grid grid-cols-2 gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
                {LOCATIONS.map((loc) => (
                  <li key={loc.href}>
                    <Link
                      href={loc.href}
                      className="text-[length:var(--text-base)] text-[#B8A992] hover:text-[#F5EDE0]"
                    >
                      {loc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-[var(--space-4)]">
              <Eyebrow tone="gold">Follow</Eyebrow>
              <ul className="flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[length:var(--text-base)] text-[#B8A992] hover:text-[#F5EDE0]"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-2)] border-t border-[#F5EDE014] py-[var(--space-6)] text-[length:var(--text-xs)] text-[#7A6E5E] md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Siligurievent · Designed for
            celebrations across North Bengal.
          </p>
          <div className="flex flex-wrap items-center gap-[var(--space-4)]">
            <Link href="/privacy" className="hover:text-[#F5EDE0]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#F5EDE0]">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <span>Sevoke Road, Siliguri, WB {/* TODO: real address */}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
