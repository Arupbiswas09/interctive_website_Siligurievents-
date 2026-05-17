"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  useDecorKeyboardToggle,
  useDecorSwitcher,
} from "./decor-switcher-context";
import { DecorToggle } from "./decor-toggle";

type DecorRopeProps = {
  /**
   * Visual length of the rope at rest (px). The hanging bulb is drawn at
   * the bottom of this length. The rope can stretch up to +80px during drag.
   */
  baseLength?: number;
  /** Magnetism reach (px) — cursor inside this radius nudges the rope. */
  magneticRadius?: number;
  className?: string;
};

/** Drag threshold (px) past which a release toggles the mode. */
const DRAG_THRESHOLD_PX = 50;
/** Maximum visual stretch during drag (px). */
const MAX_STRETCH_PX = 80;
/** Idle sway peak rotation, degrees. */
const IDLE_SWAY_DEG = 0.5;

/**
 * DecorRope
 *
 * The brass-tipped rope hanging from the top-right of the section.
 *
 * Desktop (fine pointer + motion allowed):
 *  - Idle sine sway (4s loop, ±0.5°).
 *  - Cursor within `magneticRadius` (default 200px) → rope leans toward it
 *    via `gsap.quickTo` for buttery follow.
 *  - `pointerdown` starts a drag. While dragging, vertical pointer travel
 *    stretches the rope (capped at +80px) and rotates the rope-and-bulb
 *    toward the pointer angle.
 *  - Release past 50px → toggle + recoil (`back.out(3)`) + a 240ms bulb
 *    flicker timeline.
 *
 * Touch / coarse pointer / reduced motion:
 *  - Renders <DecorToggle /> instead; no rope is mounted.
 */
