import { NextResponse } from 'next/server';

const POLYGON_KEY = process.env.POLYGON_API_KEY;

type Category = 'metals' | 'equities' | 'crypto' | 'currencies' | 'bonds' | 'commodities';

const INSTRUMENTS: {
  ticker: string;
  polyTicker: string;
  label: string;
  category: Category;
  isCrypto: boolean;
}[] = [
  // METALS
  { ticker: 'GLD',  polyTicker: 'GLD',        label: 'Gold ETF',      category: 'metals',      isCrypto: false },
  { ticker: 'SLV',  polyTicker: 'SLV',        label: 'Silver ETF',    category: 'metals',      isCrypto: false },
  { ticker: 'GDX',  polyTicker: 'GDX',        label: 'Gold Miners',   category: 'metals',      isCrypto: false },
  { ticker: 'GDXJ', polyTicker: 'GDXJ',       label: 'Jr Miners',     category: 'metals',      isCrypto: false },

  // EQUITIES
  { ticker: 'SPY',  polyTicker: 'SPY',        label: 'S&P 500',       category: 'equities',    isCrypto: false },
  { ticker: 'QQQ',  polyTicker: 'QQQ',        label: 'Nasdaq 100',    category: 'equities',    isCrypto: false },
  { ticker: 'DIA',  polyTicker: 'DIA',        label: 'Dow Jones',     category: 'equities',    isCrypto: false },
  { ticker: 'IWM',  polyTicker: 'IWM',        label: 'Russell 2000',  category: 'equities',    isCrypto: false },
  { ticker: 'EFA',  polyTicker: 'EFA',        label: 'Intl Stocks',   category: 'equities',    isCrypto: false },
  { ticker: 'VWO',  polyTicker: 'VWO',        label: 'Emerging Mkts', category: 'equities',    isCrypto: false },

  // CRYPTO - use crypto ETFs instead of direct crypto (free tier doesn't support crypto snapshot)
  { ticker: 'BITO', polyTicker: 'BITO',       label: 'Bitcoin ETF',   category: 'crypto',      isCrypto: false },
  { ticker: 'ETHE', polyTicker: 'ETHE',       label: 'Ethereum ETF',  category: 'crypto',      isCrypto: false },
  { ticker: 'GBTC', polyTicker: 'GBTC',       label: 'Bitcoin Trust', category: 'crypto',      isCrypto: false },
  { ticker: 'MSTR', polyTicker: 'MSTR',       label: 'MicroStrategy', category: 'crypto',      isCrypto: false },

  // CURRENCIES
  { ticker: 'UUP',  polyTicker: 'UUP',        label: 'US Dollar',     category: 'currencies',  isCrypto: false },
  { ticker: 'FXE',  polyTicker: 'FXE',        label: 'Euro',          category: 'currencies',  isCrypto: false },
  { ticker: 'FXB',  polyTicker: 'FXB',        label: 'Brit Pound',    category: 'currencies',  isCrypto: false },
  { ticker: 'FXY',  polyTicker: 'FXY',        label: 'Japanese Yen',  category: 'currencies',  isCrypto: false },

  // BONDS
  { ticker: 'TLT',  polyTicker: 'TLT',        label: '20Y Treasury',  category: 'bonds',       isCrypto: false },
  { ticker: 'IEF',  polyTicker: 'IEF',        label: '10Y Treasury',  category: 'bonds',       isCrypto: false },
  { ticker: 'SHY',  polyTicker: 'SHY',        label: '2Y Treasury',   category: 'bonds',       isCrypto: false },
  { ticker: 'HYG',  polyTicker: 'HYG',        label: 'High Yield',    category: 'bonds',       isCrypto: false },
  { ticker: 'LQD',  polyTicker: 'LQD',        label: 'Corp Bonds',    category: 'bonds',       isCrypto: false },
  { ticker: 'AGG',  polyTicker: 'AGG',        label: 'Bond Index',    category: 'bonds',       isCrypto: false },

  // COMMODITIES
  { ticker: 'USO',  polyTicker: 'USO',        label: 'Oil ETF',       category: 'commodities', isCrypto: false },
  { ticker: 'UNG',  polyTicker: 'UNG',        label: 'Nat Gas ETF',   category: 'commodities', isCrypto: false },
  { ticker: 'DBA',  polyTicker: 'DBA',        label: 'Agriculture',   category: 'commodities', isCrypto: false },
  { ticker: 'DBC',  polyTicker: 'DBC',        label: 'Commodities',   category: 'commodities', isCrypto: false },
];

// Get last trading days worth of data - handles weekends
async function fetchLastClose(polyTicker: string) {
  try {
    // Use range query to get last 7 days - finds most recent trading day
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7); // go back 7 days to ensure we find a trading day

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${polyTicker}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=desc&limit=2&apiKey=${POLYGON_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();

    const results = data?.results;
    if (!results || results.length === 0) return null;

    // Most recent day = results[0], previous day = results[1]
    const latest = results[0];
    const previous = results[1];

    if (!latest?.c) return null;

    // Use previous day's close as open for % change calculation
    // This gives day-over-day change
    const c = latest.c;
    const o = previous?.c ?? latest.o; // prev close or today's open

    return { c, o };
  } catch {
    return null;
  }
}

export async function GET() {
  if (!POLYGON_KEY) {
    return NextResponse.json({ error: 'POLYGON_API_KEY not set', markets: [] }, { status: 500 });
  }

  try {
    const results = await Promise.allSettled(
      INSTRUMENTS.map(inst => fetchLastClose(inst.polyTicker))
    );

    const markets = results
      .map((result, i) => {
        if (result.status === 'rejected' || !result.value) return null;
        const inst = INSTRUMENTS[i];
        if (!inst) return null;
        const { c, o } = result.value;
        if (!c || !o || o === 0) return null;
        const change = c - o;
        const changePct = ((c - o) / o) * 100;
        return {
          ticker: inst.ticker,
          label: inst.label,
          category: inst.category,
          close: c,
          change: parseFloat(change.toFixed(4)),
          changePct: parseFloat(changePct.toFixed(2)),
          up: c >= o,
        };
      })
      .filter(Boolean);

    console.log(`[Markets] Fetched ${markets.length}/${INSTRUMENTS.length} instruments`);

    return NextResponse.json({ markets });
  } catch (error: any) {
    console.error('[Markets]', error.message);
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
