# SIMPLICITY FINANCE - MASTER TROUBLESHOOTING & REFERENCE GUIDE

📖 PURPOSE OF THIS DOCUMENT
----------------------------

This is the MASTER REFERENCE for troubleshooting Simplicity Finance.

**When to use this:**
- Episode ingestion pipeline is broken
- Reports not generating
- Database issues
- Deployment problems
- Any technical issue

**For AI Assistants:**
Read this entire document first before providing solutions. It contains:
- Complete system architecture
- Common failure patterns and fixes
- Step-by-step diagnostic procedures
- Environment setup requirements
- Deployment considerations

**For Developers:**
Use this as your first stop for troubleshooting. Most issues are documented here.

---

## 🏗️ SYSTEM ARCHITECTURE
-------------------------

### The Complete Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    SIMPLICITY FINANCE                         │
│                                                               │
│  USER ACTION                                                  │
│  └─ Paste YouTube URL in admin panel                        │
│                                                               │
│  FRONTEND (Next.js on Vercel)                                │
│  └─ app/lib/actions/ingest.ts                               │
│     └─ Validates URL                                         │
│     └─ Creates ingest_request (status: queued)              │
│     └─ Fires Inngest event: episode/submitted               │
│                                                               │
│  BACKGROUND PROCESSING (Inngest)                             │
│  └─ inngest/functions/processEpisode.ts                     │
│      │                                                        │
│      ├─ Step 1: mark-running                                │
│      │   └─ Update status to 'running'                      │
│      │                                                        │
│      ├─ Step 2: fetch-metadata                              │
│      │   └─ YouTube Data API v3                             │
│      │   └─ Gets: title, channel, date, description         │
│      │                                                        │
│      ├─ Step 3: download-audio ⚠️ COMMON FAILURE POINT     │
│      │   └─ inngest/lib/ytdlp.ts                           │
│      │   └─ Priority 1: Docker yt-dlp                       │
│      │   └─ Priority 2: Vendored binary                     │
│      │   └─ Priority 3: System yt-dlp                       │
│      │   └─ Tries 5 client strategies                       │
│      │                                                        │
│      ├─ Step 4: transcribe-audio                            │
│      │   └─ Deepgram Nova-2 API                             │
│      │   └─ Returns word-level transcript                   │
│      │                                                        │
│      ├─ Step 5: generate-summary                            │
│      │   └─ OpenAI GPT-4o-mini                              │
│      │   └─ Uses prompts/summary_v1.txt                     │
│      │                                                        │
│      ├─ Step 6: qc-checks                                   │
│      │   └─ OpenAI GPT-4o-mini                              │
│      │   └─ Uses prompts/qc_v1.txt                          │
│      │   └─ Returns score 0-100                             │
│      │                                                        │
│      ├─ Step 7: persist-to-db ⚠️ COMMON FAILURE POINT      │
│      │   └─ Runs: npm run db:insert                         │
│      │   └─ Inserts into Supabase                           │
│      │   └─ Tables: episodes, transcripts, summaries, qc    │
│      │                                                        │
│      └─ Step 8: create-notification                         │
│          └─ Creates notification record                      │
│          └─ User sees bell icon update                       │
│                                                               │
│  REPORTS GENERATION (Cron Jobs)                              │
│  ├─ Daily (6am UTC): Synthesize yesterday's episodes        │
│  ├─ Weekly (Mon 6am): Synthesize 7 daily reports            │
│  ├─ Monthly (1st 6am): Synthesize ~4 weekly reports         │
│  └─ Quarterly (1st Mon): Synthesize 3 monthly reports       │
│                                                               │
│  DATABASE (Supabase PostgreSQL)                              │
│  ├─ episodes                                                 │
│  ├─ transcript_segments_raw                                  │
│  ├─ episode_summary + summary_bullets                        │
│  ├─ qc_runs                                                  │
│  ├─ daily_reports / weekly_reports / etc.                   │
│  ├─ ingest_requests (tracks all submissions)                │
│  └─ notifications                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies

**Frontend:**
- Next.js 14+ (App Router)
- React Server Components
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Next.js API Routes (server actions)
- Inngest (background job processing)
- Drizzle ORM (database)

