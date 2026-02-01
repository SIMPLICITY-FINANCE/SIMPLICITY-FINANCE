# API Documentation

This document covers all API routes, server actions, and Inngest functions in SIMPLICITY FINANCE.

---

## Server Actions

Server actions are server-side functions that can be called from client components.

### Authentication

#### `getCurrentUser()`

Get the currently authenticated user.

```typescript
import { getCurrentUser } from '@/app/lib/auth';

const user = await getCurrentUser();
// Returns: User | null
```

**Returns:**
```typescript
{
  id: string;
  email: string;
  role: "admin" | "user";
  name: string | null;
}
```

#### `requireAdmin()`

Require admin authentication (redirects if not admin).

```typescript
import { requireAdmin } from '@/app/lib/auth';

const user = await requireAdmin();
// Returns: User (or redirects)
```

---

### Ingest Management

#### `submitIngestRequest(url: string)`

Submit a new episode for processing.

```typescript
import { submitIngestRequest } from '@/app/lib/actions/ingest';

const result = await submitIngestRequest('https://youtube.com/watch?v=...');
```

**Returns:**
```typescript
{
  success: boolean;
  requestId?: string;
  episodeId?: string;
  error?: string;
}
```

#### `getIngestRequests()`

Get user's recent ingest requests.

```typescript
import { getIngestRequests } from '@/app/lib/actions/getIngestRequests';

const requests = await getIngestRequests();
```

**Returns:** Array of ingest requests (last 10)

#### `retryIngestRequest(requestId: string)`

Retry a failed ingest request.

```typescript
import { retryIngestRequest } from '@/app/lib/actions/retryIngest';

const result = await retryIngestRequest(requestId);
```

**Returns:**
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

#### `deleteIngestRequest(requestId: string)`

Delete an ingest request.

```typescript
import { deleteIngestRequest } from '@/app/lib/actions/retryIngest';

const result = await deleteIngestRequest(requestId);
```

---

### Episode Management

#### `deleteEpisode(episodeId: string)`

Delete an episode and all related data (requires admin).

```typescript
import { deleteEpisode } from '@/app/lib/actions/deleteEpisode';

const result = await deleteEpisode(episodeId);
```

**Returns:**
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

**Cascade Deletes:**
- Episode summaries
- Summary bullets
- Transcript segments
- QC runs
- Saved items

#### `getEpisodeDeletionImpact(episodeId: string)`

Preview what will be deleted.

```typescript
import { getEpisodeDeletionImpact } from '@/app/lib/actions/deleteEpisode';

const result = await getEpisodeDeletionImpact(episodeId);
```

**Returns:**
```typescript
{
  success: boolean;
  impact?: {
    title: string;
    summaries: number;
    bullets: number;
    transcriptSegments: number;
    qcRuns: number;
  };
  error?: string;
}
```

---

## API Routes

### Health Check

**Endpoint:** `GET /api/health`

Check system health and database connectivity.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T11:30:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "error",
  "timestamp": "2026-02-01T11:30:00.000Z",
  "database": "disconnected",
  "error": "Connection refused"
}
```

---

### Authentication (NextAuth)

**Base Path:** `/api/auth`

#### Sign In

**Endpoint:** `POST /api/auth/signin/google`

Initiate Google OAuth sign-in flow.

#### Sign Out

**Endpoint:** `POST /api/auth/signout`

Sign out current user.

#### Session

**Endpoint:** `GET /api/auth/session`

Get current session.

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  },
  "expires": "2026-02-08T11:30:00.000Z"
}
```

#### CSRF Token

**Endpoint:** `GET /api/auth/csrf`

Get CSRF token for form submissions.

---

### Admin Ingest

**Endpoint:** `GET /api/admin/ingest`

Get all ingest requests (admin only).

**Response:**
```json
[
  {
    "id": "...",
    "user_id": "...",
    "url": "https://youtube.com/watch?v=...",
    "source": "youtube",
    "status": "succeeded",
    "created_at": "2026-02-01T10:00:00.000Z",
    "episode_id": "..."
  }
]
```

---

## Inngest Functions

Inngest functions are serverless workflows triggered by events.

### Episode Processing

**Function:** `processEpisode`  
**Event:** `episode/submitted`

Main workflow for processing episodes.

**Trigger:**
```typescript
await inngest.send({
  name: "episode/submitted",
  data: {
    url: "https://youtube.com/watch?v=...",
    source: "youtube",
    requestId: "..." // optional
  }
});
```

**Steps:**
1. Ingest metadata
2. Transcribe audio
3. Generate summary
4. Run QC
5. Write to database

**Duration:** 5-15 minutes

---

### Episode Processing Failure Handler

**Function:** `processEpisodeOnFailure`  
**Event:** `inngest/function.failed`

Handles failures in episode processing.

**Automatic Trigger:** When `processEpisode` fails

**Actions:**
- Updates ingest request status to `failed`
- Stores error message and details
- Preserves error.json invariant

---

### Scheduled Ingestion

**Function:** `scheduledIngest`  
**Schedule:** Daily at 2 AM UTC (cron: `0 2 * * *`)

Automatically ingests new episodes from configured shows.

