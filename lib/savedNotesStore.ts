import { createHash } from 'crypto';

export type SectionType = 'summary' | 'chapter' | 'quote';

export interface NoteItem {
  noteId: string;
  episodeId: string;
  episodeTitle: string;
  showName: string;
  hosts: string;
  publishedAt: string;
  sourceUrl: string;
  sectionType: SectionType;
  groupKey: string;
  timestamp: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedNotes {
  [episodeId: string]: {
    episodeMeta: {
      episodeId: string;
      episodeTitle: string;
      showName: string;
      hosts: string;
      publishedAt: string;
      sourceUrl: string;
      thumbnail?: string;
    };
    groups: {
      [groupKey: string]: {
        sectionType: SectionType;
        timestamp: string | null;
        notes: NoteItem[];
      };
    };
  };
}

const STORAGE_KEY = 'simplicity:saved_notes';

// Generate stable noteId from components
export function generateNoteId(
  episodeId: string,
  sectionType: SectionType,
  groupKey: string,
  text: string
): string {
  const combined = `${episodeId}:${sectionType}:${groupKey}:${text}`;
  // Use a simple hash for browser compatibility
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `note_${Math.abs(hash).toString(36)}`;
}

class SavedNotesStore {
  private notes: Map<string, NoteItem> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notes = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Failed to load saved notes:', error);
    }
  }

  private saveToStorage() {
    try {
      const obj = Object.fromEntries(this.notes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  isSaved(noteId: string): boolean {
    return this.notes.has(noteId);
  }

  toggleSaved(noteItem: NoteItem): boolean {
    const { noteId } = noteItem;
    
    if (this.notes.has(noteId)) {
      this.notes.delete(noteId);
      this.saveToStorage();
      return false;
    } else {
      const now = new Date().toISOString();
      this.notes.set(noteId, {
        ...noteItem,
        createdAt: noteItem.createdAt || now,
        updatedAt: now,
      });
      this.saveToStorage();
      return true;
    }
  }

  listSaved(options?: {
    search?: string;
    filter?: SectionType | 'all';
  }): NoteItem[] {
    let notes = Array.from(this.notes.values());

    // Apply filter
    if (options?.filter && options.filter !== 'all') {
      notes = notes.filter(note => note.sectionType === options.filter);
    }

    // Apply search
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      notes = notes.filter(note =>
        note.text.toLowerCase().includes(searchLower) ||
        note.episodeTitle.toLowerCase().includes(searchLower) ||
        note.groupKey.toLowerCase().includes(searchLower)
      );
    }

    // Sort by most recent first
    notes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return notes;
  }

  groupByEpisodeAndGroupKey(notes: NoteItem[]): GroupedNotes {
    const grouped: GroupedNotes = {};

    for (const note of notes) {
      const { episodeId } = note;

      if (!grouped[episodeId]) {
        grouped[episodeId] = {
          episodeMeta: {
            episodeId: note.episodeId,
            episodeTitle: note.episodeTitle,
            showName: note.showName,
            hosts: note.hosts,
            publishedAt: note.publishedAt,
            sourceUrl: note.sourceUrl,
          },
          groups: {},
        };
      }

      const { groupKey } = note;
      if (!grouped[episodeId].groups[groupKey]) {
        grouped[episodeId].groups[groupKey] = {
          sectionType: note.sectionType,
          timestamp: note.timestamp,
          notes: [],
        };
      }

      grouped[episodeId].groups[groupKey].notes.push(note);
    }

    return grouped;
  }

  getSavedCount(episodeId?: string): number {
    if (episodeId) {
      return Array.from(this.notes.values()).filter(
        note => note.episodeId === episodeId
      ).length;
    }
    return this.notes.size;
  }

  clearAll() {
    this.notes.clear();
    this.saveToStorage();
  }
}

// Singleton instance
export const savedNotesStore = new SavedNotesStore();
