# Simplicity Finance - Development Handoff

**Date:** January 31, 2026  
**Branch:** `feat/robot-v0`  
**Last Commit:** `7eabc8f` - feat: add Inngest workflow engine setup (checkpoint 3.1)

---

## Project Overview

Simplicity Finance is a finance podcast summarization platform focused on trustworthy, evidence-grounded outputs. The system ingests podcast episodes (YouTube, audio URLs, or local transcripts), generates summaries with evidence spans, and performs quality control verification.

**Tech Stack:**
- **Frontend/Backend:** Next.js 13+ (App Router)
- **Database:** PostgreSQL 16 (Docker) + Drizzle ORM
- **Workflows:** Inngest
- **APIs:** YouTube Data API v3, Deepgram (transcription), OpenAI (summary/QC)
- **Language:** TypeScript

---

## Current Status

### ✅ Completed Phases

#### **Phase 1: Robot v0 Pipeline (Checkpoints 1.1-1.5)**
- Robot CLI script: `npm run robot -- <URL>` or `--local <transcript.jsonl>`
- Supports YouTube URLs, audio URLs (.mp3, .m4a, .wav), and local transcripts
- Outputs: `episode.json`, `transcript.jsonl`, `summary.json`, `qc.json`, `error.json`
- **Comprehensive error handling:** All failures write `error.json` before exit
- Error output directory: `output/_errors/<runId>/` for invalid inputs
- Exit codes: 0 for success, 1 for all errors

**Key Files:**
- `scripts/pipeline_smoke.ts` - Main robot pipeline
- `schemas/summary.schema.ts` - Summary with evidence spans
- `schemas/qc.schema.ts` - QC with score, status, risk flags

#### **Phase 2: Database (Checkpoints 2.1-2.3)**

**2.1 - Local Postgres + Drizzle:**
- Docker Compose with Postgres 16
- Drizzle ORM configured
- Scripts: `db:generate`, `db:migrate`, `db:studio`, `db:test`
- Drizzle Studio: https://local.drizzle.studio

**2.2 - Schema v1:**
- 5 tables: `episodes`, `transcript_segments_raw`, `episode_summary`, `summary_bullets`, `qc_runs`
- Foreign keys with CASCADE DELETE
- Indexes on episode_id, timestamps, QC status
- JSONB fields for evidence spans and QC flags
- Unique constraints on `video_id`, `audio_id`, `file_id`

**2.3 - Seeds:**
- Admin user: `admin@simplicity-finance.com` (role: admin)
- Sample show: "Sample Finance Podcast"
- Script: `npm run db:seed` (idempotent)

**Database Scripts:**
- `npm run db:insert output/<dir>` - Insert robot output (idempotent with transactions)
- `npm run db:seed` - Seed users and shows

**Key Files:**
- `docker-compose.yml` - Postgres 16 container
- `drizzle.config.ts` - Drizzle configuration
- `db/schema.ts` - Full schema (7 tables: users, shows, episodes, transcript_segments_raw, episode_summary, summary_bullets, qc_runs)
- `scripts/insert_robot_output.ts` - Idempotent insert with upsert + delete-replace strategy
- `scripts/seed.ts` - Idempotent seed script

#### **Phase 3: Inngest (Checkpoint 3.1)**

**3.1 - Inngest Dev Server:**
- Inngest package installed (v3.50.0)
- Client configured: `inngest/client.ts`
- Stub function: "hello-world" in `inngest/functions.ts`
- API endpoint: `app/api/inngest/route.ts`
- Script: `npm run inngest:dev` (starts UI on :8288)

**Key Files:**
- `inngest/client.ts` - Inngest client
- `inngest/functions.ts` - All Inngest functions
- `app/api/inngest/route.ts` - Next.js API route
- `inngest/README.md` - Setup instructions

---

## Environment Variables

Required in `.env.local`:
```bash
# YouTube Data API v3
YOUTUBE_API_KEY=your_key_here

# Deepgram (audio transcription)
DEEPGRAM_API_KEY=your_key_here

# OpenAI (summary and QC)
OPENAI_API_KEY=your_key_here

# Database (local Postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplicity_finance_dev
```

See `.env.example` for reference.

---

## Key Commands

### Development
```bash
npm run dev                    # Start Next.js dev server (:3000)
npm run inngest:dev           # Start Inngest dev server (:8288)
docker-compose up -d          # Start Postgres
```

