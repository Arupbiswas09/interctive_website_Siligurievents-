"use client";

/**
 * AboutPressStrip — infinite horizontal marquee of press logos.
 *
 * GSAP x-loop, hover pauses. Each item is the press name rendered as a
 * serif logo (font-display, uppercase, wide tracking) with a small brass
 * diamond divider between items.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Container } from "@/components/ui/container";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const PRESS: readonly string[] = [
  "Vogue Wedding Co",
  "The Hindu",
  "Filmfare Bridal",
  "Telegraph India",
  "Wedding Wire",
  "Brides Today",
  "Conde Nast Traveller",
  "The Statesman",
] as const;

export function AboutPressStrip(): React.ReactElement {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    let detach: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // The track contains two duplicated lists side by side. Animate the
      // wrapper -50% to seamlessly loop into the duplicate.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 38,
        ease: "none",
        repeat: -1,
      });

      const onEnter = (): void => {
        tween.timeScale(0.15);
      };
      const onLeave = (): void => {
        tween.timeScale(1);
      };

      track.addEventListener("pointerenter", onEnter);
      track.addEventListener("pointerleave", onLeave);

      detach = (): void => {
        track.removeEventListener("pointerenter", onEnter);
        track.removeEventListener("pointerleave", onLeave);
      };
    }, track);

    return (): void => {
      detach?.();
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      aria-label="Press features"
      className="relative w-full overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-ink)] py-[clamp(56px,8vh,96px)]"
    >
      <Container>
        <div
          className="flex items-center justify-center gap-3"
          style={{ color: "var(--color-gold-deep)" }}
        >
          <span className="h-px w-10 bg-current opacity-60" />
          <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
            As featured in
          </span>
          <span className="h-px w-10 bg-current opacity-60" />
        </div>
      </Container>

      <div
        className="relative mt-10 overflow-hidden"
        style={{
          // Edge fades so the loop seam is invisible
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
        >
          {[0, 1].map((dup) => (
            <ul
              // biome-ignore lint/suspicious/noArrayIndexKey: stable duplication index
              key={dup}
              className="flex items-center"
              aria-hidden={dup === 1 ? true : undefined}
            >
              {PRESS.map((name) => (
                <li
                  key={`${dup}-${name}`}
                  className="flex items-center gap-10 px-10"
                >
                  <span
                    className="font-display uppercase whitespace-nowrap"
                    style={{
                      fontSize: "clamp(18px, 1.6vw, 28px)",
                      fontWeight: 400,
                      letterSpacing: "0.18em",
                      color: "color-mix(in oklab, var(--color-ink) 55%, transparent)",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-2 w-2 rotate-45 flex-shrink-0"
                    style={{ background: "var(--color-gold)" }}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
