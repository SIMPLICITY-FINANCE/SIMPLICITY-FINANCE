# YouTube Download Troubleshooting Guide

## Overview

This document explains the YouTube audio download implementation and how to troubleshoot failures.

## Architecture

### Download Strategy

The system uses a **format discovery + targeted download** approach with multiple client fallbacks:

1. **web_safari** (preferred) - Provides HLS/m3u8 formats that don't require PO tokens
2. **mweb** - Mobile web client
3. **ios** - iOS client (alternative mobile format source)
4. **web** - Standard web client (may be SABR-only)
5. **tv_embedded** - TV embedded client (optional, often blocked)

### Process Flow

For each client strategy:

1. **Format Discovery** (`yt-dlp -J`)
   - Fetch all available formats as JSON
   - Filter for audio-only formats (vcodec=none, acodec!=none)
   - Prefer m3u8/HLS formats (no PO token required)
   - Select best format by bitrate

2. **Download** (`yt-dlp -f <format_id>`)
   - Download the specific format ID
   - Use `execFile` (not shell) to avoid quoting issues
   - 8-minute timeout per download

3. **File Detection**
   - Glob for `{videoId}.*` in output directory
   - Ignore `.part` files

4. **Integrity Validation**
   - File size >= 150KB
   - ffprobe detects audio stream
   - Duration >= 10 seconds (not NaN)

## Common Failures

### 1. "Requested format is not available"

**Cause:** YouTube is blocking the client type for this video.

**Solution:**
- Try a different video
- Check if video has regional restrictions
- Verify video is not age-restricted or private

### 2. "YouTube is forcing SABR streaming"

**Cause:** Web client is getting SABR-only formats (missing URLs).

**Solution:**
- web_safari client should bypass this (tries first)
- Check logs to see if web_safari was attempted

### 3. "PO Token required"

**Cause:** Client requires Google Video Streaming Proof of Origin token.

**Solution:**
- web_safari and mweb should not require PO tokens for m3u8 formats
- If all clients fail, video may require authentication

### 4. "No audio stream found"

**Cause:** Downloaded file is not valid audio.

**Solution:**
- Check download.log for stderr output
- Verify yt-dlp version is up to date
- File is automatically deleted if invalid

### 5. "Audio too short or invalid"

**Cause:** Duration is < 10 seconds or NaN.

**Solution:**
- Check if video is actually that short
- ffprobe may have failed to read duration
- File is automatically deleted if invalid

## Debug Tools

### Local Testing Script

```bash
npx tsx scripts/debug-ytdlp.ts <youtube-url>
```

This script:
- Tests all client strategies
- Shows format discovery results
- Validates downloaded audio
- Provides detailed output at each step

### Example Output

```
🔍 YouTube Audio Download Debug
================================
URL: https://www.youtube.com/watch?v=qeTjwd69Nxw
Video ID: qeTjwd69Nxw

📡 Strategy: web_safari (HLS/m3u8 preferred)
   Client: web_safari

   [1/4] Discovering formats...
   ✓ Total formats: 42
   ✓ Audio-only formats: 8
   ✓ m3u8 audio formats: 4
   ✓ Selected format: 140
     - ext: m4a
     - protocol: https
     - acodec: mp4a.40.2
     - abr: 128

   [2/4] Downloading format 140...
   ✓ Download completed

   [3/4] Finding downloaded file...
   ✓ File found: qeTjwd69Nxw.m4a

   [4/4] Validating audio integrity...
   File size: 2456789 bytes
   Has audio stream: true
   Duration: 305.2s
   Format: mov,mp4,m4a,3gp,3g2,mj2

✅ SUCCESS!
   Strategy: web_safari (HLS/m3u8 preferred)
   Format ID: 140
   File: /path/to/output/qeTjwd69Nxw/qeTjwd69Nxw.m4a
   Size: 2456789 bytes
   Duration: 305.2s
```

### Download Logs

Every download attempt creates `output/{videoId}/download.log` with:

- Strategy name and client type
- Format discovery results (total formats, audio-only, m3u8)
- Selected format details
- Download command and stderr
- Integrity validation results
- Success or failure reason

**Example log location:**
```
output/qeTjwd69Nxw/download.log
```

## Environment Variables

### YT_DLP_BIN

Override the yt-dlp binary path (useful for Netlify deployment):

```bash
export YT_DLP_BIN=/path/to/yt-dlp
```

Default: `yt-dlp` (assumes in PATH)

### YTDLP_VERBOSE

Enable verbose debug output (`-vU` flags) for troubleshooting:

```bash
export YTDLP_VERBOSE=1
```

When enabled:
- Adds `-vU` to both format discovery and download commands
- Captures detailed yt-dlp diagnostic output
- Output is capped at 10k characters per log chunk to prevent huge files
- Useful for diagnosing "The page needs to be reloaded" and other YouTube errors

Default: disabled

## Development Considerations

### Cache Safety

After changing yt-dlp path resolution logic or updating the vendored binary:

```bash
# Delete Next.js cache
rm -rf .next

# Restart dev servers
npm run dev
npm run inngest:dev
```

**Why:** Next.js/Turbopack may cache the old binary path resolution. Deleting `.next` ensures fresh module resolution.

## Production Considerations

### Netlify Deployment

#### yt-dlp Binary

The project uses **standalone yt-dlp binaries** bundled in `vendor/yt-dlp/`:

```
vendor/
└── yt-dlp/
    ├── darwin/
    │   └── yt-dlp  (macOS binary)
    └── linux/
        └── yt-dlp  (Linux binary)
```

**Setup:**
1. Run `npm run setup:ytdlp` to download binaries for your platform
2. **Do NOT gitignore `vendor/`** - binaries must be in the deployment bundle
3. Netlify Functions run on Linux, so the `vendor/yt-dlp/linux/yt-dlp` binary will be used automatically

**Binary Selection Logic:**
1. If `YT_DLP_BIN` env var is set → use that path
2. Else if `vendor/yt-dlp/{platform}/yt-dlp` exists → use vendored binary
3. Else → fallback to `yt-dlp` in PATH

**Skipping Setup in CI:**
```bash
# If network is unavailable or you want to skip binary download
export SKIP_YTDLP_SETUP=1
npm install
```

#### FFmpeg/FFprobe

For audio validation and conversion, ensure ffmpeg/ffprobe are available:

**Option 1: Netlify Build Plugin**
```toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-ffmpeg"
```

**Option 2: Custom Binary**
Similar to yt-dlp, you can bundle ffmpeg/ffprobe binaries:
```bash
# Download ffmpeg static builds
# https://johnvansickle.com/ffmpeg/

# Set environment variables
FFMPEG_BIN=/path/to/bundled/ffmpeg
FFPROBE_BIN=/path/to/bundled/ffprobe
```

**Option 3: Docker Container** (Netlify Functions 2.0)
Use a Docker image with ffmpeg pre-installed.

### Rate Limiting

YouTube may rate-limit based on:
- IP address
- Request frequency
- User-agent patterns

**Mitigation:**
- Implement exponential backoff
- Add delays between requests
- Monitor for 429 responses

### Video Restrictions

Some videos cannot be downloaded without authentication:
- Age-restricted content
- Premium/paid content
- Geo-restricted content
- Private/unlisted videos

**Detection:**
- Check error logs for "Sign in to confirm your age"
- Check for "This video is not available"
- All strategies will fail with clear error messages

## Updating yt-dlp

YouTube frequently changes their API. Keep yt-dlp updated:

```bash
pip install --upgrade yt-dlp
```

Or use the official binary:
```bash
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp
```

## References

- [yt-dlp PO Token Guide](https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide)
- [yt-dlp SABR Issue #12482](https://github.com/yt-dlp/yt-dlp/issues/12482)
- [YouTube Data API](https://developers.google.com/youtube/v3)
