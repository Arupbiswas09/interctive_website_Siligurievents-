import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";

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
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+91XXXXXXXXXX";
  const sanitized = phone.replace(/[^\d]/g, "");
  const message =
    prefillMessage ??
    "Hello Siligurievent — I'd like to plan an event. Could we talk?";
  const href = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;

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
              <MessageCircle strokeWidth={1.5} className="h-6 w-6" />
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
