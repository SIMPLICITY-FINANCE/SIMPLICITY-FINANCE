import { NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    console.log('[SAVED API] Fetching saved episodes for user:', DEMO_USER_ID);
    
    const savedEpisodes = await sql`
      SELECT 
        si.id,
        si.episode_id,
        COALESCE(s.title, e.youtube_title, 'Untitled Episode') as title,
        COALESCE(s.published_at, e.published_at::text) as published_at,
        COALESCE(s.video_id, e.video_id) as video_id,
        e.youtube_channel_title,
        si.created_at as saved_at
      FROM saved_items si
      JOIN episodes e ON si.episode_id = e.id
      LEFT JOIN episode_summary s ON e.id = s.episode_id
      WHERE si.item_type = 'episode'
        AND si.user_id = ${DEMO_USER_ID}
      ORDER BY si.created_at DESC
      LIMIT 50
    `;

    console.log('[SAVED API] ✅ Found', savedEpisodes.length, 'saved episodes');
    if (savedEpisodes.length > 0) {
      console.log('[SAVED API] First 3 episode IDs:', savedEpisodes.slice(0, 3).map(e => e.episode_id));
    }

    return NextResponse.json(savedEpisodes);
  } catch (error) {
    console.error('[SAVED API] ❌ Error fetching saved episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved episodes' },
      { status: 500 }
    );
  }
}
