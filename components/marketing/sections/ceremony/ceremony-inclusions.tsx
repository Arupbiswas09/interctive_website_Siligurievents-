"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { CeremonyTheme } from "@/lib/ceremony/theme";

export type CeremonyInclusionsProps = {
  theme: CeremonyTheme;
  description: string;
  groups: ReadonlyArray<{ title: string; items: ReadonlyArray<string> }>;
};

/**
 * CeremonyInclusions — "what we bring" editorial accordion.
 *
 * Two-column layout: a sticky-on-desktop intro column with eyebrow, display
 * headline, description and a small theme ornament; and an accordion stack
 * of inclusion groups. First group is expanded by default. Each group card
 * carries brass L-shaped corner accents and a numeric prefix.
 *
 * Reduced motion: drops the stagger entrance and the expand height tween —
 * lists toggle instantly via display-only rendering.
 */
export function CeremonyInclusions({
  theme,
  description,
  groups,
}: CeremonyInclusionsProps): React.ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{ background: theme.palette.bg, color: theme.palette.ink }}
      aria-label="What's included"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
          {/* LEFT: sticky intro column */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{ background: theme.palette.gold, opacity: 0.85 }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.32em]"
                  style={{ color: theme.palette.gold }}
                >
                  What we bring
                </span>
              </div>

              {/* Display heading */}
              <h2
                className="mt-6 font-display italic"
                style={{
                  color: theme.palette.ink,
                  fontWeight: 300,
                  fontSize: "clamp(28px, 4.2vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                }}
              >
                Every detail, designed.
              </h2>

              {/* Description */}
              <p
                className="mt-6 max-w-[40ch] text-[length:var(--text-base)] leading-relaxed"
                style={{ color: theme.palette.ink, opacity: 0.75 }}
              >
                {description}
              </p>

              {/* Inline small ornament */}
              <div
                className="mt-10 h-32 w-32"
                style={{ opacity: 0.85 }}
                aria-hidden
              >
                <CeremonyOrnament
                  name={theme.ornament}
                  hue={theme.palette.gold}
                  hueSecondary={theme.palette.goldDeep}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: accordion cards */}
          <div className="flex flex-col gap-4 md:col-span-8">
            {groups.map((group, idx) => {
              const isOpen = openIndex === idx;
              const numberLabel = String(idx + 1).padStart(2, "0");

              return (
                <motion.div
                  key={`${group.title}-${idx}`}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 24 }
                  }
                  whileInView={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 0.61, 0.36, 1],
                    delay: prefersReducedMotion ? 0 : idx * 0.08,
                  }}
                  className="relative p-6 md:p-8"
                  style={{ background: theme.palette.bgSoft }}
                >
                  {/* Brass L-shaped corner accents */}
                  <CornerAccent
                    placement="top-left"
                    color={theme.palette.goldDeep}
                  />
                  <CornerAccent
                    placement="bottom-right"
                    color={theme.palette.goldDeep}
                  />

                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`inclusion-panel-${idx}`}
                    className="group flex w-full items-start justify-between gap-6 text-left"
                  >
                    <div className="flex items-baseline gap-5 md:gap-7">
                      <span
                        className="font-display italic"
                        style={{
                          color: theme.palette.accent,
                          fontWeight: 300,
                          fontSize: "clamp(20px, 2.4vw, 28px)",
                          lineHeight: 1,
                        }}
                      >
                        {numberLabel}
                      </span>
                      <h3
                        className="font-display"
                        style={{
                          color: theme.palette.ink,
                          fontWeight: 400,
                          fontSize: "clamp(20px, 2.4vw, 28px)",
                          lineHeight: 1.15,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {group.title}
                      </h3>
                    </div>

                    {/* +/- toggle */}
                    <span
                      className={cn(
                        "relative mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center",
                        "rounded-full border transition-colors duration-200",
                      )}
                      style={{
                        borderColor: `${theme.palette.goldDeep}99`,
                        color: theme.palette.ink,
                      }}
                      aria-hidden
                    >
                      <span
                        className="absolute h-px w-3"
                        style={{ background: "currentColor" }}
                      />
                      <span
                        className={cn(
                          "absolute h-3 w-px transition-transform duration-300 ease-out",
                          isOpen ? "scale-y-0" : "scale-y-100",
                        )}
                        style={{ background: "currentColor" }}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={`inclusion-panel-${idx}`}
                        initial={
                          prefersReducedMotion
                            ? { height: "auto", opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          prefersReducedMotion
                            ? { height: "auto", opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{
                          height: {
                            duration: prefersReducedMotion ? 0 : 0.45,
                            ease: [0.22, 0.61, 0.36, 1],
                          },
                          opacity: {
                            duration: prefersReducedMotion ? 0 : 0.35,
                            ease: "easeOut",
                            delay: prefersReducedMotion ? 0 : 0.08,
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3">
                          {group.items.map((item, itemIdx) => (
                            <li
                              key={`${item}-${itemIdx}`}
                              className="flex items-start gap-3 text-[length:var(--text-base)] leading-snug"
                              style={{ color: theme.palette.ink }}
                            >
                              <PetalBullet
                                color={theme.palette.gold}
                                accent={theme.palette.goldDeep}
                              />
                              <span style={{ opacity: 0.88 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Local subcomponents
// ────────────────────────────────────────────────────────────────────────────

function CornerAccent({
  placement,
  color,
}: {
  placement: "top-left" | "bottom-right";
  color: string;
}): React.ReactElement {
  const isTL = placement === "top-left";
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-5 w-5",
        isTL ? "left-3 top-3" : "bottom-3 right-3",
      )}
      style={{ opacity: 0.6 }}
    >
      <span
        className="absolute"
        style={{
          background: color,
          height: 1,
          width: 20,
          top: isTL ? 0 : "auto",
          bottom: isTL ? "auto" : 0,
          left: isTL ? 0 : "auto",
          right: isTL ? "auto" : 0,
        }}
      />
      <span
        className="absolute"
        style={{
          background: color,
          width: 1,
          height: 20,
          top: isTL ? 0 : "auto",
          bottom: isTL ? "auto" : 0,
          left: isTL ? 0 : "auto",
          right: isTL ? "auto" : 0,
        }}
      />
    </span>
  );
}

function PetalBullet({
  color,
  accent,
}: {
  color: string;
  accent: string;
}): React.ReactElement {
  // Tiny marigold petal / paisley dot bullet. ~10×10 viewBox 0..20.
  return (
    <svg
      viewBox="0 0 20 20"
      width="12"
      height="12"
      aria-hidden
      className="mt-[7px] shrink-0"
    >
      <path
        d="M10 2 Q 16 6 14 12 Q 10 18 6 12 Q 4 6 10 2 Z"
        fill={color}
        opacity="0.95"
      />
      <circle cx="10" cy="11" r="1.6" fill={accent} />
    </svg>
  );
}
