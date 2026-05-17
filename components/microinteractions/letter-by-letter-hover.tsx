"use client";

/**
 * LetterByLetterHover — splits a headline into spans and runs a wave
 * animation on hover: each letter rises (translateY) and returns, with a
 * stagger keyed off letter index.
 *
 * GSAP timeline-based for precise control over the in/out wave. Reduced
 * motion: renders text statically with no listeners.
 *
 * Usage:
 *   <LetterByLetterHover text="Stories worth attending" as="h2" className="..."/>
 *
 * Accessibility: original text is exposed via `aria-label` on the host and
 * the per-letter spans are `aria-hidden`, so assistive tech reads the
 * unbroken phrase. Whitespace is preserved (rendered as wider spans).
 */

import "@/lib/gsap/register";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type LetterByLetterHoverProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  /** Distance each letter travels (px). Default 6. */
  travel?: number;
  /** Stagger between letters (s). Default 0.018. */
  stagger?: number;
};

export function LetterByLetterHover({
  text,
  as: Tag = "span",
  className,
  travel = 6,
  stagger = 0.018,
}: LetterByLetterHoverProps): React.ReactElement {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Split text into stable tokens so React doesn't churn keys.
  const tokens = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = rootRef.current;
    if (!root) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const letters = root.querySelectorAll<HTMLElement>("[data-sgv-letter]");
    if (!letters.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.to(letters, {
        y: -travel,
        duration: 0.32,
        ease: "power3.out",
        stagger: { each: stagger, from: "start" },
      }).to(
        letters,
        {
          y: 0,
          duration: 0.42,
          ease: "power3.inOut",
          stagger: { each: stagger, from: "start" },
        },
        ">-0.18"
      );

      const onEnter = (): void => {
        tl.restart();
      };
      root.addEventListener("pointerenter", onEnter);
      return (): void => {
        root.removeEventListener("pointerenter", onEnter);
      };
    }, root);

    return (): void => {
      ctx.revert();
    };
  }, [travel, stagger, prefersReducedMotion, text]);

  return (
    <Tag
      ref={rootRef as React.RefObject<HTMLHeadingElement>}
      aria-label={text}
      className={cn("inline-block", className)}
    >
      {tokens.map((char, i) => (
        <span
          key={`${i}-${char}`}
          data-sgv-letter
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{
            whiteSpace: char === " " ? "pre" : undefined,
            transform: "translateZ(0)",
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}
