import { inngest } from "./client";
import { processEpisode, processEpisodeOnFailure } from "./functions/processEpisode";
import { ingestShowsScheduled, ingestShowManual } from "./functions/ingestShows";
import { generateDailyReportCron, generateDailyReportManual } from "./functions/generateDailyReport";
import { generateWeeklyReportCron, generateWeeklyReportManualFn } from "./functions/generateWeeklyReport";
import { generateMonthlyReportCron, generateMonthlyReportManualFn } from "./functions/generateMonthlyReport";
import { generateQuarterlyReportCron, generateQuarterlyReportManualFn } from "./functions/generateQuarterlyReport";

// Stub function to verify Inngest is working
export const helloWorld = inngest.createFunction(
  { id: "hello-world", name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.run("say-hello", async () => {
      console.log("Hello from Inngest!", event.data);
      return { message: "Hello World!", data: event.data };
    });

    return { success: true };
  }
);

// Export all functions as an array
export const functions: ReturnType<typeof inngest.createFunction>[] = [
  helloWorld,
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
