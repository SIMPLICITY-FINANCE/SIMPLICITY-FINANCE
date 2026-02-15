import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

// Priority tickers to show first if present
const PRIORITY_TICKERS = new Set([
  'AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'MSFT', 'GOOGL', 'NFLX',
  'SPY', 'QQQ', 'DIA', 'JPM', 'GS', 'V', 'AMD', 'INTC'
]);

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set', earnings: [] }, { status: 500 });
  }

  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    // Only look 2 weeks ahead — more likely to have data on free tier
    const futureStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const url = `https://finnhub.io/api/v1/calendar/earnings?from=${todayStr}&to=${futureStr}&token=${FINNHUB_KEY}`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Finnhub returned ${res.status}`);
    }

    const data = await res.json();
    
    // Log what we got for debugging
    console.log('[Earnings] Raw count:', data?.earningsCalendar?.length ?? 0);

    const allEarnings = data.earningsCalendar ?? [];

    if (allEarnings.length === 0) {
      // Finnhub free tier may not support earnings calendar
      // Return a helpful message instead of silent empty state
      return NextResponse.json({ 
        earnings: [], 
        message: 'No earnings data available on current plan'
      });
    }

    // Sort: priority tickers first, then by date
    const sorted = allEarnings
      .filter((e: any) => e.symbol && e.date)
      .sort((a: any, b: any) => {
        const aPriority = PRIORITY_TICKERS.has(a.symbol) ? 0 : 1;
        const bPriority = PRIORITY_TICKERS.has(b.symbol) ? 0 : 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 20)
      .map((e: any) => ({
        symbol: e.symbol,
        date: e.date,
        hour: e.hour ?? '',
        epsEstimate: e.epsEstimate ?? null,
        epsActual: e.epsActual ?? null,
        revenueEstimate: e.revenueEstimate ?? null,
        quarter: e.quarter ?? null,
        year: e.year ?? new Date().getFullYear(),
      }));

    return NextResponse.json({ earnings: sorted });
  } catch (error: any) {
    console.error('[Earnings] Error:', error.message);
    return NextResponse.json({ error: error.message, earnings: [] }, { status: 500 });
  }
}
