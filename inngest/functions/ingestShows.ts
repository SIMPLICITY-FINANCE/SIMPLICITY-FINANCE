import { inngest } from "../client.js";
import postgres from "postgres";
import { getChannelVideos } from "../../app/lib/youtube/api.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface EnabledShow {
  id: string;
  name: string;
  channel_id: string;
  channel_handle: string | null;
  last_videos_to_ingest: number;
  last_ingested_at: string | null;
  total_episodes_ingested: number;
}

interface IngestResult {
  show: string;
  showId: string;
  status: "success" | "no_new_videos" | "error";
  checked?: number;
  newVideos?: number;
  videoIds?: string[];
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scheduled Show Ingestion — runs every 6 hours
// ─────────────────────────────────────────────────────────────────────────────

export const ingestShowsScheduled = inngest.createFunction(
  {
    id: "ingest-shows-scheduled",
    name: "Ingest Shows (Scheduled)",
    retries: 1,
  },
  { cron: "0 */6 * * *" }, // Every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC
  async ({ step }) => {
    console.log("[INGEST] ═══════════════════════════════════════════════════");
    console.log("[INGEST] Starting scheduled show ingestion");
    console.log("[INGEST] ═══════════════════════════════════════════════════");

    // Step 1: Get all enabled shows
    const enabledShows = await step.run("get-enabled-shows", async () => {
      const shows = await sql<EnabledShow[]>`
        SELECT
          id,
          name,
          channel_id,
          channel_handle,
          COALESCE(last_videos_to_ingest, 2) as last_videos_to_ingest,
          last_ingested_at,
          COALESCE(total_episodes_ingested, 0) as total_episodes_ingested
        FROM shows
        WHERE status = 'enabled'
        ORDER BY last_checked_at ASC NULLS FIRST
      `;

      console.log(`[INGEST] Found ${shows.length} enabled show(s)`);
      return shows;
    });

    if (enabledShows.length === 0) {
      console.log("[INGEST] No enabled shows — skipping");
      return { message: "No enabled shows to ingest", results: [] };
    }

    // Step 2: Process each show individually (each is its own step for resilience)
    const results: IngestResult[] = [];

    for (const show of enabledShows) {
      const result = await step.run(`ingest-show-${show.id}`, async () => {
        return await ingestSingleShow(show);
      });
      results.push(result);
    }

    // Step 3: Build summary
    const summary = {
      totalShows: enabledShows.length,
      successful: results.filter((r) => r.status === "success").length,
      noNewVideos: results.filter((r) => r.status === "no_new_videos").length,
      failed: results.filter((r) => r.status === "error").length,
      totalVideosIngested: results
        .filter((r) => r.status === "success")
        .reduce((sum, r) => sum + (r.newVideos || 0), 0),
      results,
    };

    console.log("[INGEST] ═══════════════════════════════════════════════════");
    console.log(`[INGEST] Complete: ${summary.successful} success, ${summary.noNewVideos} no-new, ${summary.failed} failed`);
    console.log(`[INGEST] Total new videos queued: ${summary.totalVideosIngested}`);
    console.log("[INGEST] ═══════════════════════════════════════════════════");

    return summary;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Manual Ingestion — triggered via event from admin UI
// ─────────────────────────────────────────────────────────────────────────────

export const ingestShowManual = inngest.createFunction(
  {
    id: "ingest-show-manual",
    name: "Ingest Show (Manual)",
    retries: 0,
  },
  { event: "show/ingest.manual" },
  async ({ event, step }) => {
    const { showId } = event.data;

    console.log(`[INGEST] Manual ingestion triggered for show ${showId}`);

    // Get the show
    const show = await step.run("get-show", async () => {
      const [row] = await sql<EnabledShow[]>`
        SELECT
          id,
          name,
          channel_id,
          channel_handle,
          COALESCE(last_videos_to_ingest, 2) as last_videos_to_ingest,
          last_ingested_at,
          COALESCE(total_episodes_ingested, 0) as total_episodes_ingested
        FROM shows
        WHERE id = ${showId}
      `;

      if (!row) throw new Error(`Show ${showId} not found`);
      return row;
    });

    // Ingest
    const result = await step.run("ingest-show", async () => {
      return await ingestSingleShow(show);
    });

    console.log(`[INGEST] Manual ingestion result for "${show.name}":`, result);
    return result;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Core ingestion logic for a single show
// ─────────────────────────────────────────────────────────────────────────────

async function ingestSingleShow(show: EnabledShow): Promise<IngestResult> {
  try {
    console.log(`[INGEST] Processing: ${show.name} (${show.channel_handle || show.channel_id})`);

    // 1. Fetch latest videos from YouTube
    const videos = await getChannelVideos(show.channel_id, show.last_videos_to_ingest);
    console.log(`[INGEST]   Found ${videos.length} recent video(s)`);

    // 2. Update last_checked_at regardless of whether we find new videos
    await sql`
      UPDATE shows
      SET last_checked_at = NOW(), updated_at = NOW()
      WHERE id = ${show.id}
    `;

    // 3. Filter out videos already in the database
    const newVideos = await filterNewVideos(videos);
    console.log(`[INGEST]   ${newVideos.length} new video(s) to ingest`);

    if (newVideos.length === 0) {
      return {
        show: show.name,
        showId: show.id,
        status: "no_new_videos",
        checked: videos.length,
      };
    }

    // 4. Trigger episode processing for each new video
    const videoIds: string[] = [];

    for (const video of newVideos) {
      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      console.log(`[INGEST]   Queuing: ${video.title} (${video.id})`);

      await inngest.send({
        name: "episode/submitted",
        data: {
          url: videoUrl,
          showId: show.id,
          autoApprove: true,
          // No requestId — this is automatic ingestion, not a manual ingest request
        },
      });

      videoIds.push(video.id);
    }

    // 5. Update show stats
    await sql`
      UPDATE shows
      SET
        last_ingested_at = NOW(),
        total_episodes_ingested = COALESCE(total_episodes_ingested, 0) + ${newVideos.length},
        updated_at = NOW()
      WHERE id = ${show.id}
    `;

    console.log(`[INGEST]   ✅ Queued ${newVideos.length} video(s) for processing`);

    return {
      show: show.name,
      showId: show.id,
      status: "success",
      checked: videos.length,
      newVideos: newVideos.length,
      videoIds,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[INGEST]   ❌ Error for ${show.name}: ${errorMsg}`);

    // Still update last_checked_at on error so we don't hammer a broken show
    try {
      await sql`
        UPDATE shows
        SET last_checked_at = NOW(), updated_at = NOW()
        WHERE id = ${show.id}
      `;
    } catch {
      // ignore secondary error
    }

    return {
      show: show.name,
      showId: show.id,
      status: "error",
      error: errorMsg,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter out videos that already exist in the episodes table
// ─────────────────────────────────────────────────────────────────────────────

async function filterNewVideos(videos: { id: string; title: string }[]): Promise<{ id: string; title: string }[]> {
  if (videos.length === 0) return [];

  const videoIds = videos.map((v) => v.id);

  // Check which video IDs already exist
  const existing = await sql`
    SELECT video_id FROM episodes WHERE video_id = ANY(${videoIds})
  `;

  const existingIds = new Set(existing.map((row) => row.video_id));

  return videos.filter((v) => !existingIds.has(v.id));
}