**External Services:**
- YouTube Data API v3 (metadata)
- yt-dlp (audio download)
- Deepgram (transcription)
- OpenAI GPT-4o-mini (summarization)
- Supabase (PostgreSQL database)

**Development:**
- TypeScript
- Docker (for yt-dlp)
- Vercel (deployment)

---

## 🚨 COMMON ISSUES & FIXES
---------------------------

### Issue 1: Download Audio Fails (Most Common)

**Symptoms:**
```
Error: All download strategies failed
ERROR: [youtube] YouTube is no longer supported
403 Forbidden on all client strategies
```

**Root Cause:**
YouTube changes their API frequently to block downloaders. yt-dlp needs constant updates.

**Quick Diagnosis:**
```bash
# Check which yt-dlp is being used
grep "version" output/*/download.log

# Test Docker yt-dlp
docker run --rm jauderho/yt-dlp:latest --version
# Should show: 2026.02.04 or newer

# Test system yt-dlp
yt-dlp --version
# If older than 2026.02.04, that's the problem
```

**Fix:**

**Option A: Force Docker (Recommended)**
1. Make sure Docker Desktop is running: `docker ps` 
2. Update `inngest/lib/ytdlp.ts` to prioritize Docker
3. See: `/mnt/user-data/outputs/force-docker-ytdlp.txt` 

**Option B: Update System yt-dlp**
```bash
# macOS
brew upgrade yt-dlp

# or via pip (requires Python 3.10+)
pip install --upgrade yt-dlp --break-system-packages
```

**Option C: Use Vendored Binary**
```bash
# Download latest
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp
```

**Prevention:**
Always use Docker for yt-dlp - it auto-updates and is platform-independent.

---

### Issue 2: Persist to DB Fails

**Symptoms:**
```
❌ SAFETY CHECK FAILED
DATABASE_URL points to PRODUCTION (Supabase)
```

**Root Cause:**
The script has a safety check to prevent accidentally writing to production.
But you're using Supabase as your dev database.

**Fix:**
Add to `.env.local`:
```bash
ALLOW_PROD_DB_WRITE=1
```

Then restart servers:
```bash
# Terminal 1
npx inngest-cli dev

# Terminal 2
npm run dev
```

**See:** `/mnt/user-data/outputs/fix-persist-db-safety-check.txt` 

---

### Issue 3: API Rate Limits

**Symptoms:**
```
Error: Quota exceeded
HTTP 429 Too Many Requests
YouTube API quota exceeded
```

**Diagnosis:**
Check API usage:
- YouTube: https://console.cloud.google.com/apis/dashboard
- Deepgram: https://console.deepgram.com/
- OpenAI: https://platform.openai.com/usage

**Quotas:**
- YouTube Data API: 10,000 units/day (free tier)
  - Each video.list call = ~3 units
  - ~3,300 videos/day max
- Deepgram: Pay-as-you-go or plan-based
- OpenAI: Based on account tier

**Fix:**
- Upgrade API plan
- Implement caching for metadata
- Batch process overnight
- Add rate limiting in code

---

### Issue 4: Transcription Fails

**Symptoms:**
```
Error: Deepgram API error
Timeout waiting for transcription
```

**Diagnosis:**
```bash
# Check audio file exists and is valid
ffprobe output/VIDEO_ID/audio.mp3

# Should show:
# Duration: HH:MM:SS
# Stream #0:0: Audio: mp3
```

**Common Causes:**
1. Audio file corrupted
2. File too large (>2GB)
3. Deepgram API down
4. Invalid API key
5. Network timeout

**Fix:**
```bash
# Verify Deepgram API key
curl -X POST https://api.deepgram.com/v1/listen \
  -H "Authorization: Token YOUR_KEY" \
  -H "Content-Type: audio/mp3" \
  --data-binary @output/VIDEO_ID/audio.mp3

# If this works but Inngest fails, check timeout settings
```

---

### Issue 5: Database Connection Failed

**Symptoms:**
```
Error: Connection refused
Error: SSL required
Could not connect to database
```

