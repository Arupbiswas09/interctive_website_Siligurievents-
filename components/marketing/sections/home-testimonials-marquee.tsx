"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * H6 — Testimonials, "Said about us".
 *
 * Editorial layout:
 *   1. Eyebrow + DisplayHeading
 *   2. Hero pull quote — oversized italic Cormorant, attribution + venue
 *   3. Stat strip — five quiet metrics on a brass hairline
 *   4. Three featured testimonial cards with photos / ratings / brass corners
 *   5. Drifting marquee of secondary quotes (slower than before, single row)
 *
 * Choreography:
 *   - Hero quote: word-by-word reveal (scrub) as section enters viewport.
 *   - Stat strip: counter scrub from 0 to value over scroll progress.
 *   - Cards: stagger-up with subtle rotation, parallax on hover.
 *   - Marquee: gentle drift, hover pauses, scroll velocity nudges speed.
 */

type Testimonial = {
  quote: string;
  name: string;
  event: string;
  location: string;
  year: number;
  rating: 5;
  /** Optional avatar URL (CMS); falls back to monogram + brass ring. */
  portraitUrl?: string;
};

const FEATURED: ReadonlyArray<Testimonial> = [
  {
    quote:
      "They turned a banquet hall into a frame from a Bengali film. Every aunt asked for the decorator's number.",
    name: "Rituparna & Soumya",
    event: "Bengali wedding",
    location: "Siliguri",
    year: 2025,
    rating: 5,
  },
  {
    quote:
      "We told them sangeet and they gave us a film set. The choreography lighting cues alone made the night.",
    name: "Aaditi & Karan",
    event: "Sangeet",
    location: "Darjeeling",
    year: 2025,
    rating: 5,
  },
  {
    quote:
      "Restraint with depth — three small installations, one unforgettable room. Exactly what I'd asked for.",
    name: "Ishaan Banerjee",
    event: "Engagement",
    location: "Jalpaiguri",
    year: 2024,
    rating: 5,
  },
];

const HERO_QUOTE = {
  quote:
    "The first review we ever got is still our standard. A mandap that felt like a film still, on a budget that did not need to be brave.",
  attribution: "Featured in Vogue Wedding Company India, 2025",
};

const SECONDARY: ReadonlyArray<Testimonial> = [
  {
    quote:
      "They handled the rain plan before we even thought to worry about it. The mandap was untouched.",
    name: "Megha & Rohan",
    event: "Wedding",
    location: "Siliguri",
    year: 2024,
    rating: 5,
  },
  {
    quote:
      "A haldi I'll never forget — marigold everywhere, sunlight on cue, and my mother in tears.",
    name: "Tanvi Choudhury",
    event: "Haldi",
    location: "Dooars",
    year: 2025,
    rating: 5,
  },
  {
    quote:
      "Annaprashan staging in brass and banana leaf. Quiet, ceremonial, perfect.",
    name: "The Mukherjees",
    event: "Annaprashan",
    location: "Siliguri",
    year: 2024,
    rating: 5,
  },
  {
    quote:
      "Reception of 600 guests and not a single corner went unstyled. Editorial photography came out of every frame.",
    name: "Rhea & Arjun",
    event: "Reception",
    location: "Darjeeling",
    year: 2025,
    rating: 5,
  },
  {
    quote:
      "Best decision was hiring them — they made our corporate launch feel like a museum opening.",
    name: "Lipika Sen, Tata Tea Estates",
    event: "Corporate launch",
    location: "Siliguri",
    year: 2025,
    rating: 5,
  },
  {
    quote:
      "Mehendi was the warmest evening of the wedding. The low-seating, the lanterns, the smell of jasmine.",
    name: "Nayantara Roy",
    event: "Mehendi",
    location: "Jalpaiguri",
    year: 2024,
    rating: 5,
  },
];

const STATS: ReadonlyArray<{
  to: number;
  label: string;
  suffix?: string;
  decimals?: number;
}> = [
  { to: 248, label: "Events crafted", suffix: "+" },
  { to: 5.0, label: "Avg client rating", decimals: 1 },
  { to: 36, label: "Cities across India" },
  { to: 14, label: "Years in practice" },
  { to: 97, label: "Repeat referrals", suffix: "%" },
];

