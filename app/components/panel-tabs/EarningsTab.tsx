'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EarningsItem {
  symbol: string;
  name: string;
  date: string;
  hour: string;
  epsEstimate: number | null;
  epsActual: number | null;
  surprise: number | null;
  isPriority: boolean;
  quarter: number;
  year: number;
}

const TICKER_COLORS: Record<string, string> = {
  AAPL: '#555555', TSLA: '#cc0000', NVDA: '#76b900',
  META: '#0866ff', AMZN: '#ff9900', MSFT: '#00a4ef',
  GOOGL: '#4285f4', NFLX: '#e50914', JPM: '#005da6',
  GS: '#6495ed', V: '#1a1f71', MA: '#eb001b',
  AMD: '#ed1c24', INTC: '#0071c5', COIN: '#0052ff',
  PLTR: '#000000',
};

function getTickerColor(ticker: string): string {
  return TICKER_COLORS[ticker] ?? `hsl(${ticker.charCodeAt(0) * 37 % 360}, 55%, 40%)`;
}

// Get the next 5 weekdays for the date strip
function getWeekdays(): { date: Date; dateStr: string; day: string; num: number }[] {
  const days: { date: Date; dateStr: string; day: string; num: number }[] = [];
  const d = new Date();
  while (days.length < 5) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) { // skip weekends
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr) {
        days.push({
          date: new Date(d),
          dateStr,
          day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          num: d.getDate(),
        });
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export function EarningsTab() {
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [grouped, setGrouped] = useState<Record<string, EarningsItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekdays = getWeekdays();
  const [selectedDate, setSelectedDate] = useState(weekdays[0]?.dateStr ?? '');

  useEffect(() => {
    async function fetchEarnings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/earnings');
        const data = await res.json();
        if (data.error && !data.earnings?.length) throw new Error(data.error);
        setEarnings(data.earnings ?? []);
        setGrouped(data.grouped ?? {});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  // Get earnings for selected date
  const dayEarnings = grouped[selectedDate] ?? [];
  // Show priority first, limit to 5 in panel
  const displayEarnings = [...dayEarnings].slice(0, 5);

  if (loading) return <PanelSkeleton rows={3} />;

  if (error) return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>No earnings data. Check FINNHUB_API_KEY.</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">

      {/* Date strip - MON 20, TUE 21 etc */}
      <div className="grid grid-cols-5 gap-1">
        {weekdays.map(({ dateStr, day, num }) => {
          const hasEarnings = (grouped[dateStr]?.length ?? 0) > 0;
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-card border border-border shadow-sm'
                  : 'hover:bg-muted'
              }`}
            >
              <span className={`text-[9px] font-semibold ${
                isSelected ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {day}
              </span>
              <span className={`text-sm font-bold ${
                isSelected ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {num}
              </span>
              {/* Dot indicator if earnings exist */}
              <div className={`w-1 h-1 rounded-full mt-0.5 ${
                hasEarnings ? 'bg-blue-500' : 'bg-transparent'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Earnings for selected day */}
      {displayEarnings.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No earnings scheduled
        </p>
      ) : (
        <div className="space-y-2">
          {displayEarnings.map((item, i) => (
            <div
              key={`${item.symbol}-${i}`}
              className="bg-card border border-border rounded-xl p-3"
            >
              {/* Header row */}
              <div className="flex items-center gap-2.5 mb-2.5">
                {/* Ticker badge */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: getTickerColor(item.symbol) }}
                >
                  {item.symbol.length > 4 ? item.symbol.slice(0, 4) : item.symbol}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.hour === 'bmo' ? 'Before Open' : item.hour === 'amc' ? 'After Close' : 'During Hours'}
                    {' · '}{item.symbol}
                  </p>
                </div>

                {/* Bar chart icon - green if beat, yellow if miss */}
                <div className={`text-sm ${
                  item.surprise !== null
                    ? item.surprise > 0 ? 'text-green-500' : 'text-amber-500'
                    : 'text-muted-foreground'
                }`}>
                  📊
                </div>
              </div>

              {/* Stats row - matches Figma exactly */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    Actual EPS
                  </p>
                  <p className={`text-sm font-bold ${
                    item.epsActual !== null ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {item.epsActual !== null ? `$${item.epsActual.toFixed(2)}` : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    Forecast EPS
                  </p>
                  <p className={`text-sm font-bold ${
                    item.epsEstimate !== null ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {item.epsEstimate !== null ? `$${item.epsEstimate.toFixed(2)}` : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    Surprise
                  </p>
                  <p className={`text-sm font-bold ${
                    item.surprise === null ? 'text-muted-foreground'
                    : item.surprise > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.surprise !== null
                      ? `${item.surprise > 0 ? '+' : ''}${item.surprise}%` 
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Full Calendar link */}
      <Link
        href="/earnings-calendar"
        className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors py-1"
      >
        View Full Calendar <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
