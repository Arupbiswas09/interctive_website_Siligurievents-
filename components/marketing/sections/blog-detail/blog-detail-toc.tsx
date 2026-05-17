"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = {
	readonly id: string;
	readonly label: string;
};

type BlogDetailTocProps = {
	items: ReadonlyArray<TocItem>;
};

/**
 * Sticky desktop TOC. Collapses to a top sheet on mobile.
 * Highlights the section currently in view via IntersectionObserver.
 */
export function BlogDetailToc({
	items,
}: BlogDetailTocProps): React.ReactElement | null {
	const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		if (items.length === 0) return;
		if (typeof window === "undefined") return;

		const observed: HTMLElement[] = [];
		items.forEach((item) => {
			const el = document.getElementById(item.id);
			if (el) observed.push(el);
		});
		if (observed.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort(
						(a, b) =>
							(a.target as HTMLElement).offsetTop -
							(b.target as HTMLElement).offsetTop,
					);
				if (visible.length > 0 && visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{
				rootMargin: "-30% 0px -55% 0px",
				threshold: [0, 1],
			},
		);

		observed.forEach((el) => observer.observe(el));
		return (): void => {
			observer.disconnect();
		};
	}, [items]);

	if (items.length === 0) return null;

	const handleClick = (
		event: React.MouseEvent<HTMLAnchorElement>,
		id: string,
	): void => {
		const el = document.getElementById(id);
		if (!el) return;
		event.preventDefault();
		setOpen(false);
		const top = el.getBoundingClientRect().top + window.scrollY - 96;
		window.scrollTo({ top, behavior: "smooth" });
		history.replaceState(null, "", `#${id}`);
	};

	const activeLabel =
		items.find((item) => item.id === activeId)?.label ?? items[0]?.label ?? "";

	return (
		<>
			{/* Mobile — top-sheet trigger */}
			<div className="lg:hidden">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					aria-expanded={open}
					aria-controls="blog-detail-toc-sheet"
					className={cn(
						"flex w-full items-center justify-between gap-3",
						"rounded-[var(--radius-sm)] border border-[color:var(--color-border)]",
						"bg-[color:var(--color-bg-elevated)]",
						"px-[var(--space-4)] py-[var(--space-3)]",
						"text-left",
					)}
				>
					<span
						className={cn(
							"font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
						)}
					>
						In this essay
					</span>
					<span
						className={cn(
							"truncate font-body text-[length:var(--text-sm)]",
							"text-[color:var(--color-ink)]",
						)}
					>
						{activeLabel}
					</span>
					<span
						aria-hidden="true"
						className={cn(
							"shrink-0 text-[color:var(--color-ink-muted)]",
							"transition-transform duration-300",
							open ? "rotate-180" : "rotate-0",
						)}
					>
						▾
					</span>
				</button>

				{open ? (
					<ul
						id="blog-detail-toc-sheet"
						className={cn(
							"mt-2 space-y-1 rounded-[var(--radius-sm)]",
							"border border-[color:var(--color-border)]",
							"bg-[color:var(--color-bg-elevated)]",
							"p-[var(--space-3)]",
						)}
					>
						{items.map((item) => (
							<li key={item.id}>
								<a
									href={`#${item.id}`}
									onClick={(e) => handleClick(e, item.id)}
									className={cn(
										"block rounded-sm px-2 py-2",
										"font-body text-[length:var(--text-sm)]",
										item.id === activeId
											? "font-medium text-[color:var(--color-ink)]"
											: "text-[color:var(--color-ink-muted)]",
										"hover:text-[color:var(--color-ink)]",
									)}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				) : null}
			</div>

			{/* Desktop — sticky vertical list */}
			<nav
				aria-label="Article contents"
				className="hidden lg:block"
			>
				<div className="sticky top-[120px]">
					<p
						className={cn(
							"mb-[var(--space-4)] font-mono text-[length:var(--text-xs)] uppercase",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
						)}
					>
						<span
							aria-hidden="true"
							className="mr-2 inline-block h-px w-6 bg-current opacity-70 align-middle"
						/>
						Contents
					</p>
					<ul className="space-y-[var(--space-3)]">
						{items.map((item) => {
							const active = item.id === activeId;
							return (
								<li key={item.id}>
									<a
										href={`#${item.id}`}
										onClick={(e) => handleClick(e, item.id)}
										className={cn(
											"group relative inline-block py-1",
											"font-body text-[length:var(--text-sm)] leading-snug",
											"transition-colors duration-300",
											active
												? "font-medium text-[color:var(--color-ink)]"
												: "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]",
										)}
									>
										<span className="relative">
											{item.label}
											<span
												aria-hidden="true"
												className={cn(
													"absolute -bottom-0.5 left-0 h-px bg-[color:var(--color-gold)]",
													"transition-all duration-500",
													active ? "w-full" : "w-0 group-hover:w-1/2",
												)}
											/>
										</span>
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>
		</>
	);
}
