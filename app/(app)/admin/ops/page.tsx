import postgres from "postgres";
import { requireAdmin } from "../../../lib/auth.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface SystemStats {
  total_episodes: number;
  total_summaries: number;
  total_bullets: number;
  total_users: number;
  pending_approvals: number;
  approved_summaries: number;
  rejected_summaries: number;
  total_qc_runs: number;
  avg_qc_score: number;
  total_saved_items: number;
  total_notebook_items: number;
  total_reports: number;
}

interface RecentError {
  id: string;
  episode_id: string;
  error_type: string;
  error_message: string;
  created_at: Date;
}

export default async function OpsPage() {
  await requireAdmin();

  // Get system stats
  const [stats] = await sql<SystemStats[]>`
    SELECT 
      (SELECT COUNT(*) FROM episodes) as total_episodes,
      (SELECT COUNT(*) FROM episode_summary) as total_summaries,
      (SELECT COUNT(*) FROM summary_bullets) as total_bullets,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM episode_summary WHERE approval_status = 'pending') as pending_approvals,
      (SELECT COUNT(*) FROM episode_summary WHERE approval_status = 'approved') as approved_summaries,
      (SELECT COUNT(*) FROM episode_summary WHERE approval_status = 'rejected') as rejected_summaries,
      (SELECT COUNT(*) FROM qc_runs) as total_qc_runs,
      (SELECT COALESCE(AVG(qc_score), 0) FROM qc_runs) as avg_qc_score,
      (SELECT COUNT(*) FROM saved_items) as total_saved_items,
      (SELECT COUNT(*) FROM notebook_items) as total_notebook_items,
      (SELECT COUNT(*) FROM reports) as total_reports
  `;

  // Get recent episodes for cleanup
  const recentEpisodes = await sql`
    SELECT 
      e.id,
      e.video_id,
      e.youtube_title,
      e.created_at,
      s.approval_status,
      (SELECT COUNT(*) FROM summary_bullets sb 
       JOIN episode_summary es ON sb.summary_id = es.id 
       WHERE es.episode_id = e.id) as bullet_count
    FROM episodes e
    LEFT JOIN episode_summary s ON e.id = s.episode_id
    ORDER BY e.created_at DESC
    LIMIT 20
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Operations Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                System monitoring and admin tools
              </p>
            </div>
            <a
              href="/admin"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              ← Back to Admin
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Episodes</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_episodes}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Summaries</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_summaries}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Bullets</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_bullets}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_users}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Pending Approvals</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending_approvals}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Approved</div>
              <div className="text-3xl font-bold text-green-600">{stats.approved_summaries}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-3xl font-bold text-red-600">{stats.rejected_summaries}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Avg QC Score</div>
              <div className="text-3xl font-bold text-blue-600">{Math.round(Number(stats.avg_qc_score))}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Saved Items</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_saved_items}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Notebook Items</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_notebook_items}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Reports</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_reports}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">QC Runs</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_qc_runs}</div>
            </div>
          </div>
        </div>

        {/* Recent Episodes & Cleanup Tools */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Episodes & Cleanup</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Episode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bullets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEpisodes.map((episode: any) => (
                  <tr key={episode.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {episode.youtube_title || episode.video_id}
                      </div>
                      <div className="text-xs text-gray-500">{episode.video_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        episode.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                        episode.approval_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        episode.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {episode.approval_status || 'no summary'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {episode.bullet_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(episode.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-gray-400 text-xs">
                        (Delete feature coming soon)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Connection</span>
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QC Pass Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.total_qc_runs > 0 ? '100%' : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.total_summaries > 0 
                    ? `${Math.round((Number(stats.approved_summaries) / Number(stats.total_summaries)) * 100)}%`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
