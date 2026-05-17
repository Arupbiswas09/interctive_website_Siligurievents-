import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

/**
 * CTA closer for the Pricing page. Inverse palette, large italic headline.
 */
export function PricingCtaCloser(): React.ReactElement {
	return (
		<Section tone="dark" spacing="xl">
			<Container>
				<div className="flex max-w-[1080px] flex-col gap-[var(--space-8)]">
					<RevealOnScroll>
						<Eyebrow tone="gold">Ready when you are</Eyebrow>
					</RevealOnScroll>

					<DisplayHeading
						as="h2"
						size="hero"
						split
						splitMode="words"
						text="Plan your event, then your moodboard."
						className="max-w-[20ch] font-light italic text-[#F5EDE0]"
					/>

					<RevealOnScroll delay={0.15}>
						<p className="max-w-[60ch] text-[length:var(--text-lg)] leading-relaxed text-[#b8a992]">
							Send us the date, the city and the guest count. We come back
							within twenty-four hours with three directions — pick one and
							we'll start shaping it.
						</p>
					</RevealOnScroll>

					<RevealOnScroll delay={0.3}>
						<div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-4)]">
							<MagneticButton>
								<Link
									href="/contact"
									className={buttonVariants({
										variant: "primary",
										size: "lg",
									})}
								>
									Start the brief
									<span aria-hidden="true">→</span>
								</Link>
							</MagneticButton>
							<Link
								href="/portfolio"
								className={buttonVariants({ variant: "ghost", size: "lg" })}
							>
								See past work
							</Link>
						</div>
					</RevealOnScroll>
				</div>
			</Container>
		</Section>
	);
}
