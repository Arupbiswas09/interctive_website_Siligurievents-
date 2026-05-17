"use client";

/**
 * AboutTeamGrid — 6 portrait cards, hover reveals 3D split panels.
 *
 * Each card uses the existing SplitImage primitive (panels=2, hover trigger)
 * to fan the portrait open and reveal name + role + quote underneath. Cards
 * enter via a scrub-triggered stagger.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { SplitImage } from "@/components/effects/3d-split-image";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TeamMember = {
  name: string;
  role: string;
  quote: string;
  portrait: string;
};

const TEAM: readonly TeamMember[] = [
  {
    name: "Aritra Roy",
    role: "Creative director",
    quote: "I draw light first. Always.",
    portrait:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Riya Sen",
    role: "Floral lead",
    quote: "Marigold strings are an anchor, not a decoration.",
    portrait:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mihir Das",
    role: "Lighting designer",
    quote: "I design at 3200K. The rest is colour theory.",
    portrait:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ananya Bose",
    role: "Production manager",
    quote: "If the brass is on time, the room is on time.",
    portrait:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Soumya Banerjee",
    role: "Client relations",
    quote: "Plan for the elders. Everyone else follows.",
    portrait:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tara Devi",
    role: "Sound + script",
    quote: "Shehnai or silence. Never both.",
    portrait:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export function AboutTeamGrid(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  cardRefs.current = [];
  const collectCard = (el: HTMLDivElement | null): void => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section || cardRefs.current.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="The studio team"
      className="relative w-full bg-[color:var(--color-bg)] text-[color:var(--color-ink)] py-[clamp(72px,10vh,140px)]"
    >
      <Container>
        <div
          className="flex items-center gap-3"
          style={{ color: "var(--color-gold-deep)" }}
        >
          <span className="h-px w-10 bg-current opacity-60" />
          <span className="text-[10px] uppercase tracking-[0.32em] font-medium">
            The studio · six hands
          </span>
        </div>
        <h2
          className="mt-4 max-w-[20ch] font-display"
          style={{
            fontSize: "clamp(36px, 4.8vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
          }}
        >
          Six people. One brief.
        </h2>

        <div className="mt-[clamp(40px,6vh,72px)] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              ref={collectCard}
              className="group relative will-change-transform"
            >
              <div className="relative">
                <SplitImage
                  src={member.portrait}
                  alt={`${member.name}, ${member.role}`}
                  panels={2}
                  trigger="hover"
                  width={800}
                  height={1000}
                  className="rounded-[2px]"
                />
                <TeamCorner className="absolute -left-1.5 -top-1.5 h-6 w-6" />
                <TeamCorner className="absolute -right-1.5 -top-1.5 h-6 w-6 rotate-90" />
                <TeamCorner className="absolute -left-1.5 -bottom-1.5 h-6 w-6 -rotate-90" />
                <TeamCorner className="absolute -right-1.5 -bottom-1.5 h-6 w-6 rotate-180" />
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "clamp(20px, 1.6vw, 26px)",
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {member.name}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: "var(--color-gold-deep)" }}
                  >
                    {member.role}
                  </span>
                </div>
                <p
                  className="mt-3 italic"
                  style={{
                    fontSize: "clamp(14px, 0.95vw, 16px)",
                    lineHeight: 1.55,
                    color: "color-mix(in oklab, var(--color-ink) 72%, transparent)",
                  }}
                >
                  &ldquo;{member.quote}&rdquo;
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TeamCorner({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M1 12 L1 1 L12 1"
        stroke="var(--color-gold)"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <circle cx="3" cy="3" r="1.2" fill="var(--color-gold)" />
    </svg>
  );
}
