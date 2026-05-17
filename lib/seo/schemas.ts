/**
 * Schema.org JSON-LD builders for Siligurievent.
 *
 * All builders return strongly-typed schema-dts objects that can be safely
 * serialised to JSON and injected into the document head via `jsonLdScript`.
 *
 * Pricing rule (per docs/DECISIONS.md D-002):
 *   - We expose hybrid price BANDS only (₹, ₹₹, ₹₹₹) via `priceRange`.
 *   - We never emit `price` numbers in public schema.
 *   - Currency stays "INR".
 *
 * Brand: Siligurievent. Domain: https://siligurievent.com.
 */

import type {
	BlogPosting,
	BreadcrumbList,
	CreativeWork,
	FAQPage,
	ImageGallery,
	ListItem,
	LocalBusiness,
	Offer,
	OfferCatalog,
	Organization,
	Person,
	Place,
	PostalAddress,
	Service,
	Thing,
	WithContext,
} from "schema-dts";
import { createElement, type ReactElement } from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SITE_URL = "https://siligurievent.com" as const;
export const BRAND_NAME = "Siligurievent" as const;
export const BRAND_LEGAL_NAME = "Siligurievent" as const;
export const DEFAULT_LOCALE = "en-IN" as const;
export const SUPPORTED_LOCALES = ["en-IN", "hi-IN"] as const;
export const CURRENCY = "INR" as const;

export type PriceBand = "₹" | "₹₹" | "₹₹₹";

// ---------------------------------------------------------------------------
// Input types — kept loose so they map cleanly to Payload documents.
// ---------------------------------------------------------------------------

export interface SiteSettingsInput {
	businessName?: string;
	tagline?: string;
	phone?: string;
	whatsappNumber?: string;
	email?: string;
	addressLine1?: string;
	addressLine2?: string;
	city?: string;
	state?: string;
	pincode?: string;
	country?: string;
	founderName?: string;
	foundedYear?: number;
	logoUrl?: string;
	defaultOgImageUrl?: string;
	openingHours?: ReadonlyArray<{
		day: string;
		open: string;
		close: string;
		closed?: boolean;
	}>;
	social?: {
		instagram?: string;
		youtube?: string;
		pinterest?: string;
		facebook?: string;
		googleBusiness?: string;
	};
	geo?: { lat: number; lng: number };
}

export interface ServiceInput {
	name: string;
	slug: string;
	tagline?: string;
	description?: string;
	priceBand?: PriceBand;
	coverImageUrl?: string;
	galleryImageUrls?: ReadonlyArray<string>;
	areaServed?: ReadonlyArray<string>;
}

export interface LocationInput {
	name: string;
	slug: string;
	region?: string;
	country?: string;
	latitude?: number;
	longitude?: number;
	heroImageUrl?: string;
}

