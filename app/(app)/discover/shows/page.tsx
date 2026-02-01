import postgres from "postgres";
import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface Show {
  channel_id: string;
  channel_title: string;
  episode_count: number;
  latest_episode: string;
  thumbnail_url: string | null;
}

export default async function DiscoverShowsPage() {
  const shows = await sql<Show[]>`
    SELECT 
      e.youtube_channel_id as channel_id,
      e.youtube_channel_title as channel_title,
      COUNT(DISTINCT e.id) as episode_count,
      MAX(s.published_at) as latest_episode,
      MAX(e.youtube_thumbnail_url) as thumbnail_url
    FROM episodes e
    LEFT JOIN episode_summary s ON e.id = s.episode_id
    WHERE e.youtube_channel_title IS NOT NULL
      AND e.youtube_channel_id IS NOT NULL
    GROUP BY e.youtube_channel_id, e.youtube_channel_title
    ORDER BY episode_count DESC
    LIMIT 50
  `;

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-100">
        <a
          href="/discover/shows"
          className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-primary transition-colors"
        >
          Shows
        </a>
        <a
          href="/discover/people"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          People
        </a>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            All Shows ({shows.length})
          </h2>
        </div>

        {shows.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg mb-2">No shows found</p>
            <p className="text-muted-foreground/70 text-sm">
              Shows will appear here as episodes are processed
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows.map((show) => (
              <a
                key={show.channel_id}
                href={`/discover/shows/${show.channel_id}`}
                className="block"
              >
                <Card className="p-0 overflow-hidden hover:shadow-lg transition-all">
                  {show.thumbnail_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={show.thumbnail_url}
                        alt={show.channel_title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                      {show.channel_title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Chip>{show.episode_count} episodes</Chip>
                      {show.latest_episode && (
                        <span>
                          Latest:{" "}
                          {new Date(show.latest_episode).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
