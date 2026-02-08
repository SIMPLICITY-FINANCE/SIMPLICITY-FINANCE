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

// ─────────────────────────────────────────────────────────────────────────────
// Weekly Report Types
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeTrajectory = "rising" | "falling" | "stable";

export interface WeeklyTheme {
  theme: string;
  trajectory: ThemeTrajectory;
  prominence: number; // 0.0 to 1.0
  evolution: string;
  keyInsights: string[];
  daysActive: number[];
}

export interface NarrativeArc {
  title: string;
  timeline: string[];
  resolution: string;
}

export interface WeeklySentiment {
  overall: MarketSentiment;
  evolution: string;
  weekStart: string;
  weekEnd: string;
}

export interface WeeklyTopInsight {
  insight: string;
  significance: string;
  sources: string[];
}

export interface WeeklyReportContent {
  executiveSummary: string;
  emergingThemes: WeeklyTheme[];
  narrativeArcs: NarrativeArc[];
  sentiment: WeeklySentiment;
  topInsights: WeeklyTopInsight[];
  lookingAhead: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Monthly Report Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MonthlyTrend {
  name: string;
  trajectory: ThemeTrajectory;
  weekByWeek: string[];
  significance: string;
  durability: "durable" | "fading" | "emerging";
}

export interface MonthlyDebate {
  topic: string;
  sides: { position: string; advocates: string[] }[];
  resolution: string;
}

export interface MonthlySentiment {
  overall: MarketSentiment;
  trajectory: string;
  weeklyProgression: { week: string; sentiment: MarketSentiment }[];
}

export interface MonthlyReportContent {
  executiveSummary: string;
  durableTrends: MonthlyTrend[];
  keyDebates: MonthlyDebate[];
  sentiment: MonthlySentiment;
  topInsights: WeeklyTopInsight[];
  lookingAhead: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quarterly Report Types
// ─────────────────────────────────────────────────────────────────────────────

export interface QuarterlyTheme {
  name: string;
  monthByMonth: string[];
  overallTrajectory: ThemeTrajectory;
  significance: string;
}

export interface QuarterlyPrediction {
  prediction: string;
  confidence: number;
  basis: string;
  timeframe: string;
}

export interface QuarterlySentiment {
  overall: MarketSentiment;
  quarterNarrative: string;
  monthlyProgression: { month: string; sentiment: MarketSentiment }[];
}

export interface QuarterlyReportContent {
  executiveSummary: string;
  majorThemes: QuarterlyTheme[];
  predictions: QuarterlyPrediction[];
  sentiment: QuarterlySentiment;
  topInsights: WeeklyTopInsight[];
  lookingAhead: string;
}

/** Union type for all report content */
export type ReportContent = DailyReportContent | WeeklyReportContent | MonthlyReportContent | QuarterlyReportContent;

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
