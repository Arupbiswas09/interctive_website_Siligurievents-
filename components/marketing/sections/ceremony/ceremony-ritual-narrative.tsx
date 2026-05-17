"use client";

import "@/lib/gsap/register";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { CeremonyTheme } from "@/lib/ceremony/theme";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

type CeremonyRitualNarrativeProps = {
  theme: CeremonyTheme;
};

type PaletteStyle = CSSProperties & {
  "--color-bg": string;
  "--color-bg-soft": string;
  "--color-ink": string;
  "--color-accent": string;
  "--color-accent-deep": string;
  "--color-gold": string;
  "--color-gold-deep": string;
  "--color-gold-soft": string;
};

/**
 * CeremonyRitualNarrative
 *
 * Pinned GSAP scroll-narrative. Walks the user through the 5 stages of a
 * ceremony — text + image cross-fade per stage on a single ScrollTrigger.
 * Honors `prefers-reduced-motion` and gracefully falls back to a stacked
 * mobile-style list for both reduced motion and < md viewports.
 */
export function CeremonyRitualNarrative({
  theme,
}: CeremonyRitualNarrativeProps): ReactElement {
  const stages = theme.ritualStages;
  const total = stages.length;

  const prefersReduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const textStagesRef = useRef<HTMLDivElement | null>(null);
  const imageStagesRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const diamondRef = useRef<HTMLSpanElement | null>(null);

  const paletteStyle: PaletteStyle = {
    "--color-bg": theme.palette.bg,
    "--color-bg-soft": theme.palette.bgSoft,
    "--color-ink": theme.palette.ink,
    "--color-accent": theme.palette.accent,
    "--color-accent-deep": theme.palette.accentDeep,
    "--color-gold": theme.palette.gold,
    "--color-gold-deep": theme.palette.goldDeep,
    "--color-gold-soft": theme.palette.goldSoft,
    backgroundColor: theme.palette.bg,
    color: theme.palette.ink,
  };

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === "undefined") return;

    const pin = pinRef.current;
    const textWrap = textStagesRef.current;
    const imageWrap = imageStagesRef.current;
    const dotsWrap = dotsRef.current;
    const counter = counterRef.current;
    const diamond = diamondRef.current;
    if (!pin || !textWrap || !imageWrap || !dotsWrap) return;

    // Skip the pin on small viewports — the mobile layout already shows
    // every stage stacked.
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const ctx = gsap.context(() => {
      const texts = textWrap.querySelectorAll<HTMLElement>("[data-stage-text]");
      const images = imageWrap.querySelectorAll<HTMLElement>(
        "[data-stage-image]",
      );
      const innerImgs = imageWrap.querySelectorAll<HTMLElement>(
        "[data-stage-image-inner]",
      );
      const dots = dotsWrap.querySelectorAll<HTMLElement>("[data-stage-dot]");

      if (texts.length === 0 || images.length === 0) return;

      // Initial state — only stage 0 visible.
      gsap.set(texts, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
      gsap.set(images, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
      gsap.set(innerImgs, { scale: 1, transformOrigin: "50% 50%" });

      // Each stage occupies ~1 viewport of scroll. Final stage gets an extra
      // half-viewport so the last image has time to settle before unpinning.
      const endDistance = (): number => window.innerHeight * total;

      // Ken Burns on the active image — runs in lockstep with the scrub.
      const kenBurns = gsap.to(innerImgs, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${endDistance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Master timeline scrubbed by the same ScrollTrigger.
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${endDistance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            // Map progress 0..1 to a stage index 0..total-1.
            const index = Math.min(
              total - 1,
              Math.floor(progress * total - 1e-6 + 0),
            );
            const safeIndex = Math.max(0, index);

            if (counter) {
              counter.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
            }

            dots.forEach((dot, i) => {
              dot.dataset.active = i === safeIndex ? "true" : "false";
            });

            if (diamond) {
              // Travel the brass diamond down the central hairline.
              diamond.style.transform = `translate3d(-50%, ${progress * 100}%, 0) rotate(45deg)`;
            }
          },
        },
      });

      // Build the cross-fade segments. We allocate equal slots per stage;
      // each transition consumes a fraction of that slot.
      for (let i = 0; i < total - 1; i += 1) {
        const transitionAt = (i + 1) / total;
        const transitionDur = 0.6 / total; // fraction of total timeline
        const startAt = transitionAt - transitionDur;

        master.to(
          texts[i],
          { autoAlpha: 0, duration: transitionDur, ease: "power1.inOut" },
          startAt,
        );
        master.to(
          texts[i + 1],
          { autoAlpha: 1, duration: transitionDur, ease: "power1.inOut" },
          startAt,
        );
        master.to(
          images[i],
          { autoAlpha: 0, duration: transitionDur, ease: "power1.inOut" },
          startAt,
        );
        master.to(
          images[i + 1],
          { autoAlpha: 1, duration: transitionDur, ease: "power1.inOut" },
          startAt,
        );
      }

      // Refresh once after layout settles to catch any font-loading shifts.
      ScrollTrigger.refresh();

      // Cleanup — refs to keep linter happy about unused locals.
      void kenBurns;
      void master;
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced, total]);

  // Reduced motion / mobile fallback content — also rendered on desktop
  // below `md` via Tailwind responsive classes.
  const stackedFallback = (
    <div className="md:hidden">
      <Container>
        <div className="relative pb-[var(--space-16)]">
          {/* Vertical dotted spine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-[18px] w-px"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${theme.palette.goldDeep} 0 4px, transparent 4px 10px)`,
              opacity: 0.5,
            }}
          />
          <ul className="space-y-[var(--space-12)]">
            {stages.map((stage, i) => (
              <li
                key={stage.index}
                className="relative pl-[var(--space-12)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-[12px] block h-3 w-3 rotate-45 border"
                  style={{
                    backgroundColor:
                      i === 0 ? theme.palette.goldDeep : theme.palette.bg,
                    borderColor: theme.palette.goldDeep,
                  }}
                />
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                  <Image
                    src={stage.image}
                    alt={stage.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 0px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: theme.palette.photoTint }}
                  />
                </div>
                <div className="mt-[var(--space-6)]">
                  <span
                    aria-hidden="true"
                    className="font-display block leading-none"
                    style={{
                      color: theme.palette.accent,
                      fontWeight: 200,
                      fontStyle: "italic",
                      fontSize: "clamp(56px, 16vw, 96px)",
                    }}
                  >
                    {stage.index}
                  </span>
                  <h3
                    className="font-display mt-[var(--space-3)] italic"
                    style={{
                      color: theme.palette.goldDeep,
                      fontSize: "clamp(24px, 6vw, 32px)",
                      lineHeight: 1.15,
                    }}
                  >
                    {stage.title}
                  </h3>
                  <p
                    className="mt-[var(--space-3)] max-w-[50ch] text-[length:var(--text-base)] leading-relaxed"
                    style={{ color: theme.palette.ink, opacity: 0.86 }}
                  >
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );

  // If the user prefers reduced motion, ONLY render the stacked layout
  // (even on desktop) — skipping the pinned frame entirely.
  if (prefersReduced) {
    return (
      <section
        ref={sectionRef}
        aria-label="The ritual, stage by stage"
        className="relative isolate overflow-hidden py-[var(--space-20)]"
        style={paletteStyle}
      >
        <Container>
          <header className="mb-[var(--space-12)]">
            <Eyebrow tone="gold">
              <span>The ritual, stage by stage</span>
              <span
                aria-hidden="true"
                className="mx-2 inline-block h-px w-3"
                style={{ backgroundColor: theme.palette.goldDeep }}
              />
              <span>{theme.periodLabel}</span>
            </Eyebrow>
          </header>
        </Container>
        {/* Always-on stacked list, regardless of viewport. */}
        <div className="block">
          <Container>
            <ul className="space-y-[var(--space-16)]">
              {stages.map((stage) => (
                <li key={stage.index} className="grid gap-8 md:grid-cols-12">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm md:col-span-7">
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 55vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ background: theme.palette.photoTint }}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <span
                      aria-hidden="true"
                      className="font-display block leading-none italic"
                      style={{
                        color: theme.palette.accent,
                        fontWeight: 200,
                        fontSize: "clamp(72px, 12vw, 160px)",
                      }}
                    >
                      {stage.index}
                    </span>
                    <h3
                      className="font-display mt-[var(--space-3)] italic"
                      style={{
                        color: theme.palette.goldDeep,
                        fontSize: "clamp(28px, 4vw, 44px)",
                        lineHeight: 1.15,
                      }}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className="mt-[var(--space-4)] max-w-[50ch] text-[length:var(--text-base)] leading-relaxed"
                      style={{ color: theme.palette.ink, opacity: 0.86 }}
                    >
                      {stage.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </div>
        {theme.closingMantra ? (
          <Container>
            <p
              className="font-script mt-[var(--space-16)] text-center"
              style={{
                color: theme.palette.accent,
                fontSize: "clamp(28px, 5vw, 48px)",
                lineHeight: 1.2,
              }}
            >
              {theme.closingMantra}
            </p>
          </Container>
        ) : null}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="The ritual, stage by stage"
      className="relative isolate overflow-hidden"
      style={paletteStyle}
    >
      {/* ─── Eyebrow above the pinned frame ──────────────────────────────── */}
      <Container>
        <div className="pt-[var(--space-20)] pb-[var(--space-10)]">
          <Eyebrow tone="gold">
            <span>The ritual, stage by stage</span>
            <span
              aria-hidden="true"
              className="mx-2 inline-block h-px w-3"
              style={{ backgroundColor: theme.palette.goldDeep }}
            />
            <span>{theme.periodLabel}</span>
          </Eyebrow>
        </div>
      </Container>

      {/* ─── Mobile stacked fallback ─────────────────────────────────────── */}
      {stackedFallback}

      {/* ─── Desktop pinned narrative ────────────────────────────────────── */}
      {/* Pinned at viewport top, so the inner content offsets the fixed
          header height (84px desktop) — counter / dots / columns all start
          below the nav. Without this offset, top-positioned absolute items
          render *under* the header and read as a layout bug. */}
      <div ref={pinRef} className="relative hidden md:block">
        <div className="relative h-svh w-full overflow-hidden pt-[88px]">
          {/* Background watermark ornament */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-24 h-[520px] w-[520px]"
            style={{ opacity: 0.08 }}
          >
            <CeremonyOrnament
              name={theme.ornamentSecondary ?? "mandala"}
              hue={theme.palette.gold}
              hueSecondary={theme.palette.goldDeep}
              className="h-full w-full"
            />
          </div>

          {/* Top-right stage counter — positioned below the fixed header. */}
          <div className="absolute top-[112px] right-[var(--space-8)] z-20 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-px w-10"
              style={{ backgroundColor: theme.palette.goldDeep }}
            />
            <span
              ref={counterRef}
              className="font-mono text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)] uppercase"
              style={{ color: theme.palette.goldDeep }}
            >
              01 / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Right-side vertical progress rail */}
          <div className="absolute top-1/2 right-[var(--space-6)] z-20 -translate-y-1/2">
            <div ref={dotsRef} className="flex flex-col items-center gap-4">
              {stages.map((stage, i) => (
                <span
                  key={stage.index}
                  data-stage-dot
                  data-active={i === 0 ? "true" : "false"}
                  aria-hidden="true"
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full transition-all duration-500 ease-out",
                    "data-[active=true]:h-8 data-[active=true]:w-[3px] data-[active=true]:rounded-[1px]",
                  )}
                  style={{
                    backgroundColor: theme.palette.goldDeep,
                    opacity: i === 0 ? 1 : 0.32,
                  }}
                />
              ))}
            </div>
          </div>

          <Container className="relative z-10 h-full">
            <div className="grid h-full grid-cols-12 items-center gap-8 pr-12">
              {/* ───── LEFT: sticky text column ─────────────────────────── */}
              <div
                ref={textStagesRef}
                className="relative col-span-5 h-full py-[var(--space-16)]"
              >
                <div className="relative h-full">
                  {stages.map((stage, i) => (
                    <article
                      key={stage.index}
                      data-stage-text
                      className="absolute inset-0 flex flex-col justify-center"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      <div className="relative">
                        {/* Watermark numeral behind */}
                        <span
                          aria-hidden="true"
                          className="font-display absolute -top-6 -left-2 italic select-none"
                          style={{
                            color: theme.palette.accent,
                            opacity: 0.08,
                            fontWeight: 200,
                            fontSize: "clamp(140px, 22vw, 320px)",
                            lineHeight: 0.85,
                          }}
                        >
                          {stage.index}
                        </span>
                        {/* Foreground numeral */}
                        <span
                          aria-hidden="true"
                          className="font-display relative block leading-none italic"
                          style={{
                            color: theme.palette.accent,
                            fontWeight: 200,
                            fontSize: "clamp(80px, 12vw, 180px)",
                          }}
                        >
                          {stage.index}
                        </span>
                      </div>

                      <h3
                        className="font-display mt-[var(--space-4)] max-w-[18ch] italic"
                        style={{
                          color: theme.palette.goldDeep,
                          fontSize: "clamp(28px, 3.4vw, 52px)",
                          lineHeight: 1.1,
                          fontWeight: 400,
                        }}
                      >
                        {stage.title}
                      </h3>

                      <p
                        className="mt-[var(--space-5)] max-w-[50ch] text-[length:var(--text-base)] leading-relaxed md:text-[length:var(--text-lg)]"
                        style={{ color: theme.palette.ink, opacity: 0.86 }}
                      >
                        {stage.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* ───── CENTRE: brass hairline + diamond ─────────────────── */}
              <div
                aria-hidden="true"
                className="absolute top-[140px] bottom-[var(--space-12)] left-[calc(5/12*100%+1rem)] z-0 hidden md:block"
              >
                <div
                  className="relative h-full w-px"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.goldDeep} 12%, ${theme.palette.goldDeep} 88%, transparent 100%)`,
                    opacity: 0.5,
                  }}
                >
                  <span
                    ref={diamondRef}
                    className="absolute top-0 left-1/2 block h-2.5 w-2.5"
                    style={{
                      transform: "translate(-50%, 0) rotate(45deg)",
                      backgroundColor: theme.palette.gold,
                      boxShadow: `0 0 0 3px ${theme.palette.bg}`,
                    }}
                  />
                </div>
              </div>

              {/* ───── RIGHT: image column ──────────────────────────────── */}
              <div
                ref={imageStagesRef}
                className="relative col-span-7 h-full py-[var(--space-16)]"
              >
                <div
                  className="relative mx-auto h-full max-h-[78svh] w-full overflow-hidden rounded-[2px]"
                  style={{
                    aspectRatio: "4 / 5",
                    boxShadow: `0 30px 80px -40px ${theme.palette.ink}66, 0 0 0 1px ${theme.palette.goldDeep}22`,
                  }}
                >
                  {stages.map((stage, i) => (
                    <div
                      key={stage.index}
                      data-stage-image
                      className="absolute inset-0"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      <div
                        data-stage-image-inner
                        className="relative h-full w-full"
                      >
                        <Image
                          src={stage.image}
                          alt={stage.title}
                          fill
                          sizes="(max-width: 768px) 0px, 60vw"
                          priority={i === 0}
                          className="object-cover"
                        />
                      </div>
                      {/* Theme tint over the photograph */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{ background: theme.palette.photoTint }}
                      />
                      {/* Corner caption — small index + title */}
                      <div className="pointer-events-none absolute right-[var(--space-5)] bottom-[var(--space-5)] left-[var(--space-5)] flex items-end justify-between gap-4">
                        <span
                          className="font-mono text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)] uppercase"
                          style={{
                            color: theme.palette.bg,
                            textShadow: `0 1px 12px ${theme.palette.ink}99`,
                          }}
                        >
                          {stage.index} · {theme.periodLabel}
                        </span>
                        <span
                          aria-hidden="true"
                          className="block h-px w-12"
                          style={{
                            backgroundColor: theme.palette.bg,
                            opacity: 0.6,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ─── Closing mantra (optional) ───────────────────────────────────── */}
      {theme.closingMantra ? (
        <Container>
          <p
            className="font-script mx-auto mt-[var(--space-12)] max-w-[40ch] py-[var(--space-12)] text-center"
            style={{
              color: theme.palette.accent,
              fontSize: "clamp(28px, 4vw, 56px)",
              lineHeight: 1.2,
            }}
          >
            {theme.closingMantra}
          </p>
        </Container>
      ) : null}
    </section>
  );
}
