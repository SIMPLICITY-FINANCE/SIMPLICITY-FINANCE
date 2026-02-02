# SIMPLICITY FINANCE - Execution Plan v1.1+

**Status:** Active roadmap for post-v1.0.0 development  
**Timeline:** 2-4 weeks (February-March 2026)  
**Current Version:** v1.0.0 (Production Baseline)

---

## Overview

This document outlines the execution plan for SIMPLICITY FINANCE v1.1 and beyond. All v1.0 milestones are complete and the application is live in production. The focus now shifts to:

1. **Production stabilization** - Observability, error tracking, and operational excellence
2. **Data pipeline hardening** - Retry logic, idempotency verification, structured error outputs
3. **Batch report generation** - Daily aggregated reports from ~40 summaries
4. **Chatbot MVP** - RAG-based Q&A over transcripts and summaries
5. **Right rail enhancements** - Real data wiring and widget functionality

---

## Environment Separation Strategy

### Local Development
- **Database:** Docker PostgreSQL (`localhost:5432`)
- **Environment:** `.env.local` file
- **Safety:** DB write scripts have guardrails (see `scripts/lib/db-safety.ts`)
- **Override:** Set `ALLOW_PROD_DB_WRITE=1` to intentionally write to production

### Production
- **Database:** Supabase PostgreSQL (pooled connection on port 6543)
- **Environment:** Vercel environment variables
- **Deployment:** Automatic on push to `main` via Vercel
- **Migrations:** Run manually with production DATABASE_URL

### Key Principles
1. **Never run destructive scripts against production** without explicit override
2. **Always test migrations locally first** with Docker PostgreSQL
3. **Use Vercel Preview deployments** to verify changes before merging to main
4. **Keep `.env.local` pointing to localhost** by default
5. **Document all production changes** in deployment runbook

---

## Milestone 1: Production Stabilization & Observability

**Objective:** Establish operational visibility and error tracking to catch issues before users report them.

**Definition of Done:**
- [ ] Structured logging implemented (Winston or Pino)
- [ ] Error tracking integrated (Sentry or similar)
- [ ] Daily ops review process documented
- [ ] Basic alerting configured (email/Slack on critical errors)
- [ ] Health check expanded with detailed diagnostics

**Risks:**
- Third-party service costs (Sentry free tier may be sufficient)
- Alert fatigue if thresholds not tuned properly
- Performance impact of verbose logging

**Tasks (PR-sized):**
1. **Add structured logging library**
   - Install Winston or Pino
   - Create logger utility in `app/lib/logger.ts`
   - Replace `console.log` in critical paths (auth, DB queries, Inngest functions)
   - Add request ID tracking for trace correlation

2. **Integrate error tracking**
   - Set up Sentry project (or alternative)
   - Add Sentry SDK to Next.js (`sentry.client.config.ts`, `sentry.server.config.ts`)
   - Configure error boundaries in React components
   - Add Sentry integration to Inngest functions

3. **Expand health check endpoint**
   - Add `/api/health/detailed` with:
     - Database connection pool status
     - Inngest connectivity check
     - External API health (YouTube, Deepgram, OpenAI)
     - Recent error count (last 1 hour)
   - Keep `/api/health` simple for uptime monitoring

4. **Document ops review process**
   - Create `docs/OPS_RUNBOOK.md`
   - Daily checklist: review errors, check Inngest failures, verify ingestion
   - Weekly checklist: review usage metrics, check storage costs
   - Incident response procedures

5. **Configure basic alerting**
   - Set up email/Slack webhook for critical errors
   - Alert on: DB connection failures, Inngest function failures >5 in 1 hour, API quota exhaustion
   - Document alert thresholds in ops runbook

---

## Milestone 2: Data Pipeline Hardening

**Objective:** Make the episode processing pipeline more resilient with retry logic, idempotency verification, and structured error outputs.

**Definition of Done:**
- [ ] Inngest functions have retry policies configured
- [ ] Idempotency verification tests added
- [ ] Structured error outputs stored in database
- [ ] QC audit trail tracks all quality check decisions
- [ ] Pipeline failure recovery documented

