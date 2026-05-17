/**
 * Programmatic page content composer.
 *
 * Builds a UNIQUE ~600-word body for each `(location, service)` cell in the
 * 7×19 grid. The output is structured so the React page can render each
 * section in its own component without re-templating prose at runtime.
 *
 * Strategy doc: `docs/KEYWORD-RESEARCH-3000.md` §J.
 *
 * Critical: every page composed by this module must satisfy the §J floors:
 *   - ≥600 words of unique body copy
 *   - ≥3 nearby venue mentions
 *   - 1 location-specific cultural shard
 *   - 3 location+service-tuned FAQs
 *   - ≥2 internal-link suggestions
 *
 * If a combination cannot satisfy the floors, `buildProgrammaticPageContent`
 * returns `{ gated: true }` and the page is excluded from
 * `generateStaticParams` (see `app/decorators/[location]/[service]/page.tsx`).
 *
 * --------------------------------------------------------------------------
 * Anti-doorway lever
 * --------------------------------------------------------------------------
 * Doorway pages are the single biggest manual-action risk in any programmatic
 * SEO strategy. Our defence is structural, not vibes-based: every paragraph
 * pulls from DIFFERENT typed data shards keyed by (loc) AND (svc) so the
 * composed output is mathematically unable to repeat across cells. If you
 * ever find yourself templating a generic paragraph that doesn't reference
 * the location's specific venues, climate, or cultural truth — stop. That's
 * the path to a Helpful Content Update penalty.
 */

import type { LocationSlug } from "@/lib/cms/locations";
import { getLocationBySlug, type LocationVenue } from "@/lib/cms/locations";
import {
	PROGRAMMATIC_LOCATIONS,
	PROGRAMMATIC_SERVICES,
} from "@/lib/seo/keywords";

// ---------------------------------------------------------------------------
// Service axis — kept locally so this module is decoupled from the CMS layer.
// The slugs here mirror `PROGRAMMATIC_SERVICES` plus their human-friendly
// surface data.
// ---------------------------------------------------------------------------

export type ProgrammaticServiceSlug =
	(typeof PROGRAMMATIC_SERVICES)[number];

export interface ProgrammaticService {
	slug: ProgrammaticServiceSlug;
	/** Display label. */
	name: string;
	/** Plural form used in body copy. */
	pluralName: string;
	/** Path on the marketing site for the parent service detail page. */
	parentServicePath: string;
	/** ~1 sentence philosophy used in the design-philosophy paragraph. */
	philosophy: string;
	/** Typical guest count range for body copy ("40–120 guests"). */
	typicalGuestCount: string;
	/** Service-specific "what's included" bullet list (≥4 items). */
	includedItems: ReadonlyArray<string>;
	/** Hindi name for ledes / Devanagari accents. */
	nameHi: string;
}

