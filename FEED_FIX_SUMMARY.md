# Feed Publishing Fix - Summary

## Root Cause Analysis

**Problem:** Newly processed episodes with summaries were not appearing on the Main Feed after Inngest pipeline completion.

**Root Causes Identified:**

1. **Wrong Data Source:** Feed was querying `episode_summary` table instead of `episodes` table
   - `episode_summary` has `approval_status` field that defaults to `'pending'`
   - Feed query filtered `WHERE approval_status = 'approved'`
   - New episodes required manual approval to appear in feed

2. **Missing Publish Fields:** `episodes` table lacked explicit publishing metadata
   - No `is_published` flag
   - No `published_at` timestamp
   - No `qc_status` or `qc_score` on episodes (only in separate `qc_runs` table)

3. **No Automatic Publishing:** Inngest persistence didn't set publish fields
   - Episodes were created but not marked as published
   - No `published_at` timestamp set on completion

4. **Unstable Ordering:** Feed sorted by `episode_summary.created_at` which could be null or inconsistent

---

## Solution Implemented

### A) Database Schema Changes

**Added to `episodes` table:**
```typescript
isPublished: boolean("is_published").notNull().default(true),
publishedAt: timestamp("published_at"), // Set when episode completes processing
qcStatus: text("qc_status"), // "pass" | "fail" | "warn" | null
qcScore: integer("qc_score"), // 0-100
```

**Indexes added:**
- `episodes_is_published_idx` on `is_published`
- `episodes_published_at_idx` on `published_at`

**Migration:** `db/migrations/0007_daily_the_santerians.sql`

---

### B) Automatic Publishing on Completion

**File:** `scripts/insert_robot_output.ts`

**Changes:**
- Episode INSERT now includes:
  ```sql
  is_published = true,
  published_at = NOW(),
  qc_status = ${qcData.qc_status},
  qc_score = ${qcData.qc_score}
  ```
- Episode UPDATE (on conflict) also updates these fields
- **Result:** Episodes are automatically published when processing completes, regardless of QC status

---

### C) New Feed Query - Single Source of Truth

**File:** `app/(app)/dashboard/page.tsx`

**Before:**
```sql
SELECT ... FROM episode_summary s
LEFT JOIN qc_runs q ON s.id = q.summary_id
LEFT JOIN episodes e ON s.episode_id = e.id
WHERE s.approval_status = 'approved'  -- ❌ Blocks new episodes
ORDER BY s.created_at DESC
```

**After:**
```sql
SELECT ... FROM episodes e
LEFT JOIN episode_summary s ON s.episode_id = e.id
WHERE e.is_published = true           -- ✅ Auto-published on completion
  AND s.id IS NOT NULL                -- Has summary
ORDER BY COALESCE(e.published_at, e.created_at) DESC  -- ✅ Stable ordering
```

**Key Improvements:**
- **Primary table:** `episodes` (not `episode_summary`)
- **No approval filter:** Shows all published episodes immediately
- **Stable ordering:** Uses `published_at` (or falls back to `created_at`)
- **QC-agnostic:** Shows episodes even if `qc_status = 'fail'` (with badge)

---

### D) Summary Preview Extraction

**File:** `lib/feed-helpers.ts` (NEW)

**Functions:**
- `extractSummaryPreview(summary, maxBullets)` - Extracts 2-4 key bullets from summary JSON
- `formatBulletsForDisplay(bullets)` - Formats bullets with `•` prefix
- `extractTopics(summary, maxTopics)` - Extracts section names as topics
- `extractParticipants(summary)` - Placeholder for future participant extraction

**Logic:**
- Prioritizes bullets from first sections
- Sorts by confidence (highest first)
- Counts key quotes from summary JSON
- Returns structured preview data

---

### E) Feed Card UI Updates

**File:** `app/components/feed/FeedEpisodeCard.tsx`

**Added:**
- `quoteCount` prop
- Display: `📝 N key quotes` below topics
- QC badges already implemented (yellow for fail/warn, green for pass)
- Approval badges already implemented (blue for pending, green for approved, red for rejected)

**Feed Card Shows:**
- Title
- Show name + host + date
- 2-4 bullet preview from actual summary
- Topics/tags (from section names)
- Key quote count
- QC status badge (if not pass)
- Approval status badge (if pending/rejected)
- Thumbnail
- Link to episode detail page (episodeId)

---

### F) Cache Revalidation

**File:** `inngest/functions/processEpisode.ts`

**Already implemented in previous session:**
```typescript
// In mark-succeeded step
revalidatePath("/dashboard");
```

**Result:** Dashboard cache clears automatically after episode completes, new episodes appear within seconds.

---

## Data Flow

```
1. Inngest Pipeline Completes
   ↓
2. insert_robot_output.ts persists:
   - episodes (with is_published=true, published_at=NOW(), qc_status, qc_score)
   - episode_summary (with approval_status='pending')
   - summary_bullets (actual bullet points)
   - qc_runs (QC details)
   ↓
3. mark-succeeded step:
   - Updates ingest_requests (status='succeeded')
   - Calls revalidatePath("/dashboard")
   ↓
4. Dashboard query:
   - Fetches FROM episodes WHERE is_published=true AND has summary
   - Joins episode_summary for summary JSON
   - Reconstructs summary JSON from bullets
   - Orders by published_at DESC (stable)
   ↓
5. Feed renders:
   - Extracts preview (4 bullets, quote count, topics)
   - Shows QC badge if fail/warn
   - Shows approval badge if pending
   - Links to episode detail page
```

---

## Files Changed

