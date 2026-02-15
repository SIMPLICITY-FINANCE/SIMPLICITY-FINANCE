'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, ExternalLink, Globe, TrendingUp, Zap, BarChart2, Flame, Radio } from 'lucide-react';

type Category = 'geo-politics' | 'economy' | 'technology' | 'markets' | 'trending' | 'breaking';

interface PredictionMarket {
  id: string;
  question: string;
  yesProb: number;
  noProb: number;
  volume: number;
  volume24h: number;
  endDate: string | null;
  url: string;
  category: string;
}

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'geo-politics', label: 'Geo-Politics', icon: Globe      },
  { id: 'economy',      label: 'Economy',      icon: BarChart2  },
  { id: 'technology',   label: 'Technology',   icon: Zap        },
  { id: 'markets',      label: 'Markets',      icon: TrendingUp },
  { id: 'trending',     label: 'Trending',     icon: Flame      },
  { id: 'breaking',     label: 'Breaking',     icon: Radio      },
];

export function PredictionsTab() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('economy');

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/predictions');
        const data = await res.json();
        if (data.error && !data.markets?.length) throw new Error(data.error);
        setMarkets(data.markets ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, []);

  const filtered = markets.filter(m => m.category === activeCategory);

  if (loading) return <PanelSkeleton rows={4} />;

  if (error) return (
    <div className="flex flex-col gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Polymarket unavailable</span>
      </div>
      <a href="https://polymarket.com" target="_blank" rel="noreferrer"
        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
        View on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">

      {/* Category filter grid - 3x2 */}
      <div className="grid grid-cols-3 gap-1">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const isActive = activeCategory === id;
          const count = markets.filter(m => m.category === id).length;
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="leading-none text-center">{label}</span>
              {count > 0 && (
                <span className={`text-[9px] ${isActive ? 'text-green-100' : 'text-muted-foreground'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Markets grid - 2 columns */}
      {filtered.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">No {activeCategory} markets right now</p>
          <button
            onClick={() => setActiveCategory('trending')}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            View trending →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.slice(0, 8).map(market => (
            <a
              key={market.id}
              href={market.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2 p-2.5 bg-card border border-border rounded-xl hover:border-blue-300 hover:bg-muted transition-all group"
            >
              {/* Question */}
              <p className="text-[11px] font-medium text-foreground line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors flex-1">
                {market.question}
              </p>

              {/* YES bar */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-semibold text-green-600">Yes</span>
                  <span className="text-[10px] font-bold text-green-600">{market.yesProb}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${market.yesProb}%` }}
                  />
                </div>
              </div>

              {/* NO bar */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-semibold text-red-500">No</span>
                  <span className="text-[10px] font-bold text-red-500">{market.noProb}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${market.noProb}%` }}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <a
        href="https://polymarket.com"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-blue-600 transition-colors"
      >
        More on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
