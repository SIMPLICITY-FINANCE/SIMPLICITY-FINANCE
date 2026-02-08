import postgres from "postgres";
import { ArrowLeft, Youtube, Globe, Bookmark, Share2, Download, Podcast, Calendar, X as XIcon } from "lucide-react";
import { notFound } from "next/navigation";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface Person {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  shows: string[];
  episodeCount: number;
}

interface Appearance {
  id: string;
  title: string;
  show_name: string;
  published_at: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
}

// Demo people data — will be replaced with DB table
const demoPeople: Record<string, Person> = {
  "1": {
    id: "1",
    name: "Ray Dalio",
    avatar: "👨‍💼",
    title: "Founder of Bridgewater Associates",
    bio: "Founder of Bridgewater Associates, one of the world's largest hedge funds. Author of Principles. Known for pioneering radical transparency and systematic decision-making approaches in investment management.",
    youtubeUrl: "https://youtube.com/@RayDalio",
    twitterUrl: "https://twitter.com/RayDalio",
    websiteUrl: "https://www.principles.com",
    shows: ["The Compound and Friends", "All-In Podcast"],
    episodeCount: 3,
  },
  "2": {
    id: "2",
    name: "Cathie Wood",
    avatar: "👩‍💼",
    title: "CEO of ARK Invest",
    bio: "Founder, CEO, and CIO of ARK Invest, an investment management firm focused on disruptive innovation. Known for her bold predictions on technology stocks and thematic investing strategies.",
    youtubeUrl: "https://youtube.com/@ARKInvest",
    twitterUrl: "https://twitter.com/CathieDWood",
    websiteUrl: "https://ark-invest.com",
    shows: ["Coin Bureau", "All-In Podcast"],
    episodeCount: 2,
  },
  "3": {
    id: "3",
    name: "Michael Burry",
    avatar: "👨",
    title: "Founder of Scion Asset Management",
    bio: "Physician turned hedge fund manager, famous for predicting the 2008 financial crisis. Founder of Scion Asset Management. Known for deep value investing and contrarian market analysis.",
    twitterUrl: "https://twitter.com/michaeljburry",
    shows: ["Eurodollar University"],
    episodeCount: 1,
  },
  "4": {
    id: "4",
    name: "Janet Yellen",
    avatar: "👩‍🦳",
    title: "U.S. Secretary of the Treasury",
    bio: "78th United States Secretary of the Treasury and former Chair of the Federal Reserve. An influential voice on monetary policy, economic stability, and fiscal responsibility.",
    websiteUrl: "https://home.treasury.gov",
    shows: ["All-In Podcast", "Eurodollar University"],
    episodeCount: 2,
  },
  "5": {
    id: "5",
    name: "Josh Brown",
    avatar: "👨‍💻",
    title: "CEO of Ritholtz Wealth Management",
    bio: "CEO of Ritholtz Wealth Management and co-host of The Compound. Known for his insights on markets, investing, and financial planning. Author of multiple bestselling books on investing.",
    youtubeUrl: "https://youtube.com/@TheCompoundNews",
    twitterUrl: "https://twitter.com/ReformedBroker",
    websiteUrl: "https://thereformedbroker.com",
    shows: ["The Compound and Friends"],
    episodeCount: 4,
  },
  "6": {
    id: "6",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    title: "CEO of Social Capital",
    bio: "Founder and CEO of Social Capital. Former Facebook executive and venture capitalist focused on technology, healthcare, and climate. Co-host of the All-In Podcast.",
    twitterUrl: "https://twitter.com/chaaborz",
    websiteUrl: "https://www.socialcapital.com",
    shows: ["All-In Podcast"],
    episodeCount: 3,
  },
  "7": {
    id: "7",
    name: "Tracy Alloway",
    avatar: "�‍💼",
    title: "Bloomberg Reporter",
    bio: "Bloomberg reporter and co-host of Odd Lots. Covers markets, economics, and finance with deep dives into complex topics from plumbing of financial markets to global macro.",
    twitterUrl: "https://twitter.com/tracyalloway",
    shows: ["Odd Lots"],
    episodeCount: 5,
  },
  "8": {
    id: "8",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    title: "CEO of Positive Sum",
    bio: "CEO of Positive Sum and host of Invest Like the Best. Explores investing, business, and decision-making with top investors and entrepreneurs.",
    twitterUrl: "https://twitter.com/patrick_oshag",
    websiteUrl: "https://www.joincolossus.com",
    shows: ["Invest Like the Best"],
    episodeCount: 2,
  },
};

