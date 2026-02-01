import postgres from "postgres";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface ShowDetail {
  channelId: string;
  channelTitle: string;
  episodeCount: number;
  latestEpisode: string | null;
  description: string | null;
}

interface ShowEpisode {
  id: string;
  episodeId: string;
  title: string;
  publishedAt: string;
  videoId: string;
  thumbnailUrl: string | null;
  bulletCount: number;
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;

  // Get show details
  const [showDetail] = await sql<ShowDetail[]>`
    SELECT 
      e.youtube_channel_id as channel_id,
      e.youtube_channel_title as channel_title,
      COUNT(DISTINCT e.id) as episode_count,
      MAX(s.published_at) as latest_episode,
      MAX(e.youtube_description) as description
    FROM episodes e
    LEFT JOIN episode_summary s ON e.id = s.episode_id
    WHERE e.youtube_channel_id = ${channelId}
    GROUP BY e.youtube_channel_id, e.youtube_channel_title
  `;

  if (!showDetail) {
    notFound();
  }

  // Get episodes for this show
  const episodes = await sql<ShowEpisode[]>`
    SELECT 
      s.id,
      s.episode_id,
      s.title,
      s.published_at,
      s.video_id,
      e.youtube_thumbnail_url as thumbnail_url,
      (SELECT COUNT(*) FROM summary_bullets WHERE summary_id = s.id) as bullet_count
    FROM episode_summary s
    JOIN episodes e ON s.episode_id = e.id
    WHERE e.youtube_channel_id = ${channelId}
      AND s.approval_status = 'approved'
    ORDER BY s.published_at DESC
    LIMIT 50
  `;

  return (
    <>
      {/* Back Navigation */}
      <div className="mb-4">
        <a
          href="/discover?tab=shows"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shows
        </a>
      </div>

      {/* Show Header */}
      <Card className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {showDetail.channelTitle}
            </h1>
            {showDetail.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {showDetail.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Chip>{showDetail.episodeCount} episodes</Chip>
              {showDetail.latestEpisode && (
                <span>
                  Latest:{" "}
                  {new Date(showDetail.latestEpisode).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              )}
            </div>
          </div>
          <a
            href={`https://www.youtube.com/channel/${channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ExternalLink size={16} />
            View on YouTube
          </a>
        </div>
      </Card>

      {/* Episodes List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Episodes ({episodes.length})
        </h2>
      </div>

      {episodes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg mb-2">
            No episodes available yet
          </p>
          <p className="text-muted-foreground/70 text-sm">
            Episodes from this show will appear here once processed
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {episodes.map((episode) => (
            <a
              key={episode.id}
              href={`/episode/${episode.episodeId}`}
              className="block"
            >
              <Card className="p-0 overflow-hidden hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  {episode.thumbnailUrl && (
                    <div className="w-48 h-28 bg-gray-100 flex-shrink-0">
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                      {episode.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {new Date(episode.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span>•</span>
                      <Chip>{episode.bulletCount} key points</Chip>
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
