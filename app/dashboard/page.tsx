import postgres from "postgres";
import { AppLayout } from "../components/layout/AppLayout.js";
import { Card } from "../components/ui/Card.js";
import { Chip } from "../components/ui/Chip.js";
import { Bookmark, Share2, Download } from "lucide-react";

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
          <p className="text-gray-500 text-lg">No summaries available yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Check back soon for finance podcast summaries
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvedSummaries.map((summary) => (
            <Card key={summary.id} hover className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <a 
                    href={`/episode/${summary.episode_id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                  >
                    📄 {summary.title}
                  </a>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>🎙️</span>
                      <span>{summary.youtube_channel_title || 'Unknown Show'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      <span>Host Name</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>
                        {new Date(summary.published_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </span>
                  </div>
                </div>
                
                {/* Action Icons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bookmark size={20} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 size={20} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                In this episode, Josh discusses the key market trends heading into Q1 2026. We explore
                inflation concerns, interest rate predictions, and sector rotation strategies. Josh breaks down
                how geopolitical tensions are affecting global markets and provides actionable insights for
                portfolio positioning.
              </p>

              {/* Thumbnail placeholder */}
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                <span className="text-6xl">📊</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Chip>Federal Reserve</Chip>
                <Chip>Interest Rates</Chip>
                <Chip>Stock Market</Chip>
                <Chip>Portfolio Strategy</Chip>
                <Chip>Geopolitics</Chip>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
