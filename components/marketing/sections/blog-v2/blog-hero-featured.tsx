import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ParallaxStack } from "@/components/effects/3d-parallax-stack";
import { cn } from "@/lib/utils";
import { formatPostDate, type Post } from "./blog-data";

type BlogHeroFeaturedProps = {
	post: Post;
};

/**
 * Two-column featured-post hero. Left: parallax image stack with brass
 * corner ornaments. Right: editorial card with eyebrow, italic headline,
 * excerpt, meta and "read essay" link.
 */
export function BlogHeroFeatured({
	post,
}: BlogHeroFeaturedProps): React.ReactElement {
	return (
		<Section
			tone="default"
			spacing="lg"
			className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-40)]"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
			>
				<div
					className="absolute inset-0 opacity-50"
					style={{
						background:
							"radial-gradient(ellipse at 80% 0%, rgba(184,137,58,0.25) 0%, transparent 55%), radial-gradient(ellipse at 0% 60%, rgba(139,26,26,0.15) 0%, transparent 55%)",
					}}
				/>
			</div>

			<Container>
				<div
					className={cn(
						"grid grid-cols-1 gap-[var(--space-12)] lg:grid-cols-12",
						"items-center",
					)}
				>
					<div className="relative lg:col-span-7">
						<BrassCorner position="tl" />
						<BrassCorner position="tr" />
						<BrassCorner position="bl" />
						<BrassCorner position="br" />

						<div
							className={cn(
								"relative aspect-[5/4] w-full overflow-hidden",
								"rounded-[var(--radius-md)]",
								"bg-[color:var(--color-bg-elevated)]",
							)}
						>
							<ParallaxStack
								className="absolute inset-0"
								travel={20}
								layers={[
									{
										src: post.image,
										alt: `Featured essay — ${post.title}`,
										depth: 0.2,
										width: 1600,
										height: 1280,
									},
									{
										src: post.image,
										alt: "",
										depth: 0.55,
										width: 1600,
										height: 1280,
										className: "mix-blend-multiply opacity-60",
									},
								]}
							/>
							<div
								aria-hidden="true"
								className={cn(
									"pointer-events-none absolute inset-0",
									"bg-gradient-to-t from-[rgba(14,11,8,0.35)] via-transparent to-transparent",
								)}
							/>
						</div>
					</div>

					<div className="lg:col-span-5">
						<RevealOnScroll>
							<Eyebrow tone="gold">Featured this month</Eyebrow>
						</RevealOnScroll>

						<DisplayHeading
							as="h1"
							size="xl"
							className="mt-[var(--space-5)] font-light italic"
						>
							{post.title}
						</DisplayHeading>

						<RevealOnScroll delay={0.15}>
							<p
								className={cn(
									"mt-[var(--space-6)] max-w-[44ch]",
									"font-body text-[length:var(--text-lg)] leading-relaxed",
									"text-[color:var(--color-ink-muted)]",
								)}
							>
								{post.excerpt}
							</p>
						</RevealOnScroll>

						<RevealOnScroll delay={0.25}>
							<div
								className={cn(
									"mt-[var(--space-6)] flex items-center gap-[var(--space-3)]",
									"font-mono text-[length:var(--text-xs)] uppercase",
									"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
								)}
							>
								<time dateTime={post.date}>{formatPostDate(post.date)}</time>
								<span
									aria-hidden="true"
									className="inline-block h-px w-4 bg-current opacity-60"
								/>
								<span>{post.readTime} min read</span>
							</div>
						</RevealOnScroll>

						<RevealOnScroll delay={0.35}>
							<div className="mt-[var(--space-8)]">
								<span
									aria-hidden="true"
									className="mb-[var(--space-5)] block h-px w-16 bg-[color:var(--color-gold)]"
								/>
								<Link
									href={`/blog/${post.slug}`}
									className={cn(
										"group inline-flex items-center gap-3",
										"font-display italic text-[length:var(--text-xl)]",
										"text-[color:var(--color-ink)]",
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-bg)]",
									)}
								>
									<span className="relative">
										Read essay
										<span
											aria-hidden="true"
											className={cn(
												"absolute -bottom-0.5 left-0 h-px w-full",
												"origin-left bg-[color:var(--color-gold)]",
												"transition-transform duration-500",
												"group-hover:scale-x-[1.04]",
											)}
										/>
									</span>
									<span
										aria-hidden="true"
										className="transition-transform group-hover:translate-x-1"
									>
										→
									</span>
								</Link>
							</div>
						</RevealOnScroll>
					</div>
				</div>
			</Container>
		</Section>
	);
}

function BrassCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "-top-3 -left-3 rotate-0",
		tr: "-top-3 -right-3 rotate-90",
		bl: "-bottom-3 -left-3 -rotate-90",
		br: "-bottom-3 -right-3 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-9 w-9",
				"text-[color:var(--color-gold)]",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 36 36"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			>
				<path d="M0 14 L 0 0 L 14 0" />
				<path d="M3 17 Q 8 8 17 3" opacity="0.55" />
				<circle cx="2" cy="2" r="1.4" fill="currentColor" opacity="0.7" />
			</svg>
		</span>
	);
}
