import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { createClient } from "@deepgram/sdk";
import OpenAI from "openai";
import postgres from "postgres";
import { inngest } from "../client";
import { SummarySchema, type Summary } from "../../schemas/summary.schema";
import { QCSchema, type QC } from "../../schemas/qc.schema";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Types & Schemas
// ─────────────────────────────────────────────────────────────────────────────

interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  speaker: null;
  text: string;
}

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

interface EpisodeMetadata {
  source: "youtube" | "audio";
  url: string;
  id: string;
  videoId?: string;
  audioId?: string;
  createdAtISO: string;
  youtube?: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    description: string;
    thumbnails: {
      default: string | null;
      medium: string | null;
      high: string | null;
    };
    durationISO: string;
    viewCount: string | null;
    likeCount: string | null;
    commentCount: string | null;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".wav", ".ogg", ".flac", ".aac"];

function extractYouTubeVideoId(urlStr: string): string | null {
  const url = new URL(urlStr);

  if (url.hostname === "youtu.be") {
    const id = url.pathname.replace("/", "").trim();
    return id || null;
  }

  if (
    url.hostname.endsWith("youtube.com") ||
    url.hostname.endsWith("youtube-nocookie.com")
  ) {
    const v = url.searchParams.get("v");
    if (v) return v;

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

function ensureOutputDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
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

async function downloadYouTubeAudio(videoId: string, outputDir: string): Promise<string> {
  const audioPath = path.join(outputDir, `${videoId}.mp3`);
  
  // Use yt-dlp to download audio
  const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`;
  
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log("yt-dlp output:", stdout);
    if (stderr) console.error("yt-dlp stderr:", stderr);
    
    if (!fs.existsSync(audioPath)) {
      throw new Error("Audio file was not created");
    }
    
    return audioPath;
  } catch (error) {
    console.error("yt-dlp error:", error);
    throw new Error(`Failed to download audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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

  if (response.error) {
    throw new Error(response.error.message ?? "Deepgram API error");
  }
  const result = response.result;

  const segments: TranscriptSegment[] = [];
  const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];

  for (const word of words) {
    const start_ms = Math.round((word.start ?? 0) * 1000);
    const end_ms = Math.round((word.end ?? 0) * 1000);
    
    segments.push({
      start_ms,
      end_ms,
      speaker: null,
      text: word.punctuated_word ?? word.word ?? "",
    });
  }

  return segments;
}

async function transcribeLocalFile(audioPath: string, apiKey: string): Promise<TranscriptSegment[]> {
  const deepgram = createClient(apiKey);
  
  // Read the audio file
  const audioBuffer = fs.readFileSync(audioPath);
  
  const response = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: "nova-2",
      smart_format: true,
      punctuate: true,
    }
  );

  if (response.error) {
    throw new Error(response.error.message ?? "Deepgram API error");
  }
  const result = response.result;

  const segments: TranscriptSegment[] = [];
  const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];

  for (const word of words) {
    const start_ms = Math.round((word.start ?? 0) * 1000);
    const end_ms = Math.round((word.end ?? 0) * 1000);
    
    segments.push({
      start_ms,
      end_ms,
      speaker: null,
      text: word.punctuated_word ?? word.word ?? "",
    });
  }

  return segments;
}

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
  id: string,
  title: string,
  publishedAt: string
): Promise<Summary> {
  const promptTemplate = loadPrompt("summary_v1");
  const transcriptText = formatTranscriptForLLM(transcript);

  const prompt = promptTemplate
    .replace("{{VIDEO_ID}}", id)
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
  id: string
): Promise<QC> {
  const promptTemplate = loadPrompt("qc_v1");
  const transcriptText = formatTranscriptForLLM(transcript);

  const prompt = promptTemplate
    .replace("{{VIDEO_ID}}", id)
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
// Inngest Function: processEpisode
// ─────────────────────────────────────────────────────────────────────────────

export const processEpisode = inngest.createFunction(
  {
    id: "process-episode",
    name: "Process Episode",
    retries: 3,
  },
  { event: "episode/submitted" },
  async ({ event, step }) => {
    const { url, requestId } = event.data;

    // Update status to running
    if (requestId) {
      await step.run("update-status-running", async () => {
        await sql`
          UPDATE ingest_requests
          SET status = 'running',
              started_at = NOW(),
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      });
    }

    // Step 1: Ingest Metadata
    const metadata = await step.run("ingest-metadata", async () => {
      const videoId = extractYouTubeVideoId(url);
      
      if (videoId) {
        // YouTube URL
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        if (!YOUTUBE_API_KEY) {
          throw new Error("YOUTUBE_API_KEY is required for YouTube URLs");
        }

        const apiResponse = await fetchYouTubeMetadata(videoId, YOUTUBE_API_KEY);

        if (apiResponse.error) {
          throw new Error(`YouTube API error: ${apiResponse.error.message}`);
        }

        const video = apiResponse.items?.[0];
        if (!video) {
          throw new Error("Video not found or unavailable");
        }

        const episode: EpisodeMetadata = {
          source: "youtube",
          url,
          id: videoId,
          videoId: videoId,
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

        return episode;
      } else if (isAudioUrl(url)) {
        // Audio URL
        const audioId = generateAudioId(url);
        const episode: EpisodeMetadata = {
          source: "audio",
          url,
          id: audioId,
          audioId: audioId,
          createdAtISO: new Date().toISOString(),
        };
        return episode;
      } else {
        throw new Error(`Unsupported URL type: ${url}`);
      }
    });

    // Step 2: Transcription
    const transcript = await step.run("transcribe", async () => {
      const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
      if (!DEEPGRAM_API_KEY) {
        throw new Error("DEEPGRAM_API_KEY is required for transcription");
      }

      let segments: TranscriptSegment[];

      if (metadata.source === "youtube") {
        // Download audio from YouTube first
        const outputDir = path.join(process.cwd(), "output", metadata.id);
        ensureOutputDir(outputDir);
        
        console.log(`Downloading audio for video ${metadata.videoId}...`);
        const audioPath = await downloadYouTubeAudio(metadata.videoId, outputDir);
        console.log(`Audio downloaded to: ${audioPath}`);
        
        // Transcribe from local file
        console.log("Transcribing audio with Deepgram...");
        segments = await transcribeLocalFile(audioPath, DEEPGRAM_API_KEY);
      } else {
        // Direct URL transcription for non-YouTube sources
        segments = await transcribeWithDeepgram(url, DEEPGRAM_API_KEY);
      }

      if (segments.length === 0) {
        throw new Error("Transcription returned no segments");
      }

      console.log(`Transcription complete: ${segments.length} segments`);
      return segments;
    });

    // Step 3: Generate Summary
    const summary = await step.run("generate-summary", async () => {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is required for summary generation");
      }

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const title = metadata.youtube?.title ?? "Audio Transcript";
      const publishedAt = metadata.youtube?.publishedAt ?? metadata.createdAtISO;

      return await generateSummary(openai, transcript, metadata.id, title, publishedAt);
    });

    // Step 4: QC Verification
    const qc = await step.run("qc-verification", async () => {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is required for QC");
      }

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      return await generateQC(openai, summary, transcript, metadata.id);
    });

    // Step 5: Write to Database
    await step.run("write-to-database", async () => {
      const outputDir = path.join(process.cwd(), "output", metadata.id);
      ensureOutputDir(outputDir);

      // Write all artifacts to output directory
      fs.writeFileSync(
        path.join(outputDir, "episode.json"),
        JSON.stringify(metadata, null, 2)
      );

      const transcriptLines = transcript.map((seg) => JSON.stringify(seg)).join("\n");
      fs.writeFileSync(
        path.join(outputDir, "transcript.jsonl"),
        transcriptLines + "\n"
      );

      fs.writeFileSync(
        path.join(outputDir, "summary.json"),
        JSON.stringify(summary, null, 2)
      );

      fs.writeFileSync(
        path.join(outputDir, "qc.json"),
        JSON.stringify(qc, null, 2)
      );

      // Insert into database using existing script
      try {
        const { stdout, stderr } = await execAsync(`npm run db:insert ${outputDir}`);
        console.log("Database insert output:", stdout);
        if (stderr) console.error("Database insert stderr:", stderr);
      } catch (err) {
        console.error("Database insert failed:", err);
        throw new Error(`Failed to insert into database: ${err}`);
      }

      return {
        outputDir,
        episodeId: metadata.id,
        segmentCount: transcript.length,
        sectionCount: summary.sections.length,
        qcScore: qc.qc_score,
        qcStatus: qc.qc_status,
      };
    });

    // Update status to succeeded
    if (requestId) {
      await step.run("update-status-succeeded", async () => {
        // Find the episode ID from the database
        const [episode] = await sql<Array<{ id: string }>>`
          SELECT id FROM episodes
          WHERE video_id = ${metadata.videoId}
             OR audio_id = ${metadata.audioId}
          LIMIT 1
        `;

        await sql`
          UPDATE ingest_requests
          SET status = 'succeeded',
              episode_id = ${episode?.id},
              completed_at = NOW(),
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      });
    }

    return {
      success: true,
      episodeId: metadata.id,
      source: metadata.source,
      title: metadata.youtube?.title ?? "Audio Episode",
      qcScore: qc.qc_score,
      qcStatus: qc.qc_status,
    };
  }
);

// Error handler to update failed status
export const processEpisodeOnFailure = inngest.createFunction(
  {
    id: "process-episode-on-failure",
    name: "Process Episode - On Failure",
  },
  { event: "inngest/function.failed" },
  async ({ event }) => {
    // Only handle failures for process-episode function
    if (event.data.function_id !== "process-episode") {
      return;
    }

    const originalEvent = event.data.event;
    const requestId = originalEvent?.data?.requestId;
    const error = event.data.error;

    if (requestId) {
      await sql`
        UPDATE ingest_requests
        SET status = 'failed',
            error_message = ${error?.message ?? "Unknown error"},
            error_details = ${JSON.stringify(error ?? {})},
            completed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${requestId}
      `;

      // Also write error.json to output directory if we have metadata
      const url = originalEvent?.data?.url;
      if (url) {
        try {
          const videoId = extractYouTubeVideoId(url);
          const audioId = videoId ? null : generateAudioId(url);
          const id = videoId ?? audioId;
          
          if (id) {
            const outputDir = path.join(process.cwd(), "output", id);
            ensureOutputDir(outputDir);
            
            fs.writeFileSync(
              path.join(outputDir, "error.json"),
              JSON.stringify({
                error: error?.message ?? "Unknown error",
                details: error,
                timestamp: new Date().toISOString(),
              }, null, 2)
            );
          }
        } catch (err) {
          console.error("Failed to write error.json:", err);
        }
      }
    }
  }
);
