import OpenAI from "openai";
import postgres from "postgres";
import { MONTHLY_REPORT_SYSTEM_PROMPT, MONTHLY_REPORT_USER_PROMPT } from "../../../prompts/monthly-synthesis-v1.js";
import type { MonthlyReportContent } from "./types.js";
import { createMonthlyReportNotification } from "../notifications/create.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface WeeklyReportRow {
  id: string;
  title: string;
  date: string;
  content_json: string | object | null;
  episodes_included: number;
}

/**
 * Generate a monthly report.
 *
 * @param year       - e.g. 2025
 * @param month      - 1-12
 * @param dateKey    - Canonical key like "2025-01"
 * @param generationType - "auto" | "manual"
 * @param generatedBy - "system" or user id
 * @returns The report ID, or null if skipped
 */
export async function generateMonthlyReport(
  year: number,
  month: number,
  dateKey: string,
  generationType: "auto" | "manual" = "auto",
  generatedBy: string = "system"
): Promise<string | null> {
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;
  // Last day of month
  const lastDay = new Date(new Date(nextMonth + "T00:00:00Z").getTime() - 86400000);
  const monthEnd = lastDay.toISOString().split("T")[0]!;

  console.log(`[MonthlyReport] Generating for ${dateKey} (${monthStart} — ${monthEnd})`);

  // Check existing
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'monthly' AND date = ${dateKey}
  `;

  if (existing && existing.status === "ready" && generationType === "auto") {
    console.log(`[MonthlyReport] Already exists: ${existing.id}`);
    return existing.id;
  }
  if (existing && generationType === "manual") {
    await sql`DELETE FROM reports WHERE id = ${existing.id}`;
  }

  // Fetch weekly reports from this month
  // Weekly report dates are like "2025-W06" — we need to match by period_start/period_end
  const weeklyReports = await sql<WeeklyReportRow[]>`
    SELECT id, title, date, content_json, episodes_included
    FROM reports
    WHERE report_type = 'weekly'
      AND status = 'ready'
      AND period_start >= ${monthStart + "T00:00:00Z"}
      AND period_end <= ${monthEnd + "T23:59:59Z"}
    ORDER BY period_start ASC
  `;

  // Also fetch daily reports as fallback if no weekly reports exist
  let sourceReports: WeeklyReportRow[];
  let sourceType: string;

  if (weeklyReports.length > 0) {
    sourceReports = weeklyReports;
    sourceType = "weekly";
  } else {
    // Fall back to daily reports
    const dailyReports = await sql<WeeklyReportRow[]>`
      SELECT id, title, date, content_json, episodes_included
      FROM reports
      WHERE report_type = 'daily'
        AND status = 'ready'
        AND date >= ${monthStart}
        AND date <= ${monthEnd}
      ORDER BY date ASC
    `;
    sourceReports = dailyReports;
    sourceType = "daily";
  }

  console.log(`[MonthlyReport] Found ${sourceReports.length} ${sourceType} reports for ${dateKey}`);

  if (sourceReports.length === 0) {
    console.log(`[MonthlyReport] Skipping — no source reports`);
    return null;
  }

  // Parse JSONB strings
  for (const r of sourceReports) {
    if (r.content_json && typeof r.content_json === "string") {
      r.content_json = JSON.parse(r.content_json);
    }
  }

  const totalEpisodes = sourceReports.reduce((sum, r) => sum + r.episodes_included, 0);
  const monthLabel = new Date(monthStart + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const reportTitle = `Monthly Report — ${monthLabel}`;

  const [report] = await sql`
    INSERT INTO reports (
      title, report_type, generation_type, date,
      period_start, period_end, status,
      episodes_included, generated_by
    ) VALUES (
      ${reportTitle}, 'monthly', ${generationType}, ${dateKey},
      ${monthStart + "T00:00:00Z"}, ${monthEnd + "T23:59:59Z"}, 'generating',
      ${totalEpisodes}, ${generatedBy}
    )
    RETURNING id
  `;

  if (!report) throw new Error("Failed to create monthly report row");
  const reportId = report.id;

  try {
    // Link source episodes
    const sourceIds = sourceReports.map((r) => r.id);
    await sql`
      INSERT INTO report_episodes (report_id, episode_id)
      SELECT ${reportId}, re.episode_id
      FROM report_episodes re
      WHERE re.report_id = ANY(${sourceIds})
      ON CONFLICT DO NOTHING
    `;

    const content = await callOpenAI(sourceReports, monthLabel, totalEpisodes, sourceType);

    for (const trend of content.durableTrends) {
      await sql`
        INSERT INTO report_themes (report_id, name, description, prominence)
        VALUES (${reportId}, ${trend.name}, ${trend.significance}, ${trend.trajectory === "rising" ? 0.8 : trend.trajectory === "stable" ? 0.5 : 0.3})
      `;
    }

    await sql`
      UPDATE reports
      SET status = 'ready',
          content_json = ${JSON.stringify(content)}::jsonb,
          summary = ${content.executiveSummary},
          generated_at = NOW()
      WHERE id = ${reportId}
    `;

    console.log(`[MonthlyReport] \u2705 Report ${reportId} ready \u2014 ${content.durableTrends.length} trends, ${content.topInsights.length} insights`);

    // Create notification
    try {
      await createMonthlyReportNotification({
        id: reportId,
        dateKey,
        year,
        month,
        episodes_included: totalEpisodes,
      });
    } catch (err) {
      console.warn(`[MonthlyReport] \u26a0\ufe0f Failed to create notification (non-fatal):`, err);
    }

    return reportId;
  } catch (error) {
    console.error(`[MonthlyReport] ❌ Failed:`, error);
    await sql`
      UPDATE reports SET status = 'failed', summary = ${error instanceof Error ? error.message : "Unknown error"}
      WHERE id = ${reportId}
    `;
    throw error;
  }
}

async function callOpenAI(
  sourceReports: WeeklyReportRow[],
  monthLabel: string,
  totalEpisodes: number,
  sourceType: string
): Promise<MonthlyReportContent> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const reportsJson = sourceReports.map((r, i) => ({
    index: i + 1,
    type: sourceType,
    date: r.date,
    title: r.title,
    episodesIncluded: r.episodes_included,
    content: r.content_json,
  }));

  const userPrompt = MONTHLY_REPORT_USER_PROMPT
    .replace("{{MONTH_LABEL}}", monthLabel)
    .replace("{{WEEKLY_COUNT}}", String(sourceReports.length))
    .replace("{{EPISODE_COUNT}}", String(totalEpisodes))
    .replace("{{WEEKLY_REPORTS_JSON}}", JSON.stringify(reportsJson, null, 2));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: MONTHLY_REPORT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as MonthlyReportContent;

  if (!parsed.executiveSummary || !Array.isArray(parsed.durableTrends)) {
    throw new Error("AI response missing required fields");
  }

  if (!Array.isArray(parsed.keyDebates)) parsed.keyDebates = [];
  if (!Array.isArray(parsed.topInsights)) parsed.topInsights = [];
  if (!parsed.lookingAhead) parsed.lookingAhead = "";
  if (!parsed.sentiment) {
    parsed.sentiment = { overall: "mixed", trajectory: "", weeklyProgression: [] };
  }

  return parsed;
}
