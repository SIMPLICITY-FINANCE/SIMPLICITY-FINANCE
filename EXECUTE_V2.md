# SIMPLICITY-FINANCE Execution Plan V2 (Post Phase 8)

**Status:** Phases 4–8 Complete | Production Readiness Mode  
**Branch:** `feat/robot-v0`  
**Last Updated:** 2026-02-01

---

## Current State Snapshot

### Features Delivered (Phases 4–8)
- **Phase 4 - Admin MVP:** Admin dashboard, approvals workflow with audit logging
- **Phase 5 - Public UI MVP:** Dashboard feed, episode detail with evidence chips, saved/notebook distinction
- **Phase 6 - Reports MVP:** Weekly reports aggregating approved summaries
- **Phase 7 - Search V1:** Keyword search across episode titles and summary bullets
- **Phase 8 - Hardening:** Operations dashboard with system statistics and cleanup tools

### Pages Built (12 total)
1. `/` - Home with navigation
2. `/dashboard` - Feed with search bar
3. `/saved` - Saved episodes
4. `/notebook` - Saved bullets
5. `/reports` - Reports list
6. `/search` - Keyword search
7. `/episode/[id]` - Episode detail with bullets and evidence
8. `/admin` - Admin dashboard
9. `/admin/approvals` - Approvals workflow
10. `/admin/ops` - Operations monitoring
11. `/dev/login` - Dev auth (temporary)
12. `/unauthorized` - Access denied

### Demo Data
- **Command:** `npm run db:seed:demo`
- **Contents:** 5 episodes (4 approved, 1 pending), 40 bullets, 3 shows, 1 report
- **Idempotent:** Safe to run multiple times

---

## Non-Negotiables (Invariants)

1. **Idempotency:** All ingestion/processing steps must be safely re-runnable
2. **Error Persistence:** Failed runs write `error.json` with structured error info
3. **Production Safety:** No dev routes (`/dev/*`) accessible in production; no build-time DB calls
4. **Approvals-Only Public:** Only approved summaries appear in dashboard/search/reports
5. **Evidence Grounding:** All bullets must have `evidence_spans` linking to transcript timestamps
6. **Schema-First:** Database schema is source of truth; migrations are versioned and reversible
7. **No Silent Failures:** All async workflows must surface errors to ops dashboard

---

## Next Milestones (Priority Order)

### MILESTONE 1 — Regression Prevention (1–2 days) 🔴 HIGHEST PRIORITY
**Goal:** Stop breaking the app with small refactors.

**Deliverables:**
- [ ] Minimal smoke tests covering critical pages:
  - Home loads (200)
  - Dashboard shows approved episodes
  - Search returns results for seeded keywords
  - Episode detail renders bullets with evidence
  - Admin redirects to /unauthorized for non-admin
- [ ] GitHub Actions CI workflow:
  - Docker Compose PostgreSQL
  - Run migrations
  - Seed demo data
  - Execute tests
  - Fail PR on regression

**Acceptance Criteria:**
- ✅ PRs run CI automatically and fail on regressions
- ✅ Seeded demo guarantees deterministic, non-empty dashboard/search
- ✅ CI completes in <5 minutes

---

### MILESTONE 2 — Production Deployment Baseline (1–2 days)
**Goal:** First deploy that is safe and observable.

**Deliverables:**
- [ ] Environment guide documenting required env vars:
  - `DATABASE_URL` (production Postgres)
  - `NEXTAUTH_SECRET` (placeholder for now)
  - `DEEPGRAM_API_KEY`
  - `YOUTUBE_API_KEY`
- [ ] Production safety guards:
  - `/dev/*` routes unreachable (compile-time guard)
  - Auth disabled safely with clear warnings
  - No DB calls at build-time that crash
- [ ] Health check route `/api/health`:
  - Verify DB connectivity
  - Return JSON with status + version
  - 200 OK if healthy, 503 if DB unreachable

