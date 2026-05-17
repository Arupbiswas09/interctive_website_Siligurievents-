/**
 * Keyword universe for Siligurievent (English + Hindi/Devanagari).
 *
 * Sourced from docs/07-SEO-STRATEGY.md §7.3, extended with Devanagari
 * variants for bilingual launch per docs/DECISIONS.md D-003.
 *
 * Use these arrays in:
 *   - metadata `keywords` (sparingly; ≤10 per page)
 *   - blog post seo descriptions
 *   - programmatic /decorators/[loc]/[svc] page H1/H2 templates
 *
 * Strict types make sure new entries can't be misclassified.
 */

export type KeywordTier = "tier1" | "tier2" | "tier3" | "tier4";

export interface Keyword {
	en: string;
	hi?: string; // Devanagari script
	tier: KeywordTier;
	intent: "transactional" | "informational" | "navigational" | "local";
	pageType?: ReadonlyArray<
		"home" | "service" | "location" | "blog" | "pricing" | "portfolio" | "contact" | "programmatic"
	>;
}

// ---------------------------------------------------------------------------
// Tier 1 — core money keywords (home + service)
// ---------------------------------------------------------------------------

export const TIER_1_KEYWORDS: ReadonlyArray<Keyword> = [
	{
		en: "wedding decorator in siliguri",
		hi: "सिलीगुड़ी में शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["home", "service"],
	},
	{
		en: "event decorator in siliguri",
		hi: "सिलीगुड़ी में इवेंट डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["home", "service"],
	},
	{
		en: "bengali wedding decoration siliguri",
		hi: "सिलीगुड़ी में बंगाली शादी की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "haldi decoration siliguri",
		hi: "सिलीगुड़ी में हल्दी की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "mehendi decoration siliguri",
		hi: "सिलीगुड़ी में मेहंदी की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "sangeet decoration siliguri",
		hi: "सिलीगुड़ी में संगीत की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "reception decoration siliguri",
		hi: "सिलीगुड़ी में रिसेप्शन की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "birthday decoration siliguri",
		hi: "सिलीगुड़ी में जन्मदिन की सजावट",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "corporate event decorator siliguri",
		hi: "सिलीगुड़ी में कॉर्पोरेट इवेंट डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service"],
	},
	{
		en: "destination wedding decorator north bengal",
		hi: "उत्तर बंगाल में डेस्टिनेशन वेडिंग डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["service", "location"],
	},
	{
		en: "wedding decorator in bagdogra",
		hi: "बागडोगरा में शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["location", "programmatic"],
	},
	{
		en: "wedding decorator in darjeeling",
		hi: "दार्जिलिंग में शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		pageType: ["location", "programmatic"],
	},
];

// ---------------------------------------------------------------------------
// Tier 2 — informational (blog)
// ---------------------------------------------------------------------------

export const TIER_2_KEYWORDS: ReadonlyArray<Keyword> = [
	{
		en: "bengali wedding rituals checklist",
		hi: "बंगाली शादी की रस्में चेकलिस्ट",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "how to plan a haldi ceremony",
		hi: "हल्दी समारोह की योजना कैसे बनाएं",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "wedding decoration cost in north bengal",
		hi: "उत्तर बंगाल में शादी की सजावट का खर्च",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog", "pricing"],
	},
	{
		en: "best wedding venues in siliguri",
		hi: "सिलीगुड़ी के सबसे अच्छे शादी के वेन्यू",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "best destination wedding locations in north bengal",
		hi: "उत्तर बंगाल में सबसे अच्छे डेस्टिनेशन वेडिंग स्थान",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "tea garden wedding north bengal",
		hi: "उत्तर बंगाल में चाय बागान की शादी",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "darjeeling wedding photography venues",
		hi: "दार्जिलिंग में शादी की फोटोग्राफी के स्थान",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "annaprashan decoration ideas",
		hi: "अन्नप्राशन सजावट के विचार",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog", "service"],
	},
	{
		en: "griha pravesh decoration",
		hi: "गृह प्रवेश की सजावट",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog", "service"],
	},
	{
		en: "durga puja pandal decoration siliguri",
		hi: "सिलीगुड़ी में दुर्गा पूजा पंडाल की सजावट",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog", "service"],
	},
	{
		en: "mandap design ideas",
		hi: "मंडप डिज़ाइन के विचार",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "indian wedding flower decoration ideas",
		hi: "इंडियन शादी फूल सजावट के विचार",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "engagement ceremony decoration ideas",
		hi: "सगाई समारोह की सजावट के विचार",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "naamkaran decoration ideas",
		hi: "नामकरण सजावट के विचार",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog"],
	},
	{
		en: "godh bharai decoration",
		hi: "गोद भराई सजावट",
		tier: "tier2",
		intent: "informational",
		pageType: ["blog", "service"],
	},
];