// Demo appearances for each person
const demoAppearances: Record<string, Appearance[]> = {
  "1": [
    {
      id: "demo-1a",
      title: "Understanding the Changing World Order",
      show_name: "The Compound and Friends",
      published_at: "2026-02-05T00:00:00Z",
      description: "Ray discusses his perspectives on the changing global economic order, analyzing historical patterns of rising and declining empires. He explores how these cycles affect modern investing and provides insights on navigating the current geopolitical landscape.",
      thumbnail: null,
      tags: ["Economics", "Geopolitics", "Investing", "History", "Strategy"],
    },
    {
      id: "demo-1b",
      title: "Principles for Navigating Big Debt Crises",
      show_name: "Planet Money",
      published_at: "2026-01-29T00:00:00Z",
      description: "An in-depth conversation about debt cycles and how to prepare for economic downturns. Ray shares principles from his extensive research on historical debt crises and provides actionable frameworks for investors and policymakers.",
      thumbnail: null,
      tags: ["Debt", "Economics", "Crisis Management", "Policy", "Markets"],
    },
    {
      id: "demo-1c",
      title: "The Future of Capitalism",
      show_name: "All-In Podcast",
      published_at: "2026-01-22T00:00:00Z",
      description: "Ray examines the current state of capitalism and proposes reforms needed for a more sustainable economic system. He discusses wealth inequality, productivity, and the role of policy in shaping our economic future.",
      thumbnail: null,
      tags: ["Capitalism", "Reform", "Policy", "Inequality", "Economics"],
    },
  ],
};

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = demoPeople[id];

  if (!person) {
    notFound();
  }

  // Try to get real episode appearances from DB, fall back to demo data
  let appearances: Appearance[] = demoAppearances[id] || [];

  // Attempt to fetch real episodes that mention this person's name in title
  try {
    const realEpisodes = await sql<Array<{
      id: string;
      title: string;
      show_name: string;
      published_at: string;
      thumbnail: string | null;
      section_names: string | null;
    }>>`
      SELECT
        e.id,
        s.title,
        COALESCE(e.youtube_channel_title, 'Unknown Show') as show_name,
        COALESCE(s.published_at, e.published_at::text, e.created_at::text) as published_at,
        e.youtube_thumbnail_url as thumbnail,
        (
          SELECT string_agg(DISTINCT sb.section_name, '||')
          FROM summary_bullets sb
          WHERE sb.summary_id = s.id
        ) as section_names
      FROM episodes e
      JOIN episode_summary s ON e.id = s.episode_id
      WHERE e.is_published = true
        AND s.approval_status = 'approved'
      ORDER BY s.published_at DESC
      LIMIT 10
    `;

    if (realEpisodes.length > 0) {
      appearances = realEpisodes.map((ep) => ({
        id: ep.id,
        title: ep.title,
        show_name: ep.show_name,
        published_at: ep.published_at,
        description: "",
        thumbnail: ep.thumbnail,
        tags: ep.section_names
          ? ep.section_names.split("||").slice(0, 5)
          : [],
      }));
    }
  } catch {
    // Fall back to demo data
  }

  const displayCount = appearances.length || person.episodeCount;

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
            {person.avatar}
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
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {person.bio}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-1">
              {person.youtubeUrl && (
                <a
                  href={person.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              {person.twitterUrl && (
                <a
                  href={person.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="X / Twitter"
                >
                  <XIcon size={18} />
                </a>
              )}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                title="Save"
              >
                <Bookmark size={18} />
              </button>
              {person.websiteUrl && (
                <a
                  href={person.websiteUrl}
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
            <span>{displayCount} Appearances</span>
          </div>
        </div>

        <div className="space-y-4">
          {appearances.map((episode) => (
            <a
              key={episode.id}
              href={`/episode/${episode.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="flex gap-4 p-4">
                  {/* Episode thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {episode.thumbnail ? (
                      <img
                        src={episode.thumbnail}
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
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                          {episode.title}
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

                    {/* Show + date */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Podcast size={12} />
                        {episode.show_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatTimeAgo(episode.published_at)}
                      </span>
                    </div>

                    {/* Description */}
                    {episode.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                        {episode.description}
                      </p>
                    )}

                    {/* Tags */}
                    {episode.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {episode.tags.map((tag) => (
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
          ))}

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
