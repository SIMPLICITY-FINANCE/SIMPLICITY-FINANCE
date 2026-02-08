import postgres from "postgres";
import { FileText, TrendingUp, TrendingDown, Minus, ArrowLeft, Lightbulb, BarChart3, Calendar, Eye, Globe } from "lucide-react";
import type { WeeklyReportContent, WeeklyTheme, NarrativeArc, WeeklyTopInsight } from "../../../../lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface ReportRow {
  id: string;
  title: string;
  date: string;
  status: string;
  content_json: WeeklyReportContent | null;
  summary: string;
  episodes_included: number;
  generation_type: string;
  generated_at: string | null;
}

interface ReportEpisodeRow {
  episode_id: string;
  title: string;
  youtube_channel_title: string;
  published_at: string;
  video_id: string;
}

const sentimentConfig: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: "Bullish", color: "text-green-700", bg: "bg-green-100" },
  bearish: { label: "Bearish", color: "text-red-700", bg: "bg-red-100" },
  neutral: { label: "Neutral", color: "text-gray-600", bg: "bg-gray-100" },
  mixed: { label: "Mixed", color: "text-amber-700", bg: "bg-amber-100" },
};

const trajectoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  rising: { label: "Rising", icon: "↑", color: "text-green-600" },
  falling: { label: "Falling", icon: "↓", color: "text-red-600" },
  stable: { label: "Stable", icon: "→", color: "text-gray-600" },
};

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 p-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default async function WeeklyReportPage({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;

  // Validate format: 2025-W06
  if (!/^\d{4}-W\d{2}$/.test(week)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-sm">Invalid week format. Expected: YYYY-WNN</p>
        <a href="/reports?tab=weekly" className="text-blue-600 hover:underline text-xs mt-2 inline-block">Back to Reports</a>
      </div>
    );
  }

  const [report] = await sql<ReportRow[]>`
    SELECT id, title, date, status, content_json, summary,
      episodes_included, generation_type, generated_at
    FROM reports WHERE report_type = 'weekly' AND date = ${week} LIMIT 1
  `;

  if (!report) {
    return (
      <div className="text-center py-12">
        <FileText size={40} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 text-sm mb-1">No weekly report for {week}</p>
        <a href="/reports?tab=weekly" className="text-blue-600 hover:underline text-xs">Back to Reports</a>
      </div>
    );
  }

  if (report.status === "generating") {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Generating weekly report for {week}...</p>
      </div>
    );
  }

  if (report.status === "failed") {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-sm mb-1">Report generation failed</p>
        <p className="text-gray-500 text-xs mb-3">{report.summary}</p>
        <a href="/reports?tab=weekly" className="text-blue-600 hover:underline text-xs">Back to Reports</a>
      </div>
    );
  }

  const episodes = await sql<ReportEpisodeRow[]>`
    SELECT e.id as episode_id,
      COALESCE(e.youtube_title, 'Untitled') as title,
      COALESCE(e.youtube_channel_title, 'Unknown') as youtube_channel_title,
      COALESCE(e.published_at::text, e.created_at::text) as published_at,
      COALESCE(e.video_id, '') as video_id
    FROM report_episodes re
    JOIN episodes e ON re.episode_id = e.id
    WHERE re.report_id = ${report.id}
    ORDER BY e.published_at ASC
  `;

  const content: WeeklyReportContent | null = report.content_json
    ? (typeof report.content_json === "string" ? JSON.parse(report.content_json as unknown as string) : report.content_json)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="space-y-4">
          <a href="/reports?tab=weekly" className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={14} />
            Back to Reports
          </a>

          <div className="flex items-start gap-1.5">
            <span className="text-sm mt-0.5 flex-shrink-0">📊</span>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{report.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{week}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{report.episodes_included} episodes analyzed</span>
            </div>
          </div>

          {content?.emergingThemes && content.emergingThemes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {content.emergingThemes.map((theme, i) => {
                const traj = trajectoryConfig[theme.trajectory] || trajectoryConfig.stable!;
                return (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
                    <span className={traj.color}>{traj.icon}</span> {theme.theme}
                  </span>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-200" />
        </div>

        {/* Executive Summary */}
        {content?.executiveSummary && (
          <SectionCard icon={<span className="text-sm">📋</span>} title="Executive Summary">
            <div className="space-y-3">
              {content.executiveSummary.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="text-[11px] text-gray-900 leading-snug">{p}</p>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Emerging Themes */}
        {content?.emergingThemes && content.emergingThemes.length > 0 && (
          <SectionCard icon={<span className="text-sm">🏷️</span>} title="Emerging Themes">
            <div className="space-y-4">
              {content.emergingThemes.map((theme: WeeklyTheme, i: number) => {
                const traj = trajectoryConfig[theme.trajectory] || trajectoryConfig.stable!;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Globe size={18} className="text-gray-700" />
                      <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide flex-1">
                        {theme.theme}
                      </h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${traj.color} bg-gray-50`}>
                        {traj.icon} {traj.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug mb-3">{theme.evolution}</p>
                    {theme.keyInsights && theme.keyInsights.length > 0 && (
                      <ul className="space-y-1 pl-4">
                        {theme.keyInsights.map((insight, j) => (
                          <li key={j} className="text-[11px] text-gray-600 leading-snug list-disc">{insight}</li>
                        ))}
                      </ul>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round((theme.prominence || 0.5) * 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{Math.round((theme.prominence || 0.5) * 100)}% prominence</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Narrative Arcs */}
        {content?.narrativeArcs && content.narrativeArcs.length > 0 && (
          <SectionCard icon={<span className="text-sm">📖</span>} title="Narrative Arcs">
            <div className="space-y-4">
              {content.narrativeArcs.map((arc: NarrativeArc, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide mb-3">{arc.title}</h3>
                  <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                    {arc.timeline.map((entry, j) => (
                      <p key={j} className="text-[11px] text-gray-700 leading-snug">{entry}</p>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-3 bg-gray-50 rounded px-3 py-2 border border-gray-100">
                    <strong>Resolution:</strong> {arc.resolution}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Sentiment */}
        {content?.sentiment && (
          <SectionCard icon={<BarChart3 size={16} className="text-gray-700" />} title="Market Sentiment">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {(() => {
                const s = sentimentConfig[content.sentiment.overall] ?? sentimentConfig.neutral!;
                return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${s!.bg} ${s!.color} mb-3`}>
                    {content.sentiment.overall === "bullish" && <TrendingUp size={14} />}
                    {content.sentiment.overall === "bearish" && <TrendingDown size={14} />}
                    {content.sentiment.overall === "neutral" && <Minus size={14} />}
                    {content.sentiment.overall === "mixed" && <BarChart3 size={14} />}
                    {s!.label}
                  </span>
                );
              })()}
              <p className="text-[11px] text-gray-700 leading-snug mb-2">{content.sentiment.evolution}</p>
              {content.sentiment.weekStart && (
                <div className="flex gap-4 text-[10px] text-gray-500 mt-2">
                  <span><strong>Start of week:</strong> {content.sentiment.weekStart}</span>
                  <span><strong>End of week:</strong> {content.sentiment.weekEnd}</span>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* Top Insights */}
        {content?.topInsights && content.topInsights.length > 0 && (
          <SectionCard icon={<Lightbulb size={16} className="text-gray-700" />} title="Top Insights">
            <div className="space-y-4">
              {content.topInsights.map((insight: WeeklyTopInsight, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <p className="text-[11px] text-gray-900 leading-snug mb-2">{insight.insight}</p>
                  <p className="text-[10px] text-gray-600 mb-2">{insight.significance}</p>
                  {insight.sources && insight.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {insight.sources.map((src, j) => (
                        <span key={j} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{src}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Looking Ahead */}
        {content?.lookingAhead && (
          <SectionCard icon={<Eye size={16} className="text-gray-700" />} title="Looking Ahead">
            <p className="text-[11px] text-gray-900 leading-snug">{content.lookingAhead}</p>
          </SectionCard>
        )}

        {/* Source Episodes */}
        {episodes.length > 0 && (
          <SectionCard icon={<span className="text-sm">🔗</span>} title={`Source Episodes (${episodes.length})`}>
            <div className="space-y-2">
              {episodes.map((ep) => (
                <div key={ep.episode_id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <a href={`/episode/${ep.episode_id}`} className="text-[11px] font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {ep.title}
                    </a>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                      <span>{ep.youtube_channel_title}</span>
                      {ep.published_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(ep.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(ep.published_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} UTC</span>
                        </>
                      )}
                    </div>
                  </div>
                  {ep.video_id && (
                    <a href={`https://www.youtube.com/watch?v=${ep.video_id}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-blue-600 ml-3 flex-shrink-0">
                      YouTube →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>
    </div>
  );
}
