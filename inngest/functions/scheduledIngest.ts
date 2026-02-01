import { inngest } from "../client.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface Show {
  id: string;
  name: string;
  ingestSource: string | null;
  youtubeChannelId: string | null;
  youtubePlaylistId: string | null;
  rssFeedUrl: string | null;
  lastIngestedAt: Date | null;
}

/**
 * Scheduled job to automatically ingest new episodes from configured shows
 * Runs daily at 2 AM UTC
 */
export const scheduledIngest = inngest.createFunction(
  {
    id: "scheduled-ingest",
    name: "Scheduled Episode Ingest",
  },
  { cron: "0 2 * * *" }, // Daily at 2 AM UTC
  async ({ event, step }) => {
    // Get all shows with ingestion enabled
    const shows = await step.run("fetch-enabled-shows", async () => {
      return await sql<Show[]>`
        SELECT 
          id,
          name,
          ingest_source,
          youtube_channel_id,
          youtube_playlist_id,
          rss_feed_url,
          last_ingested_at
        FROM shows
        WHERE ingest_enabled = true
        ORDER BY last_ingested_at ASC NULLS FIRST
      `;
    });

    if (shows.length === 0) {
      return { message: "No shows configured for automatic ingestion" };
    }

    // Process each show
    const results = await step.run("process-shows", async () => {
      const processed = [];

      for (const show of shows) {
        try {
          let newEpisodes = 0;

          if (show.ingestSource === "youtube_channel" && show.youtubeChannelId) {
            newEpisodes = await ingestFromYouTubeChannel(show);
          } else if (show.ingestSource === "youtube_playlist" && show.youtubePlaylistId) {
            newEpisodes = await ingestFromYouTubePlaylist(show);
          } else if (show.ingestSource === "rss" && show.rssFeedUrl) {
            newEpisodes = await ingestFromRSS(show);
          }

          // Update last ingested timestamp
          await sql`
            UPDATE shows
            SET last_ingested_at = NOW()
            WHERE id = ${show.id}
          `;

          processed.push({
            showId: show.id,
            showName: show.name,
            newEpisodes,
            success: true,
          });
        } catch (error) {
          processed.push({
            showId: show.id,
            showName: show.name,
            error: error instanceof Error ? error.message : "Unknown error",
            success: false,
          });
        }
      }

      return processed;
    });

    // Trigger processing for new episodes
    const totalNewEpisodes = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.newEpisodes || 0), 0);

    return {
      showsProcessed: shows.length,
      totalNewEpisodes,
      results,
    };
  }
);

/**
 * Ingest new episodes from a YouTube channel
 */
async function ingestFromYouTubeChannel(show: Show): Promise<number> {
  if (!show.youtubeChannelId) return 0;

  // Fetch latest videos from YouTube API
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `key=${process.env.YOUTUBE_API_KEY}` +
    `&channelId=${show.youtubeChannelId}` +
    `&part=snippet` +
    `&order=date` +
    `&type=video` +
    `&maxResults=10`
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();
  let newCount = 0;

  for (const item of data.items || []) {
    const videoId = item.id.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Check if episode already exists
    const existing = await sql`
      SELECT id FROM episodes WHERE video_id = ${videoId}
    `;

    if (existing.length === 0) {
      // Trigger episode processing workflow
      await inngest.send({
        name: "episode/submitted",
        data: {
          url,
          source: "youtube",
          showId: show.id,
        },
      });
      newCount++;
    }
  }

  return newCount;
}

/**
 * Ingest new episodes from a YouTube playlist
 */
async function ingestFromYouTubePlaylist(show: Show): Promise<number> {
  if (!show.youtubePlaylistId) return 0;

  // Fetch playlist items from YouTube API
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?` +
    `key=${process.env.YOUTUBE_API_KEY}` +
    `&playlistId=${show.youtubePlaylistId}` +
    `&part=snippet` +
    `&maxResults=10`
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data = await response.json();
  let newCount = 0;

  for (const item of data.items || []) {
    const videoId = item.snippet.resourceId.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Check if episode already exists
    const existing = await sql`
      SELECT id FROM episodes WHERE video_id = ${videoId}
    `;

    if (existing.length === 0) {
      // Trigger episode processing workflow
      await inngest.send({
        name: "episode/submitted",
        data: {
          url,
          source: "youtube",
          showId: show.id,
        },
      });
      newCount++;
    }
  }

  return newCount;
}

/**
 * Ingest new episodes from an RSS feed
 */
async function ingestFromRSS(show: Show): Promise<number> {
  if (!show.rssFeedUrl) return 0;

  // Fetch and parse RSS feed
  const response = await fetch(show.rssFeedUrl);
  
  if (!response.ok) {
    throw new Error(`RSS fetch error: ${response.statusText}`);
  }

  const xml = await response.text();
  
  // Simple RSS parsing (in production, use a proper XML parser)
  const enclosureRegex = /<enclosure[^>]+url="([^"]+)"[^>]*>/g;
  const urls: string[] = [];
  let match;
  
  while ((match = enclosureRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  let newCount = 0;

  for (const url of urls.slice(0, 10)) {
    // Generate a simple ID from URL
    const audioId = Buffer.from(url).toString('base64').slice(0, 32);

    // Check if episode already exists
    const existing = await sql`
      SELECT id FROM episodes WHERE audio_id = ${audioId}
    `;

    if (existing.length === 0) {
      // Trigger episode processing workflow
      await inngest.send({
        name: "episode/submitted",
        data: {
          url,
          source: "audio",
          showId: show.id,
        },
      });
      newCount++;
    }
  }

  return newCount;
}
