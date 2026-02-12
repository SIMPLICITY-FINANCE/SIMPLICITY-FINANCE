import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../../lib/db.js";

export async function POST(request: NextRequest) {
  try {
    const { start, end } = await request.json();

    if (!start || !end) {
      return NextResponse.json({ error: "start and end are required" }, { status: 400 });
    }

    const periodStart = `${start}T00:00:00Z`;
    const periodEnd = `${end}T23:59:59Z`;

    console.log(`[Preview] Date range: ${periodStart} to ${periodEnd}`);

    const episodes = await sql`
      SELECT
        e.id,
        COALESCE(e.youtube_title, 'Untitled Episode') as title,
        COALESCE(e.youtube_channel_title, 'Unknown') as channel,
        COALESCE(e.published_at::text, e.created_at::text) as published_at
      FROM episodes e
      JOIN episode_summary s ON s.episode_id = e.id
      WHERE e.is_published = true
        AND e.published_at >= ${periodStart}::timestamp
        AND e.published_at <= ${periodEnd}::timestamp
      ORDER BY e.published_at ASC
    `;

    console.log(`[Preview] Found ${episodes.length} episodes`);
    for (const ep of episodes) {
      console.log(`  - ${ep.title} (${ep.published_at})`);
    }

    return NextResponse.json({
      episodes,
      count: episodes.length,
      start: periodStart,
      end: periodEnd,
    });
  } catch (error) {
    console.error("[Preview] Error:", error);
    return NextResponse.json(
      { error: "Failed to preview episodes" },
      { status: 500 }
    );
  }
}
