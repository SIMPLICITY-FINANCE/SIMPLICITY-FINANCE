import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

const TICKERS = ['AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'SPY', 'QQQ', 'DIA'];

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set', earnings: [] }, { status: 500 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${today}&to=${future}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);

    const data = await res.json();
    
    const earnings = (data.earningsCalendar ?? [])
      .filter((e: any) => TICKERS.includes(e.symbol))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 15)
      .map((e: any) => ({
        symbol: e.symbol,
        date: e.date,
        hour: e.hour,
        epsEstimate: e.epsEstimate,
        epsActual: e.epsActual,
        revenueEstimate: e.revenueEstimate,
        revenueActual: e.revenueActual,
        quarter: e.quarter,
        year: e.year,
      }));

    return NextResponse.json({ earnings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, earnings: [] }, { status: 500 });
  }
}
