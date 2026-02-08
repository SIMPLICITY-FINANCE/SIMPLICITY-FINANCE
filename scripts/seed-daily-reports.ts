/**
 * Seed Daily Reports
 * 
 * Generates sample daily reports using existing episodes in the database.
 * Uses the real OpenAI API to produce quality content.
 * 
 * Since episodes may be sparse (1 per day), this script groups episodes
 * into batches of 3 and assigns them to recent dates for demo purposes.
 * 
 * Usage: npx tsx scripts/seed-daily-reports.ts
 * 
 * Idempotent: skips dates that already have a ready report.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import OpenAI from "openai";
import postgres from "postgres";
import { DAILY_REPORT_SYSTEM_PROMPT, DAILY_REPORT_USER_PROMPT } from "../prompts/daily-report-v1.js";
import type { DailyReportContent, EpisodeForReport } from "../app/lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface EpisodeRow {
  id: string;
  youtube_title: string;
  youtube_channel_title: string;
  published_at: string;
  video_id: string;
}

interface BulletRow {
  episode_id: string;
  section_name: string;
  bullet_text: string;
}

async function generateReportForDate(
  dateStr: string,
  episodes: EpisodeRow[],
  bullets: BulletRow[]
): Promise<string | null> {
  const periodStart = `${dateStr}T00:00:00Z`;
  const periodEnd = `${dateStr}T23:59:59Z`;

  // Check if already exists
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'daily' AND date = ${dateStr}
  `;
  if (existing?.status === "ready") {
    console.log(`  ⏭️  Skipping ${dateStr} — report already exists`);
    return existing.id;
  }
  if (existing) {
    await sql`DELETE FROM reports WHERE id = ${existing.id}`;
  }

  const title = 'Daily Report — ' + new Date(dateStr + "T12:00:00Z").toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  // Create report row
  const [report] = await sql`
    INSERT INTO reports (
      title, report_type, generation_type, date,
      period_start, period_end, status,
      episodes_included, generated_by
    ) VALUES (
      ${title}, 'daily', 'manual', ${dateStr},
      ${periodStart}, ${periodEnd}, 'generating',
      ${episodes.length}, 'seed-script'
    )
    RETURNING id
  `;

  try {
    // Link episodes
    for (const ep of episodes) {
      await sql`
        INSERT INTO report_episodes (report_id, episode_id)
        VALUES (${report.id}, ${ep.id})
        ON CONFLICT DO NOTHING
      `;
    }

    // Build prompt data
    const episodesForPrompt: EpisodeForReport[] = episodes.map(ep => {
      const epBullets = bullets.filter(b => b.episode_id === ep.id);
      const sectionMap = new Map<string, string[]>();
      for (const b of epBullets) {
        if (!sectionMap.has(b.section_name)) sectionMap.set(b.section_name, []);
        sectionMap.get(b.section_name)!.push(b.bullet_text);
      }
      return {
        id: ep.id,
        title: ep.youtube_title,
        channelTitle: ep.youtube_channel_title,
        publishedAt: ep.published_at || dateStr,
        sections: Array.from(sectionMap.entries()).map(([name, buls]) => ({ name, bullets: buls })),
        keyQuotes: epBullets.filter(b => b.section_name === "KEY QUOTES").map(b => b.bullet_text),
      };
    });

    // Call OpenAI
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required");

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const userPrompt = DAILY_REPORT_USER_PROMPT
      .replace("{{EPISODE_COUNT}}", String(episodes.length))
      .replace("{{DATE}}", dateStr)
      .replace("{{EPISODES_JSON}}", JSON.stringify(episodesForPrompt, null, 2));

    console.log(`  📡 Calling OpenAI for ${episodes.length} episodes...`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DAILY_REPORT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const content = JSON.parse(raw) as DailyReportContent;

    // Store themes
    for (const theme of content.themes || []) {
      await sql`
        INSERT INTO report_themes (report_id, name, description, prominence, episode_count)
        VALUES (${report.id}, ${theme.name}, ${theme.summary || ''}, ${theme.prominence || 0.5}, ${theme.episodeCount || 1})
      `;
    }

    // Update report
    await sql`
      UPDATE reports
      SET status = 'ready',
          content_json = ${JSON.stringify(content)}::jsonb,
          summary = ${content.executiveSummary || ''},
          generated_at = NOW()
      WHERE id = ${report.id}
    `;

    return report.id;
  } catch (error) {
    await sql`
      UPDATE reports SET status = 'failed', summary = ${String(error)}
      WHERE id = ${report.id}
    `;
    throw error;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Seed Daily Reports");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Get ALL episodes with summaries
  const episodes = await sql<EpisodeRow[]>`
    SELECT 
      e.id,
      COALESCE(e.youtube_title, 'Untitled Episode') as youtube_title,
      COALESCE(e.youtube_channel_title, 'Unknown') as youtube_channel_title,
      COALESCE(e.published_at::text, e.created_at::text) as published_at,
      COALESCE(e.video_id, '') as video_id
    FROM episodes e
    JOIN episode_summary s ON s.episode_id = e.id
    WHERE e.is_published = true
    ORDER BY e.created_at DESC
  `;

  console.log(`Found ${episodes.length} episodes with summaries`);

  if (episodes.length < 2) {
    console.log("❌ Need at least 2 episodes with summaries. Exiting.");
    await sql.end();
    process.exit(0);
  }

  // Fetch all bullets
  const episodeIds = episodes.map(e => e.id);
  const bullets = await sql<BulletRow[]>`
    SELECT s.episode_id, sb.section_name, sb.bullet_text
    FROM summary_bullets sb
    JOIN episode_summary s ON sb.summary_id = s.id
    WHERE s.episode_id = ANY(${episodeIds})
    ORDER BY s.episode_id, sb.section_name, sb.created_at
  `;

  console.log(`Found ${bullets.length} total bullets\n`);

  // Create batches of 3 episodes, assign to recent dates
  const batchSize = Math.min(3, episodes.length);
  const numReports = Math.min(3, Math.floor(episodes.length / 2));
  
  let generated = 0;

  for (let i = 0; i < numReports; i++) {
    // Assign to yesterday - i days
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1 - i);
    const dateStr = d.toISOString().split("T")[0]!;

    // Pick episodes for this batch
    const start = i * batchSize;
    const batch = episodes.slice(start, start + batchSize);
    if (batch.length < 2) break;

    console.log(`─── Report ${i + 1}: ${dateStr} (${batch.length} episodes) ───`);
    batch.forEach(ep => console.log(`  • ${ep.youtube_title.substring(0, 60)}`));

    try {
      const reportId = await generateReportForDate(dateStr, batch, bullets);
      if (reportId) {
        console.log(`  ✅ Report ready: ${reportId}`);
        console.log(`  🔗 http://localhost:3000/reports/daily/${dateStr}\n`);
        generated++;
      }
    } catch (error) {
      console.error(`  ❌ Failed:`, error instanceof Error ? error.message : error);
    }
  }

  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  Done! Generated ${generated} reports`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // Show all reports
  const allReports = await sql`
    SELECT id, date, status, episodes_included, title
    FROM reports WHERE report_type = 'daily'
    ORDER BY date DESC LIMIT 10
  `;
  if (allReports.length > 0) {
    console.log("All daily reports:");
    for (const r of allReports) {
      const icon = r.status === "ready" ? "✅" : r.status === "generating" ? "⏳" : "❌";
      console.log(`  ${icon} ${r.date} — ${r.episodes_included} ep — ${r.title}`);
    }
    console.log(`\nDashboard: http://localhost:3000/reports`);
  }

  await sql.end();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
