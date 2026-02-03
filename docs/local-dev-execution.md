# Local Dev Execution Guide

## Overview

This guide explains how to run Inngest workflows locally with full observability and predictable execution.

---

## Inngest Architecture: Cloud vs Dev Server

### Two Execution Modes

1. **Cloud Execution** (Production)
   - Events sent to Inngest Cloud
   - Functions run on Inngest infrastructure
   - Requires deployed endpoints

2. **Local Dev Server** (Development)
   - Events sent to local dev server
   - Functions run locally in your Next.js app
   - Full debugging and hot-reload support

---

## Setup: Running Inngest Locally

### 1. Start Your Next.js Dev Server

```bash
npm run dev
```

This starts your app at `http://localhost:3000` (or 3001 if 3000 is in use).

**Important:** Your Inngest endpoint is automatically registered at:
```
http://localhost:3000/api/inngest
```

### 2. Start the Inngest Dev Server

In a **separate terminal**:

```bash
npm run inngest:dev
```

Or manually:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

This starts the Inngest Dev Server at `http://localhost:8288`.

**What this does:**
- Discovers your Inngest functions from `/api/inngest`
- Provides a dashboard at `http://localhost:8288`
- Routes events to your local Next.js app for execution

### 3. Verify Registration

Open `http://localhost:8288` and confirm you see:
- ✅ `process-episode` function registered
- ✅ `process-episode-on-failure` function registered

---

## Triggering Events

### Option 1: Via Your UI (Recommended)

1. Go to `http://localhost:3000/upload`
2. Submit a YouTube URL (e.g., `https://www.youtube.com/watch?v=qeTjwd69Nxw`)
3. The UI sends an `episode/submitted` event to Inngest
4. Inngest Dev Server routes it to your local app

### Option 2: Via Inngest Cloud Dashboard

If you're testing from the Inngest Cloud dashboard:

1. Go to your event in the Inngest Cloud UI
2. Click **"Send to Dev Server"** (not "Replay")
3. This routes the event to your local dev server instead of cloud

**Important:** Always use "Send to Dev Server" when developing locally!

---

## Observability: What You'll See

### Terminal Output (Next.js Dev Server)

When a workflow runs, you'll see:

```
═══════════════════════════════════════════════════════════════
🚀 PROCESS_EPISODE_START {
  requestId: '123e4567-e89b-12d3-a456-426614174000',
  url: 'https://www.youtube.com/watch?v=qeTjwd69Nxw',
  timestamp: '2026-02-03T08:00:00.000Z'
}
═══════════════════════════════════════════════════════════════
[Step 0] Marking request 123e4567-e89b-12d3-a456-426614174000 as running
[Step 0] ✓ Request marked as running
[Step 1] Fetching metadata for URL: https://www.youtube.com/watch?v=qeTjwd69Nxw
[Step 1] ✓ YouTube metadata fetched: Example Video Title
[Step 2] Downloading audio for video qeTjwd69Nxw
[yt-dlp] Version: 2026.01.31 (standalone binary) (path: .../vendor/yt-dlp/darwin/yt-dlp)
[yt-dlp] Attempting client: tv_embedded (most reliable)
[yt-dlp] Discovering formats...
[yt-dlp] Selected format 140 (m4a)
[yt-dlp] Downloading format 140...
[yt-dlp] ✓ SUCCESS with tv_embedded (most reliable)
[Step 2] ✓ Audio downloaded: /path/to/output/qeTjwd69Nxw/qeTjwd69Nxw.m4a
[Step 3] Transcribing audio
[Step 3] ✓ Transcription complete: 1234 segments
[Step 4] Generating summary
[Step 4] ✓ Summary generated: 5 sections
[Step 5] Running QC checks
[Step 5] ✓ QC complete: pass (score: 85)
[Step 6] Persisting to database
[Step 6] ✓ Data persisted to database
[Step 7] Running cleanup
[Step 7] ✓ Cleanup complete
[Step 8] Marking request 123e4567-e89b-12d3-a456-426614174000 as succeeded
[Step 8] ✓ Request marked as succeeded
═══════════════════════════════════════════════════════════════
✅ PROCESS_EPISODE_COMPLETE {
  requestId: '123e4567-e89b-12d3-a456-426614174000',
  episodeId: 'qeTjwd69Nxw',
  qcStatus: 'pass',
  timestamp: '2026-02-03T08:15:00.000Z'
}
═══════════════════════════════════════════════════════════════
```

### Inngest Dashboard (`http://localhost:8288`)

You'll see **8 discrete steps** in the execution timeline:

1. ✅ `mark-running` - Mark request as running
2. ✅ `fetch-metadata` - Fetch YouTube metadata
3. ✅ `download-audio` - Download audio (YouTube only)
4. ✅ `transcribe-audio` - Transcribe with Deepgram
5. ✅ `generate-summary` - Generate summary with OpenAI
6. ✅ `qc-checks` - Run QC checks
7. ✅ `persist-to-db` - Persist to database
8. ✅ `mark-succeeded` - Mark request as succeeded

**Each step shows:**
- Duration
- Status (success/failure)
- Output/error details

### Database (`ingest_requests` table)

Watch the `status` and `stage` columns update in real-time:

```sql
SELECT id, status, stage, updated_at 
FROM ingest_requests 
WHERE id = '123e4567-e89b-12d3-a456-426614174000';
```

