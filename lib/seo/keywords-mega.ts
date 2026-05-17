/**
 * Mega keyword universe for Siligurievent — runtime-typed expansion of
 * `lib/seo/keywords.ts`.
 *
 * Strategy doc: `docs/KEYWORD-RESEARCH-3000.md`
 *
 * This module is the SUBSET of the ~3,000-keyword research document that
 * drives runtime metadata generation. It is typed so that:
 *   - every entry's `targetPath` is a real route pattern;
 *   - every entry's `programmatic: true` corresponds to a `/decorators/[loc]/[svc]`
 *     route whose `(loc, svc)` pair appears in the `PROGRAMMATIC_LOCATIONS` ×
 *     `PROGRAMMATIC_SERVICES` grid;
 *   - the priority subset (500+ entries) materialises deterministically on
 *     build for `generateMetadata` consumption.
 *
 * Use these helpers in page-level `generateMetadata`:
 *   - `getKeywordsByPage('/services/wedding')`
 *   - `getKeywordsByLocation('siliguri')`
 *   - `getKeywordsByService('haldi-gaye-holud')`
 *   - `getQuestionKeywords()`
 *
 * No `any`. No runtime dependency on user input. Server-safe.
 *
 * --------------------------------------------------------------------------
 * White-hat guardrail
 * --------------------------------------------------------------------------
 * Every keyword in this file is a real query a buyer might type. If you find
 * yourself adding a term you wouldn't be comfortable defending to a Google
 * search-quality rater, delete it — see §I of the strategy doc for the
 * exhaustive list of tactics we never use.
 */

import type { Keyword } from "./keywords";
import {
	PROGRAMMATIC_LOCATIONS,
	PROGRAMMATIC_LOCATIONS_HINDI,
	PROGRAMMATIC_SERVICES,
	PROGRAMMATIC_SERVICES_HINDI,
} from "./keywords";

// ---------------------------------------------------------------------------
// Extended keyword type — mega version. The base `Keyword` interface in
// `./keywords.ts` is intentionally minimal. We layer additional fields here
// without mutating the base shape so existing call-sites stay stable.
// ---------------------------------------------------------------------------

export type KeywordScript = "latin" | "devanagari" | "bengali";

export type KeywordIntent =
	| "informational"
	| "commercial"
	| "transactional"
	| "navigational";

export type KeywordPriority = 1 | 2 | 3 | 4;

/**
 * Mega keyword shape — re-derived from the base `Keyword` interface with a
 * widened `intent` union (we add "commercial" alongside the base set). We
 * `Omit` the base `intent` and `pageType` since the mega set replaces them
 * with `targetPath` + `targetPage` for explicit page mapping.
 */
export interface MegaKeyword extends Omit<Keyword, "intent" | "pageType"> {
	/** Writing system. Helps decide which `<head>` hreflang map to emit. */
	script: KeywordScript;
	/** Widened intent — adds "commercial" to the base Keyword union. */
	intent: KeywordIntent;
	/** 1 (defend at all cost) — 4 (branded auto-rank). */
	priority: KeywordPriority;
	/** URL path that should rank for this query. No locale prefix. */
	targetPath: string;
	/** Friendly page label for SEO reporting. */
	targetPage: string;
	/** True if served by a `/decorators/[loc]/[svc]` route. */
	programmatic: boolean;
	/** Optional location anchor — must be one of `PROGRAMMATIC_LOCATIONS`. */
	location?: (typeof PROGRAMMATIC_LOCATIONS)[number];
	/** Optional service anchor — must be one of `PROGRAMMATIC_SERVICES`. */
	service?: (typeof PROGRAMMATIC_SERVICES)[number];
}

type LocationSlug = (typeof PROGRAMMATIC_LOCATIONS)[number];
type ServiceSlug = (typeof PROGRAMMATIC_SERVICES)[number];

// ---------------------------------------------------------------------------
// Service display names — used for natural-language query rendering.
// ---------------------------------------------------------------------------

const SERVICE_NOUN: Record<ServiceSlug, string> = {
	wedding: "wedding",
	"bengali-wedding": "bengali wedding",
	haldi: "haldi",
	mehendi: "mehendi",
	sangeet: "sangeet",
	reception: "reception",
	"birthday-party": "birthday party",
	"corporate-events": "corporate event",
	annaprashan: "annaprashan",
};

