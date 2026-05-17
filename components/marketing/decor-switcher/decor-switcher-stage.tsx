"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { DecorPair } from "@/lib/cms/decor-pairs";
import { DecorSwitcherProvider } from "./decor-switcher-context";
import { DecorBackground } from "./decor-background";
import { DecorAmbient } from "./decor-ambient";
import { DecorGrid } from "./decor-grid";
import { DecorRope } from "./decor-rope";
import { DecorToggle } from "./decor-toggle";
import { DecorAudio } from "./decor-audio";
import { SwipeGesture } from "./swipe-gesture";

type DecorSwitcherStageProps = {
  pairs: ReadonlyArray<DecorPair>;
  /** Optional className passed to the stage root (for tuning padding). */
  className?: string;
};

/**
 * DecorSwitcherStage
 *
 * The interactive Client root. Composes:
 *   <DecorSwitcherProvider>
 *     <SwipeGesture>
 *       <section ref={stageRef}>
 *         <DecorBackground target={stageRef} />
 *         <DecorAmbient />
 *         <DecorRope />            // becomes <DecorToggle/> on touch
 *         <header><DecorToggle /><DecorAudio/></header>
 *         <DecorGrid pairs={pairs} />
 *       </section>
 *     </SwipeGesture>
 *   </DecorSwitcherProvider>
 *
 * The Server section wrapper around this component owns the eyebrow,
 * heading, and intro — that copy never re-renders on toggles.
 */
export function DecorSwitcherStage({
  pairs,
  className,
}: DecorSwitcherStageProps): React.ReactElement {
  const stageRef = useRef<HTMLDivElement | null>(null);

  return (
    <DecorSwitcherProvider initialMode="day">
      <SwipeGesture>
        <div
          ref={stageRef}
          className={cn(
            "relative isolate overflow-hidden rounded-[8px]",
            "min-h-[480px]",
            "pt-[var(--space-12)] sm:pt-[var(--space-16)]",
            "pb-[var(--space-12)] sm:pb-[var(--space-16)]",
            "px-[var(--space-4)] sm:px-[var(--space-6)]",
            className,
          )}
          data-component="decor-switcher-stage"
        >
          {/* Background + tint (sits behind everything) */}
          <DecorBackground targetRef={stageRef} />
          {/* Lazy-mounted ambient noise + flames */}
          <DecorAmbient />

          {/* Desktop rope (becomes toggle on coarse pointers) */}
          <DecorRope />

          {/* Header strip: always-visible toggle + sound toggle */}
          <div
            className={cn(
              "relative z-10 mb-[var(--space-8)]",
              "flex flex-wrap items-center gap-[var(--space-4)]",
              "sm:justify-between",
              // On desktop the rope occupies the top-right, so we shift
              // the toggle to the left to avoid visual collision.
              "pr-[clamp(60px,8vw,120px)]",
            )}
          >
            <DecorToggle />
            <DecorAudio />
          </div>

          {/* The grid */}
          <DecorGrid pairs={pairs} />
        </div>
      </SwipeGesture>
    </DecorSwitcherProvider>
  );
}
