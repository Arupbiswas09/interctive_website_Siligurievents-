import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * Pricing v2 — Hero.
 * Editorial intro card with word-by-word reveal heading.
 */
export function PricingHero(): React.ReactElement {
	return (
		<Section
			tone="default"
			spacing="xl"
			className="relative overflow-hidden pt-[var(--space-32)] md:pt-[var(--space-48)]"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
			>
				<div
					className="absolute inset-0 opacity-[0.45]"
					style={{
						background:
							"radial-gradient(ellipse at 15% 10%, rgba(184,137,58,0.30) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(139,26,26,0.22) 0%, transparent 55%)",
					}}
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(180deg, transparent 0%, var(--color-bg) 92%)",
					}}
				/>
			</div>

			<Container>
				<div
					className="flex flex-col gap-[var(--space-8)]"
					style={{ minHeight: "60svh" }}
				>
					<RevealOnScroll>
						<Eyebrow tone="gold">Pricing · Built for Indian families</Eyebrow>
					</RevealOnScroll>

					<DisplayHeading
						as="h1"
						split
						splitMode="words"
						text="From an intimate haldi to a 400-guest cinematic reception."
						className="max-w-[22ch] font-light italic"
					/>

					<RevealOnScroll delay={0.2}>
						<p className="max-w-[62ch] text-[length:var(--text-lg)] leading-relaxed text-[color:var(--color-ink-muted)]">
							Every package below is a starting point. Bring us your date and
							we'll bend it to fit.
						</p>
					</RevealOnScroll>
				</div>
			</Container>
		</Section>
	);
}