const LOCATION_NOUN: Record<LocationSlug, string> = {
	siliguri: "Siliguri",
	bagdogra: "Bagdogra",
	darjeeling: "Darjeeling",
	kalimpong: "Kalimpong",
	jalpaiguri: "Jalpaiguri",
	gangtok: "Gangtok",
	dooars: "the Dooars",
};

// ---------------------------------------------------------------------------
// Hand-curated priority money keywords (P1).
// These map to `/`, `/services/[slug]`, `/pricing` — the high-intent pages.
// ---------------------------------------------------------------------------

const TIER_PRIORITY_1: ReadonlyArray<MegaKeyword> = [
	{
		en: "wedding decorator in siliguri",
		hi: "सिलीगुड़ी में शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "wedding decorators in siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "best wedding decorator in siliguri",
		tier: "tier1",
		intent: "commercial",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "wedding decoration in siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "wedding decoration services in siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "event decorator in siliguri",
		hi: "सिलीगुड़ी में इवेंट डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "event decoration company siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "event management company siliguri",
		tier: "tier1",
		intent: "commercial",
		script: "latin",
		priority: 1,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "bengali wedding decorator siliguri",
		hi: "सिलीगुड़ी में बंगाली शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
		location: "siliguri",
	},
	{
		en: "bengali wedding decoration siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
		location: "siliguri",
	},
	{
		en: "haldi decoration in siliguri",
		hi: "सिलीगुड़ी में हल्दी डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
		location: "siliguri",
	},
	{
		en: "gaye holud decoration siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
		location: "siliguri",
	},
	{
		en: "mehendi decoration in siliguri",
		hi: "सिलीगुड़ी में मेहंदी डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
		location: "siliguri",
	},
	{
		en: "sangeet decoration in siliguri",
		hi: "सिलीगुड़ी में संगीत डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
		location: "siliguri",
	},
	{
		en: "reception decoration in siliguri",
		hi: "सिलीगुड़ी में रिसेप्शन डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
		location: "siliguri",
	},
	{
		en: "birthday decoration in siliguri",
		hi: "सिलीगुड़ी में जन्मदिन की सजावट",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/birthday-party",
		targetPage: "Birthday party",
		programmatic: false,
		service: "birthday-party",
		location: "siliguri",
	},
	{
		en: "first birthday decoration siliguri",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/birthday-party",
		targetPage: "Birthday party",
		programmatic: false,
		service: "birthday-party",
		location: "siliguri",
	},
	{
		en: "corporate event decorator siliguri",
		hi: "सिलीगुड़ी में कॉर्पोरेट इवेंट डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/corporate-events",
		targetPage: "Corporate events",
		programmatic: false,
		service: "corporate-events",
		location: "siliguri",
	},
	{
		en: "durga puja pandal decoration siliguri",
		hi: "सिलीगुड़ी में दुर्गा पूजा पंडाल डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "destination wedding decorator north bengal",
		hi: "उत्तर बंगाल में डेस्टिनेशन वेडिंग डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "latin",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
	},
];

// ---------------------------------------------------------------------------
// Devanagari priority money keywords (P1, hi script).
// Hindi-speaking buyers also use these — separate entries so reporting can
// distinguish per-script performance.
// ---------------------------------------------------------------------------

