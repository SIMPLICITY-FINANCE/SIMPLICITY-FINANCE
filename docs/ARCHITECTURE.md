# SIMPLICITY FINANCE - System Architecture

**Version:** 1.0  
**Last Updated:** February 2, 2026

---

## Overview

SIMPLICITY FINANCE is a finance podcast summarization platform that ingests long-form content, generates structured summaries with evidence citations, and provides search, discovery, and reporting tools.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  Next.js 16 App Router (React 19, TailwindCSS, shadcn/ui)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  • Server Actions (form submissions, data mutations)            │
│  • API Routes (/api/health, /api/admin/*, /api/auth/*)         │
│  • Middleware (auth, route protection, dev route blocking)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKGROUND JOBS (Inngest)                     │
│  • processEpisode: ingest → transcribe → summarize → QC        │
│  • scheduledIngest: daily ingestion from YouTube/RSS (2 AM UTC)│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (PostgreSQL)                     │
│  • Drizzle ORM (schema: db/schema.ts)                          │
│  • Local: Docker PostgreSQL (port 5432)                        │
│  • Production: Supabase PostgreSQL (pooled port 6543)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  • YouTube Data API v3 (video metadata)                        │
│  • Deepgram API (audio transcription)                          │
│  • OpenAI API (GPT-4 for summarization and QC)                 │
│  • Google OAuth (authentication)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend (Next.js App Router)

**3-Panel Layout:**
- **Left Sidebar:** Navigation (Dashboard, Search, Upload, Discover, Reports, Saved, Notebook, Admin)
- **Main Content:** Dynamic pages based on route
- **Right Rail:** Up Next, Suggestions, Quick Actions (News, Calendar, Markets, etc.)

**Key Routes:**
- `/dashboard` - Main feed of approved episodes
- `/search` - Search across episodes and bullets
- `/episode/[id]` - Episode detail with summary bullets
- `/admin/*` - Admin pages (approvals, ops, shows, ingest)
- `/upload` - Upload new episode (YouTube URL or audio file)
- `/discover` - Browse shows and people
- `/reports` - View weekly/monthly aggregated reports
- `/saved` - User's saved episodes and bullets
- `/notebook` - User's personal notes

**Authentication:**
- NextAuth.js v5 with Google OAuth
- Role-based access control (admin/user)
- Session stored in JWT
- Middleware blocks `/admin/*` routes for non-admins

### 2. Episode Processing Pipeline (Inngest)

**Workflow: processEpisode**

```
1. INGEST (Step 1)
   ├─ Input: YouTube URL or audio URL
   ├─ Fetch metadata (title, description, channel, duration)
   ├─ Download audio (if YouTube video)
   └─ Store in output/ directory

2. TRANSCRIBE (Step 2)
   ├─ Send audio to Deepgram API
   ├─ Receive transcript with timestamps and speaker labels
   ├─ Store raw segments in transcript_segments_raw table
   └─ Store transcript JSONL in output/[video_id]/transcript.jsonl

3. SUMMARIZE (Step 3)
   ├─ Load transcript from DB
   ├─ Send to OpenAI GPT-4 with summary prompt (prompts/summary_v1.txt)
   ├─ Parse structured JSON response (title, bullets with sections)
   ├─ Store in episode_summary and summary_bullets tables
   └─ Store summary JSON in output/[video_id]/summary.json

4. QC (Quality Check) (Step 4)
   ├─ Load transcript + summary from DB
   ├─ Send to OpenAI GPT-4 with QC prompt (prompts/qc_v1.txt)
   ├─ Parse QC result (pass/fail, issues, suggestions)
   ├─ Store in qc_runs table
   └─ Store QC JSON in output/[video_id]/qc.json

5. FINALIZE
   ├─ Update episode status to 'processed'
   ├─ Episode now appears in admin approvals queue
   └─ Admin reviews and approves/rejects
```

**Workflow: scheduledIngest**

```
Runs daily at 2 AM UTC
├─ Query shows table where ingest_enabled = true
├─ For each show:
│   ├─ If ingest_source = 'youtube_channel': fetch latest 10 videos
│   ├─ If ingest_source = 'youtube_playlist': fetch latest 10 playlist items
│   ├─ If ingest_source = 'rss': parse RSS feed for audio enclosures
│   ├─ Check if episode already exists (by video_id or audio_id)
│   └─ If new: create ingest request and trigger processEpisode
└─ Idempotent: unique constraints prevent duplicates
```

### 3. Database Schema (PostgreSQL + Drizzle ORM)

**Core Tables:**

**users**
- `id`, `email`, `name`, `role` (admin/user), `created_at`

**shows**
- `id`, `name`, `description`, `channel_id`, `ingest_enabled`, `ingest_source`, `ingest_url`, `last_ingested_at`

**episodes**
- `id`, `show_id`, `title`, `description`, `video_id`, `audio_id`, `duration_seconds`, `status` (pending/processing/processed/approved/rejected), `approved_at`, `created_at`

**transcript_segments_raw**
- `id`, `episode_id`, `start_ms`, `end_ms`, `speaker`, `text`

**episode_summary**
- `id`, `episode_id`, `title`, `created_at`

**summary_bullets**
- `id`, `summary_id`, `section_name`, `bullet_text`, `start_ms`, `end_ms`, `order`

**qc_runs**
- `id`, `episode_id`, `passed`, `issues`, `suggestions`, `created_at`

**ingest_requests**
- `id`, `show_id`, `source_url`, `status`, `error_message`, `created_at`

**user_follows** (shows/people)
- `user_id`, `show_id` or `person_id`, `created_at`

**user_saved_episodes**
- `user_id`, `episode_id`, `created_at`

**user_saved_bullets**
- `user_id`, `bullet_id`, `created_at`

### 4. External Service Integration

**YouTube Data API v3:**
- Fetch video metadata (title, description, channel, duration)
- Fetch channel videos (for scheduled ingestion)
- Fetch playlist items (for scheduled ingestion)
- Rate limit: 10,000 quota units/day

**Deepgram API:**
- Audio transcription with speaker diarization
- Model: `nova-2` (general purpose)
- Output: JSON with timestamps and speaker labels
- Cost: ~$0.0043/minute of audio

**OpenAI API:**
- GPT-4 for summarization and QC
- Models: `gpt-4-turbo-preview` or `gpt-4o`
- Prompts versioned in `prompts/` directory
- Cost: ~$0.01-0.03 per episode (varies by length)

**Google OAuth:**
- Authentication via NextAuth.js
- Scopes: `openid`, `email`, `profile`
- Callback URL: `https://your-domain.com/api/auth/callback/google`

### 5. Deployment Architecture

**Production:**
- **Hosting:** Vercel (serverless functions)
- **Database:** Supabase PostgreSQL (pooled connection on port 6543)
- **Background Jobs:** Inngest Cloud
- **File Storage:** Local filesystem (`output/` directory) - TODO: migrate to Supabase Storage
- **Environment Variables:** Managed in Vercel dashboard

**Local Development:**
- **Hosting:** `npm run dev` (Next.js dev server on port 3000)
- **Database:** Docker PostgreSQL (port 5432)
- **Background Jobs:** `npx inngest-cli dev` (local Inngest server on port 8288)
- **File Storage:** Local filesystem (`output/` directory)
- **Environment Variables:** `.env.local` file

---

## Data Flow Examples

### Example 1: User Uploads Episode

```
1. User visits /upload
2. User enters YouTube URL
3. Form submission → Server Action (app/lib/actions/ingest.ts)
4. Create ingest_request record
5. Trigger Inngest processEpisode function
6. Inngest executes 4-step pipeline (ingest → transcribe → summarize → QC)
7. Episode status updated to 'processed'
8. Admin sees episode in /admin/approvals
9. Admin approves → episode.approved_at set
10. Episode appears in public feed (/dashboard)
```

### Example 2: Scheduled Daily Ingestion

```
1. Cron trigger at 2 AM UTC
2. Inngest scheduledIngest function runs
3. Query shows where ingest_enabled = true
4. For each show:
   - Fetch latest videos from YouTube
   - Check if video_id already exists in episodes table
   - If new: create ingest_request and trigger processEpisode
5. processEpisode runs for each new episode
6. Episodes processed and ready for admin approval
```

### Example 3: User Searches Episodes

```
1. User types query in /search
2. Form submission → Server Action (app/lib/actions/search.ts)
3. SQL query searches:
   - episode.title
   - episode.description
   - summary_bullets.bullet_text
4. Results returned with relevance ranking
5. User clicks episode → redirect to /episode/[id]
6. Episode detail page loads with bullets grouped by section
```

---

## Security Considerations

**Authentication:**
- All `/admin/*` routes protected by middleware
- Session validated on every request
- Role checked before admin actions

**Database:**
- Prepared statements (SQL injection prevention)
- Environment separation (local vs production)
- DB write scripts have safety guards (`scripts/lib/db-safety.ts`)

**API Keys:**
- Stored in environment variables (never committed)
- Rotated periodically
- Rate limiting on external API calls

**User Data:**
- No PII stored beyond email/name from OAuth
- User-generated content (saved episodes/bullets) scoped to user_id

---

## Performance Considerations

**Database:**
- Indexes on frequently queried columns (episode.status, episode.approved_at, user_follows.user_id)
- Connection pooling (Supabase pooler on port 6543)
- Query optimization (avoid N+1 queries)

**Caching:**
- Next.js automatic caching for static pages
- Server-side caching for expensive queries (TODO)
- CDN caching for public assets

**Background Jobs:**
- Inngest handles retries and concurrency
- Long-running tasks (transcription, summarization) run async
- User sees immediate feedback (ingest request created) while processing happens in background

---

## Monitoring & Observability

**Current State (v1.0.0):**
- Health check endpoint: `/api/health`
- Inngest UI for workflow monitoring (http://localhost:8288 locally)
- Admin ops dashboard: `/admin/ops` (shows recent failures)

**Planned (v1.1+):**
- Structured logging (Winston/Pino)
- Error tracking (Sentry)
- Alerting (email/Slack on critical errors)
- Detailed health checks (DB pool status, API connectivity)

---

## Scaling Considerations

**Current Bottlenecks:**
- File storage on local filesystem (not scalable)
- No caching layer (every request hits DB)
- Single-region deployment (Vercel/Supabase US East)

**Future Improvements:**
- Migrate file storage to Supabase Storage or S3
- Add Redis for caching
- Implement CDN for static assets
- Add read replicas for DB (if needed)
- Horizontal scaling via Vercel serverless functions (automatic)

---

## Development Workflow

**Local Setup:**
1. Clone repo
2. Install dependencies: `npm install`
3. Start Docker PostgreSQL: `docker compose up -d`
4. Configure `.env.local` with API keys
5. Run migrations: `npm run db:push`
6. Seed demo data: `npm run db:seed:demo`
7. Start Next.js: `npm run dev`
8. Start Inngest: `npx inngest-cli dev`

**Making Changes:**
1. Create feature branch from `main`
2. Make changes and test locally
3. Run build: `npm run build`
4. Run smoke tests: `npm run test:smoke`
5. Push branch and create PR
6. Vercel Preview deployment auto-created
7. Review and merge to `main`
8. Auto-deploy to production

---

## References

- **Onboarding:** See `docs/ONBOARDING.md`
- **Deployment:** See `docs/deployment/DEPLOYMENT.md`
- **API Reference:** See `docs/API.md`
- **Pipeline Details:** See `docs/PIPELINE.md`
- **Roadmap:** See `docs/ROADMAP.md`

---

**Document Version:** 1.0  
**Maintained By:** Development Team  
**Last Review:** February 2, 2026
