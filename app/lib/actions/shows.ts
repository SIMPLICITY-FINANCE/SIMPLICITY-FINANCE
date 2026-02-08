"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { resolveYouTubeUrl, getChannelVideos, testYouTubeApi } from "../youtube/api.js";
import { parseYouTubeUrl } from "../youtube/parser.js";
import { redirect } from "next/navigation";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

// Types for our shows
export interface Show {
  id: string;
  name: string;
  description?: string;
  channelId: string;
  channelHandle?: string;
  channelUrl: string;
  channelDescription?: string;
  channelThumbnail?: string;
  subscriberCount?: number;
  sourceType: string;
  status: "enabled" | "disabled";
  ingestionFrequency?: string;
  lastVideosToIngest?: number;
  lastIngestedAt?: string;
  lastCheckedAt?: string;
  createdAt: string;
  updatedAt: string;
  totalEpisodesIngested?: number;
}

export interface AddShowResult {
  success: boolean;
  show?: Show;
  error?: string;
}

export interface ToggleShowResult {
  success: boolean;
  error?: string;
}

export interface DeleteShowResult {
  success: boolean;
  error?: string;
}

export interface UpdateShowResult {
  success: boolean;
  show?: Show;
  error?: string;
}

export interface ShowStats {
  totalEpisodes: number;
  lastIngestedAt?: string;
  lastCheckedAt?: string;
  avgIngestionTime?: number;
}

// ─── ADD SHOW ───────────────────────────────────────────────────────────────

/**
 * Add a new show from YouTube URL
 * Handles all YouTube URL formats and fetches channel metadata
 */
export async function addShow(youtubeUrl: string): Promise<AddShowResult> {
  try {
    // Validate and parse YouTube URL
    const parsed = parseYouTubeUrl(youtubeUrl);
    
    if (parsed.type === 'invalid') {
      return {
        success: false,
        error: 'Invalid YouTube URL. Please enter a valid YouTube channel or video URL.',
      };
    }

    // Resolve URL to channel metadata
    const channelMetadata = await resolveYouTubeUrl(youtubeUrl);

    // Check if channel already exists
    const existingShows = await sql`
      SELECT id, name, channel_id FROM shows WHERE channel_id = ${channelMetadata.id}
    `;

    if (existingShows.length > 0) {
      return {
        success: false,
        error: `This channel is already added as "${existingShows[0]?.name}"`,
      };
    }

    // Create new show
    const [newShow] = await sql`
      INSERT INTO shows (
        name,
        description,
        channel_id,
        channel_handle,
        channel_url,
        channel_description,
        channel_thumbnail,
        subscriber_count,
        source_type,
        status,
        ingestion_frequency,
        last_videos_to_ingest,
        updated_at
      ) VALUES (
        ${channelMetadata.name},
        ${channelMetadata.description},
        ${channelMetadata.id},
        ${channelMetadata.handle || null},
        ${channelMetadata.url},
        ${channelMetadata.description},
        ${channelMetadata.thumbnail},
        ${channelMetadata.subscriberCount},
        'youtube',
        'disabled',
        'every_6_hours',
        2,
        NOW()
      )
      RETURNING *
    `;

    // Revalidate admin pages
    revalidatePath('/admin/shows');

    return {
      success: true,
      show: newShow as unknown as Show,
    };
  } catch (error) {
    console.error('Error adding show:', error);
    
    if (error instanceof Error) {
      // Handle specific YouTube API errors
      if (error.message.includes('quota')) {
        return {
          success: false,
          error: 'YouTube API quota exceeded. Please try again later.',
        };
      }
      
      if (error.message.includes('API key')) {
        return {
          success: false,
          error: 'YouTube API configuration error. Please contact support.',
        };
      }
      
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: 'Channel or video not found. Please check the URL.',
        };
      }
    }

    return {
      success: false,
      error: 'Failed to add show. Please try again.',
    };
  }
}

// ─── TOGGLE SHOW STATUS ───────────────────────────────────────────────────────

/**
 * Enable or disable a show
 */