**Risks:**
- Retry logic may cause duplicate API charges if not idempotent
- Error storage may grow unbounded without cleanup policy
- Complex retry scenarios may be hard to test

**Tasks (PR-sized):**
1. **Configure Inngest retry policies**
   - Add retry configuration to `processEpisode` function
   - Exponential backoff for transient failures (API rate limits, network errors)
   - No retry for permanent failures (invalid video ID, missing audio)
   - Document retry behavior in `docs/PIPELINE.md`

2. **Add idempotency verification**
   - Create test script: `scripts/verify-idempotency.ts`
   - Test: run same episode through pipeline twice, verify no duplicates
   - Add unique constraints to DB schema if missing
   - Document idempotency guarantees in API.md

3. **Structured error outputs**
   - Create `pipeline_errors` table:
     - `id`, `episode_id`, `step` (ingest/transcribe/summarize/qc), `error_type`, `error_message`, `metadata`, `created_at`
   - Store errors in DB instead of just logging
   - Add error retrieval to admin ops dashboard
   - Add cleanup policy: delete errors >30 days old

4. **QC audit trail**
   - Extend `qc_runs` table with:
     - `decision` (approved/rejected/needs_review)
     - `decision_reason` (why QC passed/failed)
     - `reviewed_by` (admin user ID if manually reviewed)
     - `reviewed_at`
   - Add QC history view to admin episode detail page
   - Document QC criteria in `docs/PIPELINE.md`

5. **Pipeline failure recovery**
   - Create `scripts/retry-failed-episodes.ts`
   - Query episodes stuck in processing state >1 hour
   - Allow manual retry from admin ops dashboard
   - Document recovery procedures in `docs/OPS_RUNBOOK.md`

---

## Milestone 3: Daily Batch Report Generation

**Objective:** Generate one aggregated report from ~40 daily episode summaries and make it viewable in `/reports`.

**Definition of Done:**
- [ ] Scheduled job generates daily batch report
- [ ] Report artifact stored (Supabase Storage or DB)
- [ ] `reports` table has metadata row for each batch report
- [ ] `/reports` page displays batch reports
- [ ] Report generation is idempotent (re-running same day updates existing report)

**Risks:**
- OpenAI API costs for summarizing 40 summaries
- Storage costs for report artifacts
- Report quality may vary with different episode mixes

**Tasks (PR-sized):**
1. **Design report schema**
   - Extend `reports` table:
     - `id`, `type` (daily_batch/weekly/monthly), `date`, `title`, `summary`, `artifact_url`, `episode_count`, `created_at`
   - Create `report_episodes` junction table:
     - `report_id`, `episode_id` (track which episodes contributed to report)
   - Add migration: `npm run db:generate`, `npm run db:push`

2. **Create batch report generation function**
   - New Inngest function: `inngest/functions/generateDailyReport.ts`
   - Query approved episodes from last 24 hours
   - Aggregate summaries into single prompt
   - Call OpenAI to generate meta-summary
   - Store result in `reports` table
   - Make idempotent: check if report exists for date, update if re-run

3. **Store report artifacts**
   - Option A: Store in `reports.summary` column (text field)
   - Option B: Upload to Supabase Storage, store URL
   - Recommendation: Start with Option A (simpler), migrate to B if reports get large
   - Add artifact retrieval helper: `app/lib/reports.ts`

4. **Schedule daily report generation**
   - Add cron trigger to `generateDailyReport` function
   - Run at 3 AM UTC (after scheduled ingestion at 2 AM)
   - Add to `inngest/functions.ts` exports
   - Test with manual trigger first

5. **Display batch reports in UI**
   - Update `/reports` page to query `reports` table
   - Show batch reports in separate section from weekly/monthly
   - Add filter: daily/weekly/monthly
   - Link to individual episodes that contributed to report
   - Add "Regenerate" button for admins (re-runs report for that date)

---

## Milestone 4: Chatbot MVP (RAG over Transcripts + Summaries)

**Objective:** Build a minimal viable chatbot that can answer questions about episode content using retrieval-augmented generation.

