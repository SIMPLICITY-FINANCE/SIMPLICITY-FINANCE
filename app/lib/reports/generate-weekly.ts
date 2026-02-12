import OpenAI from "openai";
import { WEEKLY_REPORT_SYSTEM_PROMPT, WEEKLY_REPORT_USER_PROMPT } from "../../../prompts/weekly-synthesis-v1.js";
import type { WeeklyReportContent } from "./types.js";
import { createWeeklyReportNotification } from "../notifications/create.js";
import { sql } from "../db.js";

interface DailyReportRow {
  id: string;
  title: string;
  date: string;
  content_json: string | object | null;
  episodes_included: number;
}

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

/**
 * Generate a weekly report for a given ISO week.
 *
 * @param weekStart - ISO date string for Monday (YYYY-MM-DD)
 * @param weekEnd   - ISO date string for Sunday (YYYY-MM-DD)
 * @param dateKey   - Canonical key like "2025-W06"
 * @param generationType - "auto" | "manual"
 * @param generatedBy - "system" or user id
 * @returns The report ID, or null if skipped
 */
export async function generateWeeklyReport(
  weekStart: string,
  weekEnd: string,
  dateKey: string,
  generationType: "auto" | "manual" = "auto",
  generatedBy: string = "system"
): Promise<string | null> {
  console.log(`[WeeklyReport] Generating for ${dateKey} (${weekStart} — ${weekEnd})`);

  // Check existing
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'weekly' AND date = ${dateKey}
  `;

  if (existing && existing.status === "ready" && generationType === "auto") {
    console.log(`[WeeklyReport] Already exists: ${existing.id}`);
    return existing.id;
  }
  if (existing && generationType === "manual") {
    await sql`DELETE FROM reports WHERE id = ${existing.id}`;
  }

  // Fetch daily reports from this week
  const dailyReports = await sql<DailyReportRow[]>`
    SELECT id, title, date, content_json, episodes_included
    FROM reports
    WHERE report_type = 'daily'
      AND status = 'ready'
      AND date >= ${weekStart}
      AND date <= ${weekEnd}
    ORDER BY date ASC
  `;

  console.log(`[WeeklyReport] Found ${dailyReports.length} daily reports for ${dateKey}`);

  let sourceReports: DailyReportRow[];
  let totalEpisodes: number;
  let episodeIdsForLinking: string[] = [];

  if (dailyReports.length > 0) {
    // Parse JSONB strings
    for (const r of dailyReports) {
      if (r.content_json && typeof r.content_json === "string") {
        r.content_json = JSON.parse(r.content_json);
      }
    }
    sourceReports = dailyReports;
    totalEpisodes = dailyReports.reduce((sum, r) => sum + r.episodes_included, 0);
  } else {
    // Fallback: synthesize directly from episodes
    console.log(`[WeeklyReport] No daily reports — falling back to direct episode synthesis`);

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
        AND e.published_at >= ${weekStart + "T00:00:00Z"}::timestamp
        AND e.published_at < ${weekEnd + "T23:59:59Z"}::timestamp
      ORDER BY e.published_at ASC
    `;

    console.log(`[WeeklyReport] Found ${episodes.length} episodes directly for ${dateKey}`);

    if (episodes.length === 0) {
      console.log(`[WeeklyReport] Skipping — no daily reports and no episodes`);
      return null;
    }

    // Fetch summary bullets for all episodes
    const episodeIds = episodes.map(e => e.id);
    episodeIdsForLinking = episodeIds;
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

    // Group episodes by date and build synthetic daily report structures
    const byDate = new Map<string, EpisodeRow[]>();
    for (const ep of episodes) {
      const d = ep.published_at.split("T")[0] || "unknown";
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d)!.push(ep);
    }

    sourceReports = Array.from(byDate.entries()).map(([date, dateEpisodes]) => {
      // Build a summary from bullets for each episode
      const episodeSummaries = dateEpisodes.map(ep => {
        const epBullets = bullets.filter(b => b.episode_id === ep.id);
        const sectionMap = new Map<string, string[]>();
        for (const b of epBullets) {
          if (!sectionMap.has(b.section_name)) sectionMap.set(b.section_name, []);
          sectionMap.get(b.section_name)!.push(b.bullet_text);
        }
        return {
          title: ep.youtube_title,
          channel: ep.youtube_channel_title,
          sections: Object.fromEntries(sectionMap),
        };
      });

      return {
        id: `synthetic-${date}`,
        title: `Episodes from ${date}`,
        date,
        content_json: { episodes: episodeSummaries } as object,
        episodes_included: dateEpisodes.length,
      };
    });

    totalEpisodes = episodes.length;
    console.log(`[WeeklyReport] Built ${sourceReports.length} synthetic daily summaries from ${totalEpisodes} episodes`);
  }

  // Create report row
  const weekLabel = `Weekly Report — ${new Date(weekStart + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(weekEnd + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const [report] = await sql`
    INSERT INTO reports (
      title, report_type, generation_type, date,
      period_start, period_end, status,
      episodes_included, generated_by
    ) VALUES (
      ${weekLabel}, 'weekly', ${generationType}, ${dateKey},
      ${weekStart + "T00:00:00Z"}, ${weekEnd + "T23:59:59Z"}, 'generating',
      ${totalEpisodes}, ${generatedBy}
    )
    RETURNING id
  `;

  if (!report) throw new Error("Failed to create weekly report row");
  const reportId = report.id;

  try {
    // Link source episodes
    if (episodeIdsForLinking.length > 0) {
      // Direct episode fallback — link episodes directly
      for (const epId of episodeIdsForLinking) {
        await sql`
          INSERT INTO report_episodes (report_id, episode_id)
          VALUES (${reportId}, ${epId})
          ON CONFLICT DO NOTHING
        `;
      }
    } else {
      // Normal path — link via daily report episodes
      const dailyReportIds = sourceReports.map((r) => r.id);
      await sql`
        INSERT INTO report_episodes (report_id, episode_id)
        SELECT ${reportId}, re.episode_id
        FROM report_episodes re
        WHERE re.report_id = ANY(${dailyReportIds})
        ON CONFLICT DO NOTHING
      `;
    }

    // Call OpenAI
    const content = await callOpenAI(sourceReports, weekStart, weekEnd, totalEpisodes);

    // Store themes
    for (const theme of content.emergingThemes) {
      await sql`
        INSERT INTO report_themes (report_id, name, description, prominence)
        VALUES (${reportId}, ${theme.theme}, ${theme.evolution}, ${theme.prominence})
      `;
    }

    // Update report
    await sql`
      UPDATE reports
      SET status = 'ready',
          content_json = ${JSON.stringify(content)}::jsonb,
          summary = ${content.executiveSummary},
          generated_at = NOW()
      WHERE id = ${reportId}
    `;

    console.log(`[WeeklyReport] ✅ Report ${reportId} ready — ${content.emergingThemes.length} themes, ${content.topInsights.length} insights`);

    // Create notification
    try {
      await createWeeklyReportNotification({
        id: reportId,
        dateKey,
        episodes_included: totalEpisodes,
      });
    } catch (err) {
      console.warn(`[WeeklyReport] ⚠️ Failed to create notification (non-fatal):`, err);
    }

    return reportId;
  } catch (error) {
    console.error(`[WeeklyReport] ❌ Failed:`, error);
    await sql`
      UPDATE reports SET status = 'failed', summary = ${error instanceof Error ? error.message : "Unknown error"}
      WHERE id = ${reportId}
    `;
    throw error;
  }
}

async function callOpenAI(
  dailyReports: DailyReportRow[],
  weekStart: string,
  weekEnd: string,
  totalEpisodes: number
): Promise<WeeklyReportContent> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const dailyJson = dailyReports.map((r, i) => ({
    day: i + 1,
    date: r.date,
    title: r.title,
    episodesIncluded: r.episodes_included,
    content: r.content_json,
  }));

  const userPrompt = WEEKLY_REPORT_USER_PROMPT
    .replace("{{WEEK_START}}", new Date(weekStart + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }))
    .replace("{{WEEK_END}}", new Date(weekEnd + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }))
    .replace("{{DAILY_COUNT}}", String(dailyReports.length))
    .replace("{{EPISODE_COUNT}}", String(totalEpisodes))
    .replace("{{DAILY_REPORTS_JSON}}", JSON.stringify(dailyJson, null, 2));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: WEEKLY_REPORT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as WeeklyReportContent;

  if (!parsed.executiveSummary || !Array.isArray(parsed.emergingThemes)) {
    throw new Error("AI response missing required fields");
  }

  if (!Array.isArray(parsed.narrativeArcs)) parsed.narrativeArcs = [];
  if (!Array.isArray(parsed.topInsights)) parsed.topInsights = [];
  if (!parsed.lookingAhead) parsed.lookingAhead = "";
  if (!parsed.sentiment) {
    parsed.sentiment = { overall: "mixed", evolution: "", weekStart: "", weekEnd: "" };
  }

  return parsed;
}
