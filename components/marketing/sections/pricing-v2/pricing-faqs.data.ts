/**
 * Shared FAQ data for the pricing page.
 *
 * Lives in its own non-client module so server components (page.tsx) can
 * import it for JSON-LD without crossing the "use client" boundary.
 */

export type Faq = {
	question: string;
	answer: string;
};

export const PRICING_FAQS: ReadonlyArray<Faq> = [
	{
		question: "Why is there no fixed price?",
		answer:
			"Because every guest count, venue, season and family changes the cost in ways a sticker price can't capture. The bands above are real, but the only honest number is the one we send after we've spoken with you.",
	},
	{
		question: "Do you do destination weddings?",
		answer:
			"Yes. Roughly a third of our calendar is in the Dooars, Sikkim, Bhutan and Northeast hill stations. We handle the décor, vendor logistics and on-site crew — you handle the venue.",
	},
	{
		question: "How many revisions are included?",
		answer:
			"Three rounds of moodboard revisions are built into every package. Beyond that, we keep iterating until you're settled — we'd rather take another week than ship a setup you'll regret in photographs.",
	},
	{
		question: "What about damages or breakage?",
		answer:
			"Inventory damage at the venue is on our insurance. We carry a 1 percent breakage buffer in every quote so a chipped vase or a stained linen never becomes an awkward conversation on the day.",
	},
	{
		question: "Can we use our own florist?",
		answer:
			"Of course. We've co-produced events with family florists for years. We'll handle the styling and structural pieces; your florist handles the flower work. We just need a joint sit-down a week before.",
	},
	{
		question: "What's the deposit structure?",
		answer:
			"25 percent at booking, 50 percent four weeks before the event, balance on the morning of the first ceremony. We accept bank transfer, UPI and cheque — no credit-card surcharge.",
	},
];
