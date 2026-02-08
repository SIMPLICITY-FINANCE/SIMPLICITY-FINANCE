import postgres from "postgres";
import { ArrowLeft, Youtube, Globe, Bookmark, Share2, Download, Podcast, Calendar, X as XIcon } from "lucide-react";
import { notFound } from "next/navigation";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface PersonRow {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  title: string | null;
  bio: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
}

interface AppearanceRow {
  episode_id: string;
  episode_title: string;
  show_name: string;
  published_at: string;
  thumbnail: string | null;
  role: string;
  section_names: string | null;
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  // Look up person by slug
  const personResults = await sql<PersonRow[]>`
    SELECT id, name, slug, emoji, title, bio, youtube_url, twitter_url, website_url
    FROM people
    WHERE slug = ${slug}
    LIMIT 1
  `;

  const person = personResults[0];
  if (!person) {
    notFound();
  }

  // Get real episode appearances via episode_people junction
  const appearances = await sql<AppearanceRow[]>`
    SELECT
      e.id as episode_id,
      COALESCE(s.title, e.youtube_title, 'Untitled') as episode_title,
      COALESCE(e.youtube_channel_title, 'Unknown Show') as show_name,
      COALESCE(s.published_at, e.published_at::text, e.created_at::text) as published_at,
      e.youtube_thumbnail_url as thumbnail,
      ep.role,
      (
        SELECT string_agg(DISTINCT sb.section_name, '||')
        FROM summary_bullets sb
        JOIN episode_summary es ON es.id = sb.summary_id
        WHERE es.episode_id = e.id
      ) as section_names
    FROM episode_people ep
    JOIN episodes e ON e.id = ep.episode_id
    LEFT JOIN episode_summary s ON s.episode_id = e.id
    WHERE ep.person_id = ${person.id}
    ORDER BY COALESCE(s.published_at, e.published_at::text, e.created_at::text) DESC
    LIMIT 20
  `;

  return (
    <>
      {/* Back link */}
      <div className="mb-6">
        <a
          href="/discover/people"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to People
        </a>
      </div>

      {/* Person Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl flex-shrink-0">
            {person.emoji || "👤"}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + title */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <h1 className="text-lg font-bold text-foreground">{person.name}</h1>
              {person.title && (
                <span className="text-sm text-muted-foreground">· {person.title}</span>
              )}
            </div>

            {/* Bio */}
            {person.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {person.bio}
              </p>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-1">
              {person.youtube_url && (
                <a
                  href={person.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              {person.twitter_url && (
                <a
                  href={person.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="X / Twitter"
                >
                  <XIcon size={18} />
                </a>
              )}
              <span
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Save"
              >
                <Bookmark size={18} />
              </span>
              {person.website_url && (
                <a
                  href={person.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="Website"
                >
                  <Globe size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appearances */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <h2 className="text-base font-semibold">Recent Appearances</h2>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>{appearances.length} Appearance{appearances.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="space-y-4">
          {appearances.map((ep) => {
            const tags = ep.section_names
              ? ep.section_names.split("||").slice(0, 5)
              : [];

            return (
              <a
                key={ep.episode_id}
                href={`/episode/${ep.episode_id}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="flex gap-4 p-4">
                    {/* Episode thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {ep.thumbnail ? (
                        <img
                          src={ep.thumbnail}
                          alt={ep.episode_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Podcast size={24} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                            {ep.episode_title}
                          </h3>
                        </div>
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

                      {/* Show + date + role */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Podcast size={12} />
                          {ep.show_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatTimeAgo(ep.published_at)}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-50 text-[10px] font-medium text-gray-500 capitalize">
                          {ep.role}
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

          {appearances.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Podcast size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-muted-foreground text-sm">
                No appearances found yet
              </p>
            </div>
          )}
        </div>
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