**Diagnosis:**
```bash
# Test database connection
npx drizzle-kit studio

# If this fails, DATABASE_URL is wrong
echo $DATABASE_URL
```

**Common Causes:**
1. DATABASE_URL missing or incorrect
2. Supabase project paused (free tier)
3. IP not whitelisted (if using IP restrictions)
4. SSL certificate issues

**Fix:**
1. Get correct DATABASE_URL from Supabase dashboard
2. Update `.env.local` 
3. Restart servers
4. Wake up Supabase project (access dashboard)

---

### Issue 6: Notifications Not Showing

**Symptoms:**
- Bell icon shows 0
- No notifications appear
- Pipeline completes but no notification

**Diagnosis:**
```bash
# Check if notifications table exists
npx drizzle-kit studio
# Look for 'notifications' table

# Query directly
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM notifications;"
```

**Common Causes:**
1. notifications table doesn't exist
2. create-notification step is being skipped
3. Frontend not fetching notifications

**Fix:**
See: `/mnt/user-data/outputs/notification-system.txt` 

Create table:
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  metadata JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  read_at TIMESTAMP
);
```

---

### Issue 7: Reports Not Generating

**Symptoms:**
- Daily reports page empty
- Reports stuck in "generating" status
- Cron jobs not running

**Diagnosis:**
```bash
# Check Inngest dashboard
# http://localhost:8288 (dev)
# https://app.inngest.com (prod)

# Look for scheduled functions
# Check last run time
```

**Common Causes:**
1. Cron schedule not registered
2. No episodes in time period
3. Report generation failing silently
4. Inngest not connected

**Fix:**
1. Verify cron is registered in `inngest/functions.ts` 
2. Test manual generation from admin
3. Check Inngest logs for errors

---

## 🔧 DIAGNOSTIC PROCEDURES
---------------------------

### When Episode Ingestion Fails

**Step-by-Step Diagnosis:**

```bash
# 1. Check Inngest dashboard
open http://localhost:8288
# Look at failed run, identify which step failed

# 2. Check Docker is running (if download failed)
docker ps
# Should list running containers, not error

# 3. Check environment variables
cat .env.local | grep -E "DATABASE_URL|YOUTUBE_API_KEY|DEEPGRAM_API_KEY|OPENAI_API_KEY"
# All should be present

# 4. Check output directory for logs
ls -la output/VIDEO_ID/
# Should see: download.log, episode.json, transcript.jsonl, etc.

# 5. Check database for episode
npx drizzle-kit studio
# Query episodes table for the video ID

# 6. Check specific logs
cat output/VIDEO_ID/download.log
cat output/VIDEO_ID/error.json
```

**Common Error Patterns:**

| Step | Error Pattern | Likely Cause |
|------|--------------|--------------|
| fetch-metadata | "Invalid API key" | YouTube API key wrong/missing |
| download-audio | "All strategies failed" | yt-dlp outdated or YouTube changed API |
| transcribe-audio | "Timeout" | File too large or Deepgram slow |
| generate-summary | "Rate limit" | OpenAI quota exceeded |
| persist-to-db | "Safety check" | ALLOW_PROD_DB_WRITE not set |
| create-notification | "Table not found" | notifications table missing |

---

### When System Was Working, Now Broken

**Diagnostic Checklist:**

```
□ Did YouTube API change? (check yt-dlp version)
□ Did environment variables change? (check .env.local)
□ Did database schema change? (run drizzle-kit push)
□ Did dependencies update? (check package.json, npm ls)
□ Did Supabase pause? (check dashboard)
□ Did API quotas reset? (check usage dashboards)
□ Did git branch change? (git status, git log)
□ Did Docker Desktop stop? (docker ps)
```

**Git History Check:**
```bash
# See recent commits
git log --oneline -20

# See what changed
git diff HEAD~5..HEAD

# Check which branch
git branch

# See if work was lost
git reflog -20
```

---

## 🌐 DEPLOYMENT (VERCEL)
-------------------------

### Pre-Deployment Checklist

```
□ All tests passing locally
□ Database migrations applied
□ Environment variables documented
□ Inngest functions tested
□ API quotas sufficient
□ Error handling in place
□ Logging implemented
```

### Vercel Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```bash
# Database
DATABASE_URL=postgresql://[project].[id].supabase.co/postgres
ALLOW_PROD_DB_WRITE=1

