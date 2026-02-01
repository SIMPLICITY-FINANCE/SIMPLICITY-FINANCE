"use server";

import { inngest } from "../../../inngest/client.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface IngestResult {
  success: boolean;
  error?: string;
  episodeId?: string;
  runId?: string;
  isExisting?: boolean;
}

export async function ingestEpisode(url: string): Promise<IngestResult> {
  try {
    // Validate YouTube URL
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid YouTube URL. Please provide a valid YouTube video URL.",
      };
    }

    // Check if episode already exists
    const existing = await sql`
      SELECT id, youtube_title 
      FROM episodes 
      WHERE video_id = ${videoId}
      LIMIT 1
    `;

    if (existing.length > 0 && existing[0]?.id) {
      return {
        success: true,
        episodeId: existing[0].id,
        isExisting: true,
      };
    }

    // Trigger Inngest workflow
    const { ids } = await inngest.send({
      name: "episode/submitted",
      data: { url },
    });

    const runId = ids?.[0];
    if (!runId) {
      return {
        success: false,
        error: "Failed to get workflow run ID",
      };
    }

    return {
      success: true,
      runId,
      episodeId: videoId,
    };
  } catch (error) {
    console.error("Ingest error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit episode for processing",
    };
  }
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
      return urlObj.searchParams.get("v");
    }
    
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
    
    return null;
  } catch {
    return null;
  }
}
