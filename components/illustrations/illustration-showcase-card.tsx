"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  JasmineBloomUnfurl,
  type JasmineBloomUnfurlHandle,
} from "./jasmine-bloom-unfurl";
import { DiyaFlicker } from "./diya-flicker";
import { MehendiDraw } from "./mehendi-draw";
import {
  RegionPinReveal,
  type RegionPinRevealHandle,
} from "./region-pin-reveal";
import { BrassDividerSpin } from "./brass-divider-spin";
import { MarigoldPetalFall } from "./marigold-petal-fall";

export type IllustrationShowcaseVariant =
  | "jasmine-unfurl"
  | "diya-flicker"
  | "mehendi-draw"
  | "region-pin"
  | "brass-divider"
  | "petal-fall";

export type IllustrationShowcaseCardProps = {
  variant: IllustrationShowcaseVariant;
  title: string;
  caption: string;
  code: string;
};

/**
 * Internal showcase card used only by `/design/illustrations`. Mounts a
 * single animated illustration, exposes a "Replay" button for the variants
 * that play once (jasmine, mehendi, pin, divider), and provides remount
 * fallback for the continuous variants (diya, petal-fall) by toggling a
 * key — useful for verifying perf hygiene during review.
 */
export function IllustrationShowcaseCard({
  variant,
  title,
  caption,
  code,
}: IllustrationShowcaseCardProps): React.ReactElement {
  const [remountKey, setRemountKey] = useState(0);
  const jasmineHandle = useRef<JasmineBloomUnfurlHandle | null>(null);
  const pinHandle = useRef<RegionPinRevealHandle | null>(null);

  const replay = (): void => {
    switch (variant) {
      case "jasmine-unfurl":
        jasmineHandle.current?.replay();
        return;
      case "region-pin":
        pinHandle.current?.replay();
        return;
      default:
        // Variants that play on scroll or run continuously — remount.
        setRemountKey((k) => k + 1);
    }
  };

  const renderPreview = (): React.ReactElement => {
    switch (variant) {
      case "jasmine-unfurl":
        return (
          <JasmineBloomUnfurl
            key={remountKey}
            handleRef={jasmineHandle}
            size={140}
            tone="gold"
          />
        );
      case "diya-flicker":
        return <DiyaFlicker key={remountKey} size={140} tone="brass" />;
      case "mehendi-draw":
        return (
          <MehendiDraw key={remountKey} height={90} tone="gold" />
        );
      case "region-pin":
        return (
          <RegionPinReveal
            key={remountKey}
            handleRef={pinHandle}
            size={120}
            triggerOnScroll={false}
            tone="accent"
          />
        );
      case "brass-divider":
        return <BrassDividerSpin key={remountKey} height={48} tone="brass" />;
      case "petal-fall":
        return (
          <div
            key={remountKey}
            className="relative h-full w-full"
          >
            <MarigoldPetalFall
              className="absolute inset-0"
              tone="gold"
              maxPetals={6}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-4)] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-[var(--space-6)]">
      <div className="flex items-baseline justify-between gap-[var(--space-3)]">
        <h3 className="text-[length:var(--text-base)] font-medium text-[color:var(--color-ink)]">
          {title}
        </h3>
        <button
          type="button"
          onClick={replay}
          className={cn(
            "text-[length:var(--text-xs)] font-mono uppercase tracking-wider",
            "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)]",
            "transition-colors"
          )}
        >
          Replay
        </button>
      </div>
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[color:var(--color-bg-elevated)]">
        {renderPreview()}
      </div>
      <p className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
        {caption}
      </p>
      <pre className="overflow-x-auto border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-[var(--space-3)] font-mono text-[length:var(--text-xs)] text-[color:var(--color-ink-muted)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
