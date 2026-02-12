import { NextResponse } from "next/server.js";
import { requireAdmin } from "../../../lib/auth.js";
import { sql } from "../../../lib/db.js";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      description,
      ingest_enabled,
      ingest_source,
      youtube_channel_id,
      youtube_playlist_id,
      rss_feed_url,
      ingest_frequency,
    } = body;

    // Insert new show
    const [show] = await sql`
      INSERT INTO shows (
        name,
        description,
        ingest_enabled,
        ingest_source,
        youtube_channel_id,
        youtube_playlist_id,
        rss_feed_url,
        ingest_frequency
      ) VALUES (
        ${name},
        ${description || null},
        ${ingest_enabled || false},
        ${ingest_source || null},
        ${youtube_channel_id || null},
        ${youtube_playlist_id || null},
        ${rss_feed_url || null},
        ${ingest_frequency || 'daily'}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, show });
  } catch (error) {
    console.error("Error creating show:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create show" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      id,
      name,
      description,
      ingest_enabled,
      ingest_source,
      youtube_channel_id,
      youtube_playlist_id,
      rss_feed_url,
      ingest_frequency,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Show ID is required" },
        { status: 400 }
      );
    }

    // Update show
    const [show] = await sql`
      UPDATE shows
      SET
        name = ${name},
        description = ${description || null},
        ingest_enabled = ${ingest_enabled || false},
        ingest_source = ${ingest_source || null},
        youtube_channel_id = ${youtube_channel_id || null},
        youtube_playlist_id = ${youtube_playlist_id || null},
        rss_feed_url = ${rss_feed_url || null},
        ingest_frequency = ${ingest_frequency || 'daily'},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!show) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, show });
  } catch (error) {
    console.error("Error updating show:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update show" },
      { status: 500 }
    );
  }
}
