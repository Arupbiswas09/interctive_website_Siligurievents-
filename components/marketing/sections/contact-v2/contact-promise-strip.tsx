"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

const STATEMENTS = [
  "Reply within 24 hours",
  "14 years in Siliguri",
  "248+ events designed",
  "Featured in Vogue Wedding Co",
] as const;

/**
 * ContactPromiseStrip — dark single-row marquee of promise statements,
 * separated by brass diamond glyphs. Loops slowly (50s). Respects
 * prefers-reduced-motion (renders static centred row).
 */
export function ContactPromiseStrip(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    // Marquee: animate one half of the duplicated content.
    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 50,
        ease: "none",
        repeat: -1,
      });

      return (): void => {
        tween.kill();
      };
    });

    return (): void => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      aria-label="Our promises"
      className={cn(
        "relative w-full overflow-hidden",
        "bg-[#0E0B08] text-[color:var(--color-bg)]",
        "py-[var(--space-4)] md:py-[var(--space-6)]",
      )}
    >
      {/* Edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 md:block"
        style={{
          background:
            "linear-gradient(90deg, #0E0B08 0%, rgba(14,11,8,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-24 md:block"
        style={{
          background:
            "linear-gradient(270deg, #0E0B08 0%, rgba(14,11,8,0) 100%)",
        }}
      />

      {reducedMotion ? (
        // Static, centred, wraps on small screens
        <div className="flex flex-wrap items-center justify-center gap-x-[var(--space-8)] gap-y-[var(--space-2)] px-[var(--gutter)]">
          {STATEMENTS.map((s, i) => (
            <span key={s} className="flex items-center gap-[var(--space-6)]">
              <Statement text={s} />
              {i < STATEMENTS.length - 1 ? <Diamond /> : null}
            </span>
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex w-max items-center gap-[var(--space-8)] whitespace-nowrap will-change-transform"
        >
          {/* Render the statement list twice for a seamless -50% loop */}
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1 ? "true" : undefined}
              className="flex items-center gap-[var(--space-8)]"
            >
              {STATEMENTS.map((s) => (
                <span key={`${dup}-${s}`} className="flex items-center gap-[var(--space-8)]">
                  <Statement text={s} />
                  <Diamond />
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Statement({ text }: { text: string }): React.ReactElement {
  return (
    <span
      className="font-display italic text-[#F5EDE0]"
      style={{
        fontSize: "14px",
        letterSpacing: "0.04em",
        fontWeight: 400,
      }}
    >
      {text}
    </span>
  );
}

function Diamond(): React.ReactElement {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rotate-45 shrink-0 bg-[color:var(--color-gold)]"
    />
  );
}
