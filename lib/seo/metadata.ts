/**
 * Centralised Next.js Metadata builder.
 *
 * Every route in app/ should compose its `generateMetadata` from
 * `buildPageMetadata` so titles, descriptions, canonicals, OG tags,
 * Twitter cards, robots and hreflang stay consistent.
 *
 * Locales (per docs/DECISIONS.md D-003): en-IN, hi-IN. Root `/` redirects
 * to the active locale via next-intl middleware.
 */

import type { Metadata } from "next";
import { DEFAULT_LOCALE, SITE_URL, SUPPORTED_LOCALES } from "./schemas";

export type Locale = "en" | "hi";
export type OgType =
	| "website"
	| "article"
	| "profile"
	| "book"
	| "video.other";

export interface BuildPageMetadataArgs {
	/** Page title — the wrapper appends the brand if `appendBrand` is true. */
	title: string;
	/** Meta description — ≤155 chars for SERP rendering. */
	description: string;
	/**
	 * Path WITHOUT locale prefix. e.g. `/services/wedding`. Pass `/` for home.
	 * The builder synthesises locale-prefixed canonical + alternates.
	 */
	path: string;
	/** Current locale; affects canonical, OG locale, and language tags. */
	locale: Locale;
	/** Optional override OG image; defaults to `/api/og?path=...`. */
	image?: string;
	/** Default 'website'. Use 'article' for blog posts. */
	ogType?: OgType;
	/** Set true to emit `noindex, nofollow`. */
	noIndex?: boolean;
	/** Append " | Siligurievent" suffix. Defaults to true. */
	appendBrand?: boolean;
	/** Pre-resolved alternates if caller wants to override the helper. */
	alternates?: Metadata["alternates"];
	/** Optional OG site name override. */
	siteName?: string;
	/** Optional Twitter handle (with @). */
	twitterHandle?: string;
	/** Published / modified timestamps for articles. */
	publishedTime?: string;
	modifiedTime?: string;
	/** Author display name for articles. */
	authorName?: string;
	/** Free-form keyword list (avoid stuffing; ~6–10 max). */
	keywords?: ReadonlyArray<string>;
}

const LOCALE_TO_OG: Record<Locale, string> = {
	en: "en_IN",
	hi: "hi_IN",
};

const LOCALE_TO_HREFLANG: Record<Locale, string> = {
	en: "en-IN",
	hi: "hi-IN",
};

function normalisePath(path: string): string {
	if (!path) return "/";
	if (path === "/") return "/";
	return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Compose a locale-prefixed absolute URL.
 *   localeUrl('/services/wedding', 'en') => https://siligurievent.com/en/services/wedding
 *   localeUrl('/', 'hi')                 => https://siligurievent.com/hi
 */
export function localeUrl(path: string, locale: Locale): string {
	const p = normalisePath(path);
	if (p === "/") return `${SITE_URL}/${locale}`;
	return `${SITE_URL}/${locale}${p}`;
}

/**
 * Produces `alternates.languages` for every supported locale.
 * Adds the SEO-recommended `x-default` mapping to English.
 */
export function buildAlternates(
	path: string,
	locales: ReadonlyArray<Locale> = ["en", "hi"],
): NonNullable<Metadata["alternates"]>["languages"] {
	const languages: Record<string, string> = {};
	for (const l of locales) {
		languages[LOCALE_TO_HREFLANG[l]] = localeUrl(path, l);
	}
	languages["x-default"] = localeUrl(path, "en");
	return languages;
}

export function buildPageMetadata(args: BuildPageMetadataArgs): Metadata {
	const {
		title,
		description,
		path,
		locale,
		image,
		ogType = "website",
		noIndex = false,
		appendBrand = true,
		siteName = "Siligurievent",
		twitterHandle = "@siligurievent",
		publishedTime,
		modifiedTime,
		authorName,
		keywords,
	} = args;

	const fullTitle = appendBrand && !title.includes("Siligurievent")
		? `${title} | Siligurievent`
		: title;

	const canonical = localeUrl(path, locale);
	const alternatesLanguages = args.alternates?.languages
		? args.alternates.languages
		: buildAlternates(path);

	// Default OG image route — `/api/og` handles type-aware templates.
	const normalisedPath = normalisePath(path);
	const ogImageUrl =
		image ?? `${SITE_URL}/api/og?path=${encodeURIComponent(normalisedPath)}&locale=${locale}`;

	return {
		metadataBase: new URL(SITE_URL),
		title: fullTitle,
		description,
		keywords: keywords ? [...keywords] : undefined,
		applicationName: siteName,
		authors: authorName ? [{ name: authorName }] : undefined,
		alternates: {
			canonical,
			languages: alternatesLanguages,
		},
		openGraph: {
			type: ogType,
			url: canonical,
			siteName,
			title: fullTitle,
			description,
			locale: LOCALE_TO_OG[locale],
			alternateLocale: SUPPORTED_LOCALES.filter(
				(l) => l !== LOCALE_TO_HREFLANG[locale],
			).map((l) => l.replace("-", "_")),
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			...(ogType === "article" && {
				publishedTime,
				modifiedTime,
				authors: authorName ? [authorName] : undefined,
			}),
		},
		twitter: {
			card: "summary_large_image",
			site: twitterHandle,
			creator: twitterHandle,
			title: fullTitle,
			description,
			images: [ogImageUrl],
		},
		robots: noIndex
			? {
					index: false,
					follow: false,
					nocache: true,
				}
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-image-preview": "large",
						"max-snippet": -1,
						"max-video-preview": -1,
					},
				},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		other: {
			"og:locale:alternate": SUPPORTED_LOCALES.filter(
				(l) => l !== LOCALE_TO_HREFLANG[locale],
			).join(","),
		},
	};
}

/**
 * Shorthand for noindex utility pages (admin previews, 404, drafts).
 */
export function buildNoIndexMetadata(title: string, locale: Locale = "en"): Metadata {
	return buildPageMetadata({
		title,
		description: "",
		path: "/",
		locale,
		noIndex: true,
		appendBrand: false,
	});
}

export { SITE_URL, DEFAULT_LOCALE, SUPPORTED_LOCALES };
