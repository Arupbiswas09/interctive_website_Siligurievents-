"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PEEK_STORAGE_KEY = "sgv:wa-peek-shown";
const PEEK_SCROLL_RATIO = 0.6; // 60vh
const PEEK_DURATION_MS = 3000;

/**
 * StickyWhatsApp — bottom-right FAB. Opens WhatsApp click-to-chat.
 *
 * Polish (Sprint 1 chrome pass):
 *  • 56px minimum touch target on mobile.
 *  • Position respects iOS safe-area-inset and stays above mobile address bar.
 *  • Subtle pulse on hover (CSS keyframes — global reduced-motion reset
 *    in app/globals.css collapses this automatically).
 *  • One-time "Chat on WhatsApp" peek after scrolling past 60vh — collapses
 *    back to icon after 3s. sessionStorage prevents repeat per session.
 *  • Drop shadow for lift, brand-coloured focus ring for keyboards.
 *
 * Number wired via `NEXT_PUBLIC_WHATSAPP_NUMBER` env var; falls back to a
 * placeholder so previews don't break before Sprint 4. Link logic unchanged.
 */
export function StickyWhatsApp(): React.ReactElement {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+91XXXXXXXXXX";
  const sanitized = phone.replace(/[^\d]/g, "");
  // TODO: pre-fill message per page context in Sprint 4.
  const href = `https://wa.me/${sanitized}?text=${encodeURIComponent(
    "Hello Siligurievent, I'd like to plan an event.",
  )}`;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Guard SSR + bail if user has already seen the peek this session.
    if (typeof window === "undefined") return;
    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(PEEK_STORAGE_KEY) === "1";
    } catch {
      // sessionStorage can throw (privacy mode); treat as not-shown so we
      // still peek once per page load instead of every scroll tick.
    }
    if (alreadyShown) return;

    let collapseTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = (): void => {
      const trigger = window.innerHeight * PEEK_SCROLL_RATIO;
      if (window.scrollY < trigger) return;

      setExpanded(true);
      try {
        window.sessionStorage.setItem(PEEK_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      window.removeEventListener("scroll", onScroll);

      collapseTimer = setTimeout(() => {
        setExpanded(false);
      }, PEEK_DURATION_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Fire once in case the page is already mid-scroll on mount.
    onScroll();

    return (): void => {
      window.removeEventListener("scroll", onScroll);
      if (collapseTimer) clearTimeout(collapseTimer);
    };
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-expanded={expanded}
      style={{
        // Sit above iOS home-indicator / mobile browser address bar.
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "16px",
        // Soft, brand-neutral shadow for elevation.
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
      }}
      className={cn(
        "group fixed z-40 sgv-wa-fab",
        // Touch target ≥ 56px on mobile; grows to 60px on md+.
        "inline-flex h-14 min-w-14 items-center justify-center gap-[var(--space-2)]",
        "rounded-full bg-[#25D366] text-white",
        "px-3 md:h-[60px] md:min-w-[60px] md:px-3",
        // Animate width/padding when expanded so it eases into a pill.
        "transition-[background-color,transform,padding,width] duration-300 ease-out",
        "hover:scale-[1.04] focus-visible:scale-[1.04]",
        // Brand-coloured focus ring (over the green pill).
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-accent)]",
        // Desktop: extra inset so it doesn't sit on top of footer chrome.
        "md:right-[24px]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-7 w-7 items-center justify-center",
          // Pulse on hover. Honors global reduced-motion reset in globals.css.
          "group-hover:[animation:sgv-wa-pulse_1.4s_ease-in-out_infinite]",
          "group-focus-visible:[animation:sgv-wa-pulse_1.4s_ease-in-out_infinite]",
        )}
      >
        <MessageCircle strokeWidth={1.75} className="h-6 w-6" />
      </span>

      {/* Peek label — width-animated for a smooth grow/shrink. */}
      <span
        aria-hidden="true"
        className={cn(
          "overflow-hidden whitespace-nowrap text-[length:var(--text-sm)] font-medium",
          "transition-[max-width,opacity,margin] duration-300 ease-out",
          expanded ? "max-w-[180px] opacity-100 mr-1" : "max-w-0 opacity-0",
        )}
      >
        Chat on WhatsApp
      </span>

      <span className="sr-only">Open WhatsApp chat</span>

      {/* Component-scoped keyframes for the pulse. Lives inline so we don't
          have to touch globals.css from this file's scope. Global
          reduced-motion media query collapses animation-duration to ~0. */}
      <style>{`
        @keyframes sgv-wa-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
      `}</style>
    </a>
  );
}
