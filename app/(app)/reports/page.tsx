import postgres from "postgres";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { FileText, TrendingUp, TrendingDown, Minus, BarChart3, Calendar, ArrowRight } from "lucide-react";
import type { DailyReportContent } from "../../lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface ReportRow {
  id: string;
  title: string;
  report_type: string;
  date: string;
  status: string;
  content_json: DailyReportContent | null;
  summary: string;
  episodes_included: number;
  generation_type: string;
  generated_at: string | null;
  created_at: string;
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  switch (sentiment) {
    case "bullish": return <TrendingUp size={14} className="text-green-600" />;
    case "bearish": return <TrendingDown size={14} className="text-red-600" />;
    case "mixed": return <BarChart3 size={14} className="text-amber-600" />;
    default: return <Minus size={14} className="text-gray-500" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ready: "bg-green-100 text-green-800",
    generating: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${styles[status] || styles.ready}`}>
      {status === "generating" ? "Generating..." : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function ReportsPage() {
  // Fetch all daily reports (ready or generating)
  const reports = await sql<ReportRow[]>`
    SELECT 
      id, title, report_type, date, status,
      content_json, summary, episodes_included,
      generation_type, generated_at, created_at
    FROM reports
    WHERE report_type = 'daily'
      AND status IN ('ready', 'generating')
    ORDER BY date DESC
    LIMIT 30
  `;

  // postgres driver returns JSONB as a string — parse it
  for (const r of reports) {
    if (r.content_json && typeof r.content_json === 'string') {
      r.content_json = JSON.parse(r.content_json as unknown as string);
    }
  }

  const latestReport = reports[0] || null;
  const olderReports = reports.slice(1);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Daily Reports</h2>
        <p className="text-sm text-muted-foreground">
          AI-generated daily digests synthesizing insights from finance podcasts
        </p>
      </div>

      <div className="bg-accent/50 border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong className="font-semibold">How it works:</strong> Every morning at 6am UTC, 
          we analyze yesterday's published episodes and generate a report with key insights, 
          recurring themes, and market sentiment analysis.
        </p>
      </div>

      {/* Latest Report Hero */}
      {latestReport && latestReport.status === "ready" ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Latest Report</h3>
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <a href={`/reports/daily/${latestReport.date}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {latestReport.title}
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(latestReport.date + "T12:00:00Z").toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>{latestReport.episodes_included} episodes</span>
                  {latestReport.content_json?.sentiment?.overall && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <SentimentIcon sentiment={latestReport.content_json.sentiment.overall} />
                        {latestReport.content_json.sentiment.overall.charAt(0).toUpperCase() + latestReport.content_json.sentiment.overall.slice(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {latestReport.content_json?.executiveSummary && (
              <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-3">
                {latestReport.content_json.executiveSummary}
              </p>
            )}

            {/* Theme chips */}
            {latestReport.content_json?.themes && latestReport.content_json.themes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {latestReport.content_json.themes.map((theme, i) => (
                  <Chip key={i}>{theme.name}</Chip>
                ))}
              </div>
            )}

            <a
              href={`/reports/daily/${latestReport.date}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Read Full Report
              <ArrowRight size={16} />
            </a>
          </Card>
        </div>
      ) : !latestReport ? (
        <Card className="p-12 text-center mb-8">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No daily reports yet</p>
          <p className="text-muted-foreground/70 text-sm">
            Reports are generated automatically each morning, or manually from the admin panel.
          </p>
        </Card>
      ) : null}

      {/* Recent Reports */}
      {olderReports.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Reports</h3>
          <div className="space-y-3">
            {olderReports.map((report) => (
              <Card key={report.id} variant="compact" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={`/reports/daily/${report.date}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {report.title}
                      </a>
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(report.date + "T12:00:00Z").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{report.episodes_included} episodes</span>
                      {report.content_json?.sentiment?.overall && (
                        <>
                          <span>•</span>
                          <SentimentIcon sentiment={report.content_json.sentiment.overall} />
                        </>
                      )}
                      {report.content_json?.insights && (
                        <>
                          <span>•</span>
                          <span>{report.content_json.insights.length} insights</span>
                        </>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/reports/daily/${report.date}`}
                    className="text-sm text-primary hover:underline ml-4 shrink-0"
                  >
                    View →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
