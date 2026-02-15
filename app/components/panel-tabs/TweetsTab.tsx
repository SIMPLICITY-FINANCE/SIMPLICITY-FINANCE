'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle } from 'lucide-react';

interface FeedItem {
  id: string;
  text: string;
  link: string;
  publishedAt: string;
  source: string;
  handle: string;
  avatar: string;
  color: string;
  textColor: string;
}

function timeAgo(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function TweetsTab() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/tweets');
        const data = await res.json();
        if (data.error && !data.items?.length) throw new Error(data.error);
        setItems(data.items ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  if (loading) return <PanelSkeleton rows={5} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load feeds</span>
    </div>
  );

  if (items.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">No feed items</p>
  );

  return (
    <div className="space-y-1">
      {items.map(item => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
            style={{ backgroundColor: item.color, color: item.textColor }}
          >
            {item.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <p className="text-[10px] font-semibold text-foreground">{item.source}</p>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {timeAgo(item.publishedAt)}
              </span>
            </div>
            <p className="text-xs text-foreground line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors">
              {item.text}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
