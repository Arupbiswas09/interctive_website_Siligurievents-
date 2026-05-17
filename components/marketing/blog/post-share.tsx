"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type PostShareProps = {
	readonly title: string;
	/** Path WITHOUT origin, e.g. `/blog/my-post`. */
	readonly path: string;
};

/**
 * PostShare — WhatsApp / Copy Link / Pinterest sharing strip.
 * Per docs/05-PAGE-SPECS.md §5.9. Client Component because we read
 * `navigator.clipboard` and manage a tiny "copied" state.
 *
 * The absolute URL is composed at render-time from `window.location.origin`
 * so previews on Vercel preview deploys still produce correct share links.
 */
export function PostShare({ title, path }: PostShareProps): React.ReactElement {
	const [copied, setCopied] = useState(false);

	function resolveUrl(): string {
		if (typeof window === "undefined") {
			return `https://siligurievent.com${path}`;
		}
		return `${window.location.origin}${path}`;
	}

	async function onCopy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(resolveUrl());
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// TODO: fallback toast once Sprint 4 lands a toast primitive.
		}
	}

	const encoded = encodeURIComponent(`${title} — ${resolveUrl()}`);
	const whatsappUrl = `https://wa.me/?text=${encoded}`;
	const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(resolveUrl())}&description=${encodeURIComponent(title)}`;

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-[var(--space-3)]",
				"font-body text-[length:var(--text-sm)]",
			)}
		>
			<span
				className={cn(
					"font-body uppercase",
					"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
					"text-[color:var(--color-ink-muted)]",
				)}
			>
				Share
			</span>
			<a
				href={whatsappUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={shareLinkClass}
			>
				WhatsApp
			</a>
			<button type="button" onClick={onCopy} className={shareLinkClass}>
				{copied ? "Link copied" : "Copy link"}
			</button>
			<a
				href={pinterestUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={shareLinkClass}
			>
				Pinterest
			</a>
		</div>
	);
}

const shareLinkClass = cn(
	"inline-flex h-9 items-center px-[var(--space-4)]",
	"rounded-[999px] border border-[color:var(--color-border)]",
	"font-body text-[length:var(--text-sm)] text-[color:var(--color-ink)]",
	"transition-[color,border-color,background-color] duration-200",
	"hover:border-[color:var(--color-ink)] hover:bg-[color:var(--color-bg-elevated)]",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
	"cursor-pointer",
);
