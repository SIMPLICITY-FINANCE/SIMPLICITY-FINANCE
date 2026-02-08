import OpenAI from "openai";
import postgres from "postgres";
import { WEEKLY_REPORT_SYSTEM_PROMPT, WEEKLY_REPORT_USER_PROMPT } from "../../../prompts/weekly-synthesis-v1.js";
import type { WeeklyReportContent } from "./types.js";
import { createWeeklyReportNotification } from "../notifications/create.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface DailyReportRow {
  id: string;
  title: string;
  date: string;
  content_json: string | object | null;
  episodes_included: number;
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

  if (dailyReports.length === 0) {
    console.log(`[WeeklyReport] Skipping — no daily reports`);
    return null;
  }

  // Parse JSONB strings
  for (const r of dailyReports) {
    if (r.content_json && typeof r.content_json === "string") {
      r.content_json = JSON.parse(r.content_json);
    }
  }

  const totalEpisodes = dailyReports.reduce((sum, r) => sum + r.episodes_included, 0);

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
    // Link source episodes from all daily reports
    const dailyReportIds = dailyReports.map((r) => r.id);
    await sql`
      INSERT INTO report_episodes (report_id, episode_id)
      SELECT ${reportId}, re.episode_id
      FROM report_episodes re
      WHERE re.report_id = ANY(${dailyReportIds})
      ON CONFLICT DO NOTHING
    `;

    // Call OpenAI
    const content = await callOpenAI(dailyReports, weekStart, weekEnd, totalEpisodes);

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
