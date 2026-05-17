"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SplitImage } from "@/components/effects/3d-split-image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { formatPostDate, type Post } from "./blog-data";

type BlogGridProps = {
	posts: ReadonlyArray<Post>;
};

/**
 * 12-col editorial post grid. Cards animate in/out with Framer Motion
 * `layout` for filter transitions.
 */
export function BlogGrid({ posts }: BlogGridProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.ul
			layout
			className={cn(
				"grid gap-x-[var(--space-8)] gap-y-[var(--space-16)]",
				"grid-cols-12",
			)}
		>
			<AnimatePresence mode="popLayout">
				{posts.map((post, index) => (
					<motion.li
						key={post.slug}
						layout
						initial={
							prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
						}
						animate={{ opacity: 1, y: 0 }}
						exit={
							prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
						}
						transition={{
							duration: prefersReducedMotion ? 0.2 : 0.55,
							delay: prefersReducedMotion ? 0 : Math.min(index * 0.05, 0.3),
							ease: [0.16, 1, 0.3, 1],
						}}
						className="col-span-12 list-none md:col-span-6 lg:col-span-4"
					>
						<BlogCard post={post} />
					</motion.li>
				))}
			</AnimatePresence>
		</motion.ul>
	);
}

type BlogCardProps = {
	post: Post;
};

function BlogCard({ post }: BlogCardProps): React.ReactElement {
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
					"block",
					"focus-visible:outline-none focus-visible:ring-2",
					"focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-bg)]",
					"rounded-[var(--radius-sm)]",
				)}
			>
				<SplitImage
					src={post.image}
					alt={post.title}
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
							{post.category}
						</span>
						<span
							aria-hidden="true"
							className="inline-block h-px w-4 bg-current opacity-50"
						/>
						<time dateTime={post.date}>{formatPostDate(post.date)}</time>
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
							"text-[color:var(--color-ink-muted)]",
							"line-clamp-3",
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
							→
						</span>
						<span
							aria-hidden="true"
							className="ml-3 font-mono text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]"
						>
							{post.readTime} min
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