# APIs
YOUTUBE_API_KEY=AIza...
DEEPGRAM_API_KEY=...
OPENAI_API_KEY=sk-proj-...

# Inngest (auto-provided by Vercel integration)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel-Specific Considerations

**1. File System:**
- Read-only except /tmp
- /tmp cleared between invocations
- Use external storage (Supabase) for persistence

**2. Function Limits:**
- Hobby: 60s max execution
- Pro: 300s max execution
- **Good news:** Inngest runs separately, not limited by Vercel!

**3. yt-dlp:**
- Docker not available on Vercel
- Uses vendored Linux binary: `vendor/yt-dlp/linux/yt-dlp` 
- This binary works fine on Vercel (no Gatekeeper like macOS)

**4. Inngest Setup:**
1. Install Vercel integration: https://www.inngest.com/docs/deploy/vercel
2. Connect to your app
3. Jobs run on Inngest infrastructure, not Vercel

**5. Cold Starts:**
- First request may be slow (2-5 seconds)
- Subsequent requests fast
- Doesn't affect Inngest jobs

### Post-Deployment Verification

```bash
# 1. Test episode ingestion
curl -X POST https://your-app.vercel.app/api/admin/ingest/submit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=..."}'

# 2. Check Inngest dashboard
# https://app.inngest.com/env/production/functions

# 3. Verify database writes
# Check Supabase dashboard for new episodes

# 4. Test reports generation
# Trigger manual report from admin panel

# 5. Check error tracking
# Vercel dashboard → Logs
# Inngest dashboard → Runs
```

---

## 🔑 ENVIRONMENT VARIABLES REFERENCE
-------------------------------------

### Required Variables

| Variable | Purpose | Where to Get | Example |
|----------|---------|--------------|---------|
| `DATABASE_URL` | Supabase connection | Supabase Dashboard → Settings → Database | `postgresql://postgres.[project].[region].supabase.co/postgres?pgbouncer=true` |
| `YOUTUBE_API_KEY` | YouTube metadata | Google Cloud Console → APIs & Services → Credentials | `AIzaSyD...` |
| `DEEPGRAM_API_KEY` | Transcription | Deepgram Console → API Keys | `...` |
| `OPENAI_API_KEY` | Summarization | OpenAI Platform → API Keys | `sk-proj-...` |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `ALLOW_PROD_DB_WRITE` | Allow Supabase writes | `0` (blocked) |
| `YT_DLP_BIN` | Override yt-dlp path | Auto-detected |
| `YT_DLP_USE_DOCKER` | Force Docker | `false` |
| `INNGEST_EVENT_KEY` | Inngest auth | Auto-provided on Vercel |
| `INNGEST_SIGNING_KEY` | Inngest signature | Auto-provided on Vercel |
| `NODE_ENV` | Environment | `development` |

---

## 📊 MONITORING & LOGS
-----------------------

### Development

**Inngest Dev Server:**
```bash
npx inngest-cli dev
# Opens: http://localhost:8288
```

View:
- All function runs
- Step-by-step execution
- Retry attempts
- Error details
- Execution time

**Next.js Logs:**
```bash
npm run dev
# All console.log() appears here
```

**Database:**
```bash
npx drizzle-kit studio
# Opens: http://localhost:4983
# Browse all tables, run queries
```

### Production

**Vercel Logs:**
- Dashboard → Your Project → Logs
- Filter by: Function, Time, Status
- Real-time log streaming

**Inngest Cloud:**
- https://app.inngest.com
- Production environment
- Function runs, errors, metrics

**Supabase:**
- Dashboard → Your Project → Logs
- Database queries, connections, errors

---

## 🚀 QUICK COMMANDS REFERENCE
-------------------------------

### Development

