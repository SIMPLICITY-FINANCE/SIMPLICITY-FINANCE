import { NextResponse } from 'next/server';

const POLYGON_KEY = process.env.POLYGON_API_KEY;

type Category = 'metals' | 'equities' | 'crypto' | 'currencies' | 'bonds' | 'commodities';

const INSTRUMENTS: {
  ticker: string;
  polyTicker: string;
  label: string;
  category: Category;
  type: 'stock' | 'crypto' | 'forex';
}[] = [
  // METALS
  { ticker: 'GLD',      polyTicker: 'GLD',       label: 'Gold',        category: 'metals',      type: 'stock' },
  { ticker: 'SLV',      polyTicker: 'SLV',       label: 'Silver',      category: 'metals',      type: 'stock' },
  { ticker: 'PPLT',     polyTicker: 'PPLT',      label: 'Platinum',    category: 'metals',      type: 'stock' },
  { ticker: 'PALL',     polyTicker: 'PALL',      label: 'Palladium',   category: 'metals',      type: 'stock' },

  // EQUITIES
  { ticker: 'SPY',      polyTicker: 'SPY',       label: 'S&P 500',     category: 'equities',    type: 'stock' },
  { ticker: 'QQQ',      polyTicker: 'QQQ',       label: 'Nasdaq',      category: 'equities',    type: 'stock' },
  { ticker: 'DIA',      polyTicker: 'DIA',       label: 'Dow Jones',   category: 'equities',    type: 'stock' },
  { ticker: 'IWM',      polyTicker: 'IWM',       label: 'Russell 2K',  category: 'equities',    type: 'stock' },
  { ticker: 'VIX',      polyTicker: 'VIX',       label: 'Volatility',  category: 'equities',    type: 'stock' },
  { ticker: 'EFA',      polyTicker: 'EFA',       label: 'Intl Stocks', category: 'equities',    type: 'stock' },

  // CRYPTO
  { ticker: 'BTC',      polyTicker: 'X:BTCUSD',  label: 'Bitcoin',     category: 'crypto',      type: 'crypto' },
  { ticker: 'ETH',      polyTicker: 'X:ETHUSD',  label: 'Ethereum',    category: 'crypto',      type: 'crypto' },
  { ticker: 'SOL',      polyTicker: 'X:SOLUSD',  label: 'Solana',      category: 'crypto',      type: 'crypto' },
  { ticker: 'BNB',      polyTicker: 'X:BNBUSD',  label: 'BNB',         category: 'crypto',      type: 'crypto' },
  { ticker: 'XRP',      polyTicker: 'X:XRPUSD',  label: 'XRP',         category: 'crypto',      type: 'crypto' },
  { ticker: 'DOGE',     polyTicker: 'X:DOGEUSD', label: 'Dogecoin',    category: 'crypto',      type: 'crypto' },

  // CURRENCIES
  { ticker: 'UUP',      polyTicker: 'UUP',       label: 'US Dollar',   category: 'currencies',  type: 'stock' },
  { ticker: 'FXE',      polyTicker: 'FXE',       label: 'EUR/USD',     category: 'currencies',  type: 'stock' },
  { ticker: 'FXB',      polyTicker: 'FXB',       label: 'GBP/USD',     category: 'currencies',  type: 'stock' },
  { ticker: 'FXY',      polyTicker: 'FXY',       label: 'JPY/USD',     category: 'currencies',  type: 'stock' },

  // BONDS
  { ticker: 'TLT',      polyTicker: 'TLT',       label: '20Y Treasury',category: 'bonds',       type: 'stock' },
  { ticker: 'IEF',      polyTicker: 'IEF',       label: '10Y Treasury',category: 'bonds',       type: 'stock' },
  { ticker: 'SHY',      polyTicker: 'SHY',       label: '2Y Treasury', category: 'bonds',       type: 'stock' },
  { ticker: 'HYG',      polyTicker: 'HYG',       label: 'High Yield',  category: 'bonds',       type: 'stock' },

  // COMMODITIES
  { ticker: 'USO',      polyTicker: 'USO',       label: 'Oil (WTI)',   category: 'commodities', type: 'stock' },
  { ticker: 'UNG',      polyTicker: 'UNG',       label: 'Nat. Gas',    category: 'commodities', type: 'stock' },
  { ticker: 'CORN',     polyTicker: 'CORN',      label: 'Corn',        category: 'commodities', type: 'stock' },
  { ticker: 'WEAT',     polyTicker: 'WEAT',      label: 'Wheat',       category: 'commodities', type: 'stock' },
];

async function fetchPrev(polyTicker: string, type: 'stock' | 'crypto' | 'forex') {
  try {
    let url: string;
    if (type === 'crypto') {
      // Use snapshot for crypto - more current
      url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/${polyTicker}?apiKey=${POLYGON_KEY}`;
    } else {
      url = `https://api.polygon.io/v2/aggs/ticker/${polyTicker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`;
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();

    if (type === 'crypto') {
      const t = data?.ticker;
      if (!t) return null;
      const c = t.day?.c ?? t.prevDay?.c;
      const o = t.day?.o ?? t.prevDay?.o;
      if (!c || !o) return null;
      return { c, o };
    } else {
      const r = data?.results?.[0];
      if (!r?.c || !r?.o) return null;
      return { c: r.c, o: r.o };
    }
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
      INSTRUMENTS.map(inst => fetchPrev(inst.polyTicker, inst.type))
    );

    const markets = results
      .map((result, i) => {
        if (result.status === 'rejected' || !result.value) return null;
        const inst = INSTRUMENTS[i];
        if (!inst) return null;
        const { c, o } = result.value;
        const change = c - o;
        const changePct = ((c - o) / o) * 100;
        return {
          ticker: inst.ticker,
          label: inst.label,
          category: inst.category,
          close: c,
          open: o,
          change: parseFloat(change.toFixed(3)),
          changePct: parseFloat(changePct.toFixed(2)),
          up: c >= o,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ markets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
