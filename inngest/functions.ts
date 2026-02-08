import { inngest } from "./client";
import { processEpisode, processEpisodeOnFailure } from "./functions/processEpisode";
import { ingestShowsScheduled, ingestShowManual } from "./functions/ingestShows";
import { generateDailyReportCron, generateDailyReportManual } from "./functions/generateDailyReport";

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
export const functions = [
  helloWorld,
  processEpisode,
  processEpisodeOnFailure,
  ingestShowsScheduled,
  ingestShowManual,
  generateDailyReportCron,
  generateDailyReportManual,
];