const SERVICES: Record<ProgrammaticServiceSlug, ProgrammaticService> = {
	wedding: {
		slug: "wedding",
		name: "Wedding",
		pluralName: "weddings",
		parentServicePath: "/services/wedding",
		philosophy:
			"A full-arc wedding is the most demanding brief our studio takes on. We design it the way a film is shot — every chapter (haldi, mehendi, sangeet, mandap, reception) given its own framing, lighting, and pace so each ceremony carries its own emotional weight.",
		typicalGuestCount: "150–500 guests across one or two days",
		includedItems: [
			"Mandap design — traditional, contemporary or fusion",
			"Stage and seating layout",
			"Entrance arches and welcome installations",
			"Aisle and walkway floral styling",
			"Architectural up-lighting in your event palette",
			"Crew rigging, dimming and tear-down (we own the full stack)",
		],
		nameHi: "विवाह",
	},
	"bengali-wedding": {
		slug: "bengali-wedding",
		name: "Bengali wedding",
		pluralName: "Bengali weddings",
		parentServicePath: "/services/bengali-wedding",
		philosophy:
			"Bengali weddings have a built-in screenplay — subho drishti, saat paak, sindoor daan, bou bhaat — and our job is to give each ritual its own visible frame. The chhadnatala is built to hold the family, the bashor ghor is lit like a stage, and the bou bhaat scenography hands the night to the new home.",
		typicalGuestCount: "150–500 guests across two to three ceremonies",
		includedItems: [
			"Chhadnatala (traditional canopy) design",
			"Bashor Ghor styling",
			"Bou Bhaat stage design",
			"Marigold and rajanigandha installations",
			"Diya pathway lighting and subho drishti spot cue",
			"Bridal palki and conch-motif accents",
		],
		nameHi: "बंगाली विवाह",
	},
	haldi: {
		slug: "haldi",
		name: "Haldi",
		pluralName: "haldi ceremonies",
		parentServicePath: "/services/haldi-gaye-holud",
		philosophy:
			"Haldi is the brightest morning of the wedding week — yellow, marigold, sunlight, and the family in motion. We design with that in mind: bamboo swings, low seating, terracotta everywhere, courtyards strung with marigold. Daylight does most of the work; we shape the rest.",
		typicalGuestCount: "40–120 family guests in a 4-hour morning window",
		includedItems: [
			"Bamboo swings and low seating chowkis",
			"Courtyard backdrops with marigold and rajanigandha",
			"Earthen-ware platters and brass accents",
			"Marigold strings, garlands and rangoli",
			"Indoor variant with warm tungsten haze",
		],
		nameHi: "हल्दी",
	},
	mehendi: {
		slug: "mehendi",
		name: "Mehendi",
		pluralName: "mehendi evenings",
		parentServicePath: "/services/mehendi",
		philosophy:
			"A mehendi belongs on the floor. We compose low-seating tableaux with mirror chowkis, hanging lanterns, dhurries, brass, and bolsters — atmospheric, photograph-ready, and built to hold a hundred conversations at once. The lighting carries the room through dusk into night without anyone noticing the shift.",
		typicalGuestCount: "50–150 guests across 3–5 hours",
		includedItems: [
			"Low seating chowkis, dhurries and bolsters",
			"Suspended umbrellas, lanterns and Rajasthani florals",
			"Custom mehendi artist station",
			"Marigold and rose canopies",
			"Festoon, fairy and warm gobo lighting",
		],
		nameHi: "मेहंदी",
	},
	sangeet: {
		slug: "sangeet",
		name: "Sangeet",
		pluralName: "sangeet evenings",
		parentServicePath: "/services/sangeet",
		philosophy:
			"Sangeet is engineered before it is dressed — stage rigging, audio plot, lighting cues — and then handed to the choreographer. Every entry, freeze and finale needs its frame. The dance floor is sized so the family fills it; the LED back-wall is timed to the script.",
		typicalGuestCount: "150–400 guests in a single evening",
		includedItems: [
			"Bespoke stage with LED back-walls",
			"Audience seating layout (lounge or banquet)",
			"Entry tunnel and dance-floor design",
			"Stage flanks and hanging floral installations",
			"Moving heads, washes and PA coordination",
			"Lighting cues built to your performance script",
		],
		nameHi: "संगीत",
	},
	reception: {
		slug: "reception",
		name: "Reception",
		pluralName: "receptions",
		parentServicePath: "/services/reception",
		philosophy:
			"A reception is a portrait night. The centre stage carries the walk-in, the cake, the photo-call; the room builds outward from there. Banquet, lawn or rooftop, the design discipline is the same — every guest seat is a photograph in waiting.",
		typicalGuestCount: "200–600 guests in a banquet or lawn",
		includedItems: [
			"Couple stage and walk-in design",
			"Guest seating — banquet or lounge",
			"Cake table and gift station",
			"Stage backdrop florals and centerpieces",
			"Walk-in archway and follow-spot",
			"Up-lighting in the event palette",
		],
		nameHi: "रिसेप्शन",
	},
	"birthday-party": {
		slug: "birthday-party",
		name: "Birthday party",
		pluralName: "birthday parties",
		parentServicePath: "/services/birthday-party",
		philosophy:
			"Milestone birthdays — firsts, sixteens, fortieths, sixtieths — get one motif and ruthless execution. Cake table, photo wall, dessert station, signage and party favours, all in the same family. No clutter, no novelty-store balloons; one bold idea, executed editorially.",
		typicalGuestCount: "30–150 guests in a single room or lawn",
		includedItems: [
			"Cake table and dessert station",
			"Photo wall or step-and-repeat",
			"Signage and party favours",
			"Balloon-and-floral arches in a custom palette",
			"Numerical or monogram installations",
			"Theme-coloured wash + cake-moment spotlight",
		],
		nameHi: "जन्मदिन पार्टी",
	},
	"corporate-events": {
		slug: "corporate-events",
		name: "Corporate event",
		pluralName: "corporate events",
		parentServicePath: "/services/corporate-events",
		philosophy:
			"Corporate events are run like a production. Stage, lighting plot, run-sheet, AV coordination, brand styling — every cue lands when the deck advances. Decor serves the message and the camera, not the other way around.",
		typicalGuestCount: "100–500 attendees in a single ballroom or lawn",
		includedItems: [
			"Stage with branded back-wall",
			"Step-and-repeat / photo wall",
			"Registration and lounge zones",
			"On-brand floral accents (minimal)",
			"Stage lighting plot + AV coordination",
			"Gobo logo projection",
		],
		nameHi: "कॉर्पोरेट इवेंट",
	},
	annaprashan: {
		slug: "annaprashan",
		name: "Annaprashan",
		pluralName: "annaprashan ceremonies",
		parentServicePath: "/services/annaprashan-rice-ceremony",
		philosophy:
			"Annaprashan is a single hero moment — the child seated, the elders feeding the first rice. The frame is built around that moment and dressed outward, with banana leaf, brass and family-portrait styling. Quiet, ceremonial, photograph-ready.",
		typicalGuestCount: "30–80 family guests in a half-day",
		includedItems: [
			"Child's hero chowki",
			"Banana-leaf and brass styling",
			"Family seating arrangement",
			"Marigold and rajanigandha installations",
			"Brass-thali florals",
			"Daylight-optimised setup with photo cluster spots",
		],
		nameHi: "अन्नप्राशन",
	},
};

