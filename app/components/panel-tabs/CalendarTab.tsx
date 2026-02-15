'use client';

import { useEffect, useState } from 'react';
import { PanelSkeleton } from './PanelSkeleton';
import { AlertCircle } from 'lucide-react';

interface CalendarEvent {
  event: string;
  time: string;
  country: string;
  impact: number;
  actual: string | null;
  forecast: string | null;
  prev: string | null;
  unit: string;
}

function formatEventDate(timeStr: string) {
  const date = new Date(timeStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dateLabel = date.toDateString() === today.toDateString() ? 'Today'
    : date.toDateString() === tomorrow.toDateString() ? 'Tomorrow'
    : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return { dateLabel, time };
}

function impactColor(impact: number) {
  if (impact === 3) return 'bg-red-500';
  if (impact === 2) return 'bg-amber-500';
  return 'bg-green-500';
}

function impactLabel(impact: number) {
  if (impact === 3) return 'High';
  if (impact === 2) return 'Med';
  return 'Low';
}

function groupByDate(events: CalendarEvent[]) {
  const groups: Record<string, CalendarEvent[]> = {};
  events.forEach(e => {
    const key = new Date(e.time).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return groups;
}

export function CalendarTab() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/panel/calendar');
        const data = await res.json();
        if (data.error && !data.events?.length) throw new Error(data.error);
        setEvents(data.events ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

  if (loading) return <PanelSkeleton rows={4} />;

  if (error) return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>Failed to load calendar. Check FINNHUB_API_KEY.</span>
    </div>
  );

  if (events.length === 0) return (
    <p className="text-sm text-muted-foreground text-center py-6">
      No economic events in the next 2 weeks
    </p>
  );

  const grouped = groupByDate(events);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([dateKey, dayEvents]) => {
        const { dateLabel } = formatEventDate(dayEvents[0]?.time ?? '');
        return (
          <div key={dateKey}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 px-1">
              {dateLabel}
            </p>

            <div className="space-y-1">
              {dayEvents.map((event, i) => {
                const { time } = formatEventDate(event.time);
                const hasActual = event.actual !== null && event.actual !== '';

                return (
                  <div
                    key={`${dateKey}-${i}`}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${impactColor(event.impact)}`} />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                          {event.event}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {event.country} · {time}
                          <span className={`ml-1.5 text-[9px] font-semibold ${
                            event.impact === 3 ? 'text-red-500' :
                            event.impact === 2 ? 'text-amber-500' : 'text-green-600'
                          }`}>
                            {impactLabel(event.impact)}
                          </span>
                        </p>
                      </div>

                      {(hasActual || event.forecast) && (
                        <div className="text-right flex-shrink-0">
                          {hasActual && (
                            <p className={`text-[10px] font-bold ${
                              event.forecast && parseFloat(event.actual!) > parseFloat(event.forecast)
                                ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {event.actual}{event.unit}
                            </p>
                          )}
                          {event.forecast && (
                            <p className="text-[10px] text-muted-foreground">
                              Est: {event.forecast}{event.unit}
                            </p>
                          )}
                          {event.prev && (
                            <p className="text-[9px] text-muted-foreground">
                              Prev: {event.prev}{event.unit}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
