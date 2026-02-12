import { inngest } from "./client";
import { processEpisode, processEpisodeOnFailure } from "./functions/processEpisode";
import { ingestShowsScheduled, ingestShowManual } from "./functions/ingestShows";
import { generateDailyReportCron, generateDailyReportManual } from "./functions/generateDailyReport";
import { generateWeeklyReportCron, generateWeeklyReportManualFn } from "./functions/generateWeeklyReport";
import { generateMonthlyReportCron, generateMonthlyReportManualFn } from "./functions/generateMonthlyReport";
import { generateQuarterlyReportCron, generateQuarterlyReportManualFn } from "./functions/generateQuarterlyReport";

// Export all functions as an array
export const functions: ReturnType<typeof inngest.createFunction>[] = [
  processEpisode,
  processEpisodeOnFailure,
  ingestShowsScheduled,
  ingestShowManual,
  generateDailyReportCron,
  generateDailyReportManual,
  generateWeeklyReportCron,
  generateWeeklyReportManualFn,
  generateMonthlyReportCron,
  generateMonthlyReportManualFn,
  generateQuarterlyReportCron,
  generateQuarterlyReportManualFn,
];
