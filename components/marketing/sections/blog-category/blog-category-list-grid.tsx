"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { BlogCategoryChips } from "@/components/marketing/sections/blog-v2/blog-category-chips";
import { BlogGrid } from "@/components/marketing/sections/blog-v2/blog-grid";
import type { Post } from "@/components/marketing/sections/blog-v2/blog-data";

type BlogCategoryListGridProps = {
	posts: ReadonlyArray<Post>;
	categories: ReadonlyArray<string>;
	activeCategory: string;
};

/**
 * BlogCategoryListGrid — wrapper around the existing v2 blog grid + chip
 * filter that pre-selects an `activeCategory`. Selecting a chip routes to
 * the matching category page (or back to /blog for "All"), so the URL
 * always reflects the visible filter.
 *
 * Intentionally lives outside `blog-v2/` so we can pre-select without
 * touching the existing shared filter wrapper.
 */
export function BlogCategoryListGrid({
	posts,
	categories,
	activeCategory,
}: BlogCategoryListGridProps): React.ReactElement {
	const router = useRouter();
	const [active, setActive] = useState<string>(activeCategory);

	const filtered = useMemo(() => {
		if (active === "All") return posts;
		return posts.filter((p) => p.category === active);
	}, [posts, active]);

	const handleChange = (next: string): void => {
		setActive(next);
		if (next === "All") {
			router.push("/blog");
			return;
		}
		const slug = toCategorySlug(next);
		router.push(`/blog/category/${slug}`);
	};

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<BlogCategoryChips
					categories={categories}
					active={active}
					onChange={handleChange}
				/>
				<div className="mt-[var(--space-12)] md:mt-[var(--space-16)]">
					<BlogGrid posts={filtered} />
				</div>
			</Container>
		</Section>
	);
}

function toCategorySlug(label: string): string {
	return label
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
