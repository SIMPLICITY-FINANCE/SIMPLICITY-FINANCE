import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getEarningsData() {
  try {
    const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_KEY) return {};

    const today = new Date();
    // Get full current month + next month
    const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const to = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString().split('T')[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&token=${FINNHUB_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return {};
    const data = await res.json();

    // Group by date
    const grouped: Record<string, { symbol: string; hour: string; epsEstimate: number | null }[]> = {};
    (data.earningsCalendar ?? []).forEach((e: any) => {
      if (!e.date) return;
      if (!grouped[e.date]) grouped[e.date] = [];
      const dateArray = grouped[e.date];
      if (dateArray) {
        dateArray.push({
          symbol: e.symbol,
          hour: e.hour ?? '',
          epsEstimate: e.epsEstimate ?? null,
        });
      }
    });

    return grouped;
  } catch {
    return {};
  }
}

function CalendarGrid({
  year, month, grouped
}: {
  year: number;
  month: number;
  grouped: Record<string, any[]>;
}) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const TICKER_COLORS: Record<string, string> = {
    AAPL: '#555', TSLA: '#cc0000', NVDA: '#76b900', META: '#0866ff',
    AMZN: '#ff9900', MSFT: '#00a4ef', GOOGL: '#4285f4', NFLX: '#e50914',
    JPM: '#005da6',
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-4">{monthName}</h2>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
        {cells.map((day, i) => {
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
            : null;
          const dayEarnings = dateStr ? (grouped[dateStr] ?? []) : [];
          const isToday = dateStr === todayStr;
          const isWeekend = i % 7 === 0 || i % 7 === 6;

          return (
            <div
              key={i}
              className={`bg-card min-h-[80px] p-1.5 ${
                !day ? 'opacity-30' : ''
              } ${isWeekend && day ? 'bg-muted/30' : ''}`}
            >
              {day && (
                <>
                  {/* Day number */}
                  <div className={`text-xs font-semibold mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : 'text-muted-foreground'
                  }`}>
                    {day}
                  </div>

                  {/* Earnings chips */}
                  <div className="space-y-0.5">
                    {dayEarnings.slice(0, 3).map((e, j) => (
                      <div
                        key={j}
                        className="text-[9px] font-bold text-white px-1 py-0.5 rounded truncate"
                        style={{
                          backgroundColor: TICKER_COLORS[e.symbol]
                            ?? `hsl(${e.symbol.charCodeAt(0) * 37 % 360}, 55%, 40%)` 
                        }}
                        title={`${e.symbol} - ${e.hour === 'bmo' ? 'Pre-market' : 'After close'}`}
                      >
                        {e.symbol}
                      </div>
                    ))}
                    {dayEarnings.length > 3 && (
                      <p className="text-[9px] text-muted-foreground">
                        +{dayEarnings.length - 3} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function EarningsCalendarPage() {
  const grouped = await getEarningsData();
  const today = new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upcoming earnings reports · {Object.values(grouped).flat().length} total
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Beat
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Miss
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Upcoming
          </div>
        </div>
      </div>

      {/* This month */}
      <CalendarGrid
        year={today.getFullYear()}
        month={today.getMonth()}
        grouped={grouped}
      />

      {/* Next month */}
      <CalendarGrid
        year={today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear()}
        month={(today.getMonth() + 1) % 12}
        grouped={grouped}
      />

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No earnings data available</p>
          <p className="text-sm text-muted-foreground mt-1">Check FINNHUB_API_KEY in .env.local</p>
        </div>
      )}
    </div>
  );
}
