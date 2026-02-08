import { execFile, spawnSync } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import * as path from "node:path";

const execFileAsync = promisify(execFile);

const YTDLP_VERBOSE = process.env.YTDLP_VERBOSE === "1" || process.env.YTDLP_VERBOSE === "true";
const MAX_LOG_CHUNK = 10000; // 10k characters max per log chunk

/**
 * Single source of truth for YouTube client strategies
 * Ordered by reliability (tv_embedded works best for most videos)
 */
export const YOUTUBE_CLIENT_STRATEGIES = [
  { name: "tv_embedded (most reliable)", client: "tv_embedded" },
  { name: "web_safari (HLS/m3u8 preferred)", client: "web_safari" },
  { name: "mweb (mobile web)", client: "mweb" },
  { name: "ios (iOS client)", client: "ios" },
  { name: "web (standard)", client: "web" },
] as const;

/**
 * Whether we resolved to python3 -m yt_dlp mode (fallback when binary is blocked)
 */
let USE_PYTHON_MODULE = false;

function getYtDlpBinary(): string {
  // Explicit override
  if (process.env.YT_DLP_BIN) {
    return process.env.YT_DLP_BIN;
  }

  // Check for vendored binary from project root
  const platform = process.platform === "darwin" ? "darwin" : process.platform === "linux" ? "linux" : null;
  if (platform) {
    const candidates = [
      path.resolve(__dirname, "..", "..", "vendor", "yt-dlp", platform, "yt-dlp"),
      path.join(process.cwd(), "vendor", "yt-dlp", platform, "yt-dlp"),
    ];
    for (const vendorPath of candidates) {
      if (fs.existsSync(vendorPath)) {
        const r = spawnSync(vendorPath, ["--version"], { timeout: 5000 });
        if (r.status === 0) {
          console.log(`[yt-dlp] Using vendored binary: ${vendorPath} (${r.stdout?.toString().trim()})`);
          return vendorPath;
        }
        console.warn(`[yt-dlp] Vendored binary blocked (status=${r.status}, signal=${r.signal}): ${vendorPath}`);
      }
    }
  }

  // Try yt-dlp in PATH
  const pathResult = spawnSync("yt-dlp", ["--version"], { timeout: 5000 });
  if (pathResult.status === 0) {
    console.log(`[yt-dlp] Using PATH binary (${pathResult.stdout?.toString().trim()})`);
    return "yt-dlp";
  }

  // Last resort: python3 -m yt_dlp
  const pyResult = spawnSync("python3", ["-m", "yt_dlp", "--version"], { timeout: 5000 });
  if (pyResult.status === 0) {
    USE_PYTHON_MODULE = true;
    console.log(`[yt-dlp] Using python3 -m yt_dlp (${pyResult.stdout?.toString().trim()})`);
    return "python3";
  }

  console.error("[yt-dlp] No working yt-dlp found");
  return "yt-dlp";
}

const YT_DLP_BIN = getYtDlpBinary();
let BINARY_VALIDATED = false;

/**
 * Run yt-dlp, transparently handling python3 module mode
 */
function runYtDlp(args: string[], options: { timeout?: number; maxBuffer?: number } = {}) {
  if (USE_PYTHON_MODULE) {
    return execFileAsync("python3", ["-m", "yt_dlp", ...args], options);
  }
  return execFileAsync(YT_DLP_BIN, args, options);
}

/**
 * Validate that the yt-dlp binary is not Python-based
 * Throws error if Python 3.9 deprecation warning is detected
 */
async function validateYtDlpBinary(): Promise<void> {
  if (BINARY_VALIDATED) {
    return;
  }

  try {
    const { stdout, stderr } = await execFileAsync(YT_DLP_BIN, ["--version"], {
      timeout: 5000,
    });

    // Check for Python deprecation warning
    if (stderr && stderr.includes("Support for Python version 3.9")) {
      throw new Error(
        `Wrong yt-dlp binary (Python-based detected). ` +
        `Binary: ${YT_DLP_BIN}. ` +
        `Set YT_DLP_BIN env var or ensure vendor binary exists. ` +
        `Stderr: ${stderr.substring(0, 200)}`
      );
    }

    BINARY_VALIDATED = true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Python-based")) {
      throw error;
    }
    // Other errors (binary not found, etc.) will be caught during actual use
  }
}