export async function toggleShowStatus(showId: string, enabled: boolean): Promise<ToggleShowResult> {
  try {
    const result = await sql`
      UPDATE shows 
      SET status = ${enabled ? 'enabled' : 'disabled'}, updated_at = NOW()
      WHERE id = ${showId}
      RETURNING id, name, status
    `;

    if (result.length === 0) {
      return {
        success: false,
        error: 'Show not found',
      };
    }

    // Revalidate admin pages
    revalidatePath('/admin/shows');

    return { success: true };
  } catch (error) {
    console.error('Error toggling show status:', error);
    return {
      success: false,
      error: 'Failed to update show status',
    };
  }
}

// ─── DELETE SHOW ───────────────────────────────────────────────────────────────

/**
 * Delete a show (soft delete by marking as disabled)
 */
export async function deleteShow(showId: string): Promise<DeleteShowResult> {
  try {
    // Check if show exists
    const [show] = await sql`
      SELECT name, channel_id FROM shows WHERE id = ${showId}
    `;

    if (!show) {
      return {
        success: false,
        error: 'Show not found',
      };
    }

    // Delete the show (hard delete for now)
    await sql`
      DELETE FROM shows WHERE id = ${showId}
    `;

    // Revalidate admin pages
    revalidatePath('/admin/shows');

    return { success: true };
  } catch (error) {
    console.error('Error deleting show:', error);
    return {
      success: false,
      error: 'Failed to delete show',
    };
  }
}

// ─── UPDATE SHOW ───────────────────────────────────────────────────────────────

/**
 * Update show settings
 */
export async function updateShow(showId: string, data: Partial<Show>): Promise<UpdateShowResult> {
  try {
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (data.name !== undefined) {
      updateFields.push('name = $' + (updateValues.length + 1));
      updateValues.push(data.name);
    }
    
    if (data.description !== undefined) {
      updateFields.push('description = $' + (updateValues.length + 1));
      updateValues.push(data.description);
    }
    
    if (data.lastVideosToIngest !== undefined) {
      updateFields.push('last_videos_to_ingest = $' + (updateValues.length + 1));
      updateValues.push(data.lastVideosToIngest);
    }
    
    if (data.ingestionFrequency !== undefined) {
      updateFields.push('ingestion_frequency = $' + (updateValues.length + 1));
      updateValues.push(data.ingestionFrequency);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        error: 'No fields to update',
      };
    }

    // Add updated_at
    updateFields.push('updated_at = NOW()');
    updateValues.push(showId);

    const query = `
      UPDATE shows 
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length}
      RETURNING *
    `;

    const [updatedShow] = await sql.unsafe(query, updateValues);

    if (!updatedShow) {
      return {
        success: false,
        error: 'Show not found',
      };
    }

    // Revalidate admin pages
    revalidatePath('/admin/shows');

    return {
      success: true,
      show: updatedShow as unknown as Show,
    };
  } catch (error) {
    console.error('Error updating show:', error);
    return {
      success: false,
      error: 'Failed to update show',
    };
  }
}

// ─── GET SHOW STATS ─────────────────────────────────────────────────────────────

/**
 * Get statistics for a specific show
 */
export async function getShowStats(showId: string): Promise<ShowStats | null> {
  try {
    // Get show info
    const [show] = await sql`
      SELECT total_episodes_ingested, last_ingested_at, last_checked_at, created_at
      FROM shows WHERE id = ${showId}
    `;

    if (!show) {
      return null;
    }

    // Get episode count from episodes table
    const [episodeCount] = await sql`
      SELECT COUNT(*) as count, MAX(created_at) as last_episode
      FROM episodes 
      WHERE youtube_channel_id = (SELECT channel_id FROM shows WHERE id = ${showId})
    `;

    return {
      totalEpisodes: parseInt(episodeCount?.count || '0'),
      lastIngestedAt: show.last_ingested_at || undefined,
      lastCheckedAt: show.last_checked_at || undefined,
    };
  } catch (error) {
    console.error('Error getting show stats:', error);
    return null;
  }
}

// ─── TEST SHOW INGESTION ─────────────────────────────────────────────────────────

/**
 * Test ingestion for a show - fetch latest videos and simulate ingestion
 */
