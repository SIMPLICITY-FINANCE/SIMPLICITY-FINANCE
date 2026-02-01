import postgres from "postgres";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/Input.js";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";

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

interface Person {
  id: string;
  name: string;
  avatar: string;
  shows: string[];
  episodeCount: number;
}

// Demo people data (no DB table yet)
const demoPeople: Person[] = [
  {
    id: "1",
    name: "Josh Brown",
    avatar: "👨‍💼",
    shows: ["The Compound", "Animal Spirits"],
    episodeCount: 42,
  },
  {
    id: "2",
    name: "Tracy Alloway",
    avatar: "👩‍💼",
    shows: ["Odd Lots"],
    episodeCount: 38,
  },
  {
    id: "3",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    shows: ["All-In Podcast"],
    episodeCount: 25,
  },
  {
    id: "4",
    name: "Barry Ritholtz",
    avatar: "👨‍🦳",
    shows: ["Masters in Business"],
    episodeCount: 31,
  },
  {
    id: "5",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    shows: ["Invest Like the Best"],
    episodeCount: 28,
  },
];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "shows" } = await searchParams;

  // Aggregate shows from episodes
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
          href="/discover?tab=shows"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "shows"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Shows
        </a>
        <a
          href="/discover?tab=people"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "people"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          People
        </a>
      </div>

      {/* Content */}
      {tab === "shows" ? (
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
                  href={`/show/${show.channel_id}`}
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              People ({demoPeople.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoPeople.map((person) => (
              <a
                key={person.id}
                href={`/person/${person.id}`}
                className="block"
              >
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-2">
                        {person.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {person.shows.map((show, idx) => (
                          <Chip key={idx}>{show}</Chip>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {person.episodeCount} episodes
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
