import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
	buildBlogPosting,
	buildBreadcrumb,
	jsonLdScript,
} from "@/lib/seo/schemas";
import {
	getAllPostSlugs,
	getPostBySlug,
	getRelatedPosts,
} from "@/lib/cms/posts";
import { BlogDetailHero } from "@/components/marketing/sections/blog-detail/blog-detail-hero";
import { BlogDetailArticle } from "@/components/marketing/sections/blog-detail/blog-detail-article";
import { BlogDetailAuthorCard } from "@/components/marketing/sections/blog-detail/blog-detail-author-card";
import { BlogDetailRelated } from "@/components/marketing/sections/blog-detail/blog-detail-related";
import { BlogDetailCtaCloser } from "@/components/marketing/sections/blog-detail/blog-detail-cta-closer";

type RouteParams = {
	readonly params: Promise<{ readonly slug: string }>;
};

/**
 * /blog/[slug] — editorial long-form post.
 *
 * Static at build via generateStaticParams. Cache-tagged per slug so a
 * Payload `posts.afterChange` hook can invalidate just the changed post.
 *
 * Section composition (top → bottom):
 *   1. BlogDetailHero       — cover + parallax + sticky meta strip
 *   2. BlogDetailArticle    — editorial body + TOC + share rail
 *   3. BlogDetailAuthorCard — author bio
 *   4. BlogDetailRelated    — three related posts
 *   5. BlogDetailCtaCloser  — "Bring us a date." closer
 */

export async function generateStaticParams(): Promise<
	Array<{ slug: string }>
> {
	return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: RouteParams): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);
	if (!post) {
		return buildPageMetadata({
			title: "Post not found",
			description: "",
			path: `/blog/${slug}`,
			locale: "en",
			noIndex: true,
		});
	}
	return buildPageMetadata({
		title: post.title,
		description: post.excerpt.slice(0, 155),
		path: `/blog/${post.slug}`,
		locale: post.locale,
		ogType: "article",
		image: post.coverImageUrl,
		publishedTime: post.publishedDate,
		modifiedTime: post.updatedDate,
		authorName: post.author.name,
		keywords: post.tags.map((t) => t.label),
	});
}

async function getPostData(slug: string) {
	"use cache";
	cacheLife("max");
	cacheTag(`post:${slug}`);

	const post = getPostBySlug(slug);
	if (!post) return null;
	return {
		post,
		related: getRelatedPosts(slug, 3),
	};
}

export default async function BlogPostPage({
	params,
}: RouteParams): Promise<React.ReactElement> {
	const { slug } = await params;
	const data = await getPostData(slug);
	if (!data) notFound();
	const { post, related } = data;

	const breadcrumb = buildBreadcrumb([
		{ name: "Home", path: "/" },
		{ name: "Journal", path: "/blog" },
		{ name: post.title, path: `/blog/${post.slug}` },
	]);

	const blogPosting = buildBlogPosting(
		{
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			coverImageUrl: post.coverImageUrl,
			publishedDate: post.publishedDate,
			updatedDate: post.updatedDate,
			category: post.category,
			tags: post.tags.map((t) => t.label),
			readTimeMinutes: post.readTimeMinutes,
		},
		{
			name: post.author.name,
			role: post.author.role,
			bio: post.author.bio,
			imageUrl: post.author.avatarUrl,
		},
		{
			businessName: "Siligurievent",
			city: "Siliguri",
			state: "WB",
			country: "IN",
		},
	);

	return (
		<>
			{jsonLdScript(blogPosting)}
			{jsonLdScript(breadcrumb)}

			<BlogDetailHero post={post} />

			<Suspense fallback={null}>
				<BlogDetailArticle post={post} />
			</Suspense>

			<BlogDetailAuthorCard author={post.author} />

			<Suspense fallback={null}>
				<BlogDetailRelated posts={related} />
			</Suspense>

			<Suspense fallback={null}>
				<BlogDetailCtaCloser />
			</Suspense>
		</>
	);
}
