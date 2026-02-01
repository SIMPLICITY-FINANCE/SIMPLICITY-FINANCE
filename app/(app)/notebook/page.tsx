import postgres from "postgres";
import { Card } from "../../components/ui/Card.js";
import { BookOpen, Trash2 } from "lucide-react";

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
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">My Notebook</h2>
        <p className="text-sm text-muted-foreground">
          Individual key points you've saved from episodes
        </p>
      </div>

      <div className="bg-accent/50 border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong className="font-semibold">Saved vs Notebook:</strong> Your notebook contains individual key points (bullets). 
          Full episodes go in Saved.
        </p>
      </div>

      {notebookBullets.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Your notebook is empty</p>
          <p className="text-muted-foreground/70 text-sm">
            Save individual key points from episodes to build your notebook
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notebookBullets.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.section_name}
                  </h3>
                  <button className="inline-flex items-center gap-1 text-destructive text-xs hover:text-destructive/80 transition-colors">
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">
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
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full hover:bg-gray-200 transition-colors"
                        title="Jump to timestamp in video"
                      >
                        [{formatTimestamp(span.start_ms)}]
                      </a>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                  <span className="text-muted-foreground/70">
                    Saved {new Date(item.saved_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {item.user_notes && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-sm text-muted-foreground italic">
                    Note: {item.user_notes}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 mt-3">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  + Add note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