export interface BreadcrumbItem {
	name: string;
	path: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface BlogPostInput {
	title: string;
	slug: string;
	excerpt: string;
	coverImageUrl?: string;
	publishedDate: string;
	updatedDate?: string;
	category?: string;
	tags?: ReadonlyArray<string>;
	readTimeMinutes?: number;
}

export interface PackageInput {
	name: string;
	slug?: string;
	description?: string;
	priceBand: PriceBand;
	priceNote?: string;
	includes?: ReadonlyArray<string>;
	serviceSlug?: string;
}

export interface ProjectInput {
	title: string;
	slug: string;
	brief?: string;
	ceremonyName?: string;
	locationName?: string;
	date?: string;
	coverImageUrl?: string;
	galleryImageUrls?: ReadonlyArray<string>;
	credits?: ReadonlyArray<{ role: string; name: string }>;
}

export interface PersonInput {
	name: string;
	role?: string;
	bio?: string;
	imageUrl?: string;
	sameAs?: ReadonlyArray<string>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function absoluteUrl(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	const slash = path.startsWith("/") ? "" : "/";
	return `${SITE_URL}${slash}${path}`;
}

function buildPostalAddress(s: SiteSettingsInput): PostalAddress {
	return {
		"@type": "PostalAddress",
		streetAddress: [s.addressLine1, s.addressLine2].filter(Boolean).join(", ") || undefined,
		addressLocality: s.city ?? "Siliguri",
		addressRegion: s.state ?? "WB",
		postalCode: s.pincode,
		addressCountry: s.country ?? "IN",
	};
}

function buildSameAs(s: SiteSettingsInput): string[] | undefined {
	if (!s.social) return undefined;
	const urls = [
		s.social.instagram,
		s.social.youtube,
		s.social.pinterest,
		s.social.facebook,
		s.social.googleBusiness,
	].filter((u): u is string => typeof u === "string" && u.length > 0);
	return urls.length > 0 ? urls : undefined;
}

function buildOpeningHoursSpec(s: SiteSettingsInput) {
	if (!s.openingHours || s.openingHours.length === 0) return undefined;
	return s.openingHours
		.filter((h) => !h.closed)
		.map((h) => ({
			"@type": "OpeningHoursSpecification" as const,
			dayOfWeek: h.day,
			opens: h.open,
			closes: h.close,
		})) as never;
}

// Default area-served list for Siliguri-based business.
const DEFAULT_AREA_SERVED = [
	"Siliguri",
	"Bagdogra",
	"Darjeeling",
	"Kalimpong",
	"Jalpaiguri",
	"Gangtok",
	"Dooars",
] as const;

// ---------------------------------------------------------------------------
// Schema builders
// ---------------------------------------------------------------------------

export function buildOrganization(
	settings: SiteSettingsInput,
): WithContext<Organization> {
	const sameAs = buildSameAs(settings);
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${SITE_URL}#organization`,
		name: settings.businessName ?? BRAND_NAME,
		legalName: BRAND_LEGAL_NAME,
		url: SITE_URL,
		logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : `${SITE_URL}/logo.png`,
		image: settings.defaultOgImageUrl
			? absoluteUrl(settings.defaultOgImageUrl)
			: `${SITE_URL}/og-default.jpg`,
		description:
			settings.tagline ??
			"Wedding and event decorators in Siliguri, North Bengal — cinematic decor for weddings, haldi, sangeet, reception and family rituals.",
		foundingDate: settings.foundedYear ? String(settings.foundedYear) : undefined,
		founder: settings.founderName
			? { "@type": "Person", name: settings.founderName }
			: undefined,
		address: buildPostalAddress(settings),
		contactPoint: settings.phone
			? [
					{
						"@type": "ContactPoint",
						telephone: settings.phone,
						contactType: "customer service",
						areaServed: "IN",
						availableLanguage: ["en", "hi"],
					},
				]
			: undefined,
		sameAs,
	};
}

export function buildLocalBusiness(
	settings: SiteSettingsInput,
	location?: LocationInput,
): WithContext<LocalBusiness> {
	const name = location
		? `${settings.businessName ?? BRAND_NAME} — ${location.name}`
		: (settings.businessName ?? BRAND_NAME);

	const id = location
		? `${SITE_URL}/locations/${location.slug}#localbusiness`
		: `${SITE_URL}#localbusiness`;

	return {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"@id": id,
		name,
		url: location ? absoluteUrl(`/locations/${location.slug}`) : SITE_URL,
		image: settings.defaultOgImageUrl
			? absoluteUrl(settings.defaultOgImageUrl)
			: `${SITE_URL}/og-default.jpg`,
		logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : `${SITE_URL}/logo.png`,
		telephone: settings.phone,
		email: settings.email,
		address: buildPostalAddress(settings),
		geo:
			settings.geo || (location?.latitude && location?.longitude)
				? {
						"@type": "GeoCoordinates",
						latitude: location?.latitude ?? settings.geo?.lat,
						longitude: location?.longitude ?? settings.geo?.lng,
					}
				: undefined,
		areaServed: (location ? [location.name] : DEFAULT_AREA_SERVED).map((a) => ({
			"@type": "City" as const,
			name: a,
		})),
		// Price BAND only — never numeric (per DECISIONS.md D-002).
		priceRange: "₹₹",
		openingHoursSpecification: buildOpeningHoursSpec(settings),
		sameAs: buildSameAs(settings),
	};
}

export function buildService(
	service: ServiceInput,
	settings: SiteSettingsInput,
): WithContext<Service> {
	const provider = buildLocalBusiness(settings);

	const images = [
		service.coverImageUrl ? absoluteUrl(service.coverImageUrl) : undefined,
		...(service.galleryImageUrls ?? []).map((u) => absoluteUrl(u)),
	].filter((u): u is string => typeof u === "string");

	const offers: Offer = {
		"@type": "Offer",
		priceCurrency: CURRENCY,
		// Band-only — explicit per DECISIONS.md D-002. No numeric `price`.
		priceSpecification: {
			"@type": "PriceSpecification",
			priceCurrency: CURRENCY,
			price: service.priceBand ?? "₹₹",
		},
		availability: "https://schema.org/InStock",
		url: absoluteUrl(`/services/${service.slug}`),
	};

	const areaServed = (service.areaServed ?? DEFAULT_AREA_SERVED).map((a) => ({
		"@type": "City" as const,
		name: a,
	}));

	return {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${SITE_URL}/services/${service.slug}#service`,
		serviceType: service.name,
		name: `${service.name} in Siliguri`,
		description: service.description ?? service.tagline,
		provider,
		areaServed,
		offers,
		image: images.length > 0 ? images : undefined,
		url: absoluteUrl(`/services/${service.slug}`),
	};
}

export function buildBreadcrumb(
	items: ReadonlyArray<BreadcrumbItem>,
): WithContext<BreadcrumbList> {
	const itemListElement: ListItem[] = items.map((item, idx) => ({
		"@type": "ListItem",
		position: idx + 1,
		name: item.name,
		item: absoluteUrl(item.path),
	}));

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement,
	};
}

