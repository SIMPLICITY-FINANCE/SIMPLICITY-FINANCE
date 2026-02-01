import postgres from "postgres";
import { unsaveEpisode } from "../lib/actions";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface SavedEpisode {
  id: string;
  episode_id: string;
  title: string;
  published_at: string;
  video_id: string;
  youtube_channel_title: string;
  saved_at: Date;
}

export default async function SavedPage() {
  // For now, return empty state since we don't have user auth yet
  // In production, this would filter by current user ID
  const savedEpisodes = await sql<SavedEpisode[]>`
    SELECT 
      si.id,
      si.episode_id,
      s.title,
      s.published_at,
      s.video_id,
      e.youtube_channel_title,
      si.created_at as saved_at
    FROM saved_items si
    JOIN episodes e ON si.episode_id = e.id
    JOIN episode_summary s ON e.id = s.episode_id
    WHERE si.item_type = 'episode'
      AND s.approval_status = 'approved'
    ORDER BY si.created_at DESC
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
              <a href="/saved" className="text-sm font-medium text-blue-600">
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
          <h2 className="text-2xl font-bold text-gray-900">Saved Episodes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Episodes and reports you've saved for later
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Saved vs Notebook:</strong> Save full episodes and reports here. 
            Individual key points go in your Notebook.
          </p>
        </div>

        {savedEpisodes.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No saved episodes yet</p>
            <p className="text-gray-400 text-sm">
              Click "Save" on any episode to add it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedEpisodes.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <a 
                        href={`/episode/${item.episode_id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.title}
                      </a>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          {new Date(item.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {item.youtube_channel_title && (
                          <>
                            <span>•</span>
                            <span>{item.youtube_channel_title}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-gray-400">
                          Saved {new Date(item.saved_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/episode/${item.episode_id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      View Episode
                    </a>
                    <a
                      href={`https://www.youtube.com/watch?v=${item.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                    >
                      Watch on YouTube →
                    </a>
                    <form action={unsaveEpisode.bind(null, item.episode_id)}>
                      <button
                        type="submit"
                        className="px-4 py-2 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                      >
                        Remove
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