| File | Status | Purpose |
|------|--------|---------|
| `db/schema.ts` | Modified | Add publish + QC fields to episodes |
| `db/migrations/0007_daily_the_santerians.sql` | NEW | Migration for new fields |
| `scripts/insert_robot_output.ts` | Modified | Set publish fields on episode insert |
| `app/(app)/dashboard/page.tsx` | Modified | Query episodes table, extract previews |
| `lib/feed-helpers.ts` | NEW | Summary preview extraction helpers |
| `app/components/feed/FeedEpisodeCard.tsx` | Modified | Add quoteCount display |
| `inngest/functions/processEpisode.ts` | Already done | revalidatePath on completion |
| `FEED_FIX_SUMMARY.md` | NEW | This document |

**Total:** 5 files modified, 3 files created

---

## Acceptance Criteria Status

### ✅ Episodes Appear After Completion
- Episodes with `is_published=true` and summary appear immediately
- No manual approval required for feed visibility
- Revalidation ensures appearance within 10 seconds

### ✅ QC Fail Episodes Still Appear
- `qc_status='fail'` episodes show with yellow "QC: fail (score)" badge
- Not hidden from feed
- Clearly labeled "Needs Review"

### ✅ Stable Ordering
- `ORDER BY COALESCE(published_at, created_at) DESC`
- Deterministic sort (newest first)
- No re-sorting on updates (stable keys)

### ✅ No UI Jumping
- Stable keys: `episode.episode_id`
- No array replacement (server-side rendering)
- Fixed ordering prevents remounting

### ✅ Preview vs Detail Page
- Feed card shows 2-4 bullet preview only
- Full structured summary (Key Quotes, Sections, Chapters, Links, Video) on detail page
- Detail page remains scrollable with all sections

### ✅ No Duplicates
- Upsert logic in `insert_robot_output.ts` prevents duplicates
- Conflict resolution on `video_id` / `audio_id` / `file_id`
- One ingest → one episode

---

## Testing Instructions

### 1. Submit a Test URL
Go to http://localhost:3001/upload and submit:
```
https://www.youtube.com/watch?v=E5wj2tc2oYE
```

### 2. Monitor Inngest
Watch http://localhost:8288 for:
- All 8 steps completing
- QC status (pass/warn/fail)
- Final success

### 3. Check Dashboard Feed
Go to http://localhost:3001/dashboard

**Expected:**
- New episode appears at top
- Shows 2-4 actual bullet points
- Shows "📝 N key quotes"
- Shows QC badge (if not pass)
- Shows "Pending Review" badge
- No manual refresh needed

### 4. Verify Database
```sql
SELECT 
  e.id,
  e.youtube_title,
  e.is_published,
  e.published_at,
  e.qc_status,
  e.qc_score,
  (SELECT COUNT(*) FROM summary_bullets sb 
   JOIN episode_summary es ON sb.summary_id = es.id 
   WHERE es.episode_id = e.id) as bullet_count
FROM episodes e
WHERE e.is_published = true
ORDER BY e.published_at DESC
LIMIT 1;
```

**Should show:**
- `is_published = true`
- `published_at` = recent timestamp
- `qc_status` and `qc_score` from QC run
- `bullet_count > 0`

---

## Key Improvements

### Before ❌

**Data Source:**
- Queried `episode_summary` table
- Required `approval_status = 'approved'`
- Manual approval workflow blocked feed

**Publishing:**
- No explicit publish fields
- No automatic publishing
- Episodes "existed" but weren't "published"

**Ordering:**
- Sorted by `episode_summary.created_at`
- Could be null or inconsistent

**Preview:**
- Hardcoded summary text or first 3 bullets
- No quote count
- No topic extraction

### After ✅

**Data Source:**
- Queries `episodes` table (single source of truth)
- Filters `is_published = true` (auto-set on completion)
- No approval required for feed visibility

**Publishing:**
- Explicit `is_published`, `published_at`, `qc_status`, `qc_score` fields
- Automatic publishing on Inngest completion
- Episodes are "published" when processing succeeds

**Ordering:**
- Sorted by `COALESCE(published_at, created_at) DESC`
- Stable, deterministic ordering
- Newest first

**Preview:**
- Extracts 2-4 bullets from actual summary JSON
- Shows quote count from summary
- Extracts topics from section names
- Structured preview helpers

---

## Production Considerations

### Approval Workflow

**Current Behavior:**
- All episodes auto-publish to feed with "Pending Review" badge
- Admin can approve/reject via admin panel (existing feature)
- Rejected episodes still appear in feed (with red badge)

**Future Enhancement:**
- Add `is_published = false` for rejected episodes to hide from feed
- Add "Featured" flag for promoted episodes
- Add user role filtering (admins see all, users see approved only)

### Performance

**Current Query:**
- Fetches 50 most recent episodes
- Joins `episode_summary` for summary JSON
- Reconstructs summary JSON from bullets (subquery)
- Indexed on `is_published` and `published_at`

**Optimization Opportunities:**
- Add materialized view for feed data
- Cache summary JSON on episodes table (denormalize)
- Add pagination (cursor-based or page-based)
- Add infinite scroll

### Cache Strategy

**Current:**
- Server-side rendering
- `revalidatePath("/dashboard")` on completion
- No stale data

**Future:**
- Add `revalidate` time (e.g., 60 seconds) for ISR
- Add client-side polling for real-time updates (optional)
- Add optimistic updates for better UX

---

## Summary

**Root Cause:** Feed queried `episode_summary` with approval filter instead of `episodes` table.

**Fix:** Added publish fields to `episodes`, auto-publish on completion, query `episodes` directly.

**Result:** Episodes appear in feed immediately after processing, with actual summary previews, quote counts, and QC badges. No manual approval required for visibility. 🎉
