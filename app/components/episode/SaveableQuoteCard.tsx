"use client";

import { useState } from "react";
import { useSavedNotes } from "../../hooks/useSavedNotes";
import { generateNoteId, NoteItem } from "../../lib/savedNotesStore";

interface SaveableQuoteCardProps {
  id: string;
  text: string;
  speaker: string;
  episodeId: string;
  episodeTitle: string;
  showName: string;
  hosts: string;
  publishedAt: string;
  sourceUrl: string;
}

export function SaveableQuoteCard({
  id,
  text,
  speaker,
  episodeId,
  episodeTitle,
  showName,
  hosts,
  publishedAt,
  sourceUrl,
}: SaveableQuoteCardProps) {
  const { isSaved, toggleSaved } = useSavedNotes();
  
  const noteId = generateNoteId(episodeId, 'quote', speaker, text);
  const checked = isSaved(noteId);

  const handleToggle = () => {
    const noteItem: NoteItem = {
      noteId,
      episodeId,
      episodeTitle,
      showName,
      hosts,
      publishedAt,
      sourceUrl,
      sectionType: 'quote',
      groupKey: speaker,
      timestamp: null,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    toggleSaved(noteItem);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
        id={`quote-${id}`}
      />
      <div className="flex-1">
        <p className="text-xs text-gray-900 leading-snug mb-1">
          "{text}"
        </p>
        <p className="text-xs text-gray-600">
          — {speaker}
        </p>
      </div>
    </div>
  );
}
