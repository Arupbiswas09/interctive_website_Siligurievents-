import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/cms/posts";
import { BlogDetailToc, type TocItem } from "./blog-detail-toc";
import { BlogDetailShareRail } from "./blog-detail-share-rail";

type BlogDetailArticleProps = {
	post: BlogPost;
};

const SAMPLE_TOC: ReadonlyArray<TocItem> = [
	{ id: "the-light-first", label: "The light first" },
	{ id: "the-room-follows", label: "The room follows" },
	{ id: "three-habits", label: "Three habits" },
];

/**
 * BlogDetailArticle — 12-col editorial body.
 *   left col-span-2: sticky TOC (desktop)
 *   middle col-span-8: prose body (max-w-[68ch])
 *   right col-span-2: sticky share rail (desktop, via fixed BlogDetailShareRail)
 *
 * Body uses ::first-letter drop cap on the first paragraph, brass pull-quote
 * with script attribution, inline images with gilt corners, generous leading.
 *
 * The CMS Post does not yet have a structured body field (Sprint 1 is a
 * placeholder string), so this component renders a fallback editorial body
 * that demonstrates the typographic system. When the Lexical → React renderer
 * lands the fallback is replaced by `post.bodyJson` mapped through the
 * editorial primitives below.
 */
export function BlogDetailArticle({
	post,
}: BlogDetailArticleProps): React.ReactElement {
	return (
		<Section tone="default" spacing="lg">
			<BlogDetailShareRail title={post.title} path={`/blog/${post.slug}`} />

			<Container>
				<div
					className={cn(
						"grid grid-cols-12 gap-x-[var(--space-6)] gap-y-[var(--space-10)]",
					)}
				>
					{/* TOC — desktop sticky, mobile top-sheet */}
					<div className="col-span-12 lg:col-span-2">
						<BlogDetailToc items={SAMPLE_TOC} />
					</div>

					{/* Body */}
					<article
						className={cn(
							"col-span-12 lg:col-span-8",
							"max-w-[68ch] lg:mx-auto",
						)}
					>
						<EditorialProse>
							<p className="drop-cap">
								There is a moment, perhaps an hour before the first guest is
								due, when a wedding room stops feeling like a project and
								starts feeling like a place. The drape has settled; the
								marigolds have opened a little wider than they did at noon; the
								filament bulbs are warming up and that one corner finally looks
								the way the mood board promised it would. {post.excerpt}
							</p>

							<p>
								Most of our briefs arrive as an idea and a Pinterest board. We
								read both carefully, then put them aside. What we keep is the
								feeling — the photograph the family does not yet have but
								already wants to frame. Then we work backwards: how does the
								room have to feel for that photograph to be possible? Which
								wall? Which light? Which silhouette of jasmine, against which
								wall, at which hour?
							</p>

							<PullQuote attribution="Studio note · No. 14">
								&ldquo;A photograph that grandparents can frame is the only
								brief we accept.&rdquo;
							</PullQuote>

							<h2 id="the-light-first">The light first</h2>
							<p>
								Light is the only element that touches every other element. If
								the light is wrong, the marigolds will look orange-plastic, the
								brass will look yellow, and the bride&rsquo;s benarasi will
								look like a costume. So we begin every plan with a single
								question: at what hour does the room have to be its best, and
								what is the colour temperature of the light at that hour?
							</p>

							<p>
								For a haldi at ten in the morning, the answer is easy — let
								the sun do the work, and add nothing warmer than 3000K to fill
								the shadows. For a Bengali wedding at nine in the evening, the
								answer is harder: the room must feel candle-lit even though we
								cannot use only candles, so we build a layered base of warm
								tungsten and let small accents (the diyas, the strands of
								filament bulbs along the mandap pillars) carry the romance.
							</p>

							<InlineImage
								src="/images/hero-02.webp"
								alt="Marigold and bamboo composition set up for dawn light at a Siliguri wedding."
								caption="Marigold + bamboo, designed for dawn light. Siliguri, March 2026."
							/>

							<h2 id="the-room-follows">The room follows</h2>
							<p>
								Once the light has been decided, the room arranges itself. The
								mandap goes where the light is most generous; the seating fans
								out from the mandap so every guest has at least one moment of
								eye-contact with the couple; the floral spill points back to
								the mandap so the camera always returns home. The drape, the
								florals, the candles, the brass — they are all in service of
								the same axis.
							</p>

							<p>
								We learnt this the hard way at a Dooars wedding in 2024.
								Beautiful drape, beautiful florals, an utterly ordinary axis.
								The photographs were good. They were never going to be great.
								Since then we draw the axis first, on paper, before we draw
								anything else.
							</p>

							<h2 id="three-habits">Three habits</h2>
							<p>Three small habits that have outlasted every trend we have
								watched come and go:
							</p>
							<ul>
								<li>
									Leave the room emptier than the brief asks for. Negative
									space is luxury; clutter is fear.
								</li>
								<li>
									Use one flower in three sizes. A garland, a centrepiece, a
									single bloom at every place setting — the eye reads it as
									intention, not coincidence.
								</li>
								<li>
									Light the floor, not just the ceiling. The face that is lit
									from above looks tired; the face that has a soft warmth
									rising from the floor looks loved.
								</li>
							</ul>

							<p>
								Everything else is a variable. These three are the
								constants we have kept since the studio&rsquo;s first event,
								and they are the closest thing we have to a method.
							</p>
						</EditorialProse>
					</article>

					{/* Right column — reserved for the fixed share rail; keeps grid balance */}
					<div
						aria-hidden="true"
						className="hidden lg:col-span-2 lg:block"
					/>
				</div>
			</Container>
		</Section>
	);
}

