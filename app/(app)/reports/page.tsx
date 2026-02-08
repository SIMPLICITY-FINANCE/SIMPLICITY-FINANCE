import postgres from "postgres";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { FileText, TrendingUp, TrendingDown, Minus, BarChart3, Calendar, ArrowRight } from "lucide-react";
import type { DailyReportContent } from "../../lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

type ReportType = "daily" | "weekly" | "monthly" | "quarterly";

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

const TAB_CONFIG: Record<ReportType, { label: string; description: string; schedule: string; emptyMsg: string; linkPrefix: string }> = {
  daily: {
    label: "Daily",
    description: "AI-generated daily digests synthesizing insights from finance podcasts",
    schedule: "Every morning at 6am UTC",
    emptyMsg: "No daily reports yet. Reports are generated automatically each morning.",
    linkPrefix: "/reports/daily/",
  },
  weekly: {
    label: "Weekly",
    description: "Weekly synthesis connecting themes and tracking narrative evolution across the week",
    schedule: "Every Monday at 6am UTC",
    emptyMsg: "No weekly reports yet. First report will generate next Monday.",
    linkPrefix: "/reports/weekly/",
  },
  monthly: {
    label: "Monthly",
    description: "Monthly analysis separating durable trends from temporary noise",
    schedule: "1st of each month at 6am UTC",
    emptyMsg: "No monthly reports yet. First report will generate on the 1st of next month.",
    linkPrefix: "/reports/monthly/",
  },
  quarterly: {
    label: "Quarterly",
    description: "Strategic quarterly review with predictions and macro theme tracking",
    schedule: "First Monday of each quarter at 6am UTC",
    emptyMsg: "No quarterly reports yet. First report will generate at the start of next quarter.",
    linkPrefix: "/reports/quarterly/",
  },
};

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

function formatReportDate(date: string, reportType: string): string {
  if (reportType === "daily") {
    return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  // weekly: "2025-W06", monthly: "2025-01", quarterly: "2025-Q1"
  return date;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = (["daily", "weekly", "monthly", "quarterly"].includes(params.tab || "") ? params.tab : "daily") as ReportType;
  const config = TAB_CONFIG[activeTab];

  const reports = await sql<ReportRow[]>`
    SELECT
      id, title, report_type, date, status,
      content_json, summary, episodes_included,
      generation_type, generated_at, created_at
    FROM reports
    WHERE report_type = ${activeTab}
      AND status IN ('ready', 'generating')
    ORDER BY date DESC
    LIMIT 30
  `;

  // postgres driver returns JSONB as a string — parse it
  for (const r of reports) {
    if (r.content_json && typeof r.content_json === "string") {
      r.content_json = JSON.parse(r.content_json as unknown as string);
    }
  }

  const latestReport = reports[0] || null;
  const olderReports = reports.slice(1);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Reports</h2>
        <p className="text-sm text-muted-foreground">
          AI-generated digests synthesizing insights from finance podcasts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
        {(Object.keys(TAB_CONFIG) as ReportType[]).map((tab) => (
          <a
            key={tab}
            href={`/reports?tab=${tab}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_CONFIG[tab].label}
          </a>
        ))}
      </div>

      {/* Tab description */}
      <div className="bg-accent/50 border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong className="font-semibold">{config.description}</strong>
          <span className="text-muted-foreground"> · {config.schedule}</span>
        </p>
      </div>

      {/* Latest Report Hero */}
      {latestReport && latestReport.status === "ready" ? (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Latest {config.label} Report</h3>
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <a href={`${config.linkPrefix}${latestReport.date}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {latestReport.title}
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatReportDate(latestReport.date, activeTab)}
                  </span>
                  <span>•</span>
                  <span>{latestReport.episodes_included} episodes</span>
                  {latestReport.content_json?.sentiment && "overall" in latestReport.content_json.sentiment && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <SentimentIcon sentiment={(latestReport.content_json.sentiment as { overall: string }).overall} />
                        {((latestReport.content_json.sentiment as { overall: string }).overall).charAt(0).toUpperCase() + ((latestReport.content_json.sentiment as { overall: string }).overall).slice(1)}
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

            {/* Theme chips — daily reports have themes[], weekly have emergingThemes[] */}
            {latestReport.content_json && "themes" in latestReport.content_json && latestReport.content_json.themes?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {latestReport.content_json.themes.map((theme, i) => (
                  <Chip key={i}>{theme.name}</Chip>
                ))}
              </div>
            )}

            <a
              href={`${config.linkPrefix}${latestReport.date}`}
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
          <p className="text-muted-foreground text-lg mb-2">{config.emptyMsg}</p>
        </Card>
      ) : null}

      {/* Recent Reports */}
      {olderReports.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent {config.label} Reports</h3>
          <div className="space-y-3">
            {olderReports.map((report) => (
              <Card key={report.id} variant="compact" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={`${config.linkPrefix}${report.date}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {report.title}
                      </a>
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatReportDate(report.date, activeTab)}</span>
                      <span>•</span>
                      <span>{report.episodes_included} episodes</span>
                      {report.content_json?.sentiment && "overall" in report.content_json.sentiment && (
                        <>
                          <span>•</span>
                          <SentimentIcon sentiment={(report.content_json.sentiment as { overall: string }).overall} />
                        </>
                      )}
                    </div>
                  </div>
                  <a
                    href={`${config.linkPrefix}${report.date}`}
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
