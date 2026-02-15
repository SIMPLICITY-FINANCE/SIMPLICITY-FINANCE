import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db.js';

export async function GET() {
  try {
    const episodes = await sql`
      SELECT DISTINCT ON (e.id)
        e.id,
        COALESCE(e.youtube_title, 'Untitled Episode') as title,
        e.video_id as slug,
        e.youtube_thumbnail_url as thumbnail_url,
        e.published_at,
        e.youtube_channel_title as show_name,
        s.channel_id as show_slug,
        s.channel_thumbnail as show_thumbnail,
        COALESCE(e.published_at, e.created_at) as sort_date
      FROM episodes e
      LEFT JOIN shows s ON e.youtube_channel_id = s.channel_id
      WHERE e.is_published = true
        AND EXISTS (SELECT 1 FROM episode_summary es WHERE es.episode_id = e.id)
      ORDER BY e.id, COALESCE(e.published_at, e.created_at) DESC
      LIMIT 5
    `;

    // Re-sort by date after deduplication
    const sorted = episodes.sort((a: any, b: any) => 
      new Date(b.sort_date).getTime() - new Date(a.sort_date).getTime()
    );

    return NextResponse.json({ episodes: sorted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, episodes: [] }, { status: 500 });
  }
}
