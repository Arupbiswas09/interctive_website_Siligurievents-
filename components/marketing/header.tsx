"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";

type NavItem = { label: string; href: string };

// TODO: source from CMS SiteSettings once Sprint 2 lands Payload.
const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SCROLL_SOLIDIFY_PX = 60;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Header — transparent over hero, switches to a blurred ivory translucent
 * panel after 60px scroll (per docs/04 §4.3).
 *
 * Polish (Sprint 1 chrome pass):
 *  • Active route highlighting via `usePathname()` — underline + accent.
 *  • Refined italic wordmark (font-display italic + tight tracking).
 *  • Mobile menu is a full-screen overlay with staggered link reveal.
 *  • Tiny pulsing brass dot next to "Plan my event" to draw the eye.
 */
export function Header(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > SCROLL_SOLIDIFY_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return (): void => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change so navigation feels instantaneous.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }
    return (): void => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <header
      data-scrolled={scrolled}
      style={
        scrolled
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--color-bg) 78%, transparent)",
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
            }
          : undefined
      }
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-b border-[color:var(--color-border)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-[64px] items-center justify-between md:h-[84px]">
          <Link
            href="/"
            aria-label="Siliguri Event — home"
            className="inline-flex items-center gap-3"
          >
            <img
              src="/images/logo-emblem-a.webp"
              alt=""
              aria-hidden="true"
              className="h-8 w-auto object-contain md:h-11"
            />
            <span className="flex flex-col leading-none">
              <span
                className="font-display text-[color:var(--color-gold-deep)] tracking-[0.06em]"
                style={{ fontSize: "clamp(16px, 1.5vw, 22px)", fontWeight: 500 }}
              >
                Siliguri
              </span>
              <span
                aria-hidden="true"
                className="mt-1 flex items-center gap-1.5 text-[color:var(--color-gold-deep)]/75"
              >
                <span className="h-px w-2.5 bg-current opacity-70" />
                <span
                  className="font-display tracking-[0.38em]"
                  style={{ fontSize: "9px", fontWeight: 500 }}
                >
                  EVENT
                </span>
                <span className="h-px w-2.5 bg-current opacity-70" />
              </span>
            </span>
            <span className="sr-only">Siliguri Event</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-[var(--space-6)] lg:flex lg:gap-[var(--space-8)]"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative text-[11px] uppercase tracking-[0.22em] font-medium",
                    "transition-colors duration-200",
                    active
                      ? "text-[color:var(--color-gold-deep)]"
                      : "text-[color:var(--color-ink)]/85 hover:text-[color:var(--color-gold-deep)]",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1.5 left-0 right-0 h-[1.5px] origin-left",
                      "bg-[color:var(--color-gold-deep)]",
                      "transition-transform duration-300 ease-out",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <MagneticButton>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outlineInk", size: "sm" }),
                  "h-10 px-5 gap-2.5 text-[10px] tracking-[0.22em] border-[color:var(--color-ink)]/30",
                )}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4.5" width="18" height="17" rx="1.5" />
                  <path d="M3 9h18M8 2.5v4M16 2.5v4" />
                </svg>
                Book Consultation
              </Link>
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center text-[color:var(--color-ink)]"
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-300",
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-300",
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* ── Mobile menu — full-screen overlay with staggered reveal ───── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={cn(
          "lg:hidden fixed inset-0 z-40",
          "bg-[color:var(--color-bg)]",
          "transition-opacity duration-300",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{ paddingTop: "var(--space-24)" }}
      >
        <Container>
          <nav
            aria-label="Mobile primary"
            className="flex flex-col gap-[var(--space-4)] py-[var(--space-8)]"
          >
            {NAV_ITEMS.map((item, index) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    transitionDelay: menuOpen ? `${80 + index * 60}ms` : "0ms",
                  }}
                  className={cn(
                    "font-display text-[length:var(--text-4xl)]",
                    "transition-[opacity,transform] duration-500 ease-out",
                    menuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4",
                    active
                      ? "text-[color:var(--color-accent)]"
                      : "text-[color:var(--color-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div
              className={cn(
                "pt-[var(--space-6)]",
                "transition-[opacity,transform] duration-500 ease-out",
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{
                transitionDelay: menuOpen
                  ? `${80 + NAV_ITEMS.length * 60}ms`
                  : "0ms",
              }}
            >
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outlineInk", size: "md" }),
                  "gap-[var(--space-3)]",
                )}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4.5" width="18" height="17" rx="1.5" />
                  <path d="M3 9h18M8 2.5v4M16 2.5v4" />
                </svg>
                Book Consultation
              </Link>
            </div>
          </nav>
        </Container>
      </div>

      {/* Component-scoped keyframes for the brass pulse dot. Global
          reduced-motion reset in globals.css collapses this automatically. */}
      <style>{`
        .sgv-brass-dot {
          animation: sgv-brass-pulse 1.5s ease-in-out infinite;
        }
        @keyframes sgv-brass-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </header>
  );
}
