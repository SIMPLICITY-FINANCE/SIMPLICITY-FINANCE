import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

export async function createEpisodeNotification(episode: {
  id: string;
  title: string;
  show_name: string;
  published_at?: string | Date | null;
  thumbnail_url?: string | null;
}) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let dateStr = "";
  if (episode.published_at) {
    const d = new Date(episode.published_at);
    dateStr = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  }

  const message = `${episode.show_name}${dateStr ? ` \u2022 ${dateStr}` : ""}`;

  await sql`
    INSERT INTO notifications (user_id, type, title, message, link, icon_type, metadata)
    VALUES (
      'default',
      'episode_ready',
      ${episode.title},
      ${message},
      ${`/episode/${episode.id}`},
      'episode',
      ${JSON.stringify({
        episode_id: episode.id,
        show_name: episode.show_name,
        thumbnail_url: episode.thumbnail_url ?? null,
      })}::jsonb
    )
  `;

  console.log(`[NOTIFICATION] Created for episode: ${episode.title}`);
}

export async function createDailyReportNotification(report: {
  id: string;
  date: string;
  episodes_included: number;
}) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(report.date + "T12:00:00Z");
  const dateStr = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

  await sql`
    INSERT INTO notifications (user_id, type, title, message, link, icon_type, metadata)
    VALUES (
      'default',
      'daily_report_ready',
      'Daily Report',
      ${`${report.episodes_included} summaries \u2022 ${dateStr}`},
      ${`/reports/daily/${report.date}`},
      'report',
      ${JSON.stringify({
        report_id: report.id,
        report_type: "daily",
        date: report.date,
        episodes_count: report.episodes_included,
      })}::jsonb
    )
  `;

  console.log(`[NOTIFICATION] Created for daily report: ${report.date}`);
}

export async function createWeeklyReportNotification(report: {
  id: string;
  dateKey: string;
  episodes_included: number;
}) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, link, icon_type, metadata)
    VALUES (
      'default',
      'weekly_report_ready',
      'Weekly Report',
      ${`${report.episodes_included} summaries \u2022 ${report.dateKey}`},
      ${`/reports/weekly/${report.dateKey}`},
      'report',
      ${JSON.stringify({
        report_id: report.id,
        report_type: "weekly",
        date_key: report.dateKey,
      })}::jsonb
    )
  `;

  console.log(`[NOTIFICATION] Created for weekly report: ${report.dateKey}`);
}

export async function createMonthlyReportNotification(report: {
  id: string;
  dateKey: string;
  year: number;
  month: number;
  episodes_included: number;
}) {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthName = `${monthNames[report.month - 1]} ${report.year}`;

  await sql`
    INSERT INTO notifications (user_id, type, title, message, link, icon_type, metadata)
    VALUES (
      'default',
      'monthly_report_ready',
      ${`Monthly Report \u2014 ${monthName}`},
      ${`${report.episodes_included} summaries`},
      ${`/reports/monthly/${report.dateKey}`},
      'report',
      ${JSON.stringify({
        report_id: report.id,
        report_type: "monthly",
        date_key: report.dateKey,
      })}::jsonb
    )
  `;

  console.log(`[NOTIFICATION] Created for monthly report: ${report.dateKey}`);
}

export async function createQuarterlyReportNotification(report: {
  id: string;
  dateKey: string;
  year: number;
  quarter: number;
  episodes_included: number;
}) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, link, icon_type, metadata)
    VALUES (
      'default',
      'quarterly_report_ready',
      ${`Quarterly Report \u2014 Q${report.quarter} ${report.year}`},
      ${`${report.episodes_included} summaries`},
      ${`/reports/quarterly/${report.dateKey}`},
      'report',
      ${JSON.stringify({
        report_id: report.id,
        report_type: "quarterly",
        date_key: report.dateKey,
      })}::jsonb
    )
  `;

  console.log(`[NOTIFICATION] Created for quarterly report: ${report.dateKey}`);
}
