import { NextResponse } from 'next/server';

const POLYGON_KEY = process.env.POLYGON_API_KEY;

// Separate stock and crypto tickers with correct Polygon format
const INSTRUMENTS = [
  { ticker: 'SPY',      polygonTicker: 'SPY',       label: 'S&P 500',      type: 'stock' },
  { ticker: 'QQQ',      polygonTicker: 'QQQ',       label: 'Nasdaq',       type: 'stock' },
  { ticker: 'DIA',      polygonTicker: 'DIA',       label: 'Dow Jones',    type: 'stock' },
  { ticker: 'BTC',      polygonTicker: 'X:BTCUSD',  label: 'Bitcoin',      type: 'crypto' },
  { ticker: 'ETH',      polygonTicker: 'X:ETHUSD',  label: 'Ethereum',     type: 'crypto' },
  { ticker: 'GLD',      polygonTicker: 'GLD',       label: 'Gold ETF',     type: 'stock' },
  { ticker: 'TLT',      polygonTicker: 'TLT',       label: '20Y Treasury', type: 'stock' },
];

export async function GET() {
  if (!POLYGON_KEY) {
    return NextResponse.json({ error: 'POLYGON_API_KEY not set', markets: [] }, { status: 500 });
  }

  try {
    const results = await Promise.allSettled(
      INSTRUMENTS.map(inst =>
        fetch(
          `https://api.polygon.io/v2/aggs/ticker/${inst.polygonTicker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`,
          { next: { revalidate: 300 } }
        ).then(r => r.json())
      )
    );

    const markets = results
      .map((result, i) => {
        if (result.status === 'rejected') return null;
        const data = result.value;
        if (!data?.results?.[0]) return null;
        const inst = INSTRUMENTS[i];
        if (!inst) return null;
        const r = data.results[0];
        const change = ((r.c - r.o) / r.o) * 100;
        return {
          ticker: inst.ticker,
          label: inst.label,
          type: inst.type,
          close: r.c,
          open: r.o,
          change: parseFloat(change.toFixed(2)),
        };
      })
      .filter(Boolean);

    return NextResponse.json({ markets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