**Progression:**
1. `status: 'queued'`, `stage: NULL`
2. `status: 'running'`, `stage: NULL`
3. `status: 'running'`, `stage: 'metadata'`
4. `status: 'running'`, `stage: 'download'`
5. `status: 'running'`, `stage: 'transcribe'`
6. `status: 'running'`, `stage: 'summarize'`
7. `status: 'running'`, `stage: 'qc'`
8. `status: 'running'`, `stage: 'persist'`
9. `status: 'running'`, `stage: 'cleanup'`
10. `status: 'succeeded'`, `stage: 'completed'`

---

## Watchdog Timeouts

Each step has a hard timeout to prevent "stuck" runs:

| Step | Timeout | What Happens on Timeout |
|------|---------|-------------------------|
| Download Audio | 10 minutes | Error with video ID, stage, and log path |
| Transcription | 15 minutes | Error with video/audio ID and stage |
| Summary Generation | 5 minutes | Error with video/audio ID and stage |
| QC Checks | 5 minutes | Error with video/audio ID and stage |

**On timeout, you'll see:**
```
Error: Download timeout (10 minutes exceeded). 
Video: qeTjwd69Nxw, 
Stage: download, 
Log: /path/to/output/qeTjwd69Nxw/download.log
```

The request will be marked as `failed` with full error details in `error_details` JSON.

---

## Verification Checklist

### ✅ Before Starting

- [ ] PostgreSQL is running (`docker compose up -d`)
- [ ] `.env.local` has all required API keys
- [ ] Database schema is up to date (`npm run db:push`)

### ✅ Start Servers

- [ ] Terminal 1: `npm run dev` (Next.js at http://localhost:3000)
- [ ] Terminal 2: `npm run inngest:dev` (Inngest at http://localhost:8288)

### ✅ Verify Registration

- [ ] Open http://localhost:8288
- [ ] See `process-episode` function listed
- [ ] See `process-episode-on-failure` function listed

### ✅ Trigger Test Ingest

- [ ] Go to http://localhost:3000/upload
- [ ] Submit URL: `https://www.youtube.com/watch?v=qeTjwd69Nxw`
- [ ] See success message in UI

### ✅ Confirm Execution Started

- [ ] Terminal shows `🚀 PROCESS_EPISODE_START` with requestId
- [ ] Inngest dashboard shows new run
- [ ] Database shows `status: 'running'`

### ✅ Watch Progress

- [ ] Terminal shows `[Step 0]`, `[Step 1]`, etc.
- [ ] Inngest dashboard shows multiple steps (not one long execution)
- [ ] Database `stage` column updates: `metadata` → `download` → `transcribe` → ...

### ✅ Verify Completion

- [ ] Terminal shows `✅ PROCESS_EPISODE_COMPLETE`
- [ ] Inngest dashboard shows all steps green ✅
- [ ] Database shows `status: 'succeeded'`, `stage: 'completed'`
- [ ] Episode appears in UI at http://localhost:3000/dashboard

---

## Troubleshooting

### "No functions registered" in Inngest Dashboard

**Cause:** Inngest Dev Server can't reach your Next.js app.

**Fix:**
1. Ensure Next.js is running on the correct port
2. Check the URL in `inngest:dev` script matches your Next.js port
3. Restart Inngest Dev Server: `npm run inngest:dev`

### "Execution stuck in 'running' with no logs"

**Cause:** Function is running but not logging, or crashed silently.

**Fix:**
1. Check Next.js terminal for errors
2. Check Inngest dashboard for step details
3. Query database: `SELECT * FROM ingest_requests WHERE status = 'running' ORDER BY updated_at DESC;`
4. If `updated_at` is old (>30 min), the run is stuck - check for crashes

### "Download step times out"

**Cause:** YouTube blocking, network issues, or video unavailable.

**Fix:**
1. Check `output/{videoId}/download.log` for details
2. Verify yt-dlp binary is working: `npx tsx scripts/debug-ytdlp.ts`
3. Try a different video ID
4. Check if YouTube is rate-limiting your IP

### "Database shows 'failed' but no error message"

**Cause:** Error occurred before DB update, or exception in error handler.

**Fix:**
1. Check Next.js terminal for stack traces
2. Check `output/{videoId}/error.json` if it exists
3. Check Inngest dashboard for error details

---

## Advanced: Debugging Specific Steps

### Debug Download Step

```bash
# Run standalone download test
npx tsx scripts/debug-ytdlp.ts

# Check logs
cat output/qeTjwd69Nxw/download.log
```

### Debug Transcription Step

```bash
# Check Deepgram API key
echo $DEEPGRAM_API_KEY

# Test with curl (if you have a direct audio URL)
curl -X POST "https://api.deepgram.com/v1/listen" \
  -H "Authorization: Token $DEEPGRAM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/audio.mp3"}'
```

### Debug Summary/QC Steps

```bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Test with curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## Next Steps

Once local dev is working:

1. **Deploy to Netlify:** See `docs/troubleshooting-ytdlp.md` for deployment notes
2. **Monitor Production:** Use Inngest Cloud dashboard for production runs
3. **Set up Alerts:** Configure Inngest to notify on failures

---

## Quick Reference

| What | URL |
|------|-----|
| Next.js App | http://localhost:3000 |
| Inngest Dashboard | http://localhost:8288 |
| Inngest Endpoint | http://localhost:3000/api/inngest |
| Upload Page | http://localhost:3000/upload |
| Admin Dashboard | http://localhost:3000/admin |

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server |
| `npm run inngest:dev` | Start Inngest dev server |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |
| `npx tsx scripts/debug-ytdlp.ts` | Test yt-dlp standalone |