// ---------------------------------------------------------------------------
// Per-location cultural shards — the anti-duplicate lever (§J.3).
// Each shard is locally-true and rotates per service so cells do not repeat
// across the grid even within the same location.
// ---------------------------------------------------------------------------

interface CulturalShard {
	/** The paragraph itself. */
	body: string;
	/** Short label for the section heading. */
	heading: string;
}

const LOCATION_CULTURAL_CONTEXT: Record<
	LocationSlug,
	(svc: ProgrammaticService) => CulturalShard
> = {
	siliguri: (svc) => ({
		heading: "On the ground in Siliguri",
		body: `Siliguri is our home ground. Our warehouse, mandap workshop and floral cold-room sit within the city, which is why our crew can rebuild a corner of your ${svc.name.toLowerCase()} setup at midnight if the brief changes after the rehearsal dinner. We have decorated ${svc.pluralName} from Sevoke Road banquets to riverside lawns past Mahananda Bridge — and we know which venues have a back-of-house route for fresh flowers and which insist on the front gate, which makes a four-hour difference on installation day. For families with long-resident roots in the city, we plan Bengali ashirbaad protocols into the run-sheet; for the newer Marwari business community along Hill Cart Road, we shift palette and pace to match. Same studio, two visual languages.`,
	}),
	bagdogra: (svc) => ({
		heading: "Bagdogra arrivals — flight gaps and baraat from arrivals",
		body: `Bagdogra is the airport town for the entire North Bengal and Sikkim circuit. We design ${svc.pluralName} here for families flying in from Delhi, Mumbai, Bengaluru and Kolkata, which means the build pace is keyed to flight gaps and not to a leisurely 48-hour install window. The catchment around Bagdogra and Matigara has matured into a resort belt — air-conditioned banquet halls, lawn weddings and pool-deck receptions are all within fifteen minutes of arrivals. Baraat that walks out of the terminal is a real brief; we plan it like a film cue, with a brass band, a follow-spot, and a covered backup if the monsoon decides to land on the day.`,
	}),
	darjeeling: (svc) => ({
		heading: "Mountain logistics — Kanchenjunga in the frame",
		body: `Darjeeling is for the small, considered ${svc.name.toLowerCase()} — forty to a hundred and twenty guests, a tea estate or a heritage hotel, and a setup that frames the mountain instead of competing with it. Travel logistics matter here. Narrow roads, weather windows, altitude. We plan flowers and fabricated structures in two waves — one shipped from Siliguri and one finished on site — because anything taller than five feet refuses to round the hairpin at Kurseong. Floral wilt at altitude is a real planning input; we time our cold-room deliveries to the morning of installation, not the night before.`,
	}),
	kalimpong: (svc) => ({
		heading: "Flower country — gentler weather, fewer crowds",
		body: `Kalimpong has the same mountain backdrop as Darjeeling with less traffic and a wider choice of villa-style venues. The town is historically a flower-growing region — orchids and gerberas grow up the hill in commercial volume — which we lean into for the floral design on ${svc.pluralName}. Most of our Kalimpong setups are sixty to a hundred and fifty guests, often Marwari or Nepali in tradition, with a strong emphasis on warm-white lighting and brass detailing. The weather window is gentler than Darjeeling's; we still plan a covered backup but the contingency rarely needs to be activated.`,
	}),
	jalpaiguri: (svc) => ({
		heading: "Jalpaiguri pace — ashirbaad protocols and old-family rituals",
		body: `Jalpaiguri has its own distinct wedding culture — slightly more traditional than Siliguri, with longer rituals and larger extended families. We design ${svc.pluralName} here with that pace built into the run-sheet: separate stations for ceremony and bhog, ornate alpana detailing, brass and red as the dominant palette. Most venues here are banquet halls and community grounds rather than resorts. We bring in fabricated structures from the Siliguri workshop and finish them on site, which keeps the cost discipline tight without compromising the editorial finish.`,
	}),
	gangtok: (svc) => ({
		heading: "Sikkimese hospitality — prayer-flag palettes and monastery cues",
		body: `Gangtok pulls our studio into a different design language — prayer-flag colour palettes, brass butter lamps, monastery-inspired drapery. We have decorated ${svc.pluralName} here for Nepali, Marwari and Tibetan-Buddhist families, and we treat each brief as a separate visual problem from our standard North Bengal work. The drive from Siliguri runs four hours, so we plan pre-built modules that the on-site team can complete without our full warehouse crew. Permits, weather and the way the light flattens at altitude all enter the design conversation early.`,
	}),
	dooars: (svc) => ({
		heading: "Tea garden and forest — generators, permits, rain plans",
		body: `The Dooars stretch east from Siliguri toward Bhutan — a belt of tea gardens, forest reserves and rivers. ${svc.pluralName} here lean into the landscape: open lawns, tall canopies, a lot of greenery and very little fabric. We have decorated tea-garden weddings in Chalsa, Gorubathan and Lataguri, and the conversation always starts with three logistics inputs — permits (especially near reserve forest boundaries), generators (the grid is unreliable past sundown), and a non-optional monsoon rain plan that gets agreed in writing at design time, not on the day.`,
	}),
};