**Process:**
1. Fetch shows with `ingest_enabled = true`
2. Check configured sources (YouTube channel/playlist, RSS)
3. Fetch latest episodes
4. Trigger `episode/submitted` for new episodes
5. Update `last_ingested_at` timestamp

**Returns:**
```typescript
{
  showsProcessed: number;
  totalNewEpisodes: number;
  results: Array<{
    showId: string;
    showName: string;
    newEpisodes?: number;
    success: boolean;
    error?: string;
  }>;
}
```

---

## Database Schema

### Tables

#### `users`
- `id` (uuid, primary key)
- `email` (text, unique)
- `name` (text)
- `role` (text: "admin" | "user")
- `created_at` (timestamp)

#### `shows`
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `youtube_channel_id` (text, unique)
- `ingest_enabled` (boolean)
- `ingest_source` (text)
- `youtube_playlist_id` (text)
- `rss_feed_url` (text)
- `last_ingested_at` (timestamp)
- `ingest_frequency` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `episodes`
- `id` (uuid, primary key)
- `source` (text: "youtube" | "audio" | "local")
- `url` (text)
- `video_id` (text, unique)
- `audio_id` (text, unique)
- `youtube_title` (text)
- `youtube_channel_title` (text)
- `youtube_channel_id` (text)
- `youtube_published_at` (text)
- `youtube_description` (text)
- `youtube_thumbnail_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `episode_summary`
- `id` (uuid, primary key)
- `episode_id` (uuid, foreign key → episodes)
- `version` (text)
- `video_id` (text)
- `title` (text)
- `published_at` (text)
- `approval_status` (text: "pending" | "approved" | "rejected")
- `approved_by` (uuid, foreign key → users)
- `approved_at` (timestamp)
- `rejection_reason` (text)
- `created_at` (timestamp)

#### `summary_bullets`
- `id` (uuid, primary key)
- `summary_id` (uuid, foreign key → episode_summary)
- `bullet_text` (text)
- `evidence_spans` (jsonb)
- `order_index` (integer)
- `created_at` (timestamp)

#### `transcript_segments_raw`
- `id` (uuid, primary key)
- `episode_id` (uuid, foreign key → episodes)
- `start_ms` (integer)
- `end_ms` (integer)
- `speaker` (text)
- `text` (text)
- `created_at` (timestamp)

#### `qc_runs`
- `id` (uuid, primary key)
- `summary_id` (uuid, foreign key → episode_summary)
- `qc_score` (real)
- `qc_passed` (boolean)
- `qc_issues` (jsonb)
- `created_at` (timestamp)

#### `ingest_requests`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `url` (text, unique)
- `source` (text)
- `status` (text: "queued" | "running" | "succeeded" | "failed")
- `created_at` (timestamp)
- `started_at` (timestamp)
- `completed_at` (timestamp)
- `error_message` (text)
- `error_details` (jsonb)
- `episode_id` (uuid, foreign key → episodes)
- `inngest_event_id` (text)

#### `saved_items`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `item_type` (text: "episode" | "report")
- `episode_id` (uuid, foreign key → episodes)
- `report_id` (uuid, foreign key → reports)
- `created_at` (timestamp)

#### `notebook_items`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `bullet_id` (uuid, foreign key → summary_bullets)
- `created_at` (timestamp)

#### `followed_shows`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `show_id` (uuid, foreign key → shows)
- `created_at` (timestamp)

#### `followed_people`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `person_id` (uuid, foreign key → people)
- `created_at` (timestamp)

#### `reports`
- `id` (uuid, primary key)
- `report_type` (text: "weekly" | "monthly")
- `start_date` (text)
- `end_date` (text)
- `title` (text)
- `summary` (text)
- `created_at` (timestamp)

#### `admin_audit_logs`
- `id` (uuid, primary key)
- `admin_id` (uuid, foreign key → users)
- `action` (text)
- `target_type` (text)
- `target_id` (uuid)
- `details` (jsonb)
- `created_at` (timestamp)

---

## Environment Variables

### Required

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External APIs
DEEPGRAM_API_KEY=your_deepgram_api_key
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Optional

```bash
# Environment
NODE_ENV=development

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## Rate Limits

### YouTube Data API
- **Quota:** 10,000 units/day
- **Cost per video:** ~3 units
- **Limit:** ~3,000 videos/day

### Deepgram API
- **Cost:** $0.0125/minute
- **Typical episode:** $0.50-$2.00
- **No hard limit** (pay-as-you-go)

### OpenAI API
- **Model:** GPT-4
- **Cost:** ~$0.10-$0.50 per episode
- **Rate limit:** 10,000 TPM (tokens per minute)

---

## Error Codes

### Ingest Errors

- `INVALID_URL` - URL format invalid
- `VIDEO_NOT_FOUND` - YouTube video not accessible
- `DUPLICATE_EPISODE` - Episode already exists
- `API_QUOTA_EXCEEDED` - YouTube API quota exceeded
- `TRANSCRIPTION_FAILED` - Deepgram API error
- `SUMMARY_FAILED` - OpenAI API error
- `QC_FAILED` - Quality control score too low

---

**Last Updated:** 2026-02-01  
**Version:** 1.0.0
