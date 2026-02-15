'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface PredictionMarket {
  id: string;
  question: string;
  probability: number;
  volume: number;
  endDate: string | null;
}

function formatVolume(vol: number): string {
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

function probabilityColor(pct: number): string {
  if (pct >= 70) return 'bg-green-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export function PredictionsTab() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <PanelSkeleton rows={5} />;

  if (error) return (
    <div className="flex flex-col gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Polymarket unavailable</span>
      </div>
      <a
        href="https://polymarket.com"
        target="_blank"
        rel="noreferrer"
        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        View on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );

  if (markets.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">
      No active prediction markets
    </p>
  );

  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground px-1 mb-2">
        Live prediction markets · Polymarket
      </p>

      {markets.map(market => (
        <a
          key={market.id}
          href={`https://polymarket.com/event/${market.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="flex-shrink-0 w-10 h-10 flex flex-col items-center justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${probabilityColor(market.probability)}`}>
              {market.probability}%
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {market.question}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Vol: {formatVolume(market.volume)}
              {market.endDate && (
                <> · Ends {new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
              )}
            </p>

            <div className="mt-1 w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${probabilityColor(market.probability)}`}
                style={{ width: `${market.probability}%` }}
              />
            </div>
          </div>
        </a>
      ))}

      <a
        href="https://polymarket.com"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-blue-600 transition-colors pt-2"
      >
        More on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