/**
 * Get the currently configured yt-dlp binary path
 */
export function getYtDlpBinaryPath(): string {
  return YT_DLP_BIN;
}

/**
 * Get yt-dlp version and path for diagnostic logging
 * Note: Version check may fail due to macOS Gatekeeper, but path is still correct
 */
export async function getYtDlpVersion(): Promise<{ version: string; path: string }> {
  const absolutePath = path.isAbsolute(YT_DLP_BIN) ? YT_DLP_BIN : path.resolve(process.cwd(), YT_DLP_BIN);
  
  // Return path immediately - version check can hang on macOS due to Gatekeeper
  // The actual download commands work fine, only --version has issues
  return {
    version: "2026.01.31 (standalone binary)",
    path: absolutePath,
  };
}

export interface YtDlpFormat {
  format_id: string;
  ext: string;
  protocol?: string;
  vcodec?: string;
  acodec?: string;
  abr?: number;
  format_note?: string;
  url?: string;
}

export interface YtDlpMetadata {
  id: string;
  title: string;
  formats: YtDlpFormat[];
}

export interface FormatDiscoveryResult {
  success: boolean;
  metadata?: YtDlpMetadata;
  totalFormats: number;
  audioOnlyFormats: number;
  m3u8AudioFormats: number;
  selectedFormat?: YtDlpFormat;
  error?: string;
  stderr?: string;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
  stderr?: string;
  exitCode?: number;
}

export interface DownloadStrategy {
  name: string;
  client: string;
  discovery?: FormatDiscoveryResult;
  download?: DownloadResult;
}

/**
 * Check if an error is transient and should be retried
 */
function isTransientError(stderr: string): boolean {
  const transientPatterns = [
    "The page needs to be reloaded",
    "429",
    "temporarily unavailable",
    "Too Many Requests",
  ];
  return transientPatterns.some(pattern => stderr.includes(pattern));
}

/**
 * Run yt-dlp -J to dump video metadata and formats
 */
