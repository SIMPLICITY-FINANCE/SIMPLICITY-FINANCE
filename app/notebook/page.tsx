import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface NotebookBullet {
  id: string;
  bullet_id: string;
  bullet_text: string;
  section_name: string;
  confidence: number;
  evidence_spans: Array<{ start_ms: number; end_ms: number }>;
  episode_title: string;
  video_id: string;
  published_at: string;
  user_notes: string | null;
  saved_at: Date;
}

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default async function NotebookPage() {
  // For now, return empty state since we don't have user auth yet
  // In production, this would filter by current user ID
  const notebookBullets = await sql<NotebookBullet[]>`
    SELECT 
      ni.id,
      ni.bullet_id,
      sb.bullet_text,
      sb.section_name,
      sb.confidence,
      sb.evidence_spans,
      s.title as episode_title,
      s.video_id,
      s.published_at,
      ni.user_notes,
      ni.created_at as saved_at
    FROM notebook_items ni
    JOIN summary_bullets sb ON ni.bullet_id = sb.id
    JOIN episode_summary s ON sb.summary_id = s.id
    WHERE s.approval_status = 'approved'
    ORDER BY ni.created_at DESC
    LIMIT 100
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
              <a href="/notebook" className="text-sm font-medium text-blue-600">
                Notebook
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Notebook</h2>
          <p className="text-sm text-gray-600 mt-1">
            Individual key points you've saved from episodes
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Saved vs Notebook:</strong> Your notebook contains individual key points (bullets). 
            Full episodes go in Saved.
          </p>
        </div>

        {notebookBullets.length === 0 ? (
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
            <p className="text-gray-500 text-lg mb-2">Your notebook is empty</p>
            <p className="text-gray-400 text-sm">
              Check the box next to any key point to save it here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notebookBullets.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {item.section_name}
                    </h3>
                    <button className="text-red-600 text-xs hover:text-red-700">
                      Remove
                    </button>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-3">
                    {item.bullet_text}
                  </p>

                  {item.evidence_spans && Array.isArray(item.evidence_spans) && item.evidence_spans.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.evidence_spans.map((span, idx) => (
                        <a
                          key={idx}
                          href={`https://www.youtube.com/watch?v=${item.video_id}&t=${Math.floor(span.start_ms / 1000)}s`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition-colors"
                          title="Jump to timestamp in video"
                        >
                          [{formatTimestamp(span.start_ms)}]
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>From: {item.episode_title}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">
                      Saved {new Date(item.saved_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {item.user_notes && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600 italic">
                      Note: {item.user_notes}
                    </p>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    + Add note
                  </button>
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
