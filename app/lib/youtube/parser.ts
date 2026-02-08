/**
 * YouTube URL Parser - Extracts channel IDs from any YouTube URL format
 * Handles: @handles, channel IDs, video URLs, playlist URLs
 */

export interface ParsedYouTubeUrl {
  type: 'channel' | 'video' | 'playlist' | 'invalid';
  channelId?: string;
  videoId?: string;
  playlistId?: string;
  handle?: string;
}

/**
 * Parse any YouTube URL and extract relevant IDs
 */
export function parseYouTubeUrl(url: string): ParsedYouTubeUrl {
  try {
    // Normalize URL
    const normalizedUrl = url.trim();
    
    // Check if it's a YouTube URL
    if (!normalizedUrl.includes('youtube.com') && !normalizedUrl.includes('youtu.be')) {
      return { type: 'invalid' };
    }

    const urlObj = new URL(normalizedUrl);
    const hostname = urlObj.hostname.replace('www.', '');
    
    // Handle youtu.be short URLs (always videos)
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // Remove leading slash
      if (videoId && videoId.length === 11) {
        return { type: 'video', videoId };
      }
      return { type: 'invalid' };
    }

    // Handle youtube.com URLs
    if (hostname === 'youtube.com') {
      const pathname = urlObj.pathname;
      const params = new URLSearchParams(urlObj.search);
      
      // Channel handle: /@username or /c/username or /user/username
      if (pathname.startsWith('/@')) {
        const handle = pathname.slice(2).split('/')[0];
        if (handle) {
          return { type: 'channel', handle };
        }
      }
      
      // Channel ID: /channel/UC...
      if (pathname.startsWith('/channel/')) {
        const channelId = pathname.slice(9).split('/')[0];
        if (channelId && channelId.startsWith('UC') && channelId.length === 24) {
          return { type: 'channel', channelId };
        }
      }
      
      // Custom channel: /c/customname or /user/username
      if (pathname.startsWith('/c/') || pathname.startsWith('/user/')) {
        const customName = pathname.split('/')[2];
        if (customName) {
          return { type: 'channel', handle: customName };
        }
      }
      
      // Video: /watch?v=VIDEO_ID
      if (pathname === '/watch') {
        const videoId = params.get('v');
        if (videoId && videoId.length === 11) {
          return { type: 'video', videoId };
        }
      }
      
      // Playlist: /playlist?list=PLAYLIST_ID
      if (pathname === '/playlist') {
        const playlistId = params.get('list');
        if (playlistId) {
          return { type: 'playlist', playlistId };
        }
      }
      
      // Channel videos page: /@username/videos or /channel/UC.../videos
      if (pathname.endsWith('/videos')) {
        const basePath = pathname.slice(0, -7); // Remove /videos
        
        if (basePath.startsWith('/@')) {
          const handle = basePath.slice(2);
          if (handle) {
            return { type: 'channel', handle };
          }
        }
        
        if (basePath.startsWith('/channel/')) {
          const channelId = basePath.slice(9);
          if (channelId && channelId.startsWith('UC') && channelId.length === 24) {
            return { type: 'channel', channelId };
          }
        }
      }
      
      // Featured page: /@username/featured or /channel/UC.../featured
      if (pathname.endsWith('/featured')) {
        const basePath = pathname.slice(0, -9); // Remove /featured
        
        if (basePath.startsWith('/@')) {
          const handle = basePath.slice(2);
          if (handle) {
            return { type: 'channel', handle };
          }
        }
        
        if (basePath.startsWith('/channel/')) {
          const channelId = basePath.slice(9);
          if (channelId && channelId.startsWith('UC') && channelId.length === 24) {
            return { type: 'channel', channelId };
          }
        }
      }
    }
    
    return { type: 'invalid' };
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return { type: 'invalid' };
  }
}

/**
 * Validate YouTube channel ID format
 */
export function isValidChannelId(channelId: string): boolean {
  return channelId.startsWith('UC') && channelId.length === 24;
}

/**
 * Validate YouTube video ID format
 */
export function isValidVideoId(videoId: string): boolean {
  return videoId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(videoId);
}

/**
 * Build YouTube channel URL from channel ID
 */
export function buildChannelUrl(channelId: string): string {
  return `https://www.youtube.com/channel/${channelId}`;
}

/**
 * Build YouTube channel URL from handle
 */
export function buildChannelUrlFromHandle(handle: string): string {
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  return `https://www.youtube.com/@${cleanHandle}`;
}

/**
 * Extract channel ID from various YouTube URL patterns
 * This is a convenience function that combines parsing and validation
 */
export function extractChannelId(url: string): string | null {
  const parsed = parseYouTubeUrl(url);
  
  if (parsed.type === 'channel' && parsed.channelId) {
    return parsed.channelId;
  }
  
  if (parsed.type === 'video' && parsed.videoId) {
    // For video URLs, we'll need to fetch the video metadata to get the channel
    // This will be handled in the API layer
    return null;
  }
  
  return null;
}

/**
 * Check if URL is a valid YouTube URL that we can process
 */
export function isYouTubeUrl(url: string): boolean {
  const parsed = parseYouTubeUrl(url);
  return parsed.type !== 'invalid';
}

/**
 * Format subscriber count for display
 */
export function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
