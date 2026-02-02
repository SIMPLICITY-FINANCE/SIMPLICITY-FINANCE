# Milestone 4: Real Data Ingestion - Testing Guide

## Overview
Milestone 4 implements real data ingestion with a public upload flow and Inngest workflow integration.

## Features Implemented
1. **Public Upload Page** (`/upload`)
   - YouTube URL validation
   - Duplicate detection (idempotent)
   - Real-time status updates
   - Error handling with user-friendly messages

2. **Server Action** (`app/lib/actions/ingest.ts`)
   - Validates YouTube URLs
   - Checks for existing episodes
   - Triggers Inngest workflow
   - Returns workflow run ID

3. **Inngest Integration**
   - Existing `processEpisode` workflow listens for `episode/submitted` events
   - Handles full pipeline: metadata → transcription → summarization → QC → database

4. **Admin Integration**
   - Updated `/admin/ingest` page with link to upload
   - Shows recent episodes and ingestion stats

## End-to-End Test Path

### Prerequisites
- Local dev server running: `npm run dev`
- Inngest dev server running: `npm run inngest:dev`
- Database seeded with demo data: `npm run db:seed:demo`
- Signed in as admin: `simplicity.finance8@gmail.com`

### Test Steps

#### 1. Submit Episode via Upload Page
```
1. Navigate to: http://localhost:3000/upload
2. Enter a YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Click "Submit Episode"
4. Verify status changes to "Processing"
5. Note the Run ID and Episode ID displayed
```

**Expected Result:**
- Status shows "Processing episode..."
- Run ID is displayed (UUID format)
- Episode ID is displayed (YouTube video ID)
- Workflow steps are listed

#### 2. Monitor Inngest Workflow
```
1. Open Inngest Dev Server: http://localhost:8288
2. Find the run with the displayed Run ID
3. Watch the workflow progress through steps:
   - Fetch YouTube metadata
   - Download audio
   - Transcribe with Deepgram
   - Generate summary with OpenAI
   - Run QC checks
   - Insert into database
```

**Expected Result:**
- All steps complete successfully
- No errors in Inngest logs
- Final step shows database insert success

#### 3. Verify Episode in Database
```
1. Check episodes table:
   SELECT * FROM episodes WHERE video_id = '[EPISODE_ID]';

2. Check episode_summary table:
   SELECT * FROM episode_summary WHERE episode_id = '[EPISODE_ID]';

3. Verify approval_status is 'pending'
```

**Expected Result:**
- Episode exists with YouTube metadata
- Summary exists with status 'pending'
- Bullets are created in summary_bullets table
- QC run exists with score

#### 4. Approve Episode (Admin Flow)
```
1. Navigate to: http://localhost:3000/admin/approve
2. Find the newly submitted episode in the pending list
3. Review the summary and bullets
4. Click "Approve"
```

**Expected Result:**
- Episode moves from pending to approved
- approval_status changes to 'approved'
- approved_by is set to current admin user
- approved_at timestamp is recorded

#### 5. Verify on Dashboard
```
1. Navigate to: http://localhost:3000/dashboard
2. Find the approved episode in the feed
3. Click to view episode details
4. Verify all summary sections and bullets are displayed
```

**Expected Result:**
- Episode appears in dashboard feed
- Episode detail page loads correctly
- All summary content is visible
- QC score is displayed

#### 6. Test Idempotency
```
1. Go back to: http://localhost:3000/upload
2. Submit the SAME YouTube URL again
3. Verify status shows "Episode already exists!"
4. Click "View Episode Details"
```

**Expected Result:**
- No duplicate episode created
- Status immediately shows "complete"
- isExisting flag is true
- Link to existing episode works

#### 7. Test Error Handling
```
1. Go to: http://localhost:3000/upload
2. Submit an invalid URL (e.g., "not a url")
3. Verify error message appears
4. Submit a non-YouTube URL (e.g., "https://google.com")
5. Verify error message appears
```

**Expected Result:**
- Clear error messages displayed
- No workflow triggered
- Form remains editable
- Can retry with valid URL

## Quick Validation Commands

### Check Recent Episodes
```sql
SELECT 
  id, 
  video_id, 
  youtube_title, 
  created_at,
  (SELECT approval_status FROM episode_summary WHERE episode_id = episodes.id) as status
FROM episodes 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Pending Approvals
```sql
SELECT 
  s.id,
  s.title,
  s.approval_status,
  e.video_id,
  s.created_at
FROM episode_summary s
JOIN episodes e ON s.episode_id = e.id
WHERE s.approval_status = 'pending'
ORDER BY s.created_at DESC;
```

### Check Workflow Success Rate
```bash
# In Inngest Dev Server UI
# Navigate to Functions → process-episode
# Check success/failure metrics
```

## Known Limitations (Future Work)

1. **Scheduled Ingestion**: Not implemented yet
   - Currently manual submission only
   - Future: Cron job to fetch RSS feeds
   - Future: Auto-detect new episodes from configured channels

2. **Progress Updates**: Status is fire-and-forget
   - User sees "processing" but no live updates
   - Future: WebSocket or polling for real-time progress

3. **Batch Upload**: Single URL only
   - Future: Support multiple URLs
   - Future: Bulk import from playlist

4. **Channel Management**: No UI for configuring channels
   - Future: Admin page to add/remove channels
   - Future: Schedule configuration per channel

## Success Criteria

✅ Upload page accepts YouTube URLs  
✅ Invalid URLs show clear error messages  
✅ Duplicate URLs are detected (idempotent)  
✅ Inngest workflow is triggered correctly  
✅ Episode appears in database after processing  
✅ Admin can approve/reject from approval queue  
✅ Approved episodes appear on dashboard  
✅ Episode detail page displays correctly  

## Troubleshooting

### Workflow Not Starting
- Check Inngest dev server is running
- Verify Inngest client is configured correctly
- Check console for errors in server action

### Workflow Fails
- Check API keys (YOUTUBE_API_KEY, DEEPGRAM_API_KEY, OPENAI_API_KEY)
- Verify video is publicly accessible
- Check Inngest logs for specific error

### Episode Not in Database
- Verify workflow completed successfully
- Check database connection
- Look for errors in `npm run db:insert` step

### Approval Not Working
- Verify admin role is set correctly
- Check server action logs
- Verify database update query succeeded
