import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db.js';

export async function GET() {
  try {
    const episodes = await sql`
      SELECT 
        e.id,
        e.title,
        e.slug,
        e.thumbnail_url,
        e.published_at,
        s.name as show_name,
        s.slug as show_slug,
        s.channel_thumbnail as show_thumbnail
      FROM episodes e
      LEFT JOIN shows s ON e.show_id = s.id
      WHERE e.is_published = true
      ORDER BY e.published_at DESC
      LIMIT 5
    `;

    return NextResponse.json({ episodes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, episodes: [] }, { status: 500 });
  }
}
