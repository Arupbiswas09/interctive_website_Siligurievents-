/**
 * Sitemap entry types and builders for Siligurievent.
 *
 * Used by `next-sitemap` (config in repo root) and/or a custom
 * `app/sitemap.ts` route. Generates per-locale URLs with hreflang
 * `xhtml:link rel="alternate"` siblings.
 *
 * Routes covered:
 *   - Static pages
 *   - Services (CMS-driven)
 *   - Locations (CMS-driven)
 *   - Blog posts
 *   - Portfolio projects
 *   - Programmatic location × service grid (`/decorators/[loc]/[svc]`)
 */

import { SITE_URL, type SiteSettingsInput } from "./schemas";
import { type Locale, localeUrl } from "./metadata";

export type ChangeFrequency =
	| "always"
	| "hourly"
	| "daily"
	| "weekly"
	| "monthly"
	| "yearly"
	| "never";

export interface SitemapEntry {
	url: string;
	lastModified?: string | Date;
	changeFrequency?: ChangeFrequency;
	priority?: number;
	alternates?: {
		languages: Record<string, string>;
	};
}

export interface SitemapInputs {
	services: ReadonlyArray<{ slug: string; updatedAt?: string }>;
	locations: ReadonlyArray<{ slug: string; updatedAt?: string }>;
	posts: ReadonlyArray<{ slug: string; updatedAt?: string; publishedAt?: string }>;
	projects: ReadonlyArray<{ slug: string; updatedAt?: string }>;
	/** Hindi available for this path? When false we skip the hi-IN alternate. */
	hindiAvailable?: (path: string) => boolean;
}

const LOCALES: ReadonlyArray<Locale> = ["en", "hi"];

const HREFLANG: Record<Locale, string> = {
	en: "en-IN",
	hi: "hi-IN",
};

function nowIso(): string {
	return new Date().toISOString();
}

/**
 * Static / hardcoded site pages (everything not coming from the CMS).
 * Priorities follow the IA importance order from docs/04-INFORMATION-ARCHITECTURE.md.
 */
