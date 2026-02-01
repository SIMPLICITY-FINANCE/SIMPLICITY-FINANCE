import postgres from "postgres";
import { saveEpisode } from "../lib/actions";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface ApprovedSummary {
  id: string;
  title: string;
  published_at: string;
  video_id: string;
  qc_score: number;
  created_at: Date;
  episode_id: string;
  bullet_count: number;
}

export default async function DashboardPage() {
  const approvedSummaries = await sql<ApprovedSummary[]>`
    SELECT 
      s.id,
      s.title,
      s.published_at,
      s.video_id,
      s.created_at,
      s.episode_id,
      q.qc_score,
      (SELECT COUNT(*) FROM summary_bullets WHERE summary_id = s.id) as bullet_count
    FROM episode_summary s
    LEFT JOIN qc_runs q ON s.id = q.summary_id
    WHERE s.approval_status = 'approved'
    ORDER BY s.published_at DESC
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
              <a href="/dashboard" className="text-sm font-medium text-blue-600">
                Feed
              </a>
              <a href="/saved" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Saved
              </a>
              <a href="/notebook" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Notebook
              </a>
              <a href="/reports" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Reports
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Summaries</h2>
          <p className="text-sm text-gray-600 mt-1">
            {approvedSummaries.length} approved episode summaries
          </p>
        </div>

        {approvedSummaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No summaries available yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon for finance podcast summaries
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {approvedSummaries.map((summary) => (
              <div key={summary.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <a 
                        href={`/episode/${summary.episode_id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {summary.title}
                      </a>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          {new Date(summary.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span>{summary.bullet_count} key points</span>
                        {summary.qc_score && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="text-green-600">✓</span>
                              QC Score: {summary.qc_score}/100
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/episode/${summary.episode_id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      View Summary
                    </a>
                    <a
                      href={`https://www.youtube.com/watch?v=${summary.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                    >
                      Watch on YouTube →
                    </a>
                    <form action={saveEpisode.bind(null, summary.episode_id)}>
                      <button
                        type="submit"
                        className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                      >
                        Save
                      </button>
                    </form>
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
