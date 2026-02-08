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
 * Trigger manual weekly report generation for a specific week.
 */
export async function generateWeeklyReportManual(weekStart: string, weekEnd: string, dateKey: string) {
  if (!/^\d{4}-W\d{2}$/.test(dateKey)) {
    return { success: false, error: "Invalid week format. Use YYYY-WNN." };
  }

  const [existing] = await sql`
    SELECT id, status FROM reports WHERE report_type = 'weekly' AND date = ${dateKey}
  `;
  if (existing?.status === "generating") {
    return { success: false, error: "A weekly report is already being generated for this week." };
  }

  try {
    await inngest.send({
      name: "report/generate-weekly",
      data: { weekStart, weekEnd, dateKey, userId: "system" },
    });
    console.log(`[ReportAction] Triggered weekly report generation for ${dateKey}`);
    return { success: true, message: `Weekly report generation started for ${dateKey}` };
  } catch (error) {
    console.error("[ReportAction] Failed to trigger weekly generation:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to start generation" };
  }
}

/**
 * Trigger manual monthly report generation for a specific month.
 */
export async function generateMonthlyReportManual(year: number, month: number, dateKey: string) {
  if (!/^\d{4}-\d{2}$/.test(dateKey)) {
    return { success: false, error: "Invalid month format. Use YYYY-MM." };
  }

  const [existing] = await sql`
    SELECT id, status FROM reports WHERE report_type = 'monthly' AND date = ${dateKey}
  `;
  if (existing?.status === "generating") {
    return { success: false, error: "A monthly report is already being generated for this month." };
  }

  try {
    await inngest.send({
      name: "report/generate-monthly",
      data: { year, month, dateKey, userId: "system" },
    });
    console.log(`[ReportAction] Triggered monthly report generation for ${dateKey}`);
    return { success: true, message: `Monthly report generation started for ${dateKey}` };
  } catch (error) {
    console.error("[ReportAction] Failed to trigger monthly generation:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to start generation" };
  }
}

/**
 * Trigger manual quarterly report generation for a specific quarter.
 */
export async function generateQuarterlyReportManual(year: number, quarter: number, dateKey: string) {
  if (!/^\d{4}-Q[1-4]$/.test(dateKey)) {
    return { success: false, error: "Invalid quarter format. Use YYYY-QN." };
  }

  const [existing] = await sql`
    SELECT id, status FROM reports WHERE report_type = 'quarterly' AND date = ${dateKey}
  `;
  if (existing?.status === "generating") {
    return { success: false, error: "A quarterly report is already being generated for this quarter." };
  }

  try {
    await inngest.send({
      name: "report/generate-quarterly",
      data: { year, quarter, dateKey, userId: "system" },
    });
    console.log(`[ReportAction] Triggered quarterly report generation for ${dateKey}`);
    return { success: true, message: `Quarterly report generation started for ${dateKey}` };
  } catch (error) {
    console.error("[ReportAction] Failed to trigger quarterly generation:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to start generation" };
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
