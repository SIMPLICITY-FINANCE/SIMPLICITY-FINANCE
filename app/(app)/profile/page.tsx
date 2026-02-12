import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sql } from "../../lib/db.js";
import { FollowShowButton } from "../../components/FollowShowButton.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

interface FollowedShow {
  channel_id: string;
  name: string;
  channel_thumbnail: string | null;
  episode_count: number;
  followed_at: string;
}

export default async function ProfilePage() {
  const followedShows = await sql<FollowedShow[]>`
    SELECT
      fs.youtube_channel_id as channel_id,
      fs.youtube_channel_title as name,
      s.channel_thumbnail,
      COUNT(DISTINCT e.id)::int as episode_count,
      fs.created_at::text as followed_at
    FROM followed_shows fs
    LEFT JOIN shows s ON s.channel_id = fs.youtube_channel_id
    LEFT JOIN episodes e ON e.youtube_channel_id = fs.youtube_channel_id AND e.is_published = true
    WHERE fs.user_id = ${DEMO_USER_ID}
    GROUP BY fs.youtube_channel_id, fs.youtube_channel_title, s.channel_thumbnail, fs.created_at
    ORDER BY fs.created_at DESC
  `;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-1">Following</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {followedShows.length} {followedShows.length === 1 ? "show" : "shows"}
      </p>

      {followedShows.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-sm font-medium text-foreground mb-1">
            Not following any shows yet
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Visit Discover and click Follow on any show
          </p>
          <Link
            href="/discover"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Go to Discover
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {followedShows.map((show) => (
            <div
              key={show.channel_id}
              className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg"
            >
              <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                {show.channel_thumbnail ? (
                  <img
                    src={show.channel_thumbnail}
                    alt={show.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    🎙
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/discover/shows/${show.channel_id}`}
                  className="text-sm font-semibold text-foreground hover:text-blue-600 transition-colors truncate block"
                >
                  {show.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {show.episode_count} {show.episode_count === 1 ? "episode" : "episodes"}
                </p>
              </div>

              <FollowShowButton
                channelId={show.channel_id}
                initialFollowing={true}
                variant="default"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