export function HomeTestimonialsMarquee(): React.ReactElement {
  return (
    <Section
      as="section"
      tone="default"
      spacing="lg"
      id="home-testimonials"
      className="relative isolate overflow-hidden"
    >
      {/* — Ambient backdrop — soft brass + rose radial pools — */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(45% 35% at 15% 25%, rgba(232,213,168,0.32) 0%, transparent 65%), radial-gradient(35% 30% at 85% 80%, rgba(164,54,92,0.14) 0%, transparent 75%)",
        }}
      />

      <Container>
        <div className="mb-[var(--space-12)] flex max-w-[64ch] flex-col gap-[var(--space-3)]">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--color-gold-deep)]/60" />
            <Eyebrow tone="accent">Said about us</Eyebrow>
          </div>
        </div>

        <HeroPullQuote />
        <StatStrip />
        <FeaturedGrid />
      </Container>

      <SecondaryMarquee items={SECONDARY} />
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO PULL QUOTE — large editorial italic with word-by-word scrub reveal
// ─────────────────────────────────────────────────────────────────────────────

function HeroPullQuote(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-quote-word]");
      const ornament = root.querySelector("[data-ornament]");
      const attribution = root.querySelector("[data-attribution]");

      gsap.set(words, { opacity: 0.18, y: 12, filter: "blur(2px)" });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power2.out",
        stagger: { each: 0.04, from: "start" },
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 35%",
          scrub: 1,
        },
      });

      gsap.from(ornament, {
        scale: 0,
        rotation: -45,
        autoAlpha: 0,
        duration: 1.1,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });

      gsap.from(attribution, {
        y: 16,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const words = HERO_QUOTE.quote.split(/(\s+)/);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-[1080px] py-[var(--space-12)] md:py-[var(--space-16)]"
    >
      <span
        data-ornament
        aria-hidden="true"
        className="absolute -top-2 left-0 text-[color:var(--color-gold-deep)] md:-top-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 12vw, 180px)",
          fontWeight: 300,
          lineHeight: 0.7,
        }}
      >
        &ldquo;
      </span>

      <blockquote
        className="relative pl-10 font-display italic text-[color:var(--color-ink)] md:pl-20"
        style={{
          fontSize: "clamp(24px, 3vw, 44px)",
          fontWeight: 300,
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
        }}
      >
        {words.map((w, i) =>
          /^\s+$/.test(w) ? (
            <span key={i}>{w}</span>
          ) : (
            <span
              key={i}
              data-quote-word
              className="inline-block will-change-[opacity,transform,filter]"
            >
              {w}
            </span>
          ),
        )}
      </blockquote>

      <div
        data-attribution
        className="mt-8 flex items-center gap-3 pl-10 md:pl-20"
      >
        <span className="h-px w-10 bg-[color:var(--color-gold-deep)]" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]/65 font-medium">
          {HERO_QUOTE.attribution}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. STAT STRIP — five quiet metrics with scrubbed counters
// ─────────────────────────────────────────────────────────────────────────────

