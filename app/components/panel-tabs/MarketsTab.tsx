'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, Gem, BarChart2, Bitcoin, DollarSign, Landmark, Package } from 'lucide-react';

type Category = 'metals' | 'equities' | 'crypto' | 'currencies' | 'bonds' | 'commodities';

interface MarketItem {
  ticker: string;
  label: string;
  category: string;
  close: number;
  change: number;
  changePct: number;
  up: boolean;
}

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'metals',      label: 'Metals',      icon: Gem        },
  { id: 'equities',    label: 'Equities',    icon: BarChart2  },
  { id: 'crypto',      label: 'Crypto',      icon: Bitcoin    },
  { id: 'currencies',  label: 'Currencies',  icon: DollarSign },
  { id: 'bonds',       label: 'Bonds',       icon: Landmark   },
  { id: 'commodities', label: 'Commodities', icon: Package    },
];

// Mini sparkline - just a simple SVG line showing up or down trend
function Sparkline({ up }: { up: boolean }) {
  // Simple 3-point sparkline
  const points = up
    ? '0,20 15,12 30,5'   // trending up
    : '0,5  15,12 30,20'; // trending down

  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
      <polyline
        points={points}
        stroke={up ? '#22c55e' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function formatPrice(ticker: string, price: number): string {
  if (ticker === 'BTC') {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  if (['ETH', 'SOL', 'BNB', 'XRP', 'DOGE'].includes(ticker)) {
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatChange(change: number, ticker: string): string {
  const prefix = change >= 0 ? '+' : '';
  if (ticker === 'BTC') return `${prefix}${change.toFixed(0)}`;
  if (['ETH', 'SOL'].includes(ticker)) return `${prefix}${change.toFixed(2)}`;
  return `${prefix}${change.toFixed(3)}`;
}

export function MarketsTab() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('equities');

  useEffect(() => {
    async function fetchMarkets() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/markets');
        const data = await res.json();
        if (data.error && !data.markets?.length) throw new Error(data.error);
        setMarkets(data.markets ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMarkets();
  }, []);

  const filtered = markets.filter(m => m.category === activeCategory);

  if (loading) return <PanelSkeleton rows={6} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load markets. Check POLYGON_API_KEY.</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">

      {/* Category grid - 3x2 matching Figma */}
      <div className="grid grid-cols-3 gap-1">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const isActive = activeCategory === id;
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[10px] font-semibold tracking-wide transition-all border ${
                isActive
                  ? 'bg-card border-amber-400 text-amber-500 shadow-sm'
                  : 'bg-muted border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : ''}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* 2-column market cards - matching Figma */}
      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No data available for {activeCategory}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(item => (
            <div
              key={item.ticker}
              className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1 hover:border-border/80 transition-colors"
            >
              {/* Ticker + sparkline row */}
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold text-foreground">{item.ticker}</p>
                <Sparkline up={item.up} />
              </div>

              {/* Price - large */}
              <p className="text-base font-bold text-foreground leading-none">
                {formatPrice(item.ticker, item.close)}
              </p>

              {/* Label */}
              <p className="text-[10px] text-muted-foreground truncate">{item.label}</p>

              {/* Change row */}
              <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${
                item.up ? 'text-green-500' : 'text-red-500'
              }`}>
                <span>{formatChange(item.change, item.ticker)}</span>
                <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                  item.up
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {item.up ? '▲' : '▼'}{Math.abs(item.changePct).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        Previous close · Click tab to refresh
      </p>
    </div>
  );
}