export function buildFAQ(faqs: ReadonlyArray<FaqItem>): WithContext<FAQPage> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.answer,
			},
		})),
	};
}

export function buildBlogPosting(
	post: BlogPostInput,
	author: PersonInput,
	settings: SiteSettingsInput,
): WithContext<BlogPosting> {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"@id": `${SITE_URL}/blog/${post.slug}#blogposting`,
		headline: post.title,
		description: post.excerpt,
		image: post.coverImageUrl ? [absoluteUrl(post.coverImageUrl)] : undefined,
		datePublished: post.publishedDate,
		dateModified: post.updatedDate ?? post.publishedDate,
		author: {
			"@type": "Person",
			name: author.name,
			jobTitle: author.role,
			image: author.imageUrl ? absoluteUrl(author.imageUrl) : undefined,
			sameAs: author.sameAs ? [...author.sameAs] : undefined,
		},
		publisher: {
			"@type": "Organization",
			name: settings.businessName ?? BRAND_NAME,
			logo: {
				"@type": "ImageObject",
				url: settings.logoUrl ? absoluteUrl(settings.logoUrl) : `${SITE_URL}/logo.png`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": absoluteUrl(`/blog/${post.slug}`),
		},
		articleSection: post.category,
		keywords: post.tags ? post.tags.join(", ") : undefined,
		inLanguage: DEFAULT_LOCALE,
	};
}

export function buildOfferCatalog(
	packages: ReadonlyArray<PackageInput>,
): WithContext<OfferCatalog> {
	return {
		"@context": "https://schema.org",
		"@type": "OfferCatalog",
		name: "Event Decoration Packages — Siligurievent",
		itemListElement: packages.map((pkg) => ({
			"@type": "Offer",
			name: pkg.name,
			description: pkg.description,
			priceCurrency: CURRENCY,
			priceSpecification: {
				"@type": "PriceSpecification",
				priceCurrency: CURRENCY,
				// Hybrid band string — never a numeric figure.
				price: pkg.priceBand,
			},
			itemOffered: pkg.serviceSlug
				? {
						"@type": "Service",
						name: pkg.name,
						url: absoluteUrl(`/services/${pkg.serviceSlug}`),
					}
				: undefined,
		})),
	};
}