export function DecorRope({
  baseLength = 220,
  magneticRadius = 200,
  className,
}: DecorRopeProps): React.ReactElement | null {
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarsePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent): void =>
      setIsCoarsePointer(e.matches);
    mq.addEventListener("change", onChange);
    return (): void => mq.removeEventListener("change", onChange);
  }, []);

  // Touch or coarse-pointer devices get the labelled toggle instead.
  if (isCoarsePointer) {
    return <DecorToggle className={className} />;
  }

  // Reduced motion: render a static rope that acts as a click-to-toggle switch.
  if (prefersReducedMotion) {
    return <StaticRope baseLength={baseLength} className={className} />;
  }

  return (
    <InteractiveRope
      baseLength={baseLength}
      magneticRadius={magneticRadius}
      className={className}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              Interactive rope                              */
/* -------------------------------------------------------------------------- */

type InteractiveRopeProps = {
  baseLength: number;
  magneticRadius: number;
  className?: string;
};

function InteractiveRope({
  baseLength,
  magneticRadius,
  className,
}: InteractiveRopeProps): React.ReactElement {
  const { mode, toggle } = useDecorSwitcher();
  const focusRef = useDecorKeyboardToggle<HTMLButtonElement>();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const armRef = useRef<HTMLDivElement | null>(null);
  const ropeRef = useRef<HTMLDivElement | null>(null);
  const bulbRef = useRef<HTMLSpanElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  // Bridge our handle ref to the keyboard-toggle ref.
  const setHandleRef = (el: HTMLButtonElement | null): void => {
    handleRef.current = el;
    focusRef.current = el;
  };

  useEffect(() => {
    const root = rootRef.current;
    const arm = armRef.current;
    const rope = ropeRef.current;
    const bulb = bulbRef.current;
    const handle = handleRef.current;
    if (!root || !arm || !rope || !bulb || !handle) return;

    const ctx = gsap.context(() => {
      // ---- Idle sway ---------------------------------------------------
      const idleSway = gsap.to(arm, {
        rotation: IDLE_SWAY_DEG,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "top center",
      });
      gsap.set(arm, { rotation: -IDLE_SWAY_DEG });

      // ---- Cursor magnetism (overrides idle while in range) -----------
      const rotateTo = gsap.quickTo(arm, "rotation", {
        duration: 0.45,
        ease: "power3.out",
      });

      let isDragging = false;
      let dragStartY = 0;
      let dragStartX = 0;

      const anchorPoint = (): { x: number; y: number } => {
        const rect = arm.getBoundingClientRect();
        // Top centre — the rope's pivot.
        return { x: rect.left + rect.width / 2, y: rect.top };
      };

      const onPointerMove = (event: PointerEvent): void => {
        if (isDragging) return;
        const anchor = anchorPoint();
        const dx = event.clientX - anchor.x;
        const dy = event.clientY - anchor.y;
        const distance = Math.hypot(dx, dy);
        if (distance > magneticRadius || dy < 0) {
          // Outside reach or above the pivot — back to idle.
          idleSway.play();
          return;
        }
        idleSway.pause();
        // Map horizontal offset to a gentle lean (max ±6°).
        const lean = gsap.utils.clamp(-6, 6, (dx / magneticRadius) * 6);
        rotateTo(lean);
      };

      // ---- Drag handling ----------------------------------------------
      const stretchTo = gsap.quickTo(rope, "scaleY", {
        duration: 0.12,
        ease: "power2.out",
      });
      const tiltTo = gsap.quickTo(arm, "rotation", {
        duration: 0.18,
        ease: "power3.out",
      });

      const onPointerDown = (event: PointerEvent): void => {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        isDragging = true;
        idleSway.pause();
        dragStartY = event.clientY;
        dragStartX = event.clientX;
        handle.setPointerCapture(event.pointerId);
        root.dataset.dragging = "true";
      };

      const onPointerDrag = (event: PointerEvent): void => {
        if (!isDragging) return;
        const dy = Math.max(0, event.clientY - dragStartY);
        const dx = event.clientX - dragStartX;
        const stretch = Math.min(dy, MAX_STRETCH_PX);
        // scaleY relative to baseLength — keep transform-origin top.
        const scale = 1 + stretch / baseLength;
        stretchTo(scale);
        const lean = gsap.utils.clamp(-12, 12, dx * 0.08);
        tiltTo(lean);
      };

      const releaseRecoil = (didFire: boolean): void => {
        const tl = gsap.timeline({
          onComplete: () => {
            idleSway.play();
          },
        });
        tl.to(rope, {
          scaleY: 1,
          duration: 0.55,
          ease: "back.out(3)",
        }, 0);
        tl.to(arm, {
          rotation: 0,
          duration: 0.55,
          ease: "back.out(2.4)",
        }, 0);

        if (didFire) {
          // Bulb flicker — quick brightness/opacity stutter.
          const flicker = gsap.timeline();
          flicker
            .to(bulb, { opacity: 0.2, duration: 0.04, ease: "none" }, 0)
            .to(bulb, { opacity: 1, duration: 0.06, ease: "none" })
            .to(bulb, { opacity: 0.55, duration: 0.05, ease: "none" })
            .to(bulb, { opacity: 1, duration: 0.09, ease: "power1.out" });
          tl.add(flicker, 0);
        }
      };

      const onPointerUp = (event: PointerEvent): void => {
        if (!isDragging) return;
        const dy = Math.max(0, event.clientY - dragStartY);
        const didFire = dy >= DRAG_THRESHOLD_PX;
        isDragging = false;
        root.dataset.dragging = "false";
        try {
          handle.releasePointerCapture(event.pointerId);
        } catch {
          /* may already be released */
        }
        if (didFire) toggle();
        releaseRecoil(didFire);
      };

      const onPointerCancel = (): void => {
        if (!isDragging) return;
        isDragging = false;
        root.dataset.dragging = "false";
        releaseRecoil(false);
      };

      window.addEventListener("pointermove", onPointerMove);
      handle.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerDrag);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerCancel);

      return (): void => {
        window.removeEventListener("pointermove", onPointerMove);
        handle.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerDrag);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
      };
    }, root);

    return (): void => {
      ctx.revert();
    };
  }, [baseLength, magneticRadius, toggle]);

  return (
    <div
      ref={rootRef}
      aria-hidden="false"
      className={cn(
        "pointer-events-none absolute right-[clamp(16px,4vw,64px)] top-0 z-20",
        "h-[280px] w-[80px]",
        "select-none",
        className,
      )}
      data-dragging="false"
    >
      {/* Anchor pin on ceiling */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-0 -translate-x-1/2",
          "h-2 w-6 rounded-b-full",
          "bg-[color:var(--color-gold)]/70",
          "shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
        )}
      />

      {/* Swinging arm — rotates around top centre */}
      <div
        ref={armRef}
        className="absolute left-1/2 top-1 -translate-x-1/2 origin-top"
        style={{ height: baseLength + 40, width: 40 }}
      >
        {/* The rope itself — scaleY-stretches during drag, origin top */}
        <div
          ref={ropeRef}
          className="absolute left-1/2 top-0 origin-top -translate-x-1/2"
          style={{
            width: 6,
            height: baseLength,
            background:
              "linear-gradient(180deg, var(--color-gold) 0%, color-mix(in oklab, var(--color-gold) 75%, black) 100%)",
            borderRadius: 3,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.18) inset",
          }}
        >
          {/* Twisted-strand texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0 6px, rgba(0,0,0,0.22) 6px 7px)",
              borderRadius: 3,
            }}
          />
        </div>

        {/* Brass cap + bulb at the rope tip — this is the grab handle */}
        <button
          ref={setHandleRef}
          type="button"
          role="switch"
          aria-checked={mode === "night"}
          aria-label="Toggle decoration lighting between day and night"
          className={cn(
            "pointer-events-auto cursor-grab active:cursor-grabbing",
            "absolute left-1/2 -translate-x-1/2",
            "flex flex-col items-center",
            "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
            "rounded-full",
          )}
          style={{ top: baseLength - 2 }}
        >
          {/* Brass collar */}
          <span
            aria-hidden="true"
            className="block h-3 w-5 rounded-sm"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--color-gold) 80%, white) 0%, var(--color-gold) 60%, color-mix(in oklab, var(--color-gold) 60%, black) 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            }}
          />
          {/* Bulb */}
          <span
            ref={bulbRef}
            aria-hidden="true"
            className="mt-0.5 block h-7 w-7 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #FFF6DC 0%, #E8D5A8 35%, var(--color-gold) 75%, color-mix(in oklab, var(--color-gold) 55%, black) 100%)",
              boxShadow:
                mode === "night"
                  ? "0 0 24px rgba(232, 213, 168, 0.65), 0 0 8px rgba(232,213,168,0.9)"
                  : "0 2px 6px rgba(0,0,0,0.2)",
              transition: "box-shadow 480ms ease",
            }}
          />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Reduced-motion static rope                           */
