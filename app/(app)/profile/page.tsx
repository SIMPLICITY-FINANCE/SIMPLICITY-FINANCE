import Link from "next/link";
import { sql } from "../../lib/db.js";
import {
  Mail,
  Calendar,
  Pencil,
  FileText,
  Clock,
  Bookmark,
  Flame,
  Users,
  ChevronRight,
} from "lucide-react";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

interface UserRow {
  name: string;
  email: string;
  created_at: string;
}

interface CountRow {
  count: number;
}

interface FollowedShowRow {
  channel_id: string;
  name: string;
  channel_thumbnail: string | null;
  new_episodes: number;
}

interface RecentHistoryRow {
  id: string;
  title: string;
  show_name: string | null;
}

export default async function ProfilePage() {
  // 1. User info
  const [user] = await sql<UserRow[]>`
    SELECT name, email, created_at::text as created_at
    FROM users WHERE id = ${DEMO_USER_ID} LIMIT 1
  `;

  // 2. Statistics (parallel)
  const [savedCount, followCount, followedShows, recentHistory] =
    await Promise.all([
      // Saved episodes count
      sql<CountRow[]>`
        SELECT COUNT(*)::int as count
        FROM saved_items
        WHERE user_id = ${DEMO_USER_ID} AND item_type = 'episode'
      `,
      // Followed shows count
      sql<CountRow[]>`
        SELECT COUNT(*)::int as count
        FROM followed_shows
        WHERE user_id = ${DEMO_USER_ID}
      `,
      // Followed shows preview (max 4) with new episode count (last 7 days)
      sql<FollowedShowRow[]>`
        SELECT
          fs.youtube_channel_id as channel_id,
          fs.youtube_channel_title as name,
          s.channel_thumbnail,
          COUNT(DISTINCT CASE
            WHEN e.published_at > NOW() - INTERVAL '7 days' THEN e.id
          END)::int as new_episodes
        FROM followed_shows fs
        LEFT JOIN shows s ON s.channel_id = fs.youtube_channel_id
        LEFT JOIN episodes e ON e.youtube_channel_id = fs.youtube_channel_id
          AND e.is_published = true
        WHERE fs.user_id = ${DEMO_USER_ID}
        GROUP BY fs.youtube_channel_id, fs.youtube_channel_title,
                 s.channel_thumbnail, fs.created_at
        ORDER BY fs.created_at DESC
        LIMIT 4
      `,
      // Recent reading history (last 5 saved episodes)
      sql<RecentHistoryRow[]>`
        SELECT
          e.id,
          COALESCE(e.youtube_title, 'Untitled Episode') as title,
          s.name as show_name
        FROM saved_items si
        INNER JOIN episodes e ON e.id = si.episode_id
        LEFT JOIN shows s ON s.channel_id = e.youtube_channel_id
        WHERE si.user_id = ${DEMO_USER_ID}
          AND si.item_type = 'episode'
          AND si.episode_id IS NOT NULL
        ORDER BY si.created_at DESC
        LIMIT 5
      `,
    ]);

  const summariesSaved = savedCount[0]?.count ?? 0;
  const podcastsFollowing = followCount[0]?.count ?? 0;
  // Use saved count as proxy for "summaries read" (no separate views table)
  const summariesRead = summariesSaved;
  const minutesReading = Math.round(summariesRead * 8);

  const stats = [
    { icon: FileText, label: "Summaries Read", value: summariesRead },
    { icon: Clock, label: "Minutes Reading", value: minutesReading },
    { icon: Users, label: "Podcasts Following", value: podcastsFollowing },
    { icon: Bookmark, label: "Summaries Saved", value: summariesSaved },
    { icon: Flame, label: "Day Streak", value: 1 },
  ];

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      {/* ── PROFILE HEADER ── */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-border">
              <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate mb-1">
              {user?.name ?? "User"}
            </h1>

            <div className="space-y-1 mb-3">
              {user?.email && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>
              )}
              {joinedDate && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinedDate}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Financial podcast listener staying informed on markets, economics,
              and investing.
            </p>

            <button className="px-4 py-2 text-sm font-medium bg-muted hover:bg-accent border border-border rounded-lg transition-colors text-foreground">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── STATISTICS ── */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Your Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xl font-bold text-foreground leading-none mb-0.5">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOLLOWING ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Following
          </h2>
          {followedShows.length > 0 && (
            <Link
              href="/profile/following"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {followedShows.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              You&apos;re not following any shows yet
            </p>
            <Link
              href="/discover"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Discover &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followedShows.map((show) => (
              <Link
                key={show.channel_id}
                href={`/discover/shows/${show.channel_id}`}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
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
                  <p className="text-sm font-semibold text-foreground truncate">
                    {show.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {show.new_episodes > 0
                      ? `${show.new_episodes} new ${show.new_episodes === 1 ? "episode" : "episodes"}`
                      : "No new episodes"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── RECENT READING HISTORY ── */}
      {recentHistory.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Reading History
          </h2>
          <div className="space-y-2">
            {recentHistory.map((ep) => (
              <Link
                key={ep.id}
                href={`/episode/${ep.id}`}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {ep.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ep.show_name ?? "Unknown Show"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
