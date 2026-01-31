import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";
import { episodes, transcriptSegmentsRaw, episodeSummary, summaryBullets, qcRuns } from "../db/schema.js";
import type { Summary } from "../schemas/summary.schema.js";
import type { QC } from "../schemas/qc.schema.js";

config({ path: ".env.local" });

interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  speaker: string | null;
  text: string;
}

interface EpisodeJson {
  source: string;
  url?: string;
  videoId?: string;
  audioId?: string;
  fileId?: string;
  createdAtISO: string;
  youtube?: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    description: string;
    thumbnails: {
      default?: string | null;
      medium?: string | null;
      high?: string | null;
    };
    durationISO: string;
    viewCount?: string | null;
  };
}

async function insertRobotOutput(outputDir: string) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = postgres(DATABASE_URL);

  try {
    console.log(`📂 Reading robot output from: ${outputDir}`);

    // Read episode.json
    const episodePath = path.join(outputDir, "episode.json");
    if (!fs.existsSync(episodePath)) {
      throw new Error(`episode.json not found in ${outputDir}`);
    }
    const episodeData: EpisodeJson = JSON.parse(fs.readFileSync(episodePath, "utf-8"));

    // Read transcript.jsonl
    const transcriptPath = path.join(outputDir, "transcript.jsonl");
    if (!fs.existsSync(transcriptPath)) {
      throw new Error(`transcript.jsonl not found in ${outputDir}`);
    }
    const transcriptContent = fs.readFileSync(transcriptPath, "utf-8");
    const segments: TranscriptSegment[] = transcriptContent
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));

    // Read summary.json
    const summaryPath = path.join(outputDir, "summary.json");
    if (!fs.existsSync(summaryPath)) {
      throw new Error(`summary.json not found in ${outputDir}`);
    }
    const summaryData: Summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));

    // Read qc.json
    const qcPath = path.join(outputDir, "qc.json");
    if (!fs.existsSync(qcPath)) {
      throw new Error(`qc.json not found in ${outputDir}`);
    }
    const qcData: QC = JSON.parse(fs.readFileSync(qcPath, "utf-8"));

    console.log("✅ All files loaded successfully");
    console.log(`   - Episode source: ${episodeData.source}`);
    console.log(`   - Transcript segments: ${segments.length}`);
    console.log(`   - Summary sections: ${summaryData.sections.length}`);
    console.log(`   - QC status: ${qcData.qc_status} (${qcData.qc_score}/100)`);

    // Insert episode
    console.log("\n📝 Inserting episode...");
    const [episode] = await sql`
      INSERT INTO episodes (
        source, url, video_id, audio_id, file_id,
        youtube_title, youtube_channel_title, youtube_channel_id,
        youtube_published_at, youtube_description, youtube_thumbnail_url,
        youtube_duration, youtube_view_count
      ) VALUES (
        ${episodeData.source},
        ${episodeData.url || null},
        ${episodeData.videoId || null},
        ${episodeData.audioId || null},
        ${episodeData.fileId || null},
        ${episodeData.youtube?.title || null},
        ${episodeData.youtube?.channelTitle || null},
        ${episodeData.youtube?.channelId || null},
        ${episodeData.youtube?.publishedAt || null},
        ${episodeData.youtube?.description || null},
        ${episodeData.youtube?.thumbnails?.high || null},
        ${episodeData.youtube?.durationISO || null},
        ${episodeData.youtube?.viewCount || null}
      )
      RETURNING id
    `;
    if (!episode) throw new Error("Failed to insert episode");
    console.log(`✅ Episode inserted: ${episode.id}`);

    // Insert transcript segments
    console.log("\n📝 Inserting transcript segments...");
    for (const segment of segments) {
      await sql`
        INSERT INTO transcript_segments_raw (
          episode_id, start_ms, end_ms, speaker, text
        ) VALUES (
          ${episode.id},
          ${segment.start_ms},
          ${segment.end_ms},
          ${segment.speaker},
          ${segment.text}
        )
      `;
    }
    console.log(`✅ Inserted ${segments.length} transcript segments`);

    // Insert summary
    console.log("\n📝 Inserting summary...");
    const [summary] = await sql`
      INSERT INTO episode_summary (
        episode_id, version, video_id, title, published_at
      ) VALUES (
        ${episode.id},
        ${summaryData.version},
        ${summaryData.videoId},
        ${summaryData.title},
        ${summaryData.publishedAt}
      )
      RETURNING id
    `;
    if (!summary) throw new Error("Failed to insert summary");
    console.log(`✅ Summary inserted: ${summary.id}`);

    // Insert summary bullets
    console.log("\n📝 Inserting summary bullets...");
    let bulletCount = 0;
    for (const section of summaryData.sections) {
      for (const bullet of section.bullets) {
        await sql`
          INSERT INTO summary_bullets (
            summary_id, section_name, bullet_text, confidence, evidence_spans
          ) VALUES (
            ${summary.id},
            ${section.name},
            ${bullet.text},
            ${bullet.confidence},
            ${JSON.stringify(bullet.evidence)}
          )
        `;
        bulletCount++;
      }
    }
    console.log(`✅ Inserted ${bulletCount} summary bullets`);

    // Insert QC run
    console.log("\n📝 Inserting QC run...");
    const [qc] = await sql`
      INSERT INTO qc_runs (
        episode_id, summary_id, version, video_id,
        qc_status, qc_score, risk_flags, flags
      ) VALUES (
        ${episode.id},
        ${summary.id},
        ${qcData.version},
        ${qcData.videoId},
        ${qcData.qc_status},
        ${qcData.qc_score},
        ${JSON.stringify(qcData.risk_flags)},
        ${JSON.stringify(qcData.flags)}
      )
      RETURNING id
    `;
    if (!qc) throw new Error("Failed to insert QC run");
    console.log(`✅ QC run inserted: ${qc.id}`);

    console.log("\n🎉 All data inserted successfully!");
    console.log(`\nSummary:`);
    console.log(`  Episode ID: ${episode.id}`);
    console.log(`  Summary ID: ${summary.id}`);
    console.log(`  QC Run ID: ${qc.id}`);
    console.log(`  Transcript segments: ${segments.length}`);
    console.log(`  Summary bullets: ${bulletCount}`);

  } catch (err) {
    console.error("❌ Error inserting robot output:");
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Get output directory from command line
const outputDir = process.argv[2];
if (!outputDir) {
  console.error("❌ Usage: npm run db:insert <output-directory>");
  console.error("Example: npm run db:insert output/sample_transcript");
  process.exit(1);
}

insertRobotOutput(outputDir);
