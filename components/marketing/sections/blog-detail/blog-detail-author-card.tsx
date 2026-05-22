import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { PostAuthor } from "@/lib/cms/posts";

type BlogDetailAuthorCardProps = {
	author: PostAuthor;
};

const FALLBACK_AVATAR =
	"/images/services/svc-07.webp";

/**
 * BlogDetailAuthorCard — author bio block at the end of the article.
 * Brass-ringed circular portrait, name, role, one-line bio, link to /about.
 */
export function BlogDetailAuthorCard({
	author,
}: BlogDetailAuthorCardProps): React.ReactElement {
	return (
		<Section tone="default" spacing="sm">
			<Container size="narrow">
				<div
					className={cn(
						"flex flex-col items-center gap-[var(--space-6)]",
						"border-y border-[color:var(--color-gold)]/35",
						"py-[var(--space-10)]",
						"md:flex-row md:items-start md:gap-[var(--space-8)]",
					)}
				>
					<div className="relative shrink-0">
						<span
							aria-hidden="true"
							className={cn(
								"absolute -inset-1 rounded-full",
								"bg-[conic-gradient(from_120deg,var(--color-gold-soft),var(--color-gold),var(--color-accent-deep),var(--color-gold-soft))]",
							)}
						/>
						<span
							aria-hidden="true"
							className={cn(
								"absolute inset-0 rounded-full",
								"ring-1 ring-inset ring-[color:var(--color-gold)]/40",
							)}
						/>
						<div
							className={cn(
								"relative h-[88px] w-[88px] overflow-hidden rounded-full",
								"border-2 border-[color:var(--color-bg)]",
								"bg-[color:var(--color-bg-elevated)]",
							)}
						>
							<Image
								src={author.avatarUrl ?? FALLBACK_AVATAR}
								alt={`Portrait of ${author.name}`}
								fill
								sizes="88px"
								className="object-cover"
							/>
						</div>
					</div>

					<div className="text-center md:text-left">
						<p
							className={cn(
								"font-mono text-[length:var(--text-xs)] uppercase",
								"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold)]",
							)}
						>
							<span
								aria-hidden="true"
								className="mr-2 inline-block h-px w-6 bg-current opacity-70 align-middle"
							/>
							Written by
						</p>
						<h3
							className={cn(
								"mt-[var(--space-2)] font-display italic",
								"text-[length:var(--text-2xl)] leading-tight",
								"text-[color:var(--color-ink)]",
							)}
						>
							{author.name}
						</h3>
						<p
							className={cn(
								"mt-1 font-body text-[length:var(--text-sm)]",
								"text-[color:var(--color-ink-muted)]",
							)}
						>
							{author.role}
						</p>
						<p
							className={cn(
								"mt-[var(--space-4)] max-w-[52ch] font-body",
								"text-[length:var(--text-base)] leading-relaxed",
								"text-[color:var(--color-ink)]",
							)}
						>
							{author.bio}
						</p>
						<Link
							href="/about"
							className={cn(
								"group mt-[var(--space-4)] inline-flex items-center gap-2",
								"font-body text-[length:var(--text-sm)]",
								"text-[color:var(--color-ink)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
							)}
						>
							<span className="relative">
								More about the studio
								<span
									aria-hidden="true"
									className={cn(
										"absolute -bottom-0.5 left-0 h-px w-full",
										"origin-left scale-x-0 bg-[color:var(--color-gold)]",
										"transition-transform duration-500",
										"group-hover:scale-x-100",
									)}
								/>
							</span>
							<span
								aria-hidden="true"
								className="transition-transform group-hover:translate-x-1"
							>
								&rarr;
							</span>
						</Link>
					</div>
				</div>
			</Container>
		</Section>
	);
}
