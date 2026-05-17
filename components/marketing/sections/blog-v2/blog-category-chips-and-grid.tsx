"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { BlogCategoryChips } from "./blog-category-chips";
import { BlogGrid } from "./blog-grid";
import type { Post } from "./blog-data";

type BlogCategoryChipsAndGridProps = {
	posts: ReadonlyArray<Post>;
	categories: ReadonlyArray<string>;
};

/**
 * Combined client-side wrapper: owns the active category, filters the post
 * list, and renders the sticky chip rail + animated grid as siblings.
 */
export function BlogCategoryChipsAndGrid({
	posts,
	categories,
}: BlogCategoryChipsAndGridProps): React.ReactElement {
	const [active, setActive] = useState<string>("All");

	const filtered = useMemo(() => {
		if (active === "All") return posts;
		return posts.filter((p) => p.category === active);
	}, [posts, active]);

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<BlogCategoryChips
					categories={categories}
					active={active}
					onChange={setActive}
				/>
				<div className="mt-[var(--space-12)] md:mt-[var(--space-16)]">
					<BlogGrid posts={filtered} />
				</div>
			</Container>
		</Section>
	);
}
