import postgres from "postgres";
import { ShowsCarousel } from "./ShowsCarousel";
import { PeopleCarousel } from "./PeopleCarousel";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface ShowRow {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
  latest_thumbnail: string | null;
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

export default async function DiscoverPage() {
  const [showsData, peopleData] = await Promise.all([
    sql<ShowRow[]>`
      WITH show_stats AS (
        SELECT
          e.youtube_channel_id as channel_id,
          COUNT(DISTINCT e.id)::int as episode_count,
          (
            SELECT e2.youtube_thumbnail_url
            FROM episodes e2
            WHERE e2.youtube_channel_id = e.youtube_channel_id
              AND e2.youtube_thumbnail_url IS NOT NULL
            ORDER BY e2.created_at DESC
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
        ss.latest_thumbnail
      FROM shows s
      FULL OUTER JOIN show_stats ss ON s.channel_id = ss.channel_id
      WHERE s.channel_id IS NOT NULL OR ss.episode_count > 0
      ORDER BY COALESCE(ss.episode_count, 0) DESC, COALESCE(s.name, '') ASC
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
  ]);

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-foreground">Discover</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Explore financial podcasts and expert commentators
        </p>
      </div>

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
