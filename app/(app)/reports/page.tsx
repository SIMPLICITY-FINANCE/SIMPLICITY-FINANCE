import postgres from "postgres";
import { Card } from "../../components/ui/Card.js";
import { FileText, Bookmark, ExternalLink } from "lucide-react";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface Report {
  id: string;
  title: string;
  report_type: string;
  period_start: string;
  period_end: string;
  summary: string;
  created_at: Date;
  item_count: number;
}

export default async function ReportsPage() {
  const approvedReports = await sql<Report[]>`
    SELECT 
      r.id,
      r.title,
      r.report_type,
      r.period_start,
      r.period_end,
      r.summary,
      r.created_at,
      (SELECT COUNT(*) FROM report_items WHERE report_id = r.id) as item_count
    FROM reports r
    WHERE r.approval_status = 'approved'
    ORDER BY r.period_start DESC
    LIMIT 50
  `;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Curated summaries of key insights from multiple episodes
        </p>
      </div>

      <div className="bg-accent/50 border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong className="font-semibold">What are Reports?</strong> Reports aggregate the most important insights 
          from multiple episodes into daily, weekly, or monthly summaries.
        </p>
      </div>

      {approvedReports.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No reports available yet</p>
          <p className="text-muted-foreground/70 text-sm">
            Reports will be generated automatically from approved episode summaries
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvedReports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground">
                          {report.title}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
                      {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>
                      {new Date(report.period_start).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {' - '}
                      {new Date(report.period_end).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span>{report.item_count} key insights</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                        {report.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/reports/${report.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink size={16} />
                  View Report
                </a>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors">
                  <Bookmark size={16} />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
