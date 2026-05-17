"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Curtain, type CurtainTransitionDetail } from "@/components/transitions/curtain";
import { InterceptNav } from "@/lib/transitions/intercept-nav";

/**
 * TransitionProvider — wraps the site, mounts the navigation interceptor
 * and renders the `<Curtain>` into a `<body>`-level portal.
 *
 * The portal target is `document.body` so the curtain z-stacks above every
 * route's own chrome (sticky headers, modals) without inheriting their
 * `transform` or `filter` contexts (which would otherwise destroy
 * `position: fixed`).
 *
 * Public API:
 *   - `<TransitionProvider>` wraps the route subtree.
 *   - `useTransitionState()` returns `{ isTransitioning, fromPath, toPath }`
 *     so consumers can co-ordinate with the in-flight cycle (e.g. disable
 *     a heavy hover effect while the curtain is up).
 */

export type TransitionState = {
  isTransitioning: boolean;
  fromPath: string | null;
  toPath: string | null;
};

const DEFAULT_STATE: TransitionState = {
  isTransitioning: false,
  fromPath: null,
  toPath: null,
};

const TransitionStateContext = createContext<TransitionState>(DEFAULT_STATE);

export function useTransitionState(): TransitionState {
  return useContext(TransitionStateContext);
}

export function TransitionProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<TransitionState>(DEFAULT_STATE);

  // We keep a ref to the latest state to avoid stale-closure re-subscribes
  // in the event handlers below. State setter is still the source of truth
  // for renders.
  const stateRef = useRef<TransitionState>(DEFAULT_STATE);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onStart(event: Event): void {
      const detail = (event as CustomEvent<CurtainTransitionDetail>).detail;
      const next: TransitionState = {
        isTransitioning: true,
        fromPath: detail?.fromPath ?? null,
        toPath: detail?.toPath ?? null,
      };
      stateRef.current = next;
      setState(next);
    }

    function onEnd(): void {
      const next: TransitionState = {
        isTransitioning: false,
        // Keep the last fromPath/toPath visible for consumers that want
        // to know what just settled (e.g., "fresh-arrival" hero replays).
        fromPath: stateRef.current.fromPath,
        toPath: stateRef.current.toPath,
      };
      stateRef.current = next;
      setState(next);
    }

    window.addEventListener("sgv:transition-start", onStart);
    window.addEventListener("sgv:transition-end", onEnd);

    return (): void => {
      window.removeEventListener("sgv:transition-start", onStart);
      window.removeEventListener("sgv:transition-end", onEnd);
    };
  }, []);

  const value = useMemo<TransitionState>(
    () => ({
      isTransitioning: state.isTransitioning,
      fromPath: state.fromPath,
      toPath: state.toPath,
    }),
    [state.isTransitioning, state.fromPath, state.toPath]
  );

  return (
    <TransitionStateContext.Provider value={value}>
      <InterceptNav />
      {children}
      {mounted && typeof document !== "undefined"
        ? createPortal(<Curtain />, document.body)
        : null}
    </TransitionStateContext.Provider>
  );
}
