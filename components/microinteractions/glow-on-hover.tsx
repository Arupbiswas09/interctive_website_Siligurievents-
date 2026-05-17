"use client";

/**
 * GlowOnHover — drop-in wrapper that paints a soft brass glow tracking the
 * pointer inside its bounds (Linear / 21st.dev signature interaction).
 *
 * No React state on pointermove: we write `--glow-x` / `--glow-y` /
 * `--glow-on` directly on the wrapper via refs. The glow itself is a
 * radial-gradient overlay (`::before`-style absolutely-positioned div) that
 * uses those vars. Reduced-motion strips opacity transitions but keeps a
 * static centred soft glow on focus-visible so keyboard users still see
 * affordance.
 *
 * Drop over cards, CTA wrappers, anything you want to feel "lit".
 */

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowOnHoverProps = {
  children: ReactNode;
  className?: string;
  /** Glow size in px (diameter). Default 320. */
  size?: number;
  /** Brass intensity 0–1. Default 0.35. */
  intensity?: number;
  /** Element to render as. Default "div". */
  as?: "div" | "section" | "article" | "aside";
};

export function GlowOnHover({
  children,
  className,
  size = 320,
  intensity = 0.35,
  as: Tag = "div",
}: GlowOnHoverProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      el.style.setProperty("--glow-x", `${x}px`);
      el.style.setProperty("--glow-y", `${y}px`);
      el.style.setProperty("--glow-on", "1");
    };

    const onLeave = (): void => {
      el.style.setProperty("--glow-on", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return (): void => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("sgv-glow-host relative isolate overflow-hidden", className)}
      style={
        {
          "--glow-size": `${size}px`,
          "--glow-intensity": intensity,
        } as React.CSSProperties
      }
    >
      <style>{`
        .sgv-glow-host {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-on: 0;
        }
        .sgv-glow-host::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            var(--glow-size, 320px) circle at var(--glow-x) var(--glow-y),
            rgba(232, 213, 168, calc(var(--glow-intensity, 0.35) * 1)),
            rgba(184, 137, 58, calc(var(--glow-intensity, 0.35) * 0.25)) 35%,
            transparent 65%
          );
          opacity: var(--glow-on, 0);
          transition: opacity 280ms cubic-bezier(0.22, 1, 0.36, 1);
          mix-blend-mode: screen;
          z-index: 0;
        }
        .sgv-glow-host:focus-within::before {
          opacity: calc(var(--glow-on, 0) + 0.4);
        }
        .sgv-glow-host > * {
          position: relative;
          z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .sgv-glow-host::before {
            transition: none;
            opacity: 0;
          }
          .sgv-glow-host:focus-within::before {
            opacity: 0.35;
            background: radial-gradient(
              var(--glow-size, 320px) circle at 50% 50%,
              rgba(232, 213, 168, 0.35),
              transparent 60%
            );
          }
        }
      `}</style>
      {children}
    </Tag>
  );
}
