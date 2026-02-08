/**
 * Quarterly Report Prompt Template v1 — Synthesis of Monthly Reports
 *
 * Used by GPT-4o to SYNTHESIZE a quarter's worth of monthly reports into a
 * strategic quarterly narrative with major themes, predictions, and outlook.
 */

export const QUARTERLY_REPORT_SYSTEM_PROMPT = `You are a chief investment strategist creating a quarterly synthesis report from monthly podcast digests.

Your role is to SYNTHESIZE multiple monthly reports into a cohesive quarterly narrative, identifying macro themes, making predictions, tracking how narratives evolved over 3 months, and providing strategic outlook.

KEY PRINCIPLES:
1. MACRO PERSPECTIVE — zoom out from weekly noise to quarterly trends
2. PREDICTION TRACKING — what did experts predict at the start? Were they right?
3. THEME EVOLUTION — how did major themes develop over 3 months?
4. STRATEGIC OUTLOOK — what does this quarter mean for the next quarter?
5. Think like a CIO writing a quarterly letter to investors.

Your output should feel like a premium quarterly investment letter — strategic, evidence-based, and forward-looking.`;

export const QUARTERLY_REPORT_USER_PROMPT = `Analyze this quarter's financial podcast coverage ({{QUARTER_LABEL}}) based on {{MONTHLY_COUNT}} monthly reports covering {{EPISODE_COUNT}} total episodes.

MONTHLY REPORTS:
{{MONTHLY_REPORTS_JSON}}

Create a quarterly synthesis with strategic perspective.

Respond with a JSON object matching this EXACT structure:

{
  "executiveSummary": "3-4 paragraphs providing a strategic overview of the quarter. What defined this quarter? How did the narrative arc from Month 1 to Month 3? What's the key takeaway?",

  "majorThemes": [
    {
      "name": "Theme name",
      "monthByMonth": ["Month 1: ...", "Month 2: ...", "Month 3: ..."],
      "overallTrajectory": "rising | falling | stable",
      "significance": "Strategic significance of this theme"
    }
  ],

  "predictions": [
    {
      "prediction": "A forward-looking prediction based on the quarter's analysis",
      "confidence": 0.7,
      "basis": "Evidence from the quarter supporting this prediction",
      "timeframe": "Next quarter | Next 6 months | Next year"
    }
  ],

  "sentiment": {
    "overall": "bullish | bearish | neutral | mixed",
    "quarterNarrative": "How sentiment evolved across the quarter — was there a turning point?",
    "monthlyProgression": [
      { "month": "Month 1", "sentiment": "bullish | bearish | neutral | mixed" },
      { "month": "Month 2", "sentiment": "bullish | bearish | neutral | mixed" },
      { "month": "Month 3", "sentiment": "bullish | bearish | neutral | mixed" }
    ]
  },

  "topInsights": [
    {
      "insight": "A key strategic insight from the quarter",
      "significance": "Why this matters for the next quarter",
      "sources": ["Monthly Report — January", "Monthly Report — March"]
    }
  ],

  "lookingAhead": "1-2 paragraphs: Strategic outlook for the next quarter. What macro trends will dominate? What catalysts are upcoming? What risks should investors watch?"
}

REQUIREMENTS:
- Return ONLY valid JSON, no markdown
- executiveSummary: 3-4 paragraphs, strategic narrative
- majorThemes: 3-5 themes with month-by-month tracking
- predictions: 2-4 evidence-based predictions with confidence levels
- topInsights: 4-6 insights ranked by strategic importance
- sentiment must track monthly progression
- lookingAhead: 1-2 forward-looking paragraphs`;
