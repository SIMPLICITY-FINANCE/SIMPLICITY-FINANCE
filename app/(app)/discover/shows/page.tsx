import { Podcast } from "lucide-react";
import { sql } from "../../../lib/db.js";

interface ShowRow {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
  latest_date: string | null;
  latest_thumbnail: string | null;
}

export default async function DiscoverShowsPage() {
  // Merge shows table + episodes table to get complete show list
  // Shows table has curated shows; episodes table may have additional channels
  const shows = await sql<ShowRow[]>`
    WITH show_stats AS (
      SELECT
        e.youtube_channel_id as channel_id,
        COUNT(DISTINCT e.id) as episode_count,
        MAX(e.published_at) as latest_date,
        (
          SELECT e2.youtube_thumbnail_url
          FROM episodes e2
          WHERE e2.youtube_channel_id = e.youtube_channel_id
            AND e2.youtube_thumbnail_url IS NOT NULL
          ORDER BY e2.published_at DESC NULLS LAST, e2.created_at DESC
          LIMIT 1
        ) as latest_thumbnail
      FROM episodes e
      WHERE e.youtube_channel_id IS NOT NULL
        AND e.is_published = true
      GROUP BY e.youtube_channel_id
    )
    SELECT
      COALESCE(s.channel_id, ss.channel_id) as id,
      COALESCE(s.name, (
        SELECT e3.youtube_channel_title FROM episodes e3
        WHERE e3.youtube_channel_id = ss.channel_id
        LIMIT 1
      )) as name,
      COALESCE(s.channel_id, ss.channel_id) as channel_id,
      s.channel_thumbnail,
      COALESCE(ss.episode_count, 0)::int as episode_count,
      ss.latest_date,
      ss.latest_thumbnail
    FROM shows s
    FULL OUTER JOIN show_stats ss ON s.channel_id = ss.channel_id
    WHERE s.channel_id IS NOT NULL OR ss.episode_count > 0
    ORDER BY COALESCE(ss.episode_count, 0) DESC, COALESCE(s.name, '') ASC
  `;

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        <a
          href="/discover/shows"
          className="px-4 py-2 text-sm font-semibold text-foreground border-b-2 border-foreground"
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

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-6">
        All Shows ({shows.length})
      </h2>

      {shows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Podcast size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-muted-foreground text-lg mb-1">No shows found</p>
          <p className="text-muted-foreground/70 text-sm">
            Shows will appear here as episodes are processed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shows.map((show) => (
            <a
              key={show.id}
              href={`/discover/shows/${show.channel_id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-50 overflow-hidden">
                  {show.latest_thumbnail || show.channel_thumbnail ? (
                    <img
                      src={show.latest_thumbnail || show.channel_thumbnail || ""}
                      alt={show.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Podcast size={32} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {show.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 rounded-full font-medium text-gray-500">
                      {show.episode_count} episodes
                    </span>
                    {show.latest_date && (
                      <span>
                        Latest:{" "}
                        {new Date(show.latest_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
