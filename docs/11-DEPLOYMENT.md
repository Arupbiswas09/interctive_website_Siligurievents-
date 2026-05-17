# 11 — Deployment

How this site goes from code to a live, fast, monitored production deployment on Vercel.

## 11.1 High-level

- **Platform**: Vercel (Fluid Compute, Node 24 LTS).
- **Repo**: GitHub → connected to Vercel project `siligurievent`.
- **Branching**: `main` → production, all other branches → preview deploys.
- **Region**: `bom1` (Mumbai) primary, `sin1` (Singapore) fallback.
- **Database**: Neon Postgres (Vercel Marketplace integration, branched per preview).
- **Media**: Vercel Blob (public bucket for gallery, private for unpublished drafts).
- **Email**: Resend with domain authentication.
- **Domain**: TBD by owner (recommendation: `siligurievent.com` if available, else `siligurievent.com` / `.in`).

## 11.2 First-time setup checklist

Phase 1 setup (before any code that needs them):

- [ ] Create Vercel team / project linked to GitHub repo.
- [ ] Provision Neon Postgres via **Vercel Marketplace** (one-click). Auto-injects env vars.
- [ ] Enable **Vercel Blob** storage. Auto-injects `BLOB_READ_WRITE_TOKEN`.
- [ ] Create **Resend** account, verify sender domain.
- [ ] Buy domain (owner-owned registrar) and add to Vercel.
- [ ] Configure DNS at Vercel for the apex + `www` (auto-redirect to apex).
- [ ] Enable **Vercel Analytics** + **Speed Insights**.
- [ ] Create **Google Search Console** property + **GA4** property. Add verification meta tag.
- [ ] Create **Google Business Profile** (owner).
- [ ] Create social accounts placeholders (Instagram handle, YouTube channel).

> Will be orchestrated via the `vercel-plugin:bootstrap` skill at scaffolding time.

## 11.3 Environment variables

### Production
```
# Database (auto from Neon integration)
DATABASE_URL=postgres://...

# Vercel Blob (auto from Blob integration)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Payload
PAYLOAD_SECRET=<random 32-byte hex>
PAYLOAD_PUBLIC_SERVER_URL=https://siligurievent.com
NEXT_PUBLIC_SERVER_URL=https://siligurievent.com

# Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@siligurievent.com
INQUIRY_NOTIFY_EMAIL=owner@siligurievent.com

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# IndexNow
INDEXNOW_KEY=<random>

# Site
NEXT_PUBLIC_SITE_NAME=Siligurievent
```

### Preview
Same as production but:
- `DATABASE_URL` → Neon branch per preview (auto)
- `PAYLOAD_PUBLIC_SERVER_URL` → preview URL
- `RESEND_API_KEY` → optional test key OR same with `EMAIL_DISABLED=1`

### Development
Pulled via `vercel env pull .env.local`.

## 11.4 Deploy workflow

### Day-to-day
1. Developer creates branch → opens PR.
2. Vercel auto-builds preview deployment.
3. Owner reviews preview URL on phone, comments on PR.
4. Merge to `main` → production deploy.
5. Vercel hooks Payload → invalidates affected routes.

### Production deploy gates
- Lighthouse CI passes on PR.
- Type check passes.
- Linter passes.
- Tests pass.
- Bundle size under limits.
- Preview deploy "Looks good" comment from owner on PR (for content-affecting changes).

### Rolling releases (Vercel feature, GA June 2025)
- For risky changes (new hero, major redesign): roll to 10% → 50% → 100% over 24 hours with automatic rollback if Web Vitals or error rates degrade.
- Configured per release via Vercel UI.

### To-do for Sprint 2 — `withPayload` wrapper on `next.config.ts`

> **Action item for the main agent when Sprint 2 (CMS spine) starts:** the Payload-on-Next-16 mount will not boot unless `next.config.ts`'s default export is wrapped with `withPayload(...)` from `@payloadcms/next/withPayload`. The current scaffold's `next.config.ts` does **NOT** apply this wrapper. Pattern:
>
> ```ts
> // next.config.ts
> import { withPayload } from "@payloadcms/next/withPayload";
> const nextConfig: NextConfig = { /* ... */ };
> export default withPayload(nextConfig);
> ```
>
> Add this in the same PR that mounts Payload at `/(payload)/admin` and `/(payload)/api`. Failing to wrap will surface as a missing-route 404 on `/admin` and obscure runtime errors.

## 11.5 Marketplace integrations setup order

Order matters — later steps depend on earlier ones.

1. **Neon Postgres** (Vercel Marketplace) → DATABASE_URL.
2. **Vercel Blob** → BLOB_READ_WRITE_TOKEN.
3. **Resend** → RESEND_API_KEY (DNS verification: SPF, DKIM, DMARC).
4. **(Optional Phase 6) Clerk or built-in Payload auth** — currently Payload's own auth covers admin.
5. **Sentry** (optional) → SENTRY_DSN.

## 11.6 DNS & domain

At Vercel domains:
- Apex `siligurievent.com` → Vercel ALIAS.
- `www.siligurievent.com` → 301 redirect to apex.
- `admin.siligurievent.com` (optional separate subdomain for admin) → currently not used; admin at `/admin` is fine.

Email DNS:
- MX records → owner's email provider (Google Workspace or Zoho).
- SPF / DKIM / DMARC → Resend for transactional + email provider for inbound.

## 11.7 Storage architecture

**Vercel Blob — public bucket `media/`**
```
media/
  services/
    [service-slug]/
      hero.jpg
      detail-01.jpg
  projects/
    [project-slug]/
      cover.jpg
      chapters/
        day-1/
          01.jpg
  testimonials/
  posts/
  about/
  motifs/
```

**Vercel Blob — private bucket `drafts/`**
- Unpublished media (drafts in Payload).

