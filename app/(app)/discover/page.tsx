import { ShowsCarousel } from "./ShowsCarousel";
import { PeopleCarousel } from "./PeopleCarousel";
import { RecentEpisodesStrip } from "./RecentEpisodesStrip";
import { sql } from "../../lib/db.js";

interface ShowRow {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
  latest_thumbnail: string | null;
  latest_episode: string | null;
}

interface PersonRow {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  avatar_url: string | null;
  title: string | null;
  episode_count: number;
}

interface EpisodeRow {
  id: string;
  youtube_title: string;
  video_id: string;
  youtube_thumbnail_url: string | null;
  published_at: string | null;
  show_name: string | null;
  youtube_duration: string | null;
}

export default async function DiscoverPage() {
  const [showsData, peopleData, recentEpisodes] = await Promise.all([
    sql<ShowRow[]>`
      SELECT
        s.channel_id as id,
        s.name,
        s.channel_id,
        s.channel_thumbnail,
        COUNT(DISTINCT e.id)::int as episode_count,
        (
          SELECT e2.youtube_thumbnail_url
          FROM episodes e2
          WHERE e2.youtube_channel_id = s.channel_id
            AND e2.youtube_thumbnail_url IS NOT NULL
          ORDER BY e2.published_at DESC
          LIMIT 1
        ) as latest_thumbnail,
        MAX(e.published_at)::text as latest_episode
      FROM shows s
      LEFT JOIN episodes e ON e.youtube_channel_id = s.channel_id AND e.is_published = true
      GROUP BY s.id, s.channel_id, s.name, s.channel_thumbnail
      ORDER BY COUNT(DISTINCT e.id) DESC, s.name ASC
      LIMIT 20
    `,
    sql<PersonRow[]>`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.emoji,
        p.avatar_url,
        p.title,
        COUNT(DISTINCT ep.episode_id)::int as episode_count
      FROM people p
      LEFT JOIN episode_people ep ON ep.person_id = p.id
      GROUP BY p.id
      ORDER BY COUNT(DISTINCT ep.episode_id) DESC, p.name ASC
      LIMIT 20
    `,
    sql<EpisodeRow[]>`
      SELECT * FROM (
        SELECT DISTINCT ON (e.id)
          e.id,
          e.youtube_title,
          e.video_id,
          e.youtube_thumbnail_url,
          e.published_at::text as published_at,
          s.name as show_name,
          e.youtube_duration
        FROM episodes e
        LEFT JOIN shows s ON e.youtube_channel_id = s.channel_id
        WHERE e.is_published = true
          AND e.published_at > NOW() - INTERVAL '7 days'
        ORDER BY e.id, e.published_at DESC
      ) sub
      ORDER BY sub.published_at DESC
      LIMIT 8
    `,
  ]);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Discover</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {showsData.length} shows · {peopleData.length > 0 ? `${peopleData.length} people` : 'Financial podcasts and expert commentary'}
        </p>
      </div>

      {/* New This Week */}
      {recentEpisodes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">New This Week</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recentEpisodes.length} episode{recentEpisodes.length !== 1 ? 's' : ''} added in the last 7 days
              </p>
            </div>
          </div>
          <RecentEpisodesStrip episodes={recentEpisodes} />
        </section>
      )}

      {/* Shows Carousel */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-semibold text-foreground">
            Shows
          </h3>
          <a
            href="/discover/shows"
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            View All →
          </a>
        </div>
        <ShowsCarousel shows={showsData} />
      </section>

      {/* People Carousel */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-semibold text-foreground">
            People
          </h3>
          <a
            href="/discover/people"
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            View All →
          </a>
        </div>
        <PeopleCarousel people={peopleData} />
      </section>
    </>
  );
}
