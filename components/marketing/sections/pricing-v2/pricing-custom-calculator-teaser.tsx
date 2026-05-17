import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { cn } from "@/lib/utils";

/**
 * Editorial card teaser pointing to /contact for a bespoke quote.
 * Large mandap ornament floats at low opacity on the right.
 */
export function PricingCustomCalculatorTeaser(): React.ReactElement {
	return (
		<Section tone="default" spacing="lg">
			<Container>
				<article
					className={cn(
						"relative overflow-hidden",
						"rounded-[var(--radius-lg)]",
						"bg-[color:var(--color-bg-soft)]",
						"border border-[color:var(--color-gold)]/30",
						"px-[var(--space-8)] py-[var(--space-16)] md:px-[var(--space-16)]",
					)}
				>
					<BrassCorner position="tl" />
					<BrassCorner position="tr" />
					<BrassCorner position="bl" />
					<BrassCorner position="br" />

					<div
						aria-hidden="true"
						className={cn(
							"pointer-events-none absolute -right-12 -top-12",
							"hidden md:block",
							"h-[420px] w-[420px] opacity-[0.08]",
						)}
					>
						<CeremonyOrnament
							name="mandap"
							className="h-full w-full"
							hue="var(--color-gold)"
						/>
					</div>

					<div className="relative max-w-[40rem]">
						<RevealOnScroll>
							<Eyebrow tone="gold">Bespoke quotes</Eyebrow>
						</RevealOnScroll>

						<DisplayHeading
							as="h2"
							size="xl"
							split
							splitMode="words"
							text="Your event isn't on the matrix? Let's design it."
							className="mt-[var(--space-6)] max-w-[18ch] font-light italic"
						/>

						<RevealOnScroll delay={0.15}>
							<p className="mt-[var(--space-6)] max-w-[58ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
								We design 40+ bespoke events a year. Send us a date and a guest
								count — we'll come back with three options.
							</p>
						</RevealOnScroll>

						<RevealOnScroll delay={0.3}>
							<div className="mt-[var(--space-8)]">
								<Link
									href="/contact"
									className={cn(
										"group inline-flex items-center gap-3",
										"font-display italic text-[length:var(--text-xl)]",
										"text-[color:var(--color-ink)]",
										"after:absolute after:inset-0 after:content-['']",
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
									)}
								>
									<span className="relative">
										Open the brief form
										<span
											aria-hidden="true"
											className={cn(
												"absolute -bottom-0.5 left-0 h-px w-full",
												"origin-left scale-x-100",
												"bg-[color:var(--color-gold)]",
												"transition-transform duration-500",
												"group-hover:scale-x-[1.04]",
											)}
										/>
									</span>
									<span
										aria-hidden="true"
										className="transition-transform group-hover:translate-x-1"
									>
										→
									</span>
								</Link>
							</div>
						</RevealOnScroll>
					</div>
				</article>
			</Container>
		</Section>
	);
}

function BrassCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "top-3 left-3 rotate-0",
		tr: "top-3 right-3 rotate-90",
		bl: "bottom-3 left-3 -rotate-90",
		br: "bottom-3 right-3 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-7 w-7",
				"text-[color:var(--color-gold)]",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 28 28"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			>
				<path d="M0 10 L 0 0 L 10 0" />
				<path d="M3 13 Q 6 6 13 3" opacity="0.55" />
				<circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.7" />
			</svg>
		</span>
	);
}
