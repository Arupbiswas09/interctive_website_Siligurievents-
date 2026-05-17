# 12 — Roadmap

How we get from these docs to a live, indexed, awards-worthy site. Six sprints, ~6 weeks of active build, plus content load and pre-launch polish.

> Each sprint ends with a demo on a preview URL the owner can review on phone.

---

## Sprint 0 — Planning sign-off (THIS WEEK)

**Goal**: Owner reads all docs, gives go/no-go and answers open questions.

Deliverables:
- This doc set, frozen at v1.
- Owner answers to the 5 open questions in [PLAN.md §6](../PLAN.md).
- Business info supplied: phone, address, hours, social, GST.
- Domain decision.
- First batch of Gemini image prompts pasted into [09-IMAGE-PROMPTS.md](./09-IMAGE-PROMPTS.md) — at least the "First 25" set.

**Gate to Sprint 1**: Owner sign-off in writing.

---

## Sprint 1 — Foundation (Week 1)

**Goal**: A bare repo deployed to Vercel with design system, primitives, and motion working.

- [ ] `pnpm create next-app` with TypeScript, Tailwind v4, App Router, src dir disabled, App Router enabled.
- [ ] Run `vercel-plugin:bootstrap` to set up project link, env, Neon, Blob.
- [ ] Tailwind v4 `@theme` block with full token set from [03-DESIGN-SYSTEM.md](./03-DESIGN-SYSTEM.md).
- [ ] `next/font` for Cormorant + Inter (Latin) with variable CSS vars; **add Noto Serif Devanagari + Noto Sans Devanagari subsets for `/hi/*` routes** per `DECISIONS.md` D-003.
- [ ] `next-intl` v4+ middleware + `/en` and `/hi` locale routing scaffolded (i18n ships from launch, not post-launch).
- [ ] `globals.css` with CSS variables for light/dark themes.
- [ ] shadcn/ui init; pick the components we need (Button, Dialog, Sheet, Accordion, Tabs, Form, Input, Textarea, Select, Toast).
- [ ] Build all primitives from [03-DESIGN-SYSTEM.md §3.9](./03-DESIGN-SYSTEM.md).
- [ ] LenisProvider + GSAP/ScrollTrigger registration.
- [ ] Motion primitives MO-01..MO-12 with `prefers-reduced-motion` fallbacks.
- [ ] Internal `/_design` page rendering tokens + primitives + motion samples.
- [ ] Header (transparent → solid), Footer, sticky WhatsApp FAB.
- [ ] Placeholder Home page with hero animation.
- [ ] Deploy to preview URL, verify Lighthouse ≥ 90.

**Demo**: Owner reviews `/_design` and home hero on phone.

---

## Sprint 2 — CMS spine (Week 2)

**Goal**: Payload CMS live at `/admin`. Owner can log in and add a project from their phone.

- [ ] Mount Payload at `/(payload)/admin` and `/(payload)/api`.
- [ ] Configure `@payloadcms/db-postgres` against Neon.
- [ ] Configure `@payloadcms/storage-vercel-blob` for media.
- [ ] Build all collections per [08-CMS-PLAN.md §8.2](./08-CMS-PLAN.md).
- [ ] Define access rules per role.
- [ ] Define Lexical block library.
- [ ] Build the custom admin dashboard.
- [ ] Apply admin theming.
- [ ] Mobile responsiveness pass on admin.
- [ ] Hooks: `afterChange` revalidation, Resend on inquiry, IndexNow.
- [ ] Seed script populates 19 services, 6 projects, 9 testimonials, 7 locations, 3-per-category packages, 6 blog posts, site settings, homepage.
- [ ] Set up owner + editor user accounts.
- [ ] Create typed CMS query helpers in `lib/cms/`.

**Demo**: Owner logs in on phone, adds a test project, verifies it appears (with placeholder) on the preview site.

---

## Sprint 3 — Marketing pages, Part 1 (Week 3)

**Goal**: Home, About, Services index + detail templates live and beautiful.

- [ ] Home page assembled, all 9 sections from [05-PAGE-SPECS.md §5.1](./05-PAGE-SPECS.md).
- [ ] About page, all 7 sections.
- [ ] Services index with category tabs.
- [ ] Service detail template — handles all 19 services dynamically.
- [ ] All SEO metadata, JSON-LD per page type.
- [ ] Open Graph image generation via `/api/og`.
- [ ] Sticky CTAs per page.
- [ ] Real images wired (first 25 + first 6 service details).
- [ ] Lighthouse mobile ≥ 92 on all built routes.

**Demo**: Owner reviews 4 representative pages on phone.

