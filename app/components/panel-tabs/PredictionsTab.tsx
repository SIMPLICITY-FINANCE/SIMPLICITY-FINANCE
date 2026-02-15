'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface PredictionMarket {
  id: string;
  question: string;
  yesProb: number;
  noProb: number;
  volume: number;
  volume24h: number;
  endDate: string | null;
  url: string;
}

function formatVolume(vol: number): string {
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
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
      <a href="https://polymarket.com" target="_blank" rel="noreferrer"
        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
        View on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );

  if (markets.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">No active markets</p>
  );

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground px-1 mb-1">
        Live prediction markets · Polymarket
      </p>

      {markets.map(market => (
        <a
          key={market.id}
          href={market.url}
          target="_blank"
          rel="noreferrer"
          className="block p-2.5 rounded-lg hover:bg-muted transition-colors group border border-transparent hover:border-border"
        >
          {/* Question */}
          <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
            {market.question}
          </p>

          {/* YES / NO bar */}
          <div className="mb-1.5">
            <div className="flex rounded-full overflow-hidden h-5 w-full">
              {/* YES side */}
              <div
                className="flex items-center justify-center bg-green-500 text-white text-[10px] font-bold transition-all"
                style={{ width: `${market.yesProb}%` }}
              >
                {market.yesProb >= 20 && `${market.yesProb}%`}
              </div>
              {/* NO side */}
              <div
                className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold transition-all"
                style={{ width: `${market.noProb}%` }}
              >
                {market.noProb >= 20 && `${market.noProb}%`}
              </div>
            </div>

            {/* YES / NO labels */}
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-green-600 font-semibold">
                YES {market.yesProb}%
              </span>
              <span className="text-[10px] text-red-500 font-semibold">
                NO {market.noProb}%
              </span>
            </div>
          </div>

          {/* Volume + end date */}
          <p className="text-[10px] text-muted-foreground">
            Vol: {formatVolume(market.volume)}
            {market.volume24h > 0 && ` · 24h: ${formatVolume(market.volume24h)}`}
            {market.endDate && ` · Ends ${new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </p>
        </a>
      ))}

      <a href="https://polymarket.com" target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-blue-600 transition-colors pt-1">
        More on Polymarket <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
