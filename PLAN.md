# Master Plan — Siligurievent

> Source of truth for the build. Every other doc is a deeper dive into one slice of this plan.

---

## 1. The brief, decoded

The client (Siligurievent) wants:

1. **A portfolio website**, not a booking platform. Conversions = inquiries via WhatsApp / form / phone.
2. **World-class visuals** — "Awwwards-level." That means typography, motion, image art-direction, and feel must compete with sites at awwwards.com SOTD winners (e.g., Eternal, Locomotive, Active Theory tier).
3. **Modern luxury aesthetic** — not "Indian wedding website cliché." Restrained, cinematic, editorial. Indian motifs used as accents, not wallpaper.
4. **Parallax + scroll-driven storytelling** — visuals do the talking. Hero parallax, scroll-pinned sections, image masks reveal on scroll, scrubbed video.
5. **All major Indian celebration categories** — weddings (Bengali, Marwari, Nepali, Hindu, Sikh, Muslim, Christian), Haldi, Mehendi, Sangeet, Reception, Birthday, Anniversary, Baby Shower, Annaprashan, Naamkaran, Griha Pravesh, Corporate, Festival Pujas (Durga, Lakshmi, Saraswati).
6. **Top-of-funnel CTAs everywhere** — sticky WhatsApp, "Plan My Event" hero CTA, inline inquiry capture, exit-intent on key pages.
7. **World-class SEO for Indian local + national** — Siliguri, North Bengal, Darjeeling, Jalpaiguri, Sikkim border zones; long-tail "best wedding decorator in Siliguri."
8. **A CMS a non-technical owner can actually use** — uploads images from phone, drags to reorder, edits prices and packages, publishes posts. No code, no markdown.
9. **Built using Gemini-generated imagery** — owner will supply prompts; we wire them into placeholders.
10. **No mistakes, no average work** — top-tier execution everywhere.

---

## 2. Non-negotiables (definition of done)

A page is "done" only when ALL of these are true:

- [ ] Lighthouse mobile: **Performance ≥ 92, Accessibility ≥ 95, Best Practices ≥ 100, SEO 100**
- [ ] LCP < 2.0s on 4G mobile, CLS < 0.05, INP < 200ms
- [ ] All copy is original, geo-targeted, and SEO-keyword-mapped (per `07-SEO-STRATEGY.md`)
- [ ] Has JSON-LD structured data appropriate to page type
- [ ] Renders perfectly at 320px, 375px, 414px, 768px, 1024px, 1440px, 1920px, 2560px
- [ ] Has a defined motion behavior (entrance + scroll) per `06-ANIMATION-STRATEGY.md`
- [ ] Honors `prefers-reduced-motion` — every animation has a static fallback
- [ ] CMS-driven: no hard-coded gallery/text that the client might want to change in 6 months
- [ ] Keyboard accessible: tab order, focus rings, ARIA where needed
- [ ] OG image, page title, meta description set via Next.js metadata API
- [ ] Works with JavaScript disabled to the extent that core content + CTA remain reachable

---

## 3. Phases

### Phase 0 — Planning & sign-off (THIS PHASE)
Outputs: this folder of `.md` files. **No code yet.** Owner reviews, redirects, approves.

### Phase 1 — Foundation (Sprint 1)
- `create-next-app` with TS, Tailwind v4, App Router
- shadcn/ui init, base tokens
- Lenis smooth scroll, GSAP install, motion primitives
- Font loading strategy (Cormorant + Inter for Latin; Noto Serif/Sans Devanagari for `/hi/*` routes per `DECISIONS.md` D-003)
- Layout shell: header (transparent → solid on scroll), footer, sticky WhatsApp, command-K omnibar (admin only)
- Design system page at `/_design` (internal): tokens, type scale, components, motion samples
- Tailwind v4 theme + CSS variables for light/dark
- Image placeholder system using BlurDataURL + LQIP

### Phase 2 — CMS spine (Sprint 2)
- Payload CMS 3 mounted at `/admin`
- Neon Postgres provisioned via Vercel Marketplace
- Vercel Blob storage adapter for Payload media
- Collections: Services, Projects, Galleries, Packages, Testimonials, Posts, FAQs, Inquiries, SiteSettings
- Role: `admin` (owner), `editor` (assistant). Owner-only fields for pricing.
- Seed script with all event categories + sample content
- Mobile-first admin UI styling tweaks

