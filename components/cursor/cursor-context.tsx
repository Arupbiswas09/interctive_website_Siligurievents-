"use client";

/**
 * CursorContext — optional imperative override layer for CustomCursor.
 *
 * Usage:
 *   <CursorProvider>
 *     <CustomCursor />
 *     ...
 *   </CursorProvider>
 *
 *   const { mode, setMode } = useCursorMode();
 *   useEffect(() => {
 *     setMode("hidden");
 *     return () => setMode("default");
 *   }, []);
 *
 * Implementation uses a tiny external store (subscribe / get / set) so the
 * cursor itself can read changes WITHOUT triggering React re-renders of the
 * whole subtree — only the cursor's `useSyncExternalStore`-style hook below
 * observes it. The hook `useCursorMode()` is the consumer-facing API; if no
 * provider is mounted the override defaults to "default" and the cursor
 * falls back to attribute-based detection.
 */

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CursorMode } from "./custom-cursor";

type Listener = () => void;

type CursorStore = {
  get: () => { mode: CursorMode };
  set: (mode: CursorMode) => void;
  subscribe: (listener: Listener) => () => void;
};

function createCursorStore(initial: CursorMode = "default"): CursorStore {
  let state: { mode: CursorMode } = { mode: initial };
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set: (mode) => {
      if (state.mode === mode) return;
      state = { mode };
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
  };
}

// A module-level fallback store so `useCursorMode()` works even without a
// provider — keeps the cursor purely additive.
const fallbackStore = createCursorStore("default");

const CursorContext = createContext<CursorStore>(fallbackStore);

export type CursorProviderProps = {
  children: ReactNode;
};

export function CursorProvider({ children }: CursorProviderProps): React.ReactElement {
  const storeRef = useRef<CursorStore | null>(null);
  if (!storeRef.current) storeRef.current = createCursorStore("default");

  // Keep a stable reference for the lifetime of the provider.
  const value = useMemo(() => storeRef.current!, []);
  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

/**
 * useCursorModeStore — internal hook for CustomCursor to subscribe with a
 * stable selector. Equivalent to a tiny Zustand-style hook.
 */
export function useCursorModeStore<T>(selector: (state: { mode: CursorMode }) => T): T {
  const store = useContext(CursorContext);
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get())
  );
}

/**
 * useCursorMode — public imperative API for consumers.
 *
 * Returns the current override mode + a setter. Setting "default" releases
 * the override and the cursor reverts to attribute-based detection.
 */
export function useCursorMode(): {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
} {
  const store = useContext(CursorContext);
  const mode = useSyncExternalStore(
    store.subscribe,
    () => store.get().mode,
    () => store.get().mode
  );
  // Memoise so callers can use the return value safely as an effect dep.
  const setMode = useMemo(() => store.set, [store]);
  return { mode, setMode };
}