// ---------------------------------------------------------------------------
// Tier 3 — long-tail / programmatic
// ---------------------------------------------------------------------------

export const PROGRAMMATIC_LOCATIONS = [
	"siliguri",
	"bagdogra",
	"kalimpong",
	"jalpaiguri",
	"gangtok",
	"darjeeling",
	"dooars",
] as const;

export const PROGRAMMATIC_LOCATIONS_HINDI: Record<
	(typeof PROGRAMMATIC_LOCATIONS)[number],
	string
> = {
	siliguri: "सिलीगुड़ी",
	bagdogra: "बागडोगरा",
	kalimpong: "कलिम्पोंग",
	jalpaiguri: "जलपाईगुड़ी",
	gangtok: "गंगटोक",
	darjeeling: "दार्जिलिंग",
	dooars: "डुआर्स",
};

export const PROGRAMMATIC_SERVICES = [
	"wedding",
	"bengali-wedding",
	"haldi",
	"mehendi",
	"sangeet",
	"reception",
	"birthday-party",
	"corporate-events",
	"annaprashan",
] as const;

export const PROGRAMMATIC_SERVICES_HINDI: Record<
	(typeof PROGRAMMATIC_SERVICES)[number],
	string
> = {
	wedding: "शादी",
	"bengali-wedding": "बंगाली शादी",
	haldi: "हल्दी",
	mehendi: "मेहंदी",
	sangeet: "संगीत",
	reception: "रिसेप्शन",
	"birthday-party": "जन्मदिन पार्टी",
	"corporate-events": "कॉर्पोरेट इवेंट",
	annaprashan: "अन्नप्राशन",
};

/**
 * Expand the programmatic grid into Keyword entries on demand.
 * 7 locations × 9 services = 63 base keywords (both languages).
 */
export function expandProgrammaticKeywords(): Keyword[] {
	const out: Keyword[] = [];
	for (const loc of PROGRAMMATIC_LOCATIONS) {
		for (const svc of PROGRAMMATIC_SERVICES) {
			out.push({
				en: `${svc.replace("-", " ")} decorator in ${loc}`,
				hi: `${PROGRAMMATIC_LOCATIONS_HINDI[loc]} में ${PROGRAMMATIC_SERVICES_HINDI[svc]} डेकोरेटर`,
				tier: "tier3",
				intent: "local",
				pageType: ["programmatic"],
			});
		}
	}
	return out;
}

export const TIER_3_KEYWORDS: ReadonlyArray<Keyword> = expandProgrammaticKeywords();

// ---------------------------------------------------------------------------
// Tier 4 — branded
// ---------------------------------------------------------------------------

export const TIER_4_KEYWORDS: ReadonlyArray<Keyword> = [
	{
		en: "siligurievent",
		hi: "सिलीगुरीइवेंट",
		tier: "tier4",
		intent: "navigational",
		pageType: ["home"],
	},
	{
		en: "siligurievent decorator",
		hi: "सिलीगुरीइवेंट डेकोरेटर",
		tier: "tier4",
		intent: "navigational",
		pageType: ["home"],
	},
	{
		en: "siligurievent reviews",
		hi: "सिलीगुरीइवेंट समीक्षा",
		tier: "tier4",
		intent: "navigational",
		pageType: ["home", "about"] as never,
	},
	{
		en: "siliguri events",
		hi: "सिलीगुड़ी इवेंट्स",
		tier: "tier4",
		intent: "navigational",
		pageType: ["home"],
	},
];

// ---------------------------------------------------------------------------
// Aggregate / utility exports
// ---------------------------------------------------------------------------

export const ALL_KEYWORDS: ReadonlyArray<Keyword> = [
	...TIER_1_KEYWORDS,
	...TIER_2_KEYWORDS,
	...TIER_3_KEYWORDS,
	...TIER_4_KEYWORDS,
];

export function keywordsForPage(
	pageType: NonNullable<Keyword["pageType"]>[number],
): Keyword[] {
	return ALL_KEYWORDS.filter((k) => k.pageType?.includes(pageType));
}

export function keywordsByTier(tier: KeywordTier): Keyword[] {
	return ALL_KEYWORDS.filter((k) => k.tier === tier);
}

/** Return just the English strings for a Page — handy for metadata `keywords`. */
export function englishKeywordsFor(
	pageType: NonNullable<Keyword["pageType"]>[number],
	limit = 8,
): string[] {
	return keywordsForPage(pageType)
		.slice(0, limit)
		.map((k) => k.en);
}

/** Devanagari counterparts for a page (filtered to those that have `hi`). */
export function hindiKeywordsFor(
	pageType: NonNullable<Keyword["pageType"]>[number],
	limit = 8,
): string[] {
	return keywordsForPage(pageType)
		.filter((k): k is Keyword & { hi: string } => typeof k.hi === "string")
		.slice(0, limit)
		.map((k) => k.hi);
}
