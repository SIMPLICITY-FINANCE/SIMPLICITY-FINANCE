"use client";

import { useState, useEffect } from 'react';
import { savedNotesStore, NoteItem, SectionType, GroupedNotes } from '../lib/savedNotesStore';

export function useSavedNotes() {
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = savedNotesStore.subscribe(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isSaved: (noteId: string) => savedNotesStore.isSaved(noteId),
    toggleSaved: (noteItem: NoteItem) => savedNotesStore.toggleSaved(noteItem),
    listSaved: (options?: { search?: string; filter?: SectionType | 'all' }) =>
      savedNotesStore.listSaved(options),
    groupByEpisodeAndGroupKey: (notes: NoteItem[]) =>
      savedNotesStore.groupByEpisodeAndGroupKey(notes),
    getSavedCount: (episodeId?: string) => savedNotesStore.getSavedCount(episodeId),
    clearAll: () => savedNotesStore.clearAll(),
  };
}
