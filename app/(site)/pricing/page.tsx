import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingHero } from "@/components/marketing/sections/pricing-v2/pricing-hero";
import { PricingTierSection } from "@/components/marketing/sections/pricing-v2/pricing-tier-section";
import { PricingCustomCalculatorTeaser } from "@/components/marketing/sections/pricing-v2/pricing-custom-calculator-teaser";
import { PricingFaqs } from "@/components/marketing/sections/pricing-v2/pricing-faqs";
import { PRICING_FAQS } from "@/components/marketing/sections/pricing-v2/pricing-faqs.data";
import { PricingCtaCloser } from "@/components/marketing/sections/pricing-v2/pricing-cta-closer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
	buildBreadcrumb,
	buildFAQ,
	buildOfferCatalog,
	jsonLdScript,
	type PackageInput,
} from "@/lib/seo/schemas";
import {
	PACKAGE_CATEGORIES,
	getPackages,
} from "@/lib/cms/packages";

export async function generateMetadata(): Promise<Metadata> {
	return buildPageMetadata({
		title: "Pricing — honest bands, custom quotes",
		description:
			"Three tiers per event category at Siligurievent: Essence (₹), Signature (₹₹), Atelier (₹₹₹). Honest bands — your final quote is custom.",
		path: "/pricing",
		locale: "en",
		keywords: [
			"event decoration pricing Siliguri",
			"wedding decorator cost North Bengal",
			"Siligurievent packages",
			"wedding decor budget Siliguri",
		],
	});
}

export default async function PricingPage(): Promise<React.ReactElement> {
	const allPackages = await getPackages();

	// JSON-LD: OfferCatalog with priceRange (band string) — never numbers.
	// Per docs/DECISIONS.md D-002.
	const offerInput: PackageInput[] = allPackages.map((p) => {
		const categoryLabel =
			PACKAGE_CATEGORIES.find((c) => c.slug === p.category)?.label ??
			p.category;
		return {
			name: `${p.name} — ${categoryLabel}`,
			description: `${p.tagline} ${p.bandNote}`,
			priceBand: p.priceBand,
			priceNote: p.priceBand,
			includes: p.includes,
		};
	});
	const offerCatalogBase = buildOfferCatalog(offerInput);
	const offerCatalog: Record<string, unknown> = {
		...(offerCatalogBase as unknown as Record<string, unknown>),
		priceRange: "₹ – ₹₹₹₹",
	};

	const breadcrumb = buildBreadcrumb([
		{ name: "Home", path: "/" },
		{ name: "Pricing", path: "/pricing" },
	]);
	const faqSchema = buildFAQ(
		PRICING_FAQS.map((f) => ({ question: f.question, answer: f.answer })),
	);

	return (
		<>
			{jsonLdScript(offerCatalog)}
			{jsonLdScript(faqSchema)}
			{jsonLdScript(breadcrumb)}

			<Suspense fallback={null}>
				<PricingHero />
				<PricingTierSection />
				<PricingCustomCalculatorTeaser />
				<PricingFaqs />
				<PricingCtaCloser />
			</Suspense>
		</>
	);
}
