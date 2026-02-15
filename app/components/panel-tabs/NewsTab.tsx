'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle } from 'lucide-react';

type NewsFilter = 'today' | 'trending' | 'breaking';

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
  isBreaking: boolean;
  isToday: boolean;
  alertLevel: 'high' | 'medium' | 'low';
  topicIcon: string;
  summary: string;
}

// Topic icon + color mapping - matches Figma coloured icons
const TOPIC_STYLES: Record<string, { bg: string; text: string; symbol: string }> = {
  economy:     { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', symbol: '📊' },
  commodities: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', symbol: '🛢️' },
  crypto:      { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-600 dark:text-blue-400',    symbol: '₿'  },
  markets:     { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-600 dark:text-green-400',  symbol: '📈' },
  tech:        { bg: 'bg-cyan-100 dark:bg-cyan-900/30',    text: 'text-cyan-600 dark:text-cyan-400',    symbol: '⚡' },
  general:     { bg: 'bg-gray-100 dark:bg-gray-800',       text: 'text-gray-600 dark:text-gray-400',    symbol: '📰' },
};

// Alert icon matching Figma - coloured circles on right
function AlertIcon({ level }: { level: 'high' | 'medium' | 'low' }) {
  if (level === 'high') return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
      <span className="text-red-500 text-[10px] font-bold">!</span>
    </div>
  );
  if (level === 'medium') return (
    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-amber-500 flex items-center justify-center">
      <span className="text-amber-500 text-[10px] font-bold">!</span>
    </div>
  );
  return null; // low = no alert icon
}

function timeAgo(unixTimestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - unixTimestamp;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const FILTERS: { id: NewsFilter; label: string }[] = [
  { id: 'today',    label: 'TODAY'    },
  { id: 'trending', label: 'TRENDING' },
  { id: 'breaking', label: 'BREAKING' },
];

export function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('today');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/news');
        const data = await res.json();
        if (data.error && !data.news?.length) throw new Error(data.error);
        setNews(data.news ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Filter based on active tab
  const filtered = news.filter(item => {
    if (activeFilter === 'breaking') return item.isBreaking;
    if (activeFilter === 'today')    return item.isToday;
    if (activeFilter === 'trending') return true; // all, sorted by relevance (already ordered by Finnhub)
    return true;
  }).slice(0, 15);

  if (loading) return <PanelSkeleton rows={4} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load news. Check FINNHUB_API_KEY.</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">

      {/* TODAY / TRENDING / BREAKING tabs - matching Figma */}
      <div className="grid grid-cols-3 gap-1">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-[11px] font-bold tracking-wide transition-colors ${
              activeFilter === id
                ? 'bg-card border border-border text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {/* Icon per filter */}
            <span className="text-base">
              {id === 'today'    ? '📰' : 
               id === 'trending' ? '📈' : 
               '⚡'}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* News list */}
      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          {activeFilter === 'breaking'
            ? 'No breaking news in the last 2 hours'
            : 'No news available'}
        </p>
      ) : (
        <div className="divide-y divide-border">
          {filtered.map(item => {
            const style = TOPIC_STYLES[item.topicIcon] ?? { 
              bg: 'bg-gray-100 dark:bg-gray-800', 
              text: 'text-gray-600 dark:text-gray-400', 
              symbol: '📰' 
            };
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 py-3 hover:bg-muted transition-colors group px-1 -mx-1 rounded-lg"
              >
                {/* Topic icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg}`}>
                  <span className="text-sm">{style.symbol}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.headline}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.source} · {timeAgo(item.datetime)}
                  </p>
                </div>

                {/* Alert icon */}
                <AlertIcon level={item.alertLevel} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
