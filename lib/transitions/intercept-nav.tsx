"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  classifyTransition,
  variantCommitMs,
  variantDurationMs,
  type CurtainVariant,
} from "@/lib/transitions/route-classifier";
import type { CurtainTransitionDetail } from "@/components/transitions/curtain";

/**
 * InterceptNav — global click handler that turns Next.js client-side
 * navigations into orchestrated cinematic transitions.
 *
 * Strategy
 * --------
 * One delegated `click` listener on `document.body` (capture phase) inspects
 * each event before the framework's default `<Link>` handler runs. For
 * candidates that qualify (see below), we:
 *
 *   1. `preventDefault()` the native navigation.
 *   2. Resolve the variant for (fromPath → toPath) via the route classifier.
 *   3. Dispatch a `"sgv:transition-start"` CustomEvent. The `<Curtain>`
 *      catches this and starts its sweep.
 *   4. Wait `variantCommitMs(variant)` (the "covered" beat), then call
 *      `router.push(href)` — the new route mounts under the cover.
 *   5. After `variantDurationMs(variant)` from the initial dispatch, fire
 *      `"sgv:transition-end"` so listeners know the cycle is done.
 *
 * Disqualifications (we let the browser / Next.js handle them as-is):
 *   - Modifier keys held (cmd, ctrl, shift, alt) — user wants new tab/window.
 *   - Middle-click or right-click — let the browser do its thing.
 *   - The anchor has `target="_blank"` or `download` or `rel="external"`.
 *   - The href is external, a hash-only link, mailto:, tel:, or sms:.
 *   - The destination resolves to the current pathname.
 *   - Any ancestor has `data-no-transition` (escape hatch).
 *
 * Aborts
 * ------
 * If a second click lands while one transition is mid-flight, we kill the
 * pending commit timer and the pending end timer; the curtain's own GSAP
 * timeline self-kills via its `sgv:transition-start` handler. Result: the
 * new sweep starts cleanly without "ghost" end events.
 *
 * This component renders nothing — it's a side-effect-only mount that
 * `<TransitionProvider>` includes once.
 */
export function InterceptNav(): null {
  const router = useRouter();
  const pathname = usePathname();

  // Track in-flight transition so we can abort cleanly.
  const inFlightRef = useRef<{
    commitTimer: ReturnType<typeof setTimeout> | null;
    endTimer: ReturnType<typeof setTimeout> | null;
    toPath: string | null;
  }>({
    commitTimer: null,
    endTimer: null,
    toPath: null,
  });

  // Keep latest pathname accessible from the (stable) click handler.
  const pathnameRef = useRef<string | null>(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function clearTimers(): void {
      const ref = inFlightRef.current;
      if (ref.commitTimer !== null) {
        clearTimeout(ref.commitTimer);
        ref.commitTimer = null;
      }
      if (ref.endTimer !== null) {
        clearTimeout(ref.endTimer);
        ref.endTimer = null;
      }
    }

    function dispatchStart(detail: CurtainTransitionDetail): void {
      const event = new CustomEvent<CurtainTransitionDetail>(
        "sgv:transition-start",
        { detail }
      );
      window.dispatchEvent(event);
    }

    function dispatchEnd(): void {
      const event = new Event("sgv:transition-end");
      window.dispatchEvent(event);
    }

    function isModified(e: MouseEvent): boolean {
      return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    }

    function resolveAnchor(target: EventTarget | null): HTMLAnchorElement | null {
      let node = target as Node | null;
      while (node !== null) {
        if (node instanceof HTMLAnchorElement) return node;
        node = (node as Node).parentNode;
      }
      return null;
    }

    function hasOptOutAncestor(start: Element | null): boolean {
      let el: Element | null = start;
      while (el !== null) {
        if (el.hasAttribute?.("data-no-transition")) return true;
        el = el.parentElement;
      }
      return false;
    }

    function onClick(e: MouseEvent): void {
      // Only main button. button === 0 is left click.
      if (e.button !== 0) return;
      if (isModified(e)) return;
      if (e.defaultPrevented) return;

      const anchor = resolveAnchor(e.target);
      if (!anchor) return;

      // Same-origin only. `href` is the resolved URL string.
      const href = anchor.getAttribute("href");
      if (href === null || href === "") return;

      // Skip explicit "open elsewhere" intents.
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      const rel = anchor.getAttribute("rel") ?? "";
      if (/\bexternal\b/i.test(rel)) return;

      // Skip non-navigation protocols.
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("sms:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      // Pure hash on the current page — leave to the browser.
      if (href.startsWith("#")) return;

      // Resolve to a URL so we can check origin + pathname.
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      // Escape hatch: any ancestor opts out.
      if (anchor.hasAttribute("data-no-transition")) return;
      if (hasOptOutAncestor(anchor)) return;

      const fromPath = pathnameRef.current ?? window.location.pathname;
      const toPath = url.pathname;

      // Same path (possibly different hash/search) → no transition.
      if (toPath === fromPath) return;

      const variant: CurtainVariant = classifyTransition(fromPath, toPath);

      // We are committed to handling this navigation — stop the framework.
      e.preventDefault();

      // Abort any in-flight cycle. The curtain's own GSAP timeline kills
      // itself when it receives a new "sgv:transition-start".
      clearTimers();

      dispatchStart({ variant, fromPath, toPath });

      // Preserve search + hash on push.
      const destination = `${url.pathname}${url.search}${url.hash}`;

      const commitMs = variantCommitMs(variant);
      const totalMs = variantDurationMs(variant);

      const doPush = (): void => {
        // `router.push` returns void but kicks off the App Router transition.
        router.push(destination);
      };

      if (commitMs === 0) {
        // Variant "none" or reduced/save-data path — push immediately and
        // let the template/View Transition own the visual hand-off.
        doPush();
      } else {
        inFlightRef.current.commitTimer = setTimeout(() => {
          inFlightRef.current.commitTimer = null;
          doPush();
        }, commitMs);
      }

      inFlightRef.current.toPath = toPath;
      inFlightRef.current.endTimer = setTimeout(
        () => {
          inFlightRef.current.endTimer = null;
          inFlightRef.current.toPath = null;
          dispatchEnd();
        },
        // Always fire an end event, even for "none" — listeners like
        // analytics rely on the symmetric start/end pair.
        Math.max(totalMs, 16)
      );
    }

    document.body.addEventListener("click", onClick, { capture: true });
    return (): void => {
      document.body.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, [router]);

  return null;
}
