"use client";

/**
 * Case study — Image gallery (Selected frames).
 *
 * Variable-span 12-col masonry grid. Each tile renders SplitImage with
 * panels=3 + trigger="hover". Clicking a tile opens a Framer Motion
 * AnimatePresence lightbox — black scrim, scaled image, prev/next, ESC
 * closes, arrow-key navigation.
 *
 * Honours reduced motion via the underlying SplitImage primitive.
 */

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitImage } from "@/components/effects/3d-split-image";

interface CaseStudyImageGalleryProps {
  images: ReadonlyArray<string>;
}

// 12-col masonry spans tuned for a 3-row rhythm (8 tiles).
const SPAN_PATTERN: ReadonlyArray<{
  col: string;
  row: string;
  aspect: string;
}> = [
  { col: "md:col-span-7", row: "md:row-span-2", aspect: "16 / 11" },
  { col: "md:col-span-5", row: "md:row-span-1", aspect: "4 / 5" },
  { col: "md:col-span-5", row: "md:row-span-1", aspect: "4 / 5" },
  { col: "md:col-span-4", row: "md:row-span-1", aspect: "1 / 1" },
  { col: "md:col-span-4", row: "md:row-span-1", aspect: "1 / 1" },
  { col: "md:col-span-4", row: "md:row-span-1", aspect: "1 / 1" },
  { col: "md:col-span-8", row: "md:row-span-1", aspect: "16 / 9" },
  { col: "md:col-span-4", row: "md:row-span-1", aspect: "3 / 4" },
];

export function CaseStudyImageGallery({
  images,
}: CaseStudyImageGalleryProps): ReactElement {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = images.length;

  const open = useCallback((idx: number): void => {
    setActiveIndex(idx);
  }, []);

  const close = useCallback((): void => {
    setActiveIndex(null);
  }, []);

  const next = useCallback((): void => {
    setActiveIndex((cur) => (cur === null ? null : (cur + 1) % total));
  }, [total]);

  const prev = useCallback((): void => {
    setActiveIndex((cur) =>
      cur === null ? null : (cur - 1 + total) % total,
    );
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return (): void => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  // Body scroll lock when lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = original;
    };
  }, [activeIndex]);

  const tiles = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        spans: SPAN_PATTERN[i % SPAN_PATTERN.length] ?? SPAN_PATTERN[0]!,
      })),
    [images],
  );

  return (
    <Section tone="default" spacing="xl" as="section">
      <Container>
        <header className="mb-[var(--space-12)] flex items-baseline justify-between gap-[var(--space-6)]">
          <Eyebrow tone="accent">Selected frames</Eyebrow>
          <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
            {total.toString().padStart(2, "0")} photographs
          </span>
        </header>

        <ul
          className={cn(
            "grid grid-cols-1 gap-[var(--space-4)]",
            "md:grid-cols-12 md:auto-rows-[200px] md:gap-[var(--space-4)]",
          )}
        >
          {tiles.map((tile, i) => (
            <li
              key={`${tile.src}-${i.toString()}`}
              className={cn("relative", tile.spans.col, tile.spans.row)}
              style={{ aspectRatio: tile.spans.aspect }}
            >
              <button
                type="button"
                onClick={() => open(i)}
                className={cn(
                  "group block h-full w-full cursor-pointer",
                  "rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[color:var(--color-bg)]",
                )}
                aria-label={`View photograph ${i + 1} of ${total}`}
              >
                <SplitImage
                  src={tile.src}
                  alt={`Photograph ${i + 1}`}
                  panels={3}
                  trigger="hover"
                  width={1600}
                  height={1000}
                  className="h-full w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && images[activeIndex] ? (
          <motion.div
            key="case-study-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${activeIndex + 1} of ${total}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed inset-0 z-[100] flex items-center justify-center",
              "bg-[#0a0807]/96 backdrop-blur-sm",
            )}
            onClick={close}
          >
            <motion.div
              key={`lightbox-image-${activeIndex}`}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[88vh] w-[92vw] max-w-[1400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]!}
                alt={`Photograph ${activeIndex + 1}`}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Controls */}
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className={cn(
                "absolute right-[var(--space-6)] top-[var(--space-6)] z-10",
                "flex h-12 w-12 items-center justify-center rounded-full",
                "border border-[#F5EDE0]/30 text-[#F5EDE0]",
                "transition-colors hover:bg-[#F5EDE0]/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]",
              )}
            >
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>

            <NavButton direction="prev" onClick={(e) => { e.stopPropagation(); prev(); }} />
            <NavButton direction="next" onClick={(e) => { e.stopPropagation(); next(); }} />

            <p
              aria-live="polite"
              className={cn(
                "pointer-events-none absolute bottom-[var(--space-6)] left-1/2 -translate-x-1/2",
                "text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)]",
                "text-[#F5EDE0]/70",
              )}
            >
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}

// ---------------------------------------------------------------------------

interface NavButtonProps {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
}

function NavButton({ direction, onClick }: NavButtonProps): ReactElement {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous photograph" : "Next photograph"}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2",
        isPrev ? "left-[var(--space-6)]" : "right-[var(--space-6)]",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "border border-[#F5EDE0]/30 text-[#F5EDE0]",
        "transition-[colors,transform] hover:bg-[#F5EDE0]/10",
        isPrev ? "hover:-translate-x-0.5" : "hover:translate-x-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]",
      )}
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {isPrev ? "‹" : "›"}
      </span>
    </button>
  );
}
