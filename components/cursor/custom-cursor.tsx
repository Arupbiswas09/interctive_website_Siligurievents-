"use client";

/**
 * CustomCursor — mode-aware brass cursor for Siligurievent.
 *
 * Modes (driven by `data-cursor` attribute on any element):
 *   "default" | "link" | "button" | "image" | "draggable" | "video" | "text" | "hidden"
 *
 * Visual: 8px brass dot at the centre + 28px ring lagging behind via
 * `gsap.quickTo`. Dot follows tightly (4-frame ease), ring trails (12-frame
 * ease). Modes morph ring/dot dimensions, colour, label and blend mode.
 *
 * The cursor is rendered into a portal at the top of <body> with a single
 * fixed wrapper at z-index 9999 and `pointer-events: none` so it never
 * blocks input.
 *
 * Detection rules (auto):
 *   - <a>, <button>                            → "link"
 *   - <input>, <textarea>, [contenteditable]   → "text"
 *   - [data-cursor="<mode>"]                   → that mode
 *   - inside [data-cursor="hidden"] subtree    → "hidden"
 *
 * Disabled on:
 *   - touch / coarse pointers      → render nothing
 *   - print media                  → render nothing
 *
 * `prefers-reduced-motion: reduce`:
 *   - cursor still renders but with NO lag (duration → 0)
 *   - glow + blink animations are dropped
 *
 * Accessibility:
 *   - `aria-hidden="true"` on the cursor; never substitutes for the system
 *     cursor for keyboard users — the system cursor remains visible to AT.
 */

import "@/lib/gsap/register";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useCursorModeStore } from "./cursor-context";

export type CursorMode =
  | "default"
  | "link"
  | "button"
  | "image"
  | "draggable"
  | "video"
  | "text"
  | "hidden";

type ResolvedCursor = {
  mode: CursorMode;
  label?: string;
  /** When mode is "button" we snap the ring to a specific rect. */
  snapRect?: DOMRect;
  snapRadius?: number;
};

const BRASS = "var(--color-gold, var(--brass-leaf, #b8893a))";
const BRASS_SOFT = "var(--color-gold-soft, #e8d5a8)";

/**
 * Walks up from `el` looking for cursor hints. Order: explicit data-cursor
 * wins (closest ancestor takes precedence), otherwise tag-based fallback.
 */
function resolveTarget(el: Element | null): ResolvedCursor {
  if (!el) return { mode: "default" };

  // Explicit attribute search — closest ancestor with data-cursor wins.
  const explicit = el.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    const mode = (explicit.dataset.cursor ?? "default") as CursorMode;
    const label = explicit.dataset.cursorLabel;

    if (mode === "button") {
      const rect = explicit.getBoundingClientRect();
      const styles = window.getComputedStyle(explicit);
      const radius = parseFloat(styles.borderTopLeftRadius) || 12;
      return { mode, label, snapRect: rect, snapRadius: radius };
    }
    return { mode, label };
  }

  // Tag-based fallback.
  const tagTarget = el.closest("a, button, input, textarea, [contenteditable=true]");
  if (tagTarget) {
    const tag = tagTarget.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || (tagTarget as HTMLElement).isContentEditable) {
      return { mode: "text" };
    }
    return { mode: "link" };
  }

  return { mode: "default" };
}

