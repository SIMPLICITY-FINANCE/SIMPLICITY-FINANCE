import { NextResponse } from 'next/server';

const POLYGON_KEY = process.env.POLYGON_API_KEY;

// Key tickers to track
const TICKERS = ['SPY', 'QQQ', 'DIA', 'BTC', 'GLD', 'TLT'];

export async function GET() {
  if (!POLYGON_KEY) {
    return NextResponse.json({ error: 'POLYGON_API_KEY not set' }, { status: 500 });
  }

  try {
    // Fetch previous day's close for each ticker
    const results = await Promise.allSettled(
      TICKERS.map(ticker =>
        fetch(
          `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`,
          { next: { revalidate: 300 } }
        ).then(r => r.json())
      )
    );

    const markets = results
      .map((result, i) => {
        if (result.status === 'rejected' || !result.value?.results?.[0]) return null;
        const r = result.value.results[0];
        const change = ((r.c - r.o) / r.o) * 100;
        return {
          ticker: TICKERS[i],
          close: r.c,
          open: r.o,
          high: r.h,
          low: r.l,
          change: parseFloat(change.toFixed(2)),
          volume: r.v,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ markets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
