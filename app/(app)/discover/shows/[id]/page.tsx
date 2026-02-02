import postgres from "postgres";
import { Card } from "../../../../components/ui/Card.js";
import { Chip } from "../../../../components/ui/Chip.js";
import { Button } from "../../../../components/ui/Button.js";
import { FollowButton } from "../../../../components/ui/FollowButton.js";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { isFollowingShow, followShow, unfollowShow } from "../../../../lib/actions/follow.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface Episode {
  id: string;
  title: string;
  published_at: string;
  youtube_thumbnail_url: string | null;
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: channelId } = await params;

  // Get show info and episodes
  const episodes = await sql<Episode[]>`
    SELECT 
      e.id,
      s.title,
      s.published_at,
      e.youtube_thumbnail_url
    FROM episodes e
    LEFT JOIN episode_summary s ON e.id = s.episode_id
    WHERE e.youtube_channel_id = ${channelId}
      AND s.title IS NOT NULL
    ORDER BY s.published_at DESC
    LIMIT 20
  `;

  if (episodes.length === 0) {
    notFound();
  }

  // Get channel info from first episode
  const channelInfo = await sql<Array<{
    channel_title: string;
    channel_id: string;
    thumbnail_url: string | null;
  }>>`
    SELECT 
      youtube_channel_title as channel_title,
      youtube_channel_id as channel_id,
      youtube_thumbnail_url as thumbnail_url
    FROM episodes
    WHERE youtube_channel_id = ${channelId}
    LIMIT 1
  `;

  const show = channelInfo[0];
  
  if (!show) {
    notFound();
  }
  
  const episodeCount = episodes.length;
  const latestEpisode = episodes[0];
  const isFollowing = await isFollowingShow(channelId);

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <a
          href="/discover/shows"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shows
        </a>
      </div>

      {/* Show Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-6">
          {show.thumbnail_url && (
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={show.thumbnail_url}
                alt={show.channel_title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              {show.channel_title}
            </h1>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-4">
              <Chip>{episodeCount} episodes</Chip>
              {latestEpisode && (
                <span className="text-sm text-muted-foreground">
                  Latest: {new Date(latestEpisode.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`https://youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm">
                  <ExternalLink size={16} className="mr-2" />
                  View on YouTube
                </Button>
              </a>
              <FollowButton
                isFollowing={isFollowing}
                onFollow={async () => {
                  "use server";
                  return await followShow(channelId, show.channel_title);
                }}
                onUnfollow={async () => {
                  "use server";
                  return await unfollowShow(channelId);
                }}
                size="sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Episodes List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Episodes
        </h2>
      </div>

      <div className="space-y-3">
        {episodes.map((episode) => (
          <a key={episode.id} href={`/episode/${episode.id}`} className="block">
            <Card className="p-4 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                {episode.youtube_thumbnail_url && (
                  <div className="w-24 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={episode.youtube_thumbnail_url}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
                    {episode.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(episode.published_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </>
  );
}