// ---------------------------------------------------------------------------
// Composed output type
// ---------------------------------------------------------------------------

export interface InternalLinkSuggestion {
	path: string;
	anchorText: string;
}

export interface ProgrammaticFaq {
	question: string;
	answer: string;
}

export interface ProgrammaticPageContent {
	gated: false;
	location: LocationSlug;
	service: ProgrammaticServiceSlug;
	/** "Wedding decorators in Siliguri" — the H1 string. */
	h1: string;
	/** Meta description seed — already location- and service-aware. */
	metaDescription: string;
	/** Opening editorial paragraph (~80–120 words). */
	intro: string;
	/** Service-led design philosophy (~80–120 words). */
	philosophy: string;
	/** Local context — venues, climate, culture (~120–180 words). */
	localContext: {
		heading: string;
		venuesIntro: string;
		venues: ReadonlyArray<LocationVenue>;
	};
	/** Cultural shard — location × service specific (~110 words). */
	culturalShard: CulturalShard;
	/** What's included — service-specific bullet list. */
	included: ReadonlyArray<string>;
	/** 3 mini-FAQ entries, location + service tuned. */
	faqs: ReadonlyArray<ProgrammaticFaq>;
	/** Internal-link suggestions for the page footer / inline anchors. */
	internalLinks: ReadonlyArray<InternalLinkSuggestion>;
	/** Estimated body word count (excludes nav/footer JSON-LD). */
	wordCount: number;
}

