/**
 * Feed Helper Functions
 * Extract preview data from episode summary JSON for feed cards
 */

import type { Summary } from "../../schemas/summary.schema";

export interface SummaryPreview {
  bullets: string[];
  quoteCount: number;
  sections: string[];
}

/**
 * Extract 2-4 key bullets from summary JSON for feed preview
 * Prioritizes bullets from first sections with highest confidence
 */
export function extractSummaryPreview(summary: Summary, maxBullets: number = 4): SummaryPreview {
  const bullets: string[] = [];
  const sections: string[] = [];
  let quoteCount = 0;

  // Extract bullets from sections
  for (const section of summary.sections) {
    sections.push(section.name);
    
    // Sort bullets by confidence (highest first)
    const sortedBullets = [...section.bullets].sort((a, b) => b.confidence - a.confidence);
    
    for (const bullet of sortedBullets) {
      if (bullets.length < maxBullets) {
        bullets.push(bullet.text);
      }
    }
    
    // Stop if we have enough bullets
    if (bullets.length >= maxBullets) break;
  }

  // Count key quotes if present
  const summaryAny = summary as any;
  if (summaryAny.keyQuotes) {
    quoteCount = summaryAny.keyQuotes.length;
  }

  return {
    bullets: bullets.slice(0, maxBullets),
    quoteCount,
    sections,
  };
}

/**
 * Format bullets for display with bullet points
 */
export function formatBulletsForDisplay(bullets: string[]): string {
  return bullets.map(b => `• ${b}`).join('\n');
}

/**
 * Extract topics/tags from summary sections
 */
export function extractTopics(summary: Summary, maxTopics: number = 5): string[] {
  const topics = new Set<string>();
  
  // Use section names as topics
  for (const section of summary.sections) {
    if (topics.size < maxTopics) {
      topics.add(section.name);
    }
  }
  
  return Array.from(topics).slice(0, maxTopics);
}

/**
 * Get participants/hosts from summary if available
 */
export function extractParticipants(summary: Summary): string[] {
  // Check if summary has participants field (future enhancement)
  // For now, return empty array
  return [];
}