**Vercel Blob — private bucket `inquiries/`**
- Form attachments if we ever add file upload (post-launch).

### Memory considerations — HEIC upload pipeline on Fluid Compute

HEIC decoding via Sharp (`libheif`) can require **>256 MB peak memory on the first cold start** of an upload function; a 12 MB iPhone HEIC plus 12 Sharp-generated variants (4 sizes × 3 formats) pushes transient peak to ~400 MB and 3–8s wall time. The owner's typical workflow — batch-upload 10–30 photos from her phone after an event — will hit cold-start OOM and timeouts unless we:

1. **Route uploads through a dedicated `/api/upload`** Function configured with `maxDuration: 60`, `memory: 1024` MB, and `regions: ['bom1']`.
2. **Process variants in the background** — return immediately with a "processing" state, enqueue Sharp work to a Vercel Queue (or a separate background Function with `runtime: 'nodejs'`), and revalidate the admin view once variants exist.
3. **Cap resolution at ingress** (e.g. reject originals > 6000×6000 px) and keep the existing 12 MB file cap.
4. **Optional: client-side HEIC → JPG** via `heic2any` in the admin upload page, so the server only ever sees JPEG.

See [10-PERFORMANCE.md §10.2 "Memory considerations"](./10-PERFORMANCE.md) for the matching frontend/CMS view. This must be agreed before Sprint 2 implements the Payload upload field — discovering it at owner-test time will be too late.

## 11.8 Email transactional setup

### Templates (React Email)
1. **`InquiryReceivedToOwner.tsx`** — to the owner when an inquiry comes in.
2. **`InquiryConfirmToVisitor.tsx`** — auto-reply to the visitor.
3. **`NewsletterWelcome.tsx`** — newsletter subscribe confirmation.

### Sender
- `hello@siligurievent.com` for transactional.
- Owner can reply directly from this address.

### WhatsApp notification clarification

**Resend sends EMAIL only.** It does not send WhatsApp messages, despite informal earlier wording. There is no Resend → WhatsApp bridge feature.

For the inquiry-notification flow, we have two honest options:

1. **Launch option (default)** — `InquiryReceivedToOwner.tsx` includes a prominent **`wa.me` deep link** in the email body (e.g. `https://wa.me/91XXXXXXXXXX?text=Inquiry%20from%20{name}%20—%20{eventType}%20on%20{date}`). The owner taps the link on her phone and a pre-filled WhatsApp chat opens to the visitor's number. No additional API integration, no Meta approvals.
2. **Post-launch option** — integrate **WhatsApp Business Cloud API** (Meta Business Manager) with an approved template message. Requires: Meta Business verification, a dedicated Cloud API phone number (not the owner's personal +91 number), template submission + approval (1–2 weeks). Budgeted as a separate Sprint 7+ stream, not in the launch scope.

The launch ships **option 1**. Update the [12-ROADMAP.md](./12-ROADMAP.md) post-launch table for the option-2 stream.

## 11.9 Backup strategy

Per [08-CMS-PLAN.md](./08-CMS-PLAN.md):

- **Neon Postgres**: point-in-time recovery; daily snapshot retained 30 days.
- **Vercel Blob**: weekly export to S3 (post-launch, optional).
- **Code**: GitHub primary, GitLab mirror (cron sync via Actions, optional).
- **Recovery drill**: documented runbook tested once before launch.

## 11.10 Monitoring & alerts

| Signal | Tool | Alert channel |
|---|---|---|
| Build failure | Vercel | Email + Slack/Discord |
| Production error rate spike | Sentry | Slack |
| Web Vitals degradation | Vercel Speed Insights | Email weekly digest |
| Payload form submission failure | Resend / Sentry | Email immediate |
| Domain SSL expiry | Vercel | Auto-renewed |
| Blob storage 80% quota | Manual quarterly review | — |
| Database 80% quota | Neon | Email |

## 11.11 Security

- All env vars stored in Vercel encrypted store.
- No secrets in repo; pre-commit hook scans (gitleaks).
- Payload admin behind auth, rate-limited.
- HTTPS enforced (HSTS).
- CSP headers via `next.config.ts`.
- Form spam: hCaptcha or Cloudflare Turnstile on inquiry submit.
- Rate limit `/api/inquiry`: 5 req/min/IP.
- CORS strict on API routes.
- Image upload validation: max 12 MB, MIME-type whitelist, EXIF strip.

## 11.12 Launch day runbook

T-7 days:
- Full content audit by owner.
- All TODOs in copy resolved.
- Final Lighthouse pass.
- Test inquiry → notification flow end-to-end.
- WhatsApp number live, test message replied.

T-1 day:
- Run staging on production-equivalent data.
- Verify all schemas via Google Rich Results Test.
- Submit sitemap to Google Search Console + Bing Webmaster.
- Schedule social announcements.
- Owner walkthrough recorded.

T-0 (launch):
- Merge to `main`, deploy.
- Verify production deploy: 5 random pages spot-checked on phone.
- Notify Google via Indexing API + IndexNow.
- Owner posts launch announcements.

T+1 day:
- Web Vitals check.
- Inquiry form spot-test.
- Review Sentry for any errors.

T+7 days:
- Search Console: indexed page count.
- First-week traffic review.
- Owner check-in.

## 11.13 Post-launch routines

| Cadence | Task |
|---|---|
| Daily | Owner: check inquiries inbox, reply on WhatsApp |
| Weekly | Developer: GSC review, Speed Insights, Sentry triage |
| Bi-weekly | Owner: add 1 new portfolio project |
| Monthly | Developer: dependency updates, Lighthouse audit, GSC top-pages review |
| Quarterly | Both: full site audit, Web Vitals deep-dive, content refresh |
