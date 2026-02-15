'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  image: string | null;
  datetime: number;
  summary: string;
}

function timeAgo(unixTimestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - unixTimestamp;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/news');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setNews(data.news);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []); // fetch once on mount (tab click re-mounts due to key prop)

  if (loading) return <PanelSkeleton rows={4} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load news. Check FINNHUB_API_KEY.</span>
    </div>
  );

  if (news.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-4">No news available</p>
  );

  return (
    <div className="space-y-1">
      {news.map(item => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="flex gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          {/* Source icon / image */}
          <div className="w-8 h-8 rounded bg-muted flex-shrink-0 overflow-hidden mt-0.5">
            {item.image ? (
              <img src={item.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                {item.source?.[0] ?? 'N'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {item.headline}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {item.source} · {timeAgo(item.datetime)}
            </p>
          </div>

          <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );
}
