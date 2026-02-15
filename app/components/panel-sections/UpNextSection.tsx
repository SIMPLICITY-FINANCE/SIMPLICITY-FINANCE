'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Episode {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  published_at: string;
  show_name: string | null;
  show_slug: string | null;
  show_thumbnail: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric'
  });
}

export function UpNextSection() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/panel/up-next')
      .then(r => r.json())
      .then(data => setEpisodes(data.episodes ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3 p-4 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="flex gap-3">
          <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">⏱️</span>
        <h3 className="text-sm font-semibold text-gray-900">Up Next</h3>
      </div>

      <div className="space-y-2">
        {episodes.map(ep => (
          <Link
            key={ep.id}
            href={`/episode/${ep.slug}`}
            className="flex gap-3 p-2.5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
              {(ep.thumbnail_url || ep.show_thumbnail) ? (
                <img
                  src={ep.thumbnail_url || ep.show_thumbnail!}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🎙️</div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug mb-1">
                {ep.title}
              </p>
              {ep.show_name && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span>🎙️</span>
                  <span>{ep.show_name}</span>
                </p>
              )}
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <span>📅</span>
                <span>{formatDate(ep.published_at)}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <button className="w-full text-xs text-muted-foreground hover:text-foreground mt-3 py-2 transition-colors">
        Show More ↓
      </button>
    </div>
  );
}
