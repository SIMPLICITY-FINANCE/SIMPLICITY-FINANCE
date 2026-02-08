import { NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  // 1) Raw saved_items rows
  const savedRows = await sql`
    SELECT id, user_id, item_type, episode_id, created_at
    FROM saved_items
    WHERE user_id = ${DEMO_USER_ID}
      AND item_type = 'episode'
  `;

  const savedEpisodeIds = savedRows.map(r => r.episode_id).filter(Boolean);

  // 2) Check which of those IDs actually exist in episodes table
  let episodeRowsFound: any[] = [];
  if (savedEpisodeIds.length > 0) {
    episodeRowsFound = await sql`
      SELECT id, youtube_title, is_published
      FROM episodes
      WHERE id = ANY(${savedEpisodeIds})
    `;
  }
  const foundIds = new Set(episodeRowsFound.map(r => r.id));
  const missingEpisodeIds = savedEpisodeIds.filter(id => !foundIds.has(id));

  // 3) Check which have approved summaries (the /api/saved query requires this)
  let summaryRows: any[] = [];
  if (savedEpisodeIds.length > 0) {
    summaryRows = await sql`
      SELECT episode_id, id as summary_id, approval_status, title
      FROM episode_summary
      WHERE episode_id = ANY(${savedEpisodeIds})
    `;
  }
  const approvedSummaryEpisodeIds = summaryRows
    .filter(r => r.approval_status === 'approved')
    .map(r => r.episode_id);
  const missingApprovedSummary = savedEpisodeIds.filter(
    id => foundIds.has(id) && !approvedSummaryEpisodeIds.includes(id)
  );

  // 4) Run the exact same query as /api/saved to see what it returns
  let apiSavedResult: any[] = [];
  try {
    apiSavedResult = await sql`
      SELECT 
        si.id,
        si.episode_id,
        s.title,
        s.published_at,
        s.video_id,
        e.youtube_channel_title,
        si.created_at as saved_at
      FROM saved_items si
      JOIN episodes e ON si.episode_id = e.id
      JOIN episode_summary s ON e.id = s.episode_id
      WHERE si.item_type = 'episode'
        AND si.user_id = ${DEMO_USER_ID}
        AND s.approval_status = 'approved'
      ORDER BY si.created_at DESC
      LIMIT 50
    `;
  } catch (err: any) {
    apiSavedResult = [{ error: err.message }];
  }

  const result = {
    userId: DEMO_USER_ID,
    savedRows: savedRows.map(r => ({
      id: r.id,
      episodeId: r.episode_id,
      itemType: r.item_type,
    })),
    savedEpisodeIds,
    episodeRowsFound: episodeRowsFound.map(r => ({
      id: r.id,
      title: r.youtube_title,
      isPublished: r.is_published,
    })),
    missingEpisodeIds,
    summaryRows: summaryRows.map(r => ({
      episodeId: r.episode_id,
      summaryId: r.summary_id,
      approvalStatus: r.approval_status,
      title: r.title,
    })),
    missingApprovedSummary,
    apiSavedQuery: {
      count: apiSavedResult.length,
      rows: apiSavedResult.slice(0, 5),
    },
    diagnosis: '',
  };

  // Diagnosis
  if (savedRows.length === 0) {
    result.diagnosis = 'No saved rows at all for this user.';
  } else if (missingEpisodeIds.length > 0) {
    result.diagnosis = `❌ ID MISMATCH: ${missingEpisodeIds.length} saved episode_ids do NOT exist in episodes table. You are saving the WRONG ID.`;
  } else if (missingApprovedSummary.length > 0) {
    result.diagnosis = `❌ SUMMARY FILTER: ${missingApprovedSummary.length} episodes exist but have NO approved summary. The /api/saved query requires approval_status='approved'. Fix: remove that filter OR approve the summaries.`;
  } else if (apiSavedResult.length === 0) {
    result.diagnosis = '❌ JOIN FAILURE: Episodes and summaries exist but the combined query returns 0. Check the JOIN conditions.';
  } else {
    result.diagnosis = `✅ All good: ${apiSavedResult.length} episodes returned from the saved query.`;
  }

  console.log('[SAVED/DEBUG]', JSON.stringify(result, null, 2));

  return NextResponse.json(result);
}
