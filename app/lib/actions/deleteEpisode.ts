"use server";

import { requireAdmin } from "../auth.js";
import { revalidatePath } from "next/cache";
import { sql } from "../db.js";

/**
 * Delete an episode and all related data (cascade)
 * Requires admin authentication
 */
export async function deleteEpisode(episodeId: string) {
  try {
    await requireAdmin();

    // Delete episode (cascade will handle related records)
    const result = await sql`
      DELETE FROM episodes
      WHERE id = ${episodeId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        error: "Episode not found",
      };
    }

    // Revalidate relevant pages
    revalidatePath("/admin/ops");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Episode deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting episode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete episode",
    };
  }
}

/**
 * Archive an episode (soft delete by setting a flag)
 * For future implementation
 */
export async function archiveEpisode(episodeId: string) {
  try {
    await requireAdmin();

    // For now, just mark in a hypothetical archived_at field
    // In production, you'd add this field to the schema
    return {
      success: false,
      error: "Archive feature not yet implemented - use delete for now",
    };
  } catch (error) {
    console.error("Error archiving episode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to archive episode",
    };
  }
}

/**
 * Get episode deletion impact (what will be deleted)
 */
export async function getEpisodeDeletionImpact(episodeId: string) {
  try {
    await requireAdmin();

    const [impact] = await sql`
      SELECT 
        e.id,
        e.youtube_title,
        (SELECT COUNT(*) FROM episode_summary WHERE episode_id = e.id) as summaries,
        (SELECT COUNT(*) FROM summary_bullets sb 
         JOIN episode_summary es ON sb.summary_id = es.id 
         WHERE es.episode_id = e.id) as bullets,
        (SELECT COUNT(*) FROM transcript_segments_raw WHERE episode_id = e.id) as transcript_segments,
        (SELECT COUNT(*) FROM qc_runs qc 
         JOIN episode_summary es ON qc.summary_id = es.id 
         WHERE es.episode_id = e.id) as qc_runs
      FROM episodes e
      WHERE e.id = ${episodeId}
    `;

    if (!impact) {
      return {
        success: false,
        error: "Episode not found",
      };
    }

    return {
      success: true,
      impact: {
        title: impact.youtube_title,
        summaries: Number(impact.summaries),
        bullets: Number(impact.bullets),
        transcriptSegments: Number(impact.transcript_segments),
        qcRuns: Number(impact.qc_runs),
      },
    };
  } catch (error) {
    console.error("Error getting deletion impact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get deletion impact",
    };
  }
}