export function buildCreativeWork(project: ProjectInput): WithContext<CreativeWork> {
	const images = [
		project.coverImageUrl ? absoluteUrl(project.coverImageUrl) : undefined,
		...(project.galleryImageUrls ?? []).map((u) => absoluteUrl(u)),
	].filter((u): u is string => typeof u === "string");

	return {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		"@id": `${SITE_URL}/portfolio/${project.slug}#creativework`,
		name: project.title,
		description: project.brief,
		image: images.length > 0 ? images : undefined,
		dateCreated: project.date,
		about: project.ceremonyName,
		contentLocation: project.locationName
			? { "@type": "Place", name: project.locationName }
			: undefined,
		creator: project.credits
			? project.credits.map((c) => ({
					"@type": "Person" as const,
					name: c.name,
					jobTitle: c.role,
				}))
			: undefined,
		url: absoluteUrl(`/portfolio/${project.slug}`),
	};
}

export function buildPlace(location: LocationInput): WithContext<Place> {
	return {
		"@context": "https://schema.org",
		"@type": "Place",
		"@id": `${SITE_URL}/locations/${location.slug}#place`,
		name: location.name,
		address: {
			"@type": "PostalAddress",
			addressLocality: location.name,
			addressRegion: location.region ?? "WB",
			addressCountry: location.country ?? "IN",
		},
		geo:
			location.latitude && location.longitude
				? {
						"@type": "GeoCoordinates",
						latitude: location.latitude,
						longitude: location.longitude,
					}
				: undefined,
		image: location.heroImageUrl ? absoluteUrl(location.heroImageUrl) : undefined,
	};
}

export function buildPerson(person: PersonInput): WithContext<Person> {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: person.name,
		jobTitle: person.role,
		description: person.bio,
		image: person.imageUrl ? absoluteUrl(person.imageUrl) : undefined,
		sameAs: person.sameAs ? [...person.sameAs] : undefined,
		worksFor: {
			"@type": "Organization",
			name: BRAND_NAME,
			url: SITE_URL,
		},
	};
}

/**
 * Placeholder builder — only emit AggregateRating once we have ≥5 real
 * reviews verifiable on Google Business Profile. Per docs/07-SEO-STRATEGY.md
 * §7.14 we never fake reviews. Kept as a typed factory so the integration
 * point exists in one place.
 */
export function buildAggregateRatingPlaceholder(args: {
	ratingValue: number;
	reviewCount: number;
	itemReviewedName: string;
	itemReviewedUrl: string;
}): WithContext<Thing> {
	return {
		"@context": "https://schema.org",
		"@type": "Thing",
		name: args.itemReviewedName,
		url: args.itemReviewedUrl,
		// schema-dts doesn't allow `aggregateRating` on Thing directly; this
		// helper is intentionally a placeholder. Use it via the actual entity
		// builders (Service, LocalBusiness, etc.) once reviews are live.
	};
}

export function buildImageGallery(args: {
	name: string;
	description?: string;
	url: string;
	imageUrls: ReadonlyArray<string>;
}): WithContext<ImageGallery> {
	return {
		"@context": "https://schema.org",
		"@type": "ImageGallery",
		name: args.name,
		description: args.description,
		url: absoluteUrl(args.url),
		image: args.imageUrls.map((u) => absoluteUrl(u)),
	};
}

// ---------------------------------------------------------------------------
// JSON-LD <script> helper (server-safe; no client hooks).
// ---------------------------------------------------------------------------

/**
 * Wrap a schema object in a `<script type="application/ld+json">` element.
 * Safe to render from a Server Component. Uses `dangerouslySetInnerHTML`
 * with the JSON.stringify-d payload — no user input is interpolated.
 */
export function jsonLdScript(schema: object): ReactElement {
	const json = JSON.stringify(schema).replace(/</g, "\\u003c");
	return createElement("script", {
		type: "application/ld+json",
		// biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD injection
		dangerouslySetInnerHTML: { __html: json },
	});
}
