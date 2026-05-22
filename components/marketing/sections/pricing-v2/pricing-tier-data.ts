/**
 * Inline content for the pricing matrix.
 *
 * Per CLAUDE.md hard rule #5: realistic placeholder data; final copy must
 * eventually move into Payload. Bands stay as glyphs (₹/₹₹/…) — no numbers
 * leak into JSON-LD pricing.
 */

export type TierKey = "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹";

export type Tier = {
	key: TierKey;
	label: string;
	guests: string;
	budget: string;
};

export type Package = {
	ceremony: string;
	image: string;
	inclusions: ReadonlyArray<string>;
	deliveryDays: number;
};

export const TIERS: ReadonlyArray<Tier> = [
	{ key: "₹", label: "Intimate", guests: "40–80 guests", budget: "₹1.5–3 L" },
	{ key: "₹₹", label: "Family", guests: "80–200 guests", budget: "₹3–8 L" },
	{
		key: "₹₹₹",
		label: "Editorial",
		guests: "200–400 guests",
		budget: "₹8–18 L",
	},
	{
		key: "₹₹₹₹",
		label: "Cinematic",
		guests: "400+ guests",
		budget: "₹18–60 L",
	},
];

export const PACKAGES_BY_TIER: Record<TierKey, ReadonlyArray<Package>> = {
	"₹": [
		{
			ceremony: "Haldi / Gaye Holud",
			image:
				"/images/marketing/work-03.jpg",
			inclusions: [
				"Marigold canopy + chowki",
				"Brass thali stands × 4",
				"Daylight-optimised setup",
			],
			deliveryDays: 1,
		},
		{
			ceremony: "Mehendi",
			image:
				"/images/work/work-01.webp",
			inclusions: [
				"Low-seating gallery",
				"Brass cone bowls",
				"Single tabla cue",
			],
			deliveryDays: 1,
		},
		{
			ceremony: "Engagement",
			image:
				"/images/work/work-05.webp",
			inclusions: [
				"Champagne bar",
				"Step-and-repeat backdrop",
				"String quartet",
			],
			deliveryDays: 1,
		},
	],
	"₹₹": [
		{
			ceremony: "Haldi / Gaye Holud",
			image:
				"/images/marketing/work-05.jpg",
			inclusions: [
				"Marigold + jasmine double canopy",
				"Brass thali stands × 8",
				"Family chowki + cushion gallery",
				"Live dhol + 2 dhaaki",
				"Daylight + reflector setup",
			],
			deliveryDays: 2,
		},
		{
			ceremony: "Mehendi",
			image:
				"/images/marketing/work-05.jpg",
			inclusions: [
				"Low-seat majlis with 60 cushions",
				"Brass cone bowls × 30",
				"Tabla + sarangi duet",
				"Paisley shadow projection",
				"Two henna artists",
			],
			deliveryDays: 2,
		},
		{
			ceremony: "Engagement",
			image:
				"/images/marketing/work-05.jpg",
			inclusions: [
				"Champagne tower + mocktail bar",
				"Step-and-repeat with brass etching",
				"String quartet",
				"Sit-down dinner styling for 200",
				"Welcome mandap arch",
			],
			deliveryDays: 2,
		},
	],
	"₹₹₹": [
		{
			ceremony: "Sangeet",
			image:
				"/media/decor-pairs/mandap-01-day.avif",
			inclusions: [
				"Editorial stage with three-act lighting",
				"Choreographer-paced reveal moments",
				"60-foot floral runner",
				"Custom monogram gobo wash",
				"Live band + sound engineer",
				"Two-camera projection mapping",
			],
			deliveryDays: 3,
		},
		{
			ceremony: "Bengali Bibaho",
			image:
				"/images/work/work-01.webp",
			inclusions: [
				"Topor-and-mukut mandap with brass spires",
				"Shankha-and-conch sound design",
				"Dhaaki troupe of six",
				"Heirloom-textile aisle",
				"Two ulu-dhwani choirs",
				"Backstage bridal lounge",
			],
			deliveryDays: 3,
		},
		{
			ceremony: "Reception",
			image:
				"/images/work/work-01.webp",
			inclusions: [
				"Editorial round-table styling for 400",
				"Crystal chandelier overhead grid",
				"Live jazz quintet",
				"Two-zone bar with curated cocktails",
				"Sit-down service in five courses",
				"Brass-foil monogram step-and-repeat",
			],
			deliveryDays: 3,
		},
	],
	"₹₹₹₹": [
		{
			ceremony: "Destination Wedding",
			image:
				"/images/work/work-05.webp",
			inclusions: [
				"Three-day cinematic décor arc",
				"Sangeet, Bibaho and Reception zones",
				"On-site florist team of twelve",
				"Imported orchid + protea installations",
				"Choreographed lighting score, four acts",
				"Hospitality concierge for 400 guests",
				"Travel + accommodation for crew of 22",
			],
			deliveryDays: 4,
		},
		{
			ceremony: "Cinematic Reception",
			image:
				"/images/work/work-01.webp",
			inclusions: [
				"Custom-built mandap pavilion",
				"Twelve-piece live orchestra",
				"Aerial drone-cam choreography",
				"Edible-gold five-course tasting menu",
				"Bespoke fragrance signature",
				"Heirloom-textile commission",
				"Personalised guest gifting suite",
			],
			deliveryDays: 4,
		},
		{
			ceremony: "Multi-Day Showpiece",
			image:
				"/images/work/work-05.webp",
			inclusions: [
				"Four ceremonies, one creative direction",
				"Dedicated art director + production lead",
				"Branded guest stationery + welcome boxes",
				"Hand-built thematic installations",
				"24-hour on-site crew rotation",
				"Press-ready post-event film edit",
				"Heritage-grade restoration vendors",
			],
			deliveryDays: 4,
		},
	],
};
