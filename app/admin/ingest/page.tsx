import { requireAdmin } from "../../lib/auth.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export default async function AdminIngestPage() {
  const user = await requireAdmin();

  // Get recent ingestion stats
  const recentEpisodes = await sql`
    SELECT 
      id,
      video_id,
      youtube_title,
      youtube_channel_title,
      created_at,
      (SELECT COUNT(*) FROM episode_summary WHERE episode_id = episodes.id) as has_summary
    FROM episodes
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const stats = await sql`
    SELECT 
      COUNT(*) as total_episodes,
      COUNT(DISTINCT youtube_channel_id) as total_channels,
      COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as episodes_last_7_days,
      COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as episodes_last_24h
    FROM episodes
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Ingest Management
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Logged in as: {user.email}
              </span>
              <a
                href="/admin"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Episodes
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats[0]?.total_episodes || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Channels
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats[0]?.total_channels || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Last 7 Days
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {stats[0]?.episodes_last_7_days || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Last 24 Hours
            </div>
            <div className="text-3xl font-bold text-green-600">
              {stats[0]?.episodes_last_24h || 0}
            </div>
          </div>
        </div>

        {/* Ingestion Controls */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Manual Ingestion
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Manual episode submission is now available!</strong>
              </p>
              <p className="text-sm text-blue-700">
                Users can submit YouTube videos via the public upload page. Episodes will be processed
                automatically and appear in the approval queue.
              </p>
            </div>
            
            <a
              href="/upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Upload Page →
            </a>
          </div>
        </div>

        {/* Recent Episodes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Episodes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingested At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEpisodes.map((episode) => (
                  <tr key={episode.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {episode.video_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {episode.youtube_title || 'No title'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {episode.youtube_channel_title || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {episode.has_summary > 0 ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(episode.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Coming in Milestone 4: Real Data Ingestion Scheduling
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Automated RSS/YouTube feed monitoring</li>
            <li>Scheduled Inngest jobs for episode ingestion</li>
            <li>Manual trigger for specific videos</li>
            <li>Ingestion queue and status tracking</li>
            <li>Error handling and retry logic</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
