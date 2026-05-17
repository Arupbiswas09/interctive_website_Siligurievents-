"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { velocityBlur } from "@/lib/gsap";
import {
	POST_CATEGORIES,
	type PostCategorySlug,
} from "@/lib/cms/posts";

type BlogCategoryChipsProps = {
	/** When rendered on /blog/category/[slug], pass the slug to mark active. */
	readonly activeCategory?: PostCategorySlug | "all";
	/**
	 * Where the chips link to.
	 * - "category-route" → /blog/category/[slug] (canonical, indexable)
	 * - "query" → /blog?category=[slug] (preserved for client-side filtering)
	 */
	readonly mode?: "category-route" | "query";
};

/**
 * BlogCategoryChips — horizontally scrolling category filter chips.
 * Client Component because it reads URL state (query params or pathname)
 * to highlight the active chip. Links use Next.js `<Link>` so transitions
 * stay snappy and SEO stays canonical (/blog/category/[slug]).
 */
export function BlogCategoryChips({
	activeCategory,
	mode = "category-route",
}: BlogCategoryChipsProps): React.ReactElement {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const chipRowRef = useRef<HTMLUListElement | null>(null);

	// SIG-03 "Velocity Bend" — blur + skew the chip row during fast
	// (horizontal or vertical) scroll. Factory short-circuits on
	// reduced-motion / Save-Data.
	useEffect(() => {
		const node = chipRowRef.current;
		if (!node) return;
		const cleanup = velocityBlur({
			target: node,
			maxBlur: 2,
			maxSkew: 3,
		});
		return cleanup;
	}, []);

	const resolvedActive: PostCategorySlug | "all" = useMemo(() => {
		if (activeCategory) return activeCategory;
		if (mode === "query") {
			const c = searchParams.get("category");
			if (c && POST_CATEGORIES.find((p) => p.slug === c)) {
				return c as PostCategorySlug;
			}
			return "all";
		}
		// derive from /blog/category/[slug]
		const match = pathname?.match(/\/blog\/category\/([^/]+)/);
		if (match?.[1]) {
			const slug = match[1] as PostCategorySlug;
			if (POST_CATEGORIES.find((p) => p.slug === slug)) return slug;
		}
		return "all";
	}, [activeCategory, mode, pathname, searchParams]);

	return (
		<nav aria-label="Filter posts by category" className="relative">
			<ul
				ref={chipRowRef}
				className={cn(
					"flex flex-nowrap gap-[var(--space-2)] overflow-x-auto",
					"-mx-[var(--gutter)] px-[var(--gutter)] py-[var(--space-2)]",
					"snap-x snap-mandatory",
					"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				)}
			>
				<li className="snap-start">
					<Chip href="/blog" isActive={resolvedActive === "all"}>
						All posts
					</Chip>
				</li>
				{POST_CATEGORIES.map((c) => {
					const href =
						mode === "category-route"
							? `/blog/category/${c.slug}`
							: `/blog?category=${c.slug}`;
					return (
						<li key={c.slug} className="snap-start">
							<Chip href={href} isActive={resolvedActive === c.slug}>
								{c.label}
							</Chip>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

type ChipProps = {
	readonly href: string;
	readonly isActive: boolean;
	readonly children: React.ReactNode;
};

function Chip({ href, isActive, children }: ChipProps): React.ReactElement {
	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"inline-flex h-10 items-center whitespace-nowrap",
				"rounded-[999px] px-[var(--space-5)]",
				"font-body text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
				"transition-[color,background-color,border-color] duration-200",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
				isActive
					? cn(
							"bg-[color:var(--color-ink)] text-[color:var(--color-bg)]",
							"border border-[color:var(--color-ink)]",
						)
					: cn(
							"bg-transparent text-[color:var(--color-ink-muted)]",
							"border border-[color:var(--color-border)]",
							"hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)]",
						),
			)}
		>
			{children}
		</Link>
	);
}