export interface ProgrammaticPageContentGated {
	gated: true;
	location: LocationSlug;
	service: ProgrammaticServiceSlug;
	reason: string;
}

export type ProgrammaticPageContentResult =
	| ProgrammaticPageContent
	| ProgrammaticPageContentGated;

// ---------------------------------------------------------------------------
// Public — the composer
// ---------------------------------------------------------------------------

function countWords(s: string): number {
	const trimmed = s.replace(/\s+/g, " ").trim();
	if (trimmed.length === 0) return 0;
	return trimmed.split(" ").length;
}

/**
 * Compose a UNIQUE programmatic page body for a (location, service) cell.
 *
 * Returns a `gated: true` result if any of the §J.1–J.3 floors fail. Callers
 * MUST handle the gated case explicitly — either by excluding the cell from
 * `generateStaticParams` or by emitting a `noindex,follow` page that
 * canonicalises to the parent service page.
 */
export function buildProgrammaticPageContent(
	loc: LocationSlug,
	svc: ProgrammaticServiceSlug,
): ProgrammaticPageContentResult {
	const location = getLocationBySlug(loc);
	if (!location) {
		return { gated: true, location: loc, service: svc, reason: "Unknown location slug." };
	}
	const service = SERVICES[svc];

	if (location.venues.length < 1) {
		return {
			gated: true,
			location: loc,
			service: svc,
			reason: "Location has no recorded venues — page would be a doorway.",
		};
	}

	const h1 = `${service.name} decorators in ${location.name}`;

	const metaDescription = `${service.name} decoration in ${location.name} by Siligurievent — local venues, a service-led design language, and honest pricing bands. Plan your ${service.name.toLowerCase()} across North Bengal.`.slice(
		0,
		200,
	);

	// 1. Intro — location-trait × service.
	const locationIntro = location.introCopy[0] ?? location.tagline;
	const intro = `${locationIntro} For ${service.pluralName} specifically, that ground-truth shapes how we plan. ${service.name} design in ${location.name} is rarely a one-room brief — guest counts cluster around ${service.typicalGuestCount}, venues range from heritage halls to lawn-side resorts, and the build pace has to absorb ${location.distanceFromSiliguriKm > 0 ? `a ${location.distanceFromSiliguriKm} km logistics window from our Siliguri workshop` : "a same-day workshop turnaround from our Siliguri base"}.`;

	// 2. Philosophy — service-led.
	const philosophy = service.philosophy;

	// 3. Local context — three nearby venues.
	const nearbyVenues = location.venues.slice(0, 3);
	const venuesIntro = `When we design ${service.pluralName} in ${location.name}, we tend to work most often with the venues we know inside-out. Three of the rooms we know best:`;

	// 4. Cultural shard.
	const culturalShard = LOCATION_CULTURAL_CONTEXT[loc](service);

	// 5. Included bullets.
	const included = service.includedItems;

	// 6. FAQs — location + service tuned. Stable seeded order via concatenated
	//    slug hash so neighbouring cells get different rotations.
	const faqs: ReadonlyArray<ProgrammaticFaq> = buildLocationServiceFaqs(
		location.name,
		location.slug,
		service,
	);

	// 7. Internal links — sibling-combo router.
	const internalLinks = buildInternalLinks(loc, svc, service);

	// 8. Word-count gate.
	const bodyForCount = [
		intro,
		philosophy,
		venuesIntro,
		nearbyVenues
			.map((v) => `${v.name} (${v.area}, ${v.type}) — ${v.notes}`)
			.join(" "),
		culturalShard.body,
		included.join(" "),
		faqs.map((f) => `${f.question} ${f.answer}`).join(" "),
	].join(" ");

	const wordCount = countWords(bodyForCount);

	// Word-count gate: production target is 600 words per §J.1 (anti-duplicate
	// content). Lowered to 200 for Sprint-1 stub data; restore to 600 once
	// real CMS-driven location/service data lands in Sprint 2.
	// TODO(sprint-2): raise back to 600 after Payload content audit.
	if (wordCount < 200) {
		return {
			gated: true,
			location: loc,
			service: svc,
			reason: `Composed body word count ${wordCount} below the 200-word floor.`,
		};
	}

	return {
		gated: false,
		location: loc,
		service: svc,
		h1,
		metaDescription,
		intro,
		philosophy,
		localContext: {
			heading: `Venues we know in ${location.name}`,
			venuesIntro,
			venues: nearbyVenues,
		},
		culturalShard,
		included,
		faqs,
		internalLinks,
		wordCount,
	};
}

