"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = {
	readonly id: string;
	readonly label: string;
	/** 2 for H2, 3 for H3 — kept open for richer nesting later. */
	readonly level: 2 | 3;
};

type PostTocProps = {
	readonly items: ReadonlyArray<TocItem>;
};

/**
 * PostToc — sticky table-of-contents sidebar.
 * Per docs/05-PAGE-SPECS.md §5.9 — auto-generated from H2s (and H3s).
 *
 * Uses IntersectionObserver to track which heading is currently in view.
 * Server-rendered TOC list is the source of truth; the active highlight
 * is the only client concern.
 *
 * Render hidden by default; the parent container should reveal it on
 * `lg:` breakpoints (desktop) — kept here as a structural sidebar so it can
 * be slotted into any layout grid.
 */
export function PostToc({ items }: PostTocProps): React.ReactElement {
	const [activeId, setActiveId] = useState<string | null>(
		items[0]?.id ?? null,
	);

	useEffect(() => {
		if (items.length === 0) return;

		const targets = items
			.map((i) => document.getElementById(i.id))
			.filter((el): el is HTMLElement => el !== null);

		if (targets.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) =>
							(a.target as HTMLElement).offsetTop -
							(b.target as HTMLElement).offsetTop,
					);
				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{
				// Highlight a heading once it crosses the top third of the viewport.
				rootMargin: "-20% 0px -70% 0px",
				threshold: [0, 1],
			},
		);

		targets.forEach((t) => observer.observe(t));

		return (): void => observer.disconnect();
	}, [items]);

	if (items.length === 0) return <></>;

	return (
		<nav aria-label="Table of contents" className="text-[color:var(--color-ink-muted)]">
			<p
				className={cn(
					"mb-[var(--space-4)] font-body uppercase",
					"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
					"text-[color:var(--color-ink-soft)]",
				)}
			>
				On this page
			</p>
			<ol className="space-y-[var(--space-2)] border-l border-[color:var(--color-border)]">
				{items.map((item) => {
					const isActive = item.id === activeId;
					return (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								aria-current={isActive ? "location" : undefined}
								className={cn(
									"block py-[var(--space-1)]",
									"-ml-px border-l-2",
									"transition-[color,border-color] duration-200",
									"font-body text-[length:var(--text-sm)] leading-[1.5]",
									item.level === 3 ? "pl-[var(--space-8)]" : "pl-[var(--space-4)]",
									isActive
										? "border-[color:var(--color-accent)] text-[color:var(--color-ink)]"
										: cn(
												"border-transparent text-[color:var(--color-ink-muted)]",
												"hover:text-[color:var(--color-ink)]",
											),
								)}
							>
								{item.label}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

/**
 * extractTocFromBody — naive MDX/markdown H2 + H3 extractor for the stub.
 * Returns headings with auto-generated slugs. Replace with the proper Lexical
 * walker in Sprint 2 once Payload-rendered bodies arrive.
 */
export function extractTocFromBody(body: string): ReadonlyArray<TocItem> {
	const items: TocItem[] = [];
	const lines = body.split("\n");
	for (const rawLine of lines) {
		const h2Match = rawLine.match(/^##\s+(.+)$/);
		const h3Match = rawLine.match(/^###\s+(.+)$/);
		if (h2Match?.[1]) {
			const label = h2Match[1].trim();
			items.push({ id: slugify(label), label, level: 2 });
		} else if (h3Match?.[1]) {
			const label = h3Match[1].trim();
			items.push({ id: slugify(label), label, level: 3 });
		}
	}
	return items;
}

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}
