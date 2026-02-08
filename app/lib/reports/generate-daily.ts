import OpenAI from "openai";
import postgres from "postgres";
import { DAILY_REPORT_SYSTEM_PROMPT, DAILY_REPORT_USER_PROMPT } from "../../../prompts/daily-report-v1.js";
import type { DailyReportContent, EpisodeForReport } from "./types.js";
import { createDailyReportNotification } from "../notifications/create.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Types for raw DB rows
// ─────────────────────────────────────────────────────────────────────────────

interface EpisodeRow {
  id: string;
  youtube_title: string;
  youtube_channel_title: string;
  published_at: string;
  video_id: string;
}

interface SummaryBulletRow {
  episode_id: string;
  section_name: string;
  bullet_text: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main generation function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a daily report for a specific date.
 * 
 * @param date - YYYY-MM-DD string
 * @param generationType - "auto" (cron) or "manual" (admin)
 * @param generatedBy - "system" or a user ID
 * @returns The report ID, or null if skipped (< 2 episodes)
 */
export async function generateDailyReport(
  date: string,
  generationType: "auto" | "manual" = "auto",
  generatedBy: string = "system"
): Promise<string | null> {
  const periodStart = `${date}T00:00:00Z`;
  const periodEnd = `${date}T23:59:59Z`;

  console.log(`[DailyReport] Generating for ${date} (${generationType})`);

  // Step 1: Check if a report already exists for this date
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'daily' AND date = ${date}
  `;

  if (existing && existing.status === "ready") {
    console.log(`[DailyReport] Report already exists for ${date}: ${existing.id}`);
    if (generationType === "auto") {
      return existing.id;
    }
    // Manual regeneration: delete old report
    console.log(`[DailyReport] Manual regeneration - deleting old report ${existing.id}`);
    await sql`DELETE FROM reports WHERE id = ${existing.id}`;
  } else if (existing && existing.status === "generating") {
    console.log(`[DailyReport] Report already generating for ${date}: ${existing.id}`);
    return existing.id;
  }

  // Step 2: Query episodes published on this date
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
      AND (
        e.published_at >= ${periodStart}::timestamp
        AND e.published_at < ${periodEnd}::timestamp
      )
    ORDER BY e.published_at ASC
  `;

  console.log(`[DailyReport] Found ${episodes.length} published episodes for ${date}`);

  if (episodes.length < 2) {
    console.log(`[DailyReport] Skipping - fewer than 2 episodes (${episodes.length})`);
    return null;
  }

  // Step 3: Create report row with "generating" status
  const [report] = await sql`
    INSERT INTO reports (
      title, report_type, generation_type, date,
      period_start, period_end, status,
      episodes_included, generated_by
    ) VALUES (
      ${'Daily Report — ' + new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })},
      'daily', ${generationType}, ${date},
      ${periodStart}, ${periodEnd}, 'generating',
      ${episodes.length}, ${generatedBy}
    )
    RETURNING id
  `;

  if (!report) throw new Error("Failed to create daily report row");
  const reportId = report.id;
  console.log(`[DailyReport] Created report ${reportId} with status=generating`);

  try {
    // Step 4: Link episodes to report
    for (const ep of episodes) {
      await sql`
        INSERT INTO report_episodes (report_id, episode_id)
        VALUES (${reportId}, ${ep.id})
        ON CONFLICT DO NOTHING
      `;
    }

    // Step 5: Fetch summary bullets for all episodes
    const episodeIds = episodes.map(e => e.id);
    const bullets = await sql<SummaryBulletRow[]>`
      SELECT 
        s.episode_id,
        sb.section_name,
        sb.bullet_text
      FROM summary_bullets sb
      JOIN episode_summary s ON sb.summary_id = s.id
      WHERE s.episode_id = ANY(${episodeIds})
      ORDER BY s.episode_id, sb.section_name, sb.created_at
    `;

    // Step 6: Build structured episode data for the prompt
    const episodesForPrompt: EpisodeForReport[] = episodes.map(ep => {
      const epBullets = bullets.filter(b => b.episode_id === ep.id);
      
      // Group bullets by section
      const sectionMap = new Map<string, string[]>();
      for (const b of epBullets) {
        if (!sectionMap.has(b.section_name)) {
          sectionMap.set(b.section_name, []);
        }
        sectionMap.get(b.section_name)!.push(b.bullet_text);
      }

      const sections = Array.from(sectionMap.entries()).map(([name, bulletTexts]) => ({
        name,
        bullets: bulletTexts,
      }));

      const keyQuotes = epBullets
        .filter(b => b.section_name === "KEY QUOTES")
        .map(b => b.bullet_text);

      return {
        id: ep.id,
        title: ep.youtube_title,
        channelTitle: ep.youtube_channel_title,
        publishedAt: ep.published_at,
        sections,
        keyQuotes,
      };
    });

    // Step 7: Call OpenAI
    const content = await callOpenAI(episodesForPrompt, date);

    // Step 8: Store themes
    for (const theme of content.themes) {
      await sql`
        INSERT INTO report_themes (report_id, name, description, prominence, episode_count)
        VALUES (${reportId}, ${theme.name}, ${theme.summary || ''}, ${theme.prominence}, ${theme.episodeCount})
      `;
    }

    // Step 9: Update report with content
    await sql`
      UPDATE reports
      SET 
        status = 'ready',
        content_json = ${JSON.stringify(content)}::jsonb,
        summary = ${content.executiveSummary},
        generated_at = NOW()
      WHERE id = ${reportId}
    `;

    console.log(`[DailyReport] ✅ Report ${reportId} ready — ${content.insights.length} insights, ${content.themes.length} themes, sentiment: ${content.sentiment.overall}, ${content.notableMoments?.length || 0} notable moments`);

    // Create notification
    try {
      await createDailyReportNotification({
        id: reportId,
        date,
        episodes_included: episodes.length,
      });
    } catch (err) {
      console.warn(`[DailyReport] ⚠️ Failed to create notification (non-fatal):`, err);
    }

    return reportId;

  } catch (error) {
    console.error(`[DailyReport] ❌ Failed to generate report ${reportId}:`, error);

    // Mark as failed
    await sql`
      UPDATE reports
      SET status = 'failed',
          summary = ${error instanceof Error ? error.message : 'Unknown error'}
      WHERE id = ${reportId}
    `;

    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI call
// ─────────────────────────────────────────────────────────────────────────────

async function callOpenAI(
  episodes: EpisodeForReport[],
  date: string
): Promise<DailyReportContent> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for daily report generation");
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const userPrompt = DAILY_REPORT_USER_PROMPT
    .replace("{{EPISODE_COUNT}}", String(episodes.length))
    .replace("{{DATE}}", date)
    .replace("{{EPISODES_JSON}}", JSON.stringify(episodes, null, 2));

  console.log(`[DailyReport] Calling OpenAI with ${episodes.length} episodes...`);

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
  
  let parsed: DailyReportContent;
  try {
    parsed = JSON.parse(raw) as DailyReportContent;
  } catch (e) {
    console.error("[DailyReport] Failed to parse OpenAI response:", raw.substring(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }

  // Validate required fields
  if (!parsed.executiveSummary || !Array.isArray(parsed.insights) || !Array.isArray(parsed.themes)) {
    throw new Error("AI response missing required fields (executiveSummary, insights, themes)");
  }

  // Validate and normalize sentiment structure
  if (!parsed.sentiment || typeof parsed.sentiment !== 'object') {
    console.warn(`[DailyReport] Missing sentiment object, creating default`);
    parsed.sentiment = { overall: 'mixed', breakdown: { bullish: 0, bearish: 0, neutral: episodes.length }, reasoning: 'Unable to determine sentiment.' };
  } else if (!['bullish', 'bearish', 'neutral', 'mixed'].includes(parsed.sentiment.overall)) {
    console.warn(`[DailyReport] Invalid sentiment.overall "${parsed.sentiment.overall}", defaulting to "mixed"`);
    parsed.sentiment.overall = 'mixed';
  }

  // Ensure notableMoments and lookingAhead exist
  if (!Array.isArray(parsed.notableMoments)) parsed.notableMoments = [];
  if (!parsed.lookingAhead) parsed.lookingAhead = '';

  console.log(`[DailyReport] OpenAI response: ${parsed.insights.length} insights, ${parsed.themes.length} themes, ${parsed.notableMoments.length} notable moments`);
  return parsed;
}