---

## Sprint 4 — Marketing pages, Part 2 (Week 4)

**Goal**: Portfolio, Pricing, Blog, Contact, Locations live.

- [ ] Portfolio index with filter + justified grid.
- [ ] Portfolio case study template; first 6 case studies live.
- [ ] Pricing page with all packages from CMS.
- [ ] Blog index with category filtering.
- [ ] Blog post template with Lexical block rendering.
- [ ] Contact page with 3-step inquiry form.
- [ ] Resend integration for inquiry notifications.
- [ ] hCaptcha / Turnstile on form.
- [ ] Locations index + 7 location pages.
- [ ] Branded 404 page.
- [ ] All structured data verified in Google Rich Results Test.

**Demo**: Owner submits a test inquiry → receives notification email + WhatsApp.

---

## Sprint 5 — Motion polish & signature moments (Week 5)

**Goal**: Make the site feel awwwards-worthy.

- [ ] Cinematic hero refinement (Home).
- [ ] Pinned horizontal showcase (Home → Signature Work).
- [ ] Masked reveals on case study chapter images.
- [ ] Number counter animation on case study stats.
- [ ] Magnetic CTAs.
- [ ] Custom cursor.
- [ ] Marquee strips (capability, testimonials).
- [ ] Mobile menu choreography.
- [ ] Route transitions via View Transitions API.
- [ ] Lightbox with shared-element transition.
- [ ] Jasmine petal fall on 404 + form success.
- [ ] Final pass: every page reviewed in slow-motion, friction points resolved.

**Demo**: Side-by-side comparison vs 3 awwwards SOTD sites — does ours hold?

---

## Sprint 6 — SEO + Launch (Week 6)

**Goal**: Indexed, monitored, announceable.

- [ ] Programmatic location × service pages (`/decorators/[loc]/[svc]`).
- [ ] Sitemap generation, robots.txt, IndexNow.
- [ ] Submit sitemap to GSC, Bing Webmaster.
- [ ] Google Business Profile completed.
- [ ] Local citations claimed on JustDial, WedMeGood, ShaadiSaga, BookEventz.
- [ ] Sentry hooked up.
- [ ] Owner walkthrough Loom recorded.
- [ ] Cheat-sheet PDF generated.
- [ ] Pre-launch checklist (T-7, T-1, T-0) all passed.
- [ ] Domain pointed, SSL verified.
- [ ] Launch → verify → announce.

**Demo**: Live site at the real domain.

---

## Post-launch (Weeks 7+)

### Week 7
- First-week analytics review.
- Address any owner UX friction in admin.
- First real client project case study added by owner.

### Month 2–3
- 2 new blog posts/week.
- Refresh top-3 traffic pages.
- A/B test homepage hero CTA copy.
- WhatsApp Business API exploration (if owner wants conversational bot).

### Month 4–6
- Add **Bengali** (`/bn/...`) via `next-intl` — English + Hindi already shipped at launch (see `DECISIONS.md` D-003).
- YouTube channel integration on case study pages (embed cinematic recaps).
- Newsletter campaign monthly.
- Consider: 3D hero treatment via R3F (one signature page) if owner wants extra wow.

### Month 6
- Full site audit, redesign opportunities reviewed.
- Annual perf benchmark.
- Submit to Awwwards / CSSDA / FWA for awards consideration.

---

## Owner checkpoints summary

| When | What we need from the owner |
|---|---|
| Sprint 0 end | Plan sign-off, business info, 5 question answers, first batch of Gemini prompts |
| Sprint 1 demo | Approve design tokens & motion samples |
| Sprint 2 demo | Test admin on phone, give feedback on labels/fields |
| Sprint 3 demo | Approve real page rendering quality |
| Sprint 4 demo | Submit a real inquiry, approve form UX |
| Sprint 5 demo | Approve the "wow" level |
| Sprint 6 launch | Approve go-live |
| Weekly post-launch | Add new content, share feedback |

---

## Definition of "launch-ready"

We launch when ALL of:

1. All routes pass [PLAN.md §2](../PLAN.md) definition-of-done.
2. All 6 launch blog posts published.
3. All 6 launch case studies published.
4. All 19 service detail pages have real content (not placeholders).
5. Owner can confidently demo the admin to another non-tech person.
6. Inquiry form submits to a real WhatsApp + email destination.
7. Domain live, SSL green, all redirects working.
8. Google Search Console verified, sitemap submitted, first indexing requested.
9. Lighthouse mobile ≥ 92 on every public route in our preview Lighthouse CI run.
10. The owner says "yes, this is us."