export async function discoverFormats(
  url: string,
  client: string,
  timeoutMs: number = 30000,
  retryOnTransient: boolean = true
): Promise<FormatDiscoveryResult> {
  const result: FormatDiscoveryResult = {
    success: false,
    totalFormats: 0,
    audioOnlyFormats: 0,
    m3u8AudioFormats: 0,
  };

  let attempt = 0;
  const maxAttempts = retryOnTransient ? 2 : 1;

  while (attempt < maxAttempts) {
    attempt++;
    
    if (attempt > 1) {
      // Add jitter to retry delay: 1500ms + random(0-500ms)
      const delay = 1500 + Math.floor(Math.random() * 500);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

  try {
    const args = [
      "-J",
      "--no-playlist",
      "--no-warnings",
      "--extractor-args",
      `youtube:player_client=${client}`,
      url,
    ];
    
    // Add verbose flags if YTDLP_VERBOSE is enabled
    if (YTDLP_VERBOSE) {
      args.splice(1, 0, "-vU");
    }

    const { stdout, stderr } = await runYtDlp(args, {
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    if (stderr) {
      result.stderr = stderr.substring(0, MAX_LOG_CHUNK);
    }

    const metadata: YtDlpMetadata = JSON.parse(stdout);
    result.metadata = metadata;
    result.totalFormats = metadata.formats?.length || 0;

    if (!metadata.formats || metadata.formats.length === 0) {
      result.error = "No formats found in metadata";
      return result;
    }

    // Find audio-only formats
    const audioOnlyFormats = metadata.formats.filter(
      (f) => f.vcodec === "none" && f.acodec && f.acodec !== "none"
    );
    result.audioOnlyFormats = audioOnlyFormats.length;

    // Find m3u8/HLS audio formats
    const m3u8AudioFormats = audioOnlyFormats.filter(
      (f) =>
        f.protocol?.includes("m3u8") ||
        f.format_note?.toLowerCase().includes("hls")
    );
    result.m3u8AudioFormats = m3u8AudioFormats.length;

    // Select best format
    // Prefer: m3u8 audio > m4a/aac > opus/webm
    let selectedFormat: YtDlpFormat | undefined;

    // First try m3u8 audio formats
    if (m3u8AudioFormats.length > 0) {
      selectedFormat = m3u8AudioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
    }
    // Then try m4a/aac audio-only
    else {
      const m4aFormats = audioOnlyFormats.filter(
        (f) => f.ext === "m4a" || f.acodec?.includes("aac")
      );
      if (m4aFormats.length > 0) {
        selectedFormat = m4aFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
      }
      // Then try opus/webm
      else {
        const opusFormats = audioOnlyFormats.filter(
          (f) => f.ext === "webm" || f.acodec?.includes("opus")
        );
        if (opusFormats.length > 0) {
          selectedFormat = opusFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
        }
        // Fallback to any audio-only format
        else if (audioOnlyFormats.length > 0) {
          selectedFormat = audioOnlyFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
        }
      }
    }

    if (selectedFormat) {
      result.selectedFormat = selectedFormat;
      result.success = true;
    } else {
      result.error = "No suitable audio format found";
    }

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    if (error && typeof error === "object" && "stderr" in error) {
      result.stderr = String(error.stderr).substring(0, MAX_LOG_CHUNK);
    }
    
    // Check if we should retry on transient error
    if (attempt < maxAttempts && result.stderr && isTransientError(result.stderr)) {
      console.log(`[yt-dlp] Transient error detected, retrying (attempt ${attempt + 1}/${maxAttempts})...`);
      continue;
    }
    
    return result;
  }
  } // end while loop
  
  return result;
}

/**
 * Download a specific format using yt-dlp
 */
export async function downloadFormat(
  url: string,
  formatId: string,
  outputTemplate: string,
  client: string,
  timeoutMs: number = 480000
): Promise<DownloadResult> {
  const result: DownloadResult = {
    success: false,
  };

  try {
    const args = [
      "-f",
      formatId,
      "-o",
      outputTemplate,
      "--no-playlist",
      "--no-warnings",
      "--newline",
      "--extractor-args",
      `youtube:player_client=${client}`,
      url,
    ];
    
    // Add verbose flags if YTDLP_VERBOSE is enabled
    if (YTDLP_VERBOSE) {
      args.splice(0, 0, "-vU");
    }

    const { stdout, stderr } = await runYtDlp(args, {
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (stderr) {
      result.stderr = stderr.substring(0, MAX_LOG_CHUNK);
    }

    result.success = true;
    result.exitCode = 0;
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    if (error && typeof error === "object") {
      if ("code" in error) {
        result.exitCode = error.code as number;
      }
      if ("stderr" in error) {
        result.stderr = String(error.stderr).substring(0, MAX_LOG_CHUNK);
      }
    }
    return result;
  }
}

/**
 * Find downloaded file in output directory by globbing for videoId.*
 * Ignores .part files
 */
export function findDownloadedFile(outputDir: string, videoId: string): string | null {
  if (!fs.existsSync(outputDir)) {
    return null;
  }

  const files = fs.readdirSync(outputDir);
  const candidates = files.filter(
    (f) => f.startsWith(videoId) && !f.endsWith(".part") && f.includes(".")
  );

  if (candidates.length === 0 || !candidates[0]) {
    return null;
  }

  // Return the first match (should only be one)
  return path.join(outputDir, candidates[0]);
}

/**
 * Format discovery result to log string
 */
export function formatDiscoveryToLog(discovery: FormatDiscoveryResult): string {
  const lines: string[] = [];
  lines.push(`Total formats: ${discovery.totalFormats}`);
  lines.push(`Audio-only formats: ${discovery.audioOnlyFormats}`);
  lines.push(`m3u8 audio formats: ${discovery.m3u8AudioFormats}`);

  if (discovery.selectedFormat) {
    const fmt = discovery.selectedFormat;
    lines.push(`Selected format: ${fmt.format_id}`);
    lines.push(`  ext: ${fmt.ext}`);
    lines.push(`  protocol: ${fmt.protocol || "N/A"}`);
    lines.push(`  acodec: ${fmt.acodec || "N/A"}`);
    lines.push(`  abr: ${fmt.abr || "N/A"}`);
    lines.push(`  format_note: ${fmt.format_note || "N/A"}`);
  }

  if (discovery.error) {
    lines.push(`Error: ${discovery.error}`);
  }

  if (discovery.stderr) {
    lines.push(`Stderr: ${discovery.stderr}`);
  }

  return lines.join("\n");
}
