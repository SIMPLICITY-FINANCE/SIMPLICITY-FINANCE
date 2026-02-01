import postgres from "postgres";
import { notFound } from "next/navigation";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface EpisodeDetail {
  id: string;
  title: string;
  published_at: string;
  video_id: string;
  youtube_channel_title: string;
  youtube_description: string;
  qc_score: number;
  qc_status: string;
  created_at: Date;
}

interface SummaryBullet {
  id: string;
  section_name: string;
  bullet_text: string;
  confidence: number;
  evidence_spans: Array<{ start_ms: number; end_ms: number }>;
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

export default async function EpisodeDetailPage({ params }: { params: { id: string } }) {
  const episodeId = params.id;

  const [episode] = await sql<EpisodeDetail[]>`
    SELECT 
      e.id,
      s.title,
      s.published_at,
      s.video_id,
      e.youtube_channel_title,
      e.youtube_description,
      q.qc_score,
      q.qc_status,
      s.created_at
    FROM episodes e
    JOIN episode_summary s ON e.id = s.episode_id
    LEFT JOIN qc_runs q ON s.id = q.summary_id
    WHERE e.id = ${episodeId}
      AND s.approval_status = 'approved'
    LIMIT 1
  `;

  if (!episode) {
    notFound();
  }

  const bullets = await sql<SummaryBullet[]>`
    SELECT 
      b.id,
      b.section_name,
      b.bullet_text,
      b.confidence,
      b.evidence_spans
    FROM summary_bullets b
    JOIN episode_summary s ON b.summary_id = s.id
    WHERE s.episode_id = ${episodeId}
      AND s.approval_status = 'approved'
    ORDER BY b.section_name, b.id
  `;

  const bulletsBySection = bullets.reduce((acc, bullet) => {
    if (!acc[bullet.section_name]) {
      acc[bullet.section_name] = [];
    }
    acc[bullet.section_name].push(bullet);
    return acc;
  }, {} as Record<string, SummaryBullet[]>);

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Feed
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {episode.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>
              {new Date(episode.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {episode.youtube_channel_title && (
              <>
                <span>•</span>
                <span>{episode.youtube_channel_title}</span>
              </>
            )}
            {episode.qc_score && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className={`${
                    episode.qc_status === 'pass' ? 'text-green-600' :
                    episode.qc_status === 'warn' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {episode.qc_status === 'pass' ? '✓' : '⚠'}
                  </span>
                  QC Score: {episode.qc_score}/100
                </span>
              </>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            <a
              href={`https://www.youtube.com/watch?v=${episode.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Watch on YouTube →
            </a>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors">
              Save to Notebook
            </button>
          </div>

          {episode.youtube_description && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">
                {episode.youtube_description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

          {Object.keys(bulletsBySection).length === 0 ? (
            <p className="text-gray-500">No summary bullets available</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(bulletsBySection).map(([section, sectionBullets]) => (
                <div key={section}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {section}
                  </h3>
                  <ul className="space-y-4">
                    {sectionBullets.map((bullet) => (
                      <li key={bullet.id} className="flex gap-3">
                        <span className="text-blue-600 mt-1">•</span>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">
                            {bullet.bullet_text}
                          </p>
                          
                          {bullet.evidence_spans && Array.isArray(bullet.evidence_spans) && bullet.evidence_spans.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {bullet.evidence_spans.map((span, idx) => (
                                <a
                                  key={idx}
                                  href={`https://www.youtube.com/watch?v=${episode.video_id}&t=${Math.floor(span.start_ms / 1000)}s`}
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

                          {bullet.confidence < 0.8 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
                                Lower confidence ({Math.round(bullet.confidence * 100)}%)
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
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