**Acceptance Criteria:**
- ✅ "Deploy checklist" documented and repeatable
- ✅ Production returns correct statuses without manual intervention
- ✅ Health check accessible for monitoring

---

### MILESTONE 3 — Real Authentication (2–4 days)
**Goal:** Replace dev-cookie identity with real auth without overbuilding.

**Deliverables:**
- [ ] Choose minimal auth approach:
  - **Option A:** NextAuth.js with Google OAuth
  - **Option B:** Clerk (fastest setup)
  - Decision: Pick whichever is fastest to integrate
- [ ] Admin-only gating tied to `users.role` in DB
- [ ] Remove `/dev/login` or keep behind `process.env.NODE_ENV === 'development'` guard
- [ ] Update `requireAdmin()` to use real session

**Acceptance Criteria:**
- ✅ Admin flows work with real login
- ✅ No identity relies on unsigned cookies
- ✅ Non-admin users see appropriate access denied messages

---

### MILESTONE 4 — Real Data Ingestion Scheduling (2–5 days)
**Goal:** Automatically ingest new episodes (RSS/YouTube) into the workflow.

**Deliverables:**
- [ ] Shows have source configuration:
  - Add `feed_url` or `youtube_playlist_id` to `shows` table
  - Support RSS and YouTube channel/playlist sources
- [ ] Scheduled fetch job (Inngest scheduled event):
  - Runs daily (configurable interval)
  - Fetches new episodes from configured sources
  - Creates `episodes` records for new content
  - Triggers workflow for each new episode
- [ ] Idempotency enforcement:
  - Unique constraint on `video_id` prevents duplicates
  - Retries are safe (check existing records first)

**Acceptance Criteria:**
- ✅ New episodes appear without manual triggers
- ✅ Ingest duplicates are prevented by unique keys
- ✅ Failed ingests are logged and retryable

---

### MILESTONE 5 — Operational Hardening (2–5 days, parallelizable)
**Goal:** Make it debuggable and safe to run continuously.

**Deliverables:**
- [ ] Error surfacing in ops dashboard:
  - Last 20 failures list with error messages
  - Link to Inngest run details
  - Retry/reprocess actions
- [ ] Rate limiting / quotas:
  - Per-show daily episode limit (prevent runaway costs)
  - Search rate limiting (prevent abuse)
  - Track usage in `user_usage_ledger` table
- [ ] Data lifecycle tools:
  - Delete episode fully (cascade to summaries, bullets, QC, etc.)
  - Reset demo data command
  - Archive old episodes (soft delete)
- [ ] Observability:
  - Structured logs (JSON format)
  - Basic metrics: episode counts, processing durations, failure rates
  - Inngest event tracking

**Acceptance Criteria:**
- ✅ Can answer "what failed, when, why, how to retry?" in <2 minutes
- ✅ Cost controls prevent runaway API usage
- ✅ Data cleanup is safe and auditable

---

### MILESTONE 6 — Documentation & Developer UX (1–2 days)
**Goal:** Anyone can run it locally and contribute safely.

**Deliverables:**
- [ ] README "Quickstart":
  - Prerequisites (Node, Docker, API keys)
  - Database setup (`docker compose up`, migrations)
  - Seed demo data
  - Start dev servers (Next.js, Inngest)
- [ ] "How the pipeline works" doc:
  - Episode → Transcript → Summary → QC → Approvals → Public
  - Inngest workflow diagram
  - Database schema overview
- [ ] API docs for key routes/events:
  - Server actions documentation
  - Inngest event signatures
  - Database query patterns

**Acceptance Criteria:**
- ✅ Fresh machine bootstrap succeeds using docs only
- ✅ New contributors understand the pipeline flow
- ✅ API contracts are documented

---

## PR Plan (Next 3 PRs)

