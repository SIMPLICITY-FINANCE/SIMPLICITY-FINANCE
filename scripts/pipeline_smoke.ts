import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import { z } from "zod";

// Load .env.local
config({ path: ".env.local" });

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const ArgsSchema = z.object({
  url: z.string().url(),
});

const EnvSchema = z.object({
  YOUTUBE_API_KEY: z.string().min(1, "YOUTUBE_API_KEY is required"),
});

// ─────────────────────────────────────────────────────────────────────────────
// YouTube Data API Types
// ─────────────────────────────────────────────────────────────────────────────

interface YouTubeVideoResource {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface YouTubeAPIResponse {
  items?: YouTubeVideoResource[];
  error?: {
    code: number;
    message: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function extractYouTubeVideoId(urlStr: string): string | null {
  const url = new URL(urlStr);

  // youtu.be/<id>
  if (url.hostname === "youtu.be") {
    const id = url.pathname.replace("/", "").trim();
    return id || null;
  }

  // youtube.com/watch?v=<id>
  if (
    url.hostname.endsWith("youtube.com") ||
    url.hostname.endsWith("youtube-nocookie.com")
  ) {
    const v = url.searchParams.get("v");
    if (v) return v;

    // youtube.com/embed/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    const embedId = parts[embedIndex + 1];
    if (embedIndex >= 0 && embedId) return embedId;
  }

  return null;
}

async function fetchYouTubeMetadata(videoId: string, apiKey: string): Promise<YouTubeAPIResponse> {
  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id: videoId,
    key: apiKey,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
  return response.json() as Promise<YouTubeAPIResponse>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const urlArg = process.argv[2];
  const parsed = ArgsSchema.safeParse({ url: urlArg });

  if (!parsed.success) {
    console.error("❌ Usage: npm run robot -- \"<URL>\"");
    console.error("Example: npm run robot -- \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"");
    process.exit(1);
  }

  const url = parsed.data.url;
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    console.error("❌ This Robot v0 currently supports YouTube URLs only.");
    console.error("Got:", url);
    process.exit(1);
  }

  console.log("🤖 Robot v0 accepted YouTube URL.");
  console.log("videoId:", videoId);

  // Validate environment
  const envResult = EnvSchema.safeParse(process.env);
  if (!envResult.success) {
    console.error("❌ Missing required environment variable: YOUTUBE_API_KEY");
    console.error("Set it in .env.local or export it in your shell.");
    process.exit(1);
  }
  const { YOUTUBE_API_KEY } = envResult.data;

  // Create output directory
  const outputDir = path.join(process.cwd(), "output", videoId);
  fs.mkdirSync(outputDir, { recursive: true });

  // Fetch YouTube metadata via Data API v3
  console.log("📥 Fetching YouTube metadata...");
  const apiResponse = await fetchYouTubeMetadata(videoId, YOUTUBE_API_KEY);

  if (apiResponse.error) {
    const errorPayload = {
      stage: "ingestion",
      code: "API_FAILED",
      status: apiResponse.error.code,
      message: apiResponse.error.message,
      videoId,
      url,
    };
    fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
    console.error(`❌ API_FAILED: ${apiResponse.error.message}`);
    process.exit(1);
  }

  const video = apiResponse.items?.[0];
  if (!video) {
    const errorPayload = {
      stage: "ingestion",
      code: "API_FAILED",
      status: 404,
      message: "Video not found or unavailable.",
      videoId,
      url,
    };
    fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
    console.error("❌ API_FAILED: Video not found or unavailable.");
    process.exit(1);
  }

  // Build episode.json with YouTube metadata
  const episode = {
    source: "youtube",
    url,
    videoId,
    createdAtISO: new Date().toISOString(),
    youtube: {
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      publishedAt: video.snippet.publishedAt,
      description: video.snippet.description,
      thumbnails: {
        default: video.snippet.thumbnails.default?.url ?? null,
        medium: video.snippet.thumbnails.medium?.url ?? null,
        high: video.snippet.thumbnails.high?.url ?? null,
      },
      durationISO: video.contentDetails.duration,
      viewCount: video.statistics.viewCount ?? null,
      likeCount: video.statistics.likeCount ?? null,
      commentCount: video.statistics.commentCount ?? null,
    },
  };

  fs.writeFileSync(path.join(outputDir, "episode.json"), JSON.stringify(episode, null, 2));

  // Write placeholder transcript.jsonl (transcript acquisition is a separate stage)
  const placeholderLine = JSON.stringify({ start_ms: 0, end_ms: 0, speaker: null, text: "PLACEHOLDER" });
  fs.writeFileSync(path.join(outputDir, "transcript.jsonl"), placeholderLine + "\n");

  console.log(`✅ Title: ${video.snippet.title}`);
  console.log(`✅ Channel: ${video.snippet.channelTitle}`);
  console.log(`✅ Output written to: output/${videoId}/`);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