### Phase 3 — Marketing pages (Sprints 3–4)
- Home (cinematic hero, services rail, signature work, testimonials, contact CTA)
- About (story, philosophy, team, behind the scenes)
- Services index + individual service templates × ~15 event types
- Portfolio index + case study template
- Pricing (3 packages per event category, customizable)
- Blog index + post template
- Contact (multi-step inquiry form, WhatsApp deep link, map, hours)

### Phase 4 — Motion & polish (Sprint 5)
- Hero parallax + cursor magnetism
- Scroll-pinned service showcase
- Masked image reveals
- Text scramble / split-text reveals on headings
- Gallery: justified grid + lightbox with shared-element transition
- 404 page that feels like part of the brand
- Loading state choreography (route transitions)

### Phase 5 — SEO + Launch (Sprint 6)
- All structured data (LocalBusiness, Service, Event, ImageGallery, Review, BreadcrumbList, FAQ)
- Dynamic OG images per service/post
- Sitemap, robots, IndexNow
- Google Business Profile linkage
- Google Search Console + Analytics + Vercel Analytics
- **English + Hindi shipped from launch** via `next-intl` (per `DECISIONS.md` D-003); Bengali (`/bn`) hook reserved for post-launch activation
- Domain, SSL, redirects, performance audit, soft launch, hard launch

---

## 4. What I need from you (the owner)

To unblock execution after planning approval:

1. **Tech choices already locked** in [DECISIONS.md](./docs/DECISIONS.md) — Payload CMS 3 (D-001), bilingual EN+HI at launch (D-003). Review [02-TECH-STACK.md](./docs/02-TECH-STACK.md) for full rationale; no decisions outstanding.
2. **Approve brand direction** in [01-PROJECT-VISION.md](./docs/01-PROJECT-VISION.md) and design tokens in [03-DESIGN-SYSTEM.md](./docs/03-DESIGN-SYSTEM.md).
3. **Provide Gemini image prompts** — paste them into [09-IMAGE-PROMPTS.md](./docs/09-IMAGE-PROMPTS.md). Section headings are already laid out so you know how many images we need and what each is for.
4. **Provide real business info** — phone, WhatsApp, address, email, owner name, founding year, hours, social handles, GST/business registration if you want to publish. Until provided I'll use clearly-marked `TODO` placeholders.
5. **Confirm domain** — `siligurievent.com` / `siligurievent.com` / `siligurievent.com`? I'll register or you'll provide.

---

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Generated images look "AI" — kill credibility | Image curation pass: cinematic prompts only, mood-rich grading, real-event references; later swap for real client shoots when available |
| Animation overload kills perf | Strict motion budget, `prefers-reduced-motion`, lazy-mount heavy effects, JS budget per route |
| Owner finds CMS too complex | Custom Payload admin dashboard tailored to their actual workflows; recorded Loom walkthrough on launch |
| Indian mobile networks slow | Aggressive image optimization, AVIF/WebP, route-level code splitting, edge cache for static pages, ISR for blog |
| Awwwards-level look gets bland in browser | Live iteration with `impeccable` + `ui-motion` skills; awwwards reference board in design doc |
| SEO competition (local decorators) | Programmatic location × event landing pages (Siliguri × Wedding, Bagdogra × Reception, etc.) + heavy schema markup |

---

## 6. Open questions for the owner

1. ~~Should we offer **English only**, or also **Hindi + Bengali** at launch?~~ **Resolved (`DECISIONS.md` D-003):** English + Hindi from launch; Bengali post-launch.
2. ~~Should we publish **prices on the site** or "request quote"?~~ **Resolved (`DECISIONS.md` D-002):** hybrid bands (₹ / ₹₹ / ₹₹₹) — no specific INR figures publicly.
3. Do you want a **blog** at launch or post-launch? (default plan: structure ready, 6 seed posts at launch for SEO)
4. WhatsApp: **personal number or business API**? (default plan: WhatsApp Business click-to-chat link)
5. Booking form: **multi-step wizard** or **one long form**? (default plan: 3-step wizard — Event Type → Date/Guests → Contact)

I'll proceed with the defaults above unless you tell me otherwise.
