import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
	type BlogPost,
	formatPostDate,
	getCategoryBySlug,
} from "@/lib/cms/posts";

type BlogGridProps = {
	readonly posts: ReadonlyArray<BlogPost>;
	/** Eyebrow above the grid. */
	readonly eyebrow?: string;
	/** Heading above the grid; omit to render without a title block. */
	readonly title?: string;
	/** Hide first post (e.g. when it's already shown as Featured). */
	readonly excludeSlugs?: ReadonlyArray<string>;
};

/**
 * BlogGrid — 3-column post grid per docs/05-PAGE-SPECS.md §5.8.
 * Each card: cover image + title + excerpt + date + read-time + category.
 * Server Component; entrance motion can be layered via parent RevealOnScroll.
 */
export function BlogGrid({
	posts,
	eyebrow,
	title,
	excludeSlugs,
}: BlogGridProps): React.ReactElement {
	const filtered = excludeSlugs?.length
		? posts.filter((p) => !excludeSlugs.includes(p.slug))
		: posts;

	return (
		<Section tone="default" spacing="md">
			<Container>
				{(eyebrow || title) && (
					<header className="mb-[var(--space-12)] max-w-[720px]">
						{eyebrow ? (
							<p
								className={cn(
									"mb-[var(--space-3)] font-body uppercase",
									"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
									"text-[color:var(--color-ink-muted)]",
								)}
							>
								{eyebrow}
							</p>
						) : null}
						{title ? (
							<h2
								className={cn(
									"font-display tracking-[var(--tracking-display)]",
									"text-[length:var(--text-3xl)] leading-[1.1]",
									"text-balance text-[color:var(--color-ink)]",
								)}
							>
								{title}
							</h2>
						) : null}
					</header>
				)}

				{filtered.length === 0 ? (
					<p className="font-body text-[length:var(--text-base)] text-[color:var(--color-ink-muted)]">
						TODO: empty-state copy — no posts in this category yet.
					</p>
				) : (
					<ul
						className={cn(
							"grid gap-x-[var(--space-8)] gap-y-[var(--space-16)]",
							"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
						)}
					>
						{filtered.map((post) => (
							<li key={post.slug}>
								<BlogCard post={post} />
							</li>
						))}
					</ul>
				)}
			</Container>
		</Section>
	);
}

type BlogCardProps = {
	readonly post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps): React.ReactElement {
	const category = getCategoryBySlug(post.category);
	return (
		<article className="group">
			<Link
				href={`/blog/${post.slug}`}
				className={cn(
					"block focus-visible:outline-none focus-visible:ring-2",
					"focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4",
					"rounded-[var(--radius-md)]",
				)}
			>
				<div
					className={cn(
						"relative aspect-[4/5] w-full overflow-hidden",
						"rounded-[var(--radius-md)] bg-[color:var(--color-bg-elevated)]",
					)}
				>
					{post.coverImageUrl ? (
						<Image
							src={post.coverImageUrl}
							alt={post.coverImageAlt}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover transition-transform duration-[800ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
							loading="lazy"
						/>
					) : (
						<div
							aria-hidden="true"
							className={cn(
								"absolute inset-0",
								"bg-gradient-to-br from-[color:var(--color-cool)]/15 via-[color:var(--color-accent)]/10 to-[color:var(--color-gold)]/20",
							)}
						/>
					)}
				</div>
				<div className="mt-[var(--space-5)]">
					<div className="flex flex-wrap items-center gap-[var(--space-3)] text-[color:var(--color-ink-muted)]">
						{category ? (
							<span
								className={cn(
									"font-body uppercase",
									"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
								)}
							>
								{category.label}
							</span>
						) : null}
						<span
							aria-hidden="true"
							className="inline-block h-px w-4 bg-current opacity-50"
						/>
						<time
							dateTime={post.publishedDate}
							className={cn(
								"font-body text-[length:var(--text-xs)] uppercase",
								"tracking-[var(--tracking-eyebrow)]",
							)}
						>
							{formatPostDate(post.publishedDate)}
						</time>
					</div>
					<h3
						className={cn(
							"mt-[var(--space-3)] font-display tracking-[var(--tracking-display)]",
							"text-[length:var(--text-2xl)] leading-[1.15]",
							"text-balance text-[color:var(--color-ink)]",
							"transition-colors group-hover:text-[color:var(--color-accent)]",
						)}
					>
						{post.title}
					</h3>
					<p
						className={cn(
							"mt-[var(--space-3)] font-body text-[length:var(--text-base)] leading-[1.6]",
							"text-[color:var(--color-ink-muted)]",
							"line-clamp-3",
						)}
					>
						{post.excerpt}
					</p>
					<p
						className={cn(
							"mt-[var(--space-4)] font-body text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
						)}
					>
						{post.readTimeMinutes} min read
					</p>
				</div>
			</Link>
		</article>
	);
}
