import postgres from "postgres";
import { FileText, TrendingUp, TrendingDown, Minus, ArrowLeft, Lightbulb, BarChart3, Calendar, Mic, Eye, Globe, Quote as QuoteIcon } from "lucide-react";
import type { DailyReportContent, ReportInsight, ReportTheme, NotableMoment, InsightEvidence } from "../../../../lib/reports/types.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface ReportRow {
  id: string;
  title: string;
  date: string;
  status: string;
  content_json: DailyReportContent | null;
  summary: string;
  episodes_included: number;
  generation_type: string;
  generated_at: string | null;
  created_at: string;
}

interface ReportEpisodeRow {
  episode_id: string;
  title: string;
  youtube_channel_title: string;
  published_at: string;
  video_id: string;
}

// ─── Helpers matching episode design tokens ──────────────────────────────────

const sentimentConfig: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: "Bullish", color: "text-green-700", bg: "bg-green-100" },
  bearish: { label: "Bearish", color: "text-red-700",   bg: "bg-red-100" },
  neutral: { label: "Neutral", color: "text-gray-600",  bg: "bg-gray-100" },
  mixed:   { label: "Mixed",   color: "text-amber-700", bg: "bg-amber-100" },
};

const consensusConfig: Record<string, { label: string; color: string }> = {
  strong_agreement: { label: "Strong Agreement", color: "text-green-700 bg-green-50 border-green-200" },
  mixed:            { label: "Mixed Views",      color: "text-amber-700 bg-amber-50 border-amber-200" },
  divided:          { label: "Divided",           color: "text-red-700 bg-red-50 border-red-200" },
};

