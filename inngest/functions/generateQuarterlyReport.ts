import { inngest } from "../client.js";
import { generateQuarterlyReport } from "../../app/lib/reports/generate-quarterly.js";

/**
 * Auto-generate quarterly report on the first Monday of each quarter at 6am UTC.
 * Quarters: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec).
 * Runs every Monday but only generates if it's the first Monday of a new quarter.
 */
export const generateQuarterlyReportCron = inngest.createFunction(
  {
    id: "generate-quarterly-report",
    name: "Generate Quarterly Report (Cron)",
    retries: 2,
  },
  { cron: "0 6 * * 1" }, // Every Monday 6am UTC — checks if it's first Monday of quarter
  async ({ step }) => {
    const result = await step.run("check-quarter", async (): Promise<{
      skip: boolean;
      reason?: string;
      year?: number;
      quarter?: number;
      dateKey?: string;
    }> => {
      const now = new Date();
      const month = now.getUTCMonth(); // 0-indexed
      const day = now.getUTCDate();

      // Only run in the first 7 days of Jan, Apr, Jul, Oct
      const quarterStartMonths = [0, 3, 6, 9];
      if (!quarterStartMonths.includes(month) || day > 7) {
        return { skip: true, reason: "Not first Monday of a quarter" };
      }

      // Previous quarter
      let prevQuarter: number;
      let prevYear = now.getUTCFullYear();
      if (month === 0) {
        prevQuarter = 4;
        prevYear -= 1;
      } else {
        prevQuarter = Math.floor(month / 3); // month 3 → Q1, month 6 → Q2, etc.
      }

      const dateKey = `${prevYear}-Q${prevQuarter}`;
      console.log(`[QuarterlyReportCron] Quarter: ${dateKey}`);
      return { skip: false, year: prevYear, quarter: prevQuarter, dateKey };
    });

    if (result.skip || !result.year || !result.quarter || !result.dateKey) {
      return { skipped: true, reason: result.reason || "Not first Monday of a quarter" };
    }

    const { year, quarter, dateKey } = result;

    const reportId = await step.run("generate-report", async () => {
      return await generateQuarterlyReport(year, quarter, dateKey, "auto", "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no source reports for this quarter" };
    }

    console.log(`[QuarterlyReportCron] ✅ Report generated: ${reportId}`);
    return { success: true, dateKey, reportId };
  }
);

/**
 * Event-triggered manual quarterly report generation.
 */
export const generateQuarterlyReportManualFn = inngest.createFunction(
  {
    id: "generate-quarterly-report-manual",
    name: "Generate Quarterly Report (Manual)",
    retries: 1,
  },
  { event: "report/generate-quarterly" },
  async ({ event, step }) => {
    const { year, quarter, dateKey, userId } = event.data;

    console.log(`[QuarterlyReportManual] Generating ${dateKey} by ${userId || "admin"}`);

    const reportId = await step.run("generate-report", async () => {
      return await generateQuarterlyReport(year, quarter, dateKey, "manual", userId || "system");
    });

    if (!reportId) {
      return { skipped: true, dateKey, reason: "no source reports" };
    }

    return { success: true, dateKey, reportId };
  }
);