```bash
# Start development
npm run dev                    # Next.js (port 3000)
npx inngest-cli dev           # Inngest (port 8288)

# Database
npx drizzle-kit studio        # Browse DB (port 4983)
npx drizzle-kit push          # Push schema changes
npx drizzle-kit generate      # Generate migration

# Testing
docker ps                     # Check Docker running
docker pull jauderho/yt-dlp   # Update yt-dlp image
npm run db:insert output/ID   # Test DB insert

# Debugging
git reflog -20                # Find lost commits
git stash list                # Check stashed work
cat output/VIDEO_ID/*.log     # Check logs
```

### Deployment

```bash
# Vercel
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production
vercel env pull .env.local    # Sync env vars locally

# Git
git status                    # Check changes
git add .                     # Stage all
git commit -m "message"       # Commit
git push origin main          # Push to GitHub
```

---

## 📞 WHEN TO ESCALATE
----------------------

**Contact original developer if:**
- Database schema corruption
- Inngest webhook security issues
- Billing/quota emergencies
- Data loss scenarios
- Security vulnerabilities

**Self-recoverable issues:**
- yt-dlp version problems → Update Docker
- API rate limits → Wait or upgrade
- Individual episode failures → Retry
- Environment variable issues → Fix .env
- Database connection → Check Supabase status

---

## 📚 RELATED DOCUMENTS
-----------------------

This master guide references these detailed documents:

**Troubleshooting:**
- `/mnt/user-data/outputs/force-docker-ytdlp.txt` - Fix download failures
- `/mnt/user-data/outputs/fix-persist-db-safety-check.txt` - Fix database write blocks
- `/mnt/user-data/outputs/git-work-recovery.txt` - Recover lost work

**Feature Implementation:**
- `/mnt/user-data/outputs/notification-system.txt` - Add notifications
- `/mnt/user-data/outputs/reports-weekly-monthly-quarterly.txt` - Add report types
- `/mnt/user-data/outputs/admin-manual-report-generation.txt` - Manual report controls

**System Understanding:**
- `/mnt/user-data/outputs/system-complete-explanation.txt` - Complete architecture
- This document - Master reference

---

## 🔄 DOCUMENT MAINTENANCE
--------------------------

**This document should be updated when:**
- New common issues discovered
- System architecture changes
- New features added
- Deployment process changes
- External API changes (YouTube, etc.)

**Version History:**
- v1.0 (2026-02-10): Initial master reference created
  - Covers yt-dlp Docker fix
  - Database safety check fix
  - Complete system architecture
  - Common troubleshooting procedures

---

## 🎯 FOR AI ASSISTANTS
-----------------------

**When user reports an issue:**

1. **Ask them to run diagnostics:**
   ```bash
   # Basic health check
   docker ps
   git status
   cat .env.local | grep -E "DATABASE_URL|YOUTUBE_API_KEY"
   ```

2. **Check Inngest dashboard:**
   - Which step failed?
   - What's the exact error message?
   - Has this video ID worked before?

3. **Refer to common issues section:**
   - Match error pattern to known issue
   - Provide specific fix from this document

4. **If not in this document:**
   - Follow diagnostic procedures
   - Check related documents
   - Create new fix and update this document

5. **Always provide:**
   - Root cause explanation
   - Step-by-step fix
   - Prevention advice
   - Command to test fix worked

**Remember:** Most issues are either:
- yt-dlp version (use Docker)
- Database connection (check Supabase)
- API keys/quotas (check dashboards)
- Environment variables (check .env.local)

---

## ✅ SUCCESS CRITERIA
----------------------

**Episode ingestion working when:**
```bash
# Submit URL in admin panel
# Check Inngest dashboard shows:
✅ mark-running (instant)
✅ fetch-metadata (1-2s)
✅ download-audio (30s-3m)
✅ transcribe-audio (1m per hour of audio)
✅ generate-summary (30s)
✅ qc-checks (20s)
✅ persist-to-db (5s)
✅ create-notification (instant)

# Then verify:
✅ Episode appears in app
✅ Notification shows in bell icon
✅ Transcript is searchable
✅ Summary has structured sections
```

**System healthy when:**
- Can submit new episodes
- Episodes process within 10 minutes
- Reports generate on schedule
- No errors in logs
- API quotas not exceeded
- Database responding quickly

---

END OF MASTER REFERENCE

Last Updated: 2026-02-10
Version: 1.0
