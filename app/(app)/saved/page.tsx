import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { Users, Radio } from "lucide-react";
import { SavedEpisodesList } from "./SavedEpisodesList.js";
import { DebugPanel } from "./DebugPanel.js";
import { sql } from "../../lib/db.js";

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
  console.log('[SavedPage] Server: Fetching saved episodes for user:', DEMO_USER_ID);
  
  // Fetch saved episodes
  const savedEpisodes = await sql<SavedEpisode[]>`
    SELECT 
      si.id,
      si.episode_id,
      COALESCE(s.title, e.youtube_title, 'Untitled Episode') as title,
      COALESCE(s.published_at, e.published_at::text) as published_at,
      COALESCE(s.video_id, e.video_id) as video_id,
      e.youtube_channel_title,
      si.created_at as saved_at
    FROM saved_items si
    JOIN episodes e ON si.episode_id = e.id
    LEFT JOIN episode_summary s ON e.id = s.episode_id
    WHERE si.item_type = 'episode'
      AND si.user_id = ${DEMO_USER_ID}
    ORDER BY si.created_at DESC
    LIMIT 50
  `;

  console.log('[SavedPage] Server: Found', savedEpisodes.length, 'saved episodes');
  if (savedEpisodes.length > 0) {
    console.log('[SavedPage] Server: First 3 IDs:', savedEpisodes.slice(0, 3).map(e => e.episode_id));
  }

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
        <SavedEpisodesList initialEpisodes={savedEpisodes} />
      </div>

      {/* Debug Panel (dev only) */}
      <DebugPanel />
    </>
  );
}
