"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type BlogCategoryChipsProps = {
	categories: ReadonlyArray<string>;
	active: string;
	onChange: (category: string) => void;
};

/**
 * Sticky chip filter rail with staggered entrance.
 */
export function BlogCategoryChips({
	categories,
	active,
	onChange,
}: BlogCategoryChipsProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();

	return (
		<div
			role="tablist"
			aria-label="Filter posts by category"
			className={cn(
				"sticky top-24 z-30 mx-auto",
				"-mx-[var(--gutter)] px-[var(--gutter)] py-[var(--space-4)]",
				"backdrop-blur-md",
				"bg-[color:var(--color-bg)]/80",
				"border-y border-[color:var(--color-border)]/60",
			)}
		>
			<motion.ul
				initial="hidden"
				animate="visible"
				variants={{
					hidden: {},
					visible: {
						transition: {
							staggerChildren: prefersReducedMotion ? 0 : 0.05,
						},
					},
				}}
				className={cn(
					"flex flex-wrap items-center justify-center",
					"gap-[var(--space-2)] md:gap-[var(--space-3)]",
				)}
			>
				{categories.map((category) => {
					const isActive = category === active;
					return (
						<motion.li
							key={category}
							variants={{
								hidden: prefersReducedMotion
									? { opacity: 0 }
									: { opacity: 0, y: 12 },
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: prefersReducedMotion ? 0.2 : 0.45,
										ease: [0.16, 1, 0.3, 1],
									},
								},
							}}
							className="list-none"
						>
							<button
								type="button"
								role="tab"
								aria-selected={isActive}
								onClick={() => onChange(category)}
								className={cn(
									"inline-flex items-center",
									"px-[var(--space-4)] py-[var(--space-2)]",
									"rounded-full border",
									"font-body text-[length:var(--text-sm)] tracking-tight",
									"transition-all duration-300 ease-out",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
									"cursor-pointer",
									isActive
										? cn(
												"bg-[color:var(--color-gold)] text-[color:var(--color-ink)]",
												"border-[color:var(--color-gold)]",
											)
										: cn(
												"bg-transparent text-[color:var(--color-ink)]",
												"border-[color:var(--color-ink)]/25",
												"hover:border-[color:var(--color-ink)]/55",
												"hover:bg-[color:var(--color-bg-elevated)]",
											),
								)}
							>
								{category}
							</button>
						</motion.li>
					);
				})}
			</motion.ul>
		</div>
	);
}
