import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { config } from "dotenv";
import { z } from "zod";
import { createClient } from "@deepgram/sdk";
import OpenAI from "openai";
import { SummarySchema, type Summary } from "../schemas/summary.schema.js";
import { QCSchema, type QC } from "../schemas/qc.schema.js";

// Load .env.local
config({ path: ".env.local" });

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const ArgsSchema = z.object({
  url: z.string().url(),
});

const YouTubeEnvSchema = z.object({
  YOUTUBE_API_KEY: z.string().min(1, "YOUTUBE_API_KEY is required"),
});

const DeepgramEnvSchema = z.object({
  DEEPGRAM_API_KEY: z.string().min(1, "DEEPGRAM_API_KEY is required"),
});

const OpenAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
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
// URL Detection Helpers
// ─────────────────────────────────────────────────────────────────────────────

const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".wav", ".ogg", ".flac", ".aac"];

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

function isAudioUrl(urlStr: string): boolean {
  const url = new URL(urlStr);
  const pathname = url.pathname.toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

function generateAudioId(urlStr: string): string {
  return crypto.createHash("sha256").update(urlStr).digest("hex").slice(0, 12);
}

// ─────────────────────────────────────────────────────────────────────────────
// YouTube Helpers
// ─────────────────────────────────────────────────────────────────────────────

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
// Deepgram Transcription
// ─────────────────────────────────────────────────────────────────────────────

interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  speaker: null;
  text: string;
}

async function transcribeWithDeepgram(audioUrl: string, apiKey: string): Promise<TranscriptSegment[]> {
  const deepgram = createClient(apiKey);

  const response = await deepgram.listen.prerecorded.transcribeUrl(
    { url: audioUrl },
    {
      model: "nova-2",
      smart_format: true,
      punctuate: true,
    }
  );

  // Check for errors
  if (response.error) {
    throw new Error(response.error.message ?? "Deepgram API error");
  }
  const result = response.result;

  const segments: TranscriptSegment[] = [];
  const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];

  for (const word of words) {
    const start_ms = Math.round((word.start ?? 0) * 1000);
    const end_ms = Math.round((word.end ?? 0) * 1000);
    
    // Group words into segments (simple approach: one word = one segment for now)
    // This preserves timestamps; downstream can merge if needed
    segments.push({
      start_ms,
      end_ms,
      speaker: null,
      text: word.punctuated_word ?? word.word ?? "",
    });
  }

  return segments;
}

// ─────────────────────────────────────────────────────────────────────────────
// LLM Summary + QC
// ─────────────────────────────────────────────────────────────────────────────

function loadPrompt(name: string): string {
  const promptPath = path.join(process.cwd(), "prompts", `${name}.txt`);
  return fs.readFileSync(promptPath, "utf-8");
}

function formatTranscriptForLLM(segments: TranscriptSegment[]): string {
  return segments.map((s) => `[${s.start_ms}-${s.end_ms}] ${s.text}`).join("\n");
}

async function generateSummary(
  openai: OpenAI,
  transcript: TranscriptSegment[],
  videoId: string,
  title: string,
  publishedAt: string
): Promise<Summary> {
  const promptTemplate = loadPrompt("summary_v1");
  const transcriptText = formatTranscriptForLLM(transcript);

  const prompt = promptTemplate
    .replace("{{VIDEO_ID}}", videoId)
    .replace("{{TITLE}}", title)
    .replace("{{PUBLISHED_AT}}", publishedAt)
    .replace("{{TRANSCRIPT}}", transcriptText);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return SummarySchema.parse(parsed);
}

async function generateQC(
  openai: OpenAI,
  summary: Summary,
  transcript: TranscriptSegment[],
  videoId: string
): Promise<QC> {
  const promptTemplate = loadPrompt("qc_v1");
  const transcriptText = formatTranscriptForLLM(transcript);

  const prompt = promptTemplate
    .replace("{{VIDEO_ID}}", videoId)
    .replace("{{SUMMARY}}", JSON.stringify(summary, null, 2))
    .replace("{{TRANSCRIPT}}", transcriptText);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return QCSchema.parse(parsed);
}

// ─────────────────────────────────────────────────────────────────────────────
// Flow A: YouTube URL
// ─────────────────────────────────────────────────────────────────────────────

