'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Suggestion {
  id: string;
  host_name: string;
  host_slug: string;
  host_image_url: string | null;
  show_name: string;
}

export function SuggestionsSection() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/panel/suggestions')
      .then(r => r.json())
      .then(data => setSuggestions(data.suggestions ?? []));
  }, []);

  const visible = suggestions.slice(currentIndex, currentIndex + 4);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex + 4 < suggestions.length;

  if (suggestions.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <h3 className="text-sm font-semibold text-gray-900">Suggestions</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 4))}
            disabled={!canPrev}
            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentIndex(i => i + 4)}
            disabled={!canNext}
            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {visible.map(person => (
          <Link
            key={person.id}
            href={`/discover/people/${person.host_slug}`}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 flex-shrink-0">
              {person.host_image_url ? (
                <img
                  src={person.host_image_url}
                  alt={person.host_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                  style={{
                    background: `hsl(${(person.host_name?.charCodeAt(0) ?? 0) * 5 % 360}, 65%, 45%)` 
                  }}
                >
                  {person.host_name?.[0]?.toUpperCase() ?? 'H'}
                </div>
              )}
            </div>

            {/* Name - truncated */}
            <p className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2 w-full">
              {person.host_name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