export const STATIC_ROUTES: ReadonlyArray<{
	path: string;
	priority: number;
	changeFrequency: ChangeFrequency;
}> = [
	{ path: "/", priority: 1.0, changeFrequency: "weekly" },
	{ path: "/services", priority: 0.9, changeFrequency: "weekly" },
	{ path: "/portfolio", priority: 0.9, changeFrequency: "weekly" },
	{ path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
	{ path: "/blog", priority: 0.8, changeFrequency: "weekly" },
	{ path: "/about", priority: 0.7, changeFrequency: "monthly" },
	{ path: "/contact", priority: 0.9, changeFrequency: "monthly" },
	{ path: "/locations", priority: 0.7, changeFrequency: "monthly" },
	{ path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
	{ path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

/**
 * Service slugs we pre-author location × service combinations for.
 * Mirrors the high-value cohort from docs/04-IA.md §4.2.
 */
export const PROGRAMMATIC_SERVICE_SLUGS = [
	"wedding",
	"bengali-wedding",
	"haldi-gaye-holud",
	"mehendi",
	"sangeet",
	"reception",
	"birthday-party",
	"corporate-events",
	"annaprashan-rice-ceremony",
] as const;

export const PROGRAMMATIC_LOCATION_SLUGS = [
	"siliguri",
	"bagdogra",
	"darjeeling",
	"kalimpong",
	"jalpaiguri",
	"gangtok",
	"dooars",
] as const;

/**
 * Build an alternates.languages map for a given path.
 */
function buildHreflang(path: string, hindiAvailable: boolean): Record<string, string> {
	const out: Record<string, string> = {};
	out[HREFLANG.en] = localeUrl(path, "en");
	if (hindiAvailable) out[HREFLANG.hi] = localeUrl(path, "hi");
	out["x-default"] = localeUrl(path, "en");
	return out;
}

function entry(
	path: string,
	locale: Locale,
	priority: number,
	changeFrequency: ChangeFrequency,
	lastModified: string | undefined,
	hindiAvailable: boolean,
): SitemapEntry {
	return {
		url: localeUrl(path, locale),
		lastModified: lastModified ?? nowIso(),
		changeFrequency,
		priority,
		alternates: { languages: buildHreflang(path, hindiAvailable) },
	};
}

/**
 * Generate the full sitemap entry list. Pass real Payload data in;
 * callers can also feed empty arrays for incremental builds.
 */
export function buildSitemap(inputs: SitemapInputs): SitemapEntry[] {
	const hindiOk = inputs.hindiAvailable ?? (() => true);
	const entries: SitemapEntry[] = [];

	// Static routes — one entry per locale.
	for (const r of STATIC_ROUTES) {
		for (const locale of LOCALES) {
			if (locale === "hi" && !hindiOk(r.path)) continue;
			entries.push(entry(r.path, locale, r.priority, r.changeFrequency, undefined, hindiOk(r.path)));
		}
	}

	// Services.
	for (const s of inputs.services) {
		const path = `/services/${s.slug}`;
		for (const locale of LOCALES) {
			if (locale === "hi" && !hindiOk(path)) continue;
			entries.push(entry(path, locale, 0.9, "monthly", s.updatedAt, hindiOk(path)));
		}
	}

	// Locations.
	for (const l of inputs.locations) {
		const path = `/locations/${l.slug}`;
		for (const locale of LOCALES) {
			if (locale === "hi" && !hindiOk(path)) continue;
			entries.push(entry(path, locale, 0.7, "monthly", l.updatedAt, hindiOk(path)));
		}
	}

	// Blog posts.
	for (const p of inputs.posts) {
		const path = `/blog/${p.slug}`;
		for (const locale of LOCALES) {
			if (locale === "hi" && !hindiOk(path)) continue;
			entries.push(
				entry(path, locale, 0.6, "weekly", p.updatedAt ?? p.publishedAt, hindiOk(path)),
			);
		}
	}

	// Portfolio case studies.
	for (const pr of inputs.projects) {
		const path = `/portfolio/${pr.slug}`;
		for (const locale of LOCALES) {
			if (locale === "hi" && !hindiOk(path)) continue;
			entries.push(entry(path, locale, 0.7, "monthly", pr.updatedAt, hindiOk(path)));
		}
	}

	// Programmatic /decorators/[location]/[service] grid was removed —
	// PROGRAMMATIC_LOCATION_SLUGS / PROGRAMMATIC_SERVICE_SLUGS are kept
	// in this file as data only, in case the matrix is reintroduced
	// later. The /decorators/ routes themselves no longer exist.

	return entries;
}

/**
 * Robots.txt content. Disallows Payload admin + previews; sitemap
 * pointer added at the bottom.
 */
export function buildRobots(): string {
	return [
		"User-agent: *",
		"Allow: /",
		"Disallow: /admin",
		"Disallow: /api/",
		"Disallow: /preview",
		"Disallow: /*?preview=*",
		"",
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		"",
	].join("\n");
}

/**
 * Convert internal SitemapEntry → next-sitemap-compatible plain object.
 */
export function toNextSitemap(e: SitemapEntry) {
	return {
		loc: e.url,
		lastmod:
			e.lastModified instanceof Date ? e.lastModified.toISOString() : e.lastModified,
		changefreq: e.changeFrequency,
		priority: e.priority,
		alternateRefs: e.alternates
			? Object.entries(e.alternates.languages).map(([hreflang, href]) => ({
					href,
					hreflang,
				}))
			: undefined,
	};
}

/** Convenience — surface the per-locale URLs for a single path. */
export function pathToLocaleEntries(
	path: string,
	priority: number,
	changeFrequency: ChangeFrequency,
	hindiAvailable = true,
): SitemapEntry[] {
	return LOCALES.filter((l) => l === "en" || hindiAvailable).map((locale) =>
		entry(path, locale, priority, changeFrequency, undefined, hindiAvailable),
	);
}

/** Unused but exposed for future LocalBusiness sitemap-image enrichment. */
export type SiteSettingsForSitemap = SiteSettingsInput;
