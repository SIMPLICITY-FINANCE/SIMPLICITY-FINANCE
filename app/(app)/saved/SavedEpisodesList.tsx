"use client";

import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";
import { Bookmark } from "lucide-react";
import { useSavedEpisodes } from "../../contexts/SavedEpisodesContext.js";

interface SavedEpisode {
  id: string;
  episode_id: string;
  title: string;
  published_at: string;
  video_id: string;
  youtube_channel_title: string;
  saved_at: Date;
}

interface SavedEpisodesListProps {
  initialEpisodes: SavedEpisode[];
}

export function SavedEpisodesList({ initialEpisodes }: SavedEpisodesListProps) {
  const { savedEpisodeIds, removeSavedEpisode, refetchSavedIds } = useSavedEpisodes();
  const [episodes, setEpisodes] = useState<SavedEpisode[]>(initialEpisodes);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refetch saved episodes from API
  const refetchEpisodes = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/saved');
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data);
        setRemovedIds(new Set()); // Clear optimistic removals after fresh data
        console.log('[SavedList] ✅ Refetched', data.length, 'episodes from /api/saved');
        console.log('[SavedList] API episode IDs:', data.map((e: SavedEpisode) => e.episode_id));
      }
    } catch (error) {
      console.error('[SavedList] ❌ Failed to refetch:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refetch on mount
  useEffect(() => {
    refetchEpisodes();
  }, []);

  // Visible = API episodes minus optimistically removed ones
  const visibleEpisodes = episodes.filter(ep => !removedIds.has(ep.episode_id));

  console.log('[SavedList] savedIdsCount=' + savedEpisodeIds.size +
    ' apiEpisodesCount=' + episodes.length +
    ' removedCount=' + removedIds.size +
    ' visibleCount=' + visibleEpisodes.length);
  console.log('[SavedList] savedIds=', Array.from(savedEpisodeIds));
  console.log('[SavedList] apiEpisodeIds=', episodes.map(e => e.episode_id));
  if (savedEpisodeIds.size > 0 && episodes.length === 0) {
    console.log('[SavedList] ❌ MISMATCH: saved ids exist but API returned no episodes. Likely wrong join key or filter.');
  }

  const handleUnsave = async (episodeId: string) => {
    // Optimistic: hide from list immediately
    setRemovedIds(prev => {
      const next = new Set(prev);
      next.add(episodeId);
      return next;
    });
    // Also update context so bookmark icons sync
    removeSavedEpisode(episodeId);

    try {
      const response = await fetch('/api/unsave-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to unsave');
      }
      console.log('[SavedList] ✅ Unsaved', episodeId);
    } catch (error) {
      console.error('[SavedList] ❌ Error unsaving:', error);
      // Revert optimistic removal
      setRemovedIds(prev => {
        const next = new Set(prev);
        next.delete(episodeId);
        return next;
      });
      alert('Failed to remove. Please try again.');
    }
  };

  if (visibleEpisodes.length === 0 && !isRefreshing) {
    return (
      <Card className="p-12 text-center">
        <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg mb-2">No saved episodes yet</p>
        <p className="text-muted-foreground/70 text-sm">
          Click "Save" on any episode to add it here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visibleEpisodes.map((item) => (
        <Card key={item.id} hover className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <a 
                href={`/episode/${item.episode_id}`}
                className="text-lg font-semibold text-foreground hover:text-primary transition-colors block mb-2"
              >
                📄 {item.title}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {item.youtube_channel_title && (
                  <>
                    <span className="flex items-center gap-1">
                      <span>🎙️</span>
                      <span>{item.youtube_channel_title}</span>
                    </span>
                    <span>•</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  <span>📅</span>
                  <span>
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </span>
                <span>•</span>
                <span className="text-muted-foreground/70">
                  Saved {new Date(item.saved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href={`/episode/${item.episode_id}`}>
              <Button variant="primary" size="sm">
                View Episode
              </Button>
            </a>
            <a
              href={`https://www.youtube.com/watch?v=${item.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm">
                Watch on YouTube →
              </Button>
            </a>
            <Button
              onClick={() => handleUnsave(item.episode_id)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
