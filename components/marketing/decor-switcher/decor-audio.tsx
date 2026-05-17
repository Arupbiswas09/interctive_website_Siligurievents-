"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDecorSwitcher } from "./decor-switcher-context";

type DecorAudioProps = {
  className?: string;
  /** Source URL for the soft click sample. */
  clickSrc?: string;
  /** Source URL for the ambient swell sample. */
  swellSrc?: string;
};

const AUDIO_STORAGE_KEY = "audioEnabled";

/**
 * DecorAudio
 *
 * Optional sound design layer for the switcher. Off by default.
 *
 * Behaviour:
 *  - Reads `sessionStorage["audioEnabled"]` on mount; default = false.
 *  - Renders a compact mute toggle inside the section header.
 *  - On mode change, plays a soft click + a subtle ambient swell.
 *  - Honours `prefers-reduced-motion` — the click still plays (it's a UI
 *    confirmation), but the ambient swell is suppressed.
 *  - Audio elements are created lazily, after the first toggle, so no
 *    bytes load until the user opts in.
 *
 * Source paths default to `/media/sfx/decor-click.mp3` and
 * `/media/sfx/decor-swell.mp3`. The owner uploads these; missing files
 * fail silently (catch on `.play()`).
 */
export function DecorAudio({
  className,
  clickSrc = "/media/sfx/decor-click.mp3",
  swellSrc = "/media/sfx/decor-swell.mp3",
}: DecorAudioProps): React.ReactElement {
  const { mode, isHydrated } = useDecorSwitcher();
  const [enabled, setEnabled] = useState<boolean>(false);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const swellRef = useRef<HTMLAudioElement | null>(null);
  const prevModeRef = useRef<typeof mode | null>(null);

  // Hydrate the opt-in flag from sessionStorage.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(AUDIO_STORAGE_KEY);
      setEnabled(raw === "true");
    } catch {
      /* noop */
    }
  }, []);

  // Lazily attach <audio> elements once enabled.
  useEffect(() => {
    if (!enabled) return;
    if (!clickRef.current) {
      const click = new Audio(clickSrc);
      click.preload = "auto";
      click.volume = 0.55;
      clickRef.current = click;
    }
    if (!swellRef.current) {
      const swell = new Audio(swellSrc);
      swell.preload = "auto";
      swell.volume = 0.32;
      swellRef.current = swell;
    }
  }, [enabled, clickSrc, swellSrc]);

  // Play SFX on mode change (skip the very first render).
  useEffect(() => {
    if (!isHydrated) return;
    if (prevModeRef.current === null) {
      prevModeRef.current = mode;
      return;
    }
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;

    if (!enabled) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const click = clickRef.current;
    if (click) {
      try {
        click.currentTime = 0;
        void click.play();
      } catch {
        /* user-gesture restrictions — fail silently */
      }
    }

    if (!prefersReduced) {
      const swell = swellRef.current;
      if (swell) {
        try {
          swell.currentTime = 0;
          void swell.play();
        } catch {
          /* noop */
        }
      }
    }
  }, [mode, enabled, isHydrated]);

  const toggleEnabled = useCallback((): void => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.sessionStorage.setItem(AUDIO_STORAGE_KEY, next ? "true" : "false");
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggleEnabled}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute switcher sound" : "Enable switcher sound"}
      className={cn(
        "inline-flex h-9 items-center gap-[var(--space-2)] rounded-full",
        "border border-[color:var(--color-border)]",
        "px-[var(--space-3)]",
        "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
        "text-[color:var(--color-ink-muted)]",
        "transition-colors hover:text-[color:var(--color-ink)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
        className,
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {enabled ? "♪" : "•"}
      </span>
      <span>{enabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
