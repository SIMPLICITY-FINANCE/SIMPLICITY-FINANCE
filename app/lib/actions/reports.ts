"use server";

import postgres from "postgres";
import { inngest } from "../../../inngest/client.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

/**
 * Trigger manual daily report generation for a specific date.
 * Sends an Inngest event so the work happens in the background.
 */
export async function generateDailyReportManual(date: string) {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { success: false, error: "Invalid date format. Use YYYY-MM-DD." };
  }

  // Check if a report is already generating
  const [existing] = await sql`
    SELECT id, status FROM reports
    WHERE report_type = 'daily' AND date = ${date}
  `;

  if (existing?.status === "generating") {
    return { success: false, error: "A report is already being generated for this date." };
  }

  try {
    // Send Inngest event for background processing
    await inngest.send({
      name: "report/generate-daily",
      data: {
        date,
        userId: "system", // TODO: get from auth session
      },
    });

    console.log(`[ReportAction] Triggered daily report generation for ${date}`);
    return { success: true, message: `Report generation started for ${date}` };
  } catch (error) {
    console.error("[ReportAction] Failed to trigger generation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start generation",
    };
  }
}

/**
 * Get the status of a daily report for a specific date.
 */
export async function getDailyReportStatus(date: string) {
  const [report] = await sql`
    SELECT id, status, episodes_included, generated_at
    FROM reports
    WHERE report_type = 'daily' AND date = ${date}
  `;

  if (!report) {
    return { exists: false, status: null };
  }

  return {
    exists: true,
    id: report.id,
    status: report.status,
    episodesIncluded: report.episodes_included,
    generatedAt: report.generated_at,
  };
}

/**
 * Get list of dates that have daily reports.
 */
export async function getDailyReportDates(limit: number = 30) {
  const reports = await sql`
    SELECT date, status, episodes_included, id
    FROM reports
    WHERE report_type = 'daily'
    ORDER BY date DESC
    LIMIT ${limit}
  `;

  return reports.map(r => ({
    date: r.date,
    status: r.status,
    episodesIncluded: r.episodes_included,
    id: r.id,
  }));
}
