# CLAUDE.md — Project guidance for AI assistants

This file teaches future Claude sessions how to work in this repo. Read it before writing code.

## What this project is

A production portfolio website for **Siligurievent**, an event decoration company in Siliguri, West Bengal, India. Built with Next.js 16 App Router + Payload CMS 3 + Tailwind v4 + GSAP. Owner is a non-technical decorator; the CMS must remain dead-simple. Deployed on Vercel.

## Hard rules

1. **Awwwards-grade or don't ship.** This site competes visually with Locomotive, Active Theory, and SOTD winners. Default to elevated. If a section feels generic, redo it. Load the `impeccable` and `ui-motion` skills when designing visuals.
2. **Motion has a budget.** Every animation must honor `prefers-reduced-motion`. Pin no more than 2 ScrollTriggers per viewport. JS-driven motion only via GSAP timelines that are created/killed on route transitions.
3. **CMS first.** If content is editable, it lives in Payload. Never hard-code testimonials, prices, gallery images, or copy that the owner might want to change.
4. **Mobile is primary.** Design and build mobile-first. Test on a real phone or 375px viewport before claiming a section is done.
5. **No fake data in production builds.** Use Payload seed data or `TODO` placeholders that are visibly marked.
6. **SEO is not an afterthought.** Every route ships with `generateMetadata`, structured data, and is in the sitemap. Run Lighthouse before saying anything is done.
7. **Indian English.** Copy uses Indian English conventions (organise, colour, customise). Currency is INR (₹). Phone numbers in +91 format. Dates in DD MMM YYYY.
8. **Performance first, decoration second.** If an animation costs >50ms on a Pixel 4a 4G profile, kill it or simplify.

## Stack reference (do NOT guess versions or APIs)

- **Next.js 16 App Router** — Cache Components, `use cache`, Server Components default. Load `vercel-plugin:nextjs` and `vercel-plugin:next-cache-components` skills.
- **Tailwind CSS v4** — `@theme` directive in CSS, no `tailwind.config.ts`. Tokens via CSS variables.
- **shadcn/ui** — primitive layer; we restyle aggressively. Load `vercel-plugin:shadcn` skill.
- **Payload CMS 3** — mounted at `/(payload)/admin`. Storage adapter: `@payloadcms/storage-vercel-blob`. DB: `@payloadcms/db-postgres`.
- **GSAP 3.x** — core + ScrollTrigger + Observer (free/MIT plugins only). **No GSAP `SplitText`** (paid Club GreenSock plugin) — text splitting uses our in-repo `components/motion/splitter.tsx` primitive. Load `gsap-core` and `gsap-scrolltrigger` skills.
- **Lenis** — smooth scroll, synced with ScrollTrigger via `ScrollTrigger.update`.
- **Framer Motion** — only for component-level interactions (modals, layout shifts). GSAP owns scroll.
- **Resend** — transactional email for inquiry notifications.

Before writing code that touches any of these, **read the official docs**. Memorized APIs are stale.

## Folder convention

```
app/
  (site)/           ← public marketing routes
    layout.tsx      ← Lenis provider, header, footer, sticky CTAs
    page.tsx        ← Home
    about/
    services/
      [slug]/
    portfolio/
      [slug]/
    pricing/
    blog/
      [slug]/
    contact/
  (payload)/        ← Payload admin
    admin/
      [[...segments]]/
    api/
      [...slug]/
  api/
    inquiry/        ← form submission
    revalidate/     ← Payload afterChange hooks
    og/             ← dynamic OG images
components/
  ui/               ← shadcn primitives (do not edit, restyle via wrappers)
  marketing/        ← sections used in marketing pages
  motion/           ← reusable motion components (Splitter, SplitterReveal, RevealOnScroll, Parallax)
  cms/              ← Payload-rendered blocks (rich text, image, gallery, video)
lib/
  payload/          ← payload config, collections, blocks, hooks
  seo/              ← schema builders, og generators
  gsap/             ← reusable timelines, plugins registration
  cms/              ← typed query helpers
  utils/
content/            ← static fallback content
public/
  fonts/
  images/
docs/               ← planning documents (this folder)
```

## Coding style

- TypeScript strict. No `any` outside `lib/payload/generated.ts` (Payload generated types).
- Server Components by default. Mark Client Components only when you need state, refs, or browser APIs.
- Co-locate `*.module.css` next to component if you ever need it; otherwise Tailwind.
- Constants in SCREAMING_SNAKE, components in PascalCase, hooks in `useCamelCase`.
- No barrel index files — they hurt tree-shaking.
- No default exports for components — named exports only (improves refactors, search).

## When in doubt

- Visual design: load `impeccable`, `ui-motion`, `ui-design-core`.
- Animation: load `gsap-core`, `gsap-scrolltrigger`, `motion-basics`.
- Anything Vercel: load the relevant `vercel-plugin:*` skill — do not guess.
- Anything Figma: load `figma:figma-use` BEFORE calling any Figma tool.

## What not to do

- Don't install new dependencies without checking if one already exists for the job.
- Don't create new docs in `/docs/` without updating the index in `README.md`.
- Don't write copy in component files — it goes in Payload or `content/`.
- Don't add a library because it's trendy — every dep is a perf and security tax.
- Don't write English with American spellings or US-centric examples.
