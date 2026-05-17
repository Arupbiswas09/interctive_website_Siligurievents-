"use client";

import { cn } from "@/lib/utils";
import { TIERS, type TierKey } from "./pricing-tier-data";

type PricingTierSelectorProps = {
	active: TierKey;
	onChange: (tier: TierKey) => void;
};

/**
 * Sticky chip rail for selecting a price tier. Each chip is multi-line:
 * the glyph band, the label, and guests + budget on a fine print row.
 */
export function PricingTierSelector({
	active,
	onChange,
}: PricingTierSelectorProps): React.ReactElement {
	return (
		<div
			role="tablist"
			aria-label="Select a pricing tier"
			className={cn(
				"sticky top-24 z-30 mx-auto",
				"-mx-[var(--gutter)] px-[var(--gutter)] py-[var(--space-4)]",
				"backdrop-blur-md",
				"bg-[color:var(--color-bg)]/80",
				"border-y border-[color:var(--color-border)]/60",
			)}
		>
			<div
				className={cn(
					"flex flex-wrap items-stretch justify-center",
					"gap-[var(--space-3)] md:gap-[var(--space-4)]",
				)}
			>
				{TIERS.map((tier) => {
					const isActive = tier.key === active;
					return (
						<button
							key={tier.key}
							type="button"
							role="tab"
							aria-selected={isActive}
							aria-controls={`pricing-panel-${tier.key.length}`}
							id={`pricing-tab-${tier.key.length}`}
							onClick={() => onChange(tier.key)}
							className={cn(
								"group relative flex min-w-[140px] flex-col items-start gap-1",
								"px-[var(--space-4)] py-[var(--space-3)] md:px-[var(--space-5)]",
								"rounded-[var(--radius-md)]",
								"text-left transition-all duration-300 ease-out",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
								"cursor-pointer",
								isActive
									? cn(
											"bg-[color:var(--color-gold)] text-[color:var(--color-ink)]",
											"shadow-[0_8px_24px_-12px_rgba(184,137,58,0.45)]",
										)
									: cn(
											"bg-transparent text-[color:var(--color-ink)]",
											"border border-[color:var(--color-ink)]/25",
											"hover:border-[color:var(--color-ink)]/50",
										),
							)}
						>
							<span
								className={cn(
									"font-display text-[length:var(--text-xl)] leading-none",
									isActive
										? "text-[color:var(--color-ink)]"
										: "text-[color:var(--color-gold)]",
								)}
								aria-hidden="true"
							>
								{tier.key}
							</span>
							<span
								className={cn(
									"font-display italic text-[length:var(--text-base)] leading-tight",
								)}
							>
								{tier.label}
							</span>
							<span
								className={cn(
									"font-mono text-[length:var(--text-xs)] tracking-tight",
									isActive
										? "text-[color:var(--color-ink)]/80"
										: "text-[color:var(--color-ink-muted)]",
								)}
							>
								{tier.guests}
							</span>
							<span
								className={cn(
									"font-mono text-[length:var(--text-xs)] tracking-tight",
									isActive
										? "text-[color:var(--color-ink)]/80"
										: "text-[color:var(--color-ink-soft)]",
								)}
							>
								{tier.budget}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