export function CustomCursor(): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Optional imperative override from context.
  const overrideMode = useCursorModeStore((s) => s.mode);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const modeRef = useRef<CursorMode>("default");

  // ----------------------------------------------------------------
  // Mount + environment gates.
  // ----------------------------------------------------------------
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const coarse = window.matchMedia("(pointer: coarse)");
    const print = window.matchMedia("print");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const computeEnabled = (): void => {
      setEnabled(!coarse.matches && !print.matches);
      setReducedMotion(motion.matches);
    };
    computeEnabled();

    coarse.addEventListener("change", computeEnabled);
    print.addEventListener("change", computeEnabled);
    motion.addEventListener("change", computeEnabled);
    return (): void => {
      coarse.removeEventListener("change", computeEnabled);
      print.removeEventListener("change", computeEnabled);
      motion.removeEventListener("change", computeEnabled);
    };
  }, []);

  // ----------------------------------------------------------------
  // Position + mode loop. GSAP-driven, no React state per frame.
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // quickTo factories — re-created on RM change so duration goes to 0.
    const dur = reducedMotion ? 0 : undefined;
    const dotXTo = gsap.quickTo(dot, "x", { duration: dur ?? 0.08, ease: "power3.out" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: dur ?? 0.08, ease: "power3.out" });
    const ringXTo = gsap.quickTo(ring, "x", { duration: dur ?? 0.22, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: dur ?? 0.22, ease: "power3.out" });

    const setRingW = gsap.quickSetter(ring, "width", "px");
    const setRingH = gsap.quickSetter(ring, "height", "px");
    const setRingRadius = gsap.quickSetter(ring, "borderRadius", "px");
    const setRingOpacity = gsap.quickSetter(ring, "opacity");
    const setDotOpacity = gsap.quickSetter(dot, "opacity");
    const setDotScale = gsap.quickSetter(dot, "scale");
    const setLabelOpacity = gsap.quickSetter(label, "opacity");
    const setLabelScale = gsap.quickSetter(label, "scale");

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let currentTarget: ResolvedCursor = { mode: "default" };

    const applyMode = (resolved: ResolvedCursor): void => {
      // If an imperative override is active (anything other than "default"),
      // it wins for the visual mode but we keep the resolved label so a
      // <CursorText> wrapper still shows the right label.
      const mode = overrideMode !== "default" ? overrideMode : resolved.mode;
      currentTarget = resolved;
      modeRef.current = mode;

      // Reset blend mode every cycle so it doesn't stick.
      ring.style.mixBlendMode = "normal";
      dot.style.mixBlendMode = "normal";

      switch (mode) {
        case "hidden": {
          setRingOpacity(0);
          setDotOpacity(0);
          setLabelOpacity(0);
          break;
        }
        case "default": {
          setRingOpacity(1);
          setDotOpacity(1);
          setDotScale(1);
          setLabelOpacity(0);
          setRingW(28);
          setRingH(28);
          setRingRadius(14);
          ring.style.boxShadow = "none";
          ring.style.backgroundColor = "transparent";
          ring.style.borderColor = BRASS;
          dot.style.backgroundColor = BRASS;
          break;
        }
        case "link": {
          setRingOpacity(1);
          setDotOpacity(1);
          setDotScale(0.85);
          setLabelOpacity(0);
          setRingW(48);
          setRingH(48);
          setRingRadius(24);
          ring.style.boxShadow = `0 0 24px ${BRASS_SOFT}`;
          ring.style.backgroundColor = "transparent";
          ring.style.borderColor = BRASS;
          dot.style.backgroundColor = BRASS;
          break;
        }
        case "button": {
          // Snap to bounds if we have them; otherwise behave like link.
          if (resolved.snapRect) {
            setRingOpacity(1);
            setDotOpacity(0);
            setLabelOpacity(0);
            const rect = resolved.snapRect;
            setRingW(rect.width);
            setRingH(rect.height);
            setRingRadius(resolved.snapRadius ?? 12);
            ring.style.boxShadow = `0 0 32px rgba(184, 137, 58, 0.35)`;
            ring.style.borderColor = BRASS;
            ring.style.backgroundColor = "transparent";
          } else {
            setRingOpacity(1);
            setDotOpacity(1);
            setRingW(48);
            setRingH(48);
            setRingRadius(24);
            ring.style.boxShadow = `0 0 24px ${BRASS_SOFT}`;
            ring.style.borderColor = BRASS;
          }
          break;
        }
        case "image": {
          setRingOpacity(1);
          setDotOpacity(0);
          setLabelOpacity(1);
          setLabelScale(1);
          setRingW(96);
          setRingH(96);
          setRingRadius(48);
          ring.style.boxShadow = "none";
          ring.style.backgroundColor = BRASS;
          ring.style.borderColor = BRASS;
          ring.style.mixBlendMode = "difference";
          label.textContent = resolved.label ?? "View";
          break;
        }
        case "draggable": {
          setRingOpacity(1);
          setDotOpacity(0);
          setLabelOpacity(1);
          setLabelScale(1);
          setRingW(72);
          setRingH(72);
          setRingRadius(36);
          ring.style.backgroundColor = BRASS;
          ring.style.borderColor = BRASS;
          ring.style.boxShadow = "none";
          label.textContent = resolved.label ?? "⇆";
          break;
        }
        case "video": {
          setRingOpacity(1);
          setDotOpacity(0);
          setLabelOpacity(1);
          setLabelScale(1);
          setRingW(96);
          setRingH(96);
          setRingRadius(48);
          ring.style.backgroundColor = BRASS;
          ring.style.borderColor = BRASS;
          ring.style.boxShadow = "none";
          label.textContent = "▶";
          break;
        }
        case "text": {
          setRingOpacity(0);
          setDotOpacity(1);
          setLabelOpacity(0);
          setDotScale(1);
          // Reshape dot into an I-beam.
          dot.style.backgroundColor = BRASS;
          dot.style.width = "2px";
          dot.style.height = "22px";
          dot.style.borderRadius = "1px";
          if (!reducedMotion) dot.style.animation = "sgv-cursor-blink 1s steps(2,end) infinite";
          break;
        }
      }

      // Reset dot box when leaving text mode.
      if (mode !== "text") {
        dot.style.width = "8px";
        dot.style.height = "8px";
        dot.style.borderRadius = "50%";
        dot.style.animation = "none";
      }
    };

    // Initial render.
    applyMode({ mode: "default" });
    gsap.set(dot, { x: pointerX, y: pointerY, xPercent: -50, yPercent: -50 });
    gsap.set(ring, { x: pointerX, y: pointerY, xPercent: -50, yPercent: -50 });

    const onMove = (event: PointerEvent): void => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      // Snap ring to button bounds — its position becomes the rect centre.
      if (modeRef.current === "button" && currentTarget.snapRect) {
        const r = currentTarget.snapRect;
        ringXTo(r.left + r.width / 2);
        ringYTo(r.top + r.height / 2);
      } else {
        ringXTo(pointerX);
        ringYTo(pointerY);
      }
      dotXTo(pointerX);
      dotYTo(pointerY);
    };

    const onOver = (event: PointerEvent): void => {
      const resolved = resolveTarget(event.target as Element | null);
      applyMode(resolved);
    };

    const onLeaveWindow = (): void => {
      setRingOpacity(0);
      setDotOpacity(0);
      setLabelOpacity(0);
    };

    const onEnterWindow = (): void => {
      applyMode(currentTarget);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    // Re-resolve when the user clicks (covers state-driven DOM swaps).
    const onClick = (event: MouseEvent): void => {
      const resolved = resolveTarget(event.target as Element | null);
      applyMode(resolved);
    };
    window.addEventListener("click", onClick);

    return (): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      window.removeEventListener("click", onClick);
    };
  }, [enabled, reducedMotion, overrideMode]);

  if (!mounted || !enabled || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        contain: "layout style paint",
      }}
    >
      <style>{`
        @keyframes sgv-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sgv-cursor-ring, .sgv-cursor-dot, .sgv-cursor-label {
            transition: none !important;
            animation: none !important;
          }
        }
        @media print {
          .sgv-cursor-root { display: none !important; }
        }
      `}</style>
      <div
        ref={ringRef}
        className="sgv-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: 14,
          border: `1.5px solid ${BRASS}`,
          backgroundColor: "transparent",
          willChange: "transform, width, height, border-radius, opacity",
          transition:
            "width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1), border-radius 220ms cubic-bezier(0.22,1,0.36,1), background-color 220ms ease, box-shadow 220ms ease, opacity 200ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          ref={labelRef}
          className="sgv-cursor-label"
          style={{
            color: "#0b0b0b",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: 0,
            transition: "opacity 200ms ease, transform 200ms ease",
            transformOrigin: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
      <div
        ref={dotRef}
        className="sgv-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: BRASS,
          willChange: "transform, width, height, opacity",
          transition: "background-color 200ms ease, opacity 200ms ease",
          pointerEvents: "none",
        }}
      />
    </div>,
    document.body
  );
}

export default CustomCursor;
