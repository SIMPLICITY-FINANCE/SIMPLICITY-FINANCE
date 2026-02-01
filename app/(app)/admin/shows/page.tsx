import { requireAdmin } from "../../../lib/auth.js";
import postgres from "postgres";
import Link from "next/link.js";
import { RunIngestButton } from "./RunIngestButton.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface Show {
  id: string;
  name: string;
  ingest_enabled: boolean;
  ingest_source: string | null;
  youtube_channel_id: string | null;
  youtube_playlist_id: string | null;
  rss_feed_url: string | null;
  last_ingested_at: Date | null;
  ingest_frequency: string | null;
  created_at: Date;
}

export default async function AdminShowsPage() {
  await requireAdmin();

  const shows = await sql<Show[]>`
    SELECT 
      id,
      name,
      ingest_enabled,
      ingest_source,
      youtube_channel_id,
      youtube_playlist_id,
      rss_feed_url,
      last_ingested_at,
      ingest_frequency,
      created_at
    FROM shows
    ORDER BY created_at DESC
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shows Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage shows and ingestion sources
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
              >
                ← Back to Admin
              </Link>
              <Link
                href="/admin/shows/new"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                + Add Show
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No shows yet</h2>
            <p className="text-gray-600 mb-6">
              Add your first show to start automatic episode ingestion
            </p>
            <Link
              href="/admin/shows/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Show
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Show
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Ingested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shows.map((show) => {
                  const sourceId = show.ingest_source === 'youtube_channel' 
                    ? show.youtube_channel_id
                    : show.ingest_source === 'youtube_playlist'
                    ? show.youtube_playlist_id
                    : show.ingest_source === 'rss'
                    ? show.rss_feed_url
                    : null;

                  return (
                    <tr key={show.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {show.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            show.ingest_enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {show.ingest_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {show.ingest_source ? (
                          <span className="capitalize">
                            {show.ingest_source.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {sourceId ? (
                          <div className="max-w-xs truncate font-mono text-xs">
                            {sourceId}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {show.last_ingested_at ? (
                          <div>
                            <div>{new Date(show.last_ingested_at).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(show.last_ingested_at).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/shows/${show.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-300">|</span>
                          <RunIngestButton showId={show.id} showName={show.name} />
                          <span className="text-gray-300">|</span>
                          <Link
                            href={`/discover/shows/${show.id}`}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
