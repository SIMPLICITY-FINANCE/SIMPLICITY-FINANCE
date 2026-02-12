import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../../lib/db.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

// POST - follow a show by channel ID
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;

    // Look up the channel title from episodes (best effort)
    const [info] = await sql<{ youtube_channel_title: string }[]>`
      SELECT youtube_channel_title
      FROM episodes
      WHERE youtube_channel_id = ${channelId}
        AND youtube_channel_title IS NOT NULL
      LIMIT 1
    `;
    const channelTitle = info?.youtube_channel_title || "Unknown Show";

    // Insert follow, ignore if already exists
    await sql`
      INSERT INTO followed_shows (user_id, youtube_channel_id, youtube_channel_title)
      VALUES (${DEMO_USER_ID}, ${channelId}, ${channelTitle})
      ON CONFLICT DO NOTHING
    `;

    console.log(`[FOLLOW] User followed channel: ${channelId} (${channelTitle})`);
    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("[FOLLOW] Error following show:", error);
    return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
  }
}

// DELETE - unfollow a show by channel ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;

    await sql`
      DELETE FROM followed_shows
      WHERE user_id = ${DEMO_USER_ID}
        AND youtube_channel_id = ${channelId}
    `;

    console.log(`[FOLLOW] User unfollowed channel: ${channelId}`);
    return NextResponse.json({ following: false });
  } catch (error) {
    console.error("[FOLLOW] Error unfollowing show:", error);
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
  }
}

// GET - check if following a show
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;

    const [row] = await sql`
      SELECT id FROM followed_shows
      WHERE user_id = ${DEMO_USER_ID}
        AND youtube_channel_id = ${channelId}
      LIMIT 1
    `;

    return NextResponse.json({ following: !!row });
  } catch (error) {
    console.error("[FOLLOW] Error checking follow status:", error);
    return NextResponse.json({ following: false });
  }
}
