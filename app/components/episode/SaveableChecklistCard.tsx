"use client";

import { ReactNode } from "react";
import { useSavedNotes } from "../../hooks/useSavedNotes";
import { generateNoteId, NoteItem } from "../../lib/savedNotesStore";

interface SaveableChecklistCardProps {
  icon: ReactNode;
  title: string;
  items: Array<{ id: string; text: string }>;
  episodeId: string;
  episodeTitle: string;
  showName: string;
  hosts: string;
  publishedAt: string;
  sourceUrl: string;
}

export function SaveableChecklistCard({
  icon,
  title,
  items,
  episodeId,
  episodeTitle,
  showName,
  hosts,
  publishedAt,
  sourceUrl,
}: SaveableChecklistCardProps) {
  const { isSaved, toggleSaved } = useSavedNotes();

  const handleToggle = (text: string) => {
    const noteId = generateNoteId(episodeId, 'summary', title, text);
    
    const noteItem: NoteItem = {
      noteId,
      episodeId,
      episodeTitle,
      showName,
      hosts,
      publishedAt,
      sourceUrl,
      sectionType: 'summary',
      groupKey: title,
      timestamp: null,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    toggleSaved(noteItem);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-5 h-5 flex items-center justify-center text-gray-700">
          {icon}
        </div>
        <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => {
          const noteId = generateNoteId(episodeId, 'summary', title, item.text);
          const checked = isSaved(noteId);
          
          return (
            <div key={item.id} className="flex gap-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(item.text)}
                className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
                id={`item-${item.id}`}
              />
              <label
                htmlFor={`item-${item.id}`}
                className="text-[11px] text-gray-900 leading-snug cursor-pointer"
              >
                {item.text}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
