import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	type BlogPost,
	formatPostDate,
	getCategoryBySlug,
} from "@/lib/cms/posts";

type PostMetaProps = {
	readonly post: BlogPost;
	readonly variant?: "stacked" | "inline";
};

/**
 * PostMeta — author, date, read-time, category tag strip.
 * Per docs/05-PAGE-SPECS.md §5.9 "Meta strip" — kept minimal and editorial.
 */
export function PostMeta({
	post,
	variant = "inline",
}: PostMetaProps): React.ReactElement {
	const category = getCategoryBySlug(post.category);

	return (
		<div
			className={cn(
				"flex gap-[var(--space-3)]",
				variant === "inline"
					? "flex-wrap items-center"
					: "flex-col items-start",
				"font-body text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]",
			)}
		>
			{category ? (
				<Link
					href={`/blog/category/${category.slug}`}
					className={cn(
						"font-body uppercase",
						"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
						"text-[color:var(--color-accent)]",
						"hover:text-[color:var(--color-accent-deep)] transition-colors",
					)}
				>
					{category.label}
				</Link>
			) : null}

			{variant === "inline" ? (
				<Separator />
			) : null}

			<span className="font-body text-[length:var(--text-sm)]">
				By <strong className="font-medium text-[color:var(--color-ink)]">
					{post.author.name}
				</strong>
			</span>

			{variant === "inline" ? (
				<Separator />
			) : null}

			<time
				dateTime={post.publishedDate}
				className="font-body text-[length:var(--text-sm)]"
			>
				{formatPostDate(post.publishedDate)}
			</time>

			{variant === "inline" ? (
				<Separator />
			) : null}

			<span className="font-body text-[length:var(--text-sm)]">
				{post.readTimeMinutes} min read
			</span>

			{post.tags.length > 0 ? (
				<ul
					className={cn(
						"flex flex-wrap gap-[var(--space-2)]",
						variant === "inline" ? "ml-[var(--space-2)]" : "mt-[var(--space-2)]",
					)}
				>
					{post.tags.map((tag) => (
						<li key={tag.slug}>
							<span
								className={cn(
									"inline-flex h-6 items-center px-[var(--space-3)]",
									"rounded-[999px] border border-[color:var(--color-border)]",
									"font-body text-[length:var(--text-xs)] uppercase",
									"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]",
								)}
							>
								{tag.label}
							</span>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

function Separator(): React.ReactElement {
	return (
		<span
			aria-hidden="true"
			className="inline-block h-px w-4 bg-current opacity-50"
		/>
	);
}
