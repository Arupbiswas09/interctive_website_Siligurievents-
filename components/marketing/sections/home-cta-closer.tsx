"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Parallax } from "@/components/motion/parallax";
import { DisplayHeading } from "@/components/ui/display-heading";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { SITE_IMAGES } from "@/lib/media/images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADLINE_TEXT = "Your next moment, cinematic.";

/**
 * H9 — Big-type CTA closer with full-bleed decor photography.
 */
export function HomeCtaCloser(): React.ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section
      as="section"
      tone="dark"
      spacing="xl"
      id="home-cta-closer"
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      <Parallax speed={0.18} className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={SITE_IMAGES.work["03"]}
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[#0e0b08]/75"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, rgba(184,137,58,0.22), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(139,26,26,0.2), transparent 50%)",
          }}
        />
      </Parallax>

      <Container>
        <div className="flex flex-col items-start gap-[var(--space-8)] py-[var(--space-24)]">
          <DisplayHeading
            as="h2"
            variableWeight
            className="max-w-[14ch] italic text-[#f4ecdf] md:text-[length:var(--text-6xl)]"
          >
            {HEADLINE_TEXT}
          </DisplayHeading>

          <div className="flex flex-wrap items-center gap-[var(--space-4)]">
            <MagneticButton>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Plan my event <span aria-hidden="true">→</span>
              </Link>
            </MagneticButton>
            <p className="max-w-[28ch] text-[length:var(--text-sm)] text-[#f4ecdf]/80">
              WhatsApp us — we usually reply within an hour.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
