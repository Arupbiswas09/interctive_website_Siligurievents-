import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { getWhatsAppHref } from "@/lib/cms/site-settings";

type Props = {
  /** Optional pre-fill message — falls back to a default opener. */
  prefillMessage?: string;
  className?: string;
};

/**
 * Contact — WhatsApp alternative card.
 * Per docs/05-PAGE-SPECS.md §5.10 §3.
 *
 * Uses NEXT_PUBLIC_WHATSAPP_NUMBER and pre-fills the message body. The
 * server component receives the prefill via prop (e.g. from search params)
 * so the link is correct on first paint — no client hydration needed.
 */
export function ContactWhatsAppCard({
  prefillMessage,
  className,
}: Props): React.ReactElement {
  const message =
    prefillMessage ??
    "Hello Siligurievent — I'd like to plan an event. Could we talk?";
  const href = getWhatsAppHref(message);

  return (
    <aside
      aria-label="WhatsApp alternative"
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)]",
        "border border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg-elevated)]",
        "p-[var(--space-8)] md:p-[var(--space-10)]",
        className,
      )}
    >
      <div className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-[var(--space-4)]">
          <span
            aria-hidden="true"
            className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center"
          >
            {/* Pulsing brass ring — CSS keyframes, reduced-motion safe via
                the local `@media (prefers-reduced-motion: reduce)` rule. */}
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color:var(--color-gold)] opacity-70 [animation:wa-ring-pulse_2.2s_var(--ease-out)_infinite] motion-reduce:animate-none" />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color:var(--color-gold)]/0 [animation:wa-ring-pulse_2.2s_var(--ease-out)_infinite] motion-reduce:animate-none" style={{ animationDelay: "1.1s" }} />
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppGlyph />
            </span>
          </span>
          <div className="flex flex-col gap-[var(--space-2)]">
            <h2 className="font-display text-[length:var(--text-2xl)] tracking-[var(--tracking-display)] leading-[1.1]">
              Prefer WhatsApp?
            </h2>
            <p className="max-w-[42ch] text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
              Send us a quick message — we usually reply within the hour, 9 AM
              – 9 PM IST.
            </p>
          </div>
        </div>

        <MagneticButton>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex h-12 shrink-0 items-center justify-center gap-[var(--space-2)]",
              "rounded-[var(--radius-sm)] bg-[#25D366] px-[var(--space-6)]",
              "text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-tight)]",
              "text-white",
              "transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02]",
            )}
          >
            Chat on WhatsApp
            <span aria-hidden="true">→</span>
          </a>
        </MagneticButton>
      </div>
      {/* Local keyframes for the brass-ring pulse. */}
      <style>{`
        @keyframes wa-ring-pulse {
          0%   { transform: scale(1);    opacity: 0.70; }
          70%  { transform: scale(1.45); opacity: 0;    }
          100% { transform: scale(1.45); opacity: 0;    }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="wa-ring-pulse"] { animation: none !important; opacity: 0.4 !important; }
        }
      `}</style>
    </aside>
  );
}

/** Official WhatsApp brand glyph — inherits the white `currentColor` on green. */
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
