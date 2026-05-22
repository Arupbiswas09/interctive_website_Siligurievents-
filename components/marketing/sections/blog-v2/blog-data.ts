/**
 * Inline content for the Journal v2 index.
 * Placeholder shape until Payload posts collection is wired through.
 */

export type Post = {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	readTime: number;
	image: string;
	featured: boolean;
	date: string; // ISO yyyy-mm-dd
};

export const POSTS: ReadonlyArray<Post> = [
	{
		slug: "designing-haldi-morning",
		title: "How to design a haldi morning that photographs in daylight",
		excerpt:
			"The first ceremony is the easiest — and the hardest. Here's the playbook.",
		category: "Pre-wedding",
		readTime: 8,
		image:
			"/images/marketing/work-05.jpg",
		featured: true,
		date: "2025-09-12",
	},
	{
		slug: "marigold-not-rose",
		title: "Marigold, not rose: the case for a yellow wedding",
		excerpt:
			"Bengali weddings are red and gold. So why does the marigold keep winning? Three reasons.",
		category: "Florals",
		readTime: 5,
		image:
			"/images/marketing/work-02.jpg",
		featured: false,
		date: "2025-08-22",
	},
	{
		slug: "destination-dooars",
		title: "A destination wedding in the Dooars: what to expect",
		excerpt:
			"Tea, rain, monkeys, and the most photogenic light in eastern India.",
		category: "Destination",
		readTime: 7,
		image:
			"/images/hero-01.webp",
		featured: false,
		date: "2025-07-30",
	},
	{
		slug: "lighting-the-mandap",
		title: "Lighting the mandap: a one-spot rule that always works",
		excerpt: "Twelve sub-rules collapse to one principle. Here it is.",
		category: "Lighting",
		readTime: 6,
		image:
			"/images/marketing/work-02.jpg",
		featured: false,
		date: "2025-07-04",
	},
	{
		slug: "the-budget-talk",
		title:
			"How families actually budget for a wedding (and where they overspend)",
		excerpt: "Real numbers from twelve recent weddings.",
		category: "Planning",
		readTime: 9,
		image:
			"/images/hero-02.webp",
		featured: false,
		date: "2025-06-18",
	},
	{
		slug: "the-room-remembers",
		title: "The room remembers: leaving one thing behind",
		excerpt: "A small tradition we've kept since the studio's first event.",
		category: "Studio notes",
		readTime: 4,
		image:
			"/images/marketing/work-05.jpg",
		featured: false,
		date: "2025-05-30",
	},
];

export const CATEGORIES: ReadonlyArray<string> = [
	"All",
	"Pre-wedding",
	"Florals",
	"Lighting",
	"Planning",
	"Destination",
	"Studio notes",
];

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

export function formatPostDate(iso: string): string {
	const date = new Date(`${iso}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return iso;
	return DATE_FORMAT.format(date);
}
