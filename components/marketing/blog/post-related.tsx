import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/cms/posts";
import { BlogCard } from "@/components/marketing/sections/blog-grid";

type PostRelatedProps = {
	readonly posts: ReadonlyArray<BlogPost>;
};

/**
 * PostRelated — three-card rail of related journal entries.
 * Per docs/05-PAGE-SPECS.md §5.9. Reuses `BlogCard` so the visual language
 * is identical to the index grid.
 */
export function PostRelated({ posts }: PostRelatedProps): React.ReactElement {
	if (posts.length === 0) return <></>;
	return (
		<Section tone="elevated" spacing="md">
			<Container>
				<header className="mb-[var(--space-12)] max-w-[640px]">
					<p
						className={cn(
							"mb-[var(--space-3)] font-body uppercase",
							"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						Read next
					</p>
					<h2
						className={cn(
							"font-display tracking-[var(--tracking-display)]",
							"text-[length:var(--text-3xl)] leading-[1.1]",
							"text-balance text-[color:var(--color-ink)]",
						)}
					>
						<em className="italic">Three more</em> from the journal.
					</h2>
				</header>
				<ul
					className={cn(
						"grid gap-x-[var(--space-8)] gap-y-[var(--space-12)]",
						"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
					)}
				>
					{posts.slice(0, 3).map((post) => (
						<li key={post.slug}>
							<BlogCard post={post} />
						</li>
					))}
				</ul>
			</Container>
		</Section>
	);
}