function StatStrip(): React.ReactElement {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = stripRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = root.querySelectorAll<HTMLElement>("[data-stat]");

      items.forEach((item, idx) => {
        const target = Number(item.dataset.to ?? "0");
        const decimals = Number(item.dataset.decimals ?? "0");
        const suffix = item.dataset.suffix ?? "";
        const valueEl = item.querySelector<HTMLElement>("[data-stat-value]");
        if (!valueEl) return;

        const state = { v: 0 };
        gsap.from(item, {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          delay: idx * 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });

        gsap.to(state, {
          v: target,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.6,
          },
          onUpdate: () => {
            const fixed = decimals > 0 ? state.v.toFixed(decimals) : Math.round(state.v).toString();
            valueEl.textContent = `${fixed}${suffix}`;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={stripRef}
      className="relative my-[var(--space-12)] grid grid-cols-2 gap-x-6 gap-y-8 border-y border-[color:var(--color-ink)]/10 py-[var(--space-10)] md:my-[var(--space-16)] md:grid-cols-5 md:py-[var(--space-12)]"
    >
      {/* Decorative brass diamond at left of strip */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rotate-45 bg-[color:var(--color-bg)] p-1.5 md:block"
      >
        <span className="block h-2.5 w-2.5 bg-[color:var(--color-gold-deep)]" />
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rotate-45 bg-[color:var(--color-bg)] p-1.5 md:block"
      >
        <span className="block h-2.5 w-2.5 bg-[color:var(--color-gold-deep)]" />
      </span>

      {STATS.map((s) => (
        <div
          key={s.label}
          data-stat
          data-to={s.to}
          data-decimals={s.decimals ?? 0}
          data-suffix={s.suffix ?? ""}
          className="flex flex-col items-center gap-2 text-center"
        >
          <span
            data-stat-value
            className="font-display text-[color:var(--color-gold-deep)] tabular-nums"
            style={{
              fontSize: "clamp(32px, 3.2vw, 52px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            0{s.suffix ?? ""}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink)]/65">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FEATURED GRID — three large editorial testimonial cards
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedGrid(): React.ReactElement {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = gridRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>("[data-feature-card]");
      gsap.from(cards, {
        y: 60,
        autoAlpha: 0,
        rotation: (i) => (i % 2 === 0 ? -1.2 : 1.2),
        duration: 1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
    >
      {FEATURED.map((t, i) => (
        <FeaturedCard key={t.name} testimonial={t} index={i} />
      ))}
    </div>
  );
}

function FeaturedCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}): React.ReactElement {
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <article
      ref={cardRef}
      data-feature-card
      className={cn(
        "group relative flex flex-col gap-5 bg-[color:var(--color-bg-elevated)] p-7 md:p-8",
        "shadow-[0_30px_80px_-40px_rgba(58,26,36,0.30)]",
        "transition-transform duration-500 ease-out hover:-translate-y-1.5",
      )}
    >
      {/* Brass corner ornaments */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-t border-[color:var(--color-gold-deep)]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-t border-[color:var(--color-gold-deep)]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-[color:var(--color-gold-deep)]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[color:var(--color-gold-deep)]/70"
      />

      {/* Rating row */}
      <div className="flex items-center justify-between">
        <Stars count={testimonial.rating} />
        <span className="font-mono text-[10px] tracking-[0.22em] text-[color:var(--color-ink)]/45">
          № {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Quote */}
      <p
        className="font-display italic text-[color:var(--color-ink)]"
        style={{
          fontSize: "clamp(17px, 1.3vw, 22px)",
          lineHeight: 1.45,
          fontWeight: 400,
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Hairline */}
      <span
        aria-hidden="true"
        className="h-px w-12 bg-[color:var(--color-gold-deep)]/50"
      />

      {/* Attribution */}
      <div className="flex items-center gap-3">
        <Avatar testimonial={testimonial} />
        <div className="flex flex-col leading-tight">
          <span className="text-[length:var(--text-sm)] font-medium text-[color:var(--color-ink)]">
            {testimonial.name}
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink)]/55">
            {testimonial.event} · {testimonial.location} · {testimonial.year}
          </span>
        </div>
      </div>
    </article>
  );
}

function Avatar({
  testimonial,
}: {
  testimonial: Testimonial;
}): React.ReactElement {
  const initials = testimonial.name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  if (testimonial.portraitUrl) {
    return (
      <span
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-full ring-1 ring-[color:var(--color-gold-deep)]/40"
        style={{
          backgroundImage: `url(${testimonial.portraitUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        "bg-[color:var(--color-gold-soft)] ring-1 ring-[color:var(--color-gold-deep)]/40",
        "font-display text-[13px] font-medium text-[color:var(--color-gold-deep)] tracking-tight",
      )}
    >
      {initials}
    </span>
  );
}

function Stars({ count }: { count: number }): React.ReactElement {
  return (
    <span aria-label={`${count} out of 5 stars`} className="inline-flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[color:var(--color-gold-deep)]"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SECONDARY MARQUEE — single drifting row, slower, hover-pause
// ─────────────────────────────────────────────────────────────────────────────

function SecondaryMarquee({
  items,
}: {
  items: ReadonlyArray<Testimonial>;
}): React.ReactElement {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 110,
        ease: "none",
        repeat: -1,
      });

      const onEnter = (): void => {
        gsap.to(tween, { timeScale: 0.15, duration: 0.4 });
      };
      const onLeave = (): void => {
        gsap.to(tween, { timeScale: 1, duration: 0.4 });
      };
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      return (): void => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
      };
    }, track);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative mt-[var(--space-16)]">
      <Container className="mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-[color:var(--color-gold-deep)]/50" />
        <span className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-ink)]/55">
          More notes from the families
        </span>
      </Container>

      <div
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden",
          "[mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]",
        )}
      >
        <div
          ref={trackRef}
          className="flex w-max flex-nowrap gap-5 py-3 will-change-transform"
        >
          {[0, 1].map((copy) =>
            items.map((t, i) => (
              <MiniQuote key={`${copy}-${i}`} testimonial={t} />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

function MiniQuote({
  testimonial,
}: {
  testimonial: Testimonial;
}): React.ReactElement {
  return (
    <article
      className={cn(
        "flex w-[min(380px,78vw)] shrink-0 flex-col gap-3 border-l-2 border-[color:var(--color-gold-deep)]/60",
        "bg-[color:var(--color-bg-elevated)]/80 px-5 py-4 backdrop-blur",
        "shadow-[0_10px_40px_-20px_rgba(58,26,36,0.18)]",
      )}
    >
      <Stars count={testimonial.rating} />
      <p
        className="font-display italic text-[color:var(--color-ink)]/90"
        style={{ fontSize: "15px", lineHeight: 1.5 }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink)]/55">
        {testimonial.name} · {testimonial.event} · {testimonial.year}
      </span>
    </article>
  );
}