### PR #1: Smoke Tests + CI
**Scope:**
- Add Playwright or Vitest for smoke tests
- Test critical pages (dashboard, search, episode, admin)
- GitHub Actions workflow with PostgreSQL
- Seed demo data in CI
- Run tests and fail on regression

**Files:**
- `.github/workflows/ci.yml`
- `tests/smoke/` (new directory)
- `package.json` (add test scripts)

**Acceptance:** CI passes on current code, fails if dashboard breaks

---

### PR #2: Production Deployment Baseline
**Scope:**
- Environment guide in `docs/DEPLOYMENT.md`
- Production safety guards for `/dev/*` routes
- Health check route `/api/health`
- Vercel deployment config

**Files:**
- `docs/DEPLOYMENT.md` (new)
- `app/api/health/route.ts` (new)
- `middleware.ts` (production guards)
- `vercel.json` (deployment config)

**Acceptance:** Can deploy to Vercel staging without errors

---

### PR #3: Real Authentication (NextAuth.js)
**Scope:**
- Install and configure NextAuth.js
- Google OAuth provider
- Update `requireAdmin()` to use NextAuth session
- Remove or guard `/dev/login`
- Update all admin pages to use real auth

**Files:**
- `app/api/auth/[...nextauth]/route.ts` (new)
- `lib/auth.ts` (update)
- `middleware.ts` (session checks)
- All admin pages (update imports)

**Acceptance:** Admin flows work with Google login, dev auth removed

---

## Release Checklist

### Local Verification
- [ ] `npm run db:seed:demo` succeeds
- [ ] All pages load without errors
- [ ] Search returns results
- [ ] Episode detail shows bullets
- [ ] Admin approvals workflow works
- [ ] Ops dashboard displays stats

### CI Verification
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Build succeeds

### Production Verification
- [ ] Health check returns 200
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] `/dev/*` routes return 404
- [ ] Admin auth works
- [ ] Public pages accessible
- [ ] No console errors in browser

---

## Risks & Mitigations

### Risk: Auth Implementation Complexity
**Impact:** Could take 1+ weeks if we overengineer  
**Mitigation:** Use NextAuth.js with single OAuth provider (Google); defer role management to Phase 2

### Risk: Data Duplication in Ingestion
**Impact:** Duplicate episodes waste API credits and storage  
**Mitigation:** Enforce unique constraints on `video_id`; check existence before creating records

### Risk: Cost Blowups from Runaway Processing
**Impact:** Deepgram/OpenAI costs could spike unexpectedly  
**Mitigation:** Implement per-show daily quotas; alert on unusual usage patterns

### Risk: Silent Failures in Async Workflows
**Impact:** Episodes stuck in "processing" with no error visibility  
**Mitigation:** Ops dashboard shows last failures; Inngest retry policies with exponential backoff

### Risk: Production DB Migration Failures
**Impact:** Downtime or data loss  
**Mitigation:** Test migrations on staging DB first; keep rollback scripts; use Drizzle's migration safety features

### Risk: Search Performance Degradation
**Impact:** Slow searches as data grows  
**Mitigation:** Add database indexes on `youtube_title`, `bullet_text`; implement result pagination

---

## What NOT to Build Yet

**Phase 9+ Features (Defer Until Milestones 1–6 Complete):**
- ❌ Widgets
- ❌ Chatbot
- ❌ Mobile app
- ❌ File uploads
- ❌ Advanced search (semantic, hybrid ranking)
- ❌ User profiles
- ❌ Social features

**Rationale:** Production readiness and regression prevention have higher ROI than new features.

---

## Success Metrics

**By End of Milestone 6:**
- ✅ CI prevents regressions (0 broken deploys)
- ✅ Production deployment is repeatable (<30 min)
- ✅ Real auth protects admin routes
- ✅ New episodes ingest automatically
- ✅ Ops can debug failures in <2 minutes
- ✅ New contributors can run locally in <15 minutes

---

**Next Action:** Start Milestone 1 (Smoke Tests + CI)
