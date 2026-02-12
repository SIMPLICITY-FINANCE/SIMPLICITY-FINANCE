import { ArrowLeft, ExternalLink, Podcast, Calendar, Bookmark, Share2, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { sql } from "../../../../lib/db.js";

interface Episode {
  id: string;
  title: string;
  published_at: string;
  youtube_thumbnail_url: string | null;
  section_names: string | null;
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: channelId } = await params;

  // Get episodes with tags
  const episodes = await sql<Episode[]>`
    SELECT 
      e.id,
      s.title,
      COALESCE(s.published_at, e.published_at::text, e.created_at::text) as published_at,
      e.youtube_thumbnail_url,
      (
        SELECT string_agg(DISTINCT sb.section_name, '||')
        FROM summary_bullets sb
        WHERE sb.summary_id = s.id
      ) as section_names
    FROM episodes e
    JOIN episode_summary s ON e.id = s.episode_id
    WHERE e.youtube_channel_id = ${channelId}
      AND s.title IS NOT NULL
    ORDER BY s.published_at DESC
    LIMIT 20
  `;

  // Get show info — try shows table first, fall back to episodes
  const showInfo = await sql<Array<{
    name: string;
    channel_thumbnail: string | null;
    channel_url: string | null;
    channel_description: string | null;
    subscriber_count: number | null;
  }>>`
    SELECT name, channel_thumbnail, channel_url, channel_description, subscriber_count
    FROM shows WHERE channel_id = ${channelId} LIMIT 1
  `;

  let showName = showInfo[0]?.name;
  let showThumbnail = showInfo[0]?.channel_thumbnail;
  const showDescription = showInfo[0]?.channel_description;

  // Fall back to episode data if not in shows table
  if (!showName) {
    const fallback = await sql<Array<{ title: string; thumb: string | null }>>`
      SELECT youtube_channel_title as title, youtube_thumbnail_url as thumb
      FROM episodes WHERE youtube_channel_id = ${channelId} LIMIT 1
    `;
    showName = fallback[0]?.title || "Unknown Show";
    showThumbnail = showThumbnail || fallback[0]?.thumb;
  }

  if (episodes.length === 0 && !showInfo[0]) {
    notFound();
  }

  const episodeCount = episodes.length;
  const latestEpisode = episodes[0];

  return (
    <>
      {/* Back link */}
      <div className="mb-6">
        <a
          href="/discover/shows"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shows
        </a>
      </div>

      {/* Show Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-start gap-5">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {showThumbnail ? (
              <img
                src={showThumbnail}
                alt={showName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Podcast size={28} className="text-gray-300" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">
                <Podcast size={16} />
              </span>
              <h1 className="text-lg font-bold text-foreground">{showName}</h1>
            </div>

            {/* Description */}
            {showDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {showDescription}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-50 rounded-full text-xs font-medium text-gray-500">
                {episodeCount} episodes
              </span>
              {latestEpisode && (
                <span>
                  Latest:{" "}
                  {new Date(latestEpisode.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <a
                href={`https://youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={14} />
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <h2 className="text-base font-semibold">Recent Episodes</h2>
          </div>
          <span className="text-sm text-muted-foreground">{episodeCount} episodes</span>
        </div>

        {episodes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Podcast size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-muted-foreground text-sm">No episodes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => {
              const tags = episode.section_names
                ? episode.section_names.split("||").slice(0, 5)
                : [];

              return (
                <a key={episode.id} href={`/episode/${episode.id}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {episode.youtube_thumbnail_url ? (
                          <img
                            src={episode.youtube_thumbnail_url}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Podcast size={24} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                            {episode.title}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 cursor-pointer">
                              <Bookmark size={14} />
                            </span>
                            <span className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 cursor-pointer">
                              <Share2 size={14} />
                            </span>
                            <span className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 cursor-pointer">
                              <Download size={14} />
                            </span>
                          </div>
                        </div>

                        {/* Show + date */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Podcast size={12} />
                            {showName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatTimeAgo(episode.published_at)}
                          </span>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[11px] text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
