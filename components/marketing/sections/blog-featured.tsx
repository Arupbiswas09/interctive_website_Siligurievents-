import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";
import {
	type BlogPost,
	formatPostDate,
	getCategoryBySlug,
} from "@/lib/cms/posts";

type BlogFeaturedProps = {
	readonly post: BlogPost;
};

/**
 * BlogFeatured — large card with full-bleed image and overlaid title.
 * Per docs/05-PAGE-SPECS.md §5.8 — the most-recent post is hero-styled
 * to anchor the journal index.
 */
export function BlogFeatured({ post }: BlogFeaturedProps): React.ReactElement {
	const category = getCategoryBySlug(post.category);
	return (
		<Section tone="default" spacing="md">
			<Container>
				<Eyebrow tone="muted" className="mb-[var(--space-6)]">
					Featured
				</Eyebrow>
				<Link
					href={`/blog/${post.slug}`}
					className={cn(
						"group relative block overflow-hidden rounded-[var(--radius-md)]",
						"bg-[color:var(--color-bg-elevated)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4",
					)}
				>
					<div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
						{post.coverImageUrl ? (
							<Parallax speed={0.3} className="absolute inset-0">
								<Image
									src={post.coverImageUrl}
									alt={post.coverImageAlt}
									fill
									priority
									sizes="(max-width: 1440px) 100vw, 1440px"
									className="object-cover transition-transform duration-[800ms] ease-[var(--ease-out)] group-hover:scale-[1.02]"
								/>
							</Parallax>
						) : (
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-cool)]/30 via-[color:var(--color-accent)]/20 to-[color:var(--color-gold)]/30"
							/>
						)}
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
						/>
						<div className="absolute inset-x-0 bottom-0 p-[var(--space-8)] md:p-[var(--space-16)]">
							<div className="flex flex-wrap items-center gap-[var(--space-3)] text-[#F5EDE0]/80">
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
									className="inline-block h-px w-4 bg-current opacity-60"
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
							<h2
								className={cn(
									"mt-[var(--space-4)] max-w-[820px]",
									"font-display tracking-[var(--tracking-display)]",
									"text-[length:var(--text-4xl)] leading-[1.05]",
									"text-balance text-[#F5EDE0]",
								)}
							>
								{post.title}
							</h2>
							<p
								className={cn(
									"mt-[var(--space-4)] max-w-[680px]",
									"font-body text-[length:var(--text-base)] leading-[1.6]",
									"text-[#F5EDE0]/80",
								)}
							>
								{post.excerpt}
							</p>
							<span
								className={cn(
									"mt-[var(--space-6)] inline-flex items-center gap-[var(--space-2)]",
									"font-body text-[length:var(--text-sm)] uppercase",
									"tracking-[var(--tracking-eyebrow)] text-[#F5EDE0]",
								)}
							>
								Read the journal entry
								<span aria-hidden="true">→</span>
							</span>
						</div>
					</div>
				</Link>
			</Container>
		</Section>
	);
}
