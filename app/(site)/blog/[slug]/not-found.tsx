import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/**
 * /blog/[slug] — branded 404 for a missing post.
 *
 * Per docs/05-PAGE-SPECS.md §5.12 — 404s feel like part of the brand. This
 * is scoped to the blog segment so the surrounding chrome still applies.
 */
export default function BlogPostNotFound(): React.ReactElement {
	return (
		<Section tone="default" spacing="xl">
			<Container size="narrow">
				<div className="text-center">
					<Eyebrow tone="accent">Journal · 404</Eyebrow>
					<h1
						className={cn(
							"mt-[var(--space-6)] font-display tracking-[var(--tracking-display)]",
							"text-[length:var(--text-5xl)] leading-[1.02]",
							"text-balance text-[color:var(--color-ink)]",
						)}
					>
						<em className="italic">This entry</em> seems to have eloped.
					</h1>
					<p
						className={cn(
							"mx-auto mt-[var(--space-6)] max-w-[520px]",
							"font-body text-[length:var(--text-lg)] leading-[1.6]",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						TODO: 404 body — the post you're looking for isn't here. Try the
						journal index, or talk to a planner if you came from a link we
						sent.
					</p>
					<div
						className={cn(
							"mt-[var(--space-10)] flex flex-wrap items-center justify-center",
							"gap-[var(--space-4)]",
						)}
					>
						<Link
							href="/blog"
							className={cn(
								"inline-flex h-12 items-center px-[var(--space-6)]",
								"rounded-[var(--radius-sm)] bg-[color:var(--color-accent)]",
								"font-medium text-[length:var(--text-base)] tracking-[var(--tracking-tight)]",
								"text-[color:var(--color-bg)]",
								"transition-colors hover:bg-[color:var(--color-accent-deep)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
							)}
						>
							Back to the journal
						</Link>
						<Link
							href="/portfolio"
							className={cn(
								"inline-flex h-12 items-center px-[var(--space-6)]",
								"rounded-[var(--radius-sm)] border border-[color:var(--color-border)]",
								"font-medium text-[length:var(--text-base)] tracking-[var(--tracking-tight)]",
								"text-[color:var(--color-ink)]",
								"transition-colors hover:border-[color:var(--color-ink)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
							)}
						>
							See our work
						</Link>
					</div>
				</div>
			</Container>
		</Section>
	);
}
