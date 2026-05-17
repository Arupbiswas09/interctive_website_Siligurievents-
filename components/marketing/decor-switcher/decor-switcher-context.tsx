"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

/**
 * Decor mode — the section can be lit for daytime or after-dark.
 * State persists per session via sessionStorage (`decorMode`).
 */
export type DecorMode = "day" | "night";

type DecorSwitcherContextValue = {
  mode: DecorMode;
  /** Flip between day and night. */
  toggle: () => void;
  /** Set the mode explicitly (idempotent). */
  setMode: (mode: DecorMode) => void;
  /** True once the value has been hydrated from sessionStorage. */
  isHydrated: boolean;
};

const STORAGE_KEY = "decorMode";
const DEFAULT_MODE: DecorMode = "day";

const DecorSwitcherContext = createContext<DecorSwitcherContextValue | null>(
  null,
);

/**
 * Reads the persisted choice from sessionStorage. SSR-safe.
 * Returns `null` if no valid value exists yet.
 */
function readPersistedMode(): DecorMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === "day" || raw === "night") return raw;
  } catch {
    /* sessionStorage may be unavailable in privacy modes — fail open. */
  }
  return null;
}

type DecorSwitcherProviderProps = {
  children: ReactNode;
  initialMode?: DecorMode;
};

/**
 * Provider for the Day ↔ Night decor switcher.
 *
 * - SSR-renders with `initialMode` (default: day) to avoid a hydration flash.
 * - On mount, reads `sessionStorage["decorMode"]` and reconciles.
 * - Persists every change back to sessionStorage.
 * - Listens for `Space` key globally while the section has focus
 *   (handled by the section root passing `focused` via a ref attached
 *    in the rope/toggle — see `useDecorKeyboardToggle`).
 */
export function DecorSwitcherProvider({
  children,
  initialMode = DEFAULT_MODE,
}: DecorSwitcherProviderProps): React.ReactElement {
  const [mode, setModeState] = useState<DecorMode>(initialMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage exactly once.
  useEffect(() => {
    const stored = readPersistedMode();
    if (stored && stored !== mode) {
      setModeState(stored);
    }
    setIsHydrated(true);
    // mode is intentionally omitted — we only want to read once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMode = useCallback((next: DecorMode): void => {
    setModeState((current) => {
      if (current === next) return current;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* swallow — UI still works without persistence */
      }
      return next;
    });
  }, []);

  const toggle = useCallback((): void => {
    setModeState((current) => {
      const next: DecorMode = current === "day" ? "night" : "day";
      try {
        window.sessionStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const value = useMemo<DecorSwitcherContextValue>(
    () => ({ mode, toggle, setMode, isHydrated }),
    [mode, toggle, setMode, isHydrated],
  );

  return (
    <DecorSwitcherContext.Provider value={value}>
      {children}
    </DecorSwitcherContext.Provider>
  );
}

/**
 * Consume the decor switcher context. Throws if used outside the provider —
 * we want a loud failure in dev, not a silent no-op.
 */
export function useDecorSwitcher(): DecorSwitcherContextValue {
  const ctx = useContext(DecorSwitcherContext);
  if (!ctx) {
    throw new Error(
      "useDecorSwitcher must be used inside <DecorSwitcherProvider>",
    );
  }
  return ctx;
}

/**
 * Attach Space-key keyboard handling to a focusable element.
 *
 * Returns a ref to attach to the focus surface (rope handle or toggle).
 * While that element (or any descendant) holds focus, pressing Space
 * toggles the decor mode and prevents the page from scrolling.
 *
 * This keeps keyboard support scoped — the section won't hijack Space
 * for the entire page.
 */
export function useDecorKeyboardToggle<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { toggle } = useDecorSwitcher();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onKey = (event: KeyboardEvent): void => {
      if (event.code !== "Space" && event.key !== " ") return;
      // Only fire when the focused element is this one or its descendant.
      const active = document.activeElement;
      if (active !== el && !el.contains(active)) return;
      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", onKey);
    return (): void => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return ref;
}