export async function testShowIngestion(showId: string): Promise<{ success: boolean; videos?: any[]; error?: string }> {
  try {
    // Get show info
    const [show] = await sql`
      SELECT channel_id, name, last_videos_to_ingest FROM shows WHERE id = ${showId}
    `;

    if (!show) {
      return {
        success: false,
        error: 'Show not found',
      };
    }

    // Fetch latest videos from channel
    const videos = await getChannelVideos(show.channel_id, show.last_videos_to_ingest || 2);

    // Update last_checked_at
    await sql`
      UPDATE shows SET last_checked_at = NOW() WHERE id = ${showId}
    `;

    // Revalidate admin pages
    revalidatePath('/admin/shows');

    return {
      success: true,
      videos: videos.map(v => ({
        id: v.id,
        title: v.title,
        publishedAt: v.publishedAt,
        url: v.url,
        thumbnail: v.thumbnail,
      })),
    };
  } catch (error) {
    console.error('Error testing show ingestion:', error);
    return {
      success: false,
      error: 'Failed to test ingestion',
    };
  }
}

// ─── GET ALL SHOWS ─────────────────────────────────────────────────────────────

/**
 * Get all shows with their stats
 */
export async function getAllShows(): Promise<Show[]> {
  try {
    const shows = await sql`
      SELECT 
        id,
        name,
        description,
        channel_id,
        channel_handle,
        channel_url,
        channel_description,
        channel_thumbnail,
        subscriber_count,
        source_type,
        status,
        ingestion_frequency,
        last_videos_to_ingest,
        last_ingested_at,
        last_checked_at,
        created_at,
        updated_at,
        total_episodes_ingested
      FROM shows
      ORDER BY created_at DESC
    `;

    return shows as unknown as Show[];
  } catch (error) {
    console.error('Error getting all shows:', error);
    return [];
  }
}

// ─── GET SHOW BY ID ─────────────────────────────────────────────────────────────

/**
 * Get a single show by ID
 */
export async function getShowById(showId: string): Promise<Show | null> {
  try {
    const [show] = await sql`
      SELECT 
        id,
        name,
        description,
        channel_id,
        channel_handle,
        channel_url,
        channel_description,
        channel_thumbnail,
        subscriber_count,
        source_type,
        status,
        ingestion_frequency,
        last_videos_to_ingest,
        last_ingested_at,
        last_checked_at,
        created_at,
        updated_at,
        total_episodes_ingested
      FROM shows
      WHERE id = ${showId}
    `;

    return show ? (show as unknown as Show) : null;
  } catch (error) {
    console.error('Error getting show by ID:', error);
    return null;
  }
}

// ─── VALIDATE YOUTUBE URL ─────────────────────────────────────────────────────────

/**
 * Validate and preview a YouTube URL without creating a show
 */
export async function validateYouTubeUrl(youtubeUrl: string): Promise<{ success: boolean; channel?: any; error?: string }> {
  try {
    const parsed = parseYouTubeUrl(youtubeUrl);
    
    if (parsed.type === 'invalid') {
      return {
        success: false,
        error: 'Invalid YouTube URL format',
      };
    }

    // Try to resolve the URL
    const channelMetadata = await resolveYouTubeUrl(youtubeUrl);

    // Check if already exists
    const existingShows = await sql`
      SELECT id, name FROM shows WHERE channel_id = ${channelMetadata.id}
    `;

    if (existingShows.length > 0) {
      return {
        success: false,
        error: `Channel already exists as "${existingShows[0]?.name}"`,
      };
    }

    return {
      success: true,
      channel: channelMetadata,
    };
  } catch (error) {
    console.error('Error validating YouTube URL:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to validate YouTube URL',
    };
  }
}

// ─── TEST YOUTUBE API ─────────────────────────────────────────────────────────

/**
 * Test YouTube API connectivity
 */
export async function testYouTubeConnectivity(): Promise<{ working: boolean; error?: string }> {
  try {
    return await testYouTubeApi();
  } catch (error) {
    console.error('Error testing YouTube API:', error);
    return {
      working: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