async function handleYouTubeUrl(url: string, videoId: string) {
  console.log("🤖 Robot v0 accepted YouTube URL.");
  console.log("videoId:", videoId);

  // Validate environment
  const envResult = YouTubeEnvSchema.safeParse(process.env);
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

  // YouTube captions: scraping libraries are unreliable due to YouTube API changes
  // For now, write transcript_status.json explaining captions are not available
  // Use audio URL path (Deepgram) or local transcript for reliable transcription
  const transcriptStatus = {
    source: "youtube_captions",
    status: "unavailable",
    code: "CAPTIONS_SCRAPING_UNRELIABLE",
    message: "YouTube caption scraping libraries are unreliable. Use audio URL with Deepgram for transcription.",
  };
  fs.writeFileSync(path.join(outputDir, "transcript_status.json"), JSON.stringify(transcriptStatus, null, 2));
  console.log(`⚠️  Transcript: YouTube captions not available (use audio URL for transcription)`);

  console.log(`✅ Title: ${video.snippet.title}`);
  console.log(`✅ Channel: ${video.snippet.channelTitle}`);
  console.log(`✅ Output written to: output/${videoId}/`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Flow B: Audio URL
// ─────────────────────────────────────────────────────────────────────────────

async function handleAudioUrl(url: string) {
  const audioId = generateAudioId(url);
  console.log("🤖 Robot v0 accepted audio URL.");
  console.log("audioId:", audioId);

  // Validate environment
  const envResult = DeepgramEnvSchema.safeParse(process.env);
  if (!envResult.success) {
    const outputDir = path.join(process.cwd(), "output", audioId);
    fs.mkdirSync(outputDir, { recursive: true });
    const errorPayload = {
      stage: "transcript",
      code: "MISSING_API_KEY",
      message: "DEEPGRAM_API_KEY is required for audio transcription.",
      audioId,
      url,
    };
    fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
    console.error("❌ Missing required environment variable: DEEPGRAM_API_KEY");
    console.error("Set it in .env.local or export it in your shell.");
    process.exit(1);
  }
  const { DEEPGRAM_API_KEY } = envResult.data;

  // Create output directory
  const outputDir = path.join(process.cwd(), "output", audioId);
  fs.mkdirSync(outputDir, { recursive: true });

  // Build episode.json for audio
  const episode = {
    source: "audio",
    url,
    audioId,
    createdAtISO: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outputDir, "episode.json"), JSON.stringify(episode, null, 2));

  // Transcribe with Deepgram
  console.log("📥 Transcribing audio with Deepgram...");
  try {
    const segments = await transcribeWithDeepgram(url, DEEPGRAM_API_KEY);

    if (segments.length === 0) {
      const errorPayload = {
        stage: "transcript",
        code: "TRANSCRIPTION_EMPTY",
        message: "Deepgram returned no transcript segments.",
        audioId,
        url,
      };
      fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
      console.error("❌ TRANSCRIPTION_EMPTY: No transcript segments returned.");
      process.exit(1);
    }

    // Write transcript.jsonl
    const transcriptLines = segments.map((seg) => JSON.stringify(seg)).join("\n");
    fs.writeFileSync(path.join(outputDir, "transcript.jsonl"), transcriptLines + "\n");

    console.log(`✅ Transcript: ${segments.length} segments`);

    // Summary + QC stage
    const openaiEnvResult = OpenAIEnvSchema.safeParse(process.env);
    if (!openaiEnvResult.success) {
      console.log(`⚠️  Skipping summary/QC: OPENAI_API_KEY not set`);
      console.log(`✅ Output written to: output/${audioId}/`);
      return;
    }

    const openai = new OpenAI({ apiKey: openaiEnvResult.data.OPENAI_API_KEY });

    console.log("📝 Generating summary...");
    try {
      const summary = await generateSummary(
        openai,
        segments,
        audioId,
        "Audio Transcript",
        new Date().toISOString()
      );
      fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2));
      console.log(`✅ Summary: ${summary.sections.length} sections`);

      console.log("🔍 Running QC...");
      const qc = await generateQC(openai, summary, segments, audioId);
      fs.writeFileSync(path.join(outputDir, "qc.json"), JSON.stringify(qc, null, 2));
      console.log(`✅ QC Score: ${qc.qc_score}/100 (${qc.flags.length} flags)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const errorPayload = {
        stage: "summary_qc",
        code: "LLM_FAILED",
        message,
        audioId,
        url,
      };
      fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
      console.error(`❌ Summary/QC failed: ${message}`);
      process.exit(1);
    }

    console.log(`✅ Output written to: output/${audioId}/`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const errorPayload = {
      stage: "transcript",
      code: "DEEPGRAM_FAILED",
      message,
      audioId,
      url,
    };
    fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
    console.error(`❌ DEEPGRAM_FAILED: ${message}`);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Flow C: Local Transcript File (for testing)
// ─────────────────────────────────────────────────────────────────────────────

async function handleLocalTranscript(filePath: string) {
  const fileId = path.basename(filePath, path.extname(filePath));
  console.log("🤖 Robot v0 processing local transcript.");
  console.log("fileId:", fileId);

  // Validate OpenAI key
  const openaiEnvResult = OpenAIEnvSchema.safeParse(process.env);
  if (!openaiEnvResult.success) {
    console.error("❌ Missing required environment variable: OPENAI_API_KEY");
    console.error("Set it in .env.local or export it in your shell.");
    process.exit(1);
  }

  // Create output directory
  const outputDir = path.join(process.cwd(), "output", fileId);
  fs.mkdirSync(outputDir, { recursive: true });

  // Read transcript
  const transcriptContent = fs.readFileSync(filePath, "utf-8");
  const segments: TranscriptSegment[] = transcriptContent
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as TranscriptSegment);

  console.log(`✅ Loaded transcript: ${segments.length} segments`);

  // Copy transcript to output
  fs.copyFileSync(filePath, path.join(outputDir, "transcript.jsonl"));

  // Build episode.json
  const episode = {
    source: "local",
    filePath,
    fileId,
    createdAtISO: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outputDir, "episode.json"), JSON.stringify(episode, null, 2));

  // Summary + QC
  const openai = new OpenAI({ apiKey: openaiEnvResult.data.OPENAI_API_KEY });

  console.log("📝 Generating summary...");
  try {
    const summary = await generateSummary(
      openai,
      segments,
      fileId,
      "Local Transcript",
      new Date().toISOString()
    );
    fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2));
    console.log(`✅ Summary: ${summary.sections.length} sections`);

    console.log("🔍 Running QC...");
    const qc = await generateQC(openai, summary, segments, fileId);
    fs.writeFileSync(path.join(outputDir, "qc.json"), JSON.stringify(qc, null, 2));
    console.log(`✅ QC Score: ${qc.qc_score}/100 (${qc.flags.length} flags)`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const errorPayload = {
      stage: "summary_qc",
      code: "LLM_FAILED",
      message,
      fileId,
      filePath,
    };
    fs.writeFileSync(path.join(outputDir, "error.json"), JSON.stringify(errorPayload, null, 2));
    console.error(`❌ Summary/QC failed: ${message}`);
    process.exit(1);
  }

  console.log(`✅ Output written to: output/${fileId}/`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const arg = process.argv[2];

  // Check for --local flag
  if (arg === "--local") {
    const filePath = process.argv[3];
    if (!filePath || !fs.existsSync(filePath)) {
      console.error("❌ Usage: npm run robot -- --local <transcript.jsonl>");
      console.error("Example: npm run robot -- --local scripts/sample_transcript.jsonl");
      process.exit(1);
    }
    await handleLocalTranscript(filePath);
    return;
  }

  const parsed = ArgsSchema.safeParse({ url: arg });

  if (!parsed.success) {
    console.error("❌ Usage: npm run robot -- \"<URL>\"");
    console.error("Examples:");
    console.error("  npm run robot -- \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"");
    console.error("  npm run robot -- \"https://example.com/audio.mp3\"");
    console.error("  npm run robot -- --local scripts/sample_transcript.jsonl");
    process.exit(1);
  }

  const url = parsed.data.url;

  // Detect URL type
  const videoId = extractYouTubeVideoId(url);

  if (videoId) {
    await handleYouTubeUrl(url, videoId);
  } else if (isAudioUrl(url)) {
    await handleAudioUrl(url);
  } else {
    console.error("❌ Unsupported URL type.");
    console.error("Supported: YouTube URLs or direct audio URLs (.mp3, .m4a, .wav)");
    console.error("Got:", url);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
