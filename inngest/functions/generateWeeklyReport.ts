import { inngest } from "../client.js";
import { generateWeeklyReport } from "../../app/lib/reports/generate-weekly.js";

/**
 * Auto-generate weekly report every Monday at 6am UTC.
 * Covers the previous Monday–Sunday.
 */
export const generateWeeklyReportCron = inngest.createFunction(
  {
    id: "generate-weekly-report",
    name: "Generate Weekly Report (Cron)",
    retries: 2,
  },
  { cron: "0 6 * * 1" }, // Monday 6am UTC
  async ({ step }) => {
    const { weekStart, weekEnd, dateKey } = await step.run("calculate-week", async () => {
      const now = new Date();
      // Previous Monday
      const prevMonday = new Date(now);
      prevMonday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7) - 7);
      const prevSunday = new Date(prevMonday);
      prevSunday.setUTCDate(prevMonday.getUTCDate() + 6);

      const ws = prevMonday.toISOString().split("T")[0]!;
      const we = prevSunday.toISOString().split("T")[0]!;

      // ISO week number
      const jan4 = new Date(prevMonday.getUTCFullYear(), 0, 4);
      const daysSinceJan4 = Math.floor((prevMonday.getTime() - jan4.getTime()) / 86400000);
      const weekNum = Math.ceil((daysSinceJan4 + jan4.getUTCDay() + 1) / 7);
      const dk = `${prevMonday.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;

      console.log(`[WeeklyReportCron] Week: ${dk} (${ws} — ${we})`);
      return { weekStart: ws, weekEnd: we, dateKey: dk };
    });

    const reportId = await step.run("generate-report", async () => {
      return await generateWeeklyReport(weekStart, weekEnd, dateKey, "auto", "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no daily reports for this week" };
    }

    console.log(`[WeeklyReportCron] ✅ Report generated: ${reportId}`);
    return { success: true, dateKey, reportId };
  }
);

/**
 * Event-triggered manual weekly report generation.
 */
export const generateWeeklyReportManualFn = inngest.createFunction(
  {
    id: "generate-weekly-report-manual",
    name: "Generate Weekly Report (Manual)",
    retries: 1,
  },
  { event: "report/generate-weekly" },
  async ({ event, step }) => {
    const { weekStart, weekEnd, dateKey, userId } = event.data;

    console.log(`[WeeklyReportManual] Generating ${dateKey} by ${userId || "admin"}`);

    const reportId = await step.run("generate-report", async () => {
      return await generateWeeklyReport(weekStart, weekEnd, dateKey, "manual", userId || "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no daily reports" };
    }

    return { success: true, dateKey, reportId };
  }
);
