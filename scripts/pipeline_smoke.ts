import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";

const ArgsSchema = z.object({
  url: z.string().url(),
});

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

function main() {
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
    console.error("❌ This Robot v0 currently supports YouTube URLs only (captions-first).");
    console.error("Got:", url);
    process.exit(1);
  }

  console.log("🤖 Robot v0 accepted YouTube URL.");
  console.log("videoId:", videoId);

  // Create output directory
  const outputDir = path.join(process.cwd(), "output", videoId);
  fs.mkdirSync(outputDir, { recursive: true });

  // Write episode.json
  const episode = {
    source: "youtube",
    url,
    videoId,
    createdAtISO: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outputDir, "episode.json"), JSON.stringify(episode, null, 2));

  // Write transcript.jsonl (placeholder)
  const placeholderLine = JSON.stringify({ start_ms: 0, end_ms: 0, speaker: null, text: "PLACEHOLDER" });
  fs.writeFileSync(path.join(outputDir, "transcript.jsonl"), placeholderLine + "\n");

  console.log(`✅ Output written to: output/${videoId}/`);
}

main();
