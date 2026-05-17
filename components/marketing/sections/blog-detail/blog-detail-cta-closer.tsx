"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

/**
 * BlogDetailCtaCloser — inverse-palette, end-of-article CTA.
 * Same architectural template as ceremony CTA closer: dark canvas, italic
 * display headline ("Bring us a date."), slow rotating mandala ornament,
 * two CTAs (gold solid + ghost), brass hairline + caption.
 */
export function BlogDetailCtaCloser(): React.ReactElement {
	const sectionRef = useRef<HTMLElement | null>(null);
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const ornamentRef = useRef<HTMLDivElement | null>(null);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (prefersReducedMotion) return;
		const sectionEl = sectionRef.current;
		const headingEl = headingRef.current;
		const ornamentEl = ornamentRef.current;
		if (!sectionEl || !headingEl) return;

		const ctx = gsap.context(() => {
			if (ornamentEl) {
				gsap.fromTo(
					ornamentEl,
					{ rotate: 0 },
					{
						rotate: -360,
						ease: "none",
						scrollTrigger: {
							trigger: sectionEl,
							start: "top bottom",
							end: "bottom top",
							scrub: 2,
						},
					},
				);
			}

			const wordNodes =
				headingEl.querySelectorAll<HTMLElement>("[data-cta-word]");
			if (wordNodes.length === 0) return;
			gsap.set(wordNodes, { yPercent: 60, opacity: 0, filter: "blur(8px)" });
			gsap.to(wordNodes, {
				yPercent: 0,
				opacity: 1,
				filter: "blur(0px)",
				ease: "power2.out",
				stagger: 0.06,
				scrollTrigger: {
					trigger: headingEl,
					start: "top 85%",
					end: "bottom 60%",
					scrub: 1,
				},
			});
		}, sectionEl);

		return (): void => {
			ctx.revert();
		};
	}, [prefersReducedMotion]);

	const headlineWords = ["Bring", "us", "a", "date."];

	return (
		<section
			ref={sectionRef}
			aria-label="Plan your event"
			className="relative isolate w-full overflow-hidden bg-[#0E0B08] text-[#F5EDE0]"
		>
			<div
				ref={ornamentRef}
				aria-hidden="true"
				className="pointer-events-none absolute right-[-12vw] top-1/2 -translate-y-1/2"
				style={{
					width: "80vh",
					height: "80vh",
					opacity: 0.16,
					willChange: "transform",
				}}
			>
				<CeremonyOrnament
					name="mandala"
					hue="#c89860"
					className="h-full w-full"
				/>
			</div>

			<Container>
				<div className="relative flex min-h-[64svh] flex-col justify-center py-[var(--space-24)] md:py-[var(--space-32)]">
					<div className="flex items-center gap-3">
						<span
							aria-hidden="true"
							className="h-px w-10 bg-[color:var(--color-gold)] opacity-90"
						/>
						<span
							className={cn(
								"font-mono text-[11px] uppercase tracking-[0.32em]",
								"text-[color:var(--color-gold)]",
							)}
						>
							Plan your event
						</span>
					</div>

					<h2
						ref={headingRef}
						aria-label="Bring us a date."
						className={cn(
							"mt-[var(--space-6)] max-w-[18ch] font-display italic",
							"text-[clamp(56px,10vw,128px)] leading-[0.95] tracking-[-0.015em]",
							"font-light text-balance text-[#F5EDE0]",
						)}
					>
						{prefersReducedMotion
							? headlineWords.join(" ")
							: headlineWords.map((word, i) => (
									<span
										key={`${word}-${i}`}
										className="inline-block overflow-hidden align-bottom pr-[0.18em]"
									>
										<span
											data-cta-word
											className="inline-block will-change-transform"
										>
											{word}
										</span>
									</span>
								))}
					</h2>

					<p
						className={cn(
							"mt-[var(--space-6)] max-w-[42ch] font-script",
							"text-[clamp(22px,2.4vw,32px)] leading-[1.2]",
							"text-[color:var(--color-gold-soft,#e8d5a8)] opacity-95",
						)}
					>
						Crafted, lit, and staged like a film &mdash; tell us when, and
						we&rsquo;ll do the rest.
					</p>

					<div className="mt-[var(--space-10)] flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
						<Link
							href="/contact"
							className={cn(
								"inline-flex h-12 items-center justify-center px-7",
								"rounded-[var(--radius-sm)] bg-[color:var(--color-gold)] text-[#0E0B08]",
								"font-medium uppercase tracking-[0.14em] text-[length:var(--text-sm)]",
								"transition-[transform,background-color] duration-200 ease-out",
								"hover:scale-[1.02] active:scale-[0.99]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0B08]",
							)}
						>
							WhatsApp us with a date
						</Link>

						<Link
							href="/portfolio"
							className={cn(
								"group inline-flex items-center gap-2 border-b pb-1",
								"border-[#F5EDE0]/40",
								"font-medium uppercase tracking-[0.14em] text-[length:var(--text-sm)]",
								"text-[#F5EDE0] transition-opacity duration-200",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5EDE0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0B08]",
							)}
						>
							<span>See signature work</span>
							<span
								aria-hidden="true"
								className="inline-block transition-transform duration-200 group-hover:translate-x-1"
							>
								&rarr;
							</span>
						</Link>
					</div>

					<div className="mt-[var(--space-14)] flex items-center gap-4">
						<span
							aria-hidden="true"
							className="h-px w-16 bg-[color:var(--color-gold)] opacity-60"
						/>
						<span
							className={cn(
								"font-mono text-[11px] uppercase tracking-[0.24em]",
								"text-[color:var(--color-gold-soft,#e8d5a8)] opacity-85",
							)}
						>
							Reply within 24 hours &middot; Siliguri, North Bengal
						</span>
					</div>
				</div>
			</Container>
		</section>
	);
}
