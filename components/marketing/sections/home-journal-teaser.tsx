import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import {
  formatPostDate,
  getAllPosts,
  type BlogPost,
} from "@/lib/cms/posts";

/**
 * H8 — Journal teaser (docs/05-PAGE-SPECS.md §5.1 H8).
 *
 * Three latest blog posts. Server Component: data is fetched synchronously
 * from the in-memory CMS stub. Each card is wrapped in `RevealOnScroll`
 * (client) with a staggered delay so the row enters in cascade.
 */
export function HomeJournalTeaser(): React.ReactElement {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Section as="section" tone="default" spacing="lg" id="home-journal">
      <Container>
        <div className="mb-[var(--space-12)] flex flex-col items-start justify-between gap-[var(--space-4)] md:flex-row md:items-end">
          <div className="flex max-w-[64ch] flex-col gap-[var(--space-3)]">
            <RevealOnScroll>
              <Eyebrow tone="accent">From the journal</Eyebrow>
            </RevealOnScroll>
            <DisplayHeading
              as="h2"
              size="lg"
              split
              splitMode="words"
              text="Notes on planning, palette and the long Indian wedding week."
              className="max-w-[28ch]"
            />
          </div>
          <RevealOnScroll>
            <Link
              href="/blog"
              className={buttonVariants({ variant: "ghost", size: "md" })}
            >
              All journal entries <span aria-hidden="true">→</span>
            </Link>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-3 md:gap-[var(--space-6)]">
          {posts.map((post, idx) => (
            <RevealOnScroll key={post.slug} delay={0.1 * idx}>
              <JournalCard post={post} />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function JournalCard({ post }: { post: BlogPost }): React.ReactElement {
  return (
    <article className="group flex flex-col gap-[var(--space-4)]">
      <Link
        href={`/blog/${post.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]"
      >
        {/* Cover — gradient plate until image lands. TODO: replace with post.coverImageUrl */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-bg-elevated)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            style={{
              background:
                "linear-gradient(160deg, rgba(232,213,168,0.7) 0%, rgba(184,137,58,0.4) 50%, rgba(139,26,26,0.35) 100%)",
            }}
          />
        </div>

        <div className="mt-[var(--space-4)] flex items-center gap-[var(--space-2)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
          <time dateTime={post.publishedDate}>
            {formatPostDate(post.publishedDate)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMinutes} min read</span>
        </div>

        <h3 className="mt-[var(--space-2)] font-display text-[length:var(--text-2xl)] leading-snug text-[color:var(--color-ink)] text-balance">
          {post.title}
        </h3>

        <p className="mt-[var(--space-2)] text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink-muted)]">
          {post.excerpt}
        </p>

        <span className="mt-[var(--space-3)] inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[color:var(--color-accent)] underline-offset-4 group-hover:underline">
          Read <span aria-hidden="true">→</span>
        </span>
      </Link>
    </article>
  );
}
