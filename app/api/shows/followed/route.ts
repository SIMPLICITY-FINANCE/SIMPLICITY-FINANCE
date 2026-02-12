import { NextResponse } from "next/server";
import { sql } from "../../../lib/db.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

// GET - get all shows the user follows
export async function GET() {
  try {
    const followedShows = await sql`
      SELECT
        fs.youtube_channel_id as channel_id,
        fs.youtube_channel_title as name,
        fs.created_at as followed_at,
        s.channel_thumbnail,
        COUNT(DISTINCT e.id)::int as episode_count
      FROM followed_shows fs
      LEFT JOIN shows s ON s.channel_id = fs.youtube_channel_id
      LEFT JOIN episodes e ON e.youtube_channel_id = fs.youtube_channel_id AND e.is_published = true
      WHERE fs.user_id = ${DEMO_USER_ID}
      GROUP BY fs.youtube_channel_id, fs.youtube_channel_title, fs.created_at, s.channel_thumbnail
      ORDER BY fs.created_at DESC
    `;

    return NextResponse.json({ shows: followedShows });
  } catch (error) {
    console.error("[FOLLOW] Error fetching followed shows:", error);
    return NextResponse.json({ shows: [] });
  }
}