**Definition of Done:**
- [ ] Embedding strategy defined (what gets embedded)
- [ ] Vector storage configured (Supabase pgvector or Pinecone)
- [ ] Retrieval function implemented
- [ ] Chat UI route created (`/chat`)
- [ ] Auth gating enforced (logged-in users only)
- [ ] Basic conversation history stored

**Risks:**
- Embedding costs (OpenAI embeddings API)
- Vector DB performance at scale
- RAG quality may be poor without tuning
- Conversation context management complexity

**Tasks (PR-sized):**
1. **Design embedding strategy**
   - What to embed:
     - Option A: Full transcripts (chunked into 500-word segments)
     - Option B: Summary bullets only
     - Option C: Both (hybrid retrieval)
   - Recommendation: Start with Option B (bullets), add A later
   - Document in `docs/CHATBOT_DESIGN.md`

2. **Set up vector storage**
   - Option A: Supabase pgvector extension
   - Option B: Pinecone (managed vector DB)
   - Recommendation: Supabase pgvector (already using Supabase)
   - Create `embeddings` table:
     - `id`, `episode_id`, `bullet_id`, `content`, `embedding` (vector), `created_at`
   - Add migration and enable pgvector extension

3. **Generate embeddings for existing content**
   - Create script: `scripts/generate-embeddings.ts`
   - Query all approved episode bullets
   - Call OpenAI embeddings API (`text-embedding-3-small`)
   - Store in `embeddings` table
   - Add to episode processing pipeline (generate embeddings after QC approval)

4. **Implement retrieval function**
   - Create `app/lib/chatbot/retrieval.ts`
   - Function: `retrieveRelevantContext(query: string, limit: number)`
   - Embed user query
   - Query `embeddings` table with cosine similarity
   - Return top N bullets with episode metadata
   - Add caching to avoid re-embedding same queries

5. **Build chat UI**
   - Create `/chat` route
   - Simple chat interface (input box, message history)
   - Auth gate: redirect to login if not authenticated
   - Call retrieval function on user message
   - Pass retrieved context + user message to OpenAI chat completion
   - Stream response to UI
   - Store conversation in `chat_sessions` table (optional for MVP)

6. **Add conversation history**
   - Create `chat_sessions` table:
     - `id`, `user_id`, `created_at`
   - Create `chat_messages` table:
     - `id`, `session_id`, `role` (user/assistant), `content`, `created_at`
   - Store messages as user chats
   - Load recent session on `/chat` page load
   - Add "New Chat" button to start fresh session

---

## Milestone 5: Right Rail Enhancements

**Objective:** Wire right rail widgets to real data and add refresh/revalidate functionality.

**Definition of Done:**
- [ ] "Up Next" shows real episodes (recent approved + followed shows)
- [ ] "Suggestions" shows real shows/people
- [ ] Refresh button triggers revalidation
- [ ] Quick actions (News/Calendar/Markets) have stub pages or external links
- [ ] All widgets respect user preferences (followed shows/people)

**Risks:**
- Performance impact of real-time queries
- User preference management complexity
- External API integrations for quick actions may be out of scope

**Tasks (PR-sized):**
1. **Wire "Up Next" to real data**
   - Query recent approved episodes from followed shows
   - Fallback: recent approved episodes if no follows
   - Limit to 5 items
   - Add "See All" link to `/dashboard`
   - Cache query result (revalidate on refresh)

2. **Wire "Suggestions" to real data**
   - Query shows/people user doesn't follow
   - Rank by: episode count, recent activity, or random
   - Limit to 5 items
   - Add "Follow" button inline
   - Cache query result

3. **Implement refresh functionality**
   - Refresh button already triggers `router.refresh()`
   - Add server-side revalidation for right rail queries
   - Show loading spinner during refresh
   - Add toast notification: "Refreshed"

4. **Add quick action stubs**
   - News: Link to `/news` (stub page with "Coming Soon")
   - Calendar: Link to `/calendar` (stub)
   - Markets: Link to `/markets` (stub)
   - Earnings: Link to `/earnings` (stub)
   - Tweets: Link to `/tweets` (stub)
   - Predictions: Link to `/predictions` (stub)
   - Or: Link to external services (e.g., Yahoo Finance for Markets)

