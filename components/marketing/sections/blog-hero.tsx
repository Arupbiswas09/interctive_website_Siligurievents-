import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { VariableFontWeightShell } from "./variable-font-weight-shell";

type BlogHeroProps = {
	readonly eyebrow?: string;
	readonly title: string;
	readonly subtitle?: string;
};

/**
 * BlogHero — editorial half-viewport hero for the Journal index + category
 * pages. Per docs/05-PAGE-SPECS.md §5.8.
 *
 * Motion: SIG-05 "Bhaar" — the H1 tracks scroll velocity via a variable
 * `wght` axis (graceful when font isn't variable). Reduced-motion locks
 * weight to the 500 midpoint inside the factory.
 */
export function BlogHero({
	eyebrow = "Journal",
	title,
	subtitle,
}: BlogHeroProps): React.ReactElement {
	return (
		<Section
			tone="default"
			spacing="lg"
			className="border-b border-[color:var(--color-border)]"
		>
			<Container>
				<div className="max-w-[860px]">
					<Eyebrow tone="accent">{eyebrow}</Eyebrow>
					<VariableFontWeightShell min={300} max={700} headingSelector="h1">
						<DisplayHeading
							as="h1"
							size="hero"
							className="mt-[var(--space-6)]"
						>
							{title}
						</DisplayHeading>
					</VariableFontWeightShell>
					{subtitle ? (
						<p className="mt-[var(--space-6)] max-w-[640px] font-body text-[length:var(--text-lg)] leading-[1.6] text-[color:var(--color-ink-muted)]">
							{subtitle}
						</p>
					) : null}
				</div>
			</Container>
		</Section>
	);
}
