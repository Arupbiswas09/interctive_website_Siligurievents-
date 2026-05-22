"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SplitImage } from "@/components/effects/3d-split-image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { formatPostDate, type BlogPost } from "@/lib/cms/posts";

type BlogDetailRelatedProps = {
	posts: ReadonlyArray<BlogPost>;
};

const FALLBACK_IMAGE =
	"/images/marketing/hero-home-alt.jpg";

/**
 * BlogDetailRelated — "More from the studio" — three posts in a brass-cornered
 * grid. Uses the same SplitImage card pattern as the blog-v2 index grid for
 * visual continuity.
 */
export function BlogDetailRelated({
	posts,
}: BlogDetailRelatedProps): React.ReactElement | null {
	const prefersReducedMotion = useReducedMotion();

	if (posts.length === 0) return null;

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<div className="mb-[var(--space-10)] flex items-end justify-between gap-[var(--space-6)]">
					<div>
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
							Keep reading
						</p>
						<h2
							className={cn(
								"mt-[var(--space-3)] font-display italic",
								"text-[length:var(--text-4xl)] leading-[1.05]",
								"tracking-[var(--tracking-display)]",
								"text-balance text-[color:var(--color-ink)]",
							)}
						>
							More from the studio
						</h2>
					</div>
					<Link
						href="/blog"
						className={cn(
							"group hidden items-center gap-2 md:inline-flex",
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink)]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
						)}
					>
						<span className="relative">
							All entries
							<span
								aria-hidden="true"
								className={cn(
									"absolute -bottom-0.5 left-0 h-px w-full",
									"origin-left scale-x-0 bg-[color:var(--color-gold)]",
									"transition-transform duration-500",
									"group-hover:scale-x-100",
								)}
							/>
						</span>
						<span
							aria-hidden="true"
							className="transition-transform group-hover:translate-x-1"
						>
							&rarr;
						</span>
					</Link>
				</div>

				<ul
					className={cn(
						"grid gap-x-[var(--space-6)] gap-y-[var(--space-10)]",
						"md:grid-cols-3",
					)}
				>
					{posts.slice(0, 3).map((post, index) => (
						<motion.li
							key={post.slug}
							initial={
								prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
							}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-10% 0px" }}
							transition={{
								duration: prefersReducedMotion ? 0.25 : 0.55,
								delay: prefersReducedMotion ? 0 : index * 0.08,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="list-none"
						>
							<RelatedCard post={post} />
						</motion.li>
					))}
				</ul>
			</Container>
		</Section>
	);
}

function RelatedCard({ post }: { post: BlogPost }): React.ReactElement {
	return (
		<article
			className={cn(
				"group relative h-full",
				"rounded-[var(--radius-md)]",
				"bg-[color:var(--color-bg-elevated)]",
				"border border-[color:var(--color-border)]/60",
				"p-[var(--space-5)]",
				"transition-shadow duration-500",
				"hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]",
			)}
		>
			<BrassCorner position="tl" />
			<BrassCorner position="tr" />
			<BrassCorner position="bl" />
			<BrassCorner position="br" />

			<Link
				href={`/blog/${post.slug}`}
				className={cn(
					"block rounded-[var(--radius-sm)]",
					"focus-visible:outline-none focus-visible:ring-2",
					"focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-bg)]",
				)}
			>
				<SplitImage
					src={post.coverImageUrl ?? FALLBACK_IMAGE}
					alt={post.coverImageAlt || post.title}
					panels={3}
					trigger="hover"
					width={1200}
					height={960}
					className="w-full"
				/>

				<div className="mt-[var(--space-5)]">
					<div
						className={cn(
							"flex flex-wrap items-center gap-[var(--space-3)]",
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]",
						)}
					>
						<span
							className={cn(
								"inline-flex items-center px-2 py-0.5",
								"rounded-full border border-[color:var(--color-gold)]/40",
								"text-[color:var(--color-gold)]",
							)}
						>
							{post.category.replace(/-/g, " ")}
						</span>
						<span
							aria-hidden="true"
							className="inline-block h-px w-4 bg-current opacity-50"
						/>
						<time dateTime={post.publishedDate}>
							{formatPostDate(post.publishedDate)}
						</time>
					</div>

					<h3
						className={cn(
							"mt-[var(--space-3)] font-display italic",
							"text-[length:var(--text-2xl)] leading-[1.15]",
							"text-balance text-[color:var(--color-ink)]",
							"transition-colors group-hover:text-[color:var(--color-accent)]",
						)}
					>
						{post.title}
					</h3>

					<p
						className={cn(
							"mt-[var(--space-3)] font-body text-[length:var(--text-base)] leading-relaxed",
							"text-[color:var(--color-ink-muted)] line-clamp-3",
						)}
					>
						{post.excerpt}
					</p>

					<p
						className={cn(
							"mt-[var(--space-5)] inline-flex items-center gap-2",
							"font-body text-[length:var(--text-sm)]",
							"text-[color:var(--color-ink)]",
						)}
					>
						<span className="relative">
							Read
							<span
								aria-hidden="true"
								className={cn(
									"absolute -bottom-0.5 left-0 h-px w-full",
									"origin-left scale-x-0 bg-[color:var(--color-gold)]",
									"transition-transform duration-500",
									"group-hover:scale-x-100",
								)}
							/>
						</span>
						<span
							aria-hidden="true"
							className="transition-transform group-hover:translate-x-1"
						>
							&rarr;
						</span>
						<span
							aria-hidden="true"
							className={cn(
								"ml-3 font-mono text-[length:var(--text-xs)] uppercase",
								"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
							)}
						>
							{post.readTimeMinutes} min
						</span>
					</p>
				</div>
			</Link>
		</article>
	);
}

function BrassCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "top-2 left-2 rotate-0",
		tr: "top-2 right-2 rotate-90",
		bl: "bottom-2 left-2 -rotate-90",
		br: "bottom-2 right-2 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-4 w-4",
				"text-[color:var(--color-gold)]/80",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 20 20"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
			>
				<path d="M0 6 L 0 0 L 6 0" />
			</svg>
		</span>
	);
}
