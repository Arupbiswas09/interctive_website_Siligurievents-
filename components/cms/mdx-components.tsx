/**
 * MDX component map for blog post bodies.
 *
 * Implements the custom Lexical blocks defined in docs/08-CMS-PLAN.md §8.3.
 * When Payload's Lexical renderer lands in Sprint 2, this map becomes the
 * shared rendering contract for both MDX and Lexical → React conversion.
 *
 * Every block uses our design tokens (no raw hex / px). All Server Components.
 */
import Image from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Primitive text blocks
// ---------------------------------------------------------------------------

function Paragraph({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
	return (
		<p
			className={cn(
				"font-body text-[length:var(--text-lg)] leading-[1.7]",
				"text-[color:var(--color-ink)]",
				"[&:not(:last-child)]:mb-[var(--space-6)]",
				className,
			)}
			{...rest}
		>
			{children}
		</p>
	);
}

function H2({
	className,
	children,
	id,
	...rest
}: HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
	return (
		<h2
			id={id}
			className={cn(
				"font-display tracking-[var(--tracking-display)]",
				"text-[length:var(--text-3xl)] leading-[1.1]",
				"text-balance text-[color:var(--color-ink)]",
				"mt-[var(--space-16)] mb-[var(--space-6)]",
				"scroll-mt-[120px]",
				className,
			)}
			{...rest}
		>
			{children}
		</h2>
	);
}

function H3({
	className,
	children,
	id,
	...rest
}: HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
	return (
		<h3
			id={id}
			className={cn(
				"font-display tracking-[var(--tracking-display)]",
				"text-[length:var(--text-2xl)] leading-[1.15]",
				"text-balance text-[color:var(--color-ink)]",
				"mt-[var(--space-12)] mb-[var(--space-4)]",
				"scroll-mt-[120px]",
				className,
			)}
			{...rest}
		>
			{children}
		</h3>
	);
}

function MdxLink({
	href = "#",
	children,
	className,
	...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>): React.ReactElement {
	const isInternal = href.startsWith("/") || href.startsWith("#");
	const classes = cn(
		"text-[color:var(--color-accent)] underline underline-offset-[3px]",
		"decoration-[color:var(--color-accent)]/30 hover:decoration-[color:var(--color-accent)]",
		"transition-colors",
		className,
	);
	if (isInternal) {
		return (
			<Link href={href} className={classes} {...rest}>
				{children}
			</Link>
		);
	}
	return (
		<a
			href={href}
			className={classes}
			rel="noopener noreferrer"
			target="_blank"
			{...rest}
		>
			{children}
		</a>
	);
}

function MdxUl({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLUListElement>): React.ReactElement {
	return (
		<ul
			className={cn(
				"my-[var(--space-6)] list-disc pl-[var(--space-6)]",
				"font-body text-[length:var(--text-lg)] leading-[1.7]",
				"marker:text-[color:var(--color-accent)]",
				"space-y-[var(--space-2)]",
				className,
			)}
			{...rest}
		>
			{children}
		</ul>
	);
}

function MdxOl({
	className,
	children,
	...rest
}: HTMLAttributes<HTMLOListElement>): React.ReactElement {
	return (
		<ol
			className={cn(
				"my-[var(--space-6)] list-decimal pl-[var(--space-6)]",
				"font-body text-[length:var(--text-lg)] leading-[1.7]",
				"marker:text-[color:var(--color-accent)]",
				"space-y-[var(--space-2)]",
				className,
			)}
			{...rest}
		>
			{children}
		</ol>
	);
}

// ---------------------------------------------------------------------------
// Custom blocks (per docs/08-CMS-PLAN.md §8.3)
// ---------------------------------------------------------------------------

type ImageBlockProps = {
	readonly src: string;
	readonly alt: string;
	readonly width?: number;
	readonly height?: number;
	readonly caption?: string;
	readonly variant?: "full" | "half" | "inline";
};

export function ImageBlock({
	src,
	alt,
	width = 1600,
	height = 1000,
	caption,
	variant = "full",
}: ImageBlockProps): React.ReactElement {
	const widthMap: Record<NonNullable<ImageBlockProps["variant"]>, string> = {
		full: "w-full",
		half: "w-full md:w-1/2",
		inline: "w-full md:max-w-[480px]",
	};
	return (
		<figure
			className={cn(
				"my-[var(--space-12)]",
				widthMap[variant],
				variant === "inline" && "mx-auto",
			)}
		>
			<div className="overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-bg-elevated)]">
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					sizes="(max-width: 768px) 100vw, (max-width: 1440px) 80vw, 1200px"
					className="h-auto w-full object-cover"
				/>
			</div>
			{caption ? (
				<figcaption
					className={cn(
						"mt-[var(--space-3)] text-center",
						"font-body text-[length:var(--text-sm)] italic",
						"text-[color:var(--color-ink-muted)]",
					)}
				>
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}

type ImagePairProps = {
	readonly images: ReadonlyArray<{
		readonly src: string;
		readonly alt: string;
		readonly caption?: string;
	}>;
};

export function ImagePair({ images }: ImagePairProps): React.ReactElement {
	return (
		<div
			className={cn(
				"my-[var(--space-12)] grid gap-[var(--space-4)]",
				"grid-cols-1 md:grid-cols-2",
			)}
		>
			{images.slice(0, 2).map((img) => (
				<figure key={img.src}>
					<div className="overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-bg-elevated)]">
						<Image
							src={img.src}
							alt={img.alt}
							width={800}
							height={1000}
							sizes="(max-width: 768px) 100vw, 50vw"
							className="h-auto w-full object-cover"
						/>
					</div>
					{img.caption ? (
						<figcaption
							className={cn(
								"mt-[var(--space-2)]",
								"font-body text-[length:var(--text-sm)] italic",
								"text-[color:var(--color-ink-muted)]",
							)}
						>
							{img.caption}
						</figcaption>
					) : null}
				</figure>
			))}
		</div>
	);
}

type GalleryRowProps = {
	readonly images: ReadonlyArray<{
		readonly src: string;
		readonly alt: string;
	}>;
};

export function GalleryRow({ images }: GalleryRowProps): React.ReactElement {
	const cols = Math.min(Math.max(images.length, 3), 6);
	return (
		<div
			className={cn(
				"my-[var(--space-12)] grid gap-[var(--space-3)]",
				"grid-cols-2",
				cols >= 3 && "md:grid-cols-3",
				cols >= 4 && "lg:grid-cols-4",
				cols >= 5 && "xl:grid-cols-5",
				cols >= 6 && "2xl:grid-cols-6",
			)}
		>
			{images.map((img) => (
				<div
					key={img.src}
					className="aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg-elevated)]"
				>
					<Image
						src={img.src}
						alt={img.alt}
						width={600}
						height={750}
						sizes="(max-width: 768px) 50vw, 25vw"
						className="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			))}
		</div>
	);
}

type PullQuoteProps = {
	readonly children: ReactNode;
	readonly attribution?: string;
};

export function PullQuote({
	children,
	attribution,
}: PullQuoteProps): React.ReactElement {
	return (
		<figure
			className={cn(
				"my-[var(--space-16)] border-l-2 border-[color:var(--color-accent)]",
				"pl-[var(--space-8)]",
			)}
		>
			<blockquote
				className={cn(
					"font-display italic text-balance",
					"text-[length:var(--text-3xl)] leading-[1.15]",
					"text-[color:var(--color-ink)]",
				)}
			>
				{children}
			</blockquote>
			{attribution ? (
				<figcaption
					className={cn(
						"mt-[var(--space-4)]",
						"font-body text-[length:var(--text-sm)] uppercase",
						"tracking-[var(--tracking-eyebrow)]",
						"text-[color:var(--color-ink-muted)]",
					)}
				>
					— {attribution}
				</figcaption>
			) : null}
		</figure>
	);
}

type CalloutProps = {
	readonly children: ReactNode;
	readonly title?: string;
	readonly tone?: "info" | "tip" | "warning";
};

export function Callout({
	children,
	title = "Pro tip",
	tone = "tip",
}: CalloutProps): React.ReactElement {
	const toneMap: Record<NonNullable<CalloutProps["tone"]>, string> = {
		info: "border-[color:var(--color-cool)]/40",
		tip: "border-[color:var(--color-gold)]/60",
		warning: "border-[color:var(--color-accent)]/60",
	};
	return (
		<aside
			className={cn(
				"my-[var(--space-12)] rounded-[var(--radius-md)] border-l-2 bg-[color:var(--color-bg-elevated)]",
				"px-[var(--space-6)] py-[var(--space-6)]",
				toneMap[tone],
			)}
		>
			<p
				className={cn(
					"mb-[var(--space-2)] font-body uppercase",
					"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
					"text-[color:var(--color-ink-muted)]",
				)}
			>
				{title}
			</p>
			<div
				className={cn(
					"font-body text-[length:var(--text-base)] leading-[1.7]",
					"text-[color:var(--color-ink)]",
				)}
			>
				{children}
			</div>
		</aside>
	);
}

type StatsRowProps = {
	readonly stats: ReadonlyArray<{
		readonly value: string;
		readonly label: string;
	}>;
};

export function StatsRow({ stats }: StatsRowProps): React.ReactElement {
	return (
		<dl
			className={cn(
				"my-[var(--space-16)] grid gap-[var(--space-8)]",
				"grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
			)}
		>
			{stats.map((s) => (
				<div
					key={s.label}
					className="border-t border-[color:var(--color-border)] pt-[var(--space-3)]"
				>
					<dt
						className={cn(
							"font-body uppercase text-[length:var(--text-xs)]",
							"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]",
						)}
					>
						{s.label}
					</dt>
					<dd
						className={cn(
							"mt-[var(--space-1)] font-display",
							"text-[length:var(--text-3xl)] leading-[1] tracking-[var(--tracking-display)]",
							"text-[color:var(--color-ink)]",
						)}
					>
						{s.value}
					</dd>
				</div>
			))}
		</dl>
	);
}

type CtaInlineProps = {
	readonly label: string;
	readonly href: string;
	readonly subline?: string;
};

export function CtaInline({
	label,
	href,
	subline,
}: CtaInlineProps): React.ReactElement {
	return (
		<div
			className={cn(
				"my-[var(--space-16)] rounded-[var(--radius-md)]",
				"border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]",
				"px-[var(--space-8)] py-[var(--space-8)]",
				"flex flex-col gap-[var(--space-4)] md:flex-row md:items-center md:justify-between",
			)}
		>
			<div>
				<p
					className={cn(
						"font-display text-[length:var(--text-2xl)] leading-[1.1]",
						"text-balance text-[color:var(--color-ink)]",
					)}
				>
					{label}
				</p>
				{subline ? (
					<p
						className={cn(
							"mt-[var(--space-2)] font-body text-[length:var(--text-sm)]",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						{subline}
					</p>
				) : null}
			</div>
			<Link
				href={href}
				className={cn(
					"inline-flex h-12 items-center justify-center px-[var(--space-6)]",
					"rounded-[var(--radius-sm)] bg-[color:var(--color-accent)]",
					"font-medium text-[length:var(--text-base)] tracking-[var(--tracking-tight)]",
					"text-[color:var(--color-bg)]",
					"transition-colors hover:bg-[color:var(--color-accent-deep)]",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
				)}
			>
				TODO: CTA — {label} →
			</Link>
		</div>
	);
}

type FaqBlockProps = {
	readonly faqs: ReadonlyArray<{
		readonly question: string;
		readonly answer: string;
	}>;
};

export function FaqBlock({ faqs }: FaqBlockProps): React.ReactElement {
	return (
		<div className="my-[var(--space-16)]">
			<p
				className={cn(
					"mb-[var(--space-6)] font-body uppercase",
					"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
					"text-[color:var(--color-ink-muted)]",
				)}
			>
				Frequently asked
			</p>
			<dl className="space-y-[var(--space-6)]">
				{faqs.map((f) => (
					<details
						key={f.question}
						className={cn(
							"group border-t border-[color:var(--color-border)] pt-[var(--space-4)]",
						)}
					>
						<summary
							className={cn(
								"flex cursor-pointer items-start justify-between gap-[var(--space-4)]",
								"font-display text-[length:var(--text-xl)] leading-[1.2]",
								"text-balance text-[color:var(--color-ink)]",
								"list-none [&::-webkit-details-marker]:hidden",
							)}
						>
							<span>{f.question}</span>
							<span
								aria-hidden="true"
								className={cn(
									"mt-[6px] inline-block h-px w-6 shrink-0 bg-current",
									"transition-transform group-open:rotate-90",
								)}
							/>
						</summary>
						<div
							className={cn(
								"mt-[var(--space-3)] font-body text-[length:var(--text-base)] leading-[1.7]",
								"text-[color:var(--color-ink-muted)]",
							)}
						>
							{f.answer}
						</div>
					</details>
				))}
			</dl>
		</div>
	);
}

type EmbedVideoProps = {
	readonly url: string;
	readonly title: string;
	readonly aspectRatio?: "16/9" | "4/3" | "1/1";
};

export function EmbedVideo({
	url,
	title,
	aspectRatio = "16/9",
}: EmbedVideoProps): React.ReactElement {
	return (
		<figure className="my-[var(--space-12)]">
			<div
				className={cn(
					"overflow-hidden rounded-[var(--radius-md)] bg-black",
					aspectRatio === "16/9" && "aspect-video",
					aspectRatio === "4/3" && "aspect-[4/3]",
					aspectRatio === "1/1" && "aspect-square",
				)}
			>
				<iframe
					src={url}
					title={title}
					loading="lazy"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="h-full w-full border-0"
				/>
			</div>
			<figcaption
				className={cn(
					"mt-[var(--space-3)] text-center",
					"font-body text-[length:var(--text-sm)] italic",
					"text-[color:var(--color-ink-muted)]",
				)}
			>
				{title}
			</figcaption>
		</figure>
	);
}

// ---------------------------------------------------------------------------
// Default export — pass to MDXProvider / next-mdx-remote when wired up
// ---------------------------------------------------------------------------

export const mdxComponents = {
	// Standard markdown
	p: Paragraph,
	h2: H2,
	h3: H3,
	a: MdxLink,
	ul: MdxUl,
	ol: MdxOl,
	// Custom blocks
	Image: ImageBlock,
	ImagePair,
	GalleryRow,
	PullQuote,
	Callout,
	StatsRow,
	CtaInline,
	FaqBlock,
	EmbedVideo,
};
