# Siligurievent — Luxury Event Decoration, North Bengal

> Awwwards-grade portfolio site for **Siligurievent**, a premium event decoration studio based in Siliguri, West Bengal, India. Specializing in Indian weddings (Bengali, Marwari, Nepali, Hindu, Sikh, Muslim, Christian), Haldi, Mehendi, Sangeet, birthdays, anniversaries, baby showers, corporate events, pujas, and luxury private celebrations.

---

## What this repo contains

This is a **greenfield Next.js 16 App Router project** with a built-in Payload CMS 3 admin, designed to be:

- **Visually extraordinary** — parallax, cinematic scroll, GSAP-driven choreography, smooth Lenis scrolling, motion in every interaction.
- **SEO-dominant in North Bengal** — local schema, service pages, geo-targeted content, performance-first, programmatic SEO ready.
- **Mobile-first** — Indian users are mobile-majority; every interaction is designed for touch and slow networks.
- **CMS-controlled by non-technical staff** — Payload admin lives on `/admin`, mobile-responsive, drag-and-drop gallery, one-screen content editing.

## Planning documents (read in order)

| # | Doc | What it covers |
|---|-----|----------------|
| 00 | [PLAN.md](./PLAN.md) | Master plan, phases, milestones |
| 01 | [docs/01-PROJECT-VISION.md](./docs/01-PROJECT-VISION.md) | Brand, audience, USP, voice |
| 02 | [docs/02-TECH-STACK.md](./docs/02-TECH-STACK.md) | Every technology and why |
| 03 | [docs/03-DESIGN-SYSTEM.md](./docs/03-DESIGN-SYSTEM.md) | Color, type, spacing, tokens |
| 04 | [docs/04-INFORMATION-ARCHITECTURE.md](./docs/04-INFORMATION-ARCHITECTURE.md) | Sitemap, nav, URL structure |
| 05 | [docs/05-PAGE-SPECS.md](./docs/05-PAGE-SPECS.md) | Section-by-section page specs |
| 06 | [docs/06-ANIMATION-STRATEGY.md](./docs/06-ANIMATION-STRATEGY.md) | GSAP, ScrollTrigger, Lenis patterns |
| 07 | [docs/07-SEO-STRATEGY.md](./docs/07-SEO-STRATEGY.md) | Keywords, schema, content strategy |
| 08 | [docs/08-CMS-PLAN.md](./docs/08-CMS-PLAN.md) | Payload collections, admin UX |
| 09 | [docs/09-IMAGE-PROMPTS.md](./docs/09-IMAGE-PROMPTS.md) | Placeholders for Gemini prompts |
| 10 | [docs/10-PERFORMANCE.md](./docs/10-PERFORMANCE.md) | Web Vitals targets, optimization |
| 11 | [docs/11-DEPLOYMENT.md](./docs/11-DEPLOYMENT.md) | Vercel, domain, env, integrations |
| 12 | [docs/12-ROADMAP.md](./docs/12-ROADMAP.md) | Sprint-by-sprint execution plan |
| — | [docs/SEO-RANKING-PLAN.md](./docs/SEO-RANKING-PLAN.md) | Owner action plan to rank for "Siliguri balloon/decoration" |

## Quick stack summary

- **Framework**: Next.js 16 (App Router, React 19, Cache Components)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Motion**: GSAP + ScrollTrigger + Lenis + Framer Motion (selective)
- **CMS**: Payload CMS 3 (lives in `/app/(payload)/admin`)
- **Database**: Neon Postgres (via Vercel Marketplace)
- **Media**: Vercel Blob (private + public)
- **Email**: Resend (inquiry notifications)
- **Hosting**: Vercel (Fluid Compute, Node 24)
- **Analytics**: Vercel Analytics + Speed Insights
- **SEO**: next-sitemap, JSON-LD, OG image generation, IndexNow

## Status

🟡 **Planning phase complete — scaffolding pending owner approval of docs.**
