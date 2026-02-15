import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Use Finnhub earnings calendar as the primary data source (this IS free)
    const earningsRes = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${today}&to=${future}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const earningsData = earningsRes.ok ? await earningsRes.json() : { earningsCalendar: [] };

    // Convert earnings to calendar events
    const earningsEvents = (earningsData.earningsCalendar ?? [])
      .slice(0, 20)
      .map((e: any) => ({
        event: `${e.symbol} Earnings Report`,
        time: e.date + 'T' + (e.hour === 'bmo' ? '09:00:00' : '16:30:00'),
        country: 'US',
        impact: 2,
        type: 'earnings',
        symbol: e.symbol,
        epsEstimate: e.epsEstimate,
        actual: e.epsActual ? String(e.epsActual) : null,
        forecast: e.epsEstimate ? String(e.epsEstimate) : null,
        prev: null,
        unit: ' EPS',
      }));

    // Add hardcoded upcoming Fed/key economic dates
    const now = new Date();
    const knownEvents = [
      { event: 'FOMC Meeting Decision', month: 1, day: 29, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 3, day: 19, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 5, day: 7,  impact: 3 },
      { event: 'FOMC Meeting Decision', month: 6, day: 18, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 7, day: 30, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 9, day: 17, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 11, day: 5, impact: 3 },
      { event: 'FOMC Meeting Decision', month: 12, day: 10, impact: 3 },
    ].map(e => {
      const date = new Date(now.getFullYear(), e.month - 1, e.day, 14, 0, 0);
      return {
        event: e.event,
        time: date.toISOString(),
        country: 'US',
        impact: e.impact,
        type: 'fed',
        actual: null,
        forecast: null,
        prev: null,
        unit: '',
      };
    }).filter(e => new Date(e.time) >= now)
      .slice(0, 5);

    // Merge and sort
    const allEvents = [...knownEvents, ...earningsEvents]
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 25);

    return NextResponse.json({ events: allEvents });
  } catch (error: any) {
    console.error('[Calendar]', error);
    return NextResponse.json({ error: error.message, events: [] }, { status: 500 });
  }
}
