'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface EarningsItem {
  symbol: string;
  date: string;
  hour: string;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
  quarter: number;
  year: number;
}

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple', TSLA: 'Tesla', NVDA: 'Nvidia',
  META: 'Meta', AMZN: 'Amazon', SPY: 'S&P 500 ETF',
  QQQ: 'Nasdaq ETF', DIA: 'Dow ETF',
};

const COMPANY_COLORS: Record<string, string> = {
  AAPL: '#555', TSLA: '#cc0000', NVDA: '#76b900',
  META: '#0866ff', AMZN: '#ff9900', SPY: '#1a73e8',
  QQQ: '#6200ee', DIA: '#0097a7',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });
}

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr + 'T12:00:00') > new Date();
}

export function EarningsTab() {
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEarnings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/earnings');
        const data = await res.json();
        if (data.error && !data.earnings?.length) throw new Error(data.error);
        setEarnings(data.earnings ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  if (loading) return <PanelSkeleton rows={5} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load earnings. Check FINNHUB_API_KEY.</span>
    </div>
  );

  if (earnings.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">
      No upcoming earnings in next 90 days
    </p>
  );

  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground px-1 mb-2">
        Upcoming earnings reports
      </p>

      {earnings.map((item, i) => {
        const upcoming = isUpcoming(item.date);
        const beat = item.epsActual !== null && item.epsEstimate !== null
          ? item.epsActual >= item.epsEstimate : null;

        return (
          <div
            key={`${item.symbol}-${item.date}-${i}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: COMPANY_COLORS[item.symbol] ?? '#666' }}
            >
              {item.symbol}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                {COMPANY_NAMES[item.symbol] ?? item.symbol}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Q{item.quarter} {item.year} ·{' '}
                {item.hour === 'bmo' ? 'Pre-market' : item.hour === 'amc' ? 'After close' : ''}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className={`text-[10px] font-semibold ${
                upcoming ? 'text-blue-600' : 'text-muted-foreground'
              }`}>
                {formatDate(item.date)}
              </p>
              {beat !== null && (
                <div className={`flex items-center justify-end gap-0.5 text-[10px] ${
                  beat ? 'text-green-600' : 'text-red-500'
                }`}>
                  {beat ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {beat ? 'Beat' : 'Miss'}
                </div>
              )}
              {upcoming && item.epsEstimate !== null && (
                <p className="text-[10px] text-muted-foreground">
                  Est. ${item.epsEstimate.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
