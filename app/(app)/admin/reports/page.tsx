import { requireAdmin } from "../../../lib/auth.js";
import postgres from "postgres";
import { GenerateReportForm } from "./GenerateReportForm.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface ReportRow {
  id: string;
  title: string;
  date: string;
  status: string;
  episodes_included: number;
  generation_type: string;
  generated_at: string | null;
  created_at: string;
}

export default async function AdminReportsPage() {
  const user = await requireAdmin();

  const reports = await sql<ReportRow[]>`
    SELECT id, title, date, status, episodes_included, generation_type, generated_at, created_at
    FROM reports
    WHERE report_type = 'daily'
    ORDER BY date DESC
    LIMIT 20
  `;

  // Get dates with published episodes (for the date picker hint)
  const episodeDates = await sql`
    SELECT 
      DATE(published_at) as date,
      COUNT(*) as count
    FROM episodes
    WHERE is_published = true AND published_at IS NOT NULL
    GROUP BY DATE(published_at)
    ORDER BY date DESC
    LIMIT 30
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
            <span className="text-sm text-gray-600">{user.name || user.email}</span>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Dashboard</a>
            <a href="/admin/approvals" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Approvals</a>
            <a href="/admin/reports/generate" className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Reports</a>
            <a href="/admin/shows" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Shows</a>
            <a href="/admin/ops" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Ops</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Generate Report Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Daily Report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select a date to manually generate a daily report. The system will analyze all published episodes from that date.
          </p>
          <GenerateReportForm />

          <div className="mt-4">
            <a
              href="/admin/reports/generate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
            >
              Advanced: Generate Weekly / Monthly / Quarterly →
            </a>
          </div>
          
          {episodeDates.length > 0 && (
            <div className="mt-4 text-xs text-gray-400">
              <span className="font-medium">Dates with episodes: </span>
              {episodeDates.slice(0, 10).map((d, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  {String(d.date)} ({d.count})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Existing Reports Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Generated Reports</h2>
          </div>
          {reports.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No reports generated yet
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Episodes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'ready' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.episodes_included}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.generation_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.generated_at
                        ? new Date(report.generated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.status === 'ready' && (
                        <a href={`/reports/daily/${report.date}`} className="text-blue-600 hover:underline">
                          View →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
