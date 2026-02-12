"use server";

import { requireAdmin } from "../auth.js";
import { inngest } from "../../../inngest/client.js";
import { sql } from "../db.js";

/**
 * Manually trigger ingestion for a specific show
 * Reuses the same logic as the scheduled ingest job
 */
export async function runShowIngest(showId: string) {
  try {
    await requireAdmin();

    // Fetch show details
    const [show] = await sql`
      SELECT 
        id,
        name,
        ingest_enabled,
        ingest_source,
        youtube_channel_id,
        youtube_playlist_id,
        rss_feed_url
      FROM shows
      WHERE id = ${showId}
    `;

    if (!show) {
      return {
        success: false,
        error: "Show not found",
      };
    }

    if (!show.ingest_enabled) {
      return {
        success: false,
        error: "Ingestion is not enabled for this show",
      };
    }

    if (!show.ingest_source) {
      return {
        success: false,
        error: "No ingestion source configured",
      };
    }

    // Trigger ingestion based on source type
    let newEpisodesCount = 0;
    const errors: string[] = [];

    if (show.ingest_source === "youtube_channel" && show.youtube_channel_id) {
      // Fetch latest videos from YouTube channel
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${show.youtube_channel_id}&part=snippet&order=date&type=video&maxResults=10`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      const videos = data.items || [];

      for (const video of videos) {
        const videoId = video.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        // Check if episode already exists
        const [existing] = await sql`
          SELECT id FROM episodes WHERE video_id = ${videoId}
        `;

        if (!existing) {
          // Create ingest request
          const [request] = await sql`
            INSERT INTO ingest_requests (url, source, status)
            VALUES (${url}, 'youtube', 'queued')
            RETURNING id
          `;

          // Trigger Inngest workflow
          await inngest.send({
            name: "episode/submitted",
            data: {
              url,
              source: "youtube",
              requestId: request!.id,
            },
          });

          newEpisodesCount++;
        }
      }
    } else if (show.ingest_source === "youtube_playlist" && show.youtube_playlist_id) {
      // Fetch latest videos from YouTube playlist
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE_API_KEY}&playlistId=${show.youtube_playlist_id}&part=snippet&maxResults=10`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      const items = data.items || [];

      for (const item of items) {
        const videoId = item.snippet.resourceId.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        // Check if episode already exists
        const [existing] = await sql`
          SELECT id FROM episodes WHERE video_id = ${videoId}
        `;

        if (!existing) {
          // Create ingest request
          const [request] = await sql`
            INSERT INTO ingest_requests (url, source, status)
            VALUES (${url}, 'youtube', 'queued')
            RETURNING id
          `;

          // Trigger Inngest workflow
          await inngest.send({
            name: "episode/submitted",
            data: {
              url,
              source: "youtube",
              requestId: request!.id,
            },
          });

          newEpisodesCount++;
        }
      }
    } else if (show.ingest_source === "rss" && show.rss_feed_url) {
      // RSS ingestion would go here
      // For now, return not implemented
      return {
        success: false,
        error: "RSS ingestion not yet implemented in manual trigger",
      };
    }

    // Update last_ingested_at
    await sql`
      UPDATE shows
      SET last_ingested_at = NOW()
      WHERE id = ${showId}
    `;

    return {
      success: true,
      message: newEpisodesCount > 0
        ? `Triggered ingestion for ${newEpisodesCount} new episode(s)`
        : "No new episodes found",
      newEpisodesCount,
    };
  } catch (error) {
    console.error("Error running show ingest:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to run ingestion",
    };
  }
}
