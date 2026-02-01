import postgres from "postgres";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Simplicity Finance
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Finance podcast intelligence from long-form audio
              </p>
            </div>
            <nav className="flex gap-6">
              <a href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Feed
              </a>
              <a href="/saved" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Saved
              </a>
              <a href="/notebook" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Notebook
              </a>
              <a href="/reports" className="text-sm font-medium text-blue-600">
                Reports
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            Curated summaries of key insights from multiple episodes
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>What are Reports?</strong> Reports aggregate the most important insights 
            from multiple episodes into daily, weekly, or monthly summaries.
          </p>
        </div>

        {approvedReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No reports available yet</p>
            <p className="text-gray-400 text-sm">
              Reports will be generated automatically from approved episode summaries
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {approvedReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          report.report_type === 'daily' ? 'bg-green-100 text-green-800' :
                          report.report_type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {report.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/reports/${report.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      View Report
                    </a>
                    <button className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Simplicity Finance - Evidence-grounded finance podcast intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
