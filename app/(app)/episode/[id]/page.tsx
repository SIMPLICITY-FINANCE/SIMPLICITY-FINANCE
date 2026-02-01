import postgres from "postgres";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Bookmark } from "lucide-react";

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

export default async function EpisodeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: episodeId } = await params;

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
    <>
      <div className="mb-4">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Feed
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h1 className="text-xl font-semibold text-foreground mb-4 leading-tight">
            {episode.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
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

        <div className="flex gap-2 mb-6">
          <a
            href={`https://www.youtube.com/watch?v=${episode.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ExternalLink size={16} />
            Watch on YouTube
          </a>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors">
            <Bookmark size={16} />
            Save to Notebook
          </button>
          </div>

        {episode.youtube_description && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
              {episode.youtube_description}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>

        {Object.keys(bulletsBySection).length === 0 ? (
          <p className="text-muted-foreground">No summary bullets available</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(bulletsBySection).map(([section, sectionBullets]) => (
              <div key={section}>
                <h3 className="text-base font-semibold text-foreground mb-3">
                    {section}
                </h3>
                <ul className="space-y-3">
                  {sectionBullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-3">
                      <span className="text-muted-foreground mt-1">•</span>
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-relaxed">
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
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full hover:bg-gray-200 transition-colors"
                                title="Jump to timestamp in video"
                              >
                                [{formatTimestamp(span.start_ms)}]
                              </a>
                            ))}
                          </div>
                        )}

                        {bullet.confidence < 0.8 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 text-[11px] font-medium rounded-full">
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
    </>
  );
}
