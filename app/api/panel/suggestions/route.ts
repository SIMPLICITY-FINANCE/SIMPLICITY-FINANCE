import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db.js';

export async function GET() {
  try {
    const suggestions = await sql`
      SELECT 
        id,
        host_name,
        host_slug,
        host_image_url,
        name as show_name
      FROM shows
      WHERE host_name IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 6
    `;

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, suggestions: [] }, { status: 500 });
  }
}
