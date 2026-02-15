import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db.js';

export async function GET() {
  try {
    const episodes = await sql`
      SELECT 
        e.id,
        COALESCE(e.youtube_title, 'Untitled Episode') as title,
        e.video_id as slug,
        e.youtube_thumbnail_url as thumbnail_url,
        e.published_at,
        e.youtube_channel_title as show_name,
        s.channel_id as show_slug,
        s.channel_thumbnail as show_thumbnail
      FROM episodes e
      LEFT JOIN shows s ON e.youtube_channel_id = s.channel_id
      WHERE e.is_published = true
        AND EXISTS (SELECT 1 FROM episode_summary es WHERE es.episode_id = e.id)
      ORDER BY COALESCE(e.published_at, e.created_at) DESC
      LIMIT 5
    `;

    return NextResponse.json({ episodes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, episodes: [] }, { status: 500 });
  }
}
