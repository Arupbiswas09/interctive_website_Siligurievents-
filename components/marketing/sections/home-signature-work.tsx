import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";

type SignatureRoom = {
  slug: string;
  title: string;
  ceremony: string;
  location: string;
  year: number;
  image: string;
  description: string;
};

// Five rooms — shown as an alternating editorial column on desktop,
// a single stacked column on mobile.
const SIGNATURE_ROOMS: ReadonlyArray<SignatureRoom> = [
  {
    slug: "bengali-wedding-mandap",
    title: "Jasmine mandap",
    ceremony: "Bengali wedding",
    location: "Siliguri",
    year: 2025,
    image: "/images/marketing/work-01.jpg",
    description:
      "Red benarasi canopy. Jasmine curtain behind the couple. Brass diya stands at twelve hundred millimetres — the height every photograph asked for.",
  },
  {
    slug: "marwari-sangeet-stage",
    title: "Wine & gold sangeet",
    ceremony: "Sangeet",
    location: "Darjeeling",
    year: 2025,
    image: "/images/marketing/work-02.jpg",
    description:
      "Velvet wine drape, a single brass dais, ember uplight on the bride's solo. No strobe — phone photographs had to stay clean.",
  },
  {
    slug: "tea-garden-reception",
    title: "Dooars sundowner",
    ceremony: "Reception",
    location: "Jalpaiguri",
    year: 2024,
    image: "/images/marketing/work-05.jpg",
    description:
      "Chandeliers strung between tea bushes. The room was the garden — we just gave it candlelight and a cake trolley.",
  },
  {
    slug: "intimate-haldi",
    title: "Marigold haldi",
    ceremony: "Haldi",
    location: "Dooars",
    year: 2024,
    image: "/images/marketing/work-04.jpg",
    description:
      "Bamboo swings. Copper urlis. The first turmeric mixed in clay before the family arrived. Designed entirely for dawn light.",
  },
  {
    slug: "durga-puja-pandal",
    title: "Festival pandal",
    ceremony: "Durga Puja",
    location: "Siliguri",
    year: 2024,
    image: "/images/marketing/work-03.jpg",
    description:
      "A Bengali-Bengali jugalbandi — terracotta walls, a thirty-foot dhunuchi, neighbourhood crowds photographing every inch of it.",
  },
];

/**
 * H4 — Signature work · "Five rooms of memory."
 *
 * Editorial alternating layout. Each room is its own row: image on one
 * side, text on the other, with the side alternating every other row.
 * Server Component shell — only the per-row reveal is client-side.
 */
export function HomeSignatureWork(): React.ReactElement {
  return (
    <section
      id="home-signature-work"
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
        <div className="flex flex-col gap-[var(--space-4)] pb-[var(--space-12)]">
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
              Five recent ceremonies — each room a complete world of its own.
            </p>
          </RevealOnScroll>
        </div>
      </Container>

      {/* ── Editorial rows ── */}
      <Container>
        <ul className="flex flex-col gap-[var(--space-16)] md:gap-[var(--space-24)] pb-[var(--space-16)]">
          {SIGNATURE_ROOMS.map((room, i) => (
            <li key={room.slug}>
              <RevealOnScroll>
                <article
                  className={cn(
                    "grid grid-cols-1 items-center gap-[var(--space-6)] md:grid-cols-12 md:gap-[var(--space-10)]",
                  )}
                >
                  {/* IMAGE */}
                  <div
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)]",
                      "md:col-span-7",
                      i % 2 === 0 ? "md:order-1" : "md:order-2",
                    )}
                  >
                    {/* Brass corner gilt */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10"
                    >
                      <CornerGilt position="tl" />
                      <CornerGilt position="tr" />
                      <CornerGilt position="bl" />
                      <CornerGilt position="br" />
                    </span>
                    <Image
                      src={room.image}
                      alt={`${room.title} — ${room.ceremony} decor in ${room.location}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 58vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                    {/* Photo tint for warmth */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 60%, rgba(58,26,36,0.35) 100%)",
                      }}
                    />
                  </div>

                  {/* TEXT */}
                  <div
                    className={cn(
                      "flex flex-col justify-center",
                      "md:col-span-5",
                      i % 2 === 0 ? "md:order-2 md:pl-[var(--space-4)]" : "md:order-1 md:pr-[var(--space-4)]",
                    )}
                  >
                    <span
                      className="font-display block text-[color:var(--color-gold-deep)] font-light tracking-[-0.02em]"
                      style={{ fontSize: "clamp(56px, 5vw, 88px)", lineHeight: 0.9 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-[color:var(--color-ink)]/30">
                        {" "}/ {String(SIGNATURE_ROOMS.length).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-ink)]/65">
                      {room.ceremony} · {room.location} · {room.year}
                    </span>
                    <h3
                      className="mt-3 font-display italic text-[color:var(--color-ink)]"
                      style={{
                        fontSize: "clamp(36px, 3.8vw, 60px)",
                        fontWeight: 300,
                        lineHeight: 1.05,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {room.title}
                    </h3>
                    <p
                      className="mt-5 max-w-[44ch] text-[color:var(--color-ink)]/75"
                      style={{ fontSize: "clamp(15px, 1vw, 17px)", lineHeight: 1.65 }}
                    >
                      {room.description}
                    </p>
                    <Link
                      href={`/portfolio/${room.slug}`}
                      className="mt-7 inline-flex w-fit items-center gap-2.5 border-b border-[color:var(--color-ink)]/40 pb-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                    >
                      Read the case study
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </Container>

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
