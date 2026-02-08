import postgres from "postgres";
import { FileText, TrendingUp, TrendingDown, Minus, ArrowLeft, Lightbulb, BarChart3, Calendar, Eye, Globe } from "lucide-react";
import type { MonthlyReportContent, MonthlyTrend, MonthlyDebate, WeeklyTopInsight } from "../../../../lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

const sentimentConfig: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: "Bullish", color: "text-green-700", bg: "bg-green-100" },
  bearish: { label: "Bearish", color: "text-red-700", bg: "bg-red-100" },
  neutral: { label: "Neutral", color: "text-gray-600", bg: "bg-gray-100" },
  mixed: { label: "Mixed", color: "text-amber-700", bg: "bg-amber-100" },
};

const trajCfg: Record<string, { label: string; icon: string; color: string }> = {
  rising: { label: "Rising", icon: "↑", color: "text-green-600" },
  falling: { label: "Falling", icon: "↓", color: "text-red-600" },
  stable: { label: "Stable", icon: "→", color: "text-gray-600" },
};

const durCfg: Record<string, { label: string; color: string }> = {
  durable: { label: "Durable", color: "text-green-700 bg-green-50 border-green-200" },
  fading: { label: "Fading", color: "text-red-700 bg-red-50 border-red-200" },
  emerging: { label: "Emerging", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

function SC({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 p-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">{icon}</div>
        <h2 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default async function MonthlyReportPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return (<div className="text-center py-12"><p className="text-gray-600 text-sm">Invalid month format. Expected: YYYY-MM</p><a href="/reports?tab=monthly" className="text-blue-600 hover:underline text-xs mt-2 inline-block">Back</a></div>);
  }

  const [report] = await sql`SELECT id, title, date, status, content_json, summary, episodes_included, generation_type, generated_at FROM reports WHERE report_type = 'monthly' AND date = ${month} LIMIT 1`;

  if (!report) return (<div className="text-center py-12"><FileText size={40} className="mx-auto text-gray-400 mb-3" /><p className="text-gray-600 text-sm mb-1">No monthly report for {month}</p><a href="/reports?tab=monthly" className="text-blue-600 hover:underline text-xs">Back</a></div>);
  if (report.status === "generating") return (<div className="text-center py-12"><div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-3" /><p className="text-gray-600 text-sm">Generating...</p></div>);
  if (report.status === "failed") return (<div className="text-center py-12"><p className="text-red-600 text-sm mb-1">Failed</p><p className="text-gray-500 text-xs mb-3">{report.summary}</p><a href="/reports?tab=monthly" className="text-blue-600 hover:underline text-xs">Back</a></div>);

  const episodes = await sql`SELECT e.id as episode_id, COALESCE(e.youtube_title,'Untitled') as title, COALESCE(e.youtube_channel_title,'Unknown') as youtube_channel_title, COALESCE(e.published_at::text,e.created_at::text) as published_at, COALESCE(e.video_id,'') as video_id FROM report_episodes re JOIN episodes e ON re.episode_id=e.id WHERE re.report_id=${report.id} ORDER BY e.published_at ASC`;

  const content: MonthlyReportContent | null = report.content_json ? (typeof report.content_json === "string" ? JSON.parse(report.content_json) : report.content_json) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-6 py-8 space-y-6">
        <div className="space-y-4">
          <a href="/reports?tab=monthly" className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900"><ArrowLeft size={14} />Back to Reports</a>
          <div className="flex items-start gap-1.5"><span className="text-sm mt-0.5">📊</span><h1 className="text-base font-bold text-gray-900 leading-tight">{report.title}</h1></div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2"><Calendar size={16} /><span>{month}</span></div>
            <div className="flex items-center gap-2"><FileText size={16} /><span>{report.episodes_included} episodes</span></div>
          </div>
          <div className="border-t border-gray-200" />
        </div>

        {content?.executiveSummary && (
          <SC icon={<span className="text-sm">📋</span>} title="Executive Summary">
            <div className="space-y-3">{content.executiveSummary.split("\n").filter(Boolean).map((p, i) => (<p key={i} className="text-[11px] text-gray-900 leading-snug">{p}</p>))}</div>
          </SC>
        )}

        {content?.durableTrends && content.durableTrends.length > 0 && (
          <SC icon={<span className="text-sm">🏷️</span>} title="Durable Trends">
            <div className="space-y-4">
              {content.durableTrends.map((t: MonthlyTrend, i: number) => {
                const tr = trajCfg[t.trajectory] || trajCfg.stable!;
                const du = durCfg[t.durability] || durCfg.durable!;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Globe size={18} className="text-gray-700" />
                      <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide flex-1">{t.name}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tr.color} bg-gray-50`}>{tr.icon} {tr.label}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${du.color}`}>{du.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug mb-2">{t.significance}</p>
                    {t.weekByWeek && t.weekByWeek.length > 0 && (
                      <div className="space-y-1 pl-4 border-l-2 border-blue-200">
                        {t.weekByWeek.map((w, j) => (<p key={j} className="text-[11px] text-gray-600 leading-snug">{w}</p>))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SC>
        )}

        {content?.keyDebates && content.keyDebates.length > 0 && (
          <SC icon={<span className="text-sm">⚖️</span>} title="Key Debates">
            <div className="space-y-4">
              {content.keyDebates.map((d: MonthlyDebate, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide mb-3">{d.topic}</h3>
                  <div className="space-y-2 mb-3">
                    {d.sides.map((s, j) => (
                      <div key={j} className="bg-gray-50 rounded px-3 py-2 border border-gray-100">
                        <p className="text-[11px] text-gray-900 font-medium mb-1">{s.position}</p>
                        <p className="text-[10px] text-gray-500">Advocates: {s.advocates.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600"><strong>Resolution:</strong> {d.resolution}</p>
                </div>
              ))}
            </div>
          </SC>
        )}

        {content?.sentiment && (
          <SC icon={<BarChart3 size={16} className="text-gray-700" />} title="Market Sentiment">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {(() => { const s = sentimentConfig[content.sentiment.overall] ?? sentimentConfig.neutral!; return (<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${s!.bg} ${s!.color} mb-3`}>{content.sentiment.overall === "bullish" && <TrendingUp size={14} />}{content.sentiment.overall === "bearish" && <TrendingDown size={14} />}{content.sentiment.overall === "neutral" && <Minus size={14} />}{content.sentiment.overall === "mixed" && <BarChart3 size={14} />}{s!.label}</span>); })()}
              <p className="text-[11px] text-gray-700 leading-snug mb-2">{content.sentiment.trajectory}</p>
              {content.sentiment.weeklyProgression && content.sentiment.weeklyProgression.length > 0 && (
                <div className="flex gap-3 text-[10px] text-gray-500 mt-2 flex-wrap">
                  {content.sentiment.weeklyProgression.map((w, i) => { const ws = sentimentConfig[w.sentiment] ?? sentimentConfig.neutral!; return (<span key={i} className={`px-2 py-0.5 rounded-full ${ws!.bg} ${ws!.color}`}>{w.week}: {ws!.label}</span>); })}
                </div>
              )}
            </div>
          </SC>
        )}

        {content?.topInsights && content.topInsights.length > 0 && (
          <SC icon={<Lightbulb size={16} className="text-gray-700" />} title="Top Insights">
            <div className="space-y-4">
              {content.topInsights.map((ins: WeeklyTopInsight, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <p className="text-[11px] text-gray-900 leading-snug mb-2">{ins.insight}</p>
                  <p className="text-[10px] text-gray-600 mb-2">{ins.significance}</p>
                  {ins.sources && ins.sources.length > 0 && (<div className="flex flex-wrap gap-1.5">{ins.sources.map((s, j) => (<span key={j} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{s}</span>))}</div>)}
                </div>
              ))}
            </div>
          </SC>
        )}

        {content?.lookingAhead && (<SC icon={<Eye size={16} className="text-gray-700" />} title="Looking Ahead"><p className="text-[11px] text-gray-900 leading-snug">{content.lookingAhead}</p></SC>)}

        {episodes.length > 0 && (
          <SC icon={<span className="text-sm">🔗</span>} title={`Source Episodes (${episodes.length})`}>
            <div className="space-y-2">
              {episodes.map((ep: any) => (
                <div key={ep.episode_id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <a href={`/episode/${ep.episode_id}`} className="text-[11px] font-medium text-gray-900 hover:text-blue-600">{ep.title}</a>
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
                </div>
              ))}
            </div>
          </SC>
        )}
      </div>
    </div>
  );
}
