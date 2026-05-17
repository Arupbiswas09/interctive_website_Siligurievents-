import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
	buildBreadcrumb,
	jsonLdScript,
	SITE_URL,
} from "@/lib/seo/schemas";
import { BlogHeroFeatured } from "@/components/marketing/sections/blog-v2/blog-hero-featured";
import { BlogCategoryChipsAndGrid } from "@/components/marketing/sections/blog-v2/blog-category-chips-and-grid";
import { BlogNewsletterCard } from "@/components/marketing/sections/blog-v2/blog-newsletter-card";
import { CATEGORIES, POSTS } from "@/components/marketing/sections/blog-v2/blog-data";

/**
 * /blog — Journal index v2.
 *
 * Sections (top to bottom):
 *   1. BlogHeroFeatured — large featured post with parallax stack.
 *   2. BlogCategoryChipsAndGrid — sticky chip filter + animated grid.
 *   3. BlogNewsletterCard — themed signup.
 */

export async function generateMetadata(): Promise<Metadata> {
	return buildPageMetadata({
		title: "Journal · Notes on decor, weddings & Bengal",
		description:
			"Wedding planning notes, Bengali ceremony guides, and behind-the-scenes from Siligurievent's North Bengal event decoration studio.",
		path: "/blog",
		locale: "en",
		ogType: "website",
		keywords: [
			"wedding planning blog",
			"bengali wedding decoration",
			"siliguri events journal",
			"north bengal wedding ideas",
		],
	});
}

export default async function BlogIndexPage(): Promise<React.ReactElement> {
	const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
	if (!featured) {
		throw new Error("blog: POSTS list is empty");
	}

	const breadcrumb = buildBreadcrumb([
		{ name: "Home", path: "/" },
		{ name: "Journal", path: "/blog" },
	]);

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "Blog",
		"@id": `${SITE_URL}/blog#blog`,
		name: "Siligurievent Journal",
		description:
			"Wedding planning, Bengali ceremony guides, and editorial notes from a North Bengal decor studio.",
		url: `${SITE_URL}/blog`,
		inLanguage: "en-IN",
		publisher: {
			"@type": "Organization",
			name: "Siligurievent",
			url: SITE_URL,
		},
		blogPost: POSTS.map((p) => ({
			"@type": "BlogPosting" as const,
			headline: p.title,
			description: p.excerpt,
			datePublished: p.date,
			url: `${SITE_URL}/blog/${p.slug}`,
		})),
	};

	return (
		<>
			{jsonLdScript(blogSchema)}
			{jsonLdScript(breadcrumb)}

			<Suspense fallback={null}>
				<BlogHeroFeatured post={featured} />
				<BlogCategoryChipsAndGrid posts={POSTS} categories={CATEGORIES} />
				<BlogNewsletterCard />
			</Suspense>
		</>
	);
}