/* -------------------------------------------------------------------------- */

type StaticRopeProps = {
  baseLength: number;
  className?: string;
};

function StaticRope({
  baseLength,
  className,
}: StaticRopeProps): React.ReactElement {
  const { mode, toggle } = useDecorSwitcher();
  const focusRef = useDecorKeyboardToggle<HTMLButtonElement>();

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-[clamp(16px,4vw,64px)] top-0 z-20",
        "h-[280px] w-[80px]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -translate-x-1/2 h-2 w-6 rounded-b-full bg-[color:var(--color-gold)]/70"
      />
      <div
        className="absolute left-1/2 top-1 -translate-x-1/2"
        style={{ height: baseLength + 40, width: 40 }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 6,
            height: baseLength,
            background:
              "linear-gradient(180deg, var(--color-gold) 0%, color-mix(in oklab, var(--color-gold) 75%, black) 100%)",
            borderRadius: 3,
          }}
        />
        <button
          ref={focusRef}
          type="button"
          role="switch"
          aria-checked={mode === "night"}
          aria-label="Toggle decoration lighting between day and night"
          onClick={toggle}
          className={cn(
            "pointer-events-auto absolute left-1/2 -translate-x-1/2",
            "flex flex-col items-center rounded-full",
            "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
          )}
          style={{ top: baseLength - 2 }}
        >
          <span
            aria-hidden="true"
            className="block h-3 w-5 rounded-sm"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--color-gold) 80%, white) 0%, var(--color-gold) 60%, color-mix(in oklab, var(--color-gold) 60%, black) 100%)",
            }}
          />
          <span
            aria-hidden="true"
            className="mt-0.5 block h-7 w-7 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #FFF6DC 0%, #E8D5A8 35%, var(--color-gold) 75%, color-mix(in oklab, var(--color-gold) 55%, black) 100%)",
              boxShadow:
                mode === "night"
                  ? "0 0 18px rgba(232, 213, 168, 0.6)"
                  : "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
