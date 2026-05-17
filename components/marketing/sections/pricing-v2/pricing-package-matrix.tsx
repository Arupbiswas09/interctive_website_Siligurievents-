"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SplitImage } from "@/components/effects/3d-split-image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
	PACKAGES_BY_TIER,
	type Package,
	type TierKey,
} from "./pricing-tier-data";

type PricingPackageMatrixProps = {
	tier: TierKey;
};

/**
 * Bento-style matrix of packages for the selected tier. Cards transition
 * via Framer Motion AnimatePresence (key={tier}, mode="wait") so the grid
 * settles smoothly between tier switches.
 */
export function PricingPackageMatrix({
	tier,
}: PricingPackageMatrixProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();
	const packages = PACKAGES_BY_TIER[tier];

	return (
		<div
			role="tabpanel"
			id={`pricing-panel-${tier.length}`}
			aria-labelledby={`pricing-tab-${tier.length}`}
			className="relative"
		>
			<AnimatePresence mode="wait">
				<motion.ul
					key={tier}
					initial={
						prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
					}
					animate={{ opacity: 1, y: 0 }}
					exit={
						prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
					}
					transition={{
						duration: prefersReducedMotion ? 0.2 : 0.55,
						ease: [0.16, 1, 0.3, 1],
					}}
					className={cn(
						"grid gap-[var(--space-6)] md:gap-[var(--space-8)]",
						"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
					)}
				>
					{packages.map((pkg, index) => (
						<motion.li
							key={`${tier}-${pkg.ceremony}`}
							initial={
								prefersReducedMotion
									? { opacity: 0 }
									: { opacity: 0, y: 28 }
							}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: prefersReducedMotion ? 0.2 : 0.5,
								delay: prefersReducedMotion ? 0 : index * 0.08,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="list-none"
						>
							<PackageCard tier={tier} pkg={pkg} />
						</motion.li>
					))}
				</motion.ul>
			</AnimatePresence>
		</div>
	);
}

type PackageCardProps = {
	tier: TierKey;
	pkg: Package;
};

function PackageCard({ tier, pkg }: PackageCardProps): React.ReactElement {
	return (
		<article
			className={cn(
				"relative h-full overflow-hidden",
				"rounded-[var(--radius-md)]",
				"bg-[color:var(--color-bg-elevated)]",
				"border border-[color:var(--color-border)]/60",
				"p-[var(--space-6)]",
				"transition-shadow duration-500",
				"hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]",
			)}
		>
			<BrassCorner position="tl" />
			<BrassCorner position="tr" />
			<BrassCorner position="bl" />
			<BrassCorner position="br" />

			<SplitImage
				src={pkg.image}
				alt={`${pkg.ceremony} package — ${tier} tier`}
				panels={3}
				trigger="hover"
				width={1200}
				height={900}
				className="w-full"
			/>

			<h3
				className={cn(
					"mt-[var(--space-5)] font-display italic",
					"text-[length:var(--text-2xl)] leading-[1.1]",
					"text-balance text-[color:var(--color-ink)]",
				)}
			>
				{pkg.ceremony}
			</h3>

			<ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)]">
				{pkg.inclusions.map((line) => (
					<li
						key={line}
						className={cn(
							"relative pl-[var(--space-5)]",
							"font-body text-[length:var(--text-sm)] leading-relaxed",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						<span
							aria-hidden="true"
							className={cn(
								"absolute left-0 top-[0.55em] inline-block h-1.5 w-1.5",
								"rounded-full bg-[color:var(--color-gold)]",
							)}
						/>
						{line}
					</li>
				))}
			</ul>

			<p
				className={cn(
					"mt-[var(--space-5)] inline-flex items-center gap-2",
					"font-mono text-[length:var(--text-xs)] uppercase",
					"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
				)}
			>
				<span
					aria-hidden="true"
					className="inline-block h-px w-4 bg-[color:var(--color-gold)]"
				/>
				Delivered in {pkg.deliveryDays}{" "}
				{pkg.deliveryDays === 1 ? "day" : "days"}
			</p>

			<div
				className={cn(
					"mt-[var(--space-6)] pt-[var(--space-4)]",
					"flex items-center justify-between",
					"border-t border-[color:var(--color-gold)]/40",
				)}
			>
				<Link
					href="/contact"
					className={cn(
						"group/cta inline-flex items-center gap-2",
						"font-body text-[length:var(--text-sm)]",
						"text-[color:var(--color-ink)] underline-offset-4 hover:underline",
					)}
				>
					Customise this
					<span
						aria-hidden="true"
						className="transition-transform group-hover/cta:translate-x-1"
					>
						→
					</span>
				</Link>
				<span
					aria-hidden="true"
					className={cn(
						"font-display text-[length:var(--text-xl)]",
						"text-[color:var(--color-gold)]",
					)}
				>
					{tier}
				</span>
			</div>
		</article>
	);
}

function BrassCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "top-2 left-2 rotate-0",
		tr: "top-2 right-2 rotate-90",
		bl: "bottom-2 left-2 -rotate-90",
		br: "bottom-2 right-2 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-5 w-5",
				"text-[color:var(--color-gold)]",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 20 20"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
			>
				<path d="M0 6 L 0 0 L 6 0" />
				<path d="M2 8 Q 4 4 8 2" opacity="0.5" />
			</svg>
		</span>
	);
}
