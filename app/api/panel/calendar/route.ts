import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set', events: [] }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?token=${FINNHUB_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);

    const data = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

    const events = (data.economicCalendar ?? [])
      .filter((e: any) => {
        const eventDate = new Date(e.time);
        return eventDate >= today && eventDate <= twoWeeksOut;
      })
      .sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(0, 20)
      .map((e: any) => ({
        event: e.event,
        time: e.time,
        country: e.country,
        impact: e.impact,
        actual: e.actual,
        forecast: e.forecast,
        prev: e.prev,
        unit: e.unit,
      }));

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, events: [] }, { status: 500 });
  }
}
