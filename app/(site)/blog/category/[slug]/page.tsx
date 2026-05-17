import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
	buildBreadcrumb,
	jsonLdScript,
	SITE_URL,
} from "@/lib/seo/schemas";
import {
	getAllCategorySlugs,
	getCategoryBySlug,
	getPostsByCategory,
	POST_CATEGORIES,
	type BlogPost,
	type PostCategorySlug,
} from "@/lib/cms/posts";
import { BlogCategoryHero } from "@/components/marketing/sections/blog-category/blog-category-hero";
import { BlogCategoryListGrid } from "@/components/marketing/sections/blog-category/blog-category-list-grid";
import type { Post } from "@/components/marketing/sections/blog-v2/blog-data";

type RouteParams = {
	readonly params: Promise<{ readonly slug: string }>;
};

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1607261504259-c9bf36e8e6e8?auto=format&fit=crop&w=1600&q=80";

const CATEGORIES_FOR_CHIPS: ReadonlyArray<string> = [
	"All",
	...POST_CATEGORIES.map((c) => c.label),
];

export async function generateStaticParams(): Promise<
	Array<{ slug: string }>
> {
	return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: RouteParams): Promise<Metadata> {
	const { slug } = await params;
	const category = getCategoryBySlug(slug);
	if (!category) {
		return buildPageMetadata({
			title: "Category not found",
			description: "",
			path: "/blog",
			locale: "en",
			noIndex: true,
		});
	}
	return buildPageMetadata({
		title: `${category.label} · Journal`,
		description: `Wedding planning, ceremony guides, and behind-the-scenes essays from Siligurievent — filed under ${category.label.toLowerCase()}.`,
		path: `/blog/category/${slug}`,
		locale: "en",
		ogType: "website",
		keywords: ["siligurievent journal", category.label, "wedding decor blog"],
	});
}

async function getCategoryData(slug: PostCategorySlug) {
	"use cache";
	cacheLife("hours");
	cacheTag("posts:index");
	cacheTag(`posts:category:${slug}`);

	return {
		category: getCategoryBySlug(slug),
		posts: getPostsByCategory(slug),
	};
}

/**
 * Map a CMS BlogPost into the lighter v2 `Post` shape consumed by the
 * existing BlogGrid / chip filter. Until Sprint 2 wires Payload through end
 * to end, this keeps the visible card UI consistent on both /blog and the
 * category routes.
 */
function toListPost(post: BlogPost, label: string): Post {
	return {
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		category: label,
		readTime: post.readTimeMinutes,
		image: post.coverImageUrl ?? FALLBACK_IMAGE,
		featured: false,
		date: post.publishedDate.slice(0, 10),
	};
}

export default async function BlogCategoryPage({
	params,
}: RouteParams): Promise<React.ReactElement> {
	const { slug } = await params;
	const category = getCategoryBySlug(slug);
	if (!category) notFound();

	const { posts } = await getCategoryData(slug as PostCategorySlug);

	const listPosts: ReadonlyArray<Post> = posts.map((p) => {
		const label =
			POST_CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category;
		return toListPost(p, label);
	});

	const breadcrumb = buildBreadcrumb([
		{ name: "Home", path: "/" },
		{ name: "Journal", path: "/blog" },
		{ name: category.label, path: `/blog/category/${slug}` },
	]);

	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${SITE_URL}/blog/category/${slug}#collection`,
		name: `${category.label} · Siligurievent Journal`,
		description: category.description,
		url: `${SITE_URL}/blog/category/${slug}`,
		inLanguage: "en-IN",
		isPartOf: {
			"@type": "Blog",
			"@id": `${SITE_URL}/blog#blog`,
			name: "Siligurievent Journal",
		},
		mainEntity: {
			"@type": "ItemList" as const,
			itemListElement: posts.map((p, i) => ({
				"@type": "ListItem" as const,
				position: i + 1,
				url: `${SITE_URL}/blog/${p.slug}`,
				name: p.title,
			})),
		},
	};

	return (
		<>
			{jsonLdScript(collectionSchema)}
			{jsonLdScript(breadcrumb)}

			<BlogCategoryHero category={category} count={posts.length} />

			<Suspense fallback={null}>
				<BlogCategoryListGrid
					posts={listPosts}
					categories={CATEGORIES_FOR_CHIPS}
					activeCategory={category.label}
				/>
			</Suspense>
		</>
	);
}
