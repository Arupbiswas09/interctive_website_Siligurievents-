"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getWhatsAppHref } from "@/lib/cms/site-settings";

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
  const href = getWhatsAppHref(
    "Hello Siligurievent, I'd like to plan an event.",
  );

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
        <WhatsAppGlyph />
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

/**
 * WhatsAppGlyph — the official WhatsApp brand mark (phone-in-speech-bubble).
 * Single-colour vector so it inherits the FAB's white `currentColor` on the
 * #25D366 brand-green pill, reading as the authentic WhatsApp button.
 */
function WhatsAppGlyph(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="h-6 w-6"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.738-.979a9.881 9.881 0 0 0 2.65.781h.001zm5.518-7.74c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}
