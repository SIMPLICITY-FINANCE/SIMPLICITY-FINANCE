"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface SavedEpisodesContextType {
  savedEpisodeIds: Set<string>;
  addSavedEpisode: (episodeId: string) => void;
  removeSavedEpisode: (episodeId: string) => void;
  isSaved: (episodeId: string) => boolean;
  refetchSavedIds: () => Promise<void>;
  isLoading: boolean;
}

const SavedEpisodesContext = createContext<SavedEpisodesContextType | undefined>(undefined);

export function SavedEpisodesProvider({ 
  children, 
  initialSavedIds = [] 
}: { 
  children: ReactNode;
  initialSavedIds?: string[];
}) {
  const [savedEpisodeIds, setSavedEpisodeIds] = useState<Set<string>>(
    new Set(initialSavedIds)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[SavedContext] Initialized with', initialSavedIds.length, 'IDs:', initialSavedIds.slice(0, 10));
  }, []);

  const refetchSavedIds = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saved/ids');
      if (response.ok) {
        const data = await response.json();
        const newSet = new Set<string>(data.ids as string[]);
        console.log('[SavedContext] Refetched', data.ids.length, 'IDs from API');
        console.log('[SavedContext] IDs:', Array.from(newSet).slice(0, 10));
        setSavedEpisodeIds(newSet);
      }
    } catch (error) {
      console.error('[SavedContext] Failed to refetch IDs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSavedEpisode = useCallback((episodeId: string) => {
    console.log('[SavedContext] Adding episode:', episodeId);
    setSavedEpisodeIds(prev => {
      const next = new Set(prev);
      next.add(episodeId);
      console.log('[SavedContext] New set size:', next.size, 'Contains:', next.has(episodeId));
      return next;
    });
  }, []);

  const removeSavedEpisode = useCallback((episodeId: string) => {
    console.log('[SavedContext] Removing episode:', episodeId);
    setSavedEpisodeIds(prev => {
      const next = new Set(prev);
      next.delete(episodeId);
      console.log('[SavedContext] New set size:', next.size, 'Contains:', next.has(episodeId));
      return next;
    });
  }, []);

  const isSaved = useCallback((episodeId: string) => {
    const saved = savedEpisodeIds.has(episodeId);
    if (process.env.NODE_ENV === 'development') {
      // Only log occasionally to avoid spam
      if (Math.random() < 0.01) {
        console.log('[SavedContext] isSaved check:', episodeId, '=', saved);
      }
    }
    return saved;
  }, [savedEpisodeIds]);

  return (
    <SavedEpisodesContext.Provider value={{ 
      savedEpisodeIds, 
      addSavedEpisode, 
      removeSavedEpisode, 
      isSaved,
      refetchSavedIds,
      isLoading
    }}>
      {children}
    </SavedEpisodesContext.Provider>
  );
}

export function useSavedEpisodes() {
  const context = useContext(SavedEpisodesContext);
  if (!context) {
    throw new Error("useSavedEpisodes must be used within SavedEpisodesProvider");
  }
  return context;
}
