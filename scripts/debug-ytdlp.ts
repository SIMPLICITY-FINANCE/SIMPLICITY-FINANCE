#!/usr/bin/env tsx

/**
 * Debug script for testing YouTube audio downloads locally
 * Usage: npx tsx scripts/debug-ytdlp.ts <youtube-url>
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  discoverFormats,
  downloadFormat,
  findDownloadedFile,
  formatDiscoveryToLog,
  getYtDlpVersion,
  YOUTUBE_CLIENT_STRATEGIES,
  type DownloadStrategy,
} from "../inngest/lib/ytdlp";

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
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execFileAsync = promisify(execFile);

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

    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      filePath,
    ]);

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

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function main() {
  const args = process.argv.slice(2);

  // Default to test video if no URL provided
  const DEFAULT_TEST_VIDEO = "https://www.youtube.com/watch?v=qeTjwd69Nxw";
  
  const url = args[0] || DEFAULT_TEST_VIDEO;
  
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    console.error("Error: Invalid YouTube URL");
    console.error("Usage: npx tsx scripts/debug-ytdlp.ts [youtube-url]");
    console.error(`Example: npx tsx scripts/debug-ytdlp.ts ${DEFAULT_TEST_VIDEO}`);
    console.error(`\nIf no URL is provided, defaults to: ${DEFAULT_TEST_VIDEO}`);
    process.exit(1);
  }
  const videoId = extractVideoId(url);

  if (!videoId) {
    console.error("❌ Invalid YouTube URL");
    process.exit(1);
  }

  console.log("🔍 YouTube Audio Download Debug");
  console.log("================================");
  console.log(`URL: ${url}`);
  console.log(`Video ID: ${videoId}`);
  
  // Preflight: get yt-dlp version and path
  let ytdlpInfo;
  try {
    ytdlpInfo = await getYtDlpVersion();
    console.log(`yt-dlp version: ${ytdlpInfo.version} (path: ${ytdlpInfo.path})`);
  } catch (error) {
    console.error(`❌ yt-dlp preflight check failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
  
  console.log("");

  const outputDir = path.join(process.cwd(), "output", videoId);
  const outputTemplate = path.join(outputDir, `${videoId}.%(ext)s`);
  const logFile = path.join(outputDir, "download.log");

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Initialize log file
  const logLines: string[] = [];
  logLines.push("=== YouTube Audio Download Debug ===");
  logLines.push(`URL: ${url}`);
  logLines.push(`Video ID: ${videoId}`);
  logLines.push(`yt-dlp version: ${ytdlpInfo.version}`);
  logLines.push(`yt-dlp path: ${ytdlpInfo.path}`);
  logLines.push(`Timestamp: ${new Date().toISOString()}`);
  logLines.push("");

  // Use single source of truth for client strategies
  const clientStrategies = YOUTUBE_CLIENT_STRATEGIES;

  for (const { name, client } of clientStrategies) {
    console.log(`\n📡 Strategy: ${name}`);
    console.log(`   Client: ${client}`);
    console.log("");
    
    logLines.push(`\n=== Strategy: ${name} ===`);
    logLines.push(`Client: ${client}`);

    try {
      // Step 1: Format discovery
      console.log("   [1/4] Discovering formats...");
      logLines.push("\n[Format Discovery]");
      
      const discovery = await discoverFormats(url, client, 30000);

      console.log(`   ✓ Total formats: ${discovery.totalFormats}`);
      console.log(`   ✓ Audio-only formats: ${discovery.audioOnlyFormats}`);
      console.log(`   ✓ m3u8 audio formats: ${discovery.m3u8AudioFormats}`);
      
      logLines.push(`Total formats: ${discovery.totalFormats}`);
      logLines.push(`Audio-only formats: ${discovery.audioOnlyFormats}`);
      logLines.push(`m3u8 audio formats: ${discovery.m3u8AudioFormats}`);

      if (!discovery.success || !discovery.selectedFormat) {
        const errorMsg = discovery.error || "No suitable format found";
        console.log(`   ❌ Discovery failed: ${errorMsg}`);
        logLines.push(`Discovery failed: ${errorMsg}`);
        
        if (discovery.stderr) {
          console.log(`   Stderr: ${discovery.stderr.substring(0, 200)}`);
          logLines.push(`Stderr: ${discovery.stderr.substring(0, 3000)}`);
        }
        
        // Write log even on failure
        fs.writeFileSync(logFile, logLines.join("\n"));
        continue;
      }

      const selectedFormat = discovery.selectedFormat;
      console.log(`   ✓ Selected format: ${selectedFormat.format_id}`);
      console.log(`     - ext: ${selectedFormat.ext}`);
      console.log(`     - protocol: ${selectedFormat.protocol || "N/A"}`);
      console.log(`     - acodec: ${selectedFormat.acodec || "N/A"}`);
      console.log(`     - abr: ${selectedFormat.abr || "N/A"}`);
      
      logLines.push(`Selected format: ${selectedFormat.format_id}`);
      logLines.push(`  ext: ${selectedFormat.ext}`);
      logLines.push(`  protocol: ${selectedFormat.protocol || "N/A"}`);
      logLines.push(`  acodec: ${selectedFormat.acodec || "N/A"}`);
      logLines.push(`  abr: ${selectedFormat.abr || "N/A"}`);

      // Step 2: Download
      console.log(`\n   [2/4] Downloading format ${selectedFormat.format_id}...`);
      logLines.push(`\n[Download]`);
      
      const downloadResult = await downloadFormat(
        url,
        selectedFormat.format_id,
        outputTemplate,
        client,
        480000
      );

      if (!downloadResult.success) {
        const errorMsg = downloadResult.error || "Unknown error";
        console.log(`   ❌ Download failed: ${errorMsg}`);
        logLines.push(`Download failed: ${errorMsg}`);
        
        if (downloadResult.stderr) {
          console.log(`   Stderr: ${downloadResult.stderr.substring(0, 200)}`);
          logLines.push(`Stderr: ${downloadResult.stderr.substring(0, 3000)}`);
        }
        
        fs.writeFileSync(logFile, logLines.join("\n"));
        continue;
      }

      console.log(`   ✓ Download completed`);
      logLines.push(`Download completed`);

      // Step 3: Find file
      console.log(`\n   [3/4] Finding downloaded file...`);
      const downloadedFile = findDownloadedFile(outputDir, videoId);

      if (!downloadedFile) {
        console.log(`   ❌ No file found in ${outputDir}`);
        logLines.push(`ERROR: No file found in ${outputDir}`);
        fs.writeFileSync(logFile, logLines.join("\n"));
        continue;
      }

      console.log(`   ✓ File found: ${path.basename(downloadedFile)}`);
      logLines.push(`File found: ${downloadedFile}`);

      // Step 4: Validate
      console.log(`\n   [4/4] Validating audio integrity...`);
      logLines.push(`\n[Integrity Validation]`);
      
      const integrity = await validateAudioIntegrity(downloadedFile);

      console.log(`   File size: ${integrity.fileSize} bytes`);
      console.log(`   Has audio stream: ${integrity.hasAudioStream}`);
      console.log(`   Duration: ${integrity.durationSeconds}s`);
      console.log(`   Format: ${integrity.format || "unknown"}`);
      
      logLines.push(`File size: ${integrity.fileSize} bytes`);
      logLines.push(`Has audio stream: ${integrity.hasAudioStream}`);
      logLines.push(`Duration: ${integrity.durationSeconds}s`);
      logLines.push(`Format: ${integrity.format || "unknown"}`);

      if (!integrity.valid) {
        console.log(`   ❌ Integrity validation failed: ${integrity.error}`);
        logLines.push(`Integrity validation FAILED: ${integrity.error}`);
        fs.writeFileSync(logFile, logLines.join("\n"));
        continue;
      }

      console.log("");
      console.log("✅ SUCCESS!");
      console.log(`   Strategy: ${name}`);
      console.log(`   Format ID: ${selectedFormat.format_id}`);
      console.log(`   File: ${downloadedFile}`);
      console.log(`   Size: ${integrity.fileSize} bytes`);
      console.log(`   Duration: ${integrity.durationSeconds}s`);
      console.log("");
      
      logLines.push(`\n✅ SUCCESS`);
      logLines.push(`Strategy: ${name}`);
      logLines.push(`Format ID: ${selectedFormat.format_id}`);
      logLines.push(`File: ${downloadedFile}`);
      logLines.push(`Size: ${integrity.fileSize} bytes`);
      logLines.push(`Duration: ${integrity.durationSeconds}s`);
      
      fs.writeFileSync(logFile, logLines.join("\n"));

      process.exit(0);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`   ❌ Exception: ${errorMsg}`);
      logLines.push(`EXCEPTION: ${errorMsg}`);
      fs.writeFileSync(logFile, logLines.join("\n"));
    }
  }

  console.log("");
  console.log("❌ All strategies failed");
  logLines.push(`\n❌ All strategies failed`);
  fs.writeFileSync(logFile, logLines.join("\n"));
  
  process.exit(1);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