### Robot Pipeline
```bash
npm run robot -- "https://youtube.com/watch?v=..."
npm run robot -- "https://example.com/audio.mp3"
npm run robot -- --local scripts/sample_transcript.jsonl
```

### Database
```bash
npm run db:test               # Test connection
npm run db:generate           # Generate migrations
npm run db:migrate            # Apply migrations
npm run db:studio             # Open Drizzle Studio
npm run db:seed               # Seed users and shows
npm run db:insert output/sample_transcript  # Insert robot output
```

---

## Important Implementation Details

### Error Handling (Phase 1.5)
- **All errors write `error.json`** before exit
- Error format: `{ code, message, timestamp, input: { rawArgv, urlOrPath } }`
- Invalid/unsupported URLs → `output/_errors/<runId>/error.json`
- Known IDs (videoId/fileId) → `output/<id>/error.json`
- Utility functions: `fail()`, `writeErrorJson()`, `ensureOutputDir()`

### Database Insert Idempotency
- **Transaction-based** with upsert + delete-replace strategy
- Episode: Upserts on conflict (video_id/audio_id/file_id)
- Children: Deletes existing, then reinserts fresh data
- Logging: Shows "inserted" vs "updated" and "replaced"
- Run multiple times safely - counts remain stable

### TypeScript Warnings (Accepted)
- `TransactionSql<{}>` type errors in `scripts/insert_robot_output.ts`
- These are non-blocking - code works correctly at runtime
- Due to `postgres` library's transaction API types

---

## Next Steps

### **Checkpoint 3.2: processEpisode Workflow** (Not Started)

**Goal:** Create Inngest workflow that orchestrates the full pipeline.

**Requirements:**
- Event: `episode/submitted` with `{ url: string }`
- Steps:
  1. **Ingest** - Fetch metadata (YouTube API or audio metadata)
  2. **Transcription** - Deepgram for audio, or use existing transcript
  3. **Summary** - OpenAI summary generation with evidence spans
  4. **QC** - OpenAI quality control verification
  5. **Approval** - Write to DB, mark for admin approval
- Store all artifacts in database using `db:insert` logic
- Handle errors gracefully with retries

**Approach:**
- Create `inngest/functions/processEpisode.ts`
- Use `step.run()` for each stage
- Reuse existing robot logic from `pipeline_smoke.ts`
- Write final output to database
- Add to `inngest/functions.ts` exports

**Acceptance:**
- Trigger event manually in Inngest UI
- One run completes end-to-end
- Data appears in database tables

---

## File Structure

```
simplicity-finance/
├── app/
│   └── api/
│       └── inngest/
│           └── route.ts              # Inngest API endpoint
├── db/
│   ├── migrations/                   # Drizzle migrations
│   ├── schema.ts                     # Database schema (7 tables)
│   └── README.md                     # Database setup guide
├── docs/
│   └── SIMPLICITY_FINANCE_EXECUTION_CHECKLIST.txt  # Progress tracker
├── inngest/
│   ├── client.ts                     # Inngest client
│   ├── functions.ts                  # All functions (hello-world stub)
│   └── README.md                     # Inngest setup guide
├── output/                           # Robot output (gitignored)
│   ├── <videoId>/                    # YouTube outputs
│   ├── <audioId>/                    # Audio outputs
│   ├── <fileId>/                     # Local transcript outputs
│   └── _errors/<runId>/              # Error outputs
├── schemas/
│   ├── summary.schema.ts             # Summary with evidence spans
│   └── qc.schema.ts                  # QC with score and flags
├── scripts/
│   ├── pipeline_smoke.ts             # Main robot CLI
│   ├── insert_robot_output.ts        # Idempotent DB insert
│   ├── seed.ts                       # Seed users and shows
│   ├── test_db_connection.ts         # DB connection test
│   └── sample_transcript.jsonl       # Test data
├── docker-compose.yml                # Postgres 16 container
├── drizzle.config.ts                 # Drizzle configuration
├── package.json                      # Dependencies and scripts
└── .env.local                        # Environment variables (gitignored)
```

---

## Database Schema

### Tables

1. **users** - Authentication and authorization
   - id (uuid, PK), email (unique), name, role (admin/user), timestamps

2. **shows** - Podcast shows/channels
   - id (uuid, PK), name, description, youtube_channel_id (unique), timestamps

3. **episodes** - Episode metadata
   - id (uuid, PK), source, url, video_id (unique), audio_id (unique), file_id (unique)
   - YouTube metadata fields, timestamps

