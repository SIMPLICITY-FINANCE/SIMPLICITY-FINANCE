// ─────────────────────────────────────────────────────────────────────────────
// Daily Report Types — Synthesis Approach
// ─────────────────────────────────────────────────────────────────────────────

/** Sentiment values for market analysis */
export type MarketSentiment = "bullish" | "bearish" | "neutral" | "mixed";

/** Consensus level across episodes for a theme */
export type ThemeConsensus = "strong_agreement" | "mixed" | "divided";

/** Evidence trail linking an insight back to a specific episode moment */
export interface InsightEvidence {
  quote: string;
  episodeId: string;
  episodeTitle: string;
  timestamp: string; // e.g. "12:45" or "N/A"
}

/** A synthesized insight drawn from MULTIPLE episodes */
export interface ReportInsight {
  id: string;
  text: string; // The synthesized insight statement
  evidence: InsightEvidence[];
  theme: string; // Which theme this relates to
  confidence: number; // 0.0 to 1.0
}

/** A recurring theme identified across episodes */
export interface ReportTheme {
  name: string;
  episodeCount: number;
  prominence: number; // 0.0 to 1.0
  consensus: ThemeConsensus;
  summary: string; // Synthesized take on this theme
}

/** Structured sentiment with per-show breakdown */
export interface SentimentBreakdown {
  overall: MarketSentiment;
  breakdown: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  reasoning: string;
}

/** A standout moment from any episode */
export interface NotableMoment {
  quote: string;
  episodeId: string;
  episodeTitle: string;
  timestamp: string;
  whyNotable: string;
}

/** The full AI-generated content stored in reports.content_json */
export interface DailyReportContent {
  executiveSummary: string; // 2-3 paragraph narrative
  insights: ReportInsight[];
  themes: ReportTheme[];
  sentiment: SentimentBreakdown;
  notableMoments: NotableMoment[];
  lookingAhead: string; // 1 paragraph forward-looking
}

/** Episode data passed to the AI prompt */
export interface EpisodeForReport {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  sections: {
    name: string;
    bullets: string[];
  }[];
  keyQuotes: string[];
}

/** The shape of a report row from the database */
export interface DailyReportRow {
  id: string;
  title: string;
  report_type: string;
  generation_type: string;
  date: string;
  period_start: string;
  period_end: string;
  status: string;
  content_json: DailyReportContent | null;
  summary: string;
  episodes_included: number;
  generated_by: string;
  approval_status: string;
  generated_at: string | null;
  created_at: string;
}

/** Episode data joined to a report via report_episodes */
export interface ReportEpisodeRow {
  episode_id: string;
  title: string;
  youtube_channel_title: string;
  published_at: string;
  video_id: string;
}
