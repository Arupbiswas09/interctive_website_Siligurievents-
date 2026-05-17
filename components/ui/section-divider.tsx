"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionDividerProps {
  className?: string;
  tone?: "ink" | "brass" | "accent";
}

/**
 * SIG-02 · "Sindoor" — SVG turbulence morph on section transitions.
 *
 * A full-width SVG band that "melts" or bleeds based on scroll progress.
 * Uses feTurbulence + feDisplacementMap.
 */
export function SectionDivider({ className, tone = "ink" }: SectionDividerProps) {
  const filterRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const filter = filterRef.current;
    const displacement = displacementRef.current;
    const container = containerRef.current;

    if (!filter || !displacement || !container || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(displacement, {
        attr: { scale: 32 },
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(filter, {
        attr: { baseFrequency: "0.02 0.4" },
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const colorMap = {
    ink: "var(--color-ink-deep)",
    brass: "var(--color-brass-leaf)",
    accent: "var(--color-accent)",
  };

  const id = `divider-filter-${tone}`;

  return (
    <div ref={containerRef} className={cn("relative w-full overflow-hidden", className)}>
      <svg
        width="100%"
        height="40"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block"
      >
        <filter id={id}>
          <feTurbulence
            ref={filterRef}
            type="fractalNoise"
            baseFrequency="0.01 0.1"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          fill={colorMap[tone]}
          filter={`url(#${id})`}
          className="opacity-20"
        />
        <line
          x1="0"
          y1="20"
          x2="1000"
          y2="20"
          stroke={colorMap[tone]}
          strokeWidth="1"
          filter={`url(#${id})`}
        />
      </svg>
    </div>
  );
}
