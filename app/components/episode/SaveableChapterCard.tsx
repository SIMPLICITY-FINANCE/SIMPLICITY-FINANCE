"use client";

import { Clock } from "lucide-react";
import { useSavedNotes } from "../../../hooks/useSavedNotes";
import { generateNoteId, NoteItem } from "../../../lib/savedNotesStore";

interface SaveableChapterCardProps {
  id: string;
  time: string;
  title: string;
  bullets: Array<{ id: string; text: string }>;
  episodeId: string;
  episodeTitle: string;
  showName: string;
  hosts: string;
  publishedAt: string;
  sourceUrl: string;
}

export function SaveableChapterCard({
  id,
  time,
  title,
  bullets,
  episodeId,
  episodeTitle,
  showName,
  hosts,
  publishedAt,
  sourceUrl,
}: SaveableChapterCardProps) {
  const { isSaved, toggleSaved } = useSavedNotes();
  
  const groupKey = `${time} ${title}`;

  const handleToggle = (text: string) => {
    const noteId = generateNoteId(episodeId, 'chapter', groupKey, text);
    
    const noteItem: NoteItem = {
      noteId,
      episodeId,
      episodeTitle,
      showName,
      hosts,
      publishedAt,
      sourceUrl,
      sectionType: 'chapter',
      groupKey,
      timestamp: time,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    toggleSaved(noteItem);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock size={14} />
          <span className="text-[11px] font-medium">{time}</span>
        </div>
        <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-2.5">
        {bullets.map((bullet) => {
          const noteId = generateNoteId(episodeId, 'chapter', groupKey, bullet.text);
          const checked = isSaved(noteId);
          
          return (
            <div key={bullet.id} className="flex gap-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(bullet.text)}
                className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
                id={`chapter-${id}-bullet-${bullet.id}`}
              />
              <label
                htmlFor={`chapter-${id}-bullet-${bullet.id}`}
                className="text-[11px] text-gray-900 leading-snug cursor-pointer"
              >
                {bullet.text}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
