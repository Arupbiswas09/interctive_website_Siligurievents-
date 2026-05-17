"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PricingTierSelector } from "./pricing-tier-selector";
import { PricingPackageMatrix } from "./pricing-package-matrix";
import type { TierKey } from "./pricing-tier-data";

/**
 * Wraps the sticky selector + the matrix so they share local state.
 */
export function PricingTierSection(): React.ReactElement {
	const [tier, setTier] = useState<TierKey>("₹₹");

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<PricingTierSelector active={tier} onChange={setTier} />
				<div className="mt-[var(--space-12)] md:mt-[var(--space-16)]">
					<PricingPackageMatrix tier={tier} />
				</div>
			</Container>
		</Section>
	);
}
