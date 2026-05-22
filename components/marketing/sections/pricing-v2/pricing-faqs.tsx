"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { PRICING_FAQS, type Faq } from "./pricing-faqs.data";

/**
 * Accordion FAQ block — one row open at a time. Framer Motion handles the
 * height animation so we don't fight the browser on min-height transitions.
 */
export function PricingFaqs(): React.ReactElement {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggle = (index: number): void => {
		setOpenIndex((current) => (current === index ? null : index));
	};

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<header className="max-w-[640px]">
					<Eyebrow tone="gold">Frequently asked</Eyebrow>
					<DisplayHeading
						as="h2"
						size="xl"
						className="mt-[var(--space-5)] font-light italic"
					>
						Money questions, answered.
					</DisplayHeading>
				</header>

				<ul
					className={cn(
						"mt-[var(--space-12)] flex flex-col",
						"border-t border-[color:var(--color-border)]",
					)}
				>
					{PRICING_FAQS.map((faq, index) => (
						<FaqRow
							key={faq.question}
							faq={faq}
							isOpen={openIndex === index}
							onToggle={() => toggle(index)}
						/>
					))}
				</ul>
			</Container>
		</Section>
	);
}

type FaqRowProps = {
	faq: Faq;
	isOpen: boolean;
	onToggle: () => void;
};

function FaqRow({ faq, isOpen, onToggle }: FaqRowProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();

	return (
		<li className="border-b border-[color:var(--color-border)]">
			<button
				type="button"
				aria-expanded={isOpen}
				onClick={onToggle}
				className={cn(
					"group flex w-full items-start justify-between gap-[var(--space-6)]",
					"py-[var(--space-6)] text-left",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-bg)]",
					"cursor-pointer",
				)}
			>
				<span
					className={cn(
						"font-display text-[length:var(--text-xl)] leading-snug",
						"text-balance text-[color:var(--color-ink)]",
						"transition-colors",
						"group-hover:text-[color:var(--color-accent)]",
					)}
				>
					{faq.question}
				</span>
				<span
					aria-hidden="true"
					className={cn(
						"mt-2 inline-flex h-6 w-6 shrink-0 items-center justify-center",
						"rounded-full border border-[color:var(--color-gold)]/60",
						"font-mono text-[length:var(--text-sm)] text-[color:var(--color-gold)]",
						"transition-transform duration-500",
						isOpen && "rotate-45",
					)}
				>
					+
				</span>
			</button>

			<AnimatePresence initial={false}>
				{isOpen ? (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{
							duration: prefersReducedMotion ? 0.15 : 0.45,
							ease: [0.16, 1, 0.3, 1],
						}}
						className="overflow-hidden"
					>
						<p
							className={cn(
								"pb-[var(--space-7)] pr-[var(--space-12)]",
								"max-w-[68ch] font-body text-[length:var(--text-base)] leading-relaxed",
								"text-[color:var(--color-ink-muted)]",
							)}
						>
							{faq.answer}
						</p>
					</motion.div>
				) : null}
			</AnimatePresence>
		</li>
	);
}
