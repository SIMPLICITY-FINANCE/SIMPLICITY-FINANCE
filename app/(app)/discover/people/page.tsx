import postgres from "postgres";
import { Users } from "lucide-react";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface PersonRow {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  title: string | null;
  episode_count: number;
  shows: string | null;
}

export default async function DiscoverPeoplePage() {
  const people = await sql<PersonRow[]>`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.emoji,
      p.title,
      COUNT(DISTINCT ep.episode_id)::int as episode_count,
      (
        SELECT string_agg(DISTINCT e.youtube_channel_title, ', ')
        FROM episode_people ep2
        JOIN episodes e ON e.id = ep2.episode_id
        WHERE ep2.person_id = p.id
          AND e.youtube_channel_title IS NOT NULL
      ) as shows
    FROM people p
    LEFT JOIN episode_people ep ON ep.person_id = p.id
    GROUP BY p.id
    ORDER BY COUNT(DISTINCT ep.episode_id) DESC, p.name ASC
  `;

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        <a
          href="/discover/shows"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Shows
        </a>
        <a
          href="/discover/people"
          className="px-4 py-2 text-sm font-semibold text-foreground border-b-2 border-foreground"
        >
          People
        </a>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-6">
        People ({people.length})
      </h2>

      {people.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-muted-foreground text-lg mb-1">No people found</p>
          <p className="text-muted-foreground/70 text-sm">
            People will appear here as episodes are processed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {people.map((person) => (
            <a
              key={person.id}
              href={`/discover/people/${person.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200">
                {/* Person header */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                    {person.emoji || "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {person.episode_count} episode{person.episode_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Shows */}
                {person.shows && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                    {person.shows}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
