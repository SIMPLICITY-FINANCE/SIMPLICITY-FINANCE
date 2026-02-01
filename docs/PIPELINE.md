# Episode Processing Pipeline

This document explains how episodes flow through the SIMPLICITY FINANCE processing pipeline from submission to publication.

---

## Pipeline Overview

```
Upload/Schedule → Ingest → Transcribe → Summarize → QC → Approve → Publish
```

**Total Time:** 5-15 minutes per episode (depending on length)

---

## Step-by-Step Flow

### 1. Episode Submission

**Trigger Points:**
- Manual upload at `/upload`
- Scheduled ingestion (daily at 2 AM UTC)
- Direct API submission

**What Happens:**
- URL validated (YouTube or audio)
- Ingest request created in database
- Inngest event `episode/submitted` triggered
- Status: `queued`

**Database Tables:**
- `ingest_requests` - Tracks submission and status

---

### 2. Metadata Ingestion

**Inngest Function:** `processEpisode` (Step 1)

**For YouTube URLs:**
- Fetch video metadata via YouTube Data API
- Extract: title, channel, description, thumbnail, duration
- Check for existing episode by `video_id`

**For Audio URLs:**
- Generate audio ID from URL
- Extract basic metadata if available
- Check for existing episode by `audio_id`

**Output:**
- Episode record created in `episodes` table
- Status updated to `running`

**Database Tables:**
- `episodes` - Episode metadata

---

### 3. Transcription

**Inngest Function:** `processEpisode` (Step 2)

**Process:**
- Download audio (YouTube → audio extraction, or direct audio URL)
- Send to Deepgram API for transcription
- Receive timestamped transcript segments
- Store raw transcript in database

**Output:**
- Transcript segments with timestamps
- Speaker diarization (if available)
- Saved to `transcript_segments_raw` table

**Database Tables:**
- `transcript_segments_raw` - Raw transcript with timestamps

---

### 4. Summary Generation

**Inngest Function:** `processEpisode` (Step 3)

**Process:**
- Load full transcript
- Send to OpenAI GPT-4 with summary prompt
- Extract key points as bullets
- Each bullet includes evidence spans (timestamp ranges)
- Generate title and metadata

**Output:**
- Episode summary with title
- 5-15 summary bullets
- Each bullet has evidence spans linking to transcript
- Saved to `episode_summary` and `summary_bullets` tables

**Database Tables:**
- `episode_summary` - Summary metadata
- `summary_bullets` - Individual key points with evidence

---

### 5. Quality Control (QC)

**Inngest Function:** `processEpisode` (Step 4)

**Process:**
- Load summary and transcript
- Send to OpenAI for QC verification
- Check: accuracy, evidence grounding, completeness
- Generate QC score (0-100)
- Identify any issues

**Output:**
- QC run record with score
- Pass/fail determination
- Issue descriptions if any
- Saved to `qc_runs` table

**Database Tables:**
- `qc_runs` - QC results and scores

---

### 6. Database Write

**Inngest Function:** `processEpisode` (Step 5)

**Process:**
- All data already written incrementally
- Final status update
- Mark ingest request as `succeeded`
- Link episode ID to ingest request

**Output:**
- Complete episode in database
- Summary status: `pending` (awaiting approval)
- Ingest request status: `succeeded`

---

### 7. Admin Approval

**Manual Step:** Admin reviews at `/admin/approvals`

**Admin Actions:**
- Review summary and bullets
- Check evidence grounding
- Verify QC score
- Approve or reject

**Approval:**
- Status → `approved`
- Episode appears in public feed
- Searchable by users

**Rejection:**
- Status → `rejected`
- Reason recorded
- Episode hidden from public

**Database Tables:**
- `episode_summary` - `approval_status` updated
- `admin_audit_logs` - Admin action recorded

---

### 8. Publication

**Automatic:** Once approved

**What Happens:**
- Episode appears in `/dashboard` feed
- Searchable via `/search`
- Bullets saveable to notebook
- Episode saveable to saved items
- Included in weekly/monthly reports

---

## Error Handling

### Failure Points

**Ingestion Failure:**
- Invalid URL
- Video unavailable
- API quota exceeded

**Transcription Failure:**
- Audio extraction failed
- Deepgram API error
- No audio track available

**Summary Failure:**
- OpenAI API error
- Transcript too long
- Rate limit exceeded

**QC Failure:**
- QC score too low
- Evidence grounding issues
- OpenAI API error

### Error Recovery

**Automatic Retry:**
- Inngest retries failed steps (exponential backoff)
- Max 3 retries per step

