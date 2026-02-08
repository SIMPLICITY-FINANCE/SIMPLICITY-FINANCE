"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

interface SaveButtonProps {
  episodeId: string;
  initialSaved: boolean;
  size?: number;
  onToggle?: (saved: boolean) => void;
}

export function SaveButton({ episodeId, initialSaved, size = 16, onToggle }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    if (initialSaved !== isSaved) {
      console.log('[SaveButton]', episodeId, 'syncing state:', initialSaved);
      setIsSaved(initialSaved);
    }
  }, [initialSaved, episodeId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isPending) return;

    const previousState = isSaved;
    const newState = !isSaved;

    console.log('[SaveButton]', episodeId, 'toggling from', previousState, 'to', newState);

    // Optimistic update
    setIsSaved(newState);
    setIsPending(true);
    onToggle?.(newState);

    try {
      const endpoint = newState ? '/api/save-episode' : '/api/unsave-episode';
      console.log('[SaveButton] Calling', endpoint, 'for', episodeId);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update saved status');
      }

      console.log('[SaveButton]', episodeId, 'API success:', data);
    } catch (error) {
      console.error('[SaveButton]', episodeId, 'Error:', error);
      // Revert on error
      setIsSaved(previousState);
      onToggle?.(previousState);
      
      alert(error instanceof Error ? error.message : 'Failed to update. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
    console.log('[SaveButton] Render:', episodeId, 'saved=', isSaved, 'initialSaved=', initialSaved);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
      aria-label={isSaved ? "Unsave" : "Save"}
      title={isSaved ? "Unsave" : "Save"}
    >
      <Bookmark
        size={size}
        className={isSaved ? "text-blue-600 fill-blue-600" : "text-gray-600"}
      />
    </button>
  );
}
