/**
 * useEpisodeFeed Hook
 * 
 * Manages episode feed logic including filtering by view mode,
 * search query, and combining episodes with podcast data.
 */

import { useMemo } from 'react';
import type { Episode, Podcast, EpisodeWithPodcast, ViewMode } from '../types';

export interface UseEpisodeFeedParams {
  episodes: Episode[];
  podcasts: Podcast[];
  viewMode: ViewMode;
  searchQuery?: string;
  followedShows?: Set<string>;
}

export interface UseEpisodeFeedReturn {
  displayedEpisodes: EpisodeWithPodcast[];
  totalCount: number;
  filteredCount: number;
}

export function useEpisodeFeed({
  episodes,
  podcasts,
  viewMode,
  searchQuery = '',
  followedShows = new Set(),
}: UseEpisodeFeedParams): UseEpisodeFeedReturn {
  // Combine episodes with their podcast data
  const episodesWithPodcasts = useMemo<EpisodeWithPodcast[]>(() => {
    return episodes
      .map((episode) => {
        const podcast = podcasts.find((p) => p.id === episode.podcastId);
        return podcast ? { ...episode, podcast } : null;
      })
      .filter((item): item is EpisodeWithPodcast => item !== null);
  }, [episodes, podcasts]);

  // Filter by search query
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return episodesWithPodcasts;

    const query = searchQuery.toLowerCase();
    return episodesWithPodcasts.filter(
      (episode) =>
        episode.title.toLowerCase().includes(query) ||
        episode.summary.toLowerCase().includes(query) ||
        episode.podcast.title.toLowerCase().includes(query) ||
        episode.topics.some((topic) => topic.toLowerCase().includes(query))
    );
  }, [episodesWithPodcasts, searchQuery]);

  // Filter by view mode (all vs followed)
  const displayedEpisodes = useMemo(() => {
    if (viewMode === 'all') return searchFiltered;
    return searchFiltered.filter((episode) =>
      followedShows.has(episode.podcast.id)
    );
  }, [searchFiltered, viewMode, followedShows]);

  return {
    displayedEpisodes,
    totalCount: episodesWithPodcasts.length,
    filteredCount: displayedEpisodes.length,
  };
}
