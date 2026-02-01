import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface SearchResult {
  id: string;
  episode_id: string;
  title: string;
  published_at: string;
  video_id: string;
  result_type: string;
  match_text: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  let results: SearchResult[] = [];

  if (query.length >= 2) {
    // Search in episode titles and summary bullets
    results = await sql<SearchResult[]>`
      SELECT 
        s.id,
        s.episode_id,
        s.title,
        s.published_at,
        s.video_id,
        'episode' as result_type,
        s.title as match_text
      FROM episode_summary s
      WHERE s.approval_status = 'approved'
        AND s.title ILIKE ${`%${query}%`}
      
      UNION ALL
      
      SELECT 
        sb.id,
        s.episode_id,
        s.title,
        s.published_at,
        s.video_id,
        'bullet' as result_type,
        sb.bullet_text as match_text
      FROM summary_bullets sb
      JOIN episode_summary s ON sb.summary_id = s.id
      WHERE s.approval_status = 'approved'
        AND sb.bullet_text ILIKE ${`%${query}%`}
      
      LIMIT 50
    `;
  }

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
              <a href="/reports" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Reports
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search</h2>
          
          <form method="GET" action="/search" className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search episodes and key points..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="text-sm text-gray-600">
              {results.length} results for "{query}"
            </p>
          )}
        </div>

        {!query ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Search episodes and insights</p>
            <p className="text-gray-400 text-sm">
              Enter a keyword to search across episode titles and key points
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No results found</p>
            <p className="text-gray-400 text-sm">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={`${result.result_type}-${result.id}`} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    result.result_type === 'episode' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {result.result_type === 'episode' ? 'Episode' : 'Key Point'}
                  </span>
                  <div className="flex-1">
                    <a 
                      href={`/episode/${result.episode_id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      {result.match_text.length > 200 
                        ? result.match_text.substring(0, 200) + '...' 
                        : result.match_text}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>
                        {new Date(result.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <a
                        href={`/episode/${result.episode_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Episode →
                      </a>
                    </div>
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
