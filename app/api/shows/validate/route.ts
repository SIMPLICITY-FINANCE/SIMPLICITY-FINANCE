import { NextRequest, NextResponse } from "next/server";
import { resolveYouTubeUrl } from "../../../lib/youtube/api.js";
import { parseYouTubeUrl } from "../../../lib/youtube/parser.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    const parsed = parseYouTubeUrl(url);
    if (parsed.type === "invalid") {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL format" }, { status: 400 });
    }

    const channelMetadata = await resolveYouTubeUrl(url);

    // Check if already exists
    const existing = await sql`
      SELECT id, name FROM shows WHERE channel_id = ${channelMetadata.id}
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Channel already exists as "${existing[0]?.name}"`,
      });
    }

    return NextResponse.json({ success: true, channel: channelMetadata });
  } catch (error) {
    console.error("Error validating YouTube URL:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to validate URL" },
      { status: 500 }
    );
  }
}
