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
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import { revalidatePath } from "next/cache";
import {
  discoverFormats,
  downloadFormat,
  findDownloadedFile,
  formatDiscoveryToLog,
  getYtDlpVersion,
  YOUTUBE_CLIENT_STRATEGIES,
  type DownloadStrategy,
} from "../lib/ytdlp";
import { createEpisodeNotification } from "../../app/lib/notifications/create";

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

interface AudioIntegrityResult {
  valid: boolean;
  filePath: string;
  fileSize: number;
  hasAudioStream: boolean;
  durationSeconds: number;
  format?: string;
  error?: string;
}

async function validateAudioIntegrity(filePath: string): Promise<AudioIntegrityResult> {
  const result: AudioIntegrityResult = {
    valid: false,
    filePath,
    fileSize: 0,
    hasAudioStream: false,
    durationSeconds: 0,
  };

  try {
    if (!fs.existsSync(filePath)) {
      result.error = "File does not exist";
      return result;
    }

    const stats = fs.statSync(filePath);
    result.fileSize = stats.size;

    if (result.fileSize < 150000) {
      result.error = `File too small: ${result.fileSize} bytes (minimum 150KB required)`;
      return result;
    }

    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`,
      { timeout: 10000 }
    );

    const probeData = JSON.parse(stdout);
    const audioStream = probeData.streams?.find((s: any) => s.codec_type === "audio");

    if (!audioStream) {
      result.error = "No audio stream found in file";
      return result;
    }

    result.hasAudioStream = true;
    result.format = probeData.format?.format_name;
    result.durationSeconds = parseFloat(probeData.format?.duration || "0");

    if (isNaN(result.durationSeconds) || result.durationSeconds < 10) {
      result.error = `Audio too short or invalid: ${result.durationSeconds}s (minimum 10s required)`;
      return result;
    }

    result.valid = true;
    return result;
  } catch (error) {
    result.error = `ffprobe validation failed: ${error instanceof Error ? error.message : String(error)}`;
    return result;
  }
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
  const baseUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const outputTemplate = path.join(outputDir, `${videoId}.%(ext)s`);
  const logFile = path.join(outputDir, "download.log");
  
  ensureOutputDir(outputDir);
  
  // Use single source of truth for client strategies
  const clientStrategies = YOUTUBE_CLIENT_STRATEGIES;

  const strategies: DownloadStrategy[] = [];
  let downloadLogs: string[] = [];
  downloadLogs.push(`=== YouTube Audio Download for ${videoId} ===`);
  downloadLogs.push(`URL: ${baseUrl}`);
  downloadLogs.push(`Output directory: ${outputDir}`);
  
  // Preflight diagnostic: log yt-dlp version and path
  try {
    const ytdlpInfo = await getYtDlpVersion();
    console.log(`[yt-dlp] Version: ${ytdlpInfo.version} (path: ${ytdlpInfo.path})`);
    downloadLogs.push(`yt-dlp version: ${ytdlpInfo.version}`);
    downloadLogs.push(`yt-dlp path: ${ytdlpInfo.path}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[yt-dlp] Preflight check failed: ${errorMsg}`);
    downloadLogs.push(`ERROR: Preflight check failed: ${errorMsg}`);
    fs.writeFileSync(logFile, downloadLogs.join("\n"));
    throw new Error(`yt-dlp preflight check failed: ${errorMsg}`);
  }
  
  downloadLogs.push(``);

  for (const { name, client } of clientStrategies) {
    const strategy: DownloadStrategy = { name, client };
    strategies.push(strategy);
    
    try {
      console.log(`[yt-dlp] Attempting client: ${name}`);
      downloadLogs.push(`\n=== Strategy: ${name} ===`);
      downloadLogs.push(`Attempting client: ${client}`);
      
      // Step 1: Format discovery (with retry on transient errors)
      console.log(`[yt-dlp] Discovering formats...`);
      downloadLogs.push(`\n[Format Discovery]`);
      
      const discovery = await discoverFormats(baseUrl, client, 30000, true);
      strategy.discovery = discovery;
      
      downloadLogs.push(formatDiscoveryToLog(discovery));
      
      if (!discovery.success || !discovery.selectedFormat) {
        const error = discovery.error || "No suitable format found";
        const stderr = discovery.stderr || "";
        
        console.log(`[yt-dlp] ${name} discovery failed: ${error}`);
        downloadLogs.push(`Discovery failed: ${error}`);
        
        // Log specific known errors but ALWAYS continue to next strategy
        if (stderr.includes("Requested format is not available")) {
          downloadLogs.push(`Reason: Format not available for this client`);
        } else if (stderr.includes("The page needs to be reloaded")) {
          downloadLogs.push(`Reason: Page reload required (anti-bot)`);
        } else if (stderr.includes("403") || stderr.includes("Forbidden")) {
          downloadLogs.push(`Reason: 403 Forbidden`);
        } else if (stderr.includes("not supported in this application or device")) {
          downloadLogs.push(`Reason: Client not supported by YouTube`);
        }
        
        continue; // Always try next strategy
      }
      
      const selectedFormat = discovery.selectedFormat;
      console.log(`[yt-dlp] Selected format ${selectedFormat.format_id} (${selectedFormat.ext})`);
      
      // Step 2: Download the selected format
      console.log(`[yt-dlp] Downloading format ${selectedFormat.format_id}...`);
      downloadLogs.push(`\n[Download]`);
      downloadLogs.push(`Format ID: ${selectedFormat.format_id}`);
      downloadLogs.push(`Command: yt-dlp -f ${selectedFormat.format_id} -o "${outputTemplate}" --extractor-args "youtube:player_client=${client}" "${baseUrl}"`);
      
      const downloadResult = await downloadFormat(
        baseUrl,
        selectedFormat.format_id,
        outputTemplate,
        client,
        480000 // 8 minutes
      );
      
      strategy.download = downloadResult;
      
      if (downloadResult.stderr) {
        downloadLogs.push(`Stderr: ${downloadResult.stderr}`);
      }
      
      if (!downloadResult.success) {
        const error = downloadResult.error || "Download failed";
        console.log(`[yt-dlp] ${name} download failed: ${error}`);
        downloadLogs.push(`Download failed: ${error}`);
        downloadLogs.push(`Exit code: ${downloadResult.exitCode || "unknown"}`);
        
        // Always continue to next strategy, even on download failures
        continue;
      }
      
      // Step 3: Find the downloaded file
      const downloadedFile = findDownloadedFile(outputDir, videoId);
      
      if (!downloadedFile) {
        console.log(`[yt-dlp] ${name} - no file found after download`);
        downloadLogs.push(`ERROR: No file found in ${outputDir} matching ${videoId}.*`);
        
        // Continue to next strategy
        continue;
      }
      
      console.log(`[yt-dlp] File created: ${path.basename(downloadedFile)}`);
      downloadLogs.push(`File created: ${downloadedFile}`);
      
      // Step 4: Validate audio integrity
      console.log(`[yt-dlp] Validating audio integrity...`);
      downloadLogs.push(`\n[Integrity Validation]`);
      
      const integrity = await validateAudioIntegrity(downloadedFile);
      downloadLogs.push(`File size: ${integrity.fileSize} bytes`);
      downloadLogs.push(`Has audio stream: ${integrity.hasAudioStream}`);
      downloadLogs.push(`Duration: ${integrity.durationSeconds}s`);
      downloadLogs.push(`Format: ${integrity.format || "unknown"}`);
      
      if (!integrity.valid) {
        console.log(`[yt-dlp] ${name} - integrity validation failed: ${integrity.error}`);
        downloadLogs.push(`Integrity validation FAILED: ${integrity.error}`);
        
        // Delete invalid file
        try {
          fs.unlinkSync(downloadedFile);
          downloadLogs.push(`Deleted invalid file`);
        } catch (e) {
          // Ignore deletion errors
        }
        
        // Continue to next strategy
        continue;
      }
      
      console.log(`[yt-dlp] ✓ SUCCESS with ${name}`);
      console.log(`[yt-dlp]   File: ${path.basename(downloadedFile)}`);
      console.log(`[yt-dlp]   Size: ${integrity.fileSize} bytes`);
      console.log(`[yt-dlp]   Duration: ${integrity.durationSeconds}s`);
      console.log(`[yt-dlp]   Format: ${integrity.format}`);
      
      downloadLogs.push(`\n✓ SUCCESS`);
      downloadLogs.push(`Strategy: ${name}`);
      downloadLogs.push(`Format ID: ${selectedFormat.format_id}`);
      downloadLogs.push(`File: ${downloadedFile}`);
      
      fs.writeFileSync(logFile, downloadLogs.join("\n"));
      
      return downloadedFile;
      
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`[yt-dlp] ${name} exception: ${errMsg.substring(0, 200)}`);
      downloadLogs.push(`\nEXCEPTION: ${errMsg}`);
      
      // Continue to next strategy even on exceptions
      // Only hard errors like ENOENT (binary not found) should stop the loop
      if (errMsg.includes("ENOENT") && errMsg.includes("yt-dlp")) {
        console.error(`[yt-dlp] FATAL: yt-dlp binary not found`);
        downloadLogs.push(`FATAL: yt-dlp binary not found`);
        fs.writeFileSync(logFile, downloadLogs.join("\n"));
        throw new Error(`yt-dlp binary not found: ${errMsg}`);
      }
    }
  }

  // All strategies failed
  downloadLogs.push(`\n❌ All strategies failed`);
  downloadLogs.push(`Clients attempted (in order): ${strategies.map(s => s.client).join(", ")}`);
  downloadLogs.push(`\nFailure reasons by client:`);
  strategies.forEach(s => {
    const reason = s.discovery?.error || s.download?.error || "Unknown";
    downloadLogs.push(`  ${s.client}: ${reason}`);
  });
  
  fs.writeFileSync(logFile, downloadLogs.join("\n"));
  
  // Get yt-dlp info for error details
  let ytdlpInfo = { version: "unknown", path: "unknown" };
  try {
    ytdlpInfo = await getYtDlpVersion();
  } catch (e) {
    // Ignore if version check fails
  }
  
  const errorSummary = {
    message: "All download strategies failed",
    videoId,
    logFile,
    ytdlp: {
      version: ytdlpInfo.version,
      path: ytdlpInfo.path,
    },
    clientsAttempted: strategies.map(s => s.client),
    strategies: strategies.map(s => ({
      name: s.name,
      client: s.client,
      discoverySuccess: s.discovery?.success || false,
      totalFormats: s.discovery?.totalFormats || 0,
      audioOnlyFormats: s.discovery?.audioOnlyFormats || 0,
      m3u8AudioFormats: s.discovery?.m3u8AudioFormats || 0,
      selectedFormat: s.discovery?.selectedFormat?.format_id || null,
      downloadSuccess: s.download?.success || false,
      error: s.discovery?.error || s.download?.error || "Unknown",
    })),
  };
  
  console.error(`[yt-dlp] All strategies failed. Summary:`, JSON.stringify(errorSummary, null, 2));
  
  throw new Error(JSON.stringify(errorSummary, null, 2));
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
  },
  { event: "episode/submitted" },
  async ({ event, step }) => {
    const { url, requestId } = event.data;

    // BREADCRUMB: Impossible to miss function entry
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("🚀 PROCESS_EPISODE_START", {
      requestId,
      url,
      timestamp: new Date().toISOString(),
    });
    console.log("═══════════════════════════════════════════════════════════════");

    // Step 0: Mark request as running immediately
    if (requestId) {
      await step.run("mark-running", async () => {
        console.log(`[Step 0] Marking request ${requestId} as running`);
        await sql`
          UPDATE ingest_requests
          SET status = 'running',
              stage = NULL,
              started_at = NOW(),
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
        console.log(`[Step 0] ✓ Request marked as running`);
      });
    }

    // Step 1: Fetch Metadata
    const metadata = await step.run("fetch-metadata", async () => {
      console.log(`[Step 1] Fetching metadata for URL: ${url}`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'metadata',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
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

        console.log(`[Step 1] ✓ YouTube metadata fetched: ${episode.youtube?.title}`);
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
        console.log(`[Step 1] ✓ Audio metadata created: ${audioId}`);
        return episode;
      } else {
        throw new Error(`Unsupported URL type: ${url}`);
      }
    });

    // Step 2: Download Audio (YouTube only, with 10min timeout)
    let audioPath: string | null = null;
    if (metadata.source === "youtube") {
      audioPath = await step.run("download-audio", async () => {
        console.log(`[Step 2] Downloading audio for video ${metadata.videoId}`);
        
        // Update stage
        if (requestId) {
          await sql`
            UPDATE ingest_requests
            SET stage = 'download',
                updated_at = NOW()
            WHERE id = ${requestId}
          `;
        }
        
        const outputDir = path.join(process.cwd(), "output", metadata.id);
        ensureOutputDir(outputDir);
        
        // Watchdog timeout: 10 minutes
        const downloadPromise = downloadYouTubeAudio(metadata.videoId!, outputDir);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            const ytdlpInfo = { version: "unknown", path: "unknown" };
            reject(new Error(
              `Download timeout (10 minutes exceeded). ` +
              `Video: ${metadata.videoId}, ` +
              `Stage: download, ` +
              `Log: ${path.join(outputDir, "download.log")}`
            ));
          }, 10 * 60 * 1000); // 10 minutes
        });
        
        const downloadedPath = await Promise.race([downloadPromise, timeoutPromise]);
        console.log(`[Step 2] ✓ Audio downloaded: ${downloadedPath}`);
        return downloadedPath;
      });
    }

    // Step 3: Transcription (with 15min timeout)
    const transcript = await step.run("transcribe-audio", async () => {
      console.log(`[Step 3] Transcribing audio`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'transcribe',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
      const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
      if (!DEEPGRAM_API_KEY) {
        throw new Error("DEEPGRAM_API_KEY is required for transcription");
      }

      let segments: TranscriptSegment[];

      // Watchdog timeout: 15 minutes
      const transcribePromise = (async () => {
        if (metadata.source === "youtube" && audioPath) {
          return await transcribeLocalFile(audioPath, DEEPGRAM_API_KEY);
        } else {
          return await transcribeWithDeepgram(url, DEEPGRAM_API_KEY);
        }
      })();
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(
            `Transcription timeout (15 minutes exceeded). ` +
            `Video: ${metadata.videoId ?? metadata.audioId}, ` +
            `Stage: transcribe`
          ));
        }, 15 * 60 * 1000); // 15 minutes
      });
      
      segments = await Promise.race([transcribePromise, timeoutPromise]);

      if (segments.length === 0) {
        throw new Error("Transcription returned no segments");
      }

      console.log(`[Step 3] ✓ Transcription complete: ${segments.length} segments`);
      return segments;
    });

    // Step 4: Generate Summary (with 5min timeout)
    const summary = await step.run("generate-summary", async () => {
      console.log(`[Step 4] Generating summary`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'summarize',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is required for summary generation");
      }

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const title = metadata.youtube?.title ?? "Audio Transcript";
      const publishedAt = metadata.youtube?.publishedAt ?? metadata.createdAtISO;

      // Watchdog timeout: 5 minutes
      const summaryPromise = (async () => {
        const summaryData = await generateSummary(openai, transcript, metadata.id, title, publishedAt);
        const parsedSummary = SummarySchema.parse(summaryData);
        return parsedSummary;
      })();
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(
            `Summary generation timeout (5 minutes exceeded). ` +
            `Video: ${metadata.videoId ?? metadata.audioId}, ` +
            `Stage: summarize`
          ));
        }, 5 * 60 * 1000); // 5 minutes
      });
      
      const parsedSummary = await Promise.race([summaryPromise, timeoutPromise]);
      console.log(`[Step 4] ✓ Summary generated: ${parsedSummary.sections.length} sections`);
      return parsedSummary;
    });

    // Step 5: QC Checks
    const qc = await step.run("qc-checks", async () => {
      console.log(`[Step 5] Running QC checks`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'qc',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is required for QC");
      }

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      // Watchdog timeout: 5 minutes
      const qcPromise = (async () => {
        const qcData = await generateQC(openai, summary, transcript, metadata.id);
        const parsedQC = QCSchema.parse(qcData);
        return parsedQC;
      })();
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(
            `QC timeout (5 minutes exceeded). ` +
            `Video: ${metadata.videoId ?? metadata.audioId}, ` +
            `Stage: qc`
          ));
        }, 5 * 60 * 1000); // 5 minutes
      });
      
      const parsedQC = await Promise.race([qcPromise, timeoutPromise]);
      console.log(`[Step 5] ✓ QC complete: ${parsedQC.qc_status} (score: ${parsedQC.qc_score})`);
      return parsedQC;
    });

    // Step 6: Persist to Database
    await step.run("persist-to-db", async () => {
      console.log(`[Step 6] Persisting to database`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'persist',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
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

      console.log(`[Step 6] ✓ Data persisted to database`);
    });

    // Step 7: Cleanup
    await step.run("cleanup", async () => {
      console.log(`[Step 7] Running cleanup`);
      
      // Update stage
      if (requestId) {
        await sql`
          UPDATE ingest_requests
          SET stage = 'cleanup',
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
      }
      
      // Cleanup tasks (e.g., delete temporary files if needed)
      // For now, we keep the audio files for debugging
      
      console.log(`[Step 7] ✓ Cleanup complete`);
    });

    // Step 8: Mark as succeeded
    if (requestId) {
      await step.run("mark-succeeded", async () => {
        console.log(`[Step 8] Marking request ${requestId} as succeeded`);
        
        // Find the episode ID from the database
        const [episode] = await sql<Array<{ id: string }>>`
          SELECT id FROM episodes
          WHERE video_id = ${metadata.videoId ?? null}
             OR audio_id = ${metadata.audioId ?? null}
          LIMIT 1
        `;

        await sql`
          UPDATE ingest_requests
          SET status = 'succeeded',
              stage = 'completed',
              episode_id = ${episode?.id ?? null},
              completed_at = NOW(),
              updated_at = NOW()
          WHERE id = ${requestId}
        `;
        
        // Revalidate dashboard to show new episode immediately
        try {
          revalidatePath("/dashboard");
          console.log(`[Step 8] ✓ Dashboard revalidated`);
        } catch (err) {
          console.warn(`[Step 8] ⚠️ Failed to revalidate dashboard:`, err);
        }
        
        console.log(`[Step 8] ✓ Request marked as succeeded`);
      });
    }

    // Step 10: Create notification
    await step.run("create-notification", async () => {
      try {
        const [episode] = await sql<Array<{ id: string; youtube_title: string; youtube_channel_title: string; published_at: string | null; youtube_thumbnail_url: string | null }>>`
          SELECT id, youtube_title, youtube_channel_title, published_at::text, youtube_thumbnail_url
          FROM episodes
          WHERE video_id = ${metadata.videoId ?? null}
             OR audio_id = ${metadata.audioId ?? null}
          LIMIT 1
        `;

        if (episode) {
          await createEpisodeNotification({
            id: episode.id,
            title: episode.youtube_title || metadata.youtube?.title || "New Episode",
            show_name: episode.youtube_channel_title || metadata.youtube?.channelTitle || "Unknown",
            published_at: episode.published_at,
            thumbnail_url: episode.youtube_thumbnail_url,
          });
        }
      } catch (err) {
        console.warn(`[Step 10] ⚠️ Failed to create notification (non-fatal):`, err);
      }
    });

    console.log("═══════════════════════════════════════════════════════════════");
    console.log("✅ PROCESS_EPISODE_COMPLETE", {
      requestId,
      episodeId: metadata.id,
      qcStatus: qc.qc_status,
      timestamp: new Date().toISOString(),
    });
    console.log("═══════════════════════════════════════════════════════════════");

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
            stage = 'failed',
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
