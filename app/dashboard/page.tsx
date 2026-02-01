import postgres from "postgres";
import { AppLayout } from "../components/layout/AppLayout.js";
import { Card } from "../components/ui/Card.js";
import { FeedEpisodeCard } from "../components/feed/FeedEpisodeCard.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface ApprovedSummary {
  id: string;
  title: string;
  published_at: string;
  video_id: string;
  qc_score: number;
  created_at: Date;
  episode_id: string;
  bullet_count: number;
  youtube_channel_title?: string;
}

export default async function DashboardPage() {
  const approvedSummaries = await sql<ApprovedSummary[]>`
    SELECT 
      s.id,
      s.title,
      s.published_at,
      s.video_id,
      s.created_at,
      s.episode_id,
      q.qc_score,
      e.youtube_channel_title,
      (SELECT COUNT(*) FROM summary_bullets WHERE summary_id = s.id) as bullet_count
    FROM episode_summary s
    LEFT JOIN qc_runs q ON s.id = q.summary_id
    LEFT JOIN episodes e ON s.episode_id = e.id
    WHERE s.approval_status = 'approved'
    ORDER BY s.published_at DESC
    LIMIT 50
  `;

  return (
    <AppLayout showRightRail={true} searchPlaceholder="Search episodes...">
      {approvedSummaries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No summaries available yet</p>
          <p className="text-muted-foreground/70 text-sm mt-2">
            Check back soon for finance podcast summaries
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {approvedSummaries.map((summary) => (
            <FeedEpisodeCard
              key={summary.id}
              title={summary.title}
              show={summary.youtube_channel_title || 'Unknown Show'}
              host="Host Name"
              date={new Date(summary.published_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              summary="In this episode, Josh discusses the key market trends heading into Q1 2026. We explore inflation concerns, interest rate predictions, and sector rotation strategies. Josh breaks down how geopolitical tensions are affecting global markets and provides actionable insights for portfolio positioning."
              thumbnail={`https://img.youtube.com/vi/${summary.video_id}/maxresdefault.jpg`}
              topics={['Federal Reserve', 'Interest Rates', 'Stock Market', 'Portfolio Strategy', 'Geopolitics']}
              videoId={summary.video_id}
              episodeId={summary.episode_id}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
