import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PostAuthor } from "@/lib/cms/posts";

type PostAuthorProps = {
	readonly author: PostAuthor;
};

/**
 * PostAuthorCard — small bio block per docs/05-PAGE-SPECS.md §5.9.
 * Kept compact so it never overpowers the body copy.
 */
export function PostAuthorCard({ author }: PostAuthorProps): React.ReactElement {
	return (
		<aside
			className={cn(
				"rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
				"bg-[color:var(--color-bg-elevated)] p-[var(--space-6)]",
				"flex gap-[var(--space-5)]",
			)}
		>
			<div
				className={cn(
					"h-16 w-16 shrink-0 overflow-hidden rounded-full",
					"border border-[color:var(--color-border)] bg-[color:var(--color-bg)]",
				)}
				aria-hidden={author.avatarUrl ? undefined : "true"}
			>
				{author.avatarUrl ? (
					<Image
						src={author.avatarUrl}
						alt={`${author.name} — ${author.role}`}
						width={120}
						height={120}
						className="h-full w-full object-cover"
					/>
				) : (
					<div
						className={cn(
							"flex h-full w-full items-center justify-center",
							"font-display text-[length:var(--text-2xl)] italic",
							"text-[color:var(--color-ink-soft)]",
						)}
					>
						{author.name
							.split(" ")
							.filter(Boolean)
							.slice(0, 2)
							.map((n) => n[0])
							.join("")
							.toUpperCase() || "·"}
					</div>
				)}
			</div>
			<div>
				<p
					className={cn(
						"font-body uppercase",
						"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
						"text-[color:var(--color-ink-muted)]",
					)}
				>
					Written by
				</p>
				<p
					className={cn(
						"mt-[var(--space-1)] font-display",
						"text-[length:var(--text-xl)] leading-[1.2]",
						"text-[color:var(--color-ink)]",
					)}
				>
					{author.name}
				</p>
				<p
					className={cn(
						"font-body text-[length:var(--text-sm)]",
						"text-[color:var(--color-ink-soft)]",
					)}
				>
					{author.role}
				</p>
				<p
					className={cn(
						"mt-[var(--space-3)] font-body text-[length:var(--text-base)] leading-[1.6]",
						"text-[color:var(--color-ink-muted)]",
					)}
				>
					{author.bio}
				</p>
			</div>
		</aside>
	);
}
