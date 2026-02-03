#!/usr/bin/env node

/**
 * Bootstrap script to download and setup yt-dlp standalone binaries
 * Supports macOS (darwin) and Linux (x64)
 * Downloads from official GitHub releases
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as https from "node:https";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const YT_DLP_VERSION = "2026.01.31";
const VENDOR_DIR = path.join(process.cwd(), "vendor", "yt-dlp");

interface PlatformConfig {
  platform: string;
  downloadUrl: string;
  binaryName: string;
}

function getPlatformConfig(): PlatformConfig | null {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "darwin") {
    // macOS - universal binary
    return {
      platform: "darwin",
      downloadUrl: `https://github.com/yt-dlp/yt-dlp/releases/download/${YT_DLP_VERSION}/yt-dlp_macos`,
      binaryName: "yt-dlp",
    };
  } else if (platform === "linux" && arch === "x64") {
    // Linux x64
    return {
      platform: "linux",
      downloadUrl: `https://github.com/yt-dlp/yt-dlp/releases/download/${YT_DLP_VERSION}/yt-dlp_linux`,
      binaryName: "yt-dlp",
    };
  }

  console.warn(`⚠️  Unsupported platform: ${platform} ${arch}`);
  return null;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error("Redirect without location header"));
          return;
        }
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });

    file.on("error", (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function verifyBinary(binaryPath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync(binaryPath, ["--version"]);
    return stdout.trim();
  } catch (error) {
    throw new Error(`Binary verification failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  console.log("🔧 yt-dlp Binary Setup");
  console.log("=====================\n");

  // Check if setup should be skipped
  if (process.env.SKIP_YTDLP_SETUP === "1") {
    console.log("⏭️  SKIP_YTDLP_SETUP=1, skipping binary setup");
    process.exit(0);
  }

  const config = getPlatformConfig();
  if (!config) {
    console.log("⏭️  Skipping binary setup for unsupported platform");
    process.exit(0);
  }

  const platformDir = path.join(VENDOR_DIR, config.platform);
  const binaryPath = path.join(platformDir, config.binaryName);

  // Check if binary already exists and is correct version
  if (fs.existsSync(binaryPath)) {
    try {
      const version = await verifyBinary(binaryPath);
      if (version.includes(YT_DLP_VERSION)) {
        console.log(`✓ yt-dlp ${YT_DLP_VERSION} already installed at ${binaryPath}`);
        console.log(`  Version: ${version}`);
        process.exit(0);
      } else {
        console.log(`⚠️  Existing binary is version ${version}, upgrading to ${YT_DLP_VERSION}`);
        fs.unlinkSync(binaryPath);
      }
    } catch (error) {
      console.log(`⚠️  Existing binary is invalid, re-downloading`);
      fs.unlinkSync(binaryPath);
    }
  }

  // Create vendor directory
  console.log(`📁 Creating directory: ${platformDir}`);
  fs.mkdirSync(platformDir, { recursive: true });

  // Download binary
  console.log(`📥 Downloading yt-dlp ${YT_DLP_VERSION} for ${config.platform}...`);
  console.log(`   URL: ${config.downloadUrl}`);

  try {
    await downloadFile(config.downloadUrl, binaryPath);
    console.log(`✓ Downloaded to ${binaryPath}`);
  } catch (error) {
    console.error(`❌ Download failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // Make executable
  console.log(`🔐 Setting executable permissions...`);
  fs.chmodSync(binaryPath, 0o755);

  // Verify binary
  console.log(`✓ Verifying binary...`);
  try {
    const version = await verifyBinary(binaryPath);
    console.log(`✓ Binary verified successfully`);
    console.log(`  Version: ${version}`);
    console.log(`  Path: ${binaryPath}`);
  } catch (error) {
    console.error(`❌ Verification failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  console.log("\n✅ yt-dlp binary setup complete!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
