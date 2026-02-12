import { inngest } from "../client.js";
import { generateDailyReport } from "../../app/lib/reports/generate-daily.js";
import { sql } from "../../app/lib/db.js";

/**
 * Backfill daily reports for all dates that have ≥2 published episodes
 * but no existing daily report. Triggered manually from admin UI.
 */
export const backfillDailyReports = inngest.createFunction(
  {
    id: "backfill-daily-reports",
    name: "Backfill Daily Reports",
    retries: 0,
  },
  { event: "report/backfill-daily" },
  async ({ step }) => {
    // 1. Find all dates with ≥2 published episodes but no daily report
    const missingDates = await step.run("find-missing-dates", async () => {
      const rows = await sql`
        SELECT ep_dates.date
        FROM (
          SELECT published_at::date as date, COUNT(*)::int as cnt
          FROM episodes e
          JOIN episode_summary s ON s.episode_id = e.id
          WHERE e.is_published = true
            AND e.published_at IS NOT NULL
          GROUP BY published_at::date
          HAVING COUNT(*) >= 2
        ) ep_dates
        LEFT JOIN reports r
          ON r.report_type = 'daily'
          AND r.date = ep_dates.date::text
          AND r.status = 'ready'
        WHERE r.id IS NULL
        ORDER BY ep_dates.date ASC
      `;

      const dates = rows.map((r) => {
        const d = new Date(String(r.date));
        return d.toISOString().split("T")[0]!;
      });

      console.log(`[Backfill] Found ${dates.length} dates missing daily reports: ${dates.join(", ")}`);
      return dates;
    });

    if (missingDates.length === 0) {
      console.log(`[Backfill] No missing dates — nothing to do`);
      return { datesProcessed: 0, dates: [] };
    }

    // 2. Generate a daily report for each missing date sequentially
    const results: { date: string; reportId: string | null; skipped: boolean }[] = [];

    for (const date of missingDates) {
      const result = await step.run(`generate-daily-${date}`, async () => {
        console.log(`[Backfill] Generating daily report for ${date}`);
        try {
          const reportId = await generateDailyReport(date, "manual", "backfill");
          if (reportId) {
            console.log(`[Backfill] ✅ Daily report for ${date}: ${reportId}`);
            return { date, reportId, skipped: false };
          } else {
            console.log(`[Backfill] Skipped ${date} (< 2 episodes)`);
            return { date, reportId: null, skipped: true };
          }
        } catch (error) {
          console.error(`[Backfill] ❌ Failed for ${date}:`, error);
          return { date, reportId: null, skipped: true };
        }
      });

      results.push(result);
    }

    const generated = results.filter(r => r.reportId).length;
    const skipped = results.filter(r => r.skipped).length;

    console.log(`[Backfill] Done — ${generated} generated, ${skipped} skipped`);
    return { datesProcessed: missingDates.length, generated, skipped, results };
  }
);