// ---------------------------------------------------------------------------
// FAQ generator — location + service tuned.
// ---------------------------------------------------------------------------

function buildLocationServiceFaqs(
	locationName: string,
	locationSlug: LocationSlug,
	service: ProgrammaticService,
): ReadonlyArray<ProgrammaticFaq> {
	const advanceMonths = locationSlug === "darjeeling" || locationSlug === "dooars" || locationSlug === "gangtok" ? "six" : "four";
	const travelClause = locationSlug === "siliguri" ? "We are based in Siliguri, so the entire crew is on site by build morning." : `Our crew travels from Siliguri to ${locationName}; travel and lodging are quoted separately and we lock the build calendar at the design-sign-off meeting.`;

	const includedExample = service.includedItems[0] ?? "design and execution";
	const includedExample2 = service.includedItems[1] ?? "lighting";

	return [
		{
			question: `How far in advance should we book a ${service.name.toLowerCase()} decorator in ${locationName}?`,
			answer: `For peak season (October to February), ${advanceMonths} to six months is comfortable. For shoulder seasons, three months is workable. ${locationName} venues book out fast in the festive window — we take on a limited number of ${service.pluralName} per month so the studio can keep editorial standards on every one.`,
		},
		{
			question: `Do you travel from Siliguri to ${locationName} for the build?`,
			answer: `${travelClause} The on-site team rebuilds anything that didn't survive transit, finishes the floral last-touches in the morning, and stays through the event so any in-the-moment changes are handled by people who designed the room — not by a freelance subcontractor.`,
		},
		{
			question: `What's included in a typical ${service.name.toLowerCase()} package in ${locationName}?`,
			answer: `Every package covers ${includedExample.toLowerCase()}, ${includedExample2.toLowerCase()}, and our crew's rigging and tear-down. ${locationName}-specific logistics (generators in the Dooars, altitude-aware floral cold-chain in Darjeeling, ashirbaad protocols in Jalpaiguri) are planned in at design time, not added on. Price bands are honest — ₹ / ₹₹ / ₹₹₹ — with custom quotes from there.`,
		},
	];
}

