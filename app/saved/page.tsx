import postgres from "postgres";
import { unsaveEpisode } from "../lib/actions";
import { AppLayout } from "../components/layout/AppLayout.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Bookmark } from "lucide-react";

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
    <AppLayout showRightRail={true} searchPlaceholder="Search saved items...">
      <div className="mb-6">
        <div className="bg-accent/50 border border-border/50 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong className="font-semibold">Saved vs Notebook:</strong> Save full episodes and reports here. 
            Individual key points go in your Notebook.
          </p>
        </div>
      </div>

      {savedEpisodes.length === 0 ? (
        <Card className="p-12 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No saved episodes yet</p>
          <p className="text-muted-foreground/70 text-sm">
            Click "Save" on any episode to add it here
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedEpisodes.map((item) => (
            <Card key={item.id} hover className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <a 
                    href={`/episode/${item.episode_id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors block mb-2"
                  >
                    📄 {item.title}
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {item.youtube_channel_title && (
                      <>
                        <span className="flex items-center gap-1">
                          <span>🎙️</span>
                          <span>{item.youtube_channel_title}</span>
                        </span>
                        <span>•</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>
                        {new Date(item.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="text-muted-foreground/70">
                      Saved {new Date(item.saved_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a href={`/episode/${item.episode_id}`}>
                  <Button variant="primary" size="sm">
                    View Episode
                  </Button>
                </a>
                <a
                  href={`https://www.youtube.com/watch?v=${item.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm">
                    Watch on YouTube →
                  </Button>
                </a>
                <form action={unsaveEpisode.bind(null, item.episode_id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
