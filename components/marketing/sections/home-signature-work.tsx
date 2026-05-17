"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SignatureRoom = {
  slug: string;
  title: string;
  ceremony: string;
  location: string;
  year: number;
  image: string;
  description: string;
};

// Five rooms — cross-faded on scroll, one viewport per room.
const SIGNATURE_ROOMS: ReadonlyArray<SignatureRoom> = [
  {
    slug: "bengali-wedding-mandap",
    title: "Jasmine mandap",
    ceremony: "Bengali wedding",
    location: "Siliguri",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=80",
    description:
      "Red benarasi canopy. Jasmine curtain behind the couple. Brass diya stands at twelve hundred millimetres — the height every photograph asked for.",
  },
  {
    slug: "marwari-sangeet-stage",
    title: "Wine & gold sangeet",
    ceremony: "Sangeet",
    location: "Darjeeling",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=80",
    description:
      "Velvet wine drape, a single brass dais, ember uplight on the bride's solo. No strobe — phone photographs had to stay clean.",
  },
  {
    slug: "tea-garden-reception",
    title: "Dooars sundowner",
    ceremony: "Reception",
    location: "Jalpaiguri",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1800&q=80",
    description:
      "Chandeliers strung between tea bushes. The room was the garden — we just gave it candlelight and a cake trolley.",
  },
  {
    slug: "intimate-haldi",
    title: "Marigold haldi",
    ceremony: "Haldi",
    location: "Dooars",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1607261504259-c9bf36e8e6e8?auto=format&fit=crop&w=1800&q=80",
    description:
      "Bamboo swings. Copper urlis. The first turmeric mixed in clay before the family arrived. Designed entirely for dawn light.",
  },
  {
    slug: "durga-puja-pandal",
    title: "Festival pandal",
    ceremony: "Durga Puja",
    location: "Siliguri",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1800&q=80",
    description:
      "A Bengali-Bengali jugalbandi — terracotta walls, a thirty-foot dhunuchi, neighbourhood crowds photographing every inch of it.",
  },
];

/**
 * H4 — Signature work · "Five rooms of memory."
 *
 * Pinned cross-fade narrative. As the user scrolls, the section pins for
 * five viewports and cross-fades between five room photographs. Each room
 * is one stop — its image, title, meta, and description fade in together
 * and out together while the next slides up.
 *
 * Choreography (desktop ≥ md):
 *   • One ScrollTrigger pins the section for `rooms.length × svh` of scroll.
 *   • The text column on the LEFT and the image stack on the RIGHT both
 *     fade between rooms in lockstep with the same scrubbed timeline.
 *   • A vertical brass rail on the right runs the full pin height. A small
 *     brass diamond glyph travels down the rail tied to scroll progress.
 *   • Active room dot (left rail) expands to a small brass bar.
 *   • Ken-Burns scale on the active image (1 → 1.06 over its viewport).
 *   • Header offset 88px so content never sits behind the fixed nav.
 *
 * Reduced motion / mobile (< md):
 *   • Same five rooms render as a stacked vertical list with a
 *     scroll-snap feel. No pin, no scrub, no cross-fades.
 */