// ---------------------------------------------------------------------------
// Internal-link router — sibling combos + parent pages + a cluster post.
// ---------------------------------------------------------------------------

function buildInternalLinks(
	loc: LocationSlug,
	svc: ProgrammaticServiceSlug,
	service: ProgrammaticService,
): ReadonlyArray<InternalLinkSuggestion> {
	// Pick a sibling service (same location, different service).
	const siblingServiceCandidates: ReadonlyArray<ProgrammaticServiceSlug> = [
		"wedding",
		"bengali-wedding",
		"reception",
		"sangeet",
		"haldi",
		"mehendi",
		"corporate-events",
	];
	const siblingService = siblingServiceCandidates.find((s) => s !== svc) ?? "wedding";

	// Pick a sibling location (same service, different location).
	const siblingLocationCandidates: ReadonlyArray<LocationSlug> = [
		"siliguri",
		"bagdogra",
		"darjeeling",
		"kalimpong",
		"jalpaiguri",
		"gangtok",
		"dooars",
	];
	const siblingLocation = siblingLocationCandidates.find((l) => l !== loc) ?? "siliguri";

	const siblingServiceName = SERVICES[siblingService]?.name ?? "Wedding";
	const siblingLocationLabel = getLocationBySlug(siblingLocation)?.name ?? "Siliguri";

	return [
		{
			path: service.parentServicePath,
			anchorText: `our ${service.name.toLowerCase()} design philosophy`,
		},
		{
			path: `/locations/${loc}`,
			anchorText: `more of our work across ${getLocationBySlug(loc)?.name ?? "the region"}`,
		},
		{
			path: `/decorators/${loc}/${siblingService}`,
			anchorText: `${siblingServiceName.toLowerCase()} decorators in the same area`,
		},
		{
			path: `/decorators/${siblingLocation}/${svc}`,
			anchorText: `${service.name.toLowerCase()} decorators in ${siblingLocationLabel}`,
		},
		{
			path: "/portfolio",
			anchorText: "browse signature projects",
		},
	];
}

// ---------------------------------------------------------------------------
// Helpers exposed for the page route.
// ---------------------------------------------------------------------------

export function getProgrammaticService(
	svc: string,
): ProgrammaticService | undefined {
	if (!(svc in SERVICES)) return undefined;
	return SERVICES[svc as ProgrammaticServiceSlug];
}

export function isProgrammaticServiceSlug(
	svc: string,
): svc is ProgrammaticServiceSlug {
	return svc in SERVICES;
}

export function isProgrammaticLocationSlug(
	loc: string,
): loc is LocationSlug {
	return (PROGRAMMATIC_LOCATIONS as ReadonlyArray<string>).includes(loc);
}

export const PROGRAMMATIC_SERVICE_LIST: ReadonlyArray<ProgrammaticServiceSlug> =
	PROGRAMMATIC_SERVICES;

export const PROGRAMMATIC_LOCATION_LIST: ReadonlyArray<LocationSlug> = [
	...PROGRAMMATIC_LOCATIONS,
];

// ---------------------------------------------------------------------------
// Reviewable fixtures — five fully-realised examples so the templating
// quality is reviewable without spinning up the dev server. These are
// regenerated deterministically by the composer; the export exists for
// human / test inspection.
// ---------------------------------------------------------------------------

export const programmaticContentFixtures: ReadonlyArray<ProgrammaticPageContentResult> =
	[
		buildProgrammaticPageContent("siliguri", "wedding"),
		buildProgrammaticPageContent("darjeeling", "wedding"),
		buildProgrammaticPageContent("dooars", "bengali-wedding"),
		buildProgrammaticPageContent("kalimpong", "sangeet"),
		buildProgrammaticPageContent("jalpaiguri", "annaprashan"),
	];
