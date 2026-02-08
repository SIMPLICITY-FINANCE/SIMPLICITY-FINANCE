/**
 * YouTube Data API v3 Integration
 * Handles fetching channel metadata, videos, and resolving handles to channel IDs
 */

import { parseYouTubeUrl, isValidChannelId, isValidVideoId } from './parser.js';

// YouTube API response types
interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YouTubeSearchItem {
  id: {
    videoId?: string;
    channelId?: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt?: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

// Channel metadata interface for our app
export interface ChannelMetadata {
  id: string;
  name: string;
  handle: string | undefined;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
  url: string;
}

// Video metadata interface
export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

/**
 * Make authenticated request to YouTube Data API
 */
async function fetchYouTubeApi(endpoint: string, params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YouTube API key not configured. Please set YOUTUBE_API_KEY environment variable.');
  }

  const searchParams = new URLSearchParams({
    key: apiKey,
    ...params,
  });

  const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${searchParams}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 403) {
      if (errorData.error?.message?.includes('quota')) {
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      throw new Error('YouTube API access forbidden. Check your API key configuration.');
    }
    
    if (response.status === 400) {
      throw new Error(`Invalid YouTube API request: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    throw new Error(`YouTube API error (${response.status}): ${errorData.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get channel by channel ID (UC...)
 */
export async function getChannelById(channelId: string): Promise<ChannelMetadata | null> {
  if (!isValidChannelId(channelId)) {
    throw new Error('Invalid channel ID format');
  }

  const data = await fetchYouTubeApi('channels', {
    part: 'snippet,statistics',
    id: channelId,
  });

  const channel: YouTubeChannel = data.items?.[0];
  
  if (!channel) {
    return null;
  }

  return {
    id: channel.id,
    name: channel.snippet.title,
    handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl}` : undefined,
    description: channel.snippet.description || '',
    thumbnail: channel.snippet.thumbnails.high?.url || 
               channel.snippet.thumbnails.medium?.url || 
               channel.snippet.thumbnails.default?.url || '',
    subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
    videoCount: parseInt(channel.statistics.videoCount) || 0,
    url: `https://www.youtube.com/channel/${channel.id}`,
  };
}

/**
 * Get channel by handle (@username)
 */
export async function getChannelByHandle(handle: string): Promise<ChannelMetadata | null> {
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  
  if (!cleanHandle || cleanHandle.length < 3) {
    throw new Error('Invalid channel handle');
  }

  const data = await fetchYouTubeApi('channels', {
    part: 'snippet,statistics',
    forHandle: cleanHandle,
  });

  const channel: YouTubeChannel = data.items?.[0];
  
  if (!channel) {
    return null;
  }

  return {
    id: channel.id,
    name: channel.snippet.title,
    handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl}` : `@${cleanHandle}`,
    description: channel.snippet.description || '',
    thumbnail: channel.snippet.thumbnails.high?.url || 
               channel.snippet.thumbnails.medium?.url || 
               channel.snippet.thumbnails.default?.url || '',
    subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
    videoCount: parseInt(channel.statistics.videoCount) || 0,
    url: `https://www.youtube.com/channel/${channel.id}`,
  };
}

/**
 * Get video by video ID
 */
export async function getVideoById(videoId: string): Promise<VideoMetadata | null> {
  if (!isValidVideoId(videoId)) {
    throw new Error('Invalid video ID format');
  }

  const data = await fetchYouTubeApi('videos', {
    part: 'snippet',
    id: videoId,
  });

  const video: YouTubeVideo = data.items?.[0];
  
  if (!video) {
    return null;
  }

  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description || '',
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    thumbnail: video.snippet.thumbnails.high?.url || 
               video.snippet.thumbnails.medium?.url || 
               video.snippet.thumbnails.default?.url || '',
    url: `https://www.youtube.com/watch?v=${video.id}`,
  };
}

/**
 * Get latest videos from a channel
 */
export async function getChannelVideos(channelId: string, maxResults: number = 2): Promise<VideoMetadata[]> {
  if (!isValidChannelId(channelId)) {
    throw new Error('Invalid channel ID format');
  }

  const data = await fetchYouTubeApi('search', {
    part: 'snippet',
    channelId: channelId,
    order: 'date',
    type: 'video',
    maxResults: maxResults.toString(),
  });

  const items: YouTubeSearchItem[] = data.items || [];
  
  return items.map(item => {
    const videoId = item.id.videoId;
    if (!videoId) {
      throw new Error('Invalid video ID in search results');
    }
    
    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description || '',
      channelId: channelId, // We know the channel ID from the search
      channelTitle: '', // Not returned in search results
      publishedAt: item.snippet.publishedAt || '',
      thumbnail: item.snippet.thumbnails.high?.url || 
                 item.snippet.thumbnails.medium?.url || 
                 item.snippet.thumbnails.default?.url || '',
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}

/**
 * Resolve any YouTube URL to channel metadata
 * This is the main function that handles all URL types
 */
export async function resolveYouTubeUrl(url: string): Promise<ChannelMetadata> {
  const parsed = parseYouTubeUrl(url);
  
  if (parsed.type === 'invalid') {
    throw new Error('Invalid YouTube URL format');
  }

  // Direct channel ID
  if (parsed.type === 'channel' && parsed.channelId) {
    const channel = await getChannelById(parsed.channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  // Channel handle
  if (parsed.type === 'channel' && parsed.handle) {
    const channel = await getChannelByHandle(parsed.handle);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  // Video URL - extract channel from video metadata
  if (parsed.type === 'video' && parsed.videoId) {
    const video = await getVideoById(parsed.videoId);
    if (!video) {
      throw new Error('Video not found');
    }
    
    const channel = await getChannelById(video.channelId);
    if (!channel) {
      throw new Error('Channel not found for this video');
    }
    
    return channel;
  }

  throw new Error('Unable to resolve YouTube URL to channel');
}

/**
 * Search for channels by query
 */
export async function searchChannels(query: string, maxResults: number = 10): Promise<ChannelMetadata[]> {
  if (!query || query.length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }

  const data = await fetchYouTubeApi('search', {
    part: 'snippet',
    q: query,
    type: 'channel',
    maxResults: maxResults.toString(),
  });

  const items: YouTubeSearchItem[] = data.items || [];
  
  // Get full channel details for each search result
  const channelIds = items.map(item => {
    const channelId = item.id.channelId;
    if (!channelId) {
      throw new Error('Invalid channel ID in search results');
    }
    return channelId;
  });
  const channelsData = await fetchYouTubeApi('channels', {
    part: 'snippet,statistics',
    id: channelIds.join(','),
  });

  const channels: YouTubeChannel[] = channelsData.items || [];
  
  return channels.map(channel => ({
    id: channel.id,
    name: channel.snippet.title,
    handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl}` : undefined,
    description: channel.snippet.description || '',
    thumbnail: channel.snippet.thumbnails.high?.url || 
               channel.snippet.thumbnails.medium?.url || 
               channel.snippet.thumbnails.default?.url || '',
    subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
    videoCount: parseInt(channel.statistics.videoCount) || 0,
    url: `https://www.youtube.com/channel/${channel.id}`,
  }));
}

/**
 * Test YouTube API connectivity
 */
export async function testYouTubeApi(): Promise<{ working: boolean; error?: string }> {
  try {
    // Try to fetch a popular channel to test API
    const data = await fetchYouTubeApi('channels', {
      part: 'snippet',
      id: 'UCBR8-60-B28hp2BmSd4MSOw', // YouTube's official channel
    });
    
    return { 
      working: true,
    };
  } catch (error) {
    return { 
      working: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