5. **User preference management**
   - Create `user_preferences` table:
     - `user_id`, `key`, `value`, `updated_at`
   - Store: `right_rail_collapsed`, `default_report_type`, etc.
   - Add preferences API: `/api/user/preferences`
   - Load preferences on right rail render

---

## Quality Gates (Before Each PR)

**Required checks before merging:**

1. **Build passes**
   ```bash
   npm run build
   ```

2. **Smoke tests pass**
   ```bash
   npm run test:smoke
   ```

3. **No new TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

4. **Lint passes** (if configured)
   ```bash
   npm run lint
   ```

5. **Vercel Preview deployment succeeds**
   - Check preview URL after pushing branch
   - Verify no runtime errors in browser console

6. **Database migrations tested locally**
   - Run migrations against Docker PostgreSQL first
   - Verify schema changes with `npm run db:studio`
   - Document migration in PR description

---

## Success Metrics

**Milestone 1 (Observability):**
- Zero critical errors go unnoticed for >1 hour
- Ops review process documented and followed daily
- Mean time to detect (MTTD) issues: <30 minutes

**Milestone 2 (Pipeline Hardening):**
- Pipeline success rate: >95%
- Failed episodes auto-retry successfully: >80%
- Zero duplicate episodes created from retries

**Milestone 3 (Batch Reports):**
- Daily report generated successfully: >95% of days
- Report generation time: <5 minutes
- User engagement: >10% of users view batch reports weekly

**Milestone 4 (Chatbot MVP):**
- Chatbot responds in <3 seconds
- Retrieval accuracy (relevant context): >80%
- User satisfaction (thumbs up/down): >70% positive

**Milestone 5 (Right Rail):**
- "Up Next" shows real data for 100% of users
- Refresh functionality works without errors
- User follows increase by >20% after suggestions wiring

---

## Risks & Mitigations

### Technical Risks

**Risk:** OpenAI API costs spiral out of control  
**Mitigation:** Set monthly budget alerts, implement rate limiting, cache embeddings

**Risk:** Database performance degrades with more data  
**Mitigation:** Add indexes on frequently queried columns, implement pagination, monitor query performance

**Risk:** Inngest function failures cause data loss  
**Mitigation:** Implement retry logic, store errors in DB, add manual recovery scripts

### Operational Risks

**Risk:** Production incidents during business hours  
**Mitigation:** Deploy during off-peak hours, use Vercel Preview for testing, maintain rollback procedures

**Risk:** Breaking changes to schema without migration path  
**Mitigation:** Test migrations locally first, use additive changes when possible, document breaking changes

### Product Risks

**Risk:** Chatbot provides incorrect information  
**Mitigation:** Add disclaimer, implement thumbs up/down feedback, log all conversations for review

**Risk:** Batch reports are low quality  
**Mitigation:** Iterate on prompts, allow manual regeneration, gather user feedback

---

## Timeline Estimate

**Week 1-2:**
- Milestone 1: Observability (5-7 PRs)
- Milestone 2: Pipeline Hardening (5-7 PRs)

**Week 3-4:**
- Milestone 3: Batch Reports (5 PRs)
- Milestone 4: Chatbot MVP (6 PRs)

**Week 5-6:**
- Milestone 5: Right Rail (5 PRs)

**Total:** ~26-30 PRs over 6 weeks

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Prioritize milestones** (can be done in different order)
3. **Create GitHub issues** for each task
4. **Start with Milestone 1** (Observability) - foundational for all other work
5. **Update this doc** as priorities shift or new requirements emerge

---

## References

- **v1.0.0 Completion:** See `docs/archive/EXECUTE_V2.md`
- **Production Deployment:** See `docs/RELEASE_RUNBOOK.md`
- **API Reference:** See `docs/API.md`
- **Pipeline Workflow:** See `docs/PIPELINE.md`
- **Onboarding:** See `docs/ONBOARDING.md`

---

**Document Version:** 1.0  
**Last Updated:** February 2, 2026  
**Status:** Active
