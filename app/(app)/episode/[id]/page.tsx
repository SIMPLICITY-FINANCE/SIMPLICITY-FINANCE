import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, TrendingUp, DollarSign, Target, Cpu, Clock } from "lucide-react";
import { ReportHeader } from "../../../components/episode/ReportHeader.js";
import { AccordionSection } from "../../../components/episode/AccordionSection.js";
import { QuoteCard } from "../../../components/episode/QuoteCard.js";
import { ChecklistCard } from "../../../components/episode/ChecklistCard.js";
import { ChapterCard } from "../../../components/episode/ChapterCard.js";
import { ReferencesGrid } from "../../../components/episode/ReferencesGrid.js";
import { VideoEmbedCard } from "../../../components/episode/VideoEmbedCard.js";
import { DisclaimersCard } from "../../../components/episode/DisclaimersCard.js";
import { sql } from "../../../lib/db.js";

interface PageProps {
  params: Promise<{ id: string }>;
}

const sectionIconMap: Record<string, any> = {
  "GEO-POLITICS": Globe,
  "GEOPOLITICS": Globe,
  "TECHNOLOGY": Cpu,
  "ECONOMY": TrendingUp,
  "MARKETS": DollarSign,
  "FORECASTS": Target,
  "TARGETS": Target,
};

export default async function EpisodePage({ params }: PageProps) {
  const { id } = await params;

  const episodes = await sql`
    SELECT 
      e.id,
      e.youtube_title,
      e.youtube_channel_title,
      e.youtube_description,
      e.youtube_thumbnail_url,
      e.published_at,
      e.created_at,
      e.video_id,
      s.id as summary_id,
      (
        SELECT json_build_object(
          'version', s.version,
          'videoId', s.video_id,
          'title', s.title,
          'publishedAt', s.published_at,
          'sections', (
            SELECT json_agg(
              json_build_object(
                'name', sb.section_name,
                'bullets', (
                  SELECT json_agg(
                    json_build_object(
                      'text', sb2.bullet_text,
                      'confidence', sb2.confidence,
                      'id', sb2.id
                    ) ORDER BY sb2.created_at
                  )
                  FROM summary_bullets sb2
                  WHERE sb2.summary_id = s.id AND sb2.section_name = sb.section_name
                )
              )
            )
            FROM (
              SELECT DISTINCT section_name
              FROM summary_bullets
              WHERE summary_id = s.id
              ORDER BY section_name
            ) sb
          ),
          'keyQuotes', (
            SELECT json_agg(
              json_build_object(
                'text', bullet_text,
                'speaker', 'Unknown',
                'id', id
              )
            )
            FROM summary_bullets
            WHERE summary_id = s.id AND section_name = 'KEY QUOTES'
            LIMIT 10
          )
        )
        FROM episode_summary s
        WHERE s.episode_id = e.id
        LIMIT 1
      ) as summary_json
    FROM episodes e
    LEFT JOIN episode_summary s ON s.episode_id = e.id
    WHERE e.id = ${id}
    LIMIT 1
  `;

  if (episodes.length === 0) {
    notFound();
  }

  const episode = episodes[0]!;
  const summary = episode.summary_json as any;

  const keyQuotes = (summary?.keyQuotes || []).filter((q: any) => q.text);
  const summarySections = (summary?.sections || []).filter(
    (s: any) => s.name !== "KEY QUOTES" && s.bullets && s.bullets.length > 0
  );

  const chapters = summarySections.slice(0, 6).map((section: any, idx: number) => ({
    id: `chapter-${idx}`,
    time: idx === 0 ? "0:00" : `${idx * 8}:${(idx * 15) % 60}`,
    title: section.name,
    bullets: section.bullets.slice(0, 4).map((b: any) => ({
      id: b.id || `bullet-${idx}-${Math.random()}`,
      text: b.text,
    })),
  }));

  const references = [
    {
      personName: "Josh Brown",
      personRole: "Host & CEO of Ritholtz Wealth Management",
      links: [
        { type: "twitter" as const, label: "Twitter/X", url: "https://twitter.com" },
        { type: "youtube" as const, label: "YouTube", url: "https://youtube.com" },
        { type: "substack" as const, label: "Substack", url: "https://substack.com" },
        { type: "website" as const, label: "Website", url: "https://ritholtz.com" },
      ],
    },
    {
      personName: "Barry Ritholtz",
      personRole: "Guest & Chairman of Ritholtz Wealth Management",
      links: [
        { type: "twitter" as const, label: "Twitter/X", url: "https://twitter.com" },
        { type: "youtube" as const, label: "YouTube", url: "https://youtube.com" },
        { type: "substack" as const, label: "Substack", url: "https://substack.com" },
        { type: "website" as const, label: "Website", url: "https://ritholtz.com" },
      ],
    },
  ];

  const tags = summarySections.slice(0, 5).map((s: any) => 
    s.name.split('-').map((word: string) => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  );

  const publishedDate = new Date(episode.published_at || episode.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const youtubeUrl = episode.video_id 
    ? `https://www.youtube.com/watch?v=${episode.video_id}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-6 py-8 space-y-6">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        <ReportHeader
          title={episode.youtube_title || "Untitled Episode"}
          showName={episode.youtube_channel_title || "Unknown Show"}
          peopleLine="Josh Brown & Barry Ritholtz"
          publishedAt={publishedDate}
          intro={episode.youtube_description?.slice(0, 300) || "In this episode, the hosts discuss key market insights and investment strategies."}
          tags={tags}
          heroImageUrl={episode.youtube_thumbnail_url || undefined}
          episodeId={id}
        />

        {keyQuotes.length > 0 && (
          <AccordionSection icon={<span className="text-lg">💬</span>} title="KEY QUOTES">
            <div className="space-y-4">
              {keyQuotes.map((quote: any) => (
                <QuoteCard
                  key={quote.id}
                  id={quote.id}
                  text={quote.text}
                  speaker={quote.speaker || "Unknown"}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {summarySections.length > 0 && (
          <AccordionSection icon={<span className="text-lg">📋</span>} title="SUMMARY">
            <div className="space-y-4">
              {summarySections.map((section: any, idx: number) => {
                const IconComponent = sectionIconMap[section.name] || Globe;
                return (
                  <ChecklistCard
                    key={idx}
                    icon={<IconComponent size={18} />}
                    title={section.name}
                    items={section.bullets.map((b: any) => ({
                      id: b.id || `${idx}-${Math.random()}`,
                      text: b.text,
                    }))}
                  />
                );
              })}
            </div>
          </AccordionSection>
        )}

        {chapters.length > 0 && (
          <AccordionSection icon={<Clock size={18} />} title="CHAPTERS">
            <div className="space-y-4">
              {chapters.map((chapter: any) => (
                <ChapterCard
                  key={chapter.id}
                  id={chapter.id}
                  time={chapter.time}
                  title={chapter.title}
                  bullets={chapter.bullets}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        <AccordionSection icon={<span className="text-lg">🔗</span>} title="LINKS & REFERENCES">
          <ReferencesGrid references={references} />
        </AccordionSection>

        {youtubeUrl && (
          <AccordionSection icon={<span className="text-lg">🎬</span>} title="WATCH FULL EPISODE">
            <VideoEmbedCard
              youtubeUrl={youtubeUrl}
              title={episode.youtube_title || "Episode"}
            />
          </AccordionSection>
        )}

        <DisclaimersCard />
      </div>
    </div>
  );
}