export function HomeSignatureWork(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const textsRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const railFillRef = useRef<HTMLSpanElement | null>(null);
  const diamondRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const pin = pinRef.current;
    const textsWrap = textsRef.current;
    const imagesWrap = imagesRef.current;
    if (!pin || !textsWrap || !imagesWrap) return;

    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const total = SIGNATURE_ROOMS.length;

    const ctx = gsap.context(() => {
      const texts = Array.from(
        textsWrap.querySelectorAll<HTMLElement>("[data-room-text]"),
      );
      const images = Array.from(
        imagesWrap.querySelectorAll<HTMLElement>("[data-room-image]"),
      );
      const innerImgs = Array.from(
        imagesWrap.querySelectorAll<HTMLElement>("[data-room-image-inner]"),
      );
      const dots = dotsRef.current?.querySelectorAll<HTMLElement>(
        "[data-room-dot]",
      );

      if (images.length !== total || texts.length !== total) {
        // Refs didn't capture all rooms — bail out instead of half-animating.
        return;
      }

      // Initial: rooms 1..n hidden + pre-shifted; room 0 fully visible.
      // Use plain set() with explicit per-element targets so there is no
      // chance of CSS opacity-0 / GSAP autoAlpha specificity ambiguity.
      images.forEach((el, i) => {
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
      });
      texts.forEach((el, i) => {
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 28 });
      });
      gsap.set(innerImgs, { scale: 1, transformOrigin: "50% 50%" });

      const distance = (): number => window.innerHeight * total;

      // One ScrollTrigger pins the section and drives the master timeline.
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
              total - 1,
              Math.max(0, Math.floor(progress * total - 1e-6)),
            );

            if (counterRef.current) {
              counterRef.current.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
            }
            if (dots) {
              dots.forEach((dot, i) => {
                dot.dataset.active = i === index ? "true" : "false";
              });
            }
            if (railFillRef.current) {
              railFillRef.current.style.transform = `scaleY(${progress})`;
            }
            if (diamondRef.current) {
              diamondRef.current.style.top = `${progress * 100}%`;
            }
          },
        },
      });

      // Ken-Burns scale on the active image — separate ScrollTrigger.
      gsap.to(innerImgs, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // Cross-fade timeline — one segment per transition. Each segment
      // occupies 1 unit of timeline time, so 4 transitions = 4 units.
      // Within a segment: 0.0–0.45s fade-out prev, 0.15–0.7s fade-in next.
      for (let i = 0; i < total - 1; i++) {
        const prevImage = images[i];
        const nextImage = images[i + 1];
        const prevText = texts[i];
        const nextText = texts[i + 1];
        if (!prevImage || !nextImage || !prevText || !nextText) continue;

        master
          .to(prevImage, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, i)
          .to(prevText, { autoAlpha: 0, y: -28, duration: 0.45, ease: "power2.inOut" }, i)
          .to(nextImage, { autoAlpha: 1, duration: 0.55, ease: "power2.inOut" }, i + 0.15)
          .to(nextText, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.inOut" }, i + 0.15);
      }

      ScrollTrigger.refresh();
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="home-signature-work"
      ref={sectionRef}
      data-tone="default"
      className="relative bg-[color:var(--color-bg)]"
    >
      {/* Ambient brass-and-rose backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 20%, rgba(232,213,168,0.40) 0%, transparent 60%), radial-gradient(40% 35% at 80% 75%, rgba(164,54,92,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Eyebrow + display heading + intro ── */}
      <Container className="pt-[var(--space-24)] md:pt-[var(--space-32)]">
        <div className="flex flex-col gap-[var(--space-4)] pb-[var(--space-10)]">
          <RevealOnScroll>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--color-gold-deep)]/60" />
              <Eyebrow tone="accent">Signature work</Eyebrow>
            </div>
          </RevealOnScroll>
          <DisplayHeading
            as="h2"
            size="lg"
            split
            splitMode="words"
            text="Five rooms of memory."
            className="max-w-[14ch] font-light"
          />
          <RevealOnScroll delay={120}>
            <p className="mt-2 max-w-[42ch] text-[color:var(--color-ink)]/70">
              Scroll through five recent ceremonies — each room cross-fades
              into the next as you read.
            </p>
          </RevealOnScroll>
        </div>
      </Container>

      {/* ── Mobile stacked fallback (also serves reduced-motion) ── */}
      <div className="md:hidden">
        <Container>
          <ul className="flex flex-col gap-[var(--space-12)] pb-[var(--space-16)]">
            {SIGNATURE_ROOMS.map((room, i) => (
              <li key={room.slug} className="flex flex-col gap-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-card)]">
                  <Image
                    src={room.image}
                    alt={`${room.title} — ${room.ceremony} decor in ${room.location}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink)]/55">
                    {String(i + 1).padStart(2, "0")} · {room.ceremony} · {room.location} · {room.year}
                  </span>
                  <h3 className="mt-2 font-display text-[length:var(--text-2xl)] font-light italic leading-tight">
                    {room.title}
                  </h3>
                  <p className="mt-2 text-[length:var(--text-sm)] text-[color:var(--color-ink)]/70">
                    {room.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* ── Desktop pinned cross-fade narrative ── */}
      <div ref={pinRef} className="relative hidden md:block">
        <div className="relative h-svh w-full overflow-hidden pt-[88px]">
          {/* Top-right stage counter — below the fixed header. */}
          <div className="absolute top-[112px] right-[var(--space-8)] z-20 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-px w-10 bg-[color:var(--color-gold-deep)]/60"
            />
            <span
              ref={counterRef}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-gold-deep)]"
            >
              01 / 05
            </span>
          </div>

          {/* Right-side vertical progress rail + traveling diamond */}
          <div className="absolute top-[140px] bottom-[var(--space-12)] right-[var(--space-7)] z-20 hidden md:block">
            <div className="relative h-full w-px bg-[color:var(--color-ink)]/12">
              <span
                ref={railFillRef}
                className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-[color:var(--color-gold-deep)] via-[color:var(--color-gold)] to-[color:var(--color-accent)]"
              />
              <span
                ref={diamondRef}
                aria-hidden="true"
                className="absolute -left-[5px] block h-2.5 w-2.5 rotate-45 -translate-y-1/2 bg-[color:var(--color-gold-deep)]"
                style={{ top: "0%" }}
              />
            </div>
          </div>

          {/* Left-side room dots */}
          <div className="absolute top-1/2 left-[var(--space-6)] z-20 -translate-y-1/2">
            <div ref={dotsRef} className="flex flex-col items-center gap-3">
              {SIGNATURE_ROOMS.map((room, i) => (
                <span
                  key={room.slug}
                  data-room-dot=""
                  data-active={i === 0 ? "true" : "false"}
                  className={cn(
                    "block w-1.5 rounded-full bg-[color:var(--color-ink)]/25",
                    "data-[active=true]:bg-[color:var(--color-gold-deep)]",
                    "h-1.5 data-[active=true]:h-6",
                    "transition-all duration-500 ease-out",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Stage content — two-column inside Container */}
          <Container className="relative z-10 h-full">
            <div className="grid h-full grid-cols-12 items-center gap-[var(--space-10)]">
              {/* LEFT — stacked text layers, cross-fading */}
              <div
                ref={textsRef}
                className="relative col-span-5 col-start-1 self-center"
                style={{ minHeight: "400px" }}
              >
                {SIGNATURE_ROOMS.map((room, i) => (
                  <article
                    key={room.slug}
                    data-room-text=""
                    className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                    style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                  >
                    <span className="font-display block text-[color:var(--color-gold-deep)] font-light tracking-[-0.02em]" style={{ fontSize: "clamp(64px, 6vw, 96px)", lineHeight: 0.9 }}>
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-[color:var(--color-ink)]/30">
                        {" "}/ {String(SIGNATURE_ROOMS.length).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-ink)]/65">
                      {room.ceremony} · {room.location} · {room.year}
                    </span>
                    <h3 className="mt-3 font-display italic text-[color:var(--color-ink)]" style={{ fontSize: "clamp(40px, 4.4vw, 72px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
                      {room.title}
                    </h3>
                    <p className="mt-5 max-w-[44ch] text-[color:var(--color-ink)]/75" style={{ fontSize: "clamp(15px, 1vw, 17px)", lineHeight: 1.65 }}>
                      {room.description}
                    </p>
                    <Link
                      href={`/portfolio/${room.slug}`}
                      className="mt-7 inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] font-medium text-[color:var(--color-ink)] border-b border-[color:var(--color-ink)]/40 pb-1.5 w-fit hover:text-[color:var(--color-accent)] hover:border-[color:var(--color-accent)] transition-colors"
                    >
                      Read the case study
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>

              {/* RIGHT — stacked images, cross-fading */}
              <div
                ref={imagesRef}
                className="relative col-span-6 col-start-7 self-center"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)]">
                  {/* Brass corner gilt */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
                    <CornerGilt position="tl" />
                    <CornerGilt position="tr" />
                    <CornerGilt position="bl" />
                    <CornerGilt position="br" />
                  </span>

                  {SIGNATURE_ROOMS.map((room, i) => (
                    <figure
                      key={room.slug}
                      data-room-image=""
                      className="absolute inset-0 h-full w-full will-change-[opacity]"
                      style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                    >
                      <div
                        data-room-image-inner=""
                        className="absolute inset-0 h-full w-full will-change-transform"
                      >
                        <Image
                          src={room.image}
                          alt={`${room.title} — ${room.ceremony} decor in ${room.location}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                      {/* Photo tint for warmth */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 60%, rgba(58,26,36,0.35) 100%)",
                        }}
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ── Closing footer link ── */}
      <Container>
        <RevealOnScroll>
          <div className="flex justify-end py-[var(--space-16)] md:py-[var(--space-24)]">
            <Link
              href="/portfolio"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              View all work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}

function CornerGilt({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
  const placement = {
    tl: "top-3 left-3",
    tr: "top-3 right-3 rotate-90",
    bl: "bottom-3 left-3 -rotate-90",
    br: "bottom-3 right-3 rotate-180",
  }[position];
  return (
    <span
      className={cn(
        "absolute h-6 w-6 text-[color:var(--color-gold)]",
        placement,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12V4a2 2 0 0 1 2-2h8"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.85"
        />
        <path
          d="M5 12V7a2 2 0 0 1 2-2h5"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