// ────────────────────────────────────────────────────────────────────────────
// Editorial typographic primitives — local to this section.
// ────────────────────────────────────────────────────────────────────────────

function EditorialProse({
	children,
}: {
	children: ReactNode;
}): React.ReactElement {
	return (
		<div
			className={cn(
				"font-body text-[length:var(--text-lg)] leading-[1.8]",
				"text-[color:var(--color-ink)]",
				// Block spacing
				"[&_p]:mt-[var(--space-6)] [&_p]:first:mt-0",
				// Drop-cap on first paragraph
				"[&_.drop-cap]:first-letter:float-left",
				"[&_.drop-cap]:first-letter:mr-[var(--space-3)]",
				"[&_.drop-cap]:first-letter:pt-2",
				"[&_.drop-cap]:first-letter:font-display",
				"[&_.drop-cap]:first-letter:font-light",
				"[&_.drop-cap]:first-letter:italic",
				"[&_.drop-cap]:first-letter:leading-[0.85]",
				"[&_.drop-cap]:first-letter:text-[clamp(56px,7vw,88px)]",
				"[&_.drop-cap]:first-letter:text-[color:var(--color-gold)]",
				// H2 — italic display
				"[&_h2]:mt-[var(--space-16)] [&_h2]:mb-[var(--space-5)]",
				"[&_h2]:font-display [&_h2]:italic",
				"[&_h2]:text-[length:var(--text-4xl)] [&_h2]:leading-[1.1]",
				"[&_h2]:tracking-[var(--tracking-display)]",
				"[&_h2]:text-[color:var(--color-ink)]",
				// Lists
				"[&_ul]:mt-[var(--space-6)] [&_ul]:space-y-[var(--space-3)]",
				"[&_ul]:list-none [&_ul]:pl-0",
				"[&_li]:relative [&_li]:pl-[var(--space-6)]",
				"[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.85em]",
				"[&_li]:before:block [&_li]:before:h-px [&_li]:before:w-3",
				"[&_li]:before:bg-[color:var(--color-gold)]",
				"[&_li]:before:content-['']",
			)}
		>
			{children}
		</div>
	);
}

function PullQuote({
	children,
	attribution,
}: {
	children: ReactNode;
	attribution?: string;
}): React.ReactElement {
	return (
		<figure
			className={cn(
				"my-[var(--space-12)]",
				"border-l-2 border-[color:var(--color-gold)]",
				"pl-[var(--space-6)]",
			)}
		>
			<blockquote
				className={cn(
					"font-display italic",
					"text-[length:var(--text-3xl)] leading-[1.2]",
					"tracking-[var(--tracking-display)]",
					"text-balance text-[color:var(--color-ink)]",
				)}
			>
				{children}
			</blockquote>
			{attribution ? (
				<figcaption
					className={cn(
						"mt-[var(--space-4)] font-script",
						"text-[length:var(--text-lg)]",
						"text-[color:var(--color-gold)]",
					)}
				>
					— {attribution}
				</figcaption>
			) : null}
		</figure>
	);
}

function InlineImage({
	src,
	alt,
	caption,
}: {
	src: string;
	alt: string;
	caption?: string;
}): React.ReactElement {
	return (
		<figure className="relative my-[var(--space-10)]">
			<div className="relative">
				<GiltCorner position="tl" />
				<GiltCorner position="tr" />
				<GiltCorner position="bl" />
				<GiltCorner position="br" />
				<div
					className={cn(
						"relative aspect-[16/10] overflow-hidden",
						"rounded-[var(--radius-md)]",
						"bg-[color:var(--color-bg-elevated)]",
					)}
				>
					<Image
						src={src}
						alt={alt}
						fill
						sizes="(min-width: 1024px) 720px, 100vw"
						className="object-cover"
					/>
				</div>
			</div>
			{caption ? (
				<figcaption
					className={cn(
						"mt-[var(--space-3)] font-mono text-[length:var(--text-xs)] uppercase",
						"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
					)}
				>
					<span
						aria-hidden="true"
						className="mr-2 inline-block h-px w-4 bg-[color:var(--color-gold)] align-middle"
					/>
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function GiltCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "-top-2 -left-2 rotate-0",
		tr: "-top-2 -right-2 rotate-90",
		bl: "-bottom-2 -left-2 -rotate-90",
		br: "-bottom-2 -right-2 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-7 w-7",
				"text-[color:var(--color-gold)]",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 28 28"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1.1"
				strokeLinecap="round"
			>
				<path d="M0 12 L 0 0 L 12 0" />
				<path d="M3 14 Q 8 7 14 3" opacity="0.6" />
			</svg>
		</span>
	);
}
