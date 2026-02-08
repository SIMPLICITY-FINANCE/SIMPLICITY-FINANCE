import { inngest } from "../client.js";
import { generateDailyReport } from "../../app/lib/reports/generate-daily.js";

/**
 * Auto-generate daily report at 6am UTC every day.
 * Covers yesterday's published episodes.
 */
export const generateDailyReportCron = inngest.createFunction(
  {
    id: "generate-daily-report",
    name: "Generate Daily Report (Cron)",
    retries: 2,
  },
  { cron: "0 6 * * *" }, // 6am UTC daily
  async ({ step }) => {
    // Calculate yesterday's date in UTC
    const yesterday = await step.run("calculate-date", async () => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - 1);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      console.log(`[DailyReportCron] Target date: ${dateStr}`);
      return dateStr;
    });

    // Generate the report
    const reportId = await step.run("generate-report", async () => {
      return await generateDailyReport(yesterday, "auto", "system");
    });

    if (!reportId) {
      console.log(`[DailyReportCron] Skipped — insufficient episodes for ${yesterday}`);
      return { skipped: true, date: yesterday, reason: "fewer than 2 episodes" };
    }

    console.log(`[DailyReportCron] ✅ Report generated: ${reportId}`);
    return { success: true, date: yesterday, reportId };
  }
);

/**
 * Event-triggered manual generation (from admin UI).
 */
export const generateDailyReportManual = inngest.createFunction(
  {
    id: "generate-daily-report-manual",
    name: "Generate Daily Report (Manual)",
    retries: 1,
  },
  { event: "report/generate-daily" },
  async ({ event, step }) => {
    const { date, userId } = event.data;

    console.log(`[DailyReportManual] Generating for ${date} by ${userId || "admin"}`);

    const reportId = await step.run("generate-report", async () => {
      return await generateDailyReport(date, "manual", userId || "system");
    });

    if (!reportId) {
      return { skipped: true, date, reason: "fewer than 2 episodes" };
    }

    console.log(`[DailyReportManual] ✅ Report generated: ${reportId}`);
    return { success: true, date, reportId };
  }
);
