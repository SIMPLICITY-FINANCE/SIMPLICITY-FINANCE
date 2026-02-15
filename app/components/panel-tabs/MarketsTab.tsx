'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface MarketItem {
  ticker: string;
  label: string;
  type: string;
  close: number;
  change: number;
}

export function MarketsTab() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkets() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/markets');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMarkets(data.markets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMarkets();
  }, []);

  if (loading) return <PanelSkeleton rows={6} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load markets. Check POLYGON_API_KEY.</span>
    </div>
  );

  return (
    <div className="space-y-1">
      {markets.map(item => (
        <div
          key={item.ticker}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {/* Left: ticker + name */}
          <div>
            <p className="text-xs font-bold text-foreground">{item.ticker}</p>
            <p className="text-[10px] text-muted-foreground">
              {item.label}
            </p>
          </div>

          {/* Right: price + change */}
          <div className="text-right">
            <p className="text-xs font-semibold text-foreground">
              ${item.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center justify-end gap-0.5 text-[10px] font-medium ${
              item.change >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {item.change >= 0
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {item.change >= 0 ? '+' : ''}{item.change}%
            </div>
          </div>
        </div>
      ))}

      <p className="text-[10px] text-muted-foreground text-center pt-2">
        Previous close · Click tab to refresh
      </p>
    </div>
  );
}
