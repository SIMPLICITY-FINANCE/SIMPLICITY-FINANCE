import { inngest } from "../client.js";
import { generateMonthlyReport } from "../../app/lib/reports/generate-monthly.js";

/**
 * Auto-generate monthly report on the 1st of each month at 6am UTC.
 * Covers the previous month.
 */
export const generateMonthlyReportCron = inngest.createFunction(
  {
    id: "generate-monthly-report",
    name: "Generate Monthly Report (Cron)",
    retries: 2,
  },
  { cron: "0 6 1 * *" }, // 1st of month, 6am UTC
  async ({ step }) => {
    const { year, month, dateKey } = await step.run("calculate-month", async () => {
      const now = new Date();
      // Previous month
      let m = now.getUTCMonth(); // 0-indexed, so this is already "previous" if we're on the 1st
      let y = now.getUTCFullYear();
      if (m === 0) {
        m = 12;
        y -= 1;
      }
      const dk = `${y}-${String(m).padStart(2, "0")}`;
      console.log(`[MonthlyReportCron] Month: ${dk}`);
      return { year: y, month: m, dateKey: dk };
    });

    const reportId = await step.run("generate-report", async () => {
      return await generateMonthlyReport(year, month, dateKey, "auto", "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no source reports for this month" };
    }

    console.log(`[MonthlyReportCron] ✅ Report generated: ${reportId}`);
    return { success: true, dateKey, reportId };
  }
);

/**
 * Event-triggered manual monthly report generation.
 */
export const generateMonthlyReportManualFn = inngest.createFunction(
  {
    id: "generate-monthly-report-manual",
    name: "Generate Monthly Report (Manual)",
    retries: 1,
  },
  { event: "report/generate-monthly" },
  async ({ event, step }) => {
    const { year, month, dateKey, userId } = event.data;

    console.log(`[MonthlyReportManual] Generating ${dateKey} by ${userId || "admin"}`);

    const reportId = await step.run("generate-report", async () => {
      return await generateMonthlyReport(year, month, dateKey, "manual", userId || "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no source reports" };
    }

    return { success: true, dateKey, reportId };
  }
);