const TIER_PRIORITY_1_DEVANAGARI: ReadonlyArray<MegaKeyword> = [
	{
		en: "siliguri me shadi decorator",
		hi: "सिलीगुड़ी में शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "siliguri me best shadi decorator",
		hi: "सिलीगुड़ी में बेस्ट शादी डेकोरेटर",
		tier: "tier1",
		intent: "commercial",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "siliguri me bengali shadi decorator",
		hi: "सिलीगुड़ी में बंगाली शादी डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
		location: "siliguri",
	},
	{
		en: "siliguri me haldi decoration",
		hi: "सिलीगुड़ी में हल्दी डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
		location: "siliguri",
	},
	{
		en: "siliguri me mehendi decoration",
		hi: "सिलीगुड़ी में मेहंदी डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
		location: "siliguri",
	},
	{
		en: "siliguri me sangeet decoration",
		hi: "सिलीगुड़ी में संगीत डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
		location: "siliguri",
	},
	{
		en: "siliguri me reception decoration",
		hi: "सिलीगुड़ी में रिसेप्शन डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
		location: "siliguri",
	},
	{
		en: "siliguri me janamdin decoration",
		hi: "सिलीगुड़ी में जन्मदिन की सजावट",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/birthday-party",
		targetPage: "Birthday party",
		programmatic: false,
		service: "birthday-party",
		location: "siliguri",
	},
	{
		en: "siliguri me corporate event decorator",
		hi: "सिलीगुड़ी में कॉर्पोरेट इवेंट डेकोरेटर",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/corporate-events",
		targetPage: "Corporate events",
		programmatic: false,
		service: "corporate-events",
		location: "siliguri",
	},
	{
		en: "siliguri me durga puja pandal decoration",
		hi: "सिलीगुड़ी में दुर्गा पूजा पंडाल डेकोरेशन",
		tier: "tier1",
		intent: "transactional",
		script: "devanagari",
		priority: 1,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
];

// ---------------------------------------------------------------------------
// Bengali (Bangla script) priority keywords (P1).
// Lower estimated volume but high cultural authority value — Bengali-language
// buyers in Siliguri & Jalpaiguri use these regularly.
// ---------------------------------------------------------------------------

const TIER_PRIORITY_1_BENGALI: ReadonlyArray<MegaKeyword> = [
	{
		en: "siliguri biyer decoration",
		hi: "শিলিগুড়িতে বিয়ের ডেকোরেশন",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
		location: "siliguri",
	},
	{
		en: "siliguri event decorator",
		hi: "শিলিগুড়ি ইভেন্ট ডেকোরেটর",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "siliguri gaye holud decoration",
		hi: "শিলিগুড়িতে গায়ে হলুদ ডেকোরেশন",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
		location: "siliguri",
	},
	{
		en: "siliguri annaprashan decoration",
		hi: "শিলিগুড়িতে অন্নপ্রাশন ডেকোরেশন",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/services/annaprashan-rice-ceremony",
		targetPage: "Annaprashan",
		programmatic: false,
		service: "annaprashan",
		location: "siliguri",
	},
	{
		en: "siliguri durga puja pandal design",
		hi: "শিলিগুড়িতে দুর্গা পূজা প্যান্ডেল ডিজাইন",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "siliguri bou bhaat decoration",
		hi: "শিলিগুড়িতে বউ ভাত ডেকোরেশন",
		tier: "tier1",
		intent: "transactional",
		script: "bengali",
		priority: 1,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
		location: "siliguri",
	},
];

// ---------------------------------------------------------------------------
// Pricing intent (P2)
// ---------------------------------------------------------------------------

const TIER_PRICING: ReadonlyArray<MegaKeyword> = [
	{
		en: "wedding decoration cost in siliguri",
		hi: "सिलीगुड़ी में शादी की सजावट का खर्च",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "wedding decoration price in siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "affordable wedding decorator in siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "budget wedding decoration siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "budget friendly wedding decorator siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "low cost wedding decoration siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "luxury wedding decorator in siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "premium wedding decorator in siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "high end wedding decorator siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "wedding mandap cost siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "siliguri",
	},
	{
		en: "reception stage decoration cost siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "reception",
		location: "siliguri",
	},
	{
		en: "birthday decoration cost siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "birthday-party",
		location: "siliguri",
	},
	{
		en: "destination wedding cost in north bengal",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
	},
	{
		en: "tea garden wedding cost in dooars",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
		service: "wedding",
		location: "dooars",
	},
];

// ---------------------------------------------------------------------------
// Programmatic grid — generated from PROGRAMMATIC_LOCATIONS ×
// PROGRAMMATIC_SERVICES × 7 phrasings = ~441 entries.
// Each cell yields:
//   1. canonical:    {svc} decorator in {loc}
//   2. modifier:     best {svc} decorator in {loc}
//   3. phrasing:     {svc} decoration in {loc}
//   4. service-noun: {svc} decoration services in {loc}
//   5. near-me:      professional {svc} decorators near {loc}
//   6. budget:       affordable {svc} decoration {loc}
//   7. ideas:        {svc} decoration ideas {loc}
// Plus the Devanagari canonical, gated on the loc/svc having Devanagari labels.
// ---------------------------------------------------------------------------

function programmaticEntry(
	loc: LocationSlug,
	svc: ServiceSlug,
	phrasing: "canonical" | "best" | "decoration" | "services" | "near" | "budget" | "ideas",
): MegaKeyword {
	const locName = LOCATION_NOUN[loc];
	const svcName = SERVICE_NOUN[svc];

	let en: string;
	let intent: KeywordIntent;
	switch (phrasing) {
		case "canonical":
			en = `${svcName} decorator in ${locName}`;
			intent = "transactional";
			break;
		case "best":
			en = `best ${svcName} decorator in ${locName}`;
			intent = "commercial";
			break;
		case "decoration":
			en = `${svcName} decoration in ${locName}`;
			intent = "transactional";
			break;
		case "services":
			en = `${svcName} decoration services in ${locName}`;
			intent = "transactional";
			break;
		case "near":
			en = `professional ${svcName} decorators near ${locName}`;
			intent = "commercial";
			break;
		case "budget":
			en = `affordable ${svcName} decoration ${locName}`;
			intent = "commercial";
			break;
		case "ideas":
			en = `${svcName} decoration ideas ${locName}`;
			intent = "informational";
			break;
	}

	return {
		en,
		tier: "tier3",
		intent,
		script: "latin",
		priority: 3,
		targetPath: `/decorators/${loc}/${svc}`,
		targetPage: `${svcName} decorators in ${locName}`,
		programmatic: true,
		location: loc,
		service: svc,
	};
}

function programmaticDevanagariEntry(
	loc: LocationSlug,
	svc: ServiceSlug,
): MegaKeyword {
	const hiLoc = PROGRAMMATIC_LOCATIONS_HINDI[loc];
	const hiSvc = PROGRAMMATIC_SERVICES_HINDI[svc];
	const enRomanised = `${LOCATION_NOUN[loc].toLowerCase()} me ${SERVICE_NOUN[svc]} decorator`;
	return {
		en: enRomanised,
		hi: `${hiLoc} में ${hiSvc} डेकोरेटर`,
		tier: "tier3",
		intent: "transactional",
		script: "devanagari",
		priority: 3,
		targetPath: `/decorators/${loc}/${svc}`,
		targetPage: `${SERVICE_NOUN[svc]} decorators in ${LOCATION_NOUN[loc]}`,
		programmatic: true,
		location: loc,
		service: svc,
	};
}

function buildProgrammaticGrid(): MegaKeyword[] {
	const out: MegaKeyword[] = [];
	const phrasings: ReadonlyArray<
		"canonical" | "best" | "decoration" | "services" | "near" | "budget" | "ideas"
	> = ["canonical", "best", "decoration", "services", "near", "budget", "ideas"];
	for (const loc of PROGRAMMATIC_LOCATIONS) {
		for (const svc of PROGRAMMATIC_SERVICES) {
			for (const phrasing of phrasings) {
				out.push(programmaticEntry(loc, svc, phrasing));
			}
			out.push(programmaticDevanagariEntry(loc, svc));
		}
	}
	return out;
}

const TIER_PROGRAMMATIC_GRID: ReadonlyArray<MegaKeyword> = buildProgrammaticGrid();

// ---------------------------------------------------------------------------
// Bridal cluster (P2) — informational, drives blog cluster + service FAQs.
// ---------------------------------------------------------------------------

const TIER_BRIDAL_CLUSTER: ReadonlyArray<MegaKeyword> = [
	// Haldi
	{
		en: "haldi function decor checklist",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "haldi ceremony decoration at home",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "haldi decoration with marigold",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "haldi decoration with terracotta",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "yellow haldi decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "intimate haldi decoration for 30 guests",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "mukh dekhai decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	{
		en: "gaye holud chowki decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/haldi-gaye-holud",
		targetPage: "Haldi / Gaye Holud",
		programmatic: false,
		service: "haldi",
	},
	// Mehendi
	{
		en: "bridal mehendi decor ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "bohemian mehendi decoration setup",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "moroccan mehendi decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "floral swing for bridal mehendi",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "mehendi decoration with low seating",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "mehendi decoration with umbrellas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "mehendi decoration with lanterns",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	{
		en: "mehendi photo booth ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
		service: "mehendi",
	},
	// Sangeet
	{
		en: "sangeet stage decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	{
		en: "sangeet stage backdrop ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	{
		en: "sangeet performance stage design",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	{
		en: "sangeet decoration with led",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	{
		en: "sangeet entry tunnel decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	{
		en: "bollywood theme sangeet decor",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
		service: "sangeet",
	},
	// Engagement / Roka
	{
		en: "engagement decoration ideas at home",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/engagement-roka",
		targetPage: "Engagement / Roka",
		programmatic: false,
	},
	{
		en: "ring ceremony decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/engagement-roka",
		targetPage: "Engagement / Roka",
		programmatic: false,
	},
	{
		en: "roka decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/engagement-roka",
		targetPage: "Engagement / Roka",
		programmatic: false,
	},
	{
		en: "engagement ring tray decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/engagement-roka",
		targetPage: "Engagement / Roka",
		programmatic: false,
	},
	{
		en: "engagement decoration with pastel theme",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/engagement-roka",
		targetPage: "Engagement / Roka",
		programmatic: false,
	},
	// Reception
	{
		en: "reception stage decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	{
		en: "reception entry decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	{
		en: "reception walk in decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	{
		en: "reception decoration with led wall",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	{
		en: "reception decoration in banquet hall",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	{
		en: "reception cake table decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/reception",
		targetPage: "Reception",
		programmatic: false,
		service: "reception",
	},
	// Bengali wedding rituals
	{
		en: "chhadnatala decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "bashor ghor decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "saat paak decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "subho drishti decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "bengali wedding mandap ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "bengali wedding alpana design",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "bengali wedding palki decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
];

// ---------------------------------------------------------------------------
// Festival cluster (P2)
// ---------------------------------------------------------------------------

const TIER_FESTIVAL_CLUSTER: ReadonlyArray<MegaKeyword> = [
	{
		en: "durga puja pandal design siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "themed durga puja pandal siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "sarbojanin durga puja pandal siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "apartment durga puja decoration siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "durga puja pandal heritage theme",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
	},
	{
		en: "durga puja pandal abstract theme",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
	},
	{
		en: "durga puja pandal eco theme",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/durga-puja-decoration",
		targetPage: "Durga Puja",
		programmatic: false,
	},
	{
		en: "home lakshmi puja decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/lakshmi-puja",
		targetPage: "Lakshmi Puja",
		programmatic: false,
	},
	{
		en: "kojagori lakshmi puja decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/lakshmi-puja",
		targetPage: "Lakshmi Puja",
		programmatic: false,
	},
	{
		en: "lakshmi puja alpana design",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/lakshmi-puja",
		targetPage: "Lakshmi Puja",
		programmatic: false,
	},
	{
		en: "lakshmi puja kalash decoration",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/lakshmi-puja",
		targetPage: "Lakshmi Puja",
		programmatic: false,
	},
	{
		en: "saraswati puja decoration school siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/services/saraswati-puja",
		targetPage: "Saraswati Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "basant panchami decoration siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/saraswati-puja",
		targetPage: "Saraswati Puja",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "saraswati puja decoration with palash",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/saraswati-puja",
		targetPage: "Saraswati Puja",
		programmatic: false,
	},
	{
		en: "kali puja decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/private-celebrations",
		targetPage: "Private celebrations",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "diwali decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/private-celebrations",
		targetPage: "Private celebrations",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "diwali home decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/private-celebrations",
		targetPage: "Private celebrations",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "bhai phonta decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/private-celebrations",
		targetPage: "Private celebrations",
		programmatic: false,
		location: "siliguri",
	},
	{
		en: "annaprashan decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/annaprashan-rice-ceremony",
		targetPage: "Annaprashan",
		programmatic: false,
		service: "annaprashan",
		location: "siliguri",
	},
	{
		en: "mukhe bhaat decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/annaprashan-rice-ceremony",
		targetPage: "Annaprashan",
		programmatic: false,
		service: "annaprashan",
		location: "siliguri",
	},
	{
		en: "naamkaran cradle decoration ideas",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/naamkaran",
		targetPage: "Naamkaran",
		programmatic: false,
	},
	{
		en: "godh bharai decoration siliguri",
		tier: "tier2",
		intent: "transactional",
		script: "latin",
		priority: 2,
		targetPath: "/services/baby-shower-godh-bharai",
		targetPage: "Baby shower / Godh Bharai",
		programmatic: false,
		location: "siliguri",
	},
];

// ---------------------------------------------------------------------------
// Question keywords (P3) — these become FAQ entries on service pages + blog
// cluster post topics. Capping at the highest-leverage 60 for the lib subset;
// the full ~220 list lives in the docs markdown.
// ---------------------------------------------------------------------------

const TIER_QUESTIONS: ReadonlyArray<MegaKeyword> = [
	{
		en: "how much does wedding decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does a mandap cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does sangeet stage cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does reception decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does birthday decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does first birthday decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does annaprashan decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does mehendi decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does engagement decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does corporate event decoration cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "how much does durga puja pandal cost in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "what does a wedding decoration package include",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "what does a wedding decorator do",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "what does a wedding mandap include",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "what does sangeet stage decoration include",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/sangeet",
		targetPage: "Sangeet",
		programmatic: false,
	},
	{
		en: "what does corporate event decoration include",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/corporate-events",
		targetPage: "Corporate events",
		programmatic: false,
	},
	{
		en: "do i need a wedding decorator for a small wedding",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "do i need a wedding planner in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "do i need a separate mehendi venue",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/mehendi",
		targetPage: "Mehendi",
		programmatic: false,
	},
	{
		en: "do i need a rain plan for monsoon wedding",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "do i need a generator for outdoor wedding siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "where can i find a good wedding decorator in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "where can i find a budget wedding decorator in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "where can i find a luxury wedding decorator in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "who is the best wedding decorator in siliguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "who is the best wedding decorator in bagdogra",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/bagdogra/wedding",
		targetPage: "Wedding decorators in Bagdogra",
		programmatic: true,
		location: "bagdogra",
		service: "wedding",
	},
	{
		en: "who is the best wedding decorator in darjeeling",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/darjeeling/wedding",
		targetPage: "Wedding decorators in Darjeeling",
		programmatic: true,
		location: "darjeeling",
		service: "wedding",
	},
	{
		en: "who is the best wedding decorator in kalimpong",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/kalimpong/wedding",
		targetPage: "Wedding decorators in Kalimpong",
		programmatic: true,
		location: "kalimpong",
		service: "wedding",
	},
	{
		en: "who is the best wedding decorator in jalpaiguri",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/jalpaiguri/wedding",
		targetPage: "Wedding decorators in Jalpaiguri",
		programmatic: true,
		location: "jalpaiguri",
		service: "wedding",
	},
	{
		en: "who is the best wedding decorator in gangtok",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/gangtok/wedding",
		targetPage: "Wedding decorators in Gangtok",
		programmatic: true,
		location: "gangtok",
		service: "wedding",
	},
	{
		en: "who is the best wedding decorator in dooars",
		tier: "tier2",
		intent: "commercial",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/dooars/wedding",
		targetPage: "Wedding decorators in the Dooars",
		programmatic: true,
		location: "dooars",
		service: "wedding",
	},
	{
		en: "when should i book a wedding decorator in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "when should i book a destination wedding planner",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "when should i book a tea garden wedding venue",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/dooars/wedding",
		targetPage: "Wedding decorators in the Dooars",
		programmatic: true,
		location: "dooars",
		service: "wedding",
	},
	{
		en: "what is the best month for wedding in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/wedding",
		targetPage: "Wedding service",
		programmatic: false,
	},
	{
		en: "what is the best month for wedding in darjeeling",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/darjeeling/wedding",
		targetPage: "Wedding decorators in Darjeeling",
		programmatic: true,
		location: "darjeeling",
		service: "wedding",
	},
	{
		en: "what is the best month for tea garden wedding",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/dooars/wedding",
		targetPage: "Wedding decorators in the Dooars",
		programmatic: true,
		location: "dooars",
		service: "wedding",
	},
	{
		en: "how to plan a 6 month bengali wedding",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/services/bengali-wedding",
		targetPage: "Bengali wedding",
		programmatic: false,
		service: "bengali-wedding",
	},
	{
		en: "how to plan a destination wedding in darjeeling",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/darjeeling/wedding",
		targetPage: "Wedding decorators in Darjeeling",
		programmatic: true,
		location: "darjeeling",
		service: "wedding",
	},
	{
		en: "how to plan a tea garden wedding in dooars",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/decorators/dooars/wedding",
		targetPage: "Wedding decorators in the Dooars",
		programmatic: true,
		location: "dooars",
		service: "wedding",
	},
	{
		en: "how to choose a wedding decorator in siliguri",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "what to ask a wedding decorator before booking",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/contact",
		targetPage: "Contact",
		programmatic: false,
	},
	{
		en: "what is included in wedding mandap quotation",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
	{
		en: "should i hire a wedding decorator or a wedding planner",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "should i book a wedding venue or a wedding decorator first",
		tier: "tier2",
		intent: "informational",
		script: "latin",
		priority: 2,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
];

// ---------------------------------------------------------------------------
// Branded (P4) — auto-rank, low effort. Kept here for completeness so reporting
// includes branded queries in the same dashboard.
// ---------------------------------------------------------------------------

const TIER_BRANDED: ReadonlyArray<MegaKeyword> = [
	{
		en: "siligurievent",
		hi: "सिलीगुरीइवेंट",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
	},
	{
		en: "siliguri events",
		hi: "सिलीगुड़ी इवेंट्स",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
	},
	{
		en: "siligurievent decorator",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/",
		targetPage: "Home",
		programmatic: false,
	},
	{
		en: "siligurievent reviews",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/about",
		targetPage: "About",
		programmatic: false,
	},
	{
		en: "siligurievent portfolio",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/portfolio",
		targetPage: "Portfolio",
		programmatic: false,
	},
	{
		en: "siligurievent contact",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/contact",
		targetPage: "Contact",
		programmatic: false,
	},
	{
		en: "siligurievent pricing",
		tier: "tier4",
		intent: "navigational",
		script: "latin",
		priority: 4,
		targetPath: "/pricing",
		targetPage: "Pricing",
		programmatic: false,
	},
];

// ---------------------------------------------------------------------------
// Public — the full mega list and helper functions.
// ---------------------------------------------------------------------------

export const MEGA_KEYWORDS: ReadonlyArray<MegaKeyword> = [
	...TIER_PRIORITY_1,
	...TIER_PRIORITY_1_DEVANAGARI,
	...TIER_PRIORITY_1_BENGALI,
	...TIER_PRICING,
	...TIER_PROGRAMMATIC_GRID,
	...TIER_BRIDAL_CLUSTER,
	...TIER_FESTIVAL_CLUSTER,
	...TIER_QUESTIONS,
	...TIER_BRANDED,
];

/**
 * Returns the keywords that should drive metadata generation for a given page.
 *
 * Matches by exact `targetPath`. Programmatic pages use the full path
 * (`/decorators/siliguri/wedding`), service pages use `/services/[slug]`, etc.
 */
export function getKeywordsByPage(path: string): ReadonlyArray<MegaKeyword> {
	return MEGA_KEYWORDS.filter((k) => k.targetPath === path);
}

/**
 * Returns all keywords anchored to a given location. Useful for the
 * `/locations/[slug]` page and for building location-aware blog briefs.
 */
export function getKeywordsByLocation(
	loc: LocationSlug,
): ReadonlyArray<MegaKeyword> {
	return MEGA_KEYWORDS.filter((k) => k.location === loc);
}

/**
 * Returns all keywords anchored to a given service slug.
 */
export function getKeywordsByService(
	svc: ServiceSlug,
): ReadonlyArray<MegaKeyword> {
	return MEGA_KEYWORDS.filter((k) => k.service === svc);
}

/**
 * Returns the question-shaped keywords. Used to seed FAQ blocks + blog
 * cluster topics.
 */
export function getQuestionKeywords(): ReadonlyArray<MegaKeyword> {
	const stems = [
		"how much",
		"what does",
		"do i need",
		"where can",
		"who is",
		"when should",
		"what is",
		"how to",
		"can i",
		"can a",
		"will a",
		"should i",
	];
	const lower = (s: string): string => s.toLowerCase();
	return MEGA_KEYWORDS.filter((k) =>
		stems.some((stem) => lower(k.en).startsWith(stem)),
	);
}

/**
 * Returns programmatic-grid keywords for a (location, service) cell. Used by
 * `/decorators/[location]/[service]/page.tsx` to pick the H1 + keywords list
 * + meta description seeds.
 */
export function getProgrammaticKeywords(
	loc: LocationSlug,
	svc: ServiceSlug,
): ReadonlyArray<MegaKeyword> {
	return MEGA_KEYWORDS.filter(
		(k) => k.programmatic && k.location === loc && k.service === svc,
	);
}

/**
 * Return the canonical (highest-priority) keyword for a given page path. Used
 * as the H1 / metadata title seed.
 *
 * Selection rule: priority 1 transactional > priority 1 commercial > tier-3
 * transactional > anything else. Stable order in `MEGA_KEYWORDS` is the
 * tiebreak.
 */
export function getCanonicalKeyword(path: string): MegaKeyword | undefined {
	const matches = getKeywordsByPage(path);
	if (matches.length === 0) return undefined;
	const transactional = matches.filter(
		(k) => k.intent === "transactional" && k.script === "latin",
	);
	if (transactional.length > 0) return transactional[0];
	const commercial = matches.filter(
		(k) => k.intent === "commercial" && k.script === "latin",
	);
	if (commercial.length > 0) return commercial[0];
	return matches[0];
}

/**
 * For `generateMetadata` consumers: pick the top `n` English keyword strings
 * for a given page path. Sparingly (Google ignores the meta `keywords` tag,
 * but the list is useful for OG / Twitter card composition + internal
 * reporting + accidental ad-copy reuse).
 */
export function topEnglishKeywordsForPage(
	path: string,
	n = 8,
): ReadonlyArray<string> {
	const items = getKeywordsByPage(path)
		.filter((k) => k.script === "latin")
		.slice(0, n);
	return items.map((k) => k.en);
}

/**
 * Devanagari companion for `topEnglishKeywordsForPage`. Returns the Hindi
 * forms where present.
 */
export function topDevanagariKeywordsForPage(
	path: string,
	n = 8,
): ReadonlyArray<string> {
	const items = MEGA_KEYWORDS.filter(
		(k) => k.targetPath === path && k.script === "devanagari" && typeof k.hi === "string",
	).slice(0, n);
	return items
		.map((k) => k.hi)
		.filter((s): s is string => typeof s === "string");
}

/**
 * Aggregate counts — useful for build-time logging.
 */
export function megaKeywordStats(): {
	total: number;
	byTier: Record<MegaKeyword["tier"], number>;
	byScript: Record<KeywordScript, number>;
	byIntent: Record<KeywordIntent, number>;
	programmatic: number;
} {
	const byTier: Record<MegaKeyword["tier"], number> = {
		tier1: 0,
		tier2: 0,
		tier3: 0,
		tier4: 0,
	};
	const byScript: Record<KeywordScript, number> = {
		latin: 0,
		devanagari: 0,
		bengali: 0,
	};
	const byIntent: Record<KeywordIntent, number> = {
		informational: 0,
		commercial: 0,
		transactional: 0,
		navigational: 0,
	};
	let programmatic = 0;
	for (const k of MEGA_KEYWORDS) {
		byTier[k.tier] += 1;
		byScript[k.script] += 1;
		byIntent[k.intent] += 1;
		if (k.programmatic) programmatic += 1;
	}
	return {
		total: MEGA_KEYWORDS.length,
		byTier,
		byScript,
		byIntent,
		programmatic,
	};
}
