"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { ParallaxStack } from "@/components/effects/3d-parallax-stack";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { formatPostDate, type BlogPost } from "@/lib/cms/posts";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

type BlogDetailHeroProps = {
	post: BlogPost;
};

const FALLBACK_COVER =
	"/images/marketing/work-01.jpg";

/**
 * BlogDetailHero — editorial cover image with parallax + sticky meta strip.
 *
 * Above-fold: brass eyebrow ("From the studio · {category}") + italic display
 * heading with word-by-word scrub reveal. Below: 65svh cover with parallax,
 * faint mandala ornament overlay, and a brass-hairline meta strip
 * (category, date, read time, author).
 */
export function BlogDetailHero({
	post,
}: BlogDetailHeroProps): React.ReactElement {
	const sectionRef = useRef<HTMLElement | null>(null);
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const prefersReducedMotion = useReducedMotion();

	const coverSrc = post.coverImageUrl ?? FALLBACK_COVER;

	useEffect(() => {
		if (prefersReducedMotion) return;
		const sectionEl = sectionRef.current;
		const headingEl = headingRef.current;
		if (!sectionEl || !headingEl) return;

		const ctx = gsap.context(() => {
			const wordNodes =
				headingEl.querySelectorAll<HTMLElement>("[data-detail-word]");
			if (wordNodes.length === 0) return;

			gsap.set(wordNodes, { yPercent: 100, opacity: 0, filter: "blur(6px)" });
			gsap.to(wordNodes, {
				yPercent: 0,
				opacity: 1,
				filter: "blur(0px)",
				ease: "power2.out",
				stagger: 0.05,
				scrollTrigger: {
					trigger: headingEl,
					start: "top 90%",
					end: "bottom 60%",
					scrub: 0.8,
				},
			});
		}, sectionEl);

		return (): void => {
			ctx.revert();
		};
	}, [prefersReducedMotion]);

	const headingWords = post.title.split(/\s+/u).filter(Boolean);

	return (
		<section
			ref={sectionRef}
			aria-label="Article cover"
			className="relative isolate w-full overflow-hidden bg-[color:var(--color-bg)]"
		>
			<Container>
				<div className="pt-[var(--space-32)] pb-[var(--space-10)] md:pt-[var(--space-40)] md:pb-[var(--space-12)]">
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
						From the studio &middot; {post.category.replace(/-/g, " ")}
					</p>

					<h1
						ref={headingRef}
						aria-label={post.title}
						className={cn(
							"mt-[var(--space-5)] max-w-[20ch] font-display italic",
							"text-[length:var(--text-5xl)] leading-[1.02] tracking-[var(--tracking-display)]",
							"text-balance text-[color:var(--color-ink)]",
							"md:text-[clamp(56px,7vw,96px)]",
						)}
					>
						{prefersReducedMotion
							? headingWords.join(" ")
							: headingWords.map((word, i) => (
									<span
										key={`${word}-${i}`}
										className="inline-block overflow-hidden align-bottom pr-[0.18em]"
									>
										<span
											data-detail-word
											className="inline-block will-change-transform"
										>
											{word}
										</span>
									</span>
								))}
					</h1>
				</div>
			</Container>

			<div className="relative h-[65svh] min-h-[420px] w-full overflow-hidden">
				<ParallaxStack
					className="absolute inset-0 h-full w-full"
					travel={18}
					layers={[
						{
							src: coverSrc,
							alt: post.coverImageAlt || post.title,
							depth: 0.25,
							width: 2200,
							height: 1400,
						},
					]}
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							"linear-gradient(180deg, rgba(14,11,8,0.05) 0%, rgba(14,11,8,0.35) 70%, rgba(14,11,8,0.55) 100%)",
					}}
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute right-[-12vw] top-1/2 hidden -translate-y-1/2 md:block"
					style={{ width: "50vh", height: "50vh", opacity: 0.14 }}
				>
					<CeremonyOrnament
						name="mandala"
						hue="#e8d5a8"
						className="h-full w-full"
					/>
				</div>
			</div>

			<Container>
				<div
					className={cn(
						"mt-[var(--space-6)] grid gap-[var(--space-4)]",
						"border-y border-[color:var(--color-gold)]/40",
						"py-[var(--space-5)]",
						"md:grid-cols-[auto_1fr_auto_auto] md:items-center",
					)}
				>
					<span
						className={cn(
							"inline-flex w-fit items-center px-3 py-1",
							"rounded-full border border-[color:var(--color-gold)]/55",
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
						)}
					>
						{post.category.replace(/-/g, " ")}
					</span>

					<div
						className={cn(
							"flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-1",
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]",
						)}
					>
						<time dateTime={post.publishedDate}>
							{formatPostDate(post.publishedDate)}
						</time>
						<span
							aria-hidden="true"
							className="inline-block h-px w-4 bg-current opacity-50"
						/>
						<span>{post.readTimeMinutes} min read</span>
					</div>

					<span
						aria-hidden="true"
						className="hidden h-4 w-px bg-[color:var(--color-gold)]/40 md:inline-block"
					/>

					<p
						className={cn(
							"font-body text-[length:var(--text-sm)]",
							"text-[color:var(--color-ink)]",
						)}
					>
						<span className="text-[color:var(--color-ink-soft)]">By </span>
						<span className="italic">{post.author.name}</span>
					</p>
				</div>
			</Container>
		</section>
	);
}