4. **transcript_segments_raw** - Raw transcript
   - id (uuid, PK), episode_id (FK), start_ms, end_ms, speaker, text, timestamps

5. **episode_summary** - Summary metadata
   - id (uuid, PK), episode_id (FK), version, video_id, title, published_at, timestamps

6. **summary_bullets** - Individual bullets
   - id (uuid, PK), summary_id (FK), section_name, bullet_text, confidence, evidence_spans (JSONB), timestamps

7. **qc_runs** - Quality control results
   - id (uuid, PK), episode_id (FK), summary_id (FK), version, video_id, qc_status, qc_score, risk_flags (JSONB), flags (JSONB), timestamps

---

## Git Workflow

**Current Branch:** `feat/robot-v0`  
**Remote:** `origin/feat/robot-v0` (up to date)

All Phase 1, 2, and 3.1 work is on this branch. Main branch is unchanged.

**Recent Commits:**
```
7eabc8f - feat: add Inngest workflow engine setup (checkpoint 3.1)
10eaacb - fix: update admin email to admin@simplicity-finance.com
dafe36a - feat: add users and shows tables with seed script (checkpoint 2.3)
d95b423 - feat: make db:insert idempotent with transactions and upserts
8ee57fd - feat: implement full schema v1 for robot outputs (checkpoint 2.2)
```

---

## Testing

### Test Robot Pipeline
```bash
# Local transcript (works)
npm run robot -- --local scripts/sample_transcript.jsonl

# Audio URL (requires Deepgram key)
npm run robot -- "https://example.com/audio.mp3"

# YouTube URL (requires YouTube API key, captions unreliable)
npm run robot -- "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Test Database
```bash
# Start database
docker-compose up -d

# Test connection
npm run db:test

# Seed data
npm run db:seed

# Insert robot output (idempotent)
npm run db:insert output/sample_transcript
npm run db:insert output/sample_transcript  # Run again - no duplicates

# Verify counts
docker compose exec postgres psql -U postgres -d simplicity_finance_dev -c "SELECT 'episodes', COUNT(*) FROM episodes UNION ALL SELECT 'users', COUNT(*) FROM users;"
```

### Test Inngest (Ready but not tested yet)
```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start Inngest
npm run inngest:dev

# Open Inngest UI: http://localhost:8288
# Should see "hello-world" function
# Trigger with event: test/hello.world
```

---

## Known Issues / Notes

1. **YouTube Caption Scraping:** Unreliable due to YouTube API changes. Libraries removed. Use Deepgram for audio or local transcripts.

2. **TypeScript Warnings:** `TransactionSql` type errors in `insert_robot_output.ts` are accepted as non-blocking (runtime works).

3. **Idempotency:** Both `db:seed` and `db:insert` are fully idempotent and safe to run multiple times.

4. **Error Handling:** All robot failures now write `error.json` - no more console-only errors.

---

## Execution Checklist Reference

See `docs/SIMPLICITY_FINANCE_EXECUTION_CHECKLIST.txt` for detailed progress tracking.

**Completed:**
- Phase 1: Robot v0 (1.1-1.5) ✅
- Phase 2: Database (2.1-2.3) ✅
- Phase 3.1: Inngest dev server ✅

**Next:**
- Phase 3.2: processEpisode workflow ⏳

---

## Quick Start for New Session

1. **Pull latest code:**
   ```bash
   git checkout feat/robot-v0
   git pull origin feat/robot-v0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start services:**
   ```bash
   docker-compose up -d          # Postgres
   npm run db:migrate            # Apply migrations
   npm run db:seed               # Seed data
   npm run dev                   # Next.js (:3000)
   npm run inngest:dev           # Inngest (:8288)
   ```

4. **Verify setup:**
   ```bash
   npm run db:test               # DB connection
   npm run robot -- --local scripts/sample_transcript.jsonl  # Robot
   ```

5. **Continue with checkpoint 3.2** - Create processEpisode workflow in Inngest

---

## Contact / Context

- All work is on `feat/robot-v0` branch
- No merge to `main` yet
- Ready to proceed with checkpoint 3.2 (processEpisode workflow)
- Database is seeded and ready
- Inngest is configured but needs workflow implementation

**Last working directory:** `/Users/shapeless469/Documents/GIT/SIMPLICITY-FINANCE`

---

**End of Handoff**
