/**
 * Stubbed CMS helper for the `posts` collection (per docs/08-CMS-PLAN.md §8.2).
 *
 * Sprint 1: hard-coded mock data so the blog routes are buildable before
 * Payload is wired up in Sprint 2. The shape mirrors what Payload will return
 * with `depth: 1` and `localized: true` fields collapsed to the active locale.
 *
 * When Sprint 2 replaces this with a Payload query, the public surface
 * (`getAllPosts`, `getPostBySlug`, `getPostsByCategory`, `getRelatedPosts`,
 * `getAllCategories`, `getFeaturedPost`, `POST_CATEGORIES`) must remain stable.
 */
import type { Locale } from "@/lib/seo/metadata";

export type PostCategorySlug =
	| "planning"
	| "bengali-weddings"
	| "trends"
	| "behind-the-scenes"
	| "locations";

export interface PostCategory {
	readonly slug: PostCategorySlug;
	readonly label: string;
	readonly description: string;
}

export interface PostAuthor {
	readonly name: string;
	readonly role: string;
	readonly bio: string;
	readonly avatarUrl?: string;
}

export interface PostTag {
	readonly slug: string;
	readonly label: string;
}

export interface BlogPost {
	readonly slug: string;
	readonly title: string;
	readonly excerpt: string;
	readonly coverImageUrl?: string;
	readonly coverImageAlt: string;
	readonly category: PostCategorySlug;
	readonly tags: ReadonlyArray<PostTag>;
	readonly author: PostAuthor;
	readonly publishedDate: string; // ISO 8601
	readonly updatedDate?: string;
	readonly readTimeMinutes: number;
	readonly body: string; // raw MDX/markdown — rendered via components/cms/mdx-components
	readonly relatedPostSlugs?: ReadonlyArray<string>;
	readonly locale: Locale;
}

// ---------------------------------------------------------------------------
// Categories (per docs/05-PAGE-SPECS.md §5.8 + docs/08-CMS-PLAN.md §8.2 posts)
// ---------------------------------------------------------------------------

export const POST_CATEGORIES: ReadonlyArray<PostCategory> = [
	{
		slug: "planning",
		label: "Wedding planning",
		description: "TODO: planning category short blurb.",
	},
	{
		slug: "bengali-weddings",
		label: "Bengali weddings",
		description: "TODO: bengali-weddings category short blurb.",
	},
	{
		slug: "trends",
		label: "Trends",
		description: "TODO: trends category short blurb.",
	},
	{
		slug: "behind-the-scenes",
		label: "Behind the scenes",
		description: "TODO: behind-the-scenes category short blurb.",
	},
	{
		slug: "locations",
		label: "Locations",
		description: "TODO: locations category short blurb.",
	},
] as const;

// ---------------------------------------------------------------------------
// Authors (will move to `users` Payload collection in Sprint 2)
// ---------------------------------------------------------------------------

const DEFAULT_AUTHOR: PostAuthor = {
	name: "TODO: Owner name",
	role: "Founder & Lead Decorator",
	bio: "TODO: Author bio — short, two-line introduction with experience and signature.",
};

// ---------------------------------------------------------------------------
// 6 launch posts — slugs per docs/07-SEO-STRATEGY.md §7.7 wedding pillar cluster
// ---------------------------------------------------------------------------

