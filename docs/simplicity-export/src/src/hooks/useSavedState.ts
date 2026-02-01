/**
 * useSavedState Hook
 * 
 * Manages saved/bookmarked items state.
 * Provides consistent save/unsave logic across the application.
 */

import { useState, useCallback } from 'react';

export interface UseSavedStateReturn {
  savedItems: Set<string>;
  toggleSaved: (itemId: string) => void;
  isSaved: (itemId: string) => boolean;
  saveItem: (itemId: string) => void;
  unsaveItem: (itemId: string) => void;
  clearAllSaved: () => void;
}

export function useSavedState(
  initialSaved: Set<string> = new Set()
): UseSavedStateReturn {
  const [savedItems, setSavedItems] = useState<Set<string>>(initialSaved);

  const toggleSaved = useCallback((itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isSaved = useCallback(
    (itemId: string) => savedItems.has(itemId),
    [savedItems]
  );

  const saveItem = useCallback((itemId: string) => {
    setSavedItems((prev) => new Set(prev).add(itemId));
  }, []);

  const unsaveItem = useCallback((itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  const clearAllSaved = useCallback(() => {
    setSavedItems(new Set());
  }, []);

  return {
    savedItems,
    toggleSaved,
    isSaved,
    saveItem,
    unsaveItem,
    clearAllSaved,
  };
}
