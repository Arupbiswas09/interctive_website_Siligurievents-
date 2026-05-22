"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SplitMode = "chars" | "words" | "lines";

type SplitterRevealProps = {
  /** Plain text content. JSX children are not supported (we need to split). */
  text: string;
  mode?: SplitMode;
  stagger?: number;
  /** Y-offset and opacity for each split unit. */
  from?: { y?: number; opacity?: number; rotation?: number };
  /** Auto-trigger via ScrollTrigger; if false, plays on mount. */
  scrollTrigger?: boolean;
  start?: string;
  delay?: number;
  className?: string;
  /** Render element. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
};

/**
 * MO-01 — SplitterReveal
 * Pure-React split (no GSAP SplitText plugin dependency) for chars/words/lines.
 * GSAP animates each unit with stagger.
 * Reduced motion: renders final text instantly, no animation.
 */
export function SplitterReveal({
  text,
  mode = "words",
  stagger = 0.04,
  from,
  scrollTrigger = true,
  start = "top 85%",
  delay = 0,
  className,
  as: Tag = "h2",
}: SplitterRevealProps): React.ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const segments = useMemo(() => splitText(text, mode), [text, mode]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-split-unit]");
    if (targets.length === 0) return;

    const fromState = {
      yPercent: from?.y ?? 110,
      opacity: from?.opacity ?? 0,
      rotation: from?.rotation ?? 0,
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromState, {
        yPercent: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.1,
        delay,
        ease: "cubic-bezier(0.85, 0, 0.15, 1)",
        stagger,
        scrollTrigger: scrollTrigger
          ? { trigger: el, start, once: true }
          : undefined,
        onComplete: () => {
          for (const node of targets) {
            (node as HTMLElement).style.willChange = "auto";
          }
        },
      });
    }, el);

    return (): void => {
      ctx.revert();
    };
  }, [from, stagger, delay, scrollTrigger, start, prefersReducedMotion]);

  const Element = Tag as React.ElementType;

  return (
    <Element
      ref={ref as React.Ref<HTMLElement>}
      className={cn(className)}
      aria-label={text}
    >
      {segments.map((segment, idx) => {
        const last = idx === segments.length - 1;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable order for splits
          <span key={`${segment}-${idx}`} className="contents">
            <span
              className="inline-block overflow-hidden align-baseline"
              aria-hidden="true"
            >
              <span
                data-split-unit
                className="inline-block will-change-transform"
              >
                {segment === " " ? " " : segment}
              </span>
            </span>
            {!last && mode === "words" ? " " : null}
            {!last && mode === "lines" ? <br /> : null}
          </span>
        );
      })}
    </Element>
  );
}

function splitText(text: string, mode: SplitMode): string[] {
  if (mode === "chars") {
    return Array.from(text);
  }
  if (mode === "lines") {
    return text.split(/\r?\n/);
  }
  return text.split(/\s+/).filter(Boolean);
}