**Manual Retry:**
- Admin can retry from `/admin/ingest`
- Re-triggers workflow from beginning

**Error Visibility:**
- Failed requests shown in `/admin/ops`
- Error details in `/admin/ingest`
- Inngest UI shows step-by-step execution

---

## Idempotency

**Unique Constraints:**
- `video_id` - Prevents duplicate YouTube videos
- `audio_id` - Prevents duplicate audio URLs
- `url` in ingest_requests - Prevents duplicate submissions

**Safe to Retry:**
- All steps check for existing data
- No duplicate processing
- Existing records updated, not duplicated

---

## Monitoring

### Real-Time Monitoring

**Inngest UI:** http://localhost:8288
- View all workflow executions
- See step-by-step progress
- Inspect errors and retries
- Trigger manual runs

**Upload Status:** `/upload`
- Live status updates (3-second polling)
- Shows: queued → running → succeeded/failed
- Links to episode when succeeded

**Admin Ingest:** `/admin/ingest`
- All ingest requests (last 50)
- Retry failed requests
- Delete requests
- View detailed errors

**Ops Dashboard:** `/admin/ops`
- Recent failures (last 20)
- System statistics
- Health metrics

### Health Checks

**Endpoint:** `/api/health`
- Database connectivity
- System status
- Version info

---

## Performance

**Typical Processing Times:**

| Step | Duration |
|------|----------|
| Ingestion | 5-10 seconds |
| Transcription | 2-5 minutes |
| Summary | 1-2 minutes |
| QC | 30-60 seconds |
| **Total** | **5-10 minutes** |

**Factors Affecting Speed:**
- Episode length (longer = slower transcription)
- API response times
- Network latency
- Queue depth

---

## Database Schema

**Core Tables:**
- `episodes` - Episode metadata
- `transcript_segments_raw` - Timestamped transcript
- `episode_summary` - Generated summaries
- `summary_bullets` - Key points with evidence
- `qc_runs` - Quality control results
- `ingest_requests` - Upload tracking

**Relationships:**
```
episodes (1) → (1) episode_summary
episode_summary (1) → (many) summary_bullets
episode_summary (1) → (many) qc_runs
episodes (1) → (many) transcript_segments_raw
ingest_requests (1) → (1) episodes
```

---

## API Keys Required

**YouTube Data API:**
- Used for: Video metadata
- Quota: 10,000 units/day
- Cost: Free tier

**Deepgram API:**
- Used for: Audio transcription
- Cost: $0.0125/minute
- Typical episode: $0.50-$2.00

**OpenAI API:**
- Used for: Summary generation, QC
- Model: GPT-4
- Cost: ~$0.10-$0.50 per episode

---

## Scheduled Ingestion

**Cron Schedule:** Daily at 2 AM UTC

**Process:**
1. Fetch all shows with `ingest_enabled = true`
2. For each show, check configured source:
   - YouTube channel: Fetch latest 10 videos
   - YouTube playlist: Fetch latest 10 playlist items
   - RSS feed: Parse feed, extract audio URLs
3. Check for existing episodes (by video_id or audio_id)
4. Trigger `episode/submitted` for new episodes
5. Update `last_ingested_at` timestamp

**Configuration:**
```sql
UPDATE shows 
SET 
  ingest_enabled = true,
  ingest_source = 'youtube_channel',
  youtube_channel_id = 'UC...'
WHERE id = '...';
```

---

## Troubleshooting

### Episode Stuck in "Running"

**Check:**
1. Inngest UI for step failures
2. `/admin/ingest` for error details
3. Inngest event ID for logs

**Fix:**
- Retry from `/admin/ingest`
- Check API keys are valid
- Verify URL is accessible

### Transcription Failed

**Common Causes:**
- No audio track in video
- Video too long (>3 hours)
- Deepgram API quota exceeded

**Fix:**
- Check video has audio
- Verify Deepgram API key
- Check Deepgram dashboard for quota

### Summary Quality Issues

**If QC Score Low:**
- Review transcript quality
- Check for non-English content
- Verify episode is finance-related

**If Evidence Spans Missing:**
- Bug in summary generation
- Retry episode processing
- Check OpenAI API response

---

## Development Workflow

**Local Testing:**
1. Start services: `npm run dev`, `npx inngest-cli@latest dev`
2. Submit test URL at `/upload`
3. Monitor in Inngest UI
4. Check results in `/admin/approvals`

**Debugging:**
1. Check Inngest UI for step-by-step execution
2. View error details in `/admin/ingest`
3. Check database for partial data
4. Review server logs for errors

---

**Last Updated:** 2026-02-01  
**Version:** 1.0.0
