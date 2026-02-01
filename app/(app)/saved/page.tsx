import postgres from "postgres";
import { unsaveEpisode } from "../../lib/actions.js";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { Button } from "../../components/ui/Button.js";
import { Bookmark, Users, Radio } from "lucide-react";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface SavedEpisode {
  id: string;
  episode_id: string;
  title: string;
  published_at: string;
  video_id: string;
  youtube_channel_title: string;
  saved_at: Date;
}

interface FollowedShow {
  id: string;
  youtube_channel_id: string;
  youtube_channel_title: string;
  created_at: Date;
  episode_count: number;
}

interface FollowedPerson {
  id: string;
  person_id: string;
  person_name: string;
  created_at: Date;
}

// Mock user ID for demo (in production, get from auth session)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export default async function SavedPage() {
  // Fetch saved episodes
  const savedEpisodes = await sql<SavedEpisode[]>`
    SELECT 
      si.id,
      si.episode_id,
      s.title,
      s.published_at,
      s.video_id,
      e.youtube_channel_title,
      si.created_at as saved_at
    FROM saved_items si
    JOIN episodes e ON si.episode_id = e.id
    JOIN episode_summary s ON e.id = s.episode_id
    WHERE si.item_type = 'episode'
      AND si.user_id = ${DEMO_USER_ID}
      AND s.approval_status = 'approved'
    ORDER BY si.created_at DESC
    LIMIT 50
  `;

  // Fetch followed shows
  const followedShows = await sql<FollowedShow[]>`
    SELECT 
      fs.id,
      fs.youtube_channel_id,
      fs.youtube_channel_title,
      fs.created_at,
      COUNT(DISTINCT e.id) as episode_count
    FROM followed_shows fs
    LEFT JOIN episodes e ON e.youtube_channel_id = fs.youtube_channel_id
    WHERE fs.user_id = ${DEMO_USER_ID}
    GROUP BY fs.id, fs.youtube_channel_id, fs.youtube_channel_title, fs.created_at
    ORDER BY fs.created_at DESC
  `;

  // Fetch followed people
  const followedPeople = await sql<FollowedPerson[]>`
    SELECT 
      id,
      person_id,
      person_name,
      created_at
    FROM followed_people
    WHERE user_id = ${DEMO_USER_ID}
    ORDER BY created_at DESC
  `;

  return (
    <>
      <div className="mb-6">
        <div className="bg-accent/50 border border-border/50 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong className="font-semibold">Saved vs Notebook:</strong> Save full episodes and reports here. 
            Individual key points go in your Notebook. Follow shows and people to track new content.
          </p>
        </div>
      </div>

      {/* Following Section */}
      {(followedShows.length > 0 || followedPeople.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Following</h2>
          
          {/* Followed Shows */}
          {followedShows.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <Radio size={18} />
                Shows ({followedShows.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {followedShows.map((show) => (
                  <a key={show.id} href={`/discover/shows/${show.youtube_channel_id}`}>
                    <Card className="p-4 hover:shadow-lg transition-all">
                      <h4 className="text-base font-semibold text-foreground mb-2">
                        {show.youtube_channel_title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Chip>{show.episode_count} episodes</Chip>
                        <span className="text-xs text-muted-foreground">
                          Following since {new Date(show.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Followed People */}
          {followedPeople.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <Users size={18} />
                People ({followedPeople.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {followedPeople.map((person) => (
                  <a key={person.id} href={`/discover/people/${person.person_id}`}>
                    <Card className="p-4 hover:shadow-lg transition-all">
                      <h4 className="text-base font-semibold text-foreground mb-2">
                        {person.person_name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        Following since {new Date(person.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Episodes Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Saved Episodes</h2>

        {savedEpisodes.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No saved episodes yet</p>
            <p className="text-muted-foreground/70 text-sm">
              Click "Save" on any episode to add it here
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedEpisodes.map((item) => (
              <Card key={item.id} hover className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <a 
                      href={`/episode/${item.episode_id}`}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors block mb-2"
                    >
                      📄 {item.title}
                    </a>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {item.youtube_channel_title && (
                        <>
                          <span className="flex items-center gap-1">
                            <span>🎙️</span>
                            <span>{item.youtube_channel_title}</span>
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>
                          {new Date(item.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="text-muted-foreground/70">
                        Saved {new Date(item.saved_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a href={`/episode/${item.episode_id}`}>
                    <Button variant="primary" size="sm">
                      View Episode
                    </Button>
                  </a>
                  <a
                    href={`https://www.youtube.com/watch?v=${item.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm">
                      Watch on YouTube →
                    </Button>
                  </a>
                  <form action={unsaveEpisode.bind(null, item.episode_id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