const POSTS: ReadonlyArray<BlogPost> = [
	{
		slug: "how-to-plan-a-bengali-wedding-in-6-months",
		title: "How to plan a Bengali wedding in 6 months",
		excerpt:
			"TODO: A practical month-by-month timeline for Bengali weddings — from Aashirbaad to Bou Bhaat — with vendor checkpoints and rehearsal logistics.",
		coverImageUrl: undefined,
		coverImageAlt:
			"TODO: Cover alt — Bengali wedding mandap with marigold and tuberose florals at golden hour.",
		category: "bengali-weddings",
		tags: [
			{ slug: "bengali-wedding", label: "Bengali wedding" },
			{ slug: "planning-timeline", label: "Planning timeline" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-04-12T09:00:00+05:30",
		readTimeMinutes: 9,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"mandap-design-ideas-that-stay-cinematic",
			"floral-choices-for-north-bengal-weddings",
			"indian-wedding-decoration-cost-breakdown-2026",
		],
		locale: "en",
	},
	{
		slug: "mandap-design-ideas-that-stay-cinematic",
		title: "Mandap design ideas that stay cinematic",
		excerpt:
			"TODO: A short visual essay on mandap silhouettes, drape ratios, and lighting cues that read beautifully on camera and in person.",
		coverImageAlt:
			"TODO: Cover alt — sculptural mandap with ivory drape and brass detailing.",
		category: "trends",
		tags: [
			{ slug: "mandap", label: "Mandap" },
			{ slug: "design", label: "Design" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-03-28T09:00:00+05:30",
		readTimeMinutes: 7,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"how-to-plan-a-bengali-wedding-in-6-months",
			"floral-choices-for-north-bengal-weddings",
		],
		locale: "en",
	},
	{
		slug: "best-wedding-venues-in-siliguri-with-photos",
		title: "Best wedding venues in Siliguri (with photos)",
		excerpt:
			"TODO: A curated guide to Siliguri venues by guest count, with notes on logistics, light, and the kind of weddings each one suits.",
		coverImageAlt:
			"TODO: Cover alt — a Siliguri banquet hall styled for a 300-guest reception.",
		category: "locations",
		tags: [
			{ slug: "siliguri", label: "Siliguri" },
			{ slug: "venues", label: "Venues" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-03-14T09:00:00+05:30",
		readTimeMinutes: 11,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"tea-garden-weddings-in-darjeeling-what-to-know",
			"destination-wedding-logistics-from-siliguri",
		],
		locale: "en",
	},
	{
		slug: "tea-garden-weddings-in-darjeeling-what-to-know",
		title: "Tea garden weddings in Darjeeling: what to know",
		excerpt:
			"TODO: Altitude, weather windows, permits, and decor that holds up against the Kanchenjunga backdrop — everything you need before booking a hill venue.",
		coverImageAlt:
			"TODO: Cover alt — an outdoor mandap on a Darjeeling tea estate at first light.",
		category: "locations",
		tags: [
			{ slug: "darjeeling", label: "Darjeeling" },
			{ slug: "destination-wedding", label: "Destination wedding" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-02-26T09:00:00+05:30",
		readTimeMinutes: 8,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"best-wedding-venues-in-siliguri-with-photos",
			"destination-wedding-logistics-from-siliguri",
		],
		locale: "en",
	},
	{
		slug: "indian-wedding-decoration-cost-breakdown-2026",
		title: "Indian wedding decoration cost breakdown 2026",
		excerpt:
			"TODO: How the rupees actually fall — florals, lighting, mandap, drape, manpower — and where adding budget visibly changes the day.",
		coverImageAlt:
			"TODO: Cover alt — table-top decor showing tuberose, candles, and brass-rim cutlery.",
		category: "planning",
		tags: [
			{ slug: "pricing", label: "Pricing" },
			{ slug: "budgeting", label: "Budgeting" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-02-08T09:00:00+05:30",
		readTimeMinutes: 10,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"how-to-plan-a-bengali-wedding-in-6-months",
			"floral-choices-for-north-bengal-weddings",
		],
		locale: "en",
	},
	{
		slug: "floral-choices-for-north-bengal-weddings",
		title: "Floral choices for North Bengal weddings",
		excerpt:
			"TODO: Seasonal flower availability across Siliguri, Bagdogra, and Dooars — and the combinations we keep returning to for the camera.",
		coverImageAlt:
			"TODO: Cover alt — close-up of jasmine, tuberose, and dahlia in a styled vignette.",
		category: "behind-the-scenes",
		tags: [
			{ slug: "florals", label: "Florals" },
			{ slug: "seasonal", label: "Seasonal" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-01-22T09:00:00+05:30",
		readTimeMinutes: 6,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"mandap-design-ideas-that-stay-cinematic",
			"how-to-plan-a-bengali-wedding-in-6-months",
		],
		locale: "en",
	},
	{
		slug: "destination-wedding-logistics-from-siliguri",
		title: "Destination wedding logistics from Siliguri",
		excerpt:
			"TODO: Routing trucks up the hills, lighting backups, vendor billeting — a planner's guide to keeping a destination wedding calm.",
		coverImageAlt:
			"TODO: Cover alt — crew setting up a stage at dusk with the Himalayas behind.",
		category: "behind-the-scenes",
		tags: [
			{ slug: "logistics", label: "Logistics" },
			{ slug: "destination-wedding", label: "Destination wedding" },
		],
		author: DEFAULT_AUTHOR,
		publishedDate: "2026-01-05T09:00:00+05:30",
		readTimeMinutes: 8,
		body: "TODO: MDX body — see content/blog/_outlines.md.",
		relatedPostSlugs: [
			"tea-garden-weddings-in-darjeeling-what-to-know",
			"best-wedding-venues-in-siliguri-with-photos",
		],
		locale: "en",
	},
] as const;

// ---------------------------------------------------------------------------
// Helpers — the public CMS surface
// ---------------------------------------------------------------------------

/** All published posts, newest first. */
export function getAllPosts(): ReadonlyArray<BlogPost> {
	return [...POSTS].sort(
		(a, b) =>
			new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
	);
}

/** One post by slug, or `null` if missing / not published. */
export function getPostBySlug(slug: string): BlogPost | null {
	return POSTS.find((p) => p.slug === slug) ?? null;
}

/** Posts filtered to a single category, newest first. */
export function getPostsByCategory(
	category: PostCategorySlug,
): ReadonlyArray<BlogPost> {
	return getAllPosts().filter((p) => p.category === category);
}

/** Most-recent post, used as the featured card on `/blog`. */
export function getFeaturedPost(): BlogPost | null {
	const [first] = getAllPosts();
	return first ?? null;
}

/**
 * Up to N related posts for a given slug.
 * Prefers explicit `relatedPostSlugs`; falls back to same-category newest.
 */
export function getRelatedPosts(slug: string, limit = 3): ReadonlyArray<BlogPost> {
	const current = getPostBySlug(slug);
	if (!current) return [];

	const explicit = (current.relatedPostSlugs ?? [])
		.map((s) => getPostBySlug(s))
		.filter((p): p is BlogPost => p !== null);

	if (explicit.length >= limit) return explicit.slice(0, limit);

	const sameCategory = getPostsByCategory(current.category).filter(
		(p) => p.slug !== slug && !explicit.find((e) => e.slug === p.slug),
	);

	return [...explicit, ...sameCategory].slice(0, limit);
}

/** Convenience — returns the category descriptor for a slug. */
export function getCategoryBySlug(slug: string): PostCategory | null {
	return POST_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/** All category slugs — used by `generateStaticParams`. */
export function getAllCategorySlugs(): ReadonlyArray<PostCategorySlug> {
	return POST_CATEGORIES.map((c) => c.slug);
}

/** All post slugs — used by `generateStaticParams`. */
export function getAllPostSlugs(): ReadonlyArray<string> {
	return POSTS.map((p) => p.slug);
}

/** Format an ISO date as `DD MMM YYYY` per CLAUDE.md Indian English rule. */
export function formatPostDate(iso: string): string {
	const d = new Date(iso);
	const day = String(d.getUTCDate()).padStart(2, "0");
	const month = d.toLocaleString("en-IN", {
		month: "short",
		timeZone: "Asia/Kolkata",
	});
	const year = d.getUTCFullYear();
	return `${day} ${month} ${year}`;
}