// ─── Section card wrapper (matches AccordionSection styling) ─────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DailyReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-sm">Invalid date format</p>
          <a href="/reports" className="text-blue-600 hover:underline text-xs mt-2 inline-block">Back to Reports</a>
        </div>
      </div>
    );
  }

  const [report] = await sql<ReportRow[]>`
    SELECT id, title, date, status, content_json, summary,
      episodes_included, generation_type, generated_at, created_at
    FROM reports WHERE report_type = 'daily' AND date = ${date} LIMIT 1
  `;

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-6 py-8 text-center">
          <FileText size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 text-sm mb-1">No report for {date}</p>
          <p className="text-gray-500 text-xs mb-3">A daily report hasn't been generated for this date yet.</p>
          <a href="/reports" className="text-blue-600 hover:underline text-xs">Back to Reports</a>
        </div>
      </div>
    );
  }

  if (report.status === "generating") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-6 py-8 text-center">
          <div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-3" />
          <p className="text-gray-600 text-sm mb-1">Generating report for {date}...</p>
          <p className="text-gray-500 text-xs">This usually takes 30-60 seconds.</p>
        </div>
      </div>
    );
  }

  if (report.status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-6 py-8 text-center">
          <p className="text-red-600 text-sm mb-1">Report generation failed</p>
          <p className="text-gray-500 text-xs mb-3">{report.summary}</p>
          <a href="/reports" className="text-blue-600 hover:underline text-xs">Back to Reports</a>
        </div>
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

  const content: DailyReportContent | null = report.content_json
    ? (typeof report.content_json === 'string' ? JSON.parse(report.content_json as unknown as string) : report.content_json)
    : null;

  const displayDate = new Date(date + "T12:00:00Z").toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Get first ~200 chars of executive summary as preview
  const previewText = content?.executiveSummary
    ? content.executiveSummary.substring(0, 280).replace(/\n/g, ' ') + (content.executiveSummary.length > 280 ? '...' : '')
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-6 py-8 space-y-6">

        {/* ═══ HEADER (matches ReportHeader pattern) ═══ */}
        <div className="space-y-4">
          {/* Back link */}
          <a href="/reports" className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={14} />
            Back to Reports
          </a>

          {/* Title */}
          <div className="flex items-start gap-1.5">
            <span className="text-sm mt-0.5 flex-shrink-0">📊</span>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              {report.title}
            </h1>
          </div>

          {/* Meta row (matches episode: icon + text pairs) */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{displayDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{report.episodes_included} episodes analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic size={16} />
              <span>{report.generation_type === "auto" ? "Auto-generated" : "Manual"}</span>
            </div>
          </div>

          {/* Preview text (not in card, like episode intro) */}
          {previewText && (
            <p className="text-[11px] text-gray-700 leading-snug">
              {previewText}
            </p>
          )}

          {/* Theme pills (matches episode tag pills exactly) */}
          {content?.themes && content.themes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {content.themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200" />
        </div>

        {/* ═══ EXECUTIVE SUMMARY (matches AccordionSection + content card) ═══ */}
        {content?.executiveSummary && (
          <SectionCard icon={<span className="text-sm">📋</span>} title="Executive Summary">
            <div className="space-y-3">
              {content.executiveSummary.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-[11px] text-gray-900 leading-snug">
                  {paragraph}
                </p>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ═══ KEY INSIGHTS (each insight = its own card, like ChecklistCard) ═══ */}
        {content?.insights && content.insights.length > 0 && (
          <SectionCard icon={<Lightbulb size={16} className="text-gray-700" />} title="Key Insights">
            <div className="space-y-4">
              {content.insights.map((insight: ReportInsight, i: number) => (
                <div key={insight.id || i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  {/* Insight theme header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-700">
                      <Globe size={18} />
                    </div>
                    <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
                      {insight.theme || `Insight ${i + 1}`}
                    </h3>
                  </div>

                  {/* Main insight text */}
                  <p className="text-[11px] text-gray-900 leading-snug mb-3">
                    {insight.text}
                  </p>

                  {/* Evidence trail (indented, lighter — like quote attributions) */}
                  {insight.evidence && insight.evidence.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {insight.evidence.map((ev: InsightEvidence, j: number) => (
                        <div key={j}>
                          <p className="text-[11px] text-gray-700 italic leading-snug">
                            "{ev.quote}"
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`/episode/${ev.episodeId}`}
                              className="text-[11px] text-blue-600 hover:underline"
                            >
                              {ev.episodeTitle}
                            </a>
                            {ev.timestamp && ev.timestamp !== "N/A" && (
                              <span className="text-[10px] text-gray-500">({ev.timestamp})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Source episodes footer */}
                  {insight.evidence && insight.evidence.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1">Source Episodes:</p>
                      <div className="flex gap-2 flex-wrap">
                        {[...new Set(insight.evidence.map(ev => JSON.stringify({ id: ev.episodeId, title: ev.episodeTitle })))].map((key, k) => {
                          const ep = JSON.parse(key);
                          return (
                            <a key={k} href={`/episode/${ep.id}`} className="text-[11px] text-blue-600 hover:underline">
                              {ep.title}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ═══ THEMES DISCUSSED ═══ */}
        {content?.themes && content.themes.length > 0 && (
          <SectionCard icon={<span className="text-sm">🏷️</span>} title="Themes Discussed">
            <div className="space-y-4">
              {content.themes.map((theme: ReportTheme, i: number) => {
                const cons = consensusConfig[theme.consensus] ?? consensusConfig.mixed!;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-5 h-5 flex items-center justify-center text-gray-700">
                        <Globe size={18} />
                      </div>
                      <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide flex-1">
                        {theme.name}
                      </h3>
                      <span className="text-[10px] text-gray-500">
                        {theme.episodeCount} episode{theme.episodeCount !== 1 ? 's' : ''}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cons!.color}`}>
                        {cons!.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug mb-3">
                      {theme.summary}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.round((theme.prominence || 0.5) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {Math.round((theme.prominence || 0.5) * 100)}% prominence
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ═══ MARKET SENTIMENT ═══ */}
        {content?.sentiment && (
          <SectionCard icon={<BarChart3 size={16} className="text-gray-700" />} title="Market Sentiment">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {/* Overall badge + breakdown */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {(() => {
                  const s = sentimentConfig[content.sentiment.overall] ?? sentimentConfig.neutral!;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${s!.bg} ${s!.color}`}>
                      {content.sentiment.overall === 'bullish' && <TrendingUp size={14} />}
                      {content.sentiment.overall === 'bearish' && <TrendingDown size={14} />}
                      {content.sentiment.overall === 'neutral' && <Minus size={14} />}
                      {content.sentiment.overall === 'mixed' && <BarChart3 size={14} />}
                      {s!.label}
                    </span>
                  );
                })()}

                {content.sentiment.breakdown && (
                  <div className="flex items-center gap-3 text-[11px] text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {content.sentiment.breakdown.bullish} bullish
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {content.sentiment.breakdown.bearish} bearish
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      {content.sentiment.breakdown.neutral} neutral
                    </span>
                  </div>
                )}
              </div>

              {/* Sentiment bar */}
              {content.sentiment.breakdown && (
                <div className="flex w-full h-2 rounded-full overflow-hidden mb-3">
                  {content.sentiment.breakdown.bullish > 0 && (
                    <div className="bg-green-500" style={{ width: `${(content.sentiment.breakdown.bullish / report.episodes_included) * 100}%` }} />
                  )}
                  {content.sentiment.breakdown.neutral > 0 && (
                    <div className="bg-gray-300" style={{ width: `${(content.sentiment.breakdown.neutral / report.episodes_included) * 100}%` }} />
                  )}
                  {content.sentiment.breakdown.bearish > 0 && (
                    <div className="bg-red-500" style={{ width: `${(content.sentiment.breakdown.bearish / report.episodes_included) * 100}%` }} />
                  )}
                </div>
              )}

              <p className="text-[11px] text-gray-700 leading-snug">{content.sentiment.reasoning}</p>
            </div>
          </SectionCard>
        )}

        {/* ═══ NOTABLE MOMENTS ═══ */}
        {content?.notableMoments && content.notableMoments.length > 0 && (
          <SectionCard icon={<span className="text-sm">💬</span>} title="Notable Moments">
            <div className="space-y-4">
              {content.notableMoments.map((moment: NotableMoment, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-3">
                  <QuoteIcon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-900 leading-snug mb-1">
                      "{moment.quote}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-gray-600">—</span>
                      <a href={`/episode/${moment.episodeId}`} className="text-blue-600 hover:underline">
                        {moment.episodeTitle}
                      </a>
                      {moment.timestamp && moment.timestamp !== "N/A" && (
                        <span className="text-gray-500">({moment.timestamp})</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5 bg-gray-50 rounded px-2 py-1 inline-block border border-gray-100">
                      {moment.whyNotable}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ═══ LOOKING AHEAD ═══ */}
        {content?.lookingAhead && (
          <SectionCard icon={<Eye size={16} className="text-gray-700" />} title="Looking Ahead">
            <p className="text-[11px] text-gray-900 leading-snug">
              {content.lookingAhead}
            </p>
          </SectionCard>
        )}

        {/* ═══ SOURCE EPISODES (reference section at bottom) ═══ */}
        {episodes.length > 0 && (
          <SectionCard icon={<span className="text-sm">🔗</span>} title={`Source Episodes (${episodes.length})`}>
            <div className="space-y-2">
              {episodes.map((ep) => (
                <div key={ep.episode_id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/episode/${ep.episode_id}`}
                      className="text-[11px] font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {ep.title}
                    </a>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                      <span>{ep.youtube_channel_title}</span>
                      {ep.published_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(ep.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(ep.published_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} UTC</span>
                        </>
                      )}
                    </div>
                  </div>
                  {ep.video_id && (
                    <a
                      href={`https://www.youtube.com/watch?v=${ep.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gray-500 hover:text-blue-600 ml-3 flex-shrink-0"
                    >
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
