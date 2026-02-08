import OpenAI from "openai";
import postgres from "postgres";
import { QUARTERLY_REPORT_SYSTEM_PROMPT, QUARTERLY_REPORT_USER_PROMPT } from "../../../prompts/quarterly-synthesis-v1.js";
import type { QuarterlyReportContent } from "./types.js";
import { createQuarterlyReportNotification } from "../notifications/create.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface MonthlyReportRow {
  id: string;
  title: string;
  date: string;
  content_json: string | object | null;
  episodes_included: number;
}

/**
 * Generate a quarterly report.
 *
 * @param year       - e.g. 2025
 * @param quarter    - 1-4
 * @param dateKey    - Canonical key like "2025-Q1"
 * @param generationType - "auto" | "manual"
 * @param generatedBy - "system" or user id
 * @returns The report ID, or null if skipped
 */
export async function generateQuarterlyReport(
  year: number,
  quarter: number,
  dateKey: string,
  generationType: "auto" | "manual" = "auto",
  generatedBy: string = "system"
): Promise<string | null> {
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = startMonth + 2;
  const quarterStart = `${year}-${String(startMonth).padStart(2, "0")}-01`;
  // Last day of the quarter's last month
  const nextQuarterStart = endMonth === 12
    ? `${year + 1}-01-01`
    : `${year}-${String(endMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(new Date(nextQuarterStart + "T00:00:00Z").getTime() - 86400000);
  const quarterEnd = lastDay.toISOString().split("T")[0]!;

  console.log(`[QuarterlyReport] Generating for ${dateKey} (${quarterStart} — ${quarterEnd})`);

  // Check existing
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'quarterly' AND date = ${dateKey}
  `;

  if (existing && existing.status === "ready" && generationType === "auto") {
    console.log(`[QuarterlyReport] Already exists: ${existing.id}`);
    return existing.id;
  }
  if (existing && generationType === "manual") {
    await sql`DELETE FROM reports WHERE id = ${existing.id}`;
  }

  // Fetch monthly reports from this quarter
  const monthKeys = [
    `${year}-${String(startMonth).padStart(2, "0")}`,
    `${year}-${String(startMonth + 1).padStart(2, "0")}`,
    `${year}-${String(endMonth).padStart(2, "0")}`,
  ];

  const monthlyReports = await sql<MonthlyReportRow[]>`
    SELECT id, title, date, content_json, episodes_included
    FROM reports
    WHERE report_type = 'monthly'
      AND status = 'ready'
      AND date = ANY(${monthKeys})
    ORDER BY date ASC
  `;

  // Fall back to weekly or daily reports if no monthly reports exist
  let sourceReports: MonthlyReportRow[];
  let sourceType: string;

  if (monthlyReports.length > 0) {
    sourceReports = monthlyReports;
    sourceType = "monthly";
  } else {
    // Try weekly
    const weeklyReports = await sql<MonthlyReportRow[]>`
      SELECT id, title, date, content_json, episodes_included
      FROM reports
      WHERE report_type = 'weekly'
        AND status = 'ready'
        AND period_start >= ${quarterStart + "T00:00:00Z"}
        AND period_end <= ${quarterEnd + "T23:59:59Z"}
      ORDER BY period_start ASC
    `;

    if (weeklyReports.length > 0) {
      sourceReports = weeklyReports;
      sourceType = "weekly";
    } else {
      // Fall back to daily
      const dailyReports = await sql<MonthlyReportRow[]>`
        SELECT id, title, date, content_json, episodes_included
        FROM reports
        WHERE report_type = 'daily'
          AND status = 'ready'
          AND date >= ${quarterStart}
          AND date <= ${quarterEnd}
        ORDER BY date ASC
      `;
      sourceReports = dailyReports;
      sourceType = "daily";
    }
  }

  console.log(`[QuarterlyReport] Found ${sourceReports.length} ${sourceType} reports for ${dateKey}`);

  if (sourceReports.length === 0) {
    console.log(`[QuarterlyReport] Skipping — no source reports`);
    return null;
  }

  // Parse JSONB strings
  for (const r of sourceReports) {
    if (r.content_json && typeof r.content_json === "string") {
      r.content_json = JSON.parse(r.content_json);
    }
  }

  const totalEpisodes = sourceReports.reduce((sum, r) => sum + r.episodes_included, 0);
  const quarterLabel = `Q${quarter} ${year}`;
  const reportTitle = `Quarterly Report — ${quarterLabel}`;

  const [report] = await sql`
    INSERT INTO reports (
      title, report_type, generation_type, date,
      period_start, period_end, status,
      episodes_included, generated_by
    ) VALUES (
      ${reportTitle}, 'quarterly', ${generationType}, ${dateKey},
      ${quarterStart + "T00:00:00Z"}, ${quarterEnd + "T23:59:59Z"}, 'generating',
      ${totalEpisodes}, ${generatedBy}
    )
    RETURNING id
  `;

  if (!report) throw new Error("Failed to create quarterly report row");
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

    const content = await callOpenAI(sourceReports, quarterLabel, totalEpisodes, sourceType);

    for (const theme of content.majorThemes) {
      await sql`
        INSERT INTO report_themes (report_id, name, description, prominence)
        VALUES (${reportId}, ${theme.name}, ${theme.significance}, ${theme.overallTrajectory === "rising" ? 0.8 : theme.overallTrajectory === "stable" ? 0.5 : 0.3})
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

    console.log(`[QuarterlyReport] ✅ Report ${reportId} ready — ${content.majorThemes.length} themes, ${content.predictions.length} predictions`);

    // Create notification
    try {
      await createQuarterlyReportNotification({
        id: reportId,
        dateKey,
        year,
        quarter,
        episodes_included: totalEpisodes,
      });
    } catch (err) {
      console.warn(`[QuarterlyReport] ⚠️ Failed to create notification (non-fatal):`, err);
    }

    return reportId;
  } catch (error) {
    console.error(`[QuarterlyReport] ❌ Failed:`, error);
    await sql`
      UPDATE reports SET status = 'failed', summary = ${error instanceof Error ? error.message : "Unknown error"}
      WHERE id = ${reportId}
    `;
    throw error;
  }
}

async function callOpenAI(
  sourceReports: MonthlyReportRow[],
  quarterLabel: string,
  totalEpisodes: number,
  sourceType: string
): Promise<QuarterlyReportContent> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const reportsJson = sourceReports.map((r, i) => ({
    index: i + 1,
    type: sourceType,
    date: r.date,
    title: r.title,
    episodesIncluded: r.episodes_included,
    content: r.content_json,
  }));

  const userPrompt = QUARTERLY_REPORT_USER_PROMPT
    .replace("{{QUARTER_LABEL}}", quarterLabel)
    .replace("{{MONTHLY_COUNT}}", String(sourceReports.length))
    .replace("{{EPISODE_COUNT}}", String(totalEpisodes))
    .replace("{{MONTHLY_REPORTS_JSON}}", JSON.stringify(reportsJson, null, 2));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: QUARTERLY_REPORT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as QuarterlyReportContent;

  if (!parsed.executiveSummary || !Array.isArray(parsed.majorThemes)) {
    throw new Error("AI response missing required fields");
  }

  if (!Array.isArray(parsed.predictions)) parsed.predictions = [];
  if (!Array.isArray(parsed.topInsights)) parsed.topInsights = [];
  if (!parsed.lookingAhead) parsed.lookingAhead = "";
  if (!parsed.sentiment) {
    parsed.sentiment = { overall: "mixed", quarterNarrative: "", monthlyProgression: [] };
  }

  return parsed;
}
