/**
 * Weekly Report Prompt Template v1 — Synthesis of Daily Reports
 *
 * Used by GPT-4o to SYNTHESIZE a week's worth of daily reports into a
 * cohesive weekly narrative with theme trajectories, narrative arcs,
 * sentiment evolution, and forward-looking analysis.
 */

export const WEEKLY_REPORT_SYSTEM_PROMPT = `You are a senior financial analyst creating a weekly synthesis report from daily podcast digests.

Your role is to SYNTHESIZE multiple daily reports into a cohesive weekly narrative, identifying patterns, consensus, conflicts, and key insights across the entire week.

KEY PRINCIPLES:
1. CONNECT THE DOTS — find relationships between episodes across days
2. TRACK EVOLUTION — how did narratives shift Monday → Friday?
3. IDENTIFY CONSENSUS — where do multiple sources agree?
4. HIGHLIGHT DEBATES — where do experts disagree?
5. SHOW TRAJECTORIES — what themes rose or fell in prominence?
6. Think like a weekly columnist writing a "Week in Review" feature article.

Your output should feel like premium weekly financial journalism — not a list of daily summaries.`;

export const WEEKLY_REPORT_USER_PROMPT = `Analyze this week's financial podcast coverage ({{WEEK_START}} — {{WEEK_END}}) based on {{DAILY_COUNT}} daily reports covering {{EPISODE_COUNT}} total episodes.

DAILY REPORTS:
{{DAILY_REPORTS_JSON}}

Create a weekly synthesis that tells the story of the week's financial discourse.

Respond with a JSON object matching this EXACT structure:

{
  "executiveSummary": "2-3 paragraphs telling the story of the week. What dominated? How did the narrative evolve from start to end? What was the key takeaway? Write like a weekly column, not a list.",

  "emergingThemes": [
    {
      "theme": "Short theme name (2-4 words)",
      "trajectory": "rising | falling | stable",
      "prominence": 0.8,
      "evolution": "How this theme evolved across the week — did it gain or lose steam?",
      "keyInsights": ["Insight 1 from this theme", "Insight 2"],
      "daysActive": [1, 3, 5]
    }
  ],

  "narrativeArcs": [
    {
      "title": "Story arc title",
      "timeline": ["Monday: Initial development...", "Wednesday: Escalation...", "Friday: Resolution..."],
      "resolution": "How the story resolved or where it stands heading into next week"
    }
  ],

  "sentiment": {
    "overall": "bullish | bearish | neutral | mixed",
    "evolution": "How sentiment shifted across the week — was there a turning point?",
    "weekStart": "Sentiment at the start of the week",
    "weekEnd": "Sentiment at the end of the week"
  },

  "topInsights": [
    {
      "insight": "A key synthesized insight from the week",
      "significance": "Why this matters for investors/markets",
      "sources": ["Daily Report — Mon Feb 3", "Daily Report — Wed Feb 5"]
    }
  ],

  "lookingAhead": "1 paragraph: What to watch next week based on this week's developments. What questions remain unresolved? What events are upcoming?"
}

REQUIREMENTS:
- Return ONLY valid JSON, no markdown
- executiveSummary: 2-3 paragraphs, narrative form
- emergingThemes: 3-6 themes with trajectory tracking
- narrativeArcs: 1-3 story arcs that played out across the week
- topInsights: 4-8 insights ranked by importance
- sentiment must track evolution across the week
- lookingAhead: 1 forward-looking paragraph`;
