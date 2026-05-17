"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/cms/posts";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

type BlogCategoryHeroProps = {
	category: PostCategory;
	count: number;
};

/**
 * BlogCategoryHero — 40svh themed hero for a category. Eyebrow ("Category"),
 * italic display heading of the category label, one-line description below.
 * A faint mandala ornament drifts to the right; a brass hairline + count
 * caption anchors the bottom.
 */
export function BlogCategoryHero({
	category,
	count,
}: BlogCategoryHeroProps): React.ReactElement {
	const sectionRef = useRef<HTMLElement | null>(null);
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (prefersReducedMotion) return;
		const sectionEl = sectionRef.current;
		const headingEl = headingRef.current;
		if (!sectionEl || !headingEl) return;

		const ctx = gsap.context(() => {
			const wordNodes =
				headingEl.querySelectorAll<HTMLElement>("[data-cat-word]");
			if (wordNodes.length === 0) return;
			gsap.set(wordNodes, { yPercent: 100, opacity: 0, filter: "blur(6px)" });
			gsap.to(wordNodes, {
				yPercent: 0,
				opacity: 1,
				filter: "blur(0px)",
				ease: "power3.out",
				stagger: 0.07,
				duration: 0.9,
				scrollTrigger: {
					trigger: headingEl,
					start: "top 90%",
					once: true,
				},
			});
		}, sectionEl);

		return (): void => {
			ctx.revert();
		};
	}, [prefersReducedMotion]);

	const words = category.label.split(/\s+/u).filter(Boolean);

	return (
		<section
			ref={sectionRef}
			aria-label={`${category.label} — category`}
			className={cn(
				"relative isolate w-full overflow-hidden",
				"bg-[color:var(--color-bg)]",
				"pt-[var(--space-32)] md:pt-[var(--space-40)]",
			)}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
			>
				<div
					className="absolute inset-0 opacity-60"
					style={{
						background:
							"radial-gradient(ellipse at 85% 10%, rgba(200,152,96,0.22) 0%, transparent 55%), radial-gradient(ellipse at 0% 80%, rgba(139,26,26,0.12) 0%, transparent 55%)",
					}}
				/>
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute right-[-10vw] top-[10%] hidden md:block"
				style={{ width: "40vh", height: "40vh", opacity: 0.18 }}
			>
				<CeremonyOrnament
					name="mandala"
					hue="#c89860"
					className="h-full w-full"
				/>
			</div>

			<Container>
				<div className="flex min-h-[40svh] flex-col justify-end pb-[var(--space-12)]">
					<p
						className={cn(
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
						)}
					>
						<span
							aria-hidden="true"
							className="mr-2 inline-block h-px w-8 bg-current opacity-70 align-middle"
						/>
						Category
					</p>

					<h1
						ref={headingRef}
						aria-label={category.label}
						className={cn(
							"mt-[var(--space-4)] max-w-[18ch] font-display italic",
							"text-[clamp(56px,9vw,128px)] leading-[0.95]",
							"font-light tracking-[var(--tracking-display)]",
							"text-balance text-[color:var(--color-ink)]",
						)}
					>
						{prefersReducedMotion
							? words.join(" ")
							: words.map((word, i) => (
									<span
										key={`${word}-${i}`}
										className="inline-block overflow-hidden align-bottom pr-[0.18em]"
									>
										<span
											data-cat-word
											className="inline-block will-change-transform"
										>
											{word}
										</span>
									</span>
								))}
					</h1>

					<p
						className={cn(
							"mt-[var(--space-6)] max-w-[60ch] font-body",
							"text-[length:var(--text-lg)] leading-relaxed",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						{category.description}
					</p>

					<div className="mt-[var(--space-10)] flex items-center gap-4">
						<span
							aria-hidden="true"
							className="h-px w-16 bg-[color:var(--color-gold)] opacity-70"
						/>
						<span
							className={cn(
								"font-mono text-[length:var(--text-xs)] uppercase",
								"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
							)}
						>
							{count} {count === 1 ? "entry" : "entries"} &middot; Filed under{" "}
							{category.label.toLowerCase()}
						</span>
					</div>
				</div>
			</Container>
		</section>
	);
}
