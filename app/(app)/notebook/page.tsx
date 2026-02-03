"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Mic, User, Calendar, Share2, Download, BookOpen } from "lucide-react";
import { useSavedNotes } from "../../../hooks/useSavedNotes";
import { NoteItem } from "../../../lib/savedNotesStore";

export default function NotebookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "summary" | "chapter" | "quote">("all");
  const [mounted, setMounted] = useState(false);
  
  const { listSaved, groupByEpisodeAndGroupKey, toggleSaved } = useSavedNotes();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const savedNotes = mounted ? listSaved({ search: searchQuery, filter }) : [];
  const groupedNotes = groupByEpisodeAndGroupKey(savedNotes);
  const episodeIds = Object.keys(groupedNotes);

  const handleUntick = (note: NoteItem) => {
    toggleSaved(note);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Notebook</h1>
          <p className="text-xs text-gray-600">
            Your saved highlights and notes from episodes
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All</option>
              <option value="summary">Summary</option>
              <option value="chapter">Chapters</option>
              <option value="quote">Quotes</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Empty State */}
        {episodeIds.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved notes yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Save highlights from episode reports to build your notebook
            </p>
            <a
              href="/dashboard"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Episodes
            </a>
          </div>
        )}

        {/* Saved Notes Feed */}
        {episodeIds.length > 0 && (
          <div className="space-y-4">
            {episodeIds.map((episodeId) => {
              const episodeData = groupedNotes[episodeId];
              if (!episodeData) return null;
              
              const { episodeMeta, groups } = episodeData;
              const groupKeys = Object.keys(groups);

              return (
                <div key={episodeId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Episode Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-1.5 flex-1 min-w-0">
                        <span className="text-sm mt-0.5 flex-shrink-0">📄</span>
                        <h2 className="text-sm font-bold text-gray-900 leading-tight break-words">
                          {episodeMeta.episodeTitle}
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mic size={12} />
                        <span>{episodeMeta.showName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{episodeMeta.hosts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{episodeMeta.publishedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Saved Notes by Group */}
                  <div className="p-4 space-y-4">
                    {groupKeys.map((groupKey) => {
                      const group = groups[groupKey];
                      if (!group) return null;
                      
                      return (
                        <div key={groupKey}>
                          <h3 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            {group.sectionType === 'chapter' && group.timestamp && (
                              <span className="text-gray-600">{group.timestamp}</span>
                            )}
                            {groupKey}
                          </h3>
                          <div className="space-y-2">
                            {group.notes.map((note: NoteItem) => (
                              <div key={note.noteId} className="flex gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={() => handleUntick(note)}
                                  className="mt-0.5 flex-shrink-0 w-3 h-3 rounded border-gray-300"
                                  id={`notebook-${note.noteId}`}
                                />
                                <label
                                  htmlFor={`notebook-${note.noteId}`}
                                  className="text-[10px] text-gray-900 leading-snug cursor-pointer flex-1"
                                >
                                  {note.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
